from typing import Dict, Any

class PolicySimulatorService:
    @staticmethod
    def run_simulation(
        baseline_state: str,
        green_zone_target_pct: float,
        urban_dev_limit_pct: float,
        ag_protection_pct: float,
        infra_investment_cr: float,
        climate_investment_cr: float,
        land_conversion_threshold_pct: float,
        baseline_data: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Executes a transparent, rule-based statistical simulation of land policy parameters.
        Returns baseline vs scenario indicators and multi-sector impact evaluations.
        """
        # Baseline state estimates (defaults if not loaded from region table)
        base = baseline_data or {
            "green_coverage": 18.2,
            "urban_expansion_rate": 4.6,
            "climate_resilience_score": 52.0,
            "infrastructure_demand_score": 64.0,
            "agricultural_land_pct": 53.8,
            "dispute_rate_index": 58.0
        }
        
        b_green = float(base.get("green_coverage", 18.2))
        b_urban = float(base.get("urban_expansion_rate", 4.6))
        b_climate = float(base.get("climate_resilience_score", 52.0))
        b_infra = float(base.get("infrastructure_demand_score", 64.0))
        b_ag = float(base.get("agricultural_land_pct", 53.8))

        # Scenario calculations based on policy leverage and elasticities
        # 1. Green coverage shift
        delta_green = green_zone_target_pct - b_green
        s_green = round(max(5.0, min(65.0, b_green + (delta_green * 0.85) + (climate_investment_cr / 15000.0))), 2)

        # 2. Urban expansion rate
        # Urban dev limit and ag protection compress unbridled sprawl
        sprawl_dampening = (urban_dev_limit_pct * 0.12) + ((ag_protection_pct - 50.0) * 0.05)
        s_urban = round(max(1.2, min(9.0, b_urban - (sprawl_dampening * 0.45) - (land_conversion_threshold_pct * 0.15))), 2)

        # 3. Climate resilience index (0 to 100)
        climate_boost = (s_green - b_green) * 1.4 + (climate_investment_cr / 200.0) - (s_urban * 1.8)
        s_climate = round(max(10.0, min(98.0, b_climate + climate_boost)), 1)

        # 4. Infrastructure demand index (0 to 100)
        infra_pressure = (b_urban - s_urban) * 2.2 + (infra_investment_cr / 250.0)
        s_infra = round(max(20.0, min(95.0, b_infra + infra_pressure * 0.35)), 1)

        # 5. Agricultural land preserved (%)
        ag_retention = (ag_protection_pct - 50.0) * 0.18 - (s_urban * 0.3)
        s_ag = round(max(25.0, min(80.0, b_ag + ag_retention)), 2)

        # Multi-Sector Impact Breakdown
        environmental_impact = {
            "flood_attenuation_delta_pct": round((s_green - b_green) * 1.8, 1),
            "carbon_sequestration_metric_tons_yr": int((s_green * 12400) + (climate_investment_cr * 15)),
            "groundwater_recharge_potential_score": round(min(100.0, 45.0 + (s_green * 1.2) + (s_ag * 0.3)), 1),
            "urban_heat_island_reduction_celsius": round(max(0.2, (s_green - b_green) * 0.18), 2)
        }

        urban_impact = {
            "density_intensification_score": round(min(100.0, 50.0 + (urban_dev_limit_pct * 1.5)), 1),
            "affordable_housing_supply_stress_index": round(max(10.0, min(95.0, 45.0 + (urban_dev_limit_pct * 1.1) - (infra_investment_cr / 400.0))), 1),
            "transit_oriented_development_index": round(min(100.0, 48.0 + (infra_investment_cr / 180.0)), 1),
            "sprawl_containment_efficiency_pct": round(min(96.0, 35.0 + (urban_dev_limit_pct * 2.2) + (land_conversion_threshold_pct * 1.8)), 1)
        }

        infrastructure_impact = {
            "capex_allocation_efficiency": round(min(100.0, 60.0 + (infra_investment_cr / 300.0)), 1),
            "green_utility_load_balancing_pct": round(min(90.0, 30.0 + (s_climate * 0.6)), 1),
            "stormwater_drainage_resilience_delta": round((s_green - b_green) * 1.95, 1),
            "trunk_road_congestion_relief_pct": round(min(45.0, (s_infra * 0.35) - (s_urban * 1.5)), 1)
        }

        socio_economic_impact = {
            "ag_livelihood_stability_score": round(min(100.0, (s_ag * 1.15) + (ag_protection_pct * 0.2)), 1),
            "land_dispute_risk_mitigation_rate": round(min(75.0, 20.0 + (land_conversion_threshold_pct * 4.2)), 1),
            "land_valuation_delta_per_hectare_pct": round(max(-5.0, min(42.0, (infra_investment_cr / 350.0) - (urban_dev_limit_pct * 0.2))), 1),
            "peri_urban_tenure_security_index": round(min(95.0, 48.0 + (ag_protection_pct * 0.35)), 1)
        }

        return {
            "baseline_state": baseline_state,
            "inputs": {
                "green_zone_target_pct": green_zone_target_pct,
                "urban_dev_limit_pct": urban_dev_limit_pct,
                "ag_protection_pct": ag_protection_pct,
                "infra_investment_cr": infra_investment_cr,
                "climate_investment_cr": climate_investment_cr,
                "land_conversion_threshold_pct": land_conversion_threshold_pct
            },
            "comparison": [
                {"metric": "Green Coverage (%)", "baseline": b_green, "scenario": s_green, "delta": round(s_green - b_green, 2), "unit": "%"},
                {"metric": "Urban Expansion Rate (%/yr)", "baseline": b_urban, "scenario": s_urban, "delta": round(s_urban - b_urban, 2), "unit": "%/yr"},
                {"metric": "Climate Resilience Index", "baseline": b_climate, "scenario": s_climate, "delta": round(s_climate - b_climate, 1), "unit": "/100"},
                {"metric": "Infrastructure Demand Index", "baseline": b_infra, "scenario": s_infra, "delta": round(s_infra - b_infra, 1), "unit": "/100"},
                {"metric": "Agricultural Land (%)", "baseline": b_ag, "scenario": s_ag, "delta": round(s_ag - b_ag, 2), "unit": "%"}
            ],
            "impacts": {
                "environmental": environmental_impact,
                "urban": urban_impact,
                "infrastructure": infrastructure_impact,
                "socio_economic": socio_economic_impact
            },
            "disclaimer": "Scenario-based analytical estimates using available prototype/public data. These estimates are generated for comparative policy exploration and do not constitute an official government commitment or guaranteed real-world outcome."
        }

policy_simulator = PolicySimulatorService()
