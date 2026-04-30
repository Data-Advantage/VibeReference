# Accessibility Testing & Audit Tools: axe DevTools, WAVE, Pa11y, Lighthouse, AccessiBe, UserWay, Stark, Storybook a11y

[⬅️ DevOps & Tools Overview](../devops-and-tools/)

If you're building a B2B SaaS in 2026, accessibility (a11y) compliance is no longer optional. ADA / WCAG 2.2 / Section 508 / European Accessibility Act (EAA effective 2026) all require WCAG-conformant UIs. The naive approach: install Lighthouse + run once + ship. The structured approach: layer automated testing (axe / Pa11y in CI) + manual review (axe DevTools, Stark) + screen-reader testing (VoiceOver / NVDA / JAWS) + audit by accessibility consultant. Automated tools catch ~30-50% of issues; the rest require human review. The right pick depends on whether you need developer tools (axe / Pa11y / Storybook a11y), design-time review (Stark for Figma), CI integration (Pa11y / axe-core), or compliance audit (consulting firms).

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| axe DevTools (Deque) | Browser ext + npm | Free + Pro | $40/user/mo Pro | Very high | Default dev tool |
| Pa11y | OSS CLI / CI | Free | OSS | Very high | OSS CI integration |
| Lighthouse (Google) | Browser DevTools | Free | $0 | Very high | Quick audit; PageSpeed |
| WAVE (WebAIM) | Browser ext | Free | $0 | High | Visual issue overlay |
| Storybook a11y | Storybook addon | Free | OSS | Very high | Component-level dev |
| Stark | Figma + Sketch + dev | Trial | $36-60/user/mo | High | Design-time |
| AccessiBe | Overlay product | Trial | $49-499/mo | Low | "Quick fix" overlay (controversial) |
| UserWay | Overlay product | Trial | $49-490/mo | Low | Overlay alternative (controversial) |
| Equally AI | AI-powered audit | Trial | Custom | Medium | AI-driven scanning |
| Tenon.io | API + audit | Free tier | $$ | Medium | API-driven testing |
| Siteimprove | Enterprise audit | Custom | $$$$ | Low | Enterprise compliance |
| Level Access | Enterprise audit | Custom | $$$$ | Low | Enterprise + consulting |
| Deque (consulting) | Audit + consulting | Custom | $$$$ | Low | Compliance consulting |
| Accessibility Insights (Microsoft) | Browser tool | Free | $0 | High | Microsoft-aligned dev |
| jest-axe | Jest plugin | Free | OSS | Very high | Unit-test integration |
| Cypress-axe | Cypress plugin | Free | OSS | Very high | E2E test integration |
| Playwright + axe | Playwright + axe-core | Free | OSS | Very high | Modern E2E |
| Vercel Toolbar (a11y) | Vercel native | Bundled | Bundled | High | Vercel-deployed apps |

The first decision is **stage**: design-time (Stark) vs dev-time (axe DevTools / Storybook a11y) vs CI (Pa11y / axe in tests) vs production (overlays — controversial; consultants — recommended). The second decision is **OSS vs commercial**: many are OSS-led (axe, Pa11y, Lighthouse) with paid enterprise tiers.

## Decide What You Need First

### Developer dev-time testing (the 50% case)
You're building features and want fast feedback during development.

Right tools:
- **axe DevTools** — Chrome / Firefox extension; default
- **Lighthouse** — Chrome built-in; quick audit
- **WAVE** — visual overlay
- **Storybook a11y addon** — component-level

### Automated CI / unit testing (the 25% case)
You want failing builds when accessibility regresses.

Right tools:
- **axe-core** + **jest-axe** for unit tests
- **Cypress-axe** OR **Playwright + axe** for E2E
- **Pa11y CI** for full-page scans

### Design-time review (the 10% case)
Catch issues before code: in Figma / Sketch.

Right tools:
- **Stark** (Figma plugin + Sketch + Adobe XD)
- **Able** (Figma plugin)
- **Color contrast checkers** (web tools)

### Compliance audit + remediation (the 10% case)
Ahead of legal compliance deadline (EAA 2026); pre-acquisition; pre-IPO.

Right tools:
- **Deque** consulting
- **Level Access** consulting
- **Siteimprove** enterprise audit
- **Independent audit firms** (LERA, Bureau of Internet Accessibility)

### Live production overlay (the 5% case — controversial)
Add JS that "fixes" accessibility issues at runtime.

Right tools (use with caution):
- **AccessiBe**
- **UserWay**
- **Equally AI**

Important caveat: overlays are controversial. Many disability advocates oppose them as superficial fixes. Multiple lawsuits have proceeded against companies using overlays. Use only as supplement to real fixes, not replacement.

## Provider Deep-Dives

### axe DevTools (Deque) — developer default
Founded by Deque (long-standing a11y consulting firm).

Pricing in 2026: Free; Pro $40/user/mo.

Features (Free):
- Browser extension (Chrome, Firefox, Edge)
- Scans current page for WCAG violations
- Categorized issues (critical / serious / moderate / minor)
- Code snippets identifying violation
- ~57 rules

Features (Pro):
- Intelligent guided tests (manual checks for things automated can't catch)
- Assistive technology integrations
- Reports / export
- Integration with CI/CD

Why axe wins: most-used dev tool; OSS core (axe-core); broad ecosystem (jest-axe, cypress-axe, etc.); maintained by experts.

Pick if: developer-led a11y testing default. Don't pick if: only need quick check (Lighthouse simpler).

### Lighthouse (Google) — quick audit
Built into Chrome DevTools.

Pricing: free.

Features: PageSpeed + Accessibility + Best Practices + SEO scores; runs locally; CI integration possible.

Why Lighthouse: free; built-in; combines a11y with performance metrics.

Trade-offs: a11y rules less comprehensive than axe; results sometimes flaky.

Pick if: quick check; PageSpeed adjacent; budget-zero. Don't pick if: depth needed (axe stronger).

### Pa11y — OSS CLI / CI
OSS command-line accessibility tester.

Pricing: free.

Features: CLI scanning; CI integration; multiple sites at once (Pa11y Dashboard); axe-core or HTMLcs as engine.

Why Pa11y: OSS; CI-friendly; scriptable; baseline tracking.

Pick if: OSS-led CI integration; cost-conscious. Don't pick if: GUI dev experience needed.

### WAVE (WebAIM) — visual overlay
WebAIM's visual a11y tester.

Pricing: free browser extension; paid API.

Features: visual overlay shows issues directly on page; screen-reader-friendly UI; categorized issues.

Why WAVE: visual feedback excellent; non-developers can use; trusted by accessibility community.

Pick if: design + dev collaborative review. Don't pick if: code-snippet output preferred (axe stronger).

### Storybook a11y addon
Storybook integration.

Pricing: free; OSS.

Features: per-component a11y check inside Storybook; axe-core powered; in component-driven dev.

Why: catch issues at component level; design-system-friendly.

Pick if: component-driven dev with Storybook. Don't pick if: not using Storybook.

### Stark — design-time
Figma / Sketch / Adobe XD plugin + browser ext + dev tools.

Pricing in 2026: Trial; Pro $36/user/mo; Team $60/user/mo.

Features: contrast checker; color simulator (color blindness); typography checker; touch target size; vision impairment simulator; collaborative design comments.

Why Stark: best-in-class design-time tool; designers love it; catches issues before code.

Pick if: design team wants accessibility integrated into design tools. Don't pick if: dev-only team.

### AccessiBe / UserWay / Equally AI — overlays (controversial)
Runtime JS that "fixes" accessibility.

Pricing: AccessiBe $49-499/mo; UserWay $49-490/mo.

Features: JS widget that adds keyboard nav, screen reader hints, contrast adjustments at runtime.

Controversy:
- Disability advocates argue overlays are superficial; don't fix root issues
- Multiple lawsuits have proceeded against companies using overlays
- Screen-reader users report overlays often interfere with their own AT
- "Quick fix" promises are misleading

Honest framing:
- Overlays may help with some issues
- They don't substitute for proper fixes
- Don't rely on overlay as legal defense

Pick if: supplementary; not as primary fix. Don't pick if: thinking it's a compliance shortcut.

### Siteimprove / Level Access / Deque — enterprise audit
Enterprise accessibility consulting + tooling.

Pricing: custom; $$$$.

Features: deep audits, remediation guides, compliance reporting, training, ongoing monitoring.

Pick if: enterprise compliance; pre-IPO; legal exposure mitigation. Don't pick if: SMB / startup.

### jest-axe / cypress-axe / Playwright + axe — automated tests
Test framework integrations.

Pricing: free; OSS.

Features: assert no a11y violations in unit / E2E tests.

Pick if: developers want failing build on a11y regression. Don't pick if: no test suite to integrate.

### Vercel Toolbar (a11y)
Vercel native.

Pricing: bundled with Vercel.

Features: in-browser a11y checks during deployment preview.

Pick if: Vercel-deployed app; developer workflow. Don't pick if: not on Vercel.

## What Accessibility Tools Won't Do

Buying tools doesn't:

1. **Catch all issues automatically.** Best automated tools catch 30-50% of WCAG violations. Manual review + screen reader testing required.
2. **Replace user testing with disabled users.** Real users surface real issues automated can't see (cognitive load, intuitive flow).
3. **Make overlay safe legally.** Lawsuits proceed regardless of overlays. Real fixes required.
4. **Achieve compliance overnight.** Accessibility is process; remediate over time + new code stays accessible.
5. **Replace organizational culture.** Tools matter; culture (designers + devs caring) matters more.

The honest framing: accessibility is process + culture. Tools support both; replace neither.

## Layered Testing Strategy

```text
Build a layered accessibility testing strategy.

Layer 1: Design-time (catch ~20%)
- Stark in Figma / Sketch
- Color contrast checkers
- Component-library accessibility (Radix UI, react-aria)

Layer 2: Component-level (catch ~30%)
- Storybook a11y addon
- jest-axe in unit tests
- Per-component documentation of a11y patterns

Layer 3: Page-level (catch ~50%)
- axe DevTools in dev
- Cypress-axe / Playwright in E2E
- Pa11y in CI on every PR

Layer 4: Manual review (catch ~70%)
- Keyboard-only navigation test
- Screen reader (VoiceOver / NVDA / JAWS) test
- Color blindness simulation
- Reduced-motion test

Layer 5: User testing (catch ~85%)
- Real users with disabilities
- Recruit via accessibility user research firms
- Annual or per-major-release

Layer 6: Audit + consulting (catch ~95%)
- External audit (Deque / Level Access)
- Pre-launch / pre-IPO
- Compliance documentation

No layer alone is enough. Combine.

Output:
1. Strategy mapped to layers
2. Tooling per layer
3. Cadence per layer (per-PR vs annual)
4. Owner per layer
5. Budget allocation
```

The skip-the-manual-review failure: 95%+ of teams that automate testing skip manual review. Automated catches half; the rest requires keyboard + screen-reader walkthrough.

## Pragmatic Stack Patterns

### Pattern 1: Solo founder / indie ($0/mo)
- **axe DevTools Free** + **Lighthouse**
- Manual keyboard + screen-reader test pre-launch
- Total: $0

### Pattern 2: SMB B2B SaaS ($40-100/mo)
- **axe DevTools Pro** for dev
- **Stark** for design ($36/user/mo)
- **jest-axe / cypress-axe** in CI
- **Storybook a11y** for component dev
- Annual external audit ($3-10K)

### Pattern 3: Mid-market ($300-1K/mo)
- Same as SMB + larger team
- **Pa11y CI** dashboard
- Quarterly external audits
- Dedicated a11y engineer / champion

### Pattern 4: Enterprise ($$$+)
- **Siteimprove** OR **Level Access** OR **Deque**
- Annual compliance audit
- Internal a11y team
- User testing with disabled users

### Pattern 5: Pre-EAA-2026 compliance push ($5-50K one-time)
- Independent audit
- Remediation sprint (1-3 months)
- VPAT (Voluntary Product Accessibility Template) prepared
- Ongoing monitoring set up

## Decision Framework: Three Questions

1. **What's your stage?**
   - Solo / indie → axe DevTools + Lighthouse free
   - SMB → axe Pro + Stark + jest-axe in CI
   - Mid-market → all of above + Pa11y dashboard
   - Enterprise → Siteimprove / Level Access / Deque consulting

2. **What's your tech stack?**
   - React + Storybook → Storybook a11y addon
   - Test suite (Cypress / Playwright / Jest) → axe integrations
   - Vercel-deployed → Vercel Toolbar
   - Figma-led design → Stark

3. **What's your compliance need?**
   - WCAG conformance → tools-only sufficient if disciplined
   - ADA / Section 508 → tools + audit
   - EAA 2026 (EU) → tools + audit + ongoing monitoring
   - Government contracts → VPAT + audit

## Honest Rant on Accessibility Overlays

```text
The accessibility overlay debate.

Arguments for overlays:
- Quick to deploy
- Some incremental improvement
- Helps with specific issues (high contrast, font sizing)

Arguments against:
- Don't fix root issues; cosmetic
- Can interfere with users' assistive technology
- Companies sometimes claim "we have an overlay = compliant" — lawsuit fodder
- "AccessiBe Sucks" / "Overlay Fact Sheet" are written by disability advocates

Honest position:
- Overlays are not a substitute for real accessibility work
- They may help with some specific issues
- They do not provide legal compliance protection (lawsuits proceed)
- Disability community largely opposes them
- Real fixes (semantic HTML, ARIA, keyboard nav) are non-negotiable

Recommendation:
- Don't buy an overlay as primary strategy
- Maybe layer one as supplementary if specific use case justifies
- Disclose overlay use; don't hide it
- Continue real remediation regardless

Resources:
- "Overlay Fact Sheet" (overlayfactsheet.com)
- AccessiBe lawsuits documented in disability press
- WAI-ARIA / WCAG primary sources

Output:
1. Position on overlays for [COMPANY]
2. Real-fix prioritization
3. Disclosure strategy if used
4. Legal review
5. Disability community signal
```

The legal reality: overlay-as-defense fails in court. Companies sued for inaccessibility don't get protection from "we have UserWay / AccessiBe." Real remediation required.

## Verdict

For 50% of B2B SaaS in 2026: **axe DevTools** + **Stark** + **jest-axe / cypress-axe** + manual review. Layered, OSS-led.

For 25%: **Pa11y CI dashboard** for OSS / cost-priority.

For 15%: **Siteimprove / Level Access** for enterprise.

For 5%: **Equally AI / overlay** as supplement (not primary).

For 5%: **Deque consulting** for major compliance push.

The mistake to avoid: **automated-tools-only**. Catches half. Manual review (keyboard + screen reader) finds the rest.

The second mistake: **overlay as compliance shortcut**. Doesn't work legally; doesn't actually fix accessibility.

The third mistake: **annual one-shot audit, no ongoing process**. Accessibility regresses; need CI tests + culture, not just point-in-time audits.

## See Also

- [Accessibility](../product-and-design/accessibility.md) — accessibility concepts overview
- [Code Quality Platforms](./code-quality-platforms.md) — adjacent quality tools
- [Application Security Tools](./application-security-tools.md) — adjacent security testing
- [Testing Frameworks](./testing-frameworks.md) — test stack
- [Web Vitals](./web-vitals.md) — adjacent quality metrics
- [BI & Analytics Tools](./bi-analytics-tools.md) — adjacent analytics
- [Lucide](../frontend/lucide.md) — icon library with accessibility
- [Radix](../frontend/radix.md) — accessible primitives
- [shadcn](../frontend/shadcn.md) — accessible component library
- [VibeWeek: Empty States, Loading & Error States](https://vibeweek.dev/6-grow/empty-states-loading-error-states-chat) — accessible state UI
- [VibeWeek: Comments, Threading & @Mentions](https://vibeweek.dev/6-grow/comments-threading-mentions-chat) — accessibility for comments
- [VibeWeek: Date Pickers & Range Selection](https://vibeweek.dev/6-grow/date-pickers-range-selection-chat) — accessible date pickers
- [VibeWeek: Charts & Data Visualization](https://vibeweek.dev/6-grow/charts-data-visualization-chat) — accessible charts
- [LaunchWeek: Brand Identity](https://launchweek.dev/1-position/brand-identity) — brand decisions inform accessible color palettes
- [LaunchWeek: Trust Center & Security Page](https://launchweek.dev/4-convert/trust-center-security-page) — VPAT + accessibility statement
