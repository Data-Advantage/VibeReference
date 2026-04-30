# Mobile App Development Frameworks: React Native, Flutter, Expo, Capacitor, Ionic, Kotlin Multiplatform

[⬅️ Frontend Overview](../frontend/)

If you're building a mobile app in 2026 and trying to pick a cross-platform framework, this is the consolidated comparison. The category settled around four real options after years of churn — **React Native** (with **Expo**), **Flutter**, **Capacitor/Ionic**, and **Kotlin Multiplatform** — plus the always-available native option (SwiftUI for iOS, Jetpack Compose for Android). Most teams pick by what their existing engineers know rather than by app needs, which is sometimes right (developer velocity matters) and sometimes wrong (when your app pushes the framework's limits, the wrong choice costs months).

## TL;DR Decision Matrix

| Framework | Language | Maturity | UI fidelity | Indie Vibe | Best For |
|---|---|---|---|---|---|
| React Native + Expo | TypeScript / JavaScript | Very mature (since 2015) | High (native components) | Very high | Default for web teams; fastest velocity |
| Flutter | Dart | Very mature (since 2017) | Highest (custom rendering) | High | Pixel-perfect cross-platform; gaming-adjacent UI |
| Expo (managed workflow) | TypeScript | Very mature | Same as RN | Very high | Indie + small team React Native shops |
| Capacitor + Ionic | TypeScript / Web | Mature | Medium (web-rendered) | High | Web-first teams; content-heavy apps |
| Ionic + Capacitor | TypeScript / Web | Mature | Medium | High | Same as Capacitor; with Ionic UI components |
| Kotlin Multiplatform (KMP / Compose Multiplatform) | Kotlin | Maturing rapidly | High | Medium | Android-first teams expanding to iOS |
| SwiftUI (iOS) + Jetpack Compose (Android) | Swift / Kotlin | Native, top-tier | Highest (native) | Medium | iOS+Android teams with separate codebases |
| .NET MAUI | C# / XAML | Mature | High | Low | C# enterprise shops |
| NativeScript | TypeScript | Declining | Medium | Low | Legacy projects |
| Lynx (TikTok / ByteDance, OSS 2025) | TypeScript | New | High | High | Newer entrant; bet on if React Native frustrations push you elsewhere |

The first decision is **what's your team's current expertise**. If your team is React + TypeScript: React Native + Expo wins by velocity. If your team is full-stack JS but mostly web: Capacitor lets you ship the web app to mobile with the least code change. If you're starting from scratch and prioritize UI fidelity: Flutter. If you have an Android-first team: Kotlin Multiplatform.

## Decide What You Need First

Mobile frameworks are not interchangeable. Different apps demand different things.

### Cross-platform with native feel (the 60% case)

You want a single codebase running on iOS + Android with components that look native (or close enough). Performance matters but you're not building a game. Your team is web-savvy. **React Native + Expo** is the default; Flutter the runner-up.

### Highest UI fidelity / animation-rich (the 15% case)

You want pixel-perfect cross-platform with smooth 60-120fps animations and brand-controlled design. UI consistency across devices matters more than "feels native." **Flutter**.

### Existing web app, want mobile (the 15% case)

You have a Next.js / React / Vue / Angular web app. You want to wrap it for iOS + Android with minimal rework. Push notifications, camera access, deep linking. **Capacitor** wraps your web app in a native container with plugin access. **Ionic** adds mobile-friendly UI components on top.

### Native-only (the 5% case)

You're building something performance-critical (AR, advanced camera, ML on-device, AAA game). Pick **SwiftUI for iOS + Jetpack Compose for Android**. Two codebases. Best results.

### Android-first team (the 5% case)

Your engineers are Android / Kotlin. You're expanding to iOS. **Kotlin Multiplatform** lets you share business logic between Android (Compose) and iOS (sharing logic; Compose Multiplatform UI is maturing).

## Provider Deep-Dives

### React Native + Expo

The dominant pick in 2026. Used by Meta (originator), Discord, Shopify, Coinbase, Microsoft Teams (parts), Netflix, Bloomberg. With **Expo Router** + **EAS Build** + **Expo Application Services**, the developer experience approaches "build like web; ship to native."

Strengths:

- **Largest ecosystem** — npm packages for everything; Expo SDK covers 90% of native APIs without ejecting
- **Hot reload** + React DevTools — same-day-shipping feel
- React + TypeScript familiarity for web teams
- New Architecture (Fabric + TurboModules) shipped — performance gap to native largely closed for normal apps
- **Expo EAS** handles builds, OTA updates, app submission — replaces XCode/Android Studio for most workflows
- **OTA updates** via Expo Updates — ship JS-only changes without app-store re-review
- Massive talent pool
- Cross-platform components: Pressable, FlashList (Shopify), Reanimated 3, React Native Skia
- React Server Components support coming in Expo (preview)

Weaknesses:

- Two-bridge architecture (legacy) had perf issues; New Architecture (Fabric) fixes most of this but migration is non-trivial
- Native module ecosystem can fragment — packages drop maintenance, version mismatches with iOS/Android SDK updates
- Memory + bundle size larger than native
- Some niche native APIs require ejecting from Expo or writing custom modules
- 60fps scrolling under heavy load can stutter without careful tuning
- Apple App Store review sometimes flags React Native apps with stricter scrutiny

Use React Native + Expo when:

- Team is React / TypeScript
- App is "normal" mobile (not high-end games or AR)
- You want fast iteration + OTA updates
- You'd like a single codebase serving iOS + Android + (with Expo) potentially web

Avoid when:

- App needs sustained 120fps animation or heavy graphics
- You need cutting-edge native APIs (latest iOS feature shipped last week)
- Performance is the #1 KPI and you're willing to maintain two codebases

### Flutter

Google's framework. Dart language. Used by Google Pay, BMW, Toyota, Alibaba, Reflectly, Nubank, Tencent, Klarna.

Strengths:

- **Highest UI fidelity cross-platform** — every pixel rendered by Flutter's engine; identical on iOS + Android
- 60-120fps animations come naturally
- Strong tooling (DartPad, hot reload, DevTools, Impeller renderer)
- **Single codebase truly works** for iOS + Android + Web + Desktop (macOS, Windows, Linux) + embedded
- Type-safe Dart; sound null safety
- Fast cold start
- Production-grade for years; ecosystem is mature

Weaknesses:

- **Dart is the price** — not a transferable language; smaller talent pool than JS/TS
- App size larger than native (engine bundled)
- iOS look-and-feel needs extra effort — "Cupertino" components vs. Material defaults
- Web target works but isn't first-class — Flutter Web is heavy
- Server-side ecosystem is limited compared to Node.js or Java/Kotlin
- Animation-heavy apps consume battery faster than native

Use Flutter when:

- Pixel-perfect UI consistency matters across iOS + Android
- Your team is willing to learn Dart (or already knows it)
- You want a single codebase for iOS + Android + desktop + web
- Animation / motion-rich apps where 60fps+ matters

Avoid when:

- Team is firmly React / TypeScript and learning Dart isn't worth it
- App size is critical (Flutter adds 5-10MB minimum)
- You need React server components or Node ecosystem leverage

### Capacitor + Ionic

Capacitor is the modern web-to-native wrapper from the Ionic team (replacing PhoneGap/Cordova). Wraps a web app (HTML/CSS/JS) in a native container; provides plugins for camera, geolocation, push, file system, etc. Ionic adds mobile-friendly UI components.

Strengths:

- **Reuse existing web app** — Next.js / React / Vue / Angular code runs in Capacitor with minimal change
- Plugin model for native APIs is clean
- iOS + Android + Web from one codebase (truly)
- Lower bar to entry — no new framework, no new language
- Good for content-heavy apps, dashboards, B2B mobile portals, internal tools
- PWA + native from the same codebase

Weaknesses:

- **Web rendering** — uses WKWebView (iOS) or System WebView (Android); animations + scroll feel less native
- Performance below React Native / Flutter for heavy interactivity
- "Doesn't feel native" — power users notice
- App store reviewers sometimes flag for "just a wrapped website"
- Capacitor is the right choice for a narrow band of apps; if you push past it, you'll regret not picking RN/Flutter

Use Capacitor when:

- You have an existing Next.js / Vue / Angular web app and need iOS+Android with minimal effort
- The app is content-heavy or dashboard-style (not animation-rich)
- Your team is web-only with no React Native or Flutter experience
- You want PWA + native from one codebase

Avoid when:

- App requires native-feel animations / interactions
- App is performance-critical
- You'll be tempted to add complex client-side features over time

### Kotlin Multiplatform (KMP) / Compose Multiplatform

JetBrains + Google's cross-platform Kotlin. Share business logic across iOS, Android, web, desktop. Compose Multiplatform shares UI too.

Strengths:

- **Native by default** — Kotlin compiles to native iOS via Kotlin/Native; Android is its home
- Share business logic (networking, persistence, business rules) between platforms; UI can be native or shared
- Compose Multiplatform UI is maturing fast (stable for Android + Desktop; iOS + Web are stabilizing)
- No bridge overhead — native performance
- Type-safe Kotlin
- Backed by JetBrains; growing fast

Weaknesses:

- **Less mature** for full UI sharing than Flutter / RN; if you want truly shared UI, you'll hit edges
- Smaller ecosystem than RN or Flutter
- iOS-side tooling less polished than Android
- Compose for iOS is "production-ready 2025-2026" — early-mover energy
- Talent pool: Kotlin developers exist but multiplatform Kotlin is rarer

Use KMP when:

- Your team is Android-first and you're expanding to iOS
- You want native performance + share business logic
- You're willing to write iOS UI in SwiftUI while sharing the rest

Avoid when:

- You need a fully shared UI today (Flutter or RN better-baked)
- Your team isn't Kotlin-native

### Native: SwiftUI + Jetpack Compose

Two codebases. Best UI fidelity, best performance, best access to platform APIs.

Strengths:

- **Best on-device experience** — every native API; latest iOS / Android features
- Smallest app size
- Best tooling: Xcode, Android Studio, native debuggers, native profiling
- Apple's iOS apps are written in SwiftUI; Google's Android apps are using Compose increasingly

Weaknesses:

- **Two codebases** — two engineering teams or context-switching for one team
- Slowest velocity for cross-platform feature parity
- Hiring: separate iOS + Android skills

Use native when:

- App must be best-in-class (Apple Design Award territory)
- You're shipping features that demand the latest platform APIs (DynamicIsland, ARKit, on-device ML)
- Performance is the #1 KPI
- You have budget for two engineering teams

Avoid when:

- Cross-platform parity matters more than per-platform polish
- Engineering capacity is limited

### .NET MAUI

Microsoft's evolution of Xamarin.Forms. C# and XAML for cross-platform.

Strengths:

- C# / .NET ecosystem
- Strong for enterprise C# shops
- Visual Studio tooling

Weaknesses:

- Smaller community than RN/Flutter
- iOS / Android updates can lag native
- Used mostly in enterprise/internal contexts

Use MAUI when:

- You're a C# / .NET shop building internal mobile

### NativeScript

OSS framework wrapping native APIs in JavaScript. Older project; declining usage.

Use NativeScript only if you have a legacy NativeScript project. New projects should use RN, Flutter, or Capacitor.

### Lynx (ByteDance / TikTok)

Open-sourced 2025. ByteDance's internal cross-platform framework powering TikTok and many ByteDance apps. TypeScript / React-like API; native rendering.

Strengths:

- Production-tested at TikTok scale
- React-like with native rendering
- Concurrent rendering + performance optimizations from production scale

Weaknesses:

- New as OSS; ecosystem nascent
- Documentation maturing
- Smaller community than RN/Flutter

Use Lynx when:

- You're frustrated with React Native and want to bet on a newer entrant
- ByteDance's production track record is sufficient credibility

### React Native vs Flutter — the honest comparison

The two real options 90% of cross-platform decisions come down to.

| | React Native + Expo | Flutter |
|---|---|---|
| Language | TypeScript | Dart |
| Talent pool | Massive (JS) | Smaller (Dart) |
| Hot reload | Yes | Yes |
| UI fidelity | High (native components) | Highest (custom render) |
| Animations | Reanimated/Skia | Flutter native |
| App size | Smaller | Larger (engine bundled) |
| Ecosystem | npm + Expo SDK | pub.dev (smaller) |
| Web reuse | Possible (RN-Web) | Possible (Flutter Web) |
| Server-side | Node.js leverage | Limited |
| Backed by | Meta + Expo | Google |
| Best at | Speed of dev + ecosystem | Pixel-perfect UI |

If your team knows React + TS: pick React Native + Expo. If you're starting fresh and prioritize UI: pick Flutter. Both are production-ready; both have major shipping companies; both will be alive in 5 years.

## Build, Ship, Update

### Builds & CI/CD

- **EAS Build** (Expo): cloud builds for RN/Expo. The default. Replaces XCode/Android Studio for most workflows.
- **Codemagic**, **Bitrise**: cross-platform CI/CD (RN, Flutter, native).
- **GitHub Actions**: works for everything; needs Mac runners for iOS.
- **Fastlane**: scripts for app store submission, code signing, screenshots.

### App Store Submission

- iOS: Apple requires Xcode-built IPAs uploaded via Transporter. EAS Submit handles this for RN.
- Android: Google Play accepts AAB / APK uploaded via Console. EAS Submit and others handle.

### OTA / Live Updates

- **Expo Updates**: ship JavaScript-only changes without app store re-review. The single biggest velocity unlock for RN.
- **CodePush** (Microsoft, deprecated 2025) was the prior Expo-equivalent for non-Expo RN; transition to Expo Updates or CapsuleHQ.
- **Capacitor Live Updates** (Ionic Appflow): paid OTA for Capacitor apps.
- Native apps cannot do OTA — every change requires app store review.

### App Distribution / Beta

- **TestFlight** (iOS): Apple's beta distribution. Up to 10K external testers.
- **Internal App Sharing / Closed Testing** (Android): Google Play beta tracks.
- **Firebase App Distribution**: cross-platform pre-release builds; great for internal QA.
- **Diawi**: ad-hoc IPA/APK distribution for testers.
- **Expo Dev Builds + Expo Go**: developer testing without full builds.

## Mobile-Specific Concerns

These apply regardless of framework.

### Push Notifications

- iOS: APNs (Apple Push Notification service) — requires APNs certificate or token.
- Android: FCM (Firebase Cloud Messaging) — Google's push delivery.
- Cross-platform: **Expo Notifications**, **OneSignal**, **Pusher Beams**, **Knock**, **Courier** — abstract the per-platform setup.

### In-App Purchases

- iOS: StoreKit (Apple takes 15-30% commission)
- Android: Google Play Billing (Google takes 15-30% commission)
- Cross-platform: **RevenueCat** is the dominant solution — abstracts both stores, handles subscription lifecycle, receipt validation, retention dashboards. Default for most teams.
- For SaaS: third-party payments (Stripe) blocked by App Store guidelines for in-app digital purchases (Apple's "reader" rules carve narrow exceptions).

### Deep Linking & Universal Links

- iOS: Universal Links (apple-app-site-association)
- Android: App Links (assetlinks.json)
- Frameworks expose hooks; setup requires platform-specific server-side files (host on `/.well-known/`).

### App Sizes

- React Native (with Expo SDK): typical 25-40 MB
- Flutter: typical 30-50 MB (engine bundled)
- Capacitor (Web wrapped): 10-20 MB depending on web bundle
- Native: 5-15 MB typical

App size matters: 100MB cellular install limit on iOS used to matter; less so in 2026 (warnings only). Smaller apps still have better install conversion.

### Offline & Storage

- **AsyncStorage** (RN), **shared_preferences** (Flutter): simple key-value
- **MMKV** (RN, Flutter via plugin): faster, encrypted key-value
- **Realm** (mobile DB): cross-platform, sync-capable
- **WatermelonDB** (RN): SQLite-backed reactive ORM
- **Drift** / **Floor** (Flutter): SQLite ORMs
- **Expo SQLite**, **react-native-sqlite-storage**: raw SQLite

## Pragmatic Stack Patterns

### Indie / Small Team Building New App

- **React Native + Expo** (managed workflow)
- **EAS Build** for builds
- **Expo Updates** for OTA
- **RevenueCat** for IAP
- **Sentry** for crash reporting
- **PostHog** or **Mixpanel** for product analytics
- **OneSignal** or **Expo Notifications** for push
- Total: $0-200/mo for early stage

### Cross-Platform with Brand UI Priority

- **Flutter**
- **Codemagic** for CI/CD
- **RevenueCat** for IAP
- **Sentry** for crash reporting
- **Firebase** for analytics + push (Flutter-native)
- Total: $0-200/mo

### Existing Web App Going Mobile

- **Capacitor** + your existing Next.js / React / Vue
- **Ionic** UI components if you want polish
- **GitHub Actions** for builds
- **Capacitor Live Updates** for OTA
- **Capacitor plugins** for camera / push / etc.
- Total: $0-150/mo

### Native iOS + Android Polished App

- **SwiftUI** (iOS) + **Jetpack Compose** (Android)
- **Xcode Cloud** (iOS CI/CD) + **GitHub Actions** (Android)
- **TestFlight** + **Internal App Sharing**
- Two codebases; two engineering teams or context-switching
- Total: ~$0/mo tooling but engineering cost is the multiplier

### Android-First Team Expanding to iOS

- **Kotlin Multiplatform** for shared business logic
- **Jetpack Compose** for Android UI
- **SwiftUI** for iOS UI (or **Compose Multiplatform** if it's mature enough for your needs)
- **GitHub Actions** for CI/CD with Mac runners
- Total: ~$0/mo

## Decision Framework: Six Questions

1. **What language is your team strongest in?**
   - TS / JS: React Native + Expo
   - Dart: Flutter
   - Kotlin: KMP
   - C#: .NET MAUI
   - Web (any): Capacitor

2. **Do you have an existing web app you want to wrap?**
   - Yes: Capacitor
   - No: RN / Flutter / native

3. **Is UI fidelity (pixel-perfect cross-platform) the top priority?**
   - Yes: Flutter
   - No: RN

4. **Is performance the #1 KPI?**
   - Yes: native (SwiftUI + Compose)
   - Otherwise: cross-platform fine

5. **Need OTA updates without app-store review?**
   - Yes: RN + Expo (best); Capacitor Live Updates; not native
   - No: any

6. **Solo founder / 2-person team or full team?**
   - Solo: RN + Expo (highest velocity)
   - Team: any; choose by language strength

## Verdict

**Default for most teams in 2026**: React Native + Expo. The ecosystem, talent pool, OTA, and velocity beat the alternatives for the typical SaaS mobile companion app. New Architecture closed the perf gap. Expo's managed workflow + EAS Build + EAS Updates makes the dev experience approach "deploy a website."

**Default for UI-fidelity-priority teams**: Flutter. If pixel-perfect cross-platform matters more than React leverage, Flutter is excellent. Production-ready for years.

**Default for web-first teams**: Capacitor + Ionic. The path of least resistance from a web app to mobile. Accept the WebView trade-offs.

**Default for native-quality apps**: SwiftUI + Jetpack Compose. Two codebases is real cost, but the result is best-in-class.

**Don't pick**: NativeScript (declining), Cordova (legacy), Xamarin Forms (sunset).

The most common mistake is **picking the framework based on what looks coolest in a demo** instead of what your team can ship fastest. The second is **building a Capacitor app, hitting performance issues, then rewriting in RN/Flutter** — be honest at the start about your performance needs. The third is **choosing native because "it'll be faster"** when cross-platform would have been 3x faster to ship without users noticing.

## See Also

- [React](./react.md) — React on web
- [Next.js](./nextjs.md) — Next.js for web
- [Web Frameworks](./web-frameworks.md) — Next.js / Remix / SvelteKit / Nuxt
- [Mobile Push Notification Providers](../backend-and-data/notification-providers.md) — Knock / Courier / OneSignal
- [Mobile Attribution Platforms](../marketing-and-seo/mobile-attribution-platforms.md) — AppsFlyer / Adjust / Branch / Singular
- [App Store Optimization (ASO)](../marketing-and-seo/aso-mobile-app-marketing-tools.md) — App Store / Play Store ranking
- [Error Monitoring Providers](../devops-and-tools/error-monitoring-providers.md) — Sentry / Bugsnag / Crashlytics
- [Product Analytics Providers](../devops-and-tools/product-analytics-providers.md) — Mixpanel / Amplitude / PostHog
- [Subscription Billing Providers](../auth-and-payments/subscription-billing-providers.md) — RevenueCat for IAP
- [Realtime / WebSocket Platforms](../backend-and-data/realtime-websocket-platforms.md)
- [TypeScript](./typescript.md)
- [TypeScript Patterns](./typescript-patterns.md)
- [Tailwind](./tailwind.md) — works in RN via NativeWind
- [shadcn/ui](./shadcn.md) — patterns adaptable to React Native
- [Headless Commerce Platforms](./headless-commerce-platforms.md) — when mobile commerce matters
