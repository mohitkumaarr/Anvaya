from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.services.vector_service import vector_service
from backend.app.services.ai_service import ai_service

router = APIRouter(prefix="/api/research", tags=["AI Research Copilot"])

@router.post("/copilot", response_model=schemas.CopilotResponse)
async def ask_copilot(query_data: schemas.CopilotQuery, db: Session = Depends(get_db)):
    user_query = query_data.query.strip()
    if not user_query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    # 1. Vector Search for relevant documents
    query_vec = vector_service.encode(user_query)
    all_docs = db.query(models.Document).filter(models.Document.status == "APPROVED").all()
    
    scored_docs = []
    for d in all_docs:
        doc_vec = d.embedding or vector_service.encode(f"{d.title} {d.abstract}")
        sim = vector_service.compute_similarity(query_vec, doc_vec)
        # Apply state filter if provided
        if query_data.state_filter and query_data.state_filter != "All India" and d.state == query_data.state_filter:
            sim += 0.15
        scored_docs.append((sim, d))
        
    scored_docs.sort(key=lambda x: x[0], reverse=True)
    top_docs = scored_docs[:5]

    retrieved_doc_dicts = []
    for score, d in top_docs:
        retrieved_doc_dicts.append({
            "id": d.id,
            "title": d.title,
            "doc_type": d.doc_type,
            "publication_year": d.publication_year,
            "institution": d.institution,
            "relevance_score": round(score, 3),
            "snippet": d.abstract[:280] + "..."
        })

    # 2. Retrieve relevant policies
    all_policies = db.query(models.Policy).all()
    scored_policies = []
    for p in all_policies:
        p_vec = vector_service.encode(f"{p.title} {p.summary}")
        sim = vector_service.compute_similarity(query_vec, p_vec)
        scored_policies.append((sim, p))
    scored_policies.sort(key=lambda x: x[0], reverse=True)
    
    retrieved_policies = [
        {"id": p.id, "title": p.title, "code": p.code, "ministry": p.ministry_or_dept, "summary": p.summary[:200]}
        for _, p in scored_policies[:3]
    ]

    # 3. Retrieve relevant datasets
    all_datasets = db.query(models.Dataset).all()
    scored_datasets = []
    for ds in all_datasets:
        ds_vec = vector_service.encode(f"{ds.title} {ds.description}")
        sim = vector_service.compute_similarity(query_vec, ds_vec)
        scored_datasets.append((sim, ds))
    scored_datasets.sort(key=lambda x: x[0], reverse=True)
    
    retrieved_datasets = [
        {"id": ds.id, "title": ds.title, "source": ds.source, "format": ds.format, "coverage": ds.geographic_coverage}
        for _, ds in scored_datasets[:3]
    ]

    # 4. Generate AI synthesis (with transparent source attribution)
    response_payload = await ai_service.generate_copilot_response(
        query=user_query,
        retrieved_docs=retrieved_doc_dicts,
        retrieved_policies=retrieved_policies,
        retrieved_datasets=retrieved_datasets,
        region_context={"filter": query_data.state_filter}
    )

    return response_payload
