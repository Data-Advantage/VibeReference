# Vercel Firewall

Vercel Firewall is the security layer that sits in front of every Vercel deployment. It bundles automatic DDoS mitigation, a customizable Web Application Firewall (WAF), rate limiting, bot detection (Vercel BotID), AI-crawler blocking, OWASP rulesets, and IP allow/block lists into a single configurable layer that runs at the edge — globally, with rule changes propagating in under 300ms.

If you have a production app on Vercel and have not configured the firewall, you are running on the platform's defaults. The defaults are good — DDoS mitigation is automatic and free on every plan — but the configurable layers (WAF rules, rate limits, bot challenges) are how you stop the WordPress scanners, credential-stuffing attempts, and AI-crawler scraping that hit every site in 2026.

## What it is

The firewall is a multi-layer system that evaluates every incoming request before it reaches your function code. The execution order matters:

1. **DDoS mitigation rules** — automatic, platform-wide, free.
2. **WAF IP blocking rules** — explicit allow / deny lists.
3. **WAF custom rules** — your own rules in priority order.
4. **WAF managed rulesets** — OWASP Core Ruleset, Bot Protection, AI Bot blocking.

Changes are pushed globally and take effect in under 300 milliseconds — no redeployment, no propagation wait. That is the difference between "ship the rule" and "ship the rule and stress-watch logs for 20 minutes" on most other CDN platforms.

## DDoS Protection

DDoS mitigation runs automatically on every Vercel project, on every plan, with no configuration. The implementation:

- Layer 3/4 mitigation, always on.
- Layer 7 protection tailored to web applications, automatic.
- Vercel's "Protectd" infrastructure analyzes ~550K events per second globally with a median mitigation time of 2.5 seconds and processes 1B+ suspicious TCP connections per week.
- Documented mitigation of attacks up to 1.37 Tbps with zero downtime.

Blocked requests do not count toward your CDN or function usage. There is no checkbox to turn on, and no charge — DDoS protection is part of the platform.

## WAF Custom Rules

Custom rules are the configurable heart of the firewall. Each rule is JSON, with a condition group and an action:

```json
{
  "name": "Block WordPress scanners",
  "description": "Block common WordPress probe paths",
  "active": true,
  "conditionGroup": [
    {
      "conditions": [
        {
          "type": "path",
          "op": "re",
          "value": "^/wp-(admin|login|content|includes)/"
        }
      ]
    }
  ],
  "action": {
    "mitigate": { "action": "deny" }
  }
}
```

Logic: each object in `conditionGroup` is an **OR** group; conditions inside a single group are **AND**ed. A rule with two condition groups fires when *either* matches. A rule with two conditions in one group fires when *both* match.

### Condition types

The WAF exposes 25 condition types — far beyond the typical IP / path / user-agent triplet most CDN firewalls offer:

| Type | Use it for |
|------|------------|
| `path`, `target_path`, `route`, `raw_path` | URL routing, with both raw and resolved variants |
| `method`, `host`, `protocol`, `scheme` | Basic request shape |
| `ip_address` | Client IP, supports CIDR |
| `user_agent` | UA string matching |
| `header`, `query`, `cookie` | Inspect specific request fields (requires a `key`) |
| `geo_country`, `geo_continent`, `geo_country_region`, `geo_city`, `geo_as_number` | Geographic + ASN filtering |
| `ja4_digest`, `ja3_digest` | TLS client fingerprints — block known malicious TLS stacks |
| `region` | Vercel edge region serving the request |
| `environment` | Production, preview, development |
| `bot_name`, `bot_category` | Specific bots when Bot Protection is enabled |
| `server_action` | Next.js Server Action ID |

### Operators

| Op | Meaning |
|----|---------|
| `eq` / `neq` | Equals / not equals |
| `re` | Regex match |
| `pre` / `suf` / `sub` | Starts with / ends with / contains |
| `inc` / `ninc` | In array / not in array |
| `ex` / `nex` | Exists / not exists |
| `gt` / `gte` / `lt` / `lte` | Numeric comparisons |

Add `neg: true` to invert any condition.

### Actions

| Action | Effect |
|--------|--------|
| `log` | Allow traffic, log only |
| `deny` | Block (HTTP 403) |
| `challenge` | JavaScript browser challenge — humans pass, scripted clients fail |
| `bypass` | Skip all subsequent WAF rules |
| `rate_limit` | Apply a rate-limit policy (configured separately) |
| `redirect` | Send to another URL |

`actionDuration` is the mechanism for **persistent actions** — once a rule fires for a client, the action sticks for the duration window. So a `deny` with `actionDuration: "1h"` blocks the offender for an hour even if subsequent requests would not have matched the rule on their own. This is how you turn a single trigger into a meaningful punishment for scrapers and abusers.

## Practical rule examples

Block sanctioned countries:

```json
{
  "name": "Block OFAC Sanctioned Countries",
  "active": true,
  "conditionGroup": [
    { "conditions": [
      { "type": "geo_country", "op": "inc", "value": ["CU", "IR", "KP", "RU", "SY"] }
    ] }
  ],
  "action": { "mitigate": { "action": "deny" } }
}
```

Require an API key on /api routes:

```json
{
  "name": "Require API Key",
  "active": true,
  "conditionGroup": [
    { "conditions": [
      { "type": "header", "op": "nex", "key": "x-api-key" },
      { "type": "path", "op": "pre", "value": "/api/" }
    ] }
  ],
  "action": { "mitigate": { "action": "deny" } }
}
```

Challenge all `curl` requests:

```json
{
  "name": "Challenge cURL",
  "active": true,
  "conditionGroup": [
    { "conditions": [
      { "type": "user_agent", "op": "re", "value": "^curl/" }
    ] }
  ],
  "action": { "mitigate": { "action": "challenge" } }
}
```

Block by JA4 TLS fingerprint:

```json
{
  "name": "Block Known Malicious JA4",
  "active": true,
  "conditionGroup": [
    { "conditions": [
      { "type": "ja4_digest", "op": "eq", "value": "t13d1516h2_8daaf6152771_b0da82dd1658" }
    ] }
  ],
  "action": { "mitigate": { "action": "deny", "actionDuration": "1h" } }
}
```

JA4 fingerprinting is the move that catches sophisticated bots that rotate user-agents and IPs — the TLS handshake itself reveals the client library.

## Rate Limiting

Rate limit rules are a special action on a custom rule:

```json
{
  "name": "API Rate Limit — 100 req/min",
  "active": true,
  "conditionGroup": [
    { "conditions": [{ "type": "path", "op": "pre", "value": "/api/" }] }
  ],
  "action": {
    "mitigate": {
      "action": "rate_limit",
      "rateLimit": {
        "algo": "fixed_window",
        "window": 60,
        "limit": 100,
        "keys": ["ip"],
        "action": "deny"
      }
    }
  }
}
```

Login-endpoint protection — challenge after 10 attempts in a minute:

```json
{
  "name": "Login Rate Limit",
  "active": true,
  "conditionGroup": [
    { "conditions": [
      { "type": "path", "op": "eq", "value": "/api/auth/login" },
      { "type": "method", "op": "eq", "value": "POST" }
    ] }
  ],
  "action": {
    "mitigate": {
      "action": "rate_limit",
      "rateLimit": {
        "algo": "fixed_window", "window": 60, "limit": 10,
        "keys": ["ip"], "action": "challenge"
      }
    }
  }
}
```

Configuration:

| Field | Notes |
|-------|-------|
| `algo` | `fixed_window` on all plans; `token_bucket` on Enterprise. |
| `window` | Seconds. Min 10. Max 600 (Pro), 3600 (Enterprise). |
| `limit` | Requests per window. |
| `keys` | What to count by — `ip`, `ja4`, `user_agent`, or custom headers (Enterprise). |
| `action` | What to do when exceeded — `deny`, `log`, or `challenge`. |

Denied requests return HTTP 429 with `X-RateLimit-Limit` and `X-RateLimit-Remaining` headers.

## Bot Management

### Bot Protection (free, all plans)

Heuristics-based bot detection that challenges non-browser traffic without breaking verified webhook providers:

```json
{
  "action": "managedRules.update",
  "id": "bot_protection",
  "value": { "active": true, "action": "challenge" }
}
```

Best practice: enable in `log` mode first to preview the impact on legitimate traffic, then switch to `challenge` once you have confidence the rules are not catching things they shouldn't.

The older `bot_filter` ID is deprecated; new configurations should use `bot_protection`.

### AI Bot Blocking

Block known AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.) — useful when you do not want your content used to train models or summarized inside an AI engine without attribution:

```json
{
  "action": "managedRules.update",
  "id": "ai_bots",
  "value": { "active": true, "action": "deny" }
}
```

The list updates automatically as Vercel discovers new AI-crawler signatures. The trade-off worth thinking about: blocking AI crawlers protects your IP but also removes you from AI-engine answer surfaces ([AEO/GEO](/marketing-and-seo/answer-engine-optimization)). Most public-facing marketing sites should *not* block AI bots; private dashboards, customer portals, and paid content should.

### Vercel BotID

BotID is the traffic-visibility layer for bot management. Enable it to see what proportion of your traffic is bots, what categories they fall into, and which user-agents are showing up:

```json
{ "botIdEnabled": true }
```

Once enabled, the Firewall dashboard surfaces bot traffic alongside human traffic and lets you build custom rules from the bot data — for example, blocking a specific scraping bot you discovered consuming 30% of your bandwidth.

BotID went GA in June 2025 and is included on all plans.

### Allowing a Specific Bot

Bypass rules placed *higher in priority* than the Bot Protection managed ruleset let you explicitly allow good bots:

```json
{
  "name": "Allow My Monitoring Bot",
  "active": true,
  "conditionGroup": [
    { "conditions": [
      { "type": "user_agent", "op": "eq", "value": "MyMonitorBot/1.0" }
    ] }
  ],
  "action": { "mitigate": { "action": "bypass" } }
}
```

Useful for uptime monitors, internal scrapers, and verified third-party services that the heuristics might otherwise challenge.

## IP Allow / Block Lists

Discrete IP rules sit above custom rules in the evaluation order:

```json
{
  "action": "ip.insert",
  "value": {
    "hostname": "my-site.com",
    "ip": "203.0.113.45",
    "action": "deny",
    "notes": "Malicious scraper"
  }
}
```

CIDR ranges work the same way:

```json
{
  "action": "ip.insert",
  "value": {
    "hostname": "my-site.com",
    "ip": "203.0.113.0/24",
    "action": "deny"
  }
}
```

The four IP rule actions: `deny` (block), `challenge` (JS challenge), `log` (audit only), and `bypass` (allowlist that skips all WAF rules). The `bypass` action is the right tool for trusted internal IPs, dedicated office ranges, or specific monitoring hosts.

`hostname` must match exactly — separate entries are needed per subdomain.

## OWASP Core Ruleset

Enterprise plans get access to the OWASP Core Ruleset for the major web-attack classes:

| ID | Protection |
|----|-----------|
| `sqli` | SQL Injection |
| `xss` | Cross-Site Scripting |
| `rce` | Remote Code Execution |
| `lfi` | Local File Inclusion |
| `rfi` | Remote File Inclusion |
| `sd` | Scanner Detection |
| `ma` | Multipart Attacks |
| `gen` | Generic attack patterns |
| `sf` | Session Fixation |
| `php`, `java` | Stack-specific exploit signatures |

A typical full configuration:

```json
{
  "firewallEnabled": true,
  "crs": {
    "sqli": { "active": true, "action": "deny" },
    "xss":  { "active": true, "action": "deny" },
    "rce":  { "active": true, "action": "deny" },
    "lfi":  { "active": true, "action": "deny" },
    "rfi":  { "active": true, "action": "deny" },
    "sd":   { "active": true, "action": "log" },
    "ma":   { "active": true, "action": "deny" },
    "gen":  { "active": true, "action": "deny" },
    "sf":   { "active": true, "action": "deny" },
    "php":  { "active": false, "action": "log" },
    "java": { "active": false, "action": "log" }
  },
  "managedRules": {
    "owasp":           { "active": true, "action": "deny" },
    "bot_protection":  { "active": true, "action": "challenge" },
    "ai_bots":         { "active": true, "action": "deny" }
  },
  "botIdEnabled": true
}
```

## REST API

The same operations are available through the API for teams that want firewall configuration in version-controlled infrastructure-as-code workflows:

| Method | Path | Use |
|--------|------|-----|
| `GET` | `/v1/security/firewall/config/active` | Read current config |
| `PATCH` | `/v1/security/firewall/config` | Incremental update — add, update, remove individual rules |
| `PUT` | `/v1/security/firewall/config` | Full config replacement |
| `POST` | `/v1/security/firewall/bypass` | Create a temporary bypass — useful during load tests or incident response |

Auth is `Authorization: Bearer <VERCEL_TOKEN>`, with `?projectId=<id>&teamId=<id>` query params.

The `@vercel/sdk` package wraps the same endpoints in TypeScript:

```ts
import { Vercel } from "@vercel/sdk";

const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN });

await vercel.security.updateFirewallConfig({
  projectId: "prj_xxx",
  teamId: "team_xxx",
  requestBody: {
    action: "rules.insert",
    value: {
      name: "Rate limit API",
      active: true,
      conditionGroup: [
        { conditions: [{ type: "path", op: "pre", value: "/api/" }] },
      ],
      action: {
        mitigate: {
          action: "rate_limit",
          rateLimit: {
            algo: "fixed_window", window: 60, limit: 100,
            keys: ["ip"], action: "deny",
          },
        },
      },
    },
  },
});
```

## vercel.json declarative rules

For the simplest cases — block, challenge, conditional access — rules can live in `vercel.json` instead of the dashboard or API:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "routes": [
    {
      "src": "/api/(.*)",
      "missing": [
        { "type": "header", "key": "x-internal-token" }
      ],
      "mitigate": { "action": "deny" }
    },
    {
      "src": "/(.*)",
      "has": [
        { "type": "header", "key": "user-agent", "value": "(?i)^curl/" }
      ],
      "mitigate": { "action": "challenge" }
    }
  ]
}
```

Only `challenge` and `deny` actions are supported in `vercel.json`; rate limits, `log`, and `bypass` require the dashboard or API.

## Attack Challenge Mode

Available on every plan — a one-click switch that puts a browser verification challenge in front of every visitor during an active attack. Verified bots (Googlebot, webhook providers) pass through automatically; internal function-to-function calls inside the same Vercel account are exempt; blocked requests do not count toward your usage. Configured at `https://vercel.com/<team>/<project>/firewall` → Bot Management → Attack Challenge Mode.

## Plan limits

| Feature | Hobby | Pro | Enterprise |
|---------|-------|-----|------------|
| DDoS Protection | All | All | All |
| Custom Rules | 5 | 40 | 1000 |
| Rate Limit Rules | 1 | 40 | 1000 |
| Bot Protection | Yes | Yes | Yes |
| BotID Visibility | Yes | Yes | Yes |
| OWASP CRS | — | — | Yes |
| Token-bucket rate limit algo | — | — | Yes |
| Custom rate-limit keys | — | — | Yes |

## Observability

The Firewall tab in the Vercel dashboard exposes:

- Security event logs in real time, filterable by rule, action, IP, country
- IP enrichment — hover any IP to see ASN, geo, and metadata without leaving the dashboard
- "Create Custom Rule" actions on traffic charts — pick a spike, generate a matching rule
- Linkable into the broader Monitoring queries for correlated incident investigation
- DDoS mitigation alerts when the platform actively defends against an attack
- BotID traffic visibility once enabled

The combination of "global rule propagation in 300ms" plus "create rule from a traffic chart" makes the dashboard the right tool during incidents — most config moves are not worth doing through the API in a hurry.

## When to reach for it

- Production traffic with credential-stuffing, scraping, or WordPress-scanner abuse.
- API endpoints that need rate limiting without building it into your application code.
- Compliance requirements that mandate WAF, OWASP coverage, or sanctioned-country blocking.
- Bot management — distinguishing humans from automation, with logging and challenges.
- Geographic access control — restricting your app to specific regions or blocking known abuse origins.

## When you might not need it

- A static marketing site with no API, no auth, and no abuse history. The default DDoS protection is enough; configurable layers add operational complexity for marginal gain.
- A purely internal app behind your own auth gateway or VPN. The firewall protects what is reachable from the public internet — if nothing is, the layer is redundant.

## Further reading

- [Vercel Firewall Overview](https://vercel.com/docs/vercel-firewall)
- [Custom Rules](https://vercel.com/docs/vercel-firewall/vercel-waf/custom-rules)
- [Rate Limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting)
- [IP Blocking](https://vercel.com/docs/vercel-firewall/vercel-waf/ip-blocking)
- [Managed Rulesets](https://vercel.com/docs/vercel-firewall/vercel-waf/managed-rulesets)
- [Attack Challenge Mode](https://vercel.com/docs/vercel-firewall/attack-challenge-mode)
- [Firewall API Reference](https://vercel.com/docs/vercel-firewall/firewall-api)

For other Vercel infrastructure references on this site, see [Vercel](/cloud-and-hosting/vercel), [Vercel Functions](/cloud-and-hosting/vercel) (Fluid Compute), [Vercel Workflow DevKit](/cloud-and-hosting/vercel-workflow), [Vercel Sandbox](/cloud-and-hosting/vercel-sandbox), [Vercel Queues](/cloud-and-hosting/vercel-queues), [Vercel AI Gateway](/cloud-and-hosting/vercel-ai-gateway), and [Vercel Blob](/cloud-and-hosting/vercel-blob).
