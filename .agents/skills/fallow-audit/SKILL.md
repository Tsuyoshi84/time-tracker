---
name: fallow-audit
description: Run `pnpm fallow audit` after creating, editing, or deleting TypeScript or Vue files to check code quality (dead code, complexity, duplication on changed files). Always use this skill after any `.ts`, `.tsx`, or `.vue` file change — even small edits — before considering the task complete. Consult the fallow skill when you need to trace findings, auto-fix, or dig deeper into audit results.
paths:
  - "**/*.{ts,tsx,vue}"
---

# Fallow Audit

After any `.ts`, `.tsx`, or `.vue` create/edit/delete, run from the repo root:

```bash
pnpm fallow audit --format json --quiet --explain --base main --gate new-only 2>/dev/null || true
git worktree list --porcelain | awk '/^worktree / { p=$2 } /fallow-audit-base-cache/ { print p }' \
  | while IFS= read -r wt; do git worktree remove --force "$wt" 2>/dev/null || true; done
git worktree prune
```

Parse JSON (`kind: "audit"`).

- `verdict: fail` → fix `attribution.*_introduced` findings, re-run the block above until `pass`
- `verdict: pass` or `warn` → done (unless the user asked to fix warns)
- `{"error": true}` (exit 2) → report error; not a quality failure

For traces, auto-fix, suppressions, or other commands → `.agents/skills/fallow/SKILL.md`
