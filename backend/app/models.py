from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="RESEARCHER", nullable=False)  # PUBLIC, RESEARCHER, POLICYMAKER, ADMIN
    organization = Column(String(255), default="National Land Policy Institute")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    documents = relationship("Document", back_populates="uploader")
    scenarios = relationship("PolicyScenario", back_populates="user")
    briefs = relationship("PolicyBrief", back_populates="author")
    notifications = relationship("Notification", back_populates="user")


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), index=True, nullable=False)
    abstract = Column(Text, nullable=False)
    doc_type = Column(String(100), default="Research Paper", index=True)  # Research Paper, Policy Document, Government Report, Case Study, Legal Document
    authors = Column(String(500), default="National Research Group")
    institution = Column(String(255), default="Centre for Land Governance & Policy")
    publication_year = Column(Integer, default=2024, index=True)
    state = Column(String(100), index=True, default="All India")
    district = Column(String(100), default="National")
    topic = Column(String(200), index=True, default="Land Use & Urbanization")
    tags = Column(JSON, default=list)  # list of strings
    file_path = Column(String(500), nullable=True)
    file_size = Column(Integer, default=0)
    status = Column(String(50), default="APPROVED", index=True)  # APPROVED, PENDING_REVIEW, REJECTED
    ai_summary = Column(Text, nullable=True)
    key_findings = Column(Text, nullable=True)
    methodology = Column(Text, nullable=True)
    embedding = Column(JSON, nullable=True)  # JSON-encoded vector embedding
    uploader_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    uploader = relationship("User", back_populates="documents")
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    page_number = Column(Integer, default=1)
    embedding = Column(JSON, nullable=True)

    document = relationship("Document", back_populates="chunks")


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), index=True, nullable=False)
    description = Column(Text, nullable=False)
    source = Column(String(255), default="National Remote Sensing Centre / Ministry of Rural Development")
    publication_year = Column(Integer, default=2024)
    geographic_coverage = Column(String(255), default="India (Pan-National)")
    variables = Column(JSON, default=list)  # list of column descriptions
    format = Column(String(50), default="GeoJSON / CSV")
    last_updated = Column(String(50), default="2025-06")
    tags = Column(JSON, default=list)
    record_count = Column(Integer, default=1000)
    download_url = Column(String(500), nullable=True)
    sample_data = Column(JSON, default=list)
    is_demo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Region(Base):
    __tablename__ = "regions"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(200), index=True, nullable=False)
    type = Column(String(50), default="State")  # State, UT, District
    state_name = Column(String(200), index=True, default="")
    capital_or_hq = Column(String(200), default="")
    latitude = Column(Float, default=20.5937)
    longitude = Column(Float, default=78.9629)
    area_sq_km = Column(Float, default=0.0)
    population_est = Column(Integer, default=0)
    geojson_feature = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    indicators = relationship("LandIndicator", back_populates="region")


class LandIndicator(Base):
    __tablename__ = "land_indicators"

    id = Column(Integer, primary_key=True, index=True)
    region_id = Column(Integer, ForeignKey("regions.id"), nullable=False)
    year = Column(Integer, default=2024, index=True)
    green_cover_pct = Column(Float, default=24.5)
    urban_expansion_rate = Column(Float, default=3.2)  # annual pct growth
    agricultural_land_pct = Column(Float, default=54.2)
    forest_cover_pct = Column(Float, default=21.7)
    climate_vulnerability_index = Column(Float, default=0.55)  # 0 to 1
    infrastructure_score = Column(Float, default=68.0)  # 0 to 100
    flood_risk_score = Column(Float, default=45.0)  # 0 to 100
    land_dispute_cases = Column(Integer, default=1250)
    peri_urban_conversion_rate = Column(Float, default=5.4)

    region = relationship("Region", back_populates="indicators")


class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(500), index=True, nullable=False)
    ministry_or_dept = Column(String(255), default="Ministry of Rural Development / MoHUA")
    year_enacted = Column(Integer, default=2021)
    status = Column(String(50), default="ACTIVE")  # ACTIVE, UNDER_REVIEW, PROPOSED
    scope = Column(String(100), default="National")
    summary = Column(Text, nullable=False)
    objectives = Column(Text, nullable=True)
    land_use_planning_focus = Column(Float, default=80.0)  # 0 - 100 %
    climate_resilience_focus = Column(Float, default=65.0)
    environmental_protection_focus = Column(Float, default=70.0)
    digital_governance_focus = Column(Float, default=90.0)
    implementation_coverage_pct = Column(Float, default=72.0)
    evidence_availability = Column(String(100), default="High")  # High, Moderate, Low
    key_provisions = Column(JSON, default=list)
    tags = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)


class ResearchGap(Base):
    __tablename__ = "research_gaps"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String(500), index=True, nullable=False)
    category = Column(String(200), default="Peri-Urban Governance")
    research_concentration_level = Column(String(50), default="LOW")  # HIGH, MODERATE, LOW
    urban_expansion_pct = Column(Float, default=82.0)
    land_use_planning_pct = Column(Float, default=71.0)
    climate_resilience_pct = Column(Float, default=46.0)
    social_displacement_pct = Column(Float, default=21.0)
    geographic_gaps = Column(JSON, default=list)
    temporal_gaps = Column(JSON, default=list)
    dataset_gaps = Column(JSON, default=list)
    existing_studies = Column(JSON, default=list)
    relevant_policies = Column(JSON, default=list)
    available_datasets = Column(JSON, default=list)
    potential_research_questions = Column(JSON, default=list)
    research_opportunity = Column(JSON, default=dict)  # problem, objectives, questions, methodology, required_data, expected_outcomes
    created_at = Column(DateTime, default=datetime.utcnow)


class PolicyScenario(Base):
    __tablename__ = "policy_scenarios"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    baseline_state = Column(String(100), default="Maharashtra")
    baseline_year = Column(Integer, default=2024)
    green_zone_target_pct = Column(Float, default=20.0)
    urban_dev_limit_pct = Column(Float, default=15.0)
    ag_protection_pct = Column(Float, default=65.0)
    infra_investment_cr = Column(Float, default=5000.0)  # Crores
    climate_investment_cr = Column(Float, default=2500.0)  # Crores
    land_conversion_threshold_pct = Column(Float, default=5.0)
    simulation_results = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="scenarios")


class PolicyBrief(Base):
    __tablename__ = "policy_briefs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), index=True, nullable=False)
    executive_summary = Column(Text, nullable=False)
    problem_statement = Column(Text, nullable=False)
    current_evidence = Column(Text, nullable=False)
    geographic_context = Column(Text, nullable=False)
    key_findings = Column(JSON, default=list)
    research_gaps = Column(JSON, default=list)
    policy_options = Column(JSON, default=list)
    scenario_analysis = Column(JSON, default=dict)
    potential_impacts = Column(JSON, default=dict)
    implementation_considerations = Column(Text, nullable=True)
    data_sources = Column(JSON, default=list)
    research_sources = Column(JSON, default=list)
    topic = Column(String(200), default="Land Governance")
    region_name = Column(String(200), default="National")
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    author = relationship("User", back_populates="briefs")


class ResearchProject(Base):
    __tablename__ = "research_projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    lead_researcher_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    lead_name = Column(String(200), default="Dr. Ananya Roy")
    members = Column(JSON, default=list)
    status = Column(String(50), default="ACTIVE")  # ACTIVE, PLANNING, COMPLETED
    topic = Column(String(200), default="Peri-Urban Land Dynamics")
    region = Column(String(200), default="Karnataka")
    research_questions = Column(JSON, default=list)
    tasks = Column(JSON, default=list)
    comments = Column(JSON, default=list)
    findings = Column(JSON, default=list)
    policy_outputs = Column(JSON, default=list)
    document_ids = Column(JSON, default=list)
    dataset_ids = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)


class InnovationProject(Base):
    __tablename__ = "innovation_projects"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(100), default="RESEARCH_GRANT")  # RESEARCH_GRANT, HACKATHON, POLICY_CHALLENGE, PILOT_PROJECT, COLLABORATION
    title = Column(String(500), nullable=False)
    organization = Column(String(255), default="NITI Aayog / MoHUA")
    theme = Column(String(200), default="Digital Cadastral Mapping")
    location = Column(String(200), default="All India")
    status = Column(String(50), default="OPEN")  # OPEN, ACTIVE, EVALUATION, CLOSED
    description = Column(Text, nullable=False)
    deadline = Column(String(100), default="2026-11-30")
    budget_or_prize = Column(String(100), default="INR 50 Lakhs")
    eligibility = Column(String(255), default="Accredited Academic Institutions & Research Labs")
    contact_email = Column(String(255), default="innovation@landgov.gov.in")
    related_research = Column(JSON, default=list)
    related_datasets = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="INFO")  # INFO, DOCUMENT, PROJECT, POLICY, GAP
    read = Column(Boolean, default=False)
    link = Column(String(255), default="/")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")
