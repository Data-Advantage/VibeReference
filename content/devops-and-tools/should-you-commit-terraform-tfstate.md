---
title: "Should You Commit terraform.tfstate to Your Git Repository?"
description: "No, never. terraform.tfstate stores live infrastructure state in plaintext — including secrets. Here's why, how to use a remote backend, and what to do if it's already committed."
---

# Should You Commit terraform.tfstate?

No. Never. The Terraform state file is a live record of your infrastructure that stores resource attributes — including passwords, private keys, and connection strings — in plaintext JSON. Committing it to git is a security incident and a collaboration trap, not a style choice. State belongs in a remote backend, and `*.tfstate` belongs in your `.gitignore`.

The confusion usually comes from the lock file. Terraform also produces `.terraform.lock.hcl`, which you **must** commit. The two files live in the same directory and get lumped together as "Terraform's generated files," but they are opposites: one is a safe-to-share dependency manifest, the other is sensitive operational data. This article explains why state must stay out of git, where it should go instead, and how to recover if it's already in your history.

## The short answer

| File | Commit it? | Why |
|---|---|---|
| `terraform.tfstate` | **No** | Live infrastructure state in plaintext, often containing secrets. |
| `terraform.tfstate.backup` | **No** | Automatic backup of the previous state — same sensitivity. |
| `*.tfstate.*` (workspaces) | **No** | Per-workspace state files, same risk profile. |
| `.terraform/` directory | **No** | Local plugin cache and backend config, regenerated on init. |
| `.terraform.lock.hcl` | **Yes** | Provider version and checksum pins — safe and required. |

Everything in that table except the lock file is local, sensitive, or both. State files are the most dangerous of the set because they leak credentials.

## What terraform.tfstate contains

State is how Terraform maps your configuration to real-world resources. After `terraform apply`, it writes a JSON document recording every resource it manages: the resource type, its provider-assigned ID, and the full set of attributes it read back from the API.

```json
{
  "resources": [
    {
      "type": "aws_db_instance",
      "name": "main",
      "instances": [
        {
          "attributes": {
            "endpoint": "main.abc123.us-east-1.rds.amazonaws.com:5432",
            "username": "admin",
            "password": "S3cr3t-Pa55w0rd",
            "id": "db-XYZ"
          }
        }
      ]
    }
  ]
}
```

That `password` is not redacted. Terraform stores attribute values as the API returns them, and many resources return secrets: database passwords, generated access keys, TLS private keys, initial admin tokens, and connection strings. Marking a variable `sensitive` hides it from CLI output — it does **not** encrypt or omit it from state. The plaintext value is right there in the file.

This is the core reason state can't go in git: a repository is replicated to every clone, every CI runner, and every fork. Committing state broadcasts those secrets to everyone with read access, permanently, in your history.

## Why a remote backend, not git

Even setting secrets aside, git is the wrong storage mechanism for state. State is mutable operational data that two people can change at the same time; git is for source you merge deliberately. The mismatch produces three failure modes that a remote backend solves:

- **State locking.** When two engineers run `terraform apply` at once against the same git-stored state, they race. One overwrites the other's changes, and Terraform's view of reality silently corrupts. Remote backends acquire a lock before writing, so the second apply waits instead of colliding.
- **Merge conflicts you can't resolve by hand.** State is a single large JSON document. A git merge conflict in it is unresolvable — you can't eyeball which resource version is correct, and a wrong choice points Terraform at the wrong infrastructure. Remote backends never produce text merge conflicts because there's one authoritative copy.
- **Encryption at rest.** Backends like S3 or GCS encrypt the bucket; git does not encrypt your repo. The secrets in state stay protected.

## Where state should live

Pick a remote backend and configure it in a `backend` block. The common choices:

| Backend | Locking | Best for |
|---|---|---|
| **S3 + DynamoDB** | DynamoDB table (or S3 native locking) | AWS shops; the default for most teams. |
| **Google Cloud Storage** | Built-in object locking | GCP-based infrastructure. |
| **Azure Blob Storage** | Built-in lease-based locking | Azure-based infrastructure. |
| **Terraform Cloud / HCP** | Built-in | Teams wanting a managed UI, run history, and policy gates. |

A typical AWS configuration:

```hcl
terraform {
  backend "s3" {
    bucket         = "mycompany-terraform-state"
    key            = "prod/network/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

With this in place, `terraform.tfstate` never appears on your local disk as the source of truth — Terraform reads and writes the S3 object, takes a DynamoDB lock around each operation, and encrypts the bucket. Your repo holds only configuration and the lock file. (As of late 2025, S3 supports native state locking, letting you drop the DynamoDB table; check the current AWS backend docs for your Terraform version.)

## The correct .gitignore

Use HashiCorp's recommended Terraform `.gitignore`, which excludes state and local working files while keeping the lock file:

```gitignore
# Local .terraform directories and plugin cache
**/.terraform/*

# State files — NEVER commit (contain secrets)
*.tfstate
*.tfstate.*

# Crash log files
crash.log
crash.*.log

# Variable files that may contain secrets
*.tfvars
*.tfvars.json

# Override files (local-only)
override.tf
override.tf.json
*_override.tf
*_override.tf.json

# Plan output
*.tfplan

# Do NOT ignore .terraform.lock.hcl — it must be committed
```

Note the boundary: `.terraform/` (the local cache directory) and `*.tfstate` are ignored, but `.terraform.lock.hcl` is committed. The directory and the lock file look similar and do opposite things.

## What if it's already committed?

If `terraform.tfstate` is already in your repository, treat it as a credential leak, not a cleanup chore. The fix has two parts, in this order:

1. **Rotate every secret the state touched.** The values are now in your git history and in every clone. Rotate database passwords, regenerate access keys, reissue any TLS keys or tokens stored in the affected resources. Assume they're compromised — removing the file later does not un-leak what was already pushed.
2. **Migrate to a remote backend, then purge the file from history.** Add a `backend` block, run `terraform init` to migrate the existing state into the backend, then remove the file from tracking and from history:

```bash
# Stop tracking it going forward
git rm --cached terraform.tfstate terraform.tfstate.backup
echo "*.tfstate" >> .gitignore
echo "*.tfstate.*" >> .gitignore
git commit -m "Remove Terraform state from version control"

# Purge it from all history (rewrites history — coordinate with your team)
git filter-repo --path terraform.tfstate --invert-paths
```

History rewriting with `git filter-repo` (or BFG Repo-Cleaner) is destructive and forces every collaborator to re-clone. Do it deliberately, and only after the secrets are rotated — because anyone who pulled before the rewrite still has the old values.

## State vs. the lock file: the table to remember

The whole reason this question exists is that `terraform.tfstate` and `.terraform.lock.hcl` get confused. They are opposites:

| | `terraform.tfstate` | `.terraform.lock.hcl` |
|---|---|---|
| Purpose | Record live infrastructure state | Pin provider versions and checksums |
| Contents | Resource IDs, attributes, secrets | Provider names, versions, hashes |
| Sensitivity | Highly sensitive | Not sensitive (metadata) |
| In version control? | **No** — use a remote backend | **Yes** |
| Managed by | `terraform apply`, `terraform state` | `terraform init` |

Commit the lock file; never commit the state file. If you remember nothing else, remember which column each one is in.

## The bottom line

Keep `terraform.tfstate` out of git, always. It stores live infrastructure state in plaintext, including secrets that a repository would broadcast to every clone and CI runner, and it can't be safely shared or merged through version control anyway. Put state in a remote backend — S3 with locking, GCS, Azure Blob, or Terraform Cloud — so you get encryption at rest, state locking against concurrent applies, and a single authoritative copy with no merge conflicts.

If state is already committed, rotate the exposed secrets first, migrate to a backend, then scrub it from history. And don't confuse it with `.terraform.lock.hcl`, which is the one Terraform-generated file that *does* belong in your repo.

## See Also

- [Should You Commit .terraform.lock.hcl?](./should-you-commit-terraform-lock-hcl) — the Terraform file that *does* belong in your repo
- [.env Files: The Complete Guide to Environment Variables in Git](./env-files-git-guide) — the other "never commit secrets" decision in your stack
- [Secret Management Providers](./secret-management-providers) — where credentials should live instead of in files
- [The Developer's Guide to What Belongs in Your Git Repository](./git-repository-files-guide) — full reference for committed-vs-ignored files
