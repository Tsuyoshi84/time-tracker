---
name: fallow-audit
description: Run `pnpm fallow audit` after creating, editing, or deleting TypeScript or Vue files to check code quality (dead code, complexity, duplication on changed files). Always use this skill after any `.ts`, `.tsx`, or `.vue` file change — even small edits — before considering the task complete. Consult the fallow skill when you need to trace findings, auto-fix, or dig deeper into audit results.
paths:
  - "**/*.{ts,tsx,vue}"
---

# Fallow Audit

After creating, editing, or deleting any `.ts`, `.tsx`, or `.vue` file, run from the repository root:

```bash
FALLOW_AGENT_SOURCE=cursor pnpm fallow audit --format json --quiet --explain 2>/dev/null || true
```

This matches CI (`fallow-rs/fallow@v2` with `command: audit`).
It scopes analysis to files changed since the base branch (default `main`) and gates on **new-only** findings — the same policy as `.fallowrc.json` rule severities.

## When to skip

Skip only when the session did not touch any `.ts`, `.tsx`, or `.vue` file (for example, Markdown-only or config-only edits).

## Read the result

Parse the JSON envelope (`kind: "audit"`).

| Field | Meaning |
| --- | --- |
| `verdict` | `pass`, `warn`, or `fail` — treat `fail` as blocking |
| `summary.dead_code_issues` | Total dead-code findings in changed files |
| `summary.dead_code_has_errors` | Any error-severity dead-code issue |
| `summary.complexity_findings` | Functions above complexity thresholds |
| `summary.duplication_clone_groups` | Clone groups in changed files |
| `attribution.*_introduced` | Issues your edits introduced (fix these first) |
| `attribution.*_inherited` | Pre-existing issues in touched files (fix only when asked or when using `--gate all`) |

If stdout is `{"error": true, ...}` (exit code 2), report the error and continue — do not treat it as a quality failure.

## Fix introduced issues

When `verdict` is `fail`, or when `attribution` shows introduced issues you can fix:

1. Read findings under `dead_code`, `complexity`, and `duplication` in the audit envelope.
2. Prefer fixing code over suppression.
3. Re-run the audit command until `verdict` is `pass` or only inherited warn-tier findings remain.

Common fixes:

- **Unused export** after a rename or refactor — remove the export or update importers.
- **Unlisted dependency** — add the package to `package.json`.
- **Unresolved import** — fix the path or install the missing package.
- **High complexity** — extract helpers or simplify branching.
- **Duplication** — consolidate the clone group.

## When you need more detail

Read and follow `.agents/skills/fallow/SKILL.md` (the **fallow** skill) for:

- `fallow dead-code --trace`, `--trace-file`, `--trace-dependency` — confirm a finding before deleting code
- `fallow fix --dry-run` then `fallow fix --yes` — preview and apply safe auto-fixes
- Targeted commands (`dead-code`, `dupes`, `health`) when audit output is not enough
- Inline suppressions (`// fallow-ignore-next-line`, `/** @expected-unused */`) when a finding is intentional

Do not duplicate fallow CLI reference here — delegate to the fallow skill.

## Suppression (last resort)

Only suppress when you are sure the finding is a false positive or intentionally unused.
Always add a short comment explaining why.

```ts
// fallow-ignore-next-line unused-export -- re-exported for external consumers via package.json exports
export const legacyHelper = () => {}
```

```ts
/** @expected-unused -- kept for upcoming public API, tracked in issue #123 */
export type FutureConfig = { enabled: boolean }
```

## Completion order

After TypeScript or Vue edits, run verification in this order before finishing:

1. `lint-fix` skill (Oxlint + ESLint)
2. `type-check` skill (`pnpm typecheck`)
3. This skill (`pnpm fallow audit`)
