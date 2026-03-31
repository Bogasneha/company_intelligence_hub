import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Calendar, Users, BrainCircuit, ClipboardList, Lightbulb, TrendingUp, Shield, Zap, Rocket, Target, Clock, AlertTriangle } from "lucide-react";
import { fetchCompanyShortById, fetchInnovXData } from "@/lib/supabaseData";

const importanceColors: Record<string, string> = {
  Critical: "bg-destructive/10 text-destructive",
  High: "bg-highlight/10 text-highlight",
  Medium: "bg-accent/10 text-accent",
};

const threatColors: Record<string, string> = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-highlight/10 text-highlight",
  Low: "bg-success/10 text-success",
};

const tierStyles: Record<string, { label: string; color: string; description: string }> = {
  "Tier 1": { label: "Foundational Innovation", color: "border-success/30 bg-success/5", description: "Practical, implementable projects" },
  "Tier 2": { label: "Advanced Innovation", color: "border-accent/30 bg-accent/5", description: "System-level, domain-heavy ideas" },
  "Tier 3": { label: "Breakthrough Research", color: "border-highlight/30 bg-highlight/5", description: "Visionary, AI-first, future-oriented" },
};

const CompanyInnovX = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { data: company, isLoading: isCompanyLoading } = useQuery({
    queryKey: ["companyShort", companyId],
    queryFn: () => fetchCompanyShortById(Number(companyId ?? 0)),
    enabled: !!companyId,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  const { data: innovxData, isLoading: isInnovxLoading } = useQuery({
    queryKey: ["innovx", companyId],
    queryFn: () => fetchInnovXData(Number(companyId ?? 0)),
    enabled: !!companyId,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  if (isCompanyLoading || isInnovxLoading) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Loading innovx data...</p></div>;
  }

  if (!company || !innovxData) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Company not found.</p></div>;
  }

  const tiers = ["Tier 1", "Tier 2", "Tier 3"] as const;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-border bg-card">
        <div className="flex items-center justify-between px-8 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary font-bold text-xs">
              {company.short_name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">{company.name}</h1>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{company.headquarters_address}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Est. {company.incorporation_year}</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{company.employee_size}</span>
              </div>
            </div>
          </div>
          <button onClick={() => navigate(`/companies/${companyId}`)} className="text-xs text-accent hover:underline">← Back to Profile</button>
        </div>
        <div className="flex gap-0 px-8">
          {[
            { to: `/companies/${companyId}/skills`, label: "Hiring Skill Sets", icon: BrainCircuit },
            { to: `/companies/${companyId}/hiring`, label: "Hiring Rounds", icon: ClipboardList },
            { to: `/companies/${companyId}/innovx`, label: "INNOVX", icon: Lightbulb },
          ].map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-medium transition-all ${isActive ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <item.icon className="h-3.5 w-3.5" />{item.label}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="px-8 py-6 space-y-10">
        {/* Industry Trends */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-bold text-foreground">Industry Trends</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {innovxData.industry_trends.map((trend, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">{trend.trend_name}</h3>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${importanceColors[trend.strategic_importance]}`}>
                    {trend.strategic_importance}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{trend.trend_description}</p>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">{trend.time_horizon_years}-year horizon</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {trend.impact_areas.map((area, ai) => (
                    <span key={ai} className="rounded bg-surface px-2 py-0.5 text-[10px] text-foreground/70 border border-border">{area}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Competitive Landscape */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-bold text-foreground">Competitive Landscape</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {innovxData.competitive_landscape.map((comp, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-foreground">{comp.competitor_name}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${threatColors[comp.threat_level]}`}>
                    {comp.threat_level} Threat
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">{comp.competitor_type}</p>
                <p className="text-xs text-foreground/80 mb-2"><span className="font-medium">Core:</span> {comp.core_strength}</p>
                <div className="rounded-lg bg-surface p-3 border border-border/50">
                  <p className="text-xs font-semibold text-foreground mb-1">{comp.bet_name}</p>
                  <p className="text-[10px] text-muted-foreground">{comp.bet_description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Strategic Pillars */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-bold text-foreground">Strategic Pillars</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {innovxData.strategic_pillars.map((pillar, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-accent" />
                  <h3 className="text-sm font-semibold text-foreground">{pillar.pillar_name}</h3>
                </div>
                <span className="inline-block rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent mb-2">{pillar.focus_area}</span>
                <p className="text-xs text-muted-foreground mb-3">{pillar.pillar_description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {pillar.key_technologies.map((tech, ti) => (
                    <span key={ti} className="rounded bg-primary/5 px-2 py-0.5 text-[10px] text-foreground/80 border border-primary/10">{tech}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <AlertTriangle className="h-3 w-3" /> Risk: {pillar.strategic_risks}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Innovation Projects */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Rocket className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-bold text-foreground">Student Innovation Projects</h2>
          </div>

          {tiers.map((tier) => {
            const style = tierStyles[tier];
            const projects = innovxData.innovx_projects.filter((p) => p.tier_level === tier);
            if (projects.length === 0) return null;

            return (
              <div key={tier} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tier === "Tier 1" ? "bg-success/10 text-success" : tier === "Tier 2" ? "bg-accent/10 text-accent" : "bg-highlight/10 text-highlight"}`}>
                    {tier}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{style.label}</h3>
                    <p className="text-[10px] text-muted-foreground">{style.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {projects.map((project, i) => (
                    <div key={i} className={`rounded-xl border p-5 ${style.color}`}>
                      <h4 className="text-sm font-semibold text-foreground mb-2">{project.project_name}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{project.problem_statement}</p>
                      <div className="space-y-2 text-xs">
                        <p><span className="font-medium text-foreground">Objective:</span> <span className="text-muted-foreground">{project.innovation_objective}</span></p>
                        <p><span className="font-medium text-foreground">Value:</span> <span className="text-muted-foreground">{project.business_value}</span></p>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {[...project.backend_technologies, ...project.ai_ml_technologies].map((tech, ti) => (
                          <span key={ti} className="rounded bg-card px-2 py-0.5 text-[10px] text-foreground/70 border border-border">{tech}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default CompanyInnovX;
