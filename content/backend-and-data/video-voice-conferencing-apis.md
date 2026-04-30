# Video & Voice Conferencing APIs: Daily, LiveKit, Twilio Video, Zoom SDK, Agora, 100ms, Stream, Vonage

[⬅️ Backend & Data Overview](../backend-and-data/)

If you're building telehealth, online tutoring, customer support video, virtual events, or any in-product real-time video / voice feature in 2026, you need a WebRTC infrastructure provider. Most indie founders default-buy Twilio Video (familiar brand; declining feature pace) or Zoom SDK (consumer-recognizable; pricing unfriendly to product builders). Modern alternatives — Daily, LiveKit, 100ms — deliver better APIs, better latency, often half the price. The right pick depends on whether you're embedding 1:1 / small-group meetings (most cases), live-streaming to many viewers (different infra), telehealth-with-compliance (HIPAA-aligned subset), or building voice-only AI agents (Pipecat / Vapi / LiveKit Agents).

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Daily | Modern WebRTC API | 10K mins/mo | $0.004/min+ | Very high | Indie/mid-market video apps |
| LiveKit | OSS WebRTC + AI | Free OSS / Cloud free | $0.003/min+ | Very high | OSS-friendly; AI agents |
| Twilio Video | Established WebRTC | Free trial | $0.0040/min+ | Medium | Twilio-locked stacks |
| Zoom Video SDK | Zoom-branded SDK | Free trial | $0.65-1.20/host/mo | Low | Zoom-recognized branding |
| Agora | Massive-scale WebRTC | 10K mins/mo | $0.99/1K mins+ | High | Asia-Pacific; large-scale |
| 100ms | Modern API w/ AI | Free 10K mins | $0.10/1K mins+ | High | Cost-conscious modern |
| Vonage Video API | Formerly OpenTok / TokBox | Free trial | $0.004/min+ | Medium | Long-standing alt |
| AWS Chime SDK | AWS-native | Pay-per-use | $0.0017/min+ | Medium | AWS-locked |
| Stream Video | Stream.io's video product | Free trial | $0.004/min+ | High | Existing Stream chat users |
| Whereby Embedded | Simple iframe-based | Free trial | $9.99/host/mo | High | Quick embed; small-group |
| Jitsi Meet | OSS self-hostable | Free OSS | $0 + hosting | Very high | OSS purists |
| MediaSoup | Low-level WebRTC OSS | Free OSS | $0 + ops | Medium | Custom infra builders |
| Pipecat (AI voice) | Voice AI agent framework | Free OSS | $0 | Very high | Voice AI agents |
| Vapi | Hosted voice AI | $1 of free credit | $0.05/min+ | High | Voice AI agents (managed) |

The first decision is **what kind of real-time experience**. 1:1 / small-group calls (Daily / LiveKit / Twilio), large-room interactive (LiveKit / 100ms), 1-to-many livestream (Mux Live / Cloudflare Stream — different category), telehealth (HIPAA-aligned subset of the above), or voice AI agents (LiveKit Agents / Pipecat / Vapi) are different problems with overlapping vendors.

## Decide What You Need First

Tools are not interchangeable. Pick by use case + scale.

### 1:1 / small-group video (the 50% case)
You build telehealth, tutoring, customer support video, sales calls. 2-10 participants typically.

Right tools:
- **Daily** — modern indie default; great DX
- **LiveKit** — OSS + cloud; AI-native
- **Twilio Video** — established; Twilio ecosystem
- **Whereby Embedded** — quick embed if you want simple

### Interactive large rooms (the 20% case)
Online classes, virtual events, live shopping, town halls. 20-100+ participants; some interactive.

Right tools:
- **LiveKit** — handles 100+ well
- **100ms** — modern; built for scale
- **Agora** — large-scale specialist
- **Daily** — fine up to ~50

### Telehealth / HIPAA / compliance-heavy (the 15% case)
Video calls in healthcare; stricter compliance requirements.

Right tools:
- **Daily** with BAA — HIPAA-compliant
- **Twilio Video** — HIPAA-compliant
- **doxy.me** — telehealth-specific (not a generic API)
- **Zoom Video SDK** — HIPAA available

### Voice-only AI agents (NEW in 2025-26; the 10% case)
Build "talk to AI on the phone or in browser" features. Pipe ASR → LLM → TTS in real-time.

Right tools:
- **LiveKit Agents** — open-source framework + cloud
- **Pipecat** — Daily's open-source framework
- **Vapi** — managed voice AI
- **Retell AI** — managed voice AI

### Low-level / DIY (the 5% case)
You want full control; have ops capacity for SFU operation.

Right tools:
- **MediaSoup** — Node.js-based SFU
- **Jitsi Meet** — JS-based; self-host
- **Janus** — battle-tested SFU

## Provider Deep-Dives

### Daily — modern WebRTC default
Founded 2019 (formerly Pluot). Modern API; great developer ergonomics; "video as a feature" positioning. Released Pipecat (voice AI framework) in 2024.

Pricing in 2026: Free 10K participant-minutes/mo; Starter $9/mo; Production usage-based ($0.004/participant-minute).

Features: WebRTC for video / audio; Daily Prebuilt (drop-in iframe); Daily React; recording; live streaming; transcription; HIPAA BAA; global infra; Pipecat for voice AI.

Why Daily wins: best DX in the space. SDK quality top-tier. Great docs. HIPAA support without enterprise hoop-jumping. Pipecat for voice AI.

Trade-offs: smaller than Twilio in brand recognition. Pricing climbs at high scale.

Pick if: indie / mid-market building video features; want polished DX; HIPAA need; voice AI use case. Don't pick if: extreme scale (>10K concurrent) — Agora / LiveKit cheaper.

### LiveKit — OSS + cloud, AI-native
Founded 2021. Open-source SFU; growing fast. Cloud option since 2022. AI Agents framework released 2024.

Pricing in 2026: OSS free (self-host), Cloud free (10K mins/mo), Build $0.003/min+, Ship $$$, Scale custom.

Features: WebRTC SFU; React / iOS / Android / Flutter SDKs; recording; egress (RTMP, HLS); LiveKit Agents (real-time voice AI); ingress (RTMP / WHIP); WebRTC simulcast; spatial audio.

Why LiveKit wins: OSS option (real self-host capable); AI Agents framework; modern stack; strong voice-AI story.

Trade-offs: smaller ecosystem than Twilio; younger product. Self-hosting has ops burden.

Pick if: OSS-friendly; building voice AI; want option to self-host; modern stack. Don't pick if: enterprise procurement requires bigger vendor.

### Twilio Video
Twilio's WebRTC product (formerly Programmable Video). Established but slowing.

Pricing in 2026: $0.0040/min participant; recording / composition extra.

Features: rooms, recording, data tracks, REST API, Insights (analytics), HIPAA-compliant, broad SDK support.

Why Twilio: established brand. If you already use Twilio (SMS / Voice / Email), one less vendor. Procurement default.

Trade-offs: feature pace slowed since 2022 layoffs. UX feels older. Daily / LiveKit have leapfrogged.

Pick if: existing Twilio customer; need procurement-default brand; HIPAA need with comfort. Don't pick if: starting fresh — modern alternatives deliver more.

### Zoom Video SDK
Zoom's developer SDK. Different product than Zoom Meetings (consumer).

Pricing in 2026: $0.65-1.20/host/mo or per-min usage; pricing complex.

Features: video / audio / screen share / chat / recording; iOS / Android / Web SDKs; HIPAA-compliant; Zoom-quality WebRTC backend.

Why Zoom SDK: customers recognize "Zoom" branding. Real-time quality matches consumer Zoom.

Trade-offs: pricing isn't friendly to startups. Per-host model awkward for product builders. Brand association can feel mixed.

Pick if: Zoom branding helps your buyers. Don't pick if: cost-conscious; pure infra need.

### Agora — large-scale specialist
Chinese-origin (now US-listed). Massive global infra. Excellent in Asia-Pacific.

Pricing in 2026: Free 10K mins/mo; $0.99/1000 mins for video.

Features: video / voice / live broadcasting / interactive whiteboard / signaling / recording / voice changer; SDKs for everything.

Why Agora: best at extreme scale (100K+ concurrent in a room); strong APAC presence.

Trade-offs: SDK style feels older. Some compliance / data-residency concerns for non-Asian deployments.

Pick if: APAC market; massive concurrent rooms; cost-conscious at high volume. Don't pick if: small-room indie use (overkill).

### 100ms — modern competitor
Indian-origin (founded 2020). Modern WebRTC; competitive pricing; strong in 1:many use cases.

Pricing in 2026: Free 10K mins/mo; $0.10/1000 mins.

Features: SFU + composite recordings; React / iOS / Android / Flutter SDKs; HLS streaming; AI noise cancellation; HIPAA option.

Why 100ms: cheaper than Daily / LiveKit at scale; modern API; good DX.

Pick if: cost-conscious; large-room or live-streaming use case; APAC viable. Don't pick if: small-volume indie (Daily free tier already covers).

### Vonage Video API (formerly OpenTok / TokBox)
The OG WebRTC API (TokBox 2010 → Telefónica → Vonage 2018). Long-standing; declining mindshare.

Pricing in 2026: $0.004/min participant.

Features: video / chat / recording / SIP interconnect; SDKs.

Pick if: existing Vonage customer. Don't pick if: starting fresh — modern alternatives lead.

### AWS Chime SDK
AWS's WebRTC offering. Cheap; AWS-native.

Pricing in 2026: $0.0017/min attendee (cheapest); $0.0010 for content sharing.

Features: SDK for iOS / Android / JS / React; integrates with AWS services; HIPAA option.

Pick if: AWS-locked + cost-sensitive. Don't pick if: not AWS-aligned (DX is rougher than Daily / LiveKit).

### Stream Video
Stream.io's video product (2024). Pairs with their chat product.

Pricing in 2026: bundled with Stream Chat tiers; free trial.

Features: video / voice / chat in unified SDK; React / iOS / Android.

Pick if: existing Stream Chat customer or want chat + video unified. Don't pick if: starting fresh — Daily / LiveKit have stronger video DNA.

### Whereby Embedded
Norwegian; iframe-first embedded video. Simpler than full SDK.

Pricing in 2026: Build $9.99/host/mo; usage-based variants.

Features: iframe embed; permanent rooms; recording; transcription; HIPAA.

Pick if: simple embed; no need for deep customization. Don't pick if: want full SDK control.

### Jitsi Meet / MediaSoup / Janus — OSS self-host
- **Jitsi Meet** — full app (8x8 / Atlassian heritage); JS-based; self-hostable
- **MediaSoup** — Node.js SFU library; build your own
- **Janus** — battle-tested C-based SFU

Pick if: OSS-committed + ops capacity. Don't pick if: prefer SaaS DX.

### Voice AI Stack (NEW in 2025-26)

For "talk to AI" features:

- **Pipecat** (Daily, OSS) — Python framework chaining ASR → LLM → TTS for real-time voice
- **LiveKit Agents** (LiveKit, OSS) — TypeScript / Python; tightly integrated with LiveKit transport
- **Vapi** — managed voice AI; hosted; rapid build
- **Retell AI** — similar managed voice AI

Stack: WebRTC transport (Daily / LiveKit) + AI orchestration (Pipecat / LiveKit Agents) + ASR (Deepgram / AssemblyAI) + LLM (any) + TTS (Cartesia / ElevenLabs).

## What Video APIs Won't Do

Buying a video API doesn't:

1. **Make your video product good.** UX, error handling, onboarding, edge cases (poor connectivity, mic permissions, browser compatibility) are on you.
2. **Solve compliance entirely.** BAA / HIPAA / SOC 2 require BOTH the vendor's compliance AND your own audit.
3. **Give you live-streaming to 10K viewers cheaply.** WebRTC doesn't scale well to 1:many. Use HLS / Cloudflare Stream / Mux for that.
4. **Replace consumer Zoom.** Embedded video is a feature; replacing user habit with consumer-Zoom is hard.
5. **Solve recording compliance.** Recording adds storage costs + retention policy + access controls. Plan separately.

The honest framing: a video API is leverage for product builders. UX wraps it; compliance wraps it; storage wraps it. The vendor handles the hard real-time bits.

## Pragmatic Stack Patterns

### Pattern 1: Indie SaaS adding video calls ($0-200/mo)
- **Daily Free / Whereby Free** — 10K mins/mo
- iframe / prebuilt embed
- Total: $0-200/mo at growth

### Pattern 2: Mid-market video product ($200-2K/mo)
- **Daily** OR **LiveKit Cloud**
- Custom UI with their SDK
- Recording + playback (S3)
- Transcription (Deepgram / AssemblyAI)
- HIPAA BAA if needed

### Pattern 3: Telehealth / regulated ($500-5K/mo)
- **Daily HIPAA tier** OR **Twilio Video HIPAA**
- BAA signed
- Logging + audit
- Encrypted recording storage

### Pattern 4: Voice AI agent ($100-1K/mo)
- **LiveKit Agents** OR **Pipecat** — orchestration
- **LiveKit / Daily** — transport
- **Deepgram / AssemblyAI** — speech-to-text
- **OpenAI / Anthropic / open** — LLM
- **Cartesia / ElevenLabs** — text-to-speech

### Pattern 5: Large-room / live event ($1K-20K/mo)
- **LiveKit** OR **100ms** OR **Agora**
- HLS for non-interactive viewers
- WebRTC for interactive
- CDN-fronted

### Pattern 6: OSS / self-hosted ($0 + ops)
- **LiveKit OSS self-host** OR **Jitsi**
- Run your own SFU
- Add TURN servers
- Significant ops burden

## Decision Framework: Three Questions

1. **What's the use case?**
   - 1:1 / small group → Daily / LiveKit / Twilio
   - Telehealth / HIPAA → Daily / Twilio (with BAA)
   - Large interactive room → LiveKit / 100ms / Agora
   - Voice AI agent → LiveKit Agents / Pipecat / Vapi
   - Quick embed → Whereby

2. **What's your scale?**
   - <10K mins/mo → free tiers (Daily / LiveKit)
   - 10K-1M mins/mo → Daily / LiveKit / 100ms paid
   - 1M+ mins/mo → Agora / LiveKit / 100ms (cheaper at scale)

3. **Compliance / region?**
   - HIPAA → Daily / Twilio / Zoom SDK
   - SOC 2 → most vendors (verify)
   - APAC focus → Agora / 100ms
   - EU data residency → check region availability per vendor

## Verdict

For 50% of indie/mid-market SaaS in 2026: **Daily**. Best DX; HIPAA available; Pipecat for voice AI; reasonable pricing. The pragmatic default for product builders.

For 25%: **LiveKit**. OSS option; AI-native via LiveKit Agents; modern stack; cloud + self-host flexibility. Pick when OSS or voice AI matter.

For 10%: **100ms** or **Agora**. Specialist scale picks.

For 8%: **Twilio Video**. When existing Twilio customer or procurement-default brand needed.

For 5%: **Whereby Embedded**. Quick simple embed.

For 2%: **Vapi** / **Retell AI** for managed voice AI without full DIY orchestration.

The mistake to avoid: **picking Twilio Video by reflex because "Twilio is the API company"**. Twilio Video has slowed; Daily and LiveKit have leapfrogged on DX, AI integration, and price. Reassess if you're stuck with Twilio because it was the obvious pick three years ago.

The second mistake: **using a video API for live streaming to 1000+ passive viewers**. WebRTC is point-to-point-ish; cost / quality fails at scale. Use Mux Live / Cloudflare Stream for HLS-style large viewership; bridge to WebRTC for the small interactive subset.

## See Also

- [Background Jobs Providers](./background-jobs-providers.md) — recording / transcription queues
- [Email Providers](./email-providers.md) — meeting notifications / recording shares
- [Notification Providers](./notification-providers.md) — call invitations / reminders
- [Webhook Delivery Services](./webhook-delivery-services.md) — webhook events on call lifecycle
- [Search Providers](./search-providers.md) — searching call transcripts
- [Vector Database Providers](./vector-database-providers.md) — semantic search on transcripts
- [AI SDK](../ai-development/ai-sdk.md) — LLM layer for voice AI agents
- [Voice AI Providers](../ai-development/voice-ai-providers.md) — TTS / ASR adjacent
- [Video AI Providers](../ai-development/video-ai-providers.md) — generation (different)
- [Video Hosting & Streaming Providers](../cloud-and-hosting/video-hosting-streaming-providers.md) — pre-recorded video
- [Customer Support Tools](../product-and-design/customer-support-tools.md) — support over video
- [Live Chat & Chat Widget Tools](../product-and-design/live-chat-widget-tools.md) — chat companion
- [VibeWeek: Real-time Collaboration](https://vibeweek.dev/6-grow/real-time-collaboration-chat) — implementation companion
- [VibeWeek: WebSocket & SSE Implementation](https://vibeweek.dev/6-grow/websocket-sse-implementation-chat) — companion real-time tech
