# Polar

Polar is a monetization platform built for developers and open-source maintainers. It provides tools for accepting payments, managing subscriptions, and selling digital products — all with a developer-friendly API and dashboard. Polar handles billing, taxes, and payouts so you can focus on building your product.

## Why Polar?

- **Developer-first**: Built specifically for developers and digital products
- **Simple pricing**: Straightforward fee structure with no hidden costs
- **Subscriptions and one-time payments**: Support for recurring billing and single purchases
- **Digital product sales**: Sell access to APIs, courses, templates, and tools
- **Open-source friendly**: Special features for monetizing open-source projects
- **Global tax handling**: Automatic VAT/sales tax collection and remittance

## Getting Started

### 1. Create an Account

Sign up at [polar.sh](https://polar.sh) and set up your organization.

### 2. Create a Product

In the Polar dashboard, create a product with pricing tiers for your SaaS or digital product.

### 3. Integrate with Your Application

```typescript
// Using Polar's checkout
const response = await fetch('https://api.polar.sh/v1/checkouts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.POLAR_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    product_id: 'your-product-id',
    success_url: 'https://yourapp.com/success',
  }),
});

const { url } = await response.json();
// Redirect user to checkout URL
```

## Key Features

- **Checkout sessions**: Create hosted checkout pages for your products
- **Webhooks**: Get notified when payments and subscriptions change
- **Customer portal**: Let users manage their own subscriptions
- **Usage-based billing**: Charge based on API calls or resource usage
- **License keys**: Generate and validate license keys for software

## Polar vs Stripe

| Feature | Polar | Stripe |
|---------|-------|--------|
| Target audience | Developers, creators | Any business |
| Setup complexity | Minutes | Hours to days |
| Tax handling | Built-in | Requires Stripe Tax add-on |
| Digital products | First-class support | Generic payment processing |
| Pricing | Simple fee per transaction | Complex fee structure |

## Best Practices

- Use webhooks to sync subscription status with your database
- Implement the customer portal link so users can self-manage subscriptions
- Test with Polar's sandbox environment before going live
- Set up proper error handling for failed payments and expired subscriptions

## Resources

- [Polar Documentation](https://docs.polar.sh)
- [Polar API Reference](https://api.polar.sh/docs)
- [Polar Dashboard](https://polar.sh)
