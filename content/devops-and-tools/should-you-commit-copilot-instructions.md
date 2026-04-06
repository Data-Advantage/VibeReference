# Should You Commit copilot-instructions.md to Your Git Repository?

GitHub Copilot now lets you give it persistent, project-specific instructions through a file called `copilot-instructions.md`. It lives in your `.github` folder, right next to your workflows and issue templates. And the first question every developer asks is: should this file be committed to the repository, or kept local?

**Yes. Commit it.** That is the entire point of the file.

## Why commit copilot-instructions.md

The `.github/copilot-instructions.md` file exists so that every developer on the team — and every Copilot session across every machine — gets the same project context. It is not a personal preference file like your editor theme. It is shared project knowledge, the same category as `tsconfig.json` or `.editorconfig`.

When you commit it:

- **Every team member gets the same Copilot behavior.** New developers who clone the repo immediately get project-aware suggestions without any setup.
- **Copilot suggestions stay consistent.** Without shared instructions, one developer gets React class components while another gets functional components with hooks — because Copilot has no way to know your team's preference.
- **Context survives across machines.** Your laptop, your CI environment, your colleague's desktop — same instructions everywhere.
- **Changes are tracked.** When someone updates the coding standards, the diff shows up in version control like any other project config change.

GitHub designed this file to be committed. It reads from the repository, not from your local user profile. There is no reason to gitignore it.

## What goes in copilot-instructions.md

Think of this file as a concise briefing document for an AI pair programmer who just joined your team. It should contain the things a new developer would need to know before writing their first line of code.

Here is a practical example for a Next.js SaaS project:

```markdown
# Copilot Instructions

## Project overview
This is a multi-tenant SaaS platform built with Next.js 14 (App Router),
TypeScript, and Tailwind CSS. The backend uses Supabase for auth and
database, with Stripe for billing.

## Tech stack
- Next.js 14 with App Router (not Pages Router)
- TypeScript strict mode — no `any` types
- Tailwind CSS for styling — no CSS modules or styled-components
- Supabase for authentication and Postgres database
- Prisma as the ORM
- Stripe for subscriptions and payments
- Resend for transactional email

## Architecture patterns
- Server Components by default. Only use "use client" when the component
  needs interactivity, browser APIs, or React hooks.
- All database queries go through Prisma, never raw SQL.
- API routes live in `app/api/` and use route handlers, not API routes
  from Pages Router.
- Shared UI components live in `components/ui/`. Feature-specific
  components live in `components/[feature]/`.

## Coding standards
- Use named exports, not default exports.
- Prefer `async/await` over `.then()` chains.
- Error handling: wrap async operations in try/catch, return structured
  error responses from API routes.
- All component props must have TypeScript interfaces defined above
  the component.

## Security
- Never expose server-side environment variables to the client.
- All Supabase queries must use Row Level Security — never bypass RLS.
- Validate all user input with Zod schemas before processing.

## Testing
- Unit tests with Vitest for utility functions.
- Integration tests for API routes.
- Test files live next to the code they test: `foo.test.ts` beside `foo.ts`.
```

Notice what is not in this file: no API keys, no database connection strings, no deployment credentials. This is a public-facing project configuration file. Treat it like you would a README.

## File location

The file goes in exactly one place:

```
your-project/
├── .github/
│   ├── copilot-instructions.md    ← here
│   ├── workflows/
│   │   └── ci.yml
│   └── ISSUE_TEMPLATE/
├── src/
├── package.json
└── ...
```

The path is `.github/copilot-instructions.md`. GitHub Copilot in VS Code and GitHub.com automatically picks it up from this location. No configuration needed — if the file exists, Copilot reads it.

If you already have a `.github` directory for Actions workflows or issue templates, you are just adding one more file to it. If you do not, creating the directory for this single file is perfectly fine.

## File-specific instructions with .instructions.md

Beyond the repository-level file, GitHub Copilot also supports file-specific instruction files. These use the `.instructions.md` extension and can be placed anywhere in your project. Each one targets specific files or directories using glob patterns in a front matter block.

This is the advanced pattern. Use it when different parts of your codebase need different guidance.

```markdown
---
applyTo: "src/components/ui/**"
---
All UI components in this directory use the shadcn/ui pattern:
- Export using `forwardRef` with proper TypeScript generics
- Accept a `className` prop and merge it with `cn()`
- Use `cva` for variant definitions
- Include JSDoc comments on the exported component
```

Another example for API routes:

```markdown
---
applyTo: "app/api/**"
---
API route handlers in this project:
- Always validate request body with Zod before processing
- Return consistent JSON shape: { data, error, status }
- Use `NextResponse.json()` not `Response.json()`
- Include rate limiting headers on all responses
- Log errors to our structured logger, never console.log
```

These `.instructions.md` files should also be committed. They are project knowledge, not personal preferences. Put them wherever makes sense — in the directory they apply to, or in a central `.github/instructions/` folder.

## Best practices for writing effective instructions

**Keep it concise.** GitHub recommends keeping `copilot-instructions.md` under two pages. Copilot has a context window, and a massive instruction file competes with the actual code for attention. If your instructions are growing past two pages, you are probably embedding information that belongs in external documentation.

**Be specific, not generic.** "Write clean code" tells Copilot nothing useful. "Use named exports, never default exports" tells it exactly what to do. Every line in the file should change Copilot's behavior compared to its defaults.

**Reference external docs instead of duplicating them.** Instead of pasting your entire API documentation into the instructions file, point to it:

```markdown
## API documentation
See `docs/api-reference.md` for endpoint specifications.
Follow the patterns established in `app/api/users/route.ts` as the
reference implementation for new API routes.
```

**Update it when your stack changes.** If you migrate from Pages Router to App Router, or switch from Jest to Vitest, update the instructions. Stale instructions are worse than no instructions — they actively push Copilot toward wrong patterns.

**No secrets. Ever.** This should be obvious, but it bears repeating. No API keys, no passwords, no tokens, no internal URLs that should not be public. The file is committed to git and visible to anyone with repository access.

**Test your instructions.** After writing or updating the file, open a new Copilot Chat session and ask it to generate something covered by your instructions. Verify it follows the patterns you specified. If it does not, your instructions may be too vague or buried in too much text.

## Nothing to .gitignore

Unlike `.env` files or IDE settings, there is nothing about `copilot-instructions.md` that needs to be gitignored. The file contains no secrets, no machine-specific paths, and no personal preferences. It is project configuration.

Your `.gitignore` does not need any changes for this file. Just commit it like you would any other config file in `.github/`.

```bash
git add .github/copilot-instructions.md
git commit -m "Add Copilot custom instructions for project context"
```

If you also have `.instructions.md` files scattered through your project, commit those too:

```bash
git add "**/*.instructions.md"
git commit -m "Add file-specific Copilot instructions"
```

## How copilot-instructions.md compares to CLAUDE.md and .cursorrules

GitHub Copilot is not the only AI coding tool that uses repository-level instruction files. The pattern is becoming standard across the ecosystem, and the commit-or-ignore answer is the same for all of them.

| File | Tool | Location | Commit? |
|---|---|---|---|
| `copilot-instructions.md` | GitHub Copilot | `.github/copilot-instructions.md` | **Yes** |
| `CLAUDE.md` | Claude Code (Anthropic) | Project root | **Yes** |
| `.cursorrules` | Cursor | Project root | **Yes** |
| `.cursorindexingignore` | Cursor | Project root | **Yes** |
| `.windsurfrules` | Windsurf | Project root | **Yes** |

Every one of these files serves the same purpose: giving an AI assistant project-specific context. Every one of them is designed to be committed and shared. The only files you should keep out of git are personal configuration files that override these shared defaults — and most tools handle personal overrides through user-level settings, not project files.

For detailed guidance on the other tools, see [Should You Commit CLAUDE.md?](/devops-and-tools/should-you-commit-claude-md) and [Should You Commit .cursorrules?](/devops-and-tools/should-you-commit-cursor-config).

## The bottom line

Commit `.github/copilot-instructions.md`. Commit your `.instructions.md` files. They are team knowledge, not personal preferences. They contain no secrets, they improve consistency, and they make onboarding faster for every new developer — and every new Copilot session.

If you are setting up a new project and want a complete picture of what belongs in version control, read [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide) for the full breakdown.
