# Qwen

Qwen is Alibaba's large language model family — the most prolific open-weight series in production today, spanning tiny on-device models to frontier-class flagships. It is the open-weight default for multilingual work and a serious competitor to Llama, Mistral, and DeepSeek for coding, agents, and vision-language tasks. The open Qwen models ship under Apache 2.0, which makes them unusually friendly for commercial deployment compared to other open-weight families.

## Why Vibe Coders Use It

- **Best open-weight breadth** — sizes from 0.6B to 235B+ MoE, plus specialized coder and vision variants
- **Apache 2.0 license** — commercial use without source-disclosure obligations
- **Strong coding and agents** — Qwen-Coder is a leading open option for agentic coding and repo-level reasoning
- **Hybrid thinking mode** — most Qwen models toggle between fast non-thinking and deeper reasoning behavior
- **Multilingual coverage** — 119+ languages and dialects, including the strongest open Chinese performance
- **Available everywhere** — Hugging Face, ModelScope, Ollama, Together, Fireworks, Groq, OpenRouter, and Alibaba's own DashScope API

## Key Specs

| Dimension | Value |
|-----------|-------|
| Best for | Open-weight deployments, coding agents, multilingual apps, vision-language tasks |
| Context window | 32K–128K open-weight; up to 1M on hosted flagship tiers |
| Tool use / function calling | Supported in Qwen-Instruct and Qwen-Coder variants |
| Agentic capability | Strong — thinking mode + tool calling tuned for multi-step workflows |
| API availability | Open-weight (HF, ModelScope, Ollama); hosted via Alibaba DashScope, Together, Fireworks, Groq, OpenRouter |
| Pricing tier | Free (open-weight); hosted API pricing typically below comparable closed models |

## Getting Started

### Option 1: Via Together AI

```bash
npm install @ai-sdk/togetherai
```

```typescript
import { togetherai } from '@ai-sdk/togetherai';
import { generateText } from 'ai';

const { text } = await generateText({
  model: togetherai('Qwen/Qwen3-235B-A22B-Instruct'),
  prompt: 'Refactor this Express route to use async/await and proper error handling',
});

console.log(text);
```

### Option 2: Via Fireworks AI

```bash
npm install @ai-sdk/fireworks
```

```typescript
import { fireworks } from '@ai-sdk/fireworks';
import { generateText } from 'ai';

const { text } = await generateText({
  model: fireworks('accounts/fireworks/models/qwen3-coder-480b'),
  prompt: 'Generate a TypeScript client for this OpenAPI spec',
});
```

### Option 3: Local with Ollama

```bash
# Pull a small Qwen variant for local development
ollama run qwen3

# Or a coder-tuned variant
ollama run qwen3-coder

# Then call it like any local model
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({
    model: 'qwen3',
    prompt: 'Write a Python script that watches a directory and indexes new files',
  }),
});
```

### Option 4: Via Alibaba DashScope (Hosted Flagship)

```typescript
// DashScope exposes the proprietary Qwen-Max tier with very long context
const response = await fetch('https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.DASHSCOPE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'qwen-max',
    messages: [{ role: 'user', content: 'Summarize this 200-page contract...' }],
  }),
});
```

## Thinking Mode

Most Qwen models expose a hybrid mode toggle. Non-thinking mode is the fast default — comparable to a normal chat completion. Thinking mode produces an internal reasoning trace before the final answer, similar to DeepSeek-R1 or Claude's extended thinking. The trade-off is the usual one: better answers on hard reasoning and tool-use tasks, more tokens and latency. For agent loops, thinking mode is often worth turning on; for high-volume chat, leave it off.

## When to Use Qwen vs. Alternatives

**Use Qwen** when you want the broadest open-weight family with permissive licensing, especially for multilingual work, coding agents, or vision-language tasks. **Use Llama** when ecosystem familiarity, fine-tuning tooling, or deployment maturity matter more than raw capability. **Use DeepSeek** when reasoning depth is the dominant requirement. **Use Mistral** when European data residency or efficient European-tuned models matter. **Use Claude or GPT** when you need frontier polish, the strongest agent tool use, or proprietary reliability and don't need open weights.

## Available Models

- **Qwen3-Instruct** — General-purpose chat and instruction following, sizes from 0.6B to 235B MoE
- **Qwen3-Thinking** — Reasoning-tuned variants with explicit thinking mode
- **Qwen3-Coder** — Code-specialized line for agentic coding, repo reasoning, and long-context code workflows
- **Qwen3-VL** — Vision-language family for image understanding, OCR, document parsing, and visual agents
- **Qwen3-Max** — Proprietary flagship for the highest-capability hosted tier (API only)
- **Qwen-Plus / Qwen-Flash** — Hosted mid-tier and high-throughput variants on DashScope
- **Qwen3-MT** — Translation-specialized model for multilingual workflows

## Resources

- [Qwen Official](https://qwen.ai)
- [Qwen Models on Hugging Face](https://huggingface.co/Qwen)
- [Alibaba Cloud Model Studio (DashScope)](https://www.alibabacloud.com/help/en/model-studio/models)
- [Ollama Qwen Library](https://ollama.com/library/qwen3)
- [Together AI Qwen Models](https://together.ai)
- [Fireworks AI Qwen Models](https://fireworks.ai)
