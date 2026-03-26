# DeepSeek

DeepSeek is an open-source coding powerhouse — state-of-the-art reasoning and code generation that rivals closed models while remaining completely open.

## Why Vibe Coders Use It

- **Open-source excellence** — strong reasoning and code generation, MIT-licensed models
- **Self-hostable** — run locally on your own hardware for privacy and control
- **Competitive with Claude and GPT-4o** — excellent at complex reasoning and multi-step logic
- **Mixture of Experts (MoE)** — efficient architecture for fast inference
- **Cost-effective** — run locally or via affordable API providers (Fireworks, Together AI)

## Key Specs

| Dimension | Value |
|-----------|-------|
| Best for | Code generation, complex reasoning, local/private deployments |
| Context window | 64K-128K tokens depending on model |
| Tool use / function calling | Supported in instruction-tuned versions |
| Agentic capability | Good — strong reasoning for multi-step workflows |
| API availability | Open-source (HuggingFace), via Fireworks AI, Together AI, Groq |
| Pricing tier | Free (open-source); API pricing varies by provider |

## Getting Started

### Option 1: Via Fireworks AI (Fastest)

```bash
npm install @ai-sdk/fireworks
```

```typescript
import { fireworks } from '@ai-sdk/fireworks';
import { generateText } from 'ai';

const { text } = await generateText({
  model: fireworks('accounts/fireworks/models/deepseek-r1'),
  prompt: 'Design a caching strategy for a high-traffic API endpoint',
});

console.log(text);
```

### Option 2: Via Together AI

```bash
npm install @ai-sdk/togetherai
```

```typescript
import { togetherai } from '@ai-sdk/togetherai';
import { generateText } from 'ai';

const { text } = await generateText({
  model: togetherai('deepseek-ai/DeepSeek-V3'),
  prompt: 'Debug this async function and explain the issue',
});
```

### Option 3: Local Deployment (Ollama)

```bash
# Install and run locally
ollama run deepseek-r1

# Then use with your local inference server
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({
    model: 'deepseek-r1',
    prompt: 'Explain how React hooks work',
  }),
});
```

## When to Use DeepSeek vs. Alternatives

**Use DeepSeek** when you want open-source reasoning power or need to self-host for privacy. It's nearly as good as Claude and GPT-4o for reasoning tasks. Use **Claude** if you want the strongest proprietary model. Use **GPT-4o** for general-purpose speed and ecosystem support.

## Available Models

- **DeepSeek-R1** — Best reasoning, multi-step problem solving
- **DeepSeek-V3** — Strong general-purpose model
- **DeepSeek-Coder** — Specialized for code generation

## Resources

- [DeepSeek Official](https://deepseek.com)
- [DeepSeek Models on HuggingFace](https://huggingface.co/deepseek-ai)
- [Fireworks AI DeepSeek Models](https://fireworks.ai)
- [Together AI DeepSeek Models](https://together.ai)
- **See the full DeepSeek profile on [LLMReference](https://www.llmreference.com/providers/deepseek) →**
