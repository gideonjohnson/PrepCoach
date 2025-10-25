import { z } from 'zod';

/**
 * Authentication validation schemas
 *
 * Provides comprehensive input validation for all auth-related endpoints
 * to prevent injection attacks, malformed data, and ensure data integrity.
 */

// Email validation - RFC 5322 compliant with additional security checks
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Invalid email address')
  .max(255, 'Email must be less than 255 characters')
  .refine((email) => {
    // Block disposable email patterns
    const disposableDomains = ['tempmail', 'throwaway', '10minutemail'];
    return !disposableDomains.some(domain => email.includes(domain));
  }, 'Disposable email addresses are not allowed');

// Password validation - Strong password requirements
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .refine((password) => {
    // At least one lowercase letter
    return /[a-z]/.test(password);
  }, 'Password must contain at least one lowercase letter')
  .refine((password) => {
    // At least one uppercase letter or number
    return /[A-Z0-9]/.test(password);
  }, 'Password must contain at least one uppercase letter or number');

// Name validation - Sanitize user input
const nameSchema = z
  .string()
  .trim()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')
  .refine((name) => {
    // Allow letters, spaces, hyphens, apostrophes
    return /^[a-zA-Z\s\-']+$/.test(name);
  }, 'Name can only contain letters, spaces, hyphens, and apostrophes');

// Token validation - For password reset, email verification
const tokenSchema = z
  .string()
  .trim()
  .length(64, 'Invalid token format')
  .regex(/^[a-f0-9]{64}$/, 'Invalid token format');

/**
 * Signup endpoint validation
 */
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});

export type SignupInput = z.infer<typeof signupSchema>;

/**
 * Forgot password endpoint validation
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset password endpoint validation
 */
export const resetPasswordSchema = z.object({
  token: tokenSchema,
  password: passwordSchema,
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Email verification endpoint validation
 */
export const verifyEmailSchema = z.object({
  token: tokenSchema,
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

/**
 * Resend verification email validation
 */
export const resendVerificationSchema = z.object({
  email: emailSchema,
});

export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;

/**
 * Helper function to safely parse and validate request body
 * Returns either validated data or validation errors
 */
export function validateAuthInput<T>(
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
