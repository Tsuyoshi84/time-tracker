---
applyTo: "app/utils/**/*.ts"
---
# Rules for utils functions

- Code in `app/utils` **must not** import from `app/composables` or `app/stores`.
- Code in `app/utils` **must not** depend on the Vue reactivity system.
- Provide unit tests for every utility function.
