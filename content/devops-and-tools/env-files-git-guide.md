# .env Files: The Complete Guide to Environment Variables in Git

This is the number one security mistake developers make with git: committing a `.env` file that contains real API keys, database passwords, or authentication tokens.

It happens more often than you'd think. GitGuardian's 2024 State of Secrets Sprawl report found over 12.8 million new secrets exposed in public GitHub repositories in a single year. Many of those were in `.env` files or similar configuration files that were committed by mistake.

The damage is immediate. Automated bots scan public repositories for secrets within minutes of a push. Leaked AWS keys can generate thousands of dollars in charges before you notice. Leaked database credentials can expose customer data. And even after you delete the file, it lives in git history forever — accessible to anyone who clones the repo.

This guide covers the right pattern for managing environment variables in git, with practical examples for every scenario.

## The golden rule

**Never commit a file containing real secrets to git.** Full stop.

This means:
- `.env` — never commit
- `.env.local` — never commit
- `.env.production` — never commit
- `.env.development` with real API keys — never commit
- Any file with real passwords, tokens, or keys — never commit

It does not matter if the repository is private. Private repos get cloned to laptops, forked to personal accounts, and migrated between services. Secrets in git history are effectively permanent and portable.

## The `.env.example` pattern

Every project should use this two-file pattern:

**`.env.example`** — committed to git. Shows the structure and variable names. Contains placeholder values or documentation, never real secrets.

**`.env`** — ignored by git. Contains real values specific to each developer's environment.

Here's what this looks like in practice:

```bash
# .env.example (committed — shows what the project needs)
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/myapp_dev

# Authentication
CLERK_SECRET_KEY=sk_test_your_clerk_key_here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here

# Payments
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here

# External APIs
OPENAI_API_KEY=sk-your-openai-key-here
RESEND_API_KEY=re_your_resend_key_here

# App config (non-secret, but environment-specific)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```bash
# .env (gitignored — real values, never committed)
DATABASE_URL=postgresql://michael:real_password@localhost:5432/myapp_dev
CLERK_SECRET_KEY=sk_test_abc123realkey
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_def456realkey
STRIPE_SECRET_KEY=sk_test_ghi789realkey
STRIPE_WEBHOOK_SECRET=whsec_jkl012realkey
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_mno345realkey
OPENAI_API_KEY=sk-pqr678realkey
RESEND_API_KEY=re_stu901realkey
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

A new developer joins the team, clones the repo, and sees `.env.example`. They copy it to `.env`, replace the placeholder values with their own keys, and they're running. No Slack DMs asking "what environment variables do I need?" No accidental secrets in the repository.

```bash
# New developer setup
cp .env.example .env
# Edit .env with your real values
```

## The complete `.gitignore` for environment files

```bash
# Environment files — ignore everything with real values
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.production
.env.staging

# Catch-all for local overrides
.env*.local

# Keep templates
!.env.example
!.env.sample
```

The `!.env.example` line explicitly un-ignores the template file, ensuring it stays tracked even with the broad `.env*` patterns above.

## Understanding the `.env` file hierarchy

Modern frameworks load environment variables in a specific order, with later files overriding earlier ones. Here's how Next.js does it (most frameworks follow a similar pattern):

| File | When loaded | Commit? | Purpose |
|---|---|---|---|
| `.env` | Always | **No** | Default values for all environments |
| `.env.local` | Always (except test) | **No** | Local overrides, machine-specific secrets |
| `.env.development` | `next dev` only | **Maybe** | Non-secret dev defaults (rarely useful) |
| `.env.development.local` | `next dev` only | **No** | Local dev overrides with secrets |
| `.env.production` | `next build` / `next start` | **No** | Production secrets (use CI/CD instead) |
| `.env.production.local` | Production, local only | **No** | Local production testing |
| `.env.test` | Test runner only | **Maybe** | Non-secret test defaults |
| `.env.test.local` | Test runner only | **No** | Local test overrides |
| `.env.example` | Never loaded automatically | **Yes** | Template for humans |

The "Maybe" entries (`.env.development`, `.env.test`) can be committed *only* if they contain non-secret configuration that every developer should share — like a shared test database URL that uses no real credentials. If in doubt, gitignore it.

## Public vs. secret environment variables

Some frameworks distinguish between public and secret environment variables at the naming level:

```bash
# Next.js convention
NEXT_PUBLIC_API_URL=https://api.example.com    # Exposed to browser (bundled into client JS)
DATABASE_URL=postgresql://...                    # Server-only (never reaches the browser)

# Vite convention
VITE_API_URL=https://api.example.com            # Exposed to browser
SECRET_KEY=...                                   # Server-only
```

**`NEXT_PUBLIC_*` variables are bundled into your client-side JavaScript.** Anyone can see them by viewing your page source. This is by design — they're for values that are safe to be public, like your Stripe publishable key or your app's public URL.

**Variables without the `NEXT_PUBLIC_` prefix are server-only.** They are available in API routes, server components, and middleware, but never sent to the browser.

Even though `NEXT_PUBLIC_*` variables are "public," you should still not commit real values. Development and production values differ, and `.env.example` documents what's needed without locking in specific values.

## Where production secrets should live

Production secrets should never be in any file that touches git. Instead, use your hosting provider's secrets management:

### Vercel

```bash
# Add a secret via CLI
vercel env add DATABASE_URL production

# Or use the Vercel dashboard: Settings > Environment Variables
```

Vercel injects environment variables at build time and runtime. They never appear in your repository.

### GitHub Actions

```yaml
# .github/workflows/deploy.yml (committed — references secrets, doesn't contain them)
jobs:
  deploy:
    steps:
      - name: Deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
        run: npm run deploy
```

GitHub Actions secrets are set in your repository's Settings > Secrets and variables. They are masked in logs and never exposed in workflow files.

### Other platforms

- **Netlify:** Site settings > Environment variables
- **Railway:** Service > Variables
- **AWS:** Systems Manager Parameter Store or Secrets Manager
- **Docker:** `docker-compose.yml` with `env_file` pointing to a non-committed `.env`, or Docker secrets for Swarm/Kubernetes

The principle is the same everywhere: secrets are injected at runtime by the platform, not stored in files that could be committed.

## What to do when secrets are accidentally committed

If you've already committed a `.env` file with real secrets, deleting it and committing the deletion is **not enough.** The file — and its contents — persist in git history. Anyone with clone access can recover it.

### Step 1: Rotate every exposed secret immediately

This is the most important step. Before doing anything else with git, go to every service whose key was exposed and regenerate the credentials:

- **AWS:** Rotate IAM access keys in the AWS Console
- **Stripe:** Roll API keys in the Stripe Dashboard
- **Database:** Change the password and update connection strings
- **OAuth tokens:** Revoke and regenerate in the provider's settings

Do this first. The git history cleanup can wait. Credential rotation cannot.

### Step 2: Remove the file from git tracking

```bash
# Remove from tracking but keep local file
git rm --cached .env

# Add to .gitignore
echo ".env" >> .gitignore

# Commit the removal
git commit -m "Remove .env from tracking, add to .gitignore"
```

This stops future commits from including the file, but the old commits still contain it.

### Step 3: Remove from git history (optional but recommended)

For public repositories, this is critical. For private repositories, it's strongly recommended.

**Using git-filter-repo (recommended):**

```bash
# Install
pip install git-filter-repo

# Remove .env from all history
git filter-repo --invert-paths --path .env

# Force push (coordinate with your team first)
git push origin --force --all
```

**Using BFG Repo-Cleaner:**

```bash
# Download BFG
java -jar bfg.jar --delete-files .env

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin --force --all
```

Both tools rewrite git history, which means every team member needs to re-clone or reset their local repository. Coordinate before doing this.

### Step 4: Set up prevention

After cleaning up, prevent it from happening again:

```bash
# .gitignore (if not already done)
.env
.env.local
.env*.local
```

Consider adding a pre-commit hook that blocks commits containing secrets. Tools like `gitleaks` or `detect-secrets` scan staged files for patterns that look like API keys:

```bash
# Install gitleaks and add to pre-commit hooks
# See: https://github.com/gitleaks/gitleaks
```

## Secret scanning tools

Proactive scanning catches leaked secrets before they cause damage:

| Tool | What it does |
|---|---|
| **GitHub Secret Scanning** | Built into GitHub. Scans for known provider patterns. Free for public repos, available on Enterprise for private repos. |
| **GitGuardian** | Scans repositories and CI/CD pipelines for 350+ secret types. Free tier for individuals. |
| **gitleaks** | Open-source, runs locally or in CI. Configurable patterns. |
| **detect-secrets** | Yelp's open-source tool. Maintains a baseline of known secrets and alerts on new ones. |
| **TruffleHog** | Scans git history, S3 buckets, and other sources for high-entropy strings and known key patterns. |

GitHub's built-in secret scanning is the easiest to enable — if you're on GitHub, turn it on in your repository's Security settings.

## Framework-specific patterns

### Next.js

```bash
# .env.example
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
NEXT_PUBLIC_APP_URL=http://localhost:3000
CLERK_SECRET_KEY=sk_test_placeholder
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_placeholder
```

Next.js automatically loads `.env.local` (gitignored) and exposes `NEXT_PUBLIC_*` variables to the browser.

### Django

```python
# settings.py
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
    }
}
```

```bash
# .env.example
DJANGO_SECRET_KEY=your-secret-key-here
DB_NAME=myapp_dev
DB_USER=postgres
DB_PASSWORD=your-password-here
```

### Rails

Rails uses `credentials.yml.enc` (encrypted, committed) with a `master.key` (gitignored). This is a different pattern — secrets are committed but encrypted, and the decryption key is never committed.

```bash
# .gitignore
config/master.key
config/credentials/*.key
```

If your framework supports encrypted credentials natively, use that pattern. It's more secure than `.env` files for production.

## The `.env.vault` pattern (advanced)

Some teams use tools like `dotenv-vault` to encrypt `.env` files and commit the encrypted versions. The encrypted file (`.env.vault`) is committed; the decryption key is injected via CI/CD.

```bash
# Committed (encrypted, safe)
.env.vault

# Gitignored (decryption keys)
.env.me
.env.keys
```

This is a valid pattern for teams that want secrets versioned alongside code without storing them in plaintext. Evaluate whether your team needs this complexity — for most projects, the `.env.example` + CI/CD secrets pattern is simpler and sufficient.

## Checklist for new projects

When starting a new project:

1. Create `.env.example` with all required variables and placeholder values
2. Add `.env`, `.env.local`, `.env*.local`, `.env.production` to `.gitignore`
3. Copy `.env.example` to `.env` and fill in your real values
4. Document the setup in your README: "Copy `.env.example` to `.env` and fill in your values"
5. Set up production secrets in your hosting provider, not in files
6. Enable GitHub secret scanning if you're on GitHub
7. Consider a pre-commit hook with `gitleaks` or `detect-secrets`

## Summary

| File | Commit? | Why |
|---|---|---|
| `.env` | **Never** | Contains real secrets |
| `.env.local` | **Never** | Local overrides with secrets |
| `.env.production` | **Never** | Production secrets — use CI/CD instead |
| `.env.development.local` | **Never** | Local dev secrets |
| `.env.example` / `.env.sample` | **Always** | Template with placeholders, no real values |
| `.env.development` (no secrets) | **Optional** | Only if it contains no secrets |
| `.env.test` (no secrets) | **Optional** | Only if it contains no secrets |

The pattern is simple: commit the template, ignore the real values, inject production secrets via your hosting platform. Get this right on day one and you'll never have a secret leak from your repository.

## Keep reading

- [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide) — the full reference for every file type
- [Lock Files: package-lock.json, yarn.lock, pnpm-lock.yaml — Commit or Ignore?](/devops-and-tools/lock-files-commit-or-ignore) — the other most-debated git question
- [Environment Variables](/devops-and-tools/environment-variable) — reference guide for environment variables in web development
