---
name: type-check
description: Run `pnpm typecheck` to verify TypeScript types after creating or editing ts/vue files. Always use this skill after any TypeScript file change — even small edits — before considering the task complete. Fix all type errors before finishing.
paths:
  - "**/*.{ts,vue}"
---

# Type Check

After creating or editing any `.ts` or `.vue` file, run from the repository root:

```bash
pnpm typecheck
```

If the command reports type errors, fix them before considering the task complete.
Never use `@ts-ignore` — it silently ignores errors even when they're fixed, which hides regressions.
Use `@ts-expect-error` only when truly necessary; it fails loudly if the error disappears, keeping suppression honest.
Always add a comment explaining why.

**Example of acceptable suppression:**

```ts
// @ts-expect-error -- third-party library missing types, tracked in #123
import legacy from "untyped-lib"
```
