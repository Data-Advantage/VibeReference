# How to Run Paperclip on EC2 with Tailscale HTTPS

Run Paperclip on an EC2 instance (or a Mac) and access it over Tailscale with real HTTPS — no port forwarding, no self-signed certs, no public internet exposure. Linux and macOS instructions included throughout.

## 1. EC2 Instance

- **AMI:** Amazon Linux 2023
- **Type:** `t4g.large` (ARM, cheaper)
- **Storage:** 100 GB (40 GB will run out — Paperclip's toolchain, workspace, and hourly database backups need room. Without backup pruning, expect ENOSPC errors within weeks. See Section 10.)

Connect via **EC2 Instance Connect**.

**If you need to expand storage later:** after resizing the EBS volume in the AWS console, the filesystem won't grow automatically. SSH in and run:

```bash
lsblk                              # confirm disk sees new size
sudo growpart /dev/nvme0n1 1       # grow the partition
sudo xfs_growfs /                  # extend the filesystem
df -h                              # confirm
```

If `growpart` fails with a stale GPT backup header (common on second+ resize), fix it with:

```bash
sudo gdisk /dev/nvme0n1            # type 'w', then 'Y' twice to rewrite headers
sudo sfdisk /dev/nvme0n1 --move-data --no-reread -N 1 <<< ", +"
sudo partprobe /dev/nvme0n1
sudo xfs_growfs /
```

---

## 2. Tailscale

In the [Tailscale admin console](https://login.tailscale.com/admin), turn on **MagicDNS** and **Serve**.

Install Tailscale: https://tailscale.com/docs/install/linux

Authenticate and join your tailnet, then run:

```bash
sudo tailscale set --hostname paperclip
sudo tailscale set --ssh
sudo tailscale serve --bg 3100
sudo hostnamectl set-hostname paperclip   # optional, sets the Linux hostname too
```

This tells Tailscale to proxy HTTPS traffic on your `*.ts.net` hostname to `localhost:3100`. Tailscale provisions a real TLS certificate via Let's Encrypt automatically — any device on your tailnet can reach the app at `https://paperclip.your-tailnet.ts.net` with no certificate warnings.

This is tailnet-only by default. No `--funnel` flag means no public internet exposure.

To check what's being served: `tailscale serve status`. To tear it down: `tailscale serve --https=443 off`.

The Tailscale hostname can revert to the default AWS IP-based name after a reboot. The `tailscale set --hostname` command is persistent, but running `hostnamectl` as well keeps things consistent.

### Serving HTTPS from a Mac instead

If you're running Paperclip on a MacBook, the same `tailscale serve` command works:

```bash
tailscale serve --https=443 3100
```

Your Mac's Tailscale hostname gets a real TLS cert and proxies to your local port. Any phone, laptop, or server on your tailnet hits it over HTTPS with zero config.

**Keep-awake note:** macOS drops the Tailscale connection when the machine sleeps. If you need it always available, disable sleep via System Settings → Energy, run `caffeinate -s`, or use a utility like Amphetamine. Closed-lid setups require clamshell mode or a keep-awake dongle.

---

## 3. tmux and Node

**Linux (EC2):**

```bash
sudo dnf update -y
sudo dnf install tmux -y
```

**macOS:**

```bash
brew install tmux
```

Install Node via nvm and pnpm (same on both):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
source ~/.bashrc   # or source ~/.zshrc on macOS
nvm install --lts
npm install -g pnpm@latest-10
```

---

## 3a. Additional CLI Tools

GitHub CLI and git config:

**Linux (EC2):**

```bash
sudo dnf install -y gh
```

**macOS:**

```bash
brew install gh
```

Then on both:

```bash
gh auth login
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

Cloudflare Wrangler (same on both):

```bash
pnpm install -g wrangler
```

The Wrangler auth token gets passed through the CTO agent config — no need to run `wrangler login` on the server.

---

## 4. Claude Code (Headless)

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**On your local machine (with a browser):**

```bash
claude setup-token
```

Get your account info:

```bash
cat ~/.claude.json | python3 -c "
import json,sys
d=json.load(sys.stdin)
print(json.dumps(d.get('oauthAccount'), indent=2))"
```

**Back on the EC2 instance**, add your token (replace with the real token):

```bash
echo 'export CLAUDE_CODE_OAUTH_TOKEN="sk-ant-oat01-your-token-here"' >> ~/.bashrc
```

Create `~/.claude.json` on the EC2 instance with your account details from the step above:

```json
{
  "hasCompletedOnboarding": true,
  "lastOnboardingVersion": "2.1.76",
  "oauthAccount": {
    "accountUuid": "your-account-uuid",
    "emailAddress": "your@email.com",
    "organizationUuid": "your-organization-uuid"
  }
}
```

Test:

```bash
source ~/.bashrc
claude
```

If it works, type `/quit` or `/exit` and continue.

---

## 5. Paperclip — Clone and Onboard

```bash
git clone https://github.com/paperclipai/paperclip.git
cd paperclip
pnpm install
pnpm paperclipai onboard --yes
```

When onboarding finishes, stop the process (Ctrl+C).

---

## 6. Paperclip Config for Tailscale

Edit the config:

```bash
nano ~/.paperclip/instances/default/config.json
```

Set the `server` section so it listens on all interfaces and allows your Tailscale hostname. Get the full hostname from **Tailscale admin → your machine → full domain** (e.g. `paperclip.kingfisher-halibut.ts.net`):

```json
"server": {
  "deploymentMode": "authenticated",
  "exposure": "private",
  "host": "0.0.0.0",
  "port": 3100,
  "allowedHostnames": ["paperclip.kingfisher-halibut.ts.net"],
  "serveUi": true
}
```

Save and exit (Ctrl+O, Enter, Ctrl+X).

---

## 7. Claim the Board

From the paperclip repo:

```bash
cd ~/paperclip
pnpm paperclipai run
```

In the logs, find a board-claim URL like:

```
http://localhost:3100/board-claim/581087dd...?code=70b9a720...
```

Replace `localhost` with your Tailscale hostname:

```
https://paperclip.kingfisher-halibut.ts.net/board-claim/581087dd...?code=70b9a720...
```

Since Tailscale Serve is handling HTTPS, use `https://` without a port number. Open this URL in a browser on a device that's on the same tailnet, create an account, and claim the board. Then stop Paperclip (Ctrl+C).

---

## 8. Run Paperclip as a Service

tmux works for quick testing but doesn't survive reboots. Use a system service instead.

### Linux (EC2) — systemd

```bash
sudo tee /etc/systemd/system/paperclip.service << 'EOF'
[Unit]
Description=Paperclip AI
After=network.target tailscaled.service

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/paperclip
ExecStart=/home/ec2-user/.local/share/pnpm/pnpm paperclipai run
Restart=always
RestartSec=10
Environment=HOME=/home/ec2-user
Environment=PATH=/home/ec2-user/.nvm/versions/node/v24.14.0/bin:/home/ec2-user/.local/share/pnpm:/home/ec2-user/.local/bin:/usr/local/bin:/usr/bin:/bin
Environment=CLAUDE_CODE_OAUTH_TOKEN=your-token-here

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable paperclip
sudo systemctl start paperclip
```

**Important:** systemd doesn't source `.bashrc`, so the `PATH` must explicitly include every directory containing tools Paperclip calls — node, pnpm, claude, gh, wrangler. Same for the Claude OAuth token. Without this, Paperclip runs but gets "command not found" errors.

**Better: use a systemd override for secrets.** Instead of putting your token directly in the main unit file, use an override:

```bash
sudo systemctl edit paperclip
```

This opens an editor. Add:

```ini
[Service]
Environment=CLAUDE_CODE_OAUTH_TOKEN=your-actual-token
```

Then remove the `CLAUDE_CODE_OAUTH_TOKEN` line from the main unit file. The override lives in `/etc/systemd/system/paperclip.service.d/override.conf` and won't be clobbered if you recreate the base service file.

```bash
sudo systemctl daemon-reload
sudo systemctl restart paperclip
```

Check status: `sudo systemctl status paperclip`
View logs: `journalctl -u paperclip -f`

### macOS — launchd

Create a plist:

```bash
cat > ~/Library/LaunchAgents/com.paperclip.ai.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.paperclip.ai</string>
  <key>WorkingDirectory</key>
  <string>/Users/YOUR_USER/paperclip</string>
  <key>ProgramArguments</key>
  <array>
    <string>/Users/YOUR_USER/.local/share/pnpm/pnpm</string>
    <string>paperclipai</string>
    <string>run</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>HOME</key>
    <string>/Users/YOUR_USER</string>
    <key>PATH</key>
    <string>/Users/YOUR_USER/.nvm/versions/node/v24.14.0/bin:/Users/YOUR_USER/.local/share/pnpm:/Users/YOUR_USER/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin</string>
    <key>CLAUDE_CODE_OAUTH_TOKEN</key>
    <string>your-token-here</string>
  </dict>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>/tmp/paperclip.log</string>
  <key>StandardErrorPath</key>
  <string>/tmp/paperclip.err</string>
</dict>
</plist>
EOF
```

Replace `YOUR_USER` with your macOS username, then load it:

```bash
launchctl load ~/Library/LaunchAgents/com.paperclip.ai.plist
```

Same rule as systemd: launchd doesn't source your shell profile, so the `PATH` must list every tool directory explicitly.

Check status: `launchctl list | grep paperclip`
View logs: `tail -f /tmp/paperclip.log`
Stop: `launchctl unload ~/Library/LaunchAgents/com.paperclip.ai.plist`

### Quick Testing with tmux

```bash
cd ~/paperclip
tmux new
pnpm paperclipai run
```

Detach: **Ctrl+B**, then **d**. Reattach: `tmux attach`. Just know it won't survive a reboot.

---

## 9. Workspace and CEO Bootstrap

```bash
mkdir ~/paperclip-workspace
```

In the Paperclip dashboard, log in and **bootstrap CEO**.

---

## 10. Backup Retention

Paperclip creates hourly database backups in `~/.paperclip/instances/default/data/backups/`. These can grow to ~3 GB/day and will silently fill your disk.

Check current backup size:

```bash
du -sh ~/.paperclip/instances/default/data/backups/
```

Prune backups older than 7 days:

```bash
find ~/.paperclip/instances/default/data/backups/ -type f -mtime +7 -print  # dry run
find ~/.paperclip/instances/default/data/backups/ -type f -mtime +7 -delete  # actually delete
```

Automate it with a daily cron job at 5:00 UTC:

```bash
crontab -e
# Add this line:
0 5 * * * find /home/ec2-user/.paperclip/instances/default/data/backups/ -type f -mtime +7 -delete
```

**macOS users:** launchd is the native scheduler, but running the `find` command manually or on a periodic basis works fine too.

---

## Key Paths Reference

These are the default install locations on an Amazon Linux 2023 EC2 instance. Use this table when building the `PATH` for systemd or launchd — every directory containing a tool Paperclip calls must be listed.

| Tool | Linux (EC2) | macOS (Homebrew) |
| ---- | ----------- | ---------------- |
| node | ~/.nvm/versions/node/v24.14.0/bin/node | ~/.nvm/versions/node/v24.14.0/bin/node |
| pnpm | ~/.local/share/pnpm/pnpm | ~/.local/share/pnpm/pnpm |
| claude | ~/.local/bin/claude | ~/.local/bin/claude |
| wrangler | ~/.local/share/pnpm/wrangler | ~/.local/share/pnpm/wrangler |
| gh | /usr/bin/gh | /opt/homebrew/bin/gh |

Node version will vary — check with `which node` and adjust accordingly.
