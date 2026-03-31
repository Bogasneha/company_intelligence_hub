import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Building2, Filter } from "lucide-react";
import CompanySearch from "@/components/CompanySearch";
import CompanyCard from "@/components/CompanyCard";
import { fetchCompaniesShort, CompanyCategory, CompanyShort } from "@/lib/supabaseData";

const categories: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Marquee", value: "Marquee" },
  { label: "Super Dream", value: "SuperDream" },
  { label: "Dream", value: "Dream" },
  { label: "Regular", value: "Regular" },
];

const Companies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";
  const [search, setSearch] = useState("");

  const { data: companies = [], isLoading } = useQuery<CompanyShort[]>({
    queryKey: ["companies"],
    queryFn: fetchCompaniesShort,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  const filtered = useMemo(() => {
    let result = companies;
    if (categoryParam !== "all") {
      result = result.filter((c) => c.category === categoryParam);
    }
    if (search.trim()) {
      result = result.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.short_name.toLowerCase().includes(search.toLowerCase())
      );
    }
    return result;
  }, [companies, categoryParam, search]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card px-8 py-6">
        <div className="flex items-center gap-3 mb-1">
          <Building2 className="h-5 w-5 text-accent" />
          <h1 className="text-xl font-bold text-foreground">Companies</h1>
        </div>
        <p className="text-sm text-muted-foreground">Explore and discover recruiting companies</p>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Search + Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company by name..."
              className="h-10 w-full rounded-lg border border-border bg-card px-4 text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSearchParams(cat.value === "all" ? {} : { category: cat.value })}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${categoryParam === cat.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-muted-foreground">{filtered.length} companies found</p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {filtered.map((company, i) => (
            <div
              key={company.company_id}
              className="h-full"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <CompanyCard company={company} className="h-full" />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-sm text-muted-foreground">No companies found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
