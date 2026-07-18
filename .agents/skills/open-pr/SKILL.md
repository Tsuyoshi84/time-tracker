---
name: open-pr
description: Open a GitHub pull request. Use this when asked to open a pull request.
---

# Open a GitHub Pull Request

## Overview

Create a standardized, semantic pull request using the Pull Request Format. Analyze the actual diff to determine appropriate type, scope, and message.

## Tool Constraints

- Use only `git` and `gh` commands for all operations
- Do NOT use other MCP servers or external tools

## Workflow

### 1. Create Branch and Switch (if needed)

If the current branch is `main`, create a new branch and switch.

**Automatically generate the branch name** (do NOT ask the user):

- Analyze the diff to determine the change type: `fix`, `feat`, `docs`, `refactor`, `perf`, `test`, `chore`, or `ci`
- Generate concise words describing the change (2-4 words, lowercase, hyphen-separated)
- Format: `<prefix>/<concise-words>` (e.g., `feat/user-authentication`, `fix/button-alignment`, `docs/api-guide`)
- Use the `git branch` command to create the branch with this auto-generated name

### 2. Commit Changes (if needed)

If the changes haven't been committed, commit them first.
If commit fails due to hooks, fix and create NEW commit (don't amend)

**Never commit secrets** (.env, credentials.json, private keys).

### 3. Generate Pull Request

Push to remote.
Read `.github/PULL_REQUEST_TEMPLATE.md`, use it as a structure reference, and generate a comprehensive PR description with a summary of changes and a test plan.
Use GitHub CLI (`gh`).

**Always specify both `--title` and `--body` (or `--body-file`) when creating a PR.**

- Use `--body` by default to pass the generated PR description.
- Use `--body-file` only when the body contains characters that cannot be passed via `--body` (e.g., multiline or special characters). In that case, write the body to a temporary file first, then pass it with `--body-file`.

```bash
# Default: inline body
gh pr create --title "<prefix>: <description>" --body "<generated PR description>"

# Fallback: when --body cannot handle the content
gh pr create --title "<prefix>: <description>" --body-file /tmp/pr-body.md
```

#### Pull Request Format

When creating a GitHub PR:

- Title format: `<prefix>: <description>`
  - Prefixes: `fix:`, `feat:`, `docs:`, `refactor:`, `perf:`, `test:`, `chore:`, `ci:`
- Read `.github/PULL_REQUEST_TEMPLATE.md` and use it as a structure reference when generating the body. Do NOT pass the template file directly to `--body-file`.
  - `feature.md`: Implement / update a feature, behaviour
  - `bugfix.md`: Fix a bug
  - `others.md`: Refactor code, update documents / configuration, and so on

## Best Practices

- Describe **why** and **what changed** (add key context for reviewers)
- Call out risk and impact (breaking changes, migrations, rollout/rollback notes)
- Add visuals when it helps review (screenshots/GIFs for UI changes)

## Git Safety Protocol

- NEVER update git config
- NEVER run destructive commands (--force, hard reset) without explicit request
- NEVER skip hooks (--no-verify) unless user asks
- NEVER push to `main`
