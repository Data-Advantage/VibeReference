# Product Strategy for AI-Built Products: PRODUCT.md as Source of Truth

When AI agents build your product, they need to know what they are building and why. Not just the current task — the vision, the target user, the positioning, and the key decisions that constrain what gets built. Without a written product strategy, agents drift. They build features nobody asked for, optimize for the wrong user, and make architectural choices that contradict your direction.

The solution is a `PRODUCT.md` file at the root of every project repository. It is the single source of truth for product strategy, readable by every agent and every human on the team.

## Why AI Agents Need Written Strategy More Than Human Teams

Human teams absorb strategy through osmosis — standups, Slack conversations, whiteboard sessions, watching the founder make decisions. Over time, everyone develops an intuition for "what this product is about."

AI agents have no ambient context. Each session starts from zero. They read their instructions, they read the task, and they do the work. If the product strategy is not written down where they can read it, it does not exist for them.

This creates specific failure modes:

- **Feature drift**: An engineer agent adds a user dashboard to a content-only reference site because "dashboards are a common SaaS feature." The agent does not know the product intentionally avoids SaaS features.
- **Wrong-user optimization**: A marketing agent writes copy targeting enterprise buyers when the product is built for solo founders. The agent does not know the positioning.
- **Architecture contradictions**: An engineer agent adds a database and authentication system to a site that was designed to be entirely static. The agent does not know the architectural constraints.

Every one of these is a real failure that happens when agents work without product context.

## The PRODUCT.md Format

After iterating on product strategy documents across multiple products, a consistent format works:

```markdown
# Product Strategy: [Product Name]

## Vision
One to two sentences describing what the product will become.
Not what it is today — what it is growing toward.

## Target User
Who specifically uses this product. Be concrete: "solo founders
vibe-coding their first product" is better than "developers."

## Positioning
How the product is different from alternatives. What it is
and what it is not. The one-line pitch.

## Current Stage
Where the product is right now: pre-launch, beta, live,
growing, mature.

## Current Priorities
Numbered list of what matters most right now. Maximum five
items. If everything is a priority, nothing is.

## Key Decisions
Architectural and strategic decisions that constrain
the product. These are the "we chose X over Y because Z"
records that prevent agents from re-litigating settled
decisions.
```

### A Real Example

```markdown
# Product Strategy: VibeReference

## Vision
The informational hub for solo founders navigating tech
suppliers. Curated prompts, vendor comparisons, and guides
to take a product from concept to launch using AI coding tools.

## Target User
Solo founders and indie hackers who are vibe-coding their
first product. They need to choose hosting, auth, databases,
payments — and want curated guidance, not raw documentation.

## Positioning
"Navigate tech suppliers from concept to launch." A reference
site with curated prompts and vendor comparisons for the
AI-first builder. Not a coding tutorial — a decision-support
tool for the tools you build with.

## Current Stage
Live. Content site. SEO-first distribution.

## Current Priorities
1. Content depth — expand vendor comparisons and curated
   prompt libraries
2. SEO growth — rank for "best [tool] for solo founders"
   and similar queries
3. Cross-promotion with related properties

## Key Decisions
- Content-only: No SaaS features. Reference/informational.
- Stack: Next.js, static. No database. No auth.
- SEO-first: Organic search is the primary distribution
  channel. Social is secondary.
```

## How Agents Use PRODUCT.md

### Context Loading

Every agent's instructions should include a directive to read PRODUCT.md before starting work:

```markdown
## Product Strategy Context

Every project repo contains a PRODUCT.md at the root.
Before starting work on any project, read PRODUCT.md
to understand the product direction. This ensures your
implementation aligns with product goals.
```

This single instruction prevents the most common agent failure: building something that contradicts the product strategy.

### Decision Reference

When an agent faces an ambiguous decision — "should I add a database for this feature?" — they check PRODUCT.md. If Key Decisions says "No database. Static site." then the answer is clear without escalating to a human.

### Scope Control

Agents are biased toward adding features. They will see a task to "improve the search page" and add filters, saved searches, search history, and analytics. PRODUCT.md constrains this: if the current priorities are "content depth" and "SEO growth," then search improvements should serve those goals, not introduce new feature surface area.

## What Belongs in PRODUCT.md

### Yes — Include These

- **Vision**: Where the product is headed. Agents need this to make decisions that serve the long-term direction.
- **Target user**: Who the product is for. This shapes everything from copy to feature prioritization.
- **Positioning**: What makes this product different. Prevents agents from copying competitor features that do not fit your positioning.
- **Stage**: Pre-launch, live, growing. Agents should behave differently for a pre-launch product (ship fast, skip polish) vs. a growing product (optimize, measure, iterate).
- **Priorities**: What matters now. Numbered, limited to five. Agents use this to make trade-off decisions.
- **Key decisions**: Settled architectural and strategic choices. Prevents re-litigation.

### No — Keep These Elsewhere

- **Technical architecture**: Goes in `docs/architecture.md` or the codebase itself.
- **Roadmap items**: Go in the task management system.
- **Sprint plans**: PRODUCT.md is strategic, not tactical.
- **Meeting notes or discussion history**: PRODUCT.md states decisions, not the process that led to them.
- **Metrics and analytics**: Current numbers change constantly. PRODUCT.md should reference what metrics matter, not their current values.

## Maintaining PRODUCT.md

### Who Owns It

A product manager (or CPO agent) owns PRODUCT.md. They update it when strategy changes. Other agents read it but do not modify it.

If you do not have a product manager, the founder or CEO agent owns it. The key is single ownership — when everyone can edit strategy, nobody owns it.

### When to Update

Update PRODUCT.md when:
- The target user shifts (e.g., from "developers" to "solo founders")
- A major strategic decision is made (e.g., "we are dropping the freemium tier")
- Priorities change (e.g., "growth is now more important than new features")
- The product stage changes (e.g., from pre-launch to live)

Do not update PRODUCT.md for:
- Individual feature additions
- Bug fixes
- Minor scope adjustments
- Tactical decisions that do not affect strategy

### Keeping It Short

PRODUCT.md should fit on one screen. If it takes more than two minutes to read, it is too long. Agents read it at the start of every session — a long strategy document wastes compute on every task.

The test: can a new agent read PRODUCT.md and immediately understand what this product is, who it is for, and what matters right now? If yes, it is the right length.

## Multi-Product Strategy

When you run multiple products, each repository gets its own PRODUCT.md. But you also need a portfolio-level view that shows how products relate:

```markdown
## Portfolio

| Product | Stage | Focus | Relationship |
|---------|-------|-------|-------------|
| VibeReference | Live | SEO growth | Choose tools |
| VibeWeek | Pre-launch | Content | Build with tools |
| LaunchWeek | Concept | Planning | Launch the product |
```

This helps agents understand that VibeReference is not just a standalone site — it is the "choose tools" step in a funnel. An agent working on VibeReference who understands the portfolio will naturally create content that links to the next step.

## Common Mistakes

### Mistake: PRODUCT.md as Aspirational Fiction

```markdown
# Bad
## Vision
The world's leading AI-powered platform for everything.

# Good
## Vision
A reference site for solo founders choosing tech suppliers.
```

Strategy must be grounded in what the product actually does and where it is realistically headed. Aspirational vision statements give agents no actionable constraints.

### Mistake: No Key Decisions

Without Key Decisions, every architectural question becomes an escalation. Agents ask "should I use a database?" and wait for human input instead of checking the strategy document.

Record decisions as they are made. The format is simple: "We chose X over Y because Z."

```markdown
## Key Decisions
- Static site: No database, no auth. Simplicity over features.
- Next.js App Router only: No Pages Router migration paths.
- Markdown content: Files in /content/, not a CMS.
  Developers can contribute via pull requests.
```

### Mistake: Priorities Without Ranking

```markdown
# Bad
## Priorities
- Improve SEO
- Add more content
- Fix mobile responsiveness
- Build API integrations
- Redesign the homepage

# Good
## Current Priorities
1. Content depth — expand vendor comparisons
2. SEO growth — rank for target queries
3. Mobile polish — fix known responsive issues
```

Unranked priorities let agents choose whichever task seems easiest. Ranked priorities tell agents what to work on when they have to choose.

### Mistake: Never Updating

A PRODUCT.md written six months ago that has not been updated is worse than no PRODUCT.md at all. Agents will follow outdated strategy — building features for a target user you have since pivoted away from, or honoring constraints you have since relaxed.

Review PRODUCT.md at least once a month. After any strategic pivot, update it immediately.

## Key Takeaways

- **PRODUCT.md is the agent's product sense.** Without it, agents build in a vacuum.
- **Keep it short.** One screen. Two minutes to read. Agents load it every session.
- **Rank your priorities.** Numbered lists force real decisions about what matters most.
- **Record key decisions.** "We chose X over Y because Z" prevents re-litigation.
- **Single owner.** One person or agent maintains it. Others read it.
- **Update on pivots.** Stale strategy is worse than no strategy.
