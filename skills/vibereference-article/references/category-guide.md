# VibeReference category guide

VibeReference has 11 content categories. Each one has a specific audience moment and a typical article shape. Pick the category from this list — do **not** invent a new one in-line. If the article does not fit, open a separate issue proposing the new category before writing.

## Quick map

| Category | Folder | Reader moment | Typical shapes |
|---|---|---|---|
| AI development | `content/ai-development/` | Choosing the agent, harness, SDK, or memory stack | Concept explainer, comparison |
| AI models | `content/ai-models/` | Picking which model family to call | Concept explainer, comparison |
| Auth & payments | `content/auth-and-payments/` | Choosing auth and billing primitives | Comparison, decision framework |
| Backend & data | `content/backend-and-data/` | Choosing DBs, queues, vector stores, rate limiting | Comparison, concept explainer |
| Cloud & hosting | `content/cloud-and-hosting/` | Choosing where the app runs | Comparison, decision framework |
| DevOps & tools | `content/devops-and-tools/` | Repo, lockfile, CI, observability decisions | Concept explainer, comparison |
| Frontend | `content/frontend/` | Framework, UI lib, component-system choices | Concept explainer, comparison |
| Guides | `content/guides/` | End-to-end workflow guidance | Decision framework, quickstart |
| Image generation | `content/image-generation/` | Choosing an image model or platform | Comparison, concept explainer |
| Marketing & SEO | `content/marketing-and-seo/` | SEO/AEO/GEO and content marketing decisions | Concept explainer, comparison |
| Product & design | `content/product-and-design/` | Product/design tooling and approach decisions | Concept explainer, comparison |

## Per-category guidance

### `ai-development/` — strongest cluster

- **Audience moment:** Solo founder choosing the AI coding workflow (CLI vs IDE vs cloud vs self-hosted vs app-builder) or the AI app stack (memory, agents, gateways, SDKs).
- **Tone:** Direct, opinionated, willing to call out vendor weaknesses by name.
- **Typical length:** 1,800–2,500 words.
- **Anchor articles:** `ai-agents.md`, `agents-vs-harnesses.md`, `claude-code.md`, `ai-app-memory-problem.md`.
- **Watch outs:** Largest folder (90+ articles). Run a duplicate-check on the slug before writing. Strong tendency toward retired-model name rot — be vigilant about evergreen language.

### `ai-models/` — small, high-leverage

- **Audience moment:** "Which model family should I call from my app?"
- **Tone:** Comparative, dated. Frequently revisited.
- **Typical length:** 1,500–2,000 words.
- **Anchor articles:** `qwen.md`, `claude.md`-family pages.
- **Watch outs:** Highest model-rot risk. Always link to the vendor's current model list rather than naming specific versions inline. Phase 4 freshness automation will hit this folder hardest.

### `auth-and-payments/`

- **Audience moment:** Adding login, billing, or subscription to an indie SaaS.
- **Tone:** Decision-first. "Use Clerk if X, Auth.js if Y."
- **Typical length:** 1,800–2,500 words.
- **Watch outs:** Compliance claims (PCI, SOC 2) must be sourced. Pricing changes often — date the claims.

### `backend-and-data/`

- **Audience moment:** Choosing the DB, queue, vector store, cache, or rate-limit primitive.
- **Tone:** Practical, with quick code snippets where they clarify the API.
- **Typical length:** 1,800–2,500 words.
- **Watch outs:** Cross-link aggressively with `ai-development/` (vector stores, embeddings) and `cloud-and-hosting/` (managed DB providers).

### `cloud-and-hosting/`

- **Audience moment:** "Where do I deploy this?" or "Which managed provider for X?"
- **Tone:** Honest about lock-in and pricing surprises.
- **Typical length:** 1,800–2,500 words.
- **Watch outs:** Vercel-friendly articles are fine but must include credible alternatives (Cloudflare, Fly, Railway, Render). Do not editorialize the platform we deploy on.

### `devops-and-tools/`

- **Audience moment:** Repo hygiene, lockfiles, CI, dotfiles, "should I commit X" questions.
- **Tone:** Tight, opinionated, often a single-question answer up top followed by reasoning.
- **Typical length:** 1,200–1,800 words for `should-you-commit-*`; up to 2,500 for broader topics.
- **Anchor articles:** the `should-you-commit-*` family.
- **Watch outs:** Maintain consistency across the `should-you-commit-*` cluster — same structure (one-line answer → what it is → why → exceptions → how to handle conflicts).

### `frontend/`

- **Audience moment:** Picking the framework, UI library, component system, or styling approach.
- **Tone:** Comparative, mindful of churn in the React ecosystem.
- **Typical length:** 1,800–2,500 words.
- **Watch outs:** React-heavy by default but call out when an article applies to other frameworks. Avoid declaring winners — name the trade-offs.

### `guides/`

- **Audience moment:** End-to-end workflow guidance that doesn't fit one category.
- **Tone:** Procedural but still reference-shaped — milestones, decisions per milestone, not click-by-click steps.
- **Typical length:** 2,500–3,500 words.
- **Watch outs:** Easiest folder to drift into tutorial territory. Re-read the style guide before drafting.

### `image-generation/`

- **Audience moment:** Picking an image model or platform for product use.
- **Tone:** Comparative, with explicit quality/cost/control trade-offs.
- **Typical length:** 1,500–2,000 words.
- **Watch outs:** Visual claims are hard to keep evergreen. Date the model claims.

### `marketing-and-seo/`

- **Audience moment:** Founder-led marketing decisions — SEO, AEO/GEO, content distribution, ICP.
- **Tone:** Practical, with concrete examples.
- **Typical length:** 1,800–2,500 words.
- **Watch outs:** Easy to drift into self-promotion. Articles must be useful to a reader who has never heard of Data Advantage.

### `product-and-design/`

- **Audience moment:** Choosing product/design tooling, or aligning on a design approach for an AI app.
- **Tone:** Opinionated, with named trade-offs.
- **Typical length:** 1,500–2,000 words.
- **Watch outs:** Smallest cluster after `ai-models/` and `image-generation/`. Avoid generic UX advice — every article must tie back to the AI-first builder context.

## Cross-category link patterns

Articles routinely cross categories. Strong link patterns:

- `ai-development/` ↔ `backend-and-data/` (memory, vector stores, embeddings).
- `ai-development/` ↔ `ai-models/` (which model to call from which agent).
- `cloud-and-hosting/` ↔ `devops-and-tools/` (deploy decisions, CI).
- `auth-and-payments/` ↔ `backend-and-data/` (session storage, billing webhooks).
- `marketing-and-seo/` ↔ `guides/` (launch playbooks).

If your article does not cross-link to at least one adjacent category, it is probably under-positioned.
