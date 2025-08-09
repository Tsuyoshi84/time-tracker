---
applyTo: "shared/**/*.ts"
---
# Shared directory

- Files in `shared` can be consumed by **both** the Vue application **and** the Nitro server.
- Code in `shared` **must not** import from `app` or `server` directories.
- Code in `shared` **must not** depend on Nitro APIs or the Vue reactivity system.
- Provide unit tests for every shared function.
