# OpenRouter

OpenRouter is a unified API gateway that provides access to 300+ AI models from 60+ providers through a single endpoint, with transparent pass-through pricing, automatic failover, OAuth PKCE authentication, and intelligent routing variants for optimizing cost, speed, or quality.

## Overview

OpenRouter aggregates AI models from all major providers into a single OpenAI-compatible API. Instead of managing separate accounts, API keys, and integrations for each provider, developers use one OpenRouter API key to access models from OpenAI, Anthropic, Google, Meta, Mistral, and dozens of other providers.

The platform passes through provider pricing with no markup, pools uptime across providers for better reliability, and handles automatic failover when providers experience issues.

## Key Features

### Unified OpenAI-Compatible API

OpenRouter implements the OpenAI API specification for `/chat/completions` and `/completions` endpoints. Any application or library that works with the OpenAI API can use OpenRouter by changing the base URL and API key:

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

const response = await client.chat.completions.create({
  model: 'anthropic/claude-sonnet-4-20250514',
  messages: [
    { role: 'user', content: 'What is OpenRouter?' }
  ],
});
```

This compatibility means you can switch between models from different providers without changing any integration code — only the model identifier changes.

### Automatic Failover

When a provider returns an error, OpenRouter automatically falls back to the next available provider for the same model. This happens transparently — your application receives a successful response without needing to handle provider-specific errors. You are only billed for the successful model run.

### Routing Variants

OpenRouter offers routing variants that optimize request behavior for different priorities:

- **Default** — Balanced routing considering uptime, latency, and quality
- **`:nitro`** — Providers sorted by throughput, optimizing for faster response times
- **`:floor`** — Providers sorted by price, prioritizing the most cost-effective option
- **`:online`** — Runs a web search query and attaches results to the prompt for up-to-date information
- **`:exacto`** — Quality-first routing tuned for tool-calling reliability

Use routing variants by appending them to the model identifier:

```typescript
// Use the cheapest available provider for Claude Sonnet
const response = await client.chat.completions.create({
  model: 'anthropic/claude-sonnet-4-20250514:floor',
  messages: [{ role: 'user', content: 'Hello' }],
});
```

### OAuth PKCE Authentication

OpenRouter supports OAuth PKCE (Proof Key for Code Exchange) for user-facing applications. Instead of embedding your API key in client-side code, users authenticate with their own OpenRouter account:

1. Your app redirects the user to OpenRouter's authorization page
2. The user logs in and authorizes your app
3. Your app exchanges the authorization code for a user-controlled API key
4. Requests are billed to the user's OpenRouter account

This is useful for building AI-powered tools where end users bring their own API credits.

### Model Discovery

OpenRouter provides a model catalog API that returns available models with their capabilities, pricing, context lengths, and provider availability:

```bash
curl https://openrouter.ai/api/v1/models
```

This enables applications to dynamically discover available models, display pricing to users, and adapt to new model releases without code changes.

## Supported Models and Providers

OpenRouter provides access to models from a wide range of providers:

- **OpenAI** — GPT, o-series, and other models
- **Anthropic** — Claude Opus, Sonnet, and Haiku families
- **Google** — Gemini Pro, Gemini Flash, and other Google models
- **Meta** — Llama 3, Llama 4, and other open-weight models
- **Mistral** — Mistral Large, Medium, Codestral, and others
- **DeepSeek** — DeepSeek V3, DeepSeek R1, and other models
- **Cohere** — Command R, Command R+, Embed models
- **xAI** — Grok models
- **Perplexity** — Search-augmented models
- **And many more** — The full catalog includes 300+ models across 60+ providers

The model catalog at openrouter.ai/models provides real-time availability, pricing, and capability information for all supported models.

## Pricing

OpenRouter uses transparent pass-through pricing:

- **No markup** — Pricing matches the underlying provider's rates exactly
- **Pay-as-you-go** — Buy credits and use them across any model, with optional auto-top-up
- **Per-model pricing** — Each model has its own input/output token rates, visible in the model catalog
- **Free models** — Some open-source models are available at no cost
- **Failover billing** — You are only billed for the successful provider run, not failed attempts
- **Enterprise pricing** — Volume discounts, prepayment credits, and annual commits available

There are no platform fees, subscription costs, or minimum commitments for standard usage.

## When to Use OpenRouter

**Best suited for:**

- Applications that need access to many models from different providers through one API
- Developers who want to quickly test and compare models without managing multiple provider accounts
- Production applications that need automatic failover across providers
- User-facing tools where end users bring their own API credits via OAuth
- Cost-sensitive applications that benefit from routing to the cheapest available provider

**Consider alternatives when:**

- You need advanced observability features like detailed analytics dashboards (Cloudflare AI Gateway)
- You want tight framework integration with provider routing (Vercel AI Gateway)
- You need response caching at the gateway level to reduce latency and costs
- You require on-premises or self-hosted deployment

## Related Resources

- [AI Gateways](./ai-gateways) — Overview of AI Gateways and when to use them
- [Vercel AI Gateway](./vercel-ai-gateway) — Alternative gateway integrated with Vercel AI SDK
- [Cloudflare AI Gateway](./cloudflare-ai-gateway) — Alternative gateway with free caching and analytics
