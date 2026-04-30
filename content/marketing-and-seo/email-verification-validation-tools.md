# Email Verification & List-Hygiene Tools: Kickbox, ZeroBounce, NeverBounce, Hunter, Bouncer, MailFloss, Emailable, Clearout

[⬅️ Marketing & SEO Overview](../marketing-and-seo/)

If you're sending email to lists or accepting email at sign-up in 2026, you need email verification. Bad addresses tank deliverability — sending to dead inboxes raises bounce rates; raises bounce rates lowers ESP reputation; lowers reputation routes legit emails to spam. The other failure mode: sign-up forms accepting `mailinator.com` and other disposable addresses fill your trial pool with bots. Most indie SaaS skips both, then wonders why marketing emails aren't landing and trial-to-paid conversion is bad. The fix is a 2-tier verification setup: real-time at signup (block disposable + invalid syntax + dead inbox) and batch hygiene on existing lists (clean every 6 months).

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Kickbox | Premium real-time + batch | $1 free credit | $0.008-0.01/check | High | Modern indie default |
| ZeroBounce | Comprehensive features | 100/mo free | $0.0084/check | Medium | List-hygiene focus |
| NeverBounce | Established alternative | 1K/mo free | $0.008/check+ | Medium | Mid-market batch |
| Hunter.io | Email finder + verifier | 25/mo free | $34/mo+ | High | Outbound prospecting |
| Bouncer | Modern EU-friendly | 100/mo free | $0.005/check+ | Very high | EU privacy-conscious |
| Emailable | Mid-market alternative | 250/mo free | $0.007/check+ | Medium | Mid-market |
| Clearout | Affordable bulk | 100/mo free | $0.004/check+ | High | Cost-conscious bulk |
| MailFloss | ESP-integrated auto-cleaner | Free trial | $9/mo+ | High | Mailchimp / Klaviyo users |
| Captain Verify | Simple bulk | 100/mo free | $0.005/check | Medium | Budget bulk |
| Snov.io | Sales-flavored | Free trial | $39/mo+ | Medium | Sales / outbound |
| Apollo (verifier) | Bundled w/ Apollo | Bundled | Bundled | Medium | Apollo CRM users |
| MX Lookup (DIY) | Homegrown | Free | $0 | Very high | Tiny-volume DIY |
| Disposable email lists (OSS) | Static blocklists | Free | $0 | Very high | First-line defense |

The first decision is **what you're doing**. Real-time verification at signup (Kickbox / ZeroBounce / Bouncer with API), batch list-hygiene on existing list (any of the above; NeverBounce / Emailable typical), email finding for outbound (Hunter / Snov.io), or simple disposable-email blocking (OSS lists, no vendor needed) are different jobs.

## Decide What You Need First

Tools are not interchangeable. Pick by use case.

### Real-time at signup (the 50% case)
You want to block bad emails BEFORE they hit your DB. Latency budget: <500ms.

Right tools:
- **Kickbox** — clean API; $0.008/check
- **ZeroBounce** — comprehensive
- **Bouncer** — EU-friendly; cheaper
- Plus: **disposable-email blocklist** (free; first-line defense)

### Batch list-hygiene (the 30% case)
You have a 50K-200K email list; want to remove dead addresses before next campaign.

Right tools:
- **NeverBounce** — popular for batch
- **Emailable** — modern alternative
- **Clearout** — cost-conscious bulk
- **Captain Verify** — budget pick

### Email finding for outbound (the 15% case)
Cold outreach; you have a name + company; need the email.

Right tools:
- **Hunter.io** — most-used for this
- **Snov.io** — alternative
- **Apollo** — bundled if you use Apollo CRM
- **Clearout** — find + verify

### Continuous ESP-side cleaning (the 5% case)
You're on Mailchimp / Klaviyo / Sendinblue and want auto-cleaning of bouncing addresses.

Right tools:
- **MailFloss** — cleans ESP lists automatically
- **Native ESP features** — most ESPs auto-suppress hard bounces

## What These Tools Actually Check

```
Help me understand verification levels.

The checks (in order of confidence):

**1. Syntax check (free; instant)**
Does it match RFC 5322? `user@domain.tld` valid format.
Catches: typos, malformed addresses.

**2. Domain check (cheap; ~10ms)**
Does the domain exist? Has MX records?
Catches: typos like `gmial.com`, dead domains.

**3. Disposable check (cheap; instant via blocklist)**
Is this a temp-email service (mailinator, 10minutemail, tempmail, guerrillamail, etc)?
Catches: bots, throwaway signups.
Free OSS list: github.com/disposable-email-domains

**4. Role-account check (cheap)**
Is this `info@`, `support@`, `noreply@`?
Decision: often allow but tag (less likely to engage with marketing).

**5. SMTP check (medium; 200-500ms)**
Connect to recipient mail server; ask "does mailbox exist?" without sending.
Returns: deliverable / undeliverable / risky / accept-all (catch-all).
Catches: dead addresses; provides "deliverable" confidence.

**6. Catch-all detection**
Some domains accept ALL emails (then bounce internally).
Marked "risky" — not safe to send to.

**7. Greylisted detection**
Some receivers deliberately delay first send (anti-spam).
Marked "unknown" — retry later.

**8. Spam-trap detection (premium feature)**
Email used by anti-spam orgs to catch list-buying senders.
Sending to one tanks reputation badly.
Premium services flag these via shared databases.

**Quality grades** typical output:

- **Deliverable**: confidence high; safe to send
- **Undeliverable**: don't send; remove
- **Risky**: catch-all / role / unknown — send selectively
- **Unknown**: greylisted / temporary failure
- **Disposable**: temp-email; block at signup

For my use case:
- Volume
- Quality bar
- Real-time vs batch

Output:
1. Required check levels
2. Action per quality grade
```

The non-obvious detail: **catch-all detection is the trickiest signal**. Many corporate domains accept all emails (then internally bounce). They look "deliverable" via SMTP but aren't really. Premium verifiers run additional heuristics.

## Provider Deep-Dives

### Kickbox — modern API default
Founded 2015. Modern API; clean docs; popular indie pick.

Pricing in 2026: $1 free credit on signup; pay-as-you-go $0.008-0.01/verification (volume discounts at 10K, 100K).

Features: real-time API + batch list-cleaning, disposable detection, role detection, SMTP probe, free email tests, integrations (Mailchimp, Klaviyo, HubSpot, etc.).

Why Kickbox wins: clean API, fast (sub-300ms typical), reasonable price, great DX. Default for most indie SaaS.

Pick if: real-time at signup; want polished DX; reasonable price.

### ZeroBounce — comprehensive features
Founded 2015. Comprehensive feature set; popular for list-hygiene.

Pricing in 2026: 100/mo free; $0.0084/check; volume discounts.

Features: real-time + batch, AI scoring (engagement likelihood), abuse detection, spam-trap detection, A.I. catch-all detection, integrations.

Why ZeroBounce: more features than Kickbox; AI-engagement scoring is unique (predicts opens / clicks).

Pick if: list-hygiene primary use; want engagement signals beyond deliverability.

### NeverBounce — batch list-hygiene
Founded 2014. Strong for batch; "always-current" verification.

Pricing in 2026: 1K free; $0.008-0.005/check (volume); $99/mo+ subscription tiers.

Features: batch upload + verify, real-time API, integrations (HubSpot, Mailchimp, Salesforce), automatic-syncing.

Pick if: batch list-hygiene + integrated workflow; mid-market scale.

### Hunter.io — email finding
Different category. Hunter finds email addresses given name + company.

Pricing in 2026: 25 searches/mo free; $34/mo Starter (500); $104/mo Growth (5K).

Features: domain search (find emails at company), email finder (name + domain → likely email), email verifier, campaigns (light cold-email tool).

Pick if: cold outreach; B2B prospecting; need to find emails. Don't pick if: pure verification (overkill).

### Bouncer — EU-friendly modern
European-origin; GDPR-aligned.

Pricing in 2026: 100/mo free; $0.005/check pay-as-go.

Features: real-time + batch, GDPR-compliant data handling, EU servers, integrations.

Pick if: EU privacy concerns; cost-conscious. Don't pick if: US-only stack.

### Emailable / Clearout / Captain Verify
- **Emailable** — modern; mid-market; integrations
- **Clearout** — affordable bulk; Indian-origin; bigger free tier
- **Captain Verify** — French; budget bulk

All viable mid-market picks.

### MailFloss — ESP-integrated auto-cleaner
Different paradigm: connects to your ESP (Mailchimp, Klaviyo, ActiveCampaign, etc.); auto-cleans bouncing addresses.

Pricing in 2026: $9-69/mo by list size.

Pick if: existing ESP user; want hands-off list maintenance.

### Snov.io / Apollo Verifier
- **Snov.io** — sales-flavored; finds + verifies + cold-outreach
- **Apollo** — bundled with Apollo CRM; only worthwhile if Apollo user

Niche picks.

### DIY: Disposable email blocklist
For zero-budget: pull github.com/disposable-email-domains/disposable-email-domains; check signup email against it.

```typescript
import disposableDomains from 'disposable-email-domains';

function isDisposable(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return disposableDomains.includes(domain);
}
```

Catches 70-80% of throwaway signups. Combine with other checks.

## What Email Verification Won't Do

Buying a verifier doesn't:

1. **Verify intent.** Real email + bot signup = still a bot. Pair with CAPTCHA + behavioral signals.
2. **Solve deliverability.** Sender reputation, content quality, list engagement, authentication (SPF/DKIM/DMARC) all matter beyond verification.
3. **Replace double opt-in.** Verification confirms address exists; double opt-in confirms intent.
4. **Make catch-all addresses safe.** "Deliverable to catch-all" still bounces internally; tools mark "risky" — send selectively.
5. **Catch every dead address.** SMTP probes can be blocked / lie. False-clean rate ~3-5% even with premium tools.

The honest framing: verification is one layer. List-engagement, ESP authentication, and double opt-in are the others.

## Pragmatic Stack Patterns

### Pattern 1: Indie SaaS at signup ($0-30/mo)
- **Disposable-email blocklist (OSS)** at signup — free
- **Kickbox** real-time API at signup — $5-30/mo at growth
- Reject "undeliverable"; flag "risky" for monitoring

### Pattern 2: Indie SaaS with email list ($20-100/mo)
- Pattern 1 PLUS
- **NeverBounce / Emailable** quarterly batch clean of marketing list
- Total: $20-100/mo

### Pattern 3: Mid-market with marketing ops ($100-1K/mo)
- **ZeroBounce** real-time + batch (one vendor)
- **MailFloss** continuous ESP-side cleaning
- Or **Kickbox** + manual quarterly cleans

### Pattern 4: Sales-led B2B ($100-500/mo)
- **Hunter.io** for prospecting
- **Kickbox** for verifying found addresses
- **Apollo** if all-in-one

### Pattern 5: Zero-budget DIY
- **Disposable-email OSS list** at signup
- Manual MX-record check via Node DNS
- Double-opt-in flow

```typescript
import { resolveMx } from 'node:dns/promises';

async function hasMxRecords(email: string): Promise<boolean> {
  try {
    const domain = email.split('@')[1];
    const records = await resolveMx(domain);
    return records.length > 0;
  } catch {
    return false;
  }
}
```

Catches: dead domains. Doesn't catch dead addresses (SMTP probe needed).

## Decision Framework: Three Questions

1. **What's your use case?**
   - Sign-up time → real-time API (Kickbox / ZeroBounce / Bouncer)
   - Existing list cleanup → batch (NeverBounce / Emailable)
   - Outbound prospecting → Hunter / Snov.io
   - Continuous → MailFloss

2. **What's your volume?**
   - <1K verifications/mo → free tiers cover
   - 1K-100K/mo → pay-as-go ($0.005-0.01/check)
   - 100K+/mo → enterprise contracts; volume discounts

3. **EU / privacy concerns?**
   - Yes → Bouncer (EU-friendly)
   - No → Kickbox / ZeroBounce / NeverBounce all fine

## Verdict

For 50% of indie / mid-market SaaS in 2026: **Kickbox**. Clean API; reasonable price; great DX; covers real-time + batch in one tool. The pragmatic default.

For 25%: **ZeroBounce**. When list-hygiene is primary and you want AI-engagement scoring + spam-trap detection.

For 15%: **Hunter.io**. When prospecting is the use case (different from verification).

For 5%: **Bouncer**. EU privacy concerns OR cost-conscious.

For 5%: **DIY (OSS disposable list + DNS)**. Pre-revenue / zero-budget.

The mistake to avoid: **buying premium verification while still sending to never-cleaned 5-year-old lists**. Verify; THEN segment by engagement; suppress non-engagers; only THEN focus on premium signals like spam traps. Doing it backward wastes money.

The second mistake: **email verification as a substitute for double opt-in**. Verification says address exists; double opt-in says human meant to sign up. Both matter; one isn't a substitute for the other.

## See Also

- [Email Marketing Providers](./email-marketing-providers.md) — ESPs that benefit from clean lists
- [Email Marketing](./email-marketing.md) — broader email-marketing context
- [Email Providers](../backend-and-data/email-providers.md) — transactional email (Resend / SES / Postmark)
- [Customer Data Platforms](./customer-data-platforms.md) — CDPs feed verified emails
- [CRM Providers](./crm-providers.md) — CRM list cleanliness depends on this
- [Bot Detection Providers](../devops-and-tools/bot-detection-providers.md) — companion abuse layer
- [Identity Verification & KYC Tools](../auth-and-payments/identity-verification-kyc-tools.md) — adjacent compliance
- [Authentication](../auth-and-payments/authentication.md) — companion auth flow
- [VibeWeek: Password Reset & Magic Link](https://vibeweek.dev/6-grow/password-reset-magic-link-chat) — verification at sign-up
- [VibeWeek: CAPTCHA & Bot Protection](https://vibeweek.dev/6-grow/captcha-bot-protection-chat) — companion abuse layer
- [VibeWeek: Email Deliverability](https://vibeweek.dev/6-grow/email-deliverability-chat) — broader deliverability
