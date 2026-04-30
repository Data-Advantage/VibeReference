# Healthcare HIPAA-Compliant Stack & Tools: AWS HIPAA, Google Cloud Healthcare, TrueVault, Datica, Aptible, Paubox, Redox, Postmark, Twilio Healthcare, Doxy.me

[⬅️ Auth & Payments Overview](../auth-and-payments/)

If you're building healthcare software in the US in 2026 — telehealth, patient-facing apps, payer/provider tools, RCM, clinical AI, mental health platforms, anything touching protected health information (PHI) — you must comply with HIPAA. The compliance burden is real: every vendor that processes PHI on your behalf needs a Business Associate Agreement (BAA). Without BAAs, you can't legally use them. With BAAs, your stack choices narrow dramatically — many of the tools you'd reach for elsewhere (basic AWS services without BAA, Mailchimp, Slack standard, OpenAI without enterprise) aren't usable.

This is the consolidated reference for the HIPAA-eligible stack: cloud + databases + auth + email + SMS + analytics + AI + telehealth + EHR integration. The right pick depends on whether you're early-stage healthtech, scaling provider-side, payer-integrated, or building patient-facing apps.

## TL;DR Stack by Category

| Category | HIPAA-Friendly Options |
|---|---|
| **Cloud / Hosting** | AWS (with BAA), Google Cloud Healthcare, Azure Health Data Services, Aptible (HIPAA-as-a-platform) |
| **Databases** | AWS RDS (BAA), Aurora, Google Cloud SQL with healthcare-API; Aptible; Heroku Shield Postgres |
| **Auth + Identity** | Auth0 (BAA available), Clerk Enterprise, Stytch HIPAA, Cognito (with BAA), Frontegg |
| **Email (Transactional)** | Postmark Healthcare, Paubox, AWS SES (BAA), SendGrid Healthcare; NOT Mailchimp / Resend (no standard BAA in 2026) |
| **SMS / Voice** | Twilio Healthcare (BAA-tier), Bandwidth, Plivo Healthcare; NOT generic Twilio without BAA |
| **Analytics** | Heap (HIPAA), Mixpanel (HIPAA), Segment Privacy Tier, Google Analytics 4 (specific config + BAA); avoid Posthog default |
| **AI / LLM** | Anthropic Claude Enterprise (BAA), OpenAI Enterprise (BAA), Azure OpenAI (BAA), AWS Bedrock (with BAA), private models on HIPAA infrastructure |
| **Telehealth** | Doxy.me, Zoom Healthcare, Updox, eVisit, VSee, Microsoft Teams for Healthcare |
| **EHR Integration** | Redox, 1upHealth, Health Gorilla, Epic FHIR direct, Particle Health |
| **Compliance Platform** | Vanta HIPAA, Drata HIPAA, Secureframe HIPAA, TrueVault, Compliancy Group |
| **HIPAA-as-Platform / All-in-One** | Aptible Comply, Datica (now ClearDATA), TrueVault, Comprehend |

The single biggest decision: **HIPAA-as-a-platform (Aptible / Datica / TrueVault) vs DIY on hyperscaler (AWS / GCP / Azure with BAA)**. The former trades cost for speed-to-compliance; the latter trades engineering effort for control + cost.

## HIPAA Basics in 60 Seconds

- **PHI**: Protected Health Information — anything that combines individual identity with health info (name + diagnosis; SSN + medication list; etc.)
- **Covered Entity (CE)**: providers (hospitals, doctors), health plans, healthcare clearinghouses
- **Business Associate (BA)**: any vendor processing PHI on behalf of a CE. You're typically a BA.
- **BAA (Business Associate Agreement)**: contract between you (BA) and your vendors (subcontractors) ensuring they'll comply. Required for every vendor processing PHI.
- **Safeguards**: administrative, physical, technical (the HIPAA Security Rule)
- **Breach notification**: 60-day reporting; OCR (Office for Civil Rights) penalties up to $1.9M/violation/year
- **Audit**: keep documentation; demonstrate controls; respond to OCR investigations

## Decide What You Need First

### Pre-PMF healthtech (the 30% case)

You're prototyping; a few pilot customers; not yet at scale.

**Pick: Aptible Comply ($1.5K-3K/mo)** for HIPAA infrastructure + BAAs handled. Saves you 6 months of compliance work. Use for hosting + databases.

For email, AI, etc.: pick BAA-friendly providers from the categories below.

### Growth-stage healthtech (the 30% case)

Series A/B; 10+ engineers; scaling customer base.

**Pick: AWS or GCP with BAA** for hosting. **Vanta HIPAA / Drata** for compliance automation. BAA-friendly tier of every vendor.

### Enterprise healthtech / payer-side (the 20% case)

Large EMR integrations; HITRUST + SOC 2 + HIPAA compliance simultaneously.

**Pick: AWS Healthcare or Azure Health Data Services** for native FHIR + DICOM. **HITRUST CSF** certification on top of HIPAA.

### Pure clinical / FDA-regulated (the 10% case)

Software as a Medical Device (SaMD); FDA pre-market clearance.

**Pick: HIPAA + FDA QMS (21 CFR 820 / ISO 13485) compliance stack.** Aptible and others have FDA-friendly tiers; Greenlight Guru for QMS.

### Patient-facing apps (the 10% case)

Direct-to-consumer mental health, wellness, telehealth.

**Pick: HIPAA-eligible app stack + telehealth provider (Doxy.me / Zoom Healthcare).** Plus careful patient consent + privacy UX.

## Provider Deep-Dives

### Cloud / Hosting

**AWS (with BAA)**: the dominant choice for serious healthtech. Sign BAA via AWS Artifact. ~150 services BAA-eligible (including EC2, RDS, S3, Lambda, EKS, DynamoDB, Cognito, SES, etc.). Strong ecosystem of HIPAA-experienced consultants.

- Pros: most options; mature; AWS HealthLake for FHIR
- Cons: BAA covers infrastructure but YOU must configure correctly (encryption, access controls, audit logs); easy to misconfigure
- Cost: standard AWS pricing + your engineering time

**Google Cloud (Healthcare API)**: GCP's HIPAA-eligible services + native FHIR / DICOM / HL7v2 APIs.

- Pros: best native healthcare-data APIs; FHIR Store excellent
- Cons: smaller HIPAA ecosystem than AWS
- Cost: standard GCP + Healthcare API tier

**Azure Health Data Services**: Azure's healthcare-specific tier with FHIR + DICOM + MedTech services.

- Pros: enterprise integration with Microsoft ecosystem; Office 365 BAA included
- Cons: Microsoft-shop alignment; less indie-friendly
- Cost: enterprise-tier

**Aptible Comply**: HIPAA-as-a-platform. Hosts your Docker containers on HIPAA-compliant infrastructure with BAAs handled.

- Pros: fastest path to compliance; ~$1.5K/mo for typical workload; saves 4-6 months of HIPAA infra setup
- Cons: more expensive than raw AWS at scale; eventually you migrate
- Cost: $1.5K-15K+/mo depending on workload

**ClearDATA (formerly Datica)**: enterprise managed HIPAA infrastructure on AWS/GCP/Azure.

- Pros: managed compliance + monitoring; HITRUST-certified
- Cons: enterprise pricing; sales-led
- Cost: enterprise

**Heroku Shield**: HIPAA-compliant Heroku Private Spaces.

- Pros: Heroku DX with HIPAA
- Cons: expensive for what you get; Salesforce-owned; slowing innovation
- Cost: $1K+/mo per Shield Private Space

### Databases

Most BAA-eligible cloud databases work. Specifically:

- **AWS RDS / Aurora**: BAA-covered; Postgres / MySQL / SQL Server. Use encryption at rest + in transit.
- **Google Cloud SQL**: HIPAA-eligible
- **Azure SQL Database**: HIPAA-eligible
- **Aptible managed Postgres / Redis**: bundled with their compliance platform
- **Supabase**: doesn't yet have standard BAA in 2026; check status before using for PHI
- **PlanetScale**: doesn't currently sign BAAs
- **Convex**: doesn't currently sign BAAs

For PHI, use BAA-eligible managed Postgres / Aurora. Don't use developer-favorite databases without confirmed BAA support.

### Auth + Identity

Pick BAA-eligible:

- **Auth0 (BAA)**: enterprise tier; BAA available
- **Clerk Enterprise**: BAA available at enterprise tier
- **Stytch HIPAA**: BAA tier
- **AWS Cognito**: BAA-eligible by default
- **Frontegg**: BAA available
- **Better Auth + your own infra**: BAA depends on your hosting

Pre-MFA-mandate: HIPAA Security Rule requires authentication, but specific MFA isn't mandated. By 2026 industry standard is MFA + SSO for healthcare.

### Email (Transactional + Patient Communication)

The category most surprising to founders — many email providers don't sign BAAs:

- **Postmark Healthcare**: signs BAA; enterprise tier
- **Paubox**: HIPAA-first email platform; BAA included; encrypted email-in-transit by default
- **AWS SES**: BAA-eligible via AWS BAA
- **SendGrid (Twilio)**: signs BAA at HIPAA tier
- **Mailgun**: BAA at higher tier
- **NOT**: Mailchimp standard, Resend (no BAA in 2026), Substack, Ghost

For B2C patient communication, encrypted email-in-transit is critical. Paubox specializes in this.

### SMS / Voice

- **Twilio Healthcare**: BAA tier; covers SMS, voice, video
- **Bandwidth**: BAA available
- **Plivo Healthcare**: BAA tier
- **NOT**: generic Twilio account without BAA upgrade

Note: SMS itself isn't encrypted end-to-end. PHI over SMS is risky; some providers send patient-initiated SMS only with explicit consent.

### Analytics

The category where indie healthtech most often misconfigures:

- **Heap (HIPAA)**: BAA-eligible enterprise tier; auto-capture configured to exclude PHI
- **Mixpanel (HIPAA)**: BAA-eligible
- **Segment Privacy Tier**: BAA available; great for routing data
- **Google Analytics 4**: BAA via specific configuration + Google Cloud BAA; complex setup
- **PostHog**: doesn't sign BAA in standard tier; self-host required
- **Amplitude**: BAA at enterprise tier

For PHI-touching apps, the safest route: don't send PHI to analytics at all. Use generic event names; hash IDs; separate clinical from analytics.

### AI / LLM Providers

The fastest-changing category:

- **Anthropic Claude Enterprise**: BAA available (since 2024)
- **OpenAI Enterprise / API for Business**: BAA available; opt out of training
- **Azure OpenAI Service**: BAA via Azure (often easier than direct OpenAI)
- **AWS Bedrock**: BAA via AWS; multiple model families (Claude, Llama, Titan)
- **Google Gemini for Healthcare** (Vertex AI): BAA via Google Cloud
- **Self-hosted (Ollama, vLLM, llama.cpp)**: HIPAA via your own BAA-covered infrastructure
- **NOT**: ChatGPT Free / Plus consumer tier; Claude.ai consumer

Practical approach: route PHI-touching prompts to BAA-covered providers. For non-PHI experimentation, use whatever.

### Telehealth Video

- **Doxy.me**: telehealth-specific; HIPAA-compliant by default; popular with clinicians
- **Zoom Healthcare**: BAA tier of Zoom; widely used
- **Updox**: integrated telehealth + secure messaging
- **eVisit**: enterprise telehealth platform
- **VSee**: developer-friendly telehealth APIs
- **Microsoft Teams for Healthcare**: bundled with Office 365 healthcare tier
- **NOT**: standard Zoom, Google Meet without Healthcare-tier, FaceTime, WhatsApp

### EHR / Health Data Integration

- **Redox**: integration platform — connects to 90%+ of US EHRs (Epic, Cerner, Athena, Allscripts, Meditech). One API; many EHRs.
- **1upHealth**: FHIR-based aggregator; patient-mediated data
- **Health Gorilla**: clinical data aggregator + identity matching
- **Particle Health**: clinical data network
- **Epic FHIR direct**: connect directly via Epic's APIs (more work but cheaper at scale)
- **Cerner / Oracle Health APIs**: similar direct option for Cerner-served customers
- **Athenahealth Marketplace**: deeper for Athena-only

For most healthtech reaching multi-EHR customers, Redox or 1upHealth saves months of integration work.

### Compliance Platforms

For ongoing HIPAA compliance management:

- **Vanta HIPAA**: includes HIPAA controls in the Vanta platform
- **Drata HIPAA**: similar; competitor
- **Secureframe HIPAA**: similar; mid-market
- **TrueVault**: HIPAA-specific platform; less SOC 2-focused than Vanta
- **Compliancy Group**: long-running HIPAA-specialist; lots of consulting overlay
- **Aptible Comply**: bundles compliance with hosting
- **HIPAA Compliance Officer (fractional)**: human service from compliance consultants

Most healthtech in 2026 use Vanta + Drata if they also need SOC 2; TrueVault if HIPAA-only.

### Patient Identity & Verification

- **Persona**: BAA available
- **Stripe Identity**: BAA at enterprise tier
- **Onfido**: BAA available
- **Veriff**: enterprise BAA

For patient onboarding, identity verification is often required.

## What HIPAA Won't Solve

**Don't expect BAAs to cover all configuration.** AWS BAA covers them; YOU are responsible for configuring services correctly (encryption; access; audit logs). Misconfiguration is the #1 breach cause.

**Don't expect compliance platforms to certify you.** Vanta / Drata help; OCR investigations require actual evidence. Documentation matters.

**Don't expect HIPAA to cover state laws.** California's CMIA, Texas HB 300, Colorado, Massachusetts, etc. add state requirements. Multi-state operations need state-by-state compliance.

**Don't expect HIPAA to cover GDPR.** Different regulations; if you have EU patients, GDPR + HIPAA + state laws apply.

**Don't expect FDA approval to be HIPAA approval.** Different concepts; SaMD requires FDA + HIPAA + (often) HITRUST.

**Don't expect every popular dev tool to support HIPAA.** Many indie favorites (Resend, Convex, etc.) don't sign BAAs. Plan for it.

**Don't expect patients to grasp consent.** Patient-facing UX requires explicit consent flows — record opt-in; make it auditable; honor revocation.

**Don't expect breach response to be optional.** OCR notification within 60 days. Have an incident response plan.

## Pragmatic Stack Patterns

### Solo / Pre-PMF Healthtech

- **Aptible Comply** for hosting ($1.5K-3K/mo)
- **Postmark Healthcare** for email
- **Twilio Healthcare** for SMS
- **Anthropic Claude Enterprise** or **AWS Bedrock** for AI
- **Doxy.me** for telehealth
- **Vanta HIPAA** for compliance management
- Total: $3K-6K/mo + per-usage costs

### Series A Healthtech

- **AWS or GCP with BAA** for hosting
- **Postmark** + **Paubox** for transactional + patient email
- **Twilio Healthcare** for SMS + voice
- **Redox** for EHR integration
- **Anthropic + Azure OpenAI** for AI
- **Heap or Mixpanel HIPAA** for analytics
- **Vanta + Drata** for compliance
- Total: $5K-30K/mo + per-usage

### Series B+ / Enterprise Healthtech

- **AWS Healthcare** or **Azure Health Data Services**
- **Redox + Particle Health** for EHR breadth
- **Multiple BAA-covered AI providers** for redundancy
- **Dedicated compliance officer + outside HIPAA counsel**
- **HITRUST CSF certification** on top of HIPAA
- Total: $50K-500K+/mo

### Patient-Facing Mental Health App

- **Aptible Comply** or AWS HIPAA
- **Doxy.me** or **Zoom Healthcare** for therapy sessions
- **Paubox** for encrypted patient email
- **Twilio Healthcare** for SMS reminders
- **Mixpanel HIPAA** for product analytics (no PHI sent)
- **Vanta HIPAA** for compliance
- Total: $5K-25K/mo

### Provider-Facing Clinical App

- **AWS Healthcare** for primary infrastructure
- **Redox** for EHR integration
- **AWS Bedrock** for AI (BAA-covered)
- **Vanta + Drata** for compliance
- **Particle Health** for clinical data network
- Total: $20K-100K+/mo

## Decision Framework: Six Questions

1. **What's your stage?**
   - Pre-PMF: Aptible Comply (fastest)
   - Growth: AWS / GCP with BAA
   - Enterprise: hyperscaler healthcare tier + HITRUST

2. **Multi-EHR integration needed?**
   - Yes: Redox or 1upHealth
   - Single EHR: direct API

3. **Patient-facing or provider-facing?**
   - Patient: telehealth + secure email
   - Provider: EHR integration + clinical workflows

4. **AI / LLM use?**
   - Yes: BAA-covered providers (Anthropic / OpenAI Enterprise / AWS Bedrock)
   - No: skip this layer

5. **Compliance maturity?**
   - DIY: Vanta + Drata; build your own controls
   - Bundled: Aptible Comply / TrueVault / ClearDATA

6. **Geographic scope?**
   - US-only: HIPAA + state laws
   - International: HIPAA + GDPR + country-specific

## Verdict

**Default for indie healthtech**: Aptible Comply for hosting + Postmark for email + Twilio Healthcare for SMS + Anthropic Enterprise for AI + Doxy.me for telehealth + Vanta HIPAA for compliance.

**Default for growth-stage**: AWS with BAA + Redox for EHRs + Vanta/Drata for compliance.

**Default for enterprise**: AWS Healthcare / Azure Health Data Services + HITRUST CSF.

**Default for patient-facing**: HIPAA stack + careful consent UX + telehealth provider.

The most common mistakes:

1. **Building on non-BAA services and discovering it later.** Resend / PostHog / Convex / many indie favorites don't sign BAAs in 2026. Audit before committing.
2. **Assuming BAA = compliant.** BAA is one piece. Configuration + access controls + audit logs + breach response process are separate.
3. **Not budgeting for compliance overhead.** HIPAA program ongoing is 10-20% of engineering time; compliance person + outside counsel costs.
4. **Using consumer LLM tier for patient queries.** ChatGPT Free / Claude consumer ≠ HIPAA. Use Enterprise tiers.
5. **Sending SMS with PHI.** SMS isn't encrypted end-to-end. Patient SMS reminders are OK; patient-mediated PHI requires care.

## See Also

- [Authentication](./authentication.md)
- [Auth Providers](./auth-providers.md)
- [Identity Verification & KYC Tools](./identity-verification-kyc-tools.md)
- [Tax Compliance Tools](./tax-compliance-tools.md)
- [Payment Providers](./payment-providers.md)
- [Stripe](./stripe.md)
- [Subscription Billing Providers](./subscription-billing-providers.md)
- [Subscription Analytics Platforms](./subscription-analytics-platforms.md)
- [Startup Banking & Corporate Spend Platforms](./startup-banking-corporate-spend-platforms.md)
- [HR & Payroll Tools](./hr-payroll-tools.md) — clinician HR adjacent
- [eSignature & Document Signing Tools](./esignature-document-signing-tools.md) — patient consent
- [Contract Lifecycle Management Platforms](./contract-lifecycle-management-clm-platforms.md) — BAA management
- [Financial Data & Open Banking APIs](./financial-data-open-banking-apis.md)
- [Compliance Automation Tools](../devops-and-tools/compliance-automation-tools.md) — Vanta / Drata / Secureframe
- [AI Moderation & Trust & Safety Platforms](../ai-development/ai-moderation-trust-safety-platforms.md)
- [AI Customer Support Agents](../ai-development/ai-customer-support-agents.md)
- [Claude](../ai-models/claude.md)
- [OpenAI GPT](../ai-models/openai-gpt.md)
- [Google Gemini](../ai-models/google-gemini.md)
- [AWS Bedrock](../cloud-and-hosting/aws-bedrock.md)
- [AWS](../cloud-and-hosting/aws.md)
- [Azure](../cloud-and-hosting/azure.md)
- [Azure OpenAI](../cloud-and-hosting/azure-openai.md)
- [Google Cloud](../cloud-and-hosting/google-cloud.md)
- [Google Vertex AI](../cloud-and-hosting/google-vertex-ai.md)
- [AWS SES](../backend-and-data/aws-ses.md)
- [Email Providers](../backend-and-data/email-providers.md)
- [SMS / Voice APIs](../backend-and-data/sms-voice-apis.md)
- [Notification Providers](../backend-and-data/notification-providers.md)
- [Database Providers](../backend-and-data/database-providers.md)
- [Postgres](../backend-and-data/postgres.md)
- [Vector Database Providers](../backend-and-data/vector-database-providers.md)
- [Document Parsing / OCR Services](../backend-and-data/document-parsing-ocr-services.md)
- [Machine Translation APIs](../backend-and-data/machine-translation-apis.md)
- [Video / Voice Conferencing APIs](../backend-and-data/video-voice-conferencing-apis.md)
- [Webhook Delivery Services](../backend-and-data/webhook-delivery-services.md)
- [Performance Management Tools](./performance-management-tools.md)
- [Recruiting / ATS Platforms](./recruiting-ats-platforms.md)
- [Application Security Tools](../devops-and-tools/application-security-tools.md)
- [Bot Detection Providers](../devops-and-tools/bot-detection-providers.md)
- [Error Monitoring Providers](../devops-and-tools/error-monitoring-providers.md)
- [Observability Providers](../devops-and-tools/observability-providers.md)
- [BI / Analytics Tools](../devops-and-tools/bi-analytics-tools.md)
- [Product Analytics Providers](../devops-and-tools/product-analytics-providers.md)
- [Customer Data Platforms](../marketing-and-seo/customer-data-platforms.md)
