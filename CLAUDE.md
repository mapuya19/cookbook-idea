# CLAUDE.md - Project Best Practices

## Project Overview

This is **"Things You Bake, Things I Love"** - a digital Valentine's Day baking scrapbook built as an interactive web application. It's a personal gift featuring 8 interactive pages, games, animations, and sound effects.

**Tech Stack:**
- Next.js 16 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- Framer Motion 12
- Web Audio API

## Architecture Principles

### Component Organization

```
components/
├── pages/          # Full-page components (CoverPage, SignatureBakes, etc.)
├── ui/             # Reusable UI components (Polaroid, RecipeCard, etc.)
├── effects/        # Visual effects (Confetti, FloatingHearts, CursorTrail)
├── hooks/          # Custom React hooks
└── [other]         # Feature-specific components (MusicPlayer, LoadingScreen)
```

**Rules:**
- Pages represent full-screen slides in the scrapbook
- UI components are reusable across different pages
- Effects are standalone visual/audio enhancements
- Hooks encapsulate reusable stateful logic

### File Naming

- **Components:** PascalCase (e.g., `CoverPage.tsx`, `Polaroid.tsx`)
- **Utilities:** camelCase (e.g., `sounds.ts`)
- **Hooks:** `use` prefix + PascalCase (e.g., `useScrapbookNavigation.ts`)

## Code Conventions

### TypeScript

- Always use strict mode - no `any` types
- Define interfaces for component props
- Use type assertions sparingly; prefer type guards
- Export types that are used across components

```tsx
// Good
interface PolaroidProps {
  image: string;
  caption: string;
  rotation?: number;
}

export function Polaroid({ image, caption, rotation = 0 }: PolaroidProps) {
  // ...
}
```

### React Components

- Use **function components** with hooks (no class components)
- Prefer **named exports** over default exports for better tree-shaking
- Keep components focused on a single responsibility
- Extract complex logic into custom hooks

```tsx
// Good
export function CoverPage() {
  const { currentPage, goToPage } = useScrapbookNavigation();

  return <div>...</div>;
}
```

### State Management

- Use local component state with `useState` for component-specific state
- Use `useScrapbookNavigation` hook for page navigation (includes localStorage persistence)
- Avoid prop drilling - use composition or custom hooks
- Keep state as close to where it's used as possible

### Styling (Tailwind CSS)

- Use Tailwind utility classes for all styling
- Prefer semantic color tokens (e.g., `bg-pink-100`, `text-rose-500`)
- Use arbitrary values only when design tokens don't exist (e.g., `w-[375px]`)
- Responsive design: mobile-first, add `md:`, `lg:` breakpoints as needed
- Dark mode: use `dark:` prefix when relevant

```tsx
// Good
<div className="flex items-center justify-center p-8 bg-gradient-to-br from-pink-100 to-rose-200 rounded-lg shadow-lg">
```

### Animations (Framer Motion)

- Use Framer Motion for all animations and transitions
- Define animation variants as consts outside components for reusability
- Respect `prefers-reduced-motion` for accessibility
- Keep animations subtle - this is a romantic scrapbook, not a flashy site

```tsx
// Good
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

<motion.div
  variants={fadeIn}
  initial="hidden"
  animate="visible"
>
```

### Audio System

**CRITICAL:** All audio must use the centralized Web Audio API system in `utils/sounds.ts`

- **Never** create multiple AudioContext instances - causes browser warnings
- Use `getAudioContext()` to get the shared singleton context
- All sounds are programmatically generated (no external audio files)
- Keep sound effects short and subtle (500ms or less)
- Always test audio interactions across different browsers

```tsx
// Good
import { playSuccessSound, playClickSound } from '@/utils/sounds';

const handleClick = () => {
  playClickSound();
  // ... handle click
};
```

### Accessibility

- All interactive elements must be keyboard accessible
- Use semantic HTML (`<button>`, `<nav>`, `<section>`)
- Add ARIA labels when purpose isn't clear from context
- Support screen readers with proper announcements
- Respect `prefers-reduced-motion` for animations
- Ensure touch targets are at least 44x44px

```tsx
// Good
<button
  onClick={handleClick}
  onKeyPress={(e) => e.key === 'Enter' && handleClick()}
  aria-label="Next page"
  className="p-4"
>
```

### Navigation Pattern

Use the `useScrapbookNavigation` hook for all page navigation:

```tsx
import { useScrapbookNavigation } from '@/components/hooks/useScrapbookNavigation';

const { currentPage, goToPage, nextPage, prevPage } = useScrapbookNavigation();
```

**Navigation rules:**
- Total pages: 8 (indices 0-7)
- Keyboard: Arrow keys (←/→), Space (next), Escape (first page)
- Navigation persists across sessions via localStorage
- Smooth transitions between pages

## Performance Guidelines

- Lazy load images where possible
- Use `next/image` for optimized image loading
- Defer non-critical animations
- Avoid heavy computations on main thread
- Use `useMemo` and `useCallback` only when profiling shows benefit
- Keep bundle size small - avoid unnecessary dependencies

## Development Workflow

### Issue Tracking

This project uses **bd (beads)** for issue tracking:
- Issues stored in `.beads/` directory
- Syncs with git commits
- Run `bd` to see current tasks
- Create issues before starting significant work

### Git Workflow

1. Create an issue with `bd` first
2. Create a feature branch from `main`
3. Make atomic commits with clear messages
4. Push and deploy to Vercel preview
5. Merge to `main` after testing

**Commit message format:**
```
type: brief description

Types: feat, fix, refactor, chore, docs, style, test
```

### Testing Approach

Currently no formal testing setup. Manual testing checklist:
- [ ] All pages load without errors
- [ ] Navigation works (arrows, keyboard, buttons)
- [ ] Sound effects play without overlapping
- [ ] Animations are smooth
- [ ] Mobile responsive (test on actual device)
- [ ] Accessibility (keyboard navigation, screen reader)
- [ ] No console errors or warnings

## Common Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix linting issues

# Issue Tracking
bd                   # View issues
bd new               # Create new issue
bd close <id>        # Close issue

# Deployment
vercel deploy        # Deploy to Vercel preview
```

## Project-Specific Patterns

### Page Components

Each page component should:
- Accept `goToPage` prop from navigation hook
- Export a named function
- Have consistent layout (full viewport height)
- Include proper ARIA labels
- Handle its own animations

```tsx
// Example page structure
export function SignatureBakes() {
  const { goToPage } = useScrapbookNavigation();

  return (
    <motion.section
      className="min-h-screen flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Page content */}
    </motion.section>
  );
}
```

### Interactive Elements

- Games (MemoryMatch, CookieClicker) use their own state management
- Effects (Confetti, FloatingHearts) are self-contained
- All interactive sounds use the shared audio system

### Third-Party Dependencies

**Keep dependencies minimal.** Before adding:
1. Check if it can be built with existing tech
2. Verify bundle size impact
3. Ensure it supports React 19 and Next.js 16

Current critical dependencies:
- `framer-motion` - Animations
- `canvas-confetti` - Confetti effects
- Next.js built-ins - Image, Font, etc.

## Browser Compatibility

Target browsers:
- Chrome/Edge (latest)
- Safari (latest + iOS)
- Firefox (latest)

Test all features on:
- Desktop Chrome
- Desktop Safari
- iOS Safari (critical - personal device)
- Android Chrome

## Deployment

- **Platform:** Vercel (configured in `vercel.json`)
- **Build:** Automatic on push to `main`
- **Previews:** Automatic on all branches
- **Domain:** Configured in Vercel dashboard

## Design Philosophy

This is a **personal, romantic gift** - not a production app:
- Prioritize emotional impact over technical perfection
- Small imperfections add charm
- Focus on the recipient's experience (Kezia)
- Easter eggs and surprises are encouraged
- Have fun with it!
