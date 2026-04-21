# Claude Code Hooks

Claude Code hooks are automated actions that run at specific points during a Claude Code session — before a tool runs, after a file is written, when a session starts, or when the agent finishes. Unlike CLAUDE.md instructions (which are advisory), hooks are mandatory: they execute automatically and can block actions, run scripts, or trigger external systems.

Hooks turn Claude Code from a conversational tool into a programmable development environment with guardrails.

> *In the 5-concept stack, hooks configure the **Harness** (Claude Code). They do not change the Model or the prompt directly — they wire deterministic automation into the harness's agentic loop, typically enforcing rules that belong at the runtime layer rather than in Context. See [AI Agents vs Harnesses](./agents-vs-harnesses) for the full stack.*

## Why Use Hooks

- **Enforce quality automatically**: Run linters, formatters, or tests after every file write
- **Block risky actions**: Prevent edits to production configs or sensitive files
- **Add context**: Inject git status, environment info, or project state into every prompt
- **Notify external systems**: Post to Slack, update Jira, or trigger CI when Claude finishes work
- **Enforce team standards**: Make rules mandatory, not just suggested

## Hook Events

Hooks attach to lifecycle events in Claude Code. Each event fires at a specific moment:

| Event | When It Fires | Common Use |
|-------|--------------|------------|
| **PreToolUse** | Before a tool executes | Block risky file edits, validate commands |
| **PostToolUse** | After a tool succeeds | Auto-format, run tests, lint |
| **Notification** | On Claude notifications | Send alerts to Slack/desktop |
| **Stop** | When Claude finishes responding | Summary notifications, cleanup |
| **UserPromptSubmit** | Before Claude processes your prompt | Add context, validate input |
| **SessionStart** | When a new session begins | Load project context, check environment |

## Handler Types

Each hook event can trigger one or more handlers. There are four types:

### Command Handlers
Run shell commands. The simplest and most common handler type.
```json
{
  "type": "command",
  "command": "prettier --write $CLAUDE_FILE_PATHS"
}
```
Command handlers receive JSON input via stdin and communicate results via exit codes:
- Exit 0: success
- Exit 1: error (blocks the action for PreToolUse)
- Exit 2: rewake (for async hooks)

### Prompt Handlers
Send input to a Claude model (typically Haiku) for evaluation. Good for judgment calls that a simple script can't make.
```json
{
  "type": "prompt",
  "prompt": "Does this code change look safe? Check for credential exposure or destructive operations: $ARGUMENTS"
}
```

### Agent Handlers
Spawn a subagent with access to tools like Read, Grep, and Glob. Use for complex verification that needs to examine multiple files.
```json
{
  "type": "agent",
  "command": "Check that this change follows our API route pattern. Read src/api/route-template.ts for the expected pattern, then compare."
}
```

### HTTP Handlers
POST JSON to an external URL. Perfect for webhooks and notifications.
```json
{
  "type": "http",
  "url": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
  "headers": {
    "Authorization": "Bearer $SLACK_TOKEN"
  },
  "allowedEnvVars": ["SLACK_TOKEN"],
  "timeout": 30
}
```

## Configuration

Hooks are configured in `settings.json` at two levels:

- **User-level**: `~/.claude/settings.json` — applies to all projects
- **Project-level**: `.claude/settings.json` — applies to this project only

### Basic Structure
```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "optional tool filter",
        "hooks": [
          {
            "type": "command",
            "command": "your-command-here"
          }
        ]
      }
    ]
  }
}
```

### Handler Options
Each handler supports additional options:
- **`message`**: Text shown in the spinner while the hook runs
- **`once`**: Run only once per session (boolean)
- **`async`**: Run in the background without blocking (boolean)
- **`asyncRewake`**: If true and the hook exits with code 2, rewake the agent

### Matchers
Matchers filter which tool triggers the hook. Without a matcher, the hook runs for every tool use.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $CLAUDE_FILE_PATHS"
          }
        ]
      }
    ]
  }
}
```

This only triggers when Claude uses the Write tool, not for every tool call.

## Practical Examples

### Auto-Format on File Write
Run Prettier after every file write to ensure consistent formatting:
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $CLAUDE_FILE_PATHS",
            "message": "Formatting..."
          }
        ]
      }
    ]
  }
}
```

### Run Tests After Code Changes
Automatically run the test suite after Claude modifies source files:
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npm test 2>&1 | tail -20",
            "message": "Running tests..."
          }
        ]
      }
    ]
  }
}
```

### Block Edits to Sensitive Files
Prevent Claude from modifying production configs, environment files, or CI pipelines:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "echo $CLAUDE_FILE_PATHS | grep -qE '(\\.env|production|ci/|\\.github/workflows)' && echo 'BLOCKED: Cannot edit sensitive files' && exit 1 || exit 0"
          }
        ]
      }
    ]
  }
}
```

### Inject Git Context Into Every Prompt
Add the current git status and branch to every user prompt for better situational awareness:
```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo \"Git branch: $(git branch --show-current). Changed files: $(git diff --name-only HEAD | tr '\\n' ', ')\"",
            "message": "Loading git context..."
          }
        ]
      }
    ]
  }
}
```

### Slack Notification When Claude Finishes
Post a message to Slack when Claude completes a task:
```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "http",
            "url": "https://your-slack-webhook-url",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

### Security Review on Pre-Tool Use
Use an AI judge to evaluate whether a code change is safe before allowing it:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Review this file change for security issues. Check for: hardcoded credentials, SQL injection, XSS vulnerabilities, or exposed internal endpoints. If any are found, respond with BLOCK and explain why. Change details: $ARGUMENTS"
          }
        ]
      }
    ]
  }
}
```

## Hooks vs CLAUDE.md

| Aspect | Hooks | CLAUDE.md |
|--------|-------|-----------|
| **Enforcement** | Mandatory — runs automatically | Advisory — Claude tries to follow but may deviate |
| **Execution** | Runs real code/scripts | Provides text instructions |
| **Blocking** | Can block actions (PreToolUse) | Cannot block anything |
| **External integration** | Can call APIs, run tests, format files | Cannot execute code |
| **Best for** | Quality gates, automation, guardrails | Conventions, architecture context, examples |

Use both together: CLAUDE.md tells Claude *what* to do, hooks *enforce* that it's done correctly.

## Tips

- **Start simple**: Begin with PostToolUse command hooks for formatting and linting. Add complexity as you learn what your workflow needs.
- **Use matchers**: Without matchers, hooks run on every tool call. This gets noisy fast. Match on specific tools like Write, Edit, or Bash.
- **Keep hooks fast**: Slow hooks delay every action. Format a single file, not the whole project. Run targeted tests, not the full suite.
- **Test hooks locally**: Run your hook command manually first to verify it works before adding it to settings.json.
- **Use project-level hooks**: Team-specific guardrails go in `.claude/settings.json` (committed to the repo). Personal preferences go in `~/.claude/settings.json`.
- **Combine handler types**: Use a command handler for the fast path (lint check) and a prompt handler for the judgment call (is this change safe?).

## How It's Used in VibeReference

Hooks are the enforcement layer for AI-assisted development workflows. While CLAUDE.md files and coding conventions guide Claude's behavior through context, hooks guarantee that quality standards are met — formatting is applied, tests pass, and sensitive files are protected. For teams building SaaS applications with AI agents, hooks are the difference between "the AI usually follows our rules" and "the AI always follows our rules."
