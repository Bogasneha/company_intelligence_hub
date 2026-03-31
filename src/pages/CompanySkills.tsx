import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Calendar, Users, BrainCircuit, ClipboardList, Lightbulb } from "lucide-react";
import { fetchCompanyShortById, fetchJobRoleDetails } from "@/lib/supabaseData";

const CompanySkills = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const { data: company, isLoading: isCompanyLoading } = useQuery({
    queryKey: ["companyShort", companyId],
    queryFn: () => fetchCompanyShortById(Number(companyId ?? 0)),
    enabled: !!companyId,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  const { data: jobRoleDetails, isLoading: isJobRoleLoading } = useQuery({
    queryKey: ["jobRole", companyId],
    queryFn: () => fetchJobRoleDetails(Number(companyId ?? 0)),
    enabled: !!companyId,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  if (isCompanyLoading || isJobRoleLoading) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Loading skill data...</p></div>;
  }

  if (!company || !jobRoleDetails || !jobRoleDetails.job_role_json.job_role_details?.length) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Company not found.</p></div>;
  }

  const role = jobRoleDetails.job_role_json.job_role_details[0];
  const rounds = Array.isArray(role?.hiring_rounds) ? role.hiring_rounds : [];

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
        {/* Sub-navigation */}
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

      {/* Skill Grid */}
      <div className="px-8 py-6">
        <div className="overflow-x-auto rounded-xl border border-border bg-card scrollbar-thin">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Round</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Evaluation</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Mode</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Skills</th>
              </tr>
            </thead>
            <tbody>
              {rounds.map((round: any, idx: number) => (
                <tr key={`${round.round_name || idx}-${idx}`} className={`border-b border-border last:border-0 ${idx % 2 === 0 ? "" : "bg-surface/50"}`}>
                  <td className="px-4 py-3 font-medium text-foreground">{round.round_name || "Not Available"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{round.round_category || "Not Available"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{round.evaluation_type || "Not Available"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{round.assessment_mode || "Not Available"}</td>
                  <td className="px-4 py-3">
                    {(round.skill_sets || []).map((skill: any, si: number) => (
                      <span key={`${skill.skill_set_code || si}-${si}`} className="mr-1 mb-1 inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-[10px] text-primary">{skill.skill_set_code || "Unknown"}</span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompanySkills;
