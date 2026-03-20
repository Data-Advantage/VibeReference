# Cloudflare AI Gateway

Cloudflare AI Gateway is a free observability and control layer for AI applications that provides caching, rate limiting, analytics, cost tracking, and request management across 20+ AI providers, deeply integrated with the Cloudflare Workers ecosystem.

## Overview

Cloudflare AI Gateway acts as a proxy between your application and AI providers. By routing requests through the gateway, you gain visibility into usage patterns, control over costs, and resilience through caching and fallbacks — all without changing your application's core logic.

The gateway is available on all Cloudflare plans, including the free tier. Core features like analytics, caching, rate limiting, and logging have no per-call gateway fee.

## Key Features

### Caching

AI Gateway can serve identical requests directly from Cloudflare's global edge cache, reducing latency by up to 90% and significantly cutting costs by avoiding repeated API calls to providers. This is especially effective for applications with predictable query patterns, such as FAQ bots, documentation assistants, or classification tasks.

Cache behavior is configurable per gateway:

- **TTL control** — Set how long cached responses remain valid
- **Cache bypass** — Skip cache for specific requests when fresh responses are needed
- **Cache analytics** — Monitor hit rates to understand cost savings

### Rate Limiting

Rate limiting prevents unexpected cost spikes and protects against abuse. You can configure limits based on:

- **Requests per time window** — Set maximum requests per second, minute, or hour
- **Sliding or fixed windows** — Choose the counting method that fits your use case
- **Per-user or global limits** — Apply limits at different granularity levels

### Analytics and Logging

The AI Gateway dashboard provides real-time visibility into:

- **Request volume** — Total requests, successful responses, and errors
- **Token usage** — Input and output tokens consumed per model and provider
- **Cost tracking** — Estimated spend across all providers
- **Latency metrics** — Response times by provider and model
- **Error rates** — Provider-level error tracking for debugging

All requests are logged with full request and response metadata, enabling post-hoc analysis and debugging.

### Request Retries and Model Fallback

When a provider returns an error, AI Gateway can automatically retry the request or fall back to an alternative model or provider. This keeps your application running even when individual providers experience outages.

### Guardrails

AI Gateway includes content moderation and safety features that can filter requests and responses based on configurable rules, helping prevent misuse and enforce content policies.

## Supported Providers

Cloudflare AI Gateway supports a broad range of AI providers:

- **OpenAI** — GPT-4o, GPT-4 Turbo, o1, o3, and other models
- **Anthropic** — Claude model family
- **Google AI Studio** — Gemini models
- **Google Vertex AI** — Enterprise Gemini access
- **AWS Bedrock** — Multi-provider managed models
- **Azure OpenAI** — Microsoft-hosted OpenAI models
- **Mistral AI** — Mistral and Mixtral models
- **Meta / Llama** — Via supported inference providers
- **Groq** — High-speed inference
- **Cohere** — Command and Embed models
- **DeepSeek** — DeepSeek models
- **xAI** — Grok models
- **Workers AI** — Cloudflare's own serverless AI inference
- **Replicate** — Open-source model hosting
- **HuggingFace** — Open-source model inference
- **Perplexity** — Search-augmented models
- **ElevenLabs** — Voice and audio generation
- **Fal AI** — Image and video generation

## Workers AI Integration

Cloudflare AI Gateway integrates natively with Workers AI, Cloudflare's serverless AI inference platform. You can route Workers AI requests through the gateway using either the REST API or an environment binding in your Worker script:

```javascript
// Using the AI binding in a Cloudflare Worker
export default {
  async fetch(request, env) {
    const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'user', content: 'What is an AI Gateway?' }
      ],
    });

    return Response.json(response);
  },
};
```

When the Worker is configured with an AI Gateway binding, all `env.AI.run()` calls automatically route through the gateway, gaining caching, rate limiting, and analytics without additional code.

## Universal Endpoint

For non-Workers applications, AI Gateway provides a universal endpoint that proxies requests to any supported provider. You prepend the gateway URL to your existing provider API calls:

```bash
# Instead of calling OpenAI directly:
# https://api.openai.com/v1/chat/completions

# Route through AI Gateway:
curl https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openai/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

This works with any HTTP client or SDK — you only need to change the base URL.

## Pricing

Cloudflare AI Gateway is free on all Cloudflare plans:

- **No per-call gateway fee** — Core gateway features (analytics, caching, rate limiting, logging) are free
- **Provider costs** — You pay the underlying AI provider directly for model usage
- **Unified Billing** — Cloudflare offers the option to pay for third-party model usage directly through your Cloudflare invoice, with a small transaction convenience fee
- **Workers AI** — Cloudflare's own inference service has its own pricing, with a generous free tier

## When to Use Cloudflare AI Gateway

**Best suited for:**

- Applications already using Cloudflare Workers or the Cloudflare developer platform
- Teams that want free caching and rate limiting for AI requests
- Projects that need detailed analytics and cost tracking across providers
- Applications with predictable query patterns that benefit from response caching
- Teams that want a single dashboard for all AI provider usage

**Consider alternatives when:**

- You need tight SDK integration (Vercel AI Gateway may be better for AI SDK users)
- You want a unified API that normalizes request formats across providers (OpenRouter or LiteLLM)
- You need advanced routing features like cost-optimized or throughput-optimized routing
- You require an on-premises or self-hosted solution

## Related Resources

- [AI Gateways](./ai-gateways) — Overview of AI Gateways and when to use them
- [Cloudflare](./cloudflare) — General Cloudflare platform overview
- [Vercel AI Gateway](./vercel-ai-gateway) — Alternative gateway integrated with Vercel AI SDK
- [OpenRouter](./openrouter) — Alternative unified API with 300+ models
