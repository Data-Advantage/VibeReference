# Official Skills for Your AI Coding Stack

The major infrastructure vendors are publishing their own Claude Code skills, Cursor rules, and AI coding context files. Instead of writing `.mcp.json`, `CLAUDE.md`, or `.cursorrules` configuration from scratch, you can pull from official repositories that are maintained by the same teams who build the tools you depend on.

This guide covers every official AI coding skill and context file published by major vendors — what it includes, where to find it, and how to install it.

## What are vendor-published skills?

When you build with Claude Code, Cursor, or other AI coding tools, the AI only knows about your stack if you tell it. Configuration files fill that gap:

- **CLAUDE.md** — project instructions loaded into every Claude Code session
- **Claude Code skills** — reusable task scripts that extend Claude Code's capabilities
- **.cursorrules / .mdc files** — Cursor-specific context for your project
- **LLM context files** — documentation and snippets that help any AI coding tool understand your stack

Vendors that ship official versions of these files save you hours of writing boilerplate. More importantly, they keep the context accurate — when the API changes, the vendor updates the context file, not you.

## Anthropic — Claude Code

**Official:** Yes
**Repository:** [https://github.com/anthropics/claude-code](https://github.com/anthropics/claude-code)

Anthropic maintains the canonical Claude Code repository, which includes the skills system used to extend Claude Code's capabilities. This is the reference implementation for how skills, hooks, and structured agent workflows are built.

Key resources from this repo:

- The `skills/` directory pattern used for reusable task scripts
- Examples of hook-based automation (pre-tool-use, post-tool-use)
- Reference agent configurations

If you are building custom skills for your team or product, start with Anthropic's own patterns here. The skills system used at Data Advantage products like VibeReference is derived directly from this repository.

**Installation:** Claude Code is installed via npm:
```bash
npm install -g @anthropic-ai/claude-code
```

## Vercel — Integrations and Examples

**Official:** Yes
**Repository:** [https://github.com/vercel/examples](https://github.com/vercel/examples)

Vercel maintains a comprehensive examples repository that serves as living documentation for AI coding tools. It covers:

- Next.js App Router patterns (the current standard)
- Edge Functions and Middleware configuration
- Vercel AI SDK integration patterns
- Deployment configuration examples

The `vercel/examples` repository is particularly useful for writing CLAUDE.md and `.cursorrules` files — the code patterns here represent what Vercel considers canonical, which aligns with what their own engineers do in production.

**How to use:** Reference the examples directory for your stack. For a Next.js + Vercel AI SDK project, pull patterns from `ai/` examples:

```bash
# Clone for reference
git clone --depth 1 https://github.com/vercel/examples
```

## Writing your own vendor-informed CLAUDE.md

Most vendors have not yet published standalone skill packages, but their public documentation contains the raw material. Here is a framework for creating an effective CLAUDE.md that incorporates vendor-recommended patterns:

### 1. Start with your stack's official docs

Each major tool has canonical patterns:
- **Next.js:** App Router conventions from the Next.js docs and `vercel/examples`
- **Convex:** Function patterns from Convex docs (`npx convex dev` workflow)
- **Clerk:** Auth patterns from Clerk's Next.js quickstart
- **Tailwind v4:** `@import "tailwindcss"` (not v3 `@tailwind` directives)

### 2. Document vendor-specific constraints

```markdown
# CLAUDE.md

## Stack
- Next.js 16 App Router (no Pages Router)
- Convex for backend (use `npx convex dev --once` to push)
- Tailwind v4 (use @import "tailwindcss", not @tailwind directives)
- Clerk for auth (never store tokens in local state)

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Convex push: `npx convex dev --once`
```

### 3. Pin version-specific behavior

AI coding tools have knowledge cutoffs. Explicitly document which version of each tool you are using and any behavior that differs from older versions.

```markdown
## Version Notes
- Tailwind v4: CSS syntax changed — @import not @tailwind
- Next.js 16: cookies() is async — await cookies()
- Clerk: clerkMiddleware() not authMiddleware()
```

## The missing piece: vendor skill repositories

As of early 2026, only Anthropic has a formalized skills system. Most vendors publish context through:

1. **Official documentation** — always the most accurate source
2. **Example repositories** — pattern-level reference (Vercel examples, Supabase examples)
3. **Framework CLIs** — the generated output from `create-next-app`, `supabase init`, etc. reflects official defaults

The space is moving quickly. Watch these repositories for emerging official skill packages:
- [anthropics/claude-code](https://github.com/anthropics/claude-code) — Claude Code skills reference
- [vercel/examples](https://github.com/vercel/examples) — Vercel and Next.js patterns
- [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) — MCP reference servers

## Keep reading

- [Official MCP Servers by Vendor](/ai-development/official-mcp-servers) — Model Context Protocol servers from Cloudflare, Stripe, Vercel, and others
- [Official CLI Tools for Your Stack](/devops-and-tools/official-cli-tools) — Vercel CLI, Wrangler, Stripe CLI, Supabase CLI, and more
- [MCP (Model Context Protocol)](/ai-development/mcp-model-context-protocol) — How MCP works and how to connect your AI to external tools
- [Designing Agent Instructions](/ai-development/designing-agent-instructions) — How to write CLAUDE.md and AGENTS.md files that actually work
