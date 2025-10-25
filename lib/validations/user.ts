import { z } from 'zod';

/**
 * User endpoint validation schemas
 *
 * Validates user profile updates, session management, and usage tracking
 * to ensure data integrity and prevent abuse.
 */

/**
 * User profile update validation
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .refine((name) => {
      // Allow letters, spaces, hyphens, apostrophes
      return /^[a-zA-Z\s\-']+$/.test(name);
    }, 'Name can only contain letters, spaces, hyphens, and apostrophes')
    .optional(),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .optional(),

  bio: z
    .string()
    .trim()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),

  targetRole: z
    .string()
    .trim()
    .max(200, 'Target role must be less than 200 characters')
    .optional(),

  experienceLevel: z
    .enum(['entry', 'mid', 'senior', 'lead', 'executive'])
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/**
 * Session creation validation
 */
export const createSessionSchema = z.object({
  roleId: z
    .string()
    .trim()
    .min(1, 'Role ID is required')
    .max(100, 'Invalid role ID'),

  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .default('medium'),

  questionCount: z
    .number()
    .int('Question count must be an integer')
    .min(1, 'Must have at least 1 question')
    .max(20, 'Maximum 20 questions per session')
    .default(5),

  interviewType: z
    .enum(['behavioral', 'technical', 'system-design', 'case-study', 'mixed'])
    .default('mixed'),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

/**
 * Session update validation
 */
export const updateSessionSchema = z.object({
  status: z
    .enum(['in_progress', 'completed', 'abandoned'])
    .optional(),

  currentQuestionIndex: z
    .number()
    .int('Question index must be an integer')
    .min(0, 'Question index cannot be negative')
    .optional(),

  responses: z
    .array(z.object({
      questionId: z.string().min(1, 'Question ID is required'),
      answer: z.string().max(10000, 'Answer too long'),
      score: z.number().min(0).max(100).optional(),
      feedback: z.string().max(5000, 'Feedback too long').optional(),
    }))
    .optional(),

  overallScore: z
    .number()
    .min(0, 'Score cannot be negative')
    .max(100, 'Score cannot exceed 100')
    .optional(),
});

export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;

/**
 * Usage increment validation
 */
export const incrementUsageSchema = z.object({
  feature: z
    .enum([
      'ai_feedback',
      'transcription',
      'resume_transform',
      'interview_session',
      'linkedin_optimization',
      'career_roadmap',
    ])
    .describe('Feature being used'),

  amount: z
    .number()
    .int('Amount must be an integer')
    .min(1, 'Amount must be at least 1')
    .max(100, 'Cannot increment by more than 100 at once')
    .default(1),
});

export type IncrementUsageInput = z.infer<typeof incrementUsageSchema>;

/**
 * Resume save/update validation
 */
export const saveResumeSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .max(100, 'Name too long'),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email')
    .max(255),

  phone: z
    .string()
    .trim()
    .max(50, 'Phone number too long')
    .optional(),

  location: z
    .string()
    .trim()
    .max(200, 'Location too long')
    .optional(),

  linkedin: z
    .string()
    .trim()
    .url('Invalid LinkedIn URL')
    .max(500, 'URL too long')
    .optional()
    .or(z.literal('')),

  github: z
    .string()
    .trim()
    .url('Invalid GitHub URL')
    .max(500, 'URL too long')
    .optional()
    .or(z.literal('')),

  website: z
    .string()
    .trim()
    .url('Invalid website URL')
    .max(500, 'URL too long')
    .optional()
    .or(z.literal('')),

  summary: z
    .string()
    .trim()
    .max(2000, 'Summary too long')
    .optional(),

  skills: z
    .array(z.string().trim().max(100))
    .max(50, 'Too many skills (maximum 50)')
    .optional(),

  experience: z
    .array(z.object({
      company: z.string().trim().max(200),
      position: z.string().trim().max(200),
      startDate: z.string().trim(),
      endDate: z.string().trim().optional(),
      current: z.boolean().optional(),
      description: z.string().trim().max(5000),
    }))
    .max(20, 'Too many experience entries')
    .optional(),

  education: z
    .array(z.object({
      school: z.string().trim().max(200),
      degree: z.string().trim().max(200),
      field: z.string().trim().max(200),
      startDate: z.string().trim(),
      endDate: z.string().trim().optional(),
      gpa: z.string().trim().max(10).optional(),
    }))
    .max(10, 'Too many education entries')
    .optional(),

  projects: z
    .array(z.object({
      name: z.string().trim().max(200),
      description: z.string().trim().max(2000),
      technologies: z.string().trim().max(500),
      link: z.string().trim().url().max(500).optional().or(z.literal('')),
    }))
    .max(20, 'Too many project entries')
    .optional(),
});

export type SaveResumeInput = z.infer<typeof saveResumeSchema>;

/**
 * Helper function to validate user inputs
 */
export function validateUserInput<T>(
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
