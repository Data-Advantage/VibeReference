# Should You Commit docker-compose.yml?

Your `docker-compose.yml` file defines your entire local development stack — every service, database, cache, and queue your app needs to run. When a new developer clones your repo and runs `docker compose up`, this file determines whether they get a working environment in thirty seconds or spend an afternoon piecing together setup instructions from Slack threads.

**Yes, commit your `docker-compose.yml`.** It is infrastructure documentation that happens to be executable. Without it in version control, every developer has to recreate the same service definitions independently, and they will inevitably get them wrong.

## Why it belongs in git

A `docker-compose.yml` file is not a personal preference file. It describes shared infrastructure that every contributor needs:

- **Which services the app depends on.** Postgres, Redis, Elasticsearch, a mail server — the compose file makes these explicit rather than buried in a README paragraph nobody reads.
- **How those services connect.** Port mappings, network names, and environment variables that wire services together are all captured in one place.
- **What versions to run.** Pinning `postgres:16` instead of `postgres:latest` prevents the kind of silent breakage where one developer runs Postgres 16 and another runs Postgres 17 with incompatible behavior.
- **Reproducibility across machines.** The same file produces the same environment on macOS, Linux, and Windows (with WSL). No "works on my machine" for the infrastructure layer.
- **Change tracking.** When someone adds a new service or changes a port mapping, the diff shows up in version control. You can see who added the Elasticsearch container and why, trace when a port conflict was introduced, or revert a configuration change that broke local development.

Even if you are a solo founder working alone, committing this file protects future-you. Six months from now, when you set up a new laptop or onboard your first hire, the compose file tells you exactly what your app needs to run. Without it, you are reconstructing your infrastructure setup from memory.

This is the same logic behind [committing your Dockerfile](/devops-and-tools/should-you-commit-dockerfile). Both files define your application's runtime environment. Both belong in version control.

## What docker-compose.yml contains

A typical compose file for a web application defines:

**Services** — each container your app needs. Your application server, a database, a cache, maybe a background worker.

**Networks** — how containers find each other. Docker Compose creates a default network automatically, but you can define custom ones for isolation.

**Volumes** — persistent storage for databases and other stateful services. Without named volumes, your database data disappears every time you stop the containers.

**Ports** — which container ports are exposed to your host machine for local development.

**Environment variables** — configuration passed to each service, ideally referencing an external `.env` file rather than hardcoding values.

Here is a practical example for a typical web application with Postgres and Redis:

```yaml
# docker-compose.yml (committed to git)
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - .:/app
      - /app/node_modules

  postgres:
    image: postgres:16
    ports:
      - "5432:5432"
    env_file:
      - .env
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/var/lib/redis/data

volumes:
  postgres_data:
  redis_data:
```

This file is self-documenting. Anyone reading it knows the app needs Postgres 16 and Redis 7, what ports are used, and how the services relate to each other.

## The override pattern for local customization

Docker Compose has a built-in mechanism for local customization: override files. When you run `docker compose up`, Compose automatically merges `docker-compose.yml` with `docker-compose.override.yml` if it exists. This gives you a clean separation:

- **`docker-compose.yml`** — committed. The shared baseline that everyone uses.
- **`docker-compose.override.yml`** — gitignored. Personal tweaks for your machine.

Override files are where individual developers put things like:

```yaml
# docker-compose.override.yml (gitignored — personal tweaks)
services:
  app:
    ports:
      - "3001:3000"  # port 3000 is taken on my machine
    environment:
      - DEBUG=true

  postgres:
    ports:
      - "5433:5432"  # I run another Postgres locally on 5432
```

Maybe one developer runs another project on port 3000. Maybe another needs extra debug flags. Maybe you want to mount additional volumes for a debugging tool. The override file handles all of this without polluting the shared configuration.

The key advantage of this pattern is that it requires zero coordination. Developers do not need to ask permission or submit a pull request to adjust their local environment. The base file stays stable while each machine adapts as needed.

For production or staging, create a separate named file:

```yaml
# docker-compose.prod.yml (committed — production overrides)
services:
  app:
    build:
      context: .
      target: production
    restart: always
    ports:
      - "80:3000"

  postgres:
    restart: always

  redis:
    restart: always
```

Run it explicitly with `docker compose -f docker-compose.yml -f docker-compose.prod.yml up`.

## Secrets handling: use env_file, not hardcoded values

This is the most common mistake in compose files, and it creates real security risk. If your `docker-compose.yml` is committed (which it should be) and it contains hardcoded passwords, those passwords are now in your git history permanently. Even in a private repository, that is a problem waiting to happen.

Do not do this:

```yaml
# BAD — secrets hardcoded in a committed file
services:
  postgres:
    environment:
      POSTGRES_PASSWORD: my_real_database_password
      POSTGRES_USER: admin
```

Instead, reference an `.env` file:

```yaml
# GOOD — secrets loaded from gitignored .env file
services:
  postgres:
    env_file:
      - .env
```

Your `.env` file (which is gitignored) contains the actual values:

```bash
# .env (gitignored — never committed)
POSTGRES_USER=admin
POSTGRES_PASSWORD=local_dev_password_123
POSTGRES_DB=myapp_dev
DATABASE_URL=postgresql://admin:local_dev_password_123@postgres:5432/myapp_dev
REDIS_URL=redis://redis:6379
```

And you provide a `.env.example` (committed) so new developers know what variables are needed:

```bash
# .env.example (committed — shows required variables)
POSTGRES_USER=admin
POSTGRES_PASSWORD=your_local_password_here
POSTGRES_DB=myapp_dev
DATABASE_URL=postgresql://admin:your_local_password_here@postgres:5432/myapp_dev
REDIS_URL=redis://redis:6379
```

This is the same pattern covered in the [.env files guide](/devops-and-tools/env-files-git-guide). The compose file stays clean and secret-free. The `.env` file stays local and gitignored.

## What to put in .gitignore

Your `.gitignore` should include:

```gitignore
# Docker Compose — local override (personal dev tweaks)
docker-compose.override.yml

# Environment files with real values
.env
.env.local
.env.production

# Docker volume data (if stored locally instead of named volumes)
docker-data/
```

And explicitly **do not ignore** these — they belong in git:

- `docker-compose.yml` — the shared development configuration
- `docker-compose.prod.yml` — production overrides (no secrets, just configuration)
- `docker-compose.staging.yml` — staging overrides if you use them
- `.env.example` — template showing required environment variables
- `Dockerfile` — your application's container build instructions

## Docker volume data: always ignore

Named volumes (like `postgres_data` in the example above) are managed by Docker and stored outside your project directory. You do not need to worry about them in `.gitignore` because they never appear in your repo.

However, if you use bind mounts to store database data in a local directory (sometimes done for easier backup or inspection), that directory must be gitignored. Database files are large, binary, and change constantly. They have no place in version control.

```yaml
# If you bind-mount database data to a local directory
volumes:
  - ./docker-data/postgres:/var/lib/postgresql/data
```

```gitignore
# Always ignore local database data
docker-data/
```

Named volumes are the cleaner approach for most projects. They keep your project directory uncluttered and avoid accidental commits of gigabytes of database files.

The same principle applies to any generated data: search engine indexes, file upload directories, or cache files. If a container produces data that is large, binary, or environment-specific, it should live in a Docker volume or a gitignored directory — never in version control.

## Summary

Commit `docker-compose.yml`. It defines your development stack and belongs alongside your [Dockerfile](/devops-and-tools/should-you-commit-dockerfile) and application code in [your git repository](/devops-and-tools/git-repository-files-guide). Use the override pattern for local customization, keep secrets in gitignored `.env` files, and never let database data anywhere near version control.

The goal is simple: `git clone` followed by `docker compose up` should give every developer a working environment. Your `docker-compose.yml` makes that possible.
