from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.auth import get_current_user, RequireRole

router = APIRouter(prefix="/api/innovation", tags=["Innovation Hub"])

@router.get("/", response_model=List[schemas.InnovationProjectOut])
def list_innovation_items(
    item_type: Optional[str] = None,
    status: Optional[str] = None,
    theme: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.InnovationProject)
    if item_type and item_type != "ALL":
        query = query.filter(models.InnovationProject.type == item_type)
    if status and status != "ALL":
        query = query.filter(models.InnovationProject.status == status)
    if theme and theme != "ALL":
        query = query.filter(models.InnovationProject.theme.ilike(f"%{theme}%"))
    return query.order_by(models.InnovationProject.id.desc()).all()

@router.get("/{item_id}", response_model=schemas.InnovationProjectOut)
def get_innovation_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.InnovationProject).filter(models.InnovationProject.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Innovation item not found")
    return item

@router.post("/", response_model=schemas.InnovationProjectOut)
def create_innovation_item(
    item_data: dict,
    current_user: models.User = Depends(RequireRole(["RESEARCHER", "POLICYMAKER", "ADMIN"])),
    db: Session = Depends(get_db)
):
    item = models.InnovationProject(
        type=item_data.get("type", "RESEARCH_GRANT"),
        title=item_data.get("title", "National Land Innovation Challenge"),
        organization=item_data.get("organization", current_user.organization),
        theme=item_data.get("theme", "Cadastral Innovation"),
        location=item_data.get("location", "All India"),
        status="OPEN",
        description=item_data.get("description", "Open initiative for geospatial and land policy researchers."),
        deadline=item_data.get("deadline", "2026-12-31"),
        budget_or_prize=item_data.get("budget_or_prize", "INR 25 Lakhs"),
        eligibility=item_data.get("eligibility", "Universities & Research Institutes"),
        contact_email=item_data.get("contact_email", current_user.email),
        related_research=item_data.get("related_research", []),
        related_datasets=item_data.get("related_datasets", [])
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
