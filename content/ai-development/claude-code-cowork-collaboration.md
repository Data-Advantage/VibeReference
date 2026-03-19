# Team Collaboration with Claude Code CoWork

Claude CoWork brings Claude Code's agentic capabilities beyond the terminal and into everyday knowledge work. Launched in January 2026 as a research preview, CoWork is a desktop application where Claude can access your local files, organize documents, create and edit content, and execute multi-step tasks — while you focus on higher-level decisions. Think of it as Claude Code for the rest of your work.

## What CoWork Does

CoWork runs as a desktop app on macOS and Windows. Once you grant it access to a folder, Claude can read, create, and edit files in that directory. You give it a task in natural language, it makes a plan, and then works through it step by step — looping you in on progress and decisions along the way.

This is different from chatting with Claude in a browser. CoWork operates on your actual filesystem, which means it can reorganize a messy folder of research notes, draft a document based on files you point it to, or process a batch of spreadsheets — all without you copy-pasting content back and forth.

## Core Capabilities

### File Access and Management

CoWork reads and writes files on your local machine. Point it at a project folder and it can:

- Read documents, spreadsheets, code files, and notes
- Create new files based on your instructions
- Edit existing files with tracked changes
- Organize and rename files based on content or conventions

```
> Organize the files in my /research folder into subfolders by topic.
  Read each document to determine the topic, then move it to the
  appropriate subfolder.
```

### Multi-Step Task Execution

CoWork handles complex, multi-step workflows autonomously. When you assign a task, Claude:

1. Analyzes what needs to be done
2. Creates a visible plan
3. Executes each step, showing progress
4. Asks for your input when decisions are needed

```
> Review all the meeting notes in /notes from this week. Create a summary
  document with action items, organized by team member. Flag anything
  that looks time-sensitive.
```

### Instructions: Global and Per-Folder

CoWork supports instruction files — similar to CLAUDE.md in Claude Code — that give Claude persistent context about how you work:

- **Global instructions** apply across all CoWork sessions
- **Folder instructions** apply when working within a specific directory

This means you can tell Claude "always write documents in AP style" globally, and "use the client's preferred terminology from glossary.md" for a specific project folder.

## Plugins and MCP Integration

CoWork supports plugins through the Model Context Protocol (MCP), extending Claude's capabilities beyond the filesystem:

- **File system plugins** — access to additional directories and network drives
- **Web plugins** — search the web, fetch URLs, interact with web services
- **Custom connectors** — connect to internal tools, databases, or APIs

The plugin ecosystem means CoWork can pull data from a CRM, check a project management tool, or search internal documentation — all within the same conversation.

## Collaboration Patterns

### Individual Productivity

The most straightforward use: delegate tedious knowledge work to Claude while you focus on judgment-heavy tasks.

**Research synthesis:** Point Claude at a folder of PDFs, articles, or notes and ask it to synthesize key findings, identify contradictions, or draft a summary with citations.

**Document creation:** Describe what you need — a proposal, a report, a set of meeting agendas — and Claude drafts it using your existing files as source material.

**Data processing:** Have Claude process CSV exports, normalize data across spreadsheets, or extract specific information from a batch of documents.

### Team Workflows

When multiple team members use CoWork on shared directories (via cloud sync or network drives), it enables asynchronous collaboration patterns:

**Handoff documents:** One person works with Claude to create a structured handoff document, and the next person picks up where they left off with full context.

**Review workflows:** Draft a document with Claude, share it for team review, then use Claude to incorporate feedback from multiple reviewers into a final version.

**Consistent formatting:** With folder-level instructions, everyone on the team gets documents formatted the same way — same headings, same terminology, same structure.

## CoWork vs. Claude Code

| Feature | Claude Code | CoWork |
|---------|------------|--------|
| **Interface** | Terminal / CLI | Desktop app |
| **Primary use** | Software development | Knowledge work, document processing |
| **File access** | Full project directory | Selected folders |
| **Command execution** | Shell commands, builds, tests | File operations, document creation |
| **Audience** | Developers | All knowledge workers |
| **Platform** | macOS, Linux, Windows | macOS, Windows |

They share the same underlying Claude models and the same agentic architecture — the difference is where they run and what they're optimized for.

## Getting Started with CoWork

1. **Download the desktop app** from [claude.ai/cowork](https://claude.ai/cowork)
2. **Grant folder access** — select which directories Claude can read and write
3. **Set up instructions** — create global or folder-level instruction files
4. **Start a conversation** — describe your task in natural language
5. **Review and approve** — Claude shows its plan before making changes

## Dispatch: Asynchronous Task Assignment

CoWork includes a feature called Dispatch (previewed March 2026) that lets you send tasks to your desktop Claude session from your phone. Assign a task from anywhere, and when you return to your computer, the work is done.

Dispatch shifts the interaction model from synchronous (watching Claude work) to asynchronous (assign and return). Your phone acts as a remote control for your desktop CoWork session — all processing happens locally on your computer.

Currently available to Max subscribers ($100/month), with Pro ($20/month) access rolling out.

## Best Practices

**Start with a clear folder structure.** CoWork works best when files are organized in a way that makes context easy to gather. A flat folder with 500 unsorted files is harder for Claude to navigate than a well-organized hierarchy.

**Use folder instructions liberally.** Any recurring context — style guides, terminology, project conventions — should go in folder instructions rather than being repeated in every conversation.

**Review changes before committing.** CoWork shows you what it plans to do, but always review the actual file changes, especially for documents that will be shared externally.

**Combine with Claude Code for technical projects.** Use Claude Code for the codebase and CoWork for the documentation, planning, and research that surrounds it.

## Related Resources

- [Claude Code: Complete Getting Started Guide](../guides/claude-code-getting-started) — the terminal-based developer tool
- [Claude Code Browser Access](./claude-code-browser-access) — extending Claude with browser automation
- [Automating Workflows with Claude Code Scheduler](../guides/claude-code-scheduler-automation) — scheduling recurring tasks
- [Claude Dispatch: Asynchronous Task Management](./claude-cowork-dispatch-events) — deep dive on Dispatch
