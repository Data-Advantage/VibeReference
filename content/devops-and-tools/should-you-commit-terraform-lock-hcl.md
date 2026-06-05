---
title: "Should You Commit .terraform.lock.hcl to Your Git Repository?"
description: "Yes, always. Here's what .terraform.lock.hcl contains, why it's not a state file, the cross-platform hash gotcha, and how to resolve merge conflicts cleanly."
---

# Should You Commit .terraform.lock.hcl?

Yes. Always. The Terraform dependency lock file is the record of exactly which provider versions and checksums your configuration resolved to, and it belongs in version control for the same reason every other lockfile does: so your teammates, your CI runners, and your production pipeline all install the same providers you tested against.

The confusion is understandable. Terraform also produces a `.tfstate` file that you must **never** commit, and the two get lumped together in people's heads as "Terraform's generated files." They are opposites. One is a dependency manifest that's safe to share; the other is live infrastructure state full of secrets. This article draws the line, then walks the platform-hash gotcha that bites teams running mixed macOS and Linux environments.

## The short answer

| File | Commit it? | Why |
|---|---|---|
| `.terraform.lock.hcl` | **Yes** | Pins provider versions and checksums for reproducible `terraform init`. |
| `.terraform/` directory | **No** | Local plugin cache and working data, regenerated on every init. |
| `*.tfstate` / `*.tfstate.*` | **No** | Live infrastructure state, often containing secrets. Use a remote backend. |
| `*.tfplan` | **No** | Ephemeral binary plan output. |
| `*.tfvars` (with secrets) | **No** | Environment-specific values; commit only secret-free example files. |

The lock file is the one Terraform-generated artifact that belongs in the repo. Everything else in that table is local, sensitive, or both.

## What .terraform.lock.hcl contains

When you run `terraform init`, Terraform resolves every provider your configuration requires against the version constraints you declared, then records the result. Each provider gets an HCL block:

```hcl
provider "registry.terraform.io/hashicorp/aws" {
  version     = "5.47.0"
  constraints = "~> 5.0"
  hashes = [
    "h1:abc123...",
    "zh:def456...",
    "zh:ghi789...",
  ]
}
```

Three pieces matter:

1. **`version`** — the exact provider version Terraform selected. Your config said `~> 5.0`; Terraform picked `5.47.0` and pinned it here.
2. **`constraints`** — the version constraint that was in effect when the selection happened. This is for humans reading the file; Terraform does not use it to pick versions at init time.
3. **`hashes`** — checksums for the provider packages, used to verify that the binary you run matches what you locked. A mismatch fails the init instead of silently running a tampered or unexpected build.

### `zh:` vs `h1:` hashes

Both verify provider authenticity, but they cover different artifacts:

- **`zh:`** ("zip hash") is the checksum of the provider's `.zip` archive as signed and published in the Terraform Registry's checksum files. It verifies the downloaded archive — the supply-chain integrity check.
- **`h1:`** is a checksum format that can verify an already-extracted provider binary, such as one served from a local plugin cache, not just the zip.

You'll see both in a healthy lock file. Terraform accepts either when validating a provider, so the presence of multiple hash formats is expected, not a bug.

## When terraform init writes the file

You never edit this file by hand. Terraform manages it entirely:

- **First `terraform init`** in a directory creates `.terraform.lock.hcl` and records every provider selection.
- **Subsequent `terraform init`** reads the existing selections and prefers them, as long as they still satisfy your constraints. This is what makes builds reproducible — init doesn't drift to a newer patch just because one shipped.
- **`terraform init -upgrade`** deliberately re-resolves to the newest versions your constraints allow and rewrites the affected blocks. This is the only routine command that bumps versions, which makes the resulting lock-file diff a clean, reviewable record of exactly what changed.
- Removing the last use of a provider from both config and state drops its entry on the next init.

The file always lives in the root module's working directory and is always named `.terraform.lock.hcl`.

## Why commit it: reproducible provider versions

Without the lock file in version control, every `terraform init` resolves providers fresh against your constraints. You declare `~> 5.0`; today that's `5.47.0`, next month it's `5.52.0`. One teammate inits today, another inits next month, and now they're running different provider versions against the same infrastructure — with all the subtle behavioral differences that implies between provider releases.

With the lock file committed:

- Every machine, CI runner, and deploy box installs the exact provider versions recorded.
- Provider upgrades become explicit, reviewed pull requests. A bump from `5.47.0` to `5.52.0` shows up as a diff someone approves, not a surprise that lands whenever a runner happens to re-resolve.
- The `hashes` give you supply-chain verification: the provider binary is checked against the recorded checksum before it runs.

This is the same reasoning behind committing `package-lock.json`, `Cargo.lock`, or `poetry.lock`. If your repo is the thing that gets run, the lockfile belongs in it.

## The cross-platform hash gotcha

This is the one that surprises teams, and it's worth understanding before it produces a noisy diff.

Provider packages are platform-specific. The `hashicorp/aws` build for Linux is a different artifact with a different checksum than the build for Apple Silicon macOS. By default, a lock file created by `terraform init` records hashes **only for the platform that ran the command**.

So picture a developer on a MacBook (`darwin_arm64`) who runs `terraform init` and commits the lock file. The hashes are macOS-only. Now CI runs on Linux (`linux_amd64`), finds no matching hash, re-resolves, and either rewrites the lock file (a spurious diff on every CI run) or fails verification. The fix is to pre-populate hashes for every platform your team and pipeline use:

```bash
terraform providers lock \
  -platform=linux_amd64 \
  -platform=linux_arm64 \
  -platform=darwin_amd64 \
  -platform=darwin_arm64 \
  -platform=windows_amd64
```

Common platform strings:

| Platform string | Environment |
|---|---|
| `linux_amd64` | Most CI runners, x86 servers |
| `linux_arm64` | ARM CI runners, Graviton |
| `darwin_amd64` | Intel Macs |
| `darwin_arm64` | Apple Silicon Macs |
| `windows_amd64` | Windows developer machines |

Run this once, commit the result, and the lock file carries valid hashes for every platform — no more re-resolution churn. Re-run it after any `terraform init -upgrade` to keep the cross-platform set complete.

## It locks providers, not modules

A common misconception: the lock file does not pin module versions. It tracks **provider** dependencies only.

For modules, Terraform selects the newest version satisfying your `version` constraint at init time, every time, with nothing recording that choice. If you want a module pinned, you pin it directly in the `module` block:

```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "= 5.8.1"   # exact pin — the lock file won't do this for you
}
```

Use an exact constraint (`=`) for modules you want frozen. Relying on the lock file to do it will leave you drifting.

## State files are the opposite — never commit them

The reason this question causes confusion is the `.tfstate` file, which lives in the same project and must be kept *out* of git. The two could not be more different:

| | `.terraform.lock.hcl` | `*.tfstate` |
|---|---|---|
| Purpose | Pin provider versions and checksums | Record live infrastructure state |
| Contents | Provider names, versions, hashes | Resource IDs, attributes, outputs — often secrets |
| Sensitivity | Not sensitive (metadata) | Highly sensitive |
| In version control? | **Yes** | **No** — use a remote backend |
| Managed by | `terraform init` | `terraform apply`, `terraform state` |

State files routinely contain database passwords, private IPs, generated credentials, and resource identifiers. Committing one is a security incident, not a style choice. Store state in a remote backend (S3 with DynamoDB locking, GCS, Terraform Cloud, etc.) and keep `*.tfstate` and `*.tfstate.*` in `.gitignore`. The lock file is config; the state file is operational data. Commit the first, never the second.

## Merge conflicts in .terraform.lock.hcl

Conflicts happen when two branches both upgrade providers. Treat the file as machine-generated but authoritative — resolve the structure, then let Terraform recompute:

```bash
# 1. Resolve the text conflict by keeping the union of provider blocks.
#    If the same provider differs, keep the version you intend to ship
#    (usually the newer one, if your constraints allow it).

# 2. Let Terraform normalize and re-verify the hashes:
terraform init -upgrade

# 3. If you support multiple platforms, restore the full hash set:
terraform providers lock -platform=linux_amd64 -platform=darwin_arm64

git add .terraform.lock.hcl
git merge --continue
```

Do not hand-edit individual hashes — Terraform will recompute them, and a wrong hash just fails verification. Resolve which *providers* and *versions* survive the merge, then run init and let the tool fill in the checksums.

## The correct .gitignore

A Terraform `.gitignore` that commits the lock file and excludes everything sensitive or local:

```gitignore
# Local Terraform working directory and plugin cache
.terraform/

# State files — NEVER commit (contain secrets)
*.tfstate
*.tfstate.*

# Plan output
*.tfplan

# Crash logs
crash.log
crash.*.log

# Variable files with secrets
*.tfvars
*.auto.tfvars
# (commit a secret-free terraform.tfvars.example instead)

# Do NOT ignore .terraform.lock.hcl — it must be committed
```

Note the boundary: `.terraform/` (the directory, local cache) is ignored, but `.terraform.lock.hcl` (the file) is committed. They look similar and do opposite things. If you find `.terraform.lock.hcl` in your `.gitignore`, remove it — that's the mistake this whole article exists to prevent.

## The bottom line

Commit `.terraform.lock.hcl`. It pins your provider versions and checksums so every environment resolves the same dependencies, and it turns provider upgrades into reviewable diffs instead of silent drift. Pre-populate cross-platform hashes with `terraform providers lock -platform=...` if your team mixes operating systems, resolve merge conflicts by re-running `terraform init` rather than hand-editing, and remember it locks providers only — pin modules yourself with exact version constraints.

The file that must stay *out* of git is `.tfstate`, not the lock file. Keep state in a remote backend, keep the lock file in version control, and the two will stop getting confused.

## See Also

- [Lock Files: Commit or Ignore?](./lock-files-commit-or-ignore) — the cross-ecosystem decision frame
- [Should You Commit a Dockerfile?](./should-you-commit-dockerfile) — another infrastructure file that belongs in the repo
- [.env Files: The Complete Guide to Environment Variables in Git](./env-files-git-guide) — the other "never commit secrets" file in your infra stack
- [The Developer's Guide to What Belongs in Your Git Repository](./git-repository-files-guide) — full reference for committed-vs-ignored files
