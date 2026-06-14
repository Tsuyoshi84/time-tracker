---
name: lint-fix
description: Run Oxlint and ESLint after creating or editing ts/vue files. Always use this skill after any TypeScript / Vue file change — even small edits — before considering the task complete.
paths:
  - "**/*.ts"
  - "**/*.vue"
---

# Lint Fix

After creating or editing any `.ts` or `.vue` file, run from the repository root:

```bash
pnpm lint:fix

pnpm lint-vue:fix

pnpm check
```

If the command reports errors or warnings:

- Fix the code to resolve them
- If you are sure an error/warning is irrelevant, disable it with an inline comment and always add a comment explaining why
- Remove stale `oxlint-disable` / `eslint-disable` comments when the underlying issue is fixed.
  Oxlint reports unused ignore comments as errors (`reportUnusedDisableDirectives` in `.oxlintrc.json`; same check runs in CI via `pnpm lint`).

**Examples:**

```ts
// oxlint-disable-next-line no-unused-vars -- imported for type usage only, not referenced at runtime
import type { Foo } from "./foo"

// oxlint-disable-next-line typescript/no-non-null-assertion -- element is guaranteed by the calling context
const el = document.getElementById("root")!
```

```ts
// eslint-disable-next-line no-console -- console logging is acceptable in this context for debugging purposes
console.log("Debug info:", someVariable)
```
