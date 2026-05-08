# AI Crawlers and Robots.txt: User Agents and Access Control

AI crawlers are bots operated by AI companies that fetch web pages for one of three purposes: training large language models, building a real-time search index for an answer engine, or fetching a single page on demand when a user asks a question in a chat product. Each purpose has different commercial implications, and most AI vendors now publish a distinct user-agent string for each so site owners can allow or block them independently in `robots.txt`.

This page is a working reference for which bots exist, what they do, and how to control them.

## The Four Kinds of AI Crawler

Treat these as separate channels — not as "AI" in general. Blocking the wrong one breaks your visibility in answer engines without saving any training data.

### 1. Training Crawlers

Bulk fetchers that build datasets used to train base models. They behave like traditional search crawlers: respect `robots.txt`, fetch broadly, cache for long periods. Examples: `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `Meta-ExternalAgent`, `CCBot`. Blocking these is the safest opt-out from model training and has zero impact on whether your site is cited in chat answers.

### 2. Search Index Crawlers

Build an index used to retrieve relevant pages when a user asks a question in an answer engine. Examples: `OAI-SearchBot` (ChatGPT search), `PerplexityBot`, `Claude-SearchBot`, `YouBot`. Blocking these removes you from the candidate set when ChatGPT, Perplexity, or Claude search for sources. If you care about [Generative Engine Optimization](/marketing-and-seo/generative-engine-optimization), allow these.

### 3. On-Demand User-Triggered Fetchers

Fetch a single URL the moment a user pastes a link or asks a question that requires it. Behavior is closer to a browser than a crawler. Examples: `ChatGPT-User`, `Perplexity-User`, `Google-Agent`, `Claude-User`. Blocking these breaks the experience when users explicitly point a chatbot at your page — including paying customers reading your docs through ChatGPT.

### 4. Agent Browsers

A newer class. Browser-shaped agents driving headless Chromium on behalf of users — Operator, Comet, Claude's computer-use agent. Many of these still send a standard browser User-Agent, so `robots.txt` cannot reliably block them. Use bot-management tools or HTTP-header challenges if you need to.

## Verified User-Agent Tokens

The exact tokens you put after `User-agent:` in `robots.txt`. Verified against vendor documentation as of mid-2026.

| Token | Company | Purpose | Respects robots.txt |
|---|---|---|---|
| `GPTBot` | OpenAI | Model training | Yes |
| `ChatGPT-User` | OpenAI | On-demand fetch (ChatGPT) | Yes |
| `OAI-SearchBot` | OpenAI | Search index (ChatGPT search) | Yes |
| `ClaudeBot` | Anthropic | Model training | Yes |
| `anthropic-ai` | Anthropic | Model training (legacy) | Yes |
| `Claude-Web` | Anthropic | Training/indexing | Yes |
| `Claude-SearchBot` | Anthropic | Search index | Yes |
| `Claude-User` | Anthropic | On-demand fetch | Yes |
| `PerplexityBot` | Perplexity | Search index | Yes |
| `Perplexity-User` | Perplexity | On-demand fetch | Yes |
| `Google-Extended` | Google | AI training (Gemini, Vertex) | Yes (control token) |
| `Google-Agent` | Google | On-demand fetch | Yes |
| `Applebot-Extended` | Apple | AI training (Apple Intelligence) | Yes |
| `Meta-ExternalAgent` | Meta | AI training | Yes |
| `FacebookBot` | Meta | Social previews + AI | Yes |
| `Bytespider` | ByteDance | Training + TikTok index | Partial |
| `CCBot` | Common Crawl | Open dataset used by many models | Yes |
| `YouBot` | You.com | Search index | Yes |
| `Diffbot` | Diffbot | Structured data extraction | Yes |

Three notes that trip people up:

- **`Google-Extended` is a control token, not a User-Agent.** It does not appear in HTTP headers — Googlebot still does the actual crawling. `robots.txt` honors `Google-Extended` as a directive that opts you out of Gemini training without affecting Search.
- **`Applebot-Extended` works the same way.** Apple's regular `Applebot` still crawls for Siri and Spotlight; the `-Extended` token controls AI training opt-out only.
- **`Bytespider` has a documented history of ignoring `robots.txt`.** If you want to block it reliably, do it at the firewall, not in the file.

## How Robots.txt Syntax Works for AI Bots

`robots.txt` is a plain-text file at the root of your domain (`example.com/robots.txt`). Each block names one or more user agents and lists `Allow:` and `Disallow:` rules. The most specific matching block wins; only one block applies per crawler.

### Block a single bot from the entire site

```
User-agent: GPTBot
Disallow: /
```

### Allow only a specific section

```
User-agent: ClaudeBot
Allow: /blog/
Disallow: /
```

### Block all bots from a sensitive directory

```
User-agent: *
Disallow: /admin/
Disallow: /api/internal/
```

### Combine multiple AI bots in one block

```
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: anthropic-ai
User-agent: CCBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: Meta-ExternalAgent
Disallow: /
```

This block opts out of training across every major model family with one rule set, and leaves search-index crawlers (`OAI-SearchBot`, `PerplexityBot`, `Claude-SearchBot`) free to index you for answer engines.

## Common Strategies

Pick one. Don't mix accidentally — most "we blocked AI" outcomes happen because a site owner pasted overlapping rules and broke their answer-engine visibility too.

### Strategy A: Allow Everything

Default behavior with no AI rules. Bots train on your content and cite you in answers. Best for SaaS with a strong [content marketing](/marketing-and-seo/content-marketing) motion where citations in ChatGPT and Perplexity drive qualified traffic.

### Strategy B: Block Training, Allow Search and On-Demand

The most common 2026 default for content businesses. Keeps you out of new training datasets while preserving visibility in answer engines and direct user fetches.

```
# Block training crawlers
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: anthropic-ai
User-agent: Claude-Web
User-agent: CCBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: Meta-ExternalAgent
Disallow: /

# Allow answer-engine search and on-demand fetch
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: Google-Agent
Allow: /
```

### Strategy C: Block Everything AI

Blocks all AI traffic — training, search, on-demand. Appropriate for paywalled publishers, certain regulated content, or sites whose business model is direct subscriptions rather than discovery. Expect to disappear from chat-engine answers within weeks.

```
User-agent: GPTBot
User-agent: ChatGPT-User
User-agent: OAI-SearchBot
User-agent: ClaudeBot
User-agent: anthropic-ai
User-agent: Claude-Web
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: Google-Agent
User-agent: Applebot-Extended
User-agent: Meta-ExternalAgent
User-agent: Bytespider
User-agent: CCBot
User-agent: YouBot
Disallow: /
```

### Strategy D: Selective by URL Pattern

Allow AI bots into reference content, block them from gated assets. Common for documentation-heavy products that want answer-engine visibility for the docs but not for customer data exports.

```
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: PerplexityBot
Allow: /docs/
Allow: /blog/
Disallow: /
```

## Beyond Robots.txt

`robots.txt` is voluntary. Five complementary controls handle the cases where it isn't enough.

### HTTP Headers

The `X-Robots-Tag` HTTP header lets you express the same controls per-response, including for non-HTML files like PDFs and images. The new `noai` and `noimageai` directives are honored by some crawlers:

```
X-Robots-Tag: noai, noimageai
```

These are advisory in the same way `robots.txt` is, but they survive CDN caching better and apply per-asset.

### Meta Tags

Page-level alternative to `X-Robots-Tag` for HTML:

```html
<meta name="robots" content="noai, noimageai">
```

Useful if you want to opt out one specific page (a draft, a memo) without changing site-wide policy.

### llms.txt for the Other Direction

Where `robots.txt` says *what AI cannot read*, [llms.txt](/marketing-and-seo/llms-txt) says *what AI should read first*. They are complementary. Most teams that block training crawlers still publish `llms.txt` to give answer-engine bots a clean entry point. See [How AI Answer Engines Work](/marketing-and-seo/how-ai-answer-engines-work) for why this matters.

### Firewall and Bot Management

For bots that ignore `robots.txt` (looking at you, `Bytespider`), enforce at the network layer. Cloudflare, Vercel Firewall, and similar [bot detection providers](/marketing-and-seo/bot-detection-providers) ship managed rule sets that block known AI crawler IP ranges and challenge unverified user agents. This is the only reliable way to stop a determined non-compliant crawler.

### IP Verification for Real Bots

User-Agent strings can be spoofed. To confirm a request is really from `GPTBot` and not a scraper pretending to be one, do reverse DNS lookup. OpenAI, Anthropic, and Perplexity all publish IP ranges or `*.bot.openai.com` style PTR records you can verify against. Never rely on User-Agent alone for any high-stakes decision (rate limits, paywalls, allowlists).

## What Goes Where

A practical rule:

- **`robots.txt`** — broad allow/deny by user agent. Cheap, cacheable, the default lever.
- **`X-Robots-Tag` / `meta robots`** — per-asset or per-page exceptions.
- **`llms.txt`** — guide cooperative bots to the right content.
- **Firewall rules** — handle bots that ignore the file.
- **Schema markup** — separately, see [schema markup](/marketing-and-seo/schema-markup) to make whatever AI bots *do* read more extractable.

## Tradeoffs

The right policy depends on the business model.

| Business model | Recommended strategy |
|---|---|
| SaaS with content-driven inbound | Block training, allow search and on-demand |
| Documentation site | Allow everything |
| Subscription publisher (paywalled) | Block everything AI |
| eCommerce | Allow search and on-demand on product/category; block on internal account pages |
| Marketplace/UGC | Block training, evaluate search per-section |

Two principles to keep in mind:

**Visibility compounds.** Sites that allow answer-engine indexing in 2026 are accumulating citations that influence model behavior in ways that are hard to claw back. Blocking is reversible; missing the window may not be.

**Training opt-out is largely symbolic for already-indexed content.** Your existing pages already exist in past Common Crawl snapshots. Blocking `CCBot` and `GPTBot` today affects future training runs only. If you care about *current* model knowledge of your brand, see [Generative Engine Optimization](/marketing-and-seo/generative-engine-optimization).

## Verification Checklist

Before shipping a new `robots.txt`:

1. Test the file at `yoursite.com/robots.txt` and confirm it's served as `text/plain` with a 200 status.
2. Run [Google Search Console](/marketing-and-seo/google-search-console)'s robots.txt tester on a few representative URLs.
3. Check server logs for the user agents you intended to block — they should stop appearing within 24 to 72 hours.
4. Spot-check answer-engine visibility a week later: ask ChatGPT, Perplexity, and Claude a question whose answer is on your site, and confirm you're still cited.
5. Re-verify quarterly. Vendors add new tokens (Google added `Google-Agent` in March 2026) and the right token list shifts.

The single most common mistake is pasting a "block AI" template without realizing it includes the on-demand fetch user agents — and then wondering why their support team starts getting tickets that say "ChatGPT can't see your docs anymore." Read each `User-agent:` line before you commit it.
