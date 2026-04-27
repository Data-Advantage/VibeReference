---
title: "Better Auth"
description: "Better Auth is the framework-agnostic, TypeScript-first auth library that took over maintenance of Auth.js / NextAuth in late 2025. Self-hosted, plugin-driven, and the strongest default for new Next.js apps in 2026."
---

# Better Auth

Better Auth is a framework-agnostic, TypeScript-first authentication and authorization library. It runs in Next.js, Nuxt, SvelteKit, Astro, Hono, and 20+ other frameworks, and ships features that traditionally required either a paid service (Clerk, Auth0, WorkOS) or a heavy assembly job: passkeys, 2FA, organizations and teams, magic links, OAuth across 40+ providers, SSO/SAML/SCIM for enterprise, plus a plugin architecture that lets you bolt on the rest.

The headline story for 2026: **Auth.js (formerly NextAuth.js) joined forces with Better Auth in late 2025.** The Better Auth team now maintains both projects. For new Next.js apps, the recommended starting point has shifted — Better Auth is the modern default, and Auth.js is in long-term-support mode for legacy users.

## When to Reach for Better Auth

- You're starting a new Next.js (or any TypeScript) app and want a code-first, self-hosted auth layer that doesn't lock you to a vendor.
- You want passkeys, 2FA, organizations, and SSO without integrating five different libraries.
- You're considering Clerk but balking at the per-MAU pricing or the requirement to use their hosted UI components.
- You're on Auth.js / NextAuth today and want a forward path that the same maintainers are actively building.
- You need a framework-agnostic auth layer because your stack spans Next.js + a separate API service.

## What's in the Box

Out of the box, no plugins required:

- **Email + password** with verification and reset flows
- **Social OAuth** for 40+ providers (Google, GitHub, Apple, Discord, Microsoft, X, plus regional providers like WeChat)
- **Sessions** with rotation, automatic CSRF, and immediate revocation
- **Rate limiting** on auth endpoints by default
- **Database migrations** auto-generated from your schema
- **Type-safe client** — every endpoint is typed end-to-end

That last point is the difference from a lot of older libraries. You get autocomplete from `useSession()` through to the database row, no manual type-juggling.

## Plugins (the real superpower)

Plugins extend Better Auth without forking. The official plugin set covers:

| Plugin | Adds |
|---|---|
| `passkey` | WebAuthn / passkey login with no separate service |
| `two-factor` | TOTP-based 2FA, backup codes, optional SMS |
| `organization` | Multi-tenant orgs, team membership, roles, invitations |
| `magic-link` | Email-link login (no password) |
| `username` | Username-based identity instead of email-as-id |
| `phone-number` | SMS-based auth |
| `oauth-proxy` | Run a single OAuth callback URL across many environments |
| `admin` | Admin dashboard primitives — list users, ban, impersonate |
| `api-key` | First-class API key management for your own users |
| `sso` | SAML and enterprise SSO |
| `oidc-provider` | Make your app an OIDC provider for other apps |

You import the plugin, add it to the config, and the new endpoints + types light up automatically. There's no separate install per surface (server, client, types).

## Next.js App Router Setup

Install:

```bash
npm install better-auth
npm install @better-auth/prisma-adapter   # or drizzle / kysely / mongo
```

Define the auth config in `lib/auth.ts`:

```ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

export const auth = betterAuth({
  database: prismaAdapter(new PrismaClient(), { provider: "postgresql" }),
  emailAndPassword: { enabled: true, requireEmailVerification: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
```

Mount the catch-all handler at `app/api/auth/[...all]/route.ts`:

```ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

Add a typed client in `lib/auth-client.ts`:

```ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
```

That's the entire integration — three files, no per-page wiring.

### Reading the session in a server component

```tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return <SignInPrompt />;
  return <Dashboard user={session.user} />;
}
```

Sessions are server-validated — no client trust, no hydration mismatch.

### Sign-up flow on the client

```tsx
"use client";
import { signUp } from "@/lib/auth-client";

await signUp.email({
  email: "user@example.com",
  password: "supersecret",
  name: "Jane",
});
```

The endpoint is fully typed, including the response shape. Email verification and rate limiting are on by default.

## Database Adapters

Better Auth ships first-party adapters for **Prisma, Drizzle, Kysely, MongoDB, and a memory adapter** for tests. The schema is defined in code; running `npx better-auth migrate` generates and applies the SQL or ORM migrations for you.

For a vibe-coding stack, **Drizzle on Postgres** is the most common combination — pairs well with Supabase, Neon, or Vercel Postgres-via-Marketplace.

## Better Auth vs the Alternatives

| | **Better Auth** | **Clerk** | **Auth.js (NextAuth)** | **Lucia** | **Supabase Auth** |
|---|---|---|---|---|---|
| Hosted | Self-hosted (free) | Hosted (paid per MAU) | Self-hosted | Self-hosted | Hosted (Supabase) |
| Plugins | Rich official set | Built-in features only | Smaller ecosystem | Bring-your-own | Built-in features only |
| 2FA / passkeys | Yes (plugins) | Yes (built-in) | Limited | Bring-your-own | Yes |
| Orgs / teams | Yes (plugin) | Yes (paid tier) | No | Bring-your-own | Limited |
| SSO / SAML | Yes (plugin) | Yes (Enterprise tier) | No | No | No |
| Lock-in | None | High | None | None | Medium (Supabase platform) |
| Best for | New apps wanting code-first auth | Teams that want hosted UIs | Existing Next.js apps | Power users wanting full control | Apps already on Supabase |

The honest summary: for **new Next.js apps in 2026**, Better Auth is the strongest default. It gives you the feature parity of Clerk without the per-MAU bill, and the maintenance posture of Auth.js without the legacy baggage.

## When NOT to Pick Better Auth

- You want a *no-code* auth experience with a hosted UI you don't have to style. Clerk wins there.
- You need **SOC 2 / HIPAA-compliant managed auth** out of the box. WorkOS or Auth0 win there.
- You're on Supabase already and don't have a feature gap. Stay on Supabase Auth — one less service to operate.
- You're maintaining a critical legacy Auth.js codebase and migration risk outweighs feature gains. Sit tight; Auth.js is in safe hands now.

## Common Gotchas

- **Trusted origins** — set `trustedOrigins` in your config to include all Vercel preview URLs (`*.vercel.app`) you actually use, or auth callbacks will fail in preview deploys.
- **Email verification** — enabling `requireEmailVerification` requires a working email sender (Resend / Loops / Postmark). Pick the sender before turning the flag on.
- **Session cookie domain** — for monorepos with separate front/back deploys, set the cookie domain explicitly. Default is host-only.
- **Plugin order matters** — some plugins extend the schema (organization, two-factor). Run `better-auth migrate` after adding any new plugin or your queries will fail.

## Production Checklist

- [ ] Schema migrated via `better-auth migrate` and committed
- [ ] Email + password with verification enabled, sender configured
- [ ] At least one social provider configured for low-friction signup
- [ ] Trusted origins list includes preview deploys
- [ ] Session rotation and CSRF defaults left on (don't disable)
- [ ] Rate-limit settings reviewed for your traffic shape
- [ ] If you ship a Pro tier: `organization` plugin in place from day one — retrofitting later is painful
- [ ] If your users handle anything sensitive: `passkey` and `two-factor` plugins enabled
- [ ] Middleware protecting `app/(auth)/*` routes via session check

## See Also

- [Authentication](/auth-and-payments/authentication) — the underlying concepts Better Auth implements
- [Clerk Billing](/auth-and-payments/clerk-billing) — the hosted alternative this replaces for many teams
- [Supabase Auth](/auth-and-payments/supabase-auth) — when staying on Supabase makes more sense
- [Passkeys](/auth-and-payments/passkeys) — what Better Auth's passkey plugin gives you
- [Polar](/auth-and-payments/polar) — billing layer that pairs naturally with Better Auth on indie SaaS stacks
- [Stripe](/auth-and-payments/stripe) — when you'd run Better Auth + Stripe instead of Clerk
