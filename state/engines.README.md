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

- [!] **gemini-cli** — verified binary: `~/.bun/bin/gemini`. Actual
      headless flag: `-p`/`--prompt <text>` (inline text only — no file-path
      flag exists). `args_template` updated to `["-p", "{{prompt_file}}"]` which
      passes the file PATH as the prompt value. **Limitation:** gemini will
      receive the path string, not the file contents. Correct dispatch requires
      the dispatcher to pipe file content as stdin (`cat file | gemini -p`). Track
      as dispatcher enhancement before relying on gemini in production.
- [!] **opencode** — verified binary: `~/.bun/bin/opencode`.
      `run` subcommand has no `-p` flag; `-f`/`--file <files>` attaches files to
      a message. `args_template` updated to `["run", "-f", "{{prompt_file}}"]`.
      **Limitation:** `-f` attaches the file as context; no inline message is
      sent. Correct dispatch should also pass the task title as positional
      (`opencode run "title" -f prompt.txt`). Verify behaviour with
      `opencode run -f /tmp/test.txt` before routing tasks here.
- [ ] **goose** — not installed; `run --instructions <path>` (TODO: confirm; older
      builds used `-t` for a text file).
- [ ] **minimax-cli** — not installed; `--prompt-file <path>` (TODO: confirm;
      CLI surface is less stable than the others).
- [x] **aider** — `--message-file <path> --yes-always --no-stream` (confirmed
      against aider 0.x; `--message-file` reads the prompt from disk,
      `--yes-always` skips interactive approvals, `--no-stream` disables the
      tty stream so stdout captures cleanly). Not currently installed on this
      machine.
- [ ] **github-copilot** — `gh` binary present at `$(brew --prefix)/bin/gh` but
      the `gh copilot` extension is NOT installed (`gh extension list` returned
      nothing). Install with: `gh extension install github/gh-copilot`. Once
      installed, verify with `gh copilot suggest --help`. Note: copilot is
      shell-suggestion oriented; file-based dispatch is experimental.
- [ ] **codex** — not installed; `codex exec --full-auto <path>` (TODO: confirm;
      OpenAI Codex CLI has fast-moving flags. `exec` may need an inline prompt
      instead of a file path on some builds).
- [ ] **cursor-agent** — not installed; `--prompt-file <path>` (TODO: confirm;
      Cursor's headless agent CLI is in active development).
- [!] **pi** — verified binary: `~/.bun/bin/pi`. Actual interface:
      `pi [@files...] [messages...]` — `@file` syntax passes file contents.
      `chat` and `--message-file` do not exist. `args_template` updated to
      `["{{prompt_file}}"]` (passes path as message literal). **Limitation:**
      correct invocation is `pi @/path/to/file.txt`; the dispatcher cannot
      currently prepend `@` to the path. Track as dispatcher enhancement.

If a flag is wrong the dispatcher will still spawn the binary — it just won't
find the prompt. Fix the entry and re-run; no restart needed
(`loadEngineRegistry` re-reads on every call).

## Fallback

Missing / malformed `engines.json` yields a registry containing only the
built-in `claude` engine. That keeps `/buddy` working even without the file.
