import { Lightbulb } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import CompanySearch from "@/components/CompanySearch";
import CompanyCard from "@/components/CompanyCard";
import { fetchCompaniesShort } from "@/lib/supabaseData";
import { useNavigate } from "react-router-dom";

const InnovXHome = () => {
  const navigate = useNavigate();
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompaniesShort,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading innovx companies...</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-card px-8 py-6">
        <div className="flex items-center gap-3 mb-1">
          <Lightbulb className="h-5 w-5 text-accent" />
          <h1 className="text-xl font-bold text-foreground">INNOVX</h1>
        </div>
        <p className="text-sm text-muted-foreground">Explore industry trends, innovation roadmaps, and student project ideas</p>
      </div>

      <div className="px-8 py-6 space-y-8">
        <div className="flex justify-center">
          <CompanySearch
            companies={companies}
            placeholder="Search for a company to explore its innovation landscape..."
            onSelect={(c) => navigate(`/companies/${c.company_id}/innovx`)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {companies.map((company, i) => (
            <div key={company.company_id} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }} onClick={() => navigate(`/companies/${company.company_id}/innovx`)}>
              <CompanyCard company={company} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InnovXHome;
