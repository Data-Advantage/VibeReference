# Automating Workflows with Claude Code Scheduler

Claude Code's scheduling features let you save a prompt and have it run automatically on a recurring cadence. Instead of opening a new session every morning to type the same "check error logs" prompt, you define the task once and Claude handles it on schedule — monitoring deployments, reviewing PRs, running health checks, or generating daily briefings while you focus on other work.

## Two Types of Scheduling

Claude Code offers two distinct scheduling mechanisms, each suited to different workflows.

### Desktop Scheduled Tasks

Desktop scheduled tasks are persistent. They survive restarts, run on a visual schedule, and fire as long as the Claude Code desktop app is open. These are for recurring automation that you want to keep running indefinitely — daily code reviews, weekly dependency checks, or continuous monitoring.

**How to create a desktop scheduled task:**

1. Open Claude Code desktop
2. Navigate to the scheduled tasks panel
3. Define your prompt and schedule (e.g., every 6 hours, daily at 9am)
4. Select the project directory for context
5. Save — the task runs automatically on schedule

### CLI Session-Scoped Tasks with /loop

The `/loop` skill is the quickest way to schedule a recurring prompt from the command line. Pass an optional interval and a prompt, and Claude sets up a background job that fires while your session stays open.

```bash
# Check deployment status every 5 minutes
/loop 5m check the deployment at staging.example.com and report any errors

# Monitor PR checks every 10 minutes (default interval)
/loop review open PRs in this repo and flag any with failing checks

# Run tests every 15 minutes during a refactor
/loop 15m run the test suite and report any new failures
```

Session-scoped tasks die when you exit the CLI session. They're designed for temporary monitoring during active work, not long-term automation.

## Practical Use Cases

### Deployment Monitoring

Watch a deployment in progress without staring at a terminal:

```
/loop 3m check the Vercel deployment status for this project. If the
latest deployment failed, show me the error logs and suggest a fix.
```

### PR Babysitting

Keep an eye on CI/CD checks across your open pull requests:

```
/loop 10m list all open PRs in this repo. For any with failing checks,
read the failure logs and add a comment with the likely cause.
```

### Error Log Surveillance

Monitor application logs for emerging issues:

```
/loop 5m read the last 100 lines of logs/error.log. If there are any
new errors since the last check, categorize them and estimate severity.
```

### Dependency Audit

Schedule periodic checks for security vulnerabilities:

```
# Desktop scheduled task — runs daily
Run npm audit and report any high or critical vulnerabilities.
If any are found, check if patch versions are available and list
the upgrade commands.
```

### Daily Briefing

Generate a morning summary of what changed overnight:

```
# Desktop scheduled task — runs daily at 8:30am
Summarize all commits pushed to main since yesterday. Group by author.
Flag any changes to database schemas, API contracts, or security-sensitive
files. Write the summary to daily-briefings/today.md.
```

### Test Suite Health

Continuously validate that your test suite passes during a refactor:

```
/loop 15m run pytest tests/ -x --tb=short. If any test fails, identify
which recent file change likely caused it by checking git diff.
```

## How Scheduling Works Under the Hood

When you create a scheduled task, Claude Code:

1. **Saves the prompt** — your instruction is stored as a reusable task definition
2. **Sets the trigger** — cron-based for desktop tasks, interval-based for `/loop`
3. **Runs in context** — each execution happens in your project directory with access to your files and CLAUDE.md
4. **Reports results** — output appears in your Claude Code session or notification system

Each execution is an independent Claude session. The scheduled prompt runs fresh each time — Claude doesn't carry conversation history between executions, but it does read your project files and CLAUDE.md for context.

## Task Expiration

Recurring tasks created with `/loop` automatically expire after 3 days. The task fires one final time, then deletes itself. This prevents forgotten polling tasks from running indefinitely.

Desktop scheduled tasks do not auto-expire — they run until you disable or delete them.

## Configuration Tips

### Choosing the Right Interval

- **1-3 minutes** — active monitoring (deployment in progress, CI pipeline running)
- **5-10 minutes** — semi-active monitoring (PR checks, error logs)
- **15-30 minutes** — background health checks
- **Hourly/Daily** — audits, briefings, dependency checks

Shorter intervals consume more API credits. Match the interval to how quickly you need to know about changes.

### Writing Effective Scheduled Prompts

Scheduled prompts run without your real-time guidance, so they need to be self-contained:

**Be explicit about what to check:**

```
# Good
Check if the latest deployment to production succeeded by reading
the output of `vercel ls --prod`. Report the status and URL.

# Too vague
Check the deployment.
```

**Define what to do with results:**

```
# Good
If any test fails, write the failure details to test-failures.md
and include the file and line number of the likely cause.

# Too vague
Run the tests and let me know.
```

**Include thresholds and conditions:**

```
# Good
Check the error rate in logs/app.log. Only alert me if there are
more than 10 errors in the last hour or any error contains "database".

# Too noisy
Report every error in the logs.
```

## Combining with Other Claude Code Features

### Scheduler + Browser Access

Schedule tasks that interact with web applications:

```
# Requires /chrome or browser MCP
Every 30 minutes, open the Grafana dashboard at monitoring.internal/api-latency,
take a screenshot, and report if p99 latency exceeds 500ms.
```

### Scheduler + Git Automation

Automate routine git maintenance:

```
# Daily task
Check for any branches that haven't been updated in more than 7 days.
List them with their last commit date and author. Write the list to
stale-branches.md.
```

## Limitations

- **Session-scoped tasks (/loop) require an active CLI session** — they stop when you close the terminal
- **Desktop tasks require the app to be running** — they don't fire when the app is closed
- **No external triggers** — you can't fire a task based on a webhook or external event (use CI/CD for that)
- **No state between runs** — each execution is a fresh session, so tasks can't track "what changed since last run" natively (but they can read files or git history to approximate this)
- **/loop tasks expire after 3 days** — recreate them if you need longer-running monitors

## Related Resources

- [Claude Code: Complete Getting Started Guide](./claude-code-getting-started) — installation and basics
- [Claude Code Browser Access](../ai-development/claude-code-browser-access) — browser automation for scheduled web checks
- [Claude Dispatch: Asynchronous Task Management](../ai-development/claude-cowork-dispatch-events) — async task assignment from mobile
