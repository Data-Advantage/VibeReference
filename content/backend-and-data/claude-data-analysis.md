# Data Processing and Analysis with Claude

Claude handles data transformation, cleaning, analysis, and insight generation through natural language instructions. Instead of writing one-off scripts for each data task, you describe what you need and Claude writes the code, processes the data, or does the analysis directly — depending on whether you're working through the API, Claude Code, or Claude.ai.

## Where Claude Fits in a Data Pipeline

Claude isn't a replacement for your database or data warehouse. It excels at the messy, judgment-heavy parts of data work that are tedious to automate with traditional code:

- **Data cleaning** — handling inconsistent formats, fixing encoding issues, normalizing messy text fields
- **Schema inference** — figuring out what columns mean in an undocumented dataset
- **Natural language to SQL** — converting business questions to queries
- **Data enrichment** — categorizing, tagging, or extracting structured data from unstructured text
- **Analysis and reporting** — generating summaries, finding patterns, creating visualizations

## Data Processing with Claude Code

Claude Code is the most hands-on way to do data work with Claude. It runs in your terminal with access to your files and can execute Python, SQL, and shell commands.

### Exploring Unfamiliar Data

Point Claude at a dataset and let it figure out the structure:

```
> I have a CSV at data/customer_export.csv that came from our CRM.
  Read the first 100 rows, describe the schema, identify data quality
  issues, and suggest cleanup steps.
```

Claude reads the file, examines column types, checks for nulls and duplicates, identifies formatting inconsistencies, and reports back with specific findings.

### Cleaning and Transformation

Describe the transformation in plain English:

```
> Clean data/raw_transactions.csv:
  - Normalize all date columns to ISO 8601 format
  - Strip whitespace from string fields
  - Convert currency strings ("$1,234.56") to floats
  - Deduplicate rows based on transaction_id, keeping the most recent
  - Flag rows with missing required fields (amount, date, customer_id)
  Write the cleaned output to data/clean_transactions.csv and a report
  of what was fixed to data/cleaning_report.md
```

Claude writes a Python script, runs it against your data, and produces both the cleaned output and a report of every change made.

### SQL Generation

Ask business questions and get working queries:

```
> Given the schema in migrations/001_create_tables.sql, write a query
  that shows: monthly revenue by product category for the last 12 months,
  with month-over-month growth rate, excluding refunded orders.
  Optimize for PostgreSQL.
```

Claude reads your schema file, writes the query with proper joins and window functions, and can run it against your database if you have a connection configured.

## Data Processing via the API

For automated data pipelines, use the Claude API to process data programmatically.

### Text Classification

Classify documents, tickets, or any text into categories:

```python
import anthropic
import csv

client = anthropic.Anthropic()

def classify_ticket(text: str) -> dict:
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",  # Fast and cheap for classification
        max_tokens=256,
        system="Classify support tickets. Return JSON: {category, priority, sentiment}",
        messages=[{"role": "user", "content": text}],
    )
    return json.loads(message.content[0].text)

# Process a batch of tickets
with open("tickets.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        result = classify_ticket(row["description"])
        print(f"Ticket {row['id']}: {result}")
```

For high volume, use the Batch API for 50% cost savings:

```python
batch_requests = [
    {
        "custom_id": f"ticket-{row['id']}",
        "params": {
            "model": "claude-haiku-4-5-20251001",
            "max_tokens": 256,
            "system": "Classify support tickets. Return JSON: {category, priority, sentiment}",
            "messages": [{"role": "user", "content": row["description"]}],
        },
    }
    for row in tickets
]

batch = client.messages.batches.create(requests=batch_requests)
```

### Data Extraction from Unstructured Text

Pull structured data from documents, emails, or web content:

```python
EXTRACTION_PROMPT = """Extract the following fields from this job posting.
Return as JSON:
{
  "company": string,
  "title": string,
  "location": string | "remote",
  "salary_min": number | null,
  "salary_max": number | null,
  "experience_years": number | null,
  "skills": string[],
  "employment_type": "full-time" | "part-time" | "contract"
}

Job posting:
{text}"""

def extract_job_data(posting_text: str) -> dict:
    message = client.messages.create(
        model="claude-sonnet-4-6-20260319",
        max_tokens=512,
        messages=[{"role": "user", "content": EXTRACTION_PROMPT.format(text=posting_text)}],
    )
    return json.loads(message.content[0].text)
```

### Data Quality Validation

Use Claude to catch errors that rule-based validation misses:

```python
VALIDATION_PROMPT = """Review this customer record for data quality issues.
Check for:
- Name: plausible human name (flag things like "TEST USER" or "asdf")
- Email: valid format AND plausible domain (flag disposable email services)
- Phone: valid format for the stated country
- Address: all required fields present, zip code matches state

Return JSON:
{
  "valid": boolean,
  "issues": [{"field": string, "issue": string, "severity": "error" | "warning"}]
}

Record: {record}"""
```

## Working with pandas

Claude Code integrates well with Python data workflows. Ask it to write pandas code and run it:

```
> Load data/sales_2025.csv into pandas. Create a summary that shows:
  - Total revenue by region
  - Top 10 products by units sold
  - Month with highest growth rate
  - Any anomalies in the data (unusual spikes, missing periods)

  Save the summary to data/sales_analysis.md and create a matplotlib
  chart of monthly revenue by region saved to charts/revenue_by_region.png
```

Claude writes the pandas code, executes it, generates the report and chart, and saves both to your filesystem.

### Pivot Tables and Aggregation

```
> I need a pivot table from data/marketing_spend.csv showing:
  - Rows: channel (Google Ads, Facebook, LinkedIn, etc.)
  - Columns: month
  - Values: spend, conversions, CPA (spend/conversions)
  - Include row totals and column totals

  Export as both CSV and a formatted markdown table.
```

## CSV and JSON Processing Patterns

### Large File Processing

For files too large to send in a single API call, process in chunks:

```python
import csv
import json

CHUNK_SIZE = 50  # rows per API call

def process_large_csv(filepath: str):
    results = []
    with open(filepath) as f:
        reader = csv.DictReader(f)
        chunk = []
        for row in reader:
            chunk.append(row)
            if len(chunk) >= CHUNK_SIZE:
                batch_result = process_chunk(chunk)
                results.extend(batch_result)
                chunk = []
        if chunk:  # Process remaining rows
            results.extend(process_chunk(chunk))
    return results

def process_chunk(rows: list[dict]) -> list[dict]:
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": f"Process these records and return enriched JSON:\n{json.dumps(rows)}"
        }],
    )
    return json.loads(message.content[0].text)
```

### Schema Mapping

Map data between different schemas — useful for integrations and migrations:

```
> I have two CSVs:
  - data/old_format.csv (our legacy system export)
  - data/new_schema.json (the target schema for our new system)

  Create a Python script that reads the old format, maps fields to
  the new schema, handles any data transformations needed (date formats,
  enum values, nested objects), and writes the output as newline-delimited
  JSON to data/migrated.jsonl
```

## Cost Considerations for Data Workloads

Data processing can involve thousands of API calls. Use these strategies to manage costs:

1. **Use Haiku for simple tasks** — classification, extraction, and validation work well with the cheapest model
2. **Batch non-urgent work** — the Batch API gives you 50% off everything
3. **Cache repeated context** — if every request includes the same schema or examples, cache them
4. **Process in chunks** — send multiple records per request to amortize the per-request overhead
5. **Filter before sending** — pre-filter data with traditional code to only send records that need AI processing

A classification pipeline processing 100,000 records with Haiku via the Batch API costs roughly:
- 100,000 × 500 input tokens × $0.40/MTok + 100,000 × 100 output tokens × $2/MTok = **$40**

## Related Resources

- [Cost Optimization: Batch Processing and Prompt Caching](./claude-cost-optimization) — detailed cost reduction strategies
- [Claude API Integration Guide](../ai-development/claude-api-integration) — API setup and authentication
- [Claude Vision Guide](../ai-development/claude-vision-guide) — processing images and documents
- [Prompt Engineering for Claude](../ai-development/claude-prompt-engineering) — writing effective data processing prompts
