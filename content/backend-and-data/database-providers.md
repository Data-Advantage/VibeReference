# Database Providers: Supabase, Neon, PlanetScale, Turso, Convex, Crunchy Bridge, Cloudflare D1

[⬅️ Backend & Data Overview](../backend-and-data/)

If you're building a SaaS in 2026 and trying to pick where your data lives, this is the consolidated decision guide. The OLTP database is a 5–10 year commitment. Pick wrong and you're either fighting your provider monthly or rewriting at year 2. Pick right and the database fades into the background.

## TL;DR Decision Matrix

| Provider | Engine | Strongest at | Pricing Floor | Indie Vibe | Best For |
|---|---|---|---|---|---|
| [Supabase](supabase.md) | Postgres | All-in-one (DB + auth + storage + realtime) | $0 / $25/mo Pro | Very high | Indie SaaS that wants one vendor for everything |
| Neon | Postgres | Serverless Postgres + branching | $0 / $19/mo | High | Postgres purists who want serverless economics |
| PlanetScale | MySQL (Vitess) | Massive scale + branching workflow | $39/mo+ | Medium | Teams expecting horizontal scale to billions of rows |
| Turso | SQLite (libSQL) | Edge replication + embedded replicas | $0 / $29/mo | High | Read-heavy globally distributed apps |
| Cloudflare D1 | SQLite | Workers-native, generous free tier | $0 / $5/mo | Medium | Cloudflare-stack apps |
| Crunchy Bridge | Postgres | Ops-grade Postgres without AWS pain | $50/mo+ | Low | Teams that want plain Postgres on a serious platform |
| Xata | Postgres | Postgres + branching + AI | $0 / $35/mo | Medium | Teams who like Postgres but want a richer toolset |
| [Convex](convex.md) | Custom (reactive) | TypeScript backend + real-time + sync | $0 / $25/mo | Very high | TypeScript-only apps with realtime needs |
| Firebase Firestore | Document NoSQL | Mobile, real-time listeners | Pay-as-you-go | Medium | Mobile apps and quick-prototype B2C |
| MongoDB Atlas | Document NoSQL | Document model, ecosystem | $9/mo+ | Medium | Document-shaped data, polyglot teams |
| Cloud SQL / RDS Postgres | Postgres | AWS/GCP-native Postgres | $25/mo+ | Low | Teams already deep in AWS or GCP |
| Render / Railway / Fly Postgres | Postgres | Bundled with PaaS | $0–$20/mo | High | "I just want a database with my hosting" |

The first decision is **engine**: Postgres, MySQL, SQLite, document, or reactive. The second is **operational model**: serverless, managed, or PaaS-bundled. The third is **scope**: pure database, or database-plus-platform (auth, storage, realtime).

## Decide the Engine First

### Postgres
The default. Open standard, mature, broad tooling. Used by 70%+ of new SaaS in 2026 according to most surveys. Strong fit for transactional data, relational integrity, JSON when needed, full-text search when needed, and pgvector for AI features.

Strengths:
- Best-in-class extension ecosystem (pgvector, postgis, timescale, pg_trgm)
- Open-source, no vendor lock-in at the engine level
- Excellent documentation and community
- Every framework supports it natively

Weaknesses:
- No native horizontal sharding without third-party tools (Citus, Vitess-for-Postgres)
- Schema migrations need care under load
- Vacuuming and autovacuum tuning is real ops work at scale

For most indie SaaS in 2026, **Postgres is the right answer** unless you have a specific reason to pick something else.

### MySQL
Less common in new indie SaaS but still strong. PlanetScale's Vitess-based platform is the best-in-class managed MySQL.

Pick MySQL when:
- You need horizontal sharding from day 1
- Your team is already deep in MySQL
- You have a specific tooling dependency (older WordPress, certain PHP frameworks)

Otherwise: pick Postgres.

### SQLite
SQLite has had a renaissance in 2025-2026 thanks to libSQL (Turso), Cloudflare D1, and embedded replication patterns.

Pick SQLite when:
- Read-heavy workload that benefits from edge replication (each region serves a local copy)
- You're building on Cloudflare Workers or a similar edge runtime
- Your data model is simple enough that the lack of richer Postgres features doesn't bite

Skip SQLite when:
- You have heavy write contention (SQLite serializes writes)
- You need JSON-aggressive workloads at scale
- You need pgvector or other advanced extensions

### Document NoSQL (Firestore, MongoDB)
Pick when your data shape is genuinely document-like (deeply nested, schema-flexible, often-mutating-shape). Most app data isn't actually document-shaped, even when founders think it is. Test the schema fit before committing.

Pick Firestore when:
- Mobile-first app where Firestore's real-time listeners reduce a lot of state-sync code
- Pre-launch prototype that needs to ship in 2 weeks
- Backed by Google Cloud anyway

Pick MongoDB when:
- Your data is genuinely heterogeneous documents
- You have a polyglot team that prefers MongoDB
- You want operational flexibility from MongoDB Atlas

For most SaaS: Postgres with JSON columns gives you 95% of document benefits without giving up relational integrity. Default to Postgres unless you have proof you need a document DB.

### Reactive Backend (Convex)
A different category entirely. [Convex](convex.md) gives you a TypeScript backend with reactive queries, real-time subscriptions, server functions, and a custom datastore — replacing both your database and your API layer. Strong fit for collaborative apps and TypeScript-only teams.

Pick Convex when:
- Your team is TypeScript-only
- Real-time collaborative features are core (multi-user editing, live dashboards, presence)
- You're willing to accept some platform lock-in for development velocity

Skip Convex when:
- You expect to need the broader Postgres ecosystem (extensions, mature ORMs, multi-language clients)
- You have a non-TypeScript service that needs database access
- Your team has strong Postgres expertise already

Convex is genuinely different. If your app is the right shape for it, the velocity is real.

## Provider Deep-Dives

### Supabase — The Indie All-in-One
[Supabase](supabase.md) is what most indie SaaS in 2026 default to. Hosted Postgres + auth + storage + realtime + edge functions, all under one bill.

Strengths:
- Hosted Postgres with full SQL access (no proprietary query language)
- [Supabase Auth](../auth-and-payments/supabase-auth.md) — production-grade, OAuth providers, MFA
- Supabase Storage — S3-compatible, RLS-aware
- Realtime subscriptions over websockets
- Edge functions (Deno) for serverless code
- Branching available on Pro+
- pgvector built-in for AI features
- Generous free tier ($0 with limits, $25/mo Pro)

Weaknesses:
- Connection pooling needed for serverless (PgBouncer, Supavisor)
- Cold starts on smaller projects
- Pricing scales steeply at high volume (500 GB storage gets expensive)

Default for: pretty much any indie SaaS shipping in 2026 unless you have a specific reason to split.

### Neon — Serverless Postgres
Neon split storage from compute and pioneered serverless Postgres with branching. Each branch is a copy-on-write fork of your main database — useful for preview environments, experimentation, and CI.

Strengths:
- True serverless: scales to zero when idle, scales out on demand
- Database branching — per-PR ephemeral databases
- Postgres-native, no proprietary query layer
- Deep Vercel integration (branches per Vercel preview deployment)
- Generous free tier

Weaknesses:
- Cold starts on scale-to-zero (hundreds of ms)
- No bundled auth/storage/realtime — pure database, you bring the rest
- Smaller ecosystem of bundled features than Supabase

Pick Neon when: you want pure Postgres, you value branching workflow, and you'll bring your own auth/storage layer.

### PlanetScale — MySQL at Scale
PlanetScale was the pioneer of "database branching" and the best-in-class managed MySQL via Vitess. Pricing went up materially in 2024 (eliminated free tier) but the platform remains best-in-class for serious scale.

Strengths:
- Branching workflow (deploy schema changes via PRs, with preview branches)
- Vitess-based — built for sharding to billions of rows
- Strong observability and query insights
- Serverless drivers for edge runtimes

Weaknesses:
- $39/mo floor (no free tier)
- MySQL-only — if you prefer Postgres, look elsewhere
- Some Postgres-typical patterns (foreign keys, complex CTEs) need adaptation
- Migration story off MySQL is non-trivial

Pick PlanetScale when: you have a MySQL-heritage team, you expect to need real horizontal scale, and you can afford the floor.

### Turso — SQLite at the Edge
Turso's libSQL (a SQLite fork) gives you SQLite-as-a-service with embedded replicas — your app can have a local read replica in every region while writes go to a primary. Read-heavy globally distributed apps benefit dramatically.

Strengths:
- Read latency near-zero in every region
- libSQL is open-source — no lock-in at the engine level
- Schema simple, queries simple
- Very generous free tier
- Branching available

Weaknesses:
- SQLite write semantics — single writer, serialized
- Smaller extension ecosystem than Postgres (no pgvector equivalent)
- Newer platform — less battle-tested than Postgres providers

Pick Turso when: read-heavy app, global users, simple schema, and willing to embrace SQLite's tradeoffs.

### Cloudflare D1 — SQLite on Workers
D1 is Cloudflare's SQLite-as-a-service, integrated with Workers. Generous free tier and deep integration with the Cloudflare stack.

Strengths:
- Deep Workers integration
- Generous free tier (5GB storage, 5M reads/day on free)
- Eventually-consistent global replication
- Familiar SQLite query model

Weaknesses:
- Smaller ecosystem than Turso for libSQL or Supabase for Postgres
- Cloudflare-stack lock-in — moving off requires rework
- Some quirks at edge replication boundaries

Pick D1 when: building on Cloudflare Workers and you're committed to that stack.

### Crunchy Bridge — Postgres for Ops
Crunchy Bridge is managed Postgres for teams that want a serious operational platform without the AWS RDS pain. Premium positioning, no free tier.

Strengths:
- Real Postgres, no proprietary layer
- Excellent backup, PITR, replication
- Run by Postgres core contributors
- Strong support
- Good fit for compliance-conscious teams

Weaknesses:
- $50/mo floor minimum
- Fewer bundled features than Supabase
- Less flashy/newer-school than Neon

Pick Crunchy Bridge when: you want plain Postgres on a serious platform, you can afford the floor, and you don't need bundled auth/storage.

### Xata — Postgres+ with AI Features
Xata pivoted in 2024 from a proprietary serverless DB to a Postgres-based platform with branching, schema management, full-text search, and built-in AI/vector features.

Strengths:
- Postgres underneath
- Built-in branching
- Built-in full-text search and vector search
- Generous free tier

Weaknesses:
- Smaller community than Supabase or Neon
- Some platform-specific patterns
- Pricing model evolving

Pick Xata when: you want richer tooling than Neon and the bundled search/vector features are useful.

### Convex — Reactive TypeScript Backend
[Convex](convex.md) replaces your database, API layer, and real-time sync with a single TypeScript-native platform. Reactive queries auto-update clients on data changes; server functions are TypeScript; transactions are first-class.

Strengths:
- Real-time queries built in
- TypeScript end-to-end, including database types
- Strong DX — `npx convex dev` is the development experience
- Integrated auth, storage, file uploads
- Schedules, cron, search, vector built-in
- Excellent for collaborative apps

Weaknesses:
- TypeScript-only — non-TypeScript services can't easily talk to your database
- Vendor lock-in — moving off requires significant rework
- Custom query model, not SQL — your team needs to learn it
- Smaller ecosystem than Postgres

Pick Convex when: TypeScript-only team, real-time collaborative app, and you'll trade lock-in for development velocity.

### Cloud SQL / Amazon RDS Postgres
The "enterprise default" — managed Postgres on GCP or AWS. No bells and whistles, just Postgres.

Pick when: you're already deep in GCP or AWS, your ops team is comfortable with cloud-provider tooling, and you don't want to introduce another vendor relationship. Skip when you're starting fresh and want a more developer-friendly experience.

### Render / Railway / Fly Postgres
Bundled Postgres with the PaaS hosting platform. Cheap, simple, "good enough" for early-stage. Less flexibility than dedicated database providers; pricing and performance are middle-of-the-pack.

Pick when: you're already on Render/Railway/Fly for hosting and you want one less vendor to manage. Migrate to a dedicated provider when scale demands it.

## What None of Them Solve

- **Your schema design.** No provider rescues a bad data model. Spend time on the schema upfront; it's the most consequential decision.
- **The migration story.** Migrating between providers is non-trivial even when both are Postgres. Plan to never migrate, or budget weeks if you must.
- **Connection pooling.** Serverless functions hammer connections. Most Postgres providers expect you to use PgBouncer or the provider's pooler. Misconfigure this and you'll see "too many connections" in production.
- **Backup discipline.** Every provider does backups. Few founders verify they can restore. Run a restore test in the first month of using any provider.
- **Query performance.** Slow queries are your fault, not the provider's. Use EXPLAIN ANALYZE; understand the query plan; index appropriately.
- **Data residency / compliance.** GDPR / SOC 2 / HIPAA / data-residency requirements are mostly your job to design for. Providers offer tooling, not solutions.

## Pragmatic Stack Patterns

**Indie SaaS, pre-revenue → first 1,000 customers:**
- Supabase ($0 → $25/mo Pro) — DB + auth + storage + realtime
- That's it. Total: $0–$25/mo. Don't add complexity.

**Indie SaaS, $1K–$50K MRR, Postgres-native:**
- Supabase Pro ($25/mo) for the bundle, OR
- Neon ($19/mo) + [Clerk or Better Auth](../auth-and-payments/auth-providers.md) + [Vercel Blob](../cloud-and-hosting/vercel-blob.md) — if you want pure Postgres without the all-in-one
- Add [observability](../devops-and-tools/observability-providers.md) — Sentry + Better Stack
- Total: $50–100/mo

**TypeScript-only collaborative app:**
- [Convex](convex.md) ($25/mo Pro)
- [Clerk](../auth-and-payments/clerk-billing.md) for auth (or Convex Auth if simple)
- Skip separate file storage — Convex handles it
- Total: $25–50/mo

**Edge / globally distributed read-heavy app:**
- Turso ($29/mo Pro) for database
- Cloudflare Workers or Vercel Functions for compute
- Pair with R2 / Vercel Blob for assets

**SaaS approaching billion-row scale:**
- PlanetScale or Vitess on Postgres-Citus, OR
- Crunchy Bridge with read replicas + careful schema partitioning
- Budget engineering time for sharding strategy

**Multi-region SaaS with strict data residency:**
- Cloud SQL (multi-region replicas) or Crunchy Bridge (multi-region)
- Don't pick "eventually consistent global SQLite" if your customers care about consistency

## Decision Framework: Three Questions

1. **What engine?** → Postgres unless you have a specific reason. SQLite for read-heavy edge apps. MySQL only if existing team expertise. Document DB only if data is genuinely document-shaped. Convex if TypeScript-only collaborative.
2. **What scale do you actually expect in year 1?** → Less than 100 GB and 1K QPS for almost everyone. Pick the simpler, cheaper option for that scale. Re-evaluate at $1M ARR.
3. **Bundle or build-it-yourself?** → Bundle (Supabase / Convex) for indie velocity. Build-it-yourself (Neon + auth provider + storage provider) when you want each layer to be best-in-class.

Three questions, three decisions. The 90% answer for indie SaaS in 2026 is **Supabase** (Postgres bundle) or **Convex** (TypeScript reactive). Spending more than a day deciding the database is a sign you're avoiding the harder schema-design work.

## Verdict

For most readers building a SaaS in 2026:
- **Generic Postgres SaaS, all-in-one**: [Supabase](supabase.md). Default.
- **Pure Postgres, branching, serverless economics**: Neon.
- **TypeScript-only collaborative app**: [Convex](convex.md).
- **Read-heavy globally distributed app**: Turso.
- **Already on Cloudflare stack**: D1.
- **Premium operational Postgres**: Crunchy Bridge.
- **Massive horizontal scale ahead**: PlanetScale.
- **Mobile B2C with real-time**: Firebase Firestore.
- **Heavy AWS / GCP commitment**: Cloud SQL / RDS.

Most importantly: **stop comparing and start shipping.** The database choice for your first 1,000 customers won't be the one for your first 100,000. The cost of switching at scale is high but rare; the cost of analysis paralysis at week 1 is shipping delay you can't recover. Pick the obvious default for your shape, ship, and revisit at the next plateau.

## See Also

- [Supabase](supabase.md) — deep-dive on the all-in-one default
- [Supabase vs Convex](supabase-vs-convex.md) — the most-asked head-to-head
- [Convex](convex.md) — TypeScript reactive backend deep-dive
- [Postgres](postgres.md) — engine-level reference
- [SQL](sql.md) — query reference
- [Drizzle vs Prisma](drizzle-vs-prisma.md) — ORM choice on top of any Postgres provider
- [Vector Database Providers](vector-database-providers.md) — companion comparison for AI workloads
- [Auth Providers](../auth-and-payments/auth-providers.md) — pair with Neon/Crunchy/PlanetScale when not bundling
- [Email Providers](email-providers.md) — companion for the transactional layer

---

[⬅️ Backend & Data Overview](../backend-and-data/)
