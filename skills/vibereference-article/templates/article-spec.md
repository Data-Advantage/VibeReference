# Article spec template

Copy this template verbatim into the body of a new single-article issue. Replace every angle-bracket placeholder. Do not remove sections — if a section does not apply, write "n/a — <one-line reason>" rather than deleting it.

---

## Article spec

**Title:** <Article title in title case, matches the H1 in the file>
**URL:** `vibereference.com/<category>/<slug>`
**Type:** <concept explainer | comparison | decision framework | quickstart>
**Length:** <1,500–2,000 | 2,000–2,500 | 2,500–3,500> words
**SEO targets:** "<primary query>", "<secondary query>", "<long-tail 1>", "<long-tail 2>"

**Hook:** <1–2 sentences a reader sees in their head before they click. Names the decision and stakes.>

**Key takeaways:**
- <Takeaway 1 — what the reader will be able to decide or do after reading>
- <Takeaway 2>
- <Takeaway 3>
- <Takeaway 4>
- <Comparison table or decision aid the article will include>

**Internal links:**
- `/<category>/<existing-article-slug>` (existing) — <why it's linked>
- `/<category>/<existing-article-slug>` (existing) — <why it's linked>
- Forward-link to Article N (<title>) once live — <only if part of a series>

**External anchors (optional):**
- <Vendor docs, RFC, or canonical source the article will cite>

---

## Phase 1: Deep research

Run `templates/deep-research-prompt.md`, customized for this topic, in **all four** tools (Perplexity, Gemini, Grok, Claude). Paste each raw output back as a separate comment on this issue, labeled `Perplexity output`, `Gemini output`, `Grok output`, `Claude output`.

Do **not** summarize at this stage — the writer synthesizes in Phase 2.

If the topic is well-covered by adjacent articles and a single research pass is enough, state that in a comment and note which tool you used. The reviewer needs to know the research depth.

### Deep research prompt for this article

```
<Paste the customized prompt from templates/deep-research-prompt.md here>
```

---

## Phase 2: Write + ship

After research outputs land on this issue:

1. Reassign to the writer (Software Engineer or designated author).
2. Synthesize the research outputs into a single article.
3. Follow `skills/vibereference-article/references/style-guide.md` and `references/category-guide.md` for the chosen category.
4. Walk `references/self-review-checklist.md` before marking `in_review`.
5. For new categories or articles > 2,000 words, route to the editorial gate ([DAT-4980](/DAT/issues/DAT-4980)) before merge.
6. Commit on `main` (`feat: add <slug> article (DAT-NNNN)`), verify live URL, post URL back to the issue.

## Deliverable

Live URL: `https://vibereference.com/<category>/<slug>`

Parent: [DAT-NNNN](/DAT/issues/DAT-NNNN)
Plan: [DAT-NNNN plan](/DAT/issues/DAT-NNNN#document-plan)
