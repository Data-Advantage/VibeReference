# Managing Paperclip Backup Files

[Paperclip](https://paperclip.ing/) is an open-source orchestration platform for AI agent companies. When self-hosted, Paperclip automatically creates hourly database backups to protect your data — but without a built-in retention policy, those backups can quietly fill your disk. This guide explains how to discover the problem, implement a tiered retention script, and automate cleanup so your server stays healthy.

## Table of Contents

- [The Problem: Unchecked Backup Growth](#the-problem-unchecked-backup-growth)
- [Checking Your Backup Usage](#checking-your-backup-usage)
- [The Solution: A Tiered Retention Script](#the-solution-a-tiered-retention-script)
- [How the Script Works](#how-the-script-works)
- [Running the Script](#running-the-script)
- [Automating with Cron](#automating-with-cron)
- [Expected Results](#expected-results)
- [Tips and Best Practices](#tips-and-best-practices)

## The Problem: Unchecked Backup Growth

Paperclip's embedded Postgres database creates hourly backup snapshots stored in:

```
~/.paperclip/instances/default/data/backups/
```

Each backup file is roughly **125 MB**. With 24 backups per day, that adds up to approximately **3 GB per day** — or over **90 GB per month**. On a typical cloud instance with limited disk space, this can fill your volume in a matter of weeks.

There is currently no built-in retention policy or configuration option in Paperclip to limit how many backups are kept. You need to manage this yourself.

## Checking Your Backup Usage

Before doing anything, check how much space your backups are consuming:

```bash
# Count backup files
ls ~/.paperclip/instances/default/data/backups/ | wc -l

# Check total disk usage
du -sh ~/.paperclip/instances/default/data/backups/
```

If you see hundreds of files consuming multiple gigabytes, it is time to set up a retention policy.

You can also check overall disk usage to see if this is urgent:

```bash
df -h /
```

## The Solution: A Tiered Retention Script

The following script implements a sensible tiered retention policy that balances recoverability with disk space:

| Tier | Retention | What is Kept |
|------|-----------|--------------|
| Hourly | Last 24 hours | All backups (24 files) |
| Daily | Last 14 days | 1 backup per day |
| Weekly | Last 4 weeks | 1 backup per week |
| Monthly | Forever | 1 backup per month |

This gives you granular recovery options for recent issues while keeping long-term snapshots for disaster recovery — all without unbounded growth.

Create the script at `~/prune-backups.sh`:

```bash
#!/usr/bin/env bash
#
# prune-backups.sh — Tiered retention for Paperclip database backups.
#
# Keeps:
#   - 24 most recent files           (hourly, covers ~1 day)
#   - 1 per day for the last 14 days
#   - 1 per week for the last 4 weeks
#   - 1 per month, forever
#
# Usage:
#   prune-backups.sh            # delete for real
#   prune-backups.sh --dry-run  # preview only

set -euo pipefail

BACKUP_DIR="${HOME}/.paperclip/instances/default/data/backups"
DRY_RUN=false
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=true

if [[ ! -d "$BACKUP_DIR" ]]; then
  echo "Backup directory not found: $BACKUP_DIR"
  exit 1
fi

# Collect all backup files sorted newest-first by modification time
mapfile -t ALL_FILES < <(ls -1t "$BACKUP_DIR")

TOTAL=${#ALL_FILES[@]}
if (( TOTAL == 0 )); then
  echo "No backup files found."
  exit 0
fi

echo "Found $TOTAL backup file(s) in $BACKUP_DIR"

# --- Build the "keep" set ---
declare -A KEEP          # associative array: filename -> reason
KEPT_DAYS=()             # track which calendar days are covered
KEPT_WEEKS=()            # track which calendar weeks are covered
KEPT_MONTHS=()           # track which calendar months are covered

now=$(date +%s)

for i in "${!ALL_FILES[@]}"; do
  file="${ALL_FILES[$i]}"
  filepath="$BACKUP_DIR/$file"
  file_epoch=$(stat -c %Y "$filepath" 2>/dev/null || stat -f %m "$filepath")
  age_sec=$(( now - file_epoch ))
  age_days=$(( age_sec / 86400 ))

  file_day=$(date -d "@$file_epoch" +%Y-%m-%d 2>/dev/null || date -r "$file_epoch" +%Y-%m-%d)
  file_week=$(date -d "@$file_epoch" +%G-W%V 2>/dev/null || date -r "$file_epoch" +%G-W%V)
  file_month=$(date -d "@$file_epoch" +%Y-%m 2>/dev/null || date -r "$file_epoch" +%Y-%m)

  reason=""

  # Tier 1: keep 24 most recent
  if (( i < 24 )); then
    reason="hourly (recent 24)"
  fi

  # Tier 2: keep 1 per day for last 14 days
  if [[ -z "$reason" ]] && (( age_days <= 14 )); then
    if [[ ! " ${KEPT_DAYS[*]:-} " =~ " ${file_day} " ]]; then
      reason="daily (14-day)"
      KEPT_DAYS+=("$file_day")
    fi
  fi

  # Tier 3: keep 1 per week for last 4 weeks
  if [[ -z "$reason" ]] && (( age_days <= 28 )); then
    if [[ ! " ${KEPT_WEEKS[*]:-} " =~ " ${file_week} " ]]; then
      reason="weekly (4-week)"
      KEPT_WEEKS+=("$file_week")
    fi
  fi

  # Tier 4: keep 1 per month, forever
  if [[ -z "$reason" ]]; then
    if [[ ! " ${KEPT_MONTHS[*]:-} " =~ " ${file_month} " ]]; then
      reason="monthly (forever)"
      KEPT_MONTHS+=("$file_month")
    fi
  fi

  if [[ -n "$reason" ]]; then
    KEEP["$file"]="$reason"
  fi
done

# --- Prune ---
deleted=0
freed=0

for file in "${ALL_FILES[@]}"; do
  if [[ -z "${KEEP[$file]:-}" ]]; then
    filepath="$BACKUP_DIR/$file"
    size=$(stat -c %s "$filepath" 2>/dev/null || stat -f %z "$filepath")

    if $DRY_RUN; then
      echo "[DRY RUN] Would delete: $file ($(( size / 1048576 )) MB)"
    else
      rm "$filepath"
    fi

    (( deleted++ )) || true
    (( freed += size )) || true
  fi
done

kept=$(( TOTAL - deleted ))
freed_mb=$(( freed / 1048576 ))

echo ""
echo "Summary:"
echo "  Total files:   $TOTAL"
echo "  Kept:          $kept"
echo "  Deleted:       $deleted"
echo "  Space freed:   ${freed_mb} MB"

if $DRY_RUN; then
  echo ""
  echo "(Dry run — no files were actually deleted.)"
fi
```

## How the Script Works

The script processes backups from newest to oldest and decides whether each file should be kept based on four tiers:

1. **Hourly tier**: The 24 most recent files are always kept, regardless of age. This ensures you have hour-by-hour recovery for the last day.

2. **Daily tier**: For backups between 1 and 14 days old, only the first (newest) backup for each calendar day is kept. The rest are pruned.

3. **Weekly tier**: For backups between 15 and 28 days old, only one backup per ISO week is kept.

4. **Monthly tier**: For anything older than 28 days, one backup per calendar month is kept forever.

Files that do not match any tier are deleted. Since the script walks newest-first, the "first seen" file for each day/week/month is always the most recent one in that period.

## Running the Script

Make the script executable:

```bash
chmod +x ~/prune-backups.sh
```

Always start with a dry run to preview what will be deleted:

```bash
~/prune-backups.sh --dry-run
```

Review the output. When you are satisfied, run it for real:

```bash
~/prune-backups.sh
```

## Automating with Cron

Running the script manually is fine for a one-time cleanup, but you should automate it to prevent backups from accumulating again.

### Install cronie (Amazon Linux / AL2023)

If you are on Amazon Linux 2023 or a similar minimal image, `cron` may not be installed:

```bash
sudo dnf install -y cronie
sudo systemctl enable --now crond
```

### Add the Cron Job

Open your crontab:

```bash
crontab -e
```

Add this line to run the script daily at 5:00 AM UTC:

```
0 5 * * * /home/your-user/prune-backups.sh >> /home/your-user/prune-backups.log 2>&1
```

Replace `/home/your-user` with your actual home directory path. The output is logged so you can verify it is working.

Verify the crontab was saved:

```bash
crontab -l
```

### Verify It Is Working

After the first scheduled run, check the log:

```bash
cat ~/prune-backups.log
```

You should see a summary showing how many files were kept and deleted.

## Expected Results

On a typical Paperclip instance that has been running for a few weeks without cleanup, you can expect significant savings. For example, an instance running for 9 days with 210 accumulated backups:

| Metric | Before | After |
|--------|--------|-------|
| Backup files | 210 | ~32 |
| Disk usage | ~26 GB | ~4 GB |
| Space freed | — | ~22 GB |

Over time, growth stabilizes. The total number of kept files grows very slowly — roughly one additional file per month for the monthly tier.

## Tips and Best Practices

- **Always dry-run first** when running the script for the first time or after modifying it.
- **Monitor disk space** periodically with `df -h` even after setting up automated pruning.
- **Keep the log file**: The cron log at `~/prune-backups.log` helps you verify the script is running and catch issues early. Consider rotating it periodically.
- **Back up to external storage**: If your Paperclip data is critical, consider copying the monthly backups to an external location (S3, another server) before relying solely on local retention.
- **Check after Paperclip updates**: Future versions of Paperclip may add built-in retention controls. Check the [Paperclip changelog](https://github.com/paperclipai/paperclip/releases) after updates.
- **Multiple instances**: If you run multiple Paperclip instances, each has its own backup directory under `~/.paperclip/instances/<name>/data/backups/`. You will need to adjust the `BACKUP_DIR` variable or run the script once per instance.
