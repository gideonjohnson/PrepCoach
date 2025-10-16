// Career Roadmap Planner - Type Definitions

export interface CareerRoadmap {
  currentRole: string;
  targetRole: string;
  skillsGap: SkillsGapAnalysis;
  learningPaths: LearningPath[];
  timeline: CareerTimeline;
  certifications: CertificationRecommendation[];
  milestones: Milestone[];
}

export interface SkillsGapAnalysis {
  currentSkills: Skill[];
  requiredSkills: Skill[];
  gaps: SkillGap[];
  gapScore: number; // 0-100, higher means smaller gap
  readinessLevel: 'beginner' | 'intermediate' | 'advanced' | 'ready';
  summary: string;
}

export interface Skill {
  name: string;
  category: 'technical' | 'soft' | 'domain' | 'leadership';
  proficiency: 0 | 1 | 2 | 3 | 4 | 5; // 0=none, 5=expert
  yearsOfExperience?: number;
  lastUsed?: string;
}

export interface SkillGap {
  skill: string;
  category: 'technical' | 'soft' | 'domain' | 'leadership';
  currentLevel: number;
  requiredLevel: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedTimeToLearn: string; // e.g., "2-3 months"
  difficulty: 'easy' | 'moderate' | 'challenging' | 'advanced';
  reasoning: string;
}

export interface LearningPath {
  pathId: string;
  title: string;
  description: string;
  targetSkills: string[];
  duration: string; // e.g., "3-6 months"
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  resources: LearningResource[];
  estimatedCost: {
    min: number;
    max: number;
    currency: string;
  };
  prerequisites: string[];
  order: number;
}

export interface LearningResource {
  type: 'course' | 'book' | 'tutorial' | 'project' | 'bootcamp' | 'practice' | 'documentation';
  title: string;
  provider: string;
  url?: string;
  duration: string;
  cost: number;
  costType: 'free' | 'one-time' | 'subscription';
  rating?: number;
  skills: string[];
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface CareerTimeline {
  currentDate: string;
  targetDate: string;
  totalDuration: string; // e.g., "12-18 months"
  phases: TimelinePhase[];
  assumptions: string[];
  accelerators: string[];
  risks: string[];
}

export interface TimelinePhase {
  phase: number;
  title: string;
  duration: string;
  startMonth: number;
  endMonth: number;
  goals: string[];
  activities: string[];
  successMetrics: string[];
  completionCriteria: string[];
}

export interface CertificationRecommendation {
  name: string;
  provider: string;
  category: 'technical' | 'project-management' | 'cloud' | 'security' | 'data' | 'general';
  relevance: 'essential' | 'highly-recommended' | 'beneficial' | 'optional';
  cost: number;
  duration: string; // e.g., "2-3 months preparation"
  difficulty: 'entry' | 'associate' | 'professional' | 'expert';
  prerequisites: string[];
  skills: string[];
  industryRecognition: 'high' | 'medium' | 'low';
  examFormat: string;
  passingScore?: string;
  renewalRequired: boolean;
  renewalPeriod?: string;
  preparationResources: LearningResource[];
  benefits: string[];
  suggestedTimeline: string; // When in the roadmap to pursue
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetMonth: number;
  type: 'skill' | 'project' | 'certification' | 'networking' | 'application';
  priority: 'critical' | 'high' | 'medium' | 'low';
  completionCriteria: string[];
  dependencies: string[];
  estimatedEffort: string;
}

export interface RoleRequirements {
  role: string;
  seniority: 'entry' | 'mid' | 'senior' | 'staff' | 'principal' | 'lead';
  requiredSkills: Skill[];
  preferredSkills: Skill[];
  typicalYearsExperience: { min: number; max: number };
  typicalSalaryRange: { min: number; max: number; currency: string };
  commonCertifications: string[];
  industryDomains: string[];
}

export interface UserProfile {
  currentRole: string;
  yearsOfExperience: number;
  currentSkills: Skill[];
  education: string[];
  certifications: string[];
  industries: string[];
  strengths: string[];
  interests: string[];
  constraints: {
    timePerWeek: number; // hours
    budget: number;
    deadline?: string;
    preferredLearningStyle: ('video' | 'reading' | 'hands-on' | 'interactive')[];
  };
}
