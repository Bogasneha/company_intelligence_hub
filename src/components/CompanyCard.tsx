import { useNavigate } from "react-router-dom";
import { CompanyShort } from "@/lib/supabaseData";
import { MapPin } from "lucide-react";

interface CompanyCardProps {
  company: CompanyShort;
  className?: string;
}

export default function CompanyCard({ company, className = "" }: CompanyCardProps) {
  const navigate = useNavigate();

  // Mapping categories to badge colors resembling the reference image
  const getBadgeTheme = (category: string) => {
    switch (category) {
      case "Marquee": 
        return "bg-[#F3E8FF] text-[#7E22CE]"; // Purple
      case "SuperDream": 
        return "bg-[#DBEAFE] text-[#1D4ED8]"; // Blue
      case "Dream": 
        return "bg-[#D1FAE5] text-[#047857]"; // Emerald
      default: // Regular
        return "bg-[#F1F5F9] text-[#475569]"; // Slate
    }
  };

  const badgeTheme = getBadgeTheme(company.category);

  return (
    <div
      onClick={() => navigate(`/companies/${company.company_id}`)}
      className={`group flex flex-col rounded-[16px] border-2 border-[#F3D0D7] bg-white p-5 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 h-[200px] w-full ${className}`}
    >
      {/* Title & Badge Row */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[17px] font-bold text-[#0F172A] leading-tight line-clamp-1 flex-1">
          {company.name || company.short_name}
        </h3>
        <span className={`shrink-0 rounded-full py-1 px-3 text-[12px] font-medium leading-none ${badgeTheme}`}>
          {company.category === "SuperDream" ? "Super Dream" : company.category}
        </span>
      </div>

      {/* Description */}
      <p className="text-[14px] text-[#64748B] mt-3 line-clamp-2 leading-relaxed flex-1">
        {company.nature_of_company || "Explore comprehensive company insights, hiring metrics, and organizational workflows."}
      </p>

      {/* Icon Row (Simulating the 3-year horizon layout) */}
      <div className="flex items-center gap-2 mt-2 text-[13px] text-[#64748B]">
        <MapPin className="h-4 w-4 shrink-0 text-[#94A3B8]" />
        <span className="truncate">{company.headquarters_address || "Location Unavailable"}</span>
      </div>

      {/* Bottom Tags */}
      <div className="flex items-center gap-2 mt-4 shrink-0 overflow-hidden">
        <span className="rounded-md border border-[#E2E8F0] bg-white px-2.5 py-1 text-[12px] font-medium text-[#64748B] whitespace-nowrap">
          {company.employee_size ? `${company.employee_size} Emp.` : "Size N/A"}
        </span>
        <span className="rounded-md border border-[#E2E8F0] bg-white px-2.5 py-1 text-[12px] font-medium text-[#64748B] whitespace-nowrap">
           {company.incorporation_year ? `Est. ${company.incorporation_year}` : "Year N/A"}
        </span>
      </div>
    </div>
  );
}
