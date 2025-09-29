---
fileMatchPattern: "shared/**/*.ts"
inclusion: fileMatch
---
# Shared directory

- Files in `shared` can be consumed by **both** the Vue application **and** the Nitro server.
- Code in `shared` **must not** depend on Nitro APIs or the Vue reactivity system.
