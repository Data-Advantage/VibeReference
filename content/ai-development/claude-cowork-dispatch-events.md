# Claude Dispatch: Asynchronous Task Management from Anywhere

Claude Dispatch is a feature inside Claude CoWork that lets you send tasks to your desktop AI session from your phone and return to finished work later. Previewed in March 2026, Dispatch shifts the Claude interaction model from synchronous — watching Claude work in real time — to asynchronous — assign a task, walk away, and come back to results.

## The Problem Dispatch Solves

Before Dispatch, using Claude CoWork required sitting at your computer, typing a prompt, and watching Claude execute. This works well for interactive tasks, but many knowledge work tasks don't need real-time supervision: "Reorganize these files," "Draft responses to these emails," "Process this batch of documents." You're paying attention tax on work that doesn't require your attention.

Dispatch decouples task assignment from task execution. Your phone becomes a remote control for your desktop Claude session.

## How Dispatch Works

The architecture is straightforward:

1. **Your desktop runs CoWork** — this is where Claude actually does the work, with access to your local files and folder permissions
2. **Your phone connects to that session** — the Claude mobile app acts as a messaging interface to your desktop CoWork instance
3. **You assign a task from your phone** — type a natural language instruction
4. **Claude works on your desktop** — it reads files, creates documents, processes data — all on your local machine
5. **You return to finished work** — when you sit back down, the results are in your filesystem

```
Phone                          Desktop
  │                              │
  ├─ "Summarize the Q1 reports" ─►│
  │                              ├─ Reads /reports/q1/*.pdf
  │                              ├─ Drafts summary.md
  │                              ├─ Creates action-items.md
  │                              │
  │◄─ "Done: 2 files created" ──┤
  │                              │
```

All processing happens locally on your computer. Dispatch doesn't upload your files to the cloud for processing — Claude reads and writes files on your desktop through the same CoWork file access permissions you've already configured.

## What You Can Dispatch

Dispatch works for any task that CoWork can handle autonomously — anything that doesn't require real-time human decisions during execution.

### Document Processing

```
Process all invoices in /finance/incoming. Extract vendor name, amount,
due date, and PO number from each. Create a summary spreadsheet at
/finance/invoice-summary.csv
```

### Research Compilation

```
Read all the papers in /research/ml-papers. For each, extract the key
findings, methodology, and relevance to our recommendation engine project.
Write a literature review to /research/lit-review.md
```

### Content Drafting

```
Using the product specs in /product/v2-spec.md and the customer feedback
in /support/q1-feedback.csv, draft a changelog blog post for the v2 release.
Save it to /content/drafts/v2-changelog.md
```

### File Organization

```
Go through /downloads and organize everything from the last 30 days.
Create folders by type (documents, images, code, data). Rename files
to be descriptive based on their content.
```

### Data Transformation

```
Convert all the JSON files in /data/raw to CSV format. Normalize the
date fields to ISO 8601. Flag any records with missing required fields
in a separate errors.csv
```

## What Dispatch Can't Do (Yet)

Dispatch is designed for autonomous task completion. It doesn't support:

- **Interactive tasks** — anything requiring back-and-forth decisions during execution. If Claude hits an ambiguous decision point, it pauses and waits for you to return.
- **External service integration** — Dispatch operates within CoWork's file access scope. It doesn't trigger webhooks, call external APIs, or integrate with orchestration tools like Make, n8n, or Zapier.
- **Chained workflows** — you can't set up "when task A finishes, automatically start task B." Each dispatch is a single task assignment.
- **Real-time notifications** — you get a completion notification on your phone, but there's no streaming progress view from mobile.

## Availability and Pricing

Dispatch launched as a research preview in March 2026:

| Plan | Price | Dispatch Access |
|------|-------|----------------|
| Max | $100/month | Available now |
| Pro | $20/month | Rolling out |
| Free | $0 | Not available |

Dispatch usage counts against your regular CoWork usage limits. There's no separate billing for the Dispatch feature itself.

## Setting Up Dispatch

1. **Install or update CoWork desktop** — Dispatch requires the latest version
2. **Install the Claude mobile app** — available on iOS and Android
3. **Sign in with the same account** — your phone and desktop must use the same Anthropic account
4. **Ensure CoWork is running on your desktop** — Dispatch sends tasks to an active CoWork session
5. **Send a task from your phone** — open the Claude app, select Dispatch, and type your instruction

Your desktop must be on and CoWork must be running for Dispatch to execute tasks. If your computer is asleep or CoWork is closed, the task queues until the session is available.

## Best Practices

**Front-load context in your dispatch message.** Since you can't have a back-and-forth conversation from mobile, make your initial instruction as complete as possible. Include file paths, expected output format, and any constraints.

```
# Good
Summarize /reports/q1-sales.pdf into a one-page executive summary.
Focus on revenue trends, top-performing products, and risks. Write
it to /reports/q1-exec-summary.md in markdown.

# Too vague
Summarize the sales report.
```

**Use folder instructions for recurring task types.** If you frequently dispatch similar tasks (e.g., document processing in a specific folder), set up folder instructions so Claude already knows your conventions.

**Check task status before assigning new work.** Dispatch runs one task at a time per CoWork session. If a task is still in progress, new dispatches queue behind it.

**Keep your desktop online.** Dispatch requires your computer to be awake and CoWork running. If you're dispatching tasks while away from your desk, make sure your machine won't sleep.

## Dispatch vs. Claude Code Scheduler

| Feature | Dispatch | Scheduler |
|---------|----------|-----------|
| **Trigger** | Manual (from phone) | Time-based (cron/interval) |
| **Context** | CoWork (files, documents) | Claude Code (code, terminal) |
| **Use case** | One-off async tasks | Recurring automated tasks |
| **Interaction** | Assign and return | Set and forget |
| **Platform** | CoWork desktop + mobile | Claude Code CLI or desktop |

Use Dispatch for ad-hoc tasks you think of while away from your desk. Use Scheduler for recurring automation that should run on a predictable cadence.

## Related Resources

- [Team Collaboration with Claude Code CoWork](./claude-code-cowork-collaboration) — CoWork fundamentals
- [Automating Workflows with Claude Code Scheduler](../guides/claude-code-scheduler-automation) — time-based automation
- [Claude Code: Complete Getting Started Guide](../guides/claude-code-getting-started) — the developer-focused CLI tool
