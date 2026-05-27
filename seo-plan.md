# VibeReference Content Strategy

> Canonical strategy doc for what VibeReference publishes, why, and in what order. Replaces the prior Vibestack-era plan. Pair with [`skills/vibereference-article/SKILL.md`](skills/vibereference-article/SKILL.md) for execution mechanics. Owner: CMO. Last refresh: 2026-05-27.

## 1. Product context (one paragraph)

VibeReference is the reference site for AI-first solo founders and indie hackers choosing the workflows, tools, and deployment paths that take a product from idea to launch. We are not a tutorial site, not a vendor directory, and not an opinion blog. We are decision support: cluster the market by builder intent, map options inside each decision, name the trade-offs. See [`PRODUCT.md`](PRODUCT.md) for the full strategy.

## 2. Target readers

Every article must be written for one of these three readers. If it does not serve at least one, do not publish it.

| Reader | What they search for | What they decide |
|--------|----------------------|------------------|
| **Workflow chooser** | "best AI coding agent for solo founders", "CLI vs IDE vs cloud agent", "self-hosted vs managed" | Which surface and ownership model fits their build style before they pick a vendor |
| **Vendor evaluator** | "Claude Code vs Cursor", "Replit Agent vs Bolt vs Lovable", "Supabase vs Neon for AI apps" | Which specific tool inside a chosen workflow lane |
| **Stack completer** | "auth for AI apps", "rate limiting Next.js", "vector DB for memory" | Supporting infra once the core build path is set |

Reader we do **not** serve: enterprise architects, ML researchers, no-code dabblers who will not ship, agency buyers shopping for vendors on their client's behalf. Decline topics that only serve those readers.

## 3. Article categories

Eleven stable categories, mirrored 1:1 with `content/<category>/` directories on disk. Do not invent new categories inline — propose one as a separate issue if a topic truly does not fit.

| Category | Primary reader | Coverage stance |
|----------|----------------|-----------------|
| `ai-development` | Workflow chooser, vendor evaluator | **Tier 1.** Our strongest cluster. Keep depth on agents, harnesses, frameworks, evaluation, memory, orchestration. |
| `ai-models` | Vendor evaluator | **Tier 1.** Model-family pages (GPT, Claude, Gemini, etc.) as evergreen references. Avoid versioned-model pages unless the article is about that version. |
| `cloud-and-hosting` | Stack completer | **Tier 1.** Deployment targets for AI apps. Vercel, Fly, Cloudflare, Railway, etc. |
| `auth-and-payments` | Stack completer | **Tier 2.** Auth providers, payments, passkeys. Keep evergreen. |
| `backend-and-data` | Stack completer | **Tier 2.** Databases, queues, vector stores, rate limiting. |
| `devops-and-tools` | Workflow chooser, stack completer | **Tier 2.** CI/CD, observability, testing, config-file decisions ("should I commit X"). High SEO leverage. |
| `frontend` | Stack completer | **Tier 2.** Frameworks, component libraries, styling, state. |
| `image-generation` | Vendor evaluator | **Tier 2.** Image model families, providers, use cases. |
| `marketing-and-seo` | Workflow chooser (post-launch) | **Tier 3.** Light coverage — defer to FastWrite's domain except where it intersects AI builder workflows. |
| `product-and-design` | Workflow chooser | **Tier 3.** Design tools, whiteboarding, knowledge bases. |
| `guides` | All | **Tier 3.** Long-form quickstarts that span categories. Use sparingly — single-topic articles outperform. |

## 4. Article types

Four shapes, defined in `skills/vibereference-article/references/style-guide.md`. Pick one before drafting. Length bands are firm.

| Type | Purpose | Length band |
|------|---------|-------------|
| **Concept explainer** | Define a category, taxonomy, or decision frame | 1,200–2,000 words |
| **Comparison** | Map options inside one decision with a trade-off matrix | 1,500–2,500 words |
| **Decision framework** | Walk the reader through choosing for their context | 1,800–3,000 words |
| **Quickstart** | Get one specific tool to "hello world" — only for `guides/` | 1,000–1,800 words |

Reject hybrid shapes ("comparison that turns into a tutorial halfway through"). Split into two articles or restructure.

## 5. Prioritization rules

When picking the next article from a backlog, score on these four signals in this order. Higher signal wins; ties broken by the next signal down.

1. **Decision unblocked.** Does this article let a reader make a build decision they cannot make from existing articles? An article that answers a *new* decision beats one that adds depth to a decision we already cover.
2. **Cluster reinforcement.** Does this fill a gap inside an existing Tier 1 cluster (especially `ai-development` or `ai-models`)? Cluster depth compounds; orphans do not.
3. **Search demand × ranking realism.** Prefer mid-tail queries (100–5,000 monthly searches, KD < 40) where a reference article can plausibly rank in 90 days. Skip head terms we cannot win and ultra-long-tail with no traffic.
4. **Evergreen half-life.** Prefer topics that will still be true in 12 months. De-prioritize anything pinned to a specific model version, pricing tier, or product roadmap promise.

**Do not prioritize on:** vendor partnerships, internal enthusiasm for a tool, freshness of news, or "we already started research." Sunk research is not a reason to ship a low-priority article.

**Quotas per cycle.** A typical publishing cycle should be roughly: 50% Tier 1 articles, 30% Tier 2, 10% Tier 3, 10% refreshes of existing high-traffic articles. Adjust only with CEO sign-off.

## 6. Internal-linking rules

Internal linking is the single highest-leverage SEO action on this site. It is not optional.

1. **Every article links to at least 3 other VibeReference articles** in the body and at least 2 more in a `## See Also` block at the end. Articles with fewer should not pass review.
2. **Link to the closest category hub** (or canonical taxonomy explainer) in the first 200 words. If no hub exists, surface that gap to the CMO — the hub article is more important than the leaf.
3. **Comparison articles link out to each option's deeper page** if one exists, and inbound from each option's page back to the comparison.
4. **Cross-category links use absolute paths** (`/ai-development/foo`). Same-category links use relative paths (`./foo`). Never include the `.md` extension.
5. **No reciprocal-link spam.** Two articles linking to each other is fine; building a ring of five articles all linking to each other to inflate internal PageRank is not.
6. **Anchor text is descriptive**, not "click here" or the raw slug. Use the article title or a noun phrase that matches the target's H1.
7. **Refresh internal links during sweeps.** When a new hub or comparison ships, audit existing articles in the cluster and add inbound links — this is part of shipping the hub, not a follow-up task.

## 7. Content-quality bar (non-negotiable)

An article fails review if any of these are missing. The Phase 2 CI validator ([DAT-4979](/DAT/issues/DAT-4979)) enforces the mechanical checks; humans enforce the rest.

**Mechanical (CI-enforced):**

- Valid frontmatter per `skills/vibereference-article/templates/article-frontmatter.md`
- Description is 120–160 characters and reads as a standalone SERP snippet
- One H1, no H4+, lead paragraph with no heading above it
- No `.md` extensions on internal links
- No retired model names in evergreen contexts (use family names — GPT, Claude, Gemini — per the AGENTS.md evergreen rule)
- `## See Also` block present with ≥ 2 internal links
- At least one comparison table, decision matrix, or labeled trade-off block

**Editorial (human-enforced at the Phase 3 gate):**

- Article answers exactly one decision named in the spec
- Trade-offs are honest — no tool listed without a stated weakness
- Tone is reference, not opinion blog, not tutorial, not press release
- No vendor claim copied uncritically from marketing copy
- Word count inside the band for the chosen article type
- Internal links follow Section 6 rules
- Reader from Section 2 is identifiable from the lead paragraph

**Disqualifiers — do not publish:**

- "Best of 2026" listicles without decision logic
- Articles that are really tutorials in disguise (move to `guides/` and rescope)
- Articles whose only differentiator is being recent (news belongs elsewhere)
- Articles that link only to vendor sites and not to other VibeReference content

## 8. Measurement

Track these monthly. Report deltas, not absolutes, in the CMO heartbeat.

| Metric | Source | Target trajectory |
|--------|--------|-------------------|
| Organic sessions | GSC + GA | Growing month-over-month |
| Articles ranking top 10 for their primary keyword | GSC | Growing share of published set |
| Average internal links per article (in + out) | Repo scan | ≥ 6 in, ≥ 5 out, trending up |
| Articles refreshed in last 180 days | Frontmatter dates | ≥ 30% of Tier 1 inventory |
| New articles published per cycle | Git log | Set by board on a per-cycle basis |

Specific traffic and ranking targets are set by the board per cycle, not in this doc. This doc defines the rules; the board sets the throttle.

## 9. What this doc does not cover

- **Execution mechanics** (workflow, templates, prompts) — in [`skills/vibereference-article/SKILL.md`](skills/vibereference-article/SKILL.md).
- **Category-level tone and length specifics** — in `skills/vibereference-article/references/category-guide.md` (Phase 1).
- **Research-brief format and freshness criteria** — in Phase 4 deliverable ([DAT-4981](/DAT/issues/DAT-4981)).
- **Editorial review gate mechanics** — in Phase 3 deliverable ([DAT-4980](/DAT/issues/DAT-4980)).
- **Specific keyword research or article backlogs** — produced per-series by CPO, not pre-baked here.
- **Programmatic SEO templates** — out of scope until Tier 1 clusters are saturated.

## 10. Maintenance

- This doc is reviewed by the CMO every 90 days, or when the category list changes, or when the board changes the product strategy in `PRODUCT.md`.
- Material changes require CEO review and board approval before merge.
- Minor edits (typos, link fixes, clarifications) can land directly on `main` with a comment back to [DAT-4982](/DAT/issues/DAT-4982).

---

Related: parent process upgrade [DAT-2362](/DAT/issues/DAT-2362) · sibling phases [DAT-4978](/DAT/issues/DAT-4978) [DAT-4979](/DAT/issues/DAT-4979) [DAT-4980](/DAT/issues/DAT-4980) [DAT-4981](/DAT/issues/DAT-4981).
