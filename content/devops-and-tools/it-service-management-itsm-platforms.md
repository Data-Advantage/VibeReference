# IT Service Management (ITSM) Platforms: ServiceNow, Jira Service Management, Freshservice, Zendesk, Halo, SysAid, Vivantio

[⬅️ DevOps & Tools Overview](../devops-and-tools/)

If you're a SaaS company past 50 employees in 2026, you have an IT problem that doesn't fix itself: someone needs a new laptop, an SSO fix, an app provisioned, a password reset. By 100 employees you have an IT person; by 200 you have an IT team; somewhere between 100-300 you need an ITSM platform — a structured ticketing + change-management + asset-management + knowledge-base system that makes IT support consistent, auditable, and scalable.

The category split that matters: **enterprise full-stack ITSM** (ServiceNow — the dominant Fortune 500 platform), **modern cloud-native** (Jira Service Management — Atlassian shops; Freshservice — mid-market default), **support-tool-extended-to-ITSM** (Zendesk Suite — bundled with customer support), and **specialized SMB** (Halo / SysAid / Vivantio — for those who outgrew Trello but can't afford ServiceNow).

This is distinct from customer-support tools (which face external customers) and internal IT helpdesk apps (which are simpler ticketing). ITSM adds structured workflows: incident management, problem management, change management, request fulfillment, asset/configuration management, knowledge base, SLA management — typically aligned to the ITIL framework.

## TL;DR Decision Matrix

| Provider | Type | Pricing Floor | Indie Vibe | Best For |
|---|---|---|---|---|
| **Enterprise** | | | | |
| ServiceNow | Enterprise ITSM leader | $$$$$ ($100K-1M+/yr) | Very low | Fortune 1000 / public companies |
| BMC Helix (Remedy) | Legacy enterprise | $$$$$ | Very low | Existing BMC shops |
| **Modern Cloud-Native** | | | | |
| Jira Service Management | Atlassian's ITSM | $19.04-47.82+/agent/mo | Medium | Atlassian-aligned mid-market |
| Freshservice | Modern mid-market ITSM | $19-99/agent/mo | High | Mid-market default; modern UX |
| **Support-Extended** | | | | |
| Zendesk Suite | Customer-support extended to ITSM | $115-249/agent/mo | Medium | Zendesk customers extending internally |
| **SMB / Specialized** | | | | |
| Halo ITSM | Modern alternative; UK-origin | $$$ | Medium | Mid-market wanting Halo's UX |
| SysAid | Mid-market all-in-one | $$ | Medium | Cost-conscious mid-market |
| Vivantio | Service-desk-focused | $$ | Medium | UK / EU focused mid-market |
| Ivanti Neurons (formerly Cherwell + Heat) | Hybrid + modern | $$$$ | Low | Existing Ivanti customers |
| **Newer Modern Entrants** | | | | |
| Atera | MSP-focused IT management | $$ | High | MSPs serving SMB clients |
| Spiceworks Cloud Help Desk | Free + community | Free | Very high | Sub-100-employee SMB |
| Hudu | IT documentation + light ITSM | $$ | High | IT docs + asset management focus |
| Splashtop SOS / Connectwise | Remote support adjacent | $$ | Medium | RMM + remote support focus |
| **Lightweight / Bootstrap** | | | | |
| Linear / Notion / Airtable + GitHub Issues | DIY internal helpdesk | Near-free | Very high | Pre-100-employee; tech-leaning teams |
| Discord / Slack channel + manual triage | Even more DIY | Free | Very high | <50 employees; cohesive team |

The first decision is **scale + complexity**. Pre-100 employees, you can DIY. 100-500 employees, you need a real platform but Freshservice or Jira Service Management is the right tier. 500+ employees with regulated industry / compliance demands, ServiceNow is the default.

## Decide What You Need First

ITSM platforms are not interchangeable. The same company at 50 vs 500 vs 5000 employees has very different needs.

### <100 employees / pre-IT-team (the 25% case)

Your "IT" is a part-time founder + tech-savvy ops lead. Tickets are tracked in a shared Slack channel, Linear, or a Google Form → Sheet.

**Don't buy a real ITSM yet.** Use Linear / GitHub Issues / Notion + a `#it-help` Slack channel. You'll outgrow this around 100 employees.

### 100-300 employees / first dedicated IT team (the 30% case)

You have 1-3 full-time IT people. Tickets are increasing; asset tracking is becoming necessary; security audits ask for evidence of change management.

**Pick: Freshservice ($19-99/agent/mo) or Jira Service Management ($19-48/agent/mo).** Both have generous free or low-tier options. Freshservice has stronger out-of-box ITSM features; JSM has tighter Atlassian integration if you're an Atlassian shop.

### 300-1000 employees / growing IT function (the 25% case)

Multiple IT teams emerging (helpdesk + endpoint + identity + security). You need: structured workflows, asset/configuration database (CMDB), change advisory board (CAB) processes, multi-location support, formal SLA management.

**Pick: Freshservice Pro+ or Jira Service Management Premium, or Halo ITSM.** Some companies in this band evaluate ServiceNow and decide it's overkill at this scale.

### 1000+ employees / regulated / public company (the 15% case)

You're large, compliant, and have industry-specific requirements. Sox, HIPAA, FedRAMP, financial-services audits.

**Pick: ServiceNow.** It's the de facto enterprise standard. Pricing is brutal ($100K-1M+/yr) but the breadth — ITSM + ITAM + GRC + Security Operations + HR Service Delivery + workflow automation — justifies it at scale.

### Specialized: MSP serving multiple clients

You're an MSP managing 10-100 client environments. **Pick: Atera, Connectwise, or Kaseya BMS.** ITSM features adapted to per-client tenant management.

## Provider Deep-Dives

### ServiceNow

The dominant enterprise ITSM platform. Public company; ~$10B+ revenue. 80%+ of Fortune 500 use it. Founded 2003.

Strengths:

- **Most comprehensive platform** — ITSM + ITAM + GRC + Security + HR + Customer Service + Workflow Automation
- Workflow Studio (Now Platform) is a flexible no-code/low-code builder
- AI features (Now Assist) for ticket summarization + automation
- **Industry standard** — implementing ServiceNow consultants are a known commodity
- Fortune-grade reliability + compliance certifications
- Massive ecosystem of integrations + ServiceNow-native partners

Weaknesses:

- **Brutal pricing** — $100K-1M+/yr; sales-led contracting
- Heavy implementation (3-12 months for large deployments)
- UI complexity — ServiceNow has a learning curve for both end-users and admins
- Innovation pace slower than modern entrants
- Customizations create upgrade headaches (legacy of admin-built workflows)
- Overkill for sub-1000-employee companies

Use ServiceNow when:

- Public company / pre-IPO Fortune 500-track
- Regulated industry (financial, healthcare, government)
- 1000+ employees
- Multi-domain platform (you also want HR Service Delivery, GRC, etc.)
- Budget supports $200K+/yr

Avoid when:

- <500 employees — overkill
- You want fast implementation (this isn't fast)

### Jira Service Management (Atlassian)

Atlassian's ITSM platform. Built on Jira; integrates with Confluence, Bitbucket, Statuspage. Founded 2017 (acquired Mindville for asset management).

Strengths:

- **Tight Atlassian integration** — engineering teams already on Jira; IT shares the platform
- Modern UX
- Strong incident management + on-call (post-Opsgenie acquisition)
- Atlassian Marketplace for extensions
- Pricing: $19.04-47.82/agent/mo (Standard to Premium); Free tier for small teams
- ITIL-aligned but flexible

Weaknesses:

- ITSM features less deep than dedicated platforms (Freshservice / ServiceNow) for non-Atlassian-aligned shops
- Jira's data model can feel awkward for pure ITSM use cases
- Customization complexity if you want to deviate from defaults

Use Jira Service Management when:

- You're already on Atlassian (Jira / Confluence)
- Engineering and IT teams collaborate frequently
- Pricing matters (vs ServiceNow)

Avoid when:

- Not an Atlassian shop and you don't want the platform footprint
- You need deeper out-of-box ITSM workflows than Atlassian provides

### Freshservice (Freshworks)

Modern cloud-native ITSM. Founded 2014. Strong in mid-market.

Strengths:

- **Best out-of-box ITSM workflows** for mid-market — incident, problem, change, asset, request, knowledge
- Modern UX; quick onboarding
- AI features (Freddy AI) for triage + summarization
- ITAM (asset management) included; CMDB native
- Pricing: $19-99/agent/mo + per-employee for some features
- Strong integrations ecosystem
- Multilingual + global support

Weaknesses:

- Less depth than ServiceNow at the enterprise tier
- Smaller partner / consultant ecosystem
- Some advanced workflows hit limits as you scale beyond 1000 agents

Use Freshservice when:

- Mid-market (100-2000 employees)
- You want modern UX without ServiceNow pricing
- Out-of-box ITSM is more important than maximum customization

### Zendesk Suite (with ITSM)

Zendesk's customer-support platform extended to internal IT. Pricing: $115-249/agent/mo.

Strengths:

- **Familiar if you already use Zendesk** for customer support
- Decent for internal helpdesk if you want one tool for both internal + external
- Modern UX
- Strong knowledge base

Weaknesses:

- Less ITSM-specific than dedicated platforms (Freshservice / JSM)
- Pricing high vs Freshservice for ITSM-only use case
- Asset management / CMDB weaker

Use Zendesk Suite when:

- Already a Zendesk customer
- Combined customer-support + internal-helpdesk preferred

### Halo ITSM

UK-origin modern ITSM. Founded 2012.

Strengths:

- **Strong UX** — competitive with Freshservice
- Pricing transparent
- ITAM + CMDB + ITSM bundled
- Good UK / EU presence

Weaknesses:

- Smaller US footprint
- Less brand recognition than alternatives

Use Halo when:

- UK / EU mid-market
- Want modern UX at moderate price

### SysAid

Mid-market all-in-one. Founded 2002. Lower-cost alternative.

Strengths:

- Lower price than Freshservice / JSM
- All-in-one (ITSM + ITAM)
- Solid for SMB-to-mid-market

Weaknesses:

- UX less polished
- Smaller ecosystem

Use SysAid when:

- Cost is the primary constraint
- Mid-market with pragmatic feature set

### Atera

MSP-focused IT management platform. Founded 2016.

Strengths:

- **Per-technician pricing**, not per-endpoint — affordable for MSPs managing many clients
- RMM (remote monitoring + management) bundled with helpdesk
- Modern UX
- Good for MSPs serving SMB market

Weaknesses:

- Not ideal for in-house IT teams (designed for MSPs)
- Less feature depth than ServiceNow

Use Atera when:

- MSP / IT services business
- Cost-conscious

### Spiceworks Cloud Help Desk

Free helpdesk with community support. Founded 2006.

Strengths:

- **Free** for ad-supported version
- Community of IT pros
- Decent for small in-house IT

Weaknesses:

- Limited features
- Ad-supported (some users find this annoying)
- Less polish than paid alternatives

Use Spiceworks when:

- Sub-100-employee SMB
- Cost is critical

### DIY: Linear / GitHub Issues / Notion + Slack

For pre-IT-team companies, a structured Linear board with `it` label or a `#it-help` Slack channel + manual triage works.

Strengths:

- **Zero additional vendor cost** (you already have these)
- Tech-leaning team is comfortable
- No new tool to learn

Weaknesses:

- No SLA tracking
- No CMDB / asset management
- Not auditable for security compliance
- Doesn't scale past 100 employees

Use DIY when:

- <100 employees, simple IT needs
- You'll migrate to a real ITSM tool when you grow

## ITSM Functions: What These Tools Cover

The standard ITIL framework breaks ITSM into:

### Incident Management

When something breaks. Tickets, severity, on-call routing, status updates, post-incident reviews.

### Problem Management

Root-cause analysis of recurring incidents. Linking incidents to underlying problems. Permanent fixes.

### Change Management

Approval workflows for changes (deploy, infrastructure modifications, account provisioning). Change Advisory Board (CAB), risk assessment, impact analysis, rollback plans.

### Request Fulfillment

User requests — "I need a new laptop", "I need access to system X". Self-service portal + approval workflows.

### Asset Management (ITAM)

Inventory of laptops, monitors, software licenses, contracts. Lifecycle tracking. Cost allocation.

### Configuration Management (CMDB)

Database of configuration items (CIs) and their relationships. "If we patch this server, what depends on it?"

### Knowledge Base

Documentation of resolutions, FAQs, runbooks. Self-service for users.

### SLA Management

Time-to-respond, time-to-resolve targets per ticket type. Reporting on adherence.

Modern platforms (ServiceNow, Freshservice, JSM) cover all of these. Cheaper / specialized tools focus on incident + request management with lighter coverage of others.

## What ITSM Won't Do

**Don't expect ITSM to replace IT operations expertise.** Tools surface workflows; humans do the IT work.

**Don't expect ITSM to fix culture problems.** A team that doesn't document or update tickets won't change because of a tool.

**Don't expect SOC 2 / regulatory audit to be solved by buying ITSM.** ITSM is a key piece, but you still need policies, training, evidence collection, audit prep.

**Don't expect zero-IT companies to suddenly need ITSM.** If your "IT" is just provisioning Google Workspace and laptops, modern HRIS / IT tools (Rippling, Drata) cover most of it. ITSM matters when complexity scales.

**Don't expect to skip change management forever.** As you scale, formal change management becomes mandatory for compliance + reliability. Plan for it.

## Pragmatic Stack Patterns

### Sub-100-Employee SMB

- Linear or GitHub Issues with `#it-help` label
- Slack `#it-help` channel
- Notion or Confluence for IT documentation
- Identity: Google Workspace / Okta / Rippling
- Total: $0/mo additional

### 100-300 Employees / First IT Team

- Freshservice ($19-99/agent/mo × 1-3 agents)
- Confluence for IT docs
- Identity: Okta / Rippling
- Asset management: spreadsheet or Freshservice's built-in
- Total: $100-500/mo

### 300-1000 Employees / Growing IT

- Freshservice Pro or JSM Premium ($50-100/agent/mo × 5-15 agents)
- Confluence + Sharepoint for documentation
- ITAM via tool integration
- CMDB built incrementally
- Total: $5K-15K/mo

### 1000+ / Enterprise

- ServiceNow ($200K-2M+/yr)
- ServiceNow Now Assist (AI), Workflow Automation
- Multi-domain (ITSM + ITAM + GRC + HR Service Delivery)
- Implementation partners
- Total: enterprise-tier

### MSP Serving Multiple Clients

- Atera or Connectwise
- Per-client tenant management
- RMM + helpdesk bundled
- Total: $50-200/technician/mo

## Decision Framework: Five Questions

1. **What's your scale?**
   - <100 employees: DIY
   - 100-500: Freshservice or JSM
   - 500-2000: Freshservice Pro or JSM Premium
   - 2000+: ServiceNow

2. **Are you Atlassian-aligned?**
   - Yes: Jira Service Management
   - No: Freshservice (mid-market default)

3. **Do you have ITIL / regulatory requirements?**
   - Heavy (SOX, FedRAMP, healthcare): ServiceNow
   - Moderate (SOC 2): Freshservice / JSM with ITIL workflows
   - Light: any tool

4. **MSP or in-house?**
   - MSP: Atera / Connectwise / Kaseya
   - In-house: ServiceNow / Freshservice / JSM

5. **Budget constraints?**
   - Tight: SysAid or Spiceworks
   - Mid: Freshservice / JSM
   - Open: ServiceNow

## Verdict

**Sub-100 employees**: DIY. Don't buy ITSM yet.

**100-500 employees**: Freshservice (default) or Jira Service Management (Atlassian-aligned). Cost is approachable; capability matches need.

**500-2000 employees**: Freshservice Pro or JSM Premium. Some evaluate Halo / SysAid for cost-savings.

**2000+ / enterprise / regulated**: ServiceNow. Painful to buy + implement, but the platform breadth justifies it at scale.

**MSP**: Atera or Connectwise.

The most common mistakes are:

1. **Buying ServiceNow before you need it.** A 200-employee company on ServiceNow is paying for capability they don't use; implementation timelines stretch; users hate the UI. Freshservice would have served them better at 1/10th the price.
2. **Sticking with DIY past 100 employees.** Linear + Slack works; until it doesn't. Audit + compliance + scale demands eventually break the DIY approach. Plan the migration before it's painful.
3. **Implementing without ITIL alignment.** Buying a platform without adopting the underlying process discipline (incident vs problem vs change distinctions, CAB process, SLA frameworks) means the tool is just a fancier ticket queue.

## See Also

- [Internal Tool Builders](./internal-tool-builders.md) — Retool / Tooljet / Internal-tool platforms
- [Internal Developer Platforms](./internal-developer-platforms.md)
- [Customer Support Tools](../product-and-design/customer-support-tools.md) — external customer support
- [Live Chat Widget Tools](../product-and-design/live-chat-widget-tools.md)
- [Workflow Automation & iPaaS Providers](./workflow-automation-providers.md) — Zapier / Inngest / etc
- [Compliance Automation Tools](./compliance-automation-tools.md) — Vanta / Drata / Secureframe
- [Application Security Tools](./application-security-tools.md)
- [Error Monitoring Providers](./error-monitoring-providers.md) — Sentry / Bugsnag
- [Observability Providers](./observability-providers.md) — Datadog / New Relic
- [Status Page Providers](../cloud-and-hosting/status-page-providers.md)
- [Uptime & Synthetic Monitoring Tools](./uptime-synthetic-monitoring-tools.md)
- [Project Management Tools](./project-management-tools.md)
- [Authentication](../auth-and-payments/authentication.md)
- [Auth Providers](../auth-and-payments/auth-providers.md)
- [Identity Verification & KYC Tools](../auth-and-payments/identity-verification-kyc-tools.md)
- [Secret Management Providers](./secret-management-providers.md)
- [Fraud Detection Providers](../auth-and-payments/fraud-detection-providers.md)
- [HR & Payroll Tools](../auth-and-payments/hr-payroll-tools.md)
- [Performance Management Tools](../auth-and-payments/performance-management-tools.md)
- [Recruiting / ATS Platforms](../auth-and-payments/recruiting-ats-platforms.md)
- [Workspace Knowledge Base Tools](../product-and-design/workspace-knowledge-base-tools.md) — KB platform overlap
- [Customer Support](https://vibeweek.dev/6-grow/customer-support-chat.md)
- [Account Suspension & Fraud Holds](https://vibeweek.dev/6-grow/account-suspension-fraud-holds-chat.md)
- [Incident Response (VibeWeek)](https://vibeweek.dev/6-grow/incident-response-chat.md)
