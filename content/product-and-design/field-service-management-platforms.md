# Field Service Management Platforms: ServiceTitan, Jobber, Housecall Pro, FieldEdge, SimPRO, ServiceMax, Workiz, BigChange

[⬅️ Product & Design Overview](../product-and-design/)

If you're building software for service businesses with technicians who go to customer sites — HVAC, plumbing, electrical, pest control, lawn care, cleaning, appliance repair, IT services — Field Service Management (FSM) platforms are the dominant operational system. They handle scheduling + dispatching + technician mobile apps + invoicing + customer communication + inventory + payments. Think of them as the CRM + ERP + scheduling tool combined for trades + services. The category split: **enterprise FSM** (ServiceTitan / FieldEdge / SimPRO — large operators with many technicians), **SMB-friendly** (Jobber / Housecall Pro / Workiz — solo to ~50 technicians), **enterprise asset-management adjacent** (ServiceMax / IFS — equipment-heavy industrial), and **specialty** (BigChange / Skedulo — verticals).

If your software competes with or integrates into this space, you need to understand the landscape. This is also useful if you're a founder evaluating tools for your own services business.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| ServiceTitan | Enterprise FSM (HVAC / plumbing / electrical) | Demo | $$$$ ($300+/user/mo) | Low | Mid-large home-service businesses |
| FieldEdge | Mid-market HVAC / plumbing | Demo | $$$ | Medium | Mid-market home services |
| SimPRO | Trades + projects | Demo | $$$ | Medium | Australia / UK / NZ trades |
| ServiceMax | Industrial / equipment-heavy FSM | Custom | $$$$$ | Very low | Enterprise industrial; medical devices |
| Jobber | SMB FSM (broad services) | Trial | $39-249/mo | Very high | SMB / solo to mid-size |
| Housecall Pro | SMB home services | Trial | $69-279+/mo | Very high | SMB cleaning / lawn / home services |
| Workiz | SMB locksmith / hauling / etc. | Trial | $65-299+/mo | High | Niche SMB services |
| BigChange | UK fleet + FSM | Demo | $$$ | Medium | UK fleet-heavy services |
| Synchroteam | International SMB FSM | Trial | $30-100/user/mo | High | International SMB |
| Skedulo | Enterprise scheduling-first | Custom | $$$ | Medium | Enterprise scheduling complex |
| GoCanvas / Forms On Fire | Mobile data collection | Trial | $$ | Medium | Forms + inspection-heavy services |
| Salesforce Field Service | CRM-bundled FSM | Custom | $$$$ | Low | Salesforce-already shops |
| Microsoft Dynamics 365 Field Service | Microsoft-bundled FSM | Custom | $$$$ | Low | Microsoft-already shops |
| IFS | Enterprise asset + service mgmt | Custom | $$$$$ | Very low | Enterprise industrial / utilities |
| Spreadsheets + Calendly + Stripe | DIY | Free | <$50/mo | Very high | Sub-5-technician shops |

The first decision is **size + vertical**:

- **Solo / small (1-10 technicians)**: Jobber / Housecall Pro
- **Mid-SMB (10-50)**: Jobber Premium / Housecall Pro / Workiz
- **Mid-Market (50-500)**: ServiceTitan / FieldEdge / SimPRO
- **Enterprise (500+)**: ServiceTitan Enterprise / ServiceMax / IFS / Salesforce
- **International**: Synchroteam / SimPRO (AU/UK) / Skedulo

## Decide What You Need First

### Solo Operator (1-3 technicians)

You're the technician + the dispatcher + the bookkeeper. Need: scheduling + invoicing + payments + customer database + simple mobile app.

**Pick: Jobber** ($39/mo entry) or **Housecall Pro** ($69/mo). Both are SMB-friendly with great mobile apps + integrated payments.

### Growing SMB (10-50 technicians)

You have a dispatcher; technicians use mobile app; you need: smart scheduling + route optimization + inventory + estimates + reviews automation.

**Pick: Jobber Connect / Premium** or **Housecall Pro Pro** at higher tiers. **Workiz** if you're in niche services (locksmith, junk hauling).

### Mid-Market (50-500 technicians)

Now you have multiple dispatchers, multiple offices, complex inventory, financial reporting demands.

**Pick: ServiceTitan** for HVAC / plumbing / electrical. **FieldEdge** as alternative at slightly lower price point. **SimPRO** if AU/UK or project-heavy.

### Enterprise (500+ technicians)

Complex multi-location, regulatory requirements, ERP integration.

**Pick: ServiceTitan Enterprise** or **ServiceMax** (equipment-heavy) or **IFS / SAP** (full-stack ERP).

### Salesforce / Microsoft Shops

Already invested in CRM ecosystem.

**Pick: Salesforce Field Service** or **Dynamics 365 Field Service**. Worse standalone but tight integration.

### Niche Verticals

Specific services with unique needs.

**Pick: Workiz** (locksmith/hauling), **Skedulo** (complex scheduling), **GoCanvas** (forms-heavy inspection).

## Provider Deep-Dives

### ServiceTitan

The dominant enterprise FSM for HVAC / plumbing / electrical / pest control. Founded 2007. IPO'd 2024. Public company.

Strengths:

- **Industry-leading for home services** (HVAC + plumbing + electrical)
- Deep workflow specialization (commission tracking, dispatching algorithms, capacity planning)
- Strong reporting + business intelligence
- Mobile app powerful + reliable
- Marketing automation (review requests, customer outreach)
- ServicePartners ecosystem (20+ integrations)
- Strong customer success + training

Weaknesses:

- **Expensive** — $300+/technician/month effective; minimum commits
- Sales-led; multi-month implementation
- Overkill for sub-30-technician shops
- US-focused; less common internationally
- Fixed-cost commit means seasonal businesses pay even in off-season

Use ServiceTitan when:

- 50+ technicians; HVAC / plumbing / electrical / pest control
- Budget supports $300+/tech/mo
- Implementation budget for 3-6 month onboarding

### FieldEdge

Mid-market home services FSM. Acquired by ESO Solutions 2022.

Strengths:

- **Mid-market alternative to ServiceTitan**
- Lower price point
- Solid feature set for HVAC / plumbing
- QuickBooks integration strong

Weaknesses:

- Smaller ecosystem than ServiceTitan
- US-focused
- Less aggressive product velocity post-acquisition

Use FieldEdge when:

- 30-150 technicians
- ServiceTitan price too high
- Need solid HVAC/plumbing FSM

### SimPRO

Trades + projects FSM. Founded 2002 (Australia). Strong AU/UK/NZ presence.

Strengths:

- **Strong for project-based services** (electrical contracting, plumbing with multi-week jobs)
- Project management bundled with FSM
- Good for trades that mix service calls + project work
- AU/UK market leader

Weaknesses:

- Less polished than ServiceTitan in pure FSM
- US presence smaller

Use SimPRO when:

- Australian / UK / NZ trades business
- Project work mixed with service calls

### ServiceMax

Enterprise industrial / equipment-heavy FSM. Acquired by PTC 2018; spun out as standalone 2023.

Strengths:

- **Best for equipment-heavy industries** (medical devices, industrial, utilities)
- Asset management + service combined
- Complex parts inventory + serialization
- Salesforce-native option

Weaknesses:

- Enterprise pricing
- Heavy implementation
- Industrial focus (not for home services)

Use ServiceMax when:

- Industrial equipment service
- Medical device service
- Asset-heavy enterprise

### Jobber

The SMB / mid-market sweet-spot FSM. Founded 2011. Canadian.

Strengths:

- **Best SMB UX** in the category
- Pricing $39-249/mo accessible
- Broad service coverage (lawn care, cleaning, HVAC, plumbing, etc.)
- Mobile app excellent
- Integrated payments (Jobber Payments)
- Self-serve onboarding (no sales call required)
- Strong customer reviews + retention

Weaknesses:

- Caps out around 50-100 technicians (becomes harder to manage)
- Less specialized than ServiceTitan for HVAC-specific workflows
- Some advanced workflows (commission structures, complex dispatching) less mature

Use Jobber when:

- SMB / SME services business (1-50 technicians typical)
- Modern UX matters
- Self-serve preferred over sales-led

### Housecall Pro

SMB home services FSM. Founded 2013.

Strengths:

- **Strong consumer-friendly UX** for home services (lawn, cleaning, plumbing)
- "Conquer" community + business coaching
- Integrated marketing (review requests, customer follow-up)
- Mobile app competitive with Jobber
- Pricing comparable to Jobber

Weaknesses:

- Smaller geo footprint (US-focused)
- Enterprise tier less mature than ServiceTitan
- Some dispatching limits for complex multi-tech ops

Use Housecall Pro when:

- SMB home services
- US-focused
- Want bundled marketing + business coaching

### Workiz

Niche SMB services. Founded 2015. Targets locksmith / junk hauling / appliance repair / similar.

Strengths:

- **Niche focus** wins in those verticals
- Affordable pricing
- Solid mobile + dispatch
- AI-powered features (auto-quoting, smart dispatch)

Weaknesses:

- Smaller ecosystem
- Less mature for HVAC / plumbing than dedicated tools

Use Workiz when:

- Locksmith / hauling / appliance repair / similar niche
- Cost-conscious SMB

### Salesforce Field Service / Dynamics 365 Field Service

CRM-bundled FSM.

Strengths:

- **Tight CRM integration** if already on Salesforce / Microsoft
- Enterprise-grade
- Customizable

Weaknesses:

- Standalone FSM less mature than dedicated tools
- Implementation complex
- Sales-led pricing

Use when:

- Already heavy Salesforce / Microsoft shops
- Field service is one workflow among many on the platform

### IFS / SAP / Oracle Field Service

Enterprise full-stack ERP + FSM.

Use when:

- Mega-enterprise
- ERP-led decisions
- Industrial / utilities scale

### DIY: Spreadsheets + Calendly + Stripe + QuickBooks

For the smallest operators (sub-5 technicians).

Strengths:

- Cheap (<$50/mo total)
- Familiar
- No new tool to learn

Weaknesses:

- Doesn't scale past 5-10 calls/day
- Manual dispatch + scheduling
- No mobile-native technician experience
- No integrated route optimization

Use DIY when:

- Sub-5 technicians
- <20 calls/day
- Cost is critical

## What FSM Platforms Won't Do

**Don't expect cookie-cutter to fit every vertical.** HVAC dispatching is different from cleaning scheduling is different from medical device service. Match tool to vertical.

**Don't expect implementation to be quick at enterprise scale.** ServiceTitan / ServiceMax implementations take 3-12 months for large operators. Plan accordingly.

**Don't expect customers to embrace tech-driven scheduling.** Some customers prefer phone calls. FSM tools provide automation; not all customers want it.

**Don't expect enterprise FSM to feel like consumer SaaS.** UX is dated; pricing is enterprise-tier; sales cycles are long.

**Don't expect mobile apps to work in low-connectivity areas.** Field technicians often have poor signal. Tool needs offline capability.

**Don't expect AI features to be transformative yet.** AI-powered dispatching, auto-quoting are nascent in 2026; useful but not magic.

**Don't expect data portability.** Migrating from one FSM to another is painful. Customer data, technician history, scheduling history all hard to move.

## Pragmatic Stack Patterns

### Solo Operator (1-3 technicians)

- **Jobber** or **Housecall Pro** ($39-149/mo)
- QuickBooks Online for accounting (integrated with both)
- Stripe for payment processing (often bundled)
- Total: $50-200/mo

### Growing SMB (5-30 technicians)

- **Jobber Premium** or **Housecall Pro** higher tier ($249-329/mo)
- QuickBooks Online integration
- Marketing tools (review requests included)
- Total: $300-1K/mo

### Mid-Market (30-150 technicians)

- **ServiceTitan** or **FieldEdge** ($30-150K+/yr)
- Integrated with QuickBooks / Sage Intacct
- Custom integrations (CRM, marketing automation)
- Dedicated CSM
- Total: $5-15K/mo

### Enterprise (500+ technicians)

- **ServiceTitan Enterprise** or **ServiceMax** or industry-specific
- ERP integration (NetSuite / SAP)
- Multiple offices / regions
- Custom development for unique workflows
- Total: $50K-500K+/yr

### Industrial Equipment Service

- **ServiceMax** or **IFS**
- IoT integration (predictive maintenance)
- Asset lifecycle management
- Total: enterprise-tier

## Decision Framework: Five Questions

1. **What's your size?**
   - 1-10 technicians: Jobber / Housecall Pro / DIY
   - 10-50: Jobber Premium / Housecall Pro / Workiz
   - 50-500: ServiceTitan / FieldEdge / SimPRO
   - 500+: ServiceTitan Enterprise / ServiceMax / IFS

2. **What's your vertical?**
   - HVAC / plumbing / electrical: ServiceTitan / FieldEdge
   - Lawn / cleaning / pest: Jobber / Housecall Pro
   - Locksmith / hauling: Workiz
   - Industrial: ServiceMax / IFS
   - Salesforce shop: Salesforce Field Service

3. **Geography?**
   - US: most platforms
   - AU/UK/NZ: SimPRO
   - International: Synchroteam / SimPRO
   - Multi-region: enterprise platforms

4. **Already on Salesforce / Microsoft?**
   - Yes + heavy: Salesforce Field Service / Dynamics
   - No: dedicated FSM

5. **Project-based or service-call?**
   - Service calls: Jobber / Housecall Pro / ServiceTitan
   - Mixed projects + service: SimPRO
   - Pure projects: project management tool + light FSM

## Verdict

**Default for SMB**: Jobber. Best UX; affordable; broad coverage.

**Alternative SMB**: Housecall Pro for home services. Workiz for niche services.

**Default for mid-market HVAC/plumbing**: ServiceTitan. Industry standard.

**Default for international**: Synchroteam (broad) or SimPRO (AU/UK).

**Default for industrial equipment**: ServiceMax.

**Default for Salesforce/Microsoft shops**: bundled platform.

**Default for solo / sub-5 technicians**: DIY (spreadsheets + Calendly + Stripe).

The most common mistakes:

1. **Buying ServiceTitan at 5-technician scale.** $300+/tech/mo for 5 = $1.5K/mo + implementation. Jobber at $249/mo total covers it.
2. **Picking based on price alone for enterprise.** Cheaper FSM with mediocre dispatching costs more in tech idle time than the platform fee.
3. **Skipping integration with QuickBooks.** Manual data entry kills the productivity gains. Always check accounting integration.
4. **Not testing mobile UX with technicians.** Tool that's loved by office is hated in the field. Test with actual technicians before commit.

## See Also

- [Inventory & Order Management Systems](../backend-and-data/inventory-order-management-systems.md) — adjacent for inventory-heavy services
- [Scheduling & Booking APIs](../backend-and-data/scheduling-booking-apis.md)
- [Maps & Geocoding APIs](../backend-and-data/maps-geocoding-apis.md) — for routing
- [SMS / Voice APIs](../backend-and-data/sms-voice-apis.md) — for customer notifications
- [Notification Providers](../backend-and-data/notification-providers.md)
- [Email Marketing Providers](../marketing-and-seo/email-marketing-providers.md)
- [CRM Providers](../marketing-and-seo/crm-providers.md)
- [HubSpot](../marketing-and-seo/hubspot.md)
- [Stripe](../auth-and-payments/stripe.md)
- [Payment Providers](../auth-and-payments/payment-providers.md)
- [Subscription Billing Providers](../auth-and-payments/subscription-billing-providers.md)
- [Subscription Analytics Platforms](../auth-and-payments/subscription-analytics-platforms.md)
- [Tax Compliance Tools](../auth-and-payments/tax-compliance-tools.md)
- [Identity Verification & KYC Tools](../auth-and-payments/identity-verification-kyc-tools.md)
- [HR & Payroll Tools](../auth-and-payments/hr-payroll-tools.md)
- [eSignature & Document Signing Tools](../auth-and-payments/esignature-document-signing-tools.md)
- [PDF Document Generation Tools](../backend-and-data/pdf-document-generation-tools.md)
- [Customer Support Tools](./customer-support-tools.md)
- [Live Chat Widget Tools](./live-chat-widget-tools.md)
- [Customer Success Platforms](./customer-success-platforms.md)
- [AI Voice & Phone Agent Platforms](../ai-development/ai-voice-phone-agent-platforms.md)
- [Conversation Intelligence & Meeting Recording Platforms](../marketing-and-seo/conversation-intelligence-meeting-recording-platforms.md)
- [IT Service Management (ITSM) Platforms](../devops-and-tools/it-service-management-itsm-platforms.md)
- [Workflow Automation & iPaaS Providers](../devops-and-tools/workflow-automation-providers.md)
- [Project Management Tools](../devops-and-tools/project-management-tools.md)
- [Time Tracking / Timesheet Tools](../devops-and-tools/time-tracking-timesheet-tools.md)
- [Spreadsheet / Database Tools](../devops-and-tools/spreadsheet-database-tools.md)
- [Mobile App Frameworks](../frontend/mobile-app-frameworks.md)
- [App Distribution & Beta Testing Platforms](../devops-and-tools/app-distribution-beta-testing-platforms.md)
- [All-in-One E-commerce Platforms](../frontend/ecommerce-platforms-all-in-one.md)
- [Shipping & Fulfillment APIs](../backend-and-data/shipping-fulfillment-apis.md)
- [Healthcare HIPAA-Compliant Stack & Tools](../auth-and-payments/healthcare-hipaa-compliant-stack-tools.md)
- [Internal Tool Builders](../devops-and-tools/internal-tool-builders.md) — Retool / Tooljet for custom dispatcher dashboards
