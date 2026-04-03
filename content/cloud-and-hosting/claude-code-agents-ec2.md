# Running Claude Code Agents on EC2: Beyond the Basics

You have Claude Code running on an EC2 instance. The initial setup is done — Node.js installed, API keys configured, maybe Tailscale for secure access. Now you need it to run reliably as a production service: surviving reboots, rotating logs, recovering from crashes, and handling multiple agents without running out of resources.

This guide covers the operational side of running Claude Code agents on EC2 — the things you learn after the first week of running agents in production. Based on operating a fleet of 10+ agents on t4g instances running 24/7.

## Instance Sizing

### Why t4g.large Is the Sweet Spot

For AI agent workloads, `t4g.large` (2 vCPU, 8 GB RAM, ARM64) provides the best cost-per-agent ratio:

| Instance | vCPU | RAM | Monthly Cost | Agents Supported |
|----------|------|-----|-------------|------------------|
| t4g.medium | 2 | 4 GB | ~$25 | 1-3 |
| t4g.large | 2 | 8 GB | ~$49 | 3-8 |
| t4g.xlarge | 4 | 16 GB | ~$98 | 8-15 |

Agent workloads are IO-bound, not CPU-bound. Most of the time, agents are waiting for API responses from Claude or running lightweight CLI tools (git, npm, file operations). CPU usage spikes briefly during tool execution but stays low during the thinking and API call phases.

RAM is the constraint. Each agent process, its Node.js runtime, and the tools it spawns consume memory. At 8 GB, a t4g.large comfortably runs 5-6 concurrent agents with room for the operating system and build tools.

### ARM vs. x86

ARM (Graviton) instances are 20% cheaper than equivalent x86 instances. Claude Code and its dependencies (Node.js, git, Python) all run natively on ARM64. There is no performance penalty and the cost savings compound monthly.

The only reason to use x86 is if your agent's workflow depends on tools that lack ARM support — which is increasingly rare.

## Systemd Service Management

### Creating a Service for Each Agent

Run each agent as a systemd service for automatic restart on crash and start-on-boot:

```ini
# /etc/systemd/system/agent-engineer.service
[Unit]
Description=Claude Code Agent - Engineer
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/workspace
ExecStart=/usr/bin/node /path/to/agent-runner.js
Restart=always
RestartSec=30
Environment=ANTHROPIC_API_KEY=sk-ant-...
Environment=AGENT_ROLE=engineer

# Resource limits
MemoryMax=2G
CPUQuota=80%

# Logging
StandardOutput=journal
StandardError=journal
SyslogIdentifier=agent-engineer

[Install]
WantedBy=multi-user.target
```

Key settings:

- **`Restart=always`**: The agent restarts automatically after crashes. Combined with `RestartSec=30`, this gives a 30-second cooldown between restarts to prevent rapid-fire restart loops.
- **`MemoryMax=2G`**: Prevents a single runaway agent from consuming all system memory. If the agent exceeds 2 GB, systemd kills it and restarts.
- **`CPUQuota=80%`**: Prevents a single agent from monopolizing the CPU during build operations.

### Managing Multiple Agents

For fleets, use a systemd template:

```ini
# /etc/systemd/system/agent@.service
[Unit]
Description=Claude Code Agent - %i
After=network-online.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/workspace
ExecStart=/usr/bin/node /path/to/agent-runner.js --role %i
Restart=always
RestartSec=30
EnvironmentFile=/etc/agent-env/%i.env
MemoryMax=2G
StandardOutput=journal
StandardError=journal
SyslogIdentifier=agent-%i

[Install]
WantedBy=multi-user.target
```

Then manage agents with:

```bash
# Start individual agents
sudo systemctl start agent@engineer
sudo systemctl start agent@researcher
sudo systemctl start agent@cto

# Check status of all agents
sudo systemctl list-units 'agent@*'

# View logs for a specific agent
journalctl -u agent@engineer -f

# Restart an agent
sudo systemctl restart agent@researcher
```

Environment files (`/etc/agent-env/engineer.env`) keep secrets out of service files:

```bash
ANTHROPIC_API_KEY=sk-ant-...
AGENT_ROLE=engineer
AGENT_HOME=/home/ec2-user/agents/engineer
```

## Log Management

### The Problem

Agent logs are verbose. Each heartbeat generates output from the agent's reasoning, tool calls, API responses, and status updates. Without log rotation, a single agent can fill a 100 GB disk in weeks.

### Log Rotation with journald

If using systemd journal (recommended), configure rotation in `/etc/systemd/journald.conf`:

```ini
[Journal]
SystemMaxUse=2G
SystemMaxFileSize=256M
MaxRetentionSec=7d
```

This caps total journal size at 2 GB, individual files at 256 MB, and retains logs for seven days. Apply with:

```bash
sudo systemctl restart systemd-journald
```

### Structured Log Queries

Use journald's filtering to debug specific issues:

```bash
# All agent logs from the last hour
journalctl -u 'agent@*' --since '1 hour ago'

# Engineer agent errors only
journalctl -u agent@engineer -p err --since today

# Grep for specific patterns across all agents
journalctl -u 'agent@*' --since '24 hours ago' | grep -i "error\|failed\|timeout"

# Follow all agent logs in real time
journalctl -u 'agent@*' -f
```

## Handling Crashes and Recovery

### Real Incidents

These are real failures from running an agent fleet on EC2:

**Disk full — total system failure.** The instance ran out of disk space. Every command failed — `mkdir` fails, Bash tool cannot execute, the agent cannot reach its own API, cannot run git, cannot free space. The entire fleet went silent with no visible error. The fix required human SSH access to clean up large artifacts and debug logs. Prevention: monitor disk at 85% usage and alert before it is critical. A 100 GB EBS volume is the minimum for a multi-agent setup with workspace clones.

**Git identity mismatch — all deploys blocked.** The EC2 instance committed as `ec2-user@hostname` by default. Vercel requires commits to come from a GitHub-mapped email address. Result: all 16 projects failed to deploy simultaneously. The fix was two commands:

```bash
git config --global user.name "yourgithubusername"
git config --global user.email "you@yourdomain.com"
```

This is Phase 0 of any EC2 agent setup. Do it before anything else. If you skip it, you will discover the problem only when your first deploy fails — and by then, multiple agents may have committed code that cannot ship.

### Common Crash Causes

| Cause | Symptom | Fix |
|-------|---------|-----|
| OOM (out of memory) | Agent killed by kernel | Increase `MemoryMax` or reduce concurrent agents |
| API timeout | Agent hangs then restarts | Add timeout handling in runner script |
| Disk full | All commands fail silently | Set up disk monitoring alerts at 85% |
| Network interruption | API call failures | `Restart=always` handles this; transient |
| Node.js crash | Unhandled exception | Check logs, fix bug, restart |
| Git identity mismatch | All deploys fail | Set global git config on instance setup |

### Automatic Recovery

Systemd handles most recovery automatically with `Restart=always`. For more sophisticated recovery:

```bash
# Check restart count (too many restarts = underlying issue)
systemctl show agent@engineer -p NRestarts

# If an agent is restart-looping, stop it and investigate
sudo systemctl stop agent@engineer
journalctl -u agent@engineer --since '1 hour ago' -n 100
```

If an agent restarts more than five times in 10 minutes, the issue is not transient — investigate the root cause instead of letting it loop.

### Health Monitoring

A simple health check script that runs on cron:

```bash
#!/bin/bash
# /usr/local/bin/check-agents.sh

AGENTS="engineer researcher cto cmo ceo"

for agent in $AGENTS; do
  if ! systemctl is-active --quiet "agent@$agent"; then
    echo "ALERT: agent@$agent is not running"
    # Send notification (Slack webhook, email, etc.)
  fi
done

# Check disk usage
DISK_USAGE=$(df / --output=pcent | tail -1 | tr -d ' %')
if [ "$DISK_USAGE" -gt 85 ]; then
  echo "ALERT: Disk usage at ${DISK_USAGE}%"
fi

# Check memory pressure
MEM_AVAILABLE=$(awk '/MemAvailable/ {print $2}' /proc/meminfo)
if [ "$MEM_AVAILABLE" -lt 524288 ]; then  # Less than 512MB
  echo "ALERT: Low memory - ${MEM_AVAILABLE}kB available"
fi
```

Schedule it with cron:

```bash
# Check every 5 minutes
*/5 * * * * /usr/local/bin/check-agents.sh >> /var/log/agent-health.log 2>&1
```

## Disk Management

### What Fills Up Disk

On an agent-heavy EC2 instance, disk fills from:

1. **Git repository clones**: Each agent working on a different repo maintains its own working copy
2. **npm/node_modules**: Dependencies for every project
3. **Build artifacts**: `.next/` directories, compiled output
4. **Agent logs**: Verbose output from heartbeats
5. **Database backups**: If running a local database with automated backups

### Preventing Disk Issues

```bash
# Monitor disk usage by directory
du -sh /home/ec2-user/workspace/*/node_modules 2>/dev/null | sort -h
du -sh /home/ec2-user/workspace/*/.next 2>/dev/null | sort -h

# Clean npm caches
npm cache clean --force

# Remove stale build artifacts
find /home/ec2-user/workspace -name '.next' -type d -mtime +7 -exec rm -rf {} +

# Prune old git objects
find /home/ec2-user/workspace -name '.git' -type d -exec git -C {} gc --prune=now \;
```

Add a weekly cleanup cron job:

```bash
# Weekly cleanup on Sundays at 3 AM
0 3 * * 0 /usr/local/bin/cleanup-agent-workspace.sh
```

### Expanding Storage

If you need more disk:

1. Resize the EBS volume in the AWS console
2. SSH in and extend the filesystem:

```bash
lsblk                          # Confirm disk sees new size
sudo growpart /dev/nvme0n1 1   # Grow the partition
sudo xfs_growfs /              # Extend the filesystem
df -h                          # Confirm
```

## Security Considerations

### API Key Management

Never store API keys in service files or git repositories. Use environment files with restricted permissions:

```bash
# Create env directory
sudo mkdir -p /etc/agent-env
sudo chmod 700 /etc/agent-env

# Create per-agent env files
sudo touch /etc/agent-env/engineer.env
sudo chmod 600 /etc/agent-env/engineer.env
```

### Network Isolation

Agents do not need inbound internet access. Lock down the security group:

- **Inbound**: SSH (port 22) from your IP only, or use Tailscale/SSM and block all inbound
- **Outbound**: HTTPS (port 443) only — agents need to reach API endpoints
- **No public IP**: Use Tailscale or AWS Systems Manager for access instead

### Process Isolation

Each agent should run as its own user or in its own cgroup to prevent one compromised agent from affecting others:

```ini
# In the systemd service
User=agent-engineer
Group=agents
ProtectHome=true
ProtectSystem=strict
ReadWritePaths=/home/agent-engineer/workspace
```

## Performance Tuning

### Reducing Latency

Agent performance is dominated by API call latency, not local compute. But local bottlenecks still matter:

- **Git operations**: Large repos slow down git status/diff. Keep working copies clean with periodic `git gc`.
- **npm install**: Cold installs are expensive. Use `npm ci` (faster, deterministic) and preserve `node_modules` between sessions.
- **File system**: EBS gp3 volumes with default IOPS are sufficient. Only provision additional IOPS if you see high IO wait in `top`.

### Concurrent Agent Limits

A practical formula for how many agents to run on a given instance:

```
Max agents ≈ (Available RAM - 1GB for OS) / (1.5GB per agent)
```

| Instance | RAM | Max Concurrent Agents |
|----------|-----|-----------------------|
| t4g.medium | 4 GB | 2 |
| t4g.large | 8 GB | 4-5 |
| t4g.xlarge | 16 GB | 10 |
| t4g.2xlarge | 32 GB | 20 |

These are conservative estimates. Actual limits depend on workload — agents running build commands use more memory than agents doing research or writing content.

## Key Takeaways

- **t4g.large is the sweet spot** for 3-8 agents. ARM is 20% cheaper with no performance penalty.
- **Use systemd templates** for managing agent fleets. One service template, multiple instances.
- **Cap logs at 2 GB** with journald rotation. Agent logs fill disks fast without limits.
- **Monitor disk, memory, and restart counts.** The most common production issues are disk full and OOM kills.
- **Store API keys in restricted environment files**, never in service files or git.
- **Budget ~1.5 GB RAM per agent** when sizing instances. RAM is the constraint, not CPU.
