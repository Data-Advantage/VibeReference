# Setting Up a Custom Domain on Vercel

Connecting a domain to Vercel is easy in principle, but many teams lose time on DNS edge cases (especially around apex vs `www` and registrar defaults). This guide gives you a repeatable flow using both the Vercel dashboard and CLI, plus the common gotchas that break SSL or routing.

## 1) Add the domain to your Vercel project

From your project root, link the repo and add your domain:

```bash
vercel link
vercel domains add example.com
vercel domains add www.example.com
```

Adding both root (`example.com`) and subdomain (`www.example.com`) upfront makes redirect setup cleaner and avoids duplicate SEO surfaces later.

## 2) Choose DNS strategy: nameservers vs records

You have two valid approaches:

- Use Vercel nameservers (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`)
- Keep your current DNS provider and add records manually

If you keep external DNS, configure:

| Host | Type | Value |
| ---- | ---- | ----- |
| `@` | A | `76.76.21.21` |
| `www` | CNAME | `cname.vercel-dns.com` |

This split is important:
- Apex/root domains cannot always use CNAME at every registrar
- `www` should use CNAME for clean target management

## 3) Set canonical domain and redirect behavior

In Vercel project domain settings, choose one canonical URL. Most teams either:
- Keep `www` as canonical and redirect apex to `www`
- Keep apex canonical and redirect `www` to apex

Pick one and keep it consistent with your metadata/canonical tags. If both resolve without redirect, Google may index duplicates and dilute ranking.

For app-level redirect enforcement in Next.js:

```ts
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "example.com" }],
        destination: "https://www.example.com/:path*",
        permanent: true,
      },
    ];
  },
};
```

Use either platform redirects or app redirects, but do not configure conflicting rules in both places.

## 4) Verify SSL and propagation

Vercel issues certificates automatically once DNS resolves. During propagation:
- `dig example.com A +short`
- `dig www.example.com CNAME +short`
- `vercel domains inspect example.com`

If SSL is pending for more than a few minutes, confirm there are no stale records at the registrar and no proxy/CDN mode interfering with validation.

## 5) CLI-first production workflow

A reliable sequence for teams:

```bash
vercel domains add example.com
vercel domains add www.example.com
vercel domains ls
vercel domains inspect example.com
```

Then deploy and test both hosts:
- `https://example.com`
- `https://www.example.com`

You should see one redirect to the canonical host and all paths preserved.

## 6) Common gotchas

- **Wrong project assignment:** domain attached to a different Vercel project
- **Apex CNAME confusion:** registrar does not support ALIAS/ANAME flattening
- **Mixed redirects:** DNS forward + Vercel redirect + app redirect causing loops
- **Missing preview awareness:** hardcoded production URL in env vars breaking previews
- **Old records lingering:** duplicate A or AAAA records from previous providers

For production, keep `NEXT_PUBLIC_APP_URL` aligned with your canonical domain and verify social metadata/canonical links use the same host. That alignment is what turns a technically working domain into a search-friendly one.
