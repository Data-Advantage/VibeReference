# Document Parsing & OCR Services: AWS Textract, Google Document AI, Azure Form Recognizer, Unstructured, Mathpix, Reducto, LlamaParse

[⬅️ Backend & Data Overview](../backend-and-data/)

If you're building a B2B SaaS in 2026 that handles PDFs, scanned documents, invoices, contracts, receipts, or general unstructured content — for RAG, document understanding, expense management, contract analysis, or invoice processing — you need OCR + document parsing. The naive approach: pdf-parse npm package + regex. The structured approach: pick a service that handles tables / forms / layouts / handwriting / multi-language / complex PDFs and outputs structured data. The right pick depends on whether you need cloud-hosted-managed (AWS Textract / Google Document AI / Azure Form Recognizer) vs developer-friendly (Unstructured / Reducto / LlamaParse) vs specialized (Mathpix for math, Klippa for receipts).

## TL;DR Decision Matrix

| Provider | Type | Free Tier | Pricing | Indie Vibe | Best For |
|---|---|---|---|---|---|
| AWS Textract | Cloud OCR + forms | 1K pages/mo free | $1.50-50/1K pages | Medium | AWS-native; broad |
| Google Document AI | Cloud OCR + parsing | Limited free | $1.50-30/1K pages | Medium | Google Cloud |
| Azure Form Recognizer / Document Intelligence | Cloud OCR + forms | Free tier | $1.50-50/1K pages | Medium | Azure-native |
| Unstructured | OSS + cloud parsing | OSS free; cloud paid | API: $$ | Very high | RAG / AI pipelines |
| Reducto | Modern doc parsing | Trial | Pay-per-page | High | Modern alternative |
| LlamaParse (LlamaIndex) | LlamaIndex parser | Free tier | Pay-per-page | Very high | RAG with LlamaIndex |
| Mathpix | Math OCR | Trial | Per-image | High | Math / equations |
| Klippa | Receipt + invoice OCR | Custom | Per-doc | Medium | Receipt / invoice specialist |
| ABBYY FineReader / Vantage | Enterprise OCR | Custom | $$$$ | Low | Enterprise legacy |
| Tesseract (OSS) | OSS OCR | Free | Self-host | High | DIY / privacy |
| PaddleOCR | OSS OCR | Free | Self-host | High | OSS alternative; multilingual |
| pdfplumber / PyMuPDF | OSS PDF libs | Free | Self-host | Very high | Native PDF (no scan) |
| Anthropic Claude (Vision) | LLM-based OCR | Per-token | Per-call | High | LLM-driven understanding |
| OpenAI GPT-4o (Vision) | LLM-based OCR | Per-token | Per-call | High | LLM-driven understanding |
| Llama Parse (Meta) | Open multimodal | Free | Self-host | Very high | OSS multimodal |
| Nanonets | Custom-trained OCR | Custom | Per-doc | High | Custom forms training |
| Rossum | Invoice automation | Custom | Per-doc | Medium | Enterprise invoice automation |
| AWS Bedrock (Vision) | Bedrock + Vision LLMs | Per-token | Per-call | Medium | AWS + LLM-driven |

The first decision is **scope**: native PDF parsing (pdfplumber / PyMuPDF) vs scanned-doc OCR (Textract / Document AI / Azure) vs RAG-optimized (Unstructured / LlamaParse / Reducto). The second decision is **hosting**: cloud-managed vs OSS self-host vs LLM-driven (Claude / GPT-4o vision).

## Decide What You Need First

### Native PDF parsing — text-based PDFs (the 30% case)
Your PDFs are text-based (not scanned images). Just need text + structure extraction.

Right tools:
- **pdfplumber** (Python OSS) — text + tables
- **PyMuPDF (Fitz)** — fast PDF parsing
- **pdf-parse** (Node) — basic
- **Unstructured** — handles text + scanned

### Scanned documents — OCR required (the 25% case)
PDFs are scanned images / photos. Need OCR.

Right tools:
- **AWS Textract** — broad; reliable
- **Google Document AI** — strong
- **Azure Document Intelligence** — alternative
- **Tesseract** (OSS) — DIY

### Forms / structured documents (the 20% case)
Invoices, receipts, ID cards, tax forms — structured layout extraction.

Right tools:
- **AWS Textract Forms / Tables**
- **Google Document AI Form Parser**
- **Azure Form Recognizer**
- **Klippa** (receipts + invoices)
- **Rossum** (enterprise invoice automation)

### RAG / AI pipelines (the 15% case)
Document → chunks → embeddings → vector DB. Optimized for LLM workflows.

Right tools:
- **Unstructured** — RAG-first; broad format support
- **LlamaParse** — LlamaIndex-aligned
- **Reducto** — modern alternative
- **Anthropic Claude / OpenAI GPT-4o Vision** — LLM-driven extraction

### LLM-driven understanding (the 10% case)
Use Claude / GPT-4o vision to extract + reason about documents.

Right tools:
- **Anthropic Claude** (Sonnet 4.6 / Opus 4.7) — strong vision
- **OpenAI GPT-4o** — strong vision
- **Vercel AI Gateway** — unified across providers
- Use when extraction needs reasoning (not just text extraction)

## Provider Deep-Dives

### AWS Textract — broad cloud OCR
AWS managed OCR + form / table extraction.

Pricing in 2026: 
- Detect Document Text: $1.50/1K pages (after 1K free)
- Forms: $50/1K pages
- Tables: $15/1K pages
- AnalyzeDocument (combined): $50/1K pages
- Custom Queries: $50/1K pages

Features: text detection, forms, tables, queries (ask questions about doc), signature detection, lending / insurance specialist models, identity documents.

Why Textract: broad capabilities; AWS-native; reliable; queries feature (ask "what's the invoice total?").

Trade-offs: pricey at scale; AWS lock-in; documents must be uploaded to S3 first.

Pick if: AWS-native; broad doc types. Don't pick if: cost-sensitive (LLM vision often cheaper now).

### Google Document AI — cloud OCR + parsing
Google Cloud's document understanding.

Pricing in 2026: $1.50-30/1K pages depending on processor.

Features: OCR, form parser, invoice parser, contract parser, ID parser, receipt parser, custom parsers (train your own).

Why Document AI: Google's AI quality; specialty processors (invoice / contract / etc.); custom training for domain-specific docs.

Pick if: Google Cloud-aligned; specialty processor needed (e.g., invoice automation).

### Azure Form Recognizer / Document Intelligence — cloud OCR
Microsoft's document understanding.

Pricing in 2026: free tier; ~$1.50/1K pages basic; custom $50/1K pages.

Features: prebuilt models (invoices, receipts, IDs, business cards, tax forms), custom training, layout analysis.

Why Azure: Microsoft-aligned; strong prebuilt models for common doc types.

Pick if: Azure-native; specific prebuilt model fits use case.

### Unstructured — OSS / RAG-optimized
Open source + managed cloud document parser.

Pricing in 2026: OSS free (self-host); Cloud API $$ paid.

Features: 25+ format support (PDF, DOCX, PPTX, HTML, EML, etc.); chunking optimized for embeddings; metadata extraction; tables; OCR for scans (via Tesseract/Detectron2).

Why Unstructured: RAG-first; OSS option; broad format support; widely used in AI engineering.

Trade-offs: cloud API pricing not always cheaper than alternatives; OSS requires infra setup.

Pick if: building RAG pipelines; want format breadth; OSS preference. Don't pick if: simple OCR (Textract simpler).

### LlamaParse — LlamaIndex-aligned
LlamaIndex's parser with LLM-enhanced extraction.

Pricing in 2026: free tier; pay-per-page paid.

Features: LLM-driven parsing (uses GPT/Claude under hood); strong on complex PDFs (academic papers, financials); markdown output.

Why LlamaParse: handles complex layouts other parsers fail on; markdown-formatted output great for LLM downstream.

Pick if: LlamaIndex-based RAG; complex PDFs (financials, academic). Don't pick if: simple OCR (overkill).

### Reducto — modern document parsing
Modern alternative to Unstructured.

Pricing in 2026: pay-per-page; trial.

Features: high-quality table extraction; markdown / JSON output; LLM-friendly.

Pick if: alternative to Unstructured / LlamaParse; modern API.

### Mathpix — math OCR specialist
Math / equation OCR.

Pricing: per-image.

Features: convert images of math → LaTeX / MathML; PDF math extraction.

Pick if: math-heavy documents (academic papers, math textbooks). Don't pick if: general docs.

### Klippa — receipt / invoice specialist
Receipt + invoice OCR.

Pricing: per-doc.

Features: receipt OCR with line-item extraction; invoice extraction; expense categorization.

Pick if: expense management / receipt automation product. Don't pick if: general docs.

### Tesseract — OSS OCR
Open-source OCR engine.

Pricing: free; you host.

Features: 100+ languages; handwriting OK-ish; baseline OCR.

Pick if: privacy-sensitive; cost-priority; can self-host.

Trade-offs: lower accuracy than commercial cloud OCR; no built-in form / table extraction.

### PaddleOCR — OSS OCR (Baidu)
OSS alternative to Tesseract.

Features: strong multilingual (Chinese especially); table extraction; layout analysis.

Pick if: multilingual / Chinese-heavy.

### LLM Vision (Claude / GPT-4o) — LLM-driven OCR
Use vision LLMs for document understanding.

Pricing in 2026:
- Claude Sonnet 4.6: ~$3/1M input + $15/1M output tokens
- Claude Opus 4.7: ~$15/1M input + $75/1M output tokens
- GPT-4o: ~$2.50/1M input + $10/1M output tokens

Features: vision + reasoning combined; ask questions; structured output; complex layouts.

Why LLM vision: handles edge cases other OCR misses; can extract + reason in one call; markdown output.

Trade-offs: cost varies (often cheaper than Textract for low volume; expensive at high volume); rate limits; hallucination risk.

Pick if: complex extraction with reasoning; low-medium volume. Don't pick if: high volume + strict accuracy (calibrate carefully).

### ABBYY / Rossum / Nanonets — enterprise
Enterprise-focused OCR.

Pricing: custom; $$.

Pick if: enterprise procurement; specific use case (invoice automation).

## What Document Parsing Won't Do

Buying a parsing service doesn't:

1. **Solve all OCR errors.** ~95-99% accuracy on common types; 80-90% on edge cases (handwriting, low-quality scans). Plan for review.
2. **Replace human-in-the-loop for legal docs.** Contracts / legal docs benefit from review even with high-accuracy OCR.
3. **Handle every layout perfectly.** Tables nested in tables, multi-column with sidebars, fillable forms with markup — edge cases break parsers.
4. **Embed semantic understanding.** OCR extracts text; understanding requires LLM downstream.
5. **Process images at acceptable speed for real-time UX.** Many APIs are seconds-to-minutes per doc; plan async.

The honest framing: document parsing is statistical. 95% works fine for most. The 5% will surprise you.

## LLM Vision vs Traditional OCR — 2026 Decision

```text
Decide LLM vision vs traditional OCR.

Use LLM vision (Claude / GPT-4o) when:
- Complex layouts (multi-column, sidebars, mixed content)
- Need reasoning + extraction in one call ("what's the total?")
- Handwriting / poor quality scans
- Low-medium volume (<10K docs / month)
- Cost is OK ($0.01-0.10 per doc with vision)

Use traditional OCR (Textract / Document AI) when:
- Simple layouts; high accuracy required
- High volume (>100K docs / month) — cost difference matters
- Specific specialty model fits (invoice, receipt, ID)
- Compliance requires deterministic processing
- Existing AWS / Google / Azure stack

Use OSS (Tesseract / PaddleOCR) when:
- Privacy critical (no cloud)
- Cost dominant; can absorb engineering
- Self-host expertise on team

Hybrid pattern (recommended for many):
- Tier 1: traditional OCR for fast / high-confidence extraction
- Tier 2: LLM vision for edge cases + reasoning
- Tier 3: human review for low-confidence

Decision factors:
- Volume × per-doc cost
- Accuracy needs
- Latency requirements
- Privacy / compliance

Output:
1. Recommendation for [USE CASE]
2. Per-doc cost calculation
3. Latency / throughput estimate
4. Failure-mode handling
5. Migration path if scale changes
```

The 2026 trend: LLM vision is becoming primary for low-volume + complex docs. Traditional OCR remains better for high-volume + simple. Many teams blend.

## Pragmatic Stack Patterns

### Pattern 1: Indie SaaS adding doc upload ($0-100/mo)
- **Unstructured OSS** (self-host) OR **Tesseract**
- Or LLM vision (Claude / GPT-4o) for low volume
- Total: <$100/mo

### Pattern 2: SMB B2B SaaS with PDF features ($100-2K/mo)
- **AWS Textract** OR **Unstructured Cloud** OR **LlamaParse**
- 1K-100K docs / mo
- Total: $100-2K/mo

### Pattern 3: Mid-market with structured docs ($1K-10K/mo)
- **Google Document AI** with custom processors
- Or **Azure Form Recognizer**
- Custom training for domain
- Total: $1-10K/mo

### Pattern 4: RAG / AI pipelines ($500-5K/mo)
- **Unstructured** OR **LlamaParse** OR **Reducto**
- Optimized for chunking + embeddings
- Vector DB integration

### Pattern 5: LLM-driven extraction ($cheap-expensive)
- **Anthropic Claude** OR **OpenAI GPT-4o**
- Via Vercel AI Gateway for fallback
- Pay-per-token; varies wildly with volume

### Pattern 6: Receipt / invoice product ($per-doc)
- **Klippa** OR **Rossum** OR **Google Document AI Invoice Parser**
- Specialty model

### Pattern 7: Math / academic ($per-doc)
- **Mathpix**
- Or LLM vision for general academic

### Pattern 8: Privacy / OSS ($hosting)
- **Tesseract** OR **PaddleOCR** OR **Unstructured OSS**
- Self-host
- Total: VPS cost only

## Decision Framework: Three Questions

1. **What kind of documents?**
   - Native PDF (text-based) → pdfplumber / PyMuPDF / Unstructured
   - Scanned / images → Textract / Document AI / Azure / Tesseract
   - Forms (invoice / receipt / ID) → Document AI / Form Recognizer / Klippa
   - Math / equations → Mathpix
   - General + reasoning → LLM vision (Claude / GPT-4o)

2. **What's your volume?**
   - <1K docs/mo → free tiers / LLM vision
   - 1K-100K → cloud OCR (Textract / Document AI)
   - 100K+ → negotiate enterprise; consider OSS for cost

3. **What's downstream?**
   - RAG → Unstructured / LlamaParse / Reducto
   - Form data extraction → Document AI / Form Recognizer
   - Search index → standard OCR
   - LLM understanding → LLM vision

## Verdict

For 30% of B2B SaaS in 2026 needing doc parsing: **Unstructured** (OSS or cloud) — RAG-first; broad format.

For 25%: **AWS Textract** — AWS-native; broad capability.

For 15%: **Google Document AI** — Google Cloud + specialty processors.

For 10%: **LLM vision (Claude / GPT-4o)** — low-medium volume + reasoning.

For 10%: **LlamaParse / Reducto** — RAG modern.

For 5%: **Klippa / Rossum** — receipts / invoices.

For 5%: **Tesseract / PaddleOCR / pdfplumber** — OSS / privacy.

The mistake to avoid: **expecting 100% accuracy**. Plan for 95% and human review for low-confidence. Surface confidence scores to users.

The second mistake: **using LLM vision at high volume without cost analysis**. $0.05/doc × 1M docs = $50K/month. Math first.

The third mistake: **not testing on your actual documents**. Sample 50 real docs; run through 3 services; measure accuracy. Marketing demos are misleading.

## See Also

- [Vector Databases](./vector-databases.md) — RAG storage downstream
- [PDF & Document Generation Tools](./pdf-document-generation-tools.md) — flip side (generating PDFs)
- [Unstructured](../ai-development/unstructured.md) — Unstructured deep-dive
- [Search Providers](./search-providers.md) — adjacent search infrastructure
- [Notification Providers](./notification-providers.md) — adjacent infra
- [API Integration](./api-integration.md) — generic integration patterns
- [VibeReference: Anthropic Claude](https://vibereference.dev/ai-models/claude) — Claude vision
- [VibeReference: OpenAI GPT](https://vibereference.dev/ai-models/openai-gpt) — GPT-4o vision
- [VibeReference: AI Gateways](https://vibereference.dev/cloud-and-hosting/ai-gateways) — unified routing
- [VibeReference: Vercel AI Gateway](https://vibereference.dev/cloud-and-hosting/vercel-ai-gateway) — Vercel-managed
- [VibeWeek: RAG Implementation](https://vibeweek.dev/6-grow/rag-implementation-chat) — full RAG pipeline
- [VibeWeek: AI Features Implementation](https://vibeweek.dev/6-grow/ai-features-implementation-chat) — AI feature patterns
- [VibeWeek: File Uploads](https://vibeweek.dev/6-grow/file-uploads-chat) — upload pipeline upstream
- [VibeWeek: Image Upload Processing Pipeline](https://vibeweek.dev/6-grow/image-upload-processing-pipeline-chat) — adjacent
- [VibeWeek: Markdown Rendering & Sanitization](https://vibeweek.dev/6-grow/markdown-rendering-sanitization-chat) — render parsed output
