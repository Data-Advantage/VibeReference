# Should You Commit Your Dockerfile?

Yes. Always commit your Dockerfile.

A Dockerfile is infrastructure-as-code. It defines exactly how your application gets built, packaged, and prepared for production. It is not a generated artifact, not a local convenience file, and not something that varies per developer. It is a build instruction file that belongs in version control alongside your application code.

If you are deploying to Railway, Fly.io, Render, AWS ECS, Google Cloud Run, or any platform that supports Docker, your Dockerfile is the single source of truth for your production environment. Losing it means no one — including you in three months — can reproduce the exact build that is running in production.

This guide covers what goes in a Dockerfile, why it belongs in git, what to watch out for with secrets, and the related files you should commit alongside it.

## What a Dockerfile actually contains

A Dockerfile is a plain text file with no extension, always named `Dockerfile` (capital D). It contains a sequence of instructions that Docker executes to build a container image. Here is what those instructions typically define:

**Base image.** The starting point for your container. This is usually an operating system with a runtime pre-installed — like `node:20-alpine` for a Node.js app or `python:3.12-slim` for Python.

**System dependencies.** Any OS-level packages your app needs that are not included in the base image.

**Application dependencies.** Your `package.json` install step, `pip install`, `go mod download`, or equivalent. This layer gets cached by Docker, so dependency installation only reruns when your dependency files change.

**Application code.** The `COPY` instruction that brings your source code into the image.

**Build steps.** Commands like `npm run build` or `next build` that compile your application.

**Runtime configuration.** The port your app listens on, the command that starts it, and any default environment variables that are not secrets.

None of this is sensitive. None of this is generated. Every line is a deliberate decision about how your application should be built and run.

## Why it belongs in git

### Reproducible builds

Your Dockerfile pins the exact base image, the exact install commands, and the exact build steps. Six months from now, when you need to rebuild or debug a production issue, the Dockerfile in your git history tells you precisely what that build looked like. Without it, you are guessing.

This is especially important for vibe-coded projects where you might not touch the deployment setup for weeks or months at a time. When you come back to update a feature and need to redeploy, the Dockerfile in your repo means you can build and ship without reconstructing your entire deployment setup from memory.

### Team consistency

Every developer who clones your repo can run `docker build` and get the same image. There is no "works on my machine" problem when the machine is defined in code. Even if you are a solo founder today, committing the Dockerfile means a contractor or co-founder can onboard without reverse-engineering your deployment setup.

### CI/CD pipelines need it

GitHub Actions, GitLab CI, Railway, Fly.io, and every other deployment platform that builds Docker images expects to find a Dockerfile in your repository. Your pipeline reads the Dockerfile from git, builds the image, and deploys it. If the Dockerfile is not in the repo, your pipeline cannot build.

### Change tracking

When you update your Node.js version from 20 to 22, switch from `npm` to `pnpm`, or add a system dependency, that change shows up in your git diff. You can review it in a pull request, revert it if something breaks, and understand exactly when and why your build environment changed.

## A practical Dockerfile for Next.js

Here is a real-world Dockerfile for a Next.js application. This is representative of what most vibe-coded projects look like in production:

```dockerfile
# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

This file is roughly 25 lines. It is not complex. But it encodes critical decisions: the Node version, the install strategy, the build command, the user permissions, and the startup command. Every one of those decisions should be tracked in version control.

## .dockerignore: commit this too

Just like `.gitignore` tells git which files to skip, `.dockerignore` tells Docker which files to exclude when copying your project into the image. It lives in the root of your project, right next to your Dockerfile, and it absolutely belongs in git.

A typical `.dockerignore` for a Node.js project:

```
node_modules
.next
.git
.env
.env.*
*.md
.DS_Store
```

This matters for two reasons. First, it keeps your Docker build context small and your builds fast — you do not want to send hundreds of megabytes of `node_modules` to the Docker daemon just to delete them and reinstall. Second, it prevents secrets from accidentally ending up in your image. That `.env` line ensures your local environment file never gets copied into the container.

The `.dockerignore` file is a configuration file. It defines build behavior. Commit it.

## Secrets in Dockerfiles: what NOT to do

This is where people make mistakes. A Dockerfile is committed to git. Anything you put in it is visible to anyone with access to the repository. That means you must never hardcode secrets.

**Do not do this:**

```dockerfile
# WRONG: Secret is baked into the image and committed to git
ENV DATABASE_URL=postgresql://admin:real_password@db.example.com:5432/myapp
ENV STRIPE_SECRET_KEY=sk_live_abc123
```

**Do this instead:**

```dockerfile
# RIGHT: Declare that the variable exists, but don't set a real value
ENV DATABASE_URL=""
ENV NODE_ENV=production
```

Then pass real values at runtime:

```bash
docker run -e DATABASE_URL="postgresql://admin:real_password@db.example.com:5432/myapp" myapp
```

Or use an environment configuration in your deployment platform (Railway, Fly.io, and others all have environment variable settings in their dashboards).

For values needed only during the build (like a private npm registry token), use build arguments:

```dockerfile
ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc && \
    npm ci && \
    rm .npmrc
```

```bash
docker build --build-arg NPM_TOKEN=your_token_here .
```

Build arguments are not persisted in the final image (in multi-stage builds where the arg is used in an earlier stage), and the token itself is passed at build time, not stored in the Dockerfile.

The key principle: your Dockerfile describes *how* to build. Your deployment platform or `docker run` command provides *what values* to use. This separation is what makes the Dockerfile safe to commit while keeping your secrets out of version control.

For the full guide on managing secrets and environment variables, see [.env Files: The Complete Guide to Environment Variables in Git](/devops-and-tools/env-files-git-guide).

## Multi-stage builds: commit all stages

The Dockerfile example above uses multi-stage builds — the `FROM ... AS deps`, `FROM ... AS builder`, `FROM ... AS runner` pattern. Each stage is a separate build environment, and the final image only includes what you explicitly copy from earlier stages.

Multi-stage builds are the standard approach for production Docker images because they keep the final image small. Your build tools, dev dependencies, and source code stay in the builder stage. Only the compiled output makes it to the production image.

All stages live in the same Dockerfile. There is nothing to separate or ignore. Commit the whole file.

Some projects use separate Dockerfiles for different purposes — `Dockerfile.dev` for local development, `Dockerfile.prod` for production, or `Dockerfile.test` for running tests in CI. If you have these, commit all of them. They are all build instructions and they all belong in version control.

## docker-compose.yml: also commit it

If your project uses Docker Compose to define multi-container setups (your app, a database, a Redis cache), that `docker-compose.yml` file also belongs in git. It defines your local development environment and often your staging setup. Like the Dockerfile, it is infrastructure-as-code.

For the full breakdown on what to commit and what to ignore with Docker Compose, see [Should You Commit docker-compose.yml?](/devops-and-tools/should-you-commit-docker-compose).

## .gitignore: nothing to add for Dockerfile

The Dockerfile itself does not generate artifacts that need to be ignored. There is no `Dockerfile.lock` or `Dockerfile.local`. You commit it and you are done.

The files you want in your `.gitignore` related to Docker are:

```bash
# Docker-related ignores (not the Dockerfile itself)
.env
.env.*
```

Those are your environment files with real secrets — covered in detail in the [.env files guide](/devops-and-tools/env-files-git-guide).

## The bottom line

Your Dockerfile is a build recipe. It is deterministic, it is not sensitive (if you follow the secrets guidance above), and it is essential for reproducible deployments. It belongs in git alongside your application code, your `package.json`, and your other configuration files.

Commit the Dockerfile. Commit the `.dockerignore`. Pass secrets at runtime, not in the file. That is the entire pattern.

For more on which files belong in your repository, see [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide).
