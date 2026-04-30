# Status Page Providers: Statuspage, Better Stack, Instatus, Hund, StatusGator, Cachet, Upptime

[⬅️ Cloud & Hosting Overview](../cloud-and-hosting/)

If you sell software that other people depend on in 2026, you need a public status page. This is the consolidated comparison. Most indie founders default-buy Atlassian Statuspage (overkill and overpriced for under-100-customer SaaS), or skip the status page entirely and lose enterprise deals during procurement. Better Stack and Instatus at $20-30/mo cover 95% of the indie use case; Statuspage is the right call only when you're at $5M ARR or selling to enterprise buyers who specifically expect that vendor.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Atlassian Statuspage | Enterprise default | None | $29/mo+ | Low | Enterprise; integrates Jira/Opsgenie |
| Better Stack (Status) | Modern monitoring + status | Free (1 monitor) | $25/mo+ | Very high | Indie SaaS / mid-market |
| Instatus | Modern affordable status | Free (limited) | $20/mo+ | Very high | Indie / startups |
| Hund | Component-heavy SaaS | None | $30/mo+ | High | Mid-market w/ many components |
| StatusGator | Aggregator (upstream) | Free | $40/mo+ | Medium | Monitor your vendors' status |
| Cachet | OSS self-hosted | Free OSS | $0 + hosting | Very high | OSS purists; control freaks |
| Upptime | OSS GitHub-Pages-based | Free | $0 | Very high | Solo devs; near-zero spend |
| StatusCast | Internal + external IT | Custom | $$$ | Low | Enterprise IT (employees) |
| FreshStatus | Bundled with Freshdesk | Free | Bundled | Medium | Existing Freshworks customers |
| Sorry | Polished marketing-friendly | None | $50/mo+ | Medium | Brand-conscious mid-market |
| Statuspal | Modern affordable alt | Free | $25/mo+ | High | Budget-conscious indies |
| Pingdom (Status) | Pingdom + status | Bundled | $$ | Medium | Existing Pingdom customers |

The first decision is **what kind of status story you're telling**. Public marketing-grade status (Better Stack / Instatus / Statuspage), enterprise procurement-checkbox status (Statuspage), internal IT status (StatusCast), and DIY monitoring-driven status (Upptime / Cachet) are different problems with different vendors.

## Decide What You Need First

Tools are not interchangeable. Pick by buyer stage + monitoring stack.

### Indie SaaS, < 1000 customers, want a working status page (the 50% case)
You ship to startups / SMB. Need a status page that looks professional and updates automatically when monitoring detects an outage. Don't need SSO, sub-pages, or enterprise compliance.

Right tools:
- **Better Stack** — modern; built on Logtail / Uptime monitoring; very affordable
- **Instatus** — fast page loads; good UX; cheaper than Statuspage
- **Statuspal** — budget alternative

### Selling to enterprise; procurement requires status page (the 25% case)
You're closing $50K+ deals. Procurement asks "where's your status page?" and "who's the vendor?" Statuspage is the boring-correct answer that no enterprise buyer questions.

Right tools:
- **Atlassian Statuspage** — the enterprise-default; nobody gets fired for buying it
- **Sorry** — if you want polished branding alongside Atlassian-class trust

### You already use a full-stack monitoring tool (the 10% case)
You run Better Stack / Datadog / New Relic / Pingdom and want the status page included.

Right tools:
- **Better Stack** — bundles monitoring + status
- **Pingdom** — bundles uptime + status
- **FreshStatus** — bundles with Freshworks suite

### OSS / self-hosted / minimal budget (the 10% case)
Solo dev, side project, or principled OSS shop. Don't want another SaaS subscription.

Right tools:
- **Upptime** — free; runs on GitHub Actions + Pages
- **Cachet** — OSS; you self-host
- Status pages from your existing monitoring (most cloud platforms ship one free)

### Aggregating upstream vendors (the 5% case)
You want to know when *your* vendors (Stripe, AWS, Twilio) have incidents that affect you.

Right tools:
- **StatusGator** — aggregator across 3000+ public status pages
- **IsDown** — simpler vendor-status aggregator

## Provider Deep-Dives

### Atlassian Statuspage — the enterprise default
The original. Bought by Atlassian in 2016. If you've ever clicked a "status page" link on an enterprise SaaS, it was probably this. Industry standard for procurement checkboxes.

Pricing in 2026: Hobby $29/mo (no SLA), Starter $99/mo, Business $399/mo, Enterprise custom. Public-page price ladder is steep — most teams jump from Hobby → Business when they need subscribers, audit log, or sub-pages.

Features: components & component groups, incident workflow (investigating → identified → monitoring → resolved), scheduled maintenance, subscriber management (email / SMS / webhook / Slack / RSS), uptime calculator, metrics graphs, postmortems, audit log (paid), SAML SSO (Enterprise only), sub-pages for multi-product (Business+).

Integrations: Datadog, New Relic, PagerDuty, Opsgenie, VictorOps, Slack, Microsoft Teams, Jira, GitHub. Auto-create incidents from monitoring tools. The integration ecosystem is the moat.

Vibe assessment: high quality but feels expensive at indie scale. The Hobby tier looks affordable until you realize subscriber notifications are paywalled. SAML SSO is Enterprise-only — a stupid lock-in for security buyers. Indie SaaS founders complain about Atlassian's pricing creep over time.

Pick if: you're > $5M ARR, sell to enterprise, and need the Atlassian brand for procurement. Don't pick if: you're under $1M ARR — Better Stack or Instatus does 95% of this for ~10% of the cost.

### Better Stack — modern monitoring + status
The 2026 indie default. Better Stack (formerly Better Uptime) bundles uptime monitoring, on-call scheduling, log management (Logtail), and a status page. Acquired Logtail in 2022; rebranded to Better Stack.

Pricing in 2026: free tier (10 monitors, 1 status page, basic), Team $29/mo+ (unlimited status pages, on-call, 30s checks), Enterprise custom. Per-seat pricing on team tier scales fairly.

Features: status page with components, scheduled maintenance, incident timeline, subscriber notifications (email / SMS / webhook / Slack), white-label / custom domain, multi-region uptime checks (auto-create incidents on failure), API & Terraform support, on-call rotations (PagerDuty alternative), log management.

Why Better Stack wins for indie SaaS: bundled monitoring + status removes a vendor. You don't need Datadog + Statuspage + PagerDuty — Better Stack does all three at $29/mo. The on-call feature alone replaces $20-50/mo PagerDuty.

Trade-offs: log management at scale costs more than dedicated tools (Logtail can get expensive over 100GB/mo). Some enterprise procurement still wants Statuspage specifically.

Pick if: indie / mid-market; want to consolidate vendors; appreciate modern UX. Don't pick if: enterprise procurement specifically requires Atlassian.

### Instatus — fast, affordable, indie-friendly
Built specifically as a Statuspage alternative for startups. Page-load speed is a brag (sub-100ms first paint). Acquired by FullStory in 2022 but operates independently.

Pricing in 2026: free (1 status page, limited features), Starter $20/mo, Pro $50/mo, Business $300/mo. Cheaper than Statuspage at every tier.

Features: components, scheduled maintenance, incident postmortems, subscriber management (email, SMS, webhook, RSS, Slack, Teams, Discord), white-label, custom domain, public/private pages, sub-statuses for multi-product, multilingual pages, detailed audit log.

Why Instatus is appealing: Statuspage feature parity at lower price. Page UX is genuinely faster than Statuspage. Public stats (uptime %, MTTR) are auto-calculated and displayed.

Trade-offs: smaller ecosystem of monitoring integrations vs Statuspage (still has the big ones). Some enterprise procurement asks "have you heard of Atlassian Statuspage?" — Instatus is less recognized.

Pick if: startup / indie SaaS; want Statuspage features at half the price; brand-conscious. Don't pick if: you've standardized on Atlassian elsewhere.

### Hund — component-heavy SaaS
For SaaS with many components (50+ services). Hund is rare in the indie segment — it's used by infrastructure-heavy companies that need granular component status.

Pricing in 2026: $30/mo+ scaling by components. Bandwidth-priced.

Features: heavy on components (subgroups, dependencies, composite status), incident reporting, subscriber notifications, scheduled maintenance, audit log, SAML SSO at higher tiers.

Pick if: you have 30+ distinct services and need parent/child component relationships. Don't pick if: you have < 10 components — overkill.

### StatusGator — vendor-status aggregator
Different category. StatusGator monitors *other people's* status pages and alerts you when vendors you depend on have incidents.

Pricing in 2026: free (3 services), Personal $25/mo, Business $100/mo+.

Use case: you're hosted on AWS, use Stripe, send via Resend, auth with Auth0. When AWS US-East-1 goes down, you want to know in 30 seconds — before customers tweet at you. StatusGator polls 3000+ public status pages and notifies you.

Pick if: you depend on many third-party services and want unified vendor-incident alerts. Don't pick if: you only depend on 2-3 vendors — set up RSS / email subs to their status pages directly.

### Cachet — OSS self-hosted
The OSS option. PHP-based. Self-host on your own infrastructure. Originally maintained, then abandoned, then forked and revived (Cachet 3.x in 2024-2025).

Pick if: principled OSS shop; want full control; have the ops budget to run it. Don't pick if: you'd rather pay $20/mo than self-host another service.

### Upptime — GitHub-native OSS
Free. Runs on GitHub Actions (uptime checks) + GitHub Pages (status page). Anand Chowdhary's project.

Pick if: solo dev, side project, or you specifically want a status page on your GitHub presence. Don't pick if: you have paying customers — the polish gap matters.

### StatusCast / FreshStatus / Pingdom / Sorry / Statuspal
- **StatusCast** — internal IT status pages (employee-facing); enterprise-priced
- **FreshStatus** — bundled with Freshdesk / Freshservice; only worthwhile if you already use Freshworks
- **Pingdom** — uptime + status; legacy SolarWinds; consider only if Pingdom-locked
- **Sorry** — polished branding; UK-based; mid-market price
- **Statuspal** — Instatus alternative; smaller team; viable budget pick

## What a Status Page Won't Do

A status page is **public attestation, not monitoring**. Buying one doesn't:

1. **Detect outages.** Status pages are downstream of monitoring. You still need uptime checks (Better Stack, Pingdom, Datadog Synthetics, etc.) to *detect* the incident.
2. **Page on-call.** A status page doesn't wake up engineers — that's PagerDuty / Opsgenie / Better Stack on-call.
3. **Replace customer comms.** Customers expect status page + email + sometimes Slack/Twitter posts. Status page is the source of truth, not the only channel.
4. **Get you compliance certifications.** SOC 2 auditors want to see *uptime metrics with evidence* — your status page is one signal but not the audit deliverable.
5. **Improve uptime.** Performative theater if your underlying reliability is bad. Customers can tell when "all systems operational" is gaslighting.

The honest framing: a status page is the public artifact of an incident response process. If the underlying process is bad, the status page is dishonest. If the process is good, the page is a trust signal.

## Pragmatic Stack Patterns

### Pattern 1: Indie SaaS launch stack ($25-50/mo)
- **Better Stack** — uptime + status + on-call ($29/mo)
- Auto-create incidents from uptime check failures
- Subscriber notifications via email + Slack webhook to your team channel
- Custom domain `status.yourdomain.com` (CNAME to Better Stack)

This replaces: Pingdom + Statuspage + PagerDuty (~$60-100/mo) at indie scale.

### Pattern 2: Mid-market scale-up ($100-300/mo)
- **Better Stack** or **Instatus** for status page
- **Datadog** or **New Relic** for monitoring (not Better Stack at scale)
- **PagerDuty** or **Opsgenie** for on-call
- Auto-create incidents from Datadog → Statuspage via webhook

### Pattern 3: Enterprise procurement ($500-2000/mo)
- **Atlassian Statuspage Business** for the procurement checkbox ($399/mo)
- **Datadog / New Relic** for monitoring
- **PagerDuty** for on-call
- **Opsgenie / Jira Service Management** for incident workflow
- SSO + audit log + sub-pages required

### Pattern 4: OSS / minimal-cost ($0-10/mo)
- **Upptime** on GitHub Actions + Pages — free
- Email yourself when checks fail
- Manual incident posting (commit to repo)

### Pattern 5: Vendor-aware ops ($25/mo addition to any of the above)
- **StatusGator** to alert when AWS / Stripe / Resend / Twilio have incidents that affect you
- Saves the "is it us or is it Stripe?" debugging time during an active incident

## Decision Framework: Three Questions

1. **What's your ARR?**
   - Under $1M → Better Stack or Instatus (Pattern 1)
   - $1M-10M → Better Stack scaled or Instatus Pro (Pattern 2)
   - $10M+ → Statuspage Business+ if enterprise customers expect it (Pattern 3)

2. **Do enterprise buyers ask about your status page in procurement?**
   - Yes → Atlassian Statuspage is the boring-correct answer
   - No → save 5x by picking Better Stack or Instatus

3. **What's your monitoring stack?**
   - Already have Datadog/New Relic → use Statuspage or Instatus (status-only)
   - Need monitoring + status → Better Stack bundles them
   - Don't have monitoring yet → Better Stack is the consolidated answer

## Verdict

For 70% of indie SaaS in 2026: **Better Stack**. Bundles monitoring + status + on-call at $29/mo, replaces three vendors, and the status page is good enough for everyone except enterprise procurement. The consolidation alone justifies the choice.

For 20%: **Instatus**. Cheaper than Statuspage, fast page loads, feature parity for the public-status use case. Pick if you already have monitoring elsewhere.

For 8%: **Atlassian Statuspage**. The enterprise procurement checkbox. Pay the premium when "we use Statuspage" closes deals or shaves enterprise sales-cycle time. Don't pay it before that — pre-revenue founders waste money on Statuspage thinking it makes them look enterprise.

For 2%: **Upptime** or **Cachet** if you're truly minimum-budget or principled-OSS. Skip if you have paying customers.

The mistake to avoid: Statuspage Hobby at $29/mo *without* subscriber notifications. The whole point of a status page is people get notified during incidents. Hobby paywalls the feature you actually need. Either go Better Stack ($29/mo with full features), Instatus Starter ($20/mo with subs), or commit to Statuspage Business ($99/mo) — don't half-buy.

## See Also

- [CDN Providers](./cdn-providers.md) — uptime depends on your CDN
- [Cloud Cost Management Tools](./cloud-cost-management-tools.md) — companion ops tool
- [Error Monitoring Providers](../devops-and-tools/error-monitoring-providers.md) — Sentry-class tools
- [Observability Providers](../devops-and-tools/observability-providers.md) — Datadog / New Relic
- [Webhook Delivery Services](../backend-and-data/webhook-delivery-services.md) — wire incidents to your channels
- [API Gateway Providers](../backend-and-data/api-gateway-providers.md) — gateways often expose health endpoints
- [Trust Center & Security Page](https://launchweek.dev/5-launch/trust-center-security-page) — companion enterprise-trust artifact
- [SLAs Implementation Guide](https://vibeweek.dev/6-grow/service-level-agreements-chat) — defining the uptime numbers your status page reports
