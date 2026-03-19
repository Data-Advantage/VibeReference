# Giving Claude Code Browser Access

Giving Claude Code browser access unlocks a new tier of automation: the agent can open tabs, click buttons, fill forms, read page content, inspect the DOM, monitor network requests, and interact with web apps — all while you watch or step away. There are three primary ways to wire this up, each with different trade-offs around session access, security, and use case fit.

## Why Browser Access Matters

Without browser access, Claude Code works entirely in files and terminals. With it, you can delegate tasks that previously required a human at the keyboard — testing UI flows, extracting data from web dashboards, automating SaaS admin workflows, debugging visual rendering bugs, or verifying that a just-deployed site looks correct.

The key architectural choice is whether Claude touches your real browser session (with cookies and login state) or a clean, isolated browser instance.

## The Three Approaches

### 1. Claude in Chrome Extension (Official)

Anthropic ships an official Chrome extension — "Claude in Chrome" — that connects Claude Code to a real, live Chrome window running your authenticated browser session.

**How it works:**

- Install the extension from the Chrome Web Store
- Start Claude Code with `--chrome` or type `/chrome` inside a running session
- Claude can open new tabs, navigate URLs, click, type, and read page content
- All actions happen in a visible Chrome window in real time

**What makes it unique:** Claude reuses your existing browser login state. It can interact with apps you're already signed into — internal dashboards, SaaS tools, analytics platforms, admin panels — without you needing to re-authenticate or manage test accounts.

**Setup:**

```bash
# Install the extension from Chrome Web Store: "Claude in Chrome"
# Requires version 1.0.36 or higher

# Start a session with browser access
claude --chrome

# Or connect from an existing session
/chrome

# Enable by default (runs /chrome at session start)
/chrome → "Enabled by default"
```

**Requirements:**
- Google Chrome or Microsoft Edge (not Brave, Arc, or other Chromium forks)
- Extension version 1.0.36+
- Anthropic Pro, Max, Teams, or Enterprise plan
- Not supported on WSL (Windows Subsystem for Linux)

**Limitations:**
- Claude pauses and asks you to handle login pages and CAPTCHAs manually
- Enabling by default increases context usage (browser tools always loaded)
- Still in beta

---

### 2. Chrome DevTools Protocol (CDP) / MCP Browser Servers

Community tools expose a separate, clean Chrome instance to Claude Code via the Chrome DevTools Protocol (CDP) — the same mechanism that powers Chrome's built-in DevTools panel. These typically package themselves as MCP servers.

**How it works:**

- A local MCP server (like `chrome-devtools-mcp`) runs a headless or visible Chrome instance
- Claude Code connects to it as just another MCP tool
- Claude can inspect DOM, query elements, monitor network requests, read console output (with source-mapped stack traces), take screenshots, and run JavaScript in the page context

**What makes it unique:** The browser is isolated from your main profile. Claude gets a fresh, clean session — no cookies, no login state, no access to your accounts. This is ideal for deterministic, reproducible automation.

**Setup (using chrome-devtools-mcp):**

```bash
# Install via Claude Code marketplace
/plugin marketplace add ChromeDevTools/chrome-devtools-mcp

# Or install manually via npm
npm install -g chrome-devtools-mcp
```

Then add to your Claude Code MCP config (`.claude/settings.json`):

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "chrome-devtools-mcp"
    }
  }
}
```

**Other popular CDP/MCP options:**
- `chrome-devtools-mcp` — official Chrome DevTools team project
- `mcp-puppeteer` — Puppeteer-based automation with screenshot support
- `playwright-mcp` — Microsoft Playwright wrapped as MCP server
- `dev-browser` — lightweight browser skill by SawyerHood

**Best for:**
- Automated UI testing in a clean environment
- Performance profiling and network analysis
- DOM inspection during development
- Reproducible browser automation without credential risk

---

### 3. Claude Code Web (Browser-Native)

Claude Code Web is the browser-based version of Claude Code — a full Claude Code environment that runs in a tab rather than a local terminal. It connects to GitHub, runs tasks in sandboxed cloud environments, and lets you dispatch code work from any device.

**How it works:**

- Access at [claude.ai/code](https://claude.ai/code) — no local install required
- Connects to your GitHub repositories directly
- Runs tasks in isolated cloud environments
- Interacts with web resources and code hosting rather than your local system

**What makes it unique:** You're not running anything locally. It's useful for delegating long-running background tasks, doing repo work from a Chromebook or iPad, or running Claude in an environment where installing CLI tools is restricted.

**Limitations:**
- No access to your local filesystem or browser state
- Sandboxed cloud environment — can't interact with locally running apps
- Better for code-centric tasks than live web automation

---

## The Power-User Hybrid Stack

Practitioners converge on combining two of the three approaches for maximum coverage:

| Layer | Tool | Purpose |
|-------|------|---------|
| **Clean browser** | CDP/MCP server (chrome-devtools-mcp or Playwright MCP) | DOM inspection, performance profiling, console debugging, reproducible UI tests |
| **Real browser session** | Claude in Chrome extension | Acting inside authenticated SaaS dashboards, admin panels, analytics tools |
| **Async code tasks** | Claude Code Web (optional) | Long-running repo work without keeping a terminal open |

This split-browser setup gives you both isolation (for debugging) and full session access (for automation inside real apps) — both orchestrated by a single Claude Code session.

```
Claude Code CLI
  ├── /chrome ──────────► Claude in Chrome extension
  │                        (your real Chrome, cookies, sessions)
  │
  └── MCP server ────────► chrome-devtools-mcp / Playwright
                           (clean browser, no cookies, reproducible)
```

---

## Decision Framework

**Use Claude in Chrome if:**
- You need Claude to act inside apps you're already logged into
- You're automating workflows against internal tools or SaaS dashboards
- You want visible, real-time browser actions you can interrupt
- Session cookies and auth state must carry over

**Use a CDP/MCP server if:**
- You want deterministic, reproducible automation
- You're debugging DOM, CSS, network, or console issues
- You don't want Claude touching your real browser session
- You need screenshots or performance traces

**Use Claude Code Web if:**
- You're away from your development machine
- You want to dispatch long-running code tasks without a local terminal
- You need GitHub integration in a browser-only environment

---

## Security Considerations

Browser automation significantly expands Claude's reach. Before enabling it:

### Claude in Chrome
- **Restrict domains**: Use the extension's site-level permission controls to whitelist only the domains Claude is allowed to interact with
- **Watch for SSRF patterns**: Claude could be prompted to navigate to internal URLs and exfiltrate data
- **Treat it like shell access**: Claude with live browser control and login state is effectively you at the keyboard

### CDP/MCP Servers
- **Only install from trusted sources**: Anthropic does not audit community MCP servers
- **Deny sensitive file access**: Add deny rules to block `.env`, `~/.aws/credentials`, and similar paths
- **Least privilege principle**: Only activate browser MCP when you need it, not by default

### General Rules
- Don't run Claude Code as admin/root — it inherits your process permissions
- Never expose the CDP port (default: 9222) outside localhost
- Audit MCP server source code before installing, especially anything that combines browser + filesystem access

---

## Related Tools

- [Claude Code CLI](./agentic-coding) — the base tool that browser access extends
- [MCP (Model Context Protocol)](./mcp-model-context-protocol) — the protocol browser tools use to connect to Claude
- [Coding Harnesses](./coding-harnesses) — automated feedback loops that pair well with browser testing
- [Human-in-the-Loop](./human-in-the-loop) — patterns for staying in control during automated browser workflows
