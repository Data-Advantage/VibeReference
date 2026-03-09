# Google Vertex AI

Google Vertex AI is Google Cloud's enterprise machine learning platform. It provides access to Gemini models, custom model training, and MLOps tools with enterprise-grade security, compliance, and scalability. Use Vertex AI when you need production-ready AI with Google Cloud's infrastructure backing it.

## Vertex AI vs Google AI Studio

| Feature | Google AI Studio | Vertex AI |
|---------|-----------------|-----------|
| Target audience | Developers, prototyping | Enterprise, production |
| Authentication | API key | Google Cloud IAM |
| Data residency | Limited | Full regional control |
| SLA | None | Enterprise SLA |
| Pricing | Pay-per-use | Google Cloud billing |
| Custom models | No | Yes (training, tuning) |

## Getting Started

### 1. Set Up Google Cloud

Create a Google Cloud project and enable the Vertex AI API in the Cloud Console.

### 2. Authenticate

```bash
gcloud auth application-default login
```

Or set a service account key:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

### 3. Install and Use

```bash
npm install @ai-sdk/google-vertex
```

```typescript
import { vertex } from '@ai-sdk/google-vertex';
import { generateText } from 'ai';

const { text } = await generateText({
  model: vertex('gemini-2.0-flash'),
  prompt: 'Summarize the key benefits of cloud computing.',
});
```

## Image Generation with Imagen

Vertex AI provides access to Google's Imagen models:

```typescript
import { vertex } from '@ai-sdk/google-vertex';
import { experimental_generateImage as generateImage } from 'ai';

const { image } = await generateImage({
  model: vertex.image('imagen-3.0-generate-001'),
  prompt: 'A professional product photo of a coffee mug',
});
```

## When to Use Vertex AI

- Your organization requires data residency compliance (GDPR, HIPAA)
- You need enterprise SLAs for AI model availability
- You want to fine-tune or train custom models
- You are already using Google Cloud infrastructure
- You need advanced MLOps features like model monitoring and A/B testing

## Resources

- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [AI SDK Google Vertex Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/google-vertex)
- [Vertex AI Pricing](https://cloud.google.com/vertex-ai/pricing)
