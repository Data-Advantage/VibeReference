# Should You Commit Your Makefile?

Makefiles have been around since 1976. They predate Git, GitHub, Docker, Node.js, and most of the tools you use every day. Originally designed to compile C programs, Make has quietly become one of the most popular task runners in modern software development — even in projects that have nothing to do with C.

If you have a `Makefile` in your project root and you're wondering whether it belongs in version control: **yes, commit it.**

A `Makefile` is not generated output. It's not machine-specific configuration. It's not a secret. It's the file that tells every developer on your project how to build, test, and run things. It belongs in your repository for the same reasons your `package.json` or `Dockerfile` does. (For the full framework on deciding what to commit, see [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide).)

## What a Makefile actually contains

A `Makefile` is a plain text file that defines **targets** — named commands that run one or more shell instructions. Each target is a task: build the project, run tests, start the dev server, deploy, clean up artifacts.

Here's the basic anatomy:

```makefile
target-name:
	shell-command-here
	another-command
```

That's it. You type `make target-name`, and Make runs the commands underneath. The indentation must be a real tab character (not spaces) — this is Make's one famous quirk, and it has tripped up developers for decades.

A real-world Makefile might look like this:

```makefile
install:
	npm ci

dev:
	npm run dev

build:
	npm run build

test:
	npm run test

lint:
	npm run lint

deploy:
	npm run build && npx wrangler deploy

clean:
	rm -rf node_modules .next dist
```

Each target is a simple, memorable alias for a longer command. Instead of remembering `npx wrangler deploy` or whatever your specific deployment incantation is, you just run `make deploy`.

## Why Makefiles are popular in non-C projects

If you come from the JavaScript or Python world, you might wonder why anyone uses Make when `npm run` scripts and shell scripts already exist. The answer is pragmatic: Make is a universal interface.

**It's already installed.** Make ships with macOS and virtually every Linux distribution. There's nothing to install — no runtime dependency, no package manager. It just works.

**It's language-agnostic.** A Python project, a Go service, a Next.js app, and a Terraform infrastructure repo can all use the same tool for task running. If you work across multiple projects in different languages, `make build` and `make test` work in all of them.

**It's self-documenting.** When a new developer clones your repo, they can open the Makefile and immediately see every available command. No digging through `package.json` scripts, no reading a README that might be outdated.

**It handles multi-step workflows.** Make supports dependencies between targets. You can say "before deploying, run the build, and before building, run the linter." Make figures out the execution order.

```makefile
deploy: build
	npx wrangler deploy

build: lint
	npm run build

lint:
	npm run lint
```

Running `make deploy` now automatically runs `lint`, then `build`, then `deploy` — in the right order, every time.

## A practical Makefile for a modern web project

Here's a complete, realistic Makefile for a Next.js or similar web project. This is the kind of file you'd commit to your repo:

```makefile
.PHONY: help install dev build test lint format deploy clean db-migrate db-seed

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	pnpm install

dev: ## Start development server
	pnpm run dev

build: ## Build for production
	pnpm run build

test: ## Run test suite
	pnpm run test

lint: ## Run linter
	pnpm run lint

format: ## Format code with Prettier
	pnpm run format

deploy: build ## Build and deploy to production
	pnpm run deploy

clean: ## Remove build artifacts and dependencies
	rm -rf node_modules .next dist .turbo

db-migrate: ## Run database migrations
	pnpm run db:migrate

db-seed: ## Seed the database
	pnpm run db:seed
```

Type `make help` and you get a nicely formatted list of every available command with its description. That `help` target is a well-known Make pattern — the `## comment` after each target name becomes its documentation.

## Best practices

### Use .PHONY declarations

By default, Make checks whether a target name matches a file on disk. If you have a directory called `build/` and a target called `build`, Make might skip the target because it thinks the file already exists. Declaring targets as `.PHONY` tells Make they're commands, not files:

```makefile
.PHONY: build test clean deploy
```

Declare all your task targets as phony. The only time you wouldn't is if you're using Make for actual file-based build rules (like compiling `.c` files into `.o` files), which is rare in modern web projects.

### Add a help target

The self-documenting `help` pattern shown above is worth adopting in every project. It turns your Makefile into its own reference card. Some teams make `help` the default target (the first target in the file) so that typing just `make` with no arguments prints the available commands.

### Use variables for repeated values

If the same value appears in multiple targets, pull it into a variable at the top of the file:

```makefile
NODE_BIN = ./node_modules/.bin
DOCKER_IMAGE = myapp:latest

build:
	$(NODE_BIN)/next build

docker-build:
	docker build -t $(DOCKER_IMAGE) .
```

This keeps your Makefile DRY and makes updates easier.

### Keep targets focused

Each target should do one thing. If a target is running ten commands, it probably should be split into multiple targets with dependencies between them.

## Handling secrets in Makefiles

The one thing you should never do is hardcode secrets — API keys, tokens, passwords — directly in your Makefile. Since the Makefile is committed to version control, any secret written into it is visible to everyone with repo access (and in your Git history forever).

Instead, reference environment variables:

```makefile
deploy:
	CLOUDFLARE_API_TOKEN=$(CLOUDFLARE_API_TOKEN) npx wrangler deploy
```

Or load a `.env` file:

```makefile
include .env
export

deploy:
	npx wrangler deploy
```

The `include .env` directive loads variables from your `.env` file, and `export` makes them available to sub-processes. Since your `.env` file is in `.gitignore` (as it should be — see our [.env files guide](/devops-and-tools/env-files-git-guide) if you need help with that), your secrets stay out of version control while your Makefile stays committed.

Add a `-` before `include` to prevent Make from erroring if the file doesn't exist:

```makefile
-include .env
export
```

This way the Makefile still works in CI environments where secrets come from environment variables rather than a `.env` file.

## What about .gitignore?

Nothing to add. A `Makefile` is a single plain text file with no generated companions. There are no lock files, no build artifacts, no local overrides to exclude. You commit the `Makefile` and you're done.

If your Makefile creates build output (like a `dist/` or `build/` directory), those output directories should be in `.gitignore` — but that's about the output, not the Makefile itself.

## The bottom line

Commit your Makefile. It defines how your project is built, tested, and deployed. It's the universal entry point for anyone who clones your repo — regardless of what language or framework you're using. It contains no secrets (if you've written it correctly), it's not machine-specific, and it's not auto-generated.

For a solo founder or small team, a well-written Makefile is one of the highest-leverage files in your repository. Five minutes of setup saves hours of "how do I run this again?" questions — from teammates and from your future self.

## Related reading

- [The Developer's Guide to What Belongs in Your Git Repository](/devops-and-tools/git-repository-files-guide) — the decision framework for what to commit and what to ignore
- [Should You Commit Your Dockerfile?](/devops-and-tools/should-you-commit-dockerfile) — another infrastructure file that belongs in version control
