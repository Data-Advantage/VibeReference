# Portkey AI Gateway

Portkey is an AI gateway that provides a unified API across 200+ language models with built-in fallbacks, load balancing, semantic caching, and an observability dashboard. It's available as a managed cloud service or as a self-hosted open-source deployment.

Portkey sits between your application and the AI providers. Your app calls Portkey once; Portkey handles provider routing, retries, caching, and logging. You get a single integration point regardless of how many AI providers you use.

## Overview

| Property | Details |
|----------|---------|
| Type | AI gateway (cloud or self-hosted) |
| Open source | Yes (gateway core on GitHub) |
| Supported providers | 200+ (OpenAI, Anthropic, Mistral, Cohere, Google, AWS, Azure, and more) |
| Pricing | Free tier available; paid plans for higher volume |
| Self-hosted | Yes (Docker, Kubernetes) |
| Best for | Teams wanting observability + reliability across multiple AI providers |

## Key Features

### Unified API

Portkey exposes a single API that wraps all providers with an OpenAI-compatible interface. Change your `baseURL` and `apiKey`, and your existing OpenAI SDK code works with any provider:

```typescript
import Portkey from 'portkey-ai';

const portkey = new Portkey({
  apiKey: 'PORTKEY_API_KEY',
  virtualKey: 'ANTHROPIC_VIRTUAL_KEY', // your encrypted Anthropic key
});

// Same OpenAI-style API, now routing through Anthropic
const completion = await portkey.chat.completions.create({
  messages: [{ role: 'user', content: 'What is the capital of France?' }],
  model: 'claude-3-5-sonnet-20241022',
});
```

You can also use the OpenAI SDK directly by overriding `baseURL`:

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'PORTKEY_API_KEY',
  baseURL: 'https://api.portkey.ai/v1',
  defaultHeaders: {
    'x-portkey-virtual-key': 'ANTHROPIC_VIRTUAL_KEY',
  },
});
```

### Virtual Keys

Virtual keys are encrypted references to your actual provider API keys. Store your real keys in Portkey's vault; reference them by a virtual key alias in your code.

Benefits:
- **Key rotation without code changes**: Update the real key in Portkey; your code keeps using the same virtual key
- **Scoped access**: Share virtual keys with team members without exposing raw credentials
- **Automatic redaction**: Real keys never appear in logs or request traces
- **Spend limits**: Set per-virtual-key spend caps to prevent runaway costs

Create virtual keys in the Portkey dashboard or via API, then reference them in headers:

```typescript
const portkey = new Portkey({
  apiKey: 'PORTKEY_API_KEY',
  virtualKey: 'openai-prod-key', // your alias, not the real key
});
```

### Fallbacks

Configure automatic failover when a provider returns an error or is unavailable. If the primary model fails, Portkey retries with the next provider in the list — transparently, without changes to your application code.

```typescript
import { createConfig } from 'portkey-ai';

const config = createConfig({
  strategy: { mode: 'fallback' },
  targets: [
    { virtualKey: 'openai-key', overrideParams: { model: 'gpt-4o' } },
    { virtualKey: 'anthropic-key', overrideParams: { model: 'claude-3-5-sonnet-20241022' } },
    { virtualKey: 'mistral-key', overrideParams: { model: 'mistral-large-latest' } },
  ],
});

const portkey = new Portkey({ apiKey: 'PORTKEY_API_KEY', config });
```

Fallback triggers: HTTP errors (5xx), timeout, rate limit (429), or custom status codes you specify.

### Load Balancing

Distribute traffic across multiple API keys or providers with configurable weights. Useful for staying under rate limits or managing cost by routing cheaper requests to lower-cost models.

```typescript
const config = createConfig({
  strategy: {
    mode: 'loadbalance',
  },
  targets: [
    { virtualKey: 'openai-key-1', weight: 0.5 },
    { virtualKey: 'openai-key-2', weight: 0.3 },
    { virtualKey: 'anthropic-key', weight: 0.2 },
  ],
});
```

Weight values are proportional — the example above sends 50% of traffic to `openai-key-1`, 30% to `openai-key-2`, and 20% to Anthropic.

### Semantic Caching

Portkey can cache responses based on semantic similarity, not just exact prompt matches. If two prompts ask essentially the same question, the second gets the cached response — reducing latency and cost.

Enable caching in your config:

```typescript
const config = createConfig({
  cache: {
    mode: 'semantic',         // 'simple' for exact-match only
    maxAge: 3600,             // cache TTL in seconds
    similarityThreshold: 0.9, // 0-1, higher = stricter matching
  },
  targets: [{ virtualKey: 'openai-key' }],
});
```

Cache hit rates depend on your workload. High-volume applications with repetitive queries (support chatbots, FAQ systems) see the most benefit — often 20–40% cost reduction.

### Observability Dashboard

Every request routed through Portkey is logged with full metadata: model, tokens, latency, cost, virtual key, status, and the full request/response body (if enabled).

The dashboard provides:
- **Request logs**: Searchable history with request/response inspection
- **Cost tracking**: Per-provider, per-virtual-key, and per-metadata-tag spend
- **Latency analytics**: p50/p90/p99 by model and provider
- **Error rate monitoring**: Track failures, fallback triggers, and cache hits
- **Token usage**: Input vs. output token breakdown over time

You can also attach custom metadata to requests for filtering:

```typescript
const portkey = new Portkey({
  apiKey: 'PORTKEY_API_KEY',
  virtualKey: 'openai-key',
  metadata: {
    environment: 'production',
    userId: 'user-123',
    feature: 'summarization',
  },
});
```

Filter logs by any metadata field in the dashboard.

### Guardrails

Portkey Guardrails validates and transforms inputs and outputs before and after model calls. Available checks include:

- **Content moderation**: Block unsafe content using built-in classifiers or provider moderation APIs
- **PII detection**: Detect and redact personal information
- **Regex filters**: Match or block patterns in inputs and outputs
- **JSON schema validation**: Ensure structured outputs conform to a schema
- **Prompt injection detection**: Block attempts to override system prompts

Configure guardrails in the dashboard and reference them in your config — no SDK changes needed.

### Prompt Management

Portkey includes a prompt library where you can version, test, and deploy prompts independently of your application code. Teams can iterate on prompts in the dashboard without a code deploy.

```typescript
// Reference a managed prompt by ID
const response = await portkey.prompts.completions.create({
  promptID: 'pp-my-summarizer-v2',
  variables: { text: 'The document content here...' },
});
```

Prompts support variables, versioning, and A/B testing — useful when prompt quality is critical to your product.

## Supported Providers

Portkey supports 200+ providers through a combination of native integrations and OpenAI-compatible pass-through. A sample:

| Category | Providers |
|----------|-----------|
| **Frontier models** | OpenAI, Anthropic, Google Gemini, Mistral |
| **Cloud AI** | AWS Bedrock, Azure OpenAI, Google Vertex AI |
| **Open models** | Together AI, Fireworks, Groq, Perplexity |
| **Embeddings** | OpenAI, Cohere, Voyage AI |
| **Image generation** | OpenAI DALL·E, Stability AI |
| **Self-hosted** | Ollama, vLLM, custom OpenAI-compatible endpoints |

## Self-Hosting

The Portkey gateway is open source and can be self-hosted. This is useful for air-gapped environments, compliance requirements, or teams that want full control over request data.

```bash
# Run with Docker
docker run -d \
  -p 8787:8787 \
  -e PORTKEY_API_KEY=your-api-key \
  portkeyai/gateway:latest
```

```yaml
# Or with Docker Compose
version: '3.8'
services:
  portkey-gateway:
    image: portkeyai/gateway:latest
    ports:
      - "8787:8787"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

Then point your SDK at the self-hosted instance:

```typescript
const portkey = new Portkey({
  apiKey: 'PORTKEY_API_KEY',
  baseURL: 'http://localhost:8787/v1',
  virtualKey: 'openai-key',
});
```

The self-hosted gateway handles routing, fallbacks, and load balancing. The observability dashboard remains a Portkey-hosted SaaS feature unless you bring your own logging infrastructure.

## Pricing

| Plan | Price | Requests/month | Features |
|------|-------|---------------|---------|
| **Free** | $0 | 10,000 | Logs (7-day retention), virtual keys, basic cache |
| **Developer** | $49/mo | 100,000 | Logs (30-day retention), guardrails, A/B testing |
| **Production** | $199/mo | 1,000,000 | Logs (90-day retention), SSO, SLA |
| **Enterprise** | Custom | Unlimited | Custom retention, self-hosted support, dedicated CSM |

Caching, fallbacks, and load balancing are available on all plans. Guardrails require Developer or above.

## Installation

```bash
# Node.js / TypeScript
npm install portkey-ai

# Python
pip install portkey-ai
```

Quick setup:

```typescript
import Portkey from 'portkey-ai';

const portkey = new Portkey({
  apiKey: process.env.PORTKEY_API_KEY,
  virtualKey: process.env.OPENAI_VIRTUAL_KEY,
});

const response = await portkey.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello' }],
});

console.log(response.choices[0].message.content);
```

## When to Choose Portkey

**Portkey is a strong fit when:**
- You use multiple AI providers and want unified observability
- You need automatic fallbacks for production reliability
- Cost reduction via caching matters for your workload
- Your team wants a no-code way to manage prompts and virtual keys
- You want an open-source option you can self-host

**Consider alternatives when:**
- You're deep in the AWS ecosystem and want IAM-based access control (use AWS Bedrock)
- You only use a single provider and don't need routing logic
- You need a Vercel or Cloudflare edge-native solution (Vercel AI Gateway, Cloudflare AI Gateway)

## Related Resources

- [Portkey Documentation](https://docs.portkey.ai/)
- [Portkey GitHub (open source gateway)](https://github.com/Portkey-AI/gateway)
- [Portkey Dashboard](https://app.portkey.ai/)
- [Comparing AI Gateways](./comparing-ai-gateways)
- [AWS Bedrock as an AI Gateway](./aws-bedrock)
