---
applyTo: "**/*.spec.ts"
---
# Rules for tests

## Testing

The following rules should be applied to test files (*.spec.ts).

- Use Vitest for unit testing.
- Write comprehensive unit tests for all business logic.
- Write descriptive test names that explain the expected behavior.
- Explicitly import Vitest APIs (e.g., `import { describe, it } from 'vitest'`).
- Prefer `it` over `test` for naming test cases.
- Write test names and descriptions in English within `describe` and `it` blocks
- Run `pnpm test path/to/xxx.spec.ts --run` to run tests without watch mode.
