# Update Paperclip to a Tagged Release over SSH

## 1. SSH into the server

```
ssh paperclip
```

## 2. Navigate to the repo

```
cd ~/paperclip
```

## 3. Check your current version

```
git describe --tags
```

## 4. Fetch new tags from origin

```
git fetch origin --tags
```

## 5. Checkout the target release

Replace the tag with your target version:

```
git checkout v2026.325.0
```

You'll see a "detached HEAD" message — that's expected and correct for running a tagged release.

## 6. Install dependencies

```
pnpm install
```

## 7. Restart Paperclip

### If running via systemd (survives reboots)

```
sudo systemctl restart paperclip
```

### If running via tmux

Reattach to your session:

```
tmux attach
```

Stop the running process with `Ctrl+C`, then restart:

```
pnpm paperclipai run
```

Detach when it's up: `Ctrl+B`, then `d`.

If there's no existing tmux session:

```
tmux new
cd ~/paperclip
pnpm paperclipai run
```

## 8. Verify

```
git describe --tags
```

### systemd

```
sudo systemctl status paperclip
journalctl -u paperclip -f
```

### tmux

Output is right in front of you in the tmux session. Look for `Server listening on 0.0.0.0:3100`. You can also check from another terminal:

```
curl -s http://localhost:3100/api/health
```

Press `Ctrl+C` to exit log tails once you've confirmed it's running cleanly.

## 9. Sanity check: Node path (systemd only)

If you've ever updated Node via nvm, make sure the service file still points to the right version:

```
which node
grep PATH /etc/systemd/system/paperclip.service
```

If the paths don't match, update the service file, then:

```
sudo systemctl daemon-reload
sudo systemctl restart paperclip
```

This doesn't apply to tmux — tmux inherits your shell environment, so it picks up the current Node automatically.

***

## Diagnostics

### Live logs

**systemd:**

```
journalctl -u paperclip -f
```

**tmux:** Reattach to the session — logs stream to stdout directly:

```
tmux attach
```

### Historical logs

**systemd:**

```
journalctl -u paperclip -n 200 --no-pager      # last 200 lines
journalctl -u paperclip --since "1 hour ago"    # time-based filter
journalctl -u paperclip --since "2026-03-25"    # since a specific date
```

**tmux:** Scroll up in the tmux session with `Ctrl+B`, then `[`, then arrow keys or PgUp. Press `q` to exit scroll mode.

### App log file

```
tail -f ~/paperclip.log
```

**Warning:** `paperclip.log` can contain stale output from prior runs. After a systemd restart, prefer `journalctl` for fresh logs. In tmux, the live output in your session is always current.

### Service status

**systemd:**

```
sudo systemctl status paperclip
```

**tmux:**

```
tmux ls                                        # is the session still alive?
curl -s http://localhost:3100/api/health        # is the app responding?
```

### Check what systemd is actually running

```
grep ExecStart /etc/systemd/system/paperclip.service
cat /etc/systemd/system/paperclip.service.d/override.conf   # systemd overrides
```

### Health check

```
curl -s http://localhost:3100/api/health
```

### Disk usage (backups can fill the disk)

```
df -h
du -sh ~/.paperclip/instances/default/data/backups/
```

***

## Troubleshooting

### EBADF: bad file descriptor, read (systemd only)

If you see this after a systemd restart, it means a process (usually `tsx watch` in dev mode) is trying to read stdin, which doesn't exist under systemd. This won't happen in tmux. Fix:

```
sudo systemctl edit paperclip
```

Add:

```
[Service]
StandardInput=null
```

Then:

```
sudo systemctl daemon-reload
sudo systemctl restart paperclip
```

### Local changes blocking checkout

If `git checkout` fails due to uncommitted changes:

```
git stash
git checkout v2026.325.0
git stash pop   # only if you want the changes back
```

### Confirming a healthy startup

Whether you're reading `journalctl` or watching tmux output, a good boot looks like:

* `9 passed` / `All checks passed!`
* `Embedded PostgreSQL ready`
* `Migrations already applied`
* `Server listening on 0.0.0.0:3100`

If you see `ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL` or `ELIFECYCLE`, scroll up — the root cause is always above those lines.

***

## Notes

* **Detached HEAD is fine.** Tagged releases aren't branches. You're pinned to an exact commit.
* **systemd: use `journalctl` after a restart, not `tail ~/paperclip.log`.** The log file may still show output from the previous (crashed) run, which is misleading.
* **tmux won't survive a reboot.** If your EC2 instance restarts, you'll need to manually start a new tmux session and run Paperclip again. systemd handles this automatically.
* **Backup retention is built-in now.** As of recent releases, the server reports `DB Backup enabled (every 60m, keep 30d)` at startup. Your cron job for pruning old backups is a secondary safety net.
* **`paperclipai run` auto-detects dev vs production mode.** On a headless server via systemd it should land on the right mode. If it enters dev mode unexpectedly, check `pnpm paperclipai run --help` for a production flag.
