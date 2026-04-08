import { supabase } from "@/lib/supabaseClient";

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

export interface InnovXData {
  company_id: number;
  company_name: string;
  industry: string;
  industry_trends?: any[];
  competitive_landscape?: any[];
  strategic_pillars?: any[];
  innovx_projects?: any[];
}

export interface JobRoleDetails {
  company_id: number;
  company_name: string;
  job_role_json: {
    job_role_details?: any[];
    [key: string]: any;
  };
}

export interface SkillLevels {
  company_id: number;
  skill_levels: Record<string, string>;
}

const safeString = (value: unknown): string => {
  if (typeof value === "string" && value.trim() !== "") return value;
  if (typeof value === "number") return String(value);
  return "Not Available";
};

const safeNumber = (value: unknown): number | undefined => {
  if (typeof value === "number") return value;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const mapCompanyShort = (company_id: number, doc: any): CompanyShort => ({
  company_id,
  name: safeString(doc?.name),
  short_name: safeString(doc?.short_name),
  logo_url: typeof doc?.logo_url === "string" ? doc.logo_url : undefined,
  category: (() => {
    const t = doc?.tier ? String(doc.tier).toLowerCase().replace(/[\s-_]/g, "") : "";
    if (t.includes("marquee")) return "Marquee";
    if (t.includes("superdream")) return "SuperDream";
    if (t === "dream" || t.includes("dream")) return "Dream";
    if (t.includes("regular")) return "Regular";
    return "Regular";
  })(),
  incorporation_year: doc?.incorporation_year ?? "Not Available",
  nature_of_company: safeString(doc?.nature_of_company),
  headquarters_address: safeString(doc?.headquarters_address),
  employee_size: safeString(doc?.employee_size),
  yoy_growth_rate: typeof doc?.yoy_growth_rate !== "undefined" ? String(doc.yoy_growth_rate) : "Not Available",
  operating_countries: typeof doc?.operating_countries === "string" ? doc.operating_countries : "Not Available",
  office_locations: typeof doc?.office_locations === "string" ? doc.office_locations : "Not Available",
});

const mapCompanyFull = (company_id: number, doc: any, shortDoc: any): CompanyFull => ({
  ...mapCompanyShort(company_id, shortDoc),
  overview_text: safeString(doc?.overview_text),
  office_count: safeString(doc?.office_count),
  hiring_velocity: safeString(doc?.hiring_velocity),
  employee_turnover: safeString(doc?.employee_turnover),
  avg_retention_tenure: safeString(doc?.avg_retention_tenure),
  pain_points_addressed: safeString(doc?.pain_points_addressed),
  focus_sectors: safeString(doc?.focus_sectors),
  offerings_description: safeString(doc?.offerings_description),
  top_customers: safeString(doc?.top_customers),
  core_value_proposition: safeString(doc?.core_value_proposition),
  vision_statement: safeString(doc?.vision_statement),
  mission_statement: safeString(doc?.mission_statement),
  core_values: safeString(doc?.core_values),
  unique_differentiators: safeString(doc?.unique_differentiators),
  competitive_advantages: safeString(doc?.competitive_advantages),
  key_competitors: safeString(doc?.key_competitors),
  technology_partners: safeString(doc?.technology_partners),
  website_url: safeString(doc?.website_url),
  ceo_name: safeString(doc?.ceo_name),
  key_leaders: safeString(doc?.key_leaders),
  annual_revenue: safeString(doc?.annual_revenue),
  annual_profit: safeString(doc?.annual_profit),
  valuation: safeString(doc?.valuation),
  profitability_status: safeString(doc?.profitability_status),
  key_investors: safeString(doc?.key_investors),
  tech_stack: safeString(doc?.tech_stack),
  ai_ml_adoption_level: safeString(doc?.ai_ml_adoption_level),
  r_and_d_investment: safeString(doc?.r_and_d_investment),
  work_culture_summary: safeString(doc?.work_culture_summary),
  diversity_metrics: safeString(doc?.diversity_metrics),
  remote_policy_details: safeString(doc?.remote_policy_details),
  glassdoor_rating: safeNumber(doc?.glassdoor_rating),
  awards_recognitions: safeString(doc?.awards_recognitions),
  linkedin_url: safeString(doc?.linkedin_url),
  twitter_handle: safeString(doc?.twitter_handle),
  social_media_followers: safeNumber(doc?.social_media_followers),
});

export async function fetchCompaniesShort(): Promise<CompanyShort[]> {
  const { data, error } = await supabase
    .from("companies")
    .select("company_id, name, short_name, tier, incorporation_year, nature_of_company, headquarters_address, employee_size")
    .order("company_id", { ascending: true });

  if (error) {
    console.error("Error fetching companies short:", error);
    return [];
  }

  if (!data) return [];

  return data.map((row: any) => mapCompanyShort(row.company_id, row));
}

export async function fetchCompanyShortById(company_id: number): Promise<CompanyShort | undefined> {
  const { data, error } = await supabase
    .from("companies")
    .select("company_id, name, short_name, tier, incorporation_year, nature_of_company, headquarters_address, employee_size")
    .eq("company_id", company_id)
    .single();

  if (error) {
    console.error("Error fetching company short by id:", error);
    return undefined;
  }

  if (!data) return undefined;

  return mapCompanyShort(data.company_id, data);
}

export async function fetchCompanyComplete(company_id: number) {
  const { data, error } = await supabase
    .from("companies")
    .select(`
      *,

      company_core_values(core_values),

      company_brand_reputation(*),

      company_business(
        *,
        company_unique_differentiators(unique_differentiators),
        company_core_value_proposition(core_value_proposition),
        company_focus_sectors(focus_sectors),
        company_offerings_description(offerings_description),
        company_top_customers(top_customers),
        company_competitive_advantages(competitive_advantages),
        company_key_competitors(key_competitors)
      ),

      company_compensation(*),
      company_culture(*),
      company_financials(*),
      company_logistics(*),
      company_people(*),
      company_talent_growth(*),
      company_technologies(*)
    `)
    .eq("company_id", company_id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  try {
    // Attempt to fetch staging_company separately since there's no FK relationship configured
    let stagingDb = null;
    
    // First try by companies column (since we saw that pattern)
    const { data: stageByName } = await supabase
      .from("staging_company")
      .select("*")
      .eq("companies", data.name)
      .maybeSingle();
      
    if (stageByName) {
      stagingDb = stageByName;
    } else {
      // Try by company_id
      const { data: stageById } = await supabase
        .from("staging_company")
        .select("*")
        .eq("company_id", company_id)
        .maybeSingle();
      stagingDb = stageById;
    }

    data.staging_company = stagingDb || {};
  } catch (err) {
    console.error("Error fetching staging_company", err);
    data.staging_company = {};
  }

  console.log("FULL DATA:", data);

  return data;
}
export async function fetchInnovXData(company_id: number): Promise<InnovXData | undefined> {
  const { data, error } = await supabase
    .from("innovx_json")
    .select("company_id, json_data")
    .eq("company_id", company_id)
    .single();

  if (error) {
    console.error("Error fetching innovx data by company id:", error);
    return undefined;
  }

  if (!data) return undefined;

  const doc = data.json_data;
  return {
    company_id: data.company_id,
    company_name: safeString(doc?.company_name ?? doc?.company_name),
    industry: safeString(doc?.industry ?? "Not Available"),
    industry_trends: Array.isArray(doc?.industry_trends) ? doc.industry_trends : [],
    competitive_landscape: Array.isArray(doc?.competitive_landscape) ? doc.competitive_landscape : [],
    strategic_pillars: Array.isArray(doc?.strategic_pillars) ? doc.strategic_pillars : [],
    innovx_projects: Array.isArray(doc?.innovx_projects) ? doc.innovx_projects : [],
  };
}

export async function fetchJobRoleDetails(company_id: number): Promise<JobRoleDetails | undefined> {
  const { data, error } = await supabase
    .from("job_role_details_json")
    .select("company_id, company_name, job_role_json")
    .eq("company_id", company_id)
    .single();

  if (error) {
    console.error("Error fetching job role details by company id:", error);
    return undefined;
  }

  if (!data) return undefined;

  return {
    company_id: data.company_id,
    company_name: data.company_name,
    job_role_json: data.job_role_json ?? {},
  };
}

export async function fetchSkillLevels(): Promise<any[]> {
  const { data, error } = await supabase
    .from("staging_company_skill_levels")
    .select("*");

  if (error) {
    console.error("Error fetching skill levels:", error);
    return [];
  }

  if (!data) return [];

  return data.map((row: any) => {
    const skill_levels: Record<string, string> = {};

    const skills = [
      "coding",
      "data_structures_and_algorithms",
      "object_oriented_programming_and_design",
      "aptitude_and_problem_solving",
      "communication_skills",
      "ai_native_engineering",
      "devops_and_cloud",
      "sql_and_design",
      "software_engineering",
      "system_design_and_architecture",
      "computer_networking",
      "operating_system",
    ];

    skills.forEach((skill) => {
      skill_levels[skill] = row[skill] || "";
    });

    return {
      company_name: row.companies, // 🔥 IMPORTANT
      skill_levels,
    };
  });
}

export async function fetchCompanySkillLevels(companyName: string): Promise<Record<string, string> | undefined> {
  const baseName = companyName.split(/[\s,]/)[0]; // e.g. "Healthgrades Operating Company, Inc." -> "Healthgrades"
  
  const { data, error } = await supabase
    .from("staging_company_skill_levels")
    .select("*")
    .ilike("companies", `%${baseName}%`)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching company skill levels:", error);
    return undefined;
  }

  if (!data) return undefined;

  const skill_levels: Record<string, string> = {};
  const skills = [
    "coding",
    "data_structures_and_algorithms",
    "object_oriented_programming_and_design",
    "aptitude_and_problem_solving",
    "communication_skills",
    "ai_native_engineering",
    "devops_and_cloud",
    "sql_and_design",
    "software_engineering",
    "system_design_and_architecture",
    "computer_networking",
    "operating_system",
  ];

  skills.forEach((skill) => {
    skill_levels[skill] = data[skill] || "0";
  });

  return skill_levels;
}