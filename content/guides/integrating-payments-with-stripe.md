---
title: "Integrating Payments with Stripe"
---

# Integrating Payments with Stripe

Subscriptions, checkout flows, webhooks, customer portal, and testing with Stripe CLI.

## Overview

Most SaaS apps follow this payment flow:
1. User clicks "Upgrade" → Redirected to Stripe Checkout
2. User pays → Stripe sends a webhook to your app
3. Your app updates the user's subscription status in the database
4. User manages billing through Stripe Customer Portal

## Setup

### Install dependencies

```bash
npm install stripe
```

### Environment variables

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
```

### Create the Stripe client

```typescript
// lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})
```

## Creating a Checkout Session

When a user clicks "Upgrade," create a Checkout Session and redirect them:

```typescript
// app/api/checkout/route.ts
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { priceId } = await request.json()

  // Get or create Stripe customer
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  let customerId = subscription?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${request.headers.get('origin')}/dashboard?upgraded=true`,
    cancel_url: `${request.headers.get('origin')}/pricing`,
    metadata: { supabase_user_id: user.id },
  })

  return NextResponse.json({ url: session.url })
}
```

Client-side redirect:

```typescript
async function handleUpgrade(priceId: string) {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId }),
  })
  const { url } = await response.json()
  window.location.href = url
}
```

## Handling Webhooks

Webhooks are how Stripe tells your app about payment events. This is the most critical part of your integration.

```typescript
// app/api/webhooks/stripe/route.ts
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

// Use service role for webhook handler (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      )
      await supabase.from('subscriptions').upsert({
        user_id: session.metadata!.supabase_user_id,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: subscription.id,
        plan: 'pro',
        status: 'active',
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      await supabase
        .from('subscriptions')
        .update({
          status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      await supabase
        .from('subscriptions')
        .update({ status: 'canceled', plan: 'free' })
        .eq('stripe_subscription_id', subscription.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
```

## Stripe Customer Portal

Let users manage their subscription (change plan, update payment, cancel) through Stripe's hosted portal:

```typescript
// app/api/billing-portal/route.ts
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  if (!subscription?.stripe_customer_id) {
    return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${request.headers.get('origin')}/settings`,
  })

  return NextResponse.json({ url: session.url })
}
```

## Testing with Stripe CLI

### Install and setup

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

The CLI will output a webhook signing secret (starts with `whsec_`). Use this as your `STRIPE_WEBHOOK_SECRET` during development.

### Test card numbers

| Card | Scenario |
|------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 3220` | 3D Secure required |
| `4000 0000 0000 9995` | Payment declined |
| `4000 0025 0000 3155` | Requires authentication |

### Trigger test events

```bash
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
```

## Checking Subscription Status

Create a utility to check the user's plan:

```typescript
// lib/subscription.ts
import { createClient } from '@/lib/supabase/server'

export async function getUserPlan() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 'free'

  const { data } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .single()

  if (!data || data.status !== 'active') return 'free'
  return data.plan
}

export async function requirePlan(requiredPlan: string) {
  const plan = await getUserPlan()
  if (plan !== requiredPlan && plan !== 'enterprise') {
    throw new Error('Upgrade required')
  }
}
```

## Common Pitfalls

1. **Never trust client-side plan checks** — Always verify subscription status server-side before granting access to paid features.

2. **Handle webhook retries** — Stripe retries failed webhooks. Make your handler idempotent by using `upsert` instead of `insert`.

3. **Use Stripe's test mode** — Never test with real cards. Use `sk_test_` keys and test card numbers.

4. **Don't store card details** — Stripe Checkout and the Customer Portal handle all payment UI. You never need to touch card numbers.

5. **Configure the Customer Portal** — Go to Stripe Dashboard > Settings > Billing > Customer Portal and enable the features you want (cancel, switch plans, update payment).
