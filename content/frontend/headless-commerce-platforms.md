# Headless Commerce Platforms: Shopify Hydrogen, Medusa, Saleor, BigCommerce, commercetools, Crystallize, Swell, Vendure

[⬅️ Frontend Overview](../frontend/)

If you're building an e-commerce experience in 2026 that needs custom UI, multi-channel sales, or developer-led flexibility, headless commerce is the path. The category split that matters: SaaS-headless (Shopify Plus / BigCommerce / commercetools — buy the backend; build the frontend) vs. OSS-headless (Medusa / Saleor / Vendure — own the backend; build the frontend). The right pick depends on whether you want managed-backend-with-build-flexibility, OSS-control with full customization, or a Shopify-grade ecosystem with composable architecture. Most indie e-comm in 2026 still picks Shopify (with Hydrogen for headless when needed); mid-market increasingly picks Medusa or Saleor for OSS flexibility; enterprise picks commercetools.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Shopify Hydrogen | Shopify-headless on Remix/Hydrogen | Free SDK; need Shopify backend | $39-2K/mo Shopify | Very high | Shopify customers wanting custom UI |
| BigCommerce | API-first SaaS commerce | Free trial | $39-400+/mo | High | Mid-market alt to Shopify |
| commercetools | Enterprise composable | Custom | $$$$ | Low | Enterprise / global brands |
| Medusa | OSS modular commerce | Free OSS / Cloud | $0 + ops or Cloud paid | Very high | OSS-friendly; modern stack |
| Saleor | OSS GraphQL commerce | Free OSS / Cloud free | $0 + ops or Cloud paid | High | OSS; GraphQL-native |
| Crystallize | Modern PIM + commerce | Free trial | $$$ | High | Catalog-heavy / B2B |
| Swell | Modern API commerce | Free dev / paid prod | $$$ | High | Mid-market modern |
| Vendure | OSS Node-based | Free OSS | $0 + ops | High | Node ecosystem; OSS |
| Spryker | Enterprise composable | Custom | $$$$ | Low | Large enterprise |
| Elastic Path | Enterprise headless | Custom | $$$$ | Low | Enterprise |
| Reaction Commerce | OSS (Mailchimp-owned) | Free OSS | $0 + ops | Medium | Smaller OSS pick |
| WooCommerce | WordPress plugin | Free | $0 + WP costs | Very high | WordPress-aligned |
| Adobe Commerce (Magento) | Enterprise full-stack | Custom | $$$$ | Low | Adobe-ecosystem enterprise |
| Sanity Commerce | Sanity + commerce | Free trial | Combo | High | Content-led commerce |

The first decision is **whether you want SaaS-managed-backend or OSS-self-hosted**. SaaS (Shopify / BigCommerce / commercetools) reduces ops; OSS (Medusa / Saleor / Vendure) gives full control + cost savings at scale.

## Decide What You Need First

Tools are not interchangeable. Pick by control + scale.

### SaaS-managed backend, custom frontend (the 50% case)
You sell physical / digital products; want speed-to-market; tolerable to be on hosted backend.

Right tools:
- **Shopify Hydrogen** — Shopify backend + Remix-based React frontend
- **BigCommerce** — API-first; less ecosystem than Shopify but flexible
- **commercetools** — enterprise-only

### OSS-headless (the 25% case)
Want full control; in-house ops capacity; long-term cost.

Right tools:
- **Medusa** — modern Node-based; growing ecosystem
- **Saleor** — Python + GraphQL
- **Vendure** — Node + TypeScript
- **Reaction Commerce** — older OSS

### Composable enterprise (the 15% case)
Multi-region; multi-currency; multi-channel; complex catalog; B2B+B2C mix.

Right tools:
- **commercetools** — gold-standard composable
- **Spryker** — strong in EU
- **Elastic Path** — enterprise alternative
- **Adobe Commerce** — for Adobe-ecosystem shops

### Catalog / PIM heavy (the 5% case)
Catalog complexity (10K+ SKUs; rich content) is the dominant problem.

Right tools:
- **Crystallize** — PIM + commerce in one
- **commercetools** — comprehensive
- **Sanity Commerce** — content-led

### WordPress-aligned (the 5% case)
Existing WordPress site; want commerce as add-on.

Right tools:
- **WooCommerce** — the default
- **Sanity Commerce** with WordPress

## Provider Deep-Dives

### Shopify Hydrogen — the headless Shopify path
Shopify launched Hydrogen (2021) + Oxygen (2022 hosting) as their headless story. Combined with Storefront API, you can build custom UIs against the Shopify backend.

Pricing in 2026: Shopify backend tiers ($39 Basic / $105 Shopify / $399 Advanced / $2K+ Plus). Hydrogen + Oxygen included on most tiers; Plus required for some advanced features.

Features: Storefront API (GraphQL), Hydrogen (Remix-based React), Oxygen (Vercel-equivalent hosting on Shopify CDN), 8K+ apps in Shopify ecosystem, payments built-in, fulfillment tools, multi-currency, multi-store.

Why Hydrogen wins: biggest e-commerce ecosystem; mature backend; modern React frontend tooling. The 2026 default for e-comm that wants custom UX.

Trade-offs: Hydrogen is Remix-based; if your team uses Next.js, you can use Storefront API directly. Some advanced backend features (B2B, multi-store) require Plus pricing.

Pick if: building custom e-commerce frontend; Shopify-centric. Don't pick if: OSS-committed or enterprise composable need.

### BigCommerce — API-first SaaS commerce
Long-standing Shopify alternative. API-first earlier than Shopify.

Pricing in 2026: $39-400+/mo standard tiers; Enterprise custom.

Features: Storefront API, full backend (catalog / orders / customers), B2B Edition, multi-channel, headless options.

Why BigCommerce: more API-first DNA than Shopify; smaller ecosystem; competitive pricing.

Pick if: API-first preference; want Shopify alternative. Don't pick if: starting fresh with no preference (Shopify ecosystem usually wins).

### commercetools — enterprise composable
Founded 2006 in Germany. The composable-commerce category leader. Used by enterprise brands (Audi, Lego, Tiffany).

Pricing in 2026: custom; typically $250K-2M+/yr.

Features: composable (mix-and-match); GraphQL; multi-region; multi-currency; B2B + B2C; carts / orders / catalog / discounts as separate APIs.

Why commercetools: enterprise gold-standard for composable. Flexibility unmatched.

Trade-offs: enterprise pricing only; complex setup; needs experienced team.

Pick if: enterprise; multi-region; complex catalog. Don't pick if: under $50M GMV (overkill).

### Medusa — modern OSS
Founded 2019. Modular, modern, Node.js-based. Massive growth 2023-2025.

Pricing in 2026: OSS free; Medusa Cloud (paid; managed) tiers.

Features: modular plugins, payments / shipping / tax integrations, admin UI, multi-currency, multi-region, headless API, Stripe / PayPal / Razorpay etc.

Why Medusa wins for OSS: modern Node.js + TypeScript stack; growing community; commercial-friendly; reasonable to run.

Pick if: OSS preference; modern stack; mid-market scale. Don't pick if: prefer managed; enterprise scale.

### Saleor — OSS GraphQL native
Polish-origin OSS. Python (Django) backend; GraphQL-first.

Pricing in 2026: OSS free; Saleor Cloud free dev tier; paid prod tiers.

Features: GraphQL API, Django admin, multi-channel, multi-warehouse, B2B support, AI-powered (some).

Why Saleor: GraphQL-native; mature; used by mid-market+.

Pick if: GraphQL-aligned; Python OK; OSS preference. Don't pick if: Node-only stack (Medusa fits better).

### Vendure — OSS Node + TypeScript
Modern Node.js-based OSS commerce.

Pricing in 2026: OSS free.

Features: GraphQL API, plugin architecture, multi-channel, mature for Node ecosystem.

Pick if: Node-aligned; OSS; alternative to Medusa.

### Crystallize — PIM + commerce
Norwegian. Catalog-heavy focus.

Pricing in 2026: tiers $$$.

Features: PIM (product info management), GraphQL, catalog complexity handled, headless commerce.

Pick if: catalog-heavy / B2B catalog. Don't pick if: simple SKU count.

### Swell, Reaction, WooCommerce, Adobe Commerce, Spryker, Elastic Path
Niche / specialty picks:
- **Swell** — modern API; mid-market
- **Reaction Commerce** — older OSS; Mailchimp-acquired
- **WooCommerce** — WordPress-aligned; massive deployed base
- **Adobe Commerce (Magento)** — enterprise full-stack
- **Spryker / Elastic Path** — enterprise composable alternatives

## What Headless Commerce Won't Do

Buying headless commerce doesn't:

1. **Replace product photography / merchandising.** Tooling is one layer; visual merchandising is craft.
2. **Eliminate fulfillment complexity.** Inventory / shipping / returns are operational, not platform.
3. **Solve marketing / acquisition.** Platform serves stores; you still need to get traffic.
4. **Make custom frontend instant.** Headless = build your own UI; that's months of frontend work.
5. **Replace ERP / OMS.** Platform handles cart + orders; ERP / OMS for inventory + supply chain.

The honest framing: headless commerce is a backend + API layer. Frontend, marketing, ops are still your work.

## Pragmatic Stack Patterns

### Pattern 1: Indie / SMB e-comm ($39-100/mo)
- **Shopify Basic** with default storefront
- Add Hydrogen later if customization warrants
- Apps from ecosystem
- Total: $39-100/mo

### Pattern 2: Custom-frontend Shopify ($300-2000/mo)
- **Shopify Plus** ($2K+/mo)
- **Hydrogen + Oxygen** for frontend
- Storefront API
- Custom design

### Pattern 3: OSS modern stack ($0-500/mo)
- **Medusa** self-hosted on AWS / Railway
- Custom React/Next frontend
- Stripe / Postgres
- Total: $0-500/mo + ops

### Pattern 4: Mid-market scale ($1-10K/mo)
- **commercetools** OR **BigCommerce** depending on enterprise gates
- Custom Next.js frontend
- Algolia / Typesense for search
- Custom admin tools

### Pattern 5: Enterprise composable ($$$+)
- **commercetools** OR **Spryker**
- **Algolia** for search
- **Sanity / Contentful** for content
- **Talon.One** for promotions
- **Cloudinary** for assets
- Custom system integrator team

### Pattern 6: WordPress + commerce
- **WooCommerce** plugin
- WordPress hosting (Cloudways / Kinsta / WP Engine)
- Total: $50-500/mo at scale

## Decision Framework: Three Questions

1. **What's your scale?**
   - <$1M GMV → Shopify or WooCommerce
   - $1-10M GMV → Shopify Plus / BigCommerce / Medusa
   - $10-100M GMV → Medusa Enterprise / commercetools / Saleor
   - $100M+ → commercetools / Spryker / Adobe

2. **OSS or SaaS?**
   - SaaS preference → Shopify / BigCommerce / commercetools
   - OSS preference → Medusa / Saleor / Vendure

3. **Frontend stack?**
   - React/Next.js → Shopify Storefront API + Next.js OR Medusa
   - Remix → Hydrogen
   - Other (Vue/Svelte) → any with API access

## Verdict

For 50% of e-commerce in 2026: **Shopify** (with Hydrogen for headless). Biggest ecosystem; mature backend; managed; ships fast.

For 25%: **Medusa** for OSS-modern teams.

For 10%: **BigCommerce** as Shopify alternative.

For 8%: **commercetools** for enterprise composable.

For 5%: **Saleor** for GraphQL/Python preference.

For 2%: **WooCommerce** for WordPress-aligned shops.

The mistake to avoid: **building OSS commerce when "I just want to sell"**. Self-hosting Medusa is hours of ops weekly. If e-commerce isn't your core differentiator, Shopify saves the time.

The second mistake: **paying for commercetools at $5M GMV**. Enterprise composable is for $50M+ where complexity warrants. Below that: Medusa or Shopify Plus.

## See Also

- [CMS Providers](./cms-providers.md) — content companion
- [Marketing Site Builders](./marketing-site-builders.md) — adjacent build-tools
- [Form Builders](./form-builders.md) — checkout-adjacent
- [Frontend Frameworks](./web-frameworks.md) — build the frontend
- [Next.js](./nextjs.md) — common frontend
- [Stripe](../auth-and-payments/stripe.md) — payments
- [Subscription Billing Providers](../auth-and-payments/subscription-billing-providers.md) — recurring billing
- [Search Providers](../backend-and-data/search-providers.md) — product search
- [Image CDN Providers](../cloud-and-hosting/image-cdn-providers.md) — product images
- [Customer Data Platforms](../marketing-and-seo/customer-data-platforms.md) — commerce data
- [VibeWeek: Real-time Collaboration](https://vibeweek.dev/6-grow/real-time-collaboration-chat) — adjacent
- [LaunchWeek: Pricing Strategy](https://launchweek.dev/1-position/pricing-strategy) — pricing decisions
- [LaunchWeek: Pricing Page](https://launchweek.dev/4-convert/pricing-page) — UI for pricing
