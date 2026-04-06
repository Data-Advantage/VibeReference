# Official CLI Tools for Your Stack

Every major infrastructure vendor ships a command-line tool. These CLIs are built by the same teams that build the products — they are the fastest path to provisioning resources, running local development, managing secrets, and deploying code.

This guide covers the official CLI for every tool in a typical modern web stack. For each one: what it does, how to install it, and the commands you will actually use.

## Quick reference

| Tool | CLI | Install |
|------|-----|---------|
| Vercel | `vercel` | `npm install -g vercel` |
| Cloudflare | `wrangler` | `npm install -g wrangler` |
| Supabase | `supabase` | `npm install -g supabase` |
| Stripe | `stripe` | `brew install stripe/stripe-cli/stripe` |
| Prisma | `prisma` | `npm install prisma --save-dev` |
| Convex | `convex` | `npm install convex` |
| Next.js | `create-next-app` | `npx create-next-app@latest` |
| Tailwind CSS | `tailwindcss` | `npm install tailwindcss` |
| Clerk | `clerk` | `npm install @clerk/clerk-js` |
| Create React App | `create-react-app` | `npx create-react-app` |

## Vercel CLI

**Official:** Yes
**Repository:** [https://github.com/vercel/vercel](https://github.com/vercel/vercel)
**npm:** `vercel`

The Vercel CLI is the primary tool for deploying projects, managing environment variables, and configuring domains without touching the dashboard.

**Installation:**
```bash
npm install -g vercel
vercel login
```

**Key commands:**
```bash
# Link a project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Manage environment variables
vercel env add NEXT_PUBLIC_API_URL production
vercel env ls

# Add a custom domain
vercel domains add example.com my-project

# Inspect a deployment
vercel inspect https://my-deployment-url.vercel.app

# View logs
vercel logs my-project
```

**Pro tip:** Run `vercel dev` to get a local environment that runs your Vercel Functions (including edge functions) exactly as they run in production — environment variables included.

## Cloudflare Wrangler

**Official:** Yes
**Repository:** [https://github.com/cloudflare/workers-sdk](https://github.com/cloudflare/workers-sdk)
**npm:** `wrangler`

Wrangler is the CLI for Cloudflare's developer platform — Workers, Pages, R2, D1, KV, Queues, and Durable Objects.

**Installation:**
```bash
npm install -g wrangler
wrangler login
```

**Key commands:**
```bash
# Workers
wrangler dev           # Start local dev server
wrangler deploy        # Deploy to Cloudflare
wrangler tail          # Stream live logs

# R2 object storage
wrangler r2 bucket create my-bucket
wrangler r2 bucket list
wrangler r2 object put my-bucket/file.txt --file ./file.txt
wrangler r2 object get my-bucket/file.txt

# D1 SQL databases
wrangler d1 create my-db
wrangler d1 execute my-db --command "SELECT * FROM users LIMIT 10"
wrangler d1 execute my-db --file ./migration.sql

# KV namespaces
wrangler kv namespace create MY_KV
wrangler kv key put --namespace-id abc123 "key" "value"
wrangler kv key get --namespace-id abc123 "key"

# Pages
wrangler pages deploy ./dist --project-name my-site

# Environment secrets
wrangler secret put API_KEY
wrangler secret list
```

**Wrangler config (`wrangler.toml`):**
```toml
name = "my-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[r2_buckets]]
binding = "MY_BUCKET"
bucket_name = "my-bucket"

[[d1_databases]]
binding = "DB"
database_name = "my-db"
database_id = "abc-123"
```

## Supabase CLI

**Official:** Yes
**Repository:** [https://github.com/supabase/cli](https://github.com/supabase/cli)
**npm:** `supabase`

The Supabase CLI manages local development, database migrations, and project configuration. It runs a full Supabase stack locally via Docker.

**Installation:**
```bash
# macOS (Homebrew)
brew install supabase/tap/supabase

# npm
npm install -g supabase
```

**Key commands:**
```bash
# Local development
supabase init          # Initialize project
supabase start         # Start local Supabase (Docker)
supabase stop          # Stop local instance
supabase status        # View local URLs and keys

# Database migrations
supabase migration new add_users_table
supabase db push       # Push migrations to remote
supabase db pull       # Pull remote schema to local
supabase db reset      # Reset local database

# Type generation
supabase gen types typescript --local > types/supabase.ts

# Edge Functions
supabase functions new my-function
supabase functions serve my-function
supabase functions deploy my-function

# Link to remote project
supabase link --project-ref your-project-ref
```

**Local development URLs** (after `supabase start`):
- API: `http://localhost:54321`
- Studio: `http://localhost:54323`
- Database: `postgresql://postgres:postgres@localhost:54322/postgres`

## Stripe CLI

**Official:** Yes
**Repository:** [https://github.com/stripe/stripe-cli](https://github.com/stripe/stripe-cli)

The Stripe CLI is essential for local webhook testing. It forwards real Stripe events to your local server, so you can test payment flows without deploying.

**Installation:**
```bash
# macOS (Homebrew)
brew install stripe/stripe-cli/stripe

# npm
npm install -g stripe-cli

# After install
stripe login
```

**Key commands:**
```bash
# Webhook forwarding (most important command)
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.created
stripe trigger invoice.payment_failed

# View recent events
stripe events list

# Create test resources
stripe customers create --email test@example.com
stripe payment-intents create --amount 1000 --currency usd

# View logs
stripe logs tail
```

**Webhook testing setup:**
```bash
# Get the webhook signing secret for local dev
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# → Output: "Your webhook signing secret is whsec_abc123..."
# → Add this to your .env: STRIPE_WEBHOOK_SECRET=whsec_abc123...
```

## Prisma CLI

**Official:** Yes
**Repository:** [https://github.com/prisma/prisma](https://github.com/prisma/prisma)
**npm:** `prisma` (devDependency), `@prisma/client` (runtime)

The Prisma CLI generates type-safe database clients, runs migrations, and manages your schema.

**Installation:**
```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

**Key commands:**
```bash
# Schema management
npx prisma db push          # Push schema changes (no migration file)
npx prisma migrate dev       # Create and apply migration
npx prisma migrate deploy    # Apply pending migrations (CI/prod)
npx prisma migrate reset     # Reset database (dev only)

# Client generation
npx prisma generate          # Regenerate Prisma Client after schema changes

# Database inspection
npx prisma db pull           # Pull existing database schema into schema.prisma
npx prisma studio            # Open visual database browser (localhost:5555)

# Seeding
npx prisma db seed           # Run seed file (defined in package.json)
```

**`prisma/schema.prisma` example:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())
}
```

## Convex CLI

**Official:** Yes
**Repository:** [https://github.com/get-convex/convex-js](https://github.com/get-convex/convex-js)
**npm:** `convex`

The Convex CLI manages your backend: deploying functions, syncing schema, and managing environment variables. It ships as part of the `convex` package.

**Installation:**
```bash
npm install convex
npx convex dev    # First run prompts for login and project setup
```

**Key commands:**
```bash
# Development (watches and auto-deploys on change)
npx convex dev

# One-time sync (no watch mode — useful in CI)
npx convex dev --once

# Production deployment
npx convex deploy

# Environment variables
npx convex env set OPENAI_API_KEY sk-your-key
npx convex env set OPENAI_API_KEY sk-your-key --prod
npx convex env list
npx convex env list --prod

# New project setup (non-interactive — for agents/CI)
npx convex dev --configure new --team myteam --project my-project --once

# Link existing project (non-interactive)
npx convex dev --configure existing --team myteam --project my-project --once
```

**Note for agents:** Always use `--once` flag in automated environments. Without it, `convex dev` runs in watch mode and never exits.

## create-next-app

**Official:** Yes
**Repository:** [https://github.com/vercel/next.js](https://github.com/vercel/next.js)
**npm:** `create-next-app`

Vercel's official Next.js scaffolding tool. Creates a properly-configured Next.js project with App Router, TypeScript, Tailwind, and ESLint.

**Installation:** No install needed — use via npx:
```bash
npx create-next-app@latest my-app
```

**Interactive prompts will ask:**
- TypeScript? (Yes)
- ESLint? (Yes)
- Tailwind CSS? (Yes)
- `src/` directory? (Up to you)
- App Router? (**Always Yes** for modern projects)
- Import alias? (`@/*`)

**Non-interactive (for scripts and agents):**
```bash
npx create-next-app@latest my-app \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*"
```

## Tailwind CSS CLI

**Official:** Yes
**Repository:** [https://github.com/tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss)
**npm:** `tailwindcss`

The Tailwind CLI builds your CSS. In most Next.js projects you do not invoke it directly — PostCSS integration handles it via `npm run build`. But the CLI is useful for standalone CSS builds.

**Installation:**
```bash
npm install tailwindcss
```

**Tailwind v4 setup** (current — `@import` syntax):
```css
/* globals.css */
@import "tailwindcss";
```

**Tailwind v3 setup** (legacy — `@tailwind` directives):
```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Warning:** Tailwind v4 silently ignores v3 directives. The build passes with zero errors but produces zero CSS — the page renders unstyled. Always verify which version is installed before modifying `globals.css`.

```bash
# Check your installed version
cat package.json | grep tailwindcss
```

**Standalone build (without PostCSS):**
```bash
npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch
```

## Clerk CLI

**Official:** Yes
**Repository:** [https://github.com/clerk/clerk-cli](https://github.com/clerk/clerk-cli)

Clerk provides a CLI for managing authentication configuration, JWT templates, and user data.

**Installation:**
```bash
npm install -g @clerk/cli
clerk login
```

**Key commands:**
```bash
# View application config
clerk apps list
clerk apps get

# JWT templates
clerk jwt-templates list

# Generate SDK config
clerk generate --framework nextjs
```

Most Clerk configuration is handled through the [Clerk Dashboard](https://dashboard.clerk.com) — the CLI is primarily useful for automation and scripting.

## Package.json scripts for your CLI-heavy stack

A typical `package.json` for a project using several of these CLIs:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:generate": "prisma generate",
    "convex:dev": "convex dev",
    "convex:push": "convex dev --once",
    "stripe:listen": "stripe listen --forward-to localhost:3000/api/webhooks/stripe"
  }
}
```

## Keep reading

- [Official MCP Servers by Vendor](/ai-development/official-mcp-servers) — Connect your AI directly to Cloudflare, Stripe, and Vercel
- [npm vs pnpm](/devops-and-tools/npm-vs-pnpm) — Which package manager to use for your stack
- [Environment Variables](/devops-and-tools/environment-variable) — Managing secrets across local dev, preview, and production
- [DevOps and Tools](/devops-and-tools) — More tools, configuration guides, and developer workflow references
