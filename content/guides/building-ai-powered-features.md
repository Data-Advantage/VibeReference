---
title: "Building AI-Powered Features"
---

# Building AI-Powered Features

Adding LLM capabilities to your app — API integration, streaming responses, prompt management, and cost control.

## When to Add AI Features

AI features make sense when your product needs:
- **Text generation** — Writing, summarization, translation
- **Analysis** — Categorization, sentiment, extraction
- **Search** — Semantic search, Q&A over documents
- **Conversation** — Chatbots, assistants, support agents
- **Code** — Code generation, review, debugging

If the feature can be solved with simple rules or a database query, skip the AI. LLMs add latency, cost, and unpredictability.

## Choosing a Model

| Provider | Best Models | Best For |
|----------|------------|----------|
| **Anthropic** | Claude Sonnet 4, Claude Haiku | Complex reasoning, long context, structured output |
| **OpenAI** | GPT-4o, GPT-4o mini | General purpose, image understanding |
| **Google** | Gemini 2.5 Pro, Gemini 2.5 Flash | Multimodal, long context |

**Recommendation**: Start with Claude Haiku or GPT-4o mini for cost-sensitive features. Upgrade to Claude Sonnet 4 or GPT-4o for complex tasks.

## Basic API Integration

### Anthropic (Claude)

```bash
npm install @anthropic-ai/sdk
```

```typescript
// lib/ai.ts
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function generateSummary(text: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Summarize the following text in 2-3 sentences:\n\n${text}`,
      },
    ],
  })

  return (message.content[0] as { type: 'text'; text: string }).text
}
```

### API Route

```typescript
// app/api/summarize/route.ts
import { generateSummary } from '@/lib/ai'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Authenticate the request
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { text } = await request.json()
  if (!text || text.length > 10000) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const summary = await generateSummary(text)
  return NextResponse.json({ summary })
}
```

## Streaming Responses

For chat or long-form generation, stream the response so users see text as it's generated:

### Server-Side Streaming

```typescript
// app/api/chat/route.ts
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic()

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { messages } = await request.json()

  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages,
  })

  return new Response(stream.toReadableStream(), {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}
```

### Client-Side Streaming

```typescript
async function sendMessage(messages: Message[]) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value)
    // Append chunk to your UI state
    setResponse((prev) => prev + chunk)
  }
}
```

## Structured Output

When you need the AI to return data in a specific format:

### Using Tool Use (Function Calling)

```typescript
const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  tools: [
    {
      name: 'categorize_feedback',
      description: 'Categorize user feedback into structured data',
      input_schema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['bug', 'feature_request', 'ux_issue', 'praise', 'other'],
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high', 'critical'],
          },
          summary: {
            type: 'string',
            description: 'One-sentence summary',
          },
        },
        required: ['category', 'priority', 'summary'],
      },
    },
  ],
  tool_choice: { type: 'tool', name: 'categorize_feedback' },
  messages: [
    {
      role: 'user',
      content: `Categorize this feedback: "${feedbackText}"`,
    },
  ],
})
```

## Prompt Management

### Keep prompts in separate files

```typescript
// prompts/summarize.ts
export const SUMMARIZE_PROMPT = `You are a helpful assistant that creates concise summaries.

Rules:
- Summarize in 2-3 sentences
- Focus on key facts and conclusions
- Use clear, simple language
- Don't start with "This text..." or "The article..."

Text to summarize:
{{text}}`

export function buildSummarizePrompt(text: string): string {
  return SUMMARIZE_PROMPT.replace('{{text}}', text)
}
```

### Use system prompts for behavior

```typescript
const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  system: `You are a customer support assistant for MyApp.
You help users with their accounts, billing, and features.
Be concise, friendly, and helpful.
If you don't know something, say so rather than guessing.`,
  messages: conversationHistory,
})
```

## Cost Control

### Strategies to manage costs

1. **Choose the right model** — Use smaller models (Haiku, GPT-4o mini) for simple tasks
2. **Set max_tokens** — Don't request more tokens than you need
3. **Cache responses** — Store results for identical or similar queries
4. **Rate limit per user** — Prevent abuse

### Simple rate limiting

```typescript
// lib/rate-limit.ts
const userRequestCounts = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(userId: string, limit = 20): boolean {
  const now = Date.now()
  const record = userRequestCounts.get(userId)

  if (!record || now > record.resetAt) {
    userRequestCounts.set(userId, { count: 1, resetAt: now + 60 * 60 * 1000 })
    return true
  }

  if (record.count >= limit) return false
  record.count++
  return true
}
```

### Tracking usage

Log every API call to monitor costs:

```typescript
// After each API call
await supabase.from('ai_usage').insert({
  user_id: user.id,
  model: 'claude-sonnet-4-20250514',
  input_tokens: message.usage.input_tokens,
  output_tokens: message.usage.output_tokens,
  feature: 'summarize',
})
```

### Cost estimation

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| Claude Haiku | $0.25 | $1.25 |
| Claude Sonnet 4 | $3.00 | $15.00 |
| GPT-4o mini | $0.15 | $0.60 |
| GPT-4o | $2.50 | $10.00 |

A typical user message is ~100 tokens. A typical response is ~200-500 tokens.

## Security Considerations

1. **Never expose API keys client-side** — Always call LLM APIs from your server
2. **Validate and sanitize input** — Set max length, strip HTML/scripts
3. **Don't pass raw user input as system prompts** — This enables prompt injection
4. **Log but don't store sensitive data** — Be careful with PII in AI conversations
5. **Implement content filtering** — Check AI outputs for inappropriate content before displaying
