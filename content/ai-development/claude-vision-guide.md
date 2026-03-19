# Claude Vision: Image Analysis and Document Processing

Claude's vision capabilities let you send images alongside text prompts and get back structured, reasoned analysis. Every current Claude model — from Haiku to Opus — processes images through the same reasoning architecture used for text, which means Claude doesn't just label objects in photos. It interprets charts, reads handwritten notes, extracts data from screenshots, explains diagrams, and answers questions about visual content with the same depth it brings to written analysis.

## What Claude Can See

Claude accepts images in four formats: **PNG**, **JPEG**, **GIF**, and **WebP**. You can include up to 20 images per request on claude.ai, or up to 600 via the API (100 for models with a 200k-token context window). Maximum image size is 8000x8000 pixels.

### Strengths

Claude's vision is strongest where interpretation and reasoning matter more than raw perception:

- **Document OCR** — reading printed and handwritten text from photos, scans, and screenshots
- **Chart and graph analysis** — extracting data points, identifying trends, explaining what a visualization shows
- **Technical diagrams** — interpreting UML diagrams, architecture drawings, flowcharts, and wireframes
- **Screenshot analysis** — understanding UI layouts, identifying elements, reading text from application screenshots
- **Multi-image comparison** — analyzing differences between images, comparing versions, or synthesizing information across multiple visuals
- **Contextual description** — describing images with nuance, including spatial relationships, inferred purpose, and relevant context

### Limitations

Claude's vision is not optimized for:

- **Precise spatial measurements** — it can't reliably count pixels or measure exact distances
- **Small text in large images** — text below roughly 12px in a full-resolution screenshot may be missed
- **Medical or scientific imaging** — while it can describe what it sees, it's not validated for clinical diagnosis
- **Real-time video** — Claude processes static images, not video streams
- **Image generation** — Claude analyzes images but cannot create raster images (PNG, JPEG). It can generate SVG code and describe images for generation tools.

## Using Vision in the API

Send images to Claude by including them in the message content array alongside text:

```python
import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-sonnet-4-6-20260319",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/png",
                        "data": base64_encoded_image,
                    },
                },
                {
                    "type": "text",
                    "text": "Extract all text from this receipt and return it as structured JSON with fields: store_name, date, items (array of {name, quantity, price}), subtotal, tax, total."
                }
            ],
        }
    ],
)
```

### URL-Based Images

You can also pass images by URL instead of base64:

```python
{
    "type": "image",
    "source": {
        "type": "url",
        "url": "https://example.com/chart.png",
    },
}
```

### Multiple Images

Send multiple images for comparison or batch analysis:

```python
messages=[
    {
        "role": "user",
        "content": [
            {"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": before_image}},
            {"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": after_image}},
            {"type": "text", "text": "Compare these two UI screenshots. List every visual difference you can identify, including layout changes, color changes, and text differences."}
        ],
    }
]
```

## Using Vision in Claude Code

Claude Code can read images directly from your filesystem:

```
> Look at the screenshot at screenshots/bug-report.png and identify
  what UI issue the user is reporting

> Read the architecture diagram at docs/system-design.png and explain
  how data flows from the API gateway to the database

> Compare the mockup at design/v2-mockup.png with the current page
  at screenshots/current-page.png and list what needs to change
```

## Practical Applications

### Invoice and Receipt Processing

Extract structured data from financial documents at scale:

```
Extract the following from this invoice image:
- Invoice number
- Vendor name and address
- Line items with descriptions, quantities, and amounts
- Subtotal, tax, and total
- Payment terms and due date

Return as JSON.
```

Claude reads both printed and handwritten text, handles multi-column layouts, and interprets tables — making it effective for automating data entry from scanned documents.

### Screenshot-Based Bug Reports

Turn screenshots into actionable bug reports:

```
Analyze this screenshot of our checkout page. Identify:
1. Any visual bugs (misaligned elements, overlapping text, broken layouts)
2. Any text that appears truncated or incorrect
3. The state of the page (loading, error, success)
4. What the user was likely trying to do
```

### Chart Data Extraction

Pull quantitative data from visualizations:

```
This is a bar chart showing monthly revenue for 2025. Extract the
approximate value for each month and return as a CSV with columns:
month, revenue. Also describe the overall trend.
```

### Diagram Interpretation

Make technical diagrams searchable and actionable:

```
This is a sequence diagram for our authentication flow. Walk through
each step and identify: which services are involved, what data is
passed at each step, and where the flow could fail.
```

### Content Moderation

Screen user-uploaded images for policy compliance:

```
Review this user-uploaded image. Check for:
- Text overlay (potential spam or advertising)
- Inappropriate content
- Low quality (blurry, corrupted, mostly blank)
Return a JSON object with: {safe: boolean, flags: string[], confidence: string}
```

## Performance and Cost

### Token Costs

Images consume tokens based on their resolution. A typical image costs between 200-1,600 tokens depending on size and detail. Higher resolution images cost more tokens but provide better analysis of fine details.

### Optimization Tips

- **Resize before sending** — if you're analyzing a 4000x3000 photo for general content, resize to 1000x750 first. You'll save tokens without losing useful information.
- **Crop to the relevant area** — if you only care about one section of a screenshot, crop it before sending rather than asking Claude to focus on a specific region.
- **Use the right model** — Haiku is faster and cheaper for simple classification tasks (is this a receipt? does this contain text?). Opus or Sonnet is better for detailed analysis and extraction.
- **Batch with the Batch API** — for processing hundreds of images, use the Message Batches API for 50% cost savings.

## Related Resources

- [Claude API Integration Guide](./claude-api-integration) — authentication, rate limits, and API setup
- [Cost Optimization: Batch Processing and Prompt Caching](../backend-and-data/claude-cost-optimization) — reducing API costs at scale
- [Data Processing and Analysis with Claude](../backend-and-data/claude-data-analysis) — combining vision with data workflows
