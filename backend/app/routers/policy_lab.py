from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.auth import get_current_user
from backend.app.services.policy_simulator import policy_simulator
from backend.app.services.gis_service import INDIA_STATES_DATA

router = APIRouter(prefix="/api/policy-lab", tags=["Policy Lab Simulator"])

@router.post("/simulate")
def run_scenario_simulation(params: schemas.PolicyScenarioCreate, db: Session = Depends(get_db)):
    """Runs analytical policy scenario calculation."""
    # Find matching baseline state if any
    st = next((s for s in INDIA_STATES_DATA if s["name"].lower() == params.baseline_state.lower()), None)
    baseline_data = None
    if st:
        baseline_data = {
            "green_coverage": st["green_cover_pct"],
            "urban_expansion_rate": st["urban_expansion_rate"],
            "climate_resilience_score": round((1.0 - st["climate_vuln"]) * 100, 1),
            "infrastructure_demand_score": st["infra_score"],
            "agricultural_land_pct": st["ag_land_pct"],
            "dispute_rate_index": round(st["disputes"] / 50.0, 1)
        }

    results = policy_simulator.run_simulation(
        baseline_state=params.baseline_state,
        green_zone_target_pct=params.green_zone_target_pct,
        urban_dev_limit_pct=params.urban_dev_limit_pct,
        ag_protection_pct=params.ag_protection_pct,
        infra_investment_cr=params.infra_investment_cr,
        climate_investment_cr=params.climate_investment_cr,
        land_conversion_threshold_pct=params.land_conversion_threshold_pct,
        baseline_data=baseline_data
    )
    return results

@router.post("/scenarios", response_model=schemas.PolicyScenarioOut)
def save_scenario(
    scenario_in: schemas.PolicyScenarioCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Calculate simulation results before saving
    st = next((s for s in INDIA_STATES_DATA if s["name"].lower() == scenario_in.baseline_state.lower()), None)
    baseline_data = None
    if st:
        baseline_data = {
            "green_coverage": st["green_cover_pct"],
            "urban_expansion_rate": st["urban_expansion_rate"],
            "climate_resilience_score": round((1.0 - st["climate_vuln"]) * 100, 1),
            "infrastructure_demand_score": st["infra_score"],
            "agricultural_land_pct": st["ag_land_pct"]
        }

    sim_results = policy_simulator.run_simulation(
        baseline_state=scenario_in.baseline_state,
        green_zone_target_pct=scenario_in.green_zone_target_pct,
        urban_dev_limit_pct=scenario_in.urban_dev_limit_pct,
        ag_protection_pct=scenario_in.ag_protection_pct,
        infra_investment_cr=scenario_in.infra_investment_cr,
        climate_investment_cr=scenario_in.climate_investment_cr,
        land_conversion_threshold_pct=scenario_in.land_conversion_threshold_pct,
        baseline_data=baseline_data
    )

    scenario = models.PolicyScenario(
        title=scenario_in.title,
        user_id=current_user.id,
        baseline_state=scenario_in.baseline_state,
        baseline_year=2024,
        green_zone_target_pct=scenario_in.green_zone_target_pct,
        urban_dev_limit_pct=scenario_in.urban_dev_limit_pct,
        ag_protection_pct=scenario_in.ag_protection_pct,
        infra_investment_cr=scenario_in.infra_investment_cr,
        climate_investment_cr=scenario_in.climate_investment_cr,
        land_conversion_threshold_pct=scenario_in.land_conversion_threshold_pct,
        simulation_results=sim_results
    )
    db.add(scenario)
    db.commit()
    db.refresh(scenario)

    notif = models.Notification(
        user_id=current_user.id,
        title="Policy Scenario Saved",
        message=f"Simulation scenario '{scenario.title}' logged to analytical repository.",
        type="POLICY",
        link=f"/policy-lab"
    )
    db.add(notif)
    db.commit()

    return scenario

@router.get("/scenarios", response_model=List[schemas.PolicyScenarioOut])
def list_scenarios(db: Session = Depends(get_db)):
    return db.query(models.PolicyScenario).order_by(models.PolicyScenario.id.desc()).all()

@router.get("/scenarios/{scenario_id}", response_model=schemas.PolicyScenarioOut)
def get_scenario(scenario_id: int, db: Session = Depends(get_db)):
    sc = db.query(models.PolicyScenario).filter(models.PolicyScenario.id == scenario_id).first()
    if not sc:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return sc

@router.post("/compare")
def compare_scenarios(scenario_ids: List[int], db: Session = Depends(get_db)):
    if not scenario_ids or len(scenario_ids) < 2:
        raise HTTPException(status_code=400, detail="Provide at least 2 scenario IDs to compare")
    
    scenarios = db.query(models.PolicyScenario).filter(models.PolicyScenario.id.in_(scenario_ids)).all()
    if not scenarios:
        raise HTTPException(status_code=404, detail="No matching scenarios found")

    comparison_matrix = []
    for sc in scenarios:
        res = sc.simulation_results or {}
        comp_metrics = {m["metric"]: m["scenario"] for m in res.get("comparison", [])}
        comparison_matrix.append({
            "id": sc.id,
            "title": sc.title,
            "baseline_state": sc.baseline_state,
            "inputs": {
                "green_zone_target": sc.green_zone_target_pct,
                "urban_dev_limit": sc.urban_dev_limit_pct,
                "ag_protection": sc.ag_protection_pct,
                "infra_investment_cr": sc.infra_investment_cr,
                "climate_investment_cr": sc.climate_investment_cr
            },
            "metrics": comp_metrics,
            "impacts": res.get("impacts", {})
        })

    return {
        "compared_scenarios": comparison_matrix,
        "disclaimer": "Scenario-based analytical estimates using available prototype/public data."
    }
