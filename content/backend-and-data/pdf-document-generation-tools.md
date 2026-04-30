# PDF & Document Generation Tools: Puppeteer, Playwright, react-pdf, DocRaptor, Documenso, PDFMonkey, Carbone, Gotenberg

[⬅️ Backend & Data Overview](../backend-and-data/)

If you're building a SaaS in 2026 and need to generate PDFs (invoices, contracts, reports, certificates, exports), this is the consolidated comparison. PDF generation is the line item founders skip until a customer asks "can I get a PDF invoice?" or compliance asks "can you export this audit report as a signed document?" — then scramble to spin up Puppeteer in a serverless function and discover at scale it costs $200/mo per 100K pages and crashes randomly. Most indie SaaS over-engineer with custom Puppeteer setups when a managed API at $30/mo would have served them through 100K documents/year.

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Starter Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| Puppeteer (DIY) | Headless Chrome library | Free | Hosting cost | High | Devs who want full control |
| Playwright (DIY) | Headless browser library | Free | Hosting cost | High | Modern Puppeteer alternative |
| react-pdf | React → PDF in JS | Free | Hosting cost | Very high | React apps with simple PDFs |
| DocRaptor | HTML-to-PDF API | Free trial | $15/mo (125 docs) | High | Print-quality PDFs |
| PDFMonkey | Template-based PDF API | Free (300/mo) | $19/mo | Very high | Indie SaaS template-driven |
| Carbone | Templates → PDF/Word/Excel | Free | $9/mo | High | Multi-format from templates |
| Gotenberg | Self-hosted Docker | Free OSS | Hosting | High | OSS / self-host preference |
| Documenso | OSS DocuSign alternative | Free OSS | $15/mo+ Cloud | Very high | E-signature workflow |
| DocuSeal | OSS e-sign | Free OSS | $9/mo | High | E-signature alternative |
| DocuSign | Enterprise e-signature | 30-day trial | $10/user/mo | Low | Enterprise compliance |
| HelloSign / Dropbox Sign | E-signature | Free (3/mo) | $20/user/mo | Medium | Mid-market e-sign |
| Vercel Functions + Puppeteer | Serverless DIY | Bundled | Function cost | Very high | Vercel apps; small scale |
| Stripe Invoice PDFs | Bundled with Stripe | Free | Bundled | Very high | Invoices specifically |
| react-email + render-to-PDF | React Email components | Free | Hosting | Very high | Transactional emails as PDFs |

The first decision is **what shape of PDF problem you have**. HTML-to-PDF rendering (Puppeteer / DocRaptor / Gotenberg), template-driven PDFs (PDFMonkey / Carbone), e-signature workflows (DocuSign / Documenso / DocuSeal), and bundled-with-product PDFs (Stripe invoices) are four different problems with overlapping tools.

## Decide What You Need First

PDF tools are not interchangeable. Pick by use case.

### HTML-to-PDF rendering (the 50% case for indie SaaS)
You have HTML you want as PDF — receipts, reports, invoices. Layout in HTML/CSS; convert.

Right tools:
- **Puppeteer** (DIY) — most common
- **Playwright** (DIY) — modern alternative
- **DocRaptor** — managed API
- **Gotenberg** — self-hosted Docker
- **Vercel Functions + Puppeteer** — serverless

### Template-driven PDFs (the 30% case)
You have structured data (invoice line items, contract fields). You want consistent layout. Marketing / business teams should edit templates.

Right tools:
- **PDFMonkey** — modern template UI
- **Carbone** — multi-format (PDF / Word / Excel)
- **react-pdf** — code-defined templates
- **DocRaptor** — Prince-XML-based with templates

### E-signature workflows (the 15% case)
You need legally-binding signatures: contracts, NDAs, agreements. Different problem from PDF generation.

Right tools:
- **Documenso** — OSS modern alternative
- **DocuSeal** — OSS alternative
- **DocuSign** — enterprise default
- **HelloSign / Dropbox Sign** — mid-market

### Bundled (the 5% case)
The PDF is a side-effect of another product (Stripe invoice; Calendly confirmation; etc.).

Right tools:
- **Stripe** — invoice PDFs auto-generated
- **Mailgun / Postmark** — email-as-PDF features (rare)

For most indie SaaS in 2026: **Puppeteer / Vercel Functions for simple HTML-to-PDF; PDFMonkey for templates; Documenso for e-sign**. Skip DocuSign until enterprise.

## Provider Deep-Dives

### Puppeteer / Playwright (DIY) — The Default Path
Puppeteer (Chrome) and Playwright (Chrome / Firefox / Safari) are headless browser libraries. Render HTML; print-to-PDF.

Strengths:
- Free (open-source)
- Full control
- Works for any HTML/CSS layout
- Mature ecosystem (Puppeteer years; Playwright newer + cleaner API)
- Modern Playwright has better DX

Weaknesses:
- Heavy (Chrome binary ~100MB)
- Slow cold starts in serverless
- Memory-intensive (rendering 50-page PDF can use 500MB+)
- Must handle errors / timeouts / fonts / images
- Linux dependencies for headless Chrome

**Vercel Functions + Puppeteer pattern**:

```typescript
// app/api/generate-pdf/route.ts
import puppeteer from '@sparticuz/chromium-min';

export async function POST(req: Request) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
  const page = await browser.newPage();
  await page.setContent(html);
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();
  return new Response(pdf, {
    headers: { 'Content-Type': 'application/pdf' },
  });
}
```

Use `@sparticuz/chromium` for serverless-compatible Chrome.

Pick when: you''re technical; want full control; OK with operational complexity.

### react-pdf — React Components → PDF
react-pdf renders React components directly to PDF using its own renderer (no Chrome).

Strengths:
- Pure JS (no Chrome needed)
- Lightweight
- React component model
- Free
- Fast

Weaknesses:
- Limited CSS support (subset)
- Custom layout primitives (`<View>`, `<Text>`) — not HTML
- Smaller community than Puppeteer

```typescript
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

const Invoice = ({ data }) => (
  <Document>
    <Page>
      <View>
        <Text>Invoice #{data.id}</Text>
      </View>
    </Page>
  </Document>
);

const buffer = await pdf(<Invoice data={...} />).toBuffer();
```

Pick when: React app; PDFs have predictable structure; want minimal infrastructure.

### DocRaptor — Print-Quality Managed API
DocRaptor uses Prince XML under the hood — the gold standard for HTML-to-PDF print quality.

Strengths:
- Best-in-class print quality
- Page numbers / footers / margins handled correctly
- $15/mo Starter (125 docs); usage-based above
- Managed (no Chrome to operate)
- Strong support for complex layouts

Weaknesses:
- Pricing climbs at volume
- Per-document cost
- API-only (no embed)

Pick when: print-quality matters (legal docs; reports for clients); willing to pay for managed.

### PDFMonkey — Template-Based Indie API
PDFMonkey lets you design PDF templates in their editor; call API with data; get PDF.

Strengths:
- Template editor for non-engineers
- $19/mo Starter
- Free tier (300 PDFs/mo)
- API-first
- Indie-friendly

Weaknesses:
- Custom template language (mild learning curve)
- Less flexible for complex layouts
- Smaller community

Pick when: marketing/business team needs to edit templates; indie pricing matters.

### Carbone — Multi-Format Template Engine
Carbone uses Word/PowerPoint/Excel files as templates. Output: PDF, Word, Excel, etc.

Strengths:
- Multi-format output
- Word-as-template (familiar editor)
- Free + $9/mo paid
- Self-host option

Weaknesses:
- Word-as-template has quirks
- API less polished than PDFMonkey

Pick when: customers want PDFs AND editable Word/Excel; existing Word templates.

### Gotenberg — Self-Hosted Docker
Gotenberg is a self-hostable Docker service that wraps Chrome / LibreOffice for PDF conversion.

Strengths:
- Self-host (control + privacy)
- Free / OSS
- Multi-format input (HTML, Office, Markdown)
- API
- Active community

Weaknesses:
- Self-host operational burden
- Docker / Kubernetes context

Pick when: privacy / data-residency mandate; willing to operate Docker; OSS preference.

### Documenso — OSS DocuSign Alternative
Documenso is the open-source DocuSign alternative. Modern; e-signature focus.

Strengths:
- Open-source
- Self-host or Cloud
- Modern UI
- $15/mo Cloud (after free tier)
- Documenso Public Key for legal evidence

Weaknesses:
- Newer (less battle-tested in court vs DocuSign)
- Smaller community
- Operational burden if self-hosting

Pick when: e-signature needed; OSS preference; not Fortune 500 with DocuSign mandate.

### DocuSeal — OSS Alternative
DocuSeal is similar to Documenso. Self-hostable; cloud option.

Strengths:
- Open-source
- $9/mo Cloud
- Document templates
- Active development

Weaknesses:
- Smaller community than Documenso
- Less mature

Pick when: OSS e-signature; pick on UX preference vs Documenso.

### DocuSign — Enterprise Default
DocuSign is the long-standing enterprise e-signature platform.

Strengths:
- Industry standard
- Strong legal evidence trail
- Enterprise compliance
- Extensive integrations
- Court-recognized in most jurisdictions

Weaknesses:
- $10-40/user/mo Standard
- Heavy product surface
- Required by many enterprise procurement processes

Pick when: enterprise deals require it; budget supports.

### HelloSign / Dropbox Sign — Mid-Market E-Sign
HelloSign (acquired by Dropbox; renamed Dropbox Sign) is mid-market e-signature.

Strengths:
- Cleaner UX than DocuSign
- $20/user/mo Standard
- API-friendly
- Free tier (3 docs/mo)

Weaknesses:
- Less brand recognition than DocuSign
- Pricing similar

Pick when: mid-market; want cleaner UX than DocuSign.

### Stripe Invoice PDFs — Bundled
If you''re on Stripe (per [stripe](../auth-and-payments/stripe.md)), invoice PDFs come free.

Strengths:
- Auto-generated
- Hosted invoice page included
- Compliant formatting
- $0 incremental cost

Weaknesses:
- Stripe invoices only (not custom PDFs)
- Limited customization
- Stripe branding visible

Pick when: invoices specifically; already on Stripe.

### react-email — Email Templates as Documents
React Email lets you build emails in React; can also render to PDF.

Strengths:
- React component model
- Bundled with your existing email infrastructure
- Modern DX

Weaknesses:
- Email-first design (paginated PDFs less natural)
- Limited PDF features

Pick when: transactional emails that also need PDF (receipts, confirmations).

## What PDF Tools Won''t Do

- **Replace e-signature legality.** A signed PDF on its own isn''t legally binding without proper trail (timestamp; identity verification; intent). E-signature platforms add this.
- **Make bad templates good.** Output quality reflects template quality. Invest in design.
- **Be free at scale.** Per-document pricing climbs; self-host requires operations.
- **Replace document storage.** Generate PDFs; store separately (S3 / R2 / etc. — per [file-storage-providers](../cloud-and-hosting/file-storage-providers.md)).
- **Replace your email send.** Generated PDFs need delivery (per [email-providers](email-providers.md)).
- **Handle PDF parsing / extraction.** That''s a different category (Tabula / pdf-parse / Adobe PDF Services).

## Pragmatic Stack Patterns

**Indie SaaS, simple PDFs (invoices / receipts)**:
- Stripe invoice PDFs (if on Stripe) for invoices
- Vercel Functions + Puppeteer for custom PDFs
- Total: ~$0 (Stripe bundled; Vercel function cost)

**SaaS with template-heavy PDFs (reports, certificates)**:
- PDFMonkey or Carbone
- Total: $19-50/mo

**Print-quality / legal documents**:
- DocRaptor
- Total: $15-100/mo

**E-signature workflow**:
- Documenso (OSS) or DocuSeal
- Plus separate PDF generation if needed
- Total: $9-50/mo

**Enterprise e-signature**:
- DocuSign or HelloSign
- Plus DIY PDF generation
- Total: $20-50/user/mo + dev cost

**OSS / self-host preference**:
- Gotenberg (PDF) + Documenso (e-sign)
- Total: hosting cost only

**React-heavy app**:
- react-pdf for simple
- Puppeteer for complex
- Total: hosting cost

## Decision Framework: Three Questions

1. **What''s the use case?** → Invoice: Stripe / DIY. Reports: PDFMonkey / Puppeteer. Contracts: Documenso / DocuSign. Print: DocRaptor.
2. **Who edits templates?** → Devs: react-pdf / Puppeteer. Marketing/business: PDFMonkey / Carbone.
3. **What''s your scale?** → <100 docs/mo: anything. 100-10K: managed API. 10K+: self-host or DIY.

Three questions, three picks. The 90% answer for indie SaaS in 2026 is **Vercel Functions + Puppeteer for custom PDFs; PDFMonkey if business team needs templates; Documenso for e-signature**. Skip DocuSign until enterprise.

## Verdict

For most readers building a SaaS in 2026:
- **Default for custom PDFs**: Puppeteer (DIY) or Vercel Functions + Puppeteer.
- **React-heavy**: react-pdf for simple cases.
- **Template-driven (business team edits)**: PDFMonkey or Carbone.
- **Print quality**: DocRaptor.
- **Self-host preference**: Gotenberg.
- **E-signature OSS**: Documenso or DocuSeal.
- **E-signature enterprise**: DocuSign or HelloSign.
- **Invoices on Stripe**: Stripe-bundled.
- **High volume / cost-sensitive**: Self-host Gotenberg.

The hidden cost in PDF tools isn''t the API fee — it''s **font / image / layout debugging.** Customer-facing PDFs that look broken (font missing; image clipped; page-break wrong) feel unprofessional and erode trust. A managed API like DocRaptor or PDFMonkey handles 90% of edge cases; DIY Puppeteer hits all of them eventually. For business-critical PDFs (invoices, contracts), pay the managed-service fee unless you have engineering bandwidth to debug PDFs at 11pm.

## See Also

- [Email Providers](email-providers.md) — PDF delivery via email
- [File Storage Providers](../cloud-and-hosting/file-storage-providers.md) — store generated PDFs
- [Stripe](../auth-and-payments/stripe.md) — invoice PDFs bundled
- [Subscription Billing Providers](../auth-and-payments/subscription-billing-providers.md) — billing-related PDFs
- [API](api.md) — APIs that return PDFs
- [Vercel Functions](../cloud-and-hosting/vercel-functions.md) — serverless PDF gen
- [Background Jobs Providers](background-jobs-providers.md) — async PDF generation
- [Customer Support Tools](../product-and-design/customer-support-tools.md) — PDF attachments
- [VibeWeek: Tax & VAT Handling](https://www.vibeweek.com/6-grow/tax-vat-handling-chat) — invoice PDF compliance
- [VibeWeek: Account Deletion & Data Export](https://www.vibeweek.com/6-grow/account-deletion-data-export-chat) — export-as-PDF
- [VibeWeek: Bulk Operations](https://www.vibeweek.com/6-grow/bulk-operations-chat) — batch PDF generation
- [LaunchWeek: Trust Center & Security Page](https://www.launchweek.com/4-convert/trust-center-security-page) — DPA / contract PDFs
- [LaunchWeek: Annual Contract Negotiation](https://www.launchweek.com/4-convert/annual-contract-negotiation) — contract PDFs

---

[⬅️ Backend & Data Overview](../backend-and-data/)
