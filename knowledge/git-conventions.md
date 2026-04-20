# dev-team git conventions

Commit, branch, and PR shape every dev-team workflow follows. Primary owner is `github-manager`; dev agents read this before opening a task targeted at github-manager so the hand-off carries the right context.

## Branch names

`<type>/<short-kebab-slug>` — e.g. `feat/health-endpoint`, `fix/users-me-n-plus-one`, `chore/bump-bun-1.1`.

- `main` is the base branch. Never commit directly.
- One branch per task-tracker DAG. A `/buddy` run that spawns four dev agents lands on one branch — github-manager is the merge point.
- Do not force-push to `main` / `master`. Do not rewrite published history.

## Commit messages — conventional commits

```
<type>: <subject>

<body — why, not what>

Task: <t_... id>
```

| Type | Use |
|---|---|
| `feat` | New user-visible behaviour |
| `fix` | Bug fix |
| `refactor` | Internal change with no behaviour delta |
| `perf` | Measurable speed / resource win |
| `test` | Tests only (new, flaky-fix, coverage) |
| `docs` | Docs / comments only |
| `chore` | Tooling, deps, config |
| `ci` | Pipeline / workflow changes |

Subject rules:
- **Under 72 chars.** Imperative mood (`add`, `fix`, `rename`) — not past tense.
- **Lowercase after the type prefix.** `feat: add /health endpoint` — not `feat: Add`.
- **No trailing period.**
- **No emoji.**
- **Scope is optional** and only worth it when multiple packages live side-by-side (`feat(api): ...`).

Body rules:
- Wrap at ~72 chars.
- Explain **why** — the diff is the what. Pull the why from the originating task's `description`.
- Cite the task id (`Task: t_01HYX...`) so the commit is traceable back to `tasks.json`.
- No `Co-Authored-By:` footer (per user rules).

**Do not amend published commits.** If a pre-commit hook fails, fix the underlying issue and create a new commit — never `--amend` a commit the user has seen.

**Never use `--no-verify`.** If a hook fails, the hook is catching a real problem — fix it or hand back to the originating agent.

## Staging

- **`git add <path>` by explicit path.** Never `git add -A` / `git add .` — protects `.env`, credentials, stray debug files. Paths come from the originating task's `artifacts[]`.
- One logical change per commit. If a task touched code + docs + tests, one commit is fine — they are the same logical change. Don't split for the sake of splitting.
- Don't commit generated files unless the project already versions them (check `.gitignore` first).

## PR shape

```
## Summary
- <1-3 bullets of user-visible change>

## Test plan
- [ ] <checklist of how this was verified + what to verify in review>

Task: <t_... id>
```

- **Title:** same as the commit subject when it's a single-commit PR; for multi-commit PRs, pick the most user-visible change.
- **Base branch:** `main` (or whatever the repo uses).
- **Draft** if work is still in progress; **ready** when tests are green and ready for human review.
- Link the originating task id. A reviewer reading the PR can replay the task chain in `.dev-team/tasks.json`.
- If the PR crosses a security boundary (auth, input parsing, secrets, external data), the chain must include a `security-analyst` task before github-manager (`/buddy` enforces this — do not short-circuit).

## Merging

- **Squash** by default when a PR has review-churn commits.
- **Merge commit** when the branch's history is the record (rare — ADRs, multi-step refactors).
- **Never rebase-merge onto `main` if the branch has been pushed and reviewed.** Rewriting commit SHAs invalidates reviewer links.

## Releases

- Semver: `MAJOR.MINOR.PATCH`. Breaking change → major bump. New feature → minor. Bug fix only → patch.
- Tag format: `v<semver>` (e.g. `v0.1.0`). One tag per release, on the merge commit into `main`.
- `CHANGELOG.md` — Keep-a-Changelog format. `Unreleased` section at the top; on release, rename to `## [<version>] - YYYY-MM-DD`.

## Things to refuse

- Commit that would include `.env`, `*.pem`, `id_rsa`, `credentials.*`, `*.db`, `*.db-shm`, `*.db-wal`. Warn and abort; do not stage.
- Force-push to `main` / `master`. Stop and hand back.
- A commit that touches files outside the originating task's `artifacts[]` without the task authorising the expansion — scope drift. Hand back.
- A commit authored by github-manager that edits source code. github-manager's tool allowlist deliberately excludes `Write` / `Edit`. If a PR review demands a code change, `create_task` back to the originating agent.

## Pointers

- Task-tracker protocol (how the PR task gets created): `knowledge/task-tracker-api.md`.
- Coding / testing hygiene that must pass before a PR opens: `knowledge/coding-standards.md`.
- github-manager workflow: `agents/github-manager.md`.
