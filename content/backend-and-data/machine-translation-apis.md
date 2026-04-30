# Machine Translation APIs: DeepL, Google Translate, AWS Translate, Azure Translator, OpenAI / Claude, Lilt, ModernMT

[⬅️ Backend & Data Overview](../backend-and-data/)

If you're building a B2B SaaS in 2026 that needs real-time text translation — translating user-generated content, AI chat responses, in-product strings on demand, customer support tickets across languages — you need a machine translation (MT) API. The naive approach: Google Translate widget. The structured approach: pick an API based on quality (DeepL leads for European languages; Google for breadth; LLM-based for context), price per character, language coverage, and whether you need glossary support / formality control / domain customization. The right pick depends on volume, language pairs, and whether you also need a TMS (separate concern; see `localization-translation-tools.md`).

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Pricing (per 1M chars) | Indie Vibe | Best For |
|---|---|---|---|---|---|
| DeepL | Premium MT | 500K chars/mo free | $25 (Pro); $5.50 (API Pro) | High | EU language quality leader |
| Google Translate | Broad MT | 500K chars/mo free | $20 | Medium | Broadest language support |
| AWS Translate | AWS MT | 2M chars/mo free 12mo | $15 | Medium | AWS-native |
| Azure Translator | Microsoft MT | 2M chars/mo free | $10 | Medium | Azure-native; cheap |
| OpenAI GPT-4o (translation) | LLM-based | Free trial | $2-15 (token-based) | High | Context-aware / nuanced |
| Anthropic Claude (translation) | LLM-based | Trial | $3-75 (token-based) | High | High-quality / long-context |
| Lilt | Adaptive MT + post-edit | Custom | Enterprise | Medium | Enterprise + human-in-loop |
| ModernMT | Adaptive MT | Trial | $30+ | Medium | Adaptive / domain-aware |
| Yandex Translate | Russian-strong MT | Free tier | $5-15 | Medium | Russian / Slavic |
| Baidu Translate | Chinese-strong MT | Free tier | Custom | Medium | Chinese-heavy |
| Smartling | TMS + MT | Custom | Enterprise | Low | Enterprise TMS-first |
| Smartcat | TMS + MT marketplace | Free tier | Per-doc | High | Hybrid MT + human |
| Crowdin MT | TMS-bundled MT | Bundled | Bundled | Medium | Crowdin users |
| Reverso | Specialty translator | Free tier | Per-call | Medium | Translation memory + dictionary |
| LibreTranslate | OSS self-hosted | Free | Self-host | Very high | OSS / privacy |
| Argos Translate | OSS Python lib | Free | Self-host | Very high | OSS offline |

The first decision is **quality vs price vs language coverage**: DeepL leads quality for major European languages; Google leads coverage (133+ languages); LLMs lead context-awareness; OSS leads privacy. The second decision is **integration scope**: just translation API vs full TMS workflow.

## Decide What You Need First

### Real-time chat / message translation (the 30% case)
You need to translate user messages between languages on the fly (chat apps, customer support, social).

Right tools:
- **Google Translate** — broad language coverage
- **DeepL** — better quality for EU languages
- **Azure Translator** — cost-effective
- **LLM-based (Claude / GPT-4o)** — context + nuance

### AI-generated content translation (the 25% case)
Your AI feature generates content; need it in multiple languages.

Right tools:
- **LLM-based (Claude / GPT-4o)** — generate in target language directly
- **DeepL / Google** — translate after generation

### Customer support across languages (the 20% case)
Support tickets in dozens of languages; agents speak few.

Right tools:
- **DeepL** — quality matters
- **Google Translate** — breadth
- **Azure Translator** — bundled with Microsoft helpdesk products

### Document translation (the 15% case)
Translate uploaded PDFs / DOCX / XLSX files.

Right tools:
- **DeepL Pro** — supports DOCX, PPTX, PDF directly
- **Google Translate API** — text only; pre-process docs
- **Smartcat** — hybrid MT + human review
- **Lilt** — enterprise post-edit

### High-quality / branded translation (the 10% case)
Marketing content; legal docs; product descriptions where quality matters.

Right tools:
- **DeepL** with glossary
- **Lilt** with human-in-loop
- **ModernMT** with domain training
- **Claude / GPT-4o** with prompted style

## Provider Deep-Dives

### DeepL — quality leader for European languages
Founded 2017 (Germany). Considered best-quality MT for major languages.

Pricing in 2026:
- Free: 500K chars/mo
- API Free: 500K chars/mo (separate)
- Pro: $9-25/user/mo (browser/web)
- API Pro: $5.50/1M chars + $0.000005/char beyond
- Enterprise: custom

Languages: 33+ (English, German, French, Spanish, Portuguese, Italian, Dutch, Polish, Russian, Chinese, Japanese, Korean, etc.)

Features: high-quality translation; glossary support; formality control (formal/informal); document translation (DOCX, PDF, PPTX); CAT-tool integration.

Why DeepL wins: quality measurably better than Google for major European languages; glossary + formality unique among MT APIs.

Trade-offs: smaller language list (33 vs Google's 133+); pricier than Google.

Pick if: quality matters; major European languages; brand-conscious. Don't pick if: need many low-resource languages.

### Google Translate API — breadth leader
Pricing in 2026: 500K chars/mo free; $20/1M chars (Cloud Translation Basic); Advanced (custom models) $80/1M chars.

Languages: 133+ (most of any commercial provider).

Features: text translation; document translation; auto-detect; custom models (with training); glossary; batch translation.

Why Google: broadest language support; reliable; well-documented; familiar.

Trade-offs: quality good but not best for major languages; no formality control (formality limited).

Pick if: need broad language coverage. Don't pick if: quality-first for European languages (DeepL stronger).

### AWS Translate — AWS-native
Amazon's MT service.

Pricing in 2026: $15/1M chars; 2M chars/mo free for first 12 months.

Languages: 75+.

Features: real-time + batch; custom terminology; profanity filter; formality (some langs); active custom translation (with human-edited training data).

Why AWS: native AWS integration (Lambda, SDK, IAM); reasonable pricing.

Pick if: AWS-native infrastructure. Don't pick if: quality-first or non-AWS.

### Azure Translator — Microsoft-native
Microsoft's MT service.

Pricing in 2026: 2M chars/mo free; $10/1M chars S1 (cheap); custom $40/1M chars.

Languages: 100+.

Features: real-time + batch; document translation; custom translator (train on your data); transliteration; dictionary lookup; bilingual dictionary; profanity filter.

Why Azure: cheapest enterprise MT; broad language; custom training; Microsoft 365 integration.

Trade-offs: less brand recognition; quality similar to Google.

Pick if: Azure-native; cost-priority; need custom training. Don't pick if: don't trust Microsoft.

### LLM-based translation (Claude / GPT-4o)
Use vision / chat LLMs for translation.

Pricing in 2026:
- Claude Sonnet 4.6: $3/1M input + $15/1M output tokens
- Claude Opus 4.7: $15/1M input + $75/1M output tokens
- GPT-4o: $2.50/1M input + $10/1M output

Why LLM-based:
- Context-aware (knows surrounding sentences)
- Nuanced (idioms, tone, register)
- Customizable via prompts ("translate informally", "preserve legal terms")
- Long-context (entire docs in single call)
- Good for low-resource languages improving rapidly

Trade-offs:
- Cost per request varies (1 character ≈ 0.25 tokens roughly)
- Slower than purpose-built MT
- Hallucination risk (rare but possible)
- Rate limits

Pick if: low-medium volume; nuance matters; need style control. Don't pick if: high volume + cost-sensitive.

### Lilt — adaptive MT with human-in-loop
Founded 2015. Enterprise MT + post-edit.

Pricing: enterprise custom.

Features: adaptive MT (learns from corrections); human-in-loop post-edit; CAT tool; project management.

Pick if: enterprise; high-stakes content; willing to invest in human review. Don't pick if: pure-API SMB.

### ModernMT — adaptive domain MT
Adaptive MT engine.

Pricing: $30+/1M chars enterprise.

Features: domain adaptation; segment-level training; integration with TMS.

Pick if: domain-specific content (legal, medical). Don't pick if: general-purpose.

### Yandex / Baidu — regional specialists
Strong in Russian (Yandex) and Chinese (Baidu).

Pick if: heavy Russian or Chinese workflow.

### LibreTranslate / Argos Translate — OSS
Self-hosted OSS MT.

Pricing: free; you host.

Quality: 60-80% of commercial; varies by language.

Pick if: privacy-critical; offline; cost-priority.

## What MT APIs Won't Do

Buying an MT API doesn't:

1. **Replace human translators for high-stakes content.** Legal contracts, marketing campaigns benefit from human review.
2. **Handle context across documents.** API translates the input string; doesn't know related context unless you provide it.
3. **Solve cultural localization.** Translation ≠ localization. Date formats, currencies, holidays, measurement units all need separate handling.
4. **Preserve brand voice automatically.** Glossary + style instructions help; not perfect.
5. **Translate dynamic content perfectly.** "Click here" and "here" link text break in non-English flow.

The honest framing: MT is 80-95% of the way there for most content. The last 5-20% requires human or LLM nuance.

## Pricing Comparison — Realistic Volume

For 10M chars/month (e.g., chat translation in B2B SaaS):

- **DeepL API Pro**: 10M × $5.50/1M = $55/mo
- **Google Translate**: 10M × $20/1M = $200/mo  
- **AWS Translate**: 10M × $15/1M = $150/mo
- **Azure Translator (S1)**: 10M × $10/1M = $100/mo
- **Claude Sonnet 4.6**: ~2.5M tokens × $3 input + 2.5M × $15 output = ~$45/mo (varies)
- **GPT-4o**: ~$30/mo at similar volume

For 100M chars/month:

- **DeepL Enterprise**: negotiate; typically $300-500/mo
- **Google Translate**: $2,000/mo
- **Azure (S1)**: $1,000/mo
- **Claude Sonnet**: ~$450/mo
- **Self-hosted LibreTranslate**: hosting only ($50-200/mo)

The cost surprise: LLM-based translation is competitive at low-medium volume; specialty MT cheaper at high volume.

## LLM vs Traditional MT — 2026 Decision

```text
Decide LLM-based vs traditional MT.

Use LLM-based (Claude / GPT-4o) when:
- Context matters (surrounding sentences inform translation)
- Need style control (formal / casual / brand voice)
- Low-medium volume (<50M chars/mo)
- Nuance over speed
- Multi-language at once (one call, many outputs)

Use traditional MT (DeepL / Google / Azure) when:
- High volume (>100M chars/mo)
- Speed-priority (LLMs slower)
- Specific language quality (DeepL for EU)
- Custom training (Azure Custom Translator, Google AutoML)
- Compliance requires deterministic output

Use OSS (LibreTranslate) when:
- Privacy-critical
- Cost-priority
- Offline / air-gapped

Hybrid pattern (recommended for many):
- Tier 1: cheap MT for bulk (Azure / Google)
- Tier 2: LLM for quality-critical
- Tier 3: human for highest-stakes

For [USE CASE]:
1. Recommended approach
2. Cost calculation
3. Quality tradeoffs
4. Latency expectations
5. Migration path if needs change
```

The 2026 trend: LLMs are competitive with specialty MT for many use cases. DeepL still wins for major European-language quality + cost; LLMs win for context + style control.

## Pragmatic Stack Patterns

### Pattern 1: Indie SaaS adding MT ($0-50/mo)
- **DeepL Free** OR **Azure Translator Free Tier**
- Or LLM-based at low volume
- Total: free initially

### Pattern 2: SMB B2B SaaS ($50-500/mo)
- **DeepL API Pro** for quality
- Or **Azure Translator** for breadth + cost
- 10-100M chars/mo

### Pattern 3: Mid-market ($500-2K/mo)
- **DeepL Pro** or negotiated enterprise
- Glossary + formality control
- Custom terminology

### Pattern 4: AI-product translation ($cheap-expensive)
- **LLM-based** via Vercel AI Gateway
- Context-aware translation
- Multi-step: generate → translate or generate-in-target-language

### Pattern 5: Enterprise legal / brand ($$$+)
- **Lilt** or **Smartling** with human-in-loop
- Translation memory
- Post-edit workflow

### Pattern 6: Privacy / OSS ($hosting)
- **LibreTranslate** self-hosted
- Or specialty open-source models (NLLB, Marian)

### Pattern 7: Document translation
- **DeepL Pro** for DOCX / PDF native
- Or convert to text first → translate → re-format

## Decision Framework: Three Questions

1. **What's the use case?**
   - Chat / messages → Google / DeepL / Azure / LLM
   - AI content → LLM-based
   - Customer support → DeepL / Google
   - Documents → DeepL Pro / Smartcat
   - High-stakes → Lilt / Smartling + human review

2. **What languages matter?**
   - Major EU languages → DeepL (quality)
   - Broad coverage → Google (133+)
   - Russian → Yandex
   - Chinese → Baidu
   - Many low-resource → Google / LLM-based

3. **What's your scale + budget?**
   - <500K chars/mo → free tiers
   - 500K-50M chars/mo → DeepL / Azure
   - 50M-500M → Azure / Google + negotiate
   - 500M+ → enterprise contracts; consider self-host

## Verdict

For 30% of B2B SaaS in 2026 needing MT: **DeepL** for European-language quality.

For 25%: **Google Translate** for breadth.

For 15%: **Azure Translator** for cost + Microsoft alignment.

For 15%: **LLM-based (Claude / GPT-4o)** for context + style.

For 5%: **Lilt / Smartling** for enterprise / human-in-loop.

For 5%: **Yandex / Baidu** for Russian / Chinese specialty.

For 5%: **LibreTranslate** for OSS / privacy.

The mistake to avoid: **defaulting to Google because of name recognition**. DeepL is measurably better for major EU languages at similar price. Test both on actual content.

The second mistake: **using LLMs at high volume without cost analysis**. $30/mo at 10M chars vs $300/mo at 100M chars — math first.

The third mistake: **expecting MT to handle localization**. Translation is words; localization is dates, currencies, formats, cultural references. Different problems.

## See Also

- [Localization & Translation Tools](../marketing-and-seo/localization-translation-tools.md) — TMS for product localization
- [Voice AI Providers](../ai-development/voice-ai-providers.md) — TTS / STT
- [Email Providers](./email-providers.md) — translated transactional emails
- [API Integration](./api-integration.md) — generic patterns
- [VibeReference: Anthropic Claude](https://vibereference.dev/ai-models/claude) — Claude-based translation
- [VibeReference: OpenAI GPT](https://vibereference.dev/ai-models/openai-gpt) — GPT-based translation
- [VibeReference: AI Gateways](https://vibereference.dev/cloud-and-hosting/ai-gateways) — unified routing
- [VibeReference: Vercel AI Gateway](https://vibereference.dev/cloud-and-hosting/vercel-ai-gateway) — Vercel AI Gateway
- [VibeReference: Document Parsing & OCR Services](./document-parsing-ocr-services.md) — extract text before translating
- [VibeReference: SMS & Voice APIs](./sms-voice-apis.md) — SMS in multiple languages
- [VibeWeek: Internationalization](https://vibeweek.dev/6-grow/internationalization-chat) — i18n implementation
- [VibeWeek: Customer Support](https://vibeweek.dev/6-grow/customer-support-chat) — multi-language support
- [VibeWeek: AI Features Implementation](https://vibeweek.dev/6-grow/ai-features-implementation-chat) — AI translation features
- [LaunchWeek: International Expansion Playbook](https://launchweek.dev/3-distribute/international-expansion-playbook) — translation in expansion
- [LaunchWeek: Vertical SaaS Positioning](https://launchweek.dev/1-position/vertical-saas-positioning) — vertical-specific terminology
