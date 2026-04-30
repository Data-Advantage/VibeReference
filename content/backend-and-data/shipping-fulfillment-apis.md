# Shipping & Fulfillment APIs: ShipEngine, EasyPost, Shippo, Shipwell, Sendle, Stamps.com, ShipStation

[⬅️ Backend & Data Overview](../backend-and-data/)

If you're building any e-commerce, marketplace, returns management, or physical-product B2B SaaS in 2026, you'll need to integrate with carriers (USPS / UPS / FedEx / DHL) for label generation, rates, tracking, and address validation. The naive approach: integrate each carrier API directly. The structured approach: use a multi-carrier shipping aggregator (ShipEngine / EasyPost / Shippo) that abstracts away carrier APIs and gives you negotiated rates, tracking webhooks, and one integration. The right pick depends on volume (free tiers under 100 labels/mo) and feature focus (label-generation-led vs returns-led vs full TMS).

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| ShipEngine (ShipStation) | Multi-carrier API | 100 labels/mo free | $0.05-0.50/label | High | Label generation API default |
| EasyPost | Multi-carrier API | 120K labels/yr free dev | $0.05/label + carrier | Very high | Developer-first; broad carriers |
| Shippo | Multi-carrier API | Pay-as-you-go | $0.05/label + carrier | High | SMB-friendly; pay-per-label |
| Shipwell | TMS + APIs | Custom | Enterprise | Low | Enterprise freight / TMS |
| Sendle | Australian / NZ courier | Custom | Per-shipment | High | Australia / NZ small biz |
| Stamps.com / Endicia | USPS-focused | Trial | $17.99-39.99/mo | Medium | USPS-heavy SMB |
| Pirate Ship | USPS labels | Free | Carrier rates pass-through | Very high | Free USPS-only labels |
| ShipStation | Order management + shipping | Trial | $9.99-159+/mo | High | E-commerce order ops |
| Shipium | Modern shipping API | Custom | Enterprise | Medium | High-volume e-comm |
| ShipBob | 3PL fulfillment | Custom | Per-pick + storage | High | Full 3PL outsourcing |
| Shippo (Onboarder) | Returns mgmt | Bundled | Per-return | High | Returns management |
| Loop Returns | Returns-focused | Custom | $$$ | Medium | E-comm returns specialist |
| Aftership | Tracking + post-purchase | Free tier | $11-179+/mo | High | Tracking + customer notifications |
| ParcelPanel / TrackingMore | Tracking aggregators | Free tier | $9-249/mo | Medium | Cheaper tracking alternatives |
| Goshippo / Ware2Go | Hybrid 3PL | Custom | Per-pick | Medium | Smaller 3PL networks |

The first decision is **what you need**: just labels (ShipEngine / EasyPost / Shippo / Pirate Ship) vs full order management (ShipStation / Shopify Shipping) vs full 3PL outsourcing (ShipBob). The second decision is **scale**: under 100 labels/mo free options work; above 1K/mo, negotiate carrier rates separately.

## Decide What You Need First

### Multi-carrier label generation API (the 50% case)
You need to print shipping labels from your app. Multi-carrier (USPS / UPS / FedEx / DHL).

Right tools:
- **ShipEngine** (ShipStation) — default for B2B SaaS
- **EasyPost** — developer-first alternative
- **Shippo** — SMB-friendly
- **Shipium** — modern enterprise
- **Pirate Ship** — USPS-only free option

### Order management + shipping (the 25% case)
You're an e-commerce store or marketplace; need order import + label printing + tracking.

Right tools:
- **ShipStation** — leader for SMB e-commerce
- **Shopify Shipping** — if Shopify-based
- **Veeqo** (Amazon-owned) — alternative
- **EasyShip** — international shipping focus

### Tracking + post-purchase (the 15% case)
Customers ordered; you need to keep them informed (tracking page, branded emails).

Right tools:
- **AfterShip** — tracking + branded experience
- **ParcelPanel** — alternative
- **TrackingMore** — alternative
- **Shippo / EasyPost tracking webhooks** — DIY tracking

### Returns management (the 10% case)
You handle returns; need return labels, exchanges, refunds.

Right tools:
- **Loop Returns** — leader for e-commerce returns
- **Returnly** (acquired by Affirm) — alternative
- **Happy Returns** (PayPal) — physical drop-off network
- **Shippo / EasyPost return labels** — basic

### 3PL — outsource fulfillment (the 5% case)
You don't want to ship. Send inventory to a 3PL; they pick + pack + ship.

Right tools:
- **ShipBob** — leader for SMB 3PL
- **ShipMonk** — alternative
- **Red Stag** — premium / heavy items
- **Amazon FBA** — if Amazon-aligned
- **Deliverr** (Shopify) — Shopify-aligned

### Enterprise freight / TMS (the 5% case)
LTL / freight / cross-border / multi-modal logistics.

Right tools:
- **Shipwell** — TMS
- **Project44** — visibility
- **Convoy** (acquired by Flexport) — freight
- **Flexport** — enterprise freight forwarding

## Provider Deep-Dives

### ShipEngine (ShipStation API) — multi-carrier API default
Owned by ShipStation (acquired by Auctane).

Pricing in 2026: 100 labels/mo free; pay-as-you-go ~$0.05-0.50 per label depending on plan + carrier rates pass-through.

Features: label generation across 70+ carriers; rate shopping; address validation; tracking; manifest generation; insurance; multi-package shipments; international customs forms; webhooks.

Why ShipEngine: broad carrier coverage; reliable; good docs; ShipStation parent company.

Pick if: B2B SaaS adding shipping; standard label needs. Don't pick if: very-high-volume (negotiate direct carrier accounts).

### EasyPost — developer-first
Founded 2012. Modern API-first shipping platform.

Pricing in 2026: 120K labels/year free (dev tier); $0.05-0.10/label paid + carrier rates.

Features: label generation across 100+ carriers; rate shopping; tracking; insurance; address validation; smart routing; webhooks; React Native + native SDKs; pickups; manifests.

Why EasyPost: developer experience focus; clean API; modern docs; YC alumni.

Pick if: developer-first culture; want clean SDK. Don't pick if: enterprise procurement requires established brand.

### Shippo — SMB-friendly
Founded 2014. SMB e-commerce focus.

Pricing in 2026: Pay-as-you-go ($0.05-0.10/label + carrier); Pro $19/mo (5 user discounted rates).

Features: label generation, rate shopping, tracking, returns, address validation, white-label tracking page, integrations with Shopify / WooCommerce / BigCommerce.

Why Shippo: SMB-friendly UX; pay-as-you-go simple; Shopify ecosystem strong.

Pick if: SMB / cost-sensitive; e-commerce-native. Don't pick if: enterprise volume.

### ShipStation — order management + shipping
Founded 2011. E-commerce order ops + label printing.

Pricing in 2026: Starter $9.99/mo; Bronze $29.99/mo; Silver $59.99/mo; Gold $99.99/mo; Platinum $159+/mo.

Features: order import from 100+ marketplaces; multi-carrier label printing; automation rules; branded tracking; reports; integrations.

Why ShipStation: order management bundled with shipping; 100K+ customers; e-commerce-native.

Pick if: e-commerce store with multi-channel orders. Don't pick if: API-first SaaS (use ShipEngine API instead).

### ShipBob — 3PL fulfillment
Founded 2014. SMB-focused 3PL.

Pricing in 2026: per-pick + storage; typically $3-8/order + $0.50-2/cubic ft/mo storage.

Features: warehouses across US/EU; pick + pack + ship; returns; inventory management; integrations.

Why ShipBob: SMB-friendly 3PL; multiple warehouses for 2-day delivery; tech-forward.

Pick if: e-commerce wanting to outsource fulfillment. Don't pick if: high-margin specialty (rates may not work).

### AfterShip — tracking + post-purchase
Founded 2012. Tracking + post-purchase experience.

Pricing in 2026: Free (limited shipments); Essentials $11/mo; Pro $89/mo; Premium $179+/mo.

Features: tracking aggregation across 1000+ carriers; branded tracking pages; email + SMS notifications; analytics; returns; product reviews.

Pick if: post-purchase customer experience focus. Don't pick if: just need tracking webhooks (use EasyPost / Shippo built-in).

### Pirate Ship — free USPS labels
Founded 2014. Free USPS labels; pass-through rates.

Pricing: free product; carrier rates pass-through (negotiated commercial rates).

Features: USPS labels only; bulk printing; integrations.

Why Pirate Ship: literally free; great commercial USPS rates.

Pick if: USPS-only domestic shipping; cost-priority. Don't pick if: multi-carrier / international.

### Loop Returns / Returnly / Happy Returns — returns
Returns-management specialists.

Pricing: per-return or subscription.

Features: branded return portal; exchanges; store credit; analytics; physical drop-off (Happy Returns).

Pick if: e-commerce with high return rates needing returns-as-experience.

### Stamps.com / Endicia — USPS legacy
Founded 1996/1996. USPS-focused legacy services.

Pricing: $17.99-39.99/mo + USPS pass-through.

Pick if: USPS-only legacy; SMB. Don't pick if: modern multi-carrier needed (Pirate Ship cheaper for USPS-only).

### Shipium — modern high-volume
Founded 2020. Modern shipping platform for high-volume e-commerce.

Pricing: enterprise.

Features: rate shopping, optimization, multi-carrier, real-time decisioning.

Pick if: 100K+ orders/mo; want optimization. Don't pick if: smaller scale.

## What Shipping APIs Won't Do

Buying a shipping API doesn't:

1. **Negotiate carrier rates for you (mostly).** Aggregators offer "discounted" rates, often equivalent to ~50K-100K shipments/year direct contracts. If you're 1M+ shipments, negotiate direct.
2. **Solve customs / international.** International shipping has thousand-page rulebooks. Aggregators help with forms; brokers help with details.
3. **Replace WMS / inventory.** Shipping APIs print labels; WMS handles where the inventory is.
4. **Handle returns logistics.** Return labels are different from the broader returns experience (Loop / Returnly fill that gap).
5. **Solve last-mile in dense urban / rural edge.** USPS works most places; UPS / FedEx have edge cases. Plan for failures.

The honest framing: shipping APIs handle the easy 80% (commodity carriers, common shipments). The hard 20% (DIM weight surcharges, residential surcharges, fuel surcharges, peak surcharges, dimensional discrepancies, customs delays) is where edge cases bite.

## Carrier Rate Negotiation

```text
Carrier rate negotiation framework.

For volumes:
- <1K shipments/year: aggregator rates are best you'll get
- 1K-50K/yr: aggregator rates often beat direct (their volume helps)
- 50K-500K/yr: negotiate direct with USPS commercial / UPS / FedEx
- 500K+: hire dedicated logistics ops; multi-carrier optimization

Negotiation levers:
- Volume commitment
- Multi-carrier diversity (signal you'll switch)
- Long-term contract
- Marketing / case study (unusual)
- Referral / lead introduction (rare)

Sources for negotiation expertise:
- Shipware / Reveel (consultants)
- Logistics consultants
- Direct carrier reps (free; biased)

Anti-patterns:
- Negotiating one carrier without comparing
- Accepting "list rates" (lists are 30-60% above negotiated)
- Not auditing surcharges (DIM, residential, fuel — easy 5-15% overcharge)
- Multi-year contracts with no out

Output:
1. Negotiation recommendation for [VOLUME]
2. Key levers for your situation
3. Audit / consultant recommendation
4. Comparison framework (USPS vs UPS vs FedEx)
5. Renegotiation cadence (annual minimum)
```

The audit-your-bill rule: 5-15% of carrier charges are mistakes (wrong DIM weight, wrong zone, missing discounts). Hire an auditor (Shipware / Reveel) on a contingency basis (they take % of recovered).

## Pragmatic Stack Patterns

### Pattern 1: Indie SaaS adding shipping ($0-100/mo)
- **EasyPost** (120K free dev tier) OR **ShipEngine** (100 free)
- Multi-carrier labels via API
- Webhook-based tracking

### Pattern 2: SMB e-commerce ($30-160/mo)
- **ShipStation Bronze/Silver** for order management
- Or **Shopify Shipping** if Shopify
- Multi-carrier labels via UI

### Pattern 3: Mid-market e-commerce ($500-5K/mo)
- **ShipEngine API** for labels
- **AfterShip** for branded tracking
- **Loop Returns** for returns
- Direct carrier contracts negotiated

### Pattern 4: 3PL outsource ($per-pick)
- **ShipBob** for fulfillment
- Inventory in 3-5 warehouses
- API integration for orders / status

### Pattern 5: Enterprise / high-volume ($$$)
- Direct carrier contracts (USPS / UPS / FedEx)
- **Shipium** for optimization
- **Project44** for visibility
- In-house logistics ops team

### Pattern 6: USPS-only / cost-priority ($0)
- **Pirate Ship** free USPS labels
- Skip the aggregator entirely

### Pattern 7: International / freight ($$$+)
- **Flexport** for freight forwarding
- **Shipwell** for TMS
- **DHL / FedEx** direct for international parcels

## Decision Framework: Three Questions

1. **What scope do you need?**
   - Just labels → ShipEngine / EasyPost / Shippo
   - Order mgmt + labels → ShipStation
   - Tracking experience → AfterShip
   - Returns → Loop / Returnly
   - Outsourced fulfillment → ShipBob / ShipMonk

2. **What's your volume?**
   - <100/mo → Free tiers (ShipEngine / EasyPost)
   - 100-1K/mo → Pay-as-you-go (Shippo / EasyPost)
   - 1K-50K/mo → Aggregator paid tiers
   - 50K+/mo → Direct carrier contracts + aggregator API

3. **What's your geography?**
   - US-only → Pirate Ship + ShipEngine works
   - North America → All majors work
   - International → EasyPost / Shippo + carrier-specific (DHL Express)
   - Australia / NZ → Sendle + locals

## Verdict

For 50% of B2B SaaS in 2026 needing shipping: **ShipEngine** (or **EasyPost** for dev-first). Multi-carrier label API; reasonable pricing.

For 25%: **ShipStation**. E-commerce order management included.

For 10%: **Shippo**. SMB pay-as-you-go.

For 5%: **Pirate Ship**. USPS-only free.

For 5%: **ShipBob** OR **ShipMonk**. Outsourced 3PL.

For 5%: Enterprise (Shipium / Project44 / Flexport).

The mistake to avoid: **integrating carriers directly when starting**. Each carrier API is its own project (USPS WebTools, UPS API, FedEx Web Services). Use an aggregator until you're at 100K+/year volume.

The second mistake: **skipping bill audits**. 5-15% of charges are mistakes. Audit annually; hire contingency-based auditor at scale.

The third mistake: **ignoring DIM weight**. Carriers charge by greater of weight OR dimensional weight. Bulky items get surprise charges. Test edge cases.

## See Also

- [Email Providers](./email-providers.md) — shipping notification emails
- [Notification Providers](./notification-providers.md) — multi-channel shipping notifications
- [Webhook Delivery Services](./webhook-delivery-services.md) — tracking webhooks
- [API Integration](./api-integration.md) — generic integration patterns
- [Headless Commerce Platforms](../frontend/headless-commerce-platforms.md) — adjacent commerce stack
- [Subscription Billing Providers](../auth-and-payments/subscription-billing-providers.md) — billing pairs with shipping
- [Tax Compliance Tools](../auth-and-payments/tax-compliance-tools.md) — international tax + customs
- [Maps & Geocoding APIs](./maps-geocoding-apis.md) — address validation, last-mile mapping
- [Identity Verification & KYC Tools](../auth-and-payments/identity-verification-kyc-tools.md) — adjacent commerce trust
- [VibeWeek: Email Deliverability](https://vibeweek.dev/6-grow/email-deliverability-chat) — shipping notifications
- [VibeWeek: Outbound Webhooks](https://vibeweek.dev/6-grow/outbound-webhooks-chat) — tracking webhook delivery
- [LaunchWeek: International Expansion Playbook](https://launchweek.dev/3-distribute/international-expansion-playbook) — shipping plays into expansion
