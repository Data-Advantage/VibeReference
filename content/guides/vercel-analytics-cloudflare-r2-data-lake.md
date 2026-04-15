---
title: "How to Build a Vercel Web Analytics Data Lake on Cloudflare R2"
description: "Stream Vercel Web Analytics into a queryable Apache Iceberg data lake on Cloudflare R2 using Drains, Workers, and Pipelines. Full setup guide with SQL examples."
author:
  name: "Data Advantage"
---

Vercel Web Analytics gives you a privacy-friendly, lightweight analytics dashboard out of the box. But what if you want to own your raw analytics data, run custom SQL queries, or pipe traffic stats into your own tools and AI agents?

With Vercel Drains and Cloudflare's Data Platform, you can stream every pageview and custom event into an Apache Iceberg data lake on R2 — then query it with SQL. No Kafka, no Spark clusters, no data warehouse bill. The whole setup takes about 30 minutes and costs close to nothing.

This guide walks through the full pipeline: Vercel Drain → Cloudflare Worker → Cloudflare Pipelines → R2 Data Catalog → R2 SQL.

## What You'll Need

* A Vercel account on the **Pro plan** (required for Drains)
* A Cloudflare account on the **Workers Paid plan** ($5/mo, required for Pipelines)
* One or more sites with Vercel Web Analytics enabled

## Architecture Overview

```
Vercel Web Analytics
  → Vercel Drain (HTTPS POST, JSON)
    → Cloudflare Worker (signature verification)
      → Cloudflare Pipelines (ingestion + schema enforcement)
        → R2 Data Catalog (managed Apache Iceberg table)
          → R2 SQL (serverless query engine)
```

The Worker exists as a thin auth layer. Vercel signs every drain payload with HMAC-SHA1, and the Worker verifies that signature before forwarding events to Pipelines. Pipelines handles batching, schema validation, and writing Parquet files into an Iceberg table on R2. R2 SQL lets you query that table with standard SQL — no infrastructure to manage.

## Step 1: Create an R2 Bucket

In the Cloudflare dashboard, go to **R2 Object Storage → Overview → Create Bucket**. Name it something like `vercel-analytics`. Leave all other settings at their defaults.

Or via CLI:

```bash
npx wrangler r2 bucket create vercel-analytics
```

## Step 2: Enable R2 Data Catalog

Select your new bucket → **Settings** tab → scroll to **R2 Data Catalog** → click **Enable**.

Note the **Warehouse name** and **Catalog URI** — you'll need the warehouse name later for running queries.

Or via CLI:

```bash
npx wrangler r2 bucket catalog enable vercel-analytics
```

## Step 3: Create an API Token for Pipelines

Go to **R2 → Manage R2 API Tokens → Create API Token**. Set permissions to **Admin Read & Write**. Save the token value securely — you'll use it when configuring the Pipeline sink.

## Step 4: Create a Cloudflare Pipeline

Go to **Pipelines** in the Cloudflare dashboard → **Create Pipeline**.

### Connect to a Stream

* **Pipeline name:** `vercel-analytics`
* **Enable HTTP endpoint:** Yes
* **Require authentication:** No

### Define Input Schema

Switch to the JSON editor and paste this schema. It matches the Vercel Web Analytics `vercel.analytics.v2` payload:

```json
{
  "fields": [
    { "name": "eventType", "type": "string", "required": true },
    { "name": "timestamp", "type": "int64", "required": true },
    { "name": "projectId", "type": "string", "required": true },
    { "name": "ownerId", "type": "string", "required": false },
    { "name": "sessionId", "type": "int64", "required": false },
    { "name": "deviceId", "type": "int64", "required": false },
    { "name": "origin", "type": "string", "required": false },
    { "name": "path", "type": "string", "required": false },
    { "name": "referrer", "type": "string", "required": false },
    { "name": "queryParams", "type": "string", "required": false },
    { "name": "route", "type": "string", "required": false },
    { "name": "country", "type": "string", "required": false },
    { "name": "region", "type": "string", "required": false },
    { "name": "city", "type": "string", "required": false },
    { "name": "osName", "type": "string", "required": false },
    { "name": "osVersion", "type": "string", "required": false },
    { "name": "clientName", "type": "string", "required": false },
    { "name": "clientType", "type": "string", "required": false },
    { "name": "clientVersion", "type": "string", "required": false },
    { "name": "deviceType", "type": "string", "required": false },
    { "name": "deviceBrand", "type": "string", "required": false },
    { "name": "deviceModel", "type": "string", "required": false },
    { "name": "browserEngine", "type": "string", "required": false },
    { "name": "browserEngineVersion", "type": "string", "required": false },
    { "name": "sdkVersion", "type": "string", "required": false },
    { "name": "sdkName", "type": "string", "required": false },
    { "name": "sdkVersionFull", "type": "string", "required": false },
    { "name": "vercelEnvironment", "type": "string", "required": false },
    { "name": "vercelUrl", "type": "string", "required": false },
    { "name": "deployment", "type": "string", "required": false },
    { "name": "eventName", "type": "string", "required": false },
    { "name": "eventData", "type": "string", "required": false },
    { "name": "flags", "type": "string", "required": false },
    { "name": "schema", "type": "string", "required": false }
  ]
}
```

### Define Sink

* **R2 Bucket:** Select your analytics bucket
* **Storage Type:** R2 Data Catalog
* **Namespace:** `default`
* **Table Name:** `pageviews`
* Under **Advanced Settings**, set **Maximum Time Interval** to `300` seconds (5 minutes). This controls how often the Pipeline flushes batched events to Parquet files. Lower values give faster data availability but create more small files. 300 seconds is a good production default.

### Credentials

You can either let Cloudflare auto-create a token or paste the one you created in Step 3. Auto-create is simpler.

### Pipeline Definition

Leave the default SQL transformation as-is:

```sql
INSERT INTO vercel_analytics_sink SELECT * FROM vercel_analytics_stream;
```

Click **Create Pipeline** and note the **Stream ID** / HTTP endpoint URL it provides (something like `https://<stream-id>.ingest.cloudflare.com`).

## Step 5: Deploy the Cloudflare Worker

The Worker receives drain payloads from Vercel, verifies the HMAC signature, and forwards events to the Pipeline endpoint. You need it because Pipelines doesn't natively support Vercel's signature verification.

### Create the Worker

In the Cloudflare dashboard, go to **Workers & Pages → Create → Create Worker**. Name it something like `vercel-analytics-drain`. Deploy the default hello world template, then go to the code editor and replace everything with:

```javascript
export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const body = await request.text();

    const signature = request.headers.get("x-vercel-signature");
    if (!signature || !env.VERCEL_DRAIN_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }

    const valid = await verifySignature(body, signature, env.VERCEL_DRAIN_SECRET);
    if (!valid) {
      return new Response("Invalid signature", { status: 403 });
    }

    let events;
    try {
      events = JSON.parse(body);
    } catch {
      return new Response("Bad JSON", { status: 400 });
    }

    if (!Array.isArray(events)) events = [events];
    if (events.length === 0) return new Response("OK", { status: 200 });

    try {
      const res = await fetch(env.PIPELINE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(events),
      });

      if (!res.ok) {
        return new Response("Pipeline ingest failed", { status: 502 });
      }
    } catch (err) {
      return new Response("Pipeline request failed", { status: 502 });
    }

    return new Response("OK", { status: 200 });
  },
};

async function verifySignature(body, signature, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const digest = [...new Uint8Array(mac)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  if (digest.length !== signature.length) return false;
  let mismatch = 0;
  for (let i = 0; i < digest.length; i++) {
    mismatch |= digest.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0;
}
```

### Configure Worker Variables

In the Worker's **Settings → Variables and Secrets**, add:

* **Plaintext variable** `PIPELINE_ENDPOINT` → your Pipeline's HTTP endpoint URL
* **Secret** `VERCEL_DRAIN_SECRET` → the signature secret from the Vercel Drain UI (you'll set this in the next step)

Save and deploy.

## Step 6: Configure the Vercel Drain

In the Vercel dashboard, go to **Team Settings → Drains → Add Drain**.

1. **Choose data to drain:** Web Analytics
2. **Configure the drain:** Select which projects to include
3. **Configure the destination:**
   * **URL:** Your Worker's URL (e.g., `https://vercel-analytics-drain.<your-subdomain>.workers.dev`)
   * **Encoding:** JSON
   * **Signature Verification Secret:** Generate one, then copy it into your Worker's `VERCEL_DRAIN_SECRET` secret
4. Click **Test** to verify the endpoint returns 200
5. Click **Create Drain**

## Step 7: Query Your Data

Create a read-only API token for queries: **R2 → Manage R2 API Tokens → Create API Token** with **Admin Read only** or **Admin Read & Write** permissions.

Set it as an environment variable:

```bash
export WRANGLER_R2_SQL_AUTH_TOKEN="your_token_here"
```

Then query:

```bash
npx wrangler r2 sql query "YOUR_WAREHOUSE_NAME" \
  "SELECT origin, path, country, deviceType FROM default.pageviews LIMIT 10"
```

### Example Queries

**Pageviews by site:**

```sql
SELECT
  origin,
  COUNT(*) as pageviews,
  COUNT(DISTINCT deviceId) as unique_devices
FROM default.pageviews
WHERE eventType = 'pageview'
GROUP BY origin
ORDER BY pageviews DESC
```

**Top pages for a specific site:**

```sql
SELECT
  path,
  COUNT(*) as pageviews,
  COUNT(DISTINCT deviceId) as unique_devices
FROM default.pageviews
WHERE eventType = 'pageview'
  AND origin LIKE '%yoursite.com%'
GROUP BY path
ORDER BY pageviews DESC
LIMIT 20
```

**Geographic breakdown:**

```sql
SELECT
  country,
  COUNT(*) as pageviews
FROM default.pageviews
WHERE eventType = 'pageview'
GROUP BY country
ORDER BY pageviews DESC
LIMIT 20
```

**Device and browser breakdown:**

```sql
SELECT
  deviceType,
  osName,
  clientName,
  COUNT(*) as pageviews
FROM default.pageviews
WHERE eventType = 'pageview'
GROUP BY deviceType, osName, clientName
ORDER BY pageviews DESC
LIMIT 20
```

**Top referrers:**

```sql
SELECT
  referrer,
  COUNT(*) as pageviews
FROM default.pageviews
WHERE eventType = 'pageview'
  AND referrer IS NOT NULL
  AND referrer != ''
GROUP BY referrer
ORDER BY pageviews DESC
LIMIT 20
```

### Querying via REST API

R2 SQL also exposes a REST endpoint, which is useful for integrating with scripts, dashboards, or AI agents:

```bash
curl -X POST \
  "https://api.sql.cloudflarestorage.com/api/v1/accounts/YOUR_ACCOUNT_ID/r2-sql/query/YOUR_BUCKET_NAME" \
  -H "Authorization: Bearer $WRANGLER_R2_SQL_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "query": "SELECT origin, COUNT(*) as pageviews FROM default.pageviews WHERE eventType = '\''pageview'\'' GROUP BY origin ORDER BY pageviews DESC" }'
```

You can also connect any Iceberg-compatible engine — DuckDB, Spark, Trino, Snowflake — to R2 Data Catalog via its standard REST catalog interface.

## Cost Breakdown

This setup is remarkably cheap for what you get:

| Component                      | Cost                                     |
| ------------------------------ | ---------------------------------------- |
| Cloudflare Workers Paid plan   | $5/mo (required for Pipelines)           |
| Cloudflare Workers requests    | Free tier covers 10M requests/mo         |
| Cloudflare Pipelines           | Free during open beta                    |
| R2 Data Catalog                | Free during open beta                    |
| R2 SQL                         | Free during open beta                    |
| R2 Storage                     | Free up to 10 GB, then $0.015/GB-month   |
| R2 Class A operations (writes) | Free up to 1M/mo, then $4.50 per million |
| R2 Egress                      | Always free                              |
| Vercel Drains                  | $0.50/GB exported                        |

For a portfolio of 10–20 sites with moderate traffic, you're looking at roughly **$5/mo** for the Workers plan plus pennies for Vercel drain egress. The Cloudflare storage and query costs will stay within free tier for a long time. Analytics JSON is tiny — 50,000 pageviews per day produces under 1 GB per month of raw data, and Parquet compression reduces that further.

## Schema Reference

The `default.pageviews` table contains one row per event with these columns:

| Column               | Type      | Description                                        |
| -------------------- | --------- | -------------------------------------------------- |
| eventType            | string    | pageview or event (custom events)                  |
| timestamp            | int64     | Unix timestamp in milliseconds                     |
| projectId            | string    | Vercel project identifier                          |
| ownerId              | string    | Vercel team/account identifier                     |
| sessionId            | int64     | Session identifier                                 |
| deviceId             | int64     | Device identifier (best proxy for unique visitors) |
| origin               | string    | Full origin URL (e.g., https://example.com)        |
| path                 | string    | URL path (e.g., /about)                            |
| referrer             | string    | Referrer URL                                       |
| queryParams          | string    | URL query parameters                               |
| route                | string    | Route pattern (e.g., /blog/\[slug])                |
| country              | string    | Two-letter country code                            |
| region               | string    | Region code                                        |
| city                 | string    | City name                                          |
| osName               | string    | Operating system                                   |
| osVersion            | string    | OS version                                         |
| clientName           | string    | Browser name                                       |
| clientType           | string    | Client type (usually browser)                      |
| clientVersion        | string    | Browser version                                    |
| deviceType           | string    | desktop, mobile, or tablet                         |
| deviceBrand          | string    | Device manufacturer                                |
| deviceModel          | string    | Device model                                       |
| browserEngine        | string    | Rendering engine                                   |
| browserEngineVersion | string    | Engine version                                     |
| vercelEnvironment    | string    | production or preview                              |
| deployment           | string    | Vercel deployment ID                               |
| eventName            | string    | Custom event name (when eventType = event)         |
| eventData            | string    | Custom event data (JSON string)                    |
| \_\_ingest\_ts       | timestamp | Auto-added by Pipelines (ingestion time)           |

## Tips and Gotchas

**Pipeline roll interval matters.** The Maximum Time Interval setting on your Pipeline sink controls how often data is flushed to Parquet files. Lower values (e.g., 10 seconds) mean faster data availability but produce lots of small files that slow down queries. Higher values (e.g., 300 seconds) create fewer, larger files with better query performance. Start with 300 seconds and adjust based on your needs.

**The Worker binding vs. environment variable distinction matters in Cloudflare.** When connecting to R2 from a Worker, you need an **R2 Bucket Binding** (configured in the Bindings tab), not a plaintext environment variable with the bucket name. A binding gives you the R2 API object with methods like `.put()` and `.get()`. A string doesn't. This is the most common mistake when setting up Workers with R2. In this guide, the Worker doesn't need an R2 binding because it forwards to Pipelines instead of writing directly to R2.

**Vercel batches events.** A single drain POST may contain multiple events in a JSON array. The Worker and Pipeline handle this natively.

**R2 SQL is read-only.** You can only run `SELECT` queries. All writes happen through Pipelines.

**Data arrives with a delay.** Events are buffered by the Pipeline for up to your configured roll interval before they become queryable. Plan for 5–10 minutes of latency if you're using the 300-second default.

**Use `deviceId` for unique visitor counts.** It's not perfect (a single person on two browsers counts as two devices), but it's the best approximation available in the schema.

**Filter by `eventType` = `pageview`.** The table contains both pageviews and custom events. Always filter on `eventType` in your queries unless you specifically want custom events.

**Compaction improves query performance over time.** R2 Data Catalog supports automatic compaction, which merges small Parquet files into larger ones. Enable it in your bucket's Data Catalog settings for better long-term query performance.

## What You Can Build With This

Once your analytics data is flowing into a queryable Iceberg table, the possibilities open up:

* **Custom dashboards** that pull from the R2 SQL REST API
* **AI agents** that can answer questions about your site traffic by constructing and executing SQL queries
* **Automated reports** via cron jobs or scheduled Workers
* **Cross-site analysis** across your entire project portfolio
* **Funnel analysis** using custom events and session/device tracking
* **SEO monitoring** by tracking referrer and path patterns over time

The data is yours, in an open format, queryable by any Iceberg-compatible tool, with zero egress fees.
