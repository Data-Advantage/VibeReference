# Workplace AI Search & Internal Knowledge Tools: Glean, Dust, NotebookLM Enterprise, Inkeep, Onyx, Haystack, Microsoft Copilot, ChatGPT Enterprise, Claude Enterprise

[⬅️ AI Development Overview](../ai-development/)

If you're scaling a B2B SaaS past ~50 employees in 2026, you're hitting a knowledge problem: institutional memory lives in a sprawl of Notion, Slack, Google Drive, GitHub, Linear, Salesforce, Zendesk, internal wikis, and dozens of email threads. New hires take weeks to find anything; senior engineers waste 30 minutes per question; "ask the team in Slack" reposts the same answer fourth time this quarter. The naive shape: "we'll just use Notion search." It works for 20 employees; it breaks at 100.

A workplace AI search tool indexes ALL your tools, applies semantic retrieval + LLM synthesis, and answers natural-language questions with citations to your real internal docs. The 2026 landscape: Glean is the enterprise leader; Dust is the modern challenger; NotebookLM Enterprise is the Google bet; ChatGPT Enterprise / Claude Enterprise / Microsoft Copilot are the frontier-AI-vendor entries; Onyx is the OSS option.

This is distinct from [LLM Observability](./llm-observability-providers) (production AI monitoring), [LLM Eval Platforms](./llm-evaluation-prompt-testing-platforms) (testing prompts), and [AI Customer Support Agents](./ai-customer-support-agents) (customer-facing). Workplace AI search is INTERNAL — your team finding their own information.

## TL;DR Decision Matrix

| Provider | Type | Pricing Model | Free Tier | OSS / Self-Host | Indie Vibe | Best For |
|---|---|---|---|---|---|---|
| Glean | Enterprise workplace AI (the leader) | Custom (typically $40-100/user/yr) | Demo | No | Low | Mid-market+ enterprises (200+ employees) |
| Dust | Modern AI agent platform + workplace search | $29-79/user/mo | Free trial | No | High | Modern SaaS startups (Series A-D) |
| NotebookLM Enterprise (Google) | AI notebooks bundled with Google Workspace | Bundled $30/user/mo | Trial | No | Medium | Google Workspace shops |
| Inkeep | AI search for technical docs / engineering | $99-499/mo | Trial | No | Very high | Engineering teams; OSS docs use cases |
| Onyx (formerly Danswer) | OSS workplace AI search | Free OSS / Cloud | Free OSS | Yes (MIT) | Very high | OSS-leaning teams; self-host |
| Microsoft 365 Copilot | Microsoft-bundled AI | $30/user/mo | Trial | No | Low | Microsoft-stack enterprises |
| ChatGPT Enterprise | OpenAI-bundled enterprise AI | $60/user/mo | Demo | No | Medium | OpenAI-aligned enterprises |
| Claude Enterprise | Anthropic-bundled enterprise AI | Custom | Demo | No | High | Modern tech-forward enterprises |
| Notion AI | Notion-native AI | $8-10/user/mo (Notion Pro+) | Trial | No | High | Notion-heavy companies |
| Slack AI | Slack-native AI | $10/user/mo | Trial | No | Medium | Slack-heavy companies |
| Coda AI | Coda-native AI | Bundled | Trial | No | High | Coda-heavy teams |
| Atlassian Rovo | Atlassian-stack AI | Bundled with Premium+ | Trial | No | Medium | Atlassian (Jira / Confluence) shops |
| Mem | AI-enhanced personal note-taking | $10-20/mo | Free trial | No | High | Individual / small team |
| Reflect | AI-enhanced personal notes | $10/mo | Trial | No | High | Individual / small team |
| Hebbia | Document intelligence (financial / legal) | Custom (enterprise) | Demo | No | Low | Financial services / legal / regulated |
| Coveo | Enterprise search (legacy) | Custom (enterprise) | Demo | No | Low | Legacy enterprise; deep customization |

The first decision is **what shape of workplace AI you actually need**: enterprise unified search across many tools (Glean), AI-native agent platform (Dust), provider-bundled AI (Microsoft / Google / OpenAI / Claude Enterprise), tool-native AI (Notion / Slack / Coda / Atlassian), engineering / docs search (Inkeep / Onyx), or personal AI notes (Mem / Reflect). Each shape has a clearly best tool. Picking the wrong shape is the most common mistake — usually defaulting to Glean at 50-person scale (overkill) or staying on Notion AI at 500-person scale (insufficient).

## Decide What You Need First

Workplace AI tools are not interchangeable. Get the shape wrong and you'll either pay $50K+/yr for capability you don't use or hit a knowledge-fragmentation wall.

### Enterprise unified search (the 200+ person case)

Your company has 5-15 different tools. Knowledge is scattered. Onboarding new hires is painful. You need ONE place to search everything.

Right tools:
- **Glean** — the leader; broadest connector catalog
- **Dust** — modern alternative; AI-agent-leaning
- **Onyx** — OSS for self-host
- **Microsoft Copilot** (if Microsoft-stack)
- **NotebookLM Enterprise** (if Google Workspace-stack)

### Modern AI agent + workplace knowledge

You want both: search internal docs AND build internal AI agents (sales-research agent, recruiting agent, support-helper agent).

Right tools:
- **Dust** — leading on this hybrid
- **ChatGPT Enterprise + Custom GPTs**
- **Claude Enterprise + Projects**

### Provider-frontier-bundled

You want frontier AI (Claude / GPT-5 / Gemini) for your team without picking a separate workplace platform.

Right tools:
- **ChatGPT Enterprise** — OpenAI-frontier; SOC 2; data privacy
- **Claude Enterprise** — Anthropic-frontier; Projects feature; large context
- **Microsoft Copilot** — Microsoft-stack-bundled; Office integration
- **NotebookLM Enterprise** — Google-frontier; Google Workspace integration

### Engineering / technical docs

Your primary need: engineering team finding answers across GitHub, technical docs, internal RFCs, runbooks.

Right tools:
- **Inkeep** — purpose-built for technical knowledge
- **Onyx** — OSS technical search
- **Glean** — works but more enterprise-focus
- **Dust** — works for technical teams

### OSS-strict / self-hosted

You can't / won't send data to third-party AI vendors. Air-gapped or strict compliance.

Right tools:
- **Onyx (Danswer)** — MIT-licensed; self-host
- **Haystack (deepset)** — OSS RAG framework; build-your-own
- **LlamaIndex** + custom — DIY route

### Tool-native (existing tool's AI features)

You're already heavy on Notion / Slack / Coda / Atlassian. Their bundled AI may suffice.

Right tools:
- **Notion AI** — for Notion-heavy teams
- **Slack AI** — for Slack-heavy teams
- **Coda AI** — for Coda-heavy teams
- **Atlassian Rovo** — for Jira / Confluence-heavy

### Individual / small-team personal AI notes

You're <20 people; mostly individual knowledge work; not yet enterprise-scale knowledge problem.

Right tools:
- **Mem** — AI-enhanced notes
- **Reflect** — AI-enhanced notes
- **Notion AI** with team workspace
- **Claude Projects** — context-window-as-knowledge

## Provider Deep-Dives

### Glean

The enterprise leader. Glean (founded 2019; ex-Google) defined the workplace-AI-search category and remains the gold standard for enterprises with budget.

**Strengths:**
- Broadest connector catalog (100+ integrations: Notion, Confluence, Google Drive, Slack, GitHub, Salesforce, Zendesk, etc.).
- Fast, accurate semantic search.
- Personalized: knows what you work on; surfaces relevant.
- AI Assistant for Q&A across all your data.
- Custom Glean Apps (build internal tools that use search as foundation).
- SOC 2 / ISO 27001 / EU residency.
- Strong audit logging.
- Mature enterprise integration (SSO, SCIM, RBAC).
- Glean Agents (since 2024) for internal agentic workflows.

**Weaknesses:**
- Pricing is enterprise-tier ($40-100/user/yr typical).
- Setup non-trivial (1-3 months for full deployment).
- Smaller companies under-utilize.
- Less indie-friendly.
- Some teams find AI answers conservative compared to Dust.

**Pricing:** Custom; expect $30-100K+/yr for mid-market; $200K+/yr for enterprise.

**Best for:** 200+ employee enterprises with knowledge sprawl across 8+ tools. The default for serious mid-market and enterprise.

### Dust

The modern AI-agent challenger. Dust (founded 2023; Paris-based) bundles workplace AI search with agent-building capabilities — letting teams not just search but BUILD internal AI workflows.

**Strengths:**
- Modern UX; fast iteration.
- Strong AI agent builder (custom assistants per use case).
- Connector catalog growing fast.
- Per-user pricing more accessible than Glean.
- Good for teams wanting AI-FORWARD workflows, not just search.
- French / EU-friendly (GDPR-native).
- Active product velocity.
- Free trial real.

**Weaknesses:**
- Smaller catalog than Glean (50+ integrations vs 100+).
- Less enterprise-deep features (Glean's audit / SSO / SCIM more mature).
- Newer; smaller customer base.

**Pricing:** $29/user/mo (Pro); $79/user/mo (Business). Enterprise custom.

**Best for:** Modern Series A-D SaaS; AI-forward teams; companies wanting to build internal agents alongside search.

### NotebookLM Enterprise (Google)

Google's bet on workplace AI. NotebookLM Enterprise integrates with Google Workspace (Drive, Docs, Gmail) plus selected third-party integrations.

**Strengths:**
- Bundled with Google Workspace Business+ / Enterprise tiers.
- Native Google Drive / Docs / Gmail integration.
- Gemini-powered; large context window.
- Audio overviews (the killer demo feature).
- Strong document analysis.
- Enterprise governance.

**Weaknesses:**
- Google Workspace-tilted; less useful for non-Google companies.
- Connector catalog smaller than Glean.
- Newer enterprise features still maturing.

**Pricing:** Bundled with Google Workspace Business Standard+ ($14-30/user/mo).

**Best for:** Google Workspace-heavy companies; teams that primarily live in Drive + Docs.

### Inkeep

Engineering-focused AI for documentation. Inkeep is purpose-built for "AI search across technical docs" — popular for OSS projects, devtool documentation, internal engineering knowledge.

**Strengths:**
- Specialized for technical docs.
- Embeddable widget (use it on your public docs site).
- Citations to source docs.
- Fast iteration on docs improvements.
- Reasonable pricing for SMB.
- Pairs with [In-Product Help Center](../../VibeWeek/6-grow/in-product-help-center-knowledge-base-chat.md) implementations.

**Weaknesses:**
- Narrower than Glean (technical docs primary use case).
- Smaller team.
- Less mature for non-engineering knowledge.

**Pricing:** $99-499/mo per workspace.

**Best for:** Engineering teams; OSS projects; devtool / API documentation; in-product technical Q&A.

### Onyx (formerly Danswer)

The OSS workplace AI search. Onyx (MIT-licensed; founded 2023) provides Glean-like functionality you can self-host.

**Strengths:**
- Open-source (MIT).
- Self-host on Kubernetes.
- 50+ connectors growing fast.
- Active community.
- Cloud-hosted option for teams that don't self-host.
- Strong on data sovereignty (data never leaves your perimeter).
- Modern UX.

**Weaknesses:**
- DIY operations if self-hosted.
- Smaller community than Glean's customer base.
- Some advanced enterprise features still maturing.
- Setup heavier than Glean (you operate it).

**Pricing:** Free OSS. Cloud custom.

**Best for:** OSS-strict teams; data-sovereignty-strict customers; technical teams comfortable with self-hosting.

### Microsoft 365 Copilot

Microsoft's AI-everywhere strategy. Copilot integrates across Office 365 — Outlook, Word, Excel, Teams, SharePoint.

**Strengths:**
- Native Microsoft 365 integration.
- Enterprise-grade governance.
- Deep Office app integration.
- Microsoft Graph API for cross-app context.
- Strong compliance + data residency story.

**Weaknesses:**
- Microsoft-stack-tilted.
- Pricing per-user adds up.
- Quality varies by app.
- Less compelling outside Microsoft ecosystem.

**Pricing:** $30/user/mo on top of Microsoft 365.

**Best for:** Enterprises already deeply on Microsoft 365.

### ChatGPT Enterprise

OpenAI's enterprise tier. Frontier-quality models with enterprise governance.

**Strengths:**
- Frontier model access (GPT-5).
- Custom GPTs (build domain-specific assistants).
- SOC 2; data privacy guarantees (no training on your data).
- Larger context window than free tier.
- File analysis built in.
- Connectors to Slack, Drive, etc. (limited but growing).

**Weaknesses:**
- Less workplace-search-focused than Glean (more general AI).
- Connector catalog limited.
- $60/user/mo expensive at scale.
- OpenAI-dependent.

**Pricing:** $60/user/mo (Enterprise tier).

**Best for:** Companies wanting frontier OpenAI models with enterprise privacy.

### Claude Enterprise

Anthropic's enterprise tier. Frontier Claude models with enterprise features.

**Strengths:**
- Frontier model access (Claude Opus 4.7; Sonnet 4.6).
- Projects feature (organize by project; stable knowledge).
- Large context window (1M+ tokens).
- SOC 2; data privacy.
- Strong on safety + nuance.
- Native MCP server support.

**Weaknesses:**
- Smaller customer base than ChatGPT Enterprise.
- Fewer connectors.
- Pricing custom; varies.

**Pricing:** Custom (typically $50-100/user/mo at enterprise).

**Best for:** Companies wanting frontier Claude with enterprise governance; teams using MCP servers.

### Notion AI / Slack AI / Coda AI / Atlassian Rovo (tool-native)

If you're already heavy on one tool, its bundled AI may be sufficient.

**Notion AI:** Q&A across Notion workspace. $8-10/user/mo. Best for Notion-heavy teams.

**Slack AI:** Channel summarization + search across Slack. $10/user/mo. Best for Slack-conversation-heavy teams.

**Coda AI:** AI in Coda docs. Bundled. Best for Coda-heavy teams.

**Atlassian Rovo:** AI across Jira + Confluence. Bundled with Premium+ tiers. Best for Atlassian-heavy teams.

**Common limitation:** these only search WITHIN their tool. For cross-tool knowledge, you need Glean / Dust / Copilot.

### Mem / Reflect (personal)

For individual knowledge work; not enterprise.

**Mem:** AI-augmented personal notes; $10-20/mo. Strong for indie / solo.

**Reflect:** Similar; $10/mo. Strong for individual.

**Don't use for team-wide workplace AI** — these aren't built for that.

### Hebbia

Document intelligence for regulated industries. Hebbia targets financial services + legal where extracting insights from large document sets is the use case.

**Strengths:**
- Specialized for finance / legal / consulting.
- Massive document analysis.
- Compliance + audit trail strong.

**Weaknesses:**
- Niche; not general-purpose workplace search.
- Enterprise pricing.

**Best for:** Hedge funds, law firms, consulting firms with massive document review workflows.

## What Workplace AI Won't Do

Useful to be clear-eyed:

- **They won't fix bad documentation.** Garbage in, garbage out. Get docs to baseline quality first.
- **They won't replace org-wide knowledge culture.** Tool surfaces what exists; humans must create + maintain.
- **They won't substitute for good information architecture.** Random-naming chaos is hard to search; structure your tools.
- **They won't solve the "Slack-archive problem."** Chat conversations are transient; durable knowledge needs to live elsewhere.
- **They won't make AI smarter than your data.** Frontier models are good; if your knowledge is wrong, AI confidently states wrong things.
- **They won't handle compliance / privacy for you.** Enterprise tier matters; verify SOC 2 / data residency / audit logs.
- **They won't auto-improve.** Connector catalogs change; permissions evolve; quarterly review needed.

## Pragmatic Stack Patterns

Common 2026 patterns:

### Indie / startup (1-30 people)

```
Notion AI (if Notion-heavy)
+ Claude Projects for individual heavy lifting
+ optional: Mem / Reflect for solo founders
+ no dedicated workplace search yet
```

Rationale: knowledge problem isn't large enough; tool-native AI suffices.

### Growth-stage (30-100 people)

```
Notion AI for primary docs
+ Slack AI for channel summarization
+ ChatGPT Enterprise OR Claude Enterprise for frontier AI access
+ optional Inkeep if engineering-heavy with technical docs
```

Rationale: still tool-native; frontier-AI for individual productivity.

### Mid-market (100-300 people)

```
Glean OR Dust (unified search)
+ ChatGPT Enterprise / Claude Enterprise for frontier AI
+ Notion AI / Slack AI for tool-native
+ Inkeep for engineering docs (if applicable)
+ Workspace 8-15 tools indexed
```

Rationale: knowledge sprawl matters; unified search ROI clear.

### Enterprise (300-1000+ people)

```
Glean (the standard)
+ ChatGPT Enterprise + Claude Enterprise for frontier
+ Microsoft Copilot if MS-stack-heavy
+ Custom Glean Apps for internal workflows
+ Specialized: Hebbia for legal / finance teams
+ Compliance, governance, audit fully deployed
```

Rationale: enterprise scale demands enterprise tooling.

### OSS-strict / regulated

```
Onyx (self-hosted)
+ Internal LLM (Together / Fireworks / on-prem)
+ Local embeddings
+ All data on-prem
+ Compliance: SOC 2, HIPAA, FedRAMP-aligned operationally
```

Rationale: data sovereignty over convenience.

### Engineering-heavy team

```
Inkeep for technical docs
+ Onyx for engineering wiki
+ Cursor / Claude Code for code-aware AI
+ Notion AI for high-level docs
+ ChatGPT / Claude Enterprise for individual
```

Rationale: engineering has its own knowledge stack.

### Microsoft-shop enterprise

```
Microsoft 365 Copilot (bundled)
+ Glean if cross-tool (more than just MS)
+ ChatGPT Enterprise for frontier alternative
```

Rationale: leverage Microsoft investment; supplement for non-MS.

## Decision Framework

### 1. How many employees + tools?

- **<30 employees, ≤5 tools:** Tool-native AI (Notion AI / Slack AI). No unified search yet.
- **30-100, 5-10 tools:** Tool-native + ChatGPT/Claude Enterprise. Unified search optional.
- **100-300, 10-15 tools:** Glean or Dust mandatory.
- **300+, 15+ tools:** Glean enterprise; specialized add-ons.

### 2. Are you AI-forward (building internal agents)?

- **Yes:** Dust (best agent builder) or ChatGPT Enterprise + Custom GPTs.
- **Just search:** Glean (purer search focus).

### 3. What's your stack?

- **Microsoft 365-heavy:** Copilot bundled.
- **Google Workspace-heavy:** NotebookLM Enterprise.
- **Atlassian-heavy:** Rovo + Glean for cross.
- **Notion-heavy:** Notion AI + Glean for cross.
- **Diverse:** Glean or Dust.

### 4. Compliance / data residency?

- **Standard:** Any cloud.
- **Strict (regulated, EU residency):** Glean EU, Dust EU, ChatGPT Enterprise EU, Onyx self-host.
- **Air-gapped:** Onyx + Haystack + on-prem LLM.

### 5. Team profile?

- **Engineering-heavy:** Inkeep + Onyx.
- **Knowledge-worker general:** Glean / Dust / Copilot.
- **Finance / legal / compliance:** Hebbia + Glean.

## Verdict

For 2026 workplace AI search:

- **Default for 100+ employee enterprises:** **Glean**. Boring, expensive, comprehensive.
- **Modern AI-agent-forward Series A-D:** **Dust**. Fast-shipping; build agents alongside.
- **Microsoft-stack:** **Microsoft 365 Copilot**.
- **Google Workspace-stack:** **NotebookLM Enterprise**.
- **Engineering / technical docs:** **Inkeep** (with Onyx for OSS).
- **OSS-strict:** **Onyx** + frontier OSS LLM.
- **Frontier AI for individuals:** **ChatGPT Enterprise** or **Claude Enterprise**.
- **Tool-native (small team):** **Notion AI** / **Slack AI**.
- **Personal knowledge:** **Mem** / **Reflect**.

The most common mistake in 2026: signing 50K+/yr Glean contracts at 50-employee scale before knowledge sprawl is real. Notion AI + Claude Enterprise covers most needs through 100 employees.

The second mistake: not investing in connectors quality. Glean is only as good as the tools you connect; ensure top-5 tools are fully indexed before judging.

The third mistake: skipping permissions enforcement. Workplace AI must respect each person's permissions per source tool. If it shows you content you shouldn't see, it's a security incident.

## See Also

- [LLM Observability Providers](./llm-observability-providers) — adjacent (production AI monitoring)
- [LLM Evaluation & Prompt Testing Platforms](./llm-evaluation-prompt-testing-platforms) — adjacent (testing prompts)
- [AI Customer Support Agents](./ai-customer-support-agents) — sister category (customer-facing AI)
- [AI Agent Frameworks](./ai-agent-frameworks) — adjacent (build your own)
- [AI SDK](./ai-sdk) — adjacent for app-side AI
- [In-Product AI Agent Implementation (VibeWeek)](../../VibeWeek/6-grow/in-product-ai-agent-implementation-chat.md) — adjacent (customer-facing agents)
- [In-Product Help Center & Knowledge Base (VibeWeek)](../../VibeWeek/6-grow/in-product-help-center-knowledge-base-chat.md) — adjacent (customer-facing version of similar pattern)
- [Claude API Integration](./claude-api-integration) — building blocks
- [OpenAI Responses](./openai-responses) — building blocks
- [MCP / Model Context Protocol](./mcp-model-context-protocol) — adjacent connector standard
- [RAG Implementation (VibeWeek)](../../VibeWeek/6-grow/rag-implementation-chat.md) — building blocks
- [Vector Database Providers](../backend-and-data/vector-database-providers) — depended-upon infra
- [ML Inference & GPU Hosting Platforms](../cloud-and-hosting/ml-inference-gpu-platforms) — adjacent infra
- [Project Management Tools](../devops-and-tools/project-management-tools) — adjacent (where some knowledge lives)
- [Workspace Knowledge Base Tools (Reference)](../product-and-design/workspace-knowledge-base-tools) — adjacent (Notion / Confluence / etc. — the source data)
- [Customer Education & LMS Platforms](../product-and-design/customer-education-lms-platforms) — adjacent (external version)
