---
name: upgrade-nuxt
description: Upgrades Nuxt to the latest version, verifies types, lint, and build, then opens a pull request. Use when the user asks to upgrade Nuxt, update the Nuxt version, or run a Nuxt version bump.
---

# Upgrade Nuxt

End-to-end workflow to bump Nuxt, validate the codebase, and open a PR.

## Workflow

Copy this checklist and track progress:

```
Task Progress:
- [ ] Step 1: Upgrade Nuxt
- [ ] Step 2: Fix upgrade issues (if any)
- [ ] Step 3: Type check
- [ ] Step 4: Lint fix
- [ ] Step 5: Build
- [ ] Step 6: Open pull request
```

### Step 1: Upgrade Nuxt

From the repository root:

```bash
pnpm dlx nuxt upgrade --dedupe
```

Review the command output for breaking changes, migration notes, or manual follow-up steps.

### Step 2: Fix upgrade issues

If the upgrade introduces type errors, lint issues, or breaking API changes, fix them before verification.
Consult [nuxt-knowledge](../nuxt-knowledge/SKILL.md) when migration behavior is unclear.

### Step 3: Type check

Read and follow [.agents/skills/type-check/SKILL.md](../type-check/SKILL.md).
Run `pnpm typecheck` and fix all reported errors before continuing.

### Step 4: Lint fix

Read and follow [.agents/skills/lint-fix/SKILL.md](../lint-fix/SKILL.md).
Run `pnpm lint:fix` and `pnpm lint-vue:fix`, then resolve any remaining issues.

### Step 5: Build

From the repository root:

```bash
pnpm build
```

Fix any build errors before continuing.

### Step 6: Open pull request

Only proceed when type check, lint, and build all pass.

Read and follow [.agents/skills/open-pr/SKILL.md](../open-pr/SKILL.md) to commit changes (if needed), push, and create the PR.

Suggested PR title prefix: `chore:` (e.g. `chore: upgrade Nuxt to v4.x`).

In the PR body, note the previous and new Nuxt versions and any migration steps taken.
