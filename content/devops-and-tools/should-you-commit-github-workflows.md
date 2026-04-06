# Should You Commit .github/workflows/? Yes — Your CI/CD Pipeline Is Code

Your GitHub Actions workflow files define how your code gets tested, built, and deployed. They are code. They belong in your repository right alongside the application they automate.

If you're setting up your first CI/CD pipeline and wondering whether those YAML files in `.github/workflows/` should be committed — yes. Always. GitHub Actions literally requires them to be in your repository to function. But beyond that technical requirement, there are strong reasons to treat these files with the same care you give your application code.

## Yes, commit them — they only work from the repo

This one is straightforward. GitHub Actions reads workflow files from the `.github/workflows/` directory in your repository. If the files aren't committed and pushed, GitHub has nothing to run. There is no external configuration dashboard, no separate build server to configure, no UI-only setup. The workflow files in your repo *are* the pipeline.

This is actually one of the best things about GitHub Actions compared to older CI tools. Your pipeline definition lives with your code, changes with your code, and is reviewed in the same pull requests as your code. When you branch, you get a copy of the pipeline. When you tag a release, the pipeline that built that release is captured in the tag.

Delete the files, and your automation stops. Commit them, and it works on every branch, for every contributor, immediately.

## What .github/workflows/ contains

The `.github/workflows/` directory holds YAML files that define your automated workflows. Each file is one workflow, and you can have as many as you need:

```
.github/
  workflows/
    ci.yml              # Run tests and linting on every push
    deploy.yml          # Deploy to production on merge to main
    lint.yml            # Code style checks on pull requests
    release.yml         # Build and publish releases
    dependabot-auto.yml # Auto-merge safe dependency updates
```

Each workflow file defines:

- **When it runs** — the trigger events (push, pull request, schedule, manual dispatch)
- **What environment it runs in** — the operating system and runtime
- **What steps it executes** — the actual commands and actions to run

These files are typically small. A functional CI workflow for a modern web app is 30-60 lines of YAML. You're not writing a build system — you're composing existing actions and shell commands into an automated sequence.

## GitHub Actions fundamentals

A workflow is triggered by events. The most common triggers:

```yaml
on:
  push:
    branches: [main]          # Run when code is pushed to main
  pull_request:
    branches: [main]          # Run when a PR targets main
  schedule:
    - cron: '0 6 * * 1'       # Run every Monday at 6 AM UTC
  workflow_dispatch:            # Allow manual trigger from GitHub UI
```

Each workflow contains one or more **jobs**, and each job runs on a virtual machine (called a **runner**). Jobs run in parallel by default, or you can make them sequential by defining dependencies between them.

Each job contains **steps** — individual commands or pre-built actions. Actions are reusable packages from the GitHub Actions marketplace or other repositories. You'll use `actions/checkout` and `actions/setup-node` in almost every Node.js workflow.

## Practical example: CI for a Next.js project

Here's a real, working CI workflow for a typical Next.js application. This runs on every push and pull request, checking that your code lints, tests pass, and the project builds successfully:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
```

That's it. Thirty-five lines. When you push this file to `.github/workflows/ci.yml` and commit it, GitHub will automatically run these steps on every push to main and every pull request targeting main. You'll see green checkmarks or red failures directly on your pull requests.

A few things to note in this example:

- **`npm ci`** instead of `npm install` — this installs from your lock file exactly, which is faster and deterministic. This is why you [commit your lock files](/devops-and-tools/lock-files-commit-or-ignore).
- **`cache: 'npm'`** — caches your `node_modules` between runs, significantly speeding up subsequent workflow executions.
- **Steps are sequential** — if linting fails, tests won't run. This fails fast and gives you clear feedback about what broke.

## Secrets in workflows: never hardcode them

Your workflow files are committed to your repository. That means everyone with read access to the repo can see them. **Never put API keys, tokens, passwords, or any secret values directly in your workflow YAML.**

Instead, use GitHub Secrets. You add secrets through your repository settings (Settings > Secrets and variables > Actions), and reference them in workflows using the `${{ secrets.SECRET_NAME }}` syntax:

```yaml
steps:
  - name: Deploy to production
    run: npx vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}

  - name: Notify Slack
    uses: slackapi/slack-github-action@v2
    with:
      webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
```

GitHub redacts secret values from workflow logs automatically. They're encrypted at rest and only exposed to the runner during execution. This is the same principle behind the `.env` pattern for your application — the *structure* is visible in code, but the *values* live in a secure store. For more on managing secrets properly, see the [.env files guide](/devops-and-tools/env-files-git-guide).

Common secrets you'll configure:

- **`VERCEL_TOKEN`** or **`NETLIFY_AUTH_TOKEN`** — deployment platform credentials
- **`NPM_TOKEN`** — for publishing packages to npm
- **`AWS_ACCESS_KEY_ID`** and **`AWS_SECRET_ACCESS_KEY`** — for AWS deployments
- **`CODECOV_TOKEN`** — for uploading test coverage reports

## Workflow permissions and security

By default, GitHub Actions workflows get a `GITHUB_TOKEN` with fairly broad permissions. For solo projects this is usually fine, but it's good practice to follow the principle of least privilege — only grant the permissions your workflow actually needs:

```yaml
permissions:
  contents: read
  pull-requests: write
```

This is especially important if your repository is public. Public repos can receive pull requests from anyone, and workflows triggered by `pull_request` events from forks run with read-only permissions by default for security reasons. Don't override this unless you understand the implications.

Other security practices worth following:

- **Pin action versions to a commit SHA** instead of a tag for critical workflows: `uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11` instead of `uses: actions/checkout@v4`. Tags can be moved; commit SHAs cannot.
- **Limit `workflow_dispatch` to specific branches** if you use manual triggers.
- **Review third-party actions** before using them. Prefer actions published by GitHub (`actions/*`) or verified organizations.

## Other .github/ files worth committing

The `.github/` directory isn't just for workflows. Several other files live here and all belong in your repository:

**`CODEOWNERS`** — defines who must review changes to specific files or directories. Useful even for solo projects if you plan to bring on collaborators.

```
# .github/CODEOWNERS
*.yml @your-username
/src/billing/ @your-username
```

**`pull_request_template.md`** — auto-populates the description field when creating a pull request. Helps you (and future contributors) write consistent PR descriptions.

**`dependabot.yml`** — configures Dependabot to automatically open pull requests when your dependencies have updates. Essential for keeping dependencies current without manual effort:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

**`FUNDING.yml`** — displays a "Sponsor" button on your repository. If you're building open-source tools as a solo founder, this is how people find your funding links.

All of these are configuration-as-code. They define repository behavior and belong in version control.

## .gitignore: nothing to exclude here

Unlike [.env files](/devops-and-tools/env-files-git-guide) or build output directories, there's nothing in `.github/` that should be gitignored. Every file in this directory is meant to be committed:

- Workflow YAML files — required for GitHub Actions to function
- `CODEOWNERS` — required for code review enforcement
- `dependabot.yml` — required for automated dependency updates
- Templates — required for PR and issue templates to appear

If you're keeping secrets out of your workflow files (as you should be), there's no sensitive data in `.github/` to worry about. The entire directory is safe and intended for version control.

## Where this fits in your repository

Your `.github/workflows/` directory is part of your project's infrastructure-as-code layer, alongside your [Dockerfile](/devops-and-tools/should-you-commit-dockerfile), your `package.json`, and your configuration files. For a complete picture of what belongs in your repository and why, see [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide).

The short version: commit your workflow files, use GitHub Secrets for sensitive values, and start with a simple CI workflow that runs lint, test, and build. You can add deployment workflows, scheduled jobs, and more complex automation as your project grows. The pipeline will grow with your code because it *is* part of your code.
