---
title: "Database Design for SaaS"
---

# Database Design for SaaS

Schema patterns, Supabase/Postgres setup, Row Level Security, migrations, and common SaaS data models.

## SaaS Database Fundamentals

Every SaaS app needs a few core concepts in its database:
- **Users** — Who is using the app
- **Organizations/Teams** — Groups of users (if multi-tenant)
- **Subscriptions** — What plan they're on
- **Core entities** — The domain-specific data your app manages

## Common Schema Patterns

### User Profiles
Supabase Auth manages authentication, but you'll want a profiles table for app-specific user data:

```sql
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
```

Auto-create profiles when users sign up with a trigger:

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

### Multi-Tenant Organizations

```sql
create table public.organizations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  created_at timestamptz default now() not null
);

create table public.organization_members (
  organization_id uuid references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz default now() not null,
  primary key (organization_id, user_id)
);
```

### Subscriptions (Stripe Integration)

```sql
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text not null default 'free' check (plan in ('free', 'pro', 'enterprise')),
  status text not null default 'active' check (status in ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
```

## Row Level Security (RLS)

RLS is Postgres's built-in access control. With Supabase, it ensures users can only access their own data — even if your client-side code has bugs.

### Enable RLS on every table

```sql
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
```

### Common RLS Policies

**Users can read/update their own profile:**
```sql
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
```

**Organization members can access org data:**
```sql
create policy "Org members can view organization"
  on public.organizations for select
  using (
    id in (
      select organization_id from public.organization_members
      where user_id = auth.uid()
    )
  );
```

**Users can only see their own data:**
```sql
create policy "Users can view own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can create bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);
```

### RLS Best Practices
- **Always enable RLS** on public tables — no exceptions
- **Test policies** by querying as different users in the Supabase SQL editor
- **Use `security definer` functions** for operations that need elevated access (like the new user trigger above)
- **Keep policies simple** — complex policies hurt query performance

## Migrations

### Writing migration files
Store migrations as numbered SQL files:

```
supabase/migrations/
  001_create_profiles.sql
  002_create_organizations.sql
  003_create_subscriptions.sql
  004_add_bookmarks.sql
```

### Migration best practices
1. **One concern per migration** — Don't mix schema changes with data changes
2. **Always add, never drop (in production)** — Add new columns as nullable, backfill, then add constraints
3. **Test locally first** — Use `supabase db reset` to test your migration chain
4. **Include rollback comments** — Note what to run to undo each migration

### Using Supabase CLI

```bash
# Create a new migration
supabase migration new create_bookmarks

# Apply migrations locally
supabase db reset

# Push to remote
supabase db push
```

## Indexing Strategy

Add indexes for columns you frequently query or filter by:

```sql
-- Index for looking up bookmarks by user
create index idx_bookmarks_user_id on public.bookmarks(user_id);

-- Index for searching by tag
create index idx_bookmarks_tags on public.bookmarks using gin(tags);

-- Composite index for common query patterns
create index idx_bookmarks_user_created
  on public.bookmarks(user_id, created_at desc);
```

**When to add indexes:**
- Columns in WHERE clauses
- Columns used in JOIN conditions
- Columns used in ORDER BY
- Foreign key columns

**When NOT to add indexes:**
- Tables with very few rows
- Columns that are rarely queried
- Columns with very low cardinality (like boolean flags)

## Soft Deletes vs Hard Deletes

For SaaS apps, consider soft deletes for important data:

```sql
-- Add soft delete column
alter table public.bookmarks add column deleted_at timestamptz;

-- Update RLS to exclude deleted rows
create policy "Users can view own active bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id and deleted_at is null);
```

Use hard deletes for: temporary data, logs, session data.
Use soft deletes for: user content, subscriptions, anything with audit requirements.

## Performance Tips

1. **Use `select` wisely** — Only fetch columns you need: `supabase.from('bookmarks').select('id, title, url')` instead of `select('*')`
2. **Paginate everything** — Never fetch unbounded lists: `.range(0, 19)` for the first 20 rows
3. **Use database functions for complex operations** — Move business logic to Postgres functions to reduce round trips
4. **Monitor with Supabase Dashboard** — Check the "Database" > "Query Performance" section for slow queries
5. **Add connection pooling** — Use Supabase's built-in pgbouncer for production apps
