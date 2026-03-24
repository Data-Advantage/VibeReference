# EC2 t4g vs t3: Which Instance Type to Use

AWS offers two burstable instance families that solo founders commonly reach for: **t3** (Intel/AMD x86) and **t4g** (AWS Graviton2 ARM). They provide the same vCPU and memory at each size, but t4g costs less because ARM chips are more power-efficient and AWS designs them in-house.

## Pricing Comparison

| Instance | vCPU | RAM | Architecture | Price/hour | Approx/month |
|----------|------|-----|-------------|------------|--------------|
| t3.large | 2 | 8 GB | x86_64 (Intel/AMD) | $0.0832 | ~$60.74 |
| t4g.large | 2 | 8 GB | ARM64 (Graviton2) | $0.0672 | ~$49.06 |

t4g is **~20% cheaper** for identical specs. The savings hold across all sizes in the family — nano, micro, small, medium, large, xlarge, and 2xlarge.

Both families use the same burstable CPU credit system. You get a baseline CPU allocation and earn credits when idle. If you consistently max out CPU, consider switching to an m-series or c-series instance instead.

## Why t4g Is Cheaper

AWS Graviton2 processors are custom ARM chips designed by AWS (via their Annapurna Labs acquisition). ARM cores use less power per cycle than x86, and because AWS builds the silicon themselves, they don't pay Intel or AMD licensing. Those savings pass through to pricing.

The performance is comparable to t3 for most workloads — and in some benchmarks, Graviton2 outperforms equivalent x86 instances.

## When to Use t4g (ARM)

Use t4g when your stack runs on ARM64. Most modern software does:

- **Languages**: Node.js, Python, Go, Java, Ruby, Rust, PHP — all have native ARM64 support
- **Databases**: PostgreSQL, MySQL, Redis, MongoDB — all run on ARM
- **Web servers**: Nginx, Caddy, Apache — all support ARM64
- **Containers**: Docker runs natively on ARM64 Linux

If you're deploying your own code (a Next.js app, a Python API, a Go service), t4g almost certainly works.

## When to Use t3 (x86)

Stick with t3 when:

- You need **x86-only binaries** — some commercial software or legacy tools only ship amd64 builds
- Your **Docker images only support linux/amd64** — check before deploying
- You're running **Windows** on EC2 (Graviton doesn't support Windows)
- A critical dependency has **no ARM64 package** and can't be compiled from source

## How to Check if Your Docker Images Support ARM64

Before moving to t4g, verify your images ship ARM builds:

```bash
# Check if an image supports ARM64
docker manifest inspect --verbose <image>:<tag> | grep architecture

# Look for entries with "arm64" — if you only see "amd64", the image won't run on t4g
```

If you're building your own images, add ARM64 support with multi-arch builds:

```bash
# Build for both architectures
docker buildx build --platform linux/amd64,linux/arm64 -t myapp:latest --push .
```

Most official Docker Hub images (node, python, postgres, nginx, redis) already ship multi-arch manifests that include ARM64.

## Storage Is Independent of Instance Type

A common misconception: storage behavior doesn't change between t3 and t4g. Both use the same EBS volumes (gp3, gp2, io1, etc.) attached over the network. If you're seeing data persistence issues, the problem is your storage configuration — not the instance type.

Check your storage setup:

```bash
# See attached volumes and sizes
lsblk

# Check filesystem usage
df -h

# Verify an EBS volume is attached (not instance store)
aws ec2 describe-volumes --filters Name=attachment.instance-id,Values=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
```

## Migrating from t3 to t4g

Switching instance types requires a few steps since the CPU architecture changes:

1. **Launch a new t4g instance** with an ARM64 AMI (e.g., Amazon Linux 2023 ARM or Ubuntu ARM64)
2. **Reinstall your software** — packages from an x86 AMI won't work on ARM
3. **Rebuild Docker images** for ARM64, or verify they ship multi-arch
4. **Reattach or copy EBS volumes** — your data volumes work on either architecture
5. **Test before cutting over** — run your app on the new instance and verify everything works

You cannot simply stop a t3 instance, change the type to t4g, and restart — the AMI architecture must match the instance architecture.

## How This Applies in Practice

The [EC2 setup guide](/guides/run-paperclip-on-ec2-with-tailscale) uses a **t4g.large** with 100 GB of storage. This runs the full Paperclip toolchain — Node.js, Docker, Claude Code, and the application server — on ARM64 without issues.

The t4g.large hits the sweet spot for a solo-founder workload: enough RAM (8 GB) for running dev tools and the app simultaneously, and the 20% savings over t3.large adds up over months of always-on hosting.

If you're starting fresh, default to t4g. Only reach for t3 if you hit a specific compatibility wall.
