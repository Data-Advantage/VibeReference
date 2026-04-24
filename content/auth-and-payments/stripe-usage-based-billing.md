---
description: Implement usage-based (metered) billing with Stripe. Meters, meter events, pricing models, proration, and common pitfalls for SaaS and AI products.
---

# Stripe Usage-Based Billing

Usage-based billing charges customers for what they actually consume — API calls, compute minutes, AI tokens, storage — rather than a flat seat price. Stripe's metered billing is the default way most SaaS companies and AI products implement this. This guide covers the moving parts: meters, meter events, pricing models, invoice behavior, and the mistakes that cost people money in production.

## When to Use Usage-Based Billing

Metered billing fits products where customer value scales with consumption:

- **API platforms** — per-request or per-response-size pricing.
- **AI products** — per-token, per-inference, per-outcome pricing.
- **Infrastructure SaaS** — compute hours, storage, bandwidth.
- **Hybrid plans** — seat-based subscription with usage overages above an included quota.
- **Credit systems** — customers buy credits they spend across features.

If your product has a predictable, seat-aligned value (typical per-user SaaS), a flat subscription is usually simpler. See [Stripe](/auth-and-payments/stripe) for the subscription basics.

## Core Objects

Stripe's usage-based billing revolves around five objects:

| Object | Purpose |
|--------|---------|
| **Meter** | Defines the usage attribute you track (e.g., `api_calls`, `tokens_used`). |
| **Meter Event** | A single reported usage record (value + customer + timestamp). |
| **Price** | The rate card (per-unit, tiered, graduated). |
| **Product** | The sellable thing the price belongs to. |
| **Subscription** | The ongoing relationship that aggregates and bills meter events. |

## Creating a Meter

In the Stripe Dashboard, go to **Billing → Meters → Create meter**. Set:

- **Display name** — what appears on invoices (e.g., "API calls").
- **Event name** — the machine identifier used in API calls (e.g., `api_calls_used`).
- **Aggregation** — usually `sum`, but `last_during_period` and `max` are available.

Each meter represents one usage dimension. If you bill on both API calls *and* tokens, create two meters and two prices.

## Creating a Metered Price

Use `usage_type=metered` on the recurring config. The simplest shape is flat per-unit pricing:

```ts
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const price = await stripe.prices.create({
  currency: 'usd',
  unit_amount: 2,              // 2 cents per unit
  billing_scheme: 'per_unit',
  recurring: {
    interval: 'month',
    usage_type: 'metered',
  },
  product: 'prod_XYZ',
});
```

For graduated pricing (each tier bills only units in that tier):

```ts
const graduated = await stripe.prices.create({
  currency: 'usd',
  billing_scheme: 'tiered',
  tiers_mode: 'graduated',
  tiers: [
    { up_to: 1000,  unit_amount: 50 },   // $0.50 per unit, first 1,000
    { up_to: 10000, unit_amount: 40 },   // $0.40 per unit, next 9,000
    { up_to: 'inf', unit_amount: 30 },   // $0.30 per unit above that
  ],
  recurring: {
    interval: 'month',
    usage_type: 'metered',
    aggregate_usage: 'sum',
  },
  product: 'prod_XYZ',
});
```

Volume tiers (`tiers_mode: 'volume'`) bill *all* usage at the rate of the tier the customer lands in. Use volume for "committed tier" pricing and graduated for true metered pricing.

## Reporting Usage with Meter Events

Every time a customer consumes something billable, post a meter event:

```ts
await stripe.billing.meterEvents.create({
  event_name: 'api_calls_used',
  payload: {
    stripe_customer_id: 'cus_ABC',
    value: '1',
  },
  timestamp: Math.floor(Date.now() / 1000),
});
```

A few things to know:

- **The `payload` is a key/value map**, not top-level fields. `stripe_customer_id` and `value` are the standard keys.
- **`value` is a string**, not a number. Stripe parses it.
- **Timestamps can be up to 35 days in the past**, so short outages do not lose revenue if you retry.
- **Events are idempotent by `identifier`**. Pass a stable identifier per event to tolerate retries safely.

For high-volume reporting, batch at the application layer (aggregate in memory for a few seconds, then send a single meter event with a higher `value`) rather than relying on Stripe's bulk endpoints.

## Attaching the Price to a Subscription

Subscribe the customer to the metered price like any other subscription:

```ts
const sub = await stripe.subscriptions.create({
  customer: 'cus_ABC',
  items: [{ price: price.id }],
});
```

You can mix metered prices with flat-fee prices in the same subscription. A common pattern is one `licensed` price for the base plan plus one `metered` price per usage dimension.

## Invoice Behavior

At the end of each billing cycle, Stripe:

1. Aggregates meter events for that customer over the period.
2. Applies the price's rate card to compute the charge.
3. Creates an invoice line item for the usage.
4. Attempts payment per your dunning settings.

Usage invoices are finalized at period end, not in real time. If you need real-time cost visibility for customers, you have to compute it yourself from your own usage logs or from `stripe.billing.meterEventSummaries`. This is the single biggest operational surprise with Stripe metered billing.

## Proration

Stripe handles proration automatically on subscription changes. For pure metered prices, proration mostly affects the flat-fee portion of hybrid plans:

```ts
await stripe.subscriptions.update('sub_ABC', {
  items: [{ id: 'si_DEF', price: 'price_new' }],
  proration_behavior: 'create_prorations',
});
```

For usage-only prices, consumed units are billed at the period-end rate regardless of mid-cycle plan changes unless you explicitly reset meters on upgrade. Most teams do not need to.

## Pricing: What Stripe Charges You

Stripe Billing adds a platform fee on top of payment processing:

- **Starter tier**: 0.7% of billing volume.
- **Scale tier**: 0.8% of recurring revenue with enterprise features.

Standard payment processing (US cards) is 2.9% + $0.30. So total cost for a typical US card transaction with metered billing is roughly 3.6% + $0.30, before international or currency fees. At scale, negotiate directly with Stripe.

## Common Pitfalls

**Not-quite-real-time billing.** Metered usage is aggregated and billed at period end. Build your own live dashboard if customers need to see spend as it accrues. Use `stripe.billing.meterEventSummaries.list` to read Stripe's aggregated view.

**Lost events on outages.** Meter events posted during a Stripe outage or your own network blip are lost unless you retry. Persist events to a local queue (Postgres, Redis, SQS) and drain asynchronously. See [webhooks](/backend-and-data/webhook) for idempotency patterns.

**Billing before fulfillment.** If you post a meter event for an API call that later fails, you over-bill. Only emit the event after the work succeeds, or emit a compensating negative event on failure.

**Meter-naming drift.** Once a meter is in use, renaming the `event_name` is painful. Pick names carefully: nouns in present tense, snake_case, no product version numbers.

**Tier misconfiguration.** Graduated and volume tiers look similar in the dashboard but behave very differently. Volume bills *all* units at the landed rate. Graduated bills each block at its own rate. A wrong choice can 3x or 0.3x what the customer pays.

**Free tier accounting.** To give a free usage allowance (e.g., first 10,000 tokens free), use a graduated price with the first tier at `unit_amount: 0`, not a separate voucher or coupon. Coupons do not stack cleanly with metered prices.

**Customer confusion.** Show your customers the same numbers Stripe shows. Pull from `meterEventSummaries` for any in-app usage display and reconcile daily.

## Testing in Development

Use Stripe test mode and the Stripe CLI (`stripe listen`) to tail webhooks. Set `aggregation=sum` and emit a few meter events manually to verify that they appear on the draft invoice. Use `stripe subscriptions.delete` with `invoice_now=true` and `prorate=true` to force an invoice early and inspect the math before you ship.

## Alternatives

Stripe covers most usage-based billing needs, but specialized tools exist:

- **Metronome** — enterprise real-time usage, committed contracts, complex rate cards. Now Stripe-owned but still sold separately.
- **Orb** — similar positioning for AI and infrastructure companies.
- **Lago** — open-source, self-hostable metering layer that can feed Stripe or Chargebee downstream.

For most SaaS and AI products under $10M ARR, Stripe Billing with metered prices is the right answer. Revisit when your pricing complexity outgrows what Stripe's primitives can express cleanly.
