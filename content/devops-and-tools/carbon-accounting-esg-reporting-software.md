# Carbon Accounting & ESG Reporting Software: Watershed, Persefoni, Plan A, Sweep, Greenly, Normative, Sustain.Life, EcoVadis, Workiva

[⬅️ DevOps & Tools Overview](../devops-and-tools/)

If you're a B2B SaaS in 2026 — or any company with $50M+ revenue or EU operations — you're being asked about your carbon footprint + ESG data. SEC climate-disclosure rules (March 2024 final rule), EU CSRD (Corporate Sustainability Reporting Directive — applying to ~50K EU-active companies by 2026), California SB 253 + 261 (large companies in CA), and customer / investor pressure all converge on: measure your emissions, report sustainability data, build credible ESG narrative. Carbon accounting + ESG reporting software helps you do this without hiring a 20-person sustainability team.

The category split: **enterprise carbon accounting** (Watershed / Persefoni — top-tier; mid-market+ public-company-track), **mid-market ESG** (Plan A / Sweep / Greenly / Normative — accessible pricing), **SMB-friendly** (Sustain.Life / Climatiq / SINAI), **supplier ratings** (EcoVadis — third-party assessment, not your tracking), and **enterprise ESG reporting platforms** (Workiva ESG / IBM Envizi — for public-company disclosure tooling).

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| **Enterprise Carbon Accounting** | | | | | |
| Watershed | Enterprise carbon platform | Demo | $$$$ ($75K-500K+/yr) | Low | Public companies; pre-IPO; sophisticated tech |
| Persefoni | Enterprise carbon (TCFD-aligned) | Demo | $$$$ | Low | Financial services; regulated industries |
| Plan A | Carbon + ESG (EU origin) | Custom | $$$$ | Medium | EU mid-market+; CSRD reporting |
| Sweep | Carbon + supplier engagement | Custom | $$$$ | Medium | Supplier-heavy emissions Scope 3 |
| **Mid-Market** | | | | | |
| Greenly | Modern mid-market | Trial | $$$ | High | SMB to mid-market |
| Normative | Science-based reductions focus | Custom | $$$ | Medium | Climate-action-driven companies |
| Sustain.Life | Mid-market ESG | Trial | $$ | High | Mid-market accessible |
| Climatiq | API-first carbon math | Free / paid | $0 / $$+ | Very high | Devs embedding carbon calc |
| **Supplier / Third-Party Ratings** | | | | | |
| EcoVadis | Supplier sustainability ratings | Free profile | $$$ for full assessment | Low | Companies needing supplier ratings |
| Sphera Supplier Sustainability | Supplier risk assessment | Custom | $$$$ | Low | Enterprise supply chain |
| **Enterprise ESG Reporting Platform** | | | | | |
| Workiva ESG | Public-company reporting + ESG | Custom | $$$$$ | Very low | Public companies; financial reporting integrated |
| IBM Envizi (acquired Envizi) | Enterprise ESG analytics | Custom | $$$$$ | Very low | Large enterprise |
| Microsoft Sustainability Manager | M365-bundled ESG | Bundled | Bundled w/ M365 ESG | Medium | Microsoft-aligned |
| Salesforce Net Zero Cloud | Salesforce-bundled | Custom | $$$ | Medium | Salesforce shops |
| **Carbon Removal / Offset Markets** | | | | | |
| Patch | Carbon removal API | Custom | Per ton | High | Devs embedding carbon offset purchase |
| Pachama | Forest carbon removal | Custom | Per ton | Medium | Companies buying nature-based offsets |
| Climeworks / Charm Industrial | Direct air capture | Custom | $$$$ per ton | Low | Premium voluntary offset buyers |
| **Specialty / Adjacent** | | | | | |
| 1ESG / SINAI | SMB-friendly | Trial | $$ | Medium | SMB accessible |
| Cventious | Custom emissions calc | Custom | Custom | Medium | Niche use cases |
| Cloud Carbon Footprint | OSS cloud emissions | Free + OSS | Free | Very high | Engineering teams measuring cloud carbon |
| Green Software Foundation | OSS standards | Free | Free | Very high | Devs adopting carbon-aware computing |

The first decision is **what regulation drives this**:

- **SEC climate disclosure (US public companies + large private)**: Watershed / Persefoni / Workiva ESG
- **EU CSRD**: Plan A / Sweep / Greenly (EU-native)
- **California SB 253/261**: Watershed / Persefoni
- **Customer / RFP pressure**: any tool with audit-ready output
- **Voluntary commitment**: lighter mid-market tools

## Decide What You Need First

### Pre-revenue / SMB

You're not regulated; no customer pressure. Skip carbon accounting tools. If asked, calculate manually via Climatiq API or Cloud Carbon Footprint.

### Mid-market ($50M+ ARR) with EU customers

CSRD applies. **Plan A or Sweep** for EU-aware reporting. If you have meaningful Scope 3 (supplier emissions), Sweep specializes there.

### US Public Company / Pre-IPO

SEC climate disclosure rule applies. **Watershed or Persefoni** for audit-ready reporting. **Workiva ESG** for integrated financial + ESG reporting.

### EU Public Company

CSRD + ESRS standards. **Plan A** is purpose-built for European reporting. Persefoni is also strong.

### B2B SaaS Selling to Sustainability-Sensitive Customers

Customers ask about your carbon footprint in RFPs. **Greenly / Sustain.Life** at mid-market; **Watershed** at enterprise.

### Engineering / DevOps Team Measuring Cloud Carbon

Specifically cloud emissions (AWS / GCP / Azure compute footprint).

**Pick: Cloud Carbon Footprint (OSS)** or **Climatiq API** for programmatic.

### Companies Buying Carbon Offsets

After measuring, some companies offset emissions.

**Pick: Patch (API)** or **Pachama (nature-based)** or specialized direct-air-capture providers (Climeworks).

## Provider Deep-Dives

### Watershed

The dominant enterprise carbon accounting platform. Founded 2019. Used by Stripe, Square, Airbnb, Spotify, Walmart.

Strengths:

- **Most comprehensive** — Scope 1, 2, 3 emissions calculation
- Audit-quality data (used in public-company filings)
- Strong supplier engagement features (Scope 3 supplier outreach)
- Compliance with CDP, SBTi, GHG Protocol, TCFD, CSRD
- Integration with ERP / financial systems for spend-based emissions
- Sustainability strategy + reduction planning
- Strong customer success + advisory team

Weaknesses:

- Enterprise pricing ($75K-500K+/yr)
- Sales-led; multi-month implementation
- Overkill for sub-mid-market

Use Watershed when:

- Public company / pre-IPO
- Large mid-market ($100M+ revenue)
- Sustainability is a strategic priority

### Persefoni

Enterprise carbon platform with TCFD alignment. Founded 2020.

Strengths:

- **TCFD + climate-financial integration** strong
- Strong for financial services / regulated industries
- Audit-friendly outputs
- Pre-IPO public-company readiness

Weaknesses:

- Similar enterprise pricing
- Smaller customer base than Watershed

Use Persefoni when:

- Financial services / regulated industry
- TCFD reporting is core
- Pre-IPO public company

### Plan A

EU-native ESG + carbon. Founded 2017.

Strengths:

- **CSRD + ESRS compliance** — built for European disclosure
- EU regulatory expertise
- Mid-market accessibility

Weaknesses:

- Less US footprint
- Smaller than Watershed

Use Plan A when:

- EU operations + CSRD reporting
- Mid-market European company

### Sweep

Carbon + supplier engagement. Founded 2020.

Strengths:

- **Strong Scope 3 supplier engagement** — gets data from suppliers via shared platform
- EU-aligned
- Modern UX

Weaknesses:

- Mid-market pricing
- Best where supplier engagement is core

Use Sweep when:

- Scope 3 supplier emissions are major footprint
- Need supplier engagement workflow

### Greenly

Modern mid-market. Founded 2019. Strong in EU.

Strengths:

- **Mid-market accessible** ($$$ tier)
- Modern UX
- Decent for SMB-mid-market in EU

Weaknesses:

- Smaller than enterprise tools
- US footprint developing

Use Greenly when:

- EU SMB / mid-market
- Cost-conscious

### Sustain.Life

US-friendly mid-market.

Strengths:

- **Accessible pricing** for mid-market
- Audit-ready outputs
- Decent feature breadth

Use Sustain.Life when:

- Mid-market US / international
- Avoiding enterprise pricing

### Climatiq

API-first carbon math. Founded 2021.

Strengths:

- **Developer-friendly API** — embed carbon calculation in your product
- Free tier (limited calls)
- Activity-based emissions calculation
- Used by SaaS embedding sustainability features

Weaknesses:

- Not a full ESG reporting platform
- Math layer; you build the rest

Use Climatiq when:

- You want to embed carbon math in your own product
- Programmatic emissions calculation needed

### EcoVadis

Supplier sustainability ratings. Founded 2007.

Strengths:

- **Industry standard for supplier ratings** (Bronze/Silver/Gold/Platinum)
- Used by 100K+ companies as buyers + sellers
- Third-party verified rating
- Increasingly required by enterprise procurement

Weaknesses:

- Different from carbon accounting (assessment + rating, not measurement)
- Process-heavy questionnaire
- Pay to be assessed

Use EcoVadis when:

- Customers / RFPs demand EcoVadis rating
- B2B selling into Fortune 500 procurement

### Workiva ESG

Enterprise reporting platform combining financial + ESG. Workiva is the public-company filing leader.

Strengths:

- **Integrated with financial reporting** — same platform as 10-K / 10-Q
- Audit-grade
- Strong for SEC climate disclosure

Weaknesses:

- Enterprise pricing ($$$$$)
- Best as part of broader Workiva investment

Use Workiva ESG when:

- Public company already on Workiva for financials

### Microsoft Sustainability Manager / Salesforce Net Zero

Bundled platform offerings.

Use when:

- Already heavy Microsoft / Salesforce
- Want bundled ESG without separate vendor

### Cloud Carbon Footprint (OSS)

Open-source tool for measuring cloud emissions.

Strengths:

- **Free + OSS**
- Specifically for cloud (AWS / GCP / Azure)
- Engineering team self-serve

Weaknesses:

- Cloud-only (not full company emissions)
- Engineering effort to deploy + maintain

Use Cloud Carbon Footprint when:

- Engineering team wants to measure cloud emissions
- OSS preference

### Patch (Carbon Removal API)

API for purchasing carbon removal.

Strengths:

- **API-first** — embed offset purchases in your product
- Multiple removal types (forestry, direct air capture, biochar)
- Good for SaaS offering offsets to customers

Weaknesses:

- Quality varies by removal type
- Some removal claims contested

Use Patch when:

- Embedding carbon offsets into your product
- Offering customer-facing offsets

## Emissions Scopes 101

Standard framework (GHG Protocol):

### Scope 1: Direct Emissions

- Company-owned vehicles
- On-site combustion (heating, generators)
- Manufacturing processes you operate

For most B2B SaaS: Scope 1 is small (no factories or fleets).

### Scope 2: Purchased Energy

- Electricity for offices
- Cloud computing electricity
- Purchased heating / cooling

For B2B SaaS: significant Scope 2 from cloud + offices.

### Scope 3: Value Chain Emissions

- Suppliers' emissions (purchased goods + services)
- Business travel
- Employee commuting
- End-of-life of products
- Investments

For most B2B SaaS: Scope 3 is the LARGEST category. Often 80%+ of footprint. Hardest to measure (need supplier data).

### Calculation Approaches

**Spend-based**: $X spent on category Y × emission factor for Y. Quick but imprecise.

**Activity-based**: actual quantity used × emission factor. More accurate; needs better data.

**Hybrid**: most companies use both.

Software handles the math + emission factor lookups.

## Reporting Standards

### Public Standards

- **GHG Protocol**: foundational; how to measure
- **TCFD (Task Force on Climate-related Financial Disclosures)**: framework; integrated into multiple regulations
- **CDP (Carbon Disclosure Project)**: voluntary disclosure platform; many large companies report annually
- **SBTi (Science Based Targets initiative)**: voluntary science-based reduction targets
- **GRI (Global Reporting Initiative)**: broader sustainability reporting
- **SASB**: industry-specific sustainability standards

### Regulatory Frameworks

- **SEC Climate Disclosure (US, March 2024)**: public companies disclose Scope 1+2 (Scope 3 for some); third-party assurance
- **EU CSRD (effective 2024-2026 phased)**: ~50K companies; ESRS standards; double materiality
- **California SB 253 / 261**: $1B+ revenue companies in CA report Scope 1+2+3
- **UK SECR (Streamlined Energy and Carbon Reporting)**: large companies UK
- **TCFD-aligned (mandatory in UK, NZ, Japan, etc.)**

Most software tools support multiple standards' outputs.

## Common Pitfalls

**Buying enterprise tools at SMB scale.** Watershed at $100K/yr for a $5M ARR company doesn't make sense.

**Skipping Scope 3.** Scope 3 is 80% of footprint for B2B SaaS but hardest to measure. Don't omit; estimate even if approximate.

**Spend-based only.** Quick start but inaccurate. Move toward activity-based for material categories.

**Ignoring supplier data.** Scope 3 requires supplier engagement; some software (Sweep) helps.

**Greenwashing.** Reporting "carbon neutral" via cheap offsets without reduction. Increasingly scrutinized; use offsets as last resort.

**No third-party assurance.** SEC + CSRD increasingly require limited / reasonable assurance from auditors. Plan for assurance from year 1.

**Annual reporting only.** Calculating once a year; no in-cycle visibility. Modern tools do quarterly or monthly.

**Treating ESG separately from financial reporting.** Public companies need integrated reporting. Workiva ESG bridges.

**Forgetting US state laws.** California SB 253/261 + others. Multiple jurisdictions = multiple standards.

**No reduction plan.** Measuring without reducing. Investors + customers want both.

**Buying offsets for unmeasured emissions.** "We bought offsets" without baseline measurement = nothing.

**Compliance creep.** What was voluntary becomes mandatory. Plan for tightening regulations.

**Tool sprawl.** Watershed for emissions; EcoVadis for ratings; CDP for disclosure; manual spreadsheets in between. Coordinate.

**Procurement-driven without strategy.** Customer demands EcoVadis Gold; you scramble to get assessed; treat as checkbox. Build sustainability strategy.

**Ignoring employee + commute emissions.** Scope 3 includes commute + business travel. Often material; often forgotten.

**Cloud emissions ignored.** Heavy SaaS / AI workloads have meaningful cloud carbon. Cloud Carbon Footprint or Climatiq.

**Greenhushing.** Reducing public statements to avoid scrutiny while still doing the work. Trade-off; some companies adopting.

**Carbon offset quality.** Buying cheap forest offsets; later revealed double-counted or non-additional. Verify quality.

**Disclosure timing mismatch.** Annual filing requires data 3 months prior; collection effort underestimated. Plan workflow.

**No baseline year.** Need historical baseline (often 2019 or 2020) for trend reporting. Establish.

## Pragmatic Stack Patterns

### Indie / Sub-$50M Revenue

- Skip dedicated tools
- Spreadsheet for any voluntary measurement
- **Climatiq** API if measuring cloud emissions programmatically
- Total: $0-200/mo

### Mid-Market ($50-500M Revenue) Non-Public

- **Greenly / Sustain.Life / Plan A** ($30-150K/yr)
- EcoVadis assessment if customer-driven ($$$)
- Total: $30-200K/yr

### Public Company / Pre-IPO

- **Watershed or Persefoni** ($75-500K/yr)
- **Workiva ESG** for integrated reporting
- Big-4 audit / assurance
- Total: $200-1M/yr

### Heavy Cloud / Engineering Focus

- **Climatiq** for embedded calculation
- **Cloud Carbon Footprint** OSS for cloud emissions
- Mid-market ESG platform for whole-company reporting
- Total: $0-200K/yr

### B2B SaaS Selling to Sustainability-Conscious Customers

- **Greenly / Sustain.Life** for measurement
- **EcoVadis** assessment for procurement
- Public sustainability page + RFP-ready data
- Total: $30-150K/yr

## Decision Framework: Five Questions

1. **What's your scale + regulation?**
   - Sub-$50M revenue, no regulation: skip tools
   - Mid-market, EU/CSRD: Plan A / Sweep / Greenly
   - Public / pre-IPO: Watershed / Persefoni
   - Already on Workiva: Workiva ESG

2. **What's the primary driver?**
   - SEC climate disclosure: Watershed / Persefoni
   - CSRD: Plan A / Sweep
   - Customer RFPs / EcoVadis: EcoVadis
   - Voluntary: Greenly / Sustain.Life

3. **What's your Scope 3 reality?**
   - Supplier-heavy: Sweep
   - Cloud-heavy: Climatiq + Cloud Carbon Footprint
   - Travel + commute: any tool's Scope 3 module

4. **Do you need integrated financial + ESG?**
   - Yes (public company): Workiva ESG
   - No: standalone ESG tool

5. **Engineering team or business?**
   - Engineering measuring cloud: Climatiq / Cloud Carbon Footprint
   - Business team measuring company-wide: dedicated ESG platform

## Verdict

**Default for sub-$50M / non-regulated**: don't buy ESG software yet.

**Default for EU mid-market**: Plan A or Greenly.

**Default for US mid-market**: Sustain.Life or Greenly.

**Default for public-company-track**: Watershed or Persefoni.

**Default for cloud-emissions specifically**: Climatiq API or Cloud Carbon Footprint.

**Default for supplier ratings (RFP-driven)**: EcoVadis.

The most common mistakes:

1. **Buying enterprise tool too early.** Watershed at $5M ARR is overkill.
2. **Spend-based only without moving to activity-based.** Inaccurate; doesn't satisfy serious assurance.
3. **Skipping Scope 3.** Largest category for SaaS; hardest but mandatory increasingly.
4. **Treating ESG as marketing rather than operations.** Real reductions require operational change.

## See Also

- [Compliance Automation Tools](./compliance-automation-tools.md) — SOC 2 / HIPAA / etc. (different)
- [Healthcare HIPAA-Compliant Stack & Tools](../auth-and-payments/healthcare-hipaa-compliant-stack-tools.md)
- [Vendor Management & SaaS Procurement Platforms](../auth-and-payments/vendor-management-saas-procurement-platforms.md)
- [HR & Payroll Tools](../auth-and-payments/hr-payroll-tools.md)
- [Performance Management Tools](../auth-and-payments/performance-management-tools.md)
- [Internal Tool Builders](./internal-tool-builders.md)
- [Workflow Automation & iPaaS Providers](./workflow-automation-providers.md)
- [BI / Analytics Tools](./bi-analytics-tools.md)
- [Data Pipeline / ETL Platforms](../backend-and-data/data-pipeline-etl-platforms.md)
- [Data Observability Platforms](../backend-and-data/data-observability-platforms.md)
- [Database Providers](../backend-and-data/database-providers.md)
- [Subscription Analytics Platforms](../auth-and-payments/subscription-analytics-platforms.md)
- [Accounting & Bookkeeping Software](../auth-and-payments/accounting-bookkeeping-software.md)
- [Identity Verification & KYC Tools](../auth-and-payments/identity-verification-kyc-tools.md)
- [Cookie Consent & Privacy Tools](../marketing-and-seo/cookie-consent-privacy-tools.md)
- [Cloud Cost Management Tools](../cloud-and-hosting/cloud-cost-management-tools.md)
- [AWS](../cloud-and-hosting/aws.md)
- [Google Cloud](../cloud-and-hosting/google-cloud.md)
- [Azure](../cloud-and-hosting/azure.md)
- [Vercel](../cloud-and-hosting/vercel.md)
- [Trust Center / Security Page (LaunchWeek)](https://launchweek.dev/content/4-convert/trust-center-security-page.md)
- [Customer Marketing Program (LaunchWeek)](https://launchweek.dev/content/4-convert/customer-marketing-program.md)
- [Pre-Launch Revenue (LaunchWeek)](https://launchweek.dev/content/5-launch/pre-launch-revenue.md)
- [Annual Strategy Offsite (LaunchWeek)](https://launchweek.dev/content/1-position/annual-strategy-offsite.md)
- [IPO Readiness & S-1 Preparation (LaunchWeek)](https://launchweek.dev/content/5-launch/ipo-readiness-s1-preparation.md)
- [Investor Monthly Updates (LaunchWeek)](https://launchweek.dev/content/5-launch/investor-monthly-updates.md)
- [Year in Review / Annual Letter (LaunchWeek)](https://launchweek.dev/content/5-launch/year-in-review-annual-letter.md)
