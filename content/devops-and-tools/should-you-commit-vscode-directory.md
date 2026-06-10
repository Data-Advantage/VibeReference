---
title: "Should You Commit the .vscode Directory to Git?"
description: "Commit shared files like launch.json and tasks.json; keep personal settings.json out. Here's the file-by-file rule and a clean .gitignore for .vscode."
---

# Should You Commit the .vscode Directory?

Partly. The `.vscode/` directory is not all-or-nothing, and the two common reflexes — commit the whole folder, or `.gitignore` the whole folder — are both wrong for a team. The directory mixes two kinds of files: shared project configuration that every contributor should get (debug setups, build tasks, extension recommendations) and personal editor state that belongs only on your machine. The right move is to commit the shared files and ignore the personal ones.

This matters more than it used to because Cursor, Windsurf, and most AI coding editors are VS Code forks that read the same `.vscode/` files. A `launch.json` you commit works for your teammate on Cursor; a personal `settings.json` you commit forces your formatting preferences on everyone. Getting the boundary right keeps the project reproducible without turning your repo into a fight over tab width.

## The short answer

| File | Commit? | Why |
|---|---|---|
| `.vscode/extensions.json` | **Yes** | Recommends the team's extension set; pure project metadata. |
| `.vscode/launch.json` | **Yes** | Shared debug configurations — everyone needs the same run targets. |
| `.vscode/tasks.json` | **Yes** | Shared build, test, and lint tasks for the project. |
| `.vscode/settings.json` | **Selectively** | Commit only project-wide, non-personal settings. Never personal preferences. |
| `.vscode/*.code-snippets` | **Yes** | Project-specific snippets the team shares. |
| `.vscode/` (anything else) | **No** | Caches, per-user state, and machine-specific paths. |

The principle behind the table: **project config is shared, editor state is personal.** If a file makes the project build, run, or debug the same way for everyone, commit it. If it encodes how *you* like your editor, leave it out.

## extensions.json — always commit

`extensions.json` lists the extensions your project recommends. When a teammate opens the repo, VS Code prompts them to install anything in the list they're missing. It's the cleanest way to make sure everyone has the same linter, formatter, and language tooling without writing setup instructions in your README.

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss"
  ]
}
```

It contains no secrets and no machine-specific data — just extension IDs — so there's no downside to committing it. This is the one `.vscode/` file with a near-universal "yes."

## launch.json and tasks.json — commit when shared

These two files encode how the project runs, and they're usually the strongest reason to commit any `.vscode/` content at all.

`launch.json` defines debug configurations: which file to launch, what arguments to pass, which port to attach to. If your project has a non-trivial debug setup — attaching to a Node server, running a specific test file, launching a browser against your dev port — committing it means a new contributor presses F5 and it just works, instead of reverse-engineering the setup.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Next.js server",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    }
  ]
}
```

`tasks.json` does the same for build, test, and lint commands, surfacing them in the command palette so they're discoverable. Both are project-specific by nature, so commit them — with one caveat below about absolute paths.

The only reason to *not* commit one of these is if it contains paths or arguments unique to your machine. Keep those out, and parameterize anything machine-dependent (see below).

## settings.json — the file that needs judgment

`settings.json` is where the line between project config and personal preference blurs, and it's the file most likely to cause friction. The same file can hold both kinds of settings, so the decision is per-setting, not per-file.

**Commit** settings that are genuinely about the project:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": { "editor.tabSize": 2 },
  "files.exclude": { "**/.turbo": true }
}
```

These standardize formatting and behavior so two contributors produce the same diffs — a real benefit. Pairing committed editor settings with a committed `.prettierrc` or `.editorconfig` makes the standard authoritative rather than suggested.

**Never commit** settings that are personal or machine-specific:

- Color themes, font family, font size — pure taste, and forcing them annoys everyone.
- Absolute paths like `"python.defaultInterpreterPath": "/Users/you/.venvs/proj/bin/python"` — these break on every other machine.
- Telemetry, sync, or account preferences — not the project's business.

If your `settings.json` is mostly personal, don't commit it. If you want a small set of shared rules, create a `settings.json` that contains *only* those and nothing else. When in doubt, ask: "Would this setting being different break the build or the diff?" If no, it's personal.

## The clean .gitignore

The standard pattern is to ignore the `.vscode/` directory by default, then explicitly un-ignore the shared files. This is safer than the reverse, because it means a stray personal file never sneaks into a commit:

```gitignore
# Ignore the .vscode directory by default...
.vscode/*

# ...then un-ignore the shared, project-level files
!.vscode/extensions.json
!.vscode/launch.json
!.vscode/tasks.json
!.vscode/settings.json
!.vscode/*.code-snippets
```

The leading `!` lines re-include specific files after the wildcard excludes everything. Drop the `settings.json` line if your settings are personal. This is the same allow-list approach VS Code's own repository and many large open-source projects use, and it's the one that scales: new junk files in `.vscode/` are ignored automatically, and only the files you deliberately listed get tracked.

## Handling machine-specific values

Sometimes a shared `launch.json` or `settings.json` needs a value that differs per machine — a local port, a path, an API base URL. Don't fork the file per developer. Two clean options:

1. **Variable substitution.** VS Code supports `${workspaceFolder}`, `${env:VAR_NAME}`, and other variables inside these JSON files. Reference an environment variable instead of hardcoding an absolute path, and the committed file stays portable.
2. **Layered settings.** Commit the shared `settings.json` with project defaults; individual developers add personal overrides in their *user* settings (the global VS Code settings, not the workspace file), which live outside the repo entirely. User settings always override workspace settings, so personal tweaks don't require touching the committed file.

Both keep one committed file that works everywhere, instead of an uncommittable file that works only for you.

## .vscode vs. other editor config

The same shared-vs-personal logic decides every editor directory, which is why the answer flips between them:

| Path | Commit? | Reason |
|---|---|---|
| `.vscode/` (shared files) | **Selectively** | Mix of project config and personal state — allow-list the shared files. |
| `.idea/` (JetBrains) | **Mostly no** | Heavy per-user state; commit only a few project files if any. |
| `.editorconfig` | **Yes** | Editor-agnostic formatting rules — pure project config. |
| `.cursor/rules/` | **Yes** | Shared AI coding standards, like a project-level prompt. |

`.editorconfig` is the cleanest of the bunch — it's all project, no personal state, and every editor reads it — which is why it's an unconditional "commit." `.vscode/` needs the allow-list precisely because it's the one that mixes both.

## The bottom line

Commit the parts of `.vscode/` that make the project reproducible — `extensions.json`, `launch.json`, `tasks.json`, shared snippets — and keep personal editor state out. For `settings.json`, commit only project-wide, non-personal settings, or skip it entirely if yours is full of themes and absolute paths.

Use the allow-list `.gitignore` pattern (`.vscode/*` plus `!` lines for the shared files) so the boundary is enforced automatically rather than relying on everyone remembering it. The goal is a teammate — on VS Code, Cursor, or any fork — who clones the repo, gets the right extensions and debug setup for free, and never has to inherit your color theme.

## See Also

- [Should You Commit .cursorrules and the .cursor/ Directory?](./should-you-commit-cursor-config) — the AI-editor companion to this decision
- [Should You Commit .editorconfig?](./should-you-commit-editorconfig) — the editor-agnostic formatting file that's always a yes
- [Should You Commit .prettierrc?](./should-you-commit-prettierrc) — pairing a committed formatter config with editor settings
- [The Developer's Guide to What Belongs in Your Git Repository](./git-repository-files-guide) — the full committed-vs-ignored reference
