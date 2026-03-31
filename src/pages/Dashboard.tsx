import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Building2, Crown, Star, Sparkles, Briefcase, TrendingUp, MapPin, Users, Calendar, ChevronRight, Search } from "lucide-react";
import { motion } from "framer-motion";

import CompanySearch from "@/components/CompanySearch";
import CompanyCard from "@/components/CompanyCard";
import { fetchCompaniesShort } from "@/lib/supabaseData";

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompaniesShort,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  const counts = useMemo(() => ({
    total: companies.length,
    Marquee: companies.filter((c) => c.category === "Marquee").length,
    SuperDream: companies.filter((c) => c.category === "SuperDream").length,
    Dream: companies.filter((c) => c.category === "Dream").length,
    Regular: companies.filter((c) => c.category === "Regular").length,
  }), [companies]);

  const filteredCompanies = companies;

  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center py-20 text-muted-foreground text-sm font-medium">
        Loading dashboard...
      </div>
    );
  }

  const cards = [
    { label: "Total Companies", count: counts.total, icon: Building2, category: undefined, badge: "All" },
    { label: "Marquee", count: counts.Marquee, icon: Crown, category: "Marquee", badge: "Premium" },
    { label: "Super Dream", count: counts.SuperDream, icon: Star, category: "SuperDream", badge: "Top Tier" },
    { label: "Dream", count: counts.Dream, icon: Sparkles, category: "Dream", badge: "High Tier" },
    { label: "Regular", count: counts.Regular, icon: Briefcase, category: "Regular", badge: "Standard" },
  ];

  return (
    <div className="px-8 pb-12 pt-4 space-y-6 max-w-7xl mx-auto w-full">

      {/* Hero Banner matching the image */}
      <div className="relative overflow-hidden rounded-[20px] bg-[#F5F0FF] px-8 py-10 border border-[#E9D5FF]">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-[#7C3AED]" />
            <span className="text-sm font-bold text-[#6D28D9]">Get started</span>
          </div>
          <h2 className="text-3xl font-bold text-[#1E1B4B] mb-3">
            Company Intelligence Hub
          </h2>
          <p className="text-[#4C1D95] mb-6 leading-relaxed max-w-md font-medium text-[15px]">
            Explore and analyze real-time hiring metrics, company profiles, and placement analytics perfectly organized for your workflow.
          </p>
          <button
            onClick={() => navigate("/companies")}
            className="flex items-center gap-2 rounded-xl bg-[#0F172A] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1E293B]"
          >
            Explore Directory
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

      </div>

      {/* Metric Cards - Minimal & Clean */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 leading-none">
        {cards.map((card) => (
          <button
            key={card.label}
            onClick={() => navigate(card.category ? `/companies?category=${card.category}` : "/companies")}
            className="group relative flex flex-col items-start rounded-2xl border-2 border-[#F3D0D7] bg-white p-6 text-left hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex w-full items-center justify-between mb-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F3D0D7]/40 text-[#7A3E4D] transition-colors">
                <card.icon className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-[#AAD9BB] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1c3625] transition-colors">
                {card.badge}
              </span>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-[36px] font-bold text-[#3D1821] leading-none">{card.count}</h3>
              <p className="text-[14px] font-semibold text-[#7A3E4D]/80">{card.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Search Bar - Inline */}
      <div className="w-full flex justify-center mt-2 mb-2">
        <div className="w-full rounded-[16px] border border-border bg-white p-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-[10px] bg-[#F4ECFF] flex items-center justify-center">
              <Search className="h-5 w-5 text-[#7C3AED]" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-[#1E1B4B]">
                Quick Access
              </h2>
              <p className="text-[13px] font-medium text-[#64748B]">
                Jump directly to a specific company
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full flex-1 md:max-w-2xl">
            <div className="flex-1 w-full min-w-[200px]">
              <CompanySearch
                companies={companies}
                placeholder="Search company (e.g., TCS)..."
              />
            </div>
            <button
              onClick={() => navigate("/companies")}
              className="shrink-0 flex items-center justify-center gap-2 rounded-xl bg-[#F8FAFC] px-5 py-2.5 text-[14px] font-bold text-[#475569] transition-all hover:bg-[#F1F5F9] border border-[#E2E8F0] h-[40px] md:h-[44px]"
            >
              View Directory
            </button>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="mt-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-bold text-foreground tracking-tight">
            Featured Companies
          </h2>
          <button onClick={() => navigate("/companies")} className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
            View all <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCompanies.slice(0, 20).map((company, i) => (
            <motion.div
              key={company.company_id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02, duration: 0.3 }}
              className="h-full flex"
            >
              <CompanyCard company={company} className="h-full" />
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
