---
applyTo: 'app/utils/**/*.ts'
---

# Rules for utils functions

- Do NOT import from `app/composables` or `app/stores`.
- Do NOT depend on the Vue reactivity system.
- Provide unit tests for every utility function.
- Define pure and side-effect-free functions.
- Define generic and reusable functions.
- Write performant and optimized code.
- Use clear and descriptive names.
- Add JSDoc comments. Put `@example` tags to illustrate usage if applicable.
- Write tests with a comprehensive suite of unit tests.
