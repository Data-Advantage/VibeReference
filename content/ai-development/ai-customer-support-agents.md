# AI Customer Support Agents: Decagon, Sierra, Ada, Intercom Fin, Forethought, Kapa.ai, Voiceflow, Cresta

[⬅️ AI Development Overview](../ai-development/)

If you're a B2B SaaS in 2026 with significant customer support volume (1K+ tickets/month), you're considering an AI customer support agent. The naive approach: bolt a chatbot on the help center. The structured approach: deploy an LLM-powered agent (Decagon / Sierra / Ada / Intercom Fin) that resolves 30-60% of tier-1 tickets, escalates the rest to humans, learns from feedback, integrates with your CRM and product data. The 2024-2026 leap (Claude Sonnet 4.6 / Opus 4.7 / GPT-5 / Gemini 3) made AI support agents actually useful — they read your docs, answer in your voice, take actions in your product. The right pick depends on volume (>1K tickets/mo justifies platforms), use case (general help vs technical/code support), and existing stack (Intercom users → Fin makes sense).

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Decagon | Enterprise AI agents | Custom | $$$$ | Medium | Enterprise; high-stakes |
| Sierra | Modern AI support | Custom | $$$$ | High | Modern enterprise; product-aware |
| Ada | Established AI agent | Custom | $$$ | Medium | Mid-market+ |
| Intercom Fin | Bundled with Intercom | Trial | $0.99/resolution + Intercom | High | Intercom users default |
| Forethought | AI ticket triage + agent | Demo | $$$ | Medium | Zendesk users |
| Kapa.ai | Docs + technical Q&A | Trial | $$ | Very high | Technical docs / dev tools |
| Mendable (now Sidekick) | Docs Q&A | Trial | $$ | High | Docs-led help |
| Voiceflow | Build-your-own AI agent | Free trial | $50-300/mo | Very high | DIY agent builder |
| Cresta | Coaching + AI agent | Custom | $$$$ | Medium | Voice + chat enterprise |
| Ultimate.ai | Conversational AI | Custom | $$$ | Medium | EU enterprise |
| Yellow.ai | Multi-channel CAI | Custom | $$$ | Medium | Multi-channel |
| Drift Conversational AI | Inbound chat AI | Trial | $$ | Medium | Drift users |
| Crisp Chatbot AI | Crisp bundled | Bundled | Bundled | High | Crisp users |
| LangChain / LlamaIndex (DIY) | OSS | Free | Self-host | Very high | DIY agents |
| Vercel AI SDK + RAG (DIY) | DIY framework | Free | Hosting | Very high | Custom build |
| Zendesk AI / Bots | Zendesk native | Bundled | Bundled | Medium | Zendesk users |

The first decision is **build vs buy**: prebuilt platforms (Decagon/Sierra/Ada/Intercom Fin) for speed; DIY (Voiceflow / LangChain / Vercel AI SDK) for control. The second decision is **scope**: full ticket resolution (Decagon/Sierra) vs docs Q&A only (Kapa.ai) vs ticket triage (Forethought).

## Decide What You Need First

### Full ticket resolution (the 30% case)
You want AI to resolve customer tickets end-to-end (read context, take actions, escalate when needed).

Right tools:
- **Decagon** — enterprise leader
- **Sierra** — modern alternative
- **Ada** — established
- **Intercom Fin** — Intercom users

### Docs Q&A on website / in-app (the 25% case)
You want AI to answer questions from your knowledge base / docs.

Right tools:
- **Kapa.ai** — docs-led
- **Mendable / Sidekick** — alternative
- **Inkeep** — modern docs Q&A
- **Custom RAG with Vercel AI SDK** — DIY

### Ticket triage / agent assist (the 20% case)
You want AI to triage tickets, suggest responses, summarize history — but humans send replies.

Right tools:
- **Forethought** — Zendesk-aligned
- **Cresta** — voice + chat coaching
- **Ada / Decagon** — also do this
- **Intercom Fin** — assist mode

### DIY / custom agent (the 15% case)
You want to build your own with full control.

Right tools:
- **Voiceflow** — visual builder
- **LangChain / LlamaIndex** — Python OSS
- **Vercel AI SDK** — TypeScript
- **Custom RAG + Claude / GPT** — full custom

### Voice agents (the 10% case)
You handle phone support; want AI to take calls.

Right tools:
- **Cresta** — voice agent + coaching
- **PolyAI** — voice agent specialist
- **Voicebot via Twilio + LLM** — DIY
- **Sierra** (with voice extension)

## Provider Deep-Dives

### Decagon — enterprise leader
Founded 2023. Modern enterprise AI agent platform.

Pricing in 2026: enterprise; $50K-500K+/yr depending on volume.

Features: end-to-end ticket resolution, action-taking (refunds / cancellations / etc.), CRM + product data integration, voice + chat + email channels, learning from human feedback, brand voice training.

Why Decagon: best-in-class for enterprise; handles complex multi-step actions; high resolution rate (50-70% claimed).

Pick if: enterprise; complex support; willing to invest in implementation. Don't pick if: <500 tickets/mo (overkill).

### Sierra — modern alternative
Founded 2023. Bret Taylor (former Salesforce co-CEO + OpenAI board) co-founded.

Pricing in 2026: enterprise; competitive with Decagon.

Features: similar to Decagon (end-to-end agent, action-taking, multi-channel); strong product-data integration; voice + text.

Why Sierra: founder credibility; modern architecture; growing rapidly.

Pick if: alternative to Decagon; enterprise with modern stack. Don't pick if: SMB.

### Ada — established
Founded 2016. Long-established AI agent.

Pricing in 2026: $$$ ($30K-200K+/yr).

Features: AI agent across channels, integrations, analytics.

Why Ada: established; broad channel support; trusted brand.

Trade-offs: less innovative than Decagon / Sierra in 2026.

Pick if: established procurement preferred. Don't pick if: cutting-edge needed.

### Intercom Fin — Intercom users
Intercom's AI agent built on top of their platform.

Pricing in 2026: Intercom subscription + $0.99/resolution.

Features: deep Intercom integration, knowledge-base Q&A, ticket resolution, action-taking.

Why Intercom Fin: if you're already on Intercom, this is the path of least resistance; per-resolution pricing aligns cost with value.

Pick if: Intercom-native; want bundled. Don't pick if: not on Intercom (overhead to switch).

### Forethought — Zendesk-focused
Ticket triage + AI agent for Zendesk users.

Pricing in 2026: $$$ ($20K-150K/yr).

Features: triage, AI agent, knowledge base, agent assist.

Pick if: Zendesk-aligned; need triage + agent. Don't pick if: non-Zendesk stack.

### Kapa.ai — docs Q&A specialist
Founded 2022 (YC). Docs Q&A for technical products.

Pricing in 2026: $$ ($1K-10K/mo).

Features: trains on your docs / GitHub / Discourse / Slack; in-product widget; Slack bot; Q&A API.

Why Kapa: best for technical docs; developers love it; fast setup.

Pick if: technical product / dev tool with good docs; want Q&A widget. Don't pick if: full ticket resolution needed.

### Mendable / Inkeep — Kapa alternatives
Docs Q&A alternatives.

Pricing: similar to Kapa.

Pick by specific feature fit.

### Voiceflow — DIY builder
Visual agent builder.

Pricing in 2026: Free; Pro $50/mo; Team $300/mo; Enterprise custom.

Features: visual flow builder, LLM integration, multi-channel, NLU + actions, voice + text.

Why Voiceflow: visual; non-developers can build; flexible.

Pick if: want to design custom flows; DIY-comfortable. Don't pick if: full off-the-shelf preferred.

### Cresta — voice + chat enterprise
Voice + chat agent + coaching.

Pricing: enterprise.

Features: real-time agent assist + AI agent for voice / chat.

Pick if: voice support + AI coaching combo. Don't pick if: chat-only.

### LangChain / LlamaIndex / Vercel AI SDK — DIY
DIY frameworks.

Pricing: free; you host.

Pros: full control; lowest ongoing cost.
Cons: significant engineering investment; ongoing maintenance.

Pick if: technical team wants control; can afford engineering time. Don't pick if: time-to-launch matters more.

## What AI Customer Support Agents Won't Do

Buying an AI agent doesn't:

1. **Replace humans entirely.** Best agents resolve 30-60% of tickets; rest need humans.
2. **Solve bad documentation.** Agent is only as good as your knowledge base.
3. **Eliminate the need for ticket-quality measurement.** CSAT, resolution rate, escalation rate still matter.
4. **Work without integration.** Reading product data, taking actions requires APIs to your system.
5. **Resolve emotional / complex tickets.** Cancellation requests, complaints, edge cases need humans.

The honest framing: AI customer support is force multiplier on humans, not replacement. Best deployments are AI for tier-1 + humans for tier-2/3.

## Resolution Rate Reality

```text
Honest resolution rate expectations.

What providers claim: 60-80% resolution
What's actually achieved: 30-60% in production

Factors that drive resolution:
- Quality of knowledge base
- Common ticket types (FAQs > complex issues)
- Integration depth (can take actions)
- Brand voice training

Factors that lower it:
- Sparse / outdated docs
- Complex products (many edge cases)
- Required cross-system context
- Customers prefer humans

Measurement:
- Resolution: customer satisfied without human handoff
- Containment: handled without escalation
- Deflection: didn't reach human queue at all

Realistic targets:
- Year 1: 20-30% resolution
- Year 2: 40-50%
- Year 3: 50-60%

Cost-benefit:
- Per-ticket cost: human ~$5-25; AI ~$0.10-1.00
- Volume threshold: 1000+ tickets/mo justifies platform
- ROI typical: 6-18 months payback

For [COMPANY], output:
1. Realistic resolution target
2. Volume justifying investment
3. Implementation timeline
4. ROI projection
5. Quality metrics to track
```

The "knowledge base is the foundation" rule: AI agent can't answer what your docs don't say. Investing in docs (see documentation-strategy LaunchWeek) is prerequisite to AI agent success.

## Pragmatic Stack Patterns

### Pattern 1: <1K tickets/mo ($0-200/mo)
- **Kapa.ai** OR **Inkeep** for docs Q&A only
- Or DIY with **Vercel AI SDK + RAG**
- Don't deploy full agent yet
- Total: $0-500/mo

### Pattern 2: 1-10K tickets/mo SMB ($1-5K/mo)
- **Intercom Fin** if on Intercom
- Or **Voiceflow + LangChain** DIY
- 30-50% resolution target

### Pattern 3: 10-50K tickets/mo mid-market ($10-30K/mo)
- **Ada** OR **Forethought** if Zendesk
- Multi-channel
- Action-taking integration

### Pattern 4: 50K+ tickets/mo enterprise ($30-300K/mo)
- **Decagon** OR **Sierra**
- Complex actions; multi-system
- Custom training

### Pattern 5: Voice support ($enterprise)
- **Cresta** OR **PolyAI**
- Or **Twilio + LLM** DIY
- Voice agent

### Pattern 6: Technical / dev tool ($cheap)
- **Kapa.ai** for docs Q&A
- Combined with human-led tier-2
- Cost-effective

### Pattern 7: DIY ($hosting + engineering time)
- **Vercel AI SDK** + Claude/GPT + RAG
- Custom UI in product
- Total: $200-2K/mo + significant engineering

## Decision Framework: Three Questions

1. **What's your ticket volume?**
   - <1K/mo → docs Q&A only (Kapa.ai)
   - 1-10K/mo → Intercom Fin or Voiceflow
   - 10-50K/mo → Ada / Forethought
   - 50K+/mo → Decagon / Sierra

2. **What's your stack?**
   - Intercom-native → Intercom Fin
   - Zendesk-native → Forethought / Zendesk AI
   - Multi-channel → Ada / Decagon / Sierra
   - DIY-comfortable → Vercel AI SDK / LangChain

3. **What's your support complexity?**
   - Simple FAQs → docs Q&A (Kapa)
   - Standard SaaS support → Intercom Fin / Ada
   - Complex multi-step → Decagon / Sierra
   - Voice + chat → Cresta / Sierra

## Verdict

For 30% of B2B SaaS in 2026 evaluating AI support agents: **Intercom Fin** if on Intercom; **Decagon** for enterprise.

For 25%: **Ada** OR **Forethought** for mid-market.

For 20%: **Kapa.ai** for docs-led / technical products.

For 10%: **Sierra** for modern enterprise.

For 10%: **DIY (Vercel AI SDK / LangChain)** for tech-forward teams.

For 5%: **Voiceflow** for custom flow building.

The mistake to avoid: **deploying AI agent before docs are good**. Garbage in, garbage out. Invest in docs first.

The second mistake: **expecting 80% resolution out of box**. Realistic is 30-50% year 1; improves over time.

The third mistake: **no human escalation path**. Customers stuck in AI loop is worse than no AI. Always provide "talk to human" option.

## See Also

- [Customer Support Tools](../product-and-design/customer-support-tools.md) — help desk + ticketing
- [Live Chat & Chat Widget Tools](../product-and-design/live-chat-widget-tools.md) — chat widgets
- [Customer Education & LMS Platforms](../product-and-design/customer-education-lms-platforms.md) — adjacent education
- [Workspace Knowledge Base Tools](../product-and-design/workspace-knowledge-base-tools.md) — KB tools (foundation)
- [AI Agent Frameworks](./ai-agent-frameworks.md) — DIY agent building
- [AI SDK](./ai-sdk.md) — Vercel AI SDK
- [Claude API Integration](./claude-api-integration.md) — Claude as agent backend
- [MCP Model Context Protocol](./mcp-model-context-protocol.md) — agent tool calling
- [LLM Observability Providers](./llm-observability-providers.md) — monitoring agents
- [Voice AI Providers](./voice-ai-providers.md) — TTS / STT for voice agents
- [Vector Databases](../backend-and-data/vector-databases.md) — RAG storage
- [VibeWeek: AI Features Implementation](https://vibeweek.dev/6-grow/ai-features-implementation-chat) — building AI features
- [VibeWeek: RAG Implementation](https://vibeweek.dev/6-grow/rag-implementation-chat) — RAG pipeline
- [VibeWeek: Customer Support](https://vibeweek.dev/6-grow/customer-support-chat) — support strategy
- [LaunchWeek: Documentation Strategy](https://launchweek.dev/2-content/documentation-strategy) — docs as AI agent foundation
