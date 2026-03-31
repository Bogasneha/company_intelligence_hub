import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Calendar, Users, BrainCircuit, ClipboardList, Lightbulb, Monitor, Code, Brain, UserCheck } from "lucide-react";
import { fetchCompanyShortById, fetchJobRoleDetails } from "@/lib/supabaseData";
import { skillSetLabels } from "@/data/hiringRounds"; // keep label map to render codes

const roundIcons: Record<string, React.ElementType> = {
  "Coding Test": Code,
  "Interview": Brain,
  "HR": UserCheck,
};

const CompanyHiring = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const { data: company, isLoading: isCompanyLoading } = useQuery({
    queryKey: ["companyShort", companyId],
    queryFn: () => fetchCompanyShortById(Number(companyId ?? 0)),
    enabled: !!companyId,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  const { data: hiringData, isLoading: isHiringLoading } = useQuery({
    queryKey: ["jobRole", companyId],
    queryFn: () => fetchJobRoleDetails(Number(companyId ?? 0)),
    enabled: !!companyId,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  if (isCompanyLoading || isHiringLoading) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Loading hiring data...</p></div>;
  }

  if (!company || !hiringData || !hiringData.job_role_json.job_role_details?.length) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Company not found.</p></div>;
  }

  const role = hiringData.job_role_json.job_role_details[0];

  return (
    <div className="min-h-screen">
      {/* Compact Header */}
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

      <div className="px-8 py-6 max-w-4xl">
        {/* Role info */}
        <div className="rounded-[24px] p-6 border border-white/40 mb-8 bg-[#e2eafc] text-[#1b2b5a]">
          <h2 className="text-[20px] font-bold tracking-tight mb-2">{role.role_title}</h2>
          <p className="text-[13px] leading-relaxed opacity-90 mb-5 max-w-3xl font-medium">{role.job_description}</p>
          <div className="flex flex-wrap gap-3">
            <span className="flex items-center gap-1.5 bg-white/50 backdrop-blur-sm rounded-full px-3.5 py-1.5 text-[12px] font-bold text-[#1b2b5a]">
               <span className="font-semibold opacity-70">CTC:</span> ₹{(role.ctc_or_stipend / 100000).toFixed(1)} LPA
            </span>
            <span className="flex items-center gap-1.5 bg-white/50 backdrop-blur-sm rounded-full px-3.5 py-1.5 text-[12px] font-bold text-[#1b2b5a]">
               <span className="font-semibold opacity-70">Bonus:</span> {role.bonus}
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative pl-8">
          {/* Vertical line completely soft */}
          <div className="absolute left-[15px] top-0 h-full w-px bg-gray-200" />

          {role.hiring_rounds.map((round, i) => {
            const Icon = roundIcons[round.round_category] || Monitor;
            
            // The requested 4 colors in reverse order (Right to Left from the palette image)
            const reverseColors = [
              { bg: "bg-[#F3E1C5]", node: "bg-[#E6CBA3] text-[#694A1F]", badge: "bg-white/60 text-[#856535]" }, // Soft Peach
              { bg: "bg-[#FBF7E2]", node: "bg-[#EAE1AE] text-[#6C601E]", badge: "bg-white/60 text-[#877A31]" }, // Cream
              { bg: "bg-[#E0E8CB]", node: "bg-[#C4D1A6] text-[#425222]", badge: "bg-white/60 text-[#596D31]" }, // Light Sage
              { bg: "bg-[#C0CFA6]", node: "bg-[#A2B583] text-[#2C381B]", badge: "bg-white/50 text-[#3F5128]" }, // Sage Green
            ];
            
            const theme = reverseColors[Math.min(i, reverseColors.length - 1)];

            return (
              <div key={round.round_number} className="relative mb-8 last:mb-0 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                {/* Node bubble */}
                <div className={`absolute -left-8 top-0 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold border-2 border-white ${theme.node}`}>
                  {round.round_number}
                </div>

                <div className={`rounded-[24px] p-6 border border-white/40 ${theme.bg}`}>
                  {/* Round header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`p-2 rounded-full bg-white/50`}>
                      <Icon className="h-4 w-4 opacity-70" />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-gray-800">{round.round_name}</h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm ${theme.badge}`}>{round.round_category}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm ${theme.badge}`}>{round.evaluation_type}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm ${theme.badge}`}>{round.assessment_mode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Skill sets */}
                  <div className="space-y-3 mt-4">
                    {round.skill_sets.map((skill) => (
                      <div key={skill.skill_set_code} className="rounded-xl bg-white/40 p-4 border border-white/20 backdrop-blur-sm">
                        <h4 className="text-[13px] font-bold text-gray-800 mb-2">
                          {skillSetLabels[skill.skill_set_code] || skill.skill_set_code}
                        </h4>
                        <div className="space-y-2 mt-3">
                          {skill.typical_questions.split(";").map((q, qi) => (
                            <p key={qi} className="text-[12px] font-medium text-gray-600 pl-3 border-l-2 border-black/10">
                              {q.trim()}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CompanyHiring;
