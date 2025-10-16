// Design System Components
// Centralized exports for all reusable UI components

// Core Components
export { Button } from './Button';
export type { ButtonVariant, ButtonSize } from './Button';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
export type { CardVariant } from './Card';

export { Input, Textarea } from './Input';
export type { InputSize } from './Input';

export { Badge } from './Badge';
export type { BadgeVariant, BadgeSize } from './Badge';

export { Alert } from './Alert';
export type { AlertVariant } from './Alert';

// Loading States
export {
  Skeleton,
  SkeletonCard,
  SkeletonText,
  SkeletonButton,
  SkeletonAvatar,
  SkeletonTable,
  SkeletonDashboard,
} from './Skeleton';

// Error & Permission Handling
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as MicrophonePermissionBanner } from './MicrophonePermissionBanner';

// Layout Components
export { default as Header } from './Header';

// Interview Components
export { default as VideoInterviewer } from './VideoInterviewer';
export { default as InterviewerConfig } from './InterviewerConfig';
export type { InterviewerSettings } from './InterviewerConfig';
