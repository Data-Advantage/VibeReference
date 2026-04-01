---
author:
  name: Muhammed Musthafa
  url: https://github.com/mohdmusthafaneo
---

# Paperclip Production Migration: Embedded PostgreSQL + Local Disk → Supabase

Move your Paperclip instance from embedded PostgreSQL and local disk to Supabase Postgres and S3-compatible Storage to reduce RAM pressure and stop EBS growth.

---

## Before You Assume It's the Database or Disk

Slowness on EC2 is **not always** embedded Postgres or local storage. Before a large migration, confirm the bottleneck is what you think it is. Other common causes:

- **Agent fan-out**: many concurrent agents stressing CPU, memory, or connection count.
- **Undersized instance**: too little vCPU/RAM for your workload.
- **EBS performance**: baseline vs burst credits exhausted, or gp2/gp3 without enough provisioned IOPS — a "sluggish" host can be I/O wait, not Postgres.
- **Noisy neighbors** (smaller instances / shared tenancy effects) or network path issues.

### Quick triage checklist

1. **`top` / `htop`**: Is `postgres` (embedded) or Java/other DB processes dominating CPU or RES memory? High **`wa`** (I/O wait) points to disk/EBS, not necessarily "wrong database."
2. **Disk growth**: Is `~/.paperclip/.../data/storage` or the Postgres data dir growing in step with user-visible slowness?
3. **Embedded port activity**: When traffic is normal, does load correlate with obvious DB activity in logs?

If the host is CPU-starved on agents alone, or IOPS-starved on EBS, **rightsizing or storage tuning** may fix the problem faster than a Supabase cutover. Use this guide when offloading DB and object storage is still the right move.

---

## Why Migrate

Typical motivations:

- **Embedded PostgreSQL** runs alongside Paperclip and can contend for RAM and CPU when many agents run in parallel — under memory pressure the database process may become unstable.
- **Local disk storage** under `~/.paperclip/.../data/storage` grows with attachments. On EC2 that usually means a larger EBS volume and more frequent resizing.

Moving the database and object storage to Supabase offloads both to managed services.

---

## Maintenance Window, Downtime, and Ordering

**Downtime expectations** depend on data size, network speed, and how long verification takes. Plan for at least long enough to: stop the app → dump → restore to Supabase → point config → smoke-test → (optionally) sync storage and cut over storage config. Small instances might finish in tens of minutes; large DBs or big attachment trees can take hours — **measure a test dump/restore on a copy** if you need a hard number.

### Order of operations

1. **Postgres first** is usual: dump embedded DB → restore to Supabase → point `DATABASE_URL` / config → verify API health and critical flows.
2. **Storage** can be the same maintenance window or a second window. If the app keeps writing local files while you `aws s3 sync`, objects will drift relative to a single point in time.

### Cutover pattern for storage (avoid drift)

- **Stop Paperclip** (or freeze uploads/attachments if you have a feature for that — most setups stop the app), then run your final sync to the bucket.
- Alternatively: sync a first pass while stopped, then **stop app**, **second sync** (incremental), then cut over `storage` config to S3, start app, verify, then retire local storage.

**One window vs split**: You can split "DB migration" and "storage migration" across two windows. Document which system of record is which during the gap (e.g. DB on Supabase, files still local until window two).

---

## Prerequisites

- A running Paperclip instance using embedded Postgres (`DATABASE_URL` unset) and local storage.
- A [Supabase](https://supabase.com/) project with:
  - Database connection strings (direct + pooler) from **Project Settings → Database**.
  - A Storage bucket (S3-compatible) and API credentials with access to that bucket.
- **`pg_dump` / `pg_restore` client version**: Use client tools that match or are compatible with the server PostgreSQL version. Your embedded Postgres is one version; Supabase publishes its Postgres version in the dashboard/docs. Mismatched major versions often produce opaque `pg_restore` errors. If in doubt, install client tools at the same major version as the target (Supabase) server and re-dump if needed.

Official references:

- [Hosted PostgreSQL (Supabase)](https://docs.paperclip.ing/deploy/database#3-hosted-postgresql-supabase)
- [Storage (S3-compatible)](https://docs.paperclip.ing/deploy/storage)

---

## Instance Directory (Default vs Custom)

Examples in this guide use `~/.paperclip/instances/default/`. If you use a non-default instance name or path, substitute your directory everywhere (`config.json`, `.env`, `data/storage`, `db/`, etc.). The layout under that instance root is the same; only the path changes.

---

## 1. Networking: Supabase and IPv6 on AWS

Supabase's database host may be reachable over **IPv6-only** on the free tier, while IPv4 access can require a paid add-on (pricing changes over time — check [Supabase pricing](https://supabase.com/pricing)).

If you cannot enable IPv6 in your VPC quickly, the practical alternative is often Supabase's paid IPv4 add-on — so you can reach the database over IPv4 without reworking the VPC. Prefer fixing IPv6 properly when you can; buying IPv4 is a trade-off some shops make for speed.

If your EC2 instance is in a VPC without IPv6, connections to an IPv6-only endpoint will fail. Fix by enabling IPv6 for the VPC and the instance:

- Associate an **IPv6 CIDR** with the VPC and subnets.
- Update **route tables** (e.g. `::/0` via an Internet Gateway for public subnets, or IPv6 egress as appropriate for your design).
- Assign an **IPv6 address** to the instance ENI.
- Ensure **security groups** allow outbound traffic to Supabase on the database port (and HTTPS for APIs).

Exact clicks vary by AWS console version; search AWS docs for "VPC IPv6" and follow the checklist for your subnet layout.

After IPv6 works, verify the instance can use IPv6 egress (needed when your database host is IPv6-only). `curl -6` forces IPv6 — you should see your instance's public IPv6 address:

```bash
curl -6 -sS https://icanhazip.com
```

If that errors or hangs, fix routing/security groups before pointing Paperclip at Supabase.

---

## 2. Find the Embedded PostgreSQL Port

Paperclip's embedded server defaults to port **54329** unless you changed `database.embeddedPostgresPort` in `config.json`.

Confirm in logs on startup (look for "embedded PostgreSQL" and `port=`) or read:

```bash
grep -E "embeddedPostgresPort|embedded" ~/.paperclip/instances/default/config.json
```

Default embedded URL (password and database name are fixed for embedded mode):

```
postgres://paperclip:paperclip@127.0.0.1:54329/paperclip
```

If you changed `database.embeddedPostgresPort`, swap `54329` for that port.

---

## 3. Dump the Embedded Database

Stop Paperclip so the embedded cluster is not mid-write (recommended), or take the dump while traffic is stopped.

Custom format is convenient for `pg_restore`:

```bash
export PGPORT=54329   # your embedded port
export PGHOST=127.0.0.1
export PGUSER=paperclip
export PGDATABASE=paperclip

pg_dump -Fc -f paperclip_backup_$(date +%Y%m%d_%H%M%S).dump
```

You should get a single `.dump` file (size depends on your data; tens of MB is common for small instances).

**Retain this file** through a bake-in period for rollback (see [Rollback, Backups, and Safety](#rollback-backups-and-safety)).

---

## 4. Restore into Supabase

Use the **direct** Postgres URI from **Project Settings → Database** for `pg_restore` (not the pooled / transaction URL), unless Supabase documents otherwise.

Supabase URIs typically require TLS: ensure the URI includes `sslmode=require` (or equivalent your client understands). Restore uses the direct connection; the running app should use the pooled URI when the dashboard recommends it — Paperclip is set up for pooled URLs in normal operation (prepared statements disabled where required).

```bash
export DATABASE_URL='<supabase direct pg connection uri with sslmode=require>'
```

Restore into a **fresh** database. Managed Postgres often fails with "database is not empty" if you retry into a partially loaded schema. Prefer a new Supabase project or an empty logical database created for this restore. First-time restores can also surface extension or schema surprises (extensions must exist on the target, or you drop them from the dump strategy — follow Supabase + Postgres docs for your version).

```bash
pg_restore --verbose --no-owner --no-acl -d "$DATABASE_URL" paperclip_backup_YYYYMMDD_HHMMSS.dump
```

- If you see role/owner warnings, `--no-owner --no-acl` (as above) usually matches managed Postgres expectations.
- For a dirty retry, you may need `--clean` (destructive — only on a throwaway target) or to start from an empty DB again. Don't `--clean` production you care about without understanding the blast radius.
- **Where to look for errors**: Supabase Dashboard → Database → logs/advisors, and `pg_restore` stderr in your terminal. The SQL editor can confirm table counts and spot missing extensions.

Confirm table count and a quick sanity query in the Supabase SQL editor or `psql`.

---

## 5. Point Paperclip at Supabase Postgres

### 5.1 Environment

Set `DATABASE_URL` for the running process. For a typical install:

```bash
nano ~/.paperclip/instances/default/.env
```

Example (use the **pooled** Postgres URI from the Supabase dashboard for the running app when available; include `sslmode=require` if not already in the string):

```
DATABASE_URL='<supabase pooled pg connection uri>'
```

### 5.2 Config file (doctor / consistency)

Update `~/.paperclip/instances/default/config.json` so the database section matches hosted Postgres — especially `database.mode` and `database.connectionString` if your build expects them for health checks:

```json
"database": {
  "mode": "postgres",
  "connectionString": "<supabase pg connection uri>"
}
```

Adjust field names to match your installed Paperclip version if they differ.

### 5.3 Restart and verify

Restart Paperclip (or your systemd service) and check:

```bash
curl -sS http://127.0.0.1:3100/api/health
pnpm paperclipai doctor
```

### 5.4 Retire embedded PostgreSQL

Once Supabase is verified:

- Ensure nothing sets `DATABASE_URL` back to embedded mode accidentally.
- You may remove or archive `~/.paperclip/instances/default/db/` **only after** you are satisfied with backups of Supabase and a successful migration. This frees significant local RAM and disk.

---

## 6. Migrate File Storage to Supabase Storage (S3)

Local attachments live under something like:

```
~/.paperclip/instances/default/data/storage
```

### 6.1 Create a bucket and credentials

In Supabase, create a bucket (for example `paperclip`) and obtain S3-compatible endpoint, region, and access keys from the project dashboard.

### 6.2 Sync objects

Use any S3-compatible tool (`aws s3 sync` with the Supabase endpoint, `rclone`, etc.). Example with AWS CLI (replace region, endpoint, and bucket name):

```bash
export AWS_ACCESS_KEY_ID='...'
export AWS_SECRET_ACCESS_KEY='...'
export AWS_DEFAULT_REGION='us-east-1'

aws s3 sync ~/.paperclip/instances/default/data/storage/ s3://paperclip/ \
  --endpoint-url '<supabase s3 endpoint url>'
```

**Consistency**: Prefer syncing after stopping Paperclip (or after a quiesced period plus a final incremental sync), as described in [Maintenance Window, Downtime, and Ordering](#maintenance-window-downtime-and-ordering).

Exact endpoint and path style depend on your Supabase project; follow [Supabase Storage S3 compatibility](https://supabase.com/docs/guides/storage/s3/compatibility) for the current URL shape.

### 6.3 Configure Paperclip for S3

Either use the CLI:

```bash
cd ~/paperclip   # or your install path
pnpm paperclipai configure --section storage
```

Or edit `~/.paperclip/instances/default/config.json`:

```json
"storage": {
  "provider": "s3",
  "s3": {
    "bucket": "paperclip",
    "region": "us-east-1",
    "endpoint": "<supabase s3 endpoint url>",
    "prefix": "",
    "forcePathStyle": true
  }
}
```

`forcePathStyle` and `endpoint` must match what Supabase expects for S3 API calls — confirm against current docs.

The server uses the AWS SDK default credential chain. Set keys in the environment for the Paperclip process, for example in systemd:

```
Environment=AWS_ACCESS_KEY_ID=your-key-id
Environment=AWS_SECRET_ACCESS_KEY=your-secret
```

Or use a shared credentials file readable by the service user.

**Security note**: Values in `.env` and systemd `Environment=` are plaintext on disk. Restrict file permissions (e.g. `.env` readable only by the service user), rotate keys if compromised, and treat Supabase Storage keys as third-party secrets — they are not EC2 instance IAM roles. For AWS-native patterns, scope lifecycle and rotation to how your org handles long-lived API keys.

Optional env overrides:

- `PAPERCLIP_STORAGE_PROVIDER=s3`
- `PAPERCLIP_STORAGE_S3_BUCKET`, `PAPERCLIP_STORAGE_S3_REGION`, `PAPERCLIP_STORAGE_S3_ENDPOINT`, etc.

### 6.4 Verify before deleting local files

Rename the old directory so Paperclip cannot fall back to it:

```bash
mv ~/.paperclip/instances/default/data/storage \
   ~/.paperclip/instances/default/data/storage.disabled
```

Exercise the UI: open issues with attachments, confirm images load from the bucket. When satisfied, delete `storage.disabled` or archive it offline. Keeping `storage.disabled` through a short bake-in period preserves a quick rollback path.

---

## Rollback, Backups, and Safety

- **Keep the `pg_dump` artifact** (`.dump`) until you have run on Supabase confidently and have another recovery story (e.g. Supabase backups).
- **Keep `storage.disabled`** (or an offline archive) until attachments are verified under load.
- **Supabase as sole copy**: Before deleting local `db/` and old storage, consider proving you can restore from Supabase's backup (per their docs/plan) once — so "production" isn't a single manual dump on disk you've already deleted.
- **Rollback (minimal)**: Point `DATABASE_URL` back at embedded only if you still have `db/` and a compatible embedded setup. For storage, rename `storage.disabled` back if you haven't deleted it. After you drop local `db/`, rollback means restoring Postgres from your dump or from Supabase export, not flipping an env var alone.

---

## 7. systemd Reminder

If Paperclip runs under systemd, remember:

- `Environment=` lines for `DATABASE_URL`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and any other vars do not come from `~/.bashrc`.
- `PATH` must include `node`, `pnpm`, and any CLIs agents invoke.

Reload after edits:

```bash
sudo systemctl daemon-reload
sudo systemctl restart paperclip
journalctl -u paperclip -n 200 --no-pager
```

---

## Outcome

After migration:

- **PostgreSQL** runs on Supabase; the host no longer runs embedded Postgres workers (on the order of ~200 MB RAM or more may be freed, depending on load).
- **Attachments** live in object storage; EC2 disk growth from uploads slows or stops.

**Plan limits**: Supabase connection limits, disk, and egress depend on your tier. If the control plane was starved by quotas or network latency to Supabase, moving off embedded may not feel "fast" until those limits fit your traffic. Check the dashboard and plan docs for your tier before treating the migration as the complete performance fix.

You still should monitor Supabase quotas, backup strategy, and optional local backup pruning if you keep hourly dumps on disk elsewhere.

---

## References

- [Paperclip — Hosted PostgreSQL (Supabase)](https://docs.paperclip.ing/deploy/database#3-hosted-postgresql-supabase)
- [Paperclip — Storage](https://docs.paperclip.ing/deploy/storage)
- [Supabase — Database](https://supabase.com/docs/guides/database)
- [Supabase — Storage](https://supabase.com/docs/guides/storage)
