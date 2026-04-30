# Web Analytics Providers: Plausible, Fathom, Simple Analytics, Umami, Pirsch, Vercel Analytics, GA4, Matomo, Cloudflare Web Analytics

[⬅️ Marketing & SEO Overview](../marketing-and-seo/)

If you're building a SaaS in 2026 and trying to pick a web analytics tool, this is the consolidated comparison. Web analytics is the line item that looks like "we'll just use Google Analytics" until you discover GA4 takes 4 hours to set up properly, requires a cookie banner in the EU, and answers most questions with "click through 5 menus and configure 3 explorations." The privacy-first analytics category exploded post-GDPR; pick the right shape and you ship analytics in 10 minutes; pick wrong (or default to GA4) and you spend a week configuring something nobody opens.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | OSS / Self-Host | Indie Vibe | Best For |
|---|---|---|---|---|---|---|
| Plausible | Privacy-first hosted | Free trial (30d) | $9/mo (10K/mo) | Yes (AGPL) | Very high | Indie SaaS in 2026; default privacy-first |
| Fathom | Privacy-first hosted | 7-day trial | $15/mo (100K/mo) | No | High | Indie SaaS wanting Plausible-equivalent |
| Simple Analytics | Privacy-first hosted | 14-day trial | $9/mo (100K/mo) | No | High | EU-based; cookie-banner-free |
| Umami | OSS privacy analytics | Free OSS / Cloud free tier | $9/mo Cloud | Yes (MIT) | Very high | OSS-leaning teams; self-hostable |
| Pirsch | Privacy-first; lightweight | 30-day trial | $6/mo (10K/mo) | Partial | High | Smallest budget; EU-based |
| Vercel Analytics | Vercel-bundled | Free tier on Vercel | $10/mo Pro | No | Very high | Vercel-deployed teams |
| Cloudflare Web Analytics | Cloudflare-bundled | Free | Free | No | High | Cloudflare-stack teams |
| Google Analytics 4 (GA4) | Google''s default | Free | Free | No | Medium | Existing GA4 teams; e-commerce-heavy |
| Matomo | OSS Google Analytics alternative | Free OSS / Cloud trial | $26/mo Cloud | Yes (GPL) | Medium | Self-host required; full feature parity |
| PostHog (web mode) | Product + web analytics | Free (1M events/mo) | Bundled | Yes (AGPL) | High | Already on PostHog |

The first decision is **what shape of analytics you actually need**. Marketing-site analytics (sources, conversions, content performance), product analytics (feature usage, funnels, cohorts), and revenue / e-commerce attribution are three different problems. Most indie SaaS need at least the first two — different tools — with web analytics on the marketing site and product analytics in the app.

## Decide What You Need First

Web analytics tools are not interchangeable. Get the shape wrong and you'll either drown in setup or miss what matters.

### Privacy-first website analytics (the 70% case for indie SaaS)
You want to know: where traffic comes from, which pages perform, which CTAs convert. Cookie-banner-free in the EU. 5-minute setup. No PII, no pixel-based tracking.

Right tools:
- **Plausible** — modern default
- **Fathom** — equivalent
- **Simple Analytics** — equivalent
- **Umami** — OSS / self-host
- **Vercel Analytics** — bundled with Vercel
- **Cloudflare Web Analytics** — bundled with Cloudflare

### Full-featured tracking with conversions / funnels
You want everything from privacy-first PLUS funnel analysis, A/B test attribution, e-commerce events.

Right tools:
- **GA4** — most feature-rich; UX-painful but free
- **Matomo** — Google Analytics-equivalent; self-hostable
- **PostHog** — if you already use PostHog for product analytics

### Product analytics (different category)
For event-based, feature-usage analytics inside your app: see [product-analytics-providers](../devops-and-tools/product-analytics-providers.md). Different from web analytics; complementary.

### Server-side / log-based analytics (privacy-extreme)
You want analytics with zero JavaScript on the page; runs from server logs.

Right tools:
- **Cloudflare Web Analytics** (server-side mode)
- **GoatCounter** OSS
- Custom logs piped to ClickHouse

For most indie SaaS in 2026: **Plausible (or Fathom) on the marketing site; PostHog (or similar) in the product**. Skip GA4 unless you already invested in it.

## Provider Deep-Dives

### Plausible — The Modern Default
Plausible launched in 2019 as the OSS, EU-based, privacy-first alternative to GA. Generous free tier; cookie-banner-free; clean UI. Has become the most-popular indie SaaS web analytics tool in 2026.

Strengths:
- AGPL OSS; self-hostable
- Free hosted trial; $9/mo for 10K visits/mo
- Cookie-banner-free in EU (GDPR-compliant by design)
- Clean, single-page dashboard
- Lightweight script (<1KB)
- Pageviews, sources, devices, countries, goals, custom events
- Strong API for embedding

Weaknesses:
- Less feature-rich than GA4 (no advanced cohorts; no deep funnels)
- Self-host operational overhead
- Smaller community than GA4

Pick when: you want a fast, privacy-friendly tool for marketing-site analytics. Most indie SaaS should default here.

### Fathom — Equivalent Privacy-First
Fathom is similar in shape to Plausible. Privacy-first, hosted-only, slightly more feature-rich on conversion goals. US/CA-based (some teams prefer for jurisdictional reasons).

Strengths:
- $15/mo Starter (100K pageviews — better value than Plausible at scale)
- Privacy-first; cookie-banner-free
- Email reports
- Strong UTM tracking
- Solid API

Weaknesses:
- Hosted only; no self-host
- Less OSS-oriented than Plausible
- Smaller free tier

Pick when: you''re evaluating Plausible vs Fathom; both work; pick on ergonomics. Fathom''s 100K-pageview Starter often wins on price at moderate scale.

### Simple Analytics — EU-Based Privacy-First
Simple Analytics is the EU-based privacy-first alternative. Strong if your customers are EU-heavy and you want EU data residency.

Strengths:
- EU-based (GDPR by default; data stays in EU)
- Privacy-first; cookie-banner-free
- $9/mo Starter (100K)
- Clean UI
- Goal tracking

Weaknesses:
- Smaller community than Plausible
- Less integration breadth
- Hosted only

Pick when: EU data residency matters or you want a Plausible alternative.

### Umami — OSS Self-Host Default
Umami is the leading OSS privacy-first web analytics. MIT licensed; runs on Postgres; clean dashboards; growing community.

Strengths:
- MIT license — most permissive in this list
- Self-hostable (Postgres + Node)
- Free OSS
- Cloud option ($9/mo)
- Cookie-banner-free
- Active community

Weaknesses:
- Self-host requires infra
- Less polished than commercial offerings
- Smaller cloud user base

Pick when: you want OSS with the most permissive license and you''ll self-host.

### Pirsch — Cheap EU-Based
Pirsch is a budget-friendly privacy-first tool. EU-based; lightweight; unusually low price.

Strengths:
- $6/mo cheapest reasonable option in this category
- Privacy-first
- EU-based
- Decent feature set for the price
- Solid API

Weaknesses:
- Smaller community
- Less brand recognition
- Hosted-leaning (some self-host components)

Pick when: budget is the primary constraint and Plausible''s pricing doesn''t fit.

### Vercel Analytics — Vercel-Bundled
Vercel Analytics is bundled with Vercel projects. Page views, web vitals, custom events. Strong if you''re already on Vercel.

Strengths:
- Bundled with Vercel
- Free tier on every plan
- Web Vitals tracking built in (LCP, INP, CLS)
- Privacy-friendly (no cookies)
- Edge-side capture
- Clean integration with Next.js

Weaknesses:
- Tied to Vercel deployment
- Less feature-rich than dedicated tools
- $10/mo Pro for higher limits
- No self-host

Pick when: you''re on Vercel and want bundled analytics without another vendor.

### Cloudflare Web Analytics — Cloudflare-Bundled
Cloudflare offers free privacy-first web analytics for any site behind Cloudflare. Server-side or client-side.

Strengths:
- Free; bundled with Cloudflare
- Privacy-first; no cookies
- Server-side option (zero JS on page)
- Bot-filtering built in
- Good for Cloudflare-stack teams

Weaknesses:
- Less feature-rich than Plausible / GA4
- Tied to Cloudflare
- Smaller community of users

Pick when: you''re on Cloudflare and want zero-cost basic analytics.

### Google Analytics 4 (GA4) — The Default Most Founders Reach For
GA4 is the default for many web teams. Free; deep feature set; integrated with Google Ads. The cost is UX pain and EU privacy compliance friction.

Strengths:
- Free
- Most feature-rich (events, funnels, audiences, predictive insights)
- Native Google Ads integration
- BigQuery export at scale
- Massive community / ecosystem

Weaknesses:
- UX is dense; finding answers takes clicks
- Requires cookie banner in EU
- Privacy concerns (Google data retention)
- Setup is hours, not minutes
- Sampling at high volume
- Replacing UA was rocky for many teams

Pick when: you have an existing GA4 setup, you have a marketer who knows GA, or you''re e-commerce-heavy and need Google Ads integration.

### Matomo — OSS Google Analytics Alternative
Matomo (formerly Piwik) is the OSS GA alternative. Full feature parity with GA; self-hostable; commercial cloud available.

Strengths:
- GPL OSS
- Self-hostable
- GA-equivalent feature set
- Privacy-friendly defaults
- Long history (15+ years)
- Cloud option ($26/mo)

Weaknesses:
- Heavier than Plausible / Fathom
- Self-host operational overhead
- UX feels older than newer tools

Pick when: you need GA-feature-parity but with OSS / self-host.

### PostHog — Web Mode of a Product Analytics Tool
PostHog includes web analytics alongside product analytics, feature flags, replay. If you''re already on PostHog, web analytics is bundled.

Strengths:
- Bundled if you have PostHog
- AGPL OSS
- Replay + flags + analytics integrated
- Free tier (1M events)
- Strong API

Weaknesses:
- Heavier than dedicated web tools
- Cookie consent needed for full features
- More complex than Plausible for marketing-site needs

Pick when: you already use PostHog. Don''t install PostHog just for marketing-site web analytics.

## What Web Analytics Won''t Do

- **Replace product analytics.** Page views and sources are different from feature usage, cohorts, retention. Use both.
- **Replace conversion tracking.** Most tools have basic goals; ad-platform conversion pixels (Google Ads, LinkedIn Ads) are separate.
- **Tell you why something happened.** Analytics shows what; user research / interviews show why.
- **Be perfectly accurate.** Ad blockers strip JS-based analytics ~10-30% depending on audience. Server-side capture catches more.
- **Make GDPR / privacy compliance automatic.** You still need a privacy policy, DPA, subprocessor list per [trust center](../../../LaunchWeek/content/4-convert/trust-center-security-page.md).

## Pragmatic Stack Patterns

**Indie SaaS, modern Next.js / Vercel**:
- Vercel Analytics (bundled, web vitals included)
- PostHog or Plausible for marketing-site if Vercel free tier insufficient
- PostHog for in-product analytics
- Total: $0-10/mo

**Privacy-first / EU-heavy customers**:
- Plausible or Simple Analytics
- Avoid GA4 (cookie banner pain)
- Total: $9-15/mo

**OSS / self-host**:
- Umami (web) self-hosted
- PostHog (product) self-hosted
- Total: infrastructure cost only

**Already on Cloudflare**:
- Cloudflare Web Analytics (free, bundled)
- Total: $0

**E-commerce-heavy / Google Ads-driven**:
- GA4 (free; Google Ads integration)
- Plus PostHog or similar for product analytics
- Total: $0-50/mo

**Already on PostHog**:
- PostHog Web mode
- Total: bundled

## Decision Framework: Three Questions

1. **Are you on a platform that bundles analytics?** → Vercel: use Vercel Analytics. Cloudflare: use Cloudflare Web Analytics.
2. **Do EU customers / privacy matter?** → Yes: Plausible / Fathom / Simple Analytics. No: GA4 still works.
3. **Do you need OSS / self-host?** → Yes: Umami or Plausible self-hosted or Matomo. No: anything hosted.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **Plausible if you want privacy-first hosted; Vercel Analytics if you''re on Vercel; Umami if you want OSS / self-host**. Skip GA4 unless you have specific reasons.

## Verdict

For most readers building a SaaS in 2026:
- **Default**: Plausible (or Fathom if you prefer their UX).
- **On Vercel**: Vercel Analytics (bundled, web vitals included).
- **On Cloudflare**: Cloudflare Web Analytics (free).
- **OSS / self-host**: Umami or Matomo.
- **Already on PostHog**: PostHog Web mode.
- **E-commerce / Google Ads**: GA4 (despite UX pain).
- **Budget-extreme**: Pirsch ($6/mo).

The hidden cost in web analytics isn''t the seat fee — it''s **the dashboard nobody opens**. A tool that takes 5 minutes to set up and 30 seconds to read is used; a tool that takes 4 hours to configure and requires a Google Analytics certification is ignored. Pick the simple one; check it weekly; the discipline of looking matters more than the depth of the tool.

## See Also

- [Google Analytics](google-analytics.md) — GA-specific deep-dive
- [Google Search Console](google-search-console.md) — companion for SEO
- [Product Analytics Providers](../devops-and-tools/product-analytics-providers.md) — different category; in-product
- [Session Replay Providers](../devops-and-tools/session-replay-providers.md) — see what users did
- [SEO](seo.md) — search-driven traffic analysis
- [Vercel Analytics](../cloud-and-hosting/vercel-analytics.md) — Vercel-specific
- [Cloudflare](../cloud-and-hosting/cloudflare.md) — Cloudflare deep-dive
- [Trust Center & Security Page](../../../LaunchWeek/content/4-convert/trust-center-security-page.md) — privacy posture
- [Cookie Consent & Privacy Banners](https://www.vibeweek.com/6-grow/cookie-consent-chat) — when GDPR requires it
- [Email Marketing Providers](email-marketing-providers.md) — separate; complementary

---

[⬅️ Marketing & SEO Overview](../marketing-and-seo/)
