import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { BrainCircuit } from "lucide-react";
import { fetchCompaniesShort, fetchSkillLevels } from "@/lib/supabaseData";
import { useNavigate } from "react-router-dom";

// 🔥 Normalize function
const normalize = (str: string) =>
  str?.toLowerCase().replace(/[^a-z0-9]/g, "");

const COGNITIVE_MAP: Record<string, string> = {
  AS: "Analysis & Synthesis",
  AP: "Application",
  C: "Comprehension",
  K: "Knowledge",
  KW: "Knowledge",
  E: "Evaluation",
  EV: "Evaluation",
  CR: "Creation",
  CU: "Communication",
};

const HiringSkillsComparison = () => {
  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [page, setPage] = useState(0);

  // ✅ Fetch companies
  const { data: companies = [], isLoading: companiesLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompaniesShort,
  });

  // ✅ Fetch skills
  const { data: skillLevels = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["skillLevelsAll"],
    queryFn: fetchSkillLevels,
  });

  // ✅ Build skill map
  const companySkills = useMemo(() => {
    const skillSet = new Set<string>();
    const map: Record<string, Record<string, string>> = {};

    skillLevels.forEach((skillLevel) => {
      const key = normalize(skillLevel.company_name);
      const levels = skillLevel.skill_levels;

      Object.keys(levels).forEach((skill) => {
        const value = levels[skill];

        if (value && value !== "") {
          skillSet.add(skill);

          if (!map[key]) map[key] = {};

          map[key][skill] = value;
        }
      });
    });

    return {
      codes: Array.from(skillSet).sort(),
      map,
    };
  }, [skillLevels]);

  if (companiesLoading || jobsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading comparison data...
      </div>
    );
  }

  const paginatedCompanies = companies.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const totalPages = Math.ceil(companies.length / rowsPerPage) || 1;

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-card px-8 py-6">
        <div className="flex items-center gap-3 mb-1">
          <BrainCircuit className="h-5 w-5 text-accent" />
          <h1 className="text-xl font-bold text-foreground">
            Hiring Skill Sets
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Compare skill and round expectations
        </p>
      </div>

      <div className="px-8 py-6 space-y-6">
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="sticky left-0 bg-surface px-4 py-3 text-left font-semibold min-w-[200px]">
                  Company
                </th>

                {companySkills.codes.map((code) => (
                  <th key={code} className="px-3 py-3 text-center min-w-[120px]">
                    {code}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedCompanies.map((company, ci) => {
                const normalizedCompany = normalize(company.name);

                // 🔥 SMART MATCHING (FINAL FIX)
                const matchedKey = Object.keys(companySkills.map).find(
                  (key) =>
                    key.includes(normalizedCompany) ||
                    normalizedCompany.includes(key)
                );

                return (
                  <tr
                    key={company.company_id}
                    className={`border-b ${
                      ci % 2 !== 0 ? "bg-surface/30" : ""
                    } hover:bg-accent/5 cursor-pointer`}
                    onClick={() =>
                      navigate(`/companies/${company.company_id}/skills`)
                    }
                  >
                    <td className="sticky left-0 bg-card px-4 py-3 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 flex items-center justify-center rounded-md bg-primary/5 text-[10px] font-bold">
                          {company.short_name?.substring(0, 2).toUpperCase()}
                        </div>
                        <span>{company.short_name}</span>
                      </div>
                    </td>

                    {companySkills.codes.map((skillCode) => {
                      const rawVal = matchedKey ? companySkills.map[matchedKey]?.[skillCode] : null;
                      
                      let label = "";
                      if (rawVal) {
                        const match = String(rawVal).match(/^(\d+)(?:-([A-Z]+))?$/i);
                        if (match && match[2]) {
                          label = COGNITIVE_MAP[match[2].toUpperCase()] || "Unknown";
                        }
                      }

                      return (
                        <td key={skillCode} className="text-center px-3 py-3">
                          {rawVal ? (
                            <div className="flex flex-col items-center justify-center">
                               <span className="font-semibold text-foreground text-[12px]">{rawVal}</span>
                               {label && <span className="text-[9px] text-muted-foreground whitespace-nowrap">({label})</span>}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between">
          <p className="text-xs">
            Showing {page * rowsPerPage + 1}–
            {Math.min((page + 1) * rowsPerPage, companies.length)} of{" "}
            {companies.length}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              Previous
            </button>

            <span>Page {page + 1}</span>

            <button
              onClick={() =>
                setPage(Math.min(totalPages - 1, page + 1))
              }
              disabled={page >= totalPages - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiringSkillsComparison;