# Agent Reliability & Production Operations: Run Autonomous Agents Without Burning Down Your Bill or Your Brand

[⬅️ AI Development Overview](../ai-development/)

If you've shipped an autonomous AI agent — one that calls tools, runs loops, makes decisions, executes actions — you've inherited a class of production problems that traditional service-level engineering doesn't fully address. Traditional services fail in legible ways: 500s, timeouts, dropped messages, queue backups, slow queries. Agents fail in illegible ways: confidently wrong tool calls, infinite reasoning loops, runaway costs, drift after a model upgrade, jailbreaks that elevate privileges, hallucinated function arguments that pass schema validation but mean something different than intended, slow degradation that no alert catches because the agent is "working" — just badly. The bill at the end of the month is a leading indicator. The customer support escalation is a lagging one.

This article is the operational discipline for running production agents: the monitoring you need that you don't yet have, the eval cadence that catches regressions before customers do, the cost controls that prevent a runaway from becoming a $50K bill in 6 hours, the human-in-the-loop patterns that protect blast-radius actions, the incident-response playbook for "the agent did a thing it shouldn't have," and the team / on-call structure that makes all of this sustainable. It is intentionally distinct from [LLM Observability Providers](./llm-observability-providers.md) (telemetry vendors), [LLM Evaluation & Prompt Testing Platforms](./llm-evaluation-prompt-testing-platforms.md) (offline quality), [AI Guardrails & LLM Application Security](./ai-guardrails-llm-application-security.md) (runtime defense layer), and [AI Agent Evaluation](./ai-agent-evaluation.md) (eval methodology). Those are the *components*. This is how you *operate* the system as a whole.

## The New Failure Modes

Traditional services have a finite, legible failure surface. Agents have several new failure modes that are easy to miss until they cost real money or break customer trust.

### 1. Runaway Loops
The agent gets stuck in a cycle: tool A returns information that prompts a call to tool B; tool B returns information that prompts a call back to tool A. Without a step cap, the loop runs until you hit your provider rate limit or your budget. **One bad input** can produce thousands of LLM calls in minutes.

### 2. Hallucinated Tool Arguments
The agent generates a tool call with arguments that pass schema validation but mean something different than the user wanted. `delete_record(id="all")` where the schema accepts a string. `transfer(amount=1000, currency="USD")` where the user said "in pesos." `send_email(to="ceo@enron.com")` because the model guessed the wrong contact. Schema validation is necessary but not sufficient; semantic validation is the gap.

### 3. Cost Blowouts
A user sends one input that triggers a deeply recursive agent run. Or your eval set introduces a regression that causes 3x more reasoning loops per task. Or a model upgrade silently increased token usage. None of these trip your traditional alerts (latency, errors, queue depth) — but the bill triples.

### 4. Drift After Model Upgrade
You upgrade from Claude Sonnet 4.5 to 4.7, or from GPT-4.1 to 5.1. Your evals pass on the headline test set. Three weeks later, customer-facing edge cases regress because the new model interprets a few system-prompt instructions differently. No alert fires; quality degrades silently.

### 5. Privilege Escalation via Tool Misuse
The agent has 30 tools. The user prompt is "show me my account info." A jailbreak / prompt injection convinces the agent to call `update_account(role="admin")` instead. Tool allow-listing per agent + per request scope would have caught it. Default trust would not.

### 6. Slow Degradation
Quality drops 5% per month. Each individual task looks fine. The aggregate produces lower customer satisfaction, more support tickets, and eventually churn — but no single signal exceeds an alert threshold. This is the worst kind of failure because it's invisible until it's too late.

### 7. Brand-Damaging Actions
The agent posts something off-tone to a customer. The agent emails the wrong person. The agent confidently states a fact that's wrong. Each individual incident is small. The aggregate, broadcast on social media, is reputational damage.

### 8. Side-Effects in External Systems
The agent created 14 calendar events, 7 of them duplicates. Or wrote 200 records to your CRM during a debugging session. Or sent emails to a list it shouldn't have. These actions are real-world; rolling them back requires manual intervention and possibly customer communication.

The shape of these failures is **non-deterministic** (same input may not always produce the same failure), **subtle** (often passes existing checks), and **expensive** (action-execution + cost + brand all compound).

## Pre-Production: Build the Foundation Before You Ship

The cost of catching these failures in production is 10-100x the cost of catching them before. Front-load the work.

### Action allow-listing and scope
- Every agent has an explicit list of tools it can call — never "all tools available"
- Within tool calls, scopes are constrained: this agent can read user X's data; not user Y's
- Sensitive actions (write/delete/send/charge/escalate) are flagged separately and require additional gating
- Tool definitions are reviewed by appsec before they're exposed to the agent
- Reference: [AI Guardrails & LLM Application Security](./ai-guardrails-llm-application-security.md)

### Step caps and recursion limits
- Every agent run has a hard maximum: typically 10-30 LLM calls per request, 50-100 tool invocations
- Hitting the cap surfaces an error to the user (not a silent timeout); logs as a distinct event class
- Per-user / per-tenant request budgets: a single user can't trigger N concurrent agent runs

### Cost ceilings
- Per-request token budget: cap at the LLM client level; abort and surface error if exceeded
- Per-user monthly budget: tracked; alerts at 50%/75%/100%; throttled at 100%
- Per-tenant monthly budget: aggregated; sales/CS notified before exceeding plan tier
- Whole-product budget: alert ops if total spend exceeds rolling 7-day-baseline by [50%]

### Schema + semantic validation on tool calls
- JSON Schema validation: type, format, enum compliance
- Semantic validation: business-rule checks AFTER schema validation (`amount > 0`, `target_user_id != current_user_id` for sensitive ops, `recipient is in user's known contacts` etc.)
- Range checks: any numeric > expected upper bound rejected with a clear error to the agent (so it can re-plan, not retry the same wrong call)

### Human-in-the-loop on sensitive actions
- Sensitive action list defined explicitly (financial, destructive, communications-to-third-parties, privilege changes)
- Each sensitive action: requires explicit user confirmation in UI before execution
- User confirms by reading EXACTLY what's about to happen, not "approve this action" with hidden details
- Confirmation token is passed back to the agent; agent cannot fabricate confirmation

### Test coverage
- Unit tests on every tool: golden inputs/outputs, error cases, edge cases
- Integration tests: full agent runs against a known input set with deterministic mocked tools
- Chaos tests: tool returns timeout / 500 / malformed response; assert the agent recovers gracefully
- Adversarial tests: prompt injection / jailbreak attempts; assert the agent refuses or escalates rather than complies

## Observability: Trace Every Run

Without traces, you cannot debug agents. Without good traces, debugging takes hours per incident. Invest here.

### Span hierarchy
Every agent run produces a tree of spans:
- **Run span**: top-level; user_id, tenant_id, agent_name, request_id, started_at, completed_at, status, total_tokens, total_cost_cents
- **LLM call spans**: each model invocation; model, prompt_tokens, completion_tokens, latency, system_prompt_hash, tool_calls_returned
- **Tool call spans**: each tool invocation; tool_name, arguments (sanitized), response (sanitized), duration, status, error
- **Reasoning spans**: where the agent's "thinking" was captured (e.g., scratchpad / chain-of-thought)
- **External-side-effect spans**: any call to an external system (email send, CRM write, payment): includes idempotency_key, external_id_returned

### Capture context
- The full prompt (or its hash) so you can replay
- The full tool list available to that run
- Any user-visible output
- Any errors / refusals / escalations
- Per-step decision trail: why did the agent pick tool X over tool Y?

### Tools to use
- **Hosted observability**: Langfuse, Helicone, Braintrust, LangSmith, Patronus, OpenLIT, Weights & Biases Weave, Galileo. Pick one; integrate it as the observability backbone. See [LLM Observability Providers](./llm-observability-providers.md).
- **Self-host**: OpenTelemetry-compatible (OpenLLMetry / OpenInference instrumentations) feeding your existing stack (Datadog, Honeycomb, Grafana). Higher integration cost; better fit for security-constrained deployments.
- **At minimum**: log structured JSON traces to your data lake; query with SQL. Even the budget version beats no traces at all.

### Search and replay
- Trace UI must support searching by user_id, tenant_id, time range, status, tool_called, error_type
- Replay capability: given a trace, re-run the same agent against the same input with deterministic tool mocks; compare outputs (essential for debugging regressions)

### Sampling vs. full capture
- Full-capture every run for the first months in production (you don't know what's important yet)
- Sample only after you have established alerts on the unsampled signals
- ALWAYS full-capture: errors, refusals, sensitive-action confirmations, outliers (cost > Nx baseline, tokens > Nx baseline, step count > Nx baseline)

## Production Eval: Continuous Quality Monitoring

Offline evals catch known regressions on known test sets. Production evals catch novel regressions on real traffic. You need both.

### Production eval methods

**LLM-as-judge on traces**
- Sample N% of production runs; pass each through a "did this run achieve the user's goal?" judge
- Judge is a different model than the agent (avoid same-model bias)
- Judge has explicit rubric: did the user's goal get accomplished, did any tool call fail unsafely, did any output violate the brand voice, etc.
- Track judge scores over time; alert on drift

**User feedback signal**
- Thumbs up/down on every agent response (lightweight)
- "Was this correct?" follow-up after sensitive actions (weightier)
- Negative feedback is the most actionable signal; route to a queue for human review

**Implicit feedback**
- Did the user immediately re-prompt with a correction? (signal of bad output)
- Did the user abandon the session within 30s of the agent's response? (signal of confusion or wrong answer)
- Did the user retry the same prompt? (signal of unreliability)

**Outcome tracking**
- Did the agent's tool calls produce the actual desired side-effect in the downstream system?
- Did the email get opened / responded to / produce a reply chain?
- Did the CRM record get edited again by a human within 24h (correction signal)?

### Cadence
- Real-time: critical alerts (cost, error, refusal-rate spike)
- Daily: judge scores by cohort; user feedback aggregates
- Weekly: regression checks against a held-out eval set (caught both manually-curated cases AND high-signal production cases that surfaced)
- Per-deployment: full eval suite; gate prod deploy on pass

### Building the eval set
- Start with 30-50 hand-curated cases covering the diversity of customer use cases
- Augment continuously: every customer escalation becomes a new eval case; every drift-detection alert becomes a new case
- Adversarial cases: prompt injection, jailbreaks, ambiguous inputs, edge-case tool combinations
- Eval set is version-controlled; PRs that change the agent must reference which eval cases changed status

## Cost Controls: Don't Let One Bad Input Burn Your Margin

Agents have a unique cost vulnerability: small input → potentially large compute. Build the discipline.

### Per-request budget
- Maximum tokens per agent run: hard cap
- Maximum tool calls per agent run: hard cap (prevents tool-loop runaways)
- Maximum reasoning depth (if applicable): hard cap
- Hitting any cap: surface error to user; log distinctly

### Per-user budget
- Token spend per user per month, tracked
- Alert at thresholds (you set; e.g., $5/user/month for free tier)
- Throttle at hard cap
- Surface usage in user-facing dashboard so power users self-manage
- See: [LLM Cost Optimization](https://www.vibeweek.com/6-grow/llm-cost-optimization-chat) for the consumer-facing controls

### Per-tenant budget
- Aggregate per-customer / per-workspace
- Tied to plan tiers: free has $X cap, pro has $Y, enterprise has Z
- Surface in admin dashboard; allow customer admins to see + adjust per-user

### Whole-product spend ceiling
- Daily total spend; alert if any day exceeds 1.5x rolling 7-day baseline
- Weekly total spend; alert ops if exceeds budget plan
- Quarterly review: spend vs. revenue from agent features; profitability check

### Model tier routing
- Cheap model (Haiku, GPT-4o-mini, Llama 8B fine-tune) for simple tasks
- Premium model (Sonnet, GPT-4, Claude Opus) for complex tasks
- Routing decision based on: task class, prior failure rate at cheap tier, user plan tier
- Via [Vercel AI Gateway](https://www.vibereference.com/cloud-and-hosting/ai-gateways) or other routing layer
- See [AI Fine-Tuning Platforms](./ai-fine-tuning-platforms.md) for replacing premium calls with fine-tuned cheap models

### Caching
- Prompt caching for stable system prompts (Anthropic prompt caching, OpenAI prompt caching) — savings of 50-90% on the cached portion
- Output caching for deterministic-input agent runs (rare in agentic systems but applicable)
- See [Vercel Runtime Cache](https://vercel.com/docs/runtime-cache) for shared cache infrastructure

## Drift Detection: Catch Quality Degradation Before Customers Do

Models change. Prompts change. The world changes. Drift is the slowest-moving, hardest-to-catch failure mode.

### Versioned baselines
- Every prompt version pinned with a hash
- Every model version pinned exactly (don't say "claude-sonnet-4"; say "claude-sonnet-4-6-20251015")
- Every agent run records: prompt_hash, model_version, tool_definitions_hash
- Compare cohorts across hash boundaries

### Continuous canaries
- A subset of production runs (1-5%) goes through both the production model AND a canary candidate (e.g., next-version model or alternative)
- Compare outputs; flag divergence
- Use for: model upgrades; prompt tuning; new tool additions

### Eval-set rerun on schedule
- The full eval suite runs daily against production agent
- Pass-rate trend is monitored; alert on degradation
- Distinguish "model update degraded eval" vs. "prompt change degraded eval" via versioned tags

### Cohort comparisons
- New users vs. existing users — is the agent worse for new users?
- Free tier vs. paid tier — is quality cohort-disparate?
- Geographic / language cohorts — does drift hit some segments first?

### User feedback trend
- Weekly aggregate user-rating scores per agent
- Alert on negative-trend that exceeds noise floor
- Drill in on the worst weekly cohort to find the root cause

## Runaway Detection and Throttling

Catching the runaway IN PROGRESS, not after the bill arrives.

### Real-time detection signals
- Step count per request approaching cap (warn at 75%, abort at 100%)
- Token usage per request exceeding p99 baseline (auto-investigate)
- LLM-call rate per user > Nx p99 baseline → automatic throttle
- Tool-call sequence repetition: same tool called >5 times consecutively → flag and likely abort
- Cost spike: any minute's total spend > Nx 1-hour baseline → page on-call

### Automatic mitigations
- Soft throttle: per-user concurrent agent runs capped (no parallelism)
- Hard abort: kill the run; surface a clear error to user
- Kill-switch: a feature flag your on-call can flip to disable the agent entirely if all else fails

### Investigation queue
- Aborted runs go into a queue for review
- Sample N% of normal runs go into the queue too (regular review hygiene)
- The on-call engineer reviews them daily
- Patterns surface: "we keep hitting the cap on this tool flow because…"

### Postmortems on runaways
- Every runaway is a postmortem candidate
- What input triggered it? What was the loop? What guardrail was missing?
- New eval case added; new test added; remediation tracked

## Human-in-the-Loop: Gate the Blast-Radius Actions

The cleanest pattern for sensitive actions in agents is "ask the human first."

### Sensitive action taxonomy
- **Tier 1 (no confirmation needed)**: read-only operations, search, internal lookups
- **Tier 2 (soft confirmation)**: low-stakes writes; user is shown what's about to happen with a "do it" / "edit" / "cancel"; default within UI flow
- **Tier 3 (hard confirmation)**: deletes, sends to third parties, financial transactions; explicit modal, typed confirmation, full disclosure of impact
- **Tier 4 (multi-party / out-of-band)**: high-stakes (large transactions, account-level changes); two-person approval, email confirmation, time delay

### Implementing confirmations
- Agent generates the proposed action; UI surfaces it
- User reviews EXACTLY what's about to happen (recipient, amount, payload)
- User clicks confirm; UI passes a confirmation token back to the agent
- Agent cannot fabricate the token; only execution path with token succeeds
- Confirmation tokens are scoped (this token is for this action, this user, this minute) and single-use

### When NOT to require confirmation
- For repetitive operations the user has explicitly opted into ("auto-approve all CRM updates from this agent")
- For low-blast-radius actions (toggling a UI preference)
- The user's friction tolerance is real; over-confirming makes the agent feel useless. Tier the actions explicitly.

### Audit trail
- Every confirmed action logged: user_id, action, payload, confirmation_token, timestamp
- Every cancelled action logged too (signal of agent making the wrong proposal)
- Audit trail accessible via [Customer-Facing Audit Logs](https://www.vibeweek.com/6-grow/customer-facing-audit-logs-chat) for users + admins

## Incident Response: When the Agent Does Something It Shouldn't Have

Some incidents WILL happen. Have the playbook before you need it.

### Severity levels
- **SEV-1**: ongoing harm (agent is sending wrong emails RIGHT NOW; agent is destroying records). Page on-call; kill-switch; investigate.
- **SEV-2**: completed harm (a customer received a wrong email; a record was wrongly modified). Investigate; remediate; post-incident.
- **SEV-3**: pattern detected, no clear single incident (drift, slow quality regression). Triage during business hours.

### Initial response (SEV-1)
- Hit the kill-switch (disable agent for affected scope: user, tenant, or whole product)
- Notify engineering + on-call + affected customer's CSM
- Preserve evidence: snapshot the trace, prompt, tool calls, side-effects
- Don't try to fix in production; isolate first, then debug

### Containment (SEV-1)
- Identify the blast radius: which users, which records, which external systems
- Reverse the side-effects where possible: undo CRM writes, recall sent emails (if your platform supports it), refund transactions
- Coordinate with affected customers: human outreach BEFORE they notice the bug, not after

### Investigation
- Replay the trace in dev; reproduce the failure
- Identify the root cause: prompt issue / model issue / tool issue / external system issue / adversarial input
- Add the failing input to the eval set; assert the new fix passes the eval

### Remediation
- Patch: prompt change, tool definition change, guardrail addition, model rollback
- Deploy with full eval pass + canary
- Monitor for 48-72h post-deploy

### Post-incident
- Public communication if customers are affected: clear, direct, no spin (see Crisis Communication Playbook patterns)
- Internal postmortem: blameless, structured (5 whys, contributing factors, action items with owners and dates)
- Action items: prevent the class of failure, not just this specific failure

## Team Structure and On-Call

Agent operations need ownership. Without it, the work falls between teams and ages badly.

### Roles
- **Agent on-call**: weekly rotation; responds to alerts, reviews aborted runs, monitors cost dashboards. Engineering role.
- **Eval owner**: maintains the eval set; runs weekly regression checks; coordinates eval expansion after incidents. Often the senior engineer or applied scientist.
- **Cost owner**: monitors per-tenant + total spend; raises alerts to product/finance when spend approaches budget. Often platform engineering or DevOps.
- **Quality owner**: reviews user feedback, judge scores, drift signals; coordinates with product on prompt updates. Often a product engineer or ML engineer.
- **Incident commander**: only during SEV-1; coordinates response. Designated rotation; not always the on-call.

### Cadences
- Daily: review aborted runs + cost spikes (15 min)
- Weekly: eval regression report + judge-score trends + on-call handoff (30 min)
- Monthly: drift retrospective; per-customer spend review; quality metrics overview
- Quarterly: agent operations review with leadership; capacity planning; tool-list audit

### Tooling
- Dashboard: top-line metrics (cost, error rate, judge score, abort count) at a glance
- Alerts: PagerDuty / Opsgenie integration with the trace UI for one-click drill-in
- Runbooks: documented response for each alert class (cost spike, runaway, refusal-rate spike, drift)

### Documentation
- This page is a runbook template; every team should have its own
- Postmortem archive; new on-calls read it as part of onboarding
- Eval set documented: what it covers, what it doesn't cover, where to add new cases

## Anti-Patterns and Failure Modes

- **No step cap. No cost cap. No tool allow-list.** Disasters waiting; usually one bad input away.
- **No traces. Or traces that don't capture tool calls.** Debugging is impossible; root cause unknowable.
- **Eval-only-on-deploy.** Production drift catches you between releases.
- **No production eval (LLM-as-judge / user feedback / outcome tracking).** Quality regressions invisible.
- **Ignoring slow degradation.** Single signals don't trip; aggregate harm compounds.
- **No human-in-the-loop on sensitive actions.** First brand-damaging incident is a question of when, not if.
- **Schema validation only; no semantic validation.** Hallucinated arguments pass; harm follows.
- **Trusting the LLM's confidence.** Confidence is uncalibrated; always validate against ground truth where possible.
- **Premium model on every call.** Cost runaway. Tier the model choice.
- **No replay tooling.** Debugging an incident takes 4x longer.
- **No kill-switch.** Cannot stop ongoing harm during a SEV-1.
- **Postmortems that aren't blameless.** Engineers stop reporting near-misses; you lose the early signal.
- **Eval set never expanded after incidents.** Same class of failure recurs.
- **One person owns everything.** Bus factor; burnout; no continuity.
- **Tool list grows without review.** Privilege escalation surface expands silently.
- **Per-call latency optimized; per-run cost ignored.** Optimizing the wrong thing.

## Pragmatic Maturity Model

Where you should be by stage of agent deployment.

### Stage 1: Prototype (pre-customer)
- Step cap, cost cap per request: yes
- Schema validation: yes
- Traces (even if just JSON logs): yes
- Tool allow-list: yes
- Human-in-the-loop on tier 3+ actions: yes
- Eval set: 20-50 hand-curated cases
- Production observability: nice to have

### Stage 2: Production (10-1000 customers)
- All of stage 1, hardened
- Hosted observability backbone (Langfuse / Helicone / Braintrust / etc.)
- Production eval (LLM-as-judge sampling on traces)
- Per-user cost budgets + alerts
- Runaway detection with auto-throttle
- Kill-switch
- Daily on-call review (15 min)
- Postmortem template + 1-2 actual postmortems on file

### Stage 3: Scale (1000+ customers; agents are core to business)
- All of stage 2, mature
- Per-tenant cost budgets surfaced to customers
- Drift detection across multiple cohorts
- Continuous canaries on model upgrades
- Multi-tier model routing for cost
- Quality / cost / abort dashboards visible to leadership
- Quarterly tool-list audit
- Eval set expanded continuously from production traces
- Dedicated owners for eval, cost, quality, incident response

### Stage 4: Enterprise (regulated / mission-critical)
- All of stage 3, governed
- Audit logs for every agent action surfaced to customer admins
- BYOK / data residency / SOC 2 Type II / HIPAA / FedRAMP as applicable
- Formal change-management for prompt + model updates
- External adversarial testing (red-team) on a regular cadence
- Indemnification + insurance posture for agent-caused harm
- Compliance + legal review of any new tool addition

## See Also

- [LLM Observability Providers](./llm-observability-providers.md) — telemetry / tracing backbone
- [LLM Evaluation & Prompt Testing Platforms](./llm-evaluation-prompt-testing-platforms.md) — offline eval infrastructure
- [AI Agent Evaluation](./ai-agent-evaluation.md) — eval methodology specifically for agents
- [AI Guardrails & LLM Application Security](./ai-guardrails-llm-application-security.md) — runtime defense layer
- [AI Moderation & Trust & Safety Platforms](./ai-moderation-trust-safety-platforms.md) — content moderation (orthogonal to agent ops)
- [AI Fine-Tuning Platforms](./ai-fine-tuning-platforms.md) — replace premium calls with fine-tuned cheap models
- [AI Gateways](../cloud-and-hosting/ai-gateways.md) — multi-model routing layer
- [AI Agent Frameworks](./ai-agent-frameworks.md) — frameworks underneath this operational layer
- [AI Agent Memory Systems](./ai-agent-memory-systems.md) — memory state needs the same operational discipline
- [AI Agent Orchestration](./ai-agent-orchestration.md) — multi-agent coordination
- [AI Agent Budgets / Cost Control](./ai-agent-budgets-cost-control.md) — adjacent treatment
- VibeWeek: [In-Product AI Agent Implementation](https://www.vibeweek.com/6-grow/in-product-ai-agent-implementation-chat) — agent build pattern
- VibeWeek: [LLM Cost Optimization](https://www.vibeweek.com/6-grow/llm-cost-optimization-chat) — cost-discipline patterns
- VibeWeek: [LLM Quality Monitoring](https://www.vibeweek.com/6-grow/llm-quality-monitoring-chat) — production quality monitoring pattern
- VibeWeek: [AI Memory & Context Retention](https://www.vibeweek.com/6-grow/ai-memory-context-retention-chat) — memory layer; ops considerations apply
- VibeWeek: [Customer-Facing Audit Logs](https://www.vibeweek.com/6-grow/customer-facing-audit-logs-chat) — surface agent actions to customers
- LaunchWeek: [Crisis Communication Playbook](https://www.launchweek.com/5-launch/crisis-communication-playbook) — when the agent's failure becomes public
