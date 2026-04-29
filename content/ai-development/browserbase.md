# Browserbase

Browserbase is a managed cloud platform that runs headless Chrome instances purpose-built for AI agents. One API key gives an agent a real browser session — with stealth, captcha handling, file I/O, recordings, and persistent identity — without any of the Puppeteer-on-EC2 plumbing it would otherwise take to ship.

If your agent needs to log into Gmail, fill out a form, scrape a page that fights bots, or just navigate the web like a human, Browserbase is the infrastructure layer most production AI builders reach for in 2026.

## What it is

Most AI agent demos work fine until the moment they need to actually use the web. The tools developers reach for first — `fetch`, raw HTML scraping, search APIs — fall over the moment they hit a single-page app, a login wall, a captcha, or anything that looks like a browser fingerprint check.

The mainstream answer to those problems is to spin up Playwright or Puppeteer. The mainstream cost is the operational tail: a fleet of Chrome processes, container memory pressure, browser binaries that need updates, fingerprint randomization, residential proxies, captcha solvers, session persistence, and a debugger you trust enough to actually use in production.

Browserbase consolidates that tail into a managed product. You call the SDK, you get back a connection URL, and you point your existing Playwright or Puppeteer code at it. The browser runs on Browserbase infrastructure with stealth, observability, and scaling already wired up.

## Status

Browserbase is generally available. The platform has been live since 2024 and went into broad production use across the AI agent ecosystem through 2025. The Stagehand SDK (the AI-controlled wrapper, covered below) and the Functions runtime are the two main expansions added on top.

## Core features

**Managed Chrome in the cloud.** Each session is an isolated Chrome instance running on Browserbase infrastructure. Sessions can be created, attached to, paused, resumed, and torn down through the API. No browser binary management on your side.

**Stealth and captcha handling.** Built-in fingerprint randomization, residential-proxy network paths, and automatic captcha solving (on paid plans) handle the anti-bot defenses that defeat naive Playwright setups on sites like LinkedIn, Google search, ticketing platforms, and most large e-commerce.

**Session persistence.** Sessions can carry cookies, localStorage, and identity across runs — the agent that logged in yesterday can resume the same authenticated session today instead of going through OAuth on every invocation.

**Recordings and observability.** Every session produces a synchronized video screencast, network log, console log, and DOM replay. When an agent does something weird, you scrub through the recording and find out exactly which click went sideways.

**File uploads and downloads.** Sessions expose APIs for moving files in and out of the browser environment, which is what unblocks "have the agent fill out a form that requires uploading a PDF" or "download the report and email it."

**Functions runtime.** Browserbase will run your automation code on its own infrastructure (no Vercel/AWS deploy on your side), invokable as an API. Useful when the agent runtime should live next to the browser, not across an open Internet hop.

**Fetch API.** A lightweight HTTP fetch primitive that runs through the same proxy and stealth stack as a full browser session — for cases where you want anti-bot resilience without a full Chrome.

## The Node SDK

Install:

```bash
npm install @browserbasehq/sdk
```

Set `BROWSERBASE_API_KEY` and `BROWSERBASE_PROJECT_ID` in your environment.

Create a session, attach Playwright, drive the browser:

```ts
import { Browserbase } from "@browserbasehq/sdk";
import { chromium } from "playwright-core";

const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });

const session = await bb.sessions.create({
  projectId: process.env.BROWSERBASE_PROJECT_ID!,
});

const browser = await chromium.connectOverCDP(session.connectUrl);
const context = browser.contexts()[0];
const page = context.pages()[0];

await page.goto("https://example.com");
const title = await page.title();
console.log(title);

await browser.close();
```

The same pattern works with Puppeteer via `puppeteer.connect({ browserWSEndpoint: session.connectUrl })`. If you have an existing Playwright or Puppeteer codebase, swapping in Browserbase is a connection-string change rather than a rewrite.

A Python SDK is also available with the same surface area; install it with `pip install browserbase`.

## Stagehand: AI-driven browser automation

Stagehand is Browserbase's higher-level SDK for AI-controlled browsing. Rather than writing CSS selectors and explicit click chains, you describe what you want in natural language and let the model resolve it against the live page.

```bash
npm install @browserbasehq/stagehand
```

The three core methods:

```ts
import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";

const stagehand = new Stagehand({ env: "BROWSERBASE" });
await stagehand.init();
const page = stagehand.page;

await page.goto("https://github.com/browserbase");

// act() — perform an action described in natural language
await page.act("click on the stagehand repo");

// extract() — pull structured data, with a Zod schema for type safety
const { author, title } = await page.extract({
  instruction: "extract the author and title of the most recent PR",
  schema: z.object({
    author: z.string().describe("The username of the PR author"),
    title: z.string().describe("The title of the PR"),
  }),
});

// observe() — list the actions available on the current page
const actions = await page.observe();

await stagehand.close();
```

Stagehand sits on top of Playwright, so anything you cannot resolve through `act/observe/extract` can drop down to raw Playwright commands without leaving the same session. That is the practical difference between Stagehand and pure-LLM browser tools — when natural language fails, you have a deterministic escape hatch.

For full agent loops, Stagehand also exposes an `agent()` constructor that wires the session to OpenAI's `computer-use-preview` or Anthropic's computer-use models in one call:

```ts
const agent = stagehand.agent({
  provider: "anthropic",
  model: "claude-sonnet-4-5",
});

await agent.execute("Find the most recent PR on the stagehand repo and summarise it.");
```

The agent runs a multi-step loop on its own, the screencast captures everything it did, and Stagehand's caching layer skips repeat LLM calls for repeated actions on the same page.

## Pricing

Browserbase has a free tier with limited monthly browser hours and concurrent sessions, sufficient for prototyping. Paid plans are tiered by browser hours, concurrent sessions, captcha-solving inclusion, and whether stealth/residential proxies are available. Pricing details and current quotas live at [browserbase.com/pricing](https://browserbase.com/pricing).

A reasonable default: prototype on the free tier, upgrade to Developer or Startup once you ship to production users — that is the band where stealth and captcha solving become necessary, not optional.

## Common patterns

- **Web scraping that survives anti-bot defenses.** Sites that block raw `fetch` and even Playwright-on-your-own-VPS are mostly fine through Browserbase's stealth + residential proxy stack.
- **AI agents that browse the web.** Pair Stagehand or the agent helper with [Claude](/ai-models/claude), GPT, or Gemini and the agent operates a real browser instead of a text-only search API.
- **Form filling and submission.** Long, multi-step forms that require uploads, conditional fields, and post-submit verification — the kind of work that defeats most no-code automation tools.
- **Authenticated workflows.** Persistent sessions let the agent log in once, store cookies, and resume authenticated for days. Skip OAuth gymnastics on every invocation.
- **Recording-first debugging.** When an agent fails in production, the screencast plus network log usually pinpoints the failure in under five minutes — much faster than reproducing locally.
- **Scheduled scrapers.** Run a Browserbase Function on a cron and have it scrape, transform, and post to your database without managing any browser infrastructure.

## When to use it

- Your agent or scraper needs to interact with sites that fight automation (single-page apps, captcha-protected pages, fingerprint checks).
- You need a real browser, not a headless HTTP client — JavaScript rendering, drag-and-drop, file uploads, screenshot output.
- You are running enough sessions concurrently that managing your own headless Chrome fleet has become real operational work.
- Observability matters and you would rather scrub a recording than reproduce locally.
- You are using AI computer-use models (Claude or GPT) and want the browser layer to "just work."

## When to skip it

- One-off scripts you run on your laptop. Local Playwright is faster to set up and free.
- Pure HTML scraping where a `fetch` plus `cheerio` does the job. Browserbase is overkill.
- Cost-sensitive prototypes where the free tier limits are tight and you do not need stealth or captchas.
- Hard real-time scenarios where the network hop to Browserbase's region adds latency you cannot afford.

## How it compares

| | Browserbase | Self-hosted Playwright/Puppeteer | Apify | Bright Data |
|---|-------------|----------------------------------|-------|-------------|
| **Primary use** | AI agents, scraping, browser automation | Same — but you own the infra | Actor-based scraping platform | Proxy + scraping infrastructure |
| **Stealth / anti-bot** | Built in | DIY (fingerprints, proxies, captcha solvers) | Built in for popular sites | Best-in-class proxies, less of a browser focus |
| **Recordings** | First-class | DIY tooling | Limited | Limited |
| **AI integration** | Stagehand SDK + computer-use agents | Wire it yourself | Some templates | Some templates |
| **Pricing model** | Browser-hours + sessions | Cloud bill + ops time | Per actor run | Per GB / per request |
| **Best for** | AI agents that browse | Total control; one-off scripts | Pre-built scrapers; large-scale crawls | Heavy proxy needs |

The pragmatic 2026 default for an AI agent product: Browserbase + Stagehand for the browser layer, [Vercel AI SDK](/ai-development/ai-sdk) or the [Claude Agent SDK](/ai-development/claude-agent-sdk) for the agent loop, your existing platform of choice for hosting the orchestration code. The pieces compose cleanly.

## Integration with agent SDKs

Browserbase plugs into the major agent toolkits without ceremony:

- **Vercel AI SDK** — wrap a Browserbase session in a `tool()` definition; the model calls `act` / `extract` and the result flows back as the tool response.
- **Claude Agent SDK** — define the browser tools via `@vercel/sandbox`-style or the Agent SDK's `tool()` helper, then mount Stagehand inside. Browserbase calls become typed steps the agent can chain.
- **MCP** — Browserbase ships a Model Context Protocol server, so any MCP-aware client (Claude Code, Cursor, custom agents) can drive a browser session as a first-class tool.
- **Stagehand `agent()`** — the path of least resistance if you do not need custom orchestration. One call, the session runs to completion, the recording is in your dashboard.

## Limitations and tradeoffs

- **Vendor lock-in.** Your stealth stack is now Browserbase's stealth stack. If they change pricing or capabilities, your agent fleet shifts with them.
- **Region latency.** All sessions run in Browserbase regions; if you need a session geographically close to a specific endpoint, that is a constraint to plan around.
- **Hard sites still hard.** Banking portals, some social networks, and aggressively-defended booking platforms still defeat Browserbase periodically. The reported success rate on the most fortified targets is roughly 50–70%, not 99%.
- **Cost at scale.** Browser hours add up. A naive deployment that holds sessions open for an hour each can run up real bills; design for short-lived sessions and aggressive cleanup.

## Further reading

- [Browserbase docs](https://docs.browserbase.com)
- [Stagehand docs](https://docs.stagehand.dev)
- [Browserbase changelog](https://www.browserbase.com/changelog)
- [@browserbasehq/sdk on npm](https://www.npmjs.com/package/@browserbasehq/sdk)
- [@browserbasehq/stagehand on npm](https://www.npmjs.com/package/@browserbasehq/stagehand)

Related references on this site: [Claude Agent SDK](/ai-development/claude-agent-sdk), [AI SDK](/ai-development/ai-sdk), [MCP — Model Context Protocol](/ai-development/mcp-model-context-protocol), [Cloud Coding Agents](/ai-development/cloud-coding-agents).
