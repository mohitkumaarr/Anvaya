from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import models, schemas

router = APIRouter(prefix="/api/research-gaps", tags=["Research Gap Finder"])

@router.get("/", response_model=List[schemas.ResearchGapOut])
def list_research_gaps(
    concentration: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.ResearchGap)
    if concentration and concentration != "ALL":
        query = query.filter(models.ResearchGap.research_concentration_level == concentration.upper())
    if category and category != "ALL":
        query = query.filter(models.ResearchGap.category.ilike(f"%{category}%"))
    return query.all()

@router.get("/{gap_id}", response_model=schemas.ResearchGapOut)
def get_research_gap(gap_id: int, db: Session = Depends(get_db)):
    gap = db.query(models.ResearchGap).filter(models.ResearchGap.id == gap_id).first()
    if not gap:
        raise HTTPException(status_code=404, detail="Research gap not found")
    return gap

@router.post("/{gap_id}/create-project", response_model=schemas.ResearchProjectOut)
def create_project_from_gap(gap_id: int, db: Session = Depends(get_db)):
    """Automatically converts an identified research gap into a structured active research project!"""
    gap = db.query(models.ResearchGap).filter(models.ResearchGap.id == gap_id).first()
    if not gap:
        raise HTTPException(status_code=404, detail="Research gap not found")
        
    opp = gap.research_opportunity or {}
    project = models.ResearchProject(
        title=f"National Investigation: {gap.topic}",
        description=opp.get("problem") or f"Collaborative research initiative addressing critical gap in {gap.topic}",
        lead_name="Dr. Ananya Roy (National Institute of Urban Affairs)",
        members=[
            {"name": "Dr. Ananya Roy", "role": "Lead Investigator", "institution": "NIUA"},
            {"name": "Prof. S. K. Sharma", "role": "Geospatial Analyst", "institution": "IIT Roorkee"},
            {"name": "Meera Patel", "role": "Policy Economist", "institution": "NITI Aayog"}
        ],
        status="ACTIVE",
        topic=gap.category or "Peri-Urban Governance",
        region=gap.geographic_gaps[0] if gap.geographic_gaps else "National",
        research_questions=gap.potential_research_questions or opp.get("questions", []),
        tasks=[
            {"id": 1, "title": "Field baseline validation of cadastral anomalies", "status": "IN_PROGRESS", "assignee": "Prof. Sharma"},
            {"id": 2, "title": "Synthesize state-level land acquisition compensation datasets", "status": "TODO", "assignee": "Meera Patel"},
            {"id": 3, "title": "Model ecological buffer scenarios in Policy Lab", "status": "TODO", "assignee": "Dr. Roy"}
        ],
        comments=[
            {"author": "Dr. Roy", "date": "2026-09-28", "text": "Research gap successfully promoted to national project registry. Initial spatial data ingestion started."}
        ],
        findings=[
            "Preliminary spatial audit verifies 38% under-reporting of peri-urban wetland infill.",
            "Panchayat-level conversion approvals lack unified GIS verification hooks."
        ],
        policy_outputs=[
            f"Draft Guidance Note on {gap.topic} for State Revenue Departments."
        ],
        document_ids=[1, 2, 3],
        dataset_ids=[1, 2]
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    # Add notification
    notif = models.Notification(
        title="Research Project Created",
        message=f"New project initialized from research gap: '{gap.topic}'.",
        type="PROJECT",
        link=f"/projects"
    )
    db.add(notif)
    db.commit()

    return project
