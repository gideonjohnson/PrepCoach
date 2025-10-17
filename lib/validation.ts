import { z } from 'zod';

// ========================================
// Auth Validation Schemas
// ========================================

export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').trim(),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim()
    .max(255, 'Email too long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

// ========================================
// AI Feedback Validation Schemas
// ========================================

export const aiFeedbackSchema = z.object({
  transcript: z
    .string()
    .min(10, 'Transcript too short - speak for at least a few seconds')
    .max(10000, 'Transcript too long - maximum 10,000 characters'),
  question: z.string().min(5, 'Question is required').max(500, 'Question too long'),
  role: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
});

export const transcriptionSchema = z.object({
  audio: z.instanceof(File, { message: 'Audio file is required' }),
});

// ========================================
// Resume Builder Validation Schemas
// ========================================

export const resumeTransformSchema = z.object({
  resume: z.instanceof(File, { message: 'Resume file is required' }),
  targetRole: z.string().max(200).optional(),
  targetCompany: z.string().max(200).optional(),
  jobDescription: z.string().max(10000).optional(),
});

export const atsOptimizeSchema = z.object({
  resume: z.instanceof(File).optional(),
  resumeData: z.string().max(50000).optional(),
  jobDescription: z.string().min(50, 'Job description too short').max(10000),
});

export const saveResumeSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100),
  email: z.string().email('Invalid email').max(255),
  phone: z.string().max(50).optional(),
  location: z.string().max(200).optional(),
  linkedin: z.string().url().max(500).optional().or(z.literal('')),
  github: z.string().url().max(500).optional().or(z.literal('')),
  website: z.string().url().max(500).optional().or(z.literal('')),
  summary: z.string().max(2000).optional(),
  experience: z.string().max(50000).optional(),
  education: z.string().max(50000).optional(),
  skills: z.string().max(10000).optional(),
  projects: z.string().max(50000).optional(),
  template: z.string().max(50).optional(),
});

// ========================================
// Session Validation Schemas
// ========================================

export const createSessionSchema = z.object({
  role: z.string().min(1, 'Role is required').max(200),
  category: z.string().max(100).optional(),
  questionId: z.string().max(100).optional(),
});

// ========================================
// Helper Functions
// ========================================

/**
 * Validate data against a Zod schema
 * Returns parsed data if valid, throws error if invalid
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Safely validate data and return result with error handling
 */
export function safeValidateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}

/**
 * Format Zod errors for API responses
 */
export function formatZodError(error: z.ZodError): {
  field: string;
  message: string;
}[] {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(dirty: string): string {
  // Basic HTML sanitization - remove script tags and event handlers
  return dirty
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
    .trim();
}

/**
 * Sanitize string input - trim and limit length
 */
export function sanitizeString(input: string, maxLength = 1000): string {
  return input.trim().slice(0, maxLength);
}
