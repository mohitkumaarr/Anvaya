from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth & User Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]

class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    email: str
    full_name: str
    password: str
    role: Optional[str] = "RESEARCHER"
    organization: Optional[str] = "National Land Policy Institute"

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    organization: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Document Schemas ---
class DocumentOut(BaseModel):
    id: int
    title: str
    abstract: str
    doc_type: str
    authors: str
    institution: str
    publication_year: int
    state: str
    district: str
    topic: str
    tags: List[str] = []
    file_path: Optional[str] = None
    file_size: int = 0
    status: str
    ai_summary: Optional[str] = None
    key_findings: Optional[str] = None
    methodology: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class DocumentCreate(BaseModel):
    title: str
    abstract: str
    doc_type: str = "Research Paper"
    authors: str
    institution: str
    publication_year: int = 2024
    state: str = "All India"
    district: str = "National"
    topic: str = "Land Use & Urbanization"
    tags: List[str] = []

class DocumentChunkOut(BaseModel):
    id: int
    document_id: int
    chunk_index: int
    content: str
    page_number: int

    class Config:
        from_attributes = True

# --- Dataset Schemas ---
class DatasetOut(BaseModel):
    id: int
    title: str
    description: str
    source: str
    publication_year: int
    geographic_coverage: str
    variables: List[Dict[str, Any]] = []
    format: str
    last_updated: str
    tags: List[str] = []
    record_count: int
    download_url: Optional[str] = None
    sample_data: List[Dict[str, Any]] = []
    is_demo: bool = True

    class Config:
        from_attributes = True

# --- Region & Indicator Schemas ---
class LandIndicatorOut(BaseModel):
    id: int
    region_id: int
    year: int
    green_cover_pct: float
    urban_expansion_rate: float
    agricultural_land_pct: float
    forest_cover_pct: float
    climate_vulnerability_index: float
    infrastructure_score: float
    flood_risk_score: float
    land_dispute_cases: int
    peri_urban_conversion_rate: float

    class Config:
        from_attributes = True

class RegionOut(BaseModel):
    id: int
    code: str
    name: str
    type: str
    state_name: str
    capital_or_hq: str
    latitude: float
    longitude: float
    area_sq_km: float
    population_est: int
    geojson_feature: Optional[Dict[str, Any]] = None
    latest_indicator: Optional[LandIndicatorOut] = None

    class Config:
        from_attributes = True

# --- Policy Schemas ---
class PolicyOut(BaseModel):
    id: int
    code: str
    title: str
    ministry_or_dept: str
    year_enacted: int
    status: str
    scope: str
    summary: str
    objectives: Optional[str] = None
    land_use_planning_focus: float
    climate_resilience_focus: float
    environmental_protection_focus: float
    digital_governance_focus: float
    implementation_coverage_pct: float
    evidence_availability: str
    key_provisions: List[str] = []
    tags: List[str] = []

    class Config:
        from_attributes = True

class PolicyCompareRequest(BaseModel):
    policy_ids: List[int]

# --- Research Gap Schemas ---
class ResearchGapOut(BaseModel):
    id: int
    topic: str
    category: str
    research_concentration_level: str
    urban_expansion_pct: float
    land_use_planning_pct: float
    climate_resilience_pct: float
    social_displacement_pct: float
    geographic_gaps: List[str] = []
    temporal_gaps: List[str] = []
    dataset_gaps: List[str] = []
    existing_studies: List[Dict[str, Any]] = []
    relevant_policies: List[Dict[str, Any]] = []
    available_datasets: List[Dict[str, Any]] = []
    potential_research_questions: List[str] = []
    research_opportunity: Dict[str, Any] = {}

    class Config:
        from_attributes = True

# --- Policy Scenario Schemas ---
class PolicyScenarioCreate(BaseModel):
    title: str
    baseline_state: str = "Maharashtra"
    green_zone_target_pct: float = 20.0
    urban_dev_limit_pct: float = 15.0
    ag_protection_pct: float = 65.0
    infra_investment_cr: float = 5000.0
    climate_investment_cr: float = 2500.0
    land_conversion_threshold_pct: float = 5.0

class PolicyScenarioOut(BaseModel):
    id: int
    title: str
    user_id: Optional[int] = None
    baseline_state: str
    baseline_year: int
    green_zone_target_pct: float
    urban_dev_limit_pct: float
    ag_protection_pct: float
    infra_investment_cr: float
    climate_investment_cr: float
    land_conversion_threshold_pct: float
    simulation_results: Dict[str, Any]
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Policy Brief Schemas ---
class PolicyBriefCreate(BaseModel):
    title: str
    topic: str
    region_name: str
    policy_id: Optional[int] = None
    dataset_id: Optional[int] = None
    scenario_id: Optional[int] = None

class PolicyBriefOut(BaseModel):
    id: int
    title: str
    executive_summary: str
    problem_statement: str
    current_evidence: str
    geographic_context: str
    key_findings: List[str] = []
    research_gaps: List[str] = []
    policy_options: List[Dict[str, Any]] = []
    scenario_analysis: Dict[str, Any] = {}
    potential_impacts: Dict[str, Any] = {}
    implementation_considerations: Optional[str] = None
    data_sources: List[Dict[str, Any]] = []
    research_sources: List[Dict[str, Any]] = []
    topic: str
    region_name: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Research Project Schemas ---
class ResearchProjectCreate(BaseModel):
    title: str
    description: str
    topic: str = "Peri-Urban Land Governance"
    region: str = "Karnataka"
    research_questions: List[str] = []
    document_ids: List[int] = []
    dataset_ids: List[int] = []

class ResearchProjectOut(BaseModel):
    id: int
    title: str
    description: str
    lead_name: str
    members: List[Dict[str, str]] = []
    status: str
    topic: str
    region: str
    research_questions: List[str] = []
    tasks: List[Dict[str, Any]] = []
    comments: List[Dict[str, Any]] = []
    findings: List[str] = []
    policy_outputs: List[str] = []
    document_ids: List[int] = []
    dataset_ids: List[int] = []
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Innovation Schemas ---
class InnovationProjectOut(BaseModel):
    id: int
    type: str
    title: str
    organization: str
    theme: str
    location: str
    status: str
    description: str
    deadline: str
    budget_or_prize: str
    eligibility: str
    contact_email: str
    related_research: List[str] = []
    related_datasets: List[str] = []

    class Config:
        from_attributes = True

# --- Notification Schemas ---
class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    type: str
    read: bool
    link: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Copilot / AI Search Schemas ---
class CopilotQuery(BaseModel):
    query: str
    state_filter: Optional[str] = None
    topic_filter: Optional[str] = None

class SourceCitation(BaseModel):
    id: int
    title: str
    doc_type: str
    publication_year: int
    institution: str
    relevance_score: float
    snippet: str

class CopilotResponse(BaseModel):
    query: str
    ai_synthesis: str
    key_finding: str
    evidence_points: List[str]
    research_sources: List[SourceCitation]
    policy_sources: List[Dict[str, Any]]
    relevant_datasets: List[Dict[str, Any]]
    geographic_context: Dict[str, Any]
    suggested_follow_ups: List[str]
    is_fallback: bool = False
