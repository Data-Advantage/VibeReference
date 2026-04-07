# Azure OpenAI Service Quickstart for Vibe Apps

If you want GPT-powered features with enterprise security, Azure OpenAI Service is a strong option for solo founders building B2B products. You get OpenAI models through Azure billing, regional controls, and compliance features that are often required by larger customers. This quickstart walks through provisioning, environment setup, a Next.js API route, and the quota limits you should watch before launch.

## 1) Provision Azure OpenAI and deploy a model

Create a resource in a supported region (for example East US, Sweden Central, or West Europe), then deploy a model from Azure AI Foundry or the Azure portal. You can do most of the setup with CLI:

```bash
az login
az account set --subscription "<your-subscription-id>"

az group create --name rg-vibe-ai --location eastus

az cognitiveservices account create \
  --name vibe-aoai-prod \
  --resource-group rg-vibe-ai \
  --kind OpenAI \
  --sku S0 \
  --location eastus \
  --yes
```

After the resource exists, create a model deployment (for example `gpt-4o-mini` or `gpt-4.1-mini`) in the portal and give it a stable deployment name such as `chat-main`. Your app code calls the deployment name, not just the base model name.

## 2) Collect endpoint, key, and API version

From the Azure OpenAI resource:
- Copy the endpoint URL (looks like `https://<resource>.openai.azure.com/`)
- Generate an API key
- Note the API version you plan to use

Then add environment variables in your Next.js app:

```bash
# .env.local
AZURE_OPENAI_ENDPOINT="https://vibe-aoai-prod.openai.azure.com/"
AZURE_OPENAI_API_KEY="<secret>"
AZURE_OPENAI_DEPLOYMENT="chat-main"
AZURE_OPENAI_API_VERSION="2024-10-21"
```

Keep secrets server-side only. Do not expose `AZURE_OPENAI_API_KEY` in client components.

## 3) Call Azure OpenAI from a Next.js route

Install the OpenAI SDK:

```bash
npm install openai
```

Create `app/api/ai/chat/route.ts`:

```ts
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
  defaultQuery: { "api-version": process.env.AZURE_OPENAI_API_VERSION },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY! },
});

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (!prompt) return NextResponse.json({ error: "Missing prompt" }, { status: 400 });

  const completion = await client.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT!,
    messages: [
      { role: "system", content: "You are a concise product copilot." },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
  });

  return NextResponse.json({ text: completion.choices[0]?.message?.content ?? "" });
}
```

This keeps all model access on the server and gives you one place to add auth, logging, and abuse controls.

## 4) Handle rate limits and quotas early

Azure OpenAI enforces request/token limits by deployment and subscription quota. In practice:
- Expect `429` responses when traffic spikes
- Budget for both input and output tokens
- Use lower-cost models for background or non-critical tasks

Add simple retry and timeout behavior around requests, cache repeat prompts where possible, and track token usage per feature so one expensive route does not consume your whole quota.

## 5) Production checklist

- Use separate resources or deployments for dev vs prod
- Restrict keys and rotate them on a schedule
- Pin one API version in code, then test upgrades intentionally
- Add observability: request count, latency, `429` rate, token spend

Once this is in place, you can safely layer advanced features like tool-calling, RAG, and multimodal inputs without rebuilding your backend contract.
