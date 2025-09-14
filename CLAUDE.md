# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Time Tracker** is a professional time tracking SPA designed for freelance engineers. Built with Nuxt 4, it provides local-first data storage using IndexedDB and supports flexible work sessions across multiple days.

## Development Commands

```bash
# Development
pnpm dev          # Start development server
pnpm generate     # Generate static files (for GitHub Pages deployment)
pnpm preview      # Preview production build

# Code Quality
pnpm typecheck    # Run TypeScript type checking
pnpm check        # Run Biome lint/format (auto-fix)
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues

# Testing
pnpm test         # Run tests in watch mode
pnpm test:run     # Run tests once
```

## Tech Stack

- **Nuxt 4** in SPA mode with Vue.js 3.5 and TypeScript
- **Tailwind CSS 3** with daisyUI component framework
- **IndexedDB** via Dexie for local data persistence
- **VueUse** for enhanced composables
- **Vitest** with happy-dom for testing
- **Sentry** for error tracking

## Architecture

### Directory Structure

```
app/
├── components/        # Vue components following Atomic Design
├── composables/       # Reusable logic (useTimeTracker, useTheme)
├── pages/            # Route pages (index.vue, weekly.vue)
├── types/            # TypeScript definitions
├── utils/            # Utility functions with comprehensive tests
└── layouts/          # Layout components
```

### Core Data Flow

**State Management:**

- `useTimeTracker()` composable manages all timer state and database operations
- Local-first approach with IndexedDB storage via `utils/database.ts`
- No external API dependencies - fully offline capable

**Key Types:**

- `TimeSession`: Core data structure with startTime, endTime, duration
- `TimerState`: Current timer status (isRunning, currentSession)
- `DayStats`/`WeekStats`: Aggregated statistics for analytics

### Database Architecture

Uses Dexie (IndexedDB wrapper) with these operations:

- `getActiveSession()`: Retrieve currently running session
- `saveSession()`: Create new session
- `updateSession()`: Modify existing session
- `getSessionsByDate()`: Daily session retrieval
- `checkForOverlappingSessions()`: Validation for time conflicts

### Component Patterns

- **Composition API** with `<script setup>` syntax
- **TypeScript-first** development with strict typing
- **Single responsibility** components with clear interfaces
- **Reactive state** using Vue 3's reactivity system

### Time Handling

- **Cross-midnight sessions**: Sessions can span across date boundaries
- **Editable entries**: Click-to-edit functionality for manual time adjustments
- **Duration calculations**: Precise millisecond tracking with branded types
- **Multiple daily sessions**: Support for breaks and resumed work

### Theme System

- **daisyUI** light/dark theme switching
- **VueUse** `useColorMode` for system preference detection
- **Tailwind CSS** dark mode classes
- **LocalStorage** persistence for user preference

### Testing Strategy

- **Vitest** for unit tests with happy-dom environment
- **Vue Test Utils** and **Vue Testing Library** for component testing
- Comprehensive test coverage for utilities (`utils/*.spec.ts`)
- Testing both business logic and UI interactions

### Build Configuration

- **SPA mode** for GitHub Pages deployment
- **TypeScript** with strict configuration
- **Biome** for code formatting and linting
- **ESLint** for additional code quality checks
- **pnpm** package manager with specific overrides

## Development Guidelines

### Code Quality Requirements

- Run `pnpm check` after code changes to auto-fix formatting
- Run `pnpm typecheck` to verify type safety
- Run `pnpm lint` to check for additional issues
- Follow existing component and utility patterns

### Pull Request Conventions

Use these prefixes in PR titles:

- `fix:` for bug fixes
- `feat:` for new features
- `docs:` for documentation changes
- `refactor:` for code refactoring
- `test:` for adding or updating tests
- `chore:` for maintenance tasks

### Component Development

- Use Composition API with `<script setup>`
- Follow TypeScript-first development
- Implement proper JSDoc comments
- Add accessibility attributes where needed
- Write unit tests for complex logic
- Reuse existing utilities and components

### Utility Functions

- Place in `app/utils/` with corresponding `.spec.ts` test files
- Use branded types for type safety (e.g., `Milliseconds`)
- Export pure functions with clear interfaces
- Include comprehensive JSDoc documentation
- Handle edge cases and error scenarios
