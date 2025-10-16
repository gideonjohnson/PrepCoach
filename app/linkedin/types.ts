// LinkedIn Profile Optimizer - Type Definitions

export interface LinkedInProfile {
  headline: string;
  about: string;
  experience: ExperienceItem[];
  skills: string[];
  education?: EducationItem[];
  certifications?: string[];
  projects?: ProjectItem[];
}

export interface ExperienceItem {
  title: string;
  company: string;
  duration: string;
  description: string;
  bullets?: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  technologies?: string[];
}

export interface JobPosting {
  url: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  keywords: string[];
}

export interface KeywordAnalysis {
  missingKeywords: string[];
  presentKeywords: string[];
  keywordGaps: KeywordGap[];
  coverageScore: number; // 0-100
  recommendations: string[];
}

export interface KeywordGap {
  keyword: string;
  importance: 'high' | 'medium' | 'low';
  foundInJobs: number; // How many target jobs mention this
  suggestion: string;
}

export interface OptimizedProfile {
  headline: OptimizedSection;
  about: OptimizedSection;
  experienceBullets: OptimizedBullet[];
  skills: SkillRecommendation[];
  score: ProfileScore;
}

export interface OptimizedSection {
  original: string;
  optimized: string;
  improvements: string[];
  keywordsAdded: string[];
}

export interface OptimizedBullet {
  original: string;
  optimized: string;
  impact: string; // The quantifiable impact highlighted
  action: string; // The action verb used
}

export interface SkillRecommendation {
  skill: string;
  priority: 'essential' | 'recommended' | 'nice-to-have';
  reason: string;
  inDemand: number; // How many target jobs require this (%)
}

export interface ProfileScore {
  overall: number; // 0-100
  relevance: number; // How well it matches target jobs
  impact: number; // Use of metrics and achievements
  clarity: number; // Clear, concise, professional language
  completeness: number; // Profile sections filled out
  feedback: ScoreFeedback[];
}

export interface ScoreFeedback {
  category: 'relevance' | 'impact' | 'clarity' | 'completeness';
  issue: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ConnectionMessageTemplate {
  scenario: string;
  template: string;
  variables: string[];
  example: string;
  tips: string[];
}

export interface VisibilityPlan {
  weeks: WeekPlan[];
  goals: string[];
  metrics: string[];
}

export interface WeekPlan {
  week: number;
  focus: string;
  tasks: VisibilityTask[];
  postTopics: string[];
}

export interface VisibilityTask {
  task: string;
  frequency: string; // e.g., "3x per week"
  impact: 'high' | 'medium' | 'low';
  timeEstimate: string;
}

export interface ProfileAnalysisRequest {
  profile: LinkedInProfile;
  targetJobs: string[]; // URLs or job descriptions
  targetRole?: string; // Optional: specify target role
  targetIndustry?: string; // Optional: specify target industry
}

export interface ProfileAnalysisResult {
  keywordAnalysis: KeywordAnalysis;
  optimizedProfile: OptimizedProfile;
  connectionTemplates: ConnectionMessageTemplate[];
  visibilityPlan: VisibilityPlan;
  quickWins: string[]; // Immediate actions to take
}
