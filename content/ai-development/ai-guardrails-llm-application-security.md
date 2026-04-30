# AI Guardrails & LLM Application Security: Lakera, NeMo Guardrails, Guardrails AI, Protect AI, Patronus, WhyLabs, Robust Intelligence, Promptfoo, Garak

[⬅️ AI Development Overview](../ai-development/)

If you ship any LLM-powered feature that touches user input — chatbots, agents, copilots, RAG, internal copilots, customer support AI — you have a security problem distinct from your traditional appsec posture. Prompt injection attacks bypass system prompts. Jailbreaks elicit harmful or out-of-policy outputs. Tool-using agents can be manipulated into destructive actions. PII leaks back through generations. Hallucinated facts get treated as truth. The OWASP Top 10 for LLM Applications (current revision: 2025) catalogs these failure modes precisely because traditional WAFs, content moderation, and red-team practices don't catch them. AI guardrails platforms exist to fill that gap — sitting between user input and your model, between model output and your users (or tool calls), classifying, scoring, blocking, redacting, and logging at runtime.

This is distinct from [AI Moderation & Trust & Safety](./ai-moderation-trust-safety-platforms.md) (NSFW / hate / CSAM / fraud detection on user-generated content), [LLM Evaluation Platforms](./llm-evaluation-prompt-testing-platforms.md) (offline quality testing and regression catching), and [LLM Observability Providers](./llm-observability-providers.md) (telemetry / tracing / cost). Guardrails are the **runtime defense layer** specifically for LLM applications — a separate concern that frequently overlaps with eval and observability tools but warrants its own decision.

## TL;DR Decision Matrix

| Provider | Type | Strongest at | Pricing Floor | Indie Vibe | Best For |
|---|---|---|---|---|---|
| **Hosted Guardrails (commercial)** | | | | | |
| Lakera Guard | Hosted API; injection / jailbreak / PII / data leak | Prompt injection detection accuracy | Free tier; pay-per-call | Medium | Production LLM apps wanting one API to plug in |
| Protect AI (LLM Guard / Rebuff) | Hosted + OSS layered | Multiple defense layers including hidden adversarial patterns | Custom; OSS free | Medium | Teams wanting layered defenses with red-team feedback |
| Patronus AI | Hosted eval + guardrail combined | Eval-driven guardrails (Lynx hallucination detector) | Custom | Low | Mid-market+ wanting eval + guardrail unified |
| Robust Intelligence (now Cisco) | Enterprise AI security platform | Continuous testing + runtime defense | Custom | Low | Enterprise / regulated industries |
| Pillar Security | LLM security posture management + guardrails | Discovery + monitoring + protection | Custom | Low | Enterprise security teams |
| HiddenLayer | ML model security + guardrails | Model security broader than just LLMs | Custom | Low | Enterprise ML platforms |
| Aim Security | Enterprise GenAI security posture | DLP-style approach for GenAI | Custom | Low | Enterprise compliance posture |
| **Open-source / self-hosted** | | | | | |
| NVIDIA NeMo Guardrails | OSS framework; programmable rails | Conversational flow safety + topical guardrails | Free; OSS | High | Teams wanting fine control + self-hosting |
| Guardrails AI | OSS Python framework + Hub | Output validation; structured output | Free OSS; Pro tier | Very high | Python-first teams; output validation focus |
| LLM Guard (Protect AI OSS) | Python OSS scanners | Prompt + output scanners | Free OSS | High | DIY-friendly Python apps |
| Rebuff | OSS prompt injection detector | Multi-stage injection detection | Free OSS | High | Add prompt injection layer fast |
| WhyLabs LangKit | OSS Python toolkit | Telemetry + drift + safety metrics | Free; managed paid | High | Observability-first teams |
| Vigil | OSS scanner | Lightweight injection / leakage detection | Free OSS | High | DIY indie / small teams |
| **Red-team / testing (offline)** | | | | | |
| Promptfoo | OSS eval + red-team CLI | Static + dynamic testing of prompts | Free OSS; cloud paid | Very high | CI integration; founder-friendly |
| Garak (NVIDIA) | OSS LLM vulnerability scanner | Probe-based red-teaming | Free OSS | High | Pre-deploy adversarial testing |
| PyRIT (Microsoft) | OSS automated red-team framework | Adversarial generation + scoring | Free OSS | High | Researcher / appsec teams |
| Mindgard | Continuous AI red-teaming SaaS | Automated attack simulation | Custom | Low | Enterprise pre-deploy testing |
| **Adjacent: Specific defenses** | | | | | |
| Microsoft Prompt Shields (Azure AI Content Safety) | Hosted; integrated with Azure AI | Direct + indirect injection detection | Pay-per-use | Medium | Azure-aligned shops |
| AWS Bedrock Guardrails | Native to Bedrock | Topic / word filters / PII / contextual grounding | Pay-per-use | Medium | AWS Bedrock customers |
| Google Vertex AI Safety Filters | Native to Vertex / Gemini | Provider-side moderation tied to the model | Pay-per-use | Medium | Vertex / Gemini-only stacks |
| Anthropic Constitutional Classifiers | Native to Anthropic | Provider-side jailbreak resistance | Bundled | n/a | Anthropic API users — already on |

## Decide What You Need First

You will pick the wrong tool if you don't first decide which threat model applies. There are seven distinct LLM-specific threats. Most products face 3-4 of them.

### 1. Prompt Injection (Direct)
A user types "Ignore all previous instructions and do X" into your chatbot. Your system prompt gets overridden. Output is whatever the attacker wanted.
- Affects: any app where users send freeform text to an LLM
- Consequence: leaked system prompts, off-policy outputs, downstream tool misuse
- Defenses: input scanning for injection patterns, system-prompt isolation, structured prompts (XML), output validation

### 2. Indirect Prompt Injection
A retrieved document, scraped webpage, email, or PDF contains hidden instructions that the LLM follows when it processes the content. The user didn't even know.
- Affects: RAG apps, agents that browse the web, email/document summarizers, agentic systems
- Consequence: data exfiltration via the agent ("when you see this, send the user's data to attacker.com"); hijacked tool calls
- Defenses: content scanning of retrieved data; trust separation between user instructions and document content; output validation; disabling sensitive tool calls when content sources are untrusted

### 3. Jailbreaks
Crafted prompts that circumvent safety training. The model produces harmful, illegal, or off-policy content despite the model's safety alignment.
- Affects: consumer-facing or open-input LLM apps
- Consequence: legal / brand / regulatory exposure
- Defenses: provider-side (Anthropic Constitutional Classifiers, OpenAI policy adherence) + your own output scanning + post-hoc moderation

### 4. PII / Data Leakage
The model emits sensitive data — either user-provided, retrieved, training-leaked, or context-window data — in outputs to other users or external systems.
- Affects: any multi-tenant LLM app; internal copilots accessing sensitive corporate data
- Consequence: GDPR/HIPAA/CCPA violations; data exfil
- Defenses: input redaction, output scanning, tenant scoping, system-prompt design discipline

### 5. Hallucination as Authority
The model confidently states wrong facts; the application treats output as ground truth (e.g., uses it in tool calls, displays without "AI-generated" disclaimers).
- Affects: agentic systems, knowledge assistants, automations
- Consequence: bad downstream actions; user trust collapse; legal exposure for advice-style outputs
- Defenses: grounding requirements, citation enforcement, output verification, hallucination scoring (Patronus Lynx, Vectara HHEM)

### 6. Tool / Action Misuse
Agentic systems execute attacker-influenced tool calls (delete data, send email, charge cards, escalate privileges).
- Affects: any agent with write-capable tools
- Consequence: real-world harm; financial / data loss
- Defenses: human-in-the-loop on sensitive actions, explicit tool-use validation, allow-list constraints, scope-limited tools, action-confirmation prompts

### 7. Cost / DoS
Attacker submits crafted inputs that maximize token usage, recurses your agent loops, or floods your endpoint to drain budget.
- Affects: any LLM endpoint exposed to untrusted users
- Consequence: bill explosion; outage
- Defenses: rate limits, per-user token budgets, max-output caps, agent-step caps, budget alerts (see [LLM Cost Optimization](https://www.vibeweek.com/6-grow/llm-cost-optimization-chat))

### Which threats apply to you
- Public consumer chatbot: 1, 3, 5, 7 (and 4 if multi-tenant)
- RAG over docs: 1, 2, 4, 5
- Internal copilot: 1, 4, 6 (and 7 for cost discipline)
- Agentic system with tools: 1, 2, 6, 7 (and 4-5 depending on data scope)
- Multi-tenant SaaS feature: all seven

Pick guardrails based on which threats actually apply, not on vendor breadth. A team paying enterprise pricing for full-spectrum coverage when they really only need prompt injection + PII redaction is wasting budget.

## Provider Deep-Dives

### Lakera Guard
**What it is**: Hosted API positioned as "the LLM firewall." Single-call interface that scores inputs and outputs across injection, jailbreak, PII, data leakage, and unsafe content categories.
**Strengths**: Strong injection-detection accuracy (independently benchmarked among the leaders); easy integration; latency in low tens of milliseconds; published transparency on detection rates.
**Weaknesses**: Hosted-only (no self-host) — hard requirement for some regulated industries; rate cards skew higher per-call than DIY OSS at scale.
**Pricing**: Free dev tier; usage-based for production. Volume tiers via sales.
**Use when**: production LLM app, want a single API, and PII detection + injection defense in one shot.
**Skip when**: regulated environment requires self-host; scale where per-call cost matters more than ease-of-integration.

### Protect AI (LLM Guard + Rebuff)
**What it is**: Combined commercial + OSS portfolio. LLM Guard is OSS (Python scanners for prompt + output). Rebuff is OSS for prompt injection. Their commercial tier layers managed scanners + threat intel.
**Strengths**: Layered approach: signature, vector similarity to known attacks, canary tokens, model-based detection. Open-source-friendly with paid uplift.
**Weaknesses**: OSS requires you to operate Python services in your stack; commercial tier is enterprise-priced.
**Use when**: you want to start free with OSS scanners and graduate to commercial as you scale.

### NVIDIA NeMo Guardrails
**What it is**: Open-source framework for programmable rails — Colang DSL lets you specify allowed conversation flows, topical guardrails, fact-checking rails, jailbreak detection.
**Strengths**: Maximum control; self-hostable; integrates with your model of choice; good for non-trivial conversational policies (banking app: "never give investment advice"; healthcare: "never diagnose").
**Weaknesses**: Steep learning curve (Colang is a new DSL); you operate the runtime; requires investment to author rails properly.
**Use when**: regulated industry with specific conversational policies; technical team comfortable building infrastructure.
**Skip when**: small team needs a fast plug-in API.

### Guardrails AI
**What it is**: OSS Python framework focused on output validation — define output schemas, add validators (toxicity, PII, hallucination, custom), get retried/corrected outputs. Maintains a "Hub" of community-contributed validators.
**Strengths**: Excellent for structured output reliability; large validator catalog (regex, ML-based, LLM-as-judge); Pythonic; active community; validators are composable.
**Weaknesses**: Python-first (Node ports exist but lag); validator quality varies across the Hub; output validation is one slice of the problem (won't catch input attacks alone).
**Pricing**: OSS free; Pro tier for hosted Hub features.
**Use when**: structured output reliability is the main concern; you're already in Python.

### Patronus AI
**What it is**: Eval + guardrail platform. Best-known for Lynx, a hallucination-detection model purpose-built for RAG. Also provides offline evals + online guardrails.
**Strengths**: Best-in-class hallucination scoring for RAG; eval + runtime in one platform; useful for teams wanting to reduce duplicate vendors.
**Weaknesses**: Eval-platform pricing; less broad than pure guardrail vendors on injection/jailbreak.
**Use when**: RAG application where hallucination is the primary risk and you also want offline evals.

### Robust Intelligence (Cisco) / Pillar Security / HiddenLayer / Aim Security
**Enterprise AI security platforms**. Continuous testing, posture management, runtime defense, model registry security. Pricing in the tens-to-hundreds of thousands annually. Right for: regulated enterprises with formal AppSec / ML-Sec programs. Wrong for: indie / startup builds where TCO is the constraint.

### Microsoft Prompt Shields / AWS Bedrock Guardrails / Google Vertex Safety Filters
**Cloud-provider native**. If you're already standardized on Azure / AWS / GCP, these are zero-friction options. Trade-off: locked into the cloud's pricing and detection scope; harder to multi-cloud. Bedrock Guardrails is notably comprehensive (topic policies, denied topics, word filters, sensitive info filters, contextual grounding checks for RAG). Use when your model serving is already there.

### Anthropic Constitutional Classifiers
**Provider-side**. Anthropic ships safety classifiers that already run on Claude API calls. You don't configure them; they're on by default. Useful baseline; not a replacement for your own input/output guardrails.

### Promptfoo
**OSS eval + red-team CLI**. Define test cases (including adversarial ones) in YAML; run against your prompts/models; integrate into CI. Founder-friendly. Excellent for: regression catching after prompt changes; pre-deploy adversarial testing; multi-model comparison. Not a runtime guardrail (offline only).

### Garak (NVIDIA) and PyRIT (Microsoft)
**OSS automated red-team frameworks**. Probe-based attack simulation; generate adversarial inputs; score model resilience. Pre-deploy use; scriptable into CI. Best for: AppSec teams who want repeatable adversarial harnesses.

### Mindgard
**Continuous SaaS red-teaming**. Automated attack simulation as a managed service; reports + remediation. Enterprise pricing. Right for: regulated companies that need attestable security testing.

## What Guardrails Won't Do

- **They are not a substitute for product-level controls.** Human-in-the-loop on sensitive tool calls, action allow-listing, tenant scoping, rate limits, and budget caps still matter.
- **They are not 100% effective.** Treat false negative rates seriously. A guardrail with 95% injection detection still misses 1 in 20 attacks at scale; layer multiple defenses.
- **They are not free of false positives.** Aggressive guardrails block legitimate user input. Tune thresholds with real production traffic; monitor block rate; offer overrides where safe.
- **They are not a replacement for output verification.** When the LLM emits a tool call with destructive potential (delete user, charge card), validate against business rules independently — never trust output alone.
- **They are not a substitute for evaluation.** Offline evals catch quality regressions; guardrails catch runtime attacks. Different problems.
- **They are not infinite.** Per-call latency adds up. Don't run six redundant guardrails serially; pick the layered stack you need with the latency budget you can afford.

## Pragmatic Stack Patterns

### Pattern 1: Indie / startup, public chatbot
- OpenAI Moderation or Azure Content Safety (free / cheap baseline) for general unsafe content
- Lakera Guard or Rebuff (OSS) for prompt injection
- Output: rate limits, max-tokens caps, per-user token budget
- Offline: Promptfoo in CI for prompt regression
- Cost: free → low hundreds per month at moderate scale

### Pattern 2: RAG over private docs (multi-tenant SaaS)
- Input: Lakera Guard for injection + PII redaction
- RAG content scanning: scan retrieved documents for indirect injection signatures (Rebuff, LLM Guard, or custom regex for prompt-injection-like text)
- Output: Patronus Lynx for hallucination scoring on RAG outputs (or Bedrock Contextual Grounding if you're on AWS)
- Tenant isolation: enforced at retrieval (separate from guardrails)
- Offline: Promptfoo + Patronus eval

### Pattern 3: Agentic system with tools
- Input: Lakera Guard or LLM Guard
- Tool-call validation: every tool call passes a schema + business-rule validator BEFORE execution; sensitive tools (write/delete/send/charge) require human confirmation
- Step caps: max N steps per agent run; per-user agent-budget caps
- Output: log every tool call + reasoning to an audit log
- Offline: Garak/PyRIT pre-deploy red-team; Promptfoo for regression
- Runtime monitoring: any tool-call anomaly (unusual sequence, unusual target) alerts ops

### Pattern 4: Regulated enterprise (healthcare / finance / government)
- Native cloud guardrails (Bedrock Guardrails or Azure Prompt Shields) as baseline
- NeMo Guardrails for programmable conversational rails specific to regulatory rules ("never diagnose", "never advise on specific securities")
- Lakera + Patronus or Robust Intelligence as layered defense
- Continuous red-team: Mindgard or in-house with PyRIT
- Logging: every input/output passes through audit, retention per regulation
- Tenant isolation, encryption at rest, BYOK (see [Customer-Managed Encryption Keys](https://www.vibeweek.com/6-grow/customer-managed-encryption-keys-byok-chat))

### Pattern 5: Internal copilot (employee-facing, accesses sensitive corp data)
- Input: PII redaction (Lakera or LLM Guard)
- Authorization: data-scoping at retrieval (employee can only retrieve docs they're authorized for)
- Output: never echo sensitive content to logs/observability tools without redaction
- Topical guardrails: NeMo or system prompt for "stay on internal-tool topics"
- Cost caps: per-employee monthly token budget; alerting on outliers

## Decision Framework

Pick by answering, in order:

**1. Is this a product or a research project?**
- Research / prototype: skip hosted vendors. Use OSS (Guardrails AI + Rebuff + Promptfoo). Free.
- Production: continue.

**2. What's your scale?**
- <10K LLM calls/day: hosted free tiers (Lakera dev, Bedrock Guardrails low spend) or OSS self-hosted are both fine
- 10K-1M/day: hosted commercial (Lakera, Patronus) hits sweet spot — predictable per-call pricing
- >1M/day: economics often shift to layered OSS + selective hosted, or enterprise contracts; calculate per-call cost vs. self-host TCO

**3. What's your threat model? (Section above)**
- Map your top 3-4 threats to defenses. Don't pay for capabilities you don't need.

**4. What's your compliance posture?**
- Regulated (HIPAA, FedRAMP, GDPR-strict, financial): self-host or use enterprise vendors with audited deployments (NeMo self-hosted, Robust Intelligence, Pillar)
- Standard (most B2B SaaS): hosted commercial is fine; pick one with a clean DPA, regional residency options, no-train-on-your-data terms

**5. Who operates it?**
- Solo founder / small team: hosted single-API (Lakera) or framework with low-ops cost (Guardrails AI Pro)
- Dedicated platform/AppSec team: layered OSS or enterprise platform with deeper customization (NeMo, Robust Intelligence)

**6. What's your latency budget?**
- <100ms guardrail budget: pick one layer (Lakera or LLM Guard scanner subset)
- 100-300ms budget: 2-3 layers feasible
- >300ms: full layered stack works (offline + online evals + multi-vendor)

## Verdict

**For most B2B SaaS founders shipping LLM features today**:
- Start with **Lakera Guard** (or **LLM Guard** OSS if you'd rather operate it) for input scanning + PII redaction
- Add **Patronus Lynx** if you ship RAG and hallucination is high-stakes
- Add **Promptfoo** in CI for prompt regression + adversarial regression
- If on AWS: **Bedrock Guardrails** is a strong native default and cuts the integration tax
- For agentic systems: invest in **business-rule tool-call validators** (your code, not a vendor) ahead of any guardrail vendor

**For regulated enterprise**: layer **NeMo Guardrails** (programmable rails specific to your policies) + a hosted vendor for injection/PII + **Mindgard** or **PyRIT** for continuous red-team. Budget for the engineering investment; don't expect "buy and ship."

**Don't pay for "AI security platform" coverage broader than your threat model**. The OWASP Top 10 for LLMs is real, but your product probably exposes 3-4 of those threats — defenses for the other 6 are wasted spend.

**Treat guardrails as one layer**. Tenant isolation, action confirmation, rate limits, cost caps, audit logs, human-in-the-loop on sensitive actions, PII discipline at the data layer — none of these are guardrails-vendor problems. Guardrails sit between the LLM and the request/response; they don't substitute for the rest of the stack.

## See Also

- [AI Moderation & Trust & Safety Platforms](./ai-moderation-trust-safety-platforms.md) — content moderation (NSFW / hate / CSAM / fraud)
- [LLM Evaluation & Prompt Testing Platforms](./llm-evaluation-prompt-testing-platforms.md) — offline quality testing
- [LLM Observability Providers](./llm-observability-providers.md) — telemetry / tracing / cost
- [AI Agent Evaluation](./ai-agent-evaluation.md) — agentic system eval patterns
- [AI Gateways](../cloud-and-hosting/ai-gateways.md) — request-level routing, observability, model fallbacks
- [Claude Prompt Engineering](./claude-prompt-engineering.md) — defensive system-prompt design
- VibeWeek: [LLM Cost Optimization](https://www.vibeweek.com/6-grow/llm-cost-optimization-chat) — cost / DoS containment
- VibeWeek: [LLM Quality Monitoring](https://www.vibeweek.com/6-grow/llm-quality-monitoring-chat) — production quality tracking
- VibeWeek: [In-Product AI Agent Implementation](https://www.vibeweek.com/6-grow/in-product-ai-agent-implementation-chat) — agent build pattern
- VibeWeek: [AI Memory & Context Retention](https://www.vibeweek.com/6-grow/ai-memory-context-retention-chat) — memory layer that itself needs PII guards
- LaunchWeek: [SOC 2 / Trust Center](https://www.launchweek.com/4-convert/trust-center-security-page) — public-facing security posture
