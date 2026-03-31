export interface SkillLevel {
  level: number;
  topics: string[];
}

export interface CompanySkillSet {
  skill_name: string;
  skill_code: string;
  levels: SkillLevel[];
}

export interface CompanySkillData {
  company_id: number;
  skill_sets: CompanySkillSet[];
}

export const bloomLabels: Record<string, string> = {
  RE: "Remember",
  UN: "Understand",
  AP: "Apply",
  AN: "Analyze",
  EV: "Evaluate",
  CR: "Create",
};

export const bloomColors: Record<string, string> = {
  RE: "bg-muted text-muted-foreground",
  UN: "bg-secondary text-secondary-foreground",
  AP: "bg-info/20 text-info",
  AN: "bg-accent/20 text-accent",
  EV: "bg-primary/20 text-primary",
  CR: "bg-highlight/20 text-highlight",
};

export const standardSkills = [
  { code: "COD", name: "Coding" },
  { code: "DSA", name: "Data Structures & Algorithms" },
  { code: "APTI", name: "Aptitude & Problem Solving" },
  { code: "COMM", name: "Communication Skills" },
  { code: "OOD", name: "Object-Oriented Design" },
  { code: "AI", name: "AI Native Engineering" },
  { code: "SQL", name: "SQL & Databases" },
  { code: "SYSD", name: "System Design" },
  { code: "DEVOPS", name: "DevOps & Cloud" },
  { code: "SWE", name: "Software Engineering" },
  { code: "NETW", name: "Computer Networking" },
  { code: "OS", name: "Operating Systems" },
];
