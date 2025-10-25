/**
 * Central export for all validation schemas
 *
 * Provides a single import point for all Zod validation schemas
 * used across the application.
 *
 * Usage:
 * import { signupSchema, analyzeResponseSchema } from '@/lib/validations';
 */

// Auth validations
export {
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  validateAuthInput,
  type SignupInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type VerifyEmailInput,
  type ResendVerificationInput,
} from './auth';

// AI validations
export {
  analyzeResponseSchema,
  transcribeAudioSchema,
  resumeTransformSchema,
  resumeTailorSchema,
  validateAIInput,
  type AnalyzeResponseInput,
  type TranscribeAudioInput,
  type ResumeTransformInput,
  type ResumeTailorInput,
} from './ai';

// User validations
export {
  updateProfileSchema,
  createSessionSchema,
  updateSessionSchema,
  incrementUsageSchema,
  saveResumeSchema,
  validateUserInput,
  type UpdateProfileInput,
  type CreateSessionInput,
  type UpdateSessionInput,
  type IncrementUsageInput,
  type SaveResumeInput,
} from './user';

/**
 * Generic validation helper
 * Use this for consistent error handling across all endpoints
 */
export function formatValidationErrors(errors: string[]): string {
  if (errors.length === 1) {
    return errors[0];
  }
  return `Validation failed:\n${errors.map(e => `  • ${e}`).join('\n')}`;
}
