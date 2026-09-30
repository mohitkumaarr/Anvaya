from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import JSONResponse, PlainTextResponse
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import models, schemas
import json

router = APIRouter(prefix="/api/datasets", tags=["Datasets Catalog"])

@router.get("/", response_model=List[schemas.DatasetOut])
def list_datasets(
    search: Optional[str] = None,
    format_type: Optional[str] = None,
    tag: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Dataset)
    if search:
        query = query.filter(
            models.Dataset.title.ilike(f"%{search}%") | 
            models.Dataset.description.ilike(f"%{search}%")
        )
    if format_type and format_type != "ALL":
        query = query.filter(models.Dataset.format.ilike(f"%{format_type}%"))
    
    datasets = query.all()
    if tag and tag != "ALL":
        datasets = [d for d in datasets if tag.lower() in [t.lower() for t in (d.tags or [])]]
    return datasets

@router.get("/{dataset_id}", response_model=schemas.DatasetOut)
def get_dataset(dataset_id: int, db: Session = Depends(get_db)):
    ds = db.query(models.Dataset).filter(models.Dataset.id == dataset_id).first()
    if not ds:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return ds

@router.get("/{dataset_id}/preview")
def preview_dataset(dataset_id: int, db: Session = Depends(get_db)):
    ds = db.query(models.Dataset).filter(models.Dataset.id == dataset_id).first()
    if not ds:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return {
        "id": ds.id,
        "title": ds.title,
        "variables": ds.variables,
        "sample_rows": ds.sample_data[:25],
        "total_records": ds.record_count,
        "format": ds.format,
        "is_demo": ds.is_demo,
        "data_notice": "Demonstration Data. Clearly designated prototype records for research simulation."
    }

@router.get("/{dataset_id}/download")
def download_dataset(dataset_id: int, format_request: str = "json", db: Session = Depends(get_db)):
    ds = db.query(models.Dataset).filter(models.Dataset.id == dataset_id).first()
    if not ds:
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    if format_request.lower() == "csv":
        # Format sample data as CSV
        if not ds.sample_data:
            return PlainTextResponse("No data available")
        headers = list(ds.sample_data[0].keys())
        csv_lines = [",".join(headers)]
        for row in ds.sample_data:
            csv_lines.append(",".join([str(row.get(h, "")) for h in headers]))
        csv_content = "\n".join(csv_lines)
        return PlainTextResponse(
            content=csv_content,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=dataset_{ds.id}.csv"}
        )
    
    return JSONResponse(
        content={
            "dataset_id": ds.id,
            "title": ds.title,
            "metadata": {
                "source": ds.source,
                "coverage": ds.geographic_coverage,
                "year": ds.publication_year,
                "disclaimer": "Demonstration Data. Calibrated for policy simulation prototype."
            },
            "records": ds.sample_data
        },
        headers={"Content-Disposition": f"attachment; filename=dataset_{ds.id}.json"}
    )
