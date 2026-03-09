# Upstage

Upstage is a South Korean AI company that provides document AI and language models. Their flagship product, Document AI, specializes in extracting and understanding content from complex documents including tables, charts, and layouts. They also offer the Solar LLM family for general text generation.

## Key Products

- **Document AI**: Extract structured data from documents with layout understanding
- **Solar LLM**: Language models optimized for instruction-following and reasoning
- **Groundedness Check**: Verify whether AI responses are grounded in provided context

## Use Cases

- **Document processing**: Extract tables, text, and structure from PDFs and images
- **RAG verification**: Check if generated responses are supported by source documents
- **Multilingual tasks**: Solar models perform well across multiple languages, especially Korean
- **Enterprise AI**: Document understanding for business process automation

## Getting Started

```bash
npm install @ai-sdk/openai  # Upstage is OpenAI-compatible
```

Upstage provides an OpenAI-compatible API:

```typescript
import OpenAI from 'openai';

const upstage = new OpenAI({
  apiKey: process.env.UPSTAGE_API_KEY,
  baseURL: 'https://api.upstage.ai/v1/solar',
});

const response = await upstage.chat.completions.create({
  model: 'solar-mini',
  messages: [
    { role: 'user', content: 'Explain machine learning in simple terms.' },
  ],
});
```

## Resources

- [Upstage Documentation](https://developers.upstage.ai)
- [Upstage Console](https://console.upstage.ai)
- [Solar LLM](https://www.upstage.ai/solar-llm)
