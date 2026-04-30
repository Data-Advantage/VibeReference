# App Distribution & Beta Testing Platforms: TestFlight, Firebase App Distribution, Expo EAS, Codemagic, Bitrise, Diawi, AppCenter Sunset

[⬅️ DevOps & Tools Overview](../devops-and-tools/)

If you ship a mobile app in 2026 and need to get builds to QA, beta testers, internal teammates, or stakeholder review before App Store / Play Store release, this is the consolidated comparison of distribution + beta-testing platforms. The category split that matters: **store-native testing** (TestFlight for iOS, Google Play Internal Testing for Android — free, integrated, mandatory for store submission), **cross-platform distribution** (Firebase App Distribution, Diawi, Expo EAS — for ad-hoc builds outside the store flow), and **end-to-end CI + distribution** (Codemagic, Bitrise — build pipelines that include distribution as one step).

Microsoft retired App Center (May 2025). The category re-shaped around Firebase App Distribution + the alternatives. This guide reflects the post-App-Center landscape.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | iOS / Android / Both | Indie Vibe | Best For |
|---|---|---|---|---|---|---|
| **Store-Native (Free, Mandatory for Store Submission)** | | | | | | |
| TestFlight | Apple's iOS testing | Free | Free (with Apple Dev $99/yr) | iOS | Very high | Mandatory for iOS pre-launch |
| Google Play Internal Testing | Google's Android testing | Free | Free (with Play Dev $25 one-time) | Android | Very high | Mandatory for Android pre-launch |
| Google Play Closed Testing | Larger Android beta | Free | Free | Android | Very high | Wider Android beta (1000+ testers) |
| Google Play Open Testing | Public Android beta | Free | Free | Android | Very high | Public preview track |
| **Cross-Platform Distribution Tools** | | | | | | |
| Firebase App Distribution | Cross-platform ad-hoc | Free (generous) | Free | Both | Very high | Default ad-hoc distribution |
| Expo EAS (Build + Submit + Update) | Expo / RN distribution | Free tier | $19/mo+ | Both (RN) | Very high | React Native + Expo apps |
| Diawi | Quick ad-hoc upload | Free + paid | $9.90/mo | Both | High | Solo devs; one-off shares |
| InstallOnAir | Ad-hoc IPA / APK hosting | Free + paid | Free | Both | High | Quick share alternative |
| HockeyApp / Visual Studio App Center | RIP (Microsoft sunset May 2025) | n/a | n/a | Both | n/a | Migrate off |
| **End-to-End CI + Distribution** | | | | | | |
| Codemagic | Mobile CI/CD with distribution | Free (500 build min/mo) | $0.04-0.07/min | Both | Very high | Mobile-first CI/CD with distribution |
| Bitrise | Mobile CI/CD | Free trial; 200 builds | $36+/mo | Both | High | Mobile-first CI/CD |
| GitHub Actions + Fastlane | DIY pipeline | Free public; paid private | Free for many use cases | Both | High | Teams already on GitHub |
| GitLab CI + Fastlane | DIY pipeline | Free + paid | Bundled with GitLab | Both | High | GitLab-aligned |
| CircleCI + Fastlane | DIY pipeline | Free tier | $15+/mo | Both | Medium | CI-aligned |
| Jenkins + Fastlane | Self-host DIY | Free OSS | Free | Both | Medium | Self-hosted shops |
| Xcode Cloud | Apple-native CI/CD | Free (25 hrs/mo) | $14.99+/mo | iOS only | Medium | Pure iOS / Xcode-aligned |
| **Specialized** | | | | | | |
| Fastlane (CLI) | OSS automation | Free + OSS | Free (MIT) | Both | Very high | Automation glue everywhere |
| TestApp.io | EU-friendly distribution | Free + paid | $19/mo | Both | High | EU-based; GDPR-conscious |
| Buddybuild | RIP (Apple acquired 2018; sunset) | n/a | n/a | Both | n/a | Migrate off |

The first decision is **which distribution channel for which audience**:
- **App store reviewers / external beta testers**: TestFlight (iOS) + Google Play Internal/Closed Testing (Android). Mandatory; free; the only path for App Store submission.
- **Internal team / QA / dogfooding**: Firebase App Distribution (most use cases) or Diawi (quick share)
- **CI builds going somewhere**: Codemagic or Bitrise (mobile-first) or GitHub Actions (general-purpose)

Most teams use **all three** in parallel — store-native for store pre-launch testing, Firebase App Distribution for daily-build internal QA, GitHub Actions / Codemagic / Bitrise for the CI orchestration that delivers builds to all of them.

## Decide What You Need First

### Pre-launch / Store Submission

You're submitting to App Store / Play Store. **Mandatory: TestFlight + Google Play Internal Testing.** App stores require beta testing in their respective tools as a precondition for some approvals (especially for major releases or specific features).

- **TestFlight**: up to 10K external testers; up to 100 internal team members; 90-day build expiration; integrated with App Store Connect
- **Google Play Internal Testing**: up to 100 testers; instant updates (no review); part of Play Console
- **Google Play Closed Testing**: up to thousands of testers via list; some review
- **Google Play Open Testing**: public; appears in store with "early access" tag

### Internal Daily Builds for QA / Team

You need to ship a build from CI to internal testers without the friction of TestFlight uploads or Play store review.

**Default: Firebase App Distribution.** Free, multi-platform (iOS + Android), simple integration with CI, supports Slack / email invites to testers, tracks installs + crash reports (Firebase Crashlytics integration).

Alternative: **Diawi** for one-off shares (drag-drop a build; get a link).

### Cross-Platform CI/CD Pipeline

You want one pipeline that: builds → tests → distributes to TestFlight + Firebase + Play. Don't hand-roll all the tooling.

- **Codemagic** for React Native / Flutter / native iOS+Android — mobile-first, opinionated workflows
- **Bitrise** for similar; older; some say more mature
- **GitHub Actions + Fastlane** for teams already on GitHub; flexibility; some setup work
- **Xcode Cloud** for pure iOS / Apple-aligned shops; cheap; only iOS

### Expo / React Native Specific

If you're on Expo, **EAS Build + EAS Submit + EAS Update** is the path. Bundle build, submit to stores, OTA-update existing app — all in one product. Discussed in [Mobile App Frameworks](../frontend/mobile-app-frameworks.md).

## Provider Deep-Dives

### TestFlight (Apple)

The mandatory iOS beta testing platform. Free with $99/yr Apple Developer account.

Strengths:

- **Free + integrated with App Store Connect** — no extra vendor
- 10K external testers; 100 internal team
- Builds available for 90 days (expire after)
- Public beta links (testers join via URL without your manual invitation)
- Crash reporting + tester feedback in App Store Connect
- Required for App Store submission of certain release types
- Automated upload from Xcode / EAS / Codemagic / Bitrise / GitHub Actions

Weaknesses:

- iOS only
- 24-48 hour Apple review for first build of a version (subsequent updates faster)
- 90-day build expiration is annoying for long-running beta programs
- TestFlight UI for testers is dated
- No Android equivalent in this tool (use Play Console Internal Testing)

Use TestFlight when:

- You're shipping iOS — there's no alternative for store submission
- External beta testers (not just internal team)

### Google Play Internal Testing / Closed Testing / Open Testing

Google's three Android testing tracks. Free with $25 one-time Play Developer fee.

Strengths:

- **Free + integrated with Play Console**
- Three tracks for different audience sizes:
  - Internal: <100 testers; no review; instant
  - Closed: thousands via list; light review
  - Open: public; "early access" badge in store
- Auto-update for testers (vs TestFlight which requires manual update sometimes)
- Required for Android store submission

Weaknesses:

- Android only
- Closed/Open Testing has review delays
- Internal Testing capped at 100

Use Play Console Testing when:

- You're shipping Android — mandatory path
- Different tracks for different beta audiences

### Firebase App Distribution

Google's cross-platform internal beta distribution. Free, robust, well-integrated with the rest of Firebase.

Strengths:

- **Free with generous limits** (up to thousands of testers)
- Multi-platform (iOS + Android in one tool)
- Easy CI integration (Fastlane plugin; CLI; GitHub Action)
- Slack / email invitations
- Tester groups for organizing internal vs external
- Integrates with Firebase Crashlytics for crash reports
- No 90-day build expiration (vs TestFlight)
- API access for automation

Weaknesses:

- Not a substitute for TestFlight / Play Store testing for *external* store-bound testing
- Tester onboarding requires accepting an invitation (some friction)
- iOS testers must register their device's UDID for ad-hoc provisioning (or use TestFlight instead)

Use Firebase App Distribution when:

- Internal QA / dogfooding / daily builds
- Cross-platform team needing one tool
- You want crash reports linked to specific build distributions

### Expo EAS Build + Submit + Update

Expo's managed mobile delivery platform. Builds in cloud (EAS Build), submits to stores (EAS Submit), and OTA-updates JS bundles (EAS Update).

Strengths:

- **End-to-end Expo / React Native flow** — build, distribute, update in one product
- Cloud builds (no local Mac required for iOS)
- OTA updates via EAS Update — push JS-only changes without store re-review
- Automated submission to TestFlight + Play Console

Weaknesses:

- Expo / React Native specific
- Pricing scales with build minutes ($19+/mo)
- Cold-start build queue can delay urgent builds

Use EAS when:

- You're on Expo / React Native (see [Mobile App Frameworks](../frontend/mobile-app-frameworks.md))

### Diawi

Quick ad-hoc upload service. Drop an IPA or APK; get a shareable link. Founded 2014.

Strengths:

- **Simplest possible workflow** — drag, drop, share link
- Free tier
- Indie / freelance friendly

Weaknesses:

- One-off oriented; not for ongoing distribution
- No tester management
- Free tier ad-supported

Use Diawi when:

- Quick one-off share for a stakeholder review
- You don't have / don't want to set up Firebase

### Codemagic

Mobile-first CI/CD platform. Founded 2019. Targets React Native / Flutter / native iOS+Android.

Strengths:

- **Mobile-first design** — knows about iOS code signing, Android keystores, Apple Transporter
- Pre-built workflows for Flutter, React Native, Capacitor
- Strong distribution integrations (TestFlight, Play, Firebase, App Center sunset)
- Per-minute pricing (no overpriced flat tiers)
- Mac instance access (M-series)
- Code signing handled (always a pain in iOS CI)

Weaknesses:

- Mobile-only (don't use for backend / web)
- Pricing can scale unexpectedly with build minutes
- Smaller community than GitHub Actions

Use Codemagic when:

- Mobile-first team without GitHub Actions setup
- Flutter or React Native team wanting opinionated CI
- You hate iOS code signing in generic CI

### Bitrise

Older mobile CI/CD. Founded 2014. Established mobile shops use it.

Strengths:

- **Established** — deep mobile ecosystem knowledge
- Per-build pricing model
- Strong workflow editor (visual)
- Integrations with TestFlight, Firebase, Play, Diawi

Weaknesses:

- Pricing vs Codemagic / GitHub Actions can be unfavorable
- Slower product velocity in 2024-2026 vs Codemagic

Use Bitrise when:

- Existing investment / established workflows
- Team prefers Bitrise's UX

### GitHub Actions + Fastlane

DIY mobile CI on GitHub. Fastlane handles the iOS / Android signing + upload primitives; GitHub Actions runs them.

Strengths:

- **Free for many use cases** (Mac runners are pricier; Linux for Android is free for OSS)
- Maximum flexibility — your YAML, your workflow
- Aligned with code repo (PR-based deployment patterns)
- Massive community + actions marketplace

Weaknesses:

- Setup work — Fastlane configuration is non-trivial (Match for code signing, Pilot for TestFlight, Supply for Play)
- Mac runners cost money for iOS builds at scale
- iOS code signing pitfalls require attention

Use GitHub Actions + Fastlane when:

- Already on GitHub
- Team wants flexibility and is willing to invest in setup
- Budget conscious (especially for Android-only or React Native)

### Xcode Cloud

Apple's native CI/CD for iOS / macOS / tvOS / watchOS apps. Bundled with Xcode 13+.

Strengths:

- **Apple-native** — knows about all the Apple tooling
- $14.99+/mo for paid tiers; free up to 25 build hours
- Integrates seamlessly with Xcode IDE
- TestFlight upload built in

Weaknesses:

- iOS / Apple platform only (no Android)
- Less flexible than Fastlane / Codemagic
- Smaller ecosystem

Use Xcode Cloud when:

- iOS-only or Apple-platform team
- Team prefers Xcode integration

### Fastlane

OSS Ruby-based mobile automation. Used inside almost every mobile CI pipeline. Founded 2014; acquired by Google 2017.

Components:
- **fastlane**: orchestration tool
- **Match**: code signing (iOS); stores certificates in a private git repo
- **Pilot**: TestFlight upload
- **Supply**: Play Store upload
- **Snapshot**: automated screenshots
- **Sigh**: provisioning profile management

Strengths:

- **Industry standard** for iOS / Android CI automation
- Free + OSS forever
- Plugin ecosystem
- Most other CI tools wrap Fastlane

Weaknesses:

- Ruby-based (some teams prefer Node / Python)
- Some plugins lag platform updates

Use Fastlane when:

- You're on any mobile CI — Fastlane is the glue

## Common Workflows

### Indie iOS+Android Workflow

```
GitHub Push → GitHub Actions:
  - Run tests
  - Build iOS (Mac runner) → Fastlane → Pilot upload to TestFlight
  - Build Android → Fastlane → Supply upload to Play Internal Testing
  - Optional: also push to Firebase App Distribution for internal team
```

Cost: GitHub Actions Mac runners ~$0.08/min. ~$5-30/mo for indie volumes.

### Mid-Market Workflow

```
GitHub PR → Codemagic or GitHub Actions:
  - PR builds → Firebase App Distribution → automated install on QA devices
  - Merged main → CI:
    - Run full E2E
    - Build → upload to TestFlight (iOS) + Play Internal Testing (Android)
    - Notify team via Slack with build links
  - Tag for store release → CI:
    - Final build → submit to App Store Review + Play Production
    - OR: push EAS Update for OTA changes
```

Cost: $50-300/mo on CI; free Firebase + TestFlight + Play Console.

### Enterprise Workflow

Add: dedicated build infrastructure, code-signing automation via Match, automated screenshot generation, App Store Connect API for managed releases, multi-environment builds (dev / staging / prod variants).

## What These Tools Won't Do

**Don't expect any of these to replace App Store Review.** TestFlight builds bypass review; *production* App Store builds always go through review. Plan timelines.

**Don't expect Firebase App Distribution to substitute for TestFlight in store-pre-launch.** Apple may require TestFlight beta usage for some app submissions.

**Don't expect ad-hoc iOS distribution to scale.** Ad-hoc builds require tester device UDID registration (max 100 devices/year per Apple Developer account). Use TestFlight for >100 testers.

**Don't expect "instant rollback" on stores.** Once an app version is live in the App Store / Play Store, you can't simply revert. You can submit a new version (review-gated) or pull from sale. Plan releases carefully.

**Don't expect EAS Update to bypass store review for everything.** EAS Update only updates the JS bundle; native code changes still require store re-review. The line is fuzzy and Apple has been tightening enforcement.

## Pragmatic Stack Patterns

### Indie Solo Dev (RN / Native)

- TestFlight + Play Internal Testing (free)
- Firebase App Distribution for daily team builds (free)
- GitHub Actions for CI ($0-30/mo)
- Fastlane for orchestration (free)
- Total: <$50/mo

### Indie / SMB on Expo

- EAS Build + EAS Submit + EAS Update ($19-99/mo)
- Bundles all the distribution
- Total: $19-99/mo

### Mid-Market Mobile Team

- TestFlight + Play Console testing tracks
- Firebase App Distribution
- Codemagic or GitHub Actions ($50-300/mo)
- Fastlane orchestration
- Total: $80-400/mo

### Enterprise Mobile Team

- TestFlight + Play Console
- Firebase App Distribution (free) or self-hosted equivalent
- Codemagic / Bitrise / Jenkins (custom $$$)
- Dedicated DevX team owning build infrastructure
- Total: $1K-10K+/mo

## Decision Framework: Five Questions

1. **Are you submitting to App Store / Play Store?**
   - Yes: TestFlight + Play Console testing tracks (mandatory)
   - No (e.g. enterprise internal-only): Firebase App Distribution alone is fine

2. **What's your CI / build setup?**
   - GitHub-based + flexible: GitHub Actions + Fastlane
   - Mobile-only team: Codemagic
   - Expo / RN: EAS Build + EAS Submit
   - iOS-only Apple-aligned: Xcode Cloud

3. **Internal team distribution channel?**
   - Default: Firebase App Distribution
   - One-off shares: Diawi

4. **Migration from App Center?**
   - Yes: Firebase App Distribution (most common path)

5. **Need OTA updates without store re-review?**
   - Expo / RN: EAS Update
   - Native: not really possible (CodePush is dead; AppCenter is dead)

## Verdict

**iOS pre-launch testing**: TestFlight (mandatory; free with Apple Dev).

**Android pre-launch testing**: Play Console Internal/Closed/Open Testing (mandatory; free).

**Cross-platform internal QA**: Firebase App Distribution (free; default).

**Mobile CI/CD**: Codemagic (mobile-first) or GitHub Actions + Fastlane (general-purpose).

**Expo / RN apps**: EAS Build + Submit + Update.

**One-off shares**: Diawi.

**App Center migration**: Firebase App Distribution + your CI of choice.

The most common mistake is **shipping to TestFlight only** and ignoring Play Console testing tracks for Android. Both are required. The second is **using Diawi for ongoing distribution** — fine for one-offs; not for daily builds. The third is **building a custom CI before learning Fastlane** — Fastlane handles 90% of iOS/Android signing pitfalls; reinvent at your peril.

## See Also

- [Mobile App Frameworks](../frontend/mobile-app-frameworks.md) — React Native / Flutter / native + EAS context
- [CI/CD Providers](./cicd-providers.md) — general CI/CD landscape
- [Cloud Development Environments](./cloud-development-environments.md)
- [Error Monitoring Providers](./error-monitoring-providers.md) — Sentry / Bugsnag / Crashlytics
- [API Mocking & Mock Data Platforms](./api-mocking-mock-data-platforms.md) — for testing
- [Testing Frameworks](./testing-frameworks.md)
- [Testing & QA](./testing-qa.md)
- [Testing & Quality Assurance (Guides)](../guides/testing-and-quality-assurance.md)
- [Internal Developer Platforms](./internal-developer-platforms.md)
- [Code Quality Platforms](./code-quality-platforms.md)
- [Application Security Tools](./application-security-tools.md)
- [Mobile Push Notification Providers](../backend-and-data/notification-providers.md)
- [Mobile Attribution Platforms](../marketing-and-seo/mobile-attribution-platforms.md)
- [App Store Optimization (ASO)](../marketing-and-seo/aso-mobile-app-marketing-tools.md)
- [Subscription Billing Providers](../auth-and-payments/subscription-billing-providers.md) — RevenueCat for mobile IAP
- [Vercel CLI / Vercel Sandbox](../cloud-and-hosting/vercel-sandbox.md)
- [GitHub](./github.md)
- [Realtime / WebSocket Platforms](../backend-and-data/realtime-websocket-platforms.md)
- [Performance Optimization](./performance-optimization.md)
- [Coordinating Deploys for Vibe-Coded Projects](./coordinating-deploys-vibe-coded-projects.md)
