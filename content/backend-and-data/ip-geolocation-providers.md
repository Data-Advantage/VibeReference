# IP Geolocation Providers: MaxMind, ipinfo, IPGeolocation, ipapi, AbstractAPI, ipdata, IP2Location, ipify

[⬅️ Backend & Data Overview](../backend-and-data/)

If you're shipping a SaaS in 2026, you'll eventually need to know where users are coming from — for fraud detection (login from new country), regional pricing, GDPR/data-residency gates, currency / language defaults, compliance (sanctions screening), or just "show users a localized homepage." IP geolocation is how you turn an IP address into city / country / region / ASN / proxy-detection signals. Most indie SaaS reaches for free MaxMind GeoLite2 (offline DB; OK quality), then realizes accuracy on city-level + proxy detection matter and upgrades to a paid API. The right pick depends on whether you need offline DB (privacy/cost; MaxMind / IP2Location), real-time API (most cases; ipinfo / IPGeolocation / ipapi), or specialized fraud signals (proxy / VPN / Tor detection — which not all providers do well).

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| MaxMind | Industry-standard offline DB | GeoLite2 free | $50/mo+ GeoIP2 | Very high | Self-hosted lookups; offline |
| ipinfo | Modern API | 50K/mo free | $99/mo+ | Very high | API-first SaaS default |
| IPGeolocation | Comprehensive API | 1K/day free | $15/mo+ | High | Cost-conscious modern |
| ipapi.co | Simple API | 1K/mo free | $12/mo+ | High | Simple use cases |
| AbstractAPI | Multi-API including IP | 20K/mo free | $9/mo+ | High | Bundled with other Abstract APIs |
| ipdata | Threat-intel-flavored | 1.5K/day free | $11/mo+ | High | Fraud / VPN detection focus |
| IP2Location | Established offline + API | Lite free DB | $49/yr+ | Medium | Long-standing alternative to MaxMind |
| ipify | Simple "what's my IP" | Free unlimited | $0 | Very high | Just need user's IP |
| Cloudflare (auto) | Free via headers | Free w/ Cloudflare | $0 | Very high | Cloudflare-hosted apps |
| Vercel (auto) | Free via headers | Free w/ Vercel | $0 | Very high | Vercel-hosted apps |
| Spur.us | Anonymity-detection specialist | Trial | $$$ | Medium | Heavy fraud / anti-abuse |
| FraudLabs Pro | Fraud-detection bundled | Free 500/mo | $35/mo+ | Medium | E-commerce fraud |
| db-ip | Simple multi-tier API | 1K/day free | $19/mo+ | Medium | Mid-market |
| Geoapify | Geocoding + IP | Free tier | Pay-as-go | Medium | Location services bundle |

The first decision is **what signals you need**. Country-only (free / cheap; any provider), city + ASN (paid API; most providers), VPN / Tor / proxy detection (specialty providers; ipdata / Spur / MaxMind GeoIP2 Insights), or full fraud-stack (FraudLabs / Sift / fullstack vendor) are different jobs.

## Decide What You Need First

Tools are not interchangeable. Pick by use case + accuracy needs.

### Free via platform headers (the 30% case)
You're on Cloudflare or Vercel; they inject geo headers automatically.

Right tools:
- **Cloudflare**: `CF-IPCountry` header (free)
- **Vercel**: `x-vercel-ip-country`, `x-vercel-ip-city`, etc. (free)
- **AWS CloudFront**: `CloudFront-Viewer-Country` (free)

Use case: country-level signals; localization defaults; simple gates.

### Real-time API (the 40% case)
Most SaaS — needs city + ASN + accuracy + proxy detection on demand.

Right tools:
- **ipinfo** — modern API; default
- **IPGeolocation** — cheaper alternative
- **ipapi.co** — simple
- **ipdata** — threat-intel flavored

### Offline DB (the 20% case)
High volume; want zero-latency lookups; privacy-preserving (no IP leakage to third party).

Right tools:
- **MaxMind GeoLite2 / GeoIP2** — industry standard
- **IP2Location** — alternative

### Fraud-specific (the 10% case)
You need VPN / Tor / proxy / data-center detection at high accuracy.

Right tools:
- **Spur.us** — anonymity-detection specialist
- **MaxMind GeoIP2 Insights** — premium tier with fraud signals
- **ipdata** — bundled threat intel
- Full-stack fraud (Sift, Castle): different category

## Provider Deep-Dives

### MaxMind — the offline-DB standard
Founded 2002. The OG IP geolocation provider. GeoLite2 (free) is widely embedded in OSS / commercial software.

Pricing in 2026:
- GeoLite2 (free): country + city + ASN, daily updates, license required (no longer Public Domain since 2019)
- GeoIP2 City: $50/mo+ — better accuracy
- GeoIP2 Insights: $200/mo+ — VPN / proxy detection, ISP / org info
- GeoIP2 Anonymous IP: $$$ — VPN / Tor focus
- API access for any tier: pay-per-query

Features: country, region/state, city (with confidence), postal, lat/lon, ASN, ISP, org, time zone, accuracy radius. Insights tier adds VPN, proxy, hosting (data center), Tor exit, threat indicators.

Why MaxMind: industry-standard accuracy; offline DB option (privacy + zero latency); long history; comprehensive metadata.

Trade-offs: licensing requires registration since 2019 (need API key for free GeoLite2 download). Free tier accuracy lower than paid. UX dated relative to ipinfo.

Pick if: high-volume offline lookups; need accuracy; want fraud signals via Insights tier. Don't pick if: low-volume real-time lookups (paid API simpler).

### ipinfo — modern API default
Founded 2013 (formerly ipinfo.io). Modern API; clean docs; popular indie pick.

Pricing in 2026: 50K/mo free; Basic $99/mo (250K); Standard $249/mo (1M); Business $499/mo (5M); Enterprise custom.

Features: country, region, city, postal, lat/lon, ASN, org/ISP, abuse contact, VPN/proxy/hosting (paid tiers), mobile carrier, company info (B2B context).

Why ipinfo wins: clean API; reasonable free tier; good docs; B2B-context info (company name from IP often useful for sales prospecting).

Pick if: API-first SaaS; reasonable volume; want polished DX. Don't pick if: very high volume (offline DB cheaper) or zero-budget.

### IPGeolocation — cost-conscious modern
Cheaper alternative to ipinfo. Comprehensive features.

Pricing in 2026: 1K/day free; $15/mo (50K); $30/mo (250K); higher tiers.

Features: same core fields as ipinfo; threat detection (VPN, Tor, proxy, hosting); currency / time zone; user-agent parsing.

Pick if: cost-conscious; mid-market scale. Don't pick if: enterprise needs ipinfo brand recognition.

### ipapi.co — simple
Simplest API. Single endpoint returns full data.

Pricing in 2026: 1K/mo free; $12/mo (15K); $59/mo (100K).

Features: country, region, city, lat/lon, currency, language, ASN. No fraud signals.

Pick if: simple use case; small volume. Don't pick if: need fraud signals or large volume.

### ipdata — threat-intel flavored
Modern API with strong fraud-signal focus.

Pricing in 2026: 1.5K/day free; $11/mo (10K/day) basic; tiers up to enterprise.

Features: standard geo + heavy threat data (VPN, Tor, proxy, attacker indicators, threat scoring).

Pick if: fraud / abuse use case is primary; reasonable volume. Don't pick if: just need geo (overkill).

### AbstractAPI
Bundled with other Abstract APIs (validation, scraping, etc.).

Pricing in 2026: 20K/mo free; tiers from $9/mo.

Features: standard geo; bundled with validation / etc. APIs.

Pick if: already using Abstract for other APIs. Don't pick if: standalone — purpose-built alternatives are better.

### IP2Location — established alternative
Long-standing offline + API option.

Pricing in 2026: Lite free DB; commercial DB from $49/yr.

Features: similar to MaxMind; multiple data products (City, ISP, Proxy, etc.).

Pick if: MaxMind alternative for offline; cost-conscious. Don't pick if: starting fresh — MaxMind ecosystem is bigger.

### ipify
Just "what's the user's public IP" — not geolocation.

Pricing in 2026: free unlimited.

Features: returns user's IP. That's it.

Pick if: you only need IP detection (user-side or simple cases). Don't pick if: need geo data.

### Cloudflare / Vercel / AWS auto headers
Built-in to platforms.

```typescript
// Cloudflare Workers / Cloudflare-fronted
const country = request.cf?.country;  // 'US', 'GB', 'DE'

// Vercel
import { geolocation } from '@vercel/functions';
const { country, city, region, latitude, longitude } = geolocation(request);
```

Free; reliable; country-level always available; city varies by plan.

Pick if: hosted on these platforms. Don't pick if: standalone backend.

### Spur.us
Anonymity-detection specialist. Used by enterprise fraud teams.

Pricing in 2026: trial; enterprise custom (typically $$$).

Features: VPN / proxy / Tor detection at higher accuracy than general providers; bot infrastructure detection.

Pick if: high-stakes fraud; VPN-detection accuracy matters; have budget. Don't pick if: indie scale.

### FraudLabs Pro
E-commerce fraud focus.

Pick if: e-commerce abuse; bundled-fraud-stack preference. Don't pick if: pure geolocation.

## What IP Geolocation Won't Do

Buying geolocation doesn't:

1. **Tell you the actual user.** IP is the network's; could be Wi-Fi at coffee shop / VPN / corporate network. Don't infer identity.
2. **Solve compliance entirely.** GDPR / data-residency gates need more than "user's IP says EU"; legal review applies.
3. **Predict fraud reliably alone.** Fraud is multi-signal: IP + device + behavior + payment + history. Geo is one input.
4. **Work for VPN-heavy users.** 5-15% of traffic uses VPN; geolocation tells you the VPN exit, not the user. Plan accordingly.
5. **Be 100% accurate.** City-level accuracy: 70-85% typical. Country-level: 99%+. ASN: very accurate. Plan for inaccuracy.

The honest framing: geolocation is one signal in a stack. Useful for defaults, soft gates, and triage. Don't make critical decisions on geo alone.

## Pragmatic Stack Patterns

### Pattern 1: Cloudflare/Vercel-hosted free ($0/mo)
- Use platform-injected headers
- Country-level signals; localization
- Total: $0

### Pattern 2: Indie SaaS API ($0-15/mo)
- **ipinfo** Free tier (50K/mo) OR **IPGeolocation** $15/mo
- Real-time city + ASN + basic fraud signals
- Total: $0-15/mo

### Pattern 3: Offline DB at scale ($50-200/mo)
- **MaxMind GeoIP2 City** monthly DB
- Local lookups; zero latency; zero per-query cost
- Update DB weekly via cron
- Total: $50-200/mo

### Pattern 4: High-accuracy fraud ($200-1K/mo)
- **MaxMind GeoIP2 Insights** OR **ipdata Pro**
- VPN / Tor / proxy detection
- Pair with full fraud stack (Sift / Castle)

### Pattern 5: E-commerce fraud
- **FraudLabs Pro** OR **Sift** (full stack)
- Fraud-specific bundled signals

### Pattern 6: Sales-prospecting context
- **ipinfo** company / B2B tier
- Reverse-IP lookup ("who's visiting our marketing site?")
- Pair with **Clearbit** / **Apollo** for enrichment

## Decision Framework: Three Questions

1. **What signals do you need?**
   - Country only → platform headers (free)
   - City + ASN + basic fraud → ipinfo / IPGeolocation
   - Heavy VPN / Tor detection → MaxMind Insights / Spur / ipdata

2. **What's your volume?**
   - <50K lookups/mo → free tiers
   - 50K-1M/mo → API tier ($99-249/mo)
   - 1M+/mo → consider MaxMind offline DB ($50-200/mo)

3. **Hosted on a geo-aware platform?**
   - Yes (Cloudflare / Vercel / AWS CloudFront) → use built-in headers first
   - No → API or offline DB

## Verdict

For 50% of indie / mid-market SaaS in 2026: **ipinfo**. Modern API; reasonable free tier; clean DX; covers 95% of use cases. The pragmatic API default.

For 25%: **Platform headers (Cloudflare / Vercel)**. Free; covers country-level use cases. Good enough for localization, not for fraud.

For 15%: **MaxMind GeoIP2** (offline DB). High volume; offline-friendly; privacy-preserving (no IP leakage to third party).

For 5%: **IPGeolocation** or **ipapi.co**. Cost-conscious modern alternatives.

For 5%: **ipdata** / **MaxMind Insights** / **Spur** for fraud-heavy use cases.

The mistake to avoid: **using geo as a critical security gate**. "Block IPs from country X" is bypassed by VPN in 30 seconds. Use as a soft signal feeding broader fraud-detection; not as a sole gate.

The second mistake: **paying ipinfo enterprise for high volume when MaxMind offline DB at $200/mo gives the same data**. Math out: at >500K lookups/mo, offline DB is cheaper. Make the call.

## See Also

- [Database Providers](./database-providers.md) — store geo data
- [Bot Detection Providers](../devops-and-tools/bot-detection-providers.md) — fraud / abuse companion
- [Identity Verification & KYC Tools](../auth-and-payments/identity-verification-kyc-tools.md) — geo feeds KYC
- [Email Verification & List-Hygiene Tools](../marketing-and-seo/email-verification-validation-tools.md) — companion abuse layer
- [Authentication](../auth-and-payments/authentication.md) — auth often uses geo signals
- [CRM Providers](../marketing-and-seo/crm-providers.md) — geo enrichment for sales
- [Cloudflare](../cloud-and-hosting/cloudflare.md) — Cloudflare provides geo headers
- [Vercel](../cloud-and-hosting/vercel.md) — Vercel provides geo headers
- [Internationalization Tools (Localization)](../marketing-and-seo/localization-translation-tools.md) — geo defaults i18n
- [Tax Compliance Tools](../auth-and-payments/tax-compliance-tools.md) — tax geo gates
- [VibeWeek: Internationalization](https://vibeweek.dev/6-grow/internationalization-chat) — i18n implementation
- [VibeWeek: Currency & FX Handling](https://vibeweek.dev/6-grow/currency-fx-handling-chat) — currency selection
- [VibeWeek: CAPTCHA & Bot Protection](https://vibeweek.dev/6-grow/captcha-bot-protection-chat) — companion abuse layer
