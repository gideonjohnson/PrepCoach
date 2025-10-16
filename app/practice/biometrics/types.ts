// Biometric Analysis Types for Interview Rehearsal Studio

export interface VocalMetrics {
  pace: number; // words per minute
  averagePitch: number; // Hz
  pitchVariation: number; // standard deviation
  volume: number; // 0-100
  volumeConsistency: number; // 0-100
  energyLevel: number; // 0-100
  clarity: number; // 0-100 score
  fillerWordCount: number;
  fillerWords: Array<{ word: string; timestamp: number; count: number }>;
  pauseCount: number;
  averagePauseLength: number; // seconds
}

export interface VisualMetrics {
  eyeContactPercentage: number; // 0-100
  eyeContactDuration: number; // average seconds
  facialConfidence: number; // 0-100 score
  smileFrequency: number; // smiles per minute
  postureScore: number; // 0-100
  gestureFrequency: number; // gestures per minute
  gestureAppropriacy: number; // 0-100 score
  headMovement: number; // pixels of movement
  facingCamera: boolean;
}

export interface StressMetrics {
  estimatedHeartRate: number; // bpm
  heartRateVariability: number; // ms
  vocalStressLevel: number; // 0-100
  cognitiveLoad: number; // 0-100
  nervousnessIndicators: string[];
  confidenceScore: number; // 0-100
  overallStressLevel: number; // 0-100
}

export interface BiometricSnapshot {
  timestamp: number;
  vocal: Partial<VocalMetrics>;
  visual: Partial<VisualMetrics>;
  stress: Partial<StressMetrics>;
}

export interface BiometricSession {
  sessionId: string;
  startTime: number;
  endTime: number;
  snapshots: BiometricSnapshot[];
  vocalSummary: VocalMetrics;
  visualSummary: VisualMetrics;
  stressSummary: StressMetrics;
  overallScore: number;
  recommendations: string[];
}

export type InterviewerPersonality = 'friendly' | 'tough' | 'stoic';

export interface InterviewerMode {
  personality: InterviewerPersonality;
  name: string;
  description: string;
  tone: string;
  difficulty: number; // 1-10
  pacingSpeed: number; // 0.5-2.0
  interruptionLikelihood: number; // 0-100
  followUpIntensity: number; // 0-100
  avatar: string;
}

export interface FeedbackReport {
  sessionId: string;
  duration: number; // seconds
  questionCount: number;
  biometrics: BiometricSession;

  // Scores (0-100)
  vocalScore: number;
  visualScore: number;
  confidenceScore: number;
  overallScore: number;

  // Detailed insights
  strengths: string[];
  improvements: string[];
  criticalIssues: string[];

  // Recommendations
  recommendations: Array<{
    category: 'vocal' | 'visual' | 'stress' | 'general';
    priority: 'high' | 'medium' | 'low';
    issue: string;
    suggestion: string;
  }>;

  // Comparisons
  industryBenchmark: {
    vocal: number;
    visual: number;
    confidence: number;
    overall: number;
  };

  improvementTrend: {
    session: number;
    scores: {
      vocal: number;
      visual: number;
      confidence: number;
      overall: number;
    };
  }[];
}

export interface FillerWord {
  word: string;
  patterns: RegExp[];
  severity: 'low' | 'medium' | 'high';
}

export const COMMON_FILLER_WORDS: FillerWord[] = [
  { word: 'um', patterns: [/\bum\b/gi, /\bumm+\b/gi], severity: 'high' },
  { word: 'uh', patterns: [/\buh\b/gi, /\buhh+\b/gi], severity: 'high' },
  { word: 'like', patterns: [/\blike\b/gi], severity: 'medium' },
  { word: 'you know', patterns: [/\byou\s+know\b/gi], severity: 'medium' },
  { word: 'actually', patterns: [/\bactually\b/gi], severity: 'low' },
  { word: 'basically', patterns: [/\bbasically\b/gi], severity: 'medium' },
  { word: 'literally', patterns: [/\bliterally\b/gi], severity: 'low' },
  { word: 'kind of', patterns: [/\bkind\s+of\b/gi, /\bkinda\b/gi], severity: 'medium' },
  { word: 'sort of', patterns: [/\bsort\s+of\b/gi, /\bsorta\b/gi], severity: 'medium' },
  { word: 'I mean', patterns: [/\bi\s+mean\b/gi], severity: 'medium' },
  { word: 'right', patterns: [/\bright\??\b/gi], severity: 'low' },
  { word: 'okay', patterns: [/\bokay\b/gi, /\bok\b/gi], severity: 'low' },
  { word: 'so', patterns: [/\bso\b/gi], severity: 'low' },
  { word: 'just', patterns: [/\bjust\b/gi], severity: 'low' },
];

export const INTERVIEWER_MODES: Record<InterviewerPersonality, InterviewerMode> = {
  friendly: {
    personality: 'friendly',
    name: 'Sarah Chen',
    description: 'Friendly HR Recruiter who creates a comfortable, supportive environment',
    tone: 'warm, encouraging, patient',
    difficulty: 4,
    pacingSpeed: 0.9,
    interruptionLikelihood: 10,
    followUpIntensity: 40,
    avatar: 'friendly-female',
  },
  tough: {
    personality: 'tough',
    name: 'Marcus Rodriguez',
    description: 'Tough Technical Interviewer who challenges you with difficult questions',
    tone: 'direct, probing, analytical',
    difficulty: 8,
    pacingSpeed: 1.3,
    interruptionLikelihood: 60,
    followUpIntensity: 90,
    avatar: 'tough-male',
  },
  stoic: {
    personality: 'stoic',
    name: 'Dr. Elizabeth Warren',
    description: 'Stoic Executive who maintains minimal expression and tests composure',
    tone: 'neutral, reserved, measured',
    difficulty: 7,
    pacingSpeed: 0.8,
    interruptionLikelihood: 20,
    followUpIntensity: 70,
    avatar: 'stoic-female',
  },
};
