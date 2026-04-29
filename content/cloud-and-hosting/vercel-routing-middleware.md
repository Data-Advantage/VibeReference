# Vercel Routing Middleware

Vercel Routing Middleware is the platform-level request interception layer. It runs before your CDN cache on every matched request, supports geo-personalization, A/B testing, header injection, lightweight auth checks, and rewrites — and it works with any framework deployed to Vercel, not just Next.js.

If you have ever shipped a `middleware.ts` file at the root of a Next.js project, you have used Routing Middleware. The name is new (it used to be lumped under "Next.js middleware"), and the product has been pulled out as a framework-agnostic Vercel platform feature. The shape, the mental model, and the rules around it changed in late 2025 — most of what is in your training data about Next.js middleware is now out of date.

## What it is

Routing Middleware sits between the public internet and your application. It runs on Vercel's network edge, before the CDN cache, on every request that matches its config. It is built on Fluid Compute, supports Edge / Node.js / Bun runtimes, and exposes a small helper library for the common interception tasks.

Three jobs it does well:

- **Personalize cached content.** Run before the cache, branch the user toward a region-specific page, an A/B variant, or a feature-flagged route — without bypassing caching for everyone.
- **Inject and inspect.** Add headers (CSP, CORS, custom telemetry), check for the presence of an auth cookie, redirect on missing requirements, log to analytics with `waitUntil`.
- **Rewrite at the platform level.** Transparently serve content from a different URL — useful for API proxies, gradual migrations, or `/blog/*` pointing at a separate service.

## The middleware disambiguation problem

There are three "middleware" concepts in the Vercel ecosystem and they are not the same thing:

| Concept | File | Runtime | Scope |
|---------|------|---------|-------|
| **Vercel Routing Middleware** | `middleware.ts` (root) | Edge / Node.js / Bun | Any framework, platform-level |
| **Next.js 16 Proxy** | `proxy.ts` (root or `src/`) | Node.js only | Next.js 16+ only |
| **Edge Functions** | Any function file | V8 isolates | Standalone edge endpoints |

The two relevant changes since most LLM training data:

- **Next.js 16 renamed `middleware.ts` to `proxy.ts`** to clarify that it sits at the network boundary, not as general-purpose middleware. The exported function must also be renamed from `middleware` to `proxy`. Codemod available: `npx @next/codemod@latest middleware-to-proxy`. Next.js 16 still accepts `middleware.ts` but warns it is deprecated.
- **The rename was partly motivated by [CVE-2025-29927](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2025-29927)** — a middleware auth-bypass via the `x-middleware-subrequest` header. Treating middleware as the *only* auth layer was always fragile; the rename and the hardening since make this explicit.

If you are on Next.js 15 or earlier, you still use `middleware.ts` and Vercel Routing Middleware is the platform layer underneath. If you are on Next.js 16, you use `proxy.ts` for the Next.js-specific Node-only flavor *or* `middleware.ts` for the platform-level Routing Middleware that runs across frameworks.

## Basic example

```ts
// middleware.ts (project root)
import { geolocation, rewrite } from "@vercel/functions";

export default function middleware(request: Request) {
  const { country } = geolocation(request);
  const url = new URL(request.url);
  url.pathname = country === "US"
    ? "/us" + url.pathname
    : "/intl" + url.pathname;
  return rewrite(url);
}

export const config = {
  runtime: "edge", // 'edge' (default) | 'nodejs'
};
```

The function name does not matter — Vercel only requires a default export. `runtime` defaults to `edge` for backwards compatibility, but `nodejs` is now widely available and gives you the full Node.js API surface (per the [Vercel Functions](/cloud-and-hosting/vercel-functions) reference, Edge is no longer the recommended default for most workloads).

## Helper library

For non-Next.js frameworks, import from `@vercel/functions`:

| Helper | Purpose |
|--------|---------|
| `next()` | Continue the middleware chain, optionally modify request/response headers |
| `rewrite(url)` | Transparently serve content from a different URL |
| `geolocation(request)` | Returns `city`, `country`, `latitude`, `longitude`, `region` |
| `ipAddress(request)` | Client IP address |
| `waitUntil(promise)` | Keep work running after the response is sent |

For Next.js, the equivalents are on `NextResponse` (`next()`, `rewrite()`, `redirect()`) and `NextRequest` (`request.geo`, `request.ip`).

## Matcher configuration

Without a `matcher`, middleware runs on every route — including static assets, which wastes compute and delays first paint. Always scope it:

```ts
// Single path
export const config = { matcher: "/dashboard/:path*" };

// Multiple paths
export const config = { matcher: ["/dashboard/:path*", "/api/:path*"] };

// Regex: exclude static files and the like
export const config = {
  matcher: ["/((?!_next/static|favicon.ico).*)"],
};
```

Unmatched paths skip middleware invocation entirely. The cost difference between "runs on every request" and "runs only on /dashboard" is real money at scale.

## Common patterns

### IP-based header injection

```ts
import { ipAddress, next } from "@vercel/functions";

export default function middleware(request: Request) {
  return next({
    headers: { "x-real-ip": ipAddress(request) || "unknown" },
  });
}
```

### A/B testing via Edge Config

```ts
import { get } from "@vercel/edge-config";
import { rewrite } from "@vercel/functions";

export default async function middleware(request: Request) {
  const variant = await get("experiment-homepage"); // sub-millisecond read
  const url = new URL(request.url);
  url.pathname = variant === "B" ? "/home-b" : "/home-a";
  return rewrite(url);
}
```

Edge Config reads are explicitly designed for this — they are kept in a memory-resident store across the edge network, so a middleware that reads a flag adds essentially no latency.

### Background processing with `waitUntil`

```ts
import type { RequestContext } from "@vercel/functions";

export default function middleware(request: Request, context: RequestContext) {
  context.waitUntil(
    fetch("https://analytics.example.com/log", {
      method: "POST",
      body: request.url,
    }),
  );
  return new Response("OK");
}
```

The response goes out immediately; the analytics call continues in the background. This is the same `waitUntil` primitive you would reach for in a regular Vercel Function.

### Lightweight auth check

```ts
import { rewrite, next } from "@vercel/functions";

export default function middleware(request: Request) {
  const session = request.headers.get("cookie")?.includes("session=");
  if (!session && new URL(request.url).pathname.startsWith("/dashboard")) {
    return Response.redirect(new URL("/login", request.url), 302);
  }
  return next();
}
```

**Critical caveat**: middleware-only auth is *not* sufficient as the sole protection layer. Use it as defense-in-depth — your real auth gate should still live in the Layout, Server Component, or Route Handler that does the data fetch. CVE-2025-29927 is a reminder that any path-based auth check at the edge can be bypassed; the actual data must be gated where it is loaded.

## Request limits

| Limit | Value |
|-------|-------|
| Max URL length | 14 KB |
| Max request body | 4 MB |
| Max request headers | 64 headers / 16 KB total |

These are enforced before middleware runs — a request that exceeds them fails with a 4xx without your code seeing it.

## Three CDN routing mechanisms

Routing Middleware is one of three mechanisms Vercel's CDN evaluates for every request, in order:

| Order | Mechanism | Scope | Deploy Required |
|-------|-----------|-------|-----------------|
| 1 | **Bulk Redirects** | Up to 1M static path-to-path redirects | No (runtime via Dashboard / API / CLI) |
| 2 | **Project-Level Routes** | Headers, rewrites, redirects | No (instant publish) |
| 3 | **Deployment Config Routes** | Full routing rules in `vercel.json` / `vercel.ts` | Yes (deploy) |

**Project-Level Routes** (added March 2026) are the right choice for changes that should not require a full redeploy — adding a CORS header, rewriting `/api/*` to a different backend, flipping an A/B test. They are managed through:

- The **dashboard** (Project → CDN → Routing) — has a live map of global traffic and a route editor.
- The **REST API** — eight dedicated endpoints for CRUD on project routes.
- The **Vercel CLI** via `vercel.ts` and `@vercel/config` (`compile`, `validate`, `generate`).
- The **Vercel SDK** — `@vercel/config` helpers like `routes.redirect()`, `routes.rewrite()`, `routes.header()`, with `has` / `missing` conditions and request transforms.

**Bulk Redirects** are for true bulk operations — migrating thousands of legacy URLs after a site rebuild. Up to one million per project, edited in CSV.

For everything that needs request-level logic (geolocation, cookies, user state), use Routing Middleware. The static mechanisms are faster and cheaper, but they cannot read the request — they only match the URL.

## `vercel.ts` programmatic configuration

`vercel.ts` (or `.js`, `.mjs`, `.cjs`, `.mts`) replaces static `vercel.json` for projects that want type-safe, dynamic routing configuration:

```ts
// vercel.ts
import { defineConfig } from "@vercel/config";

export default defineConfig({
  rewrites: [
    { source: "/api/:path*", destination: "https://backend.example.com/:path*" },
  ],
  headers: [
    {
      source: "/(.*)",
      headers: [{ key: "X-Frame-Options", value: "DENY" }],
    },
  ],
});
```

Three CLI commands:

- `npx @vercel/config compile` — compile to JSON, write to stdout
- `npx @vercel/config validate` — validate and show a config summary
- `npx @vercel/config generate` — generate `vercel.json` locally for development tooling

Constraint: only one config file per project. `vercel.json` *or* `vercel.ts`, not both.

## Bun runtime

To run Routing Middleware on Bun (currently public beta), add `bunVersion` to your config and set the runtime to `nodejs`:

```json
{
  "bunVersion": "1.x"
}
```

```ts
export const config = { runtime: "nodejs" };
```

Bun reduces average latency by roughly 28% on CPU-bound workloads. The trade-off is the broader compatibility surface — Bun is mature but not yet 100% compatible with every Node module. Verify your dependencies before flipping the switch in production.

## When to reach for it

- Geo-personalising static pages (runs before the cache, so you keep cache benefits)
- A/B testing rewrites driven by Edge Config flags
- Custom redirects based on cookies, headers, or other request state
- Injecting CSP, CORS, or custom telemetry headers
- Lightweight auth gates as defense-in-depth (not the sole auth layer)
- Project-level routes for header / rewrite changes without redeploying

## When to skip it

- You need full Node.js APIs *and* you are on Next.js 16 → use `proxy.ts`
- You need general-purpose edge compute, not interception → use Edge Functions
- Heavy business logic or DB queries → use server-side framework features
- Auth as sole protection → gate at the Layout / Server Component / Route Handler level
- Thousands of static URL redirects → use Bulk Redirects (up to 1M per project)

## How it compares

| | Vercel Routing Middleware | Next.js Middleware (legacy) | Next.js Proxy (16+) | Cloudflare Workers Routes |
|---|---------------------------|------------------------------|---------------------|---------------------------|
| **Framework scope** | Any framework | Next.js only | Next.js 16+ only | Any (run on Cloudflare) |
| **Runtimes** | Edge / Node.js / Bun | Edge (legacy) / Node | Node.js only | V8 isolates |
| **Run before cache** | Yes | Yes | Yes | Yes |
| **Standard helpers** | `@vercel/functions` | `NextRequest` / `NextResponse` | Same | `Workers` API |
| **Auth caveat** | Defense-in-depth only | Same | Same | Same |
| **Best for** | Vercel-hosted apps that need cross-framework or pre-cache logic | Next.js < 16 | Next.js 16+ on Vercel | Apps already on Cloudflare |

The pragmatic 2026 default for an app on Vercel: Routing Middleware (`middleware.ts`) for cross-cutting interception that should run pre-cache, with the actual auth gate living in your route handlers and layouts.

## Further reading

- [Vercel Routing Middleware docs](https://vercel.com/docs/routing-middleware)
- [API reference](https://vercel.com/docs/routing-middleware/api)
- [Getting started](https://vercel.com/docs/routing-middleware/getting-started)
- [Next.js Proxy / Middleware migration](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [`@vercel/config` docs](https://vercel.com/docs/project-configuration/vercel-ts)

For other Vercel infrastructure references on this site, see [Vercel](/cloud-and-hosting/vercel), [Vercel Functions](/cloud-and-hosting/vercel-functions), [Vercel Workflow DevKit](/cloud-and-hosting/vercel-workflow), [Vercel Queues](/cloud-and-hosting/vercel-queues), [Vercel Sandbox](/cloud-and-hosting/vercel-sandbox), [Vercel Firewall](/cloud-and-hosting/vercel-firewall), [Vercel AI Gateway](/cloud-and-hosting/vercel-ai-gateway), and [Vercel Blob](/cloud-and-hosting/vercel-blob).
