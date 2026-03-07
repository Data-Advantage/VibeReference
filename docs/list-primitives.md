# List Primitives

These are the core entity types that should have browsable, filterable list pages on the VibeReference directory website. Each primitive represents a category of items users would want to discover, compare, and learn about when building a SaaS with vibe coding.

---

## 1. AI Models

Individual AI models that can be used in a vibe-coded SaaS.

| Field | Example |
|-------|---------|
| Name | GPT-5 Mini, Claude Opus 4, Gemini 2.5 Pro |
| Provider | OpenAI, Anthropic, Google |
| Modality | Text, Image, Audio, Video, Multimodal |
| Use case | Chat, Code generation, Image generation, Text-to-speech, Moderation, Embeddings |
| Pricing tier | Free, Pay-per-token, Subscription |
| Context window | 128k, 200k, 1M |

**Existing reference files:** `claude.md`, `openai-gpt.md`, `openai-o.md`, `openai-dalle.md`, `openai-tts.md`, `openai-moderation.md`, `google-gemini.md`, `meta-llama.md`, `mistral.md`, `deepseek.md`, `cohere.md`, `xai-grok.md`, `stable-diffusion.md`, `black-forest-labs-flux.md`, `recraft.md`, `ideogram.md`, `luma-photon.md`

---

## 2. AI Providers

Companies and platforms that host and serve AI models.

| Field | Example |
|-------|---------|
| Name | OpenAI, Anthropic, Google, AWS Bedrock |
| Models offered | List of models |
| API style | REST, SDK, Streaming |
| Pricing model | Pay-per-token, Subscription, Free tier |
| Integration method | Direct API, AI SDK provider, AI Gateway |

**Existing reference files:** `openai-developer.md`, `anthropic-developer.md`, `google-generative-ai.md`, `google-vertex-ai.md`, `amazon-bedrock.md`, `azure-openai.md`, `groq.md`, `cerebras.md`, `fireworks.md`, `together.md`, `perplexity.md`, `fal.md`, `upstage.md`

---

## 3. AI Development Tools

SDKs, frameworks, and tools for integrating AI into applications.

| Field | Example |
|-------|---------|
| Name | AI SDK, AI Elements, OpenAI Assistants API |
| Category | SDK, Framework, UI Component, API |
| Language | TypeScript, Python |
| Key features | Streaming, Tool use, Structured output, UI components |

**Existing reference files:** `ai-sdk.md`, `ai-sdk-core.md`, `ai-sdk-providers.md`, `ai-sdk-ui.md`, `openai-assistant.md`, `openai-responses.md`, `prompt-engineering.md`, `object-generation.md`, `image-generation.md`

---

## 4. Vibe Coding Tools

AI-powered code generation and development platforms used to build applications.

| Field | Example |
|-------|---------|
| Name | v0, Claude Code, Cursor, Bolt, Lovable, Replit Agent |
| Category | Code generator, IDE, Prototyper, Full-stack builder |
| Best for | UI prototyping, Full app, Backend, Iteration |
| Input method | Chat prompt, Visual, File upload |
| Deployment | Built-in, Manual, Vercel integration |

**Existing reference files:** `v0.md`, `v0-project-instructions.md`, `playground.md`, `chatgpt.md`

---

## 5. Frontend Frameworks & Libraries

Technologies for building the user-facing application.

| Field | Example |
|-------|---------|
| Name | Next.js, React, Tailwind CSS, shadcn/ui |
| Category | Framework, Library, Styling, Component library |
| Language | TypeScript, CSS |
| Key features | SSR, App Router, Utility-first CSS, Accessible components |

**Existing reference files:** `nextjs.md`, `nextjs-api.md`, `react.md`, `typescript.md`, `typescript-patterns.md`, `html.md`, `css.md`, `tailwind.md`, `postcss.md`, `shadcn.md`, `radix.md`, `lucide.md`, `tweakcn.md`, `dark-mode.md`, `responsive-design.md`, `style-patterns.md`, `google-fonts.md`, `zod.md`

---

## 6. Backend & Database Services

Services for data storage, serverless functions, and backend logic.

| Field | Example |
|-------|---------|
| Name | Convex, Supabase, PlanetScale, Neon |
| Category | Database, BaaS, Serverless functions, File storage |
| Database type | PostgreSQL, Document, Relational |
| Key features | Realtime, Row-level security, Edge functions, Sync engine |
| Free tier | Yes/No, limits |

**Existing reference files:** `supabase.md`, `supabase-database-setup.md`, `supabase-database-patterns.md`, `supabase-migrations.md`, `postgres.md`, `sql.md`, `sql-migration.md`, `convex-setup-workflow.md`, `convex-diagnostics.md`

---

## 7. Authentication & Identity Services

Services for user authentication, session management, and identity.

| Field | Example |
|-------|---------|
| Name | Clerk, Supabase Auth, NextAuth, Auth0 |
| Category | Auth provider, Identity platform |
| Auth methods | Email/password, OAuth, Magic link, Passkey |
| Key features | Billing integration, User management, RBAC |

**Existing reference files:** `authentication.md`, `login-with-google.md`, `clerk-billing.md`, `security.md`, `middleware.md`

---

## 8. Payment & Billing Services

Services for processing payments, managing subscriptions, and billing.

| Field | Example |
|-------|---------|
| Name | Stripe, Clerk Billing, Polar, LemonSqueezy |
| Category | Payment processor, Subscription management, Merchant of record |
| Key features | Subscriptions, One-time payments, Customer portal, Invoicing |

**Existing reference files:** `stripe.md`, `stripe-customer-portal.md`, `payment-integration.md`, `polar.md`

---

## 9. Hosting & Deployment Platforms

Platforms for deploying, hosting, and scaling web applications.

| Field | Example |
|-------|---------|
| Name | Vercel, Netlify, Cloudflare Pages, Railway |
| Category | Hosting, CDN, Edge platform |
| Key features | Preview deployments, Edge functions, Analytics, Custom domains |
| Framework support | Next.js, React, etc. |

**Existing reference files:** `vercel.md`, `vercel-analytics.md`, `vercel-blob.md`, `vercel-domains.md`, `cloudflare.md`, `domain.md`, `dns.md`, `ssl.md`

---

## 10. Cloud Infrastructure

Major cloud providers and their relevant services.

| Field | Example |
|-------|---------|
| Name | AWS, Google Cloud, Azure |
| Category | Cloud provider |
| Relevant services | SES, S3, Cloud Functions, etc. |

**Existing reference files:** `aws.md`, `aws-ses.md`, `azure.md`, `google-cloud.md`, `cloudflare.md`

---

## 11. Email & Communication Services

Services for transactional email, marketing email, and notifications.

| Field | Example |
|-------|---------|
| Name | Resend, AWS SES, SendGrid, Postmark |
| Category | Transactional email, Marketing email, Notifications |
| Key features | Templates, Analytics, Deliverability, API |

**Existing reference files:** `resend.md`, `aws-ses.md`, `email-marketing.md`

---

## 12. Analytics & Monitoring Tools

Tools for tracking usage, performance, errors, and user behavior.

| Field | Example |
|-------|---------|
| Name | Vercel Analytics, Google Analytics, PostHog, Sentry |
| Category | Web analytics, Product analytics, Error tracking, Performance |
| Key features | Real-time, Funnels, Session replay, Alerts |

**Existing reference files:** `analytics.md`, `vercel-analytics.md`, `google-analytics.md`, `google-search-console.md`, `web-vitals.md`, `performance-optimization.md`

---

## 13. Marketing & SEO Tools

Tools and platforms for marketing, SEO, and content distribution.

| Field | Example |
|-------|---------|
| Name | Google Search Console, HubSpot, Ahrefs |
| Category | SEO, CRM, Marketing automation, Social |
| Key features | Keyword tracking, Email automation, Analytics |

**Existing reference files:** `seo.md`, `google-search-console.md`, `hubspot.md`, `content-marketing.md`, `social-media-marketing.md`, `landing-pages.md`, `sitemap.md`

---

## 14. Business Strategy Frameworks

Frameworks and methodologies for product positioning and business planning.

| Field | Example |
|-------|---------|
| Name | StoryBrand, Value Proposition Canvas, Strategyzer |
| Category | Messaging framework, Business model, Positioning |
| Best for | Landing pages, Pitch decks, Product strategy |

**Existing reference files:** `storybrand.md`, `strategyzer.md`, `value-proposition-canvas.md`, `unique-selling-proposition.md`, `positioning-statement.md`, `mvp.md`, `product-requirements.md`, `product-launch.md`, `product-iteration.md`

---

## 15. Developer & Build Tools

Tools for development workflow, code quality, and project configuration.

| Field | Example |
|-------|---------|
| Name | GitHub, ESLint, npm, Node.js |
| Category | Version control, Linter, Package manager, Runtime |
| Key features | CI/CD, Code review, Dependency management |

**Existing reference files:** `github.md`, `eslint.md`, `npm.md`, `nodejs.md`, `config-files.md`, `environment-variable.md`, `testing-qa.md`, `json.md`, `markdown.md`

---

## 16. API & Integration Tools

Tools and standards for building and connecting APIs.

| Field | Example |
|-------|---------|
| Name | OpenAPI, Swagger, n8n, Webhooks |
| Category | API spec, Automation, Integration, Search |
| Key features | Documentation, Workflow automation, Data extraction |

**Existing reference files:** `api.md`, `api-integration.md`, `openapi.md`, `swagger.md`, `webhook.md`, `n8n.md`, `exa.md`, `tavily.md`, `unstructured.md`

---

## 17. Workflow Steps (Prompts)

The structured prompts and workflow steps across the 5-day build process.

| Field | Example |
|-------|---------|
| Name | Product Requirements, Landing Page, Authentication System |
| Day | 1-5 |
| Session | 1.1, 2.3, 3.2 |
| Category | Planning, Design, Building, Marketing, Launch |
| Tool target | Claude, v0, Manual |
| Output type | Document, Code, Configuration, Content |

**Existing reference files:** All files in `1-create/`, `2-refine/`, `3-build/`, `4-position/`, `5-launch/`, `6-grow/`

---

## Summary Table

| # | Primitive | Description | Count (approx) |
|---|-----------|-------------|-----------------|
| 1 | AI Models | Individual models for text, image, audio | ~20 |
| 2 | AI Providers | Platforms hosting AI models | ~15 |
| 3 | AI Development Tools | SDKs and frameworks for AI integration | ~10 |
| 4 | Vibe Coding Tools | AI-powered development platforms | ~10 |
| 5 | Frontend Frameworks & Libraries | UI frameworks, component libraries, styling | ~18 |
| 6 | Backend & Database Services | Databases, BaaS, serverless | ~10 |
| 7 | Authentication & Identity | Auth providers and identity platforms | ~5 |
| 8 | Payment & Billing | Payment processors and subscription tools | ~5 |
| 9 | Hosting & Deployment | Hosting platforms and CDNs | ~6 |
| 10 | Cloud Infrastructure | Major cloud providers | ~5 |
| 11 | Email & Communication | Transactional and marketing email services | ~5 |
| 12 | Analytics & Monitoring | Analytics, error tracking, performance | ~6 |
| 13 | Marketing & SEO Tools | SEO, CRM, content distribution | ~8 |
| 14 | Business Strategy Frameworks | Positioning, messaging, business modeling | ~8 |
| 15 | Developer & Build Tools | Version control, linters, package managers | ~10 |
| 16 | API & Integration Tools | API specs, automation, data tools | ~8 |
| 17 | Workflow Steps (Prompts) | Structured build prompts across 5 days | ~60 |
