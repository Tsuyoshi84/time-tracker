---
applyTo: 'shared/**/*.ts'
---

# Shared directory

- Files in `shared` can be consumed by both the Vue application and the Nitro server.
- Do NOT import from `app` or `server` directories.
- Do NOT depend on Nitro APIs or the Vue reactivity system.
- Provide unit tests for every shared function.
