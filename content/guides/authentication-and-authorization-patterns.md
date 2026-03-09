---
title: "Authentication & Authorization Patterns"
---

# Authentication & Authorization Patterns

Implementing auth with Supabase, Clerk, and NextAuth — protecting routes, managing sessions, and role-based access control.

## Authentication vs Authorization

- **Authentication (AuthN)**: Verifying *who* the user is (login, signup, password reset)
- **Authorization (AuthZ)**: Determining *what* they can do (roles, permissions, access control)

You need both. Authentication without authorization means every logged-in user can do everything.

## Supabase Auth

Supabase Auth is built on GoTrue and integrates directly with your Supabase database.

### Setup with Next.js

Install the packages:
```bash
npm install @supabase/supabase-js @supabase/ssr
```

Create the Supabase clients:

**Server client** (`lib/supabase/server.ts`):
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

**Browser client** (`lib/supabase/client.ts`):
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Protecting Routes with Middleware

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*'],
}
```

### Email/Password Auth

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
  options: {
    data: { full_name: 'Jane Doe' }
  }
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password',
})

// Sign out
await supabase.auth.signOut()

// Get current user (server-side — always use getUser, not getSession)
const { data: { user } } = await supabase.auth.getUser()
```

### OAuth (Social Login)

```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
})
```

Create the callback route (`app/auth/callback/route.ts`):
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
```

## Clerk

Clerk provides pre-built UI components and handles the entire auth flow.

### Setup with Next.js

```bash
npm install @clerk/nextjs
```

Add middleware (`middleware.ts`):
```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

Use the pre-built components:
```tsx
import { SignIn, SignUp, UserButton } from '@clerk/nextjs'

// In your header
<UserButton afterSignOutUrl="/" />

// Sign in page
<SignIn />

// Sign up page
<SignUp />
```

## Role-Based Access Control (RBAC)

### Database-Level RBAC

Store roles in your database:

```sql
create table public.user_roles (
  user_id uuid references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'admin', 'super_admin')),
  primary key (user_id, role)
);
```

Check roles in RLS policies:

```sql
create policy "Admins can view all data"
  on public.bookmarks for select
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid() and role = 'admin'
    )
  );
```

### Application-Level RBAC

Create a utility function:

```typescript
// lib/auth.ts
import { createClient } from '@/lib/supabase/server'

export async function getUserRole() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  return data?.role ?? 'user'
}

export async function requireRole(role: string) {
  const userRole = await getUserRole()
  if (userRole !== role) {
    throw new Error('Unauthorized')
  }
}
```

Use in server components or API routes:

```typescript
// app/admin/page.tsx
import { requireRole } from '@/lib/auth'

export default async function AdminPage() {
  await requireRole('admin')
  // ... render admin page
}
```

## Security Checklist

- [ ] Use HTTPS everywhere (Vercel handles this)
- [ ] Store tokens in httpOnly cookies (not localStorage)
- [ ] Validate auth server-side (use `getUser()`, not `getSession()`)
- [ ] Enable RLS on all database tables
- [ ] Set up email verification for new accounts
- [ ] Implement rate limiting on auth endpoints
- [ ] Use strong password requirements
- [ ] Add CSRF protection for form submissions
- [ ] Log authentication events for monitoring
- [ ] Test that protected routes redirect unauthenticated users
