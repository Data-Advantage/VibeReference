# Supabase Auth

Supabase Auth is a complete authentication system built on top of Postgres — it stores users directly in your database, integrates natively with Row Level Security, and supports 50,000 monthly active users on the free tier.

## Why Vibe Coders Use It

- **Database-native** — users live in `auth.users` in your Postgres database, queryable with SQL and joinable to your tables
- **Row Level Security** — write `auth.uid() = user_id` policies that enforce access at the database layer, not in application code
- **Generous free tier** — 50,000 MAUs included free, enough to validate most products
- **Every auth method** — email/password, OAuth (Google, GitHub, Apple, etc.), magic links, phone OTP, anonymous sign-ins, SAML SSO
- **Self-hostable** — run the full stack locally with Docker Compose or deploy to your own infrastructure
- **Built for Next.js** — `@supabase/ssr` handles cookie-based sessions for App Router and Server Components

## Key Specs

| Dimension | Value |
|-----------|-------|
| Best for | Full-stack apps with Postgres, privacy-first products |
| Auth methods | Email/password, OAuth, magic link, phone OTP, SSO, anonymous |
| MFA support | TOTP (authenticator apps) |
| Free tier | 50,000 MAUs |
| Pro tier | $25/month — 100,000 MAUs included |
| Self-hosting | Full (Docker Compose, Kubernetes) |
| Session management | Cookie-based via `@supabase/ssr` |

## Getting Started with Next.js

### 1. Install Packages

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 2. Set Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Create a Server Client

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

### 4. Sign Up a User

```typescript
const supabase = await createClient();

const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securepassword',
});
```

### 5. Sign In with OAuth

```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    redirectTo: `${origin}/auth/callback`,
  },
});
```

### 6. Get the Current User (Server Component)

```typescript
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
```

## Row Level Security

The real power of Supabase Auth is RLS — access control enforced at the database layer.

```sql
-- Users can only read their own data
CREATE POLICY "Users read own data"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only update their own data
CREATE POLICY "Users update own data"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Anyone can read public profiles
CREATE POLICY "Public profiles are viewable"
  ON profiles FOR SELECT
  USING (is_public = true);
```

With RLS, your API routes don't need auth middleware — the database rejects unauthorized queries automatically. This eliminates an entire class of security bugs.

## When to Use Supabase Auth vs. Alternatives

**Use Supabase Auth** when you're already using Supabase for your database, want database-native security via RLS, or need a self-hostable auth solution with a generous free tier. Use **Clerk** when you want polished pre-built UI components and don't mind a managed service. Use **Auth.js** when you need framework-specific auth without a managed backend.

| Aspect | Supabase Auth | Clerk | Auth.js |
|--------|--------------|-------|---------|
| **Data storage** | Your Postgres DB | Managed service | App-managed |
| **RLS integration** | Native (`auth.uid()`) | Application layer | Manual |
| **Self-hosting** | Full (Docker/K8s) | No | Library only |
| **Pre-built UI** | Basic | Polished | None |
| **Free tier** | 50,000 MAUs | 10,000 MAUs | Open source |
| **Best for** | Full-stack Postgres apps | UI-heavy SaaS | Framework-specific auth |

## Auth Hooks

Customize authentication flows with serverless functions that run on auth events:

```sql
-- Example: auto-create a profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (NEW.id, NEW.email, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase SSR Package](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Row Level Security Guide](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [OAuth Provider Setup](https://supabase.com/docs/guides/auth/social-login)
- [Self-Hosting Supabase](https://supabase.com/docs/guides/self-hosting)
