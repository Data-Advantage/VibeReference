# Bot Detection & CAPTCHA Providers: Vercel BotID, Cloudflare Turnstile, hCaptcha, reCAPTCHA, Arkose, Castle, Friendly Captcha

[⬅️ DevOps & Tools Overview](../devops-and-tools/)

If you're building a SaaS in 2026 and trying to pick a bot-detection / CAPTCHA tool, this is the consolidated comparison. Bot detection is the line item that founders skip until 50,000 spam signups arrive overnight, the bill from SES bounces hits, and the founder spends a weekend cleaning up. Most indie SaaS default to Google reCAPTCHA out of habit (privacy-hostile, ad-funded, hides bots from your view) when modern alternatives are cheaper, more privacy-friendly, and detect more sophisticated bots. Pick the right shape and bots are a non-issue; pick wrong (or skip) and you're firefighting fraud quarterly.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | OSS / Self-Host | Indie Vibe | Best For |
|---|---|---|---|---|---|---|
| Vercel BotID | Modern bot detection | Bundled with Vercel | Free w/ Vercel | No | Very high | Vercel-deployed teams in 2026 |
| Cloudflare Turnstile | Privacy-friendly CAPTCHA | Free (unlimited) | Free | No | Very high | Anyone behind Cloudflare |
| Cloudflare Bot Management | Enterprise bot defense | Free trial | Custom | No | Medium | Cloudflare Enterprise customers |
| hCaptcha | Privacy-focused CAPTCHA | Free (1M/mo) | Custom (Enterprise) | No | High | Privacy-conscious teams |
| Friendly Captcha | EU-based; no-puzzle | Free trial | $9/mo | No | High | EU teams; UX-focused |
| reCAPTCHA v3 (Google) | Invisible scoring | Free (1M/mo) | $1/1K above | No | Medium | Google ecosystem teams |
| reCAPTCHA Enterprise | Stronger Google version | Free trial | $1/1K | No | Low | Enterprise on GCP |
| Arkose Labs | Enterprise anti-fraud | Custom | Sales-led | No | Very low | Large-scale fraud problems |
| Castle | Account-fraud focused | Free trial | $59/mo+ | No | Medium | Account-takeover focus |
| Sift | Enterprise fraud platform | Custom | Sales-led | No | Very low | E-commerce / payments fraud |
| Honeypot fields | DIY | Free | Free | Yes | Very high | Light defense; pair with others |

The first decision is **what threat you're defending against**. Spam signups on a marketing form, scraping of public data, account takeover, and payment fraud are four different problems with four different tools. Most indie SaaS need defense against signup spam first; everything else is incremental.

## Decide What You Need First

Bot detection tools are not interchangeable. Get the threat wrong and you'll either pay for capabilities you don't use or miss the actual attack.

### Signup spam protection (the 70% case for indie SaaS)
You want to stop bots from creating fake accounts on your signup form. Maybe also: contact forms, password reset, lead magnets.

Right tools:
- **Vercel BotID** if you're on Vercel
- **Cloudflare Turnstile** if you're on Cloudflare
- **hCaptcha** for cross-platform / privacy-first
- **Friendly Captcha** for EU / no-puzzle UX

### Account-takeover protection (when accounts get attacked)
You're getting credential-stuffing attacks; brute-force login attempts; suspicious session activity.

Right tools:
- **Castle** — purpose-built for ATO
- **Cloudflare Bot Management** — ATO bundled
- Plus per-account [rate limiting](../../../VibeWeek/6-grow/rate-limiting-abuse-chat.md) and [2FA](../../../VibeWeek/6-grow/two-factor-auth-chat.md)

### Scraping protection (when bots scrape public data)
Your public pages are being scraped at scale; competitors / aggregators harvest your content.

Right tools:
- **Cloudflare Bot Management** — strongest for scraping
- **DataDome** — alternative
- Rate limiting at the edge

### Payment fraud (e-commerce / high-value transactions)
You're processing payments and seeing chargebacks / fraud.

Right tools:
- **Sift** — enterprise fraud platform
- **Stripe Radar** (built-in if on Stripe) — first line of defense
- **Arkose** — for large-scale

For most indie SaaS in 2026: **Cloudflare Turnstile if you''re on Cloudflare; Vercel BotID if you''re on Vercel; hCaptcha if neither**. Skip reCAPTCHA unless you have specific reasons. Skip enterprise tools until scale demands.

## Provider Deep-Dives

### Vercel BotID — The Modern Vercel-Native Default
Vercel BotID went GA in June 2025. Bundled with Vercel; transparent (no user friction); detects bots via behavioral signals.

Strengths:
- Bundled with Vercel — no extra vendor
- Transparent (no CAPTCHA puzzles to solve)
- Modern ML-based detection
- Privacy-friendly
- Easy integration with Next.js / Vercel Functions
- Per-route protection

Weaknesses:
- Tied to Vercel deployment
- Less battle-tested than older tools
- May miss sophisticated bots that older tools catch

Pick when: you''re on Vercel and want zero-friction bot protection. Default for Vercel-deployed teams in 2026.

### Cloudflare Turnstile — Free Privacy-First CAPTCHA
Cloudflare Turnstile launched in 2023 as a free, privacy-first reCAPTCHA alternative. Works behind Cloudflare or as a standalone widget.

Strengths:
- Free; unlimited usage
- Privacy-friendly (no tracking; no ad-funded data harvesting)
- Most users see no challenge ("invisible mode")
- Strong if you''re behind Cloudflare
- Easy integration; small JS snippet

Weaknesses:
- Tied to Cloudflare for best results
- Can challenge legitimate users on rare networks (VPN, Tor)
- Less ML-sophisticated than enterprise tools

Pick when: you''re behind Cloudflare or want a free reCAPTCHA alternative. Use this if you''re not on Vercel.

### Cloudflare Bot Management — Enterprise Bot Defense
Cloudflare Bot Management is the upmarket version. Detects sophisticated bots using ML; integrated with Cloudflare''s edge network.

Strengths:
- Cloudflare Enterprise-grade
- ML-based bot scoring
- Strong against scraping / credential stuffing / account fraud
- Edge-side blocking (no traffic reaches origin)
- Integrates with WAF / firewall rules

Weaknesses:
- Cloudflare Enterprise tier required ($$$)
- Sales-led
- Overkill for indie scale

Pick when: you''re Cloudflare Enterprise and bots are a serious cost.

### hCaptcha — Privacy-Focused Cross-Platform
hCaptcha rose as the privacy-friendly reCAPTCHA alternative. Pays website owners for solved CAPTCHAs (training data revenue share).

Strengths:
- Free up to 1M challenges/mo
- Privacy-friendly (no Google tracking)
- Pays publishers small revenue share
- Works on any platform / framework
- Strong cross-platform support

Weaknesses:
- Still presents puzzle CAPTCHAs (some user friction)
- Smaller community than reCAPTCHA
- Less ML-sophisticated than enterprise

Pick when: you''re not on Vercel/Cloudflare and want privacy-friendly cross-platform CAPTCHA.

### Friendly Captcha — No-Puzzle EU Option
Friendly Captcha is the EU-based, GDPR-friendly, no-puzzle CAPTCHA. Uses proof-of-work in the browser instead of asking users to solve puzzles.

Strengths:
- No puzzles (proof-of-work happens silently)
- EU-based; GDPR-by-default
- Accessibility-friendly (no visual challenges)
- $9/mo Starter
- Privacy-conscious

Weaknesses:
- Costs CPU on user''s device (small but real)
- Smaller community
- Less ML signal than behavior-based tools

Pick when: EU customers + accessibility matter, or you want zero user friction.

### Google reCAPTCHA v3 — The Default Most Founders Reach For
reCAPTCHA v3 is the legacy default. Free; widely deployed; ad-funded.

Strengths:
- Free up to 1M assessments/mo
- Strong ML (Google data scale)
- Wide framework support
- Brand recognition

Weaknesses:
- Privacy concerns (Google data collection)
- "Are you a robot?" badge in corner (UX intrusion)
- Cookies trigger consent banner in EU
- Google can change rules / pricing
- v3 is opaque (you don''t see what bots it caught)

Pick when: you have legacy reCAPTCHA and migrating costs more than the privacy trade-off.

### reCAPTCHA Enterprise — Google''s Upmarket Version
reCAPTCHA Enterprise is the paid, more-sophisticated Google offering. Costs per assessment; better ML; account-defense features.

Pick when: you''re on GCP and need stronger Google-ecosystem bot protection.

### Arkose Labs — Enterprise Anti-Fraud
Arkose is enterprise-grade bot detection with custom challenges. Used by major platforms (Twitter / X, Roblox, Microsoft).

Strengths:
- Strongest detection at scale
- Custom challenges (3D puzzles, etc.)
- Strong against motivated attackers
- Account-takeover focus

Weaknesses:
- Custom pricing (typically $50K+/yr)
- Sales-led
- Heavy implementation
- Overkill for indie scale

Pick when: you''re a large platform with motivated attackers and budget to match.

### Castle — Account-Fraud Specialist
Castle focuses on account takeover and credential stuffing specifically. Behavioral fingerprinting; per-user risk scores.

Strengths:
- ATO-specific signal (better than general bot detection for this use case)
- $59/mo+ accessible to mid-market
- API-first integration
- Good for SaaS that has user accounts under attack

Weaknesses:
- Doesn''t replace general CAPTCHA
- Smaller community
- Less suited to scraping or signup spam

Pick when: ATO is the specific problem and general CAPTCHA isn''t addressing it.

### Sift — E-Commerce Fraud Platform
Sift is the enterprise fraud platform for e-commerce / payments. Account, payment, content fraud.

Pick when: you''re processing high-value transactions with chargeback risk and need a full fraud platform. Not for indie scale.

### Honeypot Fields — DIY Light Defense
A hidden form field that bots fill but humans don''t. Cheap; complementary; not standalone defense.

```html
<form>
  <input type="text" name="website" tabindex="-1" autocomplete="off" 
         style="position:absolute;left:-9999px" />
  <!-- if "website" is filled, reject -->
</form>
```

- Catches lazy bots (10-20% of bot traffic)
- Free
- Pair with real CAPTCHA / bot-detection tools

Pick when: you want cheap baseline defense AND a real tool. Don''t rely on alone.

## What Bot Detection Won''t Do

- **Replace [rate limiting](../../../VibeWeek/6-grow/rate-limiting-abuse-chat.md).** Bot detection identifies; rate limiting throttles. Use both.
- **Replace [secret management](secret-management-providers.md).** API keys leaked publicly need rotation, not bot detection.
- **Replace [authentication](../auth-and-payments/authentication.md).** Bots bypass weak auth; strong auth + bot detection together.
- **Be 100% accurate.** False positives on legit users; false negatives on sophisticated bots.
- **Be free of operational overhead.** Tune challenges; review false positives; adjust thresholds.

## Pragmatic Stack Patterns

**Indie SaaS, modern Next.js / Vercel**:
- Vercel BotID on signup / contact forms
- Honeypot fields as backup
- Rate limiting at the API layer
- Total: bundled with Vercel

**Behind Cloudflare**:
- Cloudflare Turnstile (free)
- Cloudflare WAF rules for known-bad
- Total: free with Cloudflare

**Cross-platform / no specific provider**:
- hCaptcha (free up to 1M)
- Honeypot fields
- Total: free

**EU customers / accessibility-first**:
- Friendly Captcha
- Total: $9/mo

**Account-takeover problems**:
- Castle for ATO scoring
- Plus 2FA enforced
- Plus rate-limited login endpoints
- Total: $59-200/mo

**Existing reCAPTCHA**:
- Migrate to Turnstile / hCaptcha when convenient
- Don''t rip-and-replace until necessary

**Enterprise scale**:
- Cloudflare Bot Management (if Cloudflare Enterprise)
- Or Arkose / Sift (sales-led)
- Total: $50K+/yr

## Decision Framework: Three Questions

1. **Are you on a platform with bundled detection?** → Vercel: BotID. Cloudflare: Turnstile.
2. **What''s the threat?** → Signup spam: any CAPTCHA. ATO: Castle + 2FA. Scraping: Cloudflare Bot Management.
3. **What''s your scale / budget?** → Indie: free tiers fit. Enterprise: budget for Arkose / Sift.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **Vercel BotID if on Vercel; Cloudflare Turnstile if on Cloudflare; hCaptcha otherwise**. Skip reCAPTCHA unless legacy.

## Verdict

For most readers building a SaaS in 2026:
- **Default on Vercel**: Vercel BotID (bundled).
- **Default on Cloudflare**: Cloudflare Turnstile (free).
- **Cross-platform free**: hCaptcha.
- **EU / accessibility**: Friendly Captcha.
- **Account takeover focus**: Castle.
- **Enterprise scale**: Cloudflare Bot Management or Arkose.
- **E-commerce fraud**: Sift + Stripe Radar.

The hidden cost in bot detection isn''t the seat fee — it''s **what one fraud incident costs.** A botnet that signs up 50K accounts on a Friday and triggers SES suspension costs the founder a weekend of cleanup AND days of email-deliverability damage. The $0-30/mo CAPTCHA tool prevents this entire class of incident. Don''t be the founder learning this lesson the hard way.

## See Also

- [Rate Limiting & Abuse Prevention](../../../VibeWeek/6-grow/rate-limiting-abuse-chat.md) — companion product feature
- [Two-Factor Auth](../../../VibeWeek/6-grow/two-factor-auth-chat.md) — defense against ATO
- [Authentication](../auth-and-payments/authentication.md) — strong auth complements bot detection
- [Secret Management](secret-management-providers.md) — protect API keys from bot exfiltration
- [Vercel Firewall](../cloud-and-hosting/vercel-firewall.md) — Vercel''s WAF / firewall product
- [Cloudflare](../cloud-and-hosting/cloudflare.md) — Cloudflare deep-dive
- [Stripe](../auth-and-payments/stripe.md) — Stripe Radar for payment fraud
- [Email Deliverability](../../../VibeWeek/6-grow/email-deliverability-chat.md) — bot signups damage this
- [Audit Logs](../../../VibeWeek/6-grow/audit-logs-chat.md) — log bot-detection events

---

[⬅️ DevOps & Tools Overview](../devops-and-tools/)
