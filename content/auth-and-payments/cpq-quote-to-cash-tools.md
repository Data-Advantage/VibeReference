# CPQ & Quote-to-Cash Tools: Salesforce CPQ, DealHub, PandaDoc, GetAccept, Conga, Apttus, Subskribe, Tabs, Maxio

[⬅️ Auth & Payments Overview](../auth-and-payments/)

If you're a B2B SaaS at $10M+ ARR with sales-led GTM and complex pricing — multi-product bundles, custom pricing, multi-year contracts, expansion math — you need CPQ (Configure, Price, Quote) software. The naive approach: spreadsheet quotes; sales manager re-checks math; pricing inconsistencies sneak in. The structured approach: CPQ tool that enforces pricing rules, generates proposals with one click, integrates with CRM + billing + e-sig. Quote-to-cash is the complete flow: lead → opportunity → quote → contract → billing → revenue recognition. The right pick depends on complexity (simple tier upsells vs enterprise multi-product configurations) and stack (Salesforce-native vs standalone vs modern). For most B2B SaaS, simpler tools (PandaDoc / DealHub) suffice; complex enterprise deals need full CPQ (Salesforce CPQ / Conga).

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Salesforce CPQ | Enterprise CPQ | None | $75-150+/user/mo | Low | Salesforce-native enterprise |
| DealHub | Modern CPQ | Demo only | $$$ ($30K-150K/yr) | Medium | Modern mid-market+ |
| PandaDoc | Proposal + e-sig + light CPQ | Trial | $19-49+/user/mo | High | SMB-mid; proposal-led |
| GetAccept | Proposal + sales | Trial | $35-99+/user/mo | High | Proposal + engagement |
| Conga (CLM + CPQ) | Enterprise CPQ + contract | Custom | $$$$ | Low | Enterprise contract-heavy |
| Apttus (now Conga) | Enterprise; merged | Custom | $$$$ | Low | Legacy enterprise |
| Subskribe | Modern subscription CPQ | Demo only | $$$ | High | Modern SaaS subscriptions |
| Tabs | Modern billing + CPQ | Trial | $$$ | High | Modern; B2B SaaS |
| Maxio (Chargify + SaaSOptics) | Subscription billing + CPQ | Custom | $$$ | Medium | SaaS billing-led |
| HubSpot Quotes | HubSpot-bundled | Bundled w/ HubSpot Sales | Bundled | High | HubSpot users; light CPQ |
| Pipedrive Smart Docs | Pipedrive-native | Bundled | Bundled | High | Pipedrive users |
| Better Proposals | Proposal-focused | Trial | $19-49/user/mo | High | SMB proposals |
| Proposify | Proposal-focused | Trial | $35-65/user/mo | High | SMB / agency proposals |
| Salesforce Revenue Cloud | Quote-to-Cash full suite | Custom | $$$$+ | Low | Enterprise; full Salesforce stack |
| Oracle CPQ | Oracle ecosystem | Custom | $$$$ | Low | Oracle / enterprise |
| Subskribe / Tabs / Maxio | Modern alternatives | Custom | $$$ | High | Modern SaaS-led |

The first decision is **complexity**: simple subscriptions + basic pricing → PandaDoc / HubSpot Quotes; complex multi-product / enterprise → Salesforce CPQ / Conga / DealHub. The second decision is **stack alignment**: Salesforce-native → Salesforce CPQ; HubSpot → HubSpot Quotes; modern SaaS → Subskribe / Tabs / DealHub.

## Decide What You Need First

### Simple proposals (the 30% case)
Standard pricing; few configurations; need professional proposal + e-sig.

Right tools:
- **PandaDoc** — leader for proposal-led
- **HubSpot Quotes** — bundled
- **Better Proposals** — alternative
- **Proposify** — alternative

### Mid-market CPQ (the 30% case)
Multi-product pricing; some custom; want pricing rules enforcement.

Right tools:
- **DealHub** — modern; full CPQ
- **PandaDoc Pro** — proposal + light CPQ
- **Subskribe** — SaaS-specific
- **GetAccept** — alternative

### Enterprise CPQ + CLM (the 25% case)
Complex configurations; many products; multi-year contracts; legal review.

Right tools:
- **Salesforce CPQ** — leader; SF-native
- **Conga (CLM + CPQ)** — alternative
- **Salesforce Revenue Cloud** — full suite
- **Oracle CPQ** — Oracle ecosystem

### SaaS subscription-led (the 10% case)
Recurring billing complex; usage-based; multi-year discounts.

Right tools:
- **Subskribe** — modern SaaS CPQ
- **Tabs** — modern alternative
- **Maxio (Chargify / SaaSOptics)** — subscription billing + CPQ
- **Stripe Revenue Recognition** + **PandaDoc** — combined

### Sales-led with Salesforce (the 5% case)
Salesforce-native; want tight integration.

Right tools:
- **Salesforce CPQ** — native
- **Conga** — Salesforce-aligned
- **DealHub** with Salesforce integration

## Provider Deep-Dives

### Salesforce CPQ — enterprise leader
Originally Steelbrick; acquired by Salesforce 2015.

Pricing in 2026: $75-150+/user/mo plus Salesforce.

Features: product catalog, pricing rules, bundles, discounting, approval workflows, contract generation, renewal management; deep Salesforce integration.

Why Salesforce CPQ wins: Salesforce-native; comprehensive; enterprise-procurement; battle-tested.

Trade-offs: complex setup (3-12 months); expensive; requires consultants typically.

Pick if: Salesforce-native enterprise; complex configurations. Don't pick if: SMB / mid-market or non-Salesforce stack.

### DealHub — modern mid-market+
Founded 2014. Modern CPQ alternative.

Pricing in 2026: $30K-150K/yr.

Features: pricing rules, deal-room (proposal + collab), contract generation, e-sig integration, Salesforce / HubSpot integration.

Why DealHub: modern UX; less complex than SF CPQ; mid-market sweet spot.

Pick if: $10-50M ARR; want modern alternative to SF CPQ. Don't pick if: enterprise procurement requires SF CPQ.

### PandaDoc — proposal + e-sig leader
Founded 2011. Proposal-focused with light CPQ.

Pricing in 2026: Essentials $19/user/mo; Business $49/user/mo; Enterprise custom.

Features: proposal templates, e-sig, payment collection, light CPQ (pricing tables), CRM integration, analytics (open / read time).

Why PandaDoc: huge market share; SMB-friendly pricing; proposal + e-sig + payments combined.

Pick if: SMB-mid; proposal-led; not super-complex pricing. Don't pick if: enterprise CPQ needs.

### GetAccept — alternative
Modern proposal + sales engagement.

Pricing: $35-99+/user/mo.

Features: proposal, e-sig, video messaging, deal rooms, e-Commerce.

Pick if: alternative to PandaDoc; sales engagement focus.

### Conga — enterprise CLM + CPQ
Founded 2006. Conga + Apttus merger creates enterprise CPQ + CLM.

Pricing: enterprise.

Features: CPQ, contract lifecycle management (CLM), document automation, deep Salesforce.

Pick if: enterprise; contract-heavy; CLM matters.

### Subskribe — modern subscription CPQ
Founded 2020. SaaS-specific CPQ.

Pricing: $$$.

Features: subscription pricing, usage-based, ramp deals, multi-year, Salesforce integration.

Why Subskribe: SaaS-native; modern; growing.

Pick if: modern SaaS; subscription complexity. Don't pick if: not SaaS.

### Tabs — modern alternative
Founded 2024. Modern subscription billing + CPQ.

Pricing: $$$.

Features: similar to Subskribe; modern stack.

Pick if: alternative to Subskribe; modern stack preference.

### Maxio (Chargify + SaaSOptics) — billing-led
Combined Chargify (billing) + SaaSOptics (revenue recognition).

Pricing: $$$.

Features: subscription billing, revenue recognition, basic CPQ.

Pick if: SaaS billing-heavy with revenue recognition.

### HubSpot Quotes — bundled
HubSpot's quoting feature.

Pricing: bundled with HubSpot Sales Pro / Enterprise.

Features: quote templates, e-sig, payment collection.

Pick if: HubSpot user; light needs. Don't pick if: complex CPQ.

### Pipedrive Smart Docs — bundled
Pipedrive's quoting.

Pick if: Pipedrive user.

### Better Proposals / Proposify — SMB proposals
Smaller tools; proposal-focused.

Pick if: indie / SMB; cost-priority; proposal-only.

### Salesforce Revenue Cloud — full suite
Salesforce CPQ + Billing + Revenue Recognition + Subscription Management.

Pricing: enterprise.

Pick if: Salesforce-native; want unified.

## What CPQ Won't Do

Buying CPQ doesn't:

1. **Solve bad pricing strategy.** Tool enforces; strategy is yours.
2. **Replace Sales Ops / pricing committee.** Decisions need humans.
3. **Eliminate negotiation.** Reps still negotiate within rules.
4. **Replace billing.** CPQ generates contract; billing system bills.
5. **Replace legal review.** Custom contracts still need lawyer.

The honest framing: CPQ is pricing-as-code. Without pricing strategy, CPQ encodes chaos. With strategy, CPQ scales execution.

## When Are You Ready

```text
Ready for CPQ?

Right time signals:
- $10M+ ARR with sales-led GTM
- 5+ sales reps
- Multi-product or complex pricing
- Custom configurations on most deals
- Pricing inconsistencies (reps quote differently)
- Long contracts (multi-year, ramp deals)

Wrong time signals:
- <$5M ARR (overhead exceeds value)
- 1-3 reps (manageable manually)
- Simple subscription tiers (no real CPQ need)
- Self-serve only (CPQ unnecessary)

Investment levels:

Light ($20-50/user/mo):
- PandaDoc / HubSpot Quotes / Pipedrive
- Proposal + e-sig
- Stage: $1-10M ARR

Mid ($30K-100K/yr):
- DealHub / Subskribe / GetAccept
- Real CPQ rules
- Stage: $10-50M ARR

Enterprise ($100K-500K+/yr + implementation):
- Salesforce CPQ / Conga
- Multi-month implementation
- Dedicated admin
- Stage: $50M+ ARR

Output:
1. Readiness assessment
2. Tool recommendation
3. Implementation timeline
4. Cost
5. Owner (Sales Ops typically)
```

The "Salesforce CPQ at $5M ARR" trap: 6-month implementation; expensive consultants; wasted spend. Use PandaDoc until $20M+.

## Quote-to-Cash Flow

```text
Full quote-to-cash flow.

Stages:

1. Lead → Opportunity (CRM)
- Pre-qualified opportunity in CRM
- See sales-forecasting

2. Opportunity → Quote (CPQ)
- Configure products
- Apply pricing rules
- Approval workflows for discounts
- Generate quote

3. Quote → Proposal (CPQ + Proposal)
- Branded proposal
- ROI / value justification
- E-signable

4. Proposal → Contract (CLM / CPQ)
- Legal redlines
- Negotiation
- Signed contract

5. Contract → Order (Order Management)
- Provisioning
- Customer onboarding
- See sales-to-cs-handoff

6. Order → Invoice (Billing)
- Generate invoice
- See subscription-billing-providers

7. Invoice → Payment (Payment Processing)
- Stripe / direct
- See payment-providers

8. Payment → Revenue (Revenue Recognition)
- ASC 606 / IFRS 15 compliant
- See accounting-bookkeeping-software

9. Revenue → Renewal (CSM + CPQ)
- Renewal generated
- Negotiate
- Re-cycle

Tools per stage:

Lead → Opp: Salesforce / HubSpot
Opp → Quote: CPQ (above)
Quote → Proposal: PandaDoc / DealHub / GetAccept
Proposal → Contract: CLM (Ironclad / Conga / Docusign CLM)
Contract → Order: NetSuite / SAP / SF Order Management
Order → Invoice: Stripe Billing / Maxio / NetSuite
Invoice → Payment: Stripe / Authorize.net
Payment → Revenue: SaaSOptics / NetSuite / Sage Intacct
Revenue → Renewal: CPQ + CSM platform

Most B2B SaaS uses 3-5 of these tools; not all separately.

Output:
1. Stage map for [COMPANY]
2. Tooling per stage
3. Integration requirements
4. Owner per stage
5. Reporting cadence
```

The "tools per stage proliferation" reality: enterprise QTC = 6-10 tools. SMB-mid combines (PandaDoc + Stripe + Salesforce = covers most).

## Pragmatic Stack Patterns

### Pattern 1: Indie SaaS / pre-product-market-fit ($0)
- Manual quotes (Google Docs)
- Stripe checkout for self-serve
- Skip CPQ entirely

### Pattern 2: SMB sales-led ($30-100/user/mo)
- HubSpot Quotes OR PandaDoc
- Stripe for billing
- DocuSign for e-sig
- Total: $50-150/user/mo

### Pattern 3: Mid-market complex ($30-100K/yr)
- **DealHub** OR **Subskribe**
- Salesforce CRM
- Stripe Billing
- Total: $50-200K/yr

### Pattern 4: Enterprise Salesforce-native ($150K-500K+/yr)
- **Salesforce CPQ + Billing**
- Or: SF Revenue Cloud
- Conga CLM
- Implementation: $100K-500K + ongoing admin

### Pattern 5: Modern SaaS subscription ($30-100K/yr)
- **Subskribe** OR **Tabs**
- Stripe / Maxio for billing
- Modern stack

### Pattern 6: HubSpot-aligned ($bundled)
- HubSpot Quotes Pro
- HubSpot CMS for proposals
- Stripe for billing

### Pattern 7: Proposal-only ($20-50/user/mo)
- PandaDoc OR Better Proposals
- For agencies / project-based
- No subscription complexity

## Decision Framework: Three Questions

1. **What's your scale + complexity?**
   - <$10M ARR / simple → PandaDoc / HubSpot
   - $10-50M / mid-complex → DealHub / Subskribe
   - $50M+ / enterprise → Salesforce CPQ / Conga

2. **What's your CRM?**
   - Salesforce → Salesforce CPQ (often) / DealHub (alternative)
   - HubSpot → HubSpot Quotes / PandaDoc
   - Pipedrive → Smart Docs / PandaDoc
   - None → standalone (PandaDoc)

3. **Subscription or one-time?**
   - SaaS subscription → Subskribe / Tabs / Maxio
   - One-time deals → PandaDoc / DealHub
   - Mixed → DealHub / Salesforce CPQ

## Verdict

For 30% of B2B SaaS in 2026: **PandaDoc** for SMB-mid proposals + e-sig.

For 25%: **Salesforce CPQ** for Salesforce-native enterprise.

For 15%: **DealHub** for modern mid-market.

For 10%: **Subskribe** OR **Tabs** for modern SaaS subscriptions.

For 10%: **HubSpot Quotes** for HubSpot users.

For 5%: **Conga** for enterprise CLM-led.

For 5%: **Better Proposals / Proposify** for SMB-only.

The mistake to avoid: **Salesforce CPQ at <$20M ARR**. Long implementation; expensive; underutilized. Start with PandaDoc.

The second mistake: **CPQ without pricing strategy**. Tool enforces nothing if rules aren't defined. Pricing committee first; CPQ second.

The third mistake: **building custom CPQ in-app**. Engineering cost dwarfs subscription cost. Buy don't build.

## See Also

- [Subscription Billing Providers](./subscription-billing-providers.md) — Stripe / Maxio / Chargebee
- [Stripe](./stripe.md) — Stripe deep-dive
- [Stripe Usage-Based Billing](./stripe-usage-based-billing.md) — usage billing
- [Payment Providers](./payment-providers.md) — payment processing
- [Stripe Customer Portal](./stripe-customer-portal.md) — customer self-serve
- [Tax Compliance Tools](./tax-compliance-tools.md) — adjacent finance
- [Accounting & Bookkeeping Software](./accounting-bookkeeping-software.md) — adjacent finance
- [E-Signature & Document Signing Tools](./esignature-document-signing-tools.md) — e-sig
- [CRM Providers](../marketing-and-seo/crm-providers.md) — Salesforce / HubSpot / Pipedrive
- [Sales Engagement Platforms](../marketing-and-seo/sales-engagement-platforms.md) — Outreach / Salesloft
- [ABM Platforms](../marketing-and-seo/abm-platforms.md) — adjacent
- [Customer Success Platforms](../product-and-design/customer-success-platforms.md) — adjacent post-close
- [LaunchWeek: Sales Forecasting & Pipeline Management](https://launchweek.dev/4-convert/sales-forecasting-pipeline-management) — sales forecast
- [LaunchWeek: Sales Operations Playbook](https://launchweek.dev/4-convert/sales-operations-playbook) — sales ops
- [LaunchWeek: Sales Compensation Plans](https://launchweek.dev/4-convert/sales-compensation-plans) — comp
- [LaunchWeek: Renewal Negotiation Playbook](https://launchweek.dev/4-convert/renewal-negotiation-playbook) — renewals
- [LaunchWeek: Renewal Forecasting & Management](https://launchweek.dev/4-convert/renewal-forecasting-management) — renewal forecast
- [LaunchWeek: Pricing Strategy](https://launchweek.dev/1-position/pricing-strategy) — pricing
- [LaunchWeek: Pricing Packaging Tier Design](https://launchweek.dev/1-position/pricing-packaging-tier-design) — packaging
- [LaunchWeek: Pricing Review Cadence](https://launchweek.dev/4-convert/pricing-review-cadence) — pricing rituals
- [LaunchWeek: Annual Contract Negotiation](https://launchweek.dev/4-convert/annual-contract-negotiation) — adjacent
- [VibeWeek: Usage-Based Billing](https://vibeweek.dev/6-grow/usage-based-billing-chat) — implementation
- [VibeWeek: Quotas, Limits & Plan Enforcement](https://vibeweek.dev/6-grow/quotas-limits-plan-enforcement-chat) — limits
