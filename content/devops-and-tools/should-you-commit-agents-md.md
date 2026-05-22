# Should You Commit AGENTS.md to Your Git Repository?

The AI coding assistant ecosystem keeps converging on the same idea: a markdown file at the project root that tells the AI what your project is, how it works, and what conventions to follow. Claude Code reads `CLAUDE.md`. Cursor reads `.cursorrules`. GitHub Copilot reads `.github/copilot-instructions.md`. And now a growing list of tools — OpenAI Codex, Cursor, Aider, Sourcegraph Amp, Continue, and others — read a shared, vendor-neutral file called `AGENTS.md`.

If you've added `AGENTS.md` to your project, you're staring at `git status` asking the same question developers ask about every new agent config file: **should this be committed?**

**Yes. Commit it.** That is the entire point of `AGENTS.md`.

## What AGENTS.md actually is

`AGENTS.md` is a vendor-neutral instructions file for AI coding agents. It lives at the root of your repository, contains plain markdown, and is read by any agent that supports the spec. Unlike `CLAUDE.md` (Anthropic's Claude Code), `.cursorrules` (Cursor), or `copilot-instructions.md` (GitHub Copilot), it isn't tied to one vendor — it's an attempt to give the ecosystem a shared format so you don't have to maintain four nearly-identical files.

The contents look like every other agent instructions file you've seen:

- Project overview and stack
- Architecture notes — where things live
- Coding conventions — naming, exports, error handling
- Commands the agent might need to run — dev server, tests, lint
- Things to avoid — dependencies not to add, files not to touch
- Where the docs and reference patterns live

It's not a configuration file in the traditional sense. It doesn't change build output. It doesn't set runtime flags. It's a briefing document that AI coding agents read at the start of a session and use as persistent context. For a deeper background on what these files do, see [Designing Agent Instructions](/ai-development/designing-agent-instructions).

## Why it belongs in version control

Apply the same four-question framework you'd use for any file in your repo. (For the full framework, see [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide).)

**Does it contain secrets?** No. `AGENTS.md` describes architecture, stack, conventions, and commands. It should never contain API keys, tokens, database URLs, or any credential. If you need to tell an agent that an environment variable exists, name the variable — don't paste the value. For actual secrets, see the [.env files guide](/devops-and-tools/env-files-git-guide).

**Is it needed by every developer on the team?** Yes. The whole point of `AGENTS.md` is that the next contributor — human or AI — gets the same project context without re-asking the same questions. Committing it means everyone's agents start from the same baseline.

**Is it specific to one person's machine?** No. Project-level `AGENTS.md` describes the *project*. Personal preferences ("explain your reasoning step by step") belong in your tool's user-level config, not in a file checked into the team repo.

**Is it auto-generated?** No. You write it by hand (often collaboratively with an agent). There's no build step.

Four questions, four clear answers. Commit it.

## What goes in AGENTS.md

A useful `AGENTS.md` is short. The agents reading it have limited context windows and your file is competing with the actual code for attention. Aim for a single screen of guidance per topic, not a novel.

Here's a practical example for a Next.js SaaS project:

```markdown
# AGENTS.md

## Project

Multi-tenant SaaS dashboard built with Next.js 15 (App Router),
TypeScript, Tailwind CSS, Prisma, and PostgreSQL. Deployed on Vercel.

## Stack

- Runtime: Node.js 20
- Package manager: pnpm
- Database: PostgreSQL via Prisma
- Auth: Clerk
- Email: Resend
- Payments: Stripe

## Architecture

- `src/app/` — Next.js App Router pages and layouts
- `src/components/` — shared React components
- `src/lib/` — utilities and shared logic
- `src/server/` — server-only code (DB queries, integrations)
- `prisma/migrations/` — database migrations

API routes follow `src/app/api/[resource]/route.ts`.

## Conventions

- Named exports only — never default exports
- Server Components by default; `"use client"` only when needed
- All input validation goes through Zod
- All DB queries go through `src/server/db/`
- No `any` types — use `unknown` and narrow

## Commands

- `pnpm dev` — local dev server
- `pnpm build` — production build
- `pnpm test` — run Vitest suite
- `pnpm lint` — run ESLint
- `pnpm db:migrate` — apply Prisma migrations

## Do not

- Do not import from `src/server/` in client components
- Do not add new dependencies without flagging first
- Do not modify migrations that have already been applied
- Do not bypass Clerk middleware on protected routes
```

That file is roughly forty lines and saves you from repeating yourself in every session.

## File location

`AGENTS.md` goes in exactly one place by convention: the root of your repository.

```
your-project/
├── AGENTS.md              ← here
├── CLAUDE.md              (optional — Claude-specific)
├── .github/
│   └── copilot-instructions.md
├── src/
├── package.json
└── ...
```

Agents that support the spec look for `AGENTS.md` at the repo root automatically. No configuration needed.

Some teams also place additional `AGENTS.md` files in subdirectories for scope-specific guidance — for example, an `AGENTS.md` inside `src/server/` that documents the patterns for server-side code. Whether your particular tool picks up nested files depends on the agent, but the commit answer is the same: yes, commit them.

## How AGENTS.md compares to other agent instruction files

`AGENTS.md` isn't the first file of its kind, and depending on your tools, it may not be the only one in your repo. Here's the landscape:

| File | Primary tool | Location | Commit? |
|---|---|---|---|
| `AGENTS.md` | Vendor-neutral (Codex, Cursor, Aider, others) | Project root | **Yes** |
| `CLAUDE.md` | Claude Code | Project root | **Yes** |
| `.cursorrules` | Cursor (legacy) | Project root | **Yes** |
| `.cursor/rules/*.mdc` | Cursor (current) | `.cursor/rules/` | **Yes** |
| `.github/copilot-instructions.md` | GitHub Copilot | `.github/` | **Yes** |
| `.windsurfrules` | Windsurf | Project root | **Yes** |

The commit answer is the same across all of them: they describe the project, contain no secrets, benefit every contributor, and belong in git. For tool-specific guidance, see [Should You Commit CLAUDE.md?](/devops-and-tools/should-you-commit-claude-md) and [Should You Commit copilot-instructions.md?](/devops-and-tools/should-you-commit-copilot-instructions).

## Do you need both AGENTS.md and CLAUDE.md?

The honest answer: depends on your team and your tools.

**If you only use one agent** (say, just Claude Code, or just Cursor), use that tool's native file. You don't need `AGENTS.md` until you have a second agent in the mix.

**If your team uses multiple agents** (Claude Code, Cursor, Copilot, and Codex all in rotation), `AGENTS.md` is the lowest-maintenance option. Write one file, every agent reads it.

**If you're hedging on tools or expect contributors to use whatever they prefer**, lean toward `AGENTS.md` and supplement with tool-specific files only for tool-specific quirks.

Some teams maintain `AGENTS.md` as the source of truth and symlink `CLAUDE.md → AGENTS.md` at the repo root so both agents see the same content. Others duplicate content across two files. Symlinks are cleaner but break on Windows; duplication is simpler but drifts over time. Pick the failure mode you'd rather debug.

## Best practices for writing effective AGENTS.md files

**Be specific, not generic.** "Write clean code" tells an agent nothing. "Use named exports, never default exports" changes its behavior on every file it touches. Every line should change agent behavior compared to its defaults.

**Reference the code, don't duplicate it.** Instead of pasting your entire API spec into `AGENTS.md`, point to it: "API routes follow the pattern in `src/app/api/users/route.ts` — use that as the reference implementation for new routes."

**Keep it short.** A 500-line `AGENTS.md` is worse than a 50-line one. Agents skim, summarize, and sometimes truncate. The most important guidance should be visible without scrolling. If your instructions are exploding past two screens, the overflow probably belongs in `docs/` with `AGENTS.md` pointing to it.

**Update it when your stack changes.** Stale instructions are worse than no instructions — they actively push agents toward wrong patterns. If you migrate from Pages Router to App Router, or swap Jest for Vitest, update `AGENTS.md` in the same PR.

**No secrets, ever.** This is committed to git. No API keys, no internal URLs that shouldn't be public, no credentials of any kind. If you need to tell an agent about an environment variable, name it — don't paste its value.

**Test it.** After writing or updating `AGENTS.md`, start a fresh agent session and ask it to do something covered by the file. If it ignores your guidance, your instructions may be too vague, buried in too much text, or contradicting examples it's pulling from elsewhere in the repo.

## Nothing to .gitignore

There's nothing about `AGENTS.md` that needs to be gitignored. The file contains no secrets, no machine-specific paths, and no personal preferences. It's project documentation that happens to be machine-readable.

```bash
git add AGENTS.md
git commit -m "Add AGENTS.md with project context for AI coding agents"
```

If you have nested `AGENTS.md` files in subdirectories, commit those too:

```bash
git add "**/AGENTS.md"
git commit -m "Add scoped AGENTS.md files for server and components"
```

## What about personal overrides?

Some agents support a user-level config that layers on top of the project file — for example, Claude Code reads both `~/.claude/CLAUDE.md` (your global preferences) and `./CLAUDE.md` (the project file). The equivalent for `AGENTS.md` depends on the specific agent:

- **Project file** (`./AGENTS.md`) — committed, shared with the team. Describes the project.
- **User-level overrides** (varies by tool) — not in the repo, not committed. Describes your personal preferences across all projects.

The project file is for "we use pnpm." Your user-level config is for "I prefer terse explanations." Keep those two concerns separate and you'll avoid most of the friction of working on a team where everyone has different agent preferences.

## Common concerns

**"What if my AGENTS.md exposes internal architecture I'd rather keep private?"**

If your repo is private, `AGENTS.md` is as private as the rest of it. If your repo is public, then yes — `AGENTS.md` reveals architectural details. But so does your code. If you're comfortable with your source being public, the marginal exposure from `AGENTS.md` is small.

**"What if a contributor doesn't use AI coding agents at all?"**

`AGENTS.md` is plain markdown. It reads as project documentation regardless of whether a human or agent is reading it. Your coding standards and architecture notes are useful to any new contributor.

**"Won't this go stale?"**

Yes — if you don't update it. Treat `AGENTS.md` like any other living document. Review it when you onboard a new contributor and notice them asking the same questions repeatedly. Update it when your stack changes. Delete sections that no longer apply. A short, accurate file beats a long, half-true one.

**"Do I need AGENTS.md if I already have a thorough README?"**

The audiences are different. `README.md` is for humans deciding whether to use, contribute to, or fork your project. `AGENTS.md` is for AI agents that need to know how the code is organized and what conventions to follow when generating new code. There's overlap — both might mention the stack — but the framing is different. Keep both.

## The bottom line

`AGENTS.md` is project documentation written for AI coding agents. It contains conventions, architecture notes, and commands — not secrets. It benefits every team member whose agent reads it, and it's useful as plain documentation for contributors who don't use agents at all.

Commit it. Push it. Keep it updated as your project evolves. The same goes for any tool-specific variants — `CLAUDE.md`, `.cursorrules`, `copilot-instructions.md`, `.windsurfrules` — that you decide to maintain alongside it.

If you're standing up a new project and want the full picture of what belongs in version control, read [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide) for the full breakdown.
