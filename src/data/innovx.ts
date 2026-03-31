export interface IndustryTrend {
  trend_name: string;
  trend_description: string;
  time_horizon_years: number;
  trend_drivers: string[];
  impact_areas: string[];
  strategic_importance: "Critical" | "High" | "Medium";
}

export interface Competitor {
  competitor_name: string;
  competitor_type: string;
  core_strength: string;
  market_positioning: string;
  bet_name: string;
  bet_description: string;
  threat_level: "High" | "Medium" | "Low";
}

export interface InnovationProject {
  project_name: string;
  problem_statement: string;
  target_users: string;
  innovation_objective: string;
  tier_level: "Tier 1" | "Tier 2" | "Tier 3";
  differentiation_factor: string;
  aligned_pillar_names: string[];
  backend_technologies: string[];
  frontend_technologies: string[];
  ai_ml_technologies: string[];
  primary_use_case: string;
  business_value: string;
}

export interface StrategicPillar {
  pillar_name: string;
  pillar_description: string;
  focus_area: string;
  key_technologies: string[];
  strategic_risks: string;
}

export interface InnovXData {
  company_id: number;
  company_name: string;
  industry: string;
  industry_trends: IndustryTrend[];
  competitive_landscape: Competitor[];
  strategic_pillars: StrategicPillar[];
  innovx_projects: InnovationProject[];
}
