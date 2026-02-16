---
name: RPSoft UI
description: Guidelines and standards for UI development in RPSoft. Defines the "look and feel", component rules, and Definition of Done for UI tasks.
---

# RPSoft UI Standards

This skill defines how to build UI components and pages in RPSoft to ensure consistency and quality.

## 1. Tech Stack (Fixed)
-   **Framework**: Next.js (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React (or standard icon set used in project)

## 2. UI Rules

### Layout & Dashboard
-   **Structure**: Main layout should have a persistent Sidebar (left) and Header (top). Content goes in the main area.
-   **Responsiveness**:
    -   **Mobile first**: Design for mobile, then enhance for desktop (`md:`, `lg:`).
    -   **Sidebar**: Collapsible or hidden behind a hamburger menu on mobile.

### Components
-   **Atomic Design**: Small components (buttons, inputs) -> Molecules (forms, cards) -> Organisms (sections) -> Templates/Pages.
-   **Server Components**: Use React Server Components (RSC) by default. Use `"use client"` ONLY when interactivity (hooks, event listeners) is needed.
-   **Props**: Always define a TypeScript interface for props. `interface Props { ... }`.

### Naming Conventions
-   **Files**: `PascalCase.tsx` for components (e.g., `ButtonPrimary.tsx`).
-   **Folders**: `kebab-case` for generic folders, `PascalCase` for component folders if they contain index files.
-   **Functions**: `camelCase` for logic, `PascalCase` for component functions.

### Basic Accessibility (a11y)
-   **Images**: Always include `alt` text.
-   **Buttons**: Use `aria-label` if the button has no text (icon-only).
-   **Semantic HTML**: Use `<main>`, `<section>`, `<nav>`, `<header>`, `<footer>` appropriately.

## 3. Definition of Done (DoD) - UI

Before marking a UI task as complete, verify:

1.  [ ] **Zero Console Errors**: No React hydration errors or unique key warnings.
2.  [ ] **Responsive**: Layout does not break on:
    -   Mobile (375px)
    -   Tablet (768px)
    -   Desktop (1024px+)
3.  [ ] **Type Safe**: No `any` types. Build (`npm run build`) passes without TS errors.
4.  [ ] **Linting**: No ESLint warnings.
5.  [ ] **Clean Code**: No `console.log` left in production code. Unused imports removed.

---
**Usage**:
When creating or modifying UI, explicitly reference this skill:
"Agent, create a UserCard component following the RPSoft UI skill."
