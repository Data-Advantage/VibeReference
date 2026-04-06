# Should You Commit CLAUDE.md to Your Git Repository?

AI coding assistants are moving fast. New config files keep appearing in project roots — `.cursorrules`, `copilot-instructions.md`, and now `CLAUDE.md`. If you're using Claude Code, you've probably been told to create a `CLAUDE.md` file. And now you're staring at `git status` wondering: should this be committed?

**Yes. Commit it.**

`CLAUDE.md` is not a secret. It's not a credentials file. It's not personal IDE configuration. It's project context — and it belongs in version control alongside your `tsconfig.json`, your `.prettierrc`, and your `README.md`.

Here's why, how, and what to watch out for.

## What CLAUDE.md actually is

`CLAUDE.md` is a special markdown file that Claude Code reads automatically at the start of every session. When you open a project and start a conversation with Claude Code, it loads `CLAUDE.md` from your project root and uses its contents as persistent context.

Think of it as a briefing document. Instead of re-explaining your project's architecture, coding conventions, and quirks every time you start a new session, you write them down once and Claude Code picks them up automatically.

It solves a real problem. Without it, every new Claude Code session starts from zero. You end up repeating yourself: "We use pnpm, not npm." "The API routes are in `src/server/`." "Don't use default exports." "We're on Next.js App Router, not Pages Router." With `CLAUDE.md`, that context is always loaded.

This is not a configuration file in the traditional sense. It doesn't control build behavior or change runtime settings. It's instructions and context for an AI assistant — written in plain English (with some markdown formatting), not in JSON or YAML.

## Why it belongs in version control

The reasoning is straightforward when you apply the same decision framework you'd use for any file in your repo. (For that framework, see [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide).)

**Does it contain secrets?** No. `CLAUDE.md` contains instructions like "use Tailwind CSS for styling" and "the database schema is managed by Prisma." It should never contain API keys, passwords, or tokens. If you need Claude Code to know about environment variables, you reference them by name — `CLAUDE.md` describes which variables exist and what they're for, not their values. For handling actual secrets, see our [.env files guide](/devops-and-tools/env-files-git-guide).

**Is it needed by every developer on the team?** Yes. If you've taken the time to document your project's architecture, coding standards, and conventions in `CLAUDE.md`, every developer using Claude Code benefits from that context. Committing it means the whole team shares the same baseline — new team members get the same AI assistance quality as the person who wrote the file.

**Is it specific to one person's machine?** No. Project-level `CLAUDE.md` describes the *project*, not one developer's preferences.

**Is it auto-generated?** No. You write it by hand (or collaboratively with Claude Code). There's no build step that produces it.

Four questions, four clear answers. Commit it.

## What goes in a CLAUDE.md

The best `CLAUDE.md` files are concise and practical. They're not novels — they're cheat sheets. Here are the most common sections:

### Project overview

A few sentences about what the project is, what stack it uses, and how it's structured.

```markdown
# Project Context

This is a SaaS dashboard built with Next.js 15 (App Router), TypeScript, Tailwind CSS, and Supabase. The app uses server components by default and client components only when interactivity is needed.
```

### Coding standards

The conventions that Claude Code should follow when writing or modifying code.

```markdown
## Coding Standards

- Use named exports, never default exports
- Use `pnpm` for package management, not npm or yarn
- Prefer server components; only use "use client" when necessary
- Use Zod for all input validation
- Error handling: use Result types, avoid throwing exceptions in business logic
- All database queries go through the data access layer in `src/lib/db/`
```

### Architecture notes

Where things live, how the codebase is organized, and any patterns that aren't obvious from the file structure.

```markdown
## Architecture

- `src/app/` — Next.js App Router pages and layouts
- `src/components/` — shared React components
- `src/lib/` — utility functions and shared logic
- `src/server/` — server-only code (API handlers, DB queries)
- `supabase/migrations/` — database migration files

API routes follow the convention: `src/app/api/[resource]/route.ts`
```

### Things to avoid

Guardrails for common mistakes.

```markdown
## Do NOT

- Do not import from `@/server/` in client components
- Do not use `any` type — use `unknown` and narrow
- Do not add new dependencies without discussing first
- Do not modify migration files that have already been applied
```

### Commands

Common commands that Claude Code might need to run.

```markdown
## Commands

- `pnpm dev` — start development server
- `pnpm build` — production build
- `pnpm db:migrate` — run database migrations
- `pnpm test` — run test suite
- `pnpm lint` — run ESLint
```

## A minimal starter CLAUDE.md

If you're creating one for the first time, start small. You can always add more later.

```markdown
# CLAUDE.md

## Project

Next.js 15 app with TypeScript, Tailwind CSS, and Prisma ORM.

## Stack

- Runtime: Node.js 20
- Package manager: pnpm
- Database: PostgreSQL via Prisma
- Auth: Clerk
- Hosting: Vercel

## Conventions

- Named exports only
- Server components by default
- Colocate tests next to source files (`Button.test.tsx` next to `Button.tsx`)
- Use `cn()` utility for conditional Tailwind classes

## Key commands

- `pnpm dev` — local dev server
- `pnpm build` — production build
- `pnpm test` — run tests
- `pnpm db:push` — push Prisma schema to database
```

That's about 20 lines. It takes five minutes to write and saves you from repeating yourself hundreds of times.

## The three locations for CLAUDE.md

Claude Code looks for `CLAUDE.md` in multiple places, and each has different commit rules.

### Project root: `./CLAUDE.md`

This is the main one. It lives at the root of your git repository and describes the project.

**Commit this.** It's project documentation that benefits the whole team.

### Subdirectories: `./src/server/CLAUDE.md`

You can place additional `CLAUDE.md` files in subdirectories. Claude Code loads them when it's working in that directory, giving you more targeted context. For example, a `CLAUDE.md` in your API directory might describe authentication patterns, while one in your components directory might describe the design system.

**Commit these too.** Same reasoning — they describe the project, not the person.

### Home directory: `~/.claude/CLAUDE.md`

This is your personal, global `CLAUDE.md`. It applies to every project you work on with Claude Code. People use it for personal preferences like "always explain your reasoning" or "I prefer functional programming patterns."

**Do not commit this.** It's not in your project directory, so git won't track it anyway — but if someone asks about it, the answer is clear. This is personal configuration, like your `~/.gitconfig` or `~/.zshrc`. It stays on your machine.

### Quick reference

| Location | What it's for | Commit? |
|---|---|---|
| `./CLAUDE.md` | Project context and standards | **Yes** |
| `./subdir/CLAUDE.md` | Directory-specific context | **Yes** |
| `~/.claude/CLAUDE.md` | Personal global preferences | **No** (not in repo) |

## The .gitignore situation

There's nothing to add to `.gitignore` for `CLAUDE.md` itself. You want it tracked.

The `~/.claude/` directory lives in your home folder, outside your repository, so git never sees it. No action needed.

If your project generates any local Claude Code state files or caches, those may show up in your project directory under `.claude/` (note the dot prefix — different from `CLAUDE.md`). Check your `.gitignore` if you see `.claude/` appearing in `git status`. A line like this handles it:

```gitignore
# Claude Code local state
.claude/
```

But `CLAUDE.md` at the project root — that stays tracked. Don't ignore it.

## How CLAUDE.md compares to similar files

`CLAUDE.md` isn't the first AI assistant config file. Here's how it relates to others:

**`.cursorrules`** — Used by Cursor (the AI-powered code editor). Same concept: a markdown file at the project root that gives the AI assistant context about your project. If you use both Cursor and Claude Code, you'll likely want both files with similar content. Some teams maintain one source of truth and symlink or copy between them.

**`copilot-instructions.md`** — GitHub Copilot's equivalent, typically placed at `.github/copilot-instructions.md`. Again, same idea: project context for an AI coding assistant. GitHub recommends committing it.

**`.editorconfig`** — Not AI-specific, but conceptually similar. It tells editors how to format code. Like `CLAUDE.md`, it's a project-level config file that belongs in version control.

All of these files share the same properties: they describe the project, they don't contain secrets, they benefit every contributor, and they belong in git. The only difference is which tool reads them.

| File | Tool | Commit? |
|---|---|---|
| `CLAUDE.md` | Claude Code | **Yes** |
| `.cursorrules` | Cursor | **Yes** |
| `.github/copilot-instructions.md` | GitHub Copilot | **Yes** |
| `.editorconfig` | Most editors | **Yes** |

## Common concerns

**"What if my CLAUDE.md contains information about our architecture that I don't want public?"**

If your repository is private, `CLAUDE.md` is as private as any other file in it. If your repository is public, then yes — `CLAUDE.md` reveals architectural details. But so does your actual source code. If you're comfortable with your code being public, `CLAUDE.md` adds minimal additional exposure.

**"What if different team members want different Claude Code behavior?"**

That's what the personal `~/.claude/CLAUDE.md` is for. Project-level standards go in the committed file. Personal preferences go in the home directory file. Claude Code merges both.

**"Will committing this confuse people who don't use Claude Code?"**

Not really. It's a markdown file with a clear name. Non-Claude-Code users can read it as project documentation — it's useful context regardless of which AI tool (or no AI tool) you use. Your coding standards and architecture notes are valuable to any contributor.

## The bottom line

`CLAUDE.md` is project documentation that happens to be machine-readable by Claude Code. It contains instructions and context, not secrets. It benefits every team member who uses Claude Code, and it's useful as regular documentation for those who don't.

Commit it. Push it. Keep it updated as your project evolves.
