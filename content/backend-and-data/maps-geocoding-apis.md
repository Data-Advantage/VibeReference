# Maps & Geocoding APIs: Google Maps, Mapbox, HERE, Radar, MapTiler, TomTom, OpenStreetMap

[⬅️ Backend & Data Overview](../backend-and-data/)

If you're building a SaaS that touches addresses, locations, routing, or maps, you need a maps + geocoding API. The naive approach: copy/paste a Google Maps embed and call it done. The structured approach: choose a provider based on use case (display vs geocoding vs routing vs autocomplete), pricing model (per-load vs per-request), and licensing (Google's strict ToS vs Mapbox's friendlier vector tiles vs OSM's free-but-DIY). The right pick depends on volume, geography (US-only vs global), and whether you need a polished consumer-grade map (Google) or a developer-friendly customizable map (Mapbox).

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Google Maps Platform | Full maps + geocoding | $200/mo credit | $7/1K loads + per-call | Medium | Default; consumer-grade |
| Mapbox | Maps + geocoding + routing | 50K loads/mo free | $0.50-1/1K loads | Very high | Customizable maps + dev UX |
| HERE | Enterprise maps + routing | Free dev tier | Contact / volume | Low | Logistics / automotive |
| Radar | Geofencing + location SDK | 100K events/mo free | $0.50-1/1K events | Very high | Mobile geofencing |
| MapTiler | OSM-based maps + geocoding | 100K tiles/mo free | $25-500/mo | Very high | Affordable Mapbox alt |
| TomTom | Enterprise maps + traffic | Limited free | Contact | Low | Routing / fleet |
| OpenStreetMap | Free tile + data | Free (host yourself) | Self-hosted | Very high | OSS / DIY / privacy |
| Geoapify | OSM-based geocoding + maps | 3K req/day free | $49-499/mo | High | Geocoding-focused |
| Stadia Maps | OSM-based maps | 200K tiles/mo free | $20-450/mo | Very high | Affordable map tiles |
| Esri ArcGIS | GIS + maps | Custom | $$$ | Low | GIS / enterprise |
| Geocodio | US-focused geocoding | 2.5K req/day free | Pay-per-use | Very high | Bulk US geocoding |
| Nominatim (OSM) | Free geocoding | Free (rate-limited) | Self-hosted | Medium | DIY geocoding |
| What3Words | 3-word addresses | Custom | Per-call | High | Last-mile / unique addressing |
| LocationIQ | OSM-based geocoding | 5K req/day free | $49-499/mo | High | Affordable geocoding |
| Pelias (geocoder.earth) | OSS geocoder | Free (host yourself) | Self-hosted | High | DIY OSS |

The first decision is **display vs no-display**: do you need an interactive map UI, or just convert addresses to lat/lng (geocoding) and back (reverse geocoding)? The second decision is **geography**: US-only is much cheaper (Geocodio, Mapbox) than global. The third decision is **license**: Google has strict ToS (no caching geocode results); Mapbox / OSM are friendlier.

## Decide What You Need First

### Just a map display (the 30% case)
You want a map to show on a page (store locator, real estate listings, location pin). No address input.

Right tools:
- **Google Maps** — consumer-grade UX; widely recognized
- **Mapbox GL JS** — customizable; vector tiles; modern
- **MapTiler** — affordable Mapbox alternative
- **Leaflet + OSM tiles** — free + DIY

### Geocoding only — address to lat/lng (the 30% case)
You take address strings and convert to coordinates (form normalization, sales territory mapping, distance calculation). No map UI.

Right tools:
- **Google Geocoding API** — high accuracy; strict ToS (no caching)
- **Mapbox Geocoding** — high accuracy; cacheable
- **Geocodio** — US/Canada-focused; bulk-friendly; cheap
- **LocationIQ / Geoapify** — OSM-based; cacheable; cheap

### Address autocomplete (the 20% case)
You want a search box that suggests addresses as users type (checkout flow, signup, location finder).

Right tools:
- **Google Places Autocomplete** — best accuracy; expensive at scale
- **Mapbox Search Box** — good accuracy; cacheable; cheaper
- **Algolia Places** (deprecated, replaced by Algolia Search)
- **Photon (OSM)** — free; lower accuracy; self-host

### Routing + directions (the 10% case)
You need to compute routes between A and B (last-mile delivery, sales-rep routing, transit time estimation).

Right tools:
- **Google Directions API** — driving / walking / transit; commute times
- **Mapbox Directions** — strong driving + cycling
- **HERE Routing** — fleet / commercial vehicle routing
- **TomTom Routing** — traffic-aware

### Geofencing / location triggers (the 5% case)
You need backend events when users enter/exit zones (e.g., user pulled into store parking lot → send push).

Right tools:
- **Radar** — leader; mobile SDK + server-side
- **Mapbox Movement** — emerging
- **Custom (PostGIS)** — DIY for backend-only geofencing

### Static map images (the 5% case)
You need server-rendered map images (email, PDF, social card thumbnails).

Right tools:
- **Mapbox Static Images API** — modern default
- **Google Static Maps** — established
- **MapTiler Static Maps** — affordable

## Provider Deep-Dives

### Google Maps Platform — the consumer default
The most-recognized maps brand. Premium quality + pricing.

Pricing in 2026:
- Maps embed: $7/1K loads (after $200/mo free credit)
- Geocoding: $5/1K requests
- Places Autocomplete: $17/1K sessions ($2.83/1K with sessions)
- Directions: $5-10/1K (driving) or higher (transit)
- Free $200/mo credit covers ~28K map loads OR ~40K geocoding requests

Features: maps embed, geocoding, autocomplete, directions, distance matrix, places details, Street View, traffic.

Why Google wins: highest accuracy globally; best autocomplete; consumer-recognized UX; deepest POI database.

Trade-offs: most expensive at scale; strict ToS (no caching geocode results, no using lat/lng outside Google Maps); requires API key + billing setup; vendor lock-in once integrated.

Pick if: B2C product where users expect Google's look; need autocomplete or POI search. Don't pick if: scaling B2B with millions of geocode calls (cost explodes).

### Mapbox — customizable + developer-friendly
Mapbox has carved a niche as the "Google for developers." Vector tiles + custom styling + cacheable APIs.

Pricing in 2026:
- Maps GL JS: 50K loads/mo free, then $0.50-1/1K loads
- Geocoding (Search Box): 100K free, then $0.75/1K
- Directions: 100K free, then $1.50/1K
- Static images: $1/1K renders

Features: Mapbox GL JS (interactive maps), Vector + raster tiles, Studio (visual style editor), Geocoding (Search Box API), Directions, Static images, Movement (mobility data), Iso-routing.

Why Mapbox: customizable map styling (vector tiles); cacheable geocode results (vs Google's restrictive ToS); modern dev UX; React Native + Flutter SDKs.

Trade-offs: less recognized brand; slightly less accurate POI data than Google; pricing climbs at very high volume.

Pick if: B2B SaaS; want custom-styled maps; need cacheable geocoding. Don't pick if: need Google's specific UX or extensive POI database.

### HERE — enterprise / logistics
Founded 1985 (was Nokia/Navteq). Strong enterprise + logistics player.

Pricing in 2026: free dev tier + custom enterprise pricing.

Features: maps, routing (truck/commercial-vehicle aware), geocoding, fleet management, traffic, isolines, autonomous-driving data (HERE HD Live Map).

Why HERE: enterprise-grade routing for trucking/logistics; private auto manufacturer data partnerships.

Pick if: logistics / fleet / commercial routing. Don't pick if: B2C / consumer maps.

### Radar — geofencing + mobile SDK
Founded 2016. Mobile-first geofencing leader.

Pricing in 2026: 100K events/mo free; $0.50-1/1K events at scale.

Features: SDK (iOS/Android/web), geofences, places, trip tracking, geocoding (Google + own), insights.

Why Radar: best mobile SDK for geofences; battery-efficient; enterprise customers (Walgreens, T-Mobile).

Pick if: mobile app with location triggers (push when user nears store). Don't pick if: web-only or no geofencing need.

### MapTiler — affordable Mapbox alternative
OSM-based map tiles + geocoding.

Pricing in 2026: 100K tiles/mo free; $25-500/mo paid.

Features: vector + raster tiles, geocoding, routing, static images, MapLibre GL JS support (open-source Mapbox alternative).

Why MapTiler: cheaper than Mapbox; OSS-friendly (MapLibre); good for cost-conscious SaaS.

Pick if: cost-conscious; OSS preference. Don't pick if: need bleeding-edge data quality.

### TomTom — routing + traffic
Founded 1991. Strong traffic data + routing.

Pricing in 2026: limited free; enterprise contracts.

Features: maps, routing, traffic, navigation SDK.

Pick if: real-time traffic-aware routing critical. Don't pick if: simple maps suffice.

### OpenStreetMap (OSM) — free + DIY
Community-built map data. Free; you host.

Pricing: free data; you pay hosting + bandwidth.

Tile rendering options:
- Self-host with **OpenMapTiles** stack (PostGIS + Tegola/MapTiler tooling)
- Use a managed OSM-based provider (Mapbox/MapTiler/Stadia)

Pick if: privacy-focused / cost-sensitive / OSS aligned. Don't pick if: need turnkey.

### Geocodio — US/Canada-focused geocoding
Founded 2013. Excellent for bulk US/Canada geocoding.

Pricing in 2026: 2,500 req/day free; pay-per-use ($0.50/1K typical).

Features: forward + reverse geocoding, batch upload, congressional district / school district lookup.

Pick if: US-only geocoding; bulk operations. Don't pick if: international.

### Nominatim / Pelias / Photon — OSS geocoders
Self-hosted OSS geocoders.

Pricing: free; you host (typically $20-200/mo VPS).

Pick if: privacy / cost-sensitive / DIY-comfortable. Don't pick if: need turnkey + accuracy.

### What3Words — 3-word addressing
Maps every 3m × 3m square on earth to 3 words (///filed.most.cure).

Pricing: per-call API.

Pick if: last-mile delivery, hard-to-find locations, marine. Don't pick if: standard addressing works.

### LocationIQ / Geoapify — OSM-based managed
Managed OSM geocoders + maps.

Pricing: $49-499/mo.

Pick if: cost-conscious; OSS values; cacheable APIs. Don't pick if: enterprise-procurement requires Google brand.

### Esri ArcGIS — GIS / enterprise
Founded 1969. Enterprise GIS leader.

Pricing: enterprise; $$$$.

Pick if: enterprise GIS / federal / utilities. Don't pick if: standard SaaS maps.

## What Maps APIs Won't Do

Buying a maps API doesn't:

1. **Solve address normalization completely.** Geocoding gets you 95-99% accuracy on well-formed addresses. Apartment numbers, PO boxes, rural routes, international formats break differently. Plan for fallback.
2. **Avoid licensing constraints.** Google's ToS forbids caching geocode results past 30 days, using results outside Google maps, etc. Mapbox is friendlier but still has limits. Read the ToS.
3. **Replace user input validation.** Users typo addresses. Autocomplete reduces typos but doesn't eliminate.
4. **Scale costs predictably.** A viral product can blow through $200/mo Google credit on day 1. Set budget alerts.
5. **Make maps load fast on slow connections.** Tiles + JS bundle = 1-3 MB initial. Plan loading state + low-bandwidth fallback.

The honest framing: maps APIs are infrastructure. Quality varies by region (Google is best in the US; HERE is best in Europe; OSM coverage varies). Test in your target geographies.

## Cost Calculation Example

For a B2B SaaS with 100K geocoding requests/month + 50K map loads/month:

- **Google**: 100K × $5/1K = $500 + 50K × $7/1K = $350 → ~$650/mo (after free credit ~$650-200=$450/mo)
- **Mapbox**: 100K × $0.75/1K (after 100K free) = $0; 50K × $0.50/1K = $0 (after 50K free) → ~$0/mo
- **MapTiler**: similar to Mapbox; ~$25-100/mo
- **Geocodio + Mapbox display**: $0.50/1K × 100K = $50 + $0 maps → ~$50/mo

The Mapbox/MapTiler/Geocodio stack is dramatically cheaper than Google for B2B at scale. Most teams switch from Google to Mapbox once they hit the $200/mo free credit ceiling.

## Pragmatic Stack Patterns

### Pattern 1: Indie SaaS, MVP ($0-50/mo)
- **Mapbox GL JS** (50K free) for map display
- **Mapbox Geocoding** (100K free) for geocoding
- Total: $0/mo until viral

### Pattern 2: B2B SaaS at scale ($50-500/mo)
- **Mapbox** for display + geocoding + directions
- Cache geocode results (Mapbox ToS allows it)
- Total: $50-500/mo

### Pattern 3: US-only B2B ($30-300/mo)
- **Geocodio** for bulk geocoding
- **Mapbox** or **Google** for display
- Cheaper than full Google stack

### Pattern 4: Mobile geofencing app ($100-1K/mo)
- **Radar** for geofences + mobile SDK
- **Mapbox** for display
- Total: $100-1K/mo

### Pattern 5: Cost-sensitive / OSS ($0-100/mo)
- **Self-hosted OSM** (OpenMapTiles)
- **Self-hosted Pelias / Nominatim** for geocoding
- Total: $0-100/mo for hosting; engineering investment

### Pattern 6: Enterprise logistics ($$$+)
- **HERE** or **TomTom** for routing
- Custom MSA pricing

### Pattern 7: B2C consumer ($500-5K/mo)
- **Google Maps** for recognized UX
- Pay $500-5K/mo at scale

## Decision Framework: Three Questions

1. **What's the primary use case?**
   - Map display only → Mapbox / Google / MapTiler
   - Geocoding only → Mapbox / Geocodio / LocationIQ / Google
   - Autocomplete → Google / Mapbox Search Box
   - Routing → Google / Mapbox / HERE / TomTom
   - Geofencing → Radar / Mapbox

2. **What's your geography?**
   - US-only → Geocodio + Mapbox cheapest
   - Global → Mapbox / Google
   - Enterprise EU/logistics → HERE / TomTom

3. **What's your scale?**
   - <100K req/mo → free tier (Mapbox / MapTiler)
   - 100K-10M → Mapbox / MapTiler paid (~$50-500/mo)
   - 10M+ → enterprise contracts (Google / Mapbox / HERE)

## Verdict

For 50% of B2B SaaS in 2026: **Mapbox**. Best dev UX, customizable, cheaper than Google at scale, friendlier ToS.

For 25%: **Google Maps**. When users expect Google UX (real estate, store locator) or you need premium autocomplete.

For 10%: **Geocodio + Mapbox**. US-only B2B; bulk geocoding cheap, display via Mapbox.

For 5%: **Radar**. Mobile geofencing.

For 5%: **MapTiler / Stadia / LocationIQ**. Cost-sensitive; OSS-aligned.

For 5%: **HERE / TomTom**. Logistics / fleet / commercial routing.

The mistake to avoid: **defaulting to Google without checking ToS**. Caching geocode results is forbidden under Google's ToS — many SaaS teams accidentally violate. Mapbox / Geocodio explicitly allow caching.

The second mistake: **not setting budget alerts**. A viral product or runaway loop can spend $1K/day on Google Maps. Set hard caps + alerts.

The third mistake: **picking by accuracy at home**. The provider that's accurate in San Francisco may be terrible in Lagos or Mumbai. Test in target geographies before committing.

## See Also

- [IP Geolocation Providers](./ip-geolocation-providers.md) — IP-to-location vs address-to-location
- [API Integration](./api-integration.md) — generic integration patterns
- [Webhook Delivery Services](./webhook-delivery-services.md) — adjacent infrastructure
- [SMS & Voice APIs](./sms-voice-apis.md) — adjacent comms infra
- [Notification Providers](./notification-providers.md) — push notifications for geofence events
- [Database Providers](./database-providers.md) — PostGIS for geo storage
- [VibeWeek: Internationalization](https://vibeweek.dev/6-grow/internationalization-chat) — locale + region context
- [VibeWeek: Timezone Handling](https://vibeweek.dev/6-grow/timezone-handling-chat) — adjacent localization
- [LaunchWeek: Vertical SaaS Positioning](https://launchweek.dev/1-position/vertical-saas-positioning) — geography-specific positioning
