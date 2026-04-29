# Form Builders and Survey Tools: Tally, Typeform, Formspree, Google Forms, Jotform, Fillout

[⬅️ Frontend Overview](../frontend/)

If you're building a SaaS in 2026 and need to collect form / survey input from customers — waitlist signups, contact forms, feature requests, NPS surveys, customer interviews — this is the consolidated comparison. Building forms from scratch in your framework is sometimes right; using a hosted tool is often faster. Pick deliberately.

## TL;DR Decision Matrix

| Tool | Type | Strongest at | Pricing Floor | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Tally | Hosted form builder | Free, modern UX, indie favorite | Free → $29/mo | Very high | Indie SaaS marketing forms + surveys |
| Typeform | Hosted, conversational | Beautiful UX; high completion rates | Free → $25+/mo | Medium | Marketing surveys; brand-conscious teams |
| Formspree | Backend-only | Drop-in form handler for static sites | Free → $10+/mo | High | Static sites where you build the UI |
| Google Forms | Free | Free; familiar; basic | Free | Medium | Internal team forms; one-off surveys |
| Jotform | Hosted | Feature-rich; enterprise-friendly | Free → $34+/mo | Medium | Service businesses; complex form logic |
| Fillout | Hosted, modern | Modern UX; Notion + database integration | Free → $19/mo | High | Notion-stack teams |
| Microsoft Forms | Free for M365 users | Bundled with Microsoft 365 | Bundled | Medium | Microsoft-stack teams |
| SurveyMonkey | Hosted survey-specific | Mature; broad feature set | $25+/mo | Medium | Long-form surveys; mid-market |
| Forms-on-framework (next/sveltekit/etc.) | DIY | Full control, no vendor | Free | Very high | Devs who want zero vendor relationships |
| HubSpot Forms | Bundled with HubSpot | CRM-integrated | Bundled with HubSpot | Medium | HubSpot customers |
| Calendly Forms | Bundled with scheduling | Lead-capture in scheduling flow | Bundled | High | Pre-meeting questionnaires |
| Webflow Forms | Bundled with Webflow | Design-focused marketing forms | Bundled with Webflow | Medium | Webflow site users |
| Airtable Forms | Bundled with Airtable | Form → database row | Bundled with Airtable | High | Airtable-stack teams |
| Notion Forms | Bundled with Notion | Form → Notion database | Bundled with Notion (paid) | Medium | Notion-stack teams |

The first decision is **how much UX customization do you want** vs. **how fast do you want to ship**. A founder who wants a marketing-site contact form in 10 minutes picks differently than a founder building a complex onboarding survey with conditional logic.

## Decide What Kind of Form

### Marketing / lead-capture forms
Newsletter signup, contact us, demo request, waitlist. Visible on the marketing site; need to convert.

Right tools:
- **Tally** — indie favorite; embeddable; free
- **Typeform** — beautiful, high-conversion; pricier
- **Formspree** — backend only; you build the UI
- **Forms on your framework** — Next.js / SvelteKit native form

### Surveys (NPS, CSAT, feedback)
Post-purchase, periodic customer surveys, internal feedback. Per [Customer Feedback Surveys](https://www.vibeweek.ai/grow/customer-feedback-surveys-chat).

Right tools:
- **PostHog Surveys** (per [Product Analytics Providers](../devops-and-tools/product-analytics-providers.md)) — bundled if you're on PostHog
- **Tally** — free; survey templates available
- **Typeform** — high completion rates for long-form
- **SurveyMonkey** — mid-market default

### Internal team forms
Recruiting screens, vendor intake, internal requests. Behind login; lower-stakes UX.

Right tools:
- **Google Forms** (free)
- **Microsoft Forms** (bundled with M365)
- **Fillout** or **Tally** if you want better UX

### Customer-facing in-product forms
Onboarding questionnaires, support tickets, account-setup wizards. Inside your authenticated app.

Right tools:
- **Forms on your framework** — usually the right call
- Don't use external form tools for in-product flows; they break the auth model and feel disjoint

### Lead-gen with CRM integration
Forms that should auto-create contacts in your CRM (HubSpot, Salesforce, Attio, Pipedrive).

Right tools:
- **HubSpot Forms** (if HubSpot is your CRM)
- **Tally** + Zapier / native integration to your CRM
- **Webflow Forms** if site is on Webflow + CRM webhook

## Provider Deep-Dives

### Tally — The Indie Default
Tally has become the default for indie SaaS founders in 2026. Free, modern UX, generous limits.

Strengths:
- Free tier truly free (unlimited responses on free)
- Modern, Notion-like editor
- Conditional logic; calculations
- Embed widget for landing pages
- Webhooks; integrations with major CRMs
- Form analytics built in
- $29/mo Pro removes Tally branding + adds branding customization

Weaknesses:
- UX is solid but not as polished as Typeform
- Some advanced flows require Pro tier
- Smaller community than Google Forms / Typeform

Default for: most indie SaaS in 2026. The "I just need a form" answer.

### Typeform — Beautiful, Conversational
Typeform pioneered conversational, one-question-at-a-time form UX. Higher completion rates than traditional forms; pricier.

Strengths:
- Best-in-class conversion rates (especially for longer forms)
- Polished, brand-friendly UX
- Strong analytics
- Mature integrations
- Conditional logic; calculations; embedded video

Weaknesses:
- Pricing scales fast ($25/mo Basic; $50+/mo for real features)
- Branding-heavy on lower tiers
- Sometimes feels like overkill for simple forms

Pick Typeform when: brand-conscious; willing to pay; long-form surveys where completion rate matters.

### Formspree — Backend-Only
Formspree is a backend-only form handler. You write the HTML / React form in your framework; submission goes to Formspree's endpoint. Returns the data via email or webhook.

Strengths:
- Zero frontend; you build whatever UI you want
- Cheap (free for 50 submissions/mo; $10+/mo paid)
- Works with any static site / framework
- No vendor lock-in for the form UI

Weaknesses:
- You build the UI from scratch (more work; more control)
- Less feature-rich than full form builders

Pick Formspree when: building a marketing site with custom form UI; want backend without rolling your own server.

### Google Forms
Free, basic, familiar. Skip for production-grade lead capture; use for internal / one-off.

Pick Google Forms when: internal team form; one-off survey; truly free is a hard requirement.

### Jotform
Mature, feature-rich, slightly older-school UX.

Pick Jotform when: complex form logic (multi-page, calculations, payments built into forms); service business with appointment-shaped forms.

### Fillout
Modern, Notion-integrated. Strong DX for Notion-stack teams.

Pick Fillout when: Notion is your stack; you want forms that feed Notion databases natively.

### Microsoft Forms
Bundled with Microsoft 365. Functional, basic.

Pick Microsoft Forms when: already on M365; team forms only; not customer-facing.

### SurveyMonkey
Mature survey-specific tool. Mid-market default.

Pick SurveyMonkey when: long-form surveys; need their analytics depth; existing organization standard.

### Forms-on-framework (Next.js / SvelteKit / Astro)
Build the form in your framework's native pattern. Server actions in Next.js; SvelteKit form actions; etc.

Strengths:
- Full control
- No vendor relationship
- Authenticated forms (in-product) work naturally
- Can write to your existing database directly

Weaknesses:
- More engineering work
- You handle CAPTCHA / spam protection / validation / persistence
- Backend reliability is yours

Pick framework-native when: in-product forms; spam-control is critical; you want zero vendor.

### HubSpot Forms
Bundled with HubSpot CRM. CRM-integrated by default.

Pick HubSpot Forms when: HubSpot is your CRM; want CRM contact creation to be automatic.

### Calendly / Cal.com Forms
Pre-meeting questionnaires bundled with scheduling tools per [Scheduling Tools](../devops-and-tools/scheduling-tools.md).

Pick Calendly Forms when: collecting context before a scheduled meeting (sales call, customer interview, support session).

### Webflow Forms
Bundled with Webflow.

Pick Webflow Forms when: site is on Webflow; want native integration.

### Airtable / Notion Forms
Forms that feed databases in Airtable / Notion.

Pick when: that database is your source of truth for the form responses; existing tool stack alignment.

## What None of Them Solve

- **Spam protection.** Most include CAPTCHA / honeypot / rate-limiting; you configure. Without it, a marketing-site form gets flooded.
- **Form-completion analytics.** Tools provide; the discipline of reviewing them is yours. Top drop-off questions inform UX changes.
- **Field-validation strategy.** Required vs. optional; format validation; error messaging — your call. Bad validation kills conversion.
- **Mobile UX testing.** Most form builders work on mobile; testing the actual experience is on you.
- **Privacy / consent.** GDPR / CCPA compliance is your responsibility regardless of tool. Most tools integrate consent checkboxes; you write the policy.
- **Form-data security.** Where does the data live? Tool's database, your database, or both? Think about retention, access, deletion.
- **Customer-data hygiene.** Forms collect data; what you DO with it (CRM hygiene, dedup, decay) is your problem.
- **Conversion rate optimization.** Tools render forms; the discipline of testing field count, label copy, button text is yours per [A/B Testing](https://www.vibeweek.ai/grow/ab-testing-chat).

## Pragmatic Stack Patterns

**Indie SaaS, marketing site forms (contact, waitlist, demo request)**:
- Tally (free or $29/mo)
- Embed via widget on landing pages
- Webhook to your existing email / CRM

**Indie SaaS, in-product forms**:
- Forms on your framework (Next.js Server Actions / SvelteKit form actions)
- Forms on your authenticated app; data into your database

**B2B SaaS with HubSpot CRM**:
- HubSpot Forms for top-of-funnel (CRM contact creation automatic)
- Or Tally + HubSpot integration

**Brand-conscious / high-completion-needed surveys**:
- Typeform ($25-$50/mo)
- Pair with PostHog Surveys for in-product surveys

**Internal team forms**:
- Google Forms or Microsoft Forms (bundled)

**Survey-specific (NPS / CSAT)**:
- PostHog Surveys (per [Customer Feedback Surveys](https://www.vibeweek.ai/grow/customer-feedback-surveys-chat))
- Or Tally with survey templates

**Notion-deep team**:
- Fillout for forms feeding Notion databases

**Service business with complex form logic**:
- Jotform or Typeform Plus

## Decision Framework: Three Questions

1. **Where does the form live?** → In your authenticated product: framework-native. On marketing site: Tally / Typeform / Formspree.
2. **What's the budget?** → Free: Tally / Google Forms / framework-native. Paid: Typeform / Jotform.
3. **Need CRM integration?** → If on HubSpot: HubSpot Forms. Otherwise: Tally + Zapier or native integration.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **Tally for marketing forms** + **framework-native for in-product**. Don't spend more than 15 minutes deciding.

## Verdict

For most readers building a SaaS in 2026:
- **Marketing forms (default)**: Tally.
- **Brand-conscious / high-completion surveys**: Typeform.
- **In-product authenticated forms**: framework-native.
- **Internal team forms**: Google Forms.
- **Notion-stack**: Fillout.
- **Survey-specific (NPS)**: PostHog Surveys.
- **HubSpot CRM**: HubSpot Forms.

The hidden cost in form tools isn't the subscription — it's the friction of fragmented data. A form on Tally → CRM via Zapier → spreadsheet for analysis is more pain than a form on framework → database → dashboard. Consolidate where possible.

## See Also

- [Customer Feedback Surveys](https://www.vibeweek.ai/grow/customer-feedback-surveys-chat) — companion for survey strategy + cadence
- [Product Analytics Providers](../devops-and-tools/product-analytics-providers.md) — PostHog Surveys deep-dive
- [Scheduling Tools](../devops-and-tools/scheduling-tools.md) — Cal.com / Calendly forms for pre-meeting context
- [CMS Providers](cms-providers.md) — companion for marketing site content
- [Cold Outreach](https://www.launchweek.ai/distribute/cold-outreach) — forms feed cold outreach lists
- [Notification Providers](../backend-and-data/notification-providers.md) — form submissions trigger email/Slack alerts
- [HubSpot](../marketing-and-seo/hubspot.md) — bundled HubSpot Forms
- [Notion](https://www.vibereference.com/frontend/cms-providers) — Notion forms via Fillout

---

[⬅️ Frontend Overview](../frontend/)
