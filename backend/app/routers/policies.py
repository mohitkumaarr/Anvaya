from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import models, schemas

router = APIRouter(prefix="/api/policies", tags=["Policies & Policy Comparison"])

@router.get("/", response_model=List[schemas.PolicyOut])
def list_policies(
    scope: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Policy)
    if scope and scope != "ALL":
        query = query.filter(models.Policy.scope == scope)
    if status and status != "ALL":
        query = query.filter(models.Policy.status == status)
    if search:
        query = query.filter(
            models.Policy.title.ilike(f"%{search}%") | 
            models.Policy.summary.ilike(f"%{search}%")
        )
    return query.all()

@router.get("/{policy_id}", response_model=schemas.PolicyOut)
def get_policy(policy_id: int, db: Session = Depends(get_db)):
    pol = db.query(models.Policy).filter(models.Policy.id == policy_id).first()
    if not pol:
        raise HTTPException(status_code=404, detail="Policy not found")
    return pol

@router.post("/compare")
def compare_policies(req: schemas.PolicyCompareRequest, db: Session = Depends(get_db)):
    if not req.policy_ids or len(req.policy_ids) < 2:
        raise HTTPException(status_code=400, detail="Select at least 2 policies to compare")
    
    policies = db.query(models.Policy).filter(models.Policy.id.in_(req.policy_ids)).all()
    if not policies:
        raise HTTPException(status_code=404, detail="No matching policies found")

    comparison_dimensions = [
        "Land-Use Planning Focus",
        "Climate Resilience Focus",
        "Environmental Protection Focus",
        "Digital Governance Focus",
        "Implementation Coverage",
        "Evidence Availability",
        "Geographic Scope",
        "Key Statutory Provisions"
    ]

    policy_profiles = []
    for p in policies:
        policy_profiles.append({
            "id": p.id,
            "code": p.code,
            "title": p.title,
            "ministry": p.ministry_or_dept,
            "year": p.year_enacted,
            "scope": p.scope,
            "status": p.status,
            "evidence_availability": p.evidence_availability,
            "scores": {
                "land_use_planning": p.land_use_planning_focus,
                "climate_resilience": p.climate_resilience_focus,
                "environmental_protection": p.environmental_protection_focus,
                "digital_governance": p.digital_governance_focus,
                "implementation_coverage": p.implementation_coverage_pct
            },
            "key_provisions": p.key_provisions
        })

    # Prepare radar chart / bar chart data
    chart_data = [
        {
            "dimension": "Land-Use Planning",
            **{p.code: p.land_use_planning_focus for p in policies}
        },
        {
            "dimension": "Climate Resilience",
            **{p.code: p.climate_resilience_focus for p in policies}
        },
        {
            "dimension": "Environmental Protection",
            **{p.code: p.environmental_protection_focus for p in policies}
        },
        {
            "dimension": "Digital Governance",
            **{p.code: p.digital_governance_focus for p in policies}
        },
        {
            "dimension": "Implementation Coverage",
            **{p.code: p.implementation_coverage_pct for p in policies}
        }
    ]

    return {
        "dimensions": comparison_dimensions,
        "policies": policy_profiles,
        "chart_data": chart_data,
        "notice": "Factual comparative analysis extracted from statutory notifications and national implementation audits. No arbitrary aggregate scores assigned."
    }
