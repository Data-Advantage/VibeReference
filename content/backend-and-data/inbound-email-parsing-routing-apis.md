# Inbound Email Parsing & Routing APIs: Mailgun Routes, SendGrid Inbound Parse, Postmark Inbound, CloudMailin, AWS SES Inbound, Mailpit

[⬅️ Backend & Data Overview](../backend-and-data/)

If your SaaS needs to **receive emails** programmatically — turning incoming emails into structured webhook calls your app can process — you need an inbound email parsing service. Use cases: support ticket ingestion (customer emails support@yourapp.com → ticket created); reply-to-email features (user replies to your notification → comment added); email-based workflows (email an attachment to a unique address → file uploaded); AI agents that read user email; bookkeeping (forward receipts to magic address → expense logged); CRM email capture; email-to-Slack / email-to-task automation.

This is the inverse of [transactional email providers](./email-providers.md) (which send). The category split: **bundled with an outbound provider** (Mailgun Routes / SendGrid Inbound Parse / Postmark Inbound — same vendor as your sending), **inbound-specialized** (CloudMailin — built for inbound from day one), **infrastructure-tier** (AWS SES Inbound — bring-your-own-rules), and **OSS / self-host** (Mailpit / James / Postal).

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Mailgun Routes | Inbound add-on to Mailgun | Free w/ Mailgun | Per-email; Mailgun base + per-message | Medium | Mailgun customers extending to inbound |
| SendGrid Inbound Parse | Inbound add-on to SendGrid | Bundled w/ SendGrid Pro+ | Bundled | Medium | SendGrid customers |
| Postmark Inbound | Inbound add-on to Postmark | Free w/ Postmark | Per-message overage | High | Postmark customers wanting clean inbound |
| AWS SES Inbound | AWS-native inbound | Free tier | $0.10/1K + S3 + SNS / Lambda costs | High | AWS-heavy shops; programmatic flexibility |
| CloudMailin | Inbound-specialized service | Free trial | $9-499+/mo | Very high | Indie / SMB inbound-first; no sending overlap needed |
| Mailpit | OSS local SMTP server | Free + OSS | Free | Very high | Dev / test inbound; not production |
| Postal | OSS self-hosted email platform | Free + OSS | Hosting cost | High | OSS-leaning teams self-hosting full email |
| James (Apache) | OSS Java email server | Free + OSS | Hosting cost | Medium | Enterprise OSS shops |
| MailSlurp | Email API with inbound + outbound | Free trial | $79+/mo | High | Test automation; AI agents |
| Email-as-a-Service (various) | Various boutique | Various | Various | Low | Niche cases |

The first decision is **whether you already have a transactional email vendor**:

- **Yes (Mailgun / SendGrid / Postmark)**: extend that vendor with their inbound product
- **No, and inbound is the primary need**: CloudMailin (specialized) or AWS SES Inbound
- **AWS-heavy**: AWS SES Inbound + Lambda
- **Need both inbound + outbound integrated**: Mailgun (best-in-class for inbound features)

## Decide What You Need First

### Support Tickets via Email (the 30% case)

Customer emails support@yourapp.com; you want to create a ticket in your system.

**Pick: Mailgun Routes** (best-in-class inbound parsing) or **SendGrid Inbound Parse** if already on SendGrid. Postmark Inbound for cleaner API.

### Reply-to-Comments / Reply-to-Update (the 25% case)

User receives notification; replies via email; reply becomes a comment / update in your app.

**Pick: Postmark Inbound** for cleanest threading + reply parsing. Or Mailgun Routes.

### Email-Based File Upload / Forwarding (the 15% case)

User forwards email to magic address; attachments get uploaded; body gets parsed.

**Pick: AWS SES Inbound + Lambda** for max flexibility. Or CloudMailin.

### CRM Email Capture (the 15% case)

BCC the CRM's special address on every customer email; CRM captures + threads.

**Pick: typically built into the CRM** (Salesforce / HubSpot / etc.); else use Mailgun Routes.

### AI Agent Reading Emails (the 10% case)

AI agent processes incoming user emails (newsletter sign-ups, customer feedback, etc.).

**Pick: MailSlurp** or **CloudMailin**. Designed for programmatic flows.

### Inbound Email at Scale / Compliance (the 5% case)

Healthcare / financial; HIPAA / SOC 2; high volume.

**Pick: AWS SES Inbound + BAA** or **Mailgun Enterprise**.

## Provider Deep-Dives

### Mailgun Routes

The most mature inbound email parsing service. Founded 2010 (acquired by Sinch).

Strengths:

- **Best-in-class inbound parsing** — strips signatures, separates quoted history, extracts attachments cleanly
- Multiple match patterns (catch-all, regex, specific address)
- Webhook delivery with full parsed JSON payload
- Reliable delivery infrastructure
- Bundled with Mailgun outbound (single vendor for both)
- Works for high-volume use cases

Weaknesses:

- Pricing tied to Mailgun's overall pricing
- Mailgun's UX is dated
- Sinch acquisition (2021) affecting innovation pace

Use Mailgun Routes when:

- You want best-in-class parsing
- Already on Mailgun
- High-volume inbound

### SendGrid Inbound Parse

SendGrid's inbound product (Twilio-owned).

Strengths:

- **Bundled with SendGrid** at higher tiers
- Decent parsing
- Familiar to SendGrid customers

Weaknesses:

- Parsing less polished than Mailgun
- Twilio / SendGrid pricing complex
- Sometimes Twilio's broader pricing changes affect SendGrid

Use SendGrid Inbound Parse when:

- Already on SendGrid Pro+
- Don't want to add another vendor

### Postmark Inbound

Postmark's clean inbound API. Postmark is known for transactional email quality.

Strengths:

- **Clean, simple API** (Postmark's hallmark)
- Excellent reply parsing (separates reply text from quoted history)
- Webhook reliability strong
- Bundled with Postmark sending
- Good for B2B SaaS reply-to-comment use cases

Weaknesses:

- Pricing scales with volume
- Smaller than Mailgun / SendGrid
- Less customization than Mailgun

Use Postmark Inbound when:

- Already on Postmark
- Reply parsing quality matters
- B2B SaaS use case

### AWS SES Inbound

AWS-native inbound email.

Strengths:

- **Most flexible** — incoming email triggers Lambda / SNS / SQS / S3
- Programmatic everything
- Cheap at scale ($0.10 per 1K emails + downstream costs)
- BAA available via AWS BAA
- Works with AWS-native tooling

Weaknesses:

- DIY everything (no built-in parsing helpers)
- Setup complexity (DNS, MX records, IAM, Lambda)
- No web UI for routing rules
- Engineering effort required

Use AWS SES Inbound when:

- AWS-heavy shop
- Need full control / privacy
- Engineering capacity available

### CloudMailin

Inbound-first service. Founded 2010 (Indie). Specializes in receiving email.

Strengths:

- **Built for inbound from day one**
- Clean API + dashboard
- Good for indie / SMB
- Multiple addresses + patterns
- Reasonable pricing ($9-499+/mo)
- Reliable

Weaknesses:

- Sending requires separate vendor (intentional)
- Smaller ecosystem than Mailgun / SendGrid

Use CloudMailin when:

- Inbound is the primary need
- You want a focused tool
- Indie / SMB

### MailSlurp

Email API for testing + automation.

Strengths:

- **Inbound + outbound API** for programmatic email
- Disposable inboxes for testing
- Used heavily by AI agents + test automation
- API-first

Weaknesses:

- Not designed for high-volume production inbound
- Pricing higher than alternatives for production use

Use MailSlurp when:

- Test automation
- AI agents creating + receiving disposable emails
- Programmatic email flows

### OSS: Mailpit

Local SMTP server for dev + test.

Strengths:

- **Catches all emails sent in dev** — useful for testing
- No real delivery
- Web UI to view sent emails
- Drop-in SMTP replacement
- Free + OSS

Weaknesses:

- Dev/test only — not for production
- Doesn't actually route real inbound mail

Use Mailpit when:

- Dev / test environment for emails
- Don't want real emails sent during development

### OSS: Postal / Apache James

Self-hosted email platforms.

Strengths:

- **Full control + self-host**
- No per-message costs at scale
- Privacy / data residency

Weaknesses:

- Significant ops burden
- DKIM / SPF / DMARC setup is your problem
- IP reputation management
- Not for the faint of heart

Use Postal / James when:

- Specific compliance / privacy requirement
- Engineering team comfortable with email infrastructure

## Architecture Pattern

For most inbound use cases:

```
1. Customer / user sends email to support@yourapp.com (or unique@yourapp.com)
2. DNS MX records point to your inbound provider
3. Provider receives email → parses → delivers webhook to your endpoint
4. Your endpoint receives JSON with: from, to, subject, body, attachments, headers
5. Your app processes: create ticket / append comment / save attachment / etc.
6. Optional: send acknowledgment email back via your outbound provider
```

### MX Record Setup

Each provider gives you specific MX records to add:

- Mailgun: `mxa.mailgun.org` (priority 10), `mxb.mailgun.org` (priority 10)
- SendGrid: `mx.sendgrid.net` (priority 10)
- Postmark: `inbound.postmarkapp.com` (priority 10)
- CloudMailin: `cloudmta1.cloudmailin.net` (priority 10)
- AWS SES: `inbound-smtp.<region>.amazonaws.com` (priority 10)

You add these to whichever subdomain receives mail (typically `yourapp.com` or `inbound.yourapp.com`).

### Webhook Payload

Typical webhook delivers JSON like:

```json
{
  "from": "user@example.com",
  "to": "support+ticket-123@yourapp.com",
  "subject": "Re: Your invoice",
  "text": "Plain text body...",
  "html": "<html>HTML body...</html>",
  "stripped_text": "Body without quoted reply history",
  "headers": { ... },
  "attachments": [
    {
      "filename": "invoice.pdf",
      "content_type": "application/pdf",
      "url": "https://provider.../attachment-storage/abc"
    }
  ]
}
```

### Reply Parsing

Most useful: providers separate the reply portion from quoted history.

```
> On Tuesday, X wrote:
> > Original message...
>
> Reply from Y...

This is my actual new reply.
```

Mailgun's `stripped-text` and Postmark's `TextBody` both extract just "This is my actual new reply" — saves you the work of parsing.

## Common Pitfalls

**Not setting up SPF / DKIM / DMARC for the inbound subdomain.** Your inbound provider rejects mail or marks as spam. Set up DNS properly.

**Skipping webhook signature verification.** Anyone can POST to your endpoint pretending to be your provider. Use HMAC verification.

**No rate limiting on incoming.** Spam bombing your inbound endpoint floods your DB. Rate-limit per sender + globally.

**Storing full email content forever.** Storage cost + privacy risk. Retention policy.

**Not handling attachments.** Provider stores attachments at a URL; you don't fetch them; URLs expire; data lost. Fetch + store yourself.

**Single-vendor lock-in.** Switching providers means re-configuring DNS + parsing logic. Abstract the parsing layer.

**Catch-all forwarding.** support@yourapp.com routes everything; spam fills the queue. Have specific addresses (support+ticket-X@) and SPAM filtering.

**No de-duplication.** Same message delivered multiple times (provider retries on webhook failure). Idempotent webhook handling via Message-ID.

**Missing reply parsing.** Receiving full email with quoted history; storing as new content. Use provider's stripped-text or parse yourself.

**Encoding issues.** Email encoded in non-UTF-8; characters mangled. Detect + convert encodings.

**Auto-responder loops.** Your acknowledgment email triggers their auto-responder triggers your acknowledgment. Detect Auto-Submitted headers; don't reply to auto-responders.

**No spam filtering.** Spam fills your support queue. Provider should filter; you can add additional filtering.

**Not testing reply-to flow.** Test your full loop (notification → reply → comment) for all major email clients.

**Forgetting CC + BCC handling.** CC'd people are part of the conversation; need handling. Parse all recipients.

**HTML email sanitization missed.** User HTML stored + rendered; XSS vulnerability. Sanitize.

**Forwarded emails losing headers.** Forwarded chain has inner email's headers; you parse the wrong sender. Detect forwards; parse inner.

**Large attachments DoS.** 100MB attachments crash your worker. Size limits.

**Provider-specific API differences.** Switching from Mailgun to Postmark breaks your parsing logic. Abstract behind interface.

**Webhook timeouts.** Provider expects 200 in <30s; your handler is slow; retried; duplicate processing. Acknowledge fast; process async.

**No customer-facing support for "email didn't arrive."** Hard to debug; users complain. Add diagnostics + visibility.

## See Also

- [Email Providers](./email-providers.md) — outbound transactional
- [Resend](./resend.md)
- [AWS SES](./aws-ses.md)
- [Notification Providers](./notification-providers.md) — Knock / Courier / Twilio
- [Webhook Delivery Services](./webhook-delivery-services.md)
- [Webhook (VibeWeek)](https://vibeweek.dev/6-grow/webhook.md)
- [API](./api.md)
- [API Documentation Tools](./api-documentation-tools.md)
- [Document Parsing / OCR Services](./document-parsing-ocr-services.md) — for processing email attachments
- [PDF Document Generation Tools](./pdf-document-generation-tools.md)
- [Background Jobs Providers](./background-jobs-providers.md) — async email processing
- [Database Providers](./database-providers.md)
- [Vector Database Providers](./vector-database-providers.md) — for AI agents indexing inbound emails
- [SMS / Voice APIs](./sms-voice-apis.md)
- [Video / Voice Conferencing APIs](./video-voice-conferencing-apis.md)
- [DNS](../cloud-and-hosting/dns.md)
- [DNS Providers](../cloud-and-hosting/dns-providers.md)
- [Email Marketing Providers (VibeReference)](../marketing-and-seo/email-marketing-providers.md)
- [Email Warmup & Cold Deliverability Tools (VibeReference)](../marketing-and-seo/email-warmup-deliverability-tools.md)
- [Newsletter Platforms (VibeReference)](../marketing-and-seo/newsletter-platforms.md)
- [Healthcare HIPAA-Compliant Stack & Tools](../auth-and-payments/healthcare-hipaa-compliant-stack-tools.md)
- [Inbound Webhooks (VibeWeek)](https://vibeweek.dev/6-grow/inbound-webhooks-chat.md)
- [Webhook Signature Verification (VibeWeek)](https://vibeweek.dev/6-grow/webhook-signature-verification-chat.md)
- [Email Deliverability (VibeWeek)](https://vibeweek.dev/6-grow/email-deliverability-chat.md)
- [Email Template Implementation (VibeWeek)](https://vibeweek.dev/6-grow/email-template-implementation-chat.md)
- [Email Verification Flow (VibeWeek)](https://vibeweek.dev/6-grow/email-verification-flow-chat.md)
- [Customer Support (VibeWeek)](https://vibeweek.dev/6-grow/customer-support-chat.md)
- [Custom Email Domain & White-Label Sending (VibeWeek)](https://vibeweek.dev/6-grow/custom-email-domain-white-label-sending-chat.md)
- [Customer Support Tools (VibeReference)](../product-and-design/customer-support-tools.md)
- [Live Chat Widget Tools (VibeReference)](../product-and-design/live-chat-widget-tools.md)
- [AI Customer Support Agents (VibeReference)](../ai-development/ai-customer-support-agents.md)
- [AI Voice & Phone Agent Platforms (VibeReference)](../ai-development/ai-voice-phone-agent-platforms.md)
- [Conversation Intelligence & Meeting Recording Platforms (VibeReference)](../marketing-and-seo/conversation-intelligence-meeting-recording-platforms.md)
- [Browser Automation & Scraping Tools (VibeReference)](../ai-development/browser-automation-scraping-tools.md)
