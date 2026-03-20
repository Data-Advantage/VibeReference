# AI Gateways

AI Gateways are infrastructure layers that sit between your applications and AI model providers, providing unified API routing, intelligent failover, cost management, and observability across multiple providers through a single integration point.

## Why AI Gateways Matter

Modern AI applications routinely call 3-5 different providers: OpenAI for general tasks, Anthropic for coding, Google for long context, and specialized providers for image or video generation. Each provider means a separate account, separate billing, separate API format, separate rate limits, and separate failure modes.

An AI Gateway solves this by putting a single interface in front of all providers. One API key, one billing account, one integration point. When a provider goes down, the gateway automatically routes to an alternative. When costs spike, the gateway provides visibility and control.

## Core Features

### Unified API Routing

AI Gateways normalize the request and response formats across different providers. You write your integration once, and the gateway handles translating requests to each provider's native format. Most gateways implement the OpenAI-compatible API specification, making adoption straightforward for existing applications.

### Load Balancing and Fallbacks

When a provider experiences downtime or elevated latency, the gateway automatically routes requests to alternative providers. This happens transparently — your application code does not need to handle provider-specific error cases or implement retry logic.

### Caching

Identical requests can be served directly from the gateway's cache, reducing latency by up to 90% and significantly cutting costs by avoiding repeated API calls. Some gateways support semantic caching, where similar (not just identical) requests can return cached results.

### Rate Limiting

Rate limiting controls the traffic that reaches AI providers, preventing unexpected cost spikes and protecting against abuse. Gateways typically offer flexible rate limiting based on requests per time window, with both sliding and fixed window techniques.

### Observability and Analytics

Gateways provide centralized logging, cost tracking, token usage metrics, and error rate monitoring across all providers. This unified view makes it significantly easier to understand how your application uses AI and where to optimize.

### Cost Management

By centralizing all provider usage through a single gateway, teams gain visibility into total AI spend across providers. Many gateways offer features like budget alerts, cost allocation by project, and usage dashboards.

## Major AI Gateway Providers

### Cloud Platform Gateways

- **[Cloudflare AI Gateway](./cloudflare-ai-gateway)** — Free gateway with caching, rate limiting, analytics, and deep integration with the Cloudflare Workers ecosystem. Supports 20+ providers.
- **[Vercel AI Gateway](./vercel-ai-gateway)** — Tightly integrated with the Vercel AI SDK, offering automatic provider routing, model fallbacks, and pay-as-you-go pricing with no markup. Supports 100+ models.
- **Azure AI Gateway** — Enterprise-focused gateway built on Azure API Management, with deep integration into the Microsoft ecosystem.

### Unified API Providers

- **[OpenRouter](./openrouter)** — Unified API for 300+ models from 60+ providers with transparent pass-through pricing, automatic fallbacks, and OAuth PKCE support.
- **LiteLLM** — Open-source LLM proxy providing a unified interface across 100+ providers through a proxy server and Python SDK.
- **Portkey** — AI gateway with guardrails, virtual keys, and multimodal support across major providers.

### Open-Source Gateways

- **Bifrost** — High-performance open-source AI gateway built in Go, supporting 20+ providers through an OpenAI-compatible API.
- **Kong AI Gateway** — Enterprise API gateway with AI-specific plugins for routing, rate limiting, and observability.

## When to Use an AI Gateway

**You should use an AI gateway when:**

- Your application calls multiple AI providers and you want a single integration point
- You need automatic failover when providers experience downtime
- You want centralized cost tracking and usage analytics across providers
- You need rate limiting and abuse protection for AI-powered features
- You want to cache responses to reduce latency and costs

**You may not need an AI gateway when:**

- You only use a single provider with no fallback requirements
- You are building a prototype or proof-of-concept with minimal traffic
- You have custom routing logic that does not fit standard gateway patterns

## Related Resources

- [Cloudflare AI Gateway](./cloudflare-ai-gateway) — Deep dive on Cloudflare's free AI Gateway
- [Vercel AI Gateway](./vercel-ai-gateway) — Deep dive on Vercel's AI SDK-integrated gateway
- [OpenRouter](./openrouter) — Deep dive on OpenRouter's unified model API
- [Cloudflare](./cloudflare) — General Cloudflare platform overview
- [Vercel](./vercel) — General Vercel platform overview
