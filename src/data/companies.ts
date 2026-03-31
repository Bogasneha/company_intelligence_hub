export type CompanyCategory = "Marquee" | "SuperDream" | "Dream" | "Regular";

export interface CompanyShort {
  company_id: number;
  name: string;
  short_name: string;
  logo_url?: string;
  category: CompanyCategory;
  incorporation_year: number | string;
  nature_of_company: string;
  headquarters_address: string;
  employee_size: string;
  yoy_growth_rate?: string;
  operating_countries?: string;
  office_locations?: string;
}

export interface CompanyFull extends CompanyShort {
  overview_text?: string;
  office_count?: string;
  hiring_velocity?: string;
  employee_turnover?: string;
  avg_retention_tenure?: string;
  pain_points_addressed?: string;
  focus_sectors?: string;
  offerings_description?: string;
  top_customers?: string;
  core_value_proposition?: string;
  vision_statement?: string;
  mission_statement?: string;
  core_values?: string;
  unique_differentiators?: string;
  competitive_advantages?: string;
  key_competitors?: string;
  technology_partners?: string;
  website_url?: string;
  ceo_name?: string;
  key_leaders?: string;
  annual_revenue?: string;
  annual_profit?: string;
  valuation?: string;
  profitability_status?: string;
  key_investors?: string;
  tech_stack?: string;
  ai_ml_adoption_level?: string;
  r_and_d_investment?: string;
  work_culture_summary?: string;
  diversity_metrics?: string;
  remote_policy_details?: string;
  glassdoor_rating?: number;
  awards_recognitions?: string;
  linkedin_url?: string;
  twitter_handle?: string;
  social_media_followers?: number;
}
