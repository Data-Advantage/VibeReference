# HubSpot

HubSpot is an all-in-one CRM and marketing platform that helps businesses manage customer relationships, automate marketing, track sales pipelines, and provide customer support. For SaaS applications, HubSpot offers APIs for integrating CRM data, creating contacts, tracking events, and automating email campaigns.

## Key Products

- **CRM**: Free contact management and deal tracking
- **Marketing Hub**: Email marketing, landing pages, forms, and automation
- **Sales Hub**: Pipeline management, email sequences, and meeting scheduling
- **Service Hub**: Help desk, ticketing, and customer feedback
- **CMS Hub**: Website builder with personalization

## Getting Started

### 1. Create an Account

Sign up for a free CRM at [hubspot.com](https://www.hubspot.com).

### 2. Get API Access

Create a private app in Settings > Integrations > Private Apps to get an access token.

### 3. Install the SDK

```bash
npm install @hubspot/api-client
```

### 4. Use the API

```typescript
import { Client } from '@hubspot/api-client';

const hubspot = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

// Create a contact
const contact = await hubspot.crm.contacts.basicApi.create({
  properties: {
    email: 'user@example.com',
    firstname: 'Jane',
    lastname: 'Doe',
  },
});
```

## Common Integrations for SaaS

- **User signup tracking**: Create CRM contacts when users register
- **Lead scoring**: Track user behavior and score leads automatically
- **Email automation**: Send onboarding sequences and drip campaigns
- **Customer support**: Route support tickets from your app to HubSpot
- **Analytics**: Track conversion events and marketing attribution

## Best Practices

- Use HubSpot's free CRM tier to start — it includes contact management and basic tracking
- Set up webhooks to sync data between your app and HubSpot in real time
- Use HubSpot forms or the API for lead capture on your landing pages
- Implement lifecycle stage tracking to understand your customer journey

## Resources

- [HubSpot Developer Documentation](https://developers.hubspot.com/docs)
- [HubSpot API Reference](https://developers.hubspot.com/docs/api/overview)
- [HubSpot Academy](https://academy.hubspot.com) (free courses)
