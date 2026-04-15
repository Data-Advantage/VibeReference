# Vercel AI Gateway

Vercel AI Gateway is a managed AI routing layer that integrates directly with the Vercel AI SDK, providing automatic provider routing, model fallbacks, and unified billing across 100+ models from major AI providers with no markup on token pricing.

## Overview

Vercel AI Gateway sits between your application and AI providers, automatically routing requests to the best available provider for each model. It is designed to work seamlessly with the Vercel AI SDK, requiring minimal code changes to add multi-provider routing and fallback capabilities to existing applications.

The gateway handles provider selection, failover, and billing through Vercel's platform, so developers can focus on building AI features rather than managing provider infrastructure.

## Key Features

### Automatic Provider Routing

AI Gateway dynamically chooses providers based on a combination of recent uptime and latency. When multiple providers offer the same model (for example, Claude is available through both Anthropic and AWS Bedrock), the gateway routes to the provider currently offering the best performance.

### Provider and Model Fallbacks

When a provider experiences downtime or a specific model is unavailable, AI Gateway automatically falls back to alternative providers or models. You can configure fallback behavior at both the provider and model level:

```typescript
import { generateText } from 'ai';
import { gateway } from '@ai-sdk/gateway';

const result = await generateText({
  model: gateway('anthropic/claude-sonnet-4-20250514'),
  prompt: 'Explain AI Gateways in one paragraph.',
  providerOptions: {
    gateway: {
      order: ['bedrock', 'anthropic'],
    },
  },
});
```

The `order` option specifies which providers to try and in what sequence. The `only` option restricts routing to a specific set of providers.

### Custom API Key Support

You can use your own API keys for any supported provider. When using custom keys, there is no markup or fee from AI Gateway — you pay only the provider's standard pricing. This is useful for teams that have existing provider contracts or volume discounts.

### Zero-Markup Pricing

When using Vercel AI Gateway Credits, token pricing matches the underlying provider's pricing with no markup. Every Vercel team account gets access to both a free tier and a paid tier for AI Gateway Credits.

## Supported Providers

Vercel AI Gateway supports routing across major AI providers including:

- **OpenAI** — GPT, o-series, and other OpenAI models
- **Anthropic** — Claude Opus, Sonnet, and Haiku model families
- **Google** — Gemini Pro, Gemini Flash, and other Google AI models
- **Mistral** — Mistral Large, Medium, and specialized models
- **AWS Bedrock** — Access to Anthropic, Meta, and other models through Bedrock
- **Meta** — Llama model family
- **Cohere** — Command and Embed models
- **xAI** — Grok models

The full model catalog is available in the Vercel AI Gateway dashboard, where you can browse models, compare pricing across providers, and view real-time availability.

## Integration with Vercel AI SDK

AI Gateway is a first-class provider in the Vercel AI SDK. You can use it with all AI SDK functions including `generateText`, `streamText`, `generateObject`, and `streamObject`:

```typescript
import { streamText } from 'ai';
import { gateway } from '@ai-sdk/gateway';

const result = streamText({
  model: gateway('openai/gpt-4o'),
  prompt: 'Write a short poem about APIs.',
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
```

The `@ai-sdk/gateway` provider wraps the gateway routing logic, so switching from a direct provider to the gateway requires changing only the model reference.

## Pricing

Vercel AI Gateway uses a pay-as-you-go model:

- **Free tier** — Includes a starter allocation of free credits when you make your first AI Gateway request
- **Paid tier** — Purchase AI Gateway Credits with no obligation to renew, with zero markup on token pricing
- **Custom API keys** — No gateway fee when using your own provider API keys

Pricing varies by model and provider. The AI Gateway dashboard shows the full pricing breakdown for each model, including variations across different providers that offer the same model.

## When to Use Vercel AI Gateway

**Best suited for:**

- Applications already deployed on Vercel or using the Vercel AI SDK
- Teams that want automatic provider failover without managing routing logic
- Projects that need access to multiple model providers through a single billing account
- Developers who want to quickly switch between models without changing integration code

**Consider alternatives when:**

- You need deep customization of routing algorithms beyond provider ordering
- You are not using the Vercel AI SDK or deploying on Vercel
- You need on-premises or self-hosted gateway capabilities
- You require features like semantic caching or guardrails

## Related Resources

- [AI Gateways](./ai-gateways) — Overview of AI Gateways and when to use them
- [Vercel](./vercel) — General Vercel platform overview
- [Cloudflare AI Gateway](./cloudflare-ai-gateway) — Alternative gateway with caching and rate limiting
- [OpenRouter](./openrouter) — Alternative unified API with 300+ models
