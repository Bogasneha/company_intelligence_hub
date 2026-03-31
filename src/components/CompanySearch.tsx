import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { CompanyShort } from "@/lib/supabaseData";

interface CompanySearchProps {
  companies?: CompanyShort[];
  placeholder?: string;
  onSelect?: (company: CompanyShort) => void;
  navigateOnSelect?: boolean;
  filterCategory?: string;
}

export default function CompanySearch({ companies = [], placeholder = "Search by company name...", onSelect, navigateOnSelect = true, filterCategory }: CompanySearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim() || !companies?.length) return [];
    let pool = companies;
    if (filterCategory && filterCategory !== "all") {
      pool = pool.filter(c => c.category === filterCategory);
    }
    return pool.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.short_name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);
  }, [query, filterCategory, companies]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (company: CompanyShort) => {
    setQuery("");
    setIsOpen(false);
    onSelect?.(company);
    if (navigateOnSelect) navigate(`/companies/${company.company_id}`);
  };

  return (
    <div ref={ref} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
        />
        {query && (
          <button onClick={() => { setQuery(""); setIsOpen(false); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {isOpen && query.trim() && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-card shadow-lg overflow-hidden">
          {filtered.length > 0 ? (
            filtered.map((c) => (
              <button
                key={c.company_id}
                onClick={() => handleSelect(c)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold text-xs">
                  {c.short_name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.headquarters_address}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  c.category === "Marquee" ? "bg-highlight/10 text-highlight" :
                  c.category === "SuperDream" ? "bg-accent/10 text-accent" :
                  c.category === "Dream" ? "bg-success/10 text-success" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {c.category}
                </span>
              </button>
            ))
          ) : (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">No companies found matching your search.</p>
          )}
        </div>
      )}
    </div>
  );
}
