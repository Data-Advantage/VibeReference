# SMS & Voice APIs: Twilio, Plivo, Vonage, MessageBird, Sinch, Telnyx, Bandwidth

[⬅️ Backend & Data Overview](../backend-and-data/)

If your B2B SaaS in 2026 needs to send SMS (verification codes, alerts, reminders) or make/receive phone calls (IVR, click-to-call, contact center), you need a CPaaS (Communications Platform as a Service). The naive approach: integrate carrier APIs directly. The structured approach: pick a CPaaS — Twilio / Plivo / Vonage / MessageBird / Sinch — and use their unified API. The right pick depends on geography (US-only vs international), volume (10K vs 10M messages/mo), regulatory complexity (10DLC, RCS, WhatsApp), and whether you need voice + SMS or just SMS.

## TL;DR Decision Matrix

| Provider | Type | SMS Pricing (US) | Indie Vibe | Best For |
|---|---|---|---|---|
| Twilio | Full CPaaS | $0.0079/SMS + carrier fees | High | Default; broadest features |
| Plivo | SMS + Voice CPaaS | $0.0055/SMS | Very high | Cost-conscious; Twilio alternative |
| Vonage | Full CPaaS (legacy Nexmo) | $0.0067/SMS | Medium | Established mid-market |
| MessageBird (Bird) | Full CPaaS | $0.0072/SMS | Medium | International default |
| Sinch | Enterprise CPaaS | Varies (volume-based) | Low | Enterprise / carrier-grade |
| Telnyx | Carrier-grade CPaaS | $0.004/SMS + voice | High | Voice-heavy / cost-sensitive |
| Bandwidth | US-focused CPaaS | $0.004-0.0079/SMS | Medium | US-only voice + SMS |
| Bird (was MessageBird) | Modern CPaaS | $0.0072/SMS | High | International + workflows |
| Infobip | Enterprise / CPaaS | Custom | Low | Enterprise + omnichannel |
| AWS End User Messaging (Pinpoint) | AWS-bundled SMS | $0.00645/SMS | Medium | AWS-native; SMS-only |
| Vonage API | Full CPaaS | $0.0067/SMS | Medium | Identity / verify-led |
| ClickSend | SMS-focused | Varies | High | SMB SMS; multi-channel |
| Telesign | Identity + SMS | Custom | Medium | Phone-verify focus |
| Sinch Verification | OTP / verify | Custom | Medium | OTP-only; conversion-optimized |
| Vonage Verify | OTP API | Per-verify pricing | Medium | OTP API alternative |

The first decision is **scope**: just SMS (verification, alerts) → cheaper SMS-focused tools work; full omnichannel (SMS + WhatsApp + voice + email + RCS) → Twilio/Bird/Sinch. The second decision is **geography**: US-only → Bandwidth/Telnyx are cheaper; international → Bird/Twilio/Sinch.

## Decide What You Need First

### SMS-only — verification + alerts (the 50% case)
You need OTP codes for 2FA, transactional alerts (order shipped), basic reminders. <100K messages/month.

Right tools:
- **Twilio** — broadest reach; ~$0.008/SMS US
- **Plivo** — cost alternative; ~$0.0055/SMS US
- **Telnyx** — cheapest tier; ~$0.004/SMS US
- **AWS End User Messaging** — if AWS-native

For OTP-only:
- **Twilio Verify** — handles A2P, fallback, voice fallback
- **Sinch Verify** — competitor; conversion-optimized
- **Telesign** — identity-led OTP

### SMS + Voice CPaaS (the 30% case)
You need both SMS and voice (call routing, IVR, click-to-call, conference calls).

Right tools:
- **Twilio** — full CPaaS leader
- **Vonage (Nexmo)** — established alternative
- **Plivo** — cost-effective
- **Telnyx** — carrier-grade voice + SMS

### International + omnichannel (the 15% case)
You need WhatsApp, RCS, SMS, voice across 50+ countries.

Right tools:
- **Bird (MessageBird)** — international focus + workflow builder
- **Twilio** — broad WhatsApp + SMS reach
- **Infobip** — enterprise omnichannel
- **Sinch** — carrier-grade global

### Enterprise / volume (the 5% case)
You're sending 10M+ messages/month, need MSA, dedicated support, SLAs.

Right tools:
- **Sinch** — carrier-grade enterprise
- **Infobip** — enterprise omnichannel
- **Twilio Enterprise** — leading enterprise CPaaS
- **Bandwidth** — US-focused enterprise voice

## Provider Deep-Dives

### Twilio — the CPaaS default
Founded 2008. The market leader; broadest feature set.

Pricing in 2026:
- SMS US: $0.0079/SMS + $0.005-0.01 carrier fees + 10DLC fees
- Voice US: $0.0085/min outbound, $0.0085/min inbound
- Phone numbers: $1-15/mo (local), $2-30/mo (toll-free)
- WhatsApp: ~$0.005-0.05/conversation depending on category
- Verify: $0.05-0.15/verification depending on channel

Features: SMS, MMS, voice (PSTN), WhatsApp, RCS, email (SendGrid), video (Programmable Video — being sunset), Verify (OTP), Lookup (number intel), Studio (visual workflow builder), Functions (serverless), Flex (contact center), Segment (CDP).

Why Twilio wins: broadest feature set; best docs; largest community; widest carrier coverage; mature compliance (10DLC, TCR, etc.).

Trade-offs: most expensive in category; carrier fee complexity; Programmable Video being sunset (use elsewhere); enterprise pricing complexity.

Pick if: default; need broadest features. Don't pick if: cost-sensitive (Plivo/Telnyx ~30% cheaper).

### Plivo — Twilio alternative
Founded 2011. Direct Twilio alternative at lower price.

Pricing in 2026:
- SMS US: $0.0055/SMS + carrier fees
- Voice US: $0.0085/min
- Phone numbers: $0.80-15/mo
- Verify: $0.05-0.10/verification

Features: SMS, MMS, voice, WhatsApp (limited), Verify, Premium Wireless (Plivo's eSIM/IoT product).

Why Plivo: ~30% cheaper than Twilio for SMS; clean API; modern docs.

Trade-offs: smaller ecosystem; fewer integrations; less brand recognition for procurement.

Pick if: cost-conscious B2B SaaS; standard SMS + voice. Don't pick if: need WhatsApp at scale or omnichannel.

### Vonage (formerly Nexmo) — established CPaaS
Founded 2010 (Nexmo); acquired by Vonage 2016.

Pricing in 2026:
- SMS US: $0.0067/SMS + carrier
- Voice US: $0.0085/min
- Verify API: per-verify pricing

Features: SMS, voice, video (Vonage Video API — formerly TokBox), WhatsApp, Verify, In-App messaging, Number insight.

Why Vonage: strong video API (TokBox); identity / verify products well-built; enterprise reach.

Pick if: need video + SMS combined; Verify API. Don't pick if: cost-priority (Plivo/Telnyx cheaper).

### Bird (MessageBird) — international + workflow
Rebranded to Bird in 2023. International CPaaS leader.

Pricing in 2026:
- SMS US: $0.0072/SMS + carrier
- WhatsApp: per-conversation
- Voice: ~$0.01/min

Features: SMS, MMS, WhatsApp, RCS, voice, email (Bird Email), workflow builder (Flow), CDP (acquired by Bird), Inbox (omnichannel inbox), AI (omnichannel AI).

Why Bird: international focus; workflow builder; omnichannel-first; modern UX.

Pick if: international heavy; omnichannel needs (SMS + WhatsApp + email). Don't pick if: US-only (Twilio/Plivo cheaper).

### Sinch — enterprise carrier-grade
Founded 2008 (Stockholm). Public company; major enterprise player.

Pricing in 2026: custom; volume-based; typically MSA contracts.

Features: SMS, voice, WhatsApp, RCS, email (acquired Mailgun), video (Sinch Conversation API), Verify (OTP), CPaaS APIs.

Why Sinch: carrier-grade; enterprise SLAs; broad ownership of CPaaS stack (carriers + SaaS).

Pick if: enterprise scale (10M+ msg/mo); MSA + SLA needed. Don't pick if: small volume (no self-serve).

### Telnyx — carrier-grade modern alternative
Founded 2009. Has its own carrier infrastructure.

Pricing in 2026:
- SMS US: $0.004/SMS (cheapest in tier)
- Voice US: $0.005-0.01/min
- Phone numbers: $1/mo

Features: SMS, voice, programmable wireless, embedded SIP, AI Assistants (voice agents), Mission Control Portal.

Why Telnyx: own carrier network → lowest pricing in tier; modern API; voice-heavy strength; AI Assistants (voice agents) growing.

Trade-offs: smaller community; less ecosystem.

Pick if: voice-heavy use case; cost-sensitive; modern API. Don't pick if: enterprise procurement requires Twilio brand.

### Bandwidth — US-focused
Founded 1999. US carrier-grade.

Pricing in 2026: $0.004-0.0079/SMS US; voice ~$0.005-0.01/min.

Features: SMS, voice, 911 (E911), phone numbers, MMS.

Why Bandwidth: US carrier infrastructure; strong voice + 911 capabilities.

Pick if: US-only; voice + E911 needs. Don't pick if: international.

### AWS End User Messaging / Pinpoint
AWS's SMS service (re-branded from Pinpoint SMS).

Pricing in 2026: $0.00645/SMS US; per-region pricing.

Features: SMS only (limited voice); analytics; event-driven (SNS).

Why AWS: bundled with AWS; cheap; works with AWS analytics.

Pick if: AWS-native architecture; SMS-only. Don't pick if: voice needed or non-AWS stack.

### Infobip
Enterprise CPaaS. Croatian company.

Pricing in 2026: custom enterprise pricing.

Features: omnichannel (SMS, WhatsApp, RCS, voice, email, chatbot), People CDP, Conversations (omnichannel inbox).

Pick if: enterprise omnichannel + carrier reach in non-US markets.

### Verify-Specific Tools
Some founders only need OTP/verify and want a focused product:
- **Twilio Verify** — leader; handles fallback (SMS → voice → email)
- **Sinch Verification** — competitor; conversion-optimized
- **Telesign** — identity-focused
- **Vonage Verify** — alternative

Pricing: $0.05-0.15/verification depending on channel + country.

Pick if: OTP-only and want a higher-level abstraction. Don't pick if: full SMS/voice CPaaS needed (use Twilio etc directly).

## What CPaaS APIs Won't Do

Buying a CPaaS doesn't:

1. **Solve regulatory compliance for you.** US 10DLC (Application-to-Person SMS) requires brand + campaign registration via TCR. CPaaS guides you; you still file. EU GDPR, India DLT, Brazil ANATEL — local rules apply.
2. **Eliminate carrier filtering.** Carriers block spam regardless of CPaaS. Bad sender reputation → low deliverability.
3. **Fix bad messaging strategy.** SMS marketing fatigue is real; opt-out compliance + frequency capping required.
4. **Replace TCPA / CASL legal compliance.** US TCPA = $500-1500/violation per consent failure. CPaaS provides tools; you still need legal review.
5. **Make voice work without phone numbers.** Buy + register numbers (toll-free or 10DLC) before sending.

The honest framing: CPaaS is plumbing. Compliance, deliverability strategy, message design — your responsibility.

## 10DLC Reality (US-Only)

If you're sending US SMS in 2026, 10DLC is unavoidable.

```text
10DLC = 10-Digit Long Code = US carrier-mandated registration for A2P SMS.

Requirements:
1. Register your brand with TCR (The Campaign Registry) via your CPaaS
2. Register each campaign (use case: 2FA, marketing, alerts) with TCR
3. Pay registration fees ($4 brand + $10/campaign + monthly campaign fees)
4. Wait 1-7 days for approval
5. Use approved 10DLC numbers for the registered campaign

Failure modes:
- Unregistered SMS = blocked by carriers (T-Mobile / AT&T enforce strictly)
- Wrong campaign type = filtered (e.g., marketing in 2FA campaign)
- Throughput limits per campaign trust score (1 msg/sec → 100+ msg/sec)

Alternatives:
- Toll-free SMS (no 10DLC; lower throughput; opaque pricing)
- Short code (5-6 digit; high throughput but $1500-2500/mo; 4-12 week approval)

For most B2B SaaS in 2026: 10DLC is the answer. Plan for 1-week setup.
```

CPaaS provides the registration UI; you fill out the forms and wait.

## Pragmatic Stack Patterns

### Pattern 1: SaaS 2FA only ($10-200/mo)
- **Twilio Verify** OR **Sinch Verification**
- ~$0.05/OTP × verification volume
- Skip building OTP yourself

### Pattern 2: SMS alerts + 2FA ($50-500/mo)
- **Plivo** OR **Twilio**
- 10DLC registration done
- Few thousand SMS/mo

### Pattern 3: SMS + voice contact ($200-2K/mo)
- **Twilio** Programmable Voice + SMS
- IVR flows in Twilio Studio
- Call recording + transcription (Twilio Voice Intelligence)

### Pattern 4: International + omnichannel ($1K-10K/mo)
- **Bird** OR **Twilio** + WhatsApp Business
- Workflow builder for cross-channel
- Localized opt-in flows per country

### Pattern 5: Enterprise + 10M msg/mo ($$$)
- **Sinch** OR **Infobip** OR **Twilio Enterprise**
- MSA + SLA + dedicated support

### Pattern 6: AWS-native SMS ($cheap)
- **AWS End User Messaging Pinpoint**
- Native SNS/Lambda integration
- SMS-only

## Decision Framework: Three Questions

1. **What channels do you need?**
   - SMS only → Telnyx / Plivo / AWS Pinpoint (cheapest)
   - SMS + Voice → Twilio / Plivo / Vonage / Telnyx
   - Omnichannel (WhatsApp, RCS, email) → Twilio / Bird / Sinch / Infobip

2. **Where are your users?**
   - US-only → Telnyx / Bandwidth / Plivo
   - International → Twilio / Bird / Sinch
   - Enterprise global → Sinch / Infobip

3. **What's your volume?**
   - <100K msg/mo → self-serve any (Twilio default)
   - 100K-10M msg/mo → negotiate mid-market pricing (Plivo/Telnyx ~30% cheaper)
   - 10M+ → enterprise MSA (Sinch / Infobip / Twilio Enterprise)

## Cost Calculation Example

For 100K verification SMS / month (US):

- **Twilio Verify**: ~$0.05/verify × 100K = $5,000
- **Twilio raw SMS** (DIY OTP): $0.0079 × 100K + carrier $0.005 × 100K = ~$1,300
- **Plivo raw SMS**: $0.0055 × 100K + carrier ≈ $850
- **Telnyx raw SMS**: $0.004 × 100K + carrier ≈ $700
- **AWS Pinpoint**: $0.00645 × 100K = $645

DIY OTP saves money but you handle: code generation, expiration, retry logic, voice fallback, country-specific filtering. Twilio Verify is more expensive but handles all of that.

The break-even: small startups → use Verify; mature engineering → DIY with raw SMS.

## Verdict

For 50% of B2B SaaS in 2026: **Twilio**. Default; broadest features; best docs.

For 25%: **Plivo** OR **Telnyx**. Cost-sensitive; standard SMS + voice; ~30% cheaper.

For 10%: **Bird (MessageBird)**. International + omnichannel.

For 5%: **AWS End User Messaging**. AWS-native; SMS-only; cheap.

For 5%: **Twilio Verify / Sinch Verification**. OTP-only; want abstraction.

For 5%: **Sinch / Infobip / Bandwidth**. Enterprise scale.

The mistake to avoid: **picking by price alone**. SMS deliverability across 200 countries is non-trivial; cheapest provider may have 10% lower delivery rates that you only notice 6 months in.

The second mistake: **skipping 10DLC registration in the US**. Unregistered traffic is blocked by major carriers since 2024. Register before you launch.

The third mistake: **using SMS for marketing without explicit consent**. TCPA fines are $500-1500/violation per missed consent. Use email for marketing; SMS for transactional only unless you have airtight opt-in.

## See Also

- [Email Providers](./email-providers.md) — adjacent transactional channel
- [Notification Providers](./notification-providers.md) — multi-channel notifications
- [Video Voice Conferencing APIs](./video-voice-conferencing-apis.md) — video CPaaS sister category
- [Webhook Delivery Services](./webhook-delivery-services.md) — adjacent reliability infrastructure
- [Rate Limiting](./rate-limiting.md) — protect SMS endpoints from abuse
- [API Integration](./api-integration.md) — integration patterns
- [Identity Verification & KYC Tools](../auth-and-payments/identity-verification-kyc-tools.md) — phone verification adjacency
- [Authentication](../auth-and-payments/authentication.md) — 2FA / passkeys context
- [VibeWeek: Two-Factor Auth](https://vibeweek.dev/6-grow/two-factor-auth-chat) — 2FA implementation
- [VibeWeek: Captcha & Bot Protection](https://vibeweek.dev/6-grow/captcha-bot-protection-chat) — adjacent abuse defense
- [VibeWeek: Mobile Push Notifications](https://vibeweek.dev/6-grow/mobile-push-notifications-chat) — push notification sister
- [LaunchWeek: Onboarding Flow](https://launchweek.dev/4-convert/onboarding-flow) — phone verification in onboarding
