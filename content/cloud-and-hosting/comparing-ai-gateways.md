# Comparing AI Gateways

AI gateways sit between your application and the AI providers — handling authentication, routing, caching, fallbacks, and observability. The right gateway depends on your infrastructure, team size, and priorities.

This guide compares the major options: Vercel AI Gateway, Cloudflare AI Gateway, OpenRouter, AWS Bedrock, Portkey, and notable open-source alternatives.

## What Is an AI Gateway?

An AI gateway is a reverse proxy for AI model APIs. Instead of calling OpenAI, Anthropic, or Mistral directly, you call the gateway — which forwards the request, handles errors, caches responses, logs everything, and routes traffic based on your configuration.

Key benefits:
- **Single integration point**: One SDK, one API key, many providers
- **Reliability**: Automatic fallback when a provider is down or slow
- **Cost control**: Semantic caching reduces duplicate API calls
- **Observability**: Centralized logs, latency tracking, and spend analytics
- **Security**: Your app never holds raw provider API keys

## Feature Comparison

| Feature | Vercel AI Gateway | Cloudflare AI Gateway | OpenRouter | AWS Bedrock | Portkey | LiteLLM |
|---------|:---:|:---:|:---:|:---:|:---:|:---:|
| **Hosted service** | ✅ | ✅ | ✅ | ✅ | ✅ | Self-hosted |
| **Self-hosted** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Open source** | ❌ | ❌ | ❌ | ❌ | ✅ (gateway) | ✅ |
| **Semantic caching** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Exact-match caching** | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| **Fallbacks / routing** | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| **Load balancing** | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| **Observability dashboard** | ✅ | ✅ | ✅ | CloudWatch | ✅ | ✅ |
| **Spend analytics** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Fine-tuning** | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **RAG / Knowledge bases** | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **IAM / SSO access control** | Vercel teams | Cloudflare | ❌ | AWS IAM | ✅ | ❌ |
| **VPC / private networking** | ❌ | ❌ | ❌ | ✅ | ❌ | Self-hosted |
| **Guardrails / content filters** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Free tier** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |

## Supported Providers

| Gateway | Providers |
|---------|-----------|
| **Vercel AI Gateway** | OpenAI, Anthropic, xAI, Google, Perplexity, Fireworks, Together AI, Groq, Azure OpenAI |
| **Cloudflare AI Gateway** | OpenAI, Anthropic, Mistral, Cohere, Google, Perplexity, Groq, AWS Bedrock, Azure OpenAI, and more |
| **OpenRouter** | 200+ models from OpenAI, Anthropic, Meta, Mistral, Google, and open-weight models |
| **AWS Bedrock** | Anthropic, Meta, Mistral, Cohere, AI21 Labs, Amazon Titan, Stability AI |
| **Portkey** | 200+ providers including all major cloud AI services and self-hosted endpoints |
| **LiteLLM** | 100+ providers with OpenAI-compatible pass-through |

## Pricing Comparison

| Gateway | Base price | Caching savings | Volume discounts |
|---------|-----------|----------------|-----------------|
| **Vercel AI Gateway** | Included in Vercel plan | Yes (exact match) | With Vercel plan |
| **Cloudflare AI Gateway** | Free (within Workers limits) | Yes (exact match) | Cloudflare plans |
| **OpenRouter** | Free gateway, pay model prices | No | No (pass-through) |
| **AWS Bedrock** | Pay-per-token (no gateway fee) | No | Provisioned throughput |
| **Portkey** | Free tier; $49–$199/mo paid | Yes (semantic + exact) | Enterprise plans |
| **LiteLLM** | Free (self-hosted) | Yes | N/A (you host it) |

OpenRouter passes provider costs to you at or slightly above list price. Vercel and Cloudflare gateways are add-ons to their existing platforms. Portkey's paid tiers unlock guardrails and longer log retention.

## Gateway Profiles

### Vercel AI Gateway

Best for teams already on Vercel. Tight integration with the Vercel AI SDK — pass `gateway()` in your config and observability is automatic. No separate account or API key. Caching is exact-match only. Does not support fallbacks or load balancing across providers.

```typescript
import { gateway } from '@vercel/ai-sdk-gateway';
import { generateText } from 'ai';

const { text } = await generateText({
  model: gateway('openai/gpt-4o'),
  prompt: 'Hello',
});
```

**Strengths**: Zero-setup for Vercel users, integrated spend dashboard
**Limitations**: No fallbacks, no semantic caching, Vercel-only

---

### Cloudflare AI Gateway

Best for teams building on Cloudflare Workers or Pages. The gateway runs at Cloudflare's edge — low latency, global distribution, and no additional infrastructure. Supports a wide range of providers with exact-match caching and rate limiting.

```typescript
const response = await fetch(
  'https://gateway.ai.cloudflare.com/v1/{account-id}/{gateway-id}/openai/chat/completions',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'Hello' }],
    }),
  }
);
```

**Strengths**: Edge-native, free tier, easy to set up
**Limitations**: No fallbacks, no semantic caching, no routing logic

---

### OpenRouter

OpenRouter is a marketplace-style gateway focused on model access and cost. It provides a unified OpenAI-compatible API across 200+ models — including many open-weight models not available elsewhere — with automatic routing to the cheapest or fastest available provider for each model.

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

const response = await client.chat.completions.create({
  model: 'anthropic/claude-3.5-sonnet',
  messages: [{ role: 'user', content: 'Hello' }],
});
```

**Strengths**: Widest model selection, competitive pricing, fallback routing built in
**Limitations**: No caching, limited observability, less enterprise-focused

---

### AWS Bedrock

Bedrock is the best choice when your team is already on AWS and needs AI within the AWS security boundary. It's not a "gateway" in the traditional sense — it's a managed AWS service — but it plays the same role: multi-provider model access through a single API.

IAM integration is the defining feature. You control model access with the same IAM roles and policies you use for every other AWS service. Inference traffic can stay inside your VPC.

**Strengths**: IAM access control, VPC isolation, fine-tuning, knowledge bases
**Limitations**: AWS-only, no semantic caching, no cross-cloud routing

→ See [AWS Bedrock as an AI Gateway](./aws-bedrock)

---

### Portkey

Portkey is the most feature-complete managed gateway. It offers semantic caching (not just exact-match), automatic fallbacks, load balancing, granular observability, virtual key management, prompt versioning, and guardrails — all in one product.

It's also the only major hosted gateway with a fully open-source core (self-hostable).

**Strengths**: Semantic caching, fallbacks, virtual keys, self-hosting option
**Limitations**: Paid plans required for guardrails and longer log retention

→ See [Portkey AI Gateway](./portkey-ai-gateway)

---

### LiteLLM

LiteLLM is a self-hosted Python proxy that exposes an OpenAI-compatible API across 100+ providers. It's the standard choice for ML engineering teams that want full control and are comfortable running infrastructure.

```bash
pip install litellm[proxy]
litellm --model anthropic/claude-3-5-sonnet-20241022 --port 8000
```

**Strengths**: Full open source, no vendor lock-in, excellent Python ecosystem
**Limitations**: Requires infrastructure management, no hosted observability dashboard

---

### Helicone

Helicone focuses on observability rather than routing. It's a logging proxy — you route requests through Helicone and it captures logs, costs, latency, and user sessions. It doesn't do caching, fallbacks, or multi-provider routing natively.

**Strengths**: Best-in-class logging UX, session tracking, prompt versioning
**Limitations**: Observability only — not a full gateway

## Decision Guide

### For startups

**Start with Vercel AI Gateway or Cloudflare AI Gateway** if you're on those platforms — zero setup cost, good enough for most early-stage use cases.

**Use OpenRouter** if you want to experiment with many models cheaply without setting up accounts at each provider.

**Add Portkey** once you need production reliability (fallbacks + caching) or when observability becomes critical.

### For cost-sensitive workloads

**Portkey with semantic caching** typically delivers the highest cost savings on workloads with repetitive prompts (support bots, FAQ systems, summarization pipelines). 20–40% cache hit rates are common.

**OpenRouter** can reduce costs by routing to the cheapest provider for each request automatically.

### For enterprise and compliance

**AWS Bedrock** if you're on AWS and need VPC isolation, IAM access control, or data residency guarantees.

**Portkey (self-hosted)** if you need a full gateway stack but cannot send data outside your own infrastructure.

**Cloudflare AI Gateway** if you're on Cloudflare Enterprise and need edge-native performance with SOC 2 compliance.

### For ML/platform teams

**LiteLLM** is the most flexible option for teams that run their own infrastructure and want full control. It integrates with LangChain, LlamaIndex, and most Python ML tooling.

## Summary

| Use Case | Recommended Gateway |
|----------|-------------------|
| Already on Vercel | Vercel AI Gateway |
| Already on Cloudflare Workers | Cloudflare AI Gateway |
| Maximum model variety, low setup | OpenRouter |
| AWS + compliance requirements | AWS Bedrock |
| Full-featured managed gateway | Portkey |
| Self-hosted, Python-first | LiteLLM |
| Observability-first (single provider) | Helicone |
| Maximum control, no vendor lock-in | LiteLLM or Portkey (self-hosted) |

## Related Resources

- [AWS Bedrock as an AI Gateway](./aws-bedrock)
- [Portkey AI Gateway](./portkey-ai-gateway)
- [Cloudflare](./cloudflare)
- [Vercel](./vercel)
- [AI SDK](../ai-development/ai-sdk)
