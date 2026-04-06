# Should You Commit .cursorrules and the .cursor/ Directory to Git?

Cursor is one of the most popular AI-powered code editors, and if you are using it on a team (or even solo across multiple machines), you have probably asked yourself: what do I commit? The `.cursorrules` file? The entire `.cursor/` directory? Some of it? None of it?

The answer is not all-or-nothing. Some Cursor configuration is meant to be shared. The rest is personal machine state that has no place in version control. This guide breaks down exactly what to commit, what to ignore, and how to set up your `.gitignore` to handle it cleanly.

## The short answer

**Commit your rules and commands. Ignore everything else.**

Specifically:

| Path | Commit? | Why |
|---|---|---|
| `.cursorrules` | **Yes, but migrate away** | Legacy project rules file, deprecated late 2025 |
| `.cursor/rules/*.mdc` | **Yes** | Modular AI coding standards for your project |
| `.cursor/commands/` | **Yes** | Reusable slash commands your team shares |
| `.cursor/` (everything else) | **No** | Machine-specific state, caches, user preferences |

If you only remember one thing: **rules are team config, state is personal**. The same principle that applies to committing `.editorconfig` but ignoring `.idea/` applies here.

## What .cursorrules is (and why it is going away)

The `.cursorrules` file is a single file that lives in your project root. It tells Cursor's AI how to behave when working in your codebase — things like "use TypeScript strict mode," "prefer Tailwind utility classes over custom CSS," or "always use server components unless client interactivity is needed."

Here is a simple example:

```
You are working on a Next.js 15 project with the App Router.

- Use TypeScript with strict mode enabled
- Prefer server components; only use "use client" when interactivity is required
- Use Tailwind CSS for styling, never inline styles
- All database queries go through Prisma
- Write tests with Vitest, not Jest
```

This file was the original way to encode project-level AI rules, and it works fine for small projects. But it has problems:

- **It is a single monolithic file.** As your rules grow, it becomes unwieldy. A 500-line `.cursorrules` file is hard to maintain.
- **No composability.** You cannot activate different rules for different parts of your codebase.
- **No metadata.** You cannot specify which files or globs a rule applies to.

Cursor deprecated `.cursorrules` in late 2025 in favor of the `.cursor/rules/` directory structure. The old file still works — Cursor reads it as a fallback — but new projects should use the modern approach.

**Should you commit `.cursorrules` if you still have one?** Yes. It is project configuration, not personal state. But plan to migrate.

## What the .cursor/ directory contains

The `.cursor/` directory is where Cursor stores everything from AI rules to editor state. Here is what lives inside:

### .cursor/rules/ — commit this

This is the modern replacement for `.cursorrules`. Instead of one giant file, you create individual `.mdc` files, each focused on a specific concern:

```
.cursor/
  rules/
    general.mdc
    database.mdc
    testing.mdc
    api-design.mdc
    frontend.mdc
```

Each `.mdc` file can include frontmatter that scopes when the rule activates:

```markdown
---
description: Database query standards
globs: ["**/db/**", "**/models/**", "**/*.prisma"]
alwaysApply: false
---

- All database access goes through Prisma
- Never use raw SQL unless Prisma cannot express the query
- Always include proper error handling on database operations
- Use transactions for multi-step writes
```

This is a massive improvement. Your frontend rules only activate when working on frontend files. Your database rules only kick in near database code. Rules stay small, focused, and maintainable.

**These files are team configuration.** Every developer on your project should get the same AI coding standards. Commit them.

### .cursor/commands/ — commit this

The `commands/` directory stores reusable slash commands that your team can invoke inside Cursor. Think of them as shared prompt templates:

```
.cursor/commands/
  review.md
  refactor.md
  add-tests.md
```

These are project-specific tooling. If one developer writes a great `/review` command, the whole team should benefit. Commit them.

### Everything else in .cursor/ — ignore this

The rest of the `.cursor/` directory contains things like:

- **state.vscdb** — SQLite database storing editor state (open tabs, cursor positions, undo history)
- **User-specific preferences** — personal settings that override project defaults
- **Cache files** — AI conversation history, indexing caches
- **Telemetry and session data** — machine-specific identifiers

This is the same category as `.idea/` or `.vscode/` state files. It is specific to your machine, your session, your workflow. Committing it would cause constant merge conflicts and overwrite other developers' editor state.

## The .gitignore setup

Here is the key trick: you ignore the entire `.cursor/` directory, then selectively un-ignore the parts you want to commit. Git's negation pattern (`!`) makes this possible.

```gitignore
# Cursor AI editor
# Ignore all of .cursor/ (machine-specific state)
.cursor/
# But keep the rules and commands (team config)
!.cursor/rules/
!.cursor/commands/
```

**Important detail:** for Git's negation pattern to work on nested directories, you need to un-ignore the parent path first. The snippet above works because Git processes the patterns in order — it ignores `.cursor/`, then carves out exceptions for `rules/` and `commands/`.

If you still have a legacy `.cursorrules` file, it lives in the project root and is not inside `.cursor/`, so it is not affected by these patterns. It will be tracked by default unless you explicitly ignore it (which you should not — commit it until you migrate).

### Full .gitignore example

Here is a complete `.gitignore` block for a typical project using Cursor alongside other common tools:

```gitignore
# === AI editor config ===

# Cursor
.cursor/
!.cursor/rules/
!.cursor/commands/

# Claude Code (if using alongside Cursor)
# CLAUDE.md is committed by default — it is project config

# === Standard ignores ===
node_modules/
dist/
.env
.env.local
.DS_Store
```

## Migrating from .cursorrules to .cursor/rules/

If you have an existing `.cursorrules` file, here is a straightforward migration path:

**1. Create the directory structure:**

```bash
mkdir -p .cursor/rules
```

**2. Break your monolithic file into focused rules:**

Look at your `.cursorrules` and group related instructions. A typical split might look like:

```bash
# General project rules
touch .cursor/rules/general.mdc

# Framework-specific rules
touch .cursor/rules/nextjs.mdc

# Database rules
touch .cursor/rules/database.mdc

# Testing standards
touch .cursor/rules/testing.mdc
```

**3. Add frontmatter to scope each rule:**

```markdown
---
description: Next.js App Router conventions
globs: ["app/**", "components/**"]
alwaysApply: false
---

- Use the App Router, not Pages Router
- Prefer server components by default
- Use "use client" only when the component needs browser APIs or interactivity
```

Rules with `alwaysApply: true` behave like the old `.cursorrules` — they are always active. Rules with `alwaysApply: false` and a `globs` pattern only activate when you are working on matching files.

**4. Update your .gitignore** using the pattern from the previous section.

**5. Delete the old file** once you have confirmed everything works:

```bash
git rm .cursorrules
```

**6. Commit the migration:**

```bash
git add .cursor/rules/ .gitignore
git commit -m "Migrate .cursorrules to .cursor/rules/ structure"
```

## Edge cases and common questions

### What if I am the only developer?

Commit the rules anyway. You will thank yourself when you switch machines, reinstall your OS, or clone the project on a server. Your AI coding standards are part of your project — they should travel with it.

### What about .cursor/rules/ files with personal preferences?

If you have a rule that is genuinely personal (like "always explain code changes in detail because I am learning"), put it in your user-level Cursor settings, not in a project `.mdc` file. Project rules should reflect project standards, not individual preferences.

### Do .mdc files conflict with other AI tools?

No. Cursor-specific `.mdc` files are ignored by other editors and AI tools. If you also use Claude Code (`CLAUDE.md`), Windsurf (`.windsurfrules`), or GitHub Copilot, each tool reads its own config. They coexist without conflict.

For more on how `CLAUDE.md` works, see [Should You Commit CLAUDE.md?](/devops-and-tools/should-you-commit-claude-md).

### What if a teammate does not use Cursor?

They will see the `.cursor/rules/` directory in the repo and can safely ignore it. The files have no effect outside of Cursor. It is the same as committing `.vscode/extensions.json` — useful for the developers who use the tool, invisible to those who do not.

### Can I use .cursorrules AND .cursor/rules/ at the same time?

Yes, Cursor reads both. The `.cursor/rules/*.mdc` files take precedence when active. But maintaining both creates confusion about which file is the source of truth. Pick one — preferably the modern `.cursor/rules/` approach — and commit to it.

## Where this fits in the bigger picture

Cursor's config story follows the same pattern as every other tool: **project standards go in version control, personal state stays local.** Once you see the pattern, decisions get easy.

For the full picture of what belongs in your repo, read [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide). It covers lock files, environment variables, IDE config, build output, and every other file type developers commonly debate.
