# Auth Providers for SaaS

Picking an auth provider in 2026 is a different decision than it was in 2023. Clerk has matured into the indie / mid-market default. Better Auth has emerged as the open-source TypeScript-native alternative. Supabase Auth is the right pick when you're already on Supabase. Auth.js is still around but has lost ground to the new generation. Stack Auth is a credible newer entrant. Workos targets enterprise. Auth0 still wins enterprise procurement processes.

This is the comparison: when each makes sense, what each costs, and how to pick without painting yourself into a corner.

For deeper individual references, see [Authentication](/auth-and-payments/authentication), [Better Auth](/auth-and-payments/better-auth), [Clerk Billing](/auth-and-payments/clerk-billing), [Supabase Auth](/auth-and-payments/supabase-auth), [Login with Google](/auth-and-payments/login-with-google), [Passkeys](/auth-and-payments/passkeys), and [Security](/auth-and-payments/security).

## Why this category fragmented

Three trends converged through 2024–2026:

- **TypeScript-native auth got serious.** Better Auth and Stack Auth ship with the modern TypeScript-first DX (Zod, end-to-end types) that legacy providers retrofit poorly.
- **Auth-as-a-platform diversified.** Clerk extended into billing, organizations, and enterprise SSO. Workos owns the "enterprise SSO API" niche. Auth0 still owns enterprise procurement but has lost developer mindshare.
- **Open source caught up.** Better Auth is plausible "host it yourself" auth. Lucia (now archived) seeded the category. Self-hosting is now realistic without sacrificing modern features.

Picking is now a real architecture decision: managed vs open-source vs DIY, TypeScript-first vs polyglot, single-provider vs multi-stack.

## The seven serious options

### Clerk

**What it is**: managed authentication service with first-class React/Next.js components, organizations, billing integration (Clerk Billing), and SSO.

**Strengths**:
- Best-in-class drop-in components — `<SignIn />`, `<UserButton />`, etc., styled and accessible out of the box
- Organizations / multi-tenancy built in (per [Clerk Billing](/auth-and-payments/clerk-billing))
- Solid SSO / SAML support without a separate integration
- Stripe-integrated billing (Clerk Billing) for SaaS pricing
- Strong free tier (10,000 MAU)

**Weaknesses**:
- Pricing scales meaningfully past 10k MAU — $25/mo for 10k, then per-user; can hit $1k+/month at scale
- Vendor lock-in is real; migrating away is non-trivial
- React-centric; Next.js is the strongest path

**Pricing in 2026**: free up to 10k MAU; ~$25/mo for 10k+; enterprise custom

**Best for**: indie SaaS through mid-market on Next.js / React. The 2026 default for most teams.

### Better Auth

**What it is**: open-source, TypeScript-native auth library (not a hosted service). End-to-end typed, plugin architecture, full feature parity with managed providers.

**Strengths**:
- Zero vendor cost — runs in your own app on your own infrastructure
- Best TypeScript DX in the category — full inference across the stack
- Plugin ecosystem (organizations, multi-session, magic links, passkeys, two-factor)
- Database-agnostic (Postgres, MySQL, SQLite, Mongo)
- No data-residency concerns since data stays in your DB
- Active development; rapidly approaching Clerk feature parity

**Weaknesses**:
- Self-hosted ops burden (small but non-zero)
- No managed UI components — you build your own forms (less work than it sounds; AI-generated components handle most of this)
- Newer than Clerk; less battle-tested at very large scale
- No built-in SSO/SAML enterprise yet (community plugins exist)

**Pricing in 2026**: $0; runs on your own infra

**Best for**: TypeScript teams that prefer open-source, want zero auth-bill, or have data-residency requirements.

See: [Better Auth reference](/auth-and-payments/better-auth).

### Supabase Auth

**What it is**: auth bundled into Supabase's backend platform; free with Supabase, integrates tightly with Supabase Postgres + Edge Functions + Storage.

**Strengths**:
- "Free" if you're already on Supabase
- RLS (Row Level Security) policies enforce auth at the DB level — strong defense-in-depth
- OAuth providers, magic links, MFA, SSO (paid plans)
- Email-link templates customizable

**Weaknesses**:
- Less polished UI components than Clerk
- Locks you into Supabase as your backend
- Less developer ergonomics than Better Auth for TypeScript apps
- SSO / SAML is paid-tier only

**Pricing in 2026**: bundled with Supabase free tier; Pro tier $25/mo includes more

**Best for**: teams already on Supabase; products where RLS-as-auth makes sense.

See: [Supabase Auth reference](/auth-and-payments/supabase-auth).

### Auth.js (formerly NextAuth.js)

**What it is**: open-source auth library originally for Next.js, expanded to other frameworks. Long-running incumbent with massive adoption.

**Strengths**:
- Free, open-source
- Massive ecosystem (~70+ OAuth providers built in)
- Mature codebase
- Deep Next.js integration

**Weaknesses**:
- DX has aged — earlier API patterns less ergonomic than Better Auth or Clerk
- Documentation can be confusing for v5 vs v4
- Self-hosting ops burden
- Less feature-complete for organizations / multi-tenant SaaS

**Pricing in 2026**: $0

**Best for**: existing Auth.js codebases; teams that want a battle-tested, free, Next.js-native option without the modern Better Auth DX.

### Stack Auth

**What it is**: open-source auth platform with hosted option. Designed as a Clerk alternative with similar component-driven DX but open-source.

**Strengths**:
- Drop-in components similar to Clerk
- Open-source core; can self-host
- Modern TypeScript DX
- Stripe-integrated billing in roadmap

**Weaknesses**:
- Younger ecosystem; less mature than Clerk or Auth.js
- Smaller community
- Plugin / integration ecosystem still building

**Pricing in 2026**: free open-source; hosted tier ~$10-50/mo at small scale

**Best for**: teams that want Clerk's component-driven DX without the lock-in.

### Workos

**What it is**: enterprise-focused auth platform specializing in SSO/SAML, SCIM provisioning, directory sync, and audit logs. Sells primarily into the "we need enterprise SSO" use case.

**Strengths**:
- Best-in-class enterprise SSO experience (SAML, OIDC, multiple IdPs in one integration)
- SCIM provisioning, directory sync, just-in-time provisioning
- Audit logs and compliance reporting
- Pricing model designed for B2B SaaS adding enterprise tier

**Weaknesses**:
- Not the right primary auth for early-stage SaaS — overkill below ~$50k MRR
- Pricing scales with enterprise customers ($X/SSO connection/month)
- Less ergonomic for non-enterprise auth flows

**Pricing in 2026**: ~$125/mo per enterprise SSO connection; first connection often free

**Best for**: SaaS with "we just landed our first enterprise customer asking for SAML" — Workos handles that without rebuilding auth. Pair with another provider for the rest.

### Auth0

**What it is**: the long-time enterprise-default auth platform; now owned by Okta. Mature, feature-complete, expensive.

**Strengths**:
- Most enterprise-recognized auth brand; passes procurement reviews easily
- SOC 2, HIPAA, FedRAMP, etc. — all compliance certs you might need
- Feature-complete (every auth flow you can think of)
- Strong enterprise integrations

**Weaknesses**:
- Pricing scales aggressively — $240/mo entry; can reach $5k+/mo for mid-scale apps
- DX has aged; less ergonomic than Clerk or Better Auth
- Lock-in is real; migration is a major project
- Overkill for indie / early-stage products

**Pricing in 2026**: ~$240/mo entry; $1.5k+/mo at meaningful scale; enterprise custom

**Best for**: enterprise SaaS that has procurement-driven auth selection; teams already on Auth0 with no compelling reason to migrate.

---

## Side-by-side

| | Clerk | Better Auth | Supabase Auth | Auth.js | Stack Auth | Workos | Auth0 |
|---|-------|-------------|---------------|---------|------------|--------|-------|
| **Type** | Managed | Open-source library | Bundled | Open-source library | Open-source + hosted | Managed (enterprise SSO) | Managed |
| **Components** | ✓✓ Best | DIY | Limited | DIY | ✓ | N/A | ✓ |
| **TypeScript DX** | Good | Best | Good | Aged | Good | OK | OK |
| **Organizations / multi-tenancy** | ✓✓ | ✓ (plugin) | Manual | Manual | ✓ | ✓✓ | ✓ |
| **SSO / SAML** | ✓ | Community | Paid tier | Manual | In progress | ✓✓ Best | ✓✓ Best |
| **MFA / Passkeys** | ✓ | ✓ | ✓ | Plugins | ✓ | ✓ | ✓ |
| **Billing integration** | Clerk Billing | DIY | DIY | DIY | Roadmap | DIY | DIY |
| **Database** | Provider | Yours | Postgres | Yours | Provider/Yours | Provider | Provider |
| **Pricing at 1k MAU** | Free | $0 | Free | $0 | Free | N/A (enterprise) | $240/mo |
| **Pricing at 10k MAU** | Free | $0 | $25/mo (Supabase Pro) | $0 | Free-$30 | N/A | $240+/mo |
| **Pricing at 100k MAU** | $1k+/mo | $0 + DB cost | $50-100/mo | $0 + ops | $50-100/mo | $X/SSO conn | $1.5k+/mo |
| **Best for** | Indie + mid-market default | TS-first open source | Already on Supabase | Existing codebases | Clerk-style without lock-in | Enterprise SSO add-on | Enterprise procurement |

---

## Decision matrix

| Job-to-be-done | Pick |
|----------------|------|
| **Indie SaaS, ship fast** | **Clerk** — fastest path to working auth |
| **TypeScript-first, prefer open-source** | **Better Auth** — modern DX, no vendor cost |
| **Already on Supabase** | **Supabase Auth** — bundled, RLS-friendly |
| **Existing Next.js project on Auth.js** | **Stay on Auth.js** — migration cost rarely justifies |
| **Want Clerk's component DX without lock-in** | **Stack Auth** — open-source equivalent |
| **Need enterprise SSO for one customer** | **Workos** (alongside primary auth) |
| **Enterprise procurement requires named vendor** | **Auth0** or **Workos** |
| **Cost-sensitive at scale** | **Better Auth** or **Auth.js** (zero vendor cost) |
| **Need organizations + billing in one** | **Clerk** (Clerk Billing bundle) |
| **Building a multi-product platform** | **Better Auth** (cross-product session control) |

If forced to pick a single default for new TypeScript SaaS in 2026: **Clerk for the indie/mid-market path, Better Auth if you prefer open-source and have engineering bandwidth**. Both are correct answers; the choice is operational preference.

## Pragmatic stack patterns

Most SaaS in 2026 run one of these:

### Pattern A: "Indie SaaS Default"
- **Auth**: Clerk
- **Billing**: Clerk Billing (or Stripe directly)
- **DB**: Whatever your stack uses (Postgres, Supabase, Convex, Neon)
- **Cost at 1k customers**: $0/mo (free tier covers it)
- **Cost at 10k MAU**: ~$25-50/mo
- **Best for**: most indie SaaS through mid-market

### Pattern B: "Open-Source TypeScript"
- **Auth**: Better Auth
- **Billing**: Stripe directly
- **DB**: Postgres (Neon / Supabase)
- **Cost at 1k customers**: ~$0/mo (just DB)
- **Cost at 10k MAU**: ~$25-50/mo (DB scaling)
- **Best for**: teams that want zero auth-bill and full ownership

### Pattern C: "Supabase All-In"
- **Auth**: Supabase Auth
- **DB**: Supabase Postgres
- **Storage**: Supabase Storage
- **Cost at 1k customers**: free tier
- **Cost at 10k MAU**: ~$25-100/mo (Supabase Pro)
- **Best for**: teams that want one platform; don't need Clerk's UI polish

### Pattern D: "Enterprise-Ready"
- **Auth**: Clerk (or Better Auth)
- **Enterprise SSO**: Workos (when first enterprise customer needs it)
- **Billing**: Stripe directly
- **Cost at 100 enterprise customers**: $1.5k-3k/mo total auth + SSO
- **Best for**: SaaS that has both self-serve and enterprise tiers

---

## Honest tradeoffs

- **Clerk's lock-in is real but not crippling.** Migration is a 2-4 week project, not 2-4 months. Don't avoid Clerk to dodge lock-in; pick it if it's the right fit and migrate later if needed.
- **Better Auth is genuinely production-ready in 2026** — it was younger 18 months ago. Today it ships features at pace and has been used in real revenue-generating SaaS.
- **Supabase Auth is fine for 80% of cases but rough for the 20%.** Custom email templates, advanced multi-factor flows, complex multi-tenant setups — these are where Supabase Auth feels limited compared to Clerk.
- **Auth.js v5 is a meaningful improvement** — if you're on v3 / v4, the upgrade alone might be worth more than switching providers.
- **Workos pairs with another provider** — it's not a replacement, it's an enterprise-SSO add-on. Use it alongside Clerk or Better Auth for the enterprise tier specifically.
- **Auth0 is rarely the right new choice in 2026** — it's the right choice when procurement requires it. Otherwise, the developer-friendly alternatives won meaningfully on DX and cost.

## What none of these solve perfectly

- **Cross-product SSO at indie scale.** If you ship 3 products under one brand, sharing sessions across them requires custom work in any auth system.
- **Migration between providers.** All of them export users; none of them migrate hashed passwords (security limitation, not vendor limitation). Plan for forced password resets on migration.
- **Compliance at the smallest scale.** SOC 2 readiness depends on your whole infrastructure, not just auth. None of the providers magically make you SOC 2 compliant.
- **Anti-fraud and bot protection.** Auth providers do basic captcha + rate limiting; serious fraud (credential stuffing, account takeover at scale) needs additional layers (per [Vercel Firewall](/cloud-and-hosting/vercel-firewall) BotID).

## Cross-references on this site

- **Conceptual primer**: [Authentication](/auth-and-payments/authentication)
- **Specific provider deep-dives**: [Better Auth](/auth-and-payments/better-auth), [Supabase Auth](/auth-and-payments/supabase-auth), [Clerk Billing](/auth-and-payments/clerk-billing)
- **OAuth specifics**: [Login with Google](/auth-and-payments/login-with-google)
- **Modern auth methods**: [Passkeys](/auth-and-payments/passkeys)
- **Adjacent layers**: [Security](/auth-and-payments/security), [Vercel Firewall](/cloud-and-hosting/vercel-firewall)
- **Compliance posture**: [Data Trust playbook](https://www.vibeweek.ai/grow/data-trust-chat) for sub-processor management; auth provider goes on the list

## Further reading

- [Clerk](https://clerk.com)
- [Better Auth](https://www.better-auth.com)
- [Supabase Auth](https://supabase.com/auth)
- [Auth.js](https://authjs.dev)
- [Stack Auth](https://stack-auth.com)
- [Workos](https://workos.com)
- [Auth0](https://auth0.com)
