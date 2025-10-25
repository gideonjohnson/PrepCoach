import { z } from 'zod';

/**
 * AI endpoint validation schemas
 *
 * Validates inputs for expensive AI operations to prevent abuse,
 * ensure data quality, and protect against prompt injection attacks.
 */

/**
 * Analyze response endpoint validation
 * Used for AI feedback on interview responses
 */
export const analyzeResponseSchema = z.object({
  // Interview context
  role: z
    .string()
    .trim()
    .min(1, 'Role is required')
    .max(200, 'Role must be less than 200 characters'),

  company: z
    .string()
    .trim()
    .max(200, 'Company name must be less than 200 characters')
    .optional(),

  question: z
    .string()
    .trim()
    .min(1, 'Question is required')
    .max(2000, 'Question must be less than 2000 characters'),

  answer: z
    .string()
    .trim()
    .min(1, 'Answer is required')
    .max(10000, 'Answer must be less than 10,000 characters')
    .refine((answer) => {
      // Ensure answer has meaningful content (not just whitespace/gibberish)
      const words = answer.split(/\s+/).filter(w => w.length > 0);
      return words.length >= 5;
    }, 'Answer must contain at least 5 words'),

  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .optional(),

  // Session tracking
  sessionId: z
    .string()
    .trim()
    .min(1, 'Session ID is required')
    .max(100, 'Invalid session ID'),
});

export type AnalyzeResponseInput = z.infer<typeof analyzeResponseSchema>;

/**
 * Transcribe audio endpoint validation
 */
export const transcribeAudioSchema = z.object({
  // Audio data validation
  audio: z
    .string()
    .refine((data) => {
      // Validate base64 format
      try {
        // Check if it's valid base64
        const base64Regex = /^data:audio\/(wav|webm|mp3|ogg);base64,/;
        return base64Regex.test(data);
      } catch {
        return false;
      }
    }, 'Invalid audio data format')
    .refine((data) => {
      // Check size (max 25MB encoded)
      const base64Length = data.split(',')[1]?.length || 0;
      const sizeInBytes = (base64Length * 3) / 4;
      const maxSize = 25 * 1024 * 1024; // 25MB
      return sizeInBytes <= maxSize;
    }, 'Audio file too large (max 25MB)'),
});

export type TranscribeAudioInput = z.infer<typeof transcribeAudioSchema>;

/**
 * Resume transformation endpoint validation
 */
export const resumeTransformSchema = z.object({
  // Resume content (plain text extracted from file)
  resumeContent: z
    .string()
    .trim()
    .min(50, 'Resume content too short (minimum 50 characters)')
    .max(50000, 'Resume content too long (maximum 50,000 characters)')
    .refine((content) => {
      // Ensure resume has some structure (sections, bullet points, etc.)
      const hasStructure = content.includes('\n') || content.length > 200;
      return hasStructure;
    }, 'Resume must have proper formatting'),

  targetRole: z
    .string()
    .trim()
    .max(200, 'Target role must be less than 200 characters')
    .optional(),

  targetCompany: z
    .string()
    .trim()
    .max(200, 'Target company must be less than 200 characters')
    .optional(),

  jobDescription: z
    .string()
    .trim()
    .max(10000, 'Job description must be less than 10,000 characters')
    .optional(),
});

export type ResumeTransformInput = z.infer<typeof resumeTransformSchema>;

/**
 * Resume ATS tailor endpoint validation
 */
export const resumeTailorSchema = z.object({
  resumeId: z
    .string()
    .trim()
    .min(1, 'Resume ID is required')
    .max(100, 'Invalid resume ID'),

  jobDescription: z
    .string()
    .trim()
    .min(50, 'Job description too short (minimum 50 characters)')
    .max(10000, 'Job description too long (maximum 10,000 characters)'),

  targetRole: z
    .string()
    .trim()
    .min(1, 'Target role is required')
    .max(200, 'Target role must be less than 200 characters'),

  targetCompany: z
    .string()
    .trim()
    .max(200, 'Target company must be less than 200 characters')
    .optional(),
});

export type ResumeTailorInput = z.infer<typeof resumeTailorSchema>;

/**
 * Helper function to validate AI inputs
 */
export function validateAIInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.errors.map((err) => {
    const field = err.path.join('.');
    return field ? `${field}: ${err.message}` : err.message;
  });

  return { success: false, errors };
}
