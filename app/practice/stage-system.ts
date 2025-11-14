// Progressive Stage System for Interview Practice
// Users unlock stages by completing previous ones

export type Stage = 1 | 2 | 3;

export interface StageInfo {
  stage: Stage;
  title: string;
  description: string;
  difficulty: 'Foundational' | 'Applied' | 'Expert';
  unlockRequirement: string;
  questionsCount: number;
  icon: string;
}

export const STAGE_CONFIG: Record<Stage, StageInfo> = {
  1: {
    stage: 1,
    title: 'Stage 1: Foundational',
    description: 'Master the basics. Build your foundation with core concepts and fundamental questions.',
    difficulty: 'Foundational',
    unlockRequirement: 'Always unlocked',
    questionsCount: 15,
    icon: '1',
  },
  2: {
    stage: 2,
    title: 'Stage 2: Applied',
    description: 'Apply your knowledge. Tackle real-world scenarios and intermediate challenges.',
    difficulty: 'Applied',
    unlockRequirement: 'Complete 80% of Stage 1 (12/15 questions)',
    questionsCount: 15,
    icon: '2',
  },
  3: {
    stage: 3,
    title: 'Stage 3: Expert',
    description: 'Prove your mastery. Handle advanced scenarios like a seasoned professional.',
    difficulty: 'Expert',
    unlockRequirement: 'Complete 80% of Stage 2 (12/15 questions)',
    questionsCount: 15,
    icon: '3',
  },
};

export interface StageProgress {
  roleId: string;
  stage: Stage;
  questionsAnswered: number;
  totalQuestions: number;
  completionPercentage: number;
  isUnlocked: boolean;
  isCompleted: boolean;
}

export interface RoleStageProgress {
  roleId: string;
  roleName: string;
  stages: {
    1: StageProgress;
    2: StageProgress;
    3: StageProgress;
  };
  overallCompletion: number;
  currentStage: Stage;
}

/**
 * Calculate if a stage is unlocked based on previous stage completion
 */
export function isStageUnlocked(
  stage: Stage,
  previousStageProgress?: StageProgress
): boolean {
  // Stage 1 is always unlocked
  if (stage === 1) return true;

  // Stage 2 and 3 require previous stage to be 80% complete
  if (!previousStageProgress) return false;

  const requiredCompletion = 80;
  return previousStageProgress.completionPercentage >= requiredCompletion;
}

/**
 * Get the next stage to focus on for a role
 */
export function getNextStage(roleProgress: RoleStageProgress): Stage {
  if (!roleProgress.stages[1].isCompleted) return 1;
  if (!roleProgress.stages[2].isCompleted && roleProgress.stages[2].isUnlocked) return 2;
  if (!roleProgress.stages[3].isCompleted && roleProgress.stages[3].isUnlocked) return 3;
  return roleProgress.currentStage;
}

/**
 * Calculate overall role completion percentage
 */
export function calculateOverallCompletion(stages: {
  1: StageProgress;
  2: StageProgress;
  3: StageProgress;
}): number {
  const totalQuestions =
    stages[1].totalQuestions +
    stages[2].totalQuestions +
    stages[3].totalQuestions;
  const answeredQuestions =
    stages[1].questionsAnswered +
    stages[2].questionsAnswered +
    stages[3].questionsAnswered;
  return Math.round((answeredQuestions / totalQuestions) * 100);
}

/**
 * Get motivational message based on progress
 */
export function getMotivationalMessage(progress: RoleStageProgress): string {
  const completion = progress.overallCompletion;

  if (completion === 0) {
    return "Ready to start your journey? Let's crush Stage 1!";
  } else if (completion < 25) {
    return "Great start! Keep building that foundation.";
  } else if (completion < 50) {
    return "You're gaining momentum! Stage 2 is within reach.";
  } else if (completion < 75) {
    return "Impressive progress! You're mastering this role.";
  } else if (completion < 100) {
    return "Almost there! Finish strong to complete all stages.";
  } else {
    return "Stage Master! You've conquered this role. Ready for the next challenge?";
  }
}

/**
 * Get color scheme for stage based on status
 */
export function getStageColor(stage: Stage, isUnlocked: boolean): {
  bg: string;
  border: string;
  text: string;
  hover: string;
} {
  if (!isUnlocked) {
    return {
      bg: 'bg-gray-100',
      border: 'border-gray-300',
      text: 'text-gray-400',
      hover: 'hover:bg-gray-100',
    };
  }

  const colors = {
    1: {
      bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
      border: 'border-green-300',
      text: 'text-green-700',
      hover: 'hover:from-green-100 hover:to-emerald-100',
    },
    2: {
      bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      border: 'border-blue-300',
      text: 'text-blue-700',
      hover: 'hover:from-blue-100 hover:to-cyan-100',
    },
    3: {
      bg: 'bg-gradient-to-br from-purple-50 to-indigo-50',
      border: 'border-purple-300',
      text: 'text-purple-700',
      hover: 'hover:from-purple-100 hover:to-indigo-100',
    },
  };

  return colors[stage];
}
