# User Research & Customer Interview Platforms: User Interviews, Respondent, Maze, Lookback, UserTesting, dscout, Great Question, Dovetail

[⬅️ Product & Design Overview](../product-and-design/)

If you're trying to actually talk to customers in 2026 — for product discovery, jobs-to-be-done research, usability testing, or generative interviews — this is the consolidated tool comparison. Most teams blur three different problems together: (1) recruiting participants who match your ICP, (2) running structured tests (usability, prototype, survey), and (3) storing + analyzing what you learn (research repository). Different tools solve different layers; picking the wrong one for your stage means either over-paying for capability you don't use or hand-rolling something that breaks at 5+ studies/month.

## TL;DR Decision Matrix

| Provider | Type | Pricing Floor | Indie Vibe | Best For |
|---|---|---|---|---|
| User Interviews | Recruiting marketplace | $45/participant + $50/session | Very high | B2B + B2C participant recruiting |
| Respondent | B2B-focused recruiting | $$ per participant (varies) | High | Hard-to-find B2B / specialist participants |
| dscout | Mobile diary studies + recruiting | $$$$ enterprise | Low | Longitudinal mobile-first research |
| UserTesting | Unmoderated + moderated panel | Custom enterprise | Low | Enterprise UX research at scale |
| Userlytics | Unmoderated + moderated alternative | $99/test+ | Medium | Mid-market UX research |
| Lookback | Live moderated session recording | $25/mo+ trial; teams $$ | Medium | Live customer interviews + observation |
| Maze | Unmoderated prototype + survey testing | Free / $99/mo | Very high | Designer-led quick tests on Figma prototypes |
| UsabilityHub (Lyssna) | Quick unmoderated micro-tests | $89/mo+ | High | Fast 5-second / preference / first-click tests |
| Great Question | All-in-one research ops platform | $349/mo+ | Medium | Mid-market+ research teams |
| Wynter | B2B message + positioning testing | $$$ | Medium | Marketing copy / positioning validation |
| Sprig | In-product micro-survey + replay | $99/mo+ | High | PLG product analytics + research |
| Hotjar | Session replay + survey | $39/mo+ | High | Web product UX + survey hybrid |
| Pollfish | Survey panel | Per-response | Medium | Quick consumer-survey panels |
| Prolific | Academic-leaning panel | Per-response | Medium | Scientific surveys; vetted academic participants |
| Centiment | Survey panel for B2B | Per-response | Medium | B2B survey at scale |
| UserBob | $1/min unmoderated tests | $1/min | Very high | Indie-cheap unmoderated UX testing |
| Dovetail | Research repository / synthesis | $35/seat/mo+ | High | Tagging, theming, AI synthesis of qualitative |
| Notably | AI-first research repository | $39/seat/mo+ | High | Modern AI-assist research repo |
| EnjoyHQ (acquired by UserTesting) | Research repository (legacy) | n/a | Low | Existing customers; new picks should consider Dovetail/Notably |
| Pulse Labs / Aurelius / Reduct | Niche research analysis tools | Various | Various | Specialized synthesis needs |
| In-house: Calendly + Zoom + Notion | DIY | $0-50/mo | Very high | Pre-Series A teams; <5 studies/month |

The first decision is **which layer you're solving**: recruiting (User Interviews / Respondent), testing (Maze / Lookback / UserTesting), or analysis (Dovetail / Notably). Most teams need at least 2 of the 3 layers; some pick all-in-one (Great Question, UserTesting Enterprise) but pay for capability they may not use.

## Decide What You Need First

Research tools are not interchangeable. The same product team at different stages has very different needs.

### Pre-Series A / Founder-led research (the 35% case)

You're doing 5-15 customer interviews/month. You recruit through your customer email list, your Twitter, your Slack community, or warm intros. You run sessions on Zoom. Notes go to Notion. **Don't buy specialized tools yet.** Calendly + Zoom + Notion is fine. Maybe Maze for occasional Figma prototype tests. The category overhead at this scale costs more than it saves.

### Growth-stage product team (the 30% case)

You're doing 5-20 studies/quarter; one researcher or PM owns research. You need: participant recruiting (your customer list isn't big or diverse enough), unmoderated testing (Figma prototypes, surveys), and a place to actually find research findings 3 months later. **User Interviews + Maze + Dovetail** is the dominant stack.

### Mid-market / dedicated research team (the 20% case)

You have 1-3 researchers. You're running 50+ studies/year. You need: participant ops (panels, screening, recruiting at scale), all the test types (unmoderated, moderated, longitudinal, surveys), research ops process (intake, scheduling, repository, synthesis). **Great Question** or **UserTesting + User Interviews + Dovetail** combinations are common.

### Enterprise UX research org (the 10% case)

You have 5+ researchers. UX research is a distinct function with leadership. You're doing diary studies, longitudinal panels, accessibility research, multi-country studies. **UserTesting Enterprise** + **dscout** + a research ops platform.

### B2B / niche participant audiences (the 5% case)

You need to interview C-suite buyers in healthcare IT, or 5 specific developers using competitor X. Mass marketplaces don't have these people. **Respondent** specializes in hard-to-find B2B; alternatively, hand-roll outreach via LinkedIn + Slack.

## Provider Deep-Dives

### User Interviews

The dominant participant recruiting marketplace. Database of ~1M+ participants across consumer + B2B segments. Founded 2015. Primary use: "Find me 8 SMB marketers who use HubSpot, by Friday."

Strengths:

- **Largest panel** in North America — fast turnaround on common participant criteria
- B2B + B2C support with screener questions
- Built-in scheduling, payment, NDA handling
- "Recruit & Pay" tier ($75/session typical for B2C, higher for B2B specialists)
- "Research Hub" tier for those who want to recruit from their own list (free participant tracking + scheduling)
- Honoraria handled — no PayPal-to-participant logistics
- ICP-targeting via ~50+ screener attributes
- API access for higher-volume teams

Weaknesses:

- B2B specialist participants (CTOs, niche industries) sometimes hard to find
- Costs add up at volume — $400-1000 per study in incentives + platform fee
- US-heavy panel; international less deep
- Sometimes participant quality is mixed (incentive-motivated rather than genuinely interested)

Use User Interviews when:

- You need participants outside your customer list
- You're doing 5+ studies/month with varied audiences
- You want platform handling of payments + NDAs

### Respondent

B2B-focused recruiting marketplace. Smaller panel than User Interviews; specialized in B2B / professional roles. Hard-to-find audiences (CIOs, Product VPs, specific software users).

Strengths:

- **Better for B2B niches** — software engineers, finance leaders, specific industry roles
- Higher incentives attract harder-to-reach participants
- Strong screener tooling

Weaknesses:

- Smaller panel — slower turnaround
- More expensive per participant ($200-500+ for senior B2B roles)
- Less suitable for B2C consumer studies

Use Respondent when:

- You can't find your ICP on User Interviews
- B2B specialist participants justify higher cost

### Maze

Unmoderated prototype testing + survey platform. Founded 2018. Strong Figma integration. Designer-favorite tool.

Strengths:

- **Best Figma integration** — drop a prototype URL, get clickable test on the prototype
- Mission-style task flows (instructions + tasks + post-task questions)
- Quantitative metrics: success rate, time-on-task, misclicks, heatmaps
- Survey-style follow-ups (rating scales, open-ended)
- AI summary of qualitative responses (newer feature)
- Free tier (3 active studies, limited responses)
- Fast iteration on tests — designers can ship in an hour

Weaknesses:

- Unmoderated only — no live observation or follow-up questions
- Less suited for sensitive topics where you want a real conversation
- Quant-heavy; qualitative depth is shallower than moderated interviews
- Pricing scales with seat count + usage

Use Maze when:

- Designers iterating on Figma prototypes
- Quick quantitative validation: which design wins?
- A/B testing UI variants pre-launch

### Lookback

Live moderated session recording. Founded 2014. Researcher / PM live-observes a participant using a product or prototype.

Strengths:

- **Best live observation tool** — see participant's screen + face + voice live
- Real-time note-taking with timestamps and team members watching
- Highlights + sharable clips for synthesis
- Mobile + desktop session capture
- Affordable for individual researchers ($25/mo trial; teams $$)

Weaknesses:

- Moderated-only — every session needs a researcher live
- Recruiting separate (use User Interviews / Respondent alongside)
- Newer features (async clips, repository) less mature than Dovetail

Use Lookback when:

- You're doing moderated interviews and want recording + observation infrastructure
- Cross-functional teammates want to watch live

### UserTesting (formerly UserTesting.com)

Enterprise UX research platform. Founded 2007. Largest participant panel after User Interviews; built-in unmoderated testing platform.

Strengths:

- **End-to-end platform** — recruiting + testing + analysis bundled
- Largest panel for unmoderated screen-recorded studies
- Strong global panel
- AI insights (UserTesting AI) for video summaries
- Acquired EnjoyHQ for repository/synthesis
- Enterprise tooling for large UX research orgs

Weaknesses:

- **Enterprise pricing** ($30K-200K+/yr) — overkill for non-research-team-led orgs
- Sales-led; long contracts
- Heavier than designer-led teams need
- Quality of unmoderated panel mixed (incentive-driven)

Use UserTesting when:

- You have a dedicated research team
- Budget supports enterprise contract
- Global panel access matters

### dscout

Mobile-first diary studies. Founded 2010. Specializes in longitudinal research where participants log experiences over days/weeks via mobile app.

Strengths:

- **Best for longitudinal / diary research** — "track your behavior for 5 days"
- Mobile-native — photo + video + voice capture from participants
- Strong for ethnographic / in-the-moment research

Weaknesses:

- Niche use case; not for one-off interviews
- Enterprise pricing
- Mobile-only — desktop research needs other tools

Use dscout when:

- Diary studies / longitudinal research is in your toolkit
- Behavior-in-context research matters

### Userlytics

UserTesting alternative. Mid-market unmoderated + moderated.

Strengths:

- More affordable than UserTesting Enterprise
- Both unmoderated + moderated supported
- Decent panel
- Pricing more transparent

Weaknesses:

- Smaller panel than UserTesting
- Less feature depth
- Quality of panel mixed

Use Userlytics when:

- UserTesting is too expensive but you want similar capability
- Mid-market UX research budget

### UsabilityHub / Lyssna

Quick micro-tests. Five-second tests, preference tests, first-click tests, design surveys.

Strengths:

- **Fast** — design questions answered in hours, not days
- Cheap ($89/mo)
- Great for quantitative design decisions
- Browser-native; no participant app install

Weaknesses:

- Test types limited — not for full usability sessions
- Can't do in-depth interviews

Use Lyssna when:

- You need fast quantitative feedback on design choices
- Five-second tests, preference, first-click matter

### Great Question

All-in-one research ops platform. Founded 2020. Targets the gap between "scattered tools" and "enterprise platform."

Strengths:

- **Bundled stack**: recruiting (own panel + integrate with User Interviews), unmoderated tests, moderated session recording, repository, synthesis
- Mid-market pricing ($349-1500/mo)
- Modern UX
- Research ops workflows (intake forms, scheduling, panel management)
- AI synthesis features

Weaknesses:

- Newer; smaller customer base than UserTesting
- All-in-one means none of the pieces are best-in-class
- Pricing escalates with usage

Use Great Question when:

- You want one tool instead of 4
- Mid-market budget; not enterprise

### Wynter

B2B messaging + positioning testing. Founded by Peep Laja (CXL). Niche.

Strengths:

- **Specialized for marketing copy validation** — show 5-15 B2B buyers your homepage; get structured feedback on clarity, persuasiveness, positioning
- Vetted B2B panel (real buyers; LinkedIn-verified)
- Fast turnaround (24-48 hours)
- Categorically different from UX research — purpose-built for marketers

Weaknesses:

- B2B-only
- Specific use case; not general research
- Premium pricing

Use Wynter when:

- You're testing landing page copy, value prop, or positioning with B2B buyers
- Marketing-led research not product-led

### Sprig

In-product micro-survey + session replay. PLG product analytics with research overlay.

Strengths:

- **In-product targeted surveys** — show a survey only to users who match a behavior + segment
- Combine with session replay for context
- Fast iteration; designed for PLG product teams
- AI summarization of open-ended

Weaknesses:

- Surface-level — not deep qualitative
- Best as supplement to deeper research, not replacement

Use Sprig when:

- You're a PLG product team running quick in-product surveys
- You want product context (replay) alongside survey responses

### Hotjar

Session replay + heatmaps + on-page surveys. Web-focused. Long-time staple.

Strengths:

- Affordable session replay with on-page surveys
- Heatmaps on web pages
- Funnel visualization
- Self-serve; cheap

Weaknesses:

- Lighter on research-process; not a research platform
- Best as supplement, not main research tool

Use Hotjar when:

- You need quick in-page session replay + survey
- Marketing/conversion optimization use cases

### Pollfish, Prolific, Centiment

Survey panel platforms.

- **Pollfish**: consumer surveys at scale, mobile-app-driven panel
- **Prolific**: academic-leaning, high-quality panel; popular for behavioral research
- **Centiment**: B2B survey panel

Use when:

- You need 100s-1000s of survey responses fast
- Quantitative survey is the right tool

### UserBob

Cheap unmoderated tests. $1/minute pricing (~$5-10 per test). Bare-bones.

Use UserBob when:

- Indie / extremely budget-constrained
- 1-2 tests, not ongoing research

### Dovetail

Research repository + synthesis. Founded 2017. Dominant in the "where do my interview transcripts live?" question.

Strengths:

- **Best research repository** for tagging, theming, searching past research
- AI features for transcription + synthesis (newer; rapidly improving)
- Integrations with research tools (recordings auto-import)
- Strong tagging + insight-building workflows
- Searchable across studies (find every quote about feature X)

Weaknesses:

- Not a research-doing tool — only synthesis/repository
- Pricing scales with seats ($35-100/seat/mo)
- Larger orgs need to invest in tagging discipline or repository decays

Use Dovetail when:

- You're doing 5+ studies/quarter and need a place to find findings 6 months later
- Synthesis is becoming a bottleneck

### Notably

Modern AI-first research repository. Newer alternative to Dovetail.

Strengths:

- **AI-first** — auto-generates themes, insights, summaries
- Modern UX
- Pricing comparable to Dovetail

Weaknesses:

- Newer; smaller ecosystem
- AI features sometimes need correction

Use Notably when:

- You want AI-assisted synthesis as the primary value
- You're early on the research-ops curve

## What These Tools Won't Do

**Don't expect AI to replace researchers.** AI summarization and theme detection are useful but unreliable for nuanced insight. Treat AI as draft assistant, not autopilot.

**Don't expect tools to fix bad questions.** A research tool can't save a bad interview script. Invest in question quality first.

**Don't expect recruiting marketplaces to find your exact ICP perfectly.** Some specialist roles (CISO at a 1000-person fintech) are slow + expensive. Hand-recruit via LinkedIn + warm intros for the hardest-to-find segments.

**Don't expect quant-only tools (Maze, Lyssna) to replace conversations.** Fast quant feedback complements but doesn't substitute for moderated interviews where follow-up questions matter.

**Don't expect a repository to organize itself.** Dovetail / Notably need consistent tagging discipline. Without it, they become file dumps.

**Don't expect "all-in-one" to be best-in-class at any one thing.** Great Question / UserTesting are convenient; specialized stacks (User Interviews + Maze + Dovetail) are deeper.

## Pragmatic Stack Patterns

### Pre-seed / Solo founder

- Calendly for scheduling
- Zoom for sessions
- Notion for notes + lightweight repository
- Maze (free tier) for occasional prototype tests
- Total: $0-50/mo

### Seed / Series A

- User Interviews (recruiting + Research Hub)
- Maze for unmoderated prototype tests
- Lookback or Zoom (with cloud recording) for moderated
- Dovetail (or Notion still) for repository
- Total: $200-700/mo + per-study incentives

### Series B+ with research function

- User Interviews + Respondent (for B2B specialists)
- Maze + UserTesting or Userlytics
- Dovetail or Great Question for research ops
- Wynter for marketing-side research
- Total: $1.5K-5K/mo + incentives

### Enterprise UX research org

- UserTesting Enterprise
- dscout for longitudinal
- Great Question or UserTesting + EnjoyHQ for ops
- Custom panel partnerships for specialist segments
- Total: $50K-300K+/yr

## Decision Framework: Five Questions

1. **What's your research volume?**
   - <5 studies/month: don't buy specialized tools yet
   - 5-20 studies/month: User Interviews + Maze + Dovetail
   - 20+ studies/month: Great Question or UserTesting + ecosystem

2. **Who runs the research?**
   - Designers/PMs (no dedicated researcher): Maze, Lyssna, Sprig
   - 1 researcher: User Interviews + Lookback + Dovetail
   - Research team: Great Question or UserTesting Enterprise

3. **Moderated, unmoderated, or both?**
   - Moderated: Lookback + Zoom + recruiting
   - Unmoderated: Maze + UserTesting / Userlytics
   - Both: combinations of above

4. **B2B or B2C?**
   - B2C: User Interviews / UserTesting / Pollfish
   - B2B: User Interviews + Respondent for specialists; Wynter for messaging

5. **Quantitative or qualitative?**
   - Quant: Maze / Lyssna / Sprig / Hotjar / Pollfish / Prolific
   - Qual: Lookback / User Interviews + Dovetail
   - Both: combination

## Verdict

**Pre-Series A**: don't buy. Calendly + Zoom + Notion + occasional Maze.

**Standard mid-market stack**: User Interviews (recruiting) + Maze (unmoderated tests) + Lookback (moderated sessions) + Dovetail (repository). $400-1000/mo + incentives.

**B2B specialists**: add Respondent for hard-to-find B2B audiences; Wynter for marketing research.

**Enterprise**: UserTesting + dscout + research ops platform.

**AI-first research repo**: Notably is worth a look as Dovetail competition matures.

The most common mistake is **buying a research platform before you have research volume**. A $5K/yr UserTesting subscription used 3 times a quarter is dead money. The second is **picking all-in-one when specialized tools each beat the bundle**. The third is **expecting tools to fix bad practice** — research quality lives in question design and synthesis discipline, not tooling.

## See Also

- [Customer Discovery Interviews (LaunchWeek)](https://launchweek.dev/content/1-position/customer-discovery-interviews.md) — the practice this tooling supports
- [Customer Journey Mapping Playbook](https://launchweek.dev/content/4-convert/customer-journey-mapping-playbook.md) — uses interview evidence
- [Voice of Customer Program](https://launchweek.dev/content/4-convert/voice-of-customer-program.md)
- [Customer Feedback & Feature Request Tools](./customer-feedback-feature-request-tools.md) — Canny / Productboard
- [Survey & NPS Providers](./survey-nps-providers.md) — Typeform / SurveyMonkey
- [Customer Success Platforms](./customer-success-platforms.md)
- [Customer Support Tools](./customer-support-tools.md)
- [Product Tour Providers](./product-tour-providers.md) — Pendo / Userpilot for in-product
- [User Feedback](./user-feedback.md)
- [UX Design](./ux-design.md)
- [Visual Design](./visual-design.md)
- [Whiteboarding & Diagramming Tools](./whiteboarding-diagramming-tools.md) — for journey mapping artifacts
- [Notetaking & Personal Knowledge Tools](./notetaking-personal-knowledge-tools.md)
- [Workspace Knowledge Base Tools](./workspace-knowledge-base-tools.md)
- [Live Chat Widget Tools](./live-chat-widget-tools.md)
- [Customer Education / LMS Platforms](./customer-education-lms-platforms.md)
- [Course / Cohort Creator Platforms](./course-cohort-creator-platforms.md)
- [Customer Data Platforms](../marketing-and-seo/customer-data-platforms.md) — feeding behavioral data to research
- [Product Analytics Providers](../devops-and-tools/product-analytics-providers.md) — Mixpanel / Amplitude / PostHog
- [Session Replay Providers](../devops-and-tools/session-replay-providers.md) — Hotjar / FullStory / LogRocket
