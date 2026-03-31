import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  MapPin, Calendar, Users, Globe, Briefcase, ExternalLink, BrainCircuit, ClipboardList, Lightbulb, CheckCircle, Activity, LayoutGrid 
} from "lucide-react";
import { fetchCompanyComplete } from "@/lib/supabaseData";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "business", label: "Business Model" },
  { id: "technology", label: "Technology" },
  { id: "financial", label: "Financials" },
  { id: "culture", label: "Culture" },
  { id: "talent", label: "Talent" },
  { id: "compensation", label: "Compensation & Benefits" },
  { id: "logistics", label: "Logistics" },
  { id: "operations", label: "Operations" },
  { id: "people", label: "People" },
  { id: "brand", label: "Brand" },
];

function MetricBlock({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-2.5 mb-2.5">
        <Icon className="h-4 w-4 text-[#28A6E3]" strokeWidth={2} />
        <p className="text-[11px] font-bold text-[#28A6E3] uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-[15px] font-medium text-[#475569] break-words">{value}</p>
    </div>
  );
}

function SplitList({ title, items, icon: Icon }: { title: string; items: string; icon: React.ElementType }) {
  const list = (items || "").split(";").filter(x => x.trim().length > 0);
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 h-full shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-[18px] w-[18px] text-[#28A6E3]" strokeWidth={2} />
        <h4 className="text-[12px] font-bold text-[#28A6E3] uppercase tracking-widest">{title}</h4>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {list.length > 0 ? list.map((item, i) => (
          <span key={i} className="rounded-full bg-[#f1f5f9] px-4 py-1.5 text-[13px] font-medium text-[#475569]">{item.trim()}</span>
        )) : <span className="text-[13px] font-medium text-slate-400">Not Available</span>}
      </div>
    </div>
  );
}

type FieldDef = { key: string; label: string; type: "metric" | "list" | "text" | "link" };
type SectionDef = { title: string; fields: FieldDef[] };
type TabDef = { id: string; sections: SectionDef[] };

const TABS_CONFIG: TabDef[] = [
  {
    id: "overview",
    sections: [
      {
        title: "Company Identity",
        fields: [
          { key: "overview_text", label: "Overview", type: "text" },
          { key: "nature_of_company", label: "Nature of Company", type: "metric" },
          { key: "vision_statement", label: "Vision Statement", type: "text" },
          { key: "mission_statement", label: "Mission Statement", type: "text" },
          { key: "core_values", label: "Core Values", type: "list" },
        ]
      },
      {
        title: "History & News",
        fields: [
          { key: "history_timeline", label: "History Timeline", type: "text" },
          { key: "recent_news", label: "Recent News", type: "text" },
          { key: "marketing_video_url", label: "Marketing Video", type: "link" },
          { key: "customer_testimonials", label: "Customer Testimonials", type: "text" },
        ]
      },
      {
        title: "Risk & Compliance",
        fields: [
          { key: "regulatory_status", label: "Regulatory Status", type: "list" },
          { key: "legal_issues", label: "Legal Issues", type: "text" },
          { key: "esg_ratings", label: "ESG Ratings", type: "list" },
          { key: "supply_chain_dependencies", label: "Supply Chain", type: "list" },
          { key: "geopolitical_risks", label: "Geopolitical Risks", type: "text" },
          { key: "macro_risks", label: "Macro Risks", type: "text" },
          { key: "carbon_footprint", label: "Carbon Footprint", type: "metric" },
          { key: "ethical_sourcing", label: "Ethical Sourcing", type: "text" },
        ]
      }
    ]
  },
  {
    id: "business",
    sections: [
      {
        title: "Value Proposition",
        fields: [
          { key: "pain_points_addressed", label: "Pain Points Addressed", type: "list" },
          { key: "core_value_proposition", label: "Core Value Proposition", type: "text" },
          { key: "offerings_description", label: "Offerings", type: "list" },
          { key: "unique_differentiators", label: "Unique Differentiators", type: "list" },
          { key: "competitive_advantages", label: "Competitive Advantages", type: "list" },
        ]
      },
      {
        title: "Market Strategy",
        fields: [
          { key: "focus_sectors", label: "Focus Sectors", type: "list" },
          { key: "top_customers", label: "Top Customers", type: "list" },
          { key: "sales_motion", label: "Sales Motion", type: "text" },
          { key: "go_to_market_strategy", label: "Go-to-Market Strategy", type: "text" },
          { key: "customer_concentration_risk", label: "Customer Concentration Risk", type: "text" },
          { key: "industry_associations", label: "Industry Associations", type: "list" },
          { key: "case_studies", label: "Case Studies", type: "link" },
        ]
      },
      {
        title: "Competitive Landscape",
        fields: [
          { key: "key_competitors", label: "Key Competitors", type: "list" },
          { key: "market_share_percentage", label: "Market Share (%)", type: "metric" },
          { key: "benchmark_vs_peers", label: "Benchmark vs Peers", type: "text" },
          { key: "weaknesses_gaps", label: "Weaknesses & Gaps", type: "text" },
          { key: "key_challenges_needs", label: "Key Challenges", type: "text" },
        ]
      },
      {
        title: "Future Outlook",
        fields: [
          { key: "tam", label: "TAM", type: "metric" },
          { key: "sam", label: "SAM", type: "metric" },
          { key: "som", label: "SOM", type: "metric" },
          { key: "strategic_priorities", label: "Strategic Priorities", type: "list" },
          { key: "innovation_roadmap", label: "Innovation Roadmap", type: "text" },
          { key: "product_pipeline", label: "Product Pipeline", type: "text" },
          { key: "future_projections", label: "Future Projections", type: "text" },
          { key: "exit_strategy_history", label: "Exit Strategy / History", type: "text" },
        ]
      }
    ]
  },
  {
    id: "technology",
    sections: [
      {
        title: "Tech Ecosystem",
        fields: [
          { key: "tech_stack", label: "Tech Stack", type: "list" },
          { key: "technology_partners", label: "Technology Partners", type: "list" },
          { key: "partnership_ecosystem", label: "Partnership Ecosystem", type: "text" },
          { key: "tech_adoption_rating", label: "Tech Adoption Rating", type: "metric" },
        ]
      },
      {
        title: "Innovation & Security",
        fields: [
          { key: "ai_ml_adoption_level", label: "AI/ML Adoption Level", type: "metric" },
          { key: "r_and_d_investment", label: "R&D Investment", type: "metric" },
          { key: "intellectual_property", label: "Intellectual Property", type: "text" },
          { key: "cybersecurity_posture", label: "Cybersecurity Posture", type: "text" },
        ]
      }
    ]
  },
  {
    id: "financial",
    sections: [
      {
        title: "Revenue & Valuation",
        fields: [
          { key: "annual_revenue", label: "Annual Revenue", type: "metric" },
          { key: "annual_profit", label: "Annual Profit", type: "metric" },
          { key: "revenue_mix", label: "Revenue Mix", type: "text" },
          { key: "valuation", label: "Valuation", type: "metric" },
          { key: "yoy_growth_rate", label: "YoY Growth Rate", type: "metric" },
          { key: "profitability_status", label: "Profitability Status", type: "metric" },
        ]
      },
      {
        title: "Funding & Investment",
        fields: [
          { key: "key_investors", label: "Key Investors", type: "list" },
          { key: "recent_funding_rounds", label: "Recent Funding", type: "text" },
          { key: "total_capital_raised", label: "Total Capital Raised", type: "metric" },
        ]
      },
      {
        title: "Unit Economics",
        fields: [
          { key: "customer_acquisition_cost", label: "CAC", type: "metric" },
          { key: "customer_lifetime_value", label: "LTV", type: "metric" },
          { key: "cac_ltv_ratio", label: "CAC:LTV Ratio", type: "metric" },
          { key: "churn_rate", label: "Churn Rate", type: "metric" },
          { key: "net_promoter_score", label: "NPS", type: "metric" },
          { key: "burn_rate", label: "Burn Rate", type: "metric" },
          { key: "runway_months", label: "Runway (Months)", type: "metric" },
          { key: "burn_multiplier", label: "Burn Multiplier", type: "metric" },
        ]
      }
    ]
  },
  {
    id: "culture",
    sections: [
      {
        title: "Organizational Culture",
        fields: [
          { key: "work_culture_summary", label: "Work Culture", type: "text" },
          { key: "mission_clarity", label: "Mission Clarity", type: "metric" },
          { key: "manager_quality", label: "Manager Quality", type: "text" },
          { key: "psychological_safety", label: "Psychological Safety", type: "metric" },
          { key: "feedback_culture", label: "Feedback Culture", type: "text" },
        ]
      },
      {
        title: "Metrics & Well-being",
        fields: [
          { key: "diversity_metrics", label: "Diversity Metrics", type: "list" },
          { key: "diversity_inclusion_score", label: "D&I Score", type: "metric" },
          { key: "ethical_standards", label: "Ethical Standards", type: "metric" },
          { key: "sustainability_csr", label: "Sustainability / CSR", type: "metric" },
          { key: "crisis_behavior", label: "Crisis Behavior", type: "text" },
          { key: "burnout_risk", label: "Burnout Risk", type: "metric" },
          { key: "layoff_history", label: "Layoff History", type: "text" },
        ]
      }
    ]
  },
  {
    id: "talent",
    sections: [

      {
        title: "Talent Mobility",
        fields: [
          { key: "hiring_velocity", label: "Hiring Velocity", type: "metric" },
          { key: "employee_turnover", label: "Employee Turnover", type: "metric" },
          { key: "avg_retention_tenure", label: "Avg Retention Tenure", type: "metric" },
          { key: "internal_mobility", label: "Internal Mobility", type: "metric" },
          { key: "promotion_clarity", label: "Promotion Clarity", type: "metric" },
          { key: "exit_opportunities", label: "Exit Opportunities", type: "text" },
        ]
      },
      {
        title: "Learning & Growth",
        fields: [
          { key: "talent.training_spend", label: "Training Spend", type: "metric" },
          { key: "talent.onboarding_quality", label: "Onboarding Quality", type: "metric" },
          { key: "talent.learning_culture", label: "Learning Culture", type: "text" },
          { key: "talent.exposure_quality", label: "Exposure Quality", type: "text" },
          { key: "talent.mentorship_availability", label: "Mentorship", type: "text" },
          { key: "talent.skill_relevance", label: "Skill Relevance", type: "text" },
          { key: "talent.tools_access", label: "Tools Access", type: "text" },
          { key: "talent.role_clarity", label: "Role Clarity", type: "text" },
          { key: "talent.early_ownership", label: "Early Ownership", type: "metric" },
          { key: "talent.work_impact", label: "Work Impact", type: "text" },
          { key: "talent.execution_thinking_balance", label: "Execution vs Thinking", type: "text" },
          { key: "talent.automation_level", label: "Automation Level", type: "metric" },
          { key: "talent.cross_functional_exposure", label: "Cross-functional Exposure", type: "text" },
        ]
      }
    ]
  },
  {
    id: "compensation",
    sections: [
      {
        title: "Pay & Incentives",
        fields: [
          { key: "fixed_vs_variable_pay", label: "Fixed vs Variable Pay", type: "text" },
          { key: "bonus_predictability", label: "Bonus Predictability", type: "metric" },
          { key: "esops_incentives", label: "ESOPs / Incentives", type: "text" },
        ]
      },
      {
        title: "Benefits",
        fields: [
          { key: "leave_policy", label: "Leave Policy", type: "list" },
          { key: "health_support", label: "Health Support", type: "list" },
          { key: "family_health_insurance", label: "Family Health Insurance", type: "text" },
          { key: "relocation_support", label: "Relocation Support", type: "text" },
          { key: "lifestyle_benefits", label: "Lifestyle Benefits", type: "list" },
        ]
      }
    ]
  },
  {
    id: "logistics",
    sections: [
      {
        title: "Work Policies",
        fields: [
          { key: "remote_policy_details", label: "Remote Policy", type: "text" },
          { key: "typical_hours", label: "Typical Hours", type: "metric" },
          { key: "overtime_expectations", label: "Overtime Expectations", type: "metric" },
          { key: "weekend_work", label: "Weekend Work", type: "metric" },
          { key: "flexibility_level", label: "Flexibility Level", type: "metric" },
        ]
      }
    ]
  },
  {
    id: "operations",
    sections: [
      {
        title: "Office & Location",
        fields: [
          { key: "operating_countries", label: "Operating Countries", type: "list" },
          { key: "office_locations", label: "Office Locations", type: "list" },
          { key: "office_count", label: "Office Count", type: "metric" },
          { key: "location_centrality", label: "Location Centrality", type: "text" },
          { key: "public_transport_access", label: "Public Transport Access", type: "text" },
          { key: "cab_policy", label: "Cab Policy", type: "text" },
          { key: "airport_commute_time", label: "Airport Commute Time", type: "text" },
          { key: "office_zone_type", label: "Office Zone Type", type: "text" },
        ]
      },
      {
        title: "Safety & Infra",
        fields: [
          { key: "area_safety", label: "Area Safety", type: "text" },
          { key: "safety_policies", label: "Safety Policies", type: "text" },
          { key: "infrastructure_safety", label: "Infrastructure Safety", type: "text" },
          { key: "emergency_preparedness", label: "Emergency Preparedness", type: "text" },
        ]
      }
    ]
  },
  {
    id: "people",
    sections: [
      {
        title: "Leadership",
        fields: [
          { key: "ceo_name", label: "CEO Name", type: "metric" },
          { key: "ceo_linkedin_url", label: "CEO LinkedIn", type: "link" },
          { key: "key_leaders", label: "Key Leaders", type: "text" },
          { key: "board_members", label: "Board Members", type: "text" },
        ]
      },
      {
        title: "Networking",
        fields: [
          { key: "warm_intro_pathways", label: "Warm Intro Pathways", type: "text" },
          { key: "decision_maker_access", label: "Decision Maker Access", type: "text" },
          { key: "contact_person_name", label: "Contact Person", type: "metric" },
          { key: "contact_person_title", label: "Contact Title", type: "metric" },
          { key: "contact_person_email", label: "Contact Email", type: "metric" },
          { key: "contact_person_phone", label: "Contact Phone", type: "metric" },
          { key: "network_strength", label: "Network Strength", type: "text" },
          { key: "global_exposure", label: "Global Exposure", type: "text" },
          { key: "company_maturity", label: "Company Maturity", type: "metric" },
        ]
      }
    ]
  },
  {
      id: "brand",
      sections: [
      {
        title: "Brand & Reputation",
        fields: [
          { key: "brand.brand_value", label: "Brand Value", type: "text" },
          { key: "brand.client_quality", label: "Client Quality", type: "text" },
          { key: "brand.external_recognition", label: "External Recognition", type: "text" },
          { key: "awards_recognitions", label: "Awards & Recognitions", type: "list" },
          { key: "brand.brand_sentiment_score", label: "Brand Sentiment", type: "metric" },
          { key: "brand.event_participation", label: "Event Participation", type: "list" },
          { key: "brand.website_quality", label: "Website Quality", type: "text" },
          { key: "brand.website_rating", label: "Website Rating", type: "metric" },
          { key: "brand.website_traffic_rank", label: "Website Traffic Rank", type: "metric" },
          { key: "brand.social_media_followers", label: "Social Followers", type: "metric" },
          { key: "brand.glassdoor_rating", label: "Glassdoor Rating", type: "metric" },
          { key: "brand.indeed_rating", label: "Indeed Rating", type: "metric" },
          { key: "brand.google_rating", label: "Google Rating", type: "metric" },
        ]
      }
    ]
  }
];

function TabContent({ tabId, company }: { tabId: string; company: any }) {
  const tabConfig = TABS_CONFIG.find((t) => t.id === tabId);
  if (!tabConfig) return null;

  const normalizeValue = (value: any) => {
    if (value === null || value === undefined || String(value).trim() === "" || ["Not Available", "Not Found", "N/A"].includes(String(value))) {
      return "Not Available";
    }
    return String(value);
  };

  const getValue = (obj: any, key: string) => {
    if (!key) return undefined;
    if (key.includes(".")) {
      return key.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), obj);
    }
    return obj?.[key];
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {tabConfig.sections.map((section, sIdx) => {
        const visibleFields = section.fields; // keep all fields for consistent UX

        const metrics = visibleFields.filter(f => f.type === "metric");
        const links = visibleFields.filter(f => f.type === "link");
        const lists = visibleFields.filter(f => f.type === "list");
        const texts = visibleFields.filter(f => f.type === "text");

        return (
          <div key={sIdx} className="space-y-4">
            <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-widest border-b border-gray-200 pb-3 mb-5">
              {section.title}
            </h3>
            
            {metrics.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {metrics.map(f => (
                  <MetricBlock key={f.key} icon={Activity} label={f.label} value={normalizeValue(getValue(company, f.key))} />
                ))}
              </div>
            )}
            
            {links.length > 0 && (
               <div className="flex flex-wrap gap-3 mt-4">
                 {links.map(f => {
                   const val = normalizeValue(getValue(company, f.key));
                   return (
                      <a
                        key={f.key}
                        href={val === "Not Available" ? undefined : val}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-2xl border border-[#fda4af] bg-white px-5 py-2.5 text-[14px] font-bold text-[#f04c63] hover:border-[#fca5a5] hover:shadow-sm transition-all"
                      >
                        <Globe className="h-[18px] w-[18px] text-[#f04c63]" strokeWidth={1.5} /> 
                        {f.label}: 
                        <span className="text-slate-500 font-medium truncate max-w-[200px] pl-1">{val}</span> 
                        <ExternalLink className="h-3.5 w-3.5 ml-2 text-[#f04c63]" strokeWidth={1.5} />
                      </a>
                   );
                 })}
               </div>
            )}

            {lists.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 items-stretch">
                {lists.map(f => (
                  <SplitList key={f.key} title={f.label} items={normalizeValue(company[f.key])} icon={LayoutGrid} />
                ))}
              </div>
            )}

            {texts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-stretch">
                {texts.map(f => (
                  <div key={f.key} className="rounded-2xl border border-slate-100 bg-white p-6 h-full shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-2 mb-4">
                       <CheckCircle className="h-[18px] w-[18px] text-[#28A6E3]" strokeWidth={2} />
                       <h4 className="text-[12px] font-bold text-[#28A6E3] uppercase tracking-widest">{f.label}</h4>
                    </div>
                    <p className="text-[14px] leading-relaxed font-medium text-[#475569] whitespace-pre-wrap">
                      {normalizeValue(getValue(company, f.key))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const CompanyDetail = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: company, isLoading } = useQuery<any>({
    queryKey: ["companyFull", companyId],
    queryFn: () => fetchCompanyComplete(Number(companyId ?? 0)),
    enabled: !!companyId,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  const compDb = company || {};
  const cBusi = compDb.company_business?.[0] || compDb.company_business || {};
  const cTech = compDb.company_technologies?.[0] || compDb.company_technologies || compDb.company_technology?.[0] || {};
  const cFin = compDb.company_financials?.[0] || compDb.company_financials || {};
  const cCult = compDb.company_culture?.[0] || compDb.company_culture || {};
  const cComp = compDb.company_compensation?.[0] || compDb.company_compensation || {};
  const cLogi = compDb.company_logistics?.[0] || compDb.company_logistics || {};
  const cPeop = compDb.company_people?.[0] || compDb.company_people || {};
  const cTal = compDb.company_talent_growth?.[0] || compDb.company_talent_growth || {};
  const cBrand = compDb.company_brand_reputation?.[0] || compDb.company_brand_reputation || {};
  const cStage = compDb.staging_company?.[0] || compDb.staging_company || {};

  const formattedCompany = {
    ...compDb,
    ...cBusi,
    ...cTech,
    ...cFin,
    ...cCult,
    ...cComp,
    ...cLogi,
    ...cPeop,
    ...cStage,
    talent: cTal,
    brand: cBrand,
    staging: cStage,
    
    // Provide backwards compatibility for deeply nested arrays safely
    overview_text: compDb?.company_overview?.[0]?.overview_text || compDb.overview_text || cStage.overview_text,
    core_values: compDb?.company_core_values?.[0]?.core_values || compDb.core_values || cStage.core_values,
    awards_recognitions: compDb?.company_awards_recognitions?.[0]?.awards_recognitions || cBrand.awards_recognitions || cStage.awards_recognitions,
    
    // Main company relations
    logo_url: compDb?.company_logo?.[0]?.logo_url || compDb.logo_url || cStage.logo_url,
    operating_countries: compDb?.company_operating_countries_map?.[0]?.operating_countries || compDb.operating_countries || cStage.operating_countries,
    office_locations: compDb?.company_office_locations_map?.[0]?.office_locations || compDb.office_locations || cStage.office_locations,
    history_timeline: compDb?.company_history?.[0]?.history_timeline || compDb.history_timeline || cStage.history_timeline,
    recent_news: compDb?.company_recent_news?.[0]?.recent_news || compDb.recent_news || cStage.recent_news,
    customer_testimonials: compDb?.company_customer_testimonials?.[0]?.customer_testimonials || compDb.customer_testimonials || cStage.customer_testimonials,
    marketing_video_url: compDb?.company_marketing_videos?.[0]?.marketing_video_url || compDb.marketing_video_url || cStage.marketing_video_url,
    regulatory_status: compDb?.company_regulatory_status?.[0]?.regulatory_status || compDb.regulatory_status || cStage.regulatory_status,
    esg_ratings: compDb?.company_esg_ratings?.[0]?.esg_ratings || compDb.esg_ratings || cStage.esg_ratings,
    geopolitical_risks: compDb?.company_geopolitical_risks?.[0]?.geopolitical_risks || compDb.geopolitical_risks || cStage.geopolitical_risks,
    macro_risks: compDb?.company_macro_risks?.[0]?.macro_risks || compDb.macro_risks || cStage.macro_risks,
    ethical_sourcing: compDb?.company_ethical_sourcing?.[0]?.ethical_sourcing || compDb.ethical_sourcing || cStage.ethical_sourcing,
    supply_chain_dependencies: compDb?.company_supply_chain_dependencies?.[0]?.supply_chain_dependencies || compDb.supply_chain_dependencies || cStage.supply_chain_dependencies,
    event_participation: compDb?.company_event_participation?.[0]?.event_participation || cBrand.event_participation || cStage.event_participation,
    website_traffic_rank: compDb?.company_website_traffic_rank?.[0]?.website_traffic_rank || cBrand.website_traffic_rank || cStage.website_traffic_rank,
    
    // Business nested relations - extract from company_business relation
    business_model: cBusi.business_model || cStage.business_model,
    target_market: cBusi.target_market || cStage.target_market,
    market_positioning: cBusi.market_positioning || cStage.market_positioning,
    competitive_advantage: cBusi.competitive_advantage || cStage.competitive_advantage,
    pricing_strategy: cBusi.pricing_strategy || cStage.pricing_strategy,
    sales_channels: cBusi.sales_channels || cStage.sales_channels,
    distribution_channels: cBusi.distribution_channels || cStage.distribution_channels,
    customer_segments: cBusi.customer_segments || cStage.customer_segments,
    unique_differentiators: cBusi?.company_unique_differentiators?.[0]?.unique_differentiators || cBusi.unique_differentiators || cStage.unique_differentiators,
    focus_sectors: cBusi?.company_focus_sectors?.[0]?.focus_sectors || cBusi.focus_sectors || cStage.focus_sectors,
    offerings_description: cBusi?.company_offerings_description?.[0]?.offerings_description || cBusi.offerings_description || cStage.offerings_description,
    top_customers: cBusi?.company_top_customers?.[0]?.top_customers || cBusi.top_customers || cStage.top_customers,
    core_value_proposition: cBusi?.company_core_value_proposition?.[0]?.core_value_proposition || cBusi.core_value_proposition || cStage.core_value_proposition,
    competitive_advantages: cBusi?.company_competitive_advantages?.[0]?.competitive_advantages || cBusi.competitive_advantages || cStage.competitive_advantages,
    key_competitors: cBusi?.company_key_competitors?.[0]?.key_competitors || cBusi.key_competitors || cStage.key_competitors,
    pain_points_addressed: cBusi?.company_pain_points_addressed?.[0]?.pain_points_addressed || cBusi.pain_points_addressed || cStage.pain_points_addressed,
    industry_associations: cBusi?.company_industry_associations?.[0]?.industry_associations || cBusi.industry_associations || cStage.industry_associations,
    go_to_market_strategy: cBusi?.company_go_to_market_strategy?.[0]?.go_to_market_strategy || cBusi.go_to_market_strategy || cStage.go_to_market_strategy,
    market_share_percentage: cBusi?.company_market_share_percentage?.[0]?.market_share_percentage || cBusi.market_share_percentage || cStage.market_share_percentage,
    benchmark_vs_peers: cBusi?.company_benchmark_vs_peers?.[0]?.benchmark_vs_peers || cBusi.benchmark_vs_peers || cStage.benchmark_vs_peers,
    weaknesses_gaps: cBusi?.company_weaknesses_gaps?.[0]?.weaknesses_gaps || cBusi.weaknesses_gaps || cStage.weaknesses_gaps,
    key_challenges_needs: cBusi?.company_key_challenges_needs?.[0]?.key_challenges_needs || cBusi.key_challenges_needs || cStage.key_challenges_needs,
    tam: cBusi.tam || cStage.tam,
    sam: cBusi.sam || cStage.sam,
    som: cBusi.som || cStage.som,
    strategic_priorities: cBusi?.company_strategic_priorities?.[0]?.strategic_priorities || cBusi.strategic_priorities || cStage.strategic_priorities,
    product_pipeline: cBusi?.company_product_pipeline?.[0]?.product_pipeline || cBusi.product_pipeline || cStage.product_pipeline,
    exit_strategy_history: cBusi?.company_exit_strategy_history?.[0]?.exit_strategy_history || cBusi.exit_strategy_history || cStage.exit_strategy_history,
    
    // Compensation & Benefits nested relations - extract from company_compensation relation
    leave_policy: cComp?.company_leave_policy?.[0]?.leave_policy || cComp.leave_policy || cStage.leave_policy,
    health_support: cComp?.company_health_support?.[0]?.health_support || cComp.health_support || cStage.health_support,
    family_health_insurance: cComp?.company_family_health_insurance?.[0]?.family_health_insurance || cComp.family_health_insurance || cStage.family_health_insurance,
    relocation_support: cComp?.company_relocation_support?.[0]?.relocation_support || cComp.relocation_support || cStage.relocation_support,
    lifestyle_benefits: cComp?.company_lifestyle_benefits?.[0]?.lifestyle_benefits || cComp.lifestyle_benefits || cStage.lifestyle_benefits,
    fixed_vs_variable_pay: cComp.fixed_vs_variable_pay || cStage.fixed_vs_variable_pay,
    bonus_predictability: cComp.bonus_predictability || cStage.bonus_predictability,
    esops_incentives: cComp.esops_incentives || cStage.esops_incentives,
    
    // Technology nested relations - extract from company_technologies relation
    tech_stack: cTech?.company_tech_stack?.[0]?.tech_stack || cTech.tech_stack || cStage.tech_stack,
    technology_partners: cTech?.company_technology_partners?.[0]?.technology_partners || cTech.technology_partners || cStage.technology_partners,
    tech_adoption_rating: cTech?.company_tech_adoption_rating?.[0]?.tech_adoption_rating || cTech.tech_adoption_rating || cStage.tech_adoption_rating,
    partnership_ecosystem: cTech?.company_partnership_ecosystem?.[0]?.partnership_ecosystem || cTech.partnership_ecosystem || cStage.partnership_ecosystem,
    r_and_d_investment: cTech?.company_r_and_d_investment?.[0]?.r_and_d_investment || cTech.r_and_d_investment || cStage.r_and_d_investment,
    intellectual_property: cTech?.company_intellectual_property?.[0]?.intellectual_property || cTech.intellectual_property || cStage.intellectual_property,
    cybersecurity_posture: cTech?.company_cybersecurity_posture?.[0]?.cybersecurity_posture || cTech.cybersecurity_posture || cStage.cybersecurity_posture,
    ai_ml_adoption_level: cTech?.company_ai_ml_adoption_level?.[0]?.ai_ml_adoption_level || cTech.ai_ml_adoption_level || cStage.ai_ml_adoption_level,
    
    // Financial nested relations - extract from company_financials relation
    revenue_mix: cFin?.company_revenue_mix?.[0]?.revenue_mix || cFin.revenue_mix || cStage.revenue_mix,
    annual_profit: cFin?.company_annual_profit?.[0]?.annual_profit || cFin.annual_profit || cStage.annual_profit,
    total_capital_raised: cFin?.company_total_capital_raised?.[0]?.total_capital_raised || cFin.total_capital_raised || cStage.total_capital_raised,
    recent_funding_rounds: cFin?.company_recent_funding_rounds?.[0]?.recent_funding_rounds || cFin.recent_funding_rounds || cStage.recent_funding_rounds,
    key_investors: cFin?.company_key_investors?.[0]?.key_investors || cFin.key_investors || cStage.key_investors,
    customer_acquisition_cost: cFin?.company_customer_acquisition_cost?.[0]?.customer_acquisition_cost || cFin.customer_acquisition_cost || cStage.customer_acquisition_cost,
    customer_lifetime_value: cFin?.company_customer_lifetime_value?.[0]?.customer_lifetime_value || cFin.customer_lifetime_value || cStage.customer_lifetime_value,
    cac_ltv_ratio: cFin?.company_cac_ltv_ratio?.[0]?.cac_ltv_ratio || cFin.cac_ltv_ratio || cStage.cac_ltv_ratio,
    churn_rate: cFin?.company_churn_rate?.[0]?.churn_rate || cFin.churn_rate || cStage.churn_rate,
    net_promoter_score: cFin?.company_net_promoter_score?.[0]?.net_promoter_score || cFin.net_promoter_score || cStage.net_promoter_score,
    burn_rate: cFin?.company_burn_rate?.[0]?.burn_rate || cFin.burn_rate || cStage.burn_rate,
    runway_months: cFin?.company_runway_months?.[0]?.runway_months || cFin.runway_months || cStage.runway_months,
    burn_multiplier: cFin?.company_burn_multiplier?.[0]?.burn_multiplier || cFin.burn_multiplier || cStage.burn_multiplier,
    annual_revenue: cFin.annual_revenue || cStage.annual_revenue,
    valuation: cFin.valuation || cStage.valuation,
    yoy_growth_rate: cFin.yoy_growth_rate || cStage.yoy_growth_rate,
    profitability_status: cFin.profitability_status || cStage.profitability_status,
    
    // Talent Growth nested relations - extract from company_talent_growth relation
    work_culture_summary: cTal?.company_work_culture_summary?.[0]?.work_culture_summary || cTal.work_culture_summary || cStage.work_culture_summary,
    feedback_culture: cTal?.company_feedback_culture?.[0]?.feedback_culture || cTal.feedback_culture || cStage.feedback_culture,
    diversity_metrics: cTal?.company_diversity_metrics?.[0]?.diversity_metrics || cTal.diversity_metrics || cStage.diversity_metrics,
    diversity_inclusion_score: cTal?.company_diversity_inclusion_score?.[0]?.diversity_inclusion_score || cTal.diversity_inclusion_score || cStage.diversity_inclusion_score,
    ethical_standards: cTal?.company_ethical_standards?.[0]?.ethical_standards || cTal.ethical_standards || cStage.ethical_standards,
    sustainability_csr: cTal?.company_sustainability_csr?.[0]?.sustainability_csr || cTal.sustainability_csr || cStage.sustainability_csr,
    hiring_velocity: cTal?.company_hiring_velocity?.[0]?.hiring_velocity || cTal.hiring_velocity || cStage.hiring_velocity,
    employee_turnover: cTal?.company_employee_turnover?.[0]?.employee_turnover || cTal.employee_turnover || cStage.employee_turnover,
    avg_retention_tenure: cTal?.company_avg_retention_tenure?.[0]?.avg_retention_tenure || cTal.avg_retention_tenure || cStage.avg_retention_tenure,
    promotion_clarity: cTal?.company_promotion_clarity?.[0]?.promotion_clarity || cTal.promotion_clarity || cStage.promotion_clarity,
    exit_opportunities: cTal?.company_exit_opportunities?.[0]?.exit_opportunities || cTal.exit_opportunities || cStage.exit_opportunities,
    internal_mobility: cTal.internal_mobility || cStage.internal_mobility,
    training_spend: cTal.training_spend || cStage.training_spend,
    onboarding_quality: cTal.onboarding_quality || cStage.onboarding_quality,
    learning_culture: cTal.learning_culture || cStage.learning_culture,
    exposure_quality: cTal.exposure_quality || cStage.exposure_quality,
    mentorship_availability: cTal.mentorship_availability || cStage.mentorship_availability,
    skill_relevance: cTal.skill_relevance || cStage.skill_relevance,
    tools_access: cTal.tools_access || cStage.tools_access,
    role_clarity: cTal.role_clarity || cStage.role_clarity,
    early_ownership: cTal.early_ownership || cStage.early_ownership,
    work_impact: cTal.work_impact || cStage.work_impact,
    execution_thinking_balance: cTal.execution_thinking_balance || cStage.execution_thinking_balance,
    automation_level: cTal.automation_level || cStage.automation_level,
    cross_functional_exposure: cTal.cross_functional_exposure || cStage.cross_functional_exposure,
    
    // Global/Office related
    office_count: compDb?.company_global?.[0]?.office_count || compDb.office_count || cStage.office_count,
    
    // Additional missing fields - direct from main tables or need to be added to query
    nature_of_company: compDb.nature_of_company || cStage.nature_of_company,
    vision_statement: compDb.vision_statement || cStage.vision_statement,
    mission_statement: compDb.mission_statement || cStage.mission_statement,
    legal_issues: compDb.legal_issues || cStage.legal_issues,
    carbon_footprint: compDb.carbon_footprint || cStage.carbon_footprint,
    sales_motion: cBusi.sales_motion || cStage.sales_motion,
    customer_concentration_risk: cBusi.customer_concentration_risk || cStage.customer_concentration_risk,
    case_studies: cBusi.case_studies || cStage.case_studies,
    innovation_roadmap: cBusi.innovation_roadmap || cStage.innovation_roadmap,
    future_projections: cBusi.future_projections || cStage.future_projections,
    // Culture nested relations - extract from company_culture relation
    manager_quality: cCult.manager_quality || cStage.manager_quality,
    psychological_safety: cCult.psychological_safety || cStage.psychological_safety,
    crisis_behavior: cCult.crisis_behavior || cStage.crisis_behavior,
    burnout_risk: cCult.burnout_risk || cStage.burnout_risk,
    layoff_history: cCult.layoff_history || cStage.layoff_history,
    // Logistics nested relations - extract from company_logistics relation
    remote_policy_details: cLogi.remote_policy_details || cStage.remote_policy_details,
    typical_hours: cLogi.typical_hours || cStage.typical_hours,
    overtime_expectations: cLogi.overtime_expectations || cStage.overtime_expectations,
    weekend_work: cLogi.weekend_work || cStage.weekend_work,
    flexibility_level: cLogi.flexibility_level || cStage.flexibility_level,
    location_centrality: cLogi.location_centrality || cStage.location_centrality,
    public_transport_access: cLogi.public_transport_access || cStage.public_transport_access,
    cab_policy: cLogi.cab_policy || cStage.cab_policy,
    airport_commute_time: cLogi.airport_commute_time || cStage.airport_commute_time,
    office_zone_type: cLogi.office_zone_type || cStage.office_zone_type,
    area_safety: cLogi.area_safety || cStage.area_safety,
    safety_policies: cLogi.safety_policies || cStage.safety_policies,
    infrastructure_safety: cLogi.infrastructure_safety || cStage.infrastructure_safety,
    emergency_preparedness: cLogi.emergency_preparedness || cStage.emergency_preparedness,
    // People nested relations - extract from company_people relation
    ceo_name: cPeop.ceo_name || cStage.ceo_name,
    ceo_linkedin_url: cPeop.ceo_linkedin_url || cStage.ceo_linkedin_url,
    key_leaders: cPeop.key_leaders || cStage.key_leaders,
    board_members: cPeop.board_members || cStage.board_members,
    warm_intro_pathways: cPeop.warm_intro_pathways || cStage.warm_intro_pathways,
    decision_maker_access: cPeop.decision_maker_access || cStage.decision_maker_access,
    contact_person_name: cPeop.contact_person_name || cStage.contact_person_name,
    contact_person_title: cPeop.contact_person_title || cStage.contact_person_title,
    contact_person_email: cPeop.contact_person_email || cStage.contact_person_email,
    contact_person_phone: cPeop.contact_person_phone || cStage.contact_person_phone,
    network_strength: cPeop.network_strength || cStage.network_strength,
    global_exposure: cPeop.global_exposure || cStage.global_exposure,
    company_maturity: cPeop.company_maturity || cStage.company_maturity,
  };

  console.log("CompanyDetail formattedCompany compensation fields:", {
    leave_policy: formattedCompany.leave_policy,
    health_support: formattedCompany.health_support,
    family_health_insurance: formattedCompany.family_health_insurance,
    relocation_support: formattedCompany.relocation_support,
    lifestyle_benefits: formattedCompany.lifestyle_benefits,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading company data...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Company not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-30 border-b border-border bg-card">
        <div className="px-8 py-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/5 text-primary font-bold text-lg">
                {company.short_name ? company.short_name.substring(0, 2).toUpperCase() : "NA"}
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">{company.name}</h1>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {company.headquarters_address}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Est. {company.incorporation_year}</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {company.employee_size} employees</span>
                </div>
                {company.website_url && (
                  <div className="mt-2 text-xs">
                    <a href={company.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
                      <Globe className="h-3.5 w-3.5" /> {company.website_url}
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-8 pl-4">
              <button onClick={() => navigate(`/companies/${companyId}/skills`)} className="flex items-center gap-3 group transition-all duration-300">
                <div className="bg-[#f2f5ed] p-2.5 rounded-full group-hover:bg-[#e4ebd8] transition-colors">
                  <BrainCircuit className="h-[18px] w-[18px] text-[#A3B85D]" strokeWidth={2} /> 
                </div>
                <span className="text-[14px] font-bold text-[#5c6846] leading-tight text-left">Hiring Skill<br/>Sets</span>
              </button>
              <button onClick={() => navigate(`/companies/${companyId}/hiring`)} className="flex items-center gap-3 group transition-all duration-300">
                <div className="bg-[#f2f5ed] p-2.5 rounded-full group-hover:bg-[#e4ebd8] transition-colors">
                  <ClipboardList className="h-[18px] w-[18px] text-[#A3B85D]" strokeWidth={2} /> 
                </div>
                <span className="text-[14px] font-bold text-[#5c6846] leading-tight text-left">Hiring<br/>Process</span>
              </button>
              <button onClick={() => navigate(`/companies/${companyId}/innovx`)} className="flex items-center gap-3 group transition-all duration-300">
                <div className="bg-[#f2f5ed] p-2.5 rounded-full group-hover:bg-[#e4ebd8] transition-colors">
                  <Lightbulb className="h-[18px] w-[18px] text-[#A3B85D]" strokeWidth={2} /> 
                </div>
                <span className="text-[14px] font-bold text-[#5c6846] leading-tight text-left">INNOVX</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-0 px-8 overflow-x-auto scrollbar-thin">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 border-b-2 px-4 py-2.5 text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-6">
        <TabContent tabId={activeTab} company={formattedCompany} />
      </div>
    </div>
  );
};

export default CompanyDetail;

