from typing import Dict, Any, List

# Standard state centers, bounds and indicator profiles for India
INDIA_STATES_DATA = [
    {
        "code": "MH",
        "name": "Maharashtra",
        "capital": "Mumbai",
        "lat": 19.7515,
        "lng": 75.7139,
        "area_sq_km": 307713,
        "population": 123144223,
        "green_cover_pct": 20.4,
        "urban_expansion_rate": 5.1,
        "ag_land_pct": 56.8,
        "forest_cover_pct": 16.5,
        "climate_vuln": 0.62,
        "infra_score": 79.4,
        "flood_risk": 58.0,
        "disputes": 2840,
        "research_count": 18,
        "policy_count": 9,
        "bbox": [[15.6, 72.6], [22.0, 80.9]]
    },
    {
        "code": "KA",
        "name": "Karnataka",
        "capital": "Bengaluru",
        "lat": 15.3173,
        "lng": 75.7139,
        "area_sq_km": 191791,
        "population": 67562686,
        "green_cover_pct": 22.8,
        "urban_expansion_rate": 6.3,
        "ag_land_pct": 54.1,
        "forest_cover_pct": 20.1,
        "climate_vuln": 0.58,
        "infra_score": 82.1,
        "flood_risk": 52.0,
        "disputes": 2190,
        "research_count": 22,
        "policy_count": 8,
        "bbox": [[11.5, 74.0], [18.5, 78.6]]
    },
    {
        "code": "GJ",
        "name": "Gujarat",
        "capital": "Gandhinagar",
        "lat": 22.2587,
        "lng": 71.1924,
        "area_sq_km": 196024,
        "population": 60439692,
        "green_cover_pct": 11.2,
        "urban_expansion_rate": 5.4,
        "ag_land_pct": 53.2,
        "forest_cover_pct": 7.6,
        "climate_vuln": 0.68,
        "infra_score": 85.0,
        "flood_risk": 44.0,
        "disputes": 1820,
        "research_count": 14,
        "policy_count": 10,
        "bbox": [[20.1, 68.1], [24.7, 74.5]]
    },
    {
        "code": "TN",
        "name": "Tamil Nadu",
        "capital": "Chennai",
        "lat": 11.1271,
        "lng": 78.6569,
        "area_sq_km": 130058,
        "population": 72147030,
        "green_cover_pct": 24.3,
        "urban_expansion_rate": 4.8,
        "ag_land_pct": 49.3,
        "forest_cover_pct": 20.3,
        "climate_vuln": 0.64,
        "infra_score": 81.5,
        "flood_risk": 64.0,
        "disputes": 1940,
        "research_count": 16,
        "policy_count": 7,
        "bbox": [[8.0, 76.2], [13.6, 80.3]]
    },
    {
        "code": "UP",
        "name": "Uttar Pradesh",
        "capital": "Lucknow",
        "lat": 26.8467,
        "lng": 80.9462,
        "area_sq_km": 240928,
        "population": 235687000,
        "green_cover_pct": 9.2,
        "urban_expansion_rate": 4.2,
        "ag_land_pct": 68.7,
        "forest_cover_pct": 6.1,
        "climate_vuln": 0.74,
        "infra_score": 71.0,
        "flood_risk": 72.0,
        "disputes": 4850,
        "research_count": 19,
        "policy_count": 11,
        "bbox": [[23.8, 77.0], [30.4, 84.6]]
    },
    {
        "code": "RJ",
        "name": "Rajasthan",
        "capital": "Jaipur",
        "lat": 27.0238,
        "lng": 74.2179,
        "area_sq_km": 342239,
        "population": 81032689,
        "green_cover_pct": 7.4,
        "urban_expansion_rate": 3.8,
        "ag_land_pct": 52.4,
        "forest_cover_pct": 4.9,
        "climate_vuln": 0.78,
        "infra_score": 67.5,
        "flood_risk": 28.0,
        "disputes": 2410,
        "research_count": 11,
        "policy_count": 6,
        "bbox": [[23.0, 69.5], [30.2, 78.3]]
    },
    {
        "code": "WB",
        "name": "West Bengal",
        "capital": "Kolkata",
        "lat": 22.9868,
        "lng": 87.8550,
        "area_sq_km": 88752,
        "population": 99609303,
        "green_cover_pct": 21.6,
        "urban_expansion_rate": 4.5,
        "ag_land_pct": 61.2,
        "forest_cover_pct": 19.0,
        "climate_vuln": 0.81,
        "infra_score": 73.2,
        "flood_risk": 82.0,
        "disputes": 3120,
        "research_count": 15,
        "policy_count": 7,
        "bbox": [[21.5, 85.8], [27.2, 89.9]]
    },
    {
        "code": "KL",
        "name": "Kerala",
        "capital": "Thiruvananthapuram",
        "lat": 10.8505,
        "lng": 76.2711,
        "area_sq_km": 38863,
        "population": 35699443,
        "green_cover_pct": 54.2,
        "urban_expansion_rate": 3.4,
        "ag_land_pct": 42.1,
        "forest_cover_pct": 54.7,
        "climate_vuln": 0.69,
        "infra_score": 78.9,
        "flood_risk": 78.0,
        "disputes": 1180,
        "research_count": 13,
        "policy_count": 6,
        "bbox": [[8.2, 74.8], [12.8, 77.4]]
    },
    {
        "code": "DL",
        "name": "Delhi NCR",
        "capital": "New Delhi",
        "lat": 28.7041,
        "lng": 77.1025,
        "area_sq_km": 1484,
        "population": 32941000,
        "green_cover_pct": 23.1,
        "urban_expansion_rate": 5.9,
        "ag_land_pct": 18.5,
        "forest_cover_pct": 13.2,
        "climate_vuln": 0.72,
        "infra_score": 92.4,
        "flood_risk": 48.0,
        "disputes": 2980,
        "research_count": 25,
        "policy_count": 12,
        "bbox": [[28.4, 76.8], [28.9, 77.4]]
    },
    {
        "code": "TS",
        "name": "Telangana",
        "capital": "Hyderabad",
        "lat": 18.1124,
        "lng": 79.0193,
        "area_sq_km": 112077,
        "population": 38090000,
        "green_cover_pct": 24.0,
        "urban_expansion_rate": 5.7,
        "ag_land_pct": 48.9,
        "forest_cover_pct": 23.4,
        "climate_vuln": 0.59,
        "infra_score": 80.3,
        "flood_risk": 42.0,
        "disputes": 2040,
        "research_count": 16,
        "policy_count": 8,
        "bbox": [[15.8, 77.2], [19.9, 81.3]]
    },
    {
        "code": "AP",
        "name": "Andhra Pradesh",
        "capital": "Amaravati",
        "lat": 15.9129,
        "lng": 79.7400,
        "area_sq_km": 162968,
        "population": 53903393,
        "green_cover_pct": 23.2,
        "urban_expansion_rate": 4.9,
        "ag_land_pct": 53.6,
        "forest_cover_pct": 17.9,
        "climate_vuln": 0.67,
        "infra_score": 75.8,
        "flood_risk": 68.0,
        "disputes": 2210,
        "research_count": 14,
        "policy_count": 7,
        "bbox": [[12.6, 76.7], [19.2, 84.8]]
    },
    {
        "code": "MP",
        "name": "Madhya Pradesh",
        "capital": "Bhopal",
        "lat": 22.9734,
        "lng": 78.6569,
        "area_sq_km": 308252,
        "population": 85358965,
        "green_cover_pct": 28.3,
        "urban_expansion_rate": 3.7,
        "ag_land_pct": 49.8,
        "forest_cover_pct": 25.1,
        "climate_vuln": 0.65,
        "infra_score": 69.2,
        "flood_risk": 40.0,
        "disputes": 2680,
        "research_count": 12,
        "policy_count": 6,
        "bbox": [[21.1, 74.0], [26.9, 82.8]]
    },
    {
        "code": "OD",
        "name": "Odisha",
        "capital": "Bhubaneswar",
        "lat": 20.9517,
        "lng": 85.0985,
        "area_sq_km": 155707,
        "population": 46356334,
        "green_cover_pct": 34.1,
        "urban_expansion_rate": 3.6,
        "ag_land_pct": 38.4,
        "forest_cover_pct": 33.5,
        "climate_vuln": 0.83,
        "infra_score": 68.0,
        "flood_risk": 84.0,
        "disputes": 1890,
        "research_count": 13,
        "policy_count": 7,
        "bbox": [[17.8, 81.4], [22.6, 87.5]]
    },
    {
        "code": "PB",
        "name": "Punjab",
        "capital": "Chandigarh",
        "lat": 31.1471,
        "lng": 75.3412,
        "area_sq_km": 50362,
        "population": 30141373,
        "green_cover_pct": 6.8,
        "urban_expansion_rate": 4.1,
        "ag_land_pct": 82.9,
        "forest_cover_pct": 3.7,
        "climate_vuln": 0.52,
        "infra_score": 83.4,
        "flood_risk": 35.0,
        "disputes": 2150,
        "research_count": 10,
        "policy_count": 5,
        "bbox": [[29.5, 73.8], [32.5, 76.9]]
    },
    {
        "code": "AS",
        "name": "Assam",
        "capital": "Dispur",
        "lat": 26.2006,
        "lng": 92.9376,
        "area_sq_km": 78438,
        "population": 35607039,
        "green_cover_pct": 42.1,
        "urban_expansion_rate": 3.9,
        "ag_land_pct": 35.2,
        "forest_cover_pct": 36.1,
        "climate_vuln": 0.84,
        "infra_score": 64.2,
        "flood_risk": 91.0,
        "disputes": 1640,
        "research_count": 11,
        "policy_count": 5,
        "bbox": [[24.1, 89.7], [28.0, 96.0]]
    }
]

class GISService:
    @staticmethod
    def get_geojson_layers(layer_name: str = "land_use") -> Dict[str, Any]:
        """
        Generates GeoJSON FeatureCollection with polygon boundaries and styling properties.
        """
        features = []
        for s in INDIA_STATES_DATA:
            b = s["bbox"]
            min_lat, min_lng = b[0]
            max_lat, max_lng = b[1]
            
            # Simple boundary polygon for each state
            coordinates = [[
                [min_lng, min_lat],
                [max_lng, min_lat],
                [max_lng, max_lat],
                [min_lng, max_lat],
                [min_lng, min_lat]
            ]]

            # Determine color and metric based on layer
            val = 0.0
            color = "#3b82f6"
            label = ""

            if layer_name == "land_use":
                val = s["ag_land_pct"]
                label = f"Agri: {s['ag_land_pct']}% | Built-up: {s['urban_expansion_rate']}%"
                color = "#22c55e" if s["ag_land_pct"] > 55 else "#eab308"
            elif layer_name == "agricultural_land":
                val = s["ag_land_pct"]
                label = f"{val}% Agricultural Land"
                color = "#15803d" if val > 60 else "#84cc16" if val > 50 else "#facc15"
            elif layer_name == "urban_expansion":
                val = s["urban_expansion_rate"]
                label = f"{val}% Annual Expansion"
                color = "#dc2626" if val > 5.5 else "#ea580c" if val > 4.5 else "#f59e0b"
            elif layer_name == "forest":
                val = s["forest_cover_pct"]
                label = f"{val}% Forest Cover"
                color = "#047857" if val > 25 else "#10b981" if val > 15 else "#6ee7b7"
            elif layer_name == "climate_vulnerability":
                val = s["climate_vuln"]
                label = f"CVI: {val} (Flood Risk: {s['flood_risk']})"
                color = "#991b1b" if val > 0.75 else "#ea580c" if val > 0.65 else "#3b82f6"
            elif layer_name == "infrastructure":
                val = s["infra_score"]
                label = f"Infra Score: {val}/100"
                color = "#1d4ed8" if val > 80 else "#2563eb" if val > 70 else "#60a5fa"
            elif layer_name == "research_activity":
                val = s["research_count"]
                label = f"{val} Studies & Reports"
                color = "#7c3aed" if val > 18 else "#9333ea" if val > 13 else "#c084fc"
            else:
                val = s["urban_expansion_rate"]
                label = f"Expansion {val}%"
                color = "#0ea5e9"

            features.append({
                "type": "Feature",
                "id": s["code"],
                "properties": {
                    "code": s["code"],
                    "name": s["name"],
                    "capital": s["capital"],
                    "center": [s["lat"], s["lng"]],
                    "area_sq_km": s["area_sq_km"],
                    "population": s["population"],
                    "layer": layer_name,
                    "metric_value": val,
                    "metric_label": label,
                    "fill_color": color,
                    "green_cover_pct": s["green_cover_pct"],
                    "urban_expansion_rate": s["urban_expansion_rate"],
                    "agricultural_land_pct": s["ag_land_pct"],
                    "forest_cover_pct": s["forest_cover_pct"],
                    "climate_vulnerability": s["climate_vuln"],
                    "infrastructure_score": s["infra_score"],
                    "flood_risk_score": s["flood_risk"],
                    "dispute_cases": s["disputes"],
                    "research_papers_count": s["research_count"],
                    "policy_documents_count": s["policy_count"]
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": coordinates
                }
            })

        return {
            "type": "FeatureCollection",
            "features": features
        }

    @staticmethod
    def get_region_profile(code_or_name: str) -> Dict[str, Any]:
        """Returns deep multi-sector profile and time series for a state."""
        match = next((s for s in INDIA_STATES_DATA if s["code"].upper() == code_or_name.upper() or s["name"].lower() == code_or_name.lower()), INDIA_STATES_DATA[0])
        
        # Historical trend series
        years = [2018, 2019, 2020, 2021, 2022, 2023, 2024]
        trend = []
        for i, y in enumerate(years):
            trend.append({
                "year": y,
                "green_cover": round(match["green_cover_pct"] + (i * -0.2), 1),
                "urban_built_up": round(15.0 + (i * (match["urban_expansion_rate"] * 0.7)), 1),
                "agricultural_land": round(match["ag_land_pct"] - (i * 0.3), 1),
                "climate_vulnerability": round(match["climate_vuln"] + (i * 0.01), 2),
                "disputes": int(match["disputes"] - (i * 45))
            })

        return {
            "region": match,
            "trend": trend,
            "hotspot_districts": [
                {"name": f"{match['name']} Central Metro", "expansion_rate": round(match["urban_expansion_rate"] * 1.3, 1), "vulnerability": "High"},
                {"name": f"{match['name']} East Agricultural Basin", "expansion_rate": round(match["urban_expansion_rate"] * 0.7, 1), "vulnerability": "Moderate"},
                {"name": f"{match['name']} Southern Peri-Urban Belt", "expansion_rate": round(match["urban_expansion_rate"] * 1.5, 1), "vulnerability": "High"}
            ]
        }

gis_service = GISService()
