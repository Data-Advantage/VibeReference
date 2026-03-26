# Meta Llama

Meta Llama is the most popular open-source model family — excellent for local development, fine-tuning, and self-hosted deployments with strong coding capabilities.

## Why Vibe Coders Use It

- **Industry-standard open model** — Llama 3.3 70B rivals GPT-4o for many tasks
- **Self-hostable** — run locally or on your own infrastructure for complete control
- **Fine-tunable** — customize for your specific domain or use case
- **Strong code generation** — competitive with Claude and GPT-4o at coding tasks
- **Massive ecosystem** — available everywhere (HuggingFace, all inference platforms, Ollama, vLLM)

## Key Specs

| Dimension | Value |
|-----------|-------|
| Best for | Local development, fine-tuning, privacy-critical applications |
| Context window | 128K tokens (Llama 3.1+) |
| Tool use / function calling | Supported in instruction-tuned versions |
| Agentic capability | Good — solid at planning and multi-step reasoning |
| API availability | Open-source; via Fireworks, Together, Groq, Replicate, AWS Bedrock |
| Pricing tier | Free (open-source); API pricing $0.50-$2 per 1M tokens |

## Getting Started

### Option 1: Via API (Fireworks AI, Fastest)

```bash
npm install @ai-sdk/fireworks
```

```typescript
import { fireworks } from '@ai-sdk/fireworks';
import { generateText } from 'ai';

const { text } = await generateText({
  model: fireworks('accounts/fireworks/models/llama-v3p3-70b-instruct'),
  prompt: 'Build a TypeScript function that validates email addresses',
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
  model: togetherai('meta-llama/Meta-Llama-3.3-70B-Instruct-Turbo'),
  prompt: 'Explain the difference between useState and useReducer in React',
});
```

### Option 3: Local with Ollama

```bash
# Install and run locally
ollama run llama3.3

# Then stream responses locally
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({
    model: 'llama3.3',
    prompt: 'How do I implement pagination in a SQL query?',
    stream: true,
  }),
});
```

### Option 4: Self-Hosted with vLLM

```bash
# Deploy Llama 3.3 70B on your server
vllm serve meta-llama/Meta-Llama-3.3-70B-Instruct

# Query your local server
const response = await fetch('http://your-server:8000/v1/completions', {
  method: 'POST',
  body: JSON.stringify({
    model: 'llama3.3',
    prompt: 'Write a middleware function for authentication in Express',
  }),
});
```

## Fine-Tuning Example

```typescript
// On platforms like Lambda Labs or Modal, fine-tune Llama for your domain
import os
from modal import Image, Stub
from modal.functions import gpu_memory

stub = Stub("finetune-llama")

@stub.function(image=Image.from_registry("nvidia/cuda:12.1.1-devel-ubuntu22.04"))
def train():
    # Use Hugging Face trainer to fine-tune on your dataset
    from transformers import AutoModelForCausalLM, TrainingArguments, Trainer

    model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.1-70b")
    # ... training code
```

## When to Use Llama vs. Alternatives

**Use Llama** when you need full control, want to self-host, or plan to fine-tune. It's excellent for local development and privacy-critical applications. Use **Claude** for the strongest proprietary reasoning. Use **GPT-4o** for the fastest, most reliable general-purpose model.

## Available Models

- **Llama 3.3 70B** — Latest, strongest open model
- **Llama 3.1 405B** — Largest, good for complex tasks
- **Llama 3.1 8B** — Lightweight, fast
- **Code Llama** — Specialized for code generation

## Resources

- [Meta AI Official](https://ai.meta.com)
- [Llama Models on HuggingFace](https://huggingface.co/meta-llama)
- [Ollama (Local Deployment)](https://ollama.ai)
- [vLLM (Self-Hosted)](https://vllm.readthedocs.io)
- [Fireworks AI Llama Models](https://fireworks.ai)
- [Together AI Llama Models](https://together.ai)
- **See the full Llama profile on [LLMReference](https://www.llmreference.com/providers/meta) →**
