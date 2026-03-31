import { NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Building2, BrainCircuit, ClipboardList, Lightbulb, Search, Settings, Bell } from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/companies", icon: Building2, label: "Companies" },
  { to: "/hiring-skills", icon: BrainCircuit, label: "Hiring Skill Sets" },
  { to: "/hiring-process", icon: ClipboardList, label: "Hiring Process" },
  { to: "/innovx", icon: Lightbulb, label: "INNOVX" },
];

export default function AppLayout() {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/": return "Dashboard";
      case "/companies": return "Companies";
      case "/hiring-skills": return "Hiring Skill Sets";
      case "/hiring-process": return "Hiring Process";
      case "/innovx": return "INNOVX";
      default: 
        if (location.pathname.startsWith("/companies/")) return "Company Details";
        return "Overview";
    }
  };

  return (
    <div className="flex min-h-screen bg-surface font-sans text-foreground">
      {/* Sidebar - Light Theme */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
        {/* Logo Area */}
        <div className="flex h-16 items-center gap-3 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-[15px] font-bold tracking-tight text-sidebar-foreground">SRM Research</h1>
          </div>
        </div>

        {/* Section Heading */}
        <div className="px-6 py-2 mt-2 text-xs font-semibold text-sidebar-muted">
          Main Menu
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 px-3 py-2 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={
                  `group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-200 ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`
                }
              >
                <item.icon className={`h-[18px] w-[18px] shrink-0 transition-colors ${isActive ? "text-sidebar-foreground" : "text-sidebar-muted group-hover:text-sidebar-foreground"}`} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / User Position Area */}
        <div className="p-4">
           <div className="px-2 py-2 mb-1 text-xs font-semibold text-sidebar-muted">Your position</div>
           <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-accent/50 cursor-pointer transition-colors">
              <div className="h-8 w-8 rounded-full bg-border flex items-center justify-center text-xs font-bold text-muted-foreground overflow-hidden">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Liam" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                 <p className="text-sm font-semibold text-sidebar-foreground">System Admin</p>
                 <p className="text-xs text-sidebar-muted">Analytics Lead</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 flex flex-col min-h-screen">
        
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-8 bg-surface/80 backdrop-blur-md mb-2">
           <div className="flex items-center gap-4">
              <h1 className="text-[22px] font-bold text-foreground">{getPageTitle()}</h1>
           </div>
           
           <div className="flex items-center gap-4">
              <button className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-card hover:text-foreground transition-colors border border-transparent hover:border-border">
                 <Bell className="h-4.5 w-4.5" />
              </button>
              <button className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-card hover:text-foreground transition-colors border border-transparent hover:border-border">
                 <Settings className="h-4.5 w-4.5" />
              </button>
           </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 animate-fade-in">
           <Outlet />
        </div>
      </main>
    </div>
  );
}
