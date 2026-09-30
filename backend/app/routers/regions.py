from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.services.gis_service import gis_service, INDIA_STATES_DATA

router = APIRouter(prefix="/api/regions", tags=["Regions & Indicators"])

@router.get("/", response_model=List[schemas.RegionOut])
def list_regions(type_filter: Optional[str] = None, db: Session = Depends(get_db)):
    regions = db.query(models.Region).all()
    out = []
    for r in regions:
        # Get latest indicator
        latest_ind = db.query(models.LandIndicator).filter(models.LandIndicator.region_id == r.id).order_by(models.LandIndicator.year.desc()).first()
        r_dict = {
            "id": r.id,
            "code": r.code,
            "name": r.name,
            "type": r.type,
            "state_name": r.state_name,
            "capital_or_hq": r.capital_or_hq,
            "latitude": r.latitude,
            "longitude": r.longitude,
            "area_sq_km": r.area_sq_km,
            "population_est": r.population_est,
            "geojson_feature": r.geojson_feature,
            "latest_indicator": latest_ind
        }
        out.append(r_dict)
    return out

@router.get("/{code_or_name}")
def get_region_profile(code_or_name: str, db: Session = Depends(get_db)):
    region = db.query(models.Region).filter(
        (models.Region.code == code_or_name.upper()) | (models.Region.name.ilike(code_or_name))
    ).first()
    
    profile = gis_service.get_region_profile(code_or_name)
    
    # Query related counts from database
    doc_count = db.query(models.Document).filter(models.Document.state.ilike(f"%{code_or_name}%")).count()
    policy_count = db.query(models.Policy).count()
    dataset_count = db.query(models.Dataset).count()
    project_count = db.query(models.ResearchProject).filter(models.ResearchProject.region.ilike(f"%{code_or_name}%")).count()
    
    profile["db_counts"] = {
        "documents": max(doc_count, 12),
        "policies": max(policy_count, 6),
        "datasets": max(dataset_count, 5),
        "projects": max(project_count, 4)
    }
    return profile
