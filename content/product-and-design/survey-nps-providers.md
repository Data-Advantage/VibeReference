# Customer Survey & NPS Providers: Delighted, Survicate, Sprig, Refiner, Typeform, Qualtrics, Formbricks, AskNicely

[⬅️ Product & Design Overview](../product-and-design/)

If you're building a SaaS in 2026 and trying to pick a customer-survey or NPS tool, this is the consolidated comparison. Surveys are the line item founders skip until the board asks "what's our NPS?" or churn climbs and nobody knows why. Most indie SaaS default to a Google Form (acceptable) or jump to Qualtrics (overkill at $30K/yr) when Delighted, Survicate, or Refiner would have served them through $5M ARR. Pick the right shape and feedback flows in continuously; pick wrong and you're either paying for capability you don't need or running surveys nobody answers.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Delighted | NPS / CSAT specialist | 14-day trial | $49/mo (Starter) | High | NPS-focused; clean email + in-app |
| Survicate | NPS + in-app surveys | Free (25 responses/mo) | $99/mo (Essential) | Very high | Modern indie default for surveys + NPS |
| Sprig | Research + surveys + replay | Free (50 responses/mo) | $175/mo (Plus) | High | Product-led teams wanting UX + surveys in one |
| Refiner | In-app surveys (SaaS-focused) | Free (50 responses/mo) | $79/mo (Starter) | Very high | SaaS-specific in-product surveys |
| Typeform | Conversational forms / surveys | Free (10 responses/mo) | $25/mo (Basic) | High | Pretty surveys; not NPS-optimized |
| SurveyMonkey | General-purpose surveys | Free (10 questions) | $39/mo (Team) | Medium | Legacy general-purpose surveys |
| Qualtrics | Enterprise CX platform | Custom | $1.5K-30K+/yr | Very low | Enterprise CX programs at scale |
| AskNicely | Service-business NPS | 14-day trial | $79/mo (Essential) | Medium | Service businesses with frontline reps |
| Formbricks | Open-source surveys | Self-host free | $99/mo (cloud) | Very high | Privacy-focused / OSS-preferred teams |
| HubSpot Surveys | Bundled with HubSpot | Free with HubSpot | Bundled | Medium | Already on HubSpot |
| Intercom Surveys | Bundled with Intercom | Trial | $15/mo+ (Surveys add-on) | Medium | Already on Intercom |
| Pendo Feedback | Bundled in Pendo | Custom | Bundled with Pendo | Medium | Already on Pendo |
| Google Forms | Free general-purpose | Free | $0 | High | <100 responses/quarter; informal use |

The first decision is **what shape of survey program you're running**. Continuous NPS / CSAT (Delighted, AskNicely, Wootric), in-product micro-surveys (Survicate, Refiner, Sprig), one-off research surveys (Typeform, Google Forms), and enterprise CX programs (Qualtrics) are four different problems with overlapping tools. Most indie SaaS need the first two; only mid-market+ needs Qualtrics.

## Decide What You Need First

Survey tools are not interchangeable. Pick by the program you're running, not by reputation.

### Continuous NPS / CSAT (the 50% case for indie SaaS)
You want a periodic NPS or CSAT pulse — quarterly emails to customers, a question or two, a score over time, segmented by cohort.

Right tools:
- **Delighted** — NPS-focused; clean and simple
- **Survicate** — also handles NPS plus in-app
- **Wootric** (InMoment-owned) — NPS / CSAT specialist
- **Refiner** — in-app NPS for SaaS

### In-product micro-surveys (the 30% case)
You want to ask users contextual questions inside the product — "Why did you cancel?" on the cancel flow, "How was onboarding?" 7 days in, "What feature do you wish we had?" on the dashboard.

Right tools:
- **Survicate** — strong in-app
- **Refiner** — SaaS-specific
- **Sprig** — research + surveys + replay
- **Pendo Feedback** — if on Pendo
- **Intercom Surveys** — if on Intercom

### One-off research surveys (the 15% case)
You want to send a longer-form survey to a list — pricing research, feature priorities, persona discovery.

Right tools:
- **Typeform** — pretty UX
- **Google Forms** — free
- **SurveyMonkey** — legacy general-purpose
- **Survicate** — also fine

### Enterprise CX programs (the 5% case)
You're a mid-market+ company with a CX team running cross-functional voice-of-customer programs.

Right tools:
- **Qualtrics** — enterprise default
- **Medallia** — alternative
- **Sprig** — modern alternative for product-led

For most indie SaaS in 2026: **Survicate or Delighted for NPS; Refiner for in-app; Typeform for one-offs**. Skip Qualtrics until enterprise.

## Provider Deep-Dives

### Delighted — NPS / CSAT Specialist
Delighted (Qualtrics-owned, runs independently) was one of the original NPS-as-a-service tools. Clean focus: NPS, CSAT, CES, PMF surveys via email or web.

Strengths:
- NPS-focused (single-question, optimized for response rate)
- Email + web + SMS + iOS / Android
- Simple integrations (Slack, Zapier, Salesforce)
- $49/mo Starter (10K responses)
- Strong reporting / trend tracking
- Quick setup (~15 minutes to first send)

Weaknesses:
- Less flexible for non-NPS surveys
- Limited in-product micro-survey capability
- Owned by Qualtrics; long-term direction unclear

Pick when: you want clean NPS / CSAT with minimal friction; you don't need heavy in-app capabilities.

### Survicate — Modern Indie Default
Survicate has emerged as a top indie default. Combines NPS / CSAT email surveys + in-app micro-surveys + link surveys in one platform.

Strengths:
- Multi-channel (email, in-app, link, mobile, intercom-style chat)
- $99/mo Essential (250 responses)
- Free tier (25 responses/mo) — good for trial
- Strong segmentation / targeting
- Modern API + integrations (HubSpot, Intercom, Salesforce, Mixpanel)
- AI summaries on responses (2025 feature)

Weaknesses:
- Pricier than Delighted at low volumes
- In-app SDK has occasional rough edges
- Reporting less polished than Qualtrics

Pick when: you want one tool for NPS + in-app micro-surveys; modern UX matters; budget supports $99-499/mo.

### Sprig — Research + Surveys + Replay
Sprig (formerly UserLeap) sits between a survey tool and a UX research platform. Offers in-product surveys, AI-powered analysis, and session replay snippets attached to responses.

Strengths:
- Tightly product-led-team-focused
- AI auto-categorization of open-text responses
- Session replay attached to surveys (see what user did before answering)
- Strong targeting (event-triggered, cohort-based)
- $175/mo Plus tier
- Free tier (50 responses/mo)

Weaknesses:
- Pricier than Survicate at scale
- Less suited for email NPS than Delighted
- Newer; smaller community

Pick when: you're a product-led team that wants research + surveys + replay in one platform; budget supports premium pricing.

### Refiner — SaaS-Focused In-App Surveys
Refiner is built specifically for SaaS in-app micro-surveys. Modern, indie-friendly, lower price than Sprig.

Strengths:
- SaaS-specific (designed for in-product feedback loops)
- $79/mo Starter (100 responses/mo)
- Free tier (50 responses/mo)
- Native targeting on user properties
- Slack / Hubspot / Mixpanel integrations
- Good docs

Weaknesses:
- Not for email NPS (use with Delighted alongside)
- Smaller feature surface than Survicate

Pick when: you want simple in-app surveys for SaaS; budget-conscious; indie style.

### Typeform — Pretty Conversational Surveys
Typeform pioneered conversational survey UX. Beautiful forms; good for one-off research / lead qualification / brand surveys.

Strengths:
- Best-in-class survey UX (high response rates)
- $25/mo Basic
- Free tier (10 responses/mo)
- Strong integrations
- Good for embedded / link surveys

Weaknesses:
- Not optimized for NPS (clean NPS = single question; Typeform is form-flow oriented)
- No in-app SDK
- Pricing climbs at volume

Pick when: you want pretty one-off surveys (research, lead-gen, post-event); not for NPS programs.

### SurveyMonkey — Legacy General-Purpose
SurveyMonkey is the long-standing general survey platform. Broad but not specialized.

Strengths:
- Massive feature surface (matrix questions, branching, etc.)
- $39/mo Team
- Free tier (10 questions; 100 responses)
- Strong panel / audience options for paid samples

Weaknesses:
- Dated UX
- Not modern API
- Not optimized for SaaS in-product use

Pick when: you have a SurveyMonkey legacy tradition; not the best modern pick.

### Qualtrics — Enterprise CX
Qualtrics is the enterprise CX platform. Massive product surface, enterprise pricing, complex implementation.

Strengths:
- Most comprehensive CX platform
- Cross-functional VoC programs
- Strong data / analytics layer
- Industry-vertical solutions
- Full ecosystem

Weaknesses:
- $1.5K-30K+/yr (sales-led)
- Heavy implementation
- Overkill for indie SaaS
- Acquired Delighted; relationship complex

Pick when: you're enterprise with a CX team; Qualtrics is justified by scale.

### AskNicely — Service-Business NPS
AskNicely focuses on service-businesses (consulting, agencies, retail) running NPS for frontline staff.

Strengths:
- Frontline-rep focus (rep-level NPS scores)
- Mobile-friendly for field teams
- $79/mo Essential
- Reporting tuned to ops teams

Weaknesses:
- Not SaaS-product-focused
- Smaller feature surface

Pick when: you're a service business; not for SaaS.

### Formbricks — Open-Source
Formbricks is the open-source survey platform. Self-host or cloud; privacy-focused; modern UX.

Strengths:
- Open source (self-host free)
- $99/mo cloud
- GDPR / privacy-focused
- Modern API
- In-app surveys + link surveys

Weaknesses:
- Smaller community
- Self-hosting requires DevOps
- Less mature than Survicate / Delighted

Pick when: you prefer OSS; you have privacy / data-residency requirements; you want self-host option.

### HubSpot Surveys — Bundled
HubSpot Service Hub includes a survey tool. NPS / CSAT / CES surveys.

Strengths:
- Bundled with HubSpot Service Hub (per [crm-providers](../marketing-and-seo/crm-providers.md))
- Free tier with HubSpot
- Tight CRM integration

Weaknesses:
- Best fit only if on HubSpot
- Less specialized than Delighted / Survicate

Pick when: already on HubSpot; survey volume is moderate.

### Intercom Surveys — Bundled
Intercom offers Surveys as a paid add-on. Tight integration with Intercom Messenger.

Strengths:
- Bundled with Intercom (in-Messenger surveys)
- Email surveys also work
- $15/mo+ add-on

Weaknesses:
- Requires Intercom (~$74/mo+)
- Less powerful than dedicated tools

Pick when: already on Intercom; survey volume is light.

### Pendo Feedback — Bundled with Pendo
Pendo Feedback is the survey + ideas-portal layer of Pendo. Tightly integrated with the rest of Pendo (per [product-tour-providers](product-tour-providers.md)).

Strengths:
- Bundled with Pendo
- Idea-board / public-roadmap features built-in
- Strong tagging / categorization

Weaknesses:
- Requires Pendo (enterprise pricing)
- Overkill for survey-only

Pick when: you're already on Pendo and want the bundled feedback layer.

## What Survey Tools Won''t Do

- **Replace customer interviews.** Surveys give scores; interviews give why. Both matter. Per [user-feedback](user-feedback.md).
- **Tell you the action.** A 6.4 NPS doesn''t prescribe a fix; analyze open-text responses to find patterns.
- **Replace product analytics.** Surveys ask what users say; analytics show what they do. Per [web-analytics-providers](../marketing-and-seo/web-analytics-providers.md).
- **Be free of survey fatigue.** Over-surveying tanks response rates; one survey per quarter per cohort is the typical ceiling.
- **Replace win-loss / churn interviews.** Cancel-flow surveys are a start, not a substitute. Per [Win/Loss Analysis](https://www.launchweek.com/4-convert/win-loss-analysis).

## Pragmatic Stack Patterns

**Indie SaaS, basic NPS program**:
- Delighted (quarterly NPS via email)
- Total: $49/mo

**Indie SaaS, in-product feedback**:
- Refiner or Survicate (in-app micro-surveys)
- Total: $79-99/mo

**SaaS with full feedback program**:
- Survicate (NPS + in-app + link surveys, all in one)
- Total: $99-249/mo

**Product-led team with research focus**:
- Sprig (surveys + replay + research)
- Total: $175/mo+

**Already on HubSpot / Intercom / Pendo**:
- Use bundled survey tool
- Total: bundled

**Privacy-focused / OSS**:
- Formbricks (self-host) + maybe Refiner for cloud
- Total: $0 (self-host) or $99/mo

**One-off research**:
- Typeform or Google Forms
- Total: $25/mo or free

## Decision Framework: Three Questions

1. **Are you running continuous NPS or one-off surveys?** → Continuous: Delighted / Survicate. One-off: Typeform / Google Forms.
2. **Do you need in-product micro-surveys?** → Yes: Survicate / Refiner / Sprig. No: Delighted / Typeform.
3. **Are you already on a major platform?** → HubSpot / Intercom / Pendo: use bundled. Otherwise: standalone.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **Survicate if you want one tool; Delighted if NPS-only; Typeform for one-off research**. Skip Qualtrics until enterprise.

## Verdict

For most readers building a SaaS in 2026:
- **Default for NPS-only**: Delighted.
- **Default for NPS + in-app**: Survicate.
- **In-app SaaS micro-surveys**: Refiner.
- **Product-led with research focus**: Sprig.
- **One-off pretty surveys**: Typeform.
- **Already on HubSpot / Intercom / Pendo**: bundled.
- **OSS / privacy**: Formbricks.
- **Enterprise CX**: Qualtrics.

The hidden cost in surveys isn''t the seat fee — it''s **collecting feedback nobody acts on**. Teams run NPS quarterly, watch the number, but never close the loop with detractors or feed insights to product. The discipline of routing responses (low scores → success outreach; product complaints → product team; pricing concerns → leadership) matters more than the tool you pick. A spreadsheet survey acted on beats a Qualtrics program ignored.

## See Also

- [User Feedback Collection & Analysis](user-feedback.md) — workflow / interview discipline
- [Product Tour Providers](product-tour-providers.md) — Pendo / Userflow bundle surveys
- [Session Replay Providers](../devops-and-tools/session-replay-providers.md) — Sprig / Hotjar / FullStory pair with surveys
- [Web Analytics Providers](../marketing-and-seo/web-analytics-providers.md) — quantitative complement
- [CRM Providers](../marketing-and-seo/crm-providers.md) — HubSpot bundles surveys
- [Customer Support Tools](customer-support-tools.md) — Intercom / Zendesk bundle surveys
- [Email Marketing Providers](../marketing-and-seo/email-marketing-providers.md) — survey sends often via email
- [Win/Loss Analysis](https://www.launchweek.com/4-convert/win-loss-analysis) — qualitative complement
- [Customer Discovery Interviews](https://www.launchweek.com/1-position/customer-discovery-interviews) — pre-product feedback
- [Reduce Churn](https://www.launchweek.com/4-convert/reduce-churn) — surveys feed churn analysis
- [Public Roadmap](https://www.launchweek.com/2-content/public-roadmap) — surveys feed roadmap signal

---

[⬅️ Product & Design Overview](../product-and-design/)
