# LLM Evaluation & Prompt Testing Platforms: Promptfoo, Patronus, Galileo, Humanloop, Braintrust, LangSmith, Inspect, Anthropic Workbench

[⬅️ AI Development Overview](../ai-development/)

If you're building any AI feature in 2026 and you're past the "demo works" stage, you're in evaluation hell: every prompt change might regress quality on the use cases you've already shipped; every model upgrade might break the product; every feature launch is a leap of faith. The fix is a real evaluation harness — datasets of representative inputs + expected outputs, automated runs against every change, regression alerts, A/B testing in production. Without it, every prompt iteration is a guess; with it, you can ship AI features with the same confidence as deterministic code.

This is distinct from [LLM Observability Providers](./llm-observability-providers) (Langfuse / LangSmith / Helicone / Phoenix — runtime tracing of production LLM calls). Eval/testing happens in CI + during prompt iteration; observability happens in production. They overlap (some tools do both — LangSmith, Braintrust) but the workflows are different. It's also distinct from [AI Agent Evaluation](./ai-agent-evaluation) (the methodology); this article is about the TOOLS.

The 2026 landscape: Promptfoo dominates OSS/CLI; Braintrust + Humanloop lead managed evals for serious teams; Galileo + Patronus lead enterprise+safety; Inspect (UK AISI's open-source framework) is the rigorous research-grade option. Pick wrong and you get either DIY scripts that nobody trusts or $50K/yr platforms your team doesn't use.

## TL;DR Decision Matrix

| Provider | Type | Pricing Model | Free Tier | OSS / Self-Host | Indie Vibe | Best For |
|---|---|---|---|---|---|---|
| Promptfoo | OSS CLI eval framework | Free OSS / Cloud paid | Free OSS | Yes (MIT) | Very high | Engineering teams; CI-integrated; OSS-friendly |
| Braintrust | Managed evals + observability hybrid | Per-seat + usage | Free trial | No | High | Teams wanting evals + observability unified |
| Humanloop | Prompt management + evals | Custom (typically $10-30K+/yr) | Demo | Medium | Modern serious AI teams; prompt-versioning-led |
| Galileo | Enterprise eval + observability | Custom (enterprise) | Demo | No | Low | Enterprise; safety-focused; regulated |
| Patronus AI | Eval + safety + monitoring | Custom | Trial | No | Medium | Safety-focused; PII / hallucination detection |
| LangSmith | LangChain-native eval + obs | $39/dev/mo + | Free (5K traces/mo) | No | High | LangChain-using teams |
| Phoenix (Arize) | OSS eval + observability | Free OSS / hosted | Free | Yes (Apache 2.0) | High | OpenTelemetry-aligned; OSS-leaning |
| Helicone | Observability + light evals | Free (10K reqs/mo) | Free OSS | Yes (Apache 2.0) | High | Cost-tracking-first; light evals |
| Inspect AI (UK AISI) | OSS rigorous eval framework | Free OSS | Free | Yes (MIT) | Very high | Research-grade; rigorous evals |
| Anthropic Workbench | Claude-native prompt eval + iter | Free (within Anthropic console) | Free | No | High | Claude-using teams; prompt iteration |
| OpenAI Evals | OSS framework by OpenAI | Free OSS | Free | Yes (MIT) | High | OpenAI-using teams; OSS-leaning |
| AI Studio (Google) | Gemini-native prompt eval | Free (within Google AI Studio) | Free | No | High | Gemini-using teams |
| Confident AI / DeepEval | OSS eval framework + cloud | Free OSS / Cloud | Yes (Apache 2.0) | Yes | High | Pytest-style LLM evals |
| TruEra (Snowflake AI Observability) | Enterprise LLM observability + evals | Custom | None | No | Low | Snowflake / Databricks-bound enterprise |
| Weights & Biases Weave | ML + LLM evals | Bundled with W&B | Free tier | Partial | Medium | ML-team-led shops on W&B |
| RAGAS | OSS framework specific to RAG | Free OSS | Free | Yes (Apache 2.0) | High | RAG-specific evaluation |

The first decision is **what shape of evaluation you actually need**: simple regression-test in CI (Promptfoo, OSS frameworks), managed eval platform with observability (Braintrust, LangSmith, Humanloop), enterprise safety + compliance (Galileo, Patronus), or RAG-specific (RAGAS). Each has a clearly best tool. Picking the wrong shape is the most common mistake — usually defaulting to Galileo (enterprise platform) when Promptfoo would have shipped 10x faster.

## Decide What You Need First

LLM evaluation tools are not interchangeable. Get the shape wrong and you'll either pay too much or lack rigor.

### CLI / CI-integrated regression testing (the engineering-led case)

You have engineers; you want eval-as-code; you want to gate PRs on eval scores; you want simple Yaml/Python config for tests.

Right tools:
- **Promptfoo** — modern default for engineering teams
- **OpenAI Evals** — the original; good for OpenAI-heavy teams
- **DeepEval / Confident AI** — pytest-style
- **Inspect AI (UK AISI)** — rigorous research-grade
- **Phoenix** — OpenTelemetry-aligned

### Managed eval + observability (mid-market+)

You want a UI for non-engineers + datasets + LLM-as-judge + regression alerts + production observability all in one.

Right tools:
- **Braintrust** — leading modern choice
- **LangSmith** — best for LangChain teams
- **Humanloop** — prompt-management + eval focus

### Enterprise / safety / compliance

You're in regulated industries. You need PII detection, hallucination detection, audit logs, multi-tenant governance.

Right tools:
- **Galileo** — comprehensive enterprise
- **Patronus AI** — safety-first
- **TruEra (Snowflake)** — for Snowflake-bound enterprises

### Provider-native (Claude / OpenAI / Gemini)

You're using ONE provider primarily; you can do iteration in their console.

Right tools:
- **Anthropic Workbench** — for Claude
- **OpenAI Playground + Evals** — for OpenAI
- **Google AI Studio** — for Gemini

### RAG-specific

You're building retrieval-augmented generation; evaluations include retrieval quality, answer faithfulness, etc.

Right tools:
- **RAGAS** — purpose-built; OSS
- **Phoenix** — strong RAG support
- **Braintrust** — has RAG-specific features

### Agent-evaluation (multi-step)

You're evaluating agents (tool-calling, multi-step trajectories). See also [AI Agent Evaluation](./ai-agent-evaluation).

Right tools:
- **Inspect AI** — strong on agent eval
- **Braintrust** — has agent-specific features
- **DeepEval** — supports multi-turn

## Provider Deep-Dives

### Promptfoo

The OSS engineering-led default. Promptfoo (founded 2023; MIT-licensed) is to LLM evaluation what Jest is to JS testing — config-driven, CI-integrated, fast iteration.

**Strengths:**
- Open-source (MIT); self-host trivially.
- YAML config or programmatic Python/JS.
- CI-integration trivial (run on every PR).
- Compare prompts side-by-side (great for prompt iteration).
- LLM-as-judge built in.
- Multiple model-provider support (Claude, GPT, Gemini, OSS via OpenRouter).
- Active community + frequent updates.
- Promptfoo Cloud (paid) for collaboration + dashboard.
- Excellent docs.
- Red-team module for adversarial testing.

**Weaknesses:**
- Less polished UI than managed platforms.
- Storage of eval runs is local (or Cloud); not enterprise-team-shareable in OSS mode.
- Limited features for non-engineers (PMs, designers can't easily contribute test cases).
- Reporting / analytics weaker than enterprise platforms.

**Pricing:** Free OSS. Cloud: usage-based; $0/free tier; $99-499+/mo paid.

**Best for:** Engineering teams; CI-gated AI features; early-stage AI products; OSS-leaning teams. The default for most B2B SaaS adding evals in 2026.

### Braintrust

Modern managed evals + observability. Braintrust (founded 2023) hit fast in 2024-2026 with a polished UI for evals + production tracing in one platform.

**Strengths:**
- Polished UI; non-engineers can contribute test cases.
- Datasets + experiments + prompt playground integrated.
- LLM-as-judge with custom rubrics.
- Production observability bundled (alternative to Langfuse).
- AI Gateway integration (Vercel AI Gateway pairs natively).
- Team collaboration (multiple devs share datasets, prompts).
- Active product velocity.
- API for programmatic access.
- Reasonable pricing for teams.

**Weaknesses:**
- Vendor lock-in (data lives in Braintrust).
- Pricing can scale at enterprise (per-seat + usage adds up).
- Less rigorous than research-grade frameworks.
- Smaller community than Promptfoo / LangSmith.

**Pricing:** Free trial; Pro: per-seat + usage; Enterprise custom.

**Best for:** Teams wanting evals + observability unified; collaborative cross-functional work on AI quality; modern Series A-D AI-native SaaS.

### Humanloop

Prompt-management-first eval platform. Humanloop (founded 2020) emphasizes the prompt-versioning + iteration workflow with evals integrated.

**Strengths:**
- Prompt versioning + rollback first-class.
- Evals integrated with prompt iteration.
- Strong customer logo list (large enterprises).
- Solid LLM-as-judge.
- Workflow management for prompt changes.
- Compliance-strong (SOC 2, HIPAA-ready).

**Weaknesses:**
- More expensive than Braintrust at similar scale.
- UI density can feel busy.
- Less indie-friendly.

**Pricing:** Custom; expect $10-30K+/yr.

**Best for:** Mid-market+ teams that view prompts as critical IP; prompt-iteration-led workflows; teams with non-engineers in prompt-iteration loop.

### Galileo

Enterprise eval + observability + safety. Galileo (founded 2021) targets enterprise with comprehensive eval, observability, and safety features.

**Strengths:**
- Comprehensive (evals + observability + safety + compliance).
- Strong on hallucination detection.
- Galileo Luna (specialized small models for eval at scale).
- Enterprise governance.
- Strong customer support.

**Weaknesses:**
- Expensive (enterprise tier; $30K-300K+/yr typical).
- Setup complexity.
- Less indie-friendly.

**Pricing:** Custom; enterprise.

**Best for:** Enterprise; regulated industries; safety-critical applications.

### Patronus AI

Safety-first eval platform. Patronus AI (founded 2023) emphasizes safety, PII detection, hallucination detection, and red-teaming.

**Strengths:**
- Strong safety evaluation (PII leaks, harmful content, hallucinations).
- Adversarial testing built in.
- PandaScores for quality measurement.
- Compliance-aware (HIPAA / GDPR / financial).
- API + UI both.

**Weaknesses:**
- Newer; smaller customer base.
- Pricing on the higher end.
- Less broad than Galileo on observability.

**Pricing:** Custom; mid-market+.

**Best for:** Safety-critical AI applications; legal / healthcare / financial; teams needing robust safety eval.

### LangSmith

LangChain-native. LangSmith (by LangChain Inc.) is the natural choice if you're already on LangChain.

**Strengths:**
- Native LangChain integration (zero-friction).
- Solid eval + observability.
- Datasets + experiments + tracing.
- LLM-as-judge built in.
- Annotation queues for human-in-the-loop.
- Improving rapidly.

**Weaknesses:**
- LangChain-tilted; less natural for non-LangChain stacks.
- Pricing scales with team size + traces.

**Pricing:** Free (5K traces/mo); Plus $39/dev/mo; Enterprise custom.

**Best for:** LangChain-using teams; teams comfortable with LangChain ecosystem.

### Phoenix (Arize)

OSS observability + eval. Phoenix (Apache 2.0; by Arize AI) is OpenTelemetry-aligned, with strong RAG and LLM eval support.

**Strengths:**
- Apache 2.0; truly OSS.
- OpenTelemetry-native (interoperable).
- Strong RAG eval features.
- Embeddings analysis.
- Self-host or hosted.
- Active community.

**Weaknesses:**
- Setup heavier than Promptfoo.
- UI less polished than Braintrust.
- Smaller team than competitors.

**Pricing:** Free OSS; hosted custom.

**Best for:** OSS-strict teams; OpenTelemetry-aligned shops; RAG-heavy applications.

### Helicone

Observability-first; light evals. Helicone is primarily a proxy-based observability tool with eval capabilities added.

**Strengths:**
- Drop-in proxy (one-line integration).
- Cost tracking + observability.
- Open-source (Apache 2.0).
- Free tier real (10K reqs/mo).
- Light eval features.

**Weaknesses:**
- Eval features lighter than dedicated platforms.
- Best as observability primary, eval secondary.

**Pricing:** Free (10K reqs/mo); Pro $20+/mo.

**Best for:** Cost-tracking primary use case; lightweight eval needs.

### Inspect AI (UK AISI)

Research-grade open-source eval framework. Built by the UK AI Safety Institute; rigorous; for serious eval researchers.

**Strengths:**
- Open-source (MIT).
- Research-grade rigor.
- Strong agent-evaluation features.
- Built by safety researchers; reflects best practices.
- Adversarial testing.
- Reproducibility-first.

**Weaknesses:**
- Steeper learning curve.
- Targeted at researchers, not product teams.
- Less polish; more code.

**Pricing:** Free.

**Best for:** AI safety research; teams that want rigorous research-quality evals; academic / lab settings.

### Anthropic Workbench / OpenAI Playground / Google AI Studio

Provider-native iteration tools. Each frontier-model provider has a console for prompt iteration with light eval.

**Anthropic Workbench:**
- Free with Claude API access.
- Side-by-side prompt comparison.
- Streaming support.
- Test cases (datasets) feature added 2025-2026.
- Best for: Claude-using teams during prompt-iteration phase.

**OpenAI Playground + Evals:**
- Free with OpenAI account.
- Eval framework on GitHub (OSS).
- Less polished than newer competitors.

**Google AI Studio:**
- Free with Google AI access.
- Prompt experimentation for Gemini.
- Less mature on eval-specific features.

**When to use:** during prompt-iteration phase; when committed to ONE model. NOT a replacement for production-quality eval at scale.

### RAGAS

RAG-specific eval framework. RAGAS (open-source; Apache 2.0) is purpose-built for evaluating retrieval-augmented generation.

**Strengths:**
- RAG-specific metrics (context precision, recall, faithfulness, answer relevance).
- LLM-as-judge with RAG-aware rubrics.
- Free OSS.
- Well-maintained.

**Weaknesses:**
- RAG-only.
- Requires pairing with broader eval framework for non-RAG.

**Pricing:** Free.

**Best for:** RAG applications; pairs with Promptfoo / Braintrust for broader needs.

## What These Platforms Won't Do

Useful to be clear-eyed:

- **They won't define your eval criteria for you.** You decide what "good" means; tools score against your definition.
- **They won't catch every regression.** Eval coverage is YOUR responsibility; expect 60-80% coverage at best.
- **They won't replace human review.** LLM-as-judge is good but not perfect; sample human review is essential.
- **They won't substitute for production observability alone.** Eval is offline; obs is online; you need both.
- **They won't fix bad prompts.** Tools surface problems; humans fix them.
- **They won't auto-improve over time.** Datasets need maintenance, edge-case capture, and refresh.
- **They won't replace red-teaming.** Some tools have red-team modules; deeper adversarial work is its own discipline.
- **They won't make safety claims for you.** Eval results inform safety; you (and legal) make claims.

## Pragmatic Stack Patterns

Common 2026 stacks:

### Indie / pre-PMF AI feature

```
Manual testing in Anthropic Workbench / OpenAI Playground / Google AI Studio
+ no formal evals yet
+ fix prompts based on user feedback
```

Rationale: pre-PMF, evals are premature. Iterate rapidly first.

### Early-stage with shipped AI feature ($500K-3M ARR)

```
Promptfoo (free OSS) for CI-gated regression tests
+ Datasets in YAML / Git-versioned
+ Run on every PR via GitHub Actions
+ LLM-as-judge for quality scoring
+ Vercel AI Gateway for routing + light obs
```

Rationale: catch regressions cheaply; engineering owns this layer.

### Growth-stage AI-heavy SaaS ($3-30M ARR)

```
Promptfoo (CI gates) + Braintrust (collaborative datasets + observability)
+ Datasets evolve; non-engineers contribute via Braintrust UI
+ Production observability via Braintrust traces
+ Vercel AI Gateway integration
+ Optional: RAGAS for RAG flows
```

Rationale: scale + cross-functional contribution.

### Enterprise / regulated AI

```
Galileo OR Patronus (safety + compliance)
+ Promptfoo for engineering-side regression
+ Comprehensive observability (Galileo / Phoenix)
+ Adversarial testing program
+ Red-team review quarterly
```

Rationale: compliance + safety dominate; layer multiple tools.

### LangChain-aligned team

```
LangSmith (native LangChain integration)
+ Optional: Promptfoo for CI-side
+ RAGAS for RAG flows
```

Rationale: don't fight the ecosystem; use LangSmith.

### OSS-strict / self-hosted

```
Phoenix (self-hosted) for evals + obs
+ Promptfoo (OSS) for CLI tests
+ Helicone (OSS) as proxy
+ All self-hosted; no vendor data flows
```

Rationale: data sovereignty; OSS commitment.

### Provider-iteration (heavy Claude / OpenAI usage)

```
Anthropic Workbench / OpenAI Playground for prompt iteration
+ Promptfoo for CI regressions
+ Braintrust for collaboration once team grows
```

Rationale: native console + lightweight CI gives most teams what they need.

### Research / safety-led

```
Inspect AI (rigorous research-grade)
+ Promptfoo for CI
+ Adversarial testing
+ Red-teaming program
```

Rationale: research-quality rigor; safety-first.

## Decision Framework

### 1. Engineering team or cross-functional team?

- **Engineering only:** Promptfoo (CLI / CI)
- **Cross-functional:** Braintrust / Humanloop (UI for non-engineers)

### 2. Stage / ARR?

- **<$1M ARR / pre-PMF:** Skip formal evals; iterate manually.
- **$1-5M ARR:** Promptfoo OSS.
- **$5-30M ARR:** Promptfoo + Braintrust.
- **$30M+ ARR:** Add safety platform if regulated; otherwise Braintrust scales.

### 3. Compliance requirements?

- **Standard:** any.
- **Regulated:** Galileo or Patronus.
- **Research-rigor:** Inspect AI.

### 4. Already on a stack?

- **LangChain:** LangSmith.
- **Vercel AI Gateway:** Braintrust integrates natively.
- **Snowflake / Databricks:** TruEra.
- **OSS-strict:** Phoenix + Promptfoo.

### 5. RAG vs general?

- **RAG-heavy:** add RAGAS or Phoenix RAG features.
- **Agent-heavy:** Inspect AI or Braintrust agent features.
- **General LLM features:** broad eval platforms work.

## Verdict

For 2026 LLM evaluation + prompt testing:

- **Default for engineering teams:** **Promptfoo**. CLI / CI-gated; free; fits Git workflow.
- **Default for cross-functional teams (mid-market+):** **Braintrust**. Polished UI; collaborative.
- **Prompt-management-led:** **Humanloop**.
- **LangChain-aligned:** **LangSmith**.
- **OSS-strict:** **Phoenix** + Promptfoo.
- **Enterprise / safety-strict:** **Galileo** or **Patronus**.
- **RAG-specific:** **RAGAS** alongside primary platform.
- **Research-grade:** **Inspect AI**.
- **Quick iteration:** provider native (Anthropic Workbench / OpenAI / Google AI Studio).

The most common mistake in 2026: not having ANY evals. "We'll fix it later" → never gets fixed → AI features rot quietly. Even a 10-test Promptfoo suite is dramatically better than nothing.

The second most common mistake: overpaying for Galileo / Humanloop at small scale. Promptfoo + Braintrust covers most needs through $30M ARR.

The third mistake: confusing eval with observability. Eval = offline; tests run before deploying. Observability = online; production traces. Need both.

## See Also

- [LLM Observability Providers](./llm-observability-providers) — sister category (production observability)
- [AI Agent Evaluation](./ai-agent-evaluation) — methodology for agent eval
- [AI Agent Frameworks](./ai-agent-frameworks) — adjacent for building agents
- [AI SDK](./ai-sdk) — pairs for application-side AI
- [AI SDK Core](./ai-sdk-core) — pairs
- [AI Agent Memory Systems](./ai-agent-memory-systems) — adjacent
- [LLM Cost Optimization (VibeWeek)](../../VibeWeek/6-grow/llm-cost-optimization-chat.md) — adjacent operational discipline
- [LLM Quality Monitoring (VibeWeek)](../../VibeWeek/6-grow/llm-quality-monitoring-chat.md) — production-side discipline
- [In-Product AI Agent Implementation (VibeWeek)](../../VibeWeek/6-grow/in-product-ai-agent-implementation-chat.md) — pairs (evals are critical for agents)
- [Prompt Engineering](./prompt-engineering) — adjacent
- [Claude Prompt Engineering](./claude-prompt-engineering) — Claude-specific
- [Claude Code Hooks](./claude-code-hooks) — adjacent CI integration
- [ML Inference & GPU Hosting Platforms](../cloud-and-hosting/ml-inference-gpu-platforms) — adjacent infra
- [Vector Database Providers](../backend-and-data/vector-database-providers) — pairs (RAG eval depends on retrieval)
