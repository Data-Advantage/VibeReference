---
title: "Choosing Your Tech Stack"
---

# Choosing Your Tech Stack

How to evaluate and pick the right frontend, backend, database, hosting, and auth/payments stack for a new SaaS project.

## Principles for Choosing a Stack

### 1. Optimize for speed, not scale
You're building an MVP or early-stage product. Pick tools that let you ship fast. You can always migrate later — and most products never need to.

### 2. Follow the ecosystem
Choose technologies with strong AI tool support. If your AI assistant knows the framework well, you'll move faster. Next.js, Tailwind, Supabase, and Stripe have excellent AI support across all major coding tools.

### 3. Minimize moving parts
Every service you add is another thing to configure, debug, and pay for. Start with the fewest services that get the job done.

### 4. Consider the defaults
Many hosting platforms and frameworks have preferred pairings. Vercel + Next.js, Supabase + Postgres, Clerk + Next.js — these integrations are well-documented and battle-tested.

## Frontend Framework

| Framework | Best For | AI Support | Learning Curve |
|-----------|----------|------------|----------------|
| **Next.js** | Full-stack SaaS apps | Excellent | Moderate |
| **Remix** | Data-heavy apps | Good | Moderate |
| **Nuxt** | Vue.js developers | Good | Moderate |
| **SvelteKit** | Performance-focused apps | Growing | Low-Moderate |
| **Astro** | Content-heavy sites | Good | Low |

**Recommendation**: Next.js (App Router) is the default choice. It has the largest ecosystem, best AI tool support, and handles everything from static sites to complex apps.

### CSS & UI Libraries

| Library | Approach | Best For |
|---------|----------|----------|
| **Tailwind CSS** | Utility-first classes | Rapid development, AI-generated code |
| **shadcn/ui** | Copy-paste components built on Tailwind | Professional UI without a component library dependency |
| **Radix UI** | Unstyled accessible primitives | Custom design systems |
| **Material UI** | Pre-built Google Material components | Quick, opinionated UI |
| **Chakra UI** | Styled component library | Balanced customization/speed |

**Recommendation**: Tailwind CSS + shadcn/ui. AI tools generate excellent Tailwind code, and shadcn/ui gives you polished, accessible components you own.

## Backend & Database

### Database Options

| Database | Type | Best For | Managed By |
|----------|------|----------|------------|
| **Supabase** | Postgres + Auth + Storage + Realtime | Most SaaS apps | Supabase |
| **PlanetScale** | MySQL (Vitess) | High-scale apps | PlanetScale |
| **Neon** | Serverless Postgres | Cost-sensitive projects | Neon |
| **MongoDB Atlas** | Document store | Flexible schemas | MongoDB |
| **Turso** | SQLite (libSQL) | Edge-first apps | Turso |
| **Firebase** | Document store + Auth + Hosting | Rapid prototypes | Google |

**Recommendation**: Supabase. It bundles Postgres, authentication, file storage, realtime subscriptions, and edge functions in one platform. The free tier is generous, and it has excellent documentation.

### ORM / Database Client

| Tool | Best For |
|------|----------|
| **Drizzle ORM** | Type-safe SQL with minimal abstraction |
| **Prisma** | Schema-first development, migrations |
| **Supabase Client** | Direct Supabase usage without an ORM |
| **Kysely** | Type-safe query builder |

**Recommendation**: For Supabase projects, start with the Supabase client directly. Add Drizzle if you need more complex queries or type-safe joins.

## Authentication

| Provider | Best For | Pricing |
|----------|----------|---------|
| **Supabase Auth** | Projects already using Supabase | Free with Supabase |
| **Clerk** | Best-in-class auth UI & user management | Free up to 10k MAU |
| **NextAuth.js (Auth.js)** | Self-hosted, provider flexibility | Free (open source) |
| **Lucia** | Lightweight, session-based auth | Free (open source) |
| **Kinde** | Auth + feature flags + billing | Free up to 10.5k MAU |

**Recommendation**: Supabase Auth if you're on Supabase (it's already there). Clerk if you want premium auth UI with minimal code.

## Hosting & Deployment

| Platform | Best For | Free Tier |
|----------|----------|-----------|
| **Vercel** | Next.js apps | Generous (hobby) |
| **Netlify** | Static sites, Jamstack | Generous |
| **Railway** | Full-stack with backend services | $5/month credit |
| **Fly.io** | Docker containers, edge deployment | Limited free tier |
| **Cloudflare Pages** | Static + Workers | Generous |
| **AWS Amplify** | AWS-native apps | 12 months free tier |

**Recommendation**: Vercel for Next.js projects. Zero-config deployments, preview URLs for PRs, and built-in analytics.

## Payments

| Provider | Best For | Pricing |
|----------|----------|---------|
| **Stripe** | Subscriptions, one-time payments, everything | 2.9% + 30¢ per transaction |
| **Lemon Squeezy** | Merchant of record (handles tax) | 5% + 50¢ per transaction |
| **Paddle** | Merchant of record (handles tax) | 5% + 50¢ per transaction |

**Recommendation**: Stripe if you can handle tax compliance (or use Stripe Tax). Lemon Squeezy if you want them to handle all tax/compliance as merchant of record.

## Recommended Starter Stacks

### The "Standard SaaS" Stack
Best for most projects. Maximum AI tool support and community resources.
- Next.js + Tailwind CSS + shadcn/ui
- Supabase (database + auth + storage)
- Vercel (hosting)
- Stripe (payments)

### The "Lean Prototype" Stack
Fastest path to a working demo. Minimize setup time.
- Next.js + Tailwind CSS + shadcn/ui
- Supabase (database + auth)
- Vercel (hosting)

### The "Content-First" Stack
For products where content/SEO is the primary growth channel.
- Astro or Next.js + Tailwind CSS
- Supabase or Turso (database)
- Vercel or Cloudflare Pages (hosting)
- MDX for content

## Decision Checklist

Before committing to a stack, verify:

- [ ] Your AI coding tool has good support for the framework
- [ ] The free tiers cover your needs for the first 6 months
- [ ] You can find starter templates or boilerplates
- [ ] The documentation is clear and up-to-date
- [ ] There's an active community for troubleshooting
- [ ] All services work well together (check for official integrations)
