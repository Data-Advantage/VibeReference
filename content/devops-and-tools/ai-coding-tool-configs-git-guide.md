# AI Coding Tool Config Files: What to Commit and What to Ignore

Every AI coding assistant you use creates configuration files in your project. Claude Code drops a `CLAUDE.md`. Cursor creates a `.cursor/` directory. GitHub Copilot looks for `.github/copilot-instructions.md`. Windsurf wants `.windsurfrules`. Aider reads `.aider.conf.yml`.

These files control how the AI behaves in your codebase — what conventions it follows, what frameworks it uses, what mistakes it avoids. They are coding standards, expressed as AI instructions instead of linter rules.

The question every developer asks: which of these files belong in git?

The short answer: most of them do. The long answer is this guide.

## Quick reference table

Here is every AI coding tool config file and whether it should be committed, in one place.

| Tool | File | Commit? | Notes |
|------|------|---------|-------|
| Claude Code | `CLAUDE.md` | **Yes** | Project-wide AI instructions |
| Claude Code | `.claude/settings.local.json` | **Yes** | Shared project settings |
| Claude Code | `~/.claude/` | **No** | Personal config directory |
| Cursor | `.cursorrules` | **Deprecated** | Migrate to `.cursor/rules/` |
| Cursor | `.cursor/rules/*.mdc` | **Yes** | Project-specific rule files |
| Cursor | `.cursor/` (other files) | **No** | Local state and cache |
| GitHub Copilot | `.github/copilot-instructions.md` | **Yes** | Repository-wide instructions |
| GitHub Copilot | `.instructions.md` (file-level) | **Yes** | Scoped instructions for specific paths |
| Windsurf | `.windsurfrules` | **Yes** | Project-level rules |
| Aider | `.aider.conf.yml` | **Yes** | Project configuration |
| Aider | `.aiderignore` | **Yes** | Files AI should skip |

If you are looking for guidance on other project files — lock files, `.env`, build output, IDE settings — see [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide).

## The universal principle

Every AI config file falls into one of two categories:

**Project instructions** — files that tell the AI how to work in this codebase. What language to use, what frameworks are in play, what naming conventions to follow, what patterns to avoid. These are shared coding standards. Commit them.

**Personal state** — files that track which conversations you had, what settings you prefer for your own workflow, or cached data the tool uses internally. These are individual preferences. Ignore them.

This is the same principle that applies to all project configuration. You commit `.eslintrc` because it encodes team standards. You ignore `.vscode/settings.json` when it contains personal preferences like font size. AI config files follow the same logic.

The only difference is that AI tools are newer, so the conventions are still forming. This guide captures where things stand today.

## The .gitignore snippet

Add this block to your project's `.gitignore` to handle every major AI coding tool. It commits the instruction files by default (since gitignore only blocks untracked files) and ignores the personal or generated state.

```gitignore
# ========================
# AI Coding Tool Configs
# ========================

# Cursor — ignore local state, keep rules
.cursor/*
!.cursor/rules/

# Aider — ignore chat history
.aider.chat.history.md
.aider.tags.cache.v3/
.aider.input.history

# Claude Code — user-level config is outside the repo
# CLAUDE.md lives at project root and is committed by default

# Windsurf — .windsurfrules is committed by default
# No local state files to ignore

# GitHub Copilot — instructions live in .github/ which is committed
# No local state files to ignore
```

This handles the common cases. Each tool section below covers edge cases specific to that tool.

## Claude Code

Claude Code uses `CLAUDE.md` as its primary configuration file. Place it at the root of your project and it acts as a persistent system prompt — Claude reads it at the start of every conversation.

A typical `CLAUDE.md` includes your tech stack, coding conventions, preferred patterns, testing instructions, and anything else you would tell a new developer on the team. It is plain markdown, human-readable, and version-controllable. Because it describes how the project works, it belongs in git. Every contributor — human or AI — benefits from having it.

Claude Code also respects `CLAUDE.md` files in subdirectories for monorepo setups, and supports a personal config directory at `~/.claude/` for user-specific preferences. The personal directory stays out of your project repo entirely, so there is nothing to gitignore.

The one edge case: if your `CLAUDE.md` references internal URLs, API endpoints, or infrastructure details you consider sensitive, review it before committing to a public repository. The file itself does not contain secrets by design, but it can contain information you might not want public. For private repos, commit without hesitation.

For the full breakdown — what to put in the file, how to structure it for teams, and how it interacts with Claude's context window — see [Should You Commit CLAUDE.md to Your Git Repository?](/devops-and-tools/should-you-commit-claude-md).

## Cursor

Cursor has gone through a configuration evolution. The original `.cursorrules` file — a single file at the project root — is now deprecated. Cursor still reads it for backward compatibility, but the recommended approach is `.cursor/rules/*.mdc` files.

The `.mdc` format (Markdown with Context) lets you create multiple rule files scoped to different parts of your project. You might have one rule file for your API layer, another for your frontend components, and a third for your database migrations. Each file specifies when it applies and what instructions Cursor should follow. These are team-shared coding standards and belong in git.

The `.cursor/` directory also contains other files — chat history, local settings, cached state. These should not be committed. The gitignore pattern above handles this by ignoring everything in `.cursor/` except the `rules/` subdirectory.

If you still have a `.cursorrules` file, it works but will not receive future enhancements. The migration is straightforward: move your rules into `.cursor/rules/` as one or more `.mdc` files and delete the old file. The deep-dive covers this migration in detail: [Should You Commit .cursorrules to Your Git Repository?](/devops-and-tools/should-you-commit-cursor-config).

## GitHub Copilot

GitHub Copilot takes the most straightforward approach to project configuration. You create a markdown file at `.github/copilot-instructions.md` and Copilot reads it as custom instructions for your repository.

Because it lives inside the `.github/` directory — the same place as your workflows, issue templates, and PR templates — it is already in a directory that teams are accustomed to committing. There is no ambiguity here. Commit it.

Copilot also supports `.instructions.md` files that can be placed alongside specific files or directories to give Copilot targeted context. For example, you could place an `.instructions.md` in your `src/components/` directory that tells Copilot about your component conventions. These scoped instruction files should also be committed — they are documentation that happens to be machine-readable.

There are no local state files to worry about. Copilot's state lives in your editor extension and GitHub's servers, not in your project directory. This makes Copilot the cleanest from a gitignore perspective.

For detailed guidance on structuring your instructions and making them effective, see [Should You Commit copilot-instructions.md to Your Git Repository?](/devops-and-tools/should-you-commit-copilot-instructions).

## Windsurf (Codeium)

Windsurf uses a `.windsurfrules` file at the project root, similar to the original `.cursorrules` pattern. It is a plain text file containing project-level instructions for the AI assistant.

Commit it. It serves the same purpose as every other AI instruction file — shared project context that every team member benefits from. Windsurf does not create significant local state files in your project directory, so there is nothing else to manage.

If you are using multiple AI tools on the same project (which is increasingly common), your `.windsurfrules` and other instruction files may contain overlapping content. That is fine. Each tool reads its own file, and keeping them in sync is a small maintenance cost for the benefit of consistent AI behavior regardless of which editor a team member prefers.

## Aider

Aider uses two project-level config files that both belong in git.

`.aider.conf.yml` is the project configuration file. It specifies model preferences, edit formats, and other settings that affect how Aider works in your codebase. Since these settings affect the output quality for everyone on the team, commit it.

`.aiderignore` works like `.gitignore` but for Aider specifically — it tells Aider which files to skip when building context. If you have large generated files, vendored dependencies, or other content that would waste context window tokens, list them here. This file is useful for every team member, so commit it.

Aider also creates local files you should ignore: `.aider.chat.history.md` (conversation logs), `.aider.tags.cache.v3/` (code indexing cache), and `.aider.input.history` (command history). The gitignore snippet above covers these.

## Why committing AI config files matters

You might wonder whether this is worth the effort. These tools are new, the files change frequently, and not everyone on the team uses the same AI assistant. Here is why it matters anyway.

**Team consistency.** When every developer's AI assistant follows the same conventions, the code it generates is consistent. Without shared config, one developer's Copilot suggests class components while another's suggests hooks. One person's Claude generates SQL queries with snake_case while another gets camelCase. Shared instruction files eliminate this drift.

**Faster onboarding.** A new developer clones the repo and immediately has AI that understands the project. No setup required, no tribal knowledge to transfer. The `CLAUDE.md` or `.cursor/rules/` files tell the AI about the tech stack, the patterns, the gotchas. This is especially powerful for solo founders who bring on their first collaborator or contractor.

**Higher quality AI output.** AI assistants produce dramatically better code when they know the project context. A generic Copilot suggestion might use the wrong ORM, the wrong test framework, or the wrong state management pattern. A Copilot with proper instructions gets it right the first time. Those instruction files are only effective if they are in the repository, up to date, and version-controlled.

**Versioned evolution.** When your team changes conventions — say, migrating from REST to tRPC or from Jest to Vitest — you update the AI config files in the same PR as the code changes. Git history shows when and why conventions changed. This is the same reason you commit linter configs instead of distributing them through a wiki page.

## The line between instructions and secrets

AI config files should never contain secrets. They describe behavior, not credentials. But it is worth being explicit about this because the line can blur.

Do not put API keys, database URLs, internal hostnames, or authentication tokens in your AI instruction files. If you need your AI to know about your infrastructure, describe it in general terms: "We use Postgres on Supabase" rather than including a connection string.

If you are working with `.env` files and secrets, that is a separate concern entirely. See [.env Files: The Complete Guide to Environment Variables in Git](/devops-and-tools/env-files-git-guide) for the right patterns there.

## The bottom line

AI coding tool configs follow the same git rules as every other config file in your project. Instructions and standards get committed. Personal state and credentials get ignored.

The tools are new. The principle is not. Commit the files that make your team's AI assistants behave consistently, ignore the files that are specific to one developer's session, and review everything before pushing to a public repository.

For the complete framework on what belongs in git and what does not — across all file types, not just AI configs — see [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide).
