# Voice AI Providers

Voice AI is the category of providers that turn text into speech (TTS), speech into text (STT), or run full speech-to-speech voice agents. The four serious players in 2026 are **ElevenLabs**, **Deepgram**, **Cartesia**, and **OpenAI Voice**. They look similar from the outside ("send text, get audio") but differ sharply on latency, emotional range, voice cloning, multilingual support, and what they're designed to do at the system level.

If you are building any product that talks — phone agents, podcast tooling, accessibility apps, conversational interfaces — you are picking among these. The right pick depends almost entirely on what your product is trying to do, and the wrong pick produces noticeable user-experience problems that no amount of prompt engineering can fix.

## What changed in 2026

If your mental model came from 2024, three things have shifted:

- **Latency floors have collapsed.** Sub-100ms time-to-first-audio is achievable for production TTS. The "walkie-talkie" pause that defined early voice agents is now an artifact of provider choice, not a fundamental constraint.
- **Voice cloning is now a 3-second-sample affair.** Cartesia and ElevenLabs both produce passable clones from short audio samples. The ethical guardrails matter more than the technical capability.
- **Speech-to-speech architectures arrived.** OpenAI's Realtime API and similar offerings collapse the STT → LLM → TTS pipeline into a single model, removing tens of milliseconds of latency at the cost of provider lock-in.

## The four providers

### ElevenLabs

**What it is**: text-to-speech with the strongest emotional range in the category. Multilingual v2.5 covers 30+ languages with native-level fluency. Voice marketplace, polished UI, the default for content-creation use cases.

**Latency**: ~135ms time-to-first-audio (TTFA) at 90th percentile on Flash/Turbo models. For real-time voice agents, end-to-end latency typically reaches 400ms+, which produces noticeable pauses in fast conversations.

**Voice cloning**: Professional Voice Cloning (PVC) generates digital twins from longer training data. Instant Voice Cloning works from a 1–2 minute sample. Output is sometimes indistinguishable from the source voice — which is why ElevenLabs' ethical guardrails (consent verification, watermarking, abuse detection) matter as much as the capability.

**Pricing in 2026**: credit-based, opaque tier structure. Roughly $0.10/minute equivalent for the agent product; character-based for raw TTS. Less transparent than Deepgram's per-minute pricing.

**Strengths**: cinematic emotional quality, the largest voice marketplace, the broadest language support, strong pronunciation accuracy (~82%) and prosody.

**Weaknesses**: latency for real-time agents (400ms+ end-to-end), opaque pricing, less natural ambient prosody than Deepgram in the "natural conversation" use case.

**Best for**: podcast and video narration, audiobook production, marketing content, multilingual storytelling, anywhere emotional depth matters more than millisecond latency.

### Deepgram

**What it is**: STT-first platform with strong real-time transcription and a TTS product that emphasizes natural prosody over emotional range. Used heavily in telephony, accessibility, and conversational AI back-ends.

**Latency**: TTS TTFA around 150ms; end-to-end transcription latency under 250ms in their Nova models. STT is the differentiator — Deepgram's transcription is widely considered the most accurate at production scale among the four.

**Voice cloning**: not supported. If you need cloned voices, this is the wrong tool.

**Pricing in 2026**: transparent per-minute pricing. STT is roughly $0.0043–$0.0058 per minute streaming; TTS varies. Generally the most cost-predictable of the four.

**Strengths**: best-in-class STT accuracy, natural-sounding TTS prosody (often rated higher than ElevenLabs in blind A/B tests for "naturalness"), strong on-prem and limited on-device options, transparent pricing, telephony-tuned audio quality.

**Weaknesses**: no voice cloning, English-only TTS for now, lower pronunciation accuracy on edge cases compared to ElevenLabs (especially on technical jargon and proper nouns), shorter character limits per request (2k characters).

**Best for**: real-time transcription, voice agent backends where you need fast accurate STT plus a serviceable TTS, accessibility products, telephony systems.

### Cartesia

**What it is**: ultra-low-latency TTS purpose-built for real-time voice agents. The Sonic model line is optimized for speed first; emotional range is the trade-off.

**Latency**: sub-100ms TTFA on Sonic 3, with model-internal latency around 40ms. Consistently the lowest of the four for streaming TTS.

**Voice cloning**: supported. Three-second sample produces a passable clone; 60-minute professional cloning produces production-grade output. Voice cloning is gated by an upload-with-consent flow.

**Pricing in 2026**: credit-based plans. Generally competitive with ElevenLabs Flash on a per-character basis; the speed advantage usually justifies any premium for real-time use cases.

**Strengths**: the fastest TTS in production, hallucination-resistant output (handles complex transcripts and industry jargon without making things up), enterprise-grade infrastructure (99.9% uptime, SOC 2), full on-premises support for buyers with data-residency constraints.

**Weaknesses**: lacks the cinematic emotional texture ElevenLabs offers — clean and professional, but not "moving." Pivoting to direct enterprise sales has reduced indie-friendliness; some features now gated behind sales conversations.

**Best for**: real-time AI phone agents, live conversational voice agents inside apps, latency-critical use cases (booking, dispatch, support), enterprise voice deployments.

### OpenAI Voice (Realtime API)

**What it is**: speech-to-speech via OpenAI's Realtime API — a single model that takes audio in and produces audio out, with the LLM reasoning happening inline. Bypasses the traditional STT → LLM → TTS pipeline.

**Latency**: very low end-to-end because it skips the pipeline composition. Specific TTFA numbers depend on session and audio characteristics; comparable to Cartesia for full-loop voice agents.

**Voice cloning**: not supported in any meaningful production form. Voice variety is curated; you pick from a set of OpenAI-provided voices rather than cloning.

**Pricing in 2026**: token-based, with separate audio-input and audio-output rates. Generally more expensive than the dedicated TTS providers when measured per minute, with the trade-off being the integrated LLM reasoning.

**Strengths**: tight integration with GPT models (the LLM reasoning happens inside the same call as the audio generation), unified billing, fast end-to-end loop, simple integration if you are already on OpenAI for the underlying LLM.

**Weaknesses**: locks you into OpenAI's LLM stack — you cannot pair this with Claude or Gemini reasoning easily. Limited voice variety vs. ElevenLabs marketplace. No voice cloning. Less emotional range than ElevenLabs.

**Best for**: OpenAI-native applications where you already pay for the underlying LLM, prototypes that benefit from the simplest possible voice-agent setup, conversational use cases where the unified-billing simplicity outweighs the lock-in.

---

## Side-by-side

| | ElevenLabs | Deepgram | Cartesia | OpenAI Voice |
|---|------------|----------|----------|--------------|
| **TTS** | Yes (best emotional) | Yes (most natural) | Yes (fastest) | Yes (integrated) |
| **STT** | Limited | Yes (best accuracy) | Limited | Yes (Whisper-based) |
| **Speech-to-speech** | Limited | Limited | Limited | Yes (native) |
| **TTFA latency** | ~135ms | ~150ms | ~40-100ms | Very low (S2S) |
| **End-to-end agent latency** | 400ms+ | 200-300ms | 150-250ms | 200-300ms |
| **Voice cloning** | Best (PVC + Instant) | No | Yes (3s sample) | No |
| **Languages** | 30+ | English | Multiple | Multiple |
| **Pricing model** | Credits, opaque | Per-minute, transparent | Credits | Per-token (audio) |
| **On-prem / on-device** | Limited | Yes | Yes | No |
| **LLM lock-in** | None | None | None | OpenAI only |
| **Best at** | Emotional content | Accurate transcription + natural TTS | Real-time agents | Integrated GPT voice loops |

---

## When to pick which

The pragmatic decision matrix for typical use cases:

| Job-to-be-done | Pick |
|----------------|------|
| **AI phone agent** (caller talks, agent responds) | **Cartesia** for TTS + **Deepgram** for STT — leaves headroom for LLM reasoning without the caller noticing |
| **Podcast or video narration** | **ElevenLabs** — emotional range is the whole point; latency does not matter |
| **Accessibility / screen reader** | **Deepgram** for STT + **ElevenLabs** or **Deepgram** for TTS — naturalness over speed; on-device support helps |
| **Live in-app voice agent** | **Cartesia** for TTS + **Deepgram** for STT, OR **OpenAI Realtime** if already on OpenAI |
| **Multilingual content production** | **ElevenLabs** — 30+ languages with accent retention is unmatched |
| **Customer-support voice bot** | **Cartesia** + **Deepgram** for the latency-critical loop; content-quality trade-off is worth it |
| **Audiobook generation** | **ElevenLabs** (Professional Voice Cloning + multilingual) |
| **Voice cloning for a specific person** | **ElevenLabs** for production-grade, **Cartesia** for fast iteration |
| **OpenAI-native rapid prototype** | **OpenAI Realtime** — the simplest path |
| **Air-gapped deployment** | **Cartesia** (full on-prem) or **Deepgram** (on-prem) — only options |

The pattern that wins more often than not for voice agents in production: **STT from Deepgram, TTS from Cartesia, LLM from your provider of choice**. Three specialists beats one generalist on quality across the loop, with the trade-off being three integrations to maintain.

---

## What none of them do (yet) at production scale

- **Truly emotional real-time agents.** ElevenLabs has the emotion, but not the latency. Cartesia has the latency, but not the cinematic emotion. The product that splits the difference does not yet exist; expect it within 12–18 months as model capacity improves.
- **Sub-100ms speech-to-speech with non-OpenAI LLMs.** OpenAI Realtime is the only mainstream S2S option; competitive offerings from Anthropic and Google are coming but not GA.
- **Cross-language voice cloning.** A clone of you speaking English does not yet sound like you speaking Japanese. ElevenLabs comes closest but the gap is audible.
- **Reliable noise / accent robustness.** STT degrades meaningfully on heavy background noise, strong accents, or multi-speaker overlap. Production voice agents still benefit from VAD (voice activity detection) preprocessing and turn-taking heuristics.

## Honest cost expectations

For a typical AI phone agent running 10,000 minutes per month with a Deepgram STT + Cartesia TTS + Claude LLM stack:

- STT (Deepgram Nova): ~$50/month
- TTS (Cartesia, ~50% talk-time): ~$80–150/month
- LLM (Claude Sonnet 4-class): $200–600/month depending on context length and tool use
- Compute / infrastructure: $20–80/month

Total: $350–900/month for 10k minutes. The LLM is usually the dominant cost, not the voice components.

For a podcast-narration use case (lower volume but premium TTS):

- ElevenLabs Pro at ~$22/month + character overage produces about 2 hours of finished audio per month.
- Voice cloning is a one-time setup and additional credits per generation.

## Integration patterns worth knowing

- **Use a voice-agent framework.** VAPI, Retell, and similar products wrap the STT → LLM → TTS loop and let you swap providers per layer. Saves the cost of building turn-taking and barge-in handling yourself.
- **Stream from the model.** If you wait for the LLM to finish before sending text to TTS, you double the perceived latency. Stream tokens to TTS as they're produced; modern TTS can start speaking within 100ms of receiving the first token.
- **Cache common responses.** Greetings, hold messages, and confirmations are the same every time. Pre-render them once, serve from a static asset, save the per-call TTS cost and latency.
- **Voice activity detection (VAD) at the client.** Don't send silent audio to the STT. Client-side VAD reduces STT cost ~30% and improves turn-taking.

## Cross-references on this site

- **AI models** that pair with these voice providers: [Claude](/ai-models/claude), [OpenAI GPT](/ai-models/openai-gpt), [Google Gemini](/ai-models/google-gemini)
- **Agent SDKs** for building the voice agent loop: [Claude Agent SDK](/ai-development/claude-agent-sdk), [AI SDK](/ai-development/ai-sdk)
- **Browser automation** for agents that combine voice + web: [Browserbase](/ai-development/browserbase)
- **Routing across providers**: [Vercel AI Gateway](/cloud-and-hosting/vercel-ai-gateway) — supports voice models in addition to text models
- **OpenAI TTS reference** (deeper than this article on the OpenAI specifics): [OpenAI TTS](/ai-development/openai-tts)

## Further reading

- [ElevenLabs](https://elevenlabs.io)
- [Deepgram](https://deepgram.com)
- [Cartesia](https://cartesia.ai)
- [OpenAI Realtime API](https://platform.openai.com/docs/guides/realtime)

For voice-agent frameworks that wrap multiple providers, see [VAPI](https://vapi.ai), [Retell](https://retellai.com), and [LiveKit Agents](https://livekit.io/agents).
