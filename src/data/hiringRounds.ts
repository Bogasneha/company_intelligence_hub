export interface SkillSetDetail {
  skill_set_code: string;
  typical_questions: string;
}

export interface HiringRound {
  round_number: number;
  round_name: string;
  round_category: string;
  evaluation_type: string;
  assessment_mode: string;
  skill_sets: SkillSetDetail[];
}

export interface JobRole {
  opportunity_type: string;
  role_title: string;
  role_category: string;
  job_description: string;
  compensation: string;
  ctc_or_stipend: number;
  bonus: string;
  benefits_summary: string;
  hiring_rounds: HiringRound[];
}

export interface CompanyHiringData {
  company_name: string;
  company_id: number;
  job_role_details: JobRole[];
}

export interface SkillSetLabelMap {
  [code: string]: string;
}

export const skillSetLabels: SkillSetLabelMap = {
  DSA: "Data Structures & Algorithms",
  COD: "Coding",
  APTI: "Aptitude & Problem Solving",
  COMM: "Communication Skills",
  OS: "Operating Systems",
  NETW: "Computer Networking",
  SYSD: "System Design & Architecture",
  OOD: "Object-Oriented Design",
  SWE: "Software Engineering",
  SQL: "SQL & Databases",
  AI: "AI & Machine Learning",
  DEVOPS: "DevOps & Cloud",
};
