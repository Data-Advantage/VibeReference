# Scheduling & Booking APIs: Calendly, Cal.com, Acuity, Nylas, SavvyCal, GReminders, Microsoft Bookings

[⬅️ Backend & Data Overview](../backend-and-data/)

If you're building a SaaS that needs to coordinate appointments — sales demo bookings, customer calls, support sessions, in-product scheduling — you have two paths. Path 1: integrate a scheduling product (Calendly / Cal.com / Acuity) and use their booking page or embeddable widget. Path 2: build your own scheduler on top of a calendar API (Nylas / Google / Microsoft) for white-labeled custom flows. Most B2B SaaS adopts Path 1 around $0-1M ARR for sales calls and Path 2 around $1M+ ARR when scheduling becomes core to the product. This guide covers both paths.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Calendly | Booking page + embed | Free (1 type) | $10-20/user/mo | Medium | Default booking page |
| Cal.com | Open-source booking | Free (self-host) | $12-30/user/mo cloud | Very high | OSS / custom / dev-friendly |
| Acuity Scheduling | Booking + payments | Trial | $16-49/mo | High | Service businesses + payments |
| SavvyCal | Calendly alternative | Trial | $12-20/user/mo | Very high | Polished UX; cost-effective |
| GReminders | Booking + reminders | Trial | $9-29/user/mo | High | SMS reminders + booking |
| Microsoft Bookings | M365 native | Bundled | $0 (with M365) | Medium | M365 organizations |
| Google Appointment Schedule | Workspace native | Bundled | $0 (with Workspace) | Medium | Google Workspace orgs |
| Nylas | Calendar / scheduling API | Trial | $$$+ (volume) | Medium | Build white-label scheduler |
| Cronofy | Calendar + scheduling API | Trial | $$$ (per-account) | High | Embeddable scheduling |
| Schedule API (Cal.com) | Cal.com self-host API | Free | Free | Very high | OSS integration |
| TidyCal | Affordable booking | Free | $39 lifetime | Medium | Cost-conscious solo |
| YouCanBookMe | Booking-only focus | Trial | $9-15/user/mo | High | Lightweight |
| Acuity by Squarespace | Booking + Squarespace integration | Trial | $16-49/mo | Medium | Squarespace users |
| Setmore | Booking-focused | Free tier | $9-25/user/mo | Medium | Service businesses |
| HubSpot Meetings | CRM-integrated | Bundled with HubSpot | Bundled | Medium | HubSpot users |

The first decision is **booking page vs API**: Calendly/Cal.com/Acuity/SavvyCal are products with booking pages you embed. Nylas/Cronofy are calendar APIs you build on. The second decision is **scope**: just sales calls (Calendly default) vs scheduling as a product feature (Cal.com self-host or Nylas).

## Decide What You Need First

### External booking page for sales / demos (the 50% case)
You need a "book a demo" link customers click. The booking page is theirs (theirs branding); you just need the integration.

Right tools:
- **Calendly** — most-used; mid-market default
- **Cal.com** — OSS alternative
- **SavvyCal** — polished UX; cost-effective
- **Microsoft Bookings** / **Google Appointment Schedule** — bundled if you're on those platforms

### In-product scheduling as a feature (the 25% case)
Your customers schedule appointments INSIDE your product (e.g., a tutoring platform where students book teachers). White-labeled and customized.

Right tools:
- **Cal.com self-host** — full OSS; embed iframes or use API
- **Nylas Scheduler** — embeddable component; white-label
- **Cronofy Scheduler** — calendar-API-led
- **Custom build on calendar APIs** — Google Calendar API + iCal + custom UI

### Service business booking (the 10% case)
You run a salon, clinic, agency. Need bookings + payments + reminders + recurring appointments.

Right tools:
- **Acuity Scheduling** — service business default (Squarespace)
- **Setmore** — alternative
- **Square Appointments** — if Square POS

### Sales engagement scheduler (the 10% case)
Built into sales engagement platform; reps don't need separate Calendly.

Right tools:
- **HubSpot Meetings** (HubSpot CRM users)
- **Outreach Meetings** (Outreach users)
- **Salesloft Cadence Calendar** (Salesloft users)

### Internal team scheduling (the 5% case)
Your team books each other's time + coordinates resources.

Right tools:
- **Microsoft Bookings** for M365 orgs
- **Google Appointment Schedule** for Workspace
- **Cal.com** for OSS-aligned teams

## Provider Deep-Dives

### Calendly — the default booking page
Founded 2013. The most-used scheduling product.

Pricing in 2026: Free (1 event type); Standard $10/user/mo; Teams $16/user/mo; Enterprise custom.

Features: booking pages, embeds, round-robin team scheduling, group events, paid events (Stripe integration), polling (meet-anywhere), routing (form-based to right user), workflows (reminders, follow-up emails), Zapier + native integrations, API.

Why Calendly wins: brand recognition; broad integration ecosystem; reliable; Stripe + Zoom + Google Meet integrations turnkey.

Trade-offs: $10/user/mo at scale; limited customization on free tier; mid-market default = perceived less innovative.

Pick if: B2B sales / demo booking; default that "just works." Don't pick if: deep customization needed or cost-sensitive.

### Cal.com — open-source Calendly alternative
Founded 2021. Open-source booking platform.

Pricing in 2026: Free (self-host); Cloud free for 1 user; Team $12/user/mo; Organization $30/user/mo; Enterprise custom.

Features: same as Calendly (booking, embed, round-robin, workflows, integrations) + dev-friendly API + atomic OSS components + AI scheduling (Cal AI agent).

Why Cal.com: OSS (self-host for free); modern UX; dev-friendly; ATOM (embed components for custom flows); AI-driven scheduling.

Trade-offs: smaller ecosystem; less brand recognition; self-hosting requires devops.

Pick if: dev-friendly culture; want OSS; cost-conscious mid-market. Don't pick if: need biggest brand.

### SavvyCal — premium Calendly alternative
Founded 2020. Polished UX competitor.

Pricing in 2026: Basic $12/user/mo; Premium $20/user/mo; Custom enterprise.

Features: similar to Calendly + overlay scheduling (compare your calendar vs invitee's); polls; smart scheduling.

Why SavvyCal: best UX in category; cost-competitive; strong indie vibes.

Pick if: want premium UX; cost-conscious; alternative to Calendly. Don't pick if: enterprise procurement requires Calendly brand.

### Acuity Scheduling — service business
Founded 2006; acquired by Squarespace 2019.

Pricing in 2026: Emerging $16/mo; Growing $27/mo; Powerhouse $49/mo.

Features: bookings, payments (Stripe / Square / PayPal), recurring appointments, intake forms, automated reminders, group classes, packages.

Why Acuity: built for service businesses; strong payments + intake forms; HIPAA-compliant tier.

Pick if: salon, clinic, agency, tutor. Don't pick if: B2B sales (Calendly fits better).

### Microsoft Bookings — M365 native
Free with Microsoft 365 Business Standard+.

Features: bookings, staff management, customer database, automated reminders, Teams integration.

Why MS Bookings: free with M365; native integration with Outlook/Teams/Office.

Pick if: M365 organization; want free + native. Don't pick if: not on M365.

### Google Appointment Schedule — Workspace native
Free with Google Workspace.

Features: appointment slots, payments (limited), Calendar integration, Meet integration.

Why Google: free with Workspace; simple; integrates with rest of Google.

Pick if: Workspace user; light scheduling needs. Don't pick if: need depth (Calendly stronger).

### Nylas — calendar API for white-label scheduling
Founded 2013. Calendar / email / contact API platform.

Pricing in 2026: $$$+ (per-connected-account; ~$2-10/account/mo at scale).

Features: calendar API (read/write events), Scheduler embeddable component (white-label), email + contacts API, free/busy lookup, virtual calendar, smart compose.

Why Nylas: only mature unified calendar API; Google + Microsoft + Exchange + iCloud all unified.

Trade-offs: pricing complex; enterprise-procurement-led; overkill for simple booking.

Pick if: white-label scheduling inside your product; multi-calendar users. Don't pick if: just need a Calendly link.

### Cronofy — calendar + scheduling API
Founded 2014. Calendar API + scheduling.

Pricing in 2026: per-connected-account; typically $1-5/account/mo.

Features: calendar API, real-time availability, Scheduler component, Smart Invite, attendee scheduling.

Why Cronofy: privacy-focused (no calendar copy); enterprise-friendly; UK-based.

Pick if: enterprise / privacy-led; want embeddable scheduler. Don't pick if: simple booking needs.

### TidyCal / YouCanBookMe / Setmore — affordable
Lightweight booking products.

Pricing: $9-39/mo or one-time.

Pick if: cost-sensitive solo / SMB. Don't pick if: enterprise scale.

### HubSpot Meetings / Outreach Meetings / Salesloft — CRM-integrated
Bundled with sales engagement / CRM.

Pick if: already on parent platform.

## What Booking Tools Won't Do

Buying a scheduling tool doesn't:

1. **Replace calendar discipline.** Tool surfaces availability; you still control how much time you offer.
2. **Solve no-shows.** Reminders help; bad-fit prospects still ghost. Add SMS reminders + qualify before booking.
3. **Replace calendar conflicts at edge cases.** Multi-timezone + DST + recurring appointments = bugs in many tools. Test before launching.
4. **Make your team great at sales.** Calendly books the meeting; the meeting still has to be good.
5. **Handle enterprise scheduling complexity.** Resource booking (rooms / equipment) + capacity planning needs heavier tools.

The honest framing: scheduling tools are infrastructure. Distance between booking page and demo close depends on sales execution.

## Build vs Buy

```text
Decide build vs buy for scheduling.

Buy (Calendly / Cal.com / SavvyCal):
- Pros: shipped today; broad calendar support; integrations
- Cons: hosted on their domain (or embed iframe with limits); generic UX; per-user pricing
- Best for: 90% of B2B SaaS; sales / demo booking

Embed component (Cal.com Atom / Nylas Scheduler / Cronofy):
- Pros: white-labeled; embedded in your UI; faster than custom
- Cons: per-account pricing; some UX rigidity
- Best for: scheduling as feature (white-label needed)

Custom build (Google Calendar API / Microsoft Graph / iCal):
- Pros: full control; differentiated UX; no per-user cost
- Cons: 6-12 weeks to build; ongoing maintenance (calendar API quirks); recurring events / DST / timezones nightmares
- Best for: scheduling is core competitive feature (e.g., Calendly itself)

Decision tree:
- Sales-team booking? → Buy Calendly / Cal.com Cloud
- "Book a demo" link only? → Buy Calendly free tier
- White-labeled scheduling in product? → Embed Cal.com Atom / Nylas Scheduler
- Scheduling IS the product? → Custom build on calendar APIs

Output:
1. Recommendation for [USE CASE]
2. Time-to-ship estimate
3. Total cost over 1 year
4. Maintenance burden estimate
5. Migration path if you outgrow current choice
```

The buy-then-build pattern: most SaaS teams start with Calendly link, then swap to Cal.com Atom embed when scheduling becomes core feature. Avoid premature custom builds.

## Pragmatic Stack Patterns

### Pattern 1: Solo founder demo bookings ($0/mo)
- **Cal.com Cloud free** OR **Calendly free**
- 1 event type
- Embed link in email signature
- Total: $0/mo

### Pattern 2: Sales team demo bookings ($10-20/user/mo)
- **Calendly Standard** ($10/user/mo) for 5-10 reps
- Round-robin routing
- Salesforce integration

### Pattern 3: Cost-conscious mid-market ($12/user/mo)
- **Cal.com Team** ($12/user/mo) for 5-50 users
- Self-host option for compliance

### Pattern 4: Service business with payments ($27/mo)
- **Acuity Scheduling Growing** ($27/mo)
- Stripe payments + intake forms + reminders

### Pattern 5: White-label in-product scheduling
- **Cal.com Atom** (OSS embed components) — free for self-host
- OR **Nylas Scheduler** for unified calendar support
- OR **Cronofy** for privacy-focused

### Pattern 6: Custom build (scheduling = product)
- Google Calendar API + Microsoft Graph + iCal + custom UI
- Plan 6-12 weeks engineering
- Account for recurring events, DST, timezone bugs

### Pattern 7: M365 / Workspace native
- **Microsoft Bookings** (free with M365)
- **Google Appointment Schedule** (free with Workspace)

## Decision Framework: Three Questions

1. **Booking page or in-product scheduling?**
   - Booking page (sales demos) → Calendly / Cal.com / SavvyCal
   - In-product white-label → Cal.com Atom / Nylas Scheduler / Cronofy

2. **What's your scale + budget?**
   - Solo / cost-sensitive → Cal.com Cloud free / Microsoft Bookings / Google
   - Sales team → Calendly / Cal.com / SavvyCal
   - Enterprise → Calendly Enterprise / Nylas / Cronofy

3. **Specialty needs?**
   - Service business + payments → Acuity
   - Privacy-focused → Cronofy
   - OSS / dev-friendly → Cal.com self-host
   - White-label embed → Cal.com Atom / Nylas / Cronofy

## Common Integrations to Verify

For any scheduling tool you pick:

- [ ] CRM (Salesforce / HubSpot / Pipedrive)
- [ ] Conferencing (Zoom / Google Meet / Microsoft Teams)
- [ ] Calendar (Google / Microsoft / iCloud / Exchange / CalDAV)
- [ ] Payment (Stripe / Square / PayPal — if paid bookings)
- [ ] Email automation (Mailchimp / HubSpot / etc.)
- [ ] Webhook / API for custom workflows
- [ ] SMS reminders (often add-on or via integration)
- [ ] Embed code / iframe for marketing pages

Verify these before committing — the integration depth matters more than feature breadth.

## Verdict

For 50% of B2B SaaS in 2026: **Calendly**. Default for sales / demo booking; broadest integrations.

For 25%: **Cal.com**. OSS alternative; dev-friendly; cost-effective; modern UX.

For 10%: **SavvyCal**. Premium UX alternative.

For 5%: **Acuity**. Service businesses with payments.

For 5%: **Cal.com Atom / Nylas / Cronofy**. White-label scheduling in-product.

For 5%: **Microsoft Bookings / Google Appointment Schedule**. Bundled with platform.

The mistake to avoid: **forcing a sales-booking tool into product scheduling**. Calendly is great for sales demos; not great as a feature inside your product. Use the right path.

The second mistake: **custom-building scheduling early**. Recurring events, DST, multi-calendar, timezone math are deep rabbit holes. Don't take them on unless scheduling is core.

The third mistake: **ignoring no-show rates**. Add SMS reminders (most tools support); qualifying questions in booking form; calendar invite confirmations. No-show rate >25% means your booking flow is leaking.

## See Also

- [Email Providers](./email-providers.md) — booking confirmation emails
- [SMS & Voice APIs](./sms-voice-apis.md) — SMS reminders for bookings
- [Notification Providers](./notification-providers.md) — multi-channel reminders
- [Video Voice Conferencing APIs](./video-voice-conferencing-apis.md) — meeting URL embedded in booking
- [Webhook Delivery Services](./webhook-delivery-services.md) — booking webhooks downstream
- [API Integration](./api-integration.md) — calendar API patterns
- [CRM Providers](../marketing-and-seo/crm-providers.md) — booking → CRM
- [Sales Engagement Platforms](../marketing-and-seo/sales-engagement-platforms.md) — embedded scheduling alternative
- [VibeWeek: Onboarding Calls](https://vibeweek.dev/6-grow/onboarding-calls-chat) — uses scheduling tools
- [VibeWeek: Customer Support](https://vibeweek.dev/6-grow/customer-support-chat) — support scheduling
- [LaunchWeek: Sales Demo Calls](https://launchweek.dev/4-convert/sales-demo-calls) — demo booking flow
- [LaunchWeek: Customer Discovery Interviews](https://launchweek.dev/1-position/customer-discovery-interviews) — interview scheduling
- [LaunchWeek: Customer Advisory Board](https://launchweek.dev/4-convert/customer-advisory-board) — CAB scheduling
