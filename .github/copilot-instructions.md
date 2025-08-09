# Nuxt Application Development Guidelines

Instructions for high-quality Nuxt applications with Tailwind CSS styling and TypeScript.

## Project Context

- Nuxt 4
- Vue.js 3.5
- VueUse for utility composables
- Node.js 22 for server-side runtime
- TypeScript for type safety
- Tailwind 3 CSS for styling
- Vitest for unit tests
- Vue Test Utils and Vue Testing Library for Vue component tests
- pnpm for managing packages
- Sentry for bug tracking
- Biome for lint and format

## Directory Structure

- Use `app/pages` for page components.
- Use `app/components` for reusable components. The directory structure follows Atomic Design (atoms/molecules/organisms/templates/pages).
- Use `app/layouts` for layout components.
- Use `app/composables` for composables.
- Use `app/types` for type definitions.
- Use `app/utils` for utility functions.
- Use `server/api` for API endpoints.
- Use `server/utils` for utility functions.
- Use `shared` for both Vue app and server.

## Core workflows (pnpm scripts)

- Launch with dev mode: `pnpm dev`.
- Build: `pnpm build`.
- Typecheck: `pnpm typecheck`
- Lint/format: `pnpm check` (Biome)
- Lint: `pnpm lint` (ESLint).
- Tests: `pnpm test [path] --run` (Vitest, happy‑dom).

## Browser Compatibility

- Support latest stable releases of major browsers:
  - Chrome
  - Edge

## Code generation

Follow these instructions when generating code:

- Run `pnpm check` after generating code to fix them by Biome
- Run `pnpm typecheck` to make sure the code is not violating type rules
- Run `pnpm lint` to check for any linting errors
- Ensure all generated code follows the established patterns and conventions in this project
- **Avoid code duplication** by reusing existing utilities and components

## Code Review Checklist

- Ensure all functions have proper TypeScript types
- Verify JSDoc comments are present and accurate
- Check that unit tests cover edge cases
- Confirm accessibility attributes are implemented
- Validate that error handling is appropriate
- **Review variable and function names for clarity and consistency**
- **Verify that names are descriptive and avoid generic terms**
- Check if the code is following other guidelines

## Pull Requests

- When creating a pull request, use one of the following prefixes in the title:
  - `fix:` for bug fixes
  - `feat:` for new features
  - `docs:` for documentation changes
  - `style:` for code style changes (formatting, missing semi colons, etc.)
  - `refactor:` for code refactoring without changing functionality
  - `perf:` for performance improvements
  - `test:` for adding or updating tests
  - `chore:` for maintenance tasks and other changes
  - `revert:` for reverting previous commits
