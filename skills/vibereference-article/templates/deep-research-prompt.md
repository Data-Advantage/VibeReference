# Deep research prompt template

This is the parallel 4-tool research pattern proven on DAT-2357 and the entire DAT-1858 memory series.

## How to use

1. Fill in the `<…>` placeholders below for the specific article. Keep the structure intact — each numbered section anchors a research dimension the writer needs to cover.
2. Run the customized prompt in **all four** tools:
   - **Perplexity** (best at fresh URLs and citations)
   - **Gemini** (best at long-context synthesis and academic sources)
   - **Grok** (best at recent X/Twitter signal and contrarian takes)
   - **Claude** (best at honest taxonomy and trade-off framing)
3. Paste each raw output back as a separate comment on the issue, labeled `Perplexity output`, `Gemini output`, `Grok output`, `Claude output`. **Do not summarize.** The writer synthesizes.
4. Note the date you ran the research at the top of each comment so we can judge freshness.

If the topic is narrow enough that one tool suffices, document which tool you used and why in the issue. Default is still four.

---

## Customizable prompt

```
I'm writing an article titled "<exact article title>" for an audience of "vibe coders" — indie developers and solo founders building user-facing AI apps with Next.js, Convex/Postgres, Vercel, and LLM APIs. They are at the stage of <describe stage: evaluating a tool / about to commit to a workflow / debugging in production / etc.>.

The article is published on VibeReference (https://www.vibereference.com), a reference site that helps these builders choose the workflow before they choose the vendor. The article must be evergreen, decision-oriented, and honest about trade-offs.

Do deep research — as comprehensive as possible — on the following:

1. **Current state in 2025–2026.** What is the canonical definition of <topic> right now? Who are the major vendors / projects / approaches? Cite product release notes, docs, and news with URLs and dates.

2. **The decision the reader is making.** What is the question a solo founder is actually asking when they search for this topic? What are the 2–4 real options they choose between? Frame it like a decision tree, not a feature list.

3. **Trade-offs per option.** For each option above: how it works at a high level, what it is best at, what it is worst at, public pricing anchors, latency/cost/data-control angles, who it fits. Cite real sources.

4. **What changed recently.** What has shifted in the last 6–12 months that would surprise someone whose mental model is from 2024? Model releases, deprecations, pricing changes, new entrants, abandoned projects.

5. **Real failure modes.** Concrete examples of teams or products that picked the wrong option and what went wrong. Reddit, Hacker News, blog post-mortems, case studies. Include URLs.

6. **The "<obvious-shortcut>" argument and why it does/doesn't work.** Address the most common misconception in this space head-on. Latency, cost, retrieval-quality, or correctness angles — whichever applies.

7. **Authoritative external references.** Blog posts, docs, RFCs, academic papers, GitHub repos that the article should link out to. Include URLs.

8. **Pitfalls and gotchas.** Privacy/compliance issues, edge cases, integration footguns, things that bite teams in month 3 that aren't obvious in month 1.

9. **Comparison table material.** Give me the rows and columns for at least one comparison table the article can include. Be specific — exact feature names, exact pricing where public, exact latency numbers where measured.

10. **What a competing VibeReference-style article would say.** If you were writing this article and wanted it to rank above the current top SERP results, what angle would you take that they don't?

Go as deep as you can. I want raw facts, quotes, stats, links, and dates — not a sanitized summary. Cite sources inline. If you don't know something, say so explicitly rather than guessing.
```

---

## Customization checklist

Before running the prompt in all four tools, confirm you have:

- [ ] Replaced `<exact article title>` with the spec title.
- [ ] Replaced `<describe stage>` with one concrete reader stage.
- [ ] Replaced `<topic>` with the specific domain (e.g. "managed memory services for AI apps").
- [ ] Replaced `<obvious-shortcut>` with the real misconception (e.g. "longer context windows solve memory", "more agents in parallel always speed up the task").
- [ ] Kept all 10 numbered sections — do not delete sections to shorten the prompt.
- [ ] Noted the run date at the top of each pasted output so freshness is auditable.
