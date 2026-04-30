# AI Voice & Phone Agent Platforms: Vapi, Bland, Retell, Synthflow, Air, ElevenLabs Conversational, Hume, Deepgram

[⬅️ AI Development Overview](../ai-development/)

If you're building software in 2026 that takes phone calls — sales SDR voicemails / inbound qualifying agents / restaurant order takers / appointment schedulers / customer support voice agents / outbound debt collection / survey automation / clinical intake — there's now a category of "AI voice agent" platforms that handle the full stack: speech-to-text, LLM reasoning + dialog management, text-to-speech, telephony (PSTN / SIP), and call analytics. You don't need to wire together Twilio + Deepgram + GPT + ElevenLabs yourself; these platforms bundle.

This is distinct from [voice AI providers](./voice-ai-providers.md) (which is the TTS/STT layer) and from broader [AI customer support agents](./ai-customer-support-agents.md) (which are mostly text-based). This category specifically handles **real-time conversational phone calls** with sub-second latency requirements that make architecture decisions matter.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Vapi | Developer-first voice agent platform | Free dev tier | $0.05-0.10/min | Very high | Indie + dev-first voice apps |
| Bland | No-code voice agent + scaling | Free trial | $0.09/min | Very high | Mid-market sales / outreach voice |
| Retell | Real-time voice with low latency | Free trial | $0.07/min + LLM | High | Latency-sensitive use cases |
| Synthflow | No-code voice agent builder | Free trial | $0.08-0.20/min | High | Non-technical builders |
| Air.ai | Voice-only sales agents at scale | Custom | Custom | Low | Enterprise sales voice |
| ElevenLabs Conversational AI | Voice-first; tight w/ ElevenLabs voices | Trial | $0.05-0.15/min | High | Voice-quality-priority |
| Hume EVI | Empathic voice (emotion-aware) | Trial | Custom | Medium | Emotional / mental health / coaching apps |
| Deepgram + Voice Agent | STT + voice agent layer | Free credits | Per-minute STT + LLM | Medium | Existing Deepgram users |
| Twilio Voice + AI Studio | Twilio's bundled stack | Trial | Twilio rates + AI | Medium | Existing Twilio shops |
| LiveKit Agents | OSS realtime voice agent framework | Free OSS | Self-host | Very high | Engineering teams wanting full control |
| Pipecat (Daily) | OSS voice agent framework | Free OSS | Self-host | Very high | OSS-leaning developers |
| Vocode | OSS voice agent toolkit | Free OSS / paid Cloud | Free / per-min | High | Developer-friendly Python-first |
| Cartesia | Low-latency voice models | Trial | Per-character | High | Voice quality + latency-priority |
| Coqui (now archived) | OSS TTS predecessor | Free | n/a | n/a | Migrate off |

The first decision is **build-vs-buy + latency requirement**:

- **Real-time conversational** (need <500ms response): Vapi / Retell / Bland / ElevenLabs Conversational
- **Asynchronous / longer-form** (voicemails, scheduled calls): more flexibility on platform choice
- **Maximum control / OSS**: LiveKit / Pipecat / Vocode self-hosted
- **No-code + scaling**: Bland / Synthflow

## Decide What You Need First

Voice agent platforms aren't interchangeable. Match to use case.

### Outbound Sales / SDR Calls (the 25% case)

You're calling prospects to qualify, schedule meetings, or send to live reps.

**Pick: Bland or Air.ai.** Both specialize in outbound sales motion with scale + handoff to human reps. Bland for self-serve / mid-market; Air.ai for enterprise-tier outbound at scale.

### Inbound Customer Support (the 25% case)

You take inbound calls; AI handles tier-1; escalates complex.

**Pick: Vapi or Retell.** Real-time latency; tight integration with your CRM; easy human-handoff. Some companies layer on top of existing IVR (Twilio Voice + AI Studio).

### Appointment Scheduling / Restaurant / Service (the 15% case)

Customer calls; AI books appointment / takes order / answers FAQs.

**Pick: Vapi or Synthflow.** Vapi for dev-first; Synthflow for no-code builders.

### Specialized: Mental Health / Coaching (the 5% case)

Need empathic voice + emotion-aware responses.

**Pick: Hume EVI.** Built for emotional voice interactions. Specialty.

### Voicemail / Async Voice (the 10% case)

Drop voicemails at scale; not real-time conversation.

**Pick: Twilio Voice + ElevenLabs API directly.** Real-time engine overkill; just synthesize + drop.

### Engineering team wanting full control (the 20% case)

You have AI infra capacity; want to own the stack.

**Pick: LiveKit Agents or Pipecat (OSS).** Self-hosted; integrate any STT / LLM / TTS; run on your infrastructure. Most flexibility.

## Provider Deep-Dives

### Vapi

The dominant developer-first voice agent platform. Founded 2023.

Strengths:

- **Best developer experience** in the category
- API-first; well-documented; SDKs in major languages
- Multi-LLM support (Claude, GPT, Gemini, custom)
- Multi-TTS support (ElevenLabs, PlayHT, Cartesia, OpenAI)
- Multi-STT (Deepgram, Whisper, AssemblyAI)
- Functions / tool use built in (AI can call your APIs mid-conversation)
- Good real-time latency (~300-500ms)
- Web SDK for browser-based calls (in addition to PSTN)
- Pricing $0.05-0.10/min + per-LLM-call pricing

Weaknesses:

- Newer; some enterprise features still maturing
- Per-minute cost adds up at scale
- Less polished no-code UX than Synthflow

Use Vapi when:

- Developer building custom voice agent
- Need flexibility across LLM / TTS / STT choices
- Latency matters

### Bland (formerly Bland.ai)

Voice agent platform with focus on sales / outreach + scale. Founded 2023.

Strengths:

- **Strong outbound sales motion** — large-scale parallel calling
- No-code builder + API
- Concurrent call handling
- Built-in CRM integrations
- Strong human handoff capabilities
- Pricing $0.09/min flat

Weaknesses:

- Latency higher than Vapi / Retell for real-time conversational
- More opinionated (less flexibility on stack)
- Reputation concerns (some users report deceptive marketing in 2024)

Use Bland when:

- Outbound sales / qualification / appointment-setting at scale
- Want bundled platform vs assembling

### Retell

Real-time voice with focus on low latency. Founded 2023.

Strengths:

- **Lowest latency** (~150-300ms response) — feels human
- Optimized for real-time conversational
- Good for customer support + inbound flows
- Multi-LLM + multi-TTS

Weaknesses:

- Smaller ecosystem than Vapi
- Sales / outbound features less developed

Use Retell when:

- Real-time inbound calls where latency = quality
- Customer support / FAQ-style use cases

### Synthflow

No-code voice agent builder. Founded 2023.

Strengths:

- **Best no-code UX** for non-technical builders
- Visual flow builder
- Quick setup
- Decent integrations (HubSpot, Pipedrive, Calendly)

Weaknesses:

- Less customizable than Vapi
- No-code abstraction sometimes hides necessary complexity

Use Synthflow when:

- Non-technical builder
- Quick deployment > custom logic

### Air.ai

Enterprise voice sales agent. Earliest in the category (~2022).

Strengths:

- **Largest enterprise voice sales agent footprint**
- Hours-long calls supported
- Enterprise sales + onboarding

Weaknesses:

- Sales-led contracting only
- Reputation issues (some early demos overpromised; quality varies)
- Less indie-friendly

Use Air.ai when:

- Enterprise sales voice agent
- Budget supports custom contract

### ElevenLabs Conversational AI

ElevenLabs' voice agent platform leveraging their best-in-class TTS.

Strengths:

- **Best voice quality** in the category (ElevenLabs voices)
- Emotional + tone control
- Multilingual
- Built on ElevenLabs voice models

Weaknesses:

- Voice-quality-priority means latency may suffer slightly
- Tighter to ElevenLabs ecosystem

Use ElevenLabs Conversational when:

- Voice quality is the differentiator
- Multilingual / accent flexibility matters

### Hume EVI (Empathic Voice Interface)

Emotion-aware voice agent. Founded 2021.

Strengths:

- **Detects emotion** in caller's voice + responds appropriately
- Built for emotional / coaching / mental-health use cases
- Specialty in empathic conversation

Weaknesses:

- Niche; not a generalist voice platform
- Smaller ecosystem

Use Hume EVI when:

- Emotional / mental health / coaching apps
- Empathic interaction is core to the product

### Deepgram + Voice Agent

Deepgram's voice platform extended to voice agents.

Strengths:

- **Best STT in the category** (Deepgram is the STT leader)
- Voice Agent API bundles end-to-end
- Strong for high-accuracy transcription needs

Weaknesses:

- Smaller voice-agent ecosystem
- Best when you're already on Deepgram

Use Deepgram when:

- STT accuracy matters (medical / legal / multilingual)
- Already on Deepgram

### Twilio Voice + AI Studio

Twilio's bundled voice + AI capabilities.

Strengths:

- **Already on Twilio** — minimal new vendor onboarding
- Bundled with rest of Twilio
- Enterprise-grade telephony infrastructure

Weaknesses:

- AI agent UX less polished than dedicated platforms
- Per-minute cost on top of Twilio

Use Twilio Voice + AI when:

- Existing heavy Twilio user
- Want unified vendor for voice infrastructure

### LiveKit Agents (OSS)

OSS framework for real-time voice agents.

Strengths:

- **Full self-host** — run on your infrastructure
- Engineering control over every layer
- Strong community + LiveKit Cloud option
- WebRTC-native (browser + mobile + PSTN)

Weaknesses:

- Engineering effort to assemble
- You handle scaling + ops

Use LiveKit Agents when:

- Engineering team with capacity
- Need full control / privacy / cost optimization

### Pipecat (Daily.co OSS)

OSS Python-first voice agent toolkit.

Strengths:

- **Python-native** — easy for ML engineers
- Modular: swap STT / LLM / TTS components
- Daily.co backing (commercial support option)

Weaknesses:

- Python-only
- DIY ops

Use Pipecat when:

- Python team
- ML / AI engineering culture
- Want OSS

### Vocode

OSS voice agent toolkit. Python-first.

Use Vocode when:

- Python team wanting OSS
- Less polished than Pipecat but functional

### Cartesia

Low-latency voice models (TTS-focused; agents emerging).

Strengths:

- **Lowest latency TTS** in 2026
- High-quality voices
- API-first

Use Cartesia when:

- Voice quality + latency priority
- Building on top of multiple platforms

## Architecture Patterns

### Real-Time Conversational

```
Phone Network (PSTN / SIP)
  ↓
Voice Agent Platform (Vapi / Retell / etc.)
  ↓ (bidirectional audio)
STT (Deepgram / Whisper / AssemblyAI) → LLM (Claude / GPT) → TTS (ElevenLabs / Cartesia)
  ↓ (function calls)
Your APIs / CRM / Database
```

Latency target: <500ms end-to-end response time.

### Voicemail Drop / Async

```
Trigger (CRM / cron) → 
Generate voicemail content via LLM →
Synthesize via TTS (ElevenLabs API direct) →
Twilio voice API to drop the voicemail
```

Doesn't need real-time agent platform; just LLM + TTS + telephony.

### Hybrid AI + Human

- AI handles initial qualification
- Triggered handoff to human rep (transfer or queue)
- Human picks up; AI's notes auto-populate

Most production B2B voice systems are hybrid.

## Cost Math

Voice is more expensive per interaction than text:

- **STT**: $0.005-0.01/min
- **LLM**: variable; depends on model + token volume
- **TTS**: $0.10-0.30 per 1K characters
- **Telephony (PSTN)**: $0.01-0.04/min outbound; $0.005-0.02/min inbound

Total per-minute: $0.05-0.30/min for typical voice agent call.

For a 5-minute customer support call: $0.25-1.50 per call.

For 100K calls/month: $25K-150K/month.

Pricing implications:

- Charge per-call or per-minute if you're customer-facing
- Bundle into per-seat for B2B SaaS
- Hard caps + alerts on customer usage

## What Voice Platforms Won't Do

**Don't expect indistinguishable-from-human.** 2026 voice agents are very good but most users notice within 30 seconds it's an AI. Be transparent ("Hi, I'm an AI assistant for...").

**Don't expect 100% accuracy.** STT errors + LLM hallucinations + TTS pronunciation issues = ~5-15% error rate even on best platforms. Plan for confirmation + escalation.

**Don't expect to handle ALL call types.** Complex calls (medical / legal / emotional) need human escalation. Build the handoff.

**Don't expect compliance to be solved.** Recording laws (one-party / two-party consent) vary; HIPAA / PCI compliance for voice is real; rules differ by region. Get legal counsel for regulated industries.

**Don't expect AI voice in every market.** Some accent / language combinations have lower STT accuracy. Test for your audience.

**Don't expect zero handoff.** Even best agents handoff 20-50% of calls to humans. Plan for it.

## Pragmatic Stack Patterns

### Indie / Solo Builder

- **Vapi** + Claude Sonnet + ElevenLabs
- $0.10-0.20/min effective
- Total: variable; usage-based

### Sales Outbound at Scale

- **Bland** for outbound calling
- CRM integration (HubSpot / Salesforce)
- Human handoff to live reps for qualified leads
- Total: $0.09-0.20/min + CRM cost

### Customer Support Voice Agent

- **Retell** for low latency
- LLM with your knowledge base in context
- Handoff to Zendesk / Intercom for human escalation
- Total: $0.07-0.15/min

### Restaurant / Service Booking

- **Synthflow** (no-code) or **Vapi**
- Calendar integration (Calendly / Google Calendar)
- POS integration if order-taking
- Total: $0.08-0.20/min

### Engineering-Heavy Custom

- **LiveKit Agents** or **Pipecat** self-hosted
- Custom LLM + TTS / STT
- Run on your infrastructure
- Total: variable; lower per-min at scale

### Healthcare / Regulated

- **Vapi or LiveKit** + BAA-compliant LLM (Claude Enterprise / Azure OpenAI)
- Recording + retention compliant
- Patient consent flows
- Total: variable + compliance overhead

## Decision Framework: Five Questions

1. **Real-time conversational or async?**
   - Real-time: Vapi / Retell / Bland
   - Async: simpler stack (LLM + TTS + Twilio)

2. **No-code or developer?**
   - Developer: Vapi / Retell / LiveKit
   - No-code: Synthflow / Bland

3. **Use case?**
   - Outbound sales: Bland / Air.ai
   - Inbound support: Retell / Vapi
   - Appointment / FAQ: Synthflow / Vapi
   - Empathic / mental health: Hume EVI

4. **Voice quality vs cost priority?**
   - Quality: ElevenLabs Conversational
   - Latency: Retell / Cartesia-backed
   - Cost: Deepgram + LLM

5. **OSS / self-host preference?**
   - Yes: LiveKit Agents / Pipecat / Vocode
   - No: managed platforms

## Verdict

**Default for indie / dev-first**: Vapi. Best DX; flexible stack; fair pricing.

**Default for outbound sales scale**: Bland.

**Default for inbound support latency-priority**: Retell.

**Default for no-code builders**: Synthflow.

**Default for OSS / self-host**: LiveKit Agents or Pipecat.

**Specialty**: Hume EVI for empathic; ElevenLabs Conversational for voice quality.

The most common mistakes:

1. **Underestimating latency requirements.** 1-second response time feels broken. Test with real calls.
2. **No human handoff plan.** Assuming AI handles 100%. It doesn't. Plan handoff at design time.
3. **Recording compliance ignored.** Two-party consent states require explicit notice. Don't skip.
4. **Over-promising AI capability.** "Indistinguishable from human." Customers detect; trust erodes.

## See Also

- [Voice AI Providers](./voice-ai-providers.md) — TTS / STT layer
- [Video AI Providers](./video-ai-providers.md)
- [AI Customer Support Agents](./ai-customer-support-agents.md)
- [AI Sales Agents / SDR Automation](../marketing-and-seo/ai-sales-agents-sdr-automation.md)
- [Conversation Intelligence & Meeting Recording Platforms](../marketing-and-seo/conversation-intelligence-meeting-recording-platforms.md)
- [AI Moderation & Trust & Safety Platforms](./ai-moderation-trust-safety-platforms.md)
- [AI Image & Video Editing Platforms](../image-generation/ai-image-video-editing-platforms.md)
- [AI Data Annotation & Labeling Platforms](./ai-data-annotation-labeling-platforms.md)
- [AI Agent Frameworks](./ai-agent-frameworks.md)
- [AI Agent Evaluation](./ai-agent-evaluation.md)
- [AI SDK](./ai-sdk.md)
- [AI SDK Providers](./ai-sdk-providers.md)
- [AI Gateways](../cloud-and-hosting/ai-gateways.md)
- [Vercel AI Gateway](../cloud-and-hosting/vercel-ai-gateway.md)
- [LLM Observability Providers](./llm-observability-providers.md)
- [LLM Evaluation & Prompt Testing Platforms](./llm-evaluation-prompt-testing-platforms.md)
- [Claude](../ai-models/claude.md)
- [OpenAI GPT](../ai-models/openai-gpt.md)
- [Google Gemini](../ai-models/google-gemini.md)
- [SMS / Voice APIs](../backend-and-data/sms-voice-apis.md) — Twilio / Bandwidth / Plivo
- [Notification Providers](../backend-and-data/notification-providers.md)
- [Video / Voice Conferencing APIs](../backend-and-data/video-voice-conferencing-apis.md)
- [Healthcare HIPAA-Compliant Stack & Tools](../auth-and-payments/healthcare-hipaa-compliant-stack-tools.md)
- [Customer Support Tools](../product-and-design/customer-support-tools.md)
- [Live Chat Widget Tools](../product-and-design/live-chat-widget-tools.md)
- [Customer Success Platforms](../product-and-design/customer-success-platforms.md)
- [User Research & Customer Interview Platforms](../product-and-design/user-research-customer-interview-platforms.md)
- [Sales Engagement Platforms](../marketing-and-seo/sales-engagement-platforms.md)
- [Sales Intelligence / Prospect Data](../marketing-and-seo/sales-intelligence-prospect-data.md)
- [CRM Providers](../marketing-and-seo/crm-providers.md)
- [HubSpot](../marketing-and-seo/hubspot.md)
- [Email Warmup & Cold Deliverability Tools](../marketing-and-seo/email-warmup-deliverability-tools.md)
- [AI Product Strategy & Roadmap (LaunchWeek)](https://launchweek.dev/content/1-position/ai-product-strategy-roadmap.md)
