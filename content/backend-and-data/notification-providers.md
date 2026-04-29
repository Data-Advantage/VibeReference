# Notification Providers: Knock, Courier, Twilio, OneSignal, Novu, Resend, Plivo, MessageBird

[⬅️ Backend & Data Overview](../backend-and-data/)

If you're building a SaaS in 2026 and you need to send notifications to your users — email, SMS, push, in-app, Slack/Teams — this is the consolidated comparison. The notification problem is bigger than founders expect: it's not just "send email"; it's preference management, multi-channel orchestration, digesting, throttling, and template versioning. Pick wrong and you spend a quarter rebuilding what a notification platform handles in an afternoon.

## TL;DR Decision Matrix

| Provider | Type | Strongest at | Pricing Floor | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Knock | Notification orchestration | Multi-channel routing + preferences + workflows | $99/mo (after free tier) | High | Mid-market SaaS doing serious notification work |
| Courier | Notification orchestration | Same shape, slightly different UX | $0 → $99/mo+ | High | Same as Knock; pick by API/UX preference |
| Novu | Open-source notification orchestration | OSS-first; self-host or cloud | Free / OSS, $30+/mo Cloud | Very high | OSS-leaning teams |
| Twilio | Messaging APIs (SMS/voice/WhatsApp) | Most channels, mature ecosystem | Pay-as-you-go | Medium | SMS-heavy or voice-heavy products |
| Plivo / MessageBird / Vonage | SMS / voice alternatives | Cheaper than Twilio in many regions | Pay-as-you-go | Medium | Cost-sensitive SMS workloads |
| OneSignal | Push notifications | Push to mobile + web; broad ecosystem | Free → $99+/mo | High | B2C apps with push as primary |
| Pushover | Mobile push (developer-focused) | Cheap, simple, dev-friendly | $5 one-time per user | Very high | Internal tools, dev notifications |
| Pusher | Real-time / pub-sub | WebSocket infrastructure for in-app | Free → $49/mo+ | Medium | Real-time in-app + presence |
| Ably | Real-time messaging | More features than Pusher; pricier | Free → $49/mo+ | Medium | Real-time products with serious scale |
| Resend | Email (transactional + lifecycle) | Modern email API | Free → $20/mo+ | Very high | Email-as-primary-channel apps |
| Postmark | Transactional email | Best deliverability for transactional | Free → $15/mo | Very high | Transactional-heavy email |
| SendGrid / Mailgun | Email at scale | Mature email infrastructure | Free → $20+/mo | Medium | High-volume email, broader ecosystem |
| Slack / Discord webhooks | Channel-specific webhooks | Free, simple | Free | Very high | Internal team alerts |
| Loops | Lifecycle + transactional email | Modern email + automation | Free → $49/mo+ | Very high | B2B SaaS lifecycle email |
| Customer.io | Lifecycle marketing email | Behavior-triggered campaigns | $100/mo+ | Medium | Mid-market with marketing automation |

The first decision is **what channels you actually need**. Email-only is one problem; multi-channel (email + SMS + push + in-app + Slack-Connect) is a different problem entirely. Pick based on actual user-facing needs, not aspirational ones.

## Categorize by Channel Mix

### Email-only (most indie SaaS)
You send transactional email (signup confirmations, password resets) and lifecycle email (onboarding, weekly digests). That's it.

Right tools:
- **Resend** — modern API, indie default in 2026
- **Postmark** — best deliverability for transactional
- **Loops** — bundles transactional + lifecycle in one
- **AWS SES** — cheapest at scale, more setup work

For most indie SaaS in 2026: Resend or Loops. Skip the dedicated notification orchestration platforms; they're overkill for email-only.

Per [Email Providers](email-providers.md) for the full email-provider comparison.

### Multi-channel (B2B SaaS scaling toward enterprise)
Customer-facing notifications across email + in-app + Slack + occasionally SMS. Each user has preferences for what they want to receive on which channel.

Right tools:
- **Knock** — purpose-built for this exact shape
- **Courier** — same shape, alternative
- **Novu** — OSS option

Pick when: 5+ notification types, 3+ channels, and per-user preference management is core. Don't pick if you only have 2-3 notification types.

### SMS / voice-heavy (B2C, transactional industries)
SMS is your primary channel — order confirmations, two-factor auth, appointment reminders.

Right tools:
- **Twilio** — most features, broadest carrier coverage
- **Plivo / MessageBird / Vonage** — cheaper for high volume in specific regions
- **Knock + Twilio backend** — orchestration on top of Twilio for multi-channel

### Push notifications (mobile apps)
Native iOS/Android push as primary channel.

Right tools:
- **OneSignal** — broadest, free tier real
- **Firebase Cloud Messaging (FCM)** — free, Google-native
- **Apple Push Notification (APNs)** — direct from Apple
- **Pusher Beams** — for sophisticated push patterns

### Real-time / WebSocket (in-app live updates)
Notifications appear instantly in the running app session — chat, live dashboards, presence indicators.

Right tools:
- **Pusher** — straightforward
- **Ably** — more features
- **Supabase Realtime** — bundled with Supabase
- **Convex** — bundled (reactive queries)

### Internal / team alerts
Engineering alerts, marketing notifications, internal-team events.

Right tools:
- **Slack webhooks** — free, simple
- **Discord webhooks** — same
- **PagerDuty / Opsgenie** for serious on-call
- **Pushover** for personal-device notifications

## Provider Deep-Dives

### Knock — Notification Orchestration for Modern SaaS
Knock is the indie B2B SaaS favorite for notification orchestration in 2026. You define notification workflows; Knock handles routing, preferences, batching, throttling, retries.

Strengths:
- Multi-channel out of the box (email + SMS + push + in-app + Slack + Teams + Webhooks)
- Per-user preference center (built-in UI; you embed it)
- Workflow editor with branching, delays, retries
- Strong API + SDKs in major languages
- Email backed by your existing email provider (Resend / Postmark / SendGrid / SES)
- SMS via Twilio
- Free tier real (1,000 notifications/mo); $99/mo Standard

Weaknesses:
- $99/mo is real money for indie scale
- Adds a vendor relationship even if you only use email
- Workflow editor has a learning curve

Pick Knock when: 5+ notification types across 3+ channels, per-user preferences matter, willing to pay for orchestration.

### Courier
Same shape as Knock. Different API and editor UX. Pricing tiers similar.

Pick Courier when: tested Knock and prefer the Courier API/UX. Reasonable alternative.

### Novu
Open-source notification orchestration. Self-host or cloud. Younger than Knock/Courier but growing fast.

Strengths:
- OSS-first (Apache 2.0)
- Self-hostable end-to-end
- Cloud option starting at lower price
- Multi-channel
- Active community

Weaknesses:
- Younger; smaller community than Knock
- Self-hosting is real ops work

Pick Novu when: OSS-first preference, OK with newer tooling, want self-host as an option.

### Twilio
The SMS / voice / WhatsApp incumbent. Most mature, broadest features.

Strengths:
- Best-in-class SMS deliverability
- WhatsApp Business API
- Voice + video APIs
- Mature ecosystem of integrations
- SDKs in every language

Weaknesses:
- Pricing scales fast at high volume
- Pay-as-you-go means surprise bills if you have a bug
- US/EU pricing is mid; some regions are expensive
- Some compliance requirements (10DLC registration in US) take weeks

Pick Twilio when: SMS or voice is core to your product. Default unless cost is dominant concern.

### Plivo / MessageBird / Vonage
SMS/voice alternatives to Twilio. Cheaper in many regions; less polished.

Pick when: high SMS volume, cost-sensitive, have specific regional advantages.

### OneSignal
Push notifications + email + SMS + in-app. Strong mobile push focus.

Strengths:
- Best-in-class mobile push
- Generous free tier (10K subscribers, unlimited push)
- Web push + mobile push + email + SMS
- Decent dashboard for non-technical users
- Strong segmentation

Weaknesses:
- Pricing scales with subscribers (can be expensive at scale)
- Less developer-focused than Knock / Courier for orchestration
- Marketing-team-friendly UI can feel heavy for engineering teams

Pick OneSignal when: mobile app with push as primary channel, B2C or prosumer audience.

### Pushover
Single-purpose mobile push for developers. $5 one-time per user.

Strengths:
- Cheap (one-time per user)
- Simple API
- Reliable
- Great for internal / developer use cases

Weaknesses:
- iOS/Android app users only (no web push)
- Not for end-user notifications in your product (it's for YOU and your team)

Pick Pushover when: internal alerts to phones, dev-tool notifications, personal projects.

### Pusher
Real-time pub/sub via WebSockets.

Strengths:
- Mature, reliable
- Channels API is simple
- Works with most frameworks
- Pusher Beams for sophisticated push

Weaknesses:
- Pricing scales with concurrent connections
- Newer alternatives (Ably, Supabase Realtime) match or exceed features

Pick Pusher when: real-time pub/sub, indie scale, want a battle-tested service.

### Ably
Real-time messaging with more features than Pusher.

Pick when: real-time at serious scale, need history / persistence / advanced features.

### Resend
Modern email API; indie default in 2026. Per [Email Providers](email-providers.md).

Pick for: email-only stack, modern DX preferred.

### Postmark
Best deliverability for transactional email. Per [Email Providers](email-providers.md).

Pick for: transactional-heavy, deliverability-critical.

### Loops
Modern email-as-a-platform; transactional + lifecycle bundled.

Pick when: B2B SaaS, want bundled transactional + lifecycle without orchestration overhead.

### Customer.io
Mid-market lifecycle email + automation.

Pick when: scaled B2B SaaS, marketing-automation team, $100K+ MRR.

### Slack / Discord Webhooks
Free, simple, fits a specific use case (internal team alerts).

Pick when: notifying YOUR team, not your customers.

## What None of Them Solve

- **Notification fatigue.** Tools send notifications; the *strategy* of when not to send is yours. Aggregate. Digest. Throttle. Customers who get 47 notifications per day unsubscribe from all.
- **Preference UI design.** Most tools provide preference centers; tuning them for your audience and notification types is up to you. Generic preference pages have <5% engagement; well-designed ones have 30%+.
- **Cross-channel deduplication.** A user who saw a notification in-app shouldn't get the same one via email 5 minutes later. Some tools handle this; many don't.
- **Critical vs informational classification.** Security alerts must always send (regardless of preferences). Marketing emails must respect unsubscribes. Mixing these in one preference scheme is a compliance trap.
- **Locale-specific formatting.** Times, dates, names — varies per locale per [Internationalization](https://www.vibeweek.ai/grow/internationalization-chat).
- **Quiet hours.** Sending an SMS at 3am is hostile. Most platforms support quiet-hours rules; you have to configure them.
- **Compliance per channel.** SMS has 10DLC + carrier rules in the US, GDPR consent for EU email, do-not-call lists, etc. Not the platform's responsibility.

## Pragmatic Stack Patterns

**Indie SaaS, email-only, simple needs**:
- [Resend](resend.md) for transactional + lifecycle
- Or Loops if you want bundled
- Total: $0-$20/mo

**Indie SaaS, multi-channel needs (email + in-app + Slack)**:
- Knock or Novu for orchestration ($0-$99/mo)
- Resend / Postmark for the underlying email transport
- Slack webhooks for internal alerts
- Total: $20-$120/mo

**B2C app with push as primary**:
- OneSignal (free → $99/mo)
- Resend for email
- Total: $0-$120/mo

**SMS-heavy product**:
- Twilio for SMS + voice
- Resend for email
- Knock for orchestration if multi-channel logic gets complex
- Total: pay-as-you-go (variable)

**Real-time-heavy (chat, collab, presence)**:
- Pusher / Ably / Supabase Realtime for real-time
- Plus standard email/notification stack for fallback async

**B2B SaaS at $50K+ MRR scaling notification complexity**:
- Knock for orchestration
- Resend / Postmark for email
- Twilio for SMS
- Slack + Teams native for B2B integrations
- Total: $200-$1000/mo

## Decision Framework: Three Questions

1. **What channels do you actually need?** → Email-only: Resend or Loops. Multi-channel: Knock / Courier / Novu. SMS-primary: Twilio.
2. **Do you need per-user preference management?** → Yes: notification orchestration platform. No: direct channel APIs.
3. **What's the volume + complexity?** → Low + simple: direct channel APIs. High or complex: orchestration platform.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **Resend** for email-only, **Knock or Novu** when you need multi-channel orchestration. Don't add Twilio / OneSignal / Pusher unless you have specific channel needs.

## Verdict

For most readers building a SaaS in 2026:
- **Email-only**: Resend. Default.
- **Multi-channel orchestration**: Knock (cloud) or Novu (OSS).
- **SMS-heavy**: Twilio + orchestration on top.
- **Mobile push primary**: OneSignal.
- **Real-time in-app**: Supabase Realtime (if on Supabase) or Pusher / Ably.
- **Internal team alerts**: Slack webhooks (free).

The hidden cost in notifications is **strategy, not infrastructure**. A notification system that sends too much, at the wrong times, in the wrong format, regardless of platform, drives unsubscribes and churn. Spend the design time on what to send, when, why; the infrastructure is the smaller decision.

## See Also

- [Email Providers](email-providers.md) — companion comparison for the email-specific layer
- [Email Deliverability](https://www.vibeweek.ai/grow/email-deliverability-chat) — companion for email infrastructure
- [Resend](resend.md) — deep-dive on the modern email default
- [Convex](convex.md) — bundled real-time if you're on Convex
- [Supabase](supabase.md) — bundled real-time if you're on Supabase
- [Public API](https://www.vibeweek.ai/grow/public-api-chat) — webhook deliveries to customers are part of notification infrastructure
- [Status Page](https://www.vibeweek.ai/grow/status-page-chat) — incident notifications are a special case
- [Onboarding Email Sequence](https://www.vibeweek.ai/grow/onboarding-email-sequence-chat) — lifecycle emails depend on this
- [Customer Feedback Surveys](https://www.vibeweek.ai/grow/customer-feedback-surveys-chat) — survey delivery uses this stack

---

[⬅️ Backend & Data Overview](../backend-and-data/)
