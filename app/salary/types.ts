// Salary Negotiation Module Types

export interface MarketData {
  role: string;
  company: string;
  location: string;
  level: string;
  baseSalary: {
    min: number;
    median: number;
    max: number;
    p25: number;
    p75: number;
  };
  totalComp: {
    min: number;
    median: number;
    max: number;
    p25: number;
    p75: number;
  };
  equity: {
    min: number;
    median: number;
    max: number;
  };
  bonus: {
    min: number;
    median: number;
    max: number;
  };
  sampleSize: number;
  lastUpdated: Date;
}

export interface JobOffer {
  id: string;
  company: string;
  role: string;
  location: string;
  level: string;
  baseSalary: number;
  signingBonus: number;
  performanceBonus: number;
  equityShares: number;
  equityValue: number;
  vestingSchedule: string;
  benefits: {
    healthInsurance: boolean;
    dentalVision: boolean;
    retirement401k: boolean;
    retirement401kMatch: string;
    pto: number;
    parentalLeave: number;
    remoteWork: boolean;
    learningBudget: number;
    gymMembership: boolean;
    commuter: boolean;
  };
  perks: string[];
  startDate: string;
  notes: string;
  createdAt: Date;
}

export interface CompensationBreakdown {
  year1: number;
  year2: number;
  year3: number;
  year4: number;
  total4Year: number;
  averageAnnual: number;
  baseSalary: number;
  equityValue: number;
  bonuses: number;
  benefitsValue: number;
}

export interface NegotiationScript {
  id: string;
  scenario: string;
  title: string;
  script: string;
  tips: string[];
  whenToUse: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export interface OfferComparison {
  offers: JobOffer[];
  breakdown: CompensationBreakdown[];
  winner: string;
  insights: string[];
  marketComparison: {
    offerId: string;
    vsMarketMedian: number;
    vsMarketP75: number;
    percentile: number;
  }[];
}

export interface NegotiationLeverage {
  strengths: string[];
  weaknesses: string[];
  targetIncrease: number;
  confidenceScore: number;
  strategy: 'aggressive' | 'moderate' | 'conservative';
  talkingPoints: string[];
}

export const EXPERIENCE_LEVELS = [
  'Entry Level (0-2 years)',
  'Mid Level (3-5 years)',
  'Senior (6-10 years)',
  'Staff/Principal (10+ years)',
  'Manager',
  'Senior Manager',
  'Director',
  'Senior Director',
  'VP',
  'SVP',
  'C-Level'
] as const;

export const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Consulting',
  'E-commerce',
  'Social Media',
  'Gaming',
  'Cloud Infrastructure',
  'Cybersecurity',
  'Data/Analytics',
  'Education',
  'Marketing',
  'Other'
] as const;

export const COMPANY_SIZES = [
  'Startup (<50)',
  'Small (50-200)',
  'Medium (200-1000)',
  'Large (1000-10000)',
  'Enterprise (10000+)'
] as const;

export const LOCATIONS = [
  'San Francisco Bay Area',
  'Seattle',
  'New York City',
  'Austin',
  'Boston',
  'Los Angeles',
  'Chicago',
  'Denver',
  'Remote (US)',
  'Remote (Global)',
  'Other'
] as const;

export type ExperienceLevel = typeof EXPERIENCE_LEVELS[number];
export type Industry = typeof INDUSTRIES[number];
export type CompanySize = typeof COMPANY_SIZES[number];
export type Location = typeof LOCATIONS[number];
