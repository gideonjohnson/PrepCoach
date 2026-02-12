import { z } from 'zod';

// ========================================
// Auth Validation Schemas
// ========================================

// Enhanced email validation with security checks
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Invalid email address')
  .max(255, 'Email must be less than 255 characters')
  .refine((email) => {
    // Block common disposable email patterns
    const disposableDomains = ['tempmail', 'throwaway', '10minutemail', 'guerrillamail'];
    return !disposableDomains.some(domain => email.includes(domain));
  }, 'Disposable email addresses are not allowed');

// Enhanced password validation
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .refine((password) => /[a-z]/.test(password), 'Password must contain at least one lowercase letter')
  .refine((password) => /[A-Z0-9]/.test(password), 'Password must contain at least one uppercase letter or number');

// Name validation with sanitization
const nameSchema = z
  .string()
  .trim()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')
  .refine((name) => /^[a-zA-Z\s\-']+$/.test(name), 'Name can only contain letters, spaces, hyphens, and apostrophes');

// Token validation for password reset and email verification
const tokenSchema = z
  .string()
  .trim()
  .length(64, 'Invalid token format')
  .regex(/^[a-f0-9]{64}$/, 'Invalid token format');

// Role validation for signup
const roleSchema = z.enum(['candidate', 'interviewer', 'recruiter']).optional().default('candidate');

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema,
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: tokenSchema,
  password: passwordSchema,
});

// ========================================
// AI Feedback Validation Schemas
// ========================================

export const aiFeedbackSchema = z.object({
  transcript: z
    .string()
    .trim()
    .min(10, 'Transcript too short - speak for at least a few seconds')
    .max(10000, 'Transcript too long - maximum 10,000 characters')
    .refine((text) => {
      // Ensure meaningful content (at least 3 words)
      const words = text.split(/\s+/).filter(w => w.length > 0);
      return words.length >= 3;
    }, 'Transcript must contain at least 3 words'),
  question: z.string().trim().min(5, 'Question is required').max(2000, 'Question too long'),
  role: z.string().trim().max(200, 'Role name too long').optional(),
  category: z.string().trim().max(100, 'Category name too long').optional(),
  sessionId: z.string().trim().min(1, 'Session ID is required').max(100, 'Invalid session ID').optional(),
  // Biometric data for enhanced feedback (optional)
  vocalMetrics: z.object({
    pace: z.number().optional(),
    averagePitch: z.number().optional(),
    pitchVariation: z.number().optional(),
    volume: z.number().optional(),
    volumeConsistency: z.number().optional(),
    energyLevel: z.number().optional(),
    clarity: z.number().optional(),
    fillerWordCount: z.number().optional(),
    fillerWords: z.array(z.object({
      word: z.string(),
      timestamp: z.number(),
      count: z.number()
    })).optional(),
    pauseCount: z.number().optional(),
    averagePauseLength: z.number().optional(),
  }).optional(),
  visualMetrics: z.object({
    eyeContactPercentage: z.number().optional(),
    eyeContactDuration: z.number().optional(),
    facialConfidence: z.number().optional(),
    smileFrequency: z.number().optional(),
    postureScore: z.number().optional(),
    gestureFrequency: z.number().optional(),
    gestureAppropriacy: z.number().optional(),
    headMovement: z.number().optional(),
    facingCamera: z.boolean().optional(),
  }).optional(),
});

export const analyzeResponseSchema = z.object({
  role: z.string().trim().min(1, 'Role is required').max(200, 'Role must be less than 200 characters'),
  company: z.string().trim().max(200, 'Company name must be less than 200 characters').optional(),
  question: z.string().trim().min(1, 'Question is required').max(2000, 'Question must be less than 2000 characters'),
  answer: z
    .string()
    .trim()
    .min(1, 'Answer is required')
    .max(10000, 'Answer must be less than 10,000 characters')
    .refine((answer) => {
      const words = answer.split(/\s+/).filter(w => w.length > 0);
      return words.length >= 5;
    }, 'Answer must contain at least 5 words'),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  sessionId: z.string().trim().min(1, 'Session ID is required').max(100, 'Invalid session ID'),
});

export const transcriptionSchema = z.object({
  audio: z.instanceof(File, { message: 'Audio file is required' }).refine(
    (file) => file.size <= 25 * 1024 * 1024,
    'Audio file too large (max 25MB)'
  ).refine(
    (file) => ['audio/wav', 'audio/webm', 'audio/mp3', 'audio/ogg', 'audio/mpeg'].includes(file.type),
    'Invalid audio format (must be WAV, WebM, MP3, or OGG)'
  ),
});

export const transcribeAudioSchema = z.object({
  audio: z
    .string()
    .refine((data) => {
      const base64Regex = /^data:audio\/(wav|webm|mp3|ogg|mpeg);base64,/;
      return base64Regex.test(data);
    }, 'Invalid audio data format')
    .refine((data) => {
      const base64Length = data.split(',')[1]?.length || 0;
      const sizeInBytes = (base64Length * 3) / 4;
      const maxSize = 25 * 1024 * 1024; // 25MB
      return sizeInBytes <= maxSize;
    }, 'Audio file too large (max 25MB)'),
});

// ========================================
// Resume Builder Validation Schemas
// ========================================

export const resumeTransformSchema = z.object({
  resume: z.instanceof(File, { message: 'Resume file is required' })
    .refine((file) => file.size <= 10 * 1024 * 1024, 'Resume file too large (max 10MB)')
    .refine(
      (file) => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(file.type),
      'Invalid file type (must be PDF, DOC, DOCX, or TXT)'
    ),
  targetRole: z.string().trim().max(200, 'Target role too long').optional(),
  targetCompany: z.string().trim().max(200, 'Target company name too long').optional(),
  jobDescription: z.string().trim().max(10000, 'Job description too long').optional(),
});

export const resumeContentTransformSchema = z.object({
  resumeContent: z
    .string()
    .trim()
    .min(50, 'Resume content too short (minimum 50 characters)')
    .max(50000, 'Resume content too long (maximum 50,000 characters)'),
  targetRole: z.string().trim().max(200).optional(),
  targetCompany: z.string().trim().max(200).optional(),
  jobDescription: z.string().trim().max(10000).optional(),
});

export const atsOptimizeSchema = z.object({
  resume: z.instanceof(File).optional(),
  resumeData: z.string().trim().max(50000).optional(),
  jobDescription: z.string().trim().min(50, 'Job description too short').max(10000, 'Job description too long'),
}).refine((data) => data.resume || data.resumeData, 'Either resume file or resume data is required');

export const resumeTailorSchema = z.object({
  resumeId: z.string().trim().min(1, 'Resume ID is required').max(100, 'Invalid resume ID'),
  jobDescription: z
    .string()
    .trim()
    .min(50, 'Job description too short (minimum 50 characters)')
    .max(10000, 'Job description too long (maximum 10,000 characters)'),
  targetRole: z.string().trim().min(1, 'Target role is required').max(200, 'Target role too long'),
  targetCompany: z.string().trim().max(200, 'Target company name too long').optional(),
});

export const saveResumeSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(100, 'Name too long'),
  email: emailSchema,
  phone: z.string().trim().max(50, 'Phone number too long').optional(),
  location: z.string().trim().max(200, 'Location too long').optional(),
  linkedin: z.string().trim().url('Invalid LinkedIn URL').max(500, 'URL too long').optional().or(z.literal('')),
  github: z.string().trim().url('Invalid GitHub URL').max(500, 'URL too long').optional().or(z.literal('')),
  website: z.string().trim().url('Invalid website URL').max(500, 'URL too long').optional().or(z.literal('')),
  summary: z.string().trim().max(2000, 'Summary too long').optional(),
  skills: z.array(z.string().trim().max(100)).max(50, 'Too many skills (maximum 50)').optional(),
  experience: z.array(z.object({
    company: z.string().trim().max(200),
    position: z.string().trim().max(200),
    startDate: z.string().trim(),
    endDate: z.string().trim().optional(),
    current: z.boolean().optional(),
    description: z.string().trim().max(5000),
  })).max(20, 'Too many experience entries').optional(),
  education: z.array(z.object({
    school: z.string().trim().max(200),
    degree: z.string().trim().max(200),
    field: z.string().trim().max(200),
    startDate: z.string().trim(),
    endDate: z.string().trim().optional(),
    gpa: z.string().trim().max(10).optional(),
  })).max(10, 'Too many education entries').optional(),
  projects: z.array(z.object({
    name: z.string().trim().max(200),
    description: z.string().trim().max(2000),
    technologies: z.string().trim().max(500),
    link: z.string().trim().url().max(500).optional().or(z.literal('')),
  })).max(20, 'Too many project entries').optional(),
  template: z.string().trim().max(50).optional(),
});

// ========================================
// Session Validation Schemas
// ========================================

export const createSessionSchema = z.object({
  roleId: z.string().trim().min(1, 'Role ID is required').max(100, 'Invalid role ID'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  questionCount: z
    .number()
    .int('Question count must be an integer')
    .min(1, 'Must have at least 1 question')
    .max(20, 'Maximum 20 questions per session')
    .default(5),
  interviewType: z.enum(['behavioral', 'technical', 'system-design', 'case-study', 'mixed']).default('mixed'),
});

export const updateSessionSchema = z.object({
  status: z.enum(['in_progress', 'completed', 'abandoned']).optional(),
  currentQuestionIndex: z.number().int('Question index must be an integer').min(0, 'Question index cannot be negative').optional(),
  responses: z.array(z.object({
    questionId: z.string().min(1, 'Question ID is required'),
    answer: z.string().max(10000, 'Answer too long'),
    score: z.number().min(0).max(100).optional(),
    feedback: z.string().max(5000, 'Feedback too long').optional(),
  })).optional(),
  overallScore: z.number().min(0, 'Score cannot be negative').max(100, 'Score cannot exceed 100').optional(),
});

// User profile and usage validation
export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  bio: z.string().trim().max(500, 'Bio must be less than 500 characters').optional(),
  targetRole: z.string().trim().max(200, 'Target role must be less than 200 characters').optional(),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']).optional(),
});

export const incrementUsageSchema = z.object({
  feature: z.enum([
    'ai_feedback',
    'transcription',
    'resume_transform',
    'interview_session',
    'linkedin_optimization',
    'career_roadmap',
  ]),
  amount: z.number().int('Amount must be an integer').min(1, 'Amount must be at least 1').max(100, 'Cannot increment by more than 100 at once').default(1),
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
  return error.issues.map((err) => ({
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
