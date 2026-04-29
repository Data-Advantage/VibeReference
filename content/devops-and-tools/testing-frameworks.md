# Testing Frameworks: Vitest, Jest, Playwright, Cypress, Bun Test, Mocha, Storybook Test

[⬅️ DevOps & Tools Overview](../devops-and-tools/)

If you're building a SaaS in 2026 and trying to pick which testing tools to invest in, this is the consolidated comparison. Most indie SaaS over-invest in unit tests for code that doesn't matter and under-invest in integration / E2E tests for the flows that actually break. Pick the right shape and the test suite becomes a productivity asset; pick wrong and it becomes a maintenance burden the team avoids.

## TL;DR Decision Matrix

| Tool | Type | Strongest at | Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Vitest | Unit / integration | Vite-native, fast, modern | Free / OSS | Very high | Modern Vite/Next.js TypeScript projects |
| Jest | Unit / integration | Mature, broad ecosystem | Free / OSS | High | React projects with established Jest patterns |
| Bun Test | Unit / integration | Bundled with Bun, very fast | Free / OSS | Very high | Bun-runtime projects |
| Node Test | Unit / integration | Bundled with Node, zero deps | Free | High | Minimal-deps projects on Node 20+ |
| Playwright | End-to-end / browser | Multi-browser, great DX | Free / OSS | Very high | E2E testing for web apps |
| Cypress | End-to-end / browser | Mature, dev-friendly UI | Free / OSS, $75+/user/mo Cloud | High | Teams that liked the original Cypress UX |
| Puppeteer | Browser automation | Chrome-focused; lower-level | Free / OSS | Medium | Specific Chrome-only automation tasks |
| WebdriverIO | E2E (cross-browser, mobile) | Selenium-based; mature | Free / OSS | Medium | Multi-platform / mobile E2E |
| Storybook Test | Component testing | Storybook-integrated | Free / OSS | High | Teams using Storybook for component dev |
| Vitest Browser Mode | Component / unit-in-browser | Vitest with browser execution | Free / OSS | High | Modern component testing |
| Testing Library (React/Vue) | Component-test API | Library, not framework; pairs with Vitest/Jest | Free / OSS | Very high | Best-practice component testing |
| Mocha | Unit (legacy) | Older / different ecosystem | Free / OSS | Low | Legacy projects; rarely picked new in 2026 |
| Jasmine | Unit (legacy) | Angular ecosystem heritage | Free / OSS | Low | Angular projects; legacy elsewhere |
| Detox | React Native E2E | Mobile-app E2E | Free / OSS | Medium | React Native apps |

The first decision is **what shape of tests you actually need**. Unit tests, integration tests, end-to-end tests, and component tests are different problems with different tools. Most indie SaaS need 2-3 tools, not 7.

## Decide What Tests You Need First

The classic test pyramid still applies in 2026: lots of fast unit tests, some integration tests, fewer E2E tests. But for indie SaaS, the bias should shift slightly: fewer unit tests of trivial code, more integration tests of the business logic, real E2E tests of the critical user flows.

### Unit tests (60% of test count, 20% of test time)
Test pure functions, isolated logic, edge cases.

Right tools:
- **Vitest** for Vite / Next.js / modern projects (default in 2026)
- **Jest** for established React projects
- **Bun Test** if you're on Bun runtime
- **Node Test** for minimal-dep projects on Node 20+

### Integration tests (30% of test count, 50% of test time)
Test how multiple pieces work together — API endpoints with real database, components with real services, business logic flows.

Right tools:
- Same framework as unit (Vitest / Jest / Bun) with database fixtures
- **Testcontainers** for real Postgres / Redis in tests
- Playwright API testing for HTTP-level integration

### End-to-end tests (10% of test count, 30% of test time)
Test full user flows in a real browser. Most expensive; most reliable signal.

Right tools:
- **Playwright** — default for indie SaaS in 2026
- **Cypress** — alternative if you prefer the UX
- **WebdriverIO** — for cross-browser-mobile

### Component tests (variable; depends on UI complexity)
Test individual UI components in isolation.

Right tools:
- **Vitest + Testing Library** — most common
- **Vitest Browser Mode** — newer, runs tests in real browser
- **Storybook Test** — if Storybook is already in your stack

For most indie SaaS in 2026: **Vitest for unit + integration; Playwright for E2E**. Skip Cypress unless you have specific reason; skip Jest unless you have legacy.

## Provider Deep-Dives

### Vitest — Modern Default
Vitest has become the default for new TypeScript projects in 2026. Built on Vite; very fast; Jest-compatible API for easy migration.

Strengths:
- Extremely fast (parallel by default; no separate compilation)
- Vite-native (zero config in Vite/Next.js projects)
- Jest-compatible test API (`describe` / `it` / `expect`)
- Strong watch mode
- Browser mode for component testing
- TypeScript-first
- Active development; growing community

Weaknesses:
- Vite-specific patterns (less helpful for non-Vite projects)
- Some Jest plugins don't work directly
- Browser mode is newer; less mature

Default for: most indie SaaS in 2026 building with Next.js / SvelteKit / Astro / Vite.

### Jest — Mature React Default
Jest is the longstanding default for React projects. Mature, broad plugin ecosystem.

Strengths:
- Most mature; broadest community
- Vast plugin ecosystem
- Strong React Testing Library integration
- Stable patterns; lots of examples

Weaknesses:
- Slower than Vitest (compilation overhead)
- ESM support has been historically rough (improved in 2026)
- Dropping in popularity for new projects

Pick Jest when: existing project already on Jest; broad team familiarity; not migrating soon.

### Bun Test — Bun-Bundled
Bun's bundled test runner. Very fast; zero-deps (Bun handles everything).

Strengths:
- Bundled with Bun; no separate install
- Extremely fast (Bun's runtime is fast)
- Jest-compatible API
- Zero-config

Weaknesses:
- Bun-only (won't work on Node)
- Smaller community than Vitest / Jest
- Newer ecosystem; some patterns still emerging

Pick Bun Test when: you're on Bun runtime; want bundled simplicity.

### Node Test
Node 20+ ships with a built-in test runner.

Strengths:
- Zero deps (built into Node)
- Reasonable feature set
- Best when minimal dependencies are a goal

Weaknesses:
- Less mature than Vitest / Jest
- Smaller plugin ecosystem
- Less DX-polished

Pick Node Test when: minimal-dependency project; willingness to live with smaller community.

### Playwright — E2E Default in 2026
Playwright (Microsoft-backed) has become the E2E default for most teams in 2026. Multi-browser support; modern API; great DX.

Strengths:
- Multi-browser by default (Chrome, Firefox, Safari/WebKit)
- Excellent DX (codegen, trace viewer, video recording)
- Fast; parallel by default
- Strong mobile-emulation
- API testing supported
- Active development; growing community

Weaknesses:
- Newer than Cypress / Selenium (less mature in some patterns)
- Authentication / session management requires careful patterns

Default for: most indie SaaS doing E2E in 2026.

### Cypress — Mature Alternative
Cypress predates Playwright; mature; distinct API.

Strengths:
- Mature; battle-tested
- Friendly UI for developers
- Strong record-and-playback
- Broad community

Weaknesses:
- Single-browser focus historically (multi-browser improved but still weaker than Playwright)
- Slower than Playwright
- Cypress Cloud pricing scales fast

Pick Cypress when: existing project on Cypress; team familiarity; not migrating soon.

### Puppeteer
Lower-level Chrome automation. Useful for specific tasks; less suited as a general E2E framework.

Pick Puppeteer when: scraping, PDF generation, very specific Chrome automation; not general E2E.

### WebdriverIO
Selenium-based; multi-platform including mobile.

Pick WebdriverIO when: cross-platform mobile E2E (iOS + Android natively); legacy Selenium investment.

### Storybook Test
Visual / interaction testing for Storybook components.

Pick Storybook Test when: Storybook is already in your stack; component-level testing matters.

### Testing Library (React, Vue, Svelte)
Not a test runner; a library for testing components in a user-centric way. Pairs with Vitest / Jest.

Pick Testing Library when: testing components; want best-practice "test like a user" patterns. Almost always the right pairing.

### Mocha / Jasmine
Older; rarely picked new in 2026.

Skip for new projects; useful only in legacy contexts.

### Detox — React Native E2E
For React Native apps; runs on real devices / simulators.

Pick Detox when: building a React Native app; need mobile E2E.

## What None of Them Solve

- **What to test.** Frameworks run tests; you decide what to test. Coverage doesn't equal quality.
- **Test reliability.** Flaky tests are the #1 productivity killer. Discipline of fixing flakes; sometimes deleting them.
- **Test maintenance.** Tests rot as code evolves. Treat tests as code; refactor; delete obsolete.
- **CI integration.** Per [CI/CD Providers](cicd-providers.md): tests run there, not just locally.
- **Database / external service mocking.** Tools provide primitives; the strategy (real Postgres via Testcontainers vs. mocks vs. in-memory) is yours.
- **Performance / load testing.** Different problem; different tools (k6, Artillery, Gatling).
- **Security / penetration testing.** Different category; OWASP ZAP / Burp / etc.
- **Visual regression testing.** Chromatic / Percy / Playwright snapshots; pick one.

## Pragmatic Stack Patterns

**Indie SaaS, modern Next.js / SvelteKit / Astro**:
- Vitest (unit + integration)
- Playwright (E2E for top 5-10 critical user flows)
- Testing Library + Vitest for components
- Total: $0/mo (all OSS)

**Established React project on Jest**:
- Jest (unit + integration; don't migrate without reason)
- Testing Library
- Playwright OR Cypress for E2E
- Migration to Vitest is optional; not urgent

**Bun-runtime project**:
- Bun Test (unit + integration; bundled)
- Playwright for E2E

**React Native app**:
- Vitest or Jest for unit
- Detox for mobile E2E

**TypeScript monorepo (Turborepo / Nx)**:
- Vitest per package
- Playwright at the application level
- Storybook + Storybook Test for component packages

**Visual regression critical**:
- Playwright with built-in snapshot testing
- Or Chromatic + Storybook for design-system testing
- Or Percy for cross-browser visual

## Decision Framework: Three Questions

1. **What test type are you adding?** → Unit/integration: Vitest (default). E2E: Playwright (default). Component: Vitest + Testing Library.
2. **What runtime / framework?** → Vite/Next.js: Vitest. Bun: Bun Test. React Native: Detox for E2E.
3. **Existing investment?** → Jest? Stay unless migrating actively. Cypress? Same.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **Vitest + Playwright + Testing Library**. Don't over-engineer.

## Verdict

For most readers building a SaaS in 2026:
- **Unit + Integration**: Vitest (default).
- **End-to-end**: Playwright (default).
- **Component**: Vitest + Testing Library.
- **Existing Jest**: keep until migration is justified.
- **Bun**: Bun Test.
- **React Native E2E**: Detox.
- **Component dev workflow**: Storybook + Storybook Test.

The hidden cost in testing isn't the framework; it's **flaky tests + slow feedback loops**. A 4-minute test suite with 95% reliability beats a 90-second suite that fails 30% of the time. Optimize for reliability, then for speed.

## See Also

- [CI/CD Providers](cicd-providers.md) — companion for running the tests
- [Web Frameworks](../frontend/web-frameworks.md) — informs unit-test choice
- [TypeScript](../frontend/typescript.md) — types reduce test surface for a class of bugs
- [Testing & QA](testing-qa.md) — broader QA strategy
- [GitHub](github.md) — PR-based test running
- [Web Frameworks](../frontend/web-frameworks.md) — Next.js, Astro, etc. ship with default test patterns
- [Database Providers](../backend-and-data/database-providers.md) — branching feature pairs with integration tests for per-PR ephemeral DBs
- [Storybook](https://storybook.js.org) — component dev paired with component testing

---

[⬅️ DevOps & Tools Overview](../devops-and-tools/)
