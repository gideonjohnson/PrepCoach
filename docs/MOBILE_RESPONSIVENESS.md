# Mobile Responsiveness Guide

## Overview

PrepCoach is designed with mobile-first responsive design principles using Tailwind CSS breakpoints. This document outlines current mobile optimizations and best practices.

## Tailwind Breakpoints

```
sm: 640px   (small tablets, large phones)
md: 768px   (tablets)
lg: 1024px  (desktops)
xl: 1280px  (large desktops)
```

## Current Mobile Optimizations

### ✅ Implemented

#### 1. Navigation & Header
**Status:** Fully responsive
- Mobile hamburger menu with slide-out navigation
- Responsive logo and brand placement
- Touch-friendly menu items (min 44px height)
- Proper z-index stacking

**Files:**
- `app/page.tsx` - Landing page navigation
- `app/components/Header.tsx` - Dashboard header

#### 2. Pricing Page
**Status:** Recently optimized (Oct 25, 2025)
- Removed mobile card scaling (scale-105) that caused horizontal scroll
- Responsive text sizing (3xl → 4xl → 5xl)
- Touch-friendly buttons (min-h-[48px], larger text)
- Responsive padding (p-6 sm:p-8)
- Mobile-optimized spacing

**Changes Made:**
```tsx
// Before
className="p-8 transform scale-105 hover:scale-110"

// After
className="p-6 sm:p-8 md:transform md:scale-105 md:hover:scale-110"
```

#### 3. Authentication Pages
**Status:** Fully responsive
- Centered forms with max-width constraint
- Proper padding (px-4) prevents edge-to-edge content
- Touch-friendly input fields
- Responsive button sizing

#### 4. Homepage/Landing
**Status:** Fully responsive
- Responsive grid layouts (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4)
- Flexible hero section
- Mobile-optimized CTAs
- Responsive images with proper aspect ratios

#### 5. Forms & Inputs
**Status:** Good touch targets
- Input fields: py-3 (minimum 36px + padding = ~48px touch target)
- Buttons: min-h-[48px] ensures adequate touch area
- Proper spacing between form elements

## Common Patterns

### Responsive Text Sizing
```tsx
// Headings
className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl"

// Body text
className="text-base sm:text-lg md:text-xl"

// Small text
className="text-sm sm:text-base"
```

### Responsive Spacing
```tsx
// Padding
className="px-4 sm:px-6 lg:px-8"
className="py-8 sm:py-12 lg:py-16"

// Margins
className="mb-8 sm:mb-12 lg:mb-16"

// Gaps
className="gap-4 sm:gap-6 lg:gap-8"
```

### Responsive Grids
```tsx
// Single column mobile, multi-column desktop
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Responsive feature cards
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
```

### Touch Targets
```tsx
// Buttons (minimum 44x44px for good UX)
className="min-h-[48px] px-6 py-3 sm:py-4"

// Links
className="min-h-[44px] inline-flex items-center"

// Icons
className="w-6 h-6" // Minimum icon size
```

### Conditional Transforms
```tsx
// Only apply scale transforms on desktop to prevent horizontal scroll
className="md:transform md:scale-105 md:hover:scale-110"

// Mobile: no transform, Desktop: scale effect
className="hover:shadow-xl md:hover:scale-105"
```

## Known Mobile Issues & Recommendations

### 🔄 Needs Improvement

#### 1. Dashboard Charts
**Issue:** Fixed height (250px) may be too tall on small screens
**Location:** `app/dashboard/page.tsx:390, 434`

**Recommendation:**
```tsx
// Current
<ResponsiveContainer width="100%" height={250}>

// Suggested
<ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 200 : 250}>
// Or use responsive height
className="h-48 sm:h-64 md:h-72"
```

#### 2. Dashboard Action Cards
**Issue:** Many cards have `transform hover:scale-105` which can cause touch issues
**Location:** `app/dashboard/page.tsx:268, 328, 340, 352, 364`

**Recommendation:**
```tsx
// Change from
className="transform hover:scale-105"

// To
className="md:transform md:hover:scale-105"
```

#### 3. Table Overflow
**Issue:** Wide tables may overflow on mobile
**Location:** Session history tables

**Recommendation:**
```tsx
// Add horizontal scroll container
<div className="overflow-x-auto">
  <table className="min-w-full">
    ...
  </table>
</div>
```

#### 4. Modal Dialogs
**Issue:** Modals may not fit on small screens
**Recommendation:**
```tsx
// Make modals full-screen on mobile
className="max-w-full sm:max-w-lg w-full sm:w-auto h-full sm:h-auto"
```

## Mobile Testing Checklist

### Device Testing
- [ ] iPhone SE (375px) - Smallest common phone
- [ ] iPhone 12/13/14 (390px)
- [ ] iPhone Pro Max (428px)
- [ ] Android Small (360px)
- [ ] Android Medium (412px)
- [ ] iPad Mini (768px)
- [ ] iPad Pro (1024px)

### Browser Testing
- [ ] Safari iOS
- [ ] Chrome Android
- [ ] Chrome iOS
- [ ] Samsung Internet
- [ ] Firefox Mobile

### Orientation Testing
- [ ] Portrait orientation
- [ ] Landscape orientation
- [ ] Rotation handling

### Feature Testing

#### Navigation
- [ ] Hamburger menu opens/closes smoothly
- [ ] All menu items accessible
- [ ] No horizontal scroll on any page
- [ ] Proper z-index stacking (menu over content)

#### Forms
- [ ] Inputs focus properly on tap
- [ ] Virtual keyboard doesn't cover inputs
- [ ] Submit buttons accessible above keyboard
- [ ] Form validation messages visible

#### Buttons & CTAs
- [ ] All buttons minimum 44x44px
- [ ] Adequate spacing between tappable elements
- [ ] Visual feedback on tap (active states)
- [ ] No accidental double-taps

#### Content
- [ ] Text readable without zooming (minimum 16px)
- [ ] Images scale properly
- [ ] No content cut off at edges
- [ ] Proper spacing between sections

#### Performance
- [ ] Page loads under 3 seconds on 3G
- [ ] No layout shift (CLS < 0.1)
- [ ] Smooth scrolling
- [ ] Fast tap responses (<100ms)

## Performance Optimizations for Mobile

### Image Optimization
```tsx
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

### Lazy Loading
```tsx
// Lazy load below-the-fold content
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false
});
```

### Font Loading
```tsx
// Use font-display: swap
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});
```

## Accessibility on Mobile

### Touch Targets
- **Minimum size:** 44x44px (Apple HIG)
- **Minimum size:** 48x48px (Material Design)
- **Spacing:** 8px minimum between targets

### Focus States
```tsx
// Visible focus for keyboard navigation
className="focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
```

### Screen Reader Support
```tsx
// Proper semantic HTML
<nav aria-label="Main navigation">
<button aria-label="Open menu" aria-expanded={isOpen}>
<main id="main-content">
```

## Common Pitfalls to Avoid

### ❌ Don't Do This

```tsx
// 1. Fixed widths that break mobile
<div className="w-[1200px]"> // ❌

// 2. Small touch targets
<button className="p-1 text-xs"> // ❌

// 3. Horizontal scroll
<div className="min-w-[800px]"> // ❌

// 4. Hidden overflow without scroll
<div className="overflow-hidden"> // ❌ (if content overflows)

// 5. Desktop-only transforms on mobile
<div className="transform scale-150"> // ❌ (causes horizontal scroll)
```

### ✅ Do This Instead

```tsx
// 1. Responsive max-widths
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> // ✅

// 2. Adequate touch targets
<button className="px-4 py-3 min-h-[48px]"> // ✅

// 3. Responsive with scroll
<div className="w-full overflow-x-auto"> // ✅

// 4. Visible overflow indicator
<div className="overflow-x-auto scrollbar-thin"> // ✅

// 5. Conditional transforms
<div className="md:transform md:scale-105"> // ✅
```

## Viewport Meta Tag

Ensure proper viewport configuration in `app/layout.tsx`:

```tsx
export const metadata = {
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5, // Allow zoom for accessibility
    userScalable: true,
  },
};
```

## CSS Media Queries (if needed)

```css
/* Mobile-first approach */
.my-component {
  /* Mobile styles (default) */
  padding: 1rem;
}

@media (min-width: 640px) {
  /* Tablet and up */
  .my-component {
    padding: 1.5rem;
  }
}

@media (min-width: 1024px) {
  /* Desktop */
  .my-component {
    padding: 2rem;
  }
}
```

## Testing Tools

### Browser DevTools
- Chrome DevTools Device Mode
- Safari Responsive Design Mode
- Firefox Responsive Design Mode

### Online Tools
- BrowserStack (real devices)
- LambdaTest (real devices)
- Responsive Design Checker

### Lighthouse Mobile Audit
```bash
# Run Lighthouse mobile audit
npx lighthouse https://aiprep.work --preset=perf --view --only-categories=performance --form-factor=mobile
```

## Quick Wins for Mobile Performance

1. **Enable text compression** (Gzip/Brotli) ✅ Vercel handles this
2. **Minify CSS/JS** ✅ Next.js handles this
3. **Use WebP images** ✅ Next.js Image component
4. **Lazy load images** ✅ Use loading="lazy"
5. **Reduce JavaScript bundle** ✅ Code splitting
6. **Use CDN** ✅ Vercel Edge Network

## Resources

### Design Guidelines
- Apple Human Interface Guidelines
- Material Design Guidelines
- Web Content Accessibility Guidelines (WCAG)

### Documentation
- Tailwind CSS Responsive Design: https://tailwindcss.com/docs/responsive-design
- Next.js Image Optimization: https://nextjs.org/docs/basic-features/image-optimization
- MDN Responsive Images: https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images

---

**Last Updated:** October 25, 2025
**Status:** ✅ Major pages optimized, minor improvements recommended
**Priority:** Medium - Current implementation is functional, optimizations are enhancements
