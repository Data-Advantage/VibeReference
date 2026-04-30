# AI Moderation & Trust & Safety Platforms: Hive, Spectrum Labs, Sift, WebPurify, OpenAI Moderation, Google Perspective, Azure Content Safety, Amazon Rekognition

[⬅️ AI Development Overview](../ai-development/)

If you're shipping any product where users post content — comments, profiles, photos, videos, chat messages, marketplace listings, AI-generated outputs — you eventually need content moderation. Not "would be nice to have" — actually required, because (a) users will post things that get you banned from the App Store, sued, or in the news, (b) regulations (EU DSA, UK Online Safety Act, US KOSA / state laws) increasingly mandate it, and (c) advertisers / payment processors / partners require it as table stakes.

The moderation problem split: **content classification** (is this image / text / video safe?), **trust & safety platform** (full workflow: classify → review → action → audit), **AI fraud / abuse detection** (separate from content — account takeover, fake reviews, transactions). All three blur in the marketplace; pick wrong and you'll either over-pay for capability or build the missing pieces in-house when scale forces the issue.

## TL;DR Decision Matrix

| Provider | Type | Strongest at | Pricing Floor | Indie Vibe | Best For |
|---|---|---|---|---|---|
| **General-Purpose AI Classification APIs** | | | | | |
| OpenAI Moderation | Free text moderation API | Text classification | Free | Very high | Indie / startup default for text |
| Google Perspective API | Toxicity / threat / spam scoring | Comment toxicity | Free | High | Comment systems; toxicity-specific |
| Azure AI Content Safety | Microsoft's content safety API | Text + image classification | Pay-per-use | Medium | Azure-aligned shops |
| Amazon Rekognition (Content Moderation) | Image / video classification | Image / video moderation | Pay-per-use | Medium | AWS-aligned; visual content |
| **Specialized AI Moderation Platforms** | | | | | |
| Hive Moderation | AI-first general moderation | Image / video / text / audio | Custom | Medium | Mid-market+ multi-modal |
| WebPurify | Image + video + text moderation | Human + AI hybrid | $200+/mo | Medium | Hybrid workflow at scale |
| Sightengine | API-first classification | Image / video moderation | Free trial; $25+/mo | High | Indie + SMB visual moderation |
| Imagga | Image classification + moderation | Image-focused | Free / $49+/mo | High | Image-only use cases |
| Bumble's Private Detector | Open source nude detector | Nude image detection | Free + OSS | Very high | Add specific NSFW detection without full platform |
| **Trust & Safety Platforms (full workflow)** | | | | | |
| Spectrum Labs (Spectrum Trust & Safety) | Workflow + behavior modeling | Conversational + behavioral analysis | Custom | Low | Mid-market+ T&S teams |
| TwoHat (Microsoft Community Sift) | Workflow + AI moderation | Real-time chat moderation | Custom | Low | Gaming / chat-heavy |
| Hive Workflow | Hive's workflow layer | Multi-modal + workflow | Custom | Medium | Hive customers wanting workflow |
| Cinder | Modern T&S workflow platform | Modern UX; queue management | Custom | Medium | Newer T&S teams |
| Tremau | EU-focused T&S platform | DSA compliance + workflow | Custom | Medium | EU-regulated platforms |
| ActiveFence | Threat intelligence + moderation | Proactive threat detection | Custom | Low | Large platforms; CSAM / extremism |
| Checkstep | Workflow + AI for SMB | Mid-market workflow | Custom | Medium | SMB T&S without enterprise pricing |
| **Fraud / Abuse Detection (adjacent)** | | | | | |
| Sift | Fraud + abuse detection | Behavioral models for fraud | Custom | Low | Marketplaces; account fraud |
| Castle | Account abuse detection | Login / signup abuse | Free / paid | High | Account takeover protection |
| Stytch DFP | Device fingerprinting + abuse | Device-level fraud signals | Custom | Medium | Auth-adjacent abuse |
| **Specialized: CSAM / Extremism** | | | | | |
| Thorn (Safer) | CSAM detection | Hash-matching + AI for CSAM | Free for non-profits; commercial paid | n/a | Mandatory for any user-generated visual content platform |
| PhotoDNA (Microsoft) | CSAM hash matching | Hash detection | Free for qualifying orgs | n/a | Mandatory backbone for image platforms |
| Tech Coalition / GIFCT | Hash-sharing networks | Coordinated cross-platform hash sharing | Free | n/a | Industry standard for known-bad |
| **DIY** | | | | | |
| Bring-your-own LLM (Claude / GPT) for moderation | Use Claude / GPT to classify | Flexible; custom rules | Per-token | High | Custom rules + LLM judgment |
| Open-source models (Detoxify, NSFW models) | OSS classification | Hands-on | Free | Very high | Self-hosted; cost-conscious |

The first decision is **what content types you have** (text vs. image vs. video vs. audio vs. all) and **what scale + risk** (indie comment system vs. dating app vs. social network vs. children's platform).

## Decide What You Need First

Moderation tools are not interchangeable. The same platform at different scales and content mixes has very different correct picks.

### Indie / Pre-Series A with text only (the 35% case)

You ship text-only UGC: comments, posts, AI-generated outputs. Volume is <10K items/day. Risk is moderate (spam, profanity, harassment) — not at the level of dating-app safety or child-platform mandates. **Use OpenAI Moderation API (free)** as a first-pass filter. Build your own action workflow (block / hide / queue for review) with your existing admin UI. Add a manual review queue for items above the API confidence threshold.

### Indie / Pre-Series A with images + video (the 15% case)

You ship visual UGC: avatars, photo posts, video uploads. Volume is moderate. Risk is higher — App Store / Play Store reject apps with NSFW that wasn't filtered. **Use Sightengine or Hive's API** for image classification at $25-200/mo. Add hash-matching against PhotoDNA / NCMEC for CSAM (mandatory if you're a US service hosting visual UGC).

### Mid-stage product with mixed content (the 25% case)

You're $1M-25M ARR. Multiple content types. Real moderation team forming or a dedicated PM owns trust + safety part-time. **Use Hive Moderation + Cinder** (or similar workflow platform). Hive handles classification; Cinder gives the queue management, action tooling, and audit trail your moderators need.

### Larger platform / regulated (the 15% case)

You're a marketplace, dating app, social network, or have EU DSA obligations. **Hire trust & safety leadership; use Spectrum Labs or TwoHat for behavioral analysis + workflow; integrate with PhotoDNA / Thorn for CSAM**. This is the tier where you have a specific T&S team and real budget.

### Niche: AI / LLM output moderation (the 10% case)

You're shipping LLM outputs to users. The risk is generated content (jailbreaks, prompt injections, harmful generations). Use **OpenAI Moderation + your model's built-in safety** + **Anthropic's claude-haiku as a fast judge** for additional context-aware filtering. The pattern is "moderate the input AND the output."

## Provider Deep-Dives

### OpenAI Moderation API

OpenAI's free moderation endpoint. Classifies text into categories: hate, harassment, self-harm, sexual, violence, etc. Multi-language. Free.

Strengths:

- **Free** — no per-request cost
- Multi-category classification with confidence scores
- Multi-language support
- Used in production by tens of thousands of apps
- Reliable; well-maintained

Weaknesses:

- Text only (no image / video moderation)
- Can be a privacy concern for sensitive text (data sent to OpenAI)
- Less customizable than commercial options

Use OpenAI Moderation when:

- You're shipping text UGC and need a default text classifier
- Privacy / data residency aren't blocking concerns

### Google Perspective API

Google Jigsaw's toxicity scoring API. Optimized for comment systems (originally built for NYT comment threads).

Strengths:

- **Best for toxicity scoring** specifically (insults, threats, profanity)
- Free tier (1 QPS); enterprise plans available
- Multi-language
- Strong research backing

Weaknesses:

- Narrower scope than OpenAI Moderation
- Toxicity != all moderation needs (doesn't flag e.g. CSAM, drug sales)

Use Perspective when:

- You're moderating comment systems and want the toxicity angle specifically

### Azure AI Content Safety

Microsoft's content safety API. Multi-modal — text + image. Bundled with Azure ecosystem.

Strengths:

- **Multi-modal** (text + image in one platform)
- Categorical scores (hate, sexual, violence, self-harm)
- Custom block / allow lists
- Tightly integrates with Azure ecosystem

Weaknesses:

- Pay-per-use; can get expensive at high volume
- Needs Azure account
- Less recognized brand than OpenAI / Google for moderation

Use Azure Content Safety when:

- You're already in Azure ecosystem
- You need text + image in one API

### Amazon Rekognition (Content Moderation)

AWS service for image + video classification including unsafe content detection.

Strengths:

- **Strong image + video moderation** (NSFW, violence, weapons, etc.)
- Hierarchical labels (e.g., Suggestive → Female Swimwear Or Underwear)
- Custom model training available
- Tightly integrates with AWS

Weaknesses:

- Image / video only (text needs separate solution)
- AWS billing complexity
- Less specialized than dedicated moderation platforms

Use Rekognition when:

- You're AWS-aligned with visual UGC
- You need video frame-level moderation

### Hive Moderation

AI-first moderation platform. Multi-modal — text, image, video, audio. Founded 2017. Used by Reddit, Bumble, Vimeo, Tinder.

Strengths:

- **Best multi-modal coverage** in one platform
- Strong image + video classification (deep models trained on moderation-specific data)
- Audio moderation (rare in the category)
- API-first; integrates into your workflow
- Hive Workflow (separate product) layers admin tooling on top
- Used by major B2C platforms

Weaknesses:

- **Sales-led pricing** — sales-led process; not transparent
- Mid-market+ focused; indie pricing not their target
- Workflow product less mature than dedicated T&S platforms

Use Hive when:

- You have multi-modal content (especially video / audio)
- Mid-market budget for moderation
- You want one vendor across content types

### WebPurify

Hybrid AI + human moderation. Founded 2007. Targets brands needing high-accuracy image / video / text review.

Strengths:

- **Hybrid model** — AI flags; human moderators review
- 24/7 human review available
- Image + video + text + profile moderation
- Solid for brands with strict accuracy requirements

Weaknesses:

- Human-review tier is expensive
- Less developer-friendly than pure-API options
- Mid-market focused

Use WebPurify when:

- You need human-in-the-loop accuracy (false positives are costly)
- Brand safety is critical

### Sightengine

Indie-friendly API for image / video / text classification. Founded 2014.

Strengths:

- **Accessible pricing** ($25-300+/mo tiers)
- Multi-modal (text + image + video)
- API-first; easy integration
- Good for SMB / indie

Weaknesses:

- Smaller customer base than Hive
- Models less aggressive than enterprise tools

Use Sightengine when:

- Indie / SMB visual moderation
- Pricing matters

### Imagga

Image-focused classification + moderation. Niche.

Use Imagga when:

- Image-only use case
- You want Imagga's tagging + moderation combined

### Spectrum Labs

Behavioral + content moderation platform. Founded 2017. Targets mid-market+ with sophisticated T&S needs.

Strengths:

- **Behavioral analysis** beyond content — flag patterns suggesting predator grooming, harassment escalation
- Conversational AI understanding (multi-message context)
- Strong for chat / messaging platforms
- Workflow + queue management for moderators

Weaknesses:

- Enterprise pricing
- Sales-led process
- Heavier than indie / SMB needs

Use Spectrum when:

- You're a chat / messaging platform with complex behavioral risk
- You have a T&S team

### TwoHat (Microsoft Community Sift)

Real-time chat moderation. Acquired by Microsoft 2021. Strong in gaming.

Strengths:

- **Real-time chat** moderation at gaming scale
- Microsoft-backed
- Strong workflow tooling

Weaknesses:

- Gaming-focused; less suited for non-chat use cases
- Microsoft ecosystem alignment helps

Use TwoHat when:

- Gaming or real-time chat product

### Cinder

Modern T&S workflow platform. Founded by ex-Meta T&S leaders. Targets the "we need T&S workflow but don't want enterprise dinosaur tools" gap.

Strengths:

- **Modern UX** for T&S queues, decisioning, actioning
- Integrates with classification APIs (Hive, OpenAI, etc.)
- Strong audit + compliance reporting
- Good DSA / regulatory reporting

Weaknesses:

- Newer; smaller customer base
- Sales-led pricing

Use Cinder when:

- You're standing up a T&S team and need modern workflow tooling
- You'll integrate classification APIs separately

### ActiveFence

Threat intelligence + moderation. Specialized in proactive threat detection (extremism, CSAM, foreign disinformation).

Strengths:

- **Proactive threat detection** — finds bad actors before they post
- Strong for high-risk platforms (large social, marketplace, dating)
- CSAM + counter-extremism focus

Weaknesses:

- Enterprise pricing
- Most suited for large platforms

Use ActiveFence when:

- You're a large platform with regulatory + reputational stakes

### Tremau

EU-focused T&S platform. Strong on DSA (Digital Services Act) compliance.

Strengths:

- **DSA-native** — built for EU regulatory compliance
- Workflow + reporting tooling

Use Tremau when:

- You're an EU-regulated platform

### Checkstep

SMB-friendly T&S workflow.

Use Checkstep when:

- SMB / mid-market wanting T&S workflow without enterprise pricing

### CSAM-specific: PhotoDNA, Thorn (Safer), GIFCT

If you host visual UGC in the US, **CSAM detection is mandatory** (NCMEC reporting under federal law). Hash-matching is the foundation.

- **PhotoDNA**: Microsoft's free hash-matching for known CSAM. Free for qualifying orgs. Industry baseline.
- **Thorn (Safer)**: hash + AI for CSAM. Free for non-profits; commercial paid. AI can detect new CSAM, not just known.
- **GIFCT**: Global Internet Forum to Counter Terrorism — shared hash database for terrorism content.
- **NCMEC CyberTipline**: where you report findings (US legal requirement).

These aren't optional in 2026 for any visual-UGC platform. Bake them in from day 1.

### Sift / Castle / Stytch DFP (Fraud-adjacent)

Fraud detection isn't content moderation but adjacent. Sift detects fraud signals (account takeover, fake reviews, transaction fraud). Castle detects account abuse. Stytch DFP provides device fingerprinting.

Use these alongside content moderation — they catch different problems.

### LLM-as-Moderator (DIY)

For custom rules or context-heavy moderation, use Claude or GPT as a moderator.

```
Prompt: "You are a content moderator for a [platform type]. The community guidelines are [...]. Classify this post: '[content]'. Output JSON: {category, severity, reasoning}."
```

Strengths:

- **Maximum flexibility** — custom rules, context-aware
- Can explain its reasoning (useful for moderator review)
- Cheap with Haiku-tier models

Weaknesses:

- Slower than dedicated APIs
- Per-token cost adds up at scale
- Prompt-injection risk if you're moderating user-controlled content

Use LLM-as-moderator when:

- You have custom rules generic APIs don't capture
- You want explainable decisions

## What These Tools Won't Do

**Don't expect any tool to be 100% accurate.** False positives (blocking good content) and false negatives (letting bad content through) both happen. Build human-review fallback for any decision that matters.

**Don't expect a single API to solve all moderation.** Real moderation = classification + workflow + actions + audit + appeals + regulatory reporting. Tools cover slices.

**Don't expect AI to replace humans.** AI handles volume. Humans handle edge cases, appeals, and the nuanced decisions that determine whether your platform is fair. Budget for human moderators.

**Don't expect "set it and forget it."** Moderation policies evolve. Models drift. New abuse patterns emerge. Plan for continuous tuning.

**Don't expect compliance to be solved by a vendor.** EU DSA, UK Online Safety Act, US KOSA, COPPA, child safety mandates — these require legal + product + engineering coordination, not just a tool purchase.

**Don't expect content moderation to handle account fraud.** Fraud requires behavioral signal tools (Sift / Castle).

## Pragmatic Stack Patterns

### Indie / Solo Dev Text-Only

- OpenAI Moderation API for first-pass filter
- Manual review queue in your existing admin UI
- Simple state machine: classified → action (allow / hide / queue / ban)
- Total: $0/mo

### Indie / Solo Dev with Images

- OpenAI Moderation for text
- Sightengine or Hive Moderation for images
- PhotoDNA hash-check for CSAM (mandatory)
- DIY admin queue
- Total: $25-200/mo + free PhotoDNA

### Series A B2C with UGC

- Hive Moderation (multi-modal classification)
- Cinder for T&S workflow
- PhotoDNA + Thorn for CSAM
- Sift for account fraud
- Sightengine as backup / cost-control
- 1-2 dedicated humans for review queue
- Total: $5K-25K/mo + people

### Mid-Market Platform / Marketplace

- Hive + Spectrum Labs
- Cinder or in-house workflow
- ActiveFence for proactive threat
- T&S team (4-10 people)
- Custom rules + LLM-as-judge for edge cases
- Total: $25K-150K/mo + team

### EU-Regulated Platform

- Tremau (DSA compliance) + Hive
- DSA reporting workflow
- Documented appeal process
- Out-of-court dispute settlement (ODS) integration
- Total: enterprise-tier

## Decision Framework: Six Questions

1. **What content types?**
   - Text only: OpenAI Moderation / Perspective
   - Image: Sightengine / Hive / Rekognition
   - Video: Hive / Rekognition
   - Audio: Hive
   - All: Hive

2. **What's your scale?**
   - <10K items/day: API-only is fine
   - 10K-1M: API + workflow platform
   - 1M+: enterprise platform + dedicated team

3. **Do you have a T&S team?**
   - No: API-only; build minimal workflow
   - Yes: workflow platform (Cinder / Spectrum)

4. **CSAM exposure?**
   - Visual UGC of any kind: PhotoDNA + Thorn (mandatory)
   - Text-only: less critical (still possible via grooming)

5. **EU users?**
   - Yes: DSA compliance; consider Tremau
   - No: less regulated baseline

6. **Custom rules beyond standard categories?**
   - Yes: LLM-as-judge supplement
   - No: standard API sufficient

## Verdict

**Indie text-only**: OpenAI Moderation. Free. Done.

**Indie visual**: Sightengine or Hive's lower tier + PhotoDNA. Don't skip CSAM.

**Series A B2C**: Hive + Cinder + PhotoDNA + Thorn. The default modern stack.

**Mid-market+**: Hive or Spectrum + Cinder + ActiveFence + dedicated T&S team. Real budget; real impact.

**EU-regulated**: layer Tremau + the regulated reporting workflow.

**LLM output moderation**: built-in safety + OpenAI Moderation pre/post + Claude haiku for context.

The most common mistake is **buying expensive moderation before you have moderation volume**. A $20K/yr Hive contract used 50 times/day is dead money. The second is **skipping CSAM hash-matching** — a single CSAM upload that's not detected and reported is a federal compliance issue and a PR disaster. The third is **over-relying on AI** without human-review fallback for edge cases — false positives drive customer churn; false negatives drive incidents.

## See Also

- [OpenAI Moderation](./openai-moderation.md) — the free baseline
- [Content Moderation Pipeline (VibeWeek)](https://vibeweek.dev/6-grow/content-moderation-pipeline-chat.md)
- [Account Suspension & Fraud Holds (VibeWeek)](https://vibeweek.dev/6-grow/account-suspension-fraud-holds-chat.md)
- [Compliance Automation Tools](../devops-and-tools/compliance-automation-tools.md)
- [Identity Verification & KYC Tools](../auth-and-payments/identity-verification-kyc-tools.md)
- [Fraud Detection Providers](../auth-and-payments/fraud-detection-providers.md)
- [Bot Detection Providers](../devops-and-tools/bot-detection-providers.md)
- [CAPTCHA & Bot Protection (VibeWeek)](https://vibeweek.dev/6-grow/captcha-bot-protection-chat.md)
- [Rate Limiting & Abuse (VibeWeek)](https://vibeweek.dev/6-grow/rate-limiting-abuse-chat.md)
- [AI Customer Support Agents](./ai-customer-support-agents.md)
- [LLM Observability Providers](./llm-observability-providers.md)
- [LLM Evaluation & Prompt Testing Platforms](./llm-evaluation-prompt-testing-platforms.md)
- [Claude Vision Guide](./claude-vision-guide.md)
- [AI SDK](./ai-sdk.md)
- [AI SDK Providers](./ai-sdk-providers.md)
- [Application Security Tools](../devops-and-tools/application-security-tools.md)
- [Image Generation Providers](../image-generation/image-generation.md) — moderate generated outputs
- [Cookie Consent & Privacy Tools](../marketing-and-seo/cookie-consent-privacy-tools.md)
- [Customer Support Tools](../product-and-design/customer-support-tools.md)
- [Customer Feedback & Feature Request Tools](../product-and-design/customer-feedback-feature-request-tools.md)
- [Live Chat Widget Tools](../product-and-design/live-chat-widget-tools.md)
- [Google Generative AI](./google-generative-ai.md)
- [Claude](../ai-models/claude.md)
- [OpenAI GPT](../ai-models/openai-gpt.md)
- [Audit Logs (VibeWeek)](https://vibeweek.dev/6-grow/audit-logs-chat.md)
