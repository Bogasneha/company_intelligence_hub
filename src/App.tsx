import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Companies from "@/pages/Companies";
import CompanyDetail from "@/pages/CompanyDetail";
import CompanySkills from "@/pages/CompanySkills";
import CompanyHiring from "@/pages/CompanyHiring";
import CompanyInnovX from "@/pages/CompanyInnovX";
import HiringSkillsComparison from "@/pages/HiringSkillsComparison";
import HiringProcessHome from "@/pages/HiringProcessHome";
import InnovXHome from "@/pages/InnovXHome";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const RealtimeSync = () => {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("realtime-json")
      .on("postgres_changes", { event: "*", schema: "public", table: "companies_json" }, () => qc.invalidateQueries(["companies"]))
      .on("postgres_changes", { event: "*", schema: "public", table: "innovx_json" }, () => qc.invalidateQueries(["innovx"]))
      .on("postgres_changes", { event: "*", schema: "public", table: "job_role_details_json" }, () => qc.invalidateQueries(["jobRole", "jobRoleAll"]))
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RealtimeSync />
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/:companyId" element={<CompanyDetail />} />
            <Route path="/companies/:companyId/skills" element={<CompanySkills />} />
            <Route path="/companies/:companyId/hiring" element={<CompanyHiring />} />
            <Route path="/companies/:companyId/innovx" element={<CompanyInnovX />} />
            <Route path="/hiring-skills" element={<HiringSkillsComparison />} />
            <Route path="/hiring-process" element={<HiringProcessHome />} />
            <Route path="/innovx" element={<InnovXHome />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
