from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from backend.app.database import get_db
from backend.app import models
from backend.app.services.vector_service import vector_service

router = APIRouter(prefix="/api/search", tags=["Global Categorized Search"])

@router.get("/")
def global_search(
    q: str = Query(..., min_length=1, description="Global search query across all resources"),
    semantic: bool = Query(True, description="Enable semantic vector reranking"),
    limit_per_category: int = 5,
    db: Session = Depends(get_db)
):
    query_term = f"%{q}%"
    q_vec = vector_service.encode(q)

    # 1. Search Research Documents
    doc_query = db.query(models.Document).filter(
        models.Document.status == "APPROVED",
        or_(
            models.Document.title.ilike(query_term),
            models.Document.abstract.ilike(query_term),
            models.Document.topic.ilike(query_term),
            models.Document.authors.ilike(query_term)
        )
    )
    docs = doc_query.limit(limit_per_category * 2).all()
    if not docs and semantic:
        # Fallback to pure semantic search if keyword yielded zero
        all_docs = db.query(models.Document).filter(models.Document.status == "APPROVED").all()
        scored = []
        for d in all_docs:
            d_vec = d.embedding or vector_service.encode(f"{d.title} {d.abstract}")
            sim = vector_service.compute_similarity(q_vec, d_vec)
            scored.append((sim, d))
        scored.sort(key=lambda x: x[0], reverse=True)
        docs = [d for _, d in scored[:limit_per_category]]
    else:
        docs = docs[:limit_per_category]

    doc_results = [
        {
            "id": d.id,
            "title": d.title,
            "doc_type": d.doc_type,
            "year": d.publication_year,
            "state": d.state,
            "topic": d.topic,
            "snippet": d.abstract[:180] + "...",
            "link": f"/repository"
        }
        for d in docs
    ]

    # 2. Search Policies
    pol_query = db.query(models.Policy).filter(
        or_(
            models.Policy.title.ilike(query_term),
            models.Policy.summary.ilike(query_term),
            models.Policy.code.ilike(query_term)
        )
    ).limit(limit_per_category).all()
    policy_results = [
        {
            "id": p.id,
            "title": p.title,
            "code": p.code,
            "ministry": p.ministry_or_dept,
            "year": p.year_enacted,
            "snippet": p.summary[:180] + "...",
            "link": f"/policies"
        }
        for p in pol_query
    ]

    # 3. Search Datasets
    ds_query = db.query(models.Dataset).filter(
        or_(
            models.Dataset.title.ilike(query_term),
            models.Dataset.description.ilike(query_term)
        )
    ).limit(limit_per_category).all()
    dataset_results = [
        {
            "id": ds.id,
            "title": ds.title,
            "source": ds.source,
            "format": ds.format,
            "coverage": ds.geographic_coverage,
            "snippet": ds.description[:180] + "...",
            "link": f"/datasets"
        }
        for ds in ds_query
    ]

    # 4. Search Research Projects
    proj_query = db.query(models.ResearchProject).filter(
        or_(
            models.ResearchProject.title.ilike(query_term),
            models.ResearchProject.description.ilike(query_term),
            models.ResearchProject.topic.ilike(query_term)
        )
    ).limit(limit_per_category).all()
    project_results = [
        {
            "id": pr.id,
            "title": pr.title,
            "lead": pr.lead_name,
            "status": pr.status,
            "region": pr.region,
            "snippet": pr.description[:180] + "...",
            "link": f"/projects"
        }
        for pr in proj_query
    ]

    # 5. Search Regions
    reg_query = db.query(models.Region).filter(
        or_(
            models.Region.name.ilike(query_term),
            models.Region.state_name.ilike(query_term),
            models.Region.code.ilike(query_term)
        )
    ).limit(limit_per_category).all()
    region_results = [
        {
            "id": r.id,
            "code": r.code,
            "name": r.name,
            "type": r.type,
            "link": f"/gis"
        }
        for r in reg_query
    ]

    total_matches = len(doc_results) + len(policy_results) + len(dataset_results) + len(project_results) + len(region_results)

    return {
        "query": q,
        "total_matches": total_matches,
        "categories": {
            "research_documents": doc_results,
            "policies": policy_results,
            "datasets": dataset_results,
            "projects": project_results,
            "regions": region_results
        }
    }
