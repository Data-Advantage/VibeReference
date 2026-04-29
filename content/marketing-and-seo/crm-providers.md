# CRM Providers: HubSpot, Pipedrive, Attio, Folk, Close, Salesforce Starter, Zoho, Copper, monday CRM, Capsule

[⬅️ Marketing & SEO Overview](../marketing-and-seo/)

If you're building a SaaS in 2026 and trying to pick a CRM, this is the consolidated comparison. CRMs are the line item that looks free until your team starts logging deals in Notion, Linear, and a private Slack channel — at which point you have three "sources of truth" and revenue forecasting becomes archaeology. Most indie founders over-invest in HubSpot too early ("the free tier sells the paid tier"), or pick Salesforce because their last company used it and watch the bill compound. Pick the right shape and the CRM is invisible plumbing; pick wrong and the team avoids it, the data rots, and you're flying blind on pipeline.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| HubSpot CRM | Marketing-led suite | Free (forever, 1M contacts, basic pipeline) | $15/seat/mo (Starter) | High | PLG-leaning teams that want CRM + email + landing pages in one |
| Pipedrive | Pipeline-first sales | 14-day trial | $14/user/mo | High | Founder-led sales-led teams; $50K–$500K ARR |
| Attio | API-first, modern data model | Free (3 users) | $34/user/mo (Plus) | Very high | Tech-savvy founders who want a customizable, queryable CRM |
| Folk | Network + outreach hybrid | Free (1 user, 200 contacts) | $25/user/mo | High | Network-driven sales; investor / partnership / community ops |
| Close | Built for SDR/AE workflows | 14-day trial | $19/user/mo (Base) | Medium | Outbound-heavy teams that live in the dialer |
| Salesforce Starter | Mini-Salesforce | 30-day trial | $25/user/mo | Low | Teams who know they're going to enterprise eventually |
| Zoho CRM | Budget option | Free (3 users) | $14/user/mo | Medium | Bootstrapped teams already using Zoho ecosystem |
| Copper | Google Workspace native | 14-day trial | $9/user/mo (Starter) | Medium | Google Workspace shops who want CRM inside Gmail |
| monday CRM | Visual / project-management hybrid | 14-day trial | $12/user/mo | Medium | Teams already on monday.com for project management |
| Capsule | Simple, sustainable | Free (2 users / 250 contacts) | $18/user/mo (Starter) | High | Bootstrapped solopreneurs who want simple CRUD |
| Notion / Airtable / spreadsheets | DIY | Free | Cost of your time | Medium | Pre-PMF teams with <50 contacts |

The first decision is **what shape of CRM you actually need**. A pure pipeline tracker (Pipedrive, Close), a customizable database (Attio, Folk), a marketing-bundle CRM (HubSpot), and an enterprise-trajectory CRM (Salesforce) are four different products with four different bills. Most indie SaaS need exactly one of these.

## Decide What You Need First

CRMs are not interchangeable. Get this part wrong and you'll either underpay for a tool the team won't use or overpay for capacity that never gets touched.

### Pure pipeline tracking (the 50% case for indie SaaS)
You want to see deals as they move through stages. Stage transitions, deal values, expected close dates, owner. Email integration so reps can log calls automatically. No marketing automation, no support tickets, no website forms.

Right tools:
- **Pipedrive** — visual pipeline default
- **Close** — best for outbound-heavy SDR/AE motions
- **Attio** — modern, customizable, API-first

### Marketing + sales suite (when you want one bill)
You want CRM + email marketing + landing pages + form-builder + chat widget all under one tool. Useful when the team is small and consolidating tools matters.

Right tools:
- **HubSpot** — the canonical "CRM + marketing" bundle
- **Zoho** — budget version of the same idea

### Customizable data model (when your sales motion is unusual)
You want to model accounts, deals, partnerships, and relationships in your own schema — closer to Airtable than a packaged CRM. API-first; integrations as code; data lives in your shape, not theirs.

Right tools:
- **Attio** — modern, type-safe, queryable data model
- **Folk** — relationship-graph + outreach hybrid

### Network / partnership / community ops (when "sales" isn't the only thing in the CRM)
You're tracking relationships across investors, customers, partners, and community members. Pipeline is one of many lenses, not the primary one.

Right tools:
- **Folk** — purpose-built for network ops
- **Attio** — generic enough to model this if you set it up

### Enterprise trajectory (when you know you'll be selling to F500)
You're explicitly going upmarket; your customer's procurement will eventually require Salesforce because that's what their procurement understands; pick the on-ramp now.

Right tools:
- **Salesforce Starter** — mini-Salesforce; predictable upgrade path
- **HubSpot Sales Hub Enterprise** — credible alternative if you're already on HubSpot

For most indie SaaS in 2026: **HubSpot Free if you're PLG-leaning; Pipedrive or Attio if you're sales-led; Folk if relationships are the product**. Skip Salesforce until your buyer's procurement demands it.

## Provider Deep-Dives

### HubSpot CRM — The Marketing-Led Suite
HubSpot is the most-marketed CRM in the world, and the free tier is genuinely useful — unlimited users, 1M contacts, basic pipeline. The trade-off is that the value proposition assumes you'll grow into the paid tiers (Marketing Hub, Sales Hub, Service Hub), and those bills compound.

Strengths:
- Free tier is the most generous in the category
- Strongest "all-in-one" story (CRM + email + forms + chat + landing pages)
- Massive integration ecosystem (Stripe, Slack, Intercom, Zapier, Make)
- Breeze AI features for email drafting, segmentation, lead scoring
- Best-in-class customer education / Academy / community
- Strong reporting and forecasting (on paid tiers)

Weaknesses:
- "Free" is a pull into expensive tiers — Pro plans start around $1,200/mo per seat-bundle
- Contact-tier pricing creates surprise bills at scale
- The product surface is huge; new users get overwhelmed
- Marketing automation can feel templated / generic

Pick when: you're PLG-leaning, you want one tool for sales + marketing, and you're comfortable with the upgrade-path pricing model.

### Pipedrive — Pipeline-First Sales
Pipedrive is the simplest pipeline-tracking CRM in the category. Visual kanban-style stages, fast to learn, opinionated in good ways. Best for founder-led or small sales teams in the $50K–$500K ARR range.

Strengths:
- Fastest setup of any major CRM (15 minutes to first deal logged)
- Visual pipeline stages — drag and drop
- Strong email integration (Gmail, Outlook) with two-way sync
- AI Sales Assistant for next-step suggestions
- Reasonable pricing through the Advanced tier
- Mobile app is genuinely usable

Weaknesses:
- Less marketing depth than HubSpot
- Custom data model is shallow vs Attio
- Reporting is competent but not deep
- LeadBooster / Smart Docs are paid add-ons that add up

Pick when: you have a sales-led motion, you want a clean pipeline view, and you don't need marketing automation in the same tool.

### Attio — Modern, API-First, Customizable
Attio is the modern entrant that treats the CRM as a database. You define objects (Companies, People, Deals, Investors, Partners), each with typed fields, and build views like Airtable. Y Combinator-favorite.

Strengths:
- Customizable data model — model your business, not theirs
- Excellent API and webhooks; integrates as code
- Modern UI; fast and quiet
- Strong enrichment via Clearbit-style integrations
- Real-time collaboration (multiplayer cursors)
- Notion-style mentions, comments, and inline tasks
- Free tier (3 users) is genuinely useful

Weaknesses:
- Higher learning curve — you have to design your data model
- $34/user/mo Plus tier is pricier than Pipedrive
- Less hand-holding for non-technical sales reps
- Reporting is less mature than HubSpot/Salesforce

Pick when: you're tech-savvy, you want a queryable / API-first CRM, and your sales motion is non-standard enough that off-the-shelf tools chafe.

### Folk — Network and Outreach Hybrid
Folk sits between a CRM and a contact-relationship manager. Strong for tracking relationships across investors, partners, customers, candidates, and community — not just sales pipeline.

Strengths:
- Treats relationships as first-class (not just deals)
- Strong contact enrichment (LinkedIn, web, email)
- Outreach sequencing built in
- Folk X (browser extension) auto-logs from LinkedIn / email
- Modern UI; opinionated in helpful ways
- Free tier (1 user, 200 contacts)

Weaknesses:
- Pipeline reporting is light compared to Pipedrive/HubSpot
- Credit-based usage on enrichment can surprise
- Less appropriate for high-volume outbound sales
- Smaller ecosystem of integrations

Pick when: relationships are the product (network-driven sales, partnerships, fundraising, community ops) and pipeline is one lens, not the only one.

### Close — Built for SDR/AE Workflows
Close is purpose-built for outbound sales teams that live in the dialer. Inbox + calls + SMS + tasks in one workspace. Less general-purpose than HubSpot or Pipedrive; deeper in its niche.

Strengths:
- Built-in calling and SMS (no separate dialer needed)
- Power dialer for high-volume outbound
- Email + call sequences in one place
- Strong workflow automation
- Reasonable pricing for a sales-team-grade tool

Weaknesses:
- Overkill for founder-led / low-volume sales
- Light on marketing automation
- UI can feel utilitarian
- Smaller ecosystem than HubSpot

Pick when: you have one or more SDRs/AEs running outbound at volume and you want call tracking, sequencing, and the dialer in one tool.

### Salesforce Starter — Mini-Salesforce
Salesforce Starter is the SMB on-ramp to the full Salesforce platform. Cleaner UI than legacy Salesforce; intentional simplicity. Strong choice if you know you're going upmarket.

Strengths:
- Predictable upgrade path to full Salesforce
- Familiar to anyone who's worked at a F500
- Strongest enterprise procurement reputation
- Massive AppExchange ecosystem
- Trailhead training resources

Weaknesses:
- $25/user/mo entry; pricier than Pipedrive
- Still feels like Salesforce — overkill for 2-15 person teams
- Configuration overhead even at Starter tier
- Less indie-friendly than newer entrants

Pick when: you're explicitly building toward enterprise sales, your customer's procurement will eventually demand Salesforce, or your team has Salesforce muscle memory from previous companies.

### Zoho CRM — Budget Option
Zoho CRM is part of the broader Zoho suite (40+ apps). Cheapest serious CRM in the category; useful if you're already on Zoho One, less compelling otherwise.

Strengths:
- Cheapest legit CRM with a paid tier ($14/user/mo)
- Free tier (3 users)
- Bigin by Zoho is an even simpler / cheaper starting point
- Massive Zoho ecosystem (Books, Desk, Mail, Campaigns)
- Zia AI features
- Strong international footprint

Weaknesses:
- UI feels older than HubSpot/Attio/Pipedrive
- Documentation can be inconsistent
- Less indie-cool than modern entrants
- Integration depth varies by Zoho product

Pick when: budget is the primary constraint, you're already paying for Zoho, or you're outside the US/EU where Zoho's global pricing helps.

### Copper — Google Workspace Native
Copper is the CRM that lives inside Gmail. If your team works primarily out of Gmail and you want CRM context where the email is, Copper has the best integration in the category.

Strengths:
- Native Gmail / Google Calendar / Google Drive integration
- Team uses CRM without leaving Gmail
- Reasonable pricing ($9/user/mo Starter)
- Strong for Google Workspace shops
- Recent UI refresh has helped

Weaknesses:
- Tied to Google Workspace; weak Outlook story
- Less feature depth than HubSpot
- Smaller ecosystem of integrations
- Reporting is light

Pick when: your team is 100% Google Workspace and you want CRM in Gmail rather than a separate app to remember.

### monday CRM — Visual / PM Hybrid
monday CRM is monday.com's CRM module. Useful if you're already using monday for project management; less compelling as a standalone CRM.

Strengths:
- Same UI as monday.com PM
- Visual / board-based pipeline
- Highly customizable boards
- Reasonable pricing ($12/user/mo)

Weaknesses:
- Pipeline UX feels like a project board, not a deal flow
- Less sales-specific automation than Pipedrive
- Reporting is light
- Better if you're already on monday.com

Pick when: you already use monday.com for PM and want one tool for projects + sales tracking.

### Capsule — Simple and Sustainable
Capsule is the indie-friendly, profitable, no-VC-pressure CRM. Free for 2 users / 250 contacts; affordable starter tier; opinionated simplicity.

Strengths:
- Free tier (2 users / 250 contacts)
- Simple UX; zero training needed
- Profitable and sustainable company (less platform-shift risk)
- Email integration with Gmail/Outlook
- Mobile app

Weaknesses:
- Smaller ecosystem
- Less feature depth than category leaders
- Reporting is basic
- Not appropriate for high-volume sales teams

Pick when: you're a solopreneur or 2-3-person team, you want simple CRUD without HubSpot's gravitational pull, and you'll outgrow it but that's okay.

### DIY — Notion / Airtable / Spreadsheets
For pre-product-market-fit teams with under 50 contacts, a Notion database or Airtable base is genuinely the right tool. Don't apologize for it.

Use when: you have fewer than 50 active contacts, no recurring sales process, and adding a CRM would add ceremony without value.

Don't use when: pipeline is multi-stage, you have multiple people logging activity, or you need reporting beyond "count rows."

## What CRMs Won't Do

- **Replace your product analytics.** PostHog, Amplitude, Mixpanel — see [product-analytics-providers](../devops-and-tools/product-analytics-providers.md) — track product usage. CRMs track sales activity. Different problems.
- **Replace your billing system.** [Payment providers](../auth-and-payments/payment-providers.md) (Stripe, Polar, Paddle) own billing data; CRMs reflect it.
- **Replace your support tool.** [Customer support tools](../product-and-design/customer-support-tools.md) handle tickets; CRMs handle deals.
- **Auto-generate pipeline.** A CRM is a database. The pipeline materializes from disciplined data entry, which is a culture issue, not a tool issue.
- **Solve "we don't know our customer."** That's a discovery problem, not a tooling problem.

## Pragmatic Stack Patterns

**Indie SaaS, PLG-leaning**:
- HubSpot Free (CRM + email + forms)
- Layered with PostHog / Plausible for product analytics
- Total: $0 until you outgrow it

**Indie SaaS, sales-led at $50K–$500K ARR**:
- Pipedrive or Attio
- Apollo or Clay for outbound enrichment
- Email tracking via Gmail / Mixmax
- Total: $14–34/user/mo

**Network-driven / partnerships / fundraising-heavy**:
- Folk
- LinkedIn enrichment via Folk X or Clay
- Total: $25/user/mo + enrichment credits

**Outbound-heavy with SDRs**:
- Close
- Outreach.io or Apollo for sequencing
- Total: $19–99/user/mo depending on tier

**Going-to-enterprise trajectory**:
- HubSpot Sales Hub Pro or Salesforce Starter
- Plan multi-month migration to full Salesforce around $5M ARR
- Total: $25–$100/user/mo

**Pre-PMF, <50 contacts**:
- Notion or Airtable
- One database, three views (active / dormant / customers)
- Total: $0–$10/user/mo

## Decision Framework: Three Questions

1. **What's your motion (per [self-serve vs sales-led](https://www.launchweek.com/4-convert/self-serve-vs-sales-led))?** → PLG: HubSpot. Sales-led: Pipedrive / Attio / Close. Hybrid: HubSpot or Attio.
2. **How customizable does your data model need to be?** → Standard: Pipedrive or HubSpot. Custom: Attio or Folk.
3. **Are you going to enterprise within 18 months?** → Yes: Salesforce Starter or HubSpot Pro. No: any indie-friendly option.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **HubSpot Free if you don't know yet; Pipedrive or Attio if you know you're sales-led**. Don't pay Salesforce until enterprise demands it.

## Verdict

For most readers building a SaaS in 2026:
- **Default for PLG-leaning**: HubSpot Free → Starter as you grow.
- **Default for sales-led**: Pipedrive ($14/user/mo).
- **API-first / customizable**: Attio.
- **Network / partnerships**: Folk.
- **Outbound-heavy**: Close.
- **Going-to-enterprise**: Salesforce Starter or HubSpot Sales Hub Pro.
- **Budget-constrained**: Zoho or Capsule.
- **Pre-PMF**: Notion or Airtable.

The hidden cost in a CRM isn't the seat fee — it's **bad data**. A team that doesn't log calls, doesn't update stages, doesn't keep contacts current creates a CRM that's worse than no CRM (because forecasts based on bad data are worse than no forecasts). Pick a tool the team will actually use; enforce 5-minute logging discipline; review pipeline weekly. The tool is the easy part.

## See Also

- [Self-Serve vs Sales-Led](https://www.launchweek.com/4-convert/self-serve-vs-sales-led) — your motion drives CRM choice
- [HubSpot](hubspot.md) — deep-dive on the most-marketed option
- [Lead Magnets](https://www.launchweek.com/2-content/lead-magnets) — magnets feed leads into the CRM
- [Sales Demo Calls](https://www.launchweek.com/4-convert/sales-demo-calls) — the calls logged in the CRM
- [Sales Playbook](https://www.launchweek.com/4-convert/sales-playbook) — the playbook the CRM enforces
- [Customer Support Tools](../product-and-design/customer-support-tools.md) — separate from CRM in 2026
- [Product Analytics Providers](../devops-and-tools/product-analytics-providers.md) — product usage data; complementary
- [Email Providers](../backend-and-data/email-providers.md) — transactional email; the CRM does marketing email
- [Email Marketing](email-marketing.md) — separate or bundled depending on CRM choice

---

[⬅️ Marketing & SEO Overview](../marketing-and-seo/)
