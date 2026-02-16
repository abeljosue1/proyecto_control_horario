---
name: RPSoft UI
description: Guidelines and standards for UI development in RPSoft. Defines the "look and feel", component rules, and Definition of Done for UI tasks.
---

# RPSoft UI Standards

This skill defines how to build UI components and pages in RPSoft to ensure consistency and quality.

## 1. Tech Stack (Fixed)
-   **Core**: React (via Next.js App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React

## 2. UI Rules

### Layout & Dashboard
-   **Structure**: Main layout should have a persistent **Sidebar** (left) and **Header** (top). Content goes in the main area.
-   **Responsiveness**:
    -   **Mobile first**: Design for mobile, then enhance for desktop (`md:`, `lg:`).
    -   **Sidebar**: Collapsible or hidden behind a hamburger menu on mobile.

### Components
-   **Atomic Design**: Use a hierarchy: Atoms (buttons, inputs) -> Molecules (forms, cards) -> Organisms (sections) -> Templates/Pages.
-   **Server Components**: Keep components as Server Components (RSC) by default. Use `"use client"` ONLY when interactivity (hooks, event listeners) is needed.
-   **Props**: Always define a TypeScript interface for props (e.g., `interface ButtonProps { ... }`).

### Naming Conventions
-   **Files**: `PascalCase.tsx` for components (e.g., `ButtonPrimary.tsx`).
-   **Folders**: `PascalCase` for component folders if they contain index files, or `kebab-case` for utility folders settings.
-   **Functions**: `camelCase` for logic/hooks, `PascalCase` for component functions.

### Basic Accessibility (a11y)
-   **Images**: Always include `alt` text.
-   **Interactive Elements**: Use `aria-label` for icon-only buttons.
-   **Semantic HTML**: Use `<main>`, `<section>`, `<nav>`, `<header>`, `<footer>` appropriately to define document structure.

## 3. Definition of Done (DoD) - UI

Before marking a UI task as complete, verify:

1.  [ ] **Zero Console Errors**: No React hydration errors, no unique key warnings, no unhandled runtime errors.
2.  [ ] **Responsive**: Layout checks passing on:
    -   Mobile (375px)
    -   Tablet (768px)
    -   Desktop (1024px+)
3.  [ ] **Type Safe**: No `any` types.
4.  [ ] **Clean Code**: No `console.log` left in production code. Unused imports removed.
