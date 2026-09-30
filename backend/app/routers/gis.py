from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import models
from backend.app.services.gis_service import gis_service, INDIA_STATES_DATA

router = APIRouter(prefix="/api/gis", tags=["GIS Intelligence"])

@router.get("/layers")
def get_gis_layer(layer: str = Query("land_use", description="Layer name: land_use, agricultural_land, urban_expansion, forest, climate_vulnerability, infrastructure, research_activity")):
    return gis_service.get_geojson_layers(layer_name=layer)

@router.get("/summary")
def get_gis_summary(db: Session = Depends(get_db)):
    """Returns overview statistics across all spatial administrative units."""
    total_states = len(INDIA_STATES_DATA)
    avg_green = sum(s["green_cover_pct"] for s in INDIA_STATES_DATA) / total_states
    avg_expansion = sum(s["urban_expansion_rate"] for s in INDIA_STATES_DATA) / total_states
    avg_ag = sum(s["ag_land_pct"] for s in INDIA_STATES_DATA) / total_states
    avg_cvi = sum(s["climate_vuln"] for s in INDIA_STATES_DATA) / total_states
    
    return {
        "total_monitored_states": total_states,
        "average_green_cover_pct": round(avg_green, 1),
        "average_urban_expansion_rate_pct": round(avg_expansion, 2),
        "average_agricultural_land_pct": round(avg_ag, 1),
        "average_climate_vulnerability_index": round(avg_cvi, 2),
        "high_vulnerability_hotspots": [s["name"] for s in INDIA_STATES_DATA if s["climate_vuln"] > 0.70],
        "rapid_expansion_hotspots": [s["name"] for s in INDIA_STATES_DATA if s["urban_expansion_rate"] > 5.0],
        "data_notice": "Spatial analytics compiled from demonstration GIS layers and public remote sensing records."
    }
