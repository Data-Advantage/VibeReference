# Database Migration Tools: Drizzle Kit, Prisma Migrate, Atlas, Sqitch, Flyway, Liquibase, Knex, golang-migrate

[⬅️ Backend & Data Overview](../backend-and-data/)

If you're building a SaaS in 2026 and your schema needs to evolve safely, this is the consolidated comparison. Migrations are the line item founders skip until they've been hand-editing schemas for six months and can't reliably reproduce production state in dev. Most indie SaaS over-rely on raw SQL files in a folder (works until you have multiple developers, environments, or rollback needs), then panic-switch to Prisma at the worst moment.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Drizzle Kit | TypeScript ORM migrations | Free OSS | $0 | Very high | Modern TypeScript stack in 2026 |
| Prisma Migrate | TypeScript ORM migrations | Free OSS | Optional Prisma Data Platform | High | Prisma-heavy teams |
| Atlas | Schema-first multi-DB | Free OSS | $20/mo (cloud) | Very high | Multi-DB / language-agnostic |
| Sqitch | SQL-first migrations | Free OSS | $0 | High | DBA-friendly; complex DBs |
| Flyway | Java-origin migrations | Community OSS | $20/dev/mo Teams | Medium | Java / enterprise |
| Liquibase | XML/YAML/SQL migrations | OSS Community | $25/mo Pro | Medium | Enterprise; multi-DB |
| Knex | Node.js query-builder + migrations | Free OSS | $0 | Medium | Node teams without Prisma/Drizzle |
| golang-migrate | Go-native migrations | Free OSS | $0 | High | Go projects |
| Alembic | Python (SQLAlchemy) | Free OSS | $0 | High | Python teams |
| Rails / Django / Laravel built-in | Framework-bundled | Free | $0 | Very high | Already on those frameworks |
| Supabase Migrations | Bundled with Supabase | Bundled | Bundled | Very high | Supabase users |
| dbt | Analytics SQL transformations | Free OSS | $50/mo+ Cloud | High | Data warehouse / analytics (different) |
| Manual SQL files | DIY | Free | $0 | Low | Skip — you''ll regret it |

The first decision is **what shape of migration problem you have**. ORM-tied migrations (Drizzle Kit / Prisma Migrate / Knex / Alembic), schema-first language-agnostic (Atlas / Sqitch / Flyway / Liquibase), framework-bundled (Rails / Django / Laravel), and analytics warehouse migrations (dbt) are four different problems with overlapping tools.

## Decide What You Need First

Tools are not interchangeable. Pick by stack + complexity.

### TypeScript / Node ORM stack (the 50% case for indie SaaS)
Your backend is Node.js / TypeScript. You use an ORM for queries.

Right tools:
- **Drizzle Kit** — modern default for Drizzle users
- **Prisma Migrate** — Prisma users
- **Knex Migrations** — Knex users
- **TypeORM Migrations** — TypeORM users

### Schema-first / language-agnostic (the 25% case)
You want migrations independent of any ORM. Multi-language stack OR DBA-friendly workflow.

Right tools:
- **Atlas** — modern, declarative
- **Sqitch** — declarative; mature
- **Flyway** — imperative; most mature
- **Liquibase** — XML/YAML config

### Framework-bundled (the 15% case)
You''re on Rails / Django / Laravel. Migrations are part of the framework.

Right tools:
- **Rails ActiveRecord migrations** (Ruby)
- **Django migrations** (Python)
- **Laravel migrations** (PHP)

### Warehouse / analytics (the 10% case)
Your "migrations" are analytics transformations on a warehouse.

Right tools:
- **dbt** — modern default for warehouse SQL
- **SQLMesh** — alternative

(Different problem — covered briefly here for completeness.)

For most indie SaaS in 2026: **Drizzle Kit if Drizzle; Prisma Migrate if Prisma; Atlas if multi-language**. Skip Liquibase / Flyway until enterprise compliance forces it.

## Provider Deep-Dives

### Drizzle Kit — Modern TypeScript Default
Drizzle Kit is the migration tool for Drizzle ORM. Uses TypeScript schema definitions; generates SQL.

Strengths:
- Type-safe schema in TypeScript
- Generated SQL is readable
- `drizzle-kit push` for dev (fast iteration)
- `drizzle-kit generate` + `migrate` for production
- Free / OSS
- Works with Postgres, MySQL, SQLite

Weaknesses:
- Drizzle ORM lock-in (somewhat)
- Schema reflection limited

Pick when: TypeScript / Node stack; using Drizzle ORM (per [drizzle-vs-prisma](drizzle-vs-prisma.md)).

### Prisma Migrate — Prisma Default
Prisma Migrate is Prisma''s migration tool. `schema.prisma` source of truth; generates migrations.

Strengths:
- Bundled with Prisma
- Schema-first workflow
- `prisma migrate dev` for development
- `prisma migrate deploy` for production
- Free / OSS

Weaknesses:
- Prisma lock-in
- Some advanced Postgres features unsupported in schema
- Migration SQL sometimes opaque

Pick when: TypeScript / Node stack; using Prisma.

### Atlas — Schema-First Multi-DB
Atlas (by Ariga) is modern declarative schema management. Define desired state; Atlas computes migration.

Strengths:
- ORM-agnostic
- Multi-DB (Postgres, MySQL, SQLite, MariaDB, ClickHouse, more)
- Declarative HCL or schema reflection
- Atlas Cloud for collaboration ($20/mo)
- Strong CI integration
- Modern DX

Weaknesses:
- Newer; smaller community than Flyway
- HCL learning curve

Pick when: multi-language stack OR declarative workflow OR multi-DB.

### Sqitch — DBA-Friendly Declarative
Sqitch is mature declarative migration tool. Pure SQL files; depends on `register` + `verify` + `revert`.

Strengths:
- Pure SQL (no DSL)
- Multi-DB
- Strong dependency tracking
- Mature; battle-tested

Weaknesses:
- Steep learning curve
- DBA-flavored

Pick when: complex enterprise DB; DBA team prefers; legacy migration culture.

### Flyway — Java-Origin; Industry-Standard
Flyway has been the enterprise migration default for years. Imperative; numbered SQL files.

Strengths:
- Mature; battle-tested
- Multi-DB
- Strong enterprise support
- Java-friendly but works for any stack

Weaknesses:
- Imperative (less safe than declarative)
- Java-flavored (some quirks for non-Java)
- Pricing climbs at enterprise

Pick when: Java stack; enterprise migration policy.

### Liquibase — XML / YAML / SQL
Liquibase uses changelog files (XML / YAML / SQL) to define migrations.

Strengths:
- Multi-DB
- Strong enterprise features (rollback, contexts)
- Liquibase Pro for advanced

Weaknesses:
- Verbose XML / YAML
- Heavy product surface

Pick when: enterprise; multi-DB; existing Liquibase culture.

### Knex Migrations — Node Query-Builder
Knex.js is a Node.js query-builder. Includes migration support.

Strengths:
- Lightweight
- Free
- JavaScript / TypeScript

Weaknesses:
- Older feel than Drizzle / Prisma
- Less feature-rich

Pick when: Knex for queries; want bundled migrations.

### golang-migrate — Go Standard
The de-facto migration tool in Go ecosystem.

Strengths:
- Idiomatic Go
- Multi-DB
- Free / OSS

Weaknesses:
- Go-only
- Less feature-rich than newer tools

Pick when: Go backend.

### Alembic — Python / SQLAlchemy
Alembic is SQLAlchemy''s migration tool.

Strengths:
- SQLAlchemy native
- Mature
- Powerful (autogenerate from models)

Weaknesses:
- Python-only

Pick when: Python / SQLAlchemy stack.

### Framework-Bundled Migrations
- **Rails** ActiveRecord migrations (Ruby)
- **Django** migrations (Python)
- **Laravel** migrations (PHP)

Strengths:
- Bundled with framework
- Extensive documentation / community
- Mature

Weaknesses:
- Framework lock-in

Pick when: already on Rails / Django / Laravel.

### Supabase Migrations — Bundled
Supabase CLI provides migration commands.

Strengths:
- Bundled with Supabase (per [supabase-migrations](supabase-migrations.md))
- Plays well with Supabase Studio
- Local dev workflow

Weaknesses:
- Supabase-flavored

Pick when: on Supabase.

### dbt — Different Problem (Warehouse Transformations)
dbt is for transforming data IN your warehouse, not schema migrations on OLTP DB.

Strengths:
- Industry standard for analytics
- Models, tests, docs in one tool
- Free OSS / dbt Cloud paid

Weaknesses:
- Not OLTP migration tool
- Different mental model

Pick when: data warehouse / analytics SQL transformations (per [data-warehouse-providers](data-warehouse-providers.md)).

### Manual SQL files — Don''t
Pure folder of `001_users.sql` files; no tracking; no rollback; no validation.

Pick when: never (after MVP).

## What Migration Tools Won''t Do

- **Make migrations safe.** Tool runs SQL; bad SQL is still bad SQL. Per [VibeWeek database-migrations-chat](https://www.vibeweek.com/6-grow/database-migrations-chat).
- **Prevent data loss.** A `DROP COLUMN` deletes data; tool just runs it.
- **Replace testing.** Test migrations on prod-like data before applying.
- **Be free at all scales.** OSS tools free; cloud / enterprise tiers cost.
- **Make rollback safe.** "Down" migrations rarely fully reversible (data lost in DOWN).
- **Replace careful DBA review.** Schema changes affect every customer; review.

## Pragmatic Stack Patterns

**TypeScript / Node SaaS (2026 default)**:
- Drizzle ORM + Drizzle Kit
- Total: $0

**TypeScript / Node, Prisma-heavy**:
- Prisma + Prisma Migrate
- Total: $0

**Python SaaS**:
- SQLAlchemy + Alembic
- Total: $0

**Go SaaS**:
- Custom or sqlc + golang-migrate
- Total: $0

**Multi-language / multi-DB**:
- Atlas
- Total: $0-20/mo

**Already on Rails / Django / Laravel**:
- Framework-bundled
- Total: $0

**Supabase**:
- Supabase CLI migrations
- Total: bundled

**Enterprise / regulated**:
- Flyway or Liquibase
- Total: $20-50/mo

**Warehouse / analytics**:
- dbt (different problem)
- Total: $0-50/mo+

## Decision Framework: Three Questions

1. **What''s your stack?** → TypeScript: Drizzle Kit / Prisma Migrate. Python: Alembic. Go: golang-migrate. Multi-language: Atlas.
2. **How complex is your migration discipline?** → Simple: ORM-bundled. Complex: Atlas / Flyway.
3. **Are you on a managed DB platform?** → Supabase: bundled CLI. Otherwise: stack-appropriate.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **Drizzle Kit if you''re on Drizzle; Prisma Migrate if you''re on Prisma; Atlas for multi-language stacks**. Skip Flyway / Liquibase until enterprise.

## Verdict

For most readers building a SaaS in 2026:
- **Default for TypeScript / Drizzle**: Drizzle Kit.
- **Default for TypeScript / Prisma**: Prisma Migrate.
- **Multi-language / declarative**: Atlas.
- **Python**: Alembic.
- **Go**: golang-migrate.
- **Java / enterprise**: Flyway or Liquibase.
- **Supabase**: bundled CLI.
- **Rails / Django / Laravel**: framework-bundled.
- **Warehouse / analytics**: dbt.

The hidden cost in migration tools isn''t the seat fee — it''s **migration discipline (or lack of).** Tools provide tracking; they don''t prevent foot-guns. Per [database-migrations-chat](https://www.vibeweek.com/6-grow/database-migrations-chat): the discipline of forward-compatible deploys; CONCURRENTLY for index creation (per [database-indexing-strategy-chat](https://www.vibeweek.com/6-grow/database-indexing-strategy-chat)); reversible operations; pre-deploy testing — matters more than the tool. A team with great discipline + manual SQL outperforms a team with Flyway + reckless migrations.

## See Also

- [SQL Migration](sql-migration.md) — concept overview
- [Supabase Migrations](supabase-migrations.md) — Supabase-specific
- [Drizzle vs Prisma](drizzle-vs-prisma.md) — ORM comparison
- [Postgres](postgres.md) — Postgres specifics
- [Database Providers](database-providers.md) — DB choice
- [SQL](sql.md) — SQL fundamentals
- [Supabase](supabase.md) — Supabase ecosystem
- [Convex](convex.md) — alternative model
- [Data Warehouse Providers](data-warehouse-providers.md) — dbt context
- [VibeWeek: Database Migrations](https://www.vibeweek.com/6-grow/database-migrations-chat) — implementation discipline
- [VibeWeek: Database Indexing Strategy](https://www.vibeweek.com/6-grow/database-indexing-strategy-chat) — CREATE INDEX CONCURRENTLY
- [VibeWeek: Database Sharding & Partitioning](https://www.vibeweek.com/6-grow/database-sharding-partitioning-chat) — adjacent
- [VibeWeek: Database Connection Pooling](https://www.vibeweek.com/6-grow/database-connection-pooling-chat) — DATABASE_URL vs DIRECT_URL for migrations
- [VibeWeek: Soft Delete vs Hard Delete](https://www.vibeweek.com/6-grow/soft-delete-vs-hard-delete-chat) — adjacent

---

[⬅️ Backend & Data Overview](../backend-and-data/)
