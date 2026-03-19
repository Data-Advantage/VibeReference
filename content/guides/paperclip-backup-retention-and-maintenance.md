# Paperclip Backup Retention and Maintenance

Paperclip creates hourly database backups (~125 MB each) with no built-in retention. Left unchecked, that's roughly 3 GB/day — it will fill your disk. This guide covers tiered backup retention, scheduling, disk maintenance, and troubleshooting.

## Backup Retention Script

The following script implements tiered retention: keeps the 24 most recent (hourly), 1 per day for 14 days, 1 per week for 4 weeks, and 1 per month forever.

Backups are stored in `~/.paperclip/instances/default/data/backups/`.

```bash
cat > ~/prune-backups.sh << 'SCRIPT'
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="$HOME/.paperclip/instances/default/data/backups"
DRY_RUN=false
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=true

if [[ ! -d "$BACKUP_DIR" ]]; then
  echo "Backup directory not found: $BACKUP_DIR"
  exit 1
fi

now=$(date +%s)

declare -A keep_hourly   # 24 most recent
declare -A keep_daily    # 1 per day, last 14 days
declare -A keep_weekly   # 1 per week, last 4 weeks
declare -A keep_monthly  # 1 per month, forever

# Collect all backup files sorted newest first
mapfile -t files < <(ls -1t "$BACKUP_DIR"/*.db 2>/dev/null || true)

if [[ ${#files[@]} -eq 0 ]]; then
  echo "No backups found."
  exit 0
fi

# Keep 24 most recent unconditionally
for i in "${!files[@]}"; do
  if [[ $i -lt 24 ]]; then
    keep_hourly["${files[$i]}"]=1
  fi
done

for f in "${files[@]}"; do
  # Extract timestamp from file modification time
  if [[ "$(uname)" == "Darwin" ]]; then
    mtime=$(stat -f %m "$f")
  else
    mtime=$(stat -c %Y "$f")
  fi
  age_days=$(( (now - mtime) / 86400 ))

  day_key=$(date -d "@$mtime" +%Y-%m-%d 2>/dev/null || date -r "$mtime" +%Y-%m-%d)
  week_key=$(date -d "@$mtime" +%Y-%W 2>/dev/null || date -r "$mtime" +%Y-%W)
  month_key=$(date -d "@$mtime" +%Y-%m 2>/dev/null || date -r "$mtime" +%Y-%m)

  # Daily: keep first seen per day within 14 days
  if [[ $age_days -le 14 ]] && [[ -z "${keep_daily[$day_key]:-}" ]]; then
    keep_daily[$day_key]="$f"
  fi

  # Weekly: keep first seen per week within 28 days
  if [[ $age_days -le 28 ]] && [[ -z "${keep_weekly[$week_key]:-}" ]]; then
    keep_weekly[$week_key]="$f"
  fi

  # Monthly: keep first seen per month, forever
  if [[ -z "${keep_monthly[$month_key]:-}" ]]; then
    keep_monthly[$month_key]="$f"
  fi
done

# Build set of all files to keep
declare -A keep_set
for f in "${!keep_hourly[@]}"; do keep_set["$f"]=1; done
for key in "${!keep_daily[@]}"; do keep_set["${keep_daily[$key]}"]=1; done
for key in "${!keep_weekly[@]}"; do keep_set["${keep_weekly[$key]}"]=1; done
for key in "${!keep_monthly[@]}"; do keep_set["${keep_monthly[$key]}"]=1; done

# Delete everything else
deleted=0
kept=0
for f in "${files[@]}"; do
  if [[ -z "${keep_set[$f]:-}" ]]; then
    if $DRY_RUN; then
      echo "[dry-run] would delete: $(basename "$f")"
    else
      rm "$f"
    fi
    ((deleted++))
  else
    ((kept++))
  fi
done

echo "$(date): kept=$kept deleted=$deleted total=${#files[@]}${DRY_RUN:+ (dry run)}"
SCRIPT

chmod +x ~/prune-backups.sh
```

Preview first, then run for real:

```bash
~/prune-backups.sh --dry-run
~/prune-backups.sh
```

---

## Scheduling the Script

### Linux (EC2) — cron

Amazon Linux 2023 doesn't include cron by default:

```bash
sudo dnf install -y cronie
sudo systemctl enable crond
sudo systemctl start crond
(crontab -l 2>/dev/null; echo '0 5 * * * /home/ec2-user/prune-backups.sh >> /home/ec2-user/prune-backups.log 2>&1') | crontab -
```

### macOS — launchd

```bash
cat > ~/Library/LaunchAgents/com.paperclip.prune-backups.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.paperclip.prune-backups</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-c</string>
    <string>$HOME/prune-backups.sh >> $HOME/prune-backups.log 2>&1</string>
  </array>
  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key>
    <integer>5</integer>
    <key>Minute</key>
    <integer>0</integer>
  </dict>
</dict>
</plist>
EOF

launchctl load ~/Library/LaunchAgents/com.paperclip.prune-backups.plist
```

---

## Maintenance

### Clear npm Cache

npm's cache can accumulate several GB over time:

```bash
npm cache clean --force
```

### Check Disk Usage

```bash
df -h
du -sh ~/.paperclip ~/.npm ~/.nvm ~/paperclip 2>/dev/null | sort -rh
```

---

## Troubleshooting

### Tailscale SSH Host Key Mismatch After Reboot

If SSH fails with "No ED25519 host key is known" after a reboot, clear the cached key:

```bash
# macOS
rm "$HOME/Library/Application Support/tailscale/ssh_known_hosts"

# Linux
rm ~/.ssh/known_hosts   # or remove just the offending line
```

### systemd Service Gets "Command Not Found" Errors

The `PATH` in the unit file must include every tool directory. Check the key paths table below and make sure each one is in your `Environment=PATH=...` line.

### Paperclip Won't Start After EBS Resize

If you resized the EBS volume but didn't extend the filesystem, you'll still see ENOSPC errors. Run `growpart` + `xfs_growfs` (see the [EC2 setup guide](/guides/run-paperclip-on-ec2-with-tailscale)).

---

## Key Paths Reference

Use this table when building the `PATH` for systemd or launchd — every directory containing a tool Paperclip calls must be listed.

| Tool | Linux (EC2) | macOS (Homebrew) |
| ---- | ----------- | ---------------- |
| node | ~/.nvm/versions/node/v24.14.0/bin/node | ~/.nvm/versions/node/v24.14.0/bin/node |
| pnpm | ~/.local/share/pnpm/pnpm | ~/.local/share/pnpm/pnpm |
| claude | ~/.local/bin/claude | ~/.local/bin/claude |
| wrangler | ~/.local/share/pnpm/wrangler | ~/.local/share/pnpm/wrangler |
| gh | /usr/bin/gh | /opt/homebrew/bin/gh |

Node version will vary — check with `which node` and adjust accordingly.
