# Web Frameworks for SaaS

Picking a web framework for a new SaaS in 2026 is a real architecture decision, not a default. **Next.js** is the dominant default for React + Vercel; **Astro** owns the content-first / hybrid-rendering niche; **SvelteKit** has matured into a serious Svelte-based full-stack option; **Remix** survived its acquisition into React Router 7; **Nuxt** is the Vue answer; **TanStack Start** is the new entrant for type-safe React. Each ships a different opinion about routing, rendering, data fetching, and deployment.

This is the comparison: when each makes sense, what each costs in lock-in, and how to pick without painting yourself into a corner.

For a deeper Next.js reference, see [Next.js](/frontend/nextjs). This page is the framework-by-framework buyer's guide.

## Why this category fragmented

Three trends converged through 2024–2026:

- **React's grip loosened slightly.** SvelteKit shipped real production stories. Astro became dominant in content-heavy spaces. Bun + Hono made non-React full-stack faster than ever. The "use React" default still holds for SaaS apps but is no longer automatic.
- **Frameworks pulled away from rendering ideology.** Most modern frameworks support SSR, SSG, ISR, streaming, partial prerendering, and edge / serverless. The differentiation is now elsewhere — DX, type safety, ecosystem, deployment story.
- **Deployment platforms shaped framework choice.** Vercel optimizes for Next.js; Cloudflare for edge frameworks; Netlify for Astro; Fly.io / Railway for Node.js apps. The hosting platform sometimes determines the framework.

Picking is now a real decision with real consequences. The framework you pick shapes your hiring, your performance ceiling, your ecosystem of integrations, and your team's daily DX.

## The six serious options

### Next.js (React)

**What it is**: the dominant React full-stack framework. App Router (the modern paradigm), Server Components, streaming, ISR, and tight Vercel integration.

**Strengths**:
- Largest React ecosystem; every library / SDK supports it
- Server Components + Server Actions are the modern paradigm for data-fetching and mutations
- Best-in-class deployment story (Vercel) and very good on alternatives (Cloudflare, Netlify, AWS, self-hosted)
- Strong AI ecosystem fit — [AI SDK](/ai-development/ai-sdk), [AI Gateway](/cloud-and-hosting/vercel-ai-gateway), [Workflow DevKit](/cloud-and-hosting/vercel-workflow), [Sandbox](/cloud-and-hosting/vercel-sandbox), [Queues](/cloud-and-hosting/vercel-queues) all assume Next.js as primary target
- Mature TypeScript story (since v13)

**Weaknesses**:
- App Router learning curve (Server Components vs Client Components, caching layers, async boundaries)
- Vercel-shaped — works best on Vercel; functional but second-class everywhere else
- Bundle size can balloon if not managed
- Caching behavior has been a source of confusion across versions (substantially better in v15+)

**Pricing implications**: Vercel free tier covers small projects; Pro at $20/mo + usage; Enterprise scales meaningfully.

**Best for**: most React-based SaaS in 2026. The pragmatic default unless you have a specific reason to deviate.

See: [Next.js reference](/frontend/nextjs).

### Astro

**What it is**: content-first framework that ships static HTML by default, with islands of interactivity (React, Vue, Svelte components mixed in) where needed. Strong for marketing sites, docs, blogs, and hybrid SaaS.

**Strengths**:
- Best-in-class for performance — ships near-zero JavaScript by default
- Framework-agnostic islands — mix React, Vue, Svelte components in the same project
- Excellent for content-heavy sites (docs, marketing, blogs)
- Native MDX support, content collections with type safety
- Good DX, fast dev server

**Weaknesses**:
- Not the right fit for highly-interactive SaaS dashboards (you'd be fighting the framework)
- Smaller ecosystem than Next.js
- Backend / API patterns less mature than full-stack frameworks

**Pricing implications**: deploys cheaply anywhere (Cloudflare Pages, Netlify, Vercel)

**Best for**: marketing sites, documentation sites, content-heavy products, static-first SaaS landing pages with light interactivity.

### SvelteKit

**What it is**: full-stack Svelte framework. SSR, SSG, ISR, streaming, file-based routing, server actions ("form actions"), built on Vite.

**Strengths**:
- Smaller bundle sizes than React-based alternatives
- Cleaner mental model than React — Svelte's reactivity is more direct
- Good performance characteristics out of the box
- Solid TypeScript story
- Matured significantly through 2024-2026; production-ready stories from Brave, IKEA, others

**Weaknesses**:
- Smaller ecosystem than React/Next.js — fewer pre-built libraries, fewer hires available
- Smaller AI / SDK ecosystem support — many tools are React-first
- Hiring pool is smaller

**Pricing implications**: deploys to most platforms cleanly (Vercel, Cloudflare, Netlify, Fly.io, etc.)

**Best for**: teams that prefer Svelte's mental model, performance-sensitive products, Vue-team-equivalent for Svelte.

### Remix / React Router 7

**What it is**: full-stack React framework that emphasizes web fundamentals (forms, progressive enhancement, nested routing). Acquired by Shopify in 2022; merged with React Router 7 in 2024.

**Strengths**:
- Strongest "the web platform" philosophy — forms work without JS, nested routing is excellent
- Loaders / actions pattern is conceptually cleaner than Next.js's data fetching
- Good TypeScript story
- Backed by Shopify ecosystem

**Weaknesses**:
- Identity confusion post-React-Router-7 merge (is it Remix? is it React Router?)
- Smaller ecosystem than Next.js
- Less momentum since the merge
- Less aligned with the Vercel + AI-tooling ecosystem

**Pricing implications**: deploys to most platforms

**Best for**: teams that prefer Remix's "use the platform" philosophy and don't need the broader Next.js ecosystem; existing Remix codebases.

### Nuxt (Vue)

**What it is**: the Vue equivalent of Next.js. SSR, SSG, ISR, server routes, file-based routing, mature ecosystem.

**Strengths**:
- Best-in-class for Vue-based teams
- Solid SSR / hybrid rendering
- Mature module ecosystem (auth, content, image optimization, i18n)
- Good TypeScript story

**Weaknesses**:
- Vue ecosystem is smaller than React's; many AI / SaaS tools are React-first
- Less momentum than React frameworks in 2026

**Pricing implications**: deploys broadly

**Best for**: Vue-shop teams; existing Nuxt codebases; products where Vue's mental model fits the team.

### TanStack Start

**What it is**: the newest entrant. Type-safe React framework built around TanStack Query / TanStack Router. End-to-end types from URL to data fetching to UI.

**Strengths**:
- Best-in-class type safety — types flow from URL params through data fetching to UI
- TanStack Query integration is automatic (vs bolt-on in other frameworks)
- Smaller, focused API surface

**Weaknesses**:
- New (early 2026); ecosystem still building
- Less battle-tested than Next.js / SvelteKit
- Smaller community

**Pricing implications**: deploys broadly; Cloudflare-friendly

**Best for**: TypeScript purists who prioritize type safety over feature breadth; teams already deep in TanStack Query / Router.

---

## Side-by-side

| | Next.js | Astro | SvelteKit | Remix / RR7 | Nuxt | TanStack Start |
|---|---------|-------|-----------|-------------|------|----------------|
| **Language** | React + TS | Multi (React/Vue/Svelte islands) | Svelte + TS | React + TS | Vue + TS | React + TS |
| **Rendering** | SSR/SSG/ISR/Streaming | SSG/SSR | SSR/SSG/ISR | SSR | SSR/SSG/ISR | SSR |
| **Server Components** | Yes (RSC) | N/A | N/A | N/A | N/A | N/A |
| **Server Actions** | Yes | N/A (use API routes) | Yes (form actions) | Yes (actions) | Yes | Yes |
| **Type safety** | Good | Good | Good | Good | Good | Best (end-to-end) |
| **Bundle size** | Medium | Smallest | Small | Medium | Medium | Medium |
| **Ecosystem size** | Largest | Medium | Smaller | Smaller | Smaller (Vue) | Smallest (newest) |
| **AI tooling fit** | Best | OK | OK | OK | OK | OK |
| **Best deployment** | Vercel | Cloudflare/Netlify | Vercel/CF | Anywhere | Anywhere | CF/Vercel |
| **Hiring pool** | Largest | Medium | Small | Small | Medium (Vue) | Smallest |
| **Best for** | Most SaaS | Content/marketing | Svelte-team SaaS | Web-platform purist | Vue teams | Type-safety obsessed |

---

## Decision matrix

| Job-to-be-done | Pick |
|----------------|------|
| **General React SaaS** | **Next.js** — the 2026 default |
| **Marketing site / docs / blog with light interactivity** | **Astro** — best performance, hybrid islands |
| **AI SaaS with deep Vercel integration** | **Next.js** — every Vercel AI tool assumes it |
| **Performance-critical product, small team prefers Svelte** | **SvelteKit** |
| **Vue-based team / existing Vue codebase** | **Nuxt** |
| **Existing Remix codebase** | **stay on Remix / RR7** — migration cost rarely justifies |
| **Type-safety obsessed React team** | **TanStack Start** |
| **Multi-tenant SaaS with complex routing** | **Next.js** or **Remix** — both have mature multi-tenancy patterns |
| **High-traffic content site (millions of pageviews)** | **Astro** + Cloudflare — cheapest at scale |
| **Static-first sites** | **Astro** — purpose-built for this |

If forced to pick a single default for new SaaS in 2026: **Next.js**. The combination of largest ecosystem, best AI tooling fit, and pragmatic deployment story is hard to beat unless you have a specific reason to deviate.

## Pragmatic stack patterns

Most SaaS in 2026 fit one of these:

### Pattern A: "AI SaaS Default"
- **Frontend**: Next.js
- **Hosting**: Vercel
- **AI**: AI SDK + AI Gateway (per [AI Gateway](/cloud-and-hosting/vercel-ai-gateway))
- **DB**: Neon Postgres (per [Vercel Functions](/cloud-and-hosting/vercel-functions))
- **Auth**: Clerk or Better Auth (per [Auth Providers](/auth-and-payments/auth-providers))
- **Best for**: most indie / mid-market AI SaaS

### Pattern B: "Content + Light SaaS"
- **Frontend**: Astro for content, Next.js or SvelteKit for the app
- **Hosting**: Cloudflare Pages
- **DB**: Cloudflare D1 / Neon
- **Best for**: content-heavy products with separate app

### Pattern C: "SvelteKit Full-Stack"
- **Frontend**: SvelteKit
- **Hosting**: Vercel or Cloudflare
- **DB**: Postgres or Convex
- **Auth**: Better Auth
- **Best for**: teams that prefer Svelte's mental model

### Pattern D: "Type-Safety Obsessed"
- **Frontend**: TanStack Start
- **DB**: Postgres + Drizzle
- **Auth**: Better Auth
- **Hosting**: Cloudflare
- **Best for**: end-to-end-types is the differentiating priority

---

## Honest tradeoffs

- **Next.js's lock-in is overstated and understated.** Overstated: the framework runs on most hosts. Understated: the AI / SaaS tooling ecosystem (Workflow DevKit, AI Gateway, Sandbox) is genuinely Next.js-first. Migrating away costs more than the framework alone suggests.
- **Astro is great until you need real SaaS interactivity.** Once your product is more dashboard than content, Astro becomes friction — you're not using its strengths.
- **SvelteKit is genuinely production-ready but the ecosystem gap is real.** Need an AI SDK? It works on Svelte but Next.js is the primary documented path. Need to hire? React developers outnumber Svelte 10:1.
- **Remix's identity post-merge is muddled.** RR7 is the future; "Remix" the brand is fading. New projects probably shouldn't pick Remix specifically; the React Router 7 path is the modern continuation.
- **Nuxt is excellent for Vue-shops but the AI ecosystem gap is real.** Many AI tools (OpenAI / Anthropic / AI SDK) work on Vue, but the documentation / examples / first-class fit is React.
- **TanStack Start is impressive but new.** Ship critical infrastructure on it only if you can absorb churn. Use it for greenfield projects where the type-safety benefit dominates.

## What none of these solve perfectly

- **The hiring pool problem.** Niche frameworks (Svelte, Vue, TanStack) have smaller hiring pools. If you build a 100-person team, hiring becomes meaningfully harder. Mainstream frameworks (Next.js, Nuxt for Vue) help on this dimension.
- **The mobile-app problem.** All of these are web frameworks. Native mobile (React Native, Swift, Kotlin) is a separate decision.
- **The framework migration cost.** Switching frameworks is a multi-month project with real customer-facing risk. Pick deliberately; defer migration unless the new framework genuinely solves a problem the current one doesn't.
- **Deployment-platform lock-in.** Next.js + Vercel is the tightest pair. Astro + Cloudflare is similar. SvelteKit + most platforms is more flexible. Factor the platform as part of the framework decision.

## Cross-references on this site

- **Existing framework deep-dives**: [Next.js](/frontend/nextjs), [React](/frontend/react), [TypeScript](/frontend/typescript), [Tailwind](/frontend/tailwind), [shadcn](/frontend/shadcn)
- **Component / DX adjacent**: [v0](/frontend/v0), [TweakCN](/frontend/tweakcn), [Radix](/frontend/radix), [Lucide](/frontend/lucide)
- **AI tooling that pairs**: [AI SDK](/ai-development/ai-sdk), [AI App Builders](/ai-development/ai-app-builders)
- **Vercel tooling that's framework-aware**: [Vercel](/cloud-and-hosting/vercel), [Vercel Functions](/cloud-and-hosting/vercel-functions), [Vercel Workflow](/cloud-and-hosting/vercel-workflow), [Vercel Sandbox](/cloud-and-hosting/vercel-sandbox), [Vercel AI Gateway](/cloud-and-hosting/vercel-ai-gateway)

## Further reading

- [Next.js](https://nextjs.org)
- [Astro](https://astro.build)
- [SvelteKit](https://kit.svelte.dev)
- [React Router 7 (formerly Remix)](https://reactrouter.com)
- [Nuxt](https://nuxt.com)
- [TanStack Start](https://tanstack.com/start)
