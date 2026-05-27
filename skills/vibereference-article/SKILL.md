---
name: vibereference-article
description: >-
  Canonical playbook for planning, researching, drafting, and publishing a VibeReference article. Encodes the workflow proven across DAT-2354 → DAT-2362 so every writer starts from the same baseline.
user-invocable: true
argument-hint: [TOPIC=<slug-or-question>]
---

# VibeReference Article Authoring

**Invoke with:** `/vibereference-article`

Use this skill any time you are about to **plan a new article series**, **draft a new article issue**, or **write the article itself**. It replaces the per-sprint reinvention of prompts and specs.

---

## Purpose

VibeReference is a reference site for AI-first builders deciding workflows, tools, and deployment paths. Articles are SEO-led, decision-oriented, and clustered by builder intent — not vendor alphabet. The product identity is **reference**, not editorial opinion and not tutorial walkthrough. Every article must:

1. Answer one decision a solo founder is making.
2. Map options inside that decision honestly, with trade-offs.
3. Cross-link cleanly to adjacent categories.
4. Stay evergreen — no retired model names, no dated pricing claims without dates.

If the topic in front of you does not meet that bar, push back before writing.

## Scope

Use this skill when:

- The CPO is drafting a **series plan** for a parent issue.
- The CPO is drafting a **single-article issue** (the "research + write + ship" ticket).
- A writer (agent or human) is about to **research, synthesize, or draft** an article.
- A reviewer is about to **self-review or gate-review** an article before merge.

Do **not** use this skill for:

- Editorial sweeps of existing articles — that is its own workflow.
- Programmatic SEO page templates — those live outside `content/`.
- Internal docs in `docs/` — those follow developer-doc conventions, not editorial.

## Canonical workflow

Every article moves through five stages. Skipping a stage is the most common cause of sweep rewrites later.

### Stage 1 — Plan

- If this is a brand-new series, fill in `templates/series-plan.md` on the parent issue. Define the audience, the decision the series unblocks, the per-article breakdown, the SEO landscape, and a success metric.
- If this is a one-off article inside an existing cluster, skip the series plan and go straight to Stage 2.
- Confirm the article slot does not already exist as a stub or near-duplicate in `content/<category>/`.

### Stage 2 — Spec the article issue

- Use `templates/article-spec.md` verbatim as the issue description. The spec block (title, URL, type, length, SEO targets, hook, key takeaways, internal links) is non-negotiable — it is what makes the research and writing reproducible.
- Pick the category from `references/category-guide.md`. If the article does not fit, propose a new category in a separate issue first; do not silently invent one.
- Pick the article **type** from the four canonical shapes in `references/style-guide.md` (concept explainer, comparison, decision framework, quickstart). Length band follows from the type.

### Stage 3 — Research

- Default to the **parallel 4-tool deep-research pattern** in `templates/deep-research-prompt.md`. The board (or a research agent) runs the same prompt in Perplexity, Gemini, Grok, and Claude, then pastes each raw output back as a separate labeled comment on the issue. Do not summarize at this stage — the writer synthesizes.
- For lighter topics that are already well-covered by adjacent articles, a single Perplexity or Claude pass is acceptable, but call that out in the issue so the reviewer knows the research depth.
- Save anything reusable (taxonomies, comparison tables, source URLs) into `handoffs/vibereference/research/DAT-NNNN-<topic>.md` so the next sprint can find it.

### Stage 4 — Draft

- Write to `content/<category>/<slug>.md`. Slug = filename without `.md`; it must match the URL on the live site.
- Frontmatter follows `templates/article-frontmatter.md` exactly. Description is 120–160 characters and must read as a standalone SERP snippet, not a teaser.
- Structure follows `references/style-guide.md`: H1 → lead paragraph (no heading) → H2 sections → `## See Also` block. One H1 per file, no H4+.
- Internal links use clean paths with no `.md` extension. Use absolute paths (`/ai-development/foo`) when crossing categories and relative paths (`./foo`) when staying in the same category.
- Include at least one comparison table, decision matrix, or labeled trade-off block. A reference article without a comparison artifact is almost always under-spec.

### Stage 5 — Self-review and publish

- Walk `references/self-review-checklist.md` line by line before marking the issue `in_review`. The checklist is enforced — Phase 2 ([DAT-4979](/DAT/issues/DAT-4979)) adds CI that fails the build for many of these checks.
- For new categories or any article > 2,000 words, route to the editorial gate in Phase 3 ([DAT-4980](/DAT/issues/DAT-4980)) before merging.
- Commit on `main` with `feat: add <slug> article (DAT-NNNN)`. Post the live URL back to the issue as a final comment.

## File map

```
skills/vibereference-article/
├── SKILL.md                              ← you are here
├── templates/
│   ├── series-plan.md                    ← parent-issue plan doc
│   ├── article-spec.md                   ← single-article issue body
│   ├── deep-research-prompt.md           ← parallel 4-tool prompt
│   └── article-frontmatter.md            ← required + optional frontmatter
└── references/
    ├── category-guide.md                 ← 11 categories, tone, audience, typical shapes
    ├── style-guide.md                    ← tone, length bands, structure, tables, code
    └── self-review-checklist.md          ← pre-merge gate, runs before in_review
```

## Common mistakes this skill prevents

| Mistake | Where it bites | Caught by |
|---------|---------------|-----------|
| Reinventing the research prompt each sprint | Inconsistent depth across articles in the same series | `templates/deep-research-prompt.md` |
| Article spec missing SEO targets or internal links | Writer guesses; orphaned articles | `templates/article-spec.md` |
| Description > 160 chars or vague | Truncated SERP snippet | `references/self-review-checklist.md` + Phase 2 CI |
| `.md` extension on internal links | 404s in production | `references/self-review-checklist.md` + remark safety net |
| Mentioning retired models (GPT-4, Claude 3.5 Sonnet, etc.) | Evergreen rot — triggered DAT-1720 sweep | `references/self-review-checklist.md` + freshness lint |
| New category invented inline | Taxonomy drift; later collapse | `references/category-guide.md` |
| Article that is really a tutorial | Off-positioning vs. reference identity | `references/style-guide.md` (article types) |

## Related issues

- Parent process upgrade: [DAT-2362](/DAT/issues/DAT-2362)
- Phase 2 (CI validator): [DAT-4979](/DAT/issues/DAT-4979)
- Phase 3 (editorial/design gate): [DAT-4980](/DAT/issues/DAT-4980)
- Phase 4 (research briefs + freshness): [DAT-4981](/DAT/issues/DAT-4981)
- Phase 5 (SEO/content strategy): [DAT-4982](/DAT/issues/DAT-4982)
