from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.auth import get_current_user
from backend.app.services.brief_generator import brief_generator

router = APIRouter(prefix="/api/policy-briefs", tags=["Policy Briefs"])

@router.post("/generate", response_model=schemas.PolicyBriefOut)
def generate_brief(brief_req: schemas.PolicyBriefCreate, db: Session = Depends(get_db)):
    policy_info = None
    if brief_req.policy_id:
        p = db.query(models.Policy).filter(models.Policy.id == brief_req.policy_id).first()
        if p:
            policy_info = {"id": p.id, "title": p.title, "summary": p.summary}

    dataset_info = None
    if brief_req.dataset_id:
        ds = db.query(models.Dataset).filter(models.Dataset.id == brief_req.dataset_id).first()
        if ds:
            dataset_info = {"id": ds.id, "title": ds.title, "source": ds.source}

    scenario_info = None
    if brief_req.scenario_id:
        sc = db.query(models.PolicyScenario).filter(models.PolicyScenario.id == brief_req.scenario_id).first()
        if sc and sc.simulation_results:
            scenario_info = sc.simulation_results

    generated = brief_generator.generate_policy_brief(
        topic=brief_req.topic,
        region_name=brief_req.region_name,
        policy_info=policy_info,
        dataset_info=dataset_info,
        scenario_info=scenario_info
    )

    # Automatically save generated brief so user can review or export
    brief_obj = models.PolicyBrief(
        title=generated["title"],
        executive_summary=generated["executive_summary"],
        problem_statement=generated["problem_statement"],
        current_evidence=generated["current_evidence"],
        geographic_context=generated["geographic_context"],
        key_findings=generated["key_findings"],
        research_gaps=generated["research_gaps"],
        policy_options=generated["policy_options"],
        scenario_analysis=generated["scenario_analysis"],
        potential_impacts=generated["potential_impacts"],
        implementation_considerations=generated["implementation_considerations"],
        data_sources=generated["data_sources"],
        research_sources=generated["research_sources"],
        topic=brief_req.topic,
        region_name=brief_req.region_name,
        created_by_id=None
    )
    db.add(brief_obj)
    db.commit()
    db.refresh(brief_obj)

    return brief_obj

@router.get("/", response_model=List[schemas.PolicyBriefOut])
def list_policy_briefs(db: Session = Depends(get_db)):
    return db.query(models.PolicyBrief).order_by(models.PolicyBrief.id.desc()).all()

@router.get("/{brief_id}", response_model=schemas.PolicyBriefOut)
def get_policy_brief(brief_id: int, db: Session = Depends(get_db)):
    brief = db.query(models.PolicyBrief).filter(models.PolicyBrief.id == brief_id).first()
    if not brief:
        raise HTTPException(status_code=404, detail="Policy brief not found")
    return brief
