import os
import sys
from pathlib import Path
from datetime import datetime

# Add root directory to sys.path
root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir))

from backend.app.database import SessionLocal, Base, engine
from backend.app import models
from backend.app.auth import hash_password
from backend.app.services.vector_service import vector_service
from backend.app.services.gis_service import INDIA_STATES_DATA

def seed_database():
    print("[Seed] Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(models.User).count() > 0:
            print("[Seed] Database already contains records. Clearing for fresh seed...")
            Base.metadata.drop_all(bind=engine)
            Base.metadata.create_all(bind=engine)

        print("[Seed] Seeding Users...")
        users = [
            models.User(
                email="admin@landgov.gov.in",
                full_name="Dr. Rajeshwar Rao (Platform Director)",
                hashed_password=hash_password("admin123"),
                role="ADMIN",
                organization="Ministry of Rural Development & Land Resources"
            ),
            models.User(
                email="researcher@landgov.gov.in",
                full_name="Dr. Ananya Roy (Lead Researcher)",
                hashed_password=hash_password("research123"),
                role="RESEARCHER",
                organization="National Institute of Urban Affairs (NIUA)"
            ),
            models.User(
                email="policymaker@landgov.gov.in",
                full_name="Shri Vikramaditya Sen (Joint Secretary)",
                hashed_password=hash_password("policy123"),
                role="POLICYMAKER",
                organization="NITI Aayog — Land Policy Cell"
            ),
            models.User(
                email="citizen@landgov.gov.in",
                full_name="Arjun Varma (Public Researcher)",
                hashed_password=hash_password("public123"),
                role="PUBLIC",
                organization="Independent Civil Society Researcher"
            )
        ]
        db.add_all(users)
        db.commit()
        lead_user = users[1]

        print("[Seed] Seeding Regions & Land Indicators...")
        for s in INDIA_STATES_DATA:
            reg = models.Region(
                code=s["code"],
                name=s["name"],
                type="State",
                state_name=s["name"],
                capital_or_hq=s["capital"],
                latitude=s["lat"],
                longitude=s["lng"],
                area_sq_km=s["area_sq_km"],
                population_est=s["population"]
            )
            db.add(reg)
            db.commit()
            db.refresh(reg)

            # Indicator record
            ind = models.LandIndicator(
                region_id=reg.id,
                year=2024,
                green_cover_pct=s["green_cover_pct"],
                urban_expansion_rate=s["urban_expansion_rate"],
                agricultural_land_pct=s["ag_land_pct"],
                forest_cover_pct=s["forest_cover_pct"],
                climate_vulnerability_index=s["climate_vuln"],
                infrastructure_score=s["infra_score"],
                flood_risk_score=s["flood_risk"],
                land_dispute_cases=s["disputes"],
                peri_urban_conversion_rate=round(s["urban_expansion_rate"] * 1.15, 2)
            )
            db.add(ind)
        db.commit()

        print("[Seed] Seeding Policies...")
        policies_data = [
            {
                "code": "SVAMITVA-2021",
                "title": "SVAMITVA Scheme (Survey of Villages and Mapping with Improvised Technology in Village Areas)",
                "ministry_or_dept": "Ministry of Panchayati Raj",
                "year_enacted": 2021,
                "status": "ACTIVE",
                "scope": "National",
                "summary": "Establishes clear ownership of property in rural inhabited (Abadi) areas using drone survey technology, facilitating financial inclusion and rural spatial planning.",
                "objectives": "Provide Record of Rights (Property Cards) to rural households, streamline revenue planning, and minimize property litigation.",
                "land_use_planning_focus": 88.0,
                "climate_resilience_focus": 45.0,
                "environmental_protection_focus": 50.0,
                "digital_governance_focus": 98.0,
                "implementation_coverage_pct": 82.5,
                "evidence_availability": "High",
                "key_provisions": [
                    "High-resolution 5cm accuracy drone survey of rural inhabited clusters.",
                    "Issuance of legal ownership Property Cards (Gharaundi).",
                    "Integration with state digital land revenue registration databases."
                ],
                "tags": ["Cadastre", "Drone Survey", "Rural Tenure", "Financial Inclusion"]
            },
            {
                "code": "LARR-2013",
                "title": "Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act",
                "ministry_or_dept": "Ministry of Rural Development",
                "year_enacted": 2013,
                "status": "ACTIVE",
                "scope": "National",
                "summary": "Statutory framework governing mandatory state acquisition of private land, prescribing enhanced compensation multiples, mandatory Social Impact Assessments (SIA), and rehabilitation safeguards.",
                "objectives": "Ensure humane and transparent land acquisition process in consultation with local self-governments and fair compensation.",
                "land_use_planning_focus": 72.0,
                "climate_resilience_focus": 35.0,
                "environmental_protection_focus": 60.0,
                "digital_governance_focus": 65.0,
                "implementation_coverage_pct": 91.0,
                "evidence_availability": "High",
                "key_provisions": [
                    "Mandatory Social Impact Assessment (SIA) prior to acquisition.",
                    "Compensation up to 4x market value in rural areas and 2x in urban areas.",
                    "Consent of 80% project-affected landowners required for private projects."
                ],
                "tags": ["Land Acquisition", "Compensation", "Resettlement", "Social Impact"]
            },
            {
                "code": "FRA-2006",
                "title": "The Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act",
                "ministry_or_dept": "Ministry of Tribal Affairs",
                "year_enacted": 2006,
                "status": "ACTIVE",
                "scope": "National",
                "summary": "Restores ancestral tenure rights over traditional forest dwellings and community forest resources (CFR) to forest-dwelling scheduled tribes and traditional communities.",
                "objectives": "Redress historical injustice in forest tenure administration and empower gram sabhas as statutory conservation authorities.",
                "land_use_planning_focus": 68.0,
                "climate_resilience_focus": 84.0,
                "environmental_protection_focus": 92.0,
                "digital_governance_focus": 54.0,
                "implementation_coverage_pct": 64.0,
                "evidence_availability": "Moderate",
                "key_provisions": [
                    "Recognition of Individual Forest Rights (IFR) and Community Forest Rights (CFR).",
                    "Gram Sabha empowerment to approve forest diversion proposals.",
                    "Right to collect, process, and trade Minor Forest Produce (MFP)."
                ],
                "tags": ["Forest Rights", "Tribal Governance", "Biodiversity", "Commons"]
            },
            {
                "code": "DILRMP-2008",
                "title": "Digital India Land Records Modernization Programme (DILRMP)",
                "ministry_or_dept": "Department of Land Resources",
                "year_enacted": 2008,
                "status": "ACTIVE",
                "scope": "National",
                "summary": "Transformative umbrella scheme replacing presumptive land titles with conclusive titling via computerization of land records, survey resurvey, and digital registration.",
                "objectives": "Develop a real-time, tamper-proof land records management system facilitating online mutation and transparent transactions.",
                "land_use_planning_focus": 82.0,
                "climate_resilience_focus": 40.0,
                "environmental_protection_focus": 45.0,
                "digital_governance_focus": 96.0,
                "implementation_coverage_pct": 88.0,
                "evidence_availability": "High",
                "key_provisions": [
                    "Digitization of textual records (Record of Rights).",
                    "Cadastral map digitization and spatial attribute linking.",
                    "Interconnection between revenue administration and registration offices."
                ],
                "tags": ["Conclusive Titling", "Digitization", "Revenue Administration", "RoR"]
            },
            {
                "code": "DRAFT-NLUP-2015",
                "title": "Draft National Land Use Policy Framework",
                "ministry_or_dept": "Ministry of Rural Development",
                "year_enacted": 2015,
                "status": "UNDER_REVIEW",
                "scope": "National",
                "summary": "Guiding blueprint providing scientific principles to balance competitive demands on land across agriculture, urban growth, industrial development, and ecological conservation.",
                "objectives": "Prevent diversion of double-cropped agricultural lands and institute land utilization zones (LUZ) across state planning departments.",
                "land_use_planning_focus": 95.0,
                "climate_resilience_focus": 78.0,
                "environmental_protection_focus": 86.0,
                "digital_governance_focus": 68.0,
                "implementation_coverage_pct": 42.0,
                "evidence_availability": "Moderate",
                "key_provisions": [
                    "Zoning hierarchy prioritizing food security and ecological water catchments.",
                    "Establishment of State Land Use Boards for cross-sectoral dispute mediation.",
                    "Mandatory spatial carrying capacity assessments for Tier-1/2 expansion."
                ],
                "tags": ["Spatial Planning", "Food Security", "Carrying Capacity", "Ecological Zoning"]
            },
            {
                "code": "CRZ-2019",
                "title": "Coastal Regulation Zone (CRZ) Notification",
                "ministry_or_dept": "Ministry of Environment, Forest and Climate Change",
                "year_enacted": 2019,
                "status": "ACTIVE",
                "scope": "National",
                "summary": "Establishes protective buffer zones and development restrictions along India's 7,500 km coastline to conserve sensitive marine and estuarine ecosystems.",
                "objectives": "Mitigate storm surge risks, conserve coastal biodiversity, and regulate port and tourism infrastructure.",
                "land_use_planning_focus": 84.0,
                "climate_resilience_focus": 94.0,
                "environmental_protection_focus": 96.0,
                "digital_governance_focus": 60.0,
                "implementation_coverage_pct": 76.0,
                "evidence_availability": "High",
                "key_provisions": [
                    "Classification of coastal areas into CRZ-I (Ecological), CRZ-II (Built Urban), CRZ-III (Rural), and CRZ-IV (Water Bodies).",
                    "Mandatory No-Development Zones (NDZ) along High Tide Lines.",
                    "Hazard line delineation based on sea-level rise and coastal erosion projections."
                ],
                "tags": ["Coastal Zoning", "Sea Level Rise", "Wetlands", "Climate Vulnerability"]
            },
            {
                "code": "WETLANDS-2017",
                "title": "Wetlands (Conservation and Management) Rules",
                "ministry_or_dept": "MoEFCC",
                "year_enacted": 2017,
                "status": "ACTIVE",
                "scope": "National",
                "summary": "Regulates activities within designated wetlands and catchment zones, prohibiting conversion for non-wetland uses, industrial waste discharge, and untreated sewage inflow.",
                "objectives": "Maintain natural hydrology and flood mitigation buffering in peri-urban and rural catchments.",
                "land_use_planning_focus": 78.0,
                "climate_resilience_focus": 92.0,
                "environmental_protection_focus": 95.0,
                "digital_governance_focus": 50.0,
                "implementation_coverage_pct": 58.0,
                "evidence_availability": "Moderate",
                "key_provisions": [
                    "Creation of State Wetland Authorities.",
                    "Prohibition of setting up industries within wetland catchments.",
                    "Preparation of Brief Documents and geo-tagged digital wetland inventories."
                ],
                "tags": ["Wetlands", "Flood Mitigation", "Water Bodies", "Catchment Ecology"]
            },
            {
                "code": "MODEL-TPS-2020",
                "title": "Model Town Planning Schemes and Land Pooling Act",
                "ministry_or_dept": "Ministry of Housing and Urban Affairs",
                "year_enacted": 2020,
                "status": "ACTIVE",
                "scope": "National",
                "summary": "Promotes equitable land readjustment models where fragmented land parcels are pooled, serviced with trunk infrastructure, and reconstituted with 50% returned to original owners.",
                "objectives": "Substitute conflict-prone land acquisition with collaborative urban expansion and self-financing infrastructure value capture.",
                "land_use_planning_focus": 96.0,
                "climate_resilience_focus": 70.0,
                "environmental_protection_focus": 65.0,
                "digital_governance_focus": 85.0,
                "implementation_coverage_pct": 68.0,
                "evidence_availability": "High",
                "key_provisions": [
                    "Reconstitution of irregularly shaped rural plots into regular urban layouts.",
                    "Reservation of up to 40% pooled land for roads, open greens, and affordable housing.",
                    "Value capture financing through sale of commercial development plots."
                ],
                "tags": ["Land Pooling", "Town Planning Schemes", "Value Capture", "Peri-Urban"]
            }
        ]

        for p_data in policies_data:
            pol = models.Policy(**p_data)
            db.add(pol)
        db.commit()

        print("[Seed] Seeding Datasets...")
        datasets_data = [
            {
                "title": "National Land Use & Land Cover Spatial Grid (2018–2024)",
                "description": "Demonstration Data. High-resolution satellite-derived spatial dataset classifying land into built-up, agriculture (single/double crop), forest, scrub, and water bodies across 15 states.",
                "source": "National Remote Sensing Centre (NRSC) / ISRO (Demo calibrated)",
                "publication_year": 2024,
                "geographic_coverage": "Pan-India (15 Key States)",
                "variables": [
                    {"name": "grid_id", "type": "string", "desc": "Spatial quad identifier"},
                    {"name": "state_code", "type": "string", "desc": "Administrative state code"},
                    {"name": "builtup_pct", "type": "float", "desc": "Percentage impervious built surface"},
                    {"name": "agri_pct", "type": "float", "desc": "Percentage agricultural land"},
                    {"name": "forest_pct", "type": "float", "desc": "Percentage forest cover"},
                    {"name": "water_pct", "type": "float", "desc": "Percentage surface water retention"}
                ],
                "format": "GeoJSON / Vector Shapefile",
                "last_updated": "2025-06",
                "tags": ["Land Use", "Satellite Data", "Change Detection", "Sprawl"],
                "record_count": 14200,
                "sample_data": [
                    {"grid_id": "MH-PN-01", "state_code": "MH", "builtup_pct": 34.2, "agri_pct": 46.1, "forest_pct": 14.5, "water_pct": 5.2},
                    {"grid_id": "MH-PN-02", "state_code": "MH", "builtup_pct": 48.9, "agri_pct": 31.4, "forest_pct": 11.2, "water_pct": 3.1},
                    {"grid_id": "KA-BLR-01", "state_code": "KA", "builtup_pct": 56.4, "agri_pct": 28.2, "forest_pct": 9.8, "water_pct": 4.1},
                    {"grid_id": "KA-BLR-02", "state_code": "KA", "builtup_pct": 68.2, "agri_pct": 18.0, "forest_pct": 8.5, "water_pct": 2.2},
                    {"grid_id": "GJ-AMD-01", "state_code": "GJ", "builtup_pct": 42.1, "agri_pct": 48.5, "forest_pct": 4.2, "water_pct": 3.8}
                ],
                "is_demo": True
            },
            {
                "title": "District-Level Climate Vulnerability & Hydrological Inundation Registry",
                "description": "Demonstration Data. Multi-criteria vulnerability metrics combining rainfall anomalies, drainage density, topsoil permeability, and flood frequency indicators.",
                "source": "Ministry of Jal Shakti / IMD (Demonstration Dataset)",
                "publication_year": 2024,
                "geographic_coverage": "Pan-India (740 Districts)",
                "variables": [
                    {"name": "district_code", "type": "string", "desc": "Census district code"},
                    {"name": "district_name", "type": "string", "desc": "District name"},
                    {"name": "cvi_score", "type": "float", "desc": "Climate Vulnerability Index (0-1)"},
                    {"name": "flood_frequency", "type": "integer", "desc": "Major flood events in past decade"},
                    {"name": "groundwater_stage", "type": "float", "desc": "Groundwater extraction percentage"}
                ],
                "format": "CSV / JSON",
                "last_updated": "2025-04",
                "tags": ["Climate Vulnerability", "Flood Risk", "Groundwater", "Hydrology"],
                "record_count": 740,
                "sample_data": [
                    {"district_code": "IND-MH-01", "district_name": "Thane", "cvi_score": 0.74, "flood_frequency": 6, "groundwater_stage": 78.4},
                    {"district_code": "IND-KA-01", "district_name": "Bengaluru Urban", "cvi_score": 0.69, "flood_frequency": 5, "groundwater_stage": 142.1},
                    {"district_code": "IND-TN-01", "district_name": "Kancheepuram", "cvi_score": 0.72, "flood_frequency": 7, "groundwater_stage": 92.5},
                    {"district_code": "IND-WB-01", "district_name": "North 24 Parganas", "cvi_score": 0.86, "flood_frequency": 9, "groundwater_stage": 64.0},
                    {"district_code": "IND-AS-01", "district_name": "Kamrup Metropolitan", "cvi_score": 0.88, "flood_frequency": 11, "groundwater_stage": 42.0}
                ],
                "is_demo": True
            },
            {
                "title": "Peri-Urban Agricultural Land Conversion & Non-Agricultural (NA) Permissions",
                "description": "Demonstration Data. Longitudinal record of agricultural parcel fragmentation and conversion into residential, commercial, and industrial zonings.",
                "source": "State Revenue Department Records (Demonstration Aggregate)",
                "publication_year": 2024,
                "geographic_coverage": "Maharashtra, Karnataka, Gujarat, Tamil Nadu, Haryana",
                "variables": [
                    {"name": "conversion_id", "type": "string", "desc": "Conversion gazette identifier"},
                    {"name": "taluka", "type": "string", "desc": "Revenue sub-district"},
                    {"name": "original_category", "type": "string", "desc": "Original agricultural status"},
                    {"name": "new_category", "type": "string", "desc": "Converted zone status"},
                    {"name": "area_hectares", "type": "float", "desc": "Converted area"},
                    {"name": "distance_to_bypass_km", "type": "float", "desc": "Proximity to major arterial highway"}
                ],
                "format": "CSV / GeoJSON",
                "last_updated": "2025-05",
                "tags": ["Land Conversion", "Peri-Urban", "Agriculture", "Zoning"],
                "record_count": 89000,
                "sample_data": [
                    {"conversion_id": "NA-2024-881", "taluka": "Haveli (Pune)", "original_category": "Irrigated Double Crop", "new_category": "Special Township", "area_hectares": 24.5, "distance_to_bypass_km": 1.4},
                    {"conversion_id": "NA-2024-882", "taluka": "Anekal (Bengaluru)", "original_category": "Rainfed Dry Land", "new_category": "Industrial Logistics", "area_hectares": 18.2, "distance_to_bypass_km": 0.8},
                    {"conversion_id": "NA-2024-883", "taluka": "Sanand (Ahmedabad)", "original_category": "Single Crop", "new_category": "Manufacturing SEZ", "area_hectares": 42.0, "distance_to_bypass_km": 2.1}
                ],
                "is_demo": True
            },
            {
                "title": "SVAMITVA Rural Cadastral Drone Survey & Property Card Issuance Ledger",
                "description": "Demonstration Data. State-wise progress tracking of village abadi drone flight completions, digital ground-truthing, and distributed Property Cards.",
                "source": "Ministry of Panchayati Raj / Survey of India (Demo Aggregated)",
                "publication_year": 2024,
                "geographic_coverage": "Pan-India",
                "variables": [
                    {"name": "state", "type": "string", "desc": "State name"},
                    {"name": "villages_surveyed", "type": "integer", "desc": "Number of villages drone mapped"},
                    {"name": "cards_distributed", "type": "integer", "desc": "Legal property cards issued"},
                    {"name": "disputes_mitigated_pct", "type": "float", "desc": "Estimated drop in boundary disputes"}
                ],
                "format": "JSON / CSV",
                "last_updated": "2025-06",
                "tags": ["SVAMITVA", "Drone Survey", "Property Cards", "Rural Cadastre"],
                "record_count": 3120,
                "sample_data": [
                    {"state": "Uttar Pradesh", "villages_surveyed": 92450, "cards_distributed": 5820000, "disputes_mitigated_pct": 38.4},
                    {"state": "Maharashtra", "villages_surveyed": 34100, "cards_distributed": 2150000, "disputes_mitigated_pct": 41.2},
                    {"state": "Madhya Pradesh", "villages_surveyed": 48200, "cards_distributed": 3100000, "disputes_mitigated_pct": 36.8},
                    {"state": "Haryana", "villages_surveyed": 6250, "cards_distributed": 1280000, "disputes_mitigated_pct": 44.5}
                ],
                "is_demo": True
            },
            {
                "title": "State Revenue Courts Land Dispute Pendency & Resolution Timeline Audit",
                "description": "Demonstration Data. Factual sampling of civil court and sub-divisional magistrate (SDM) land litigation categories across 10 state jurisdictions.",
                "source": "National Judicial Data Grid / Land Governance Research Cell",
                "publication_year": 2024,
                "geographic_coverage": "10 Key States",
                "variables": [
                    {"name": "case_category", "type": "string", "desc": "Classification of dispute"},
                    {"name": "average_pendency_years", "type": "float", "desc": "Mean duration until first decree"},
                    {"name": "percentage_of_total_cases", "type": "float", "desc": "Share of total civil pendency"},
                    {"name": "primary_cause", "type": "string", "desc": "Root administrative bottleneck"}
                ],
                "format": "JSON",
                "last_updated": "2025-03",
                "tags": ["Dispute Resolution", "Litigation", "Judicial Data", "Tenure"],
                "record_count": 450,
                "sample_data": [
                    {"case_category": "Boundary Demarcation & Encroachment", "average_pendency_years": 6.8, "percentage_of_total_cases": 34.2, "primary_cause": "Outdated paper cadastral map mismatch"},
                    {"case_category": "Inheritance & Mutation Succession", "average_pendency_years": 4.5, "percentage_of_total_cases": 26.5, "primary_cause": "Manual delayed entry in Record of Rights"},
                    {"case_category": "Compensation Inadequacy (LARR)", "average_pendency_years": 8.2, "percentage_of_total_cases": 19.8, "primary_cause": "Disputed circle rates vs market value"},
                    {"case_category": "Tenancy & Adverse Possession", "average_pendency_years": 9.4, "percentage_of_total_cases": 14.1, "primary_cause": "Informal oral agricultural leases"}
                ],
                "is_demo": True
            },
            {
                "title": "Forest Rights Act (FRA) Gram Sabha Claims & Title Distribution Database",
                "description": "Demonstration Data. District-level claims received, accepted individual titles, and community forest rights (CFR) hectares vested in tribal communities.",
                "source": "Ministry of Tribal Affairs (Demo Calibrated)",
                "publication_year": 2024,
                "geographic_coverage": "Odisha, Madhya Pradesh, Chhattisgarh, Jharkhand, Maharashtra",
                "variables": [
                    {"name": "district", "type": "string", "desc": "District name"},
                    {"name": "ifr_claims_approved", "type": "integer", "desc": "Individual titles granted"},
                    {"name": "cfr_hectares_vested", "type": "float", "desc": "Community forest area titled"},
                    {"name": "rejection_rate_pct", "type": "float", "desc": "Share of claims turned down"}
                ],
                "format": "CSV",
                "last_updated": "2025-02",
                "tags": ["Forest Rights", "Tribal Tenure", "Commons", "CFR"],
                "record_count": 820,
                "sample_data": [
                    {"district": "Mayurbhanj (Odisha)", "ifr_claims_approved": 18450, "cfr_hectares_vested": 42100.0, "rejection_rate_pct": 14.2},
                    {"district": "Gadchiroli (Maharashtra)", "ifr_claims_approved": 24100, "cfr_hectares_vested": 86400.0, "rejection_rate_pct": 9.8},
                    {"district": "Dindori (Madhya Pradesh)", "ifr_claims_approved": 16200, "cfr_hectares_vested": 31500.0, "rejection_rate_pct": 21.0}
                ],
                "is_demo": True
            },
            {
                "title": "Urban Heat Island (UHI) Intensity vs Tree Canopy Spatial Index",
                "description": "Demonstration Data. Thermal infrared remote sensing temperature differentials across 20 metropolitan areas linked with canopy percentage.",
                "source": "Urban Climate Adaptation Project (Demo Data)",
                "publication_year": 2024,
                "geographic_coverage": "20 Major Indian Cities",
                "variables": [
                    {"name": "city", "type": "string", "desc": "City name"},
                    {"name": "ward_density", "type": "float", "desc": "Built density index"},
                    {"name": "canopy_cover_pct", "type": "float", "desc": "Urban tree canopy"},
                    {"name": "mean_temp_delta_celsius", "type": "float", "desc": "Urban Heat Island excess temp"}
                ],
                "format": "JSON / GeoJSON",
                "last_updated": "2025-06",
                "tags": ["Urban Heat Island", "Canopy Cover", "Climate Resilience", "Urban Planning"],
                "record_count": 480,
                "sample_data": [
                    {"city": "Delhi", "ward_density": 82.0, "canopy_cover_pct": 12.1, "mean_temp_delta_celsius": 4.6},
                    {"city": "Bengaluru", "ward_density": 64.0, "canopy_cover_pct": 18.4, "mean_temp_delta_celsius": 3.2},
                    {"city": "Ahmedabad", "ward_density": 78.0, "canopy_cover_pct": 9.5, "mean_temp_delta_celsius": 5.1}
                ],
                "is_demo": True
            },
            {
                "title": "National Infrastructure Pipeline: Land Footprint & Corridor Right-of-Way (RoW) Registry",
                "description": "Demonstration Data. Spatial corridors, linear infrastructure footprints, and land acquisition status for expressways, freight corridors, and industrial nodes.",
                "source": "NHAI / DPIIT (Demonstration Data)",
                "publication_year": 2024,
                "geographic_coverage": "Pan-India Corridors",
                "variables": [
                    {"name": "corridor_name", "type": "string", "desc": "Infrastructure project title"},
                    {"name": "total_length_km", "type": "float", "desc": "Total linear length"},
                    {"name": "land_required_hectares", "type": "float", "desc": "Total Right-of-Way land"},
                    {"name": "acquisition_completed_pct", "type": "float", "desc": "Vested land percentage"}
                ],
                "format": "CSV / Vector",
                "last_updated": "2025-04",
                "tags": ["Infrastructure", "Linear Projects", "Right of Way", "Land Acquisition"],
                "record_count": 180,
                "sample_data": [
                    {"corridor_name": "Delhi-Mumbai Industrial Corridor (DMIC)", "total_length_km": 1504.0, "land_required_hectares": 48500.0, "acquisition_completed_pct": 89.2},
                    {"corridor_name": "Bengaluru-Chennai Expressway", "total_length_km": 262.0, "land_required_hectares": 2840.0, "acquisition_completed_pct": 94.5},
                    {"corridor_name": "Western Dedicated Freight Corridor", "total_length_km": 1506.0, "land_required_hectares": 12400.0, "acquisition_completed_pct": 98.1}
                ],
                "is_demo": True
            }
        ]

        for ds_data in datasets_data:
            ds = models.Dataset(**ds_data)
            db.add(ds)
        db.commit()

        print("[Seed] Seeding 35+ Research Documents & Case Studies...")
        docs_data = [
            # Document 1 - Demo Scenario Hero Document
            {
                "title": "Dynamics of Rapid Peri-Urban Agricultural Land Conversion: Ecological and Governance Implications",
                "abstract": "This study analyzes spatial trajectories of land-use transition across the peri-urban peripheries of Bengaluru, Pune, and Ahmedabad from 2015 to 2024. Utilizing multi-temporal satellite imagery and revenue mutation records, we identify three critical drivers: speculative land accumulation along transport corridors, regulatory ambiguity in transitional village-to-urban administration, and unequal compensation models. Results demonstrate an 18.4% contraction in watershed buffering capacity and a 42% escalation in tenure litigation.",
                "doc_type": "Research Paper",
                "authors": "Dr. Ananya Roy, Prof. S. K. Sharma",
                "institution": "National Institute of Urban Affairs & IIT Roorkee",
                "publication_year": 2024,
                "state": "Karnataka",
                "district": "Bengaluru Urban",
                "topic": "Peri-Urban Governance & Land Conversion",
                "tags": ["Peri-Urban", "Agricultural Conversion", "Tenure Security", "Spatial Planning"],
                "ai_summary": "Comprehensive empirical evaluation demonstrating that uncoordinated land conversion in Indian metropolitan fringes causes permanent watershed degradation and surging legal disputes.",
                "key_findings": "1. 64% of peri-urban conversions occur within 3 km of newly planned highway corridors.\n2. In transitional zones lacking municipal master plans, groundwater levels dropped by an average of 4.2m over 7 years.\n3. Recommends institutionalization of statutory ecological buffer zoning and digital cadastral validation before non-agricultural conversion approvals."
            },
            # Document 2
            {
                "title": "Evaluating the SVAMITVA Scheme: Drone-Based Cadastral Mapping and Dispute Reduction in Rural India",
                "abstract": "We evaluate the institutional and socio-economic outcomes of drone surveys across 1,200 village abadi clusters in Uttar Pradesh and Madhya Pradesh. By creating high-precision 5cm digital orthophoto maps (DOM) and legal property cards, the scheme has reduced boundary disputes by 38.4% and unlocked formalized collateral value for previously unbanked households.",
                "doc_type": "Research Paper",
                "authors": "Dr. Ramesh Chandra, Meera Patel",
                "institution": "Centre for Land Governance & Policy",
                "publication_year": 2024,
                "state": "Uttar Pradesh",
                "district": "Lucknow",
                "topic": "Digital Cadastre & Property Rights",
                "tags": ["SVAMITVA", "Drone Survey", "Property Cards", "Dispute Resolution"],
                "ai_summary": "Examines property card issuance and demonstrates that transparent digital boundaries significantly lower revenue court litigation.",
                "key_findings": "1. Boundary disputes dropped from 48 cases per village cluster to under 12 post-survey.\n2. Institutional loan approval velocity increased by 2.6x among cardholders."
            },
            # Document 3
            {
                "title": "Town Planning Schemes vs Compulsory Acquisition: Lessons from Gujarat and Andhra Pradesh",
                "abstract": "A comparative case study analyzing the institutional economics of land assembly for urban expansion. We evaluate Gujarat's Town Planning Scheme (TPS) model against compulsory acquisition under the LARR Act 2013 in the Amaravati capital region. Findings show TPS minimizes public resistance by returning reconstituted, fully serviced 50% land plots to original owners, achieving higher social equity.",
                "doc_type": "Case Study",
                "authors": "Prof. Rahul Deshmukh",
                "institution": "CEPT University",
                "publication_year": 2024,
                "state": "Gujarat",
                "district": "Ahmedabad",
                "topic": "Land Pooling & Urban Assembly",
                "tags": ["Town Planning Schemes", "Land Pooling", "Urban Infrastructure", "LARR Act"],
                "ai_summary": "Demonstrates that land reconstitution and pooling achieves faster infrastructure delivery and higher landowner satisfaction than compulsory acquisition.",
                "key_findings": "1. 92% of surveyed landowners in TPS sectors reported increased net wealth post-reconstitution.\n2. Litigation delays averaged 1.2 years in TPS compared to 7.8 years under compulsory acquisition."
            },
            # Document 4
            {
                "title": "Urban Flood Vulnerability and Wetland Encroachment in Chennai: A Hydrological Land-Use Audit",
                "abstract": "Investigates the causal linkages between the loss of water retention bodies (eris) and recurring urban inundation in Chennai. Spatial overlay of the 2015 and 2023 flood footprints with historical revenue maps demonstrates that 46% of high-depth inundation occurred directly over encroached natural drainage channels and seasonal floodplains.",
                "doc_type": "Research Paper",
                "authors": "Dr. K. Swaminathan, Dr. Priya Raman",
                "institution": "Anna University & IIT Madras",
                "publication_year": 2024,
                "state": "Tamil Nadu",
                "district": "Chennai",
                "topic": "Climate Vulnerability & Flood Buffers",
                "tags": ["Wetlands", "Urban Floods", "Climate Adaptation", "Hydrology"],
                "ai_summary": "Establishes quantitative relationship between urban wetland shrinkage and flash flooding severity, recommending strict non-negotiable buffer zones.",
                "key_findings": "1. Natural surface storage capacity decreased by 58% between 1980 and 2023.\n2. Enforcement of 200m buffer zones would reduce residential flood exposure by 65%."
            },
            # Document 5
            {
                "title": "Forest Rights Act Implementation and Forest Commons Management in Odisha",
                "abstract": "Empirical survey of Community Forest Resource (CFR) rights titles vested in 240 Gram Sabhas across Mayurbhanj and Kandhamal. Recognising community stewardship legally incentivized sustainable non-timber forest product harvesting and reduced forest fire incidences by 28%.",
                "doc_type": "Research Paper",
                "authors": "Bijoy Patnaik, Sunita Nayak",
                "institution": "Tata Institute of Social Sciences (TISS)",
                "publication_year": 2023,
                "state": "Odisha",
                "district": "Mayurbhanj",
                "topic": "Forest Governance & Tribal Rights",
                "tags": ["Forest Rights Act", "Community Commons", "Tribal Livelihoods", "Biodiversity"],
                "ai_summary": "Analyzes the governance impacts of Community Forest Rights titles, proving strong correlation with improved forest canopy and tribal income stability.",
                "key_findings": "1. CFR-titled villages experienced 31% higher seasonal NTFP income.\n2. Gram Sabha monitoring eliminated unauthorized commercial timber extractions in 95% of studied clusters."
            },
            # Document 6
            {
                "title": "Digital Land Records and Agricultural Credit Flow: A Multi-State Empirical Study",
                "abstract": "Analyzes the impact of the Digital India Land Records Modernization Programme (DILRMP) on Kisan Credit Card (KCC) disbursements across 5 states. Computerized Record of Rights (RoR) integrated with banking APIs reduced loan processing times from 24 days to under 4 days.",
                "doc_type": "Government Report",
                "authors": "NITI Aayog Agricultural Division",
                "institution": "NITI Aayog & NABARD",
                "publication_year": 2024,
                "state": "All India",
                "district": "National",
                "topic": "Digital Governance & Agricultural Finance",
                "tags": ["DILRMP", "Agricultural Credit", "Fintech", "Record of Rights"],
                "ai_summary": "Official empirical report validating that API integration between revenue registries and credit institutions dramatically improves farm loan delivery.",
                "key_findings": "1. Loan processing time slashed by 83% in digitized districts.\n2. False mortgage and duplicate pledging incidents eliminated across participating banks."
            },
            # Document 7
            {
                "title": "Reforming Agricultural Tenancy in India: Assessing the Model Land Leasing Act",
                "abstract": "Examines the legal and economic implications of informal tenancy arrangements in Bihar and Uttar Pradesh. Demonstrates that fear of losing title under obsolete tenancy laws causes landowners to leave fertile lands fallow or refuse written contracts, depriving tenant cultivators of crop insurance and disaster relief.",
                "doc_type": "Policy Document",
                "authors": "Prof. Alok Mukherjee",
                "institution": "Indian Council of Agricultural Research (ICAR)",
                "publication_year": 2023,
                "state": "Bihar",
                "district": "Patna",
                "topic": "Tenancy Reforms & Land Leasing",
                "tags": ["Tenancy", "Model Leasing Act", "Tenant Farmers", "Agricultural Productivity"],
                "ai_summary": "Advocates adoption of the Model Land Leasing Act to secure tenant cultivator rights without threatening landowner title.",
                "key_findings": "1. Over 30% of agricultural land in eastern India is cultivated under unrecorded oral leases.\n2. Tenant farmers without legal tenancy certificates face 2.5x higher debt burden from informal moneylenders."
            },
            # Document 8
            {
                "title": "Industrial Land Banks and Linear Infrastructure: Addressing Acquisition Bottlenecks",
                "abstract": "Evaluates the National Industrial Corridor Development Corporation's spatial land bank portal across Delhi-Mumbai and Bengaluru-Mumbai nodes. Assesses GIS-based pre-cleared industrial park allocations versus fragmented private negotiations.",
                "doc_type": "Government Report",
                "authors": "DPIIT Industrial Spatial Strategy Group",
                "institution": "Ministry of Commerce and Industry",
                "publication_year": 2024,
                "state": "Maharashtra",
                "district": "Pune",
                "topic": "Industrial Corridors & Land Banks",
                "tags": ["Industrial Land Banks", "Corridors", "Right of Way", "Manufacturing"],
                "ai_summary": "Synthesizes GIS-based pre-cleared industrial land allocation models, showing significant acceleration in manufacturing capital deployment.",
                "key_findings": "1. Pre-cleared industrial plots reduce setup time from 36 months to 8 months.\n2. Unified GIS portals prevent allocation conflicts with ecological protection zones."
            },
            # Document 9
            {
                "title": "Social Impact Assessment Under the LARR Act 2013: A Decadal Review of Practice",
                "abstract": "A ten-year empirical review of Social Impact Assessments (SIAs) conducted across 180 major infrastructure projects in India. Evaluates public hearing authenticity, baseline compensation tracking, and long-term socio-economic rehabilitation outcomes.",
                "doc_type": "Legal Document",
                "authors": "Centre for Policy Research Land Rights Initiative",
                "institution": "Centre for Policy Research (CPR)",
                "publication_year": 2023,
                "state": "All India",
                "district": "National",
                "topic": "Land Acquisition & Social Impact",
                "tags": ["LARR Act", "Social Impact Assessment", "Rehabilitation", "Public Hearings"],
                "ai_summary": "Critically reviews SIA implementation across India, highlighting disparities between statutory requirements and ground execution.",
                "key_findings": "1. Independent SIAs reduced project design displacement footprints by an average of 18%.\n2. Institutional delays in notifying R&R awards remain the primary driver of high court writ petitions."
            },
            # Document 10
            {
                "title": "Ecological Fragility and Land-Use Violations in the Western Ghats Eco-Sensitive Zones",
                "abstract": "Multi-year monitoring of quarrying, road expansion, and plantation conversions across eco-sensitive zones in Kerala and Karnataka. Maps high-risk landslide susceptibility zones against spatial development approvals.",
                "doc_type": "Research Paper",
                "authors": "Dr. V. Madhavan, Dr. Sunita Menon",
                "institution": "Indian Institute of Science (IISc)",
                "publication_year": 2024,
                "state": "Kerala",
                "district": "Wayanad",
                "topic": "Eco-Sensitive Zones & Disaster Risk",
                "tags": ["Western Ghats", "Landslides", "Eco-Sensitive Zones", "Forest Conservation"],
                "ai_summary": "Quantifies the environmental risks of land conversion in steep mountainous terrains, establishing direct links to catastrophic landslides.",
                "key_findings": "1. Landslide trigger thresholds were 40% lower on slopes converted from natural forest to commercial monoculture.\n2. Recommends strict moratorium on construction on slopes exceeding 30 degrees."
            },
            # Document 11
            {
                "title": "Peri-Urban Commons Degradation: The Encroachment of Village Grazing Lands (Gauchar)",
                "abstract": "Detailed spatial analysis of common property resources (CPRs) across 80 village panchayats on the outer periphery of Jaipur and Delhi NCR. Gauchar and shamlat deh lands suffer systematic encroachment due to revenue classification oversights.",
                "doc_type": "Research Paper",
                "authors": "Dr. Harsh Vardhan Singh",
                "institution": "Institute of Development Studies Jaipur",
                "publication_year": 2024,
                "state": "Rajasthan",
                "district": "Jaipur",
                "topic": "Rural Commons & Gauchar Lands",
                "tags": ["Commons", "Grazing Lands", "Gauchar", "Panchayats"],
                "ai_summary": "Documents the rapid depletion of pastoral and common lands in peri-urban belts, urging digital geo-tagging of all village commons.",
                "key_findings": "1. Over 52% of designated village common lands in Jaipur's peri-urban periphery have been converted to informal built-up structures.\n2. Pastoral communities lost 60% of their livestock grazing capacity."
            },
            # Document 12
            {
                "title": "Conclusive Titling Roadmaps: Transitioning from Presumptive Land Titles in India",
                "abstract": "Explores the legal, constitutional, and technological architecture required to enact conclusive titling with state-backed Torrens system indemnities in India. Outlines an incremental 4-stage operational blueprint.",
                "doc_type": "Legal Document",
                "authors": "Law Commission & NITI Aayog Advisory Panel",
                "institution": "National Law School of India University (NLSIU)",
                "publication_year": 2024,
                "state": "All India",
                "district": "National",
                "topic": "Conclusive Titling & Legal Reform",
                "tags": ["Conclusive Titling", "Torrens System", "Legal Reform", "Indemnity"],
                "ai_summary": "Provides actionable legal roadmap for implementing state-guaranteed conclusive land titling to replace colonial presumptive registration.",
                "key_findings": "1. Constitutional division of land as a State subject requires Model State Legislation.\n2. Title dispute resolution mechanisms must precede statutory state indemnity guarantees."
            },
            # Document 13
            {
                "title": "Land Value Capture (LVC) Mechanisms for Financing Sustainable Transit Corridors",
                "abstract": "Evaluates Betterment Levies, Transfer of Development Rights (TDR), and premium Floor Space Index (FSI) along metro corridors in Mumbai, Hyderabad, and Delhi. Calculates fiscal self-sustainability of transit-oriented development.",
                "doc_type": "Case Study",
                "authors": "Urban Infrastructure Finance Group",
                "institution": "Administrative Staff College of India (ASCI)",
                "publication_year": 2024,
                "state": "Telangana",
                "district": "Hyderabad",
                "topic": "Land Value Capture & Transit Finance",
                "tags": ["Land Value Capture", "Transit-Oriented Development", "TDR", "Municipal Finance"],
                "ai_summary": "Highlights successful Land Value Capture strategies that generated over INR 4,200 Cr in infrastructure finance across metro lines.",
                "key_findings": "1. Premium FSI along transit corridors funded 28% of capital construction costs.\n2. TDR banks enabled non-cash compensation for green corridor reservations."
            },
            # Document 14
            {
                "title": "Urban Heat Island Mitigation Through Statutory Green Cover Zoning: Delhi Case Analysis",
                "abstract": "Micro-climate modeling of land-surface temperature (LST) across Delhi's 272 municipal wards. Evaluates Master Plan 2041 green-blue infrastructure mandates and proves that a 10% increase in tree canopy cools local surface temperatures by 1.8°C.",
                "doc_type": "Research Paper",
                "authors": "Dr. Neha Agarwal, Prof. Tarun Gupta",
                "institution": "School of Planning and Architecture (SPA New Delhi)",
                "publication_year": 2024,
                "state": "Delhi NCR",
                "district": "New Delhi",
                "topic": "Urban Heat Island & Green Cover",
                "tags": ["Urban Heat Island", "Master Plan 2041", "Canopy Cover", "Microclimate"],
                "ai_summary": "Quantifies cooling benefits of mandatory urban canopy buffers, providing empirical basis for Master Plan 2041 green zoning.",
                "key_findings": "1. High-density built wards experienced daytime LST up to 8.4°C higher than neighboring ridge areas.\n2. Preserving natural floodplains provides cooling benefits extending up to 2.5 km inland."
            },
            # Document 15
            {
                "title": "Blockchain-Enabled Land Titling: Pilots, Promises, and Governance Limits in India",
                "abstract": "A rigorous review of blockchain cadastral pilot programs in Andhra Pradesh and Telangana. Assesses the feasibility of decentralized ledgers for preventing double-spend and fraudulent mutations in land registries.",
                "doc_type": "Research Paper",
                "authors": "Vikram Seth, Dr. Smita Bansal",
                "institution": "IIIT Hyderabad",
                "publication_year": 2023,
                "state": "Andhra Pradesh",
                "district": "Amaravati",
                "topic": "Emerging Tech & Blockchain Cadastre",
                "tags": ["Blockchain", "Digital Cadastre", "Fraud Prevention", "Mutation"],
                "ai_summary": "Finds that while blockchain ensures cryptographic immutability, legal ground-truthing and human verification remain the critical integrity constraints.",
                "key_findings": "1. Blockchain successfully halted unauthorized off-book mutations during trial runs.\n2. System integrity relies completely on front-end biometric verification and surveyor accuracy."
            },
            # Document 16
            {
                "title": "Land Degradation Neutrality (LDN) in Western India: Soil Salinization and Canal Waterlogging",
                "abstract": "Assesses land degradation in the Indira Gandhi Canal command area and Saurashtra coastal belt. Evaluates policy incentives for subsurface drainage, salt-tolerant agro-forestry, and drip irrigation adoption.",
                "doc_type": "Case Study",
                "authors": "Central Arid Zone Research Institute (CAZRI)",
                "institution": "ICAR-CAZRI Jodhpur",
                "publication_year": 2024,
                "state": "Rajasthan",
                "district": "Bikaner",
                "topic": "Land Degradation & Soil Health",
                "tags": ["Land Degradation", "Salinization", "Soil Conservation", "Irrigation"],
                "ai_summary": "Case analysis detailing policy frameworks needed to reverse agricultural soil salinization in arid canal belts.",
                "key_findings": "1. Over 180,000 hectares of prime agricultural land suffered productivity loss due to poor drainage.\n2. Subsurface drainage installations restored 74% of degraded crop yields within 3 seasons."
            },
            # Document 17
            {
                "title": "Gender and Land Ownership: Evaluating the Impact of Joint Titling Policies in Central India",
                "abstract": "Assesses the socio-economic effects of mandatory joint land titling and subsidized stamp duty for female buyers in Madhya Pradesh and Maharashtra. Demonstrates measurable gains in female household bargaining power and child nutrition.",
                "doc_type": "Research Paper",
                "authors": "Dr. Pratibha Joshi, Dr. Shalini Verma",
                "institution": "Indira Gandhi Institute of Development Research (IGIDR)",
                "publication_year": 2024,
                "state": "Madhya Pradesh",
                "district": "Bhopal",
                "topic": "Gender & Property Rights",
                "tags": ["Gender Equity", "Joint Titling", "Stamp Duty Concessions", "Tenure"],
                "ai_summary": "Empirically demonstrates that stamp duty incentives for women increased female sole/joint land registrations from 12% to 34%.",
                "key_findings": "1. Stamp duty concessions of 1-2% resulted in a 180% surge in female registered land ownership.\n2. Households with female titleholders allocated 22% more expenditure to education and healthcare."
            },
            # Document 18
            {
                "title": "Mapping Land Dispute Clusters: Machine Learning Analysis of District Revenue Court Dockets",
                "abstract": "Applies natural language processing and spatial clustering algorithms on 120,000 digitized district revenue court judgments across Maharashtra and Uttar Pradesh to predict high-litigation sub-districts.",
                "doc_type": "Research Paper",
                "authors": "Data for Governance Research Lab",
                "institution": "IIT Bombay & Vidhi Centre for Legal Policy",
                "publication_year": 2024,
                "state": "Maharashtra",
                "district": "Thane",
                "topic": "Predictive Analytics & Dispute Clusters",
                "tags": ["Machine Learning", "Revenue Litigation", "Dispute Prediction", "Judicial Data"],
                "ai_summary": "Utilizes machine learning to identify structural geographic hotspots of land disputes, enabling proactive administrative interventions.",
                "key_findings": "1. 72% of dispute volume originates from parcels undergoing active peri-urban land-use transition.\n2. Outdated boundary demarcation without digital coordinates was cited in 64% of contested petitions."
            },
            # Document 19
            {
                "title": "Coastal Regulation Zone Violations: Remote Sensing Change-Detection in Coastal Karnataka and Goa",
                "abstract": "Automated satellite detection of illegal structures within the 200m High Tide Line buffer between 2018 and 2024. Documents tourism resort sprawl and estuarine mangrove degradation.",
                "doc_type": "Research Paper",
                "authors": "National Institute of Oceanography (NIO)",
                "institution": "CSIR-NIO Goa",
                "publication_year": 2024,
                "state": "Karnataka",
                "district": "Uttara Kannada",
                "topic": "Coastal Regulation & Marine Buffers",
                "tags": ["CRZ", "Remote Sensing", "Mangroves", "Coastal Erosion"],
                "ai_summary": "Demonstrates the power of automated satellite surveillance for real-time detection of coastal regulation zone encroachments.",
                "key_findings": "1. Automated change-detection flagged 320 unauthorized constructions 14 months before manual field inspections.\n2. Mangrove buffering capacity reduced wave surge impact by 45% during Cyclone Biparjoy."
            },
            # Document 20
            {
                "title": "Community Grazing Rights and Pastoral Tenure in the Banni Grasslands of Kachchh",
                "abstract": "Investigates traditional pastoralist rights of the Maldhari community in Gujarat's Banni grasslands. Analyzes the impact of invasive Prosopis juliflora and industrial encroachment on community grazing commons.",
                "doc_type": "Case Study",
                "authors": "Sahjeevan Research Collective",
                "institution": "Sahjeevan & Gujarat Institute of Desert Ecology",
                "publication_year": 2023,
                "state": "Gujarat",
                "district": "Kachchh",
                "topic": "Pastoral Tenure & Grassland Commons",
                "tags": ["Pastoral Rights", "Grasslands", "Banni", "Community Commons"],
                "ai_summary": "Detailed case study exploring pastoral land tenure and the urgent need for statutory recognition of nomadic grazing corridors.",
                "key_findings": "1. Formal recognition of Banni community rights under Section 3(1)(d) of FRA empowered 48 villages to manage 250,000 hectares.\n2. Grassland restoration doubled indigenous Banni buffalo milk yields."
            }
        ]

        # Add 12 more document variations to exceed 30+ research papers
        topics_variations = [
            ("Assam Brahmaputra Riverbank Erosion and Resettlement Land Policy", "Case Study", "Assam", "Kamrup Metropolitan", "Riverbank Erosion & Resettlement", ["Floodplains", "Erosion", "Resettlement", "Disaster Displacement"]),
            ("Punjab Groundwater Depletion and Crop Diversification Land Policy", "Research Paper", "Punjab", "Ludhiana", "Groundwater Governance & Crop Zoning", ["Groundwater", "Depletion", "Crop Diversification", "Paddy"]),
            ("West Bengal Sundarbans Managed Retreat and Embankment Land Governance", "Research Paper", "West Bengal", "South 24 Parganas", "Sundarbans Managed Retreat", ["Sundarbans", "Sea Level Rise", "Managed Retreat", "Embankments"]),
            ("Rajasthan Solar Parks and Pastoral Land Rights in Western Thar", "Case Study", "Rajasthan", "Jodhpur", "Renewable Energy Land Footprint", ["Solar Parks", "Pastoral Rights", "Commons", "Renewable Energy"]),
            ("Telangana Dharani Portal: Integrated Land Records Management Review", "Government Report", "Telangana", "Hyderabad", "Digital Registration & Revenue Reform", ["Dharani", "Integrated Portal", "Revenue Reforms", "Titling"]),
            ("Karnataka Bhoomi 3.0: Cloud-Native Land Record Modernization Lessons", "Government Report", "Karnataka", "Bengaluru Urban", "Cloud Governance & Digital RoR", ["Bhoomi", "Cloud Computing", "Digital RoR", "E-Governance"]),
            ("Maharashtra Unified Development Control and Promotion Regulations (UDCPR)", "Policy Document", "Maharashtra", "Mumbai", "Unified Spatial Regulations", ["UDCPR", "Zoning", "Building Codes", "Urban Density"]),
            ("Eco-Restoration of Mining-Degraded Lands in the Chota Nagpur Plateau", "Research Paper", "Odisha", "Kendujhar", "Mining Reclamation & Land Restoration", ["Mining", "Reclamation", "Soil Restoration", "Tribal Land"]),
            ("Water Body Restoration and Digital Geofencing in Bengaluru: Mission Amrit Sarovar", "Case Study", "Karnataka", "Bengaluru Urban", "Water Bodies & Amrit Sarovar", ["Amrit Sarovar", "Lakes", "Encroachment", "Geofencing"]),
            ("Displacement and Livelihood Restoration in Dedicated Freight Corridors", "Research Paper", "Uttar Pradesh", "Kanpur", "Linear Acquisition & Livelihoods", ["Freight Corridors", "Livelihoods", "LARR Act", "Compensation"]),
            ("Drone Surveying Standards and Positional Accuracy in Mountainous Terrain", "Research Paper", "Himachal Pradesh", "Shimla", "Mountain Cadastre & Accuracy", ["Drones", "Mountain Cadastre", "Survey of India", "Orthophoto"]),
            ("Urban Forest Corridors and Carbon Sequestration in Smart Cities", "Research Paper", "Madhya Pradesh", "Indore", "Urban Forestry & Carbon Accounting", ["Smart Cities", "Urban Forests", "Carbon Sink", "Climate Action"])
        ]

        for title, dtype, state, dist, topic, tags in topics_variations:
            docs_data.append({
                "title": title,
                "abstract": f"This investigative paper examines institutional policy interventions and ground evidence in {topic}. Analyzing regional spatial metrics and government revenue ledgers in {state}, it identifies primary structural bottlenecks and provides actionable regulatory reforms.",
                "doc_type": dtype,
                "authors": "National Land Governance Consortium",
                "institution": "National Land Policy Institute & Partner Universities",
                "publication_year": 2024,
                "state": state,
                "district": dist,
                "topic": topic,
                "tags": tags,
                "ai_summary": f"Analytical evaluation of {title} in {state}, detailing empirical spatial findings and policy reform trajectories.",
                "key_findings": f"1. Documents 32% efficiency improvement following digital governance interventions.\n2. Mandates multi-stakeholder spatial consultations before statutory notifications."
            })

        for d_info in docs_data:
            embedding = vector_service.encode(f"{d_info['title']} {d_info['abstract']}")
            doc = models.Document(
                title=d_info["title"],
                abstract=d_info["abstract"],
                doc_type=d_info["doc_type"],
                authors=d_info.get("authors", "National Research Group"),
                institution=d_info.get("institution", "Centre for Land Policy"),
                publication_year=d_info.get("publication_year", 2024),
                state=d_info.get("state", "All India"),
                district=d_info.get("district", "National"),
                topic=d_info.get("topic", "Land Governance"),
                tags=d_info.get("tags", []),
                status="APPROVED",
                ai_summary=d_info.get("ai_summary", "Synthesized research evaluation."),
                key_findings=d_info.get("key_findings", "Standard empirical governance findings."),
                embedding=embedding,
                uploader_id=lead_user.id
            )
            db.add(doc)
            db.commit()
            db.refresh(doc)

            # Add sample chunk
            chunk = models.DocumentChunk(
                document_id=doc.id,
                chunk_index=1,
                page_number=1,
                content=d_info["abstract"],
                embedding=embedding
            )
            db.add(chunk)
        db.commit()

        print("[Seed] Seeding Research Gaps...")
        gaps_data = [
            {
                "topic": "Climate-Resilient Peri-Urban Land Governance",
                "category": "Peri-Urban & Climate Adaptation",
                "research_concentration_level": "LOW",
                "urban_expansion_pct": 82.0,
                "land_use_planning_pct": 71.0,
                "climate_resilience_pct": 46.0,
                "social_displacement_pct": 21.0,
                "geographic_gaps": ["Bengaluru-Hosur Corridor", "Pune-Haveli Region", "Chennai Suburban Coastal Belt"],
                "temporal_gaps": ["Pre-monsoon and post-monsoon satellite change detection 2020-2025"],
                "dataset_gaps": ["Real-time village abadi conversion approvals linked to flood basin topography"],
                "existing_studies": [
                    {"title": "Dynamics of Rapid Peri-Urban Agricultural Land Conversion", "authors": "Roy & Sharma, 2024"},
                    {"title": "Urban Flood Vulnerability and Wetland Encroachment in Chennai", "authors": "Swaminathan, 2024"}
                ],
                "relevant_policies": [
                    {"code": "CRZ-2019", "title": "Coastal Regulation Zone Notification"},
                    {"code": "DRAFT-NLUP-2015", "title": "Draft National Land Use Policy Framework"}
                ],
                "available_datasets": [
                    {"title": "National Land Use & Land Cover Spatial Grid (2018–2024)"},
                    {"title": "District-Level Climate Vulnerability & Hydrological Inundation Registry"}
                ],
                "potential_research_questions": [
                    "How can transitional panchayat revenue authorities enforce statutory climate buffers against speculative developers?",
                    "What legal and fiscal mechanisms can enable tradeable Transfer of Development Rights (TDR) for protecting peri-urban wetlands?",
                    "How does informal agricultural conversion correlate with micro-climate extremes and urban heat island intensity?"
                ],
                "research_opportunity": {
                    "problem": "Unregulated speculative conversion of agricultural land and wetland buffers in Indian metropolitan peripheries is escalating climate vulnerability and land litigation, while displaced agrarian populations face severe livelihood disruption.",
                    "objectives": [
                        "Quantify rate of wetland and green cover depletion across 3 major metropolitan peri-urban belts.",
                        "Design an automated geospatial early-warning system that detects unapproved conversions via satellite telemetry.",
                        "Formulate a Model Peri-Urban Ecological Governance Framework for State Urban Development Departments."
                    ],
                    "questions": [
                        "What is the quantitative relationship between peri-urban green cover reduction and downstream urban flash flood depth?",
                        "Why do existing Master Plans systematically fail to enforce zoning restrictions beyond formal municipal corporation limits?"
                    ],
                    "required_data": "High-resolution satellite imagery (Sentinel/Planet 3m), District Revenue Land Mutation registers, State Cadastral Maps.",
                    "methodology": "Mixed-methods combining multi-temporal satellite change-detection, cadastral GIS overlay analysis, and field stakeholder interviews across 50 transitional villages.",
                    "expected_outcomes": "Statutory Guidance Note on Climate-Resilient Peri-Urban Zoning and open-source automated change-detection toolkit."
                }
            },
            {
                "topic": "Commons and Pastoral Grazing Rights Under Modern Cadastral Surveys",
                "category": "Rural Commons & Tenure",
                "research_concentration_level": "LOW",
                "urban_expansion_pct": 34.0,
                "land_use_planning_pct": 52.0,
                "climate_resilience_pct": 65.0,
                "social_displacement_pct": 78.0,
                "geographic_gaps": ["Western Rajasthan (Thar Desert)", "Kachchh Grasslands (Gujarat)", "Deccan Plateau Grazing Commons"],
                "temporal_gaps": ["Longitudinal pastoral migration route tracking post-solar and industrial corridor zoning"],
                "dataset_gaps": ["Spatial demarcation of traditional migratory livestock corridors and village Gauchar lands"],
                "existing_studies": [
                    {"title": "Peri-Urban Commons Degradation: The Encroachment of Village Grazing Lands", "authors": "Singh, 2024"},
                    {"title": "Community Grazing Rights and Pastoral Tenure in the Banni Grasslands", "authors": "Sahjeevan, 2023"}
                ],
                "relevant_policies": [
                    {"code": "SVAMITVA-2021", "title": "SVAMITVA Scheme"},
                    {"code": "FRA-2006", "title": "Forest Rights Act 2006"}
                ],
                "available_datasets": [
                    {"title": "Forest Rights Act (FRA) Gram Sabha Claims & Title Distribution Database"}
                ],
                "potential_research_questions": [
                    "How can drone surveys in rural abadi areas safeguard adjoining pastoral grazing commons from unauthorized privatization?",
                    "What legal standing can be granted to migratory pastoralist communities over seasonal grazing rights?"
                ],
                "research_opportunity": {
                    "problem": "Large-scale renewable energy installations and industrial corridors are rapidly fragmenting traditional pastoral routes and village commons (Gauchar), threatening pastoral livelihoods without formal compensation.",
                    "objectives": [
                        "Digitally map traditional seasonal pastoral migration corridors across Rajasthan and Gujarat.",
                        "Propose legal protocols for recognizing collective commons tenure under Panchayati Raj acts."
                    ],
                    "questions": ["How do renewable energy park land acquisitions compensate non-titleholding customary pastoral users?"],
                    "required_data": "Panchayat Gauchar records, Animal Husbandry migration maps, Drone cadastral layers.",
                    "methodology": "Participatory GIS mapping with pastoral collectives and legal jurisprudence audit.",
                    "expected_outcomes": "National Policy Directive on Customary Pastoral Commons Demarcation."
                }
            },
            {
                "topic": "Digital Land Records Interoperability and Automated Revenue Mutation",
                "category": "Digital Land Governance",
                "research_concentration_level": "MODERATE",
                "urban_expansion_pct": 65.0,
                "land_use_planning_pct": 85.0,
                "climate_resilience_pct": 30.0,
                "social_displacement_pct": 45.0,
                "geographic_gaps": ["Eastern and North-Eastern States (Assam, Bihar, Jharkhand)"],
                "temporal_gaps": ["Audit of mutation registration latency across multi-generational inheritances"],
                "dataset_gaps": ["API synchronization logs between Sub-Registrar Offices and Tehsildar mutation databases"],
                "existing_studies": [
                    {"title": "Evaluating the SVAMITVA Scheme: Drone-Based Cadastral Mapping", "authors": "Chandra et al., 2024"},
                    {"title": "Digital Land Records and Agricultural Credit Flow", "authors": "NITI Aayog, 2024"}
                ],
                "relevant_policies": [
                    {"code": "DILRMP-2008", "title": "Digital India Land Records Modernization Programme"}
                ],
                "available_datasets": [
                    {"title": "SVAMITVA Rural Cadastral Drone Survey & Property Card Issuance Ledger"},
                    {"title": "State Revenue Courts Land Dispute Pendency & Resolution Timeline Audit"}
                ],
                "potential_research_questions": [
                    "What architectural safeguards prevent fraudulent mutations in automated registration-to-revenue synchronization?",
                    "How can biometric and digital identity integration prevent female inheritance exclusion in digitized RoRs?"
                ],
                "research_opportunity": {
                    "problem": "Despite extensive digitization under DILRMP, lag between property transaction registration and revenue mutation creates fertile ground for double sales and protracted litigation.",
                    "objectives": [
                        "Benchmark latency and failure modes in automated mutation across 8 states.",
                        "Develop a zero-latency digital transaction verification architecture."
                    ],
                    "questions": ["What technical and administrative bottlenecks cause 35% of registration transactions to stall before mutation?"],
                    "required_data": "State registration transaction logs, Court litigation dockets, DILRMP server logs.",
                    "methodology": "Systems architecture benchmarking and randomized audit of 5,000 transaction lifecycle traces.",
                    "expected_outcomes": "Interoperability Standard for State Land Administration Systems."
                }
            }
        ]

        for g_data in gaps_data:
            gap = models.ResearchGap(**g_data)
            db.add(gap)
        db.commit()

        print("[Seed] Seeding Policy Scenarios...")
        scenarios_data = [
            {
                "title": "Maharashtra Peri-Urban Conservation & Sprawl Containment 2030",
                "user_id": lead_user.id,
                "baseline_state": "Maharashtra",
                "baseline_year": 2024,
                "green_zone_target_pct": 28.0,
                "urban_dev_limit_pct": 18.0,
                "ag_protection_pct": 70.0,
                "infra_investment_cr": 7500.0,
                "climate_investment_cr": 4200.0,
                "land_conversion_threshold_pct": 4.0
            },
            {
                "title": "Karnataka Bengaluru Peripheral Watershed Protection Scenario",
                "user_id": lead_user.id,
                "baseline_state": "Karnataka",
                "baseline_year": 2024,
                "green_zone_target_pct": 32.0,
                "urban_dev_limit_pct": 22.0,
                "ag_protection_pct": 68.0,
                "infra_investment_cr": 8000.0,
                "climate_investment_cr": 5000.0,
                "land_conversion_threshold_pct": 3.5
            },
            {
                "title": "Gujarat Sanand-Mandal Industrial Corridor Agricultural Retention",
                "user_id": lead_user.id,
                "baseline_state": "Gujarat",
                "baseline_year": 2024,
                "green_zone_target_pct": 20.0,
                "urban_dev_limit_pct": 15.0,
                "ag_protection_pct": 65.0,
                "infra_investment_cr": 9500.0,
                "climate_investment_cr": 3000.0,
                "land_conversion_threshold_pct": 5.0
            }
        ]

        from backend.app.services.policy_simulator import policy_simulator
        for sc_in in scenarios_data:
            res = policy_simulator.run_simulation(
                baseline_state=sc_in["baseline_state"],
                green_zone_target_pct=sc_in["green_zone_target_pct"],
                urban_dev_limit_pct=sc_in["urban_dev_limit_pct"],
                ag_protection_pct=sc_in["ag_protection_pct"],
                infra_investment_cr=sc_in["infra_investment_cr"],
                climate_investment_cr=sc_in["climate_investment_cr"],
                land_conversion_threshold_pct=sc_in["land_conversion_threshold_pct"]
            )
            sc_obj = models.PolicyScenario(
                title=sc_in["title"],
                user_id=sc_in["user_id"],
                baseline_state=sc_in["baseline_state"],
                baseline_year=sc_in["baseline_year"],
                green_zone_target_pct=sc_in["green_zone_target_pct"],
                urban_dev_limit_pct=sc_in["urban_dev_limit_pct"],
                ag_protection_pct=sc_in["ag_protection_pct"],
                infra_investment_cr=sc_in["infra_investment_cr"],
                climate_investment_cr=sc_in["climate_investment_cr"],
                land_conversion_threshold_pct=sc_in["land_conversion_threshold_pct"],
                simulation_results=res
            )
            db.add(sc_obj)
        db.commit()

        print("[Seed] Seeding Research Projects...")
        projects_data = [
            {
                "title": "National Peri-Urban Land Governance & Agricultural Protection Initiative",
                "description": "Collaborative inter-institutional investigation assessing land monetization, zoning evasion, and ecological displacement in Tier-1 city fringes.",
                "lead_name": "Dr. Ananya Roy",
                "members": [
                    {"name": "Dr. Ananya Roy", "role": "Principal Investigator", "institution": "NIUA"},
                    {"name": "Prof. S. K. Sharma", "role": "Geospatial Analyst", "institution": "IIT Roorkee"},
                    {"name": "Meera Patel", "role": "Policy Economist", "institution": "NITI Aayog"}
                ],
                "status": "ACTIVE",
                "topic": "Peri-Urban Governance & Land Conversion",
                "region": "Karnataka",
                "research_questions": [
                    "What regulatory interventions best decouple arterial highway development from uncontrolled speculative conversion?",
                    "How can Town Planning Schemes be adapted for rural panchayat jurisdictions?"
                ],
                "tasks": [
                    {"id": 1, "title": "Field baseline validation of cadastral anomalies", "status": "COMPLETED", "assignee": "Prof. Sharma"},
                    {"id": 2, "title": "Synthesize state-level land acquisition compensation datasets", "status": "IN_PROGRESS", "assignee": "Meera Patel"},
                    {"id": 3, "title": "Model ecological buffer scenarios in Policy Lab", "status": "TODO", "assignee": "Dr. Roy"}
                ],
                "comments": [
                    {"author": "Dr. Roy", "date": "2026-09-28", "text": "Satellite change detection for 2018-2024 completed. Marked 42% drop in peri-urban retention ponds."},
                    {"author": "Prof. Sharma", "date": "2026-09-29", "text": "Cadastral ground-truthing in Anekal taluka scheduled for next week."}
                ],
                "findings": [
                    "Conversion rates are 3.4x higher along planned arterial ring roads prior to formal master plan notification.",
                    "Informal real estate transactions exploit lag between gram panchayat approval and municipal town planning."
                ],
                "policy_outputs": [
                    "Draft Guidelines for State Revenue Departments on Peri-Urban Master Planning Overlays."
                ],
                "document_ids": [1, 3],
                "dataset_ids": [1, 3]
            },
            {
                "title": "Drone Cadastral Survey Impact Assessment in Central Indian Rural Clusters",
                "description": "Longitudinal audit examining SVAMITVA property card distribution, formal bank mortgage access, and civil litigation rates across 200 villages.",
                "lead_name": "Dr. Ramesh Chandra",
                "members": [
                    {"name": "Dr. Ramesh Chandra", "role": "Principal Investigator", "institution": "CLGP"},
                    {"name": "Dr. Pratibha Joshi", "role": "Rural Credit Specialist", "institution": "IGIDR"}
                ],
                "status": "ACTIVE",
                "topic": "Digital Cadastre & Property Rights",
                "region": "Uttar Pradesh",
                "research_questions": [
                    "What percentage of property card recipients successfully leverage titles for institutional agricultural and micro-enterprise loans?",
                    "Does digital boundary recording permanently eliminate boundary encroachment litigation?"
                ],
                "tasks": [
                    {"id": 1, "title": "Survey 1,200 rural households in Western UP", "status": "IN_PROGRESS", "assignee": "Dr. Chandra"},
                    {"id": 2, "title": "Analyze district court pendency reduction data", "status": "TODO", "assignee": "Dr. Joshi"}
                ],
                "comments": [
                    {"author": "Dr. Chandra", "date": "2026-09-27", "text": "Survey sampling validated with district magistrate offices."}
                ],
                "findings": [
                    "Civil court litigation over abadi plot boundaries dropped by 38% in surveyed villages."
                ],
                "policy_outputs": [
                    "Operational Guidance on Bank API Integration for SVAMITVA Property Cards."
                ],
                "document_ids": [2],
                "dataset_ids": [4, 5]
            }
        ]

        for pr_data in projects_data:
            pr = models.ResearchProject(**pr_data)
            db.add(pr)
        db.commit()

        print("[Seed] Seeding Innovation Hub...")
        innovation_data = [
            {
                "type": "RESEARCH_GRANT",
                "title": "National Land Governance Research Grant 2026–27",
                "organization": "Department of Land Resources & NITI Aayog",
                "theme": "AI & Satellite Remote Sensing for Peri-Urban Land Planning",
                "location": "All India",
                "status": "OPEN",
                "description": "Competitive grant funding up to INR 75 Lakhs for university research teams and policy institutions conducting empirical studies on climate-resilient spatial land use.",
                "deadline": "2026-11-30",
                "budget_or_prize": "INR 75 Lakhs (3 Awards)",
                "eligibility": "Accredited Indian Universities, IITs, IIMs, and Registered Public Policy Think Tanks",
                "contact_email": "grants@landgov.gov.in",
                "related_research": ["Dynamics of Rapid Peri-Urban Agricultural Land Conversion"],
                "related_datasets": ["National Land Use & Land Cover Spatial Grid (2018–2024)"]
            },
            {
                "type": "HACKATHON",
                "title": "National Cadastral AI & Automated Mutation Hackathon",
                "organization": "Survey of India & Ministry of Panchayati Raj",
                "theme": "Machine Learning for Automated Drone Orthophoto Parcel Extraction",
                "location": "Virtual / Hybrid (Grand Finale in New Delhi)",
                "status": "OPEN",
                "description": "National technology challenge calling developers and data scientists to build high-accuracy computer vision models for automated village abadi boundary delineation.",
                "deadline": "2026-10-31",
                "budget_or_prize": "INR 25 Lakhs Prize Pool + Incubation Opportunity",
                "eligibility": "Open to Indian developers, students, startups, and researchers",
                "contact_email": "hackathon@landgov.gov.in",
                "related_research": ["Evaluating the SVAMITVA Scheme"],
                "related_datasets": ["SVAMITVA Rural Cadastral Drone Survey & Property Card Issuance Ledger"]
            },
            {
                "type": "POLICY_CHALLENGE",
                "title": "Policy Innovation Challenge: Reforming Agricultural Land Leasing",
                "organization": "NITI Aayog Land Policy Cell",
                "theme": "Model State Legislation for Formalized Oral Tenancy Contracts",
                "location": "Pan-India",
                "status": "OPEN",
                "description": "Inviting actionable state-specific policy briefs that propose legal frameworks to protect tenant farmer credit access while guaranteeing landowner title security.",
                "deadline": "2026-12-15",
                "budget_or_prize": "INR 15 Lakhs Fellowship & Presentation to Ministerial Committee",
                "eligibility": "Legal scholars, agricultural economists, and state administrative officers",
                "contact_email": "policychallenge@landgov.gov.in",
                "related_research": ["Reforming Agricultural Tenancy in India"],
                "related_datasets": ["State Revenue Courts Land Dispute Pendency & Resolution Timeline Audit"]
            },
            {
                "type": "PILOT_PROJECT",
                "title": "Pilot: Automated Drone-Assisted Land Dispute Mediation Clinics",
                "organization": "State Government of Maharashtra & Tata Trusts",
                "theme": "Pre-Litigation Revenue Lok Adalat Using 3D Spatial Maps",
                "location": "Pune & Satara Districts (Maharashtra)",
                "status": "ACTIVE",
                "description": "Deploying mobile mediation clinics equipped with interactive digital maps to settle long-standing family land partition disputes before civil filing.",
                "deadline": "2026-12-31",
                "budget_or_prize": "INR 1.2 Crore Operational Pilot Budget",
                "eligibility": "District Revenue Administration & District Legal Services Authority",
                "contact_email": "pilot.pune@landgov.gov.in",
                "related_research": ["Evaluating the SVAMITVA Scheme"],
                "related_datasets": ["State Revenue Courts Land Dispute Pendency & Resolution Timeline Audit"]
            }
        ]

        for inv_data in innovation_data:
            inv = models.InnovationProject(**inv_data)
            db.add(inv)
        db.commit()

        print("[Seed] Seeding Policy Briefs...")
        from backend.app.services.brief_generator import brief_generator
        brief_data = brief_generator.generate_policy_brief(
            topic="Rapid Peri-Urban Agricultural Land Conversion and Ecological Buffer Protection",
            region_name="Karnataka",
            policy_info={"title": "Draft National Land Use Policy Framework"},
            dataset_info={"title": "National Land Use & Land Cover Spatial Grid (2018–2024)"},
            scenario_info=scenarios_data[0]
        )

        brief_obj = models.PolicyBrief(
            title=brief_data["title"],
            executive_summary=brief_data["executive_summary"],
            problem_statement=brief_data["problem_statement"],
            current_evidence=brief_data["current_evidence"],
            geographic_context=brief_data["geographic_context"],
            key_findings=brief_data["key_findings"],
            research_gaps=brief_data["research_gaps"],
            policy_options=brief_data["policy_options"],
            scenario_analysis=brief_data["scenario_analysis"],
            potential_impacts=brief_data["potential_impacts"],
            implementation_considerations=brief_data["implementation_considerations"],
            data_sources=brief_data["data_sources"],
            research_sources=brief_data["research_sources"],
            topic="Rapid Peri-Urban Agricultural Land Conversion",
            region_name="Karnataka",
            created_by_id=lead_user.id
        )
        db.add(brief_obj)
        db.commit()

        print("[Seed] Seeding Notifications...")
        notifications_data = [
            {
                "user_id": lead_user.id,
                "title": "Welcome to Anvaya Platform",
                "message": "The National Land Governance Research & Policy Innovation platform environment is fully operational.",
                "type": "INFO",
                "link": "/"
            },
            {
                "user_id": lead_user.id,
                "title": "New High-Priority Research Gap Identified",
                "message": "Research Gap 'Climate-Resilient Peri-Urban Land Governance' logged with 82% urban sprawl pressure.",
                "type": "GAP",
                "link": "/gap-finder"
            },
            {
                "user_id": lead_user.id,
                "title": "Policy Scenario Analysis Available",
                "message": "Scenario 'Maharashtra Peri-Urban Conservation 2030' completed analytical run in Policy Lab.",
                "type": "POLICY",
                "link": "/policy-lab"
            }
        ]

        for notif_in in notifications_data:
            notif = models.Notification(**notif_in)
            db.add(notif)
        db.commit()

        print("[Seed] Database seeding completed successfully with rich demonstration data!")

    except Exception as e:
        db.rollback()
        print(f"[Seed] Error during seeding: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
