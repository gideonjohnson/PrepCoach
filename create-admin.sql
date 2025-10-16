-- Create Master Admin Account for PrepCoach
-- Password: PrepCoach2025!Admin

INSERT INTO "User" (
  id,
  name,
  email,
  "emailVerified",
  password,
  "isAdmin",
  "subscriptionTier",
  "subscriptionStatus",
  "subscriptionStart",
  "interviewsThisMonth",
  "feedbackThisMonth",
  "lastResetDate",
  "createdAt",
  "updatedAt"
) VALUES (
  'admin_master_001',
  'PrepCoach Admin',
  'admin@aiprep.work',
  NOW(),
  '$2b$12$zHKPhXZd7zzHg8drBbXDF.JYknw83otzg1TPcTuwFxqdk1kFvfvTy',
  true,
  'lifetime',
  'active',
  NOW(),
  0,
  0,
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password = '$2b$12$zHKPhXZd7zzHg8drBbXDF.JYknw83otzg1TPcTuwFxqdk1kFvfvTy',
  "isAdmin" = true,
  "subscriptionTier" = 'lifetime',
  "subscriptionStatus" = 'active';
