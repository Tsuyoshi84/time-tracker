---
applyTo: "app/**/*.vue"
---
# Vue component rules

This rule provides standards for Vue components.

## Architecture

- Favor the Composition API (`setup` functions and composables) over the Options API
- Organize components and composables by feature or domain for scalability
- Extract reusable logic into composable functions in a `app/composables/` directory

### Component Design

- Use **PascalCase** for component file names (e.g., `components/MyComponent.vue`).
- In SFC file, define each section in order: `<script setup lang="ts">`, `<template>`, `<style>`.
- Omit `<style>` section if not needed.
- Add an import statement when using a Vue component defined in this repository.
- Adhere to the single responsibility principle for components
- Keep components small and focused on one concern

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
- Avoid putting an excessive amount of logic in a component. Extract logic and define as a composable or an exported function if necessary to make it maintainable and testable.

## `<template>` in Vue SFC

- Use HTML5 semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<search>`, etc.).
- Include appropriate ARIA attributes for accessibility.
- Ensure valid markup that passes W3C validation.
- Avoid unnecessary nested elements for better performance.
- Include `loading="lazy"` on images where applicable.
- Avoid using index for `key` attribute when using `v-for`.
- Prefer v-show when toggling visibility frequently, otherwise use v-if.
- Specify `type` attribute for `<button>` elements.
- Pass an object to `<NuxtLink :to>` for better type safety. For example, `<NuxtLink :to="{ name: 'about' }">`.
- Use TailwindCSS for styling.

## CSS and Styling

- Use Tailwind CSS utility classes for styling
- Avoid custom CSS when Tailwind utilities are available
- Prefer `rem` over `px` for font sizes and spacing
- Use modern CSS features without hesitation, as we only support the latest version of Chrome and Edge.

## Performance

- Follow the "Prop Stability" performance best practice mentioned in the Vue official document
- Follow the "Computed Stability" performance best practice mentioned in the Vue official document
- Apply `v-once` and `v-memo` for static or infrequently changing elements.
- Avoid unnecessary watchers; prefer `computed` where possible.

## Testing

- Write unit tests with Vue Test Utils and Vue Testing Library for atom and molecule components
- Focus on behavior, not implementation details
- Mock global plugins (router, Pinia) as needed
- Test accessibility using axe-core integration

## Security

- Avoid using `v-html`; sanitize any HTML inputs rigorously
- Use CSP headers to mitigate XSS and injection attacks
- Validate and escape data in templates and directives
- Use HTTPS for all API requests
- Store sensitive tokens in HTTP-only cookies, not `localStorage`
