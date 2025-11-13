import { questionsByCategory } from './questions';
import { Stage } from './stage-system';

export interface StageQuestions {
  stage: Stage;
  questions: string[];
}

/**
 * Split questions into 3 stages of 15 questions each
 * Stage 1: Questions 1-15 (Foundational)
 * Stage 2: Questions 16-30 (Applied)
 * Stage 3: Questions 31-45 (Expert)
 */
export function getQuestionsByStage(category: string, stage: Stage): string[] {
  const allQuestions = questionsByCategory[category] || [];

  const startIndex = (stage - 1) * 15;
  const endIndex = stage * 15;

  return allQuestions.slice(startIndex, endIndex);
}

/**
 * Get all questions for a category organized by stages
 */
export function getAllStages(category: string): StageQuestions[] {
  return [
    { stage: 1, questions: getQuestionsByStage(category, 1) },
    { stage: 2, questions: getQuestionsByStage(category, 2) },
    { stage: 3, questions: getQuestionsByStage(category, 3) },
  ];
}

/**
 * Get total number of questions in a stage
 */
export function getStageQuestionCount(category: string, stage: Stage): number {
  return getQuestionsByStage(category, stage).length;
}

/**
 * Check if a category has enough questions for all 3 stages
 */
export function hasAllStages(category: string): boolean {
  const allQuestions = questionsByCategory[category] || [];
  return allQuestions.length >= 45;
}
