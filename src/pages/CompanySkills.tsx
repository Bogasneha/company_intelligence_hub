import { useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Calendar, Users, BrainCircuit, ClipboardList, Lightbulb, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { fetchCompanyShortById, fetchCompanySkillLevels } from "@/lib/supabaseData";

const SKILL_DEFINITIONS: Record<string, { title: string, defaultBadge: string, description: string, roadmap: string[] }> = {
  software_engineering: {
    title: "Software Engineering",
    defaultBadge: "AS",
    description: "A broad understanding of the full software development lifecycle (SDLC), including requirements analysis, design, implementation, testing, deployment, and maintenance following standard methodologies.",
    roadmap: ["SDLC basics", "Requirements gathering", "Agile & Scrum methodologies", "Version control & Collaboration", "Software architecture principles", "Testing and Quality Assurance", "Deployment and CI/CD pipelines", "Maintenance & Refactoring", "Microservices implementation", "Enterprise software lifecycle management"]
  },
  aptitude_and_problem_solving: {
    title: "Aptitude and Problem Solving",
    defaultBadge: "AP",
    description: "The capacity for logical reasoning, quantitative analysis, and breaking down complex, ambiguous problems into solvable components.",
    roadmap: ["Basic logical reasoning", "Quantitative analysis", "Pattern recognition", "Deductive & inductive logic", "Analytical problem solving", "Complex algorithmic thinking", "Ambiguity resolution strategies", "Systems level problem deconstruction", "Advanced heuristics application", "Innovative lateral thinking"]
  },
  devops_and_cloud: {
    title: "DevOps and Cloud",
    defaultBadge: "AP",
    description: "Knowledge of practices that combine software development and IT operations (CI/CD, IaC, monitoring) and experience with cloud platforms (AWS, Azure, GCP) for deploying and managing applications.",
    roadmap: ["Linux fundamentals & Bash", "Networking & Security basics", "Containers (Docker)", "CI/CD principles (Jenkins, Actions)", "Infrastructure as Code (Terraform)", "Cloud provider fundamentals (AWS/Azure/GCP)", "Kubernetes orchestration", "Monitoring & Observability (Prometheus, Grafana)", "Advanced Cloud Architecture", "DevSecOps & SRE principles"]
  },
  sql_and_design: {
    title: "SQL and Database Design",
    defaultBadge: "AP",
    description: "Proficiency in structuring relational data models, writing complex SQL queries, optimizing index usage, and ensuring high data integrity and retrieval performance.",
    roadmap: ["Basic CRUD operations", "Joins and subqueries", "Normalization & ER modeling", "Indexes and performance", "Advanced functions & window functions", "Transactions & ACID properties", "Stored procedures & triggers", "Query optimization & execution plans", "Database replication & sharding", "Distributed database architectures"]
  },
  coding: {
    title: "Coding",
    defaultBadge: "AS",
    description: "Practical ability to write clean, efficient, and maintainable programmatic logic across various programming languages to build functional software solutions.",
    roadmap: ["Syntax and data types", "Control structures & loops", "Functions & scope", "Error handling & debugging", "Object-oriented paradigms", "File I/O & data parsing", "API consumption & JSON", "Asynchronous programming", "Design patterns application", "Performance profiling & optimization"]
  },
  data_structures_and_algorithms: {
    title: "Data Structures and Algorithms",
    defaultBadge: "C",
    description: "Deep understanding of fundamental data structures and common algorithmic paradigms to efficiently store data and optimize computational complexity.",
    roadmap: ["Arrays, Strings, & Pointers", "Stacks & Queues", "Linked Lists", "Sorting & Searching algorithms", "Trees & Binary Search Trees", "Hash Tables & Collision resolution", "Graphs & Traversal (BFS/DFS)", "Dynamic Programming fundamentals", "Advanced Graph Algorithms", "Heaps, Tries, & Complex structures"]
  },
  object_oriented_programming_and_design: {
    title: "Object Oriented Programming and Design",
    defaultBadge: "C",
    description: "Understanding and applying principles like inheritance, encapsulation, polymorphism, and abstraction to design robust software architectures.",
    roadmap: ["Object-oriented paradigm overview", "Constructors and destructors", "Inheritance concepts", "Composition vs inheritance", "SOLID principles", "Design patterns basics (Singleton, Factory)", "Advanced design patterns (Observer, Strategy, Decorator)", "Design for scalability and maintainability", "Domain-Driven Design basics", "Enterprise Architecture Patterns"]
  },
  communication_skills: {
    title: "Communication Skills",
    defaultBadge: "K",
    description: "The ability to articulate complex technical concepts clearly to both technical peers and non-technical stakeholders through written and verbal mediums.",
    roadmap: ["Clear written communication", "Active listening skills", "Technical documentation basics", "Cross-functional team collaboration", "Presenting technical concepts", "Conflict resolution mapping", "Stakeholder expectation management", "Public speaking & presentation", "Executive strategy briefing", "Crisis communication & mediation"]
  },
  ai_native_engineering: {
    title: "AI Native Engineering",
    defaultBadge: "AS",
    description: "Experience integrating generative AI, large language models, and machine learning primitives deeply into application architectures for augmented functionality.",
    roadmap: ["Machine learning basics", "NLP & Prompt engineering", "LLM integration (OpenAI API)", "Vector databases & Embeddings", "RAG (Retrieval-Augmented Generation)", "Fine-tuning & Model selection", "AI agent orchestration (LangChain)", "Multi-modal AI architectures", "AI model deployment & MLOps", "Autonomous AI system design"]
  },
  system_design_and_architecture: {
    title: "System Design and Architecture",
    defaultBadge: "E",
    description: "Designing scalable, highly-available, and distributed microservices architectures, handling load balancing, caching, and database sharding strategies.",
    roadmap: ["Client-Server architecture", "Performance & Scalability basics", "Load balancing strategies", "Caching mechanisms (Redis, Memcached)", "Database scaling & Sharding", "Asynchronous systems & Message queues", "Microservices & API Gateways", "Consistency & CAP theorem", "Distributed systems consensus", "Global scale system architecture"]
  },
  computer_networking: {
    title: "Computer Networking",
    defaultBadge: "K",
    description: "Understanding of OSI layers, TCP/IP protocols, DNS, HTTP/S, and network security mechanisms essential for building reliable internet applications.",
    roadmap: ["OSI Model & TCP/IP suite", "IP Addressing & Subnetting", "Routing & Switching fundamentals", "Application layer protocols (HTTP, DNS)", "Network Security basics (Firewalls, VPN)", "Transport layer mechanics (TCP/UDP)", "Software-Defined Networking (SDN)", "Cloud networking (VPCs, Transit Gateways)", "BGP & Internet routing", "Zero-trust network architecture"]
  },
  operating_system: {
    title: "Operating System",
    defaultBadge: "K",
    description: "Knowledge of process management, memory allocation, concurrency, multithreading, and file systems interacting closely with hardware layer constraints.",
    roadmap: ["OS architecture basics", "Process & Thread management", "CPU Scheduling algorithms", "Memory management & virtual memory", "Concurrency & synchronization", "Deadlock resolution", "File systems architecture", "I/O systems & Device drivers", "Virtualization & Hypervisors", "Distributed operating systems"]
  }
};

const COGNITIVE_MAP: Record<string, { label: string, color: string }> = {
  AS: { label: "Analysis & Synthesis", color: "amber" },
  AP: { label: "Application", color: "green" },
  C: { label: "Comprehension", color: "blue" },
  K: { label: "Knowledge", color: "purple" },
  KW: { label: "Knowledge", color: "purple" },
  E: { label: "Evaluation", color: "rose" },
  EV: { label: "Evaluation", color: "rose" },
  CR: { label: "Creation", color: "cyan" },
  CU: { label: "Communication", color: "blue" },
};

const getColorClasses = (color: string) => {
  if (color === 'amber') return 'text-amber-600 bg-amber-500/10';
  if (color === 'green') return 'text-green-600 bg-green-500/10';
  if (color === 'blue') return 'text-blue-600 bg-blue-500/10';
  if (color === 'rose') return 'text-rose-600 bg-rose-500/10';
  if (color === 'cyan') return 'text-cyan-600 bg-cyan-500/10';
  return 'text-purple-600 bg-purple-500/10'; 
};

const getProgressBarColor = (color: string) => {
  if (color === 'amber') return 'bg-amber-500';
  if (color === 'green') return 'bg-green-500';
  if (color === 'blue') return 'bg-blue-500';
  if (color === 'rose') return 'bg-rose-500';
  if (color === 'cyan') return 'bg-cyan-500';
  return 'bg-purple-500'; 
};

const CompanySkills = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  const { data: company, isLoading: isCompanyLoading } = useQuery({
    queryKey: ["companyShort", companyId],
    queryFn: () => fetchCompanyShortById(Number(companyId ?? 0)),
    enabled: !!companyId,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  const { data: skillLevels, isLoading: isSkillsLoading } = useQuery({
    queryKey: ["companySkillLevels", company?.name],
    queryFn: () => fetchCompanySkillLevels(company?.name ?? ""),
    enabled: !!company?.name,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  if (isCompanyLoading || isSkillsLoading) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Loading skill intelligence...</p></div>;
  }

  if (!company) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Company not found.</p></div>;
  }

  const skillsToDisplay = Object.keys(SKILL_DEFINITIONS);

  return (
    <div className="min-h-screen bg-surface pb-12">
      {/* Compact Header */}
      <div className="sticky top-16 z-30 border-b border-border bg-card shadow-sm">
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
            { to: `/companies/${companyId}/skills`, label: "Skill Intelligence", icon: BrainCircuit },
            { to: `/companies/${companyId}/hiring`, label: "Hiring Rounds", icon: ClipboardList },
            { to: `/companies/${companyId}/innovx`, label: "INNOVX", icon: Lightbulb },
          ].map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-medium transition-all ${isActive ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <item.icon className="h-3.5 w-3.5" />{item.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Skill Intelligence List Layout */}
      <div className="px-8 py-6 max-w-5xl">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
           
           <div className="space-y-6">
             {skillsToDisplay.map((skillKey) => {
               const def = SKILL_DEFINITIONS[skillKey];
               const isExpanded = expandedSkill === skillKey;
               
               // Parse dynamic score and cognitive badge directly from DB response (e.g. "6-AS")
               const rawScore = skillLevels ? skillLevels[skillKey] : undefined;
               let score = 5; 
               let dynamicBadge = def.defaultBadge;

               if (rawScore !== undefined && rawScore !== null && rawScore !== "") {
                 const match = String(rawScore).match(/^(\d+)(?:-([A-Z]+))?$/i);
                 if (match) {
                   score = parseInt(match[1], 10);
                   if (match[2]) {
                     dynamicBadge = match[2].toUpperCase();
                   }
                 } else {
                   const parsed = parseInt(rawScore, 10);
                   if (!isNaN(parsed)) score = parsed;
                 }
               }

               const cognitiveData = COGNITIVE_MAP[dynamicBadge] || { label: "Unknown", color: "purple" };

               return (
                 <div key={skillKey} className="border-b border-border pb-8 pt-2 last:border-0 relative group">
                   <div className="flex justify-between items-start mb-1.5">
                     <div className="flex items-center gap-2.5">
                       <h3 className="font-semibold text-[15px] text-foreground tracking-tight">{def.title}</h3>
                       <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${getColorClasses(cognitiveData.color)}`}>
                         {dynamicBadge}
                       </span>
                     </div>
                     <div className="text-right">
                       <span className="font-semibold text-sm text-foreground">{score}/10</span>
                     </div>
                   </div>
                   
                   <p className="text-[13px] text-muted-foreground mb-4 pr-16 leading-relaxed">
                     {def.description}
                   </p>
                   
                   <div className="flex justify-between items-end">
                     <div className="w-1/2 mt-1">
                        <p className="text-[11px] text-muted-foreground mb-1.5">
                          Cognitive Level: <span className="font-medium text-foreground">{dynamicBadge} ({cognitiveData.label})</span>
                        </p>
                        <div className="h-1 bg-secondary rounded-full w-full overflow-hidden">
                          <div className={`h-full rounded-full ${getProgressBarColor(cognitiveData.color)} transition-all duration-1000 ease-in-out`} style={{ width: `${(score/10)*100}%` }}></div>
                        </div>
                     </div>
                     
                     <div className="flex-shrink-0 text-right">
                        <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">Important</span>
                     </div>
                   </div>

                   {/* Expandable Topic Roadmap Section */}
                   {isExpanded && (
                     <div className="mt-8 pt-6 border-t border-border/40 animate-in slide-in-from-top-1 fade-in duration-200">
                       <div className="flex justify-center mb-6">
                         <div className="flex items-center gap-2 px-4 py-1.5 bg-surface border border-border rounded-full shadow-sm">
                           <div className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></div>
                           <span className="font-semibold text-xs text-foreground tracking-wide">Master all topics from Level 1 - {score}</span>
                         </div>
                       </div>
                       
                       <div className="flex flex-col gap-1.5 pl-4 max-w-4xl mx-auto">
                         {def.roadmap.map((topic, i) => {
                           const level = i + 1;
                           const isTarget = level === score;
                           const isBeyond = level > score;
                           
                           if (isTarget) {
                             return (
                               <div key={level} className="flex gap-4 items-center bg-green-50 justify-between border border-green-400 rounded-lg p-3 -ml-2 shadow-sm relative z-10 transition-all hover:-translate-y-0.5">
                                 <div className="flex items-center gap-4">
                                   <div className="flex shrink-0 w-[24px] h-[24px] items-center justify-center rounded-full bg-green-500 text-white font-bold text-[11px] shadow-sm">
                                      {level}
                                   </div>
                                   <div className="flex flex-col">
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-xs font-semibold text-foreground/90">Level {level} &ndash; {topic}</span>
                                        <span className="bg-green-500 text-white text-[8px] font-bold px-1.5 py-[2px] rounded tracking-wider shadow-sm">REQUIRED</span>
                                      </div>
                                      <span className="text-[10px] text-muted-foreground/80 leading-snug">{topic}</span>
                                   </div>
                                 </div>
                               </div>
                             );
                           }
                           
                           if (isBeyond) {
                             return (
                               <div key={level} className="flex gap-4 items-center p-2.5 opacity-40 grayscale hover:grayscale-0 transition-all relative z-0">
                                 <div className="flex shrink-0 w-[24px] h-[24px] items-center justify-center rounded-full border border-border/80 bg-surface text-muted-foreground shadow-sm">
                                    <Lock className="h-3 w-3" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-xs font-medium text-muted-foreground">Level {level} &ndash; {topic}</span>
                                    <span className="text-[10px] text-muted-foreground/60 italic">Beyond current requirements</span>
                                 </div>
                               </div>
                             );
                           }
                           
                           return (
                             <div key={level} className="flex gap-4 items-center p-2.5 transition-colors hover:bg-surface/50 rounded-md relative z-0">
                               <div className="flex shrink-0 w-[24px] h-[24px] items-center justify-center rounded-full border border-border bg-card text-muted-foreground/80 font-bold text-[11px] shadow-sm">
                                  {level}
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-xs font-medium text-foreground/80">Level {level} &ndash; {topic}</span>
                                  <span className="text-[10px] text-muted-foreground/70 leading-snug">{topic}</span>
                               </div>
                             </div>
                           );
                         })}
                       </div>
                     </div>
                   )}
                   
                   {/* Dropdown Toggle Button */}
                   <div className="absolute -bottom-[12px] inset-x-0 flex justify-center z-20">
                     <button 
                       onClick={() => setExpandedSkill(isExpanded ? null : skillKey)}
                       className={`flex items-center gap-1.5 text-[10px] transition-all duration-200 px-3 py-1 bg-card hover:bg-surface hover:text-foreground
                         ${isExpanded ? 'text-foreground font-medium shadow-sm border border-border rounded-full -translate-y-2' : 'text-muted-foreground opacity-60 group-hover:opacity-100'}
                       `}
                     >
                       {isExpanded ? `Hide Topic Roadmap (Level 1-${score})` : `View Topic Roadmap (Level 1-${score})`}
                       {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                     </button>
                   </div>
                 </div>
               )
             })}
           </div>

        </div>
      </div>
    </div>
  );
};

export default CompanySkills;
