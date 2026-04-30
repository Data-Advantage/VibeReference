# Marketing Site Builders & Hosting: Webflow, Framer, Next.js + Vercel, Astro, Carrd, Squarespace, WordPress, HubSpot CMS

[⬅️ Frontend Overview](../frontend/)

If you're building a SaaS in 2026 and need a marketing site (homepage, pricing, blog, customer pages, docs), this is the consolidated comparison. Marketing-site choice is the line item founders make twice — first the hasty "WordPress install" or "Wix template" at launch, then the panic-rebuild on Webflow / Framer / Next.js six months in when SEO / brand / iteration pace bites. Most indie SaaS over-rely on no-code site builders past their useful range, then under-rely on them when Webflow at $39/mo would have served them through $5M ARR with no engineer time.

## TL;DR Decision Matrix

| Tool | Type | Free Tier | Starter Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Webflow | Visual builder + CMS | Free (staging) | $14/mo (Basic) | Very high | Designer-led indie SaaS marketing site |
| Framer | Visual + design-tool | Free (mini sites) | $15/mo (Mini) | Very high | Design-led modern marketing sites |
| Next.js + Vercel | Code-first | Free | Bundled with Vercel | Very high | Engineering-heavy teams; want full control |
| Astro + Vercel | Static-first | Free | Bundled | Very high | Content-heavy / SEO-priority sites |
| SvelteKit / Nuxt + Vercel | Code-first | Free | Bundled | High | Vue/Svelte teams |
| Carrd | Single-page | Free | $9/yr Pro | Very high | Single-page landing site; pre-launch |
| Squarespace | All-in-one site builder | Trial | $16/mo (Personal) | Medium | Non-technical; broad use |
| Wix | All-in-one site builder | Free (with ads) | $17/mo | Low | Older; consumer-focused |
| WordPress.com | Hosted WordPress | Free | $4-25/mo | Medium | WordPress preference |
| WordPress (self-hosted) | Self-host | Free OSS | Hosting cost | Medium | Customized WordPress / WooCommerce |
| HubSpot CMS | Bundled with HubSpot | Trial | $15/mo (Starter) | Medium | Already on HubSpot |
| Cargo / Universe / Strikingly | Niche builders | Various | Various | Medium | Specific aesthetic / use case |
| Notion (as site) | Notion + Super | Bundled | $12/mo (Super) | Very high | Notion-heavy team; minimal site needs |
| Bubble | App + site builder | Free | $32/mo | Medium | Site + app combined no-code |
| Plain HTML on S3 / Cloudflare Pages | Static + cheap | Free / cheap | Hosting cost | Very high | Maximum cost control |

The first decision is **what shape of marketing-site problem you have**. Designer-led visual site (Webflow / Framer), engineering-led code site (Next.js / Astro), single-page minimal (Carrd), no-code all-in-one (Squarespace / WordPress), and bundled-with-platform (HubSpot / Notion) are five different paths.

## Decide What You Need First

Tools are not interchangeable. Pick by ownership model + iteration pace.

### Designer-led visual site (the 50% case for indie SaaS)
You have a designer (or design-aware founder); marketing iterates fast; no engineer needed for content changes.

Right tools:
- **Webflow** — most-feature-rich; CMS strong
- **Framer** — modern alternative; design-tool feel
- **Squarespace** — non-technical default

### Engineering-led code site (the 30% case)
You''re Next.js / React-heavy team; marketing site lives in same repo; engineers ship updates.

Right tools:
- **Next.js + Vercel** — modern default
- **Astro + Vercel** — content-heavy
- **SvelteKit / Nuxt** — alternative frameworks

### Pre-launch / single-page (the 10% case)
You don''t have a product yet; just want a landing page with email capture.

Right tools:
- **Carrd** — single-page specialist
- **Framer Mini** — free mini sites
- **Notion + Super** — quick

### Bundled with platform (the 5% case)
You''re already heavily on HubSpot or another platform with marketing-site features.

Right tools:
- **HubSpot CMS**
- **Webflow Enterprise** (if scaling)

### Maximum cost control (the 5% case)
Tiny budget; willing to do everything yourself.

Right tools:
- **Plain HTML + S3 / Cloudflare Pages**
- **Static-site generator (Hugo / Jekyll) + free hosting**

For most indie SaaS in 2026: **Webflow if designer-led; Next.js + Vercel if engineering-led; Framer if modern brand-aesthetic matters most**. Skip WordPress unless you have specific reasons.

## Provider Deep-Dives

### Webflow — Designer Default
Webflow has dominated designer-led marketing sites for years. Visual editor produces clean code; CMS strong; integrations broad.

Strengths:
- Visual editor with full CSS control
- Strong CMS for blog / case studies / customers
- Hosting + CDN bundled
- $14-39/mo Site plans
- Strong SEO controls
- Animations / interactions
- E-commerce option
- Form handling

Weaknesses:
- Pricing climbs at scale (per-site billing)
- Locked-in (export limited)
- Some advanced layouts hard
- Performance: not always best Lighthouse scores

Pick when: designer-led; want fast iteration without engineering; willing to pay per-site.

### Framer — Modern Designer Tool
Framer started as a prototyping tool; pivoted to marketing-site builder. Visual + design-tool feel.

Strengths:
- Beautiful default templates
- Modern design-tool experience
- $15/mo Mini; $25/mo Basic
- Free tier for small sites
- Good animations
- AI features (generate sections)
- Strong recently for SaaS marketing sites

Weaknesses:
- CMS less mature than Webflow
- Smaller community
- Less integration breadth

Pick when: brand-aesthetic matters; modern design-led team; willing to trade some maturity for DX.

### Next.js + Vercel — Engineering Default
Next.js (with Vercel hosting) is the engineering default for marketing sites in 2026.

Strengths:
- Full code control
- ISR / Cache Components for fast iteration with static-site benefits
- Bundled with main app deployment
- Vercel CDN + analytics
- Strong SEO via SSG / ISR
- Cheap (Vercel free tier covers many sites)
- Same repo as product app

Weaknesses:
- Requires engineering for content changes (without CMS layer)
- Or: pair with headless CMS (Sanity, Contentful) — adds setup

Pick when: engineering-heavy team; one repo for marketing + app; want full performance control.

### Astro + Vercel — Content-First
Astro is content-first static-site generator. Multi-framework support. Excellent for blog / docs heavy sites.

Strengths:
- Best-in-class performance (zero JS by default)
- Content collections (Markdown / MDX)
- Multi-framework (React / Vue / Svelte components)
- Strong SEO / Lighthouse
- Free / OSS

Weaknesses:
- Less interactive than Next.js
- Smaller ecosystem
- Newer than Next.js

Pick when: content-heavy site (blog / docs); SEO is critical; willing to use multiple frameworks.

### SvelteKit / Nuxt + Vercel — Framework Alternatives
For Vue (Nuxt) or Svelte (SvelteKit) shops.

Strengths:
- Native to your stack
- Vercel hosting
- Modern DX

Weaknesses:
- Smaller ecosystem than Next.js for marketing-specific features
- Some Vercel features Next-first

Pick when: existing Vue / Svelte expertise.

### Carrd — Single-Page Specialist
Carrd is purpose-built for single-page sites. $9/year Pro.

Strengths:
- $9/year (yes, year)
- Fast to set up
- Mobile-friendly defaults
- Email-capture forms
- Widgets / integrations

Weaknesses:
- Single-page only
- Limited at scale

Pick when: pre-launch waitlist; very small team; minimal needs.

### Squarespace — All-in-One Non-Technical
Squarespace is broad-spectrum. Common for solo / non-technical founders.

Strengths:
- Beautiful templates
- Hosting + domain bundled
- E-commerce option
- $16-49/mo
- No engineering needed

Weaknesses:
- Lock-in (export limited)
- Less control than Webflow
- Slower iteration than code-first
- SEO controls less granular

Pick when: non-technical solo founder; broad needs (site + e-commerce + email).

### Wix — Older Alternative
Wix predates Squarespace. More consumer-focused; B2B SaaS rarely uses.

Pick when: rarely; usually not first choice for SaaS.

### WordPress.com — Hosted WordPress
WordPress.com is hosted WordPress (Automattic).

Strengths:
- WordPress ecosystem
- Plugins / themes
- $4-25/mo

Weaknesses:
- WordPress complexity
- Performance
- Maintenance overhead

Pick when: WordPress experience; specific WordPress-only features.

### WordPress (Self-Hosted) — Maximum Customization
Self-hosted WordPress with custom theme.

Strengths:
- Full customization
- Massive plugin ecosystem (WooCommerce, etc.)
- Free OSS

Weaknesses:
- Maintenance burden (security patches, plugin updates)
- Performance work needed
- Hosting cost separate

Pick when: WordPress is a strategic choice; willing to maintain.

### HubSpot CMS — Bundled
If on HubSpot for CRM / marketing automation, HubSpot CMS is a marketing site option.

Strengths:
- Tight integration with HubSpot CRM
- Personalization features (per visitor)
- Smart content
- $15-3.6K/mo

Weaknesses:
- HubSpot lock-in
- Pricing climbs aggressively
- Less designer-flexible than Webflow

Pick when: HubSpot-heavy GTM team; want CMS + CRM tight integration.

### Notion + Super (or similar) — Notion as Site
Some indie founders publish Notion docs as their marketing site via Super / Potion / others.

Strengths:
- Notion is editing tool
- Cheap ($12/mo Super)
- Fast iteration for content-heavy

Weaknesses:
- Limited design control
- Performance
- SEO can be tricky

Pick when: very early; team lives in Notion; minimal site needs.

### Bubble — App + Site
Bubble builds full apps. Some founders use for marketing site too.

Pros: site + app in one tool
Cons: marketing-site specifically less optimized than Webflow

### Plain HTML / Static on S3 or Cloudflare Pages
For the most cost-conscious / engineering-heavy:
- Hand-write HTML or use static-site generator
- Host on S3 / Cloudflare Pages / Netlify free tier

Pick when: extreme cost control; engineering team enjoys hand-rolling.

## What Marketing Site Builders Won''t Do

- **Replace SEO discipline.** Tools enable; you do the keywords / content / link-building (per [seo-link-building](https://www.launchweek.com/3-distribute/seo-link-building)).
- **Replace design judgment.** Templates are starting points; brand differentiation is your job.
- **Be free at scale.** Per-site or per-bandwidth pricing climbs.
- **Replace your CMS strategy.** Marketing site CMS for landing pages; product docs need separate (per [docs-site-builders](docs-site-builders.md)); blog might bridge.
- **Replace performance discipline.** Webflow / Framer / Squarespace can produce slow sites if loaded with images / videos / fonts.

## Pragmatic Stack Patterns

**Designer-led indie SaaS**:
- Webflow (marketing site)
- Total: $14-39/mo

**Engineering-led indie SaaS**:
- Next.js + Vercel
- Sanity / Contentful for content
- Total: bundled with Vercel + $0-99/mo CMS

**Pre-launch / waitlist**:
- Carrd or Framer Mini
- Total: $9/yr (Carrd) or free

**Content-heavy SEO play**:
- Astro + Vercel + MDX
- Total: free hosting

**Already on HubSpot**:
- HubSpot CMS
- Total: bundled

**Non-technical solo founder**:
- Squarespace
- Total: $16-49/mo

**Webflow with custom interactivity**:
- Webflow (marketing pages)
- Custom embed for interactive sections
- Total: $14-39/mo Webflow

**Multi-language site**:
- Webflow (built-in localization) or Next.js + i18n
- Total: $39/mo Webflow CMS or $0 Next.js

## Decision Framework: Three Questions

1. **Who edits the site?** → Designer / non-engineer: Webflow / Framer / Squarespace. Engineer: Next.js / Astro.
2. **What''s your content velocity?** → High: visual builder with CMS. Low: code-first.
3. **Is the marketing site separate from product?** → Yes: visual builder. No (same repo / domain): code-first.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **Webflow if you have a designer; Next.js + Vercel if you''re engineering-heavy; Framer if modern aesthetic matters most**. Skip WordPress unless you have specific reasons.

## Verdict

For most readers building a SaaS in 2026:
- **Default for designer-led**: Webflow.
- **Default for engineering-led**: Next.js + Vercel.
- **Modern aesthetic priority**: Framer.
- **Content / SEO heavy**: Astro + Vercel.
- **Pre-launch / minimal**: Carrd.
- **Non-technical solo**: Squarespace.
- **Already on HubSpot**: HubSpot CMS.
- **Cost minimal**: Plain HTML on Cloudflare Pages.
- **WordPress preference**: WordPress.com.

The hidden cost in marketing-site builders isn''t the seat fee — it''s **iteration speed.** A team that has to file an engineer ticket for every copy change ships marketing changes 10x slower than a team where marketing edits in Webflow directly. The discipline of: matching tool to who-edits + how-often + what-changes — matters more than which tool. The wrong tool creates bottlenecks; the right one disappears.

## See Also

- [CMS Providers](cms-providers.md) — headless CMS layer
- [Form Builders](form-builders.md) — form integrations
- [Documentation Site Builders](docs-site-builders.md) — separate concern
- [CDN Providers](../cloud-and-hosting/cdn-providers.md) — delivery layer
- [Image CDN Providers](../cloud-and-hosting/image-cdn-providers.md) — image optimization
- [Vercel](../cloud-and-hosting/vercel.md) — Vercel hosting
- [Vercel Domains](../cloud-and-hosting/vercel-domains.md) — domain mgmt
- [DNS Providers](../cloud-and-hosting/dns-providers.md) — DNS
- [Web Analytics Providers](../marketing-and-seo/web-analytics-providers.md) — analytics on site
- [Email Marketing Providers](../marketing-and-seo/email-marketing-providers.md) — email capture integration
- [LaunchWeek: SEO Strategy](https://www.launchweek.com/2-content/seo-strategy) — SEO foundation
- [LaunchWeek: SEO Link Building](https://www.launchweek.com/3-distribute/seo-link-building) — link building
- [LaunchWeek: Landing Page Copy](https://www.launchweek.com/1-position/landing-page-copy) — copywriting
- [LaunchWeek: Pricing Page](https://www.launchweek.com/4-convert/pricing-page) — pricing-page design
- [LaunchWeek: Comparison Pages](https://www.launchweek.com/4-convert/comparison-pages) — comparison-page strategy

---

[⬅️ Frontend Overview](../frontend/)
