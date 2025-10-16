# PrepCoach Design System Documentation

## Overview

PrepCoach now features a comprehensive, professional design system with reusable components, standardized styling, and consistent UX patterns across the entire application.

---

## Design Tokens

### Colors

Our color palette is built around an energetic orange/red brand identity with supporting colors for various UI states:

**Brand Colors:**
- Primary: `#f97316` (Orange 500)
- Primary Dark: `#ea580c` (Orange 600)
- Secondary: `#a855f7` (Purple 500)
- Accent: `#3b82f6` (Blue 500)

**Semantic Colors:**
- Success: `#22c55e` (Green 500)
- Error: `#ef4444` (Red 500)
- Warning: `#f59e0b` (Amber 500)
- Info: `#3b82f6` (Blue 500)

**Neutral Palette:**
- Gray 50 through Gray 900 for text, backgrounds, and borders

### Typography

- **Font Family:** Geist Sans (primary), Geist Mono (code)
- **Font Smoothing:** Antialiased for optimal rendering
- **Scale:** Follows Tailwind's default scale with semantic sizes

### Spacing

Follows a consistent 4px grid system:
- xs: `0.25rem` (1)
- sm: `0.5rem` (2)
- md: `1rem` (4)
- lg: `1.5rem` (6)
- xl: `2rem` (8)
- 2xl: `3rem` (12)

### Border Radius

- sm: `0.375rem` (rounded-md)
- md: `0.5rem` (rounded-lg)
- lg: `0.75rem` (rounded-xl)
- xl: `1rem` (rounded-2xl)
- 2xl: `1.5rem` (rounded-3xl)
- full: `9999px` (rounded-full)

### Shadows

Defined shadow scale for depth hierarchy:
- sm: Subtle elevation
- md: Default cards
- lg: Prominent elements
- xl: Modals and overlays

### Transitions

Standard durations for consistent animations:
- Fast: `150ms` - Micro-interactions
- Base: `300ms` - Standard transitions
- Slow: `500ms` - Complex animations

---

## Component Library

### 1. Button Component

**Location:** `app/components/Button.tsx`

**Variants:**
- `primary` - Orange gradient (CTAs)
- `secondary` - White with border (alternative actions)
- `success` - Green (confirmations)
- `danger` - Red (destructive actions)
- `ghost` - Transparent (tertiary)
- `outline` - Transparent with orange border

**Sizes:**
- `sm` - 36px height
- `md` - 44px height (default, mobile-friendly)
- `lg` - 56px height

**Features:**
- Loading state with spinner
- Left/right icon support
- Disabled state
- Hover scale effect
- Focus ring
- Accessibility compliant

**Usage:**
```tsx
import { Button } from '@/app/components';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

<Button variant="secondary" isLoading>
  Processing...
</Button>
```

---

### 2. Card Component

**Location:** `app/components/Card.tsx`

**Variants:**
- `default` - Standard card with border and subtle shadow
- `bordered` - Emphasized border, no shadow
- `elevated` - Prominent shadow, no border
- `interactive` - Hover effects for clickable cards

**Padding Options:**
- `none` - No padding (for custom layouts)
- `sm` - 16px
- `md` - 24px (default)
- `lg` - 32px

**Sub-components:**
- `CardHeader` - Card header section
- `CardTitle` - Semantic heading
- `CardDescription` - Supporting text
- `CardContent` - Main content area
- `CardFooter` - Actions section with top border

**Usage:**
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/components';

<Card variant="interactive" padding="md">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Supporting description text</CardDescription>
  </CardHeader>
  <CardContent>
    Main content goes here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

### 3. Input Component

**Location:** `app/components/Input.tsx`

**Features:**
- Label with required indicator
- Error state with icon and message
- Help text
- Left/right icon slots
- Disabled state
- Three sizes (sm, md, lg)
- Full accessibility (ARIA attributes)

**Components:**
- `Input` - Standard text input
- `Textarea` - Multi-line text input

**Usage:**
```tsx
import { Input, Textarea } from '@/app/components';

<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  required
  error={errors.email}
  helpText="We'll never share your email"
/>

<Textarea
  label="Message"
  placeholder="Type your message..."
  rows={4}
/>
```

---

### 4. Badge Component

**Location:** `app/components/Badge.tsx`

**Variants:**
- `default` - Gray
- `primary` - Orange
- `secondary` - Purple
- `success` - Green
- `warning` - Yellow
- `danger` - Red
- `info` - Blue

**Sizes:**
- `sm` - Extra small
- `md` - Medium (default)
- `lg` - Large

**Usage:**
```tsx
import { Badge } from '@/app/components';

<Badge variant="success" size="md">Active</Badge>
<Badge variant="primary">Pro</Badge>
```

---

### 5. Alert Component

**Location:** `app/components/Alert.tsx`

**Variants:**
- `info` - Blue (informational)
- `success` - Green (success messages)
- `warning` - Yellow (warnings)
- `danger` - Red (errors)

**Features:**
- Optional title
- Appropriate icon for each variant
- Dismissible with close button
- Accessible roles

**Usage:**
```tsx
import { Alert } from '@/app/components';

<Alert variant="success" title="Success!" onClose={() => {}}>
  Your changes have been saved successfully.
</Alert>

<Alert variant="warning">
  Please review your information before submitting.
</Alert>
```

---

### 6. Skeleton Loaders

**Location:** `app/components/Skeleton.tsx`

**Components:**
- `Skeleton` - Base skeleton primitive
- `SkeletonCard` - Card placeholder
- `SkeletonText` - Multi-line text placeholder
- `SkeletonButton` - Button placeholder
- `SkeletonAvatar` - Avatar placeholder
- `SkeletonTable` - Table placeholder
- `SkeletonDashboard` - Full dashboard placeholder

**Features:**
- Pulse animation
- Composable primitives
- Pre-built patterns for common layouts

**Usage:**
```tsx
import { SkeletonCard, SkeletonText, SkeletonDashboard } from '@/app/components';

// Loading state
{isLoading ? <SkeletonCard /> : <ActualCard />}

// Dashboard loading
{isLoading && <SkeletonDashboard />}
```

---

### 7. Header Component

**Location:** `app/components/Header.tsx`

**Features:**
- Sticky positioning
- Backdrop blur effect
- Dynamic shadow on scroll
- Mobile responsive menu
- Keyboard shortcuts (Alt + P, D, R, H)
- Active route highlighting
- User profile avatar
- Smooth animations

**Improvements Made:**
- Added ARIA labels for accessibility
- Enhanced mobile menu button with hover state
- Improved menu animation with opacity
- Better focus states

---

### 8. Error & Permission Components

**ErrorBoundary** (`app/components/ErrorBoundary.tsx`):
- Catches React errors
- Displays friendly error message
- Reload functionality

**MicrophonePermissionBanner** (`app/components/MicrophonePermissionBanner.tsx`):
- Prompts for microphone access
- Shows permission status
- Browser compatibility info

---

## Animations

All animations are defined in `app/globals.css`:

**Available Animations:**
- `animate-fade-in` - Fade in (300ms)
- `animate-slide-up` - Slide up from bottom (300ms)
- `animate-slide-down` - Slide down from top (300ms)
- `animate-scale-in` - Scale in (200ms)

**Usage:**
```tsx
<div className="animate-fade-in">Content</div>
<div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
  Delayed content
</div>
```

---

## Accessibility Features

### Focus Management
- All interactive elements have visible focus rings
- Focus ring: `2px solid orange-500` with `2px offset`
- Global focus-visible styling

### ARIA Attributes
- Proper `aria-label` on icon buttons
- `aria-expanded` on toggles
- `aria-invalid` on form fields with errors
- `aria-describedby` linking errors/help text

### Keyboard Navigation
- All components fully keyboard accessible
- Proper tab order
- Keyboard shortcuts in Header component

### Color Contrast
- All text meets WCAG AA standards
- Error states use icons + text (not just color)
- Proper contrast ratios maintained

---

## Custom Scrollbar

Custom scrollbar styling for better visual consistency:
- Width: 8px
- Track: Gray 100
- Thumb: Gray 300 (hover: Gray 400)
- Rounded corners

---

## Responsive Design

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Mobile-First Approach
- All components designed mobile-first
- Touch targets minimum 44px height
- Responsive padding and spacing
- Mobile menu for navigation

---

## Usage Guidelines

### Importing Components

Use the centralized index file:

```tsx
import { Button, Card, Input, Badge, Alert } from '@/app/components';
```

Or import individually:

```tsx
import { Button } from '@/app/components/Button';
```

### Component Composition

Build complex UIs by composing primitives:

```tsx
<Card variant="interactive">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Interview Session</CardTitle>
      <Badge variant="success">Active</Badge>
    </div>
    <CardDescription>Practice your skills</CardDescription>
  </CardHeader>
  <CardContent>
    <Alert variant="info">Remember to speak clearly!</Alert>
  </CardContent>
  <CardFooter>
    <Button variant="primary">Start Recording</Button>
    <Button variant="ghost">Skip</Button>
  </CardFooter>
</Card>
```

### Styling Patterns

**Consistent Borders:**
- Use `border` (1px) not `border-2` for cleaner look
- Border color: `border-gray-100` or `border-gray-200`

**Consistent Shadows:**
- Cards: `shadow-sm` or `shadow-md`
- Hover: `hover:shadow-lg`
- Modals: `shadow-xl` or `shadow-2xl`

**Consistent Spacing:**
- Card padding: `p-6` (24px)
- Section gaps: `space-y-6` or `gap-6`
- Button padding: `px-4 py-2` or `px-6 py-3`

**Gradients:**
- Primary CTA: `from-orange-500 to-red-500`
- Backgrounds: `from-purple-50 via-white to-blue-50`

---

## Performance Considerations

### Animation Performance
- Animations use `transform` and `opacity` (GPU-accelerated)
- Avoid animating `height`, `width`, or `margin`

### Component Size
- All components are tree-shakeable
- Import only what you need
- Components are modular and lightweight

---

## Future Enhancements

### Dark Mode (Planned)
- CSS variables already in place
- Can be enabled with theme switching
- Would use `prefers-color-scheme` detection

### Additional Components (Potential)
- Modal/Dialog system
- Dropdown menus
- Tabs component
- Tooltip system
- Toast notifications (currently using react-hot-toast)
- Data table component

---

## Summary

The PrepCoach design system provides:

✅ **Consistency** - Standardized components across the app
✅ **Accessibility** - WCAG AA compliant with proper ARIA
✅ **Performance** - GPU-accelerated animations, tree-shakeable
✅ **Developer Experience** - Type-safe, well-documented, easy to use
✅ **Visual Polish** - Professional gradients, shadows, and animations
✅ **Responsive** - Mobile-first, touch-friendly design
✅ **Maintainability** - Centralized design tokens, DRY principles

The design system creates a cohesive, professional user experience while making it easy for developers to build new features with consistent styling and behavior.
