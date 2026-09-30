export type UserRole = 'PUBLIC' | 'RESEARCHER' | 'POLICYMAKER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  organization: string;
  is_active: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole;
}

export interface DocumentItem {
  id: number;
  title: string;
  abstract: string;
  doc_type: 'Research Paper' | 'Policy Document' | 'Government Report' | 'Case Study' | 'Legal Document' | string;
  authors: string;
  institution: string;
  publication_year: number;
  state: string;
  district: string;
  topic: string;
  tags: string[];
  file_path?: string;
  file_size: number;
  status: 'APPROVED' | 'PENDING_REVIEW' | 'REJECTED';
  ai_summary?: string;
  key_findings?: string;
  methodology?: string;
  created_at?: string;
}

export interface DatasetItem {
  id: number;
  title: string;
  description: string;
  source: string;
  publication_year: number;
  geographic_coverage: string;
  variables: Array<{ name: string; type: string; desc: string }>;
  format: string;
  last_updated: string;
  tags: string[];
  record_count: number;
  download_url?: string;
  sample_data: any[];
  is_demo: boolean;
}

export interface LandIndicator {
  id: number;
  region_id: number;
  year: number;
  green_cover_pct: number;
  urban_expansion_rate: number;
  agricultural_land_pct: number;
  forest_cover_pct: number;
  climate_vulnerability_index: number;
  infrastructure_score: number;
  flood_risk_score: number;
  land_dispute_cases: number;
  peri_urban_conversion_rate: number;
}

export interface RegionItem {
  id: number;
  code: string;
  name: string;
  type: string;
  state_name: string;
  capital_or_hq: string;
  latitude: number;
  longitude: number;
  area_sq_km: number;
  population_est: number;
  latest_indicator?: LandIndicator;
}

export interface PolicyItem {
  id: number;
  code: string;
  title: string;
  ministry_or_dept: string;
  year_enacted: number;
  status: string;
  scope: string;
  summary: string;
  objectives?: string;
  land_use_planning_focus: number;
  climate_resilience_focus: number;
  environmental_protection_focus: number;
  digital_governance_focus: number;
  implementation_coverage_pct: number;
  evidence_availability: string;
  key_provisions: string[];
  tags: string[];
}

export interface ResearchGapItem {
  id: number;
  topic: string;
  category: string;
  research_concentration_level: 'HIGH' | 'MODERATE' | 'LOW';
  urban_expansion_pct: number;
  land_use_planning_pct: number;
  climate_resilience_pct: number;
  social_displacement_pct: number;
  geographic_gaps: string[];
  temporal_gaps: string[];
  dataset_gaps: string[];
  existing_studies: Array<{ title: string; authors: string }>;
  relevant_policies: Array<{ code: string; title: string }>;
  available_datasets: Array<{ title: string }>;
  potential_research_questions: string[];
  research_opportunity: {
    problem?: string;
    objectives?: string[];
    questions?: string[];
    required_data?: string;
    methodology?: string;
    expected_outcomes?: string;
  };
}

export interface PolicyScenarioItem {
  id: number;
  title: string;
  user_id?: number;
  baseline_state: string;
  baseline_year: number;
  green_zone_target_pct: number;
  urban_dev_limit_pct: number;
  ag_protection_pct: number;
  infra_investment_cr: number;
  climate_investment_cr: number;
  land_conversion_threshold_pct: number;
  simulation_results: any;
  created_at?: string;
}

export interface PolicyBriefItem {
  id: number;
  title: string;
  executive_summary: string;
  problem_statement: string;
  current_evidence: string;
  geographic_context: string;
  key_findings: string[];
  research_gaps: string[];
  policy_options: Array<{
    option: string;
    feasibility: string;
    timeline: string;
    fiscal_impact: string;
    description: string;
  }>;
  scenario_analysis: any;
  potential_impacts: any;
  implementation_considerations?: string;
  data_sources: Array<{ title: string; source: string; year: number }>;
  research_sources: Array<{ title: string; authors: string; year: number }>;
  topic: string;
  region_name: string;
  created_at?: string;
}

export interface ResearchProjectItem {
  id: number;
  title: string;
  description: string;
  lead_name: string;
  members: Array<{ name: string; role: string; institution: string }>;
  status: string;
  topic: string;
  region: string;
  research_questions: string[];
  tasks: Array<{ id: number; title: string; status: string; assignee: string }>;
  comments: Array<{ author: string; date: string; text: string }>;
  findings: string[];
  policy_outputs: string[];
  document_ids: number[];
  dataset_ids: number[];
  created_at?: string;
}

export interface InnovationItem {
  id: number;
  type: string;
  title: string;
  organization: string;
  theme: string;
  location: string;
  status: string;
  description: string;
  deadline: string;
  budget_or_prize: string;
  eligibility: string;
  contact_email: string;
  related_research: string[];
  related_datasets: string[];
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link: string;
  created_at?: string;
}

export interface CopilotResponse {
  query: string;
  ai_synthesis: string;
  key_finding: string;
  evidence_points: string[];
  research_sources: Array<{
    id: number;
    title: string;
    doc_type: string;
    publication_year: number;
    institution: string;
    relevance_score: number;
    snippet: string;
  }>;
  policy_sources: Array<{
    id: number;
    title: string;
    code: string;
    ministry: string;
    summary: string;
  }>;
  relevant_datasets: Array<{
    id: number;
    title: string;
    source: string;
    format: string;
    coverage: string;
  }>;
  geographic_context: any;
  suggested_follow_ups: string[];
  is_fallback: boolean;
}
