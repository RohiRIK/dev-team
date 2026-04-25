# Engine Registry (`state/engines.json`)

Gated behind `DEV_TEAM_MULTI_ENGINE=1`. Loaded by
`mcp/task-tracker/src/engines.ts::loadEngineRegistry()` on each dispatch.

## Schema

Each key under `engines` is an engine alias. Fields:

| Field             | Required | Notes                                                                 |
| ----------------- | -------- | --------------------------------------------------------------------- |
| `command`         | yes      | Binary name looked up via `Bun.which` / `PATH`.                       |
| `prompt_flag`     | no       | Informational only — `args_template` is authoritative at dispatch.    |
| `args_template`   | no       | Array of argv; `{{prompt_file}}` is replaced with the prompt path.    |
| `stdin_ok`        | yes      | If `true`, prompt may be piped on stdin instead of via file flag.     |
| `env_passthrough` | yes      | Explicit env var allowlist passed to the child. Default `[PATH,HOME]`.|

Prompts are ALWAYS written to a file — never embedded in argv or shell-escaped.
That keeps the dispatcher safe against shell-metachar injection (spec §6).

## Uncertain flags — verify before enabling

The flags below are best-effort guesses based on each CLI's public docs. Before
turning on `DEV_TEAM_MULTI_ENGINE=1` in your environment, run
`<engine> --help` locally and confirm.

- [ ] **gemini-cli** — `--prompt-file <path>` (TODO: confirm; `--prompt` is the
      inline variant, some builds ship `-f`).
- [ ] **opencode** — `run -p <path>` (TODO: confirm; may be `--prompt` or
      positional only).
- [ ] **goose** — `run --instructions <path>` (TODO: confirm; older builds used
      `-t` for a text file).
- [ ] **minimax-cli** — `--prompt-file <path>` (TODO: confirm; CLI surface is
      less stable than the others).
- [x] **aider** — `--message-file <path> --yes-always --no-stream` (confirmed
      against aider 0.x; `--message-file` reads the prompt from disk,
      `--yes-always` skips interactive approvals, `--no-stream` disables the
      tty stream so stdout captures cleanly).
- [ ] **github-copilot** — `gh copilot suggest -t shell <path>` (TODO: confirm;
      `gh copilot` is shell-suggestion oriented and may not accept a file as
      its prompt — best for one-line tasks. Treat as experimental until
      verified against your `gh` version).
- [ ] **codex** — `codex exec --full-auto <path>` (TODO: confirm; OpenAI Codex
      CLI has fast-moving flags. `exec` may need an inline prompt instead of
      a file path on some builds).
- [ ] **cursor-agent** — `--prompt-file <path>` (TODO: confirm; Cursor's
      headless agent CLI is in active development).
- [ ] **pi** — `chat --message-file <path>` (TODO: confirm; Pi by Inflection
      is conversation-oriented, less suited to coding agents — included for
      completeness).

If a flag is wrong the dispatcher will still spawn the binary — it just won't
find the prompt. Fix the entry and re-run; no restart needed
(`loadEngineRegistry` re-reads on every call).

## Fallback

Missing / malformed `engines.json` yields a registry containing only the
built-in `claude` engine. That keeps `/buddy` working even without the file.
