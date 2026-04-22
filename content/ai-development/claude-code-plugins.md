# Claude Code Plugins

Claude Code **plugins** are packaged, shareable directories that extend [Claude Code](./claude-code) with custom slash commands, skills, subagents, hooks, and MCP servers. Where a bare `.claude/` folder inside a repo is a one-off customization, a plugin is the distributable unit — versioned, scoped to a name, and installable from a plugin marketplace.

If you've spent time adding personal slash commands or custom [hooks](./claude-code-hooks) to Claude Code and thought "other people on my team need this too," plugins are how you ship it.

## What a Plugin Actually Is

A plugin is a directory with a `.claude-plugin/plugin.json` manifest and any combination of these components:

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json           # Name, description, version, author
├── commands/                  # Flat markdown slash commands
├── skills/                    # Full SKILL.md directories
│   └── my-skill/
│       └── SKILL.md
├── agents/                    # Subagent definitions
├── hooks/
│   └── hooks.json             # Event handlers
├── .mcp.json                  # Bundled MCP servers
└── README.md
```

The manifest is the minimum requirement. Everything else is optional. A plugin that only adds a single slash command is legitimate; so is a plugin that bundles 20 skills, 5 subagents, 3 hooks, and an MCP server.

The defining feature of a plugin is **scoping**. When installed, commands and skills from a plugin are namespaced under the plugin's name. So instead of `/review`, you invoke `/my-plugin:review`. This prevents naming collisions between plugins and lets you install multiple plugins that each define similarly-named commands.

## Plugins vs. the Other Claude Code Extension Points

Claude Code has five ways to customize behavior, and the differences matter:

| Mechanism | Lives In | Purpose | Scope |
|-----------|----------|---------|-------|
| **Slash commands** | `commands/*.md` | Reusable prompt templates triggered with `/name` | File in plugin or `.claude/commands/` |
| **Skills** | `skills/<name>/SKILL.md` | Model-invoked expertise modules loaded on demand | Directory in plugin or `.claude/skills/` |
| **[Subagents](./multi-agent-task-delegation)** | `agents/*.md` | Specialized sub-sessions with their own system prompt and tools | File in plugin or `.claude/agents/` |
| **[Hooks](./claude-code-hooks)** | `hooks.json` | Deterministic event handlers (e.g., run tests on Stop) | File in plugin or `.claude/hooks.json` |
| **[MCP servers](./mcp-model-context-protocol)** | `.mcp.json` | External tools exposed over the Model Context Protocol | File in plugin or `.mcp.json` in project |

A plugin is the **packaging layer** that bundles these together. You don't choose "plugin OR skill"; you choose "ship this skill inside a plugin so others can install it with one command, OR drop it in `.claude/skills/` for my own use."

Practical rule: if the customization is specific to one repo, leave it in `.claude/`. If you want to share it across repos, your team, or the public, make it a plugin.

## How Plugins Are Installed

Plugins are installed via the `/plugin` command inside Claude Code. The flow has two steps: add a marketplace, then install from it.

```
/plugin marketplace add anthropics/claude-plugins-official
/plugin install github-integration@claude-plugins-official
```

The first command registers a marketplace — a GitHub repo or hosted endpoint that publishes a `marketplace.json` manifest listing available plugins. The second command pulls a specific plugin from that marketplace and caches it locally under `~/.claude/plugins/cache`.

The official Anthropic marketplace (`claude-plugins-official`) is pre-registered on fresh Claude Code installs. You can browse it at `claude.com/plugins` or with `/plugin marketplace list`.

To update an installed plugin:

```
/plugin update <name>
```

To remove one:

```
/plugin uninstall <name>
```

Uninstall also clears the scoped commands and skills so your `/` menu doesn't fill up with orphans.

## Publishing Your Own Plugin

Distributing a plugin means publishing a marketplace — either your own, or submitting to a community one.

A marketplace is a repo with a `marketplace.json` at the root:

```json
{
  "name": "my-team-plugins",
  "description": "Internal plugins for Acme Corp engineers",
  "plugins": [
    {
      "name": "deploy-helpers",
      "source": "git+https://github.com/acme/deploy-helpers",
      "tags": ["devops", "ci"],
      "description": "Slash commands and subagents for our deploy pipeline"
    }
  ]
}
```

Each entry points at a Git source. When a user runs `/plugin install deploy-helpers@my-team-plugins`, Claude Code clones that repo into the local plugin cache and wires up the components.

For internal distribution, host your marketplace on a private GitHub repo and share the `owner/repo` path with your team. For public distribution, submit to the official Anthropic marketplace or publish your own and link it from your docs.

## Building a Plugin: The Minimum Viable Example

Here's the smallest valid plugin that adds a single `/review` slash command:

```
code-review-helper/
├── .claude-plugin/
│   └── plugin.json
└── commands/
    └── review.md
```

`plugin.json`:

```json
{
  "name": "code-review-helper",
  "version": "0.1.0",
  "description": "Fast code review prompts",
  "author": "Jane Developer"
}
```

`commands/review.md`:

```markdown
---
description: Run a thorough code review on the current diff
---
Review the current git diff for:

1. Bugs and edge cases
2. Security issues (injection, auth, secrets)
3. Performance problems (N+1, unnecessary work)
4. Naming and clarity

Be direct. No pleasantries. If the code is fine, say so in one line.
```

Push that repo somewhere, list it in a marketplace manifest, and your team can install it with `/plugin install code-review-helper@your-marketplace`. Inside their sessions, `/code-review-helper:review` will run the review prompt on the current diff.

## A More Realistic Plugin

Most useful plugins bundle multiple pieces. Here's a DevOps-focused plugin structure that a small team might build:

```
deploy-kit/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   ├── deploy.md              # /deploy-kit:deploy
│   └── rollback.md            # /deploy-kit:rollback
├── skills/
│   └── cloudflare-deploy/
│       └── SKILL.md           # Invoked when model detects Cloudflare deploy task
├── agents/
│   └── release-coordinator.md # Subagent for orchestrating multi-service releases
└── hooks/
    └── hooks.json             # Post-deploy notification hook
```

The plugin contributes four scoped commands, one skill the model auto-loads when relevant, a subagent available via the `Agent` tool, and a hook that fires after successful deploys. Installing it is one command; distributing updates is a `git push`.

## Plugin Components in Detail

**Commands** are markdown files with an optional frontmatter description. The file body is the prompt template. They support `$ARGUMENTS` substitution so `/plugin:foo something something` passes `"something something"` into the prompt.

**Skills** use the full SKILL.md format. The model loads them on demand — it reads the skill's frontmatter and triggering conditions, not the full body, until it decides the skill is relevant. This keeps plugins with many skills cheap to install.

**Subagents** are defined as markdown files with frontmatter specifying the agent's name, description, and tool access. Claude Code makes them available through the `Agent` tool so the main session can delegate to them.

**Hooks** are declared in `hooks.json` and map Claude Code events (PreToolUse, PostToolUse, Stop, SessionStart) to shell commands. A deploy plugin might hook `PostToolUse` on the `Bash` tool to log every deploy attempt.

**MCP servers** are configured in `.mcp.json`. When the plugin is active, Claude Code starts the declared servers automatically and exposes their tools to the model.

## Concrete Plugin Examples

The official Anthropic marketplace and community marketplaces ship plugins you can study:

- **plugin-dev** — A toolkit for building plugins. Ships `/plugin-dev:create-plugin` (an 8-phase scaffolding workflow), an `agent-creator` subagent, a `plugin-validator`, and a `skill-reviewer`. Useful both as a tool and as a reference implementation.
- **github-integration** — Adds slash commands for common GitHub operations (create PR, triage issues, approve review) wired into `gh`.
- **code-intelligence** — Bundles an LSP-server MCP so Claude Code gets go-to-definition, find-references, and type info without leaving the session.

Browse the full list at claude.com/plugins or run `/plugin marketplace list` inside Claude Code.

## When to Build a Plugin vs. a Skill vs. a Subagent

A common question for teams new to Claude Code: which extension point should I use?

Use a **plugin** when you need to distribute functionality across multiple repos or to people outside your immediate project. Plugins exist because `.claude/` folders don't travel.

Use a **skill** (inside a plugin or standalone) when the capability is model-driven — the model should decide when to use it based on task content. Skills are great for "how to write changelogs for this team" or "checklist for publishing to our CDN."

Use a **subagent** (inside a plugin or standalone) when you need isolated context or a narrow role. Subagents have their own conversation history and tool set. Good for review, research, or long autonomous runs where you don't want the main session's context contaminated.

Use a **slash command** when the user should explicitly trigger the workflow with a keystroke.

Plugins let you ship all four, so the real question is usually "do I need to share this?"

## Related Reading

- [Claude Code](./claude-code) — The parent runtime
- [Claude Code Hooks](./claude-code-hooks) — Event handlers inside plugins
- [Multi-Agent Task Delegation](./multi-agent-task-delegation) — How subagents work
- [Vendor Claude Code Skills](./vendor-claude-code-skills) — Anthropic's built-in skills
- [MCP (Model Context Protocol)](./mcp-model-context-protocol) — The external-tool layer plugins can bundle
