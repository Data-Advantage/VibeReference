# Localization & Translation Tools: Lokalise, Crowdin, Phrase, Transifex, Tolgee, Weblate, Localizely, Smartling

[⬅️ Marketing & SEO Overview](../marketing-and-seo/)

If you're shipping a SaaS in 2026 and serving customers in non-English markets, you need a translation management system (TMS). This is the consolidated comparison. Most indie founders default-buy Lokalise (good but expensive at scale), self-roll a JSON-files-in-git approach (works until you have 5+ languages), or skip i18n entirely and lose the EU market. The right pick depends on whether you're translating a marketing site (Crowdin / Smartling), a product UI (Lokalise / Phrase / Tolgee), or both at scale (Phrase / Smartling enterprise) — they're overlapping but distinct workflows.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Lokalise | Modern TMS for SaaS | Free trial | $120/mo+ | High | Indie/mid-market product |
| Phrase (Memsource merged) | Enterprise TMS | Custom | $$$ | Low | Mid-market+ with translation team |
| Crowdin | Localization platform | Free OSS | $50/mo+ | High | Marketing site + product |
| Transifex | Established TMS | Free OSS | $80/mo+ | Medium | OSS / community translation |
| Tolgee | OSS in-context TMS | Free OSS / Cloud free | $25/mo+ | Very high | Indie SaaS; modern; OSS-friendly |
| Weblate | OSS self-host | Free OSS | $0 + hosting | Very high | OSS purists |
| Localizely | Affordable indie TMS | Free trial | $40/mo+ | High | Budget-conscious indies |
| Smartling | Enterprise translation | Custom | $$$$ | Very low | Enterprise marketing localization |
| POEditor | Simple TMS | Free (1K strings) | $20/mo+ | High | Tiny teams; few languages |
| Locize | i18next-native | Free trial | $20/mo+ | High | Existing i18next users |
| Texterify | OSS budget | Free OSS / Cloud | $20/mo+ | High | OSS-friendly |
| OneSky | Mid-market TMS | Free (limited) | $$$ | Medium | App-store localization |
| LingoHub | Mid-market TMS | Free trial | $60/mo+ | Medium | Mid-market |

The first decision is **what you're translating**. Product UI strings (TMS with developer-focused workflow), marketing pages (TMS with content workflow), legal/compliance docs (translation services + TMS), and user-generated content (machine translation API) are different problems with overlapping tools.

## Decide What You Need First

Tools are not interchangeable. Pick by content type + scale.

### Product UI strings (the 50% case for SaaS)
You have JSON / YAML / .po files in your codebase with translation keys. Need: extract from code, route to translators, integrate back, deploy.

Right tools:
- **Lokalise** — modern indie default; SDK for major frameworks
- **Tolgee** — OSS, in-context editor, modern UX
- **Phrase** — enterprise feature-rich
- **Locize** — if using i18next library
- **Localizely** — budget-friendly

### Marketing site / blog / docs (the 25% case)
You have a marketing site, blog, help docs in CMS. Need: page-level translation, SEO consideration, brand voice consistency.

Right tools:
- **Crowdin** — strong on document workflows
- **Smartling** — enterprise marketing-focused
- **Phrase** — bridges product + marketing
- **Lokalise** — newer page-translation features

### Both (the 20% case for serious international SaaS)
Mid-market+ doing UI + marketing + docs.

Right tools:
- **Phrase** — most comprehensive
- **Lokalise + Crowdin** — two tools
- **Smartling** — enterprise

### OSS / self-hosted (the 5% case)
Principled OSS; minimal-budget; control freaks.

Right tools:
- **Weblate** — most mature OSS TMS; self-host
- **Tolgee Cloud Free** — OSS with cloud option
- **Crowdin OSS** — free for OSS projects
- **Texterify** — OSS

## Provider Deep-Dives

### Lokalise — modern SaaS default
The 2026 default for indie / mid-market SaaS. Founded 2017; raised by Sequoia; strong product-team focus.

Pricing in 2026: Start $120/mo (5 projects, 10K hosted keys), Essential $230/mo, Pro $585/mo+, Enterprise custom. Free 14-day trial.

Features: 30+ file format support (JSON, XLIFF, YAML, .po, iOS strings, Android XML), CLI for CI integration, GitHub/GitLab/Bitbucket integration, in-context editor (browser extension), screenshots upload, translation memory, glossary, machine-translation integration (Google, DeepL, Amazon, Azure), SDK for iOS / Android / web, branching, review workflow, role-based access.

Why Lokalise wins: developer workflow first-class. CLI-driven; fits CI/CD. UX is polished. Translator marketplace if you need humans.

Trade-offs: pricing ramps fast above 10K keys. Some teams outgrow into Phrase. Marketing-site workflows weaker than product workflows.

Pick if: indie / mid-market SaaS with TypeScript / mobile UI strings; want polished UX. Don't pick if: doing marketing-site-heavy translation only.

### Phrase (formerly Memsource + Phrase merged)
Result of Memsource (CAT tool / TMS) acquiring Phrase Strings (developer TMS) in 2021. Now offers TMS, Strings, Orchestrator, Analytics as a suite.

Pricing in 2026: custom; typically $5K-$50K/yr+. Not for indie scale.

Features: comprehensive — handles strings, documents, marketing, video subtitles. Industry-leading translation memory. AI-powered translation. Workflow customization. Analytics. Vendor management.

Why Phrase wins for mid-market+: comprehensive single-vendor solution. Translation team can manage everything in one tool. Strong for regulated industries.

Trade-offs: enterprise pricing; heavy onboarding; UX dated relative to Lokalise / Tolgee.

Pick if: $5M+ ARR with translation team and multiple content types. Don't pick if: indie scale.

### Crowdin — marketing + product, mid-market
Founded 2009 in Ukraine. Originally focused on game / marketing localization; expanded to product. OSS-friendly: free for open-source projects.

Pricing in 2026: Free (OSS), Pro $50/mo, Team $100/mo, Business $250/mo+, Enterprise custom.

Features: 50+ file formats, in-context editor, GitHub integration, Figma plugin, marketing-site workflow (page-level), Crowdin AI for machine translation, vendor marketplace, screenshots.

Why Crowdin: best-in-class for marketing-site + docs translation. Strong community / OSS support. EU privacy alignment.

Trade-offs: product-string workflow good but not Lokalise-level. UI feels older.

Pick if: marketing-site-heavy localization; OSS project; EU-friendly. Don't pick if: pure product strings only.

### Tolgee — OSS in-context modern
Newer (founded 2020 in Czech Republic). OSS with cloud option. Standout feature: in-context editor — translators see translations live in your app.

Pricing in 2026: OSS free (self-host), Cloud Free (1 project / 1K strings), Pro $25/mo+, Enterprise custom.

Features: in-context editor (just hold Alt+click on any text), GitHub/GitLab integration, translation memory, machine-translation integration, JS / iOS / Android / Python SDKs, OSS option.

Why Tolgee is appealing: modern UX; OSS option; in-context editor is a real workflow win; pricing reasonable.

Trade-offs: smaller ecosystem than Lokalise; younger company. Fewer integrations.

Pick if: indie SaaS; OSS-friendly; want modern UX without Lokalise pricing. Don't pick if: enterprise procurement insists on bigger vendor.

### Transifex — established TMS
Founded 2009. Long-standing OSS-friendly TMS. Slightly losing share to Lokalise / Crowdin in 2026.

Pricing in 2026: Free for OSS, Starter $80/mo+, Growth $200/mo+, Enterprise custom.

Features: integration ecosystem, translation memory, GitHub integration, mobile SDKs.

Pick if: existing Transifex user; OSS project. Don't pick if: starting fresh — Lokalise / Crowdin / Tolgee deliver more.

### Weblate — OSS self-hosted
The OSS choice for principled / cost-conscious shops. Self-host or pay for hosted.

Pricing in 2026: OSS free (self-host), Hosted Libre free (OSS projects), Hosted Basic €19/mo, Hosted Extended €69/mo, Enterprise custom.

Features: 100+ file formats, machine-translation integration, version-control integration (git-native), translation memory, glossary.

Pick if: OSS purist; want full control; have ops budget. Don't pick if: prefer SaaS UX.

### Localizely / Locize / Texterify / POEditor — budget alternatives
- **Localizely** — clean modern UX at $40/mo+; good indie pick
- **Locize** — i18next-native; tight integration if using i18next
- **Texterify** — OSS option with cloud
- **POEditor** — simple TMS; pay-per-string; tiny teams

All viable for budget-conscious indie use.

### Smartling — enterprise marketing
Enterprise-grade. Focused on global brands with translation teams.

Pricing in 2026: custom; typically $25K-$200K+/yr.

Features: comprehensive marketing-localization workflow; AI translation; vendor management; strong for regulated industries.

Pick if: enterprise with marketing-localization budget. Don't pick if: indie or product-string focus.

### OneSky — app-store specialist
Mid-market TMS with app-store-screenshot localization workflow.

Pick if: mobile-app heavy with app-store presence in many markets.

## What Translation Tools Won't Do

Buying a TMS doesn't:

1. **Make translations correct.** TMS routes strings to translators; doesn't verify quality. You need bilingual reviewers or QA workflow.
2. **Replace cultural localization.** A TMS translates words; localization adapts dates, currency, formality, examples, imagery. Different work.
3. **Handle SEO across languages.** Translated marketing copy needs hreflang tags, localized keywords, country-specific TLD strategy. Outside TMS scope.
4. **Make machine translation good enough to ship.** MT (Google / DeepL / Azure) is fine for understanding-grade; not ship-grade for marketing or compliance. Always have humans review.
5. **Solve the "we forgot to extract this string" problem.** Code review + automated string-extraction discipline is on you. TMS surfaces missing keys but doesn't generate them.

The honest framing: a TMS is leverage for a localization process. Without process (extraction discipline, translator workflow, QA), the tool just stores broken translations efficiently.

## Pragmatic Stack Patterns

### Pattern 1: Indie SaaS launching in 2-3 languages ($25-100/mo)
- **Tolgee** OR **Localizely** — TMS at indie price
- **DeepL API** for machine translation first pass
- Human review by bilingual contractors (Upwork, ProZ)
- i18next / next-intl / next-i18next on the code side

Total: $25-200/mo

### Pattern 2: Indie SaaS with traction ($100-500/mo)
- **Lokalise** Start tier
- **DeepL Pro** for MT
- Translator marketplace (Lokalise has one) for human translation
- CLI integration in CI

### Pattern 3: Mid-market product + marketing ($500-2000/mo)
- **Lokalise** for product strings
- **Crowdin** for marketing site
- OR **Phrase** to consolidate
- Dedicated localization owner (often part-time PM)

### Pattern 4: Enterprise translation ($5K+/mo)
- **Phrase** OR **Smartling**
- In-house translation team or vendor agency
- TMS integrated with CMS, app, mobile, support docs
- Translation memory shared across teams

### Pattern 5: OSS self-hosted ($0 + hosting)
- **Weblate** self-hosted
- **LibreTranslate** for MT (OSS)
- Community translators

## Decision Framework: Three Questions

1. **What's your scale?**
   - <500K keys / <5 languages → Tolgee / Localizely / Lokalise Start
   - 500K-5M keys / 5-15 languages → Lokalise Pro / Crowdin Business
   - 5M+ keys / 15+ languages → Phrase / Smartling

2. **Product strings or marketing content?**
   - Product → Lokalise / Tolgee / Phrase
   - Marketing → Crowdin / Smartling
   - Both → Phrase or two-tool combo

3. **Privacy / OSS preference?**
   - EU privacy / GDPR-strict → Crowdin (Ukraine), Tolgee (Czech), Weblate (Czech, OSS)
   - OSS commitment → Weblate / Tolgee / Crowdin (OSS-tier)
   - SaaS-fine → Lokalise (US) / Phrase (Germany)

## Verdict

For 50% of indie/mid-market SaaS in 2026: **Lokalise**. Polished developer workflow; CLI-first; SDKs for major frameworks; the pragmatic default. Affordable until you scale to 100K+ keys.

For 25%: **Tolgee**. OSS option; in-context editor is a real workflow improvement; modern UX; reasonable pricing. The choice if you don't want to be locked into Lokalise pricing trajectory.

For 15%: **Crowdin**. Marketing-site + docs heavy; OSS-friendly; EU-aligned. Pick when content workflows dominate over product-strings.

For 7%: **Phrase**. Mid-market+ consolidation; enterprise procurement-friendly; comprehensive.

For 3%: **Weblate** for OSS purists; **Smartling** for enterprise marketing-only.

The mistake to avoid: **starting with raw JSON files in git and "we'll figure out a TMS later."** This works up to 2 languages. At 3+, the merge-conflict pain, missing-key bugs, translator handoff via spreadsheets, and "wait this string isn't translated" review meetings become a tax. Switching from raw-files to TMS at year 3 means migrating 50K keys with version-control history. Pick a TMS at language 2 if you're committing to international.

The second mistake: **shipping pure machine translation to non-English customers**. DeepL is great; even GPT-class translation in 2026 is great. None of it is ship-grade for marketing or product UX without human review. Pay for the review pass; you'll catch the embarrassing mistakes that cost you the customer's trust.

## See Also

- [Internationalization (VibeWeek)](https://vibeweek.dev/6-grow/internationalization-chat) — i18n implementation in code
- [SEO](./seo.md) — international SEO with hreflang
- [Generative Engine Optimization](./generative-engine-optimization.md) — GEO across languages
- [Schema Markup](./schema-markup.md) — structured data with locale
- [Sitemap](./sitemap.md) — multi-language sitemaps
- [CMS Providers](../frontend/cms-providers.md) — many CMS support multi-locale natively
- [Email Providers](../backend-and-data/email-providers.md) — multi-language transactional email
- [Customer Support Tools](../product-and-design/customer-support-tools.md) — multi-language support
- [Marketing Site Builders](../frontend/marketing-site-builders.md) — many integrate with TMS
- [Survey & NPS Providers](../product-and-design/survey-nps-providers.md) — multi-language surveys
