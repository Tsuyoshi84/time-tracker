# Nuxt Application Development Guidelines

Instructions for high-quality Nuxt applications with Tailwind CSS styling and TypeScript.

## General

- You have extensive expertise in Vue 3, Nuxt 3, TypeScript, Node.js, GraphQL, Vite, Vue Router, Pinia, VueUse, Vitest, and Tailwind CSS.
- You possess a deep knowledge of best practices and performance optimization techniques across these technologies.

## Project Context

- Nuxt 4
- Vue.js 3.5
- VueUse for utility composables
- TypeScript for type safety
- TailwindCSS 3 for styling
- Vitest for unit tests
- pnpm for managing packages
- Sentry for bug tracking
- Biome 2 for lint and format

## Directory Structure

- Use `app/pages` for page components.
- Use `app/components` for reusable components.
- Use `app/layouts` for layout components.
- Use `app/composables` for composables.
- Use `app/types` for type definitions.
- Use `app/utils` for utility functions.
- Use `server/api` for API endpoints.
- Use `server/utils` for utility functions.
- Use `shared` for both Vue app and server.

## Browser Compatibility

- Support latest stable releases of major browsers:
  - Chrome
  - Edge

## TypeScript

- Prefer function declarations over function expressions. However, when passing a function to a parameter, prefer using a function expression.
- Define function return types for better readability and type safety.
- Prefer interface over type when defining objects.
- Use literal union types over enums.
- Use `unknown` over `any`.
- Prefer `undefined` over `null` unless `null` has to be used.
- Prefer `for...of` statement over `forEach`. However, allow use of `forEach` when chaining.
- Avoid non-null assertion operator (`!`) unless absolutely sure the value cannot be `null` or `undefined`.
- Put `as const` on constant objects.
- Prefer the guard clause (early return) when the rest of the function can be skipped after the return.
- Do not rely on Nuxt auto-import system. Import files explicitly.
- Put .ts extension when importing TypeScript file.
- Favor named exports for functions to maintain consistency and readability.

## Code Style and Structure

- Write clean, maintainable, and technically accurate TypeScript code.
- Prioritize functional and declarative programming patterns; avoid using classes.
- Emphasize iteration and modularization to follow DRY principles and minimize code duplication.
- Use tabs for indentation.
- **Use guard clauses (early returns) to improve code readability and reduce nesting.**
  - Return early when specific conditions are not met, avoiding deep nesting.
  - Use guard clauses when processing after a certain point is only executed if specific conditions are met.
  - This pattern helps flatten code structure and makes it easier to read and maintain.

## Documents

- Write JSDoc comments for all exported functions, variables, and types for better readability and understanding.
- In JSDoc, `@return` annotation can be omitted since it's self-explanatory in most cases.
- Document complex functions with clear examples.
- Use the same language as the existing JSDocs
- Follow the existing JSDoc formatting patterns

## Naming Conventions

- Use UPPER_CASE for constants.
- Use upper case for acronyms. For example, name `getURL` instead of `getUrl`.
- Use **PascalCase** for component file names (e.g., `components/MyComponent.vue`).
- Use 'Map' as a suffix for all variables, parameters, and properties whose value is a Map instance. For example, `const userMap = new Map<string, User>()`. This rule must be applied to ref objects too.
- Use 'Set' as a suffix for all variables, parameters, and properties whose value is a Set instance. For example, `const userIdSet = new Set<string>()`. This rule must be applied to ref objects too.
- **Be descriptive but concise**: Choose names that clearly describe the purpose without being overly verbose.
- **Avoid abbreviations**: Use full words instead of abbreviations (e.g., `userProfile` instead of `usrProf`).
- **Use domain terminology**: Use terms that are familiar to the business domain and stakeholders.
- **Be consistent**: Use the same naming patterns throughout the codebase.
- **Avoid reserved words**: Don't use JavaScript/TypeScript reserved words as identifiers.
- **Consider context**: Names should make sense in the context where they're used.
- **Inconsistent casing**: Stick to the established casing conventions.
- **Overly long names**: While descriptive names are good, extremely long names can reduce readability.
- **Temporary names**: Don't use placeholder names like `temp`, `foo`, `bar` in production code.

## Nuxt

Follow these instructions when writing composables or component setup functions.

- Take advantage of VueUse functions to enhance reactivity and performance.
- Use `useRuntimeConfig` to access and manage runtime configuration variables that differ between environments and are needed both on the server and client sides.
- Pass an object to `navigateTo` for better type safety. For example, `navigateTo({ name: 'about' })` instead of `navigateTo('/about')`.

## Error handling

- Implement error boundaries for component error handling
- Use try-catch blocks for async operations
- Log errors appropriately for debugging
- When catching an error and throwing a new Error, set the original error to the `cause` property

## Vue SFC file

- Use **PascalCase** for component file names (e.g., `components/MyComponent.vue`).
- In SFC file, define each section in order: `<script setup lang="ts">`, `<template>`, `<style>`.
- Add an import statement when using a Vue component defined in this repository.

## `<script setup>` in Vue SFC

- Use TypeScript.
- In SFC file, add JSDoc at the top of `<script setup lang="ts">` section to explain the component.
- Use `defineModel` for v-model bindings.
- Use `useTemplateRef` introduced in Vue 3.5 when you need a template reference.
- Define `computed` type for better type safety. For example, `const nextLevel = computed<number>(() => currentLevel.value + 1)`.
- Define prop types by specifying `defineProps` generic rather than `Props` type. For example, `defineProps<{ level: number }>()`.
- Define emit types by specifying `defineEmits` generic rather than `Emits` type. For example, `defineEmits<{ (e: 'close'): void }>()`.
- Prefer type-only emit declarations introduced in Vue 3.3. For example, `defineEmits<{ change: [id: number] }>()`.
- Always add JSDoc to component props and emits.
- Always add JSDoc to model variables defined by `defineModel`
- For a reactive variable, use `undefined` over `null` if the default value is not known.
- Import components explicitly when using them in the `<template>` section. Don't rely on auto-import feature provided by Nuxt.
- Follow the "Prop Stability" performance best practice mentioned in the Vue official document
- Follow the "Computed Stability" performance best practice mentioned in the Vue official document

## `<template>` in Vue SFC

- Use HTML5 semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<search>`, etc.).
- Include appropriate ARIA attributes for accessibility.
- Ensure valid markup that passes W3C validation.
- Include `loading="lazy"` on images where applicable.
- Avoid using index for `key` attribute when using `v-for`.
- Prefer v-show when toggling visibility frequently, otherwise use v-if.
- Specify `type` attribute for `<button>` elements.
- Pass an object to `<NuxtLink :to>` for better type safety. For example, `<NuxtLink :to="{ name: 'about' }">`.
- Use TailwindCSS for styling.

## CSS and Styling

- Use Tailwind CSS utility classes for styling
- Avoid custom CSS when Tailwind utilities are available

## Testing

The following rules should be applied to test files (\*.spec.ts).

- Use Vitest for unit testing.
- Write comprehensive unit tests for all business logic.
- Write descriptive test names that explain the expected behavior.
- Explicitly import Vitest APIs (e.g., `import { describe, it } from 'vitest'`).
- Prefer `it` over `test` for naming test cases.
- Write test names and descriptions in English within `describe` and `it` blocks
- Run `pnpm test path/to/xxx.spec.ts --run` to run tests without watch mode.

## Utility functions

The following rule should be applied to the code stored in `app/utils` directory.

- Utility functions **must not** import from `app/composables` or `app/stores`.
- Provide unit tests **for** every utility function.

## Shared directory

The following rule should be applied to the code stored in `shared` directory.

- Files in `shared` can be consumed by **both** the Vue application **and** the Nitro server.
- Code in `shared` **must not** depend on Nitro APIs or the Vue reactivity system.

## Code generation

Follow these instructions when generating code:

- Run `pnpm check` after generating code to fix them by Biome
- Run `pnpm typecheck` to make sure the code is not violating type rules
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
  - `fix: ` for bug fixes
  - `feat: ` for new features
  - `docs: ` for documentation changes
  - `style: ` for code style changes (formatting, missing semi colons, etc.)
  - `refactor: ` for code refactoring without changing functionality
  - `perf: ` for performance improvements
  - `test: ` for adding or updating tests
  - `chore: ` for maintenance tasks and other changes
  - `revert: ` for reverting previous commits
