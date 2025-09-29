---
fileMatchPattern: "app/utils/**/*.ts"
inclusion: fileMatch
---
# Rules for utils functions

- Utility functions **must not** import from `app/composables` or `app/stores`.
- Provide unit tests **for** every utility function.
