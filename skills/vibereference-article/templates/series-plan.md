# Series plan template

Use this template on a **parent issue** when you are launching a multi-article series. For a single one-off article inside an existing cluster, skip the series plan and go directly to `templates/article-spec.md`.

Post the filled-in version as the parent issue's plan document. Spin out one child issue per article using `templates/article-spec.md`.

---

## Series: <Series title>

**Parent issue:** [DAT-NNNN](/DAT/issues/DAT-NNNN)
**Category cluster:** <primary category>, optionally <secondary>
**Number of articles:** <N>
**Estimated publish window:** <YYYY-MM-DD> → <YYYY-MM-DD>

### Audience

<Who is reading these articles? Be specific: "solo founder evaluating cloud coding agents", not "developers". What stage are they at? What have they already tried? What decision are they actively trying to make?>

### Decision the series unblocks

<Name the single decision a reader will be able to make after reading the whole series. If you can't state it in one sentence, the series is unfocused.>

### Why now

<What changed in the market, our coverage, or our SEO position that makes this series valuable this quarter? Cite the gap or trigger.>

### SEO landscape

- **Primary query cluster:** <e.g. "best cloud coding agent", "claude code vs cursor cloud">
- **Estimated search volume:** <low / medium / high — note source if available>
- **Top SERP competitors:** <2–4 URLs we are competing against>
- **Our existing coverage:** <links to adjacent articles already in `content/`>
- **Gap this series fills:** <one sentence>

### Article breakdown

| # | Title | URL | Type | Length | Primary SEO target |
|---|-------|-----|------|--------|---------------------|
| 1 | <title> | `/<cat>/<slug>` | <type> | <band> | "<query>" |
| 2 | <title> | `/<cat>/<slug>` | <type> | <band> | "<query>" |
| 3 | <title> | `/<cat>/<slug>` | <type> | <band> | "<query>" |
| 4 | <title> | `/<cat>/<slug>` | <type> | <band> | "<query>" |

### Cross-link map

Each article links forward and back to its neighbors in the series, plus 2–3 external links into adjacent categories. Sketch the map before drafting:

- Article 1 → Article 2, Article 3
- Article 2 → Article 1, Article 3, <adjacent category article>
- Article 3 → Article 1, Article 2, Article 4
- Article 4 → Article 1, Article 3, <adjacent category article>

### Success metric

<One quantitative target the series is judged against in 90 days. Examples: "100 organic visits/day across the cluster", "rank top-3 for primary query", "5+ inbound links from comparison reviews". Pick one — not three.>

### Risks and non-goals

- **Risks:** <what could make this series flop or age badly>
- **Non-goals:** <what the series will explicitly not cover, so scope doesn't creep>

### Child issues

Spin out one issue per article using `templates/article-spec.md`. List them here as they are created:

- [ ] Article 1: [DAT-NNNN](/DAT/issues/DAT-NNNN)
- [ ] Article 2: [DAT-NNNN](/DAT/issues/DAT-NNNN)
- [ ] Article 3: [DAT-NNNN](/DAT/issues/DAT-NNNN)
- [ ] Article 4: [DAT-NNNN](/DAT/issues/DAT-NNNN)
