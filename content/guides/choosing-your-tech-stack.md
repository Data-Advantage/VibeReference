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
| **Vite** | Client-side SPAs, dashboards, internal tools | Excellent | Low |
| **Remix** | Data-heavy apps | Good | Moderate |
| **Nuxt** | Vue.js developers | Good | Moderate |
| **SvelteKit** | Performance-focused apps | Growing | Low-Moderate |
| **Astro** | Content-heavy sites | Good | Low |

> **Note on Vite**: Vite is a build tool, not a framework. Use it when you need React, Vue, or Svelte without a meta-framework like Next.js — ideal for SPAs and internal tools where SSR is not needed. It has the highest developer satisfaction in the ecosystem (95% in State of JS 2024) and delivers sub-second dev server starts via native ES modules.

**Recommendation**: Next.js (App Router) is the default choice. It has the largest ecosystem, best AI tool support, and handles everything from static sites to complex apps. Use Vite for client-only apps (dashboards, admin panels) where you don't need SSR or routing built in.

### CSS & UI Libraries

| Library | Approach | Best For |
|---------|----------|----------|
| **Tailwind CSS** | Utility-first classes | Rapid development, AI-generated code |
| **shadcn/ui** | Copy-paste components built on Tailwind | Professional UI without a component library dependency |
| **Radix UI** | Unstyled accessible primitives | Custom design systems |
| **Base UI** | Unstyled accessible primitives (headless) | Maximum styling control, Tailwind-first projects |
| **Material UI** | Pre-built Google Material components | Quick, opinionated UI |
| **Chakra UI** | Styled component library | Balanced customization/speed |

> **Base UI vs Radix UI**: Both provide unstyled, accessible headless primitives. Base UI (v1.0, December 2025) is more actively maintained and offers advanced features like multi-select and a dedicated Combobox that Radix lacks. Radix UI has more community content but has slowed development since its WorkOS acquisition. shadcn/ui now supports both as its primitives layer — Base UI is the recommended default for new projects.

**Recommendation**: Tailwind CSS + shadcn/ui. AI tools generate excellent Tailwind code, and shadcn/ui gives you polished, accessible components you own.

## Backend & Database

### Database Options

| Database | Type | Best For | Managed By |
|----------|------|----------|------------|
| **Supabase** | Postgres + Auth + Storage + Realtime | Most SaaS apps | Supabase |
| **Convex** | Reactive document store + serverless functions | Real-time collaborative apps, TypeScript-first teams | Convex |
| **PlanetScale** | MySQL (Vitess) | High-scale apps | PlanetScale |
| **Neon** | Serverless Postgres | Cost-sensitive projects | Neon |
| **MongoDB Atlas** | Document store | Flexible schemas | MongoDB |
| **Turso** | SQLite (libSQL) | Edge-first apps | Turso |
| **Firebase** | Document store + Auth + Hosting | Rapid prototypes | Google |

> **Convex vs Supabase**: Convex provides end-to-end TypeScript type safety (schema → queries → API layer), automatic real-time sync at sub-50ms latency, and zero infrastructure management — no migration files, no connection pools, no ORM. Choose Convex when real-time collaboration is core to your product and you want pure TypeScript end-to-end. Choose Supabase when you need SQL power, self-hosting, or lower cost at scale.

**Recommendation**: Supabase. It bundles Postgres, authentication, file storage, realtime subscriptions, and edge functions in one platform. The free tier is generous, and it has excellent documentation. For real-time collaborative features as a core product requirement, Convex is the stronger choice.

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
| **Supabase Auth** | Projects already using Supabase | Free with Supabase (included) |
| **Clerk** | Best-in-class auth UI, user management, Next.js integration | Free up to 10K MAU, then $0.02/MAU |
| **NextAuth.js (Auth.js)** | Self-hosted, provider flexibility | Free (open source) |
| **Lucia** | Lightweight, session-based auth | Free (open source) |
| **Kinde** | Auth + feature flags + billing | Free up to 10.5K MAU |

**Clerk** is the strongest choice when auth UI quality matters. It offers pre-built sign-in/sign-up components that work instantly with Next.js App Router (middleware, Server Components, Server Actions), plus complete user management — profiles, organizations, roles, permissions. Advanced security features (MFA, breach detection, bot protection, device tracking) are included without extra code. Developers consistently report working auth in 1–3 days vs. 2–5 days with alternatives. Note: at $0.02/MAU after 10K free, it's more expensive than Supabase Auth at scale — factor this in for high-volume consumer apps.

**Recommendation**: Supabase Auth if you're already on Supabase and only need basic email/OAuth login — it's free and sufficient. Clerk if you want premium auth UI, user management (orgs/roles), or advanced security with minimal code, especially with Next.js App Router. Clerk and Supabase integrate directly with Row Level Security (RLS) support if you want both.

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

### The "Real-Time SaaS" Stack
For collaborative tools, live dashboards, and multiplayer features where real-time sync is core.
- Next.js + Tailwind CSS + shadcn/ui
- Convex (reactive database + serverless functions)
- Clerk (auth + user management)
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
