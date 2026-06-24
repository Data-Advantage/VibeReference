---
title: "Should You Commit the .vercel Directory to Git?"
description: "No — the .vercel folder holds your local project link, not your code, and the Vercel CLI gitignores it automatically. Here's what's inside and why."
---

# Should You Commit the .vercel Directory?

No. The `.vercel` directory is local linking state created by the Vercel CLI, not part of your application. It records which Vercel project this folder on *your* machine is connected to — and that connection is something each person and each CI runner establishes for themselves. Vercel knows this, which is why the CLI adds `.vercel` to your `.gitignore` the moment it creates the folder.

If you're seeing `.vercel` show up in `git status`, the fix isn't to commit it — it's to confirm it's ignored. This guide covers what the folder actually contains, why it doesn't belong in version control even though it isn't strictly a secret, and what to do if it slipped into history before you ignored it.

## The short answer

| Question | Answer |
|---|---|
| Commit the `.vercel` directory? | **No** — it's per-machine project link state. |
| Does the CLI ignore it for you? | **Yes** — `vercel link` appends `.vercel` to `.gitignore`. |
| Is `project.json` a secret? | **No, but** — it's an identifier, not a credential. Still don't commit it. |
| Will committing it break deploys? | Not directly, but it pins teammates to *your* linked project. |
| The one rule to remember? | **Linking is local. Let each clone link itself.** |

## What the .vercel directory contains

The folder appears the first time you run a CLI command that needs to know which project you're working with — `vercel link`, `vercel`, `vercel dev`, or `vercel env pull`. Inside, you'll find two things:

```
.vercel/
├── project.json
└── README.txt
```

**`project.json`** is the entire point of the directory. It holds the IDs that tie this local folder to a project in Vercel's system:

```json
{
  "projectId": "prj_xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "orgId": "team_xxxxxxxxxxxxxxxxxxxxxxxx"
}
```

`projectId` names the Vercel project; `orgId` names the user or team that owns it. When you run `vercel` to deploy, the CLI reads these so it knows where to send the build instead of asking you every time.

**`README.txt`** is Vercel's own note to anyone who finds the folder. It explains what the directory is for and states plainly that you should *not* share it — and that it was added to your `.gitignore` automatically on creation. The tool is telling you the answer to this article's question directly.

## Why it doesn't belong in Git, even though it isn't a secret

It's worth being precise here, because "don't commit it" gets confused with "it's dangerous." `projectId` and `orgId` are **identifiers, not credentials**. On their own they can't deploy anything, read your environment variables, or authenticate as you — that requires a Vercel access token, which lives in your CLI auth config (`~/.vercel` or `~/.local/share/com.vercel.cli`), never in the project folder. So leaking a `project.json` is not the same class of incident as leaking a `.env`.

The reason to keep it out of Git is different: it's **local state that's wrong for everyone else**. The `.vercel` folder records *your* link to *your* project. If you commit it, every teammate who clones the repo inherits your link — their CLI now thinks their working copy points at the project you linked, which may be your personal sandbox, a fork, or a project they don't even have access to. Instead of each person running `vercel link` and connecting to the right project for their role, they're silently bound to yours.

This is the same logic that keeps other machine-specific scaffolding out of the committed tree:

| Path | What it records | Commit it? |
|---|---|---|
| `.vercel/` | Which Vercel project *this clone* is linked to | **No** — each clone links itself |
| `.next/` | Local Next.js build output | **No** — regenerated on every build |
| `dist/` / `build/` | Compiled artifacts | **No** — generated from source |
| `.env.local` | Local secrets and config | **No** — values stay out of Git |
| `vercel.json` | Project config you *want* shared | **Yes** — it's real source |

The distinction in the last row matters: `vercel.json` is project configuration that should be identical for everyone, so it's committed. The `.vercel` *directory* is the opposite — a local pointer that should differ per machine. Same vendor, opposite answers, because one is shared config and the other is local state. (For the general version of this test, see [The Developer's Guide to What Belongs in Your Git Repository](./git-repository-files-guide).)

## What about the .env.local that vercel env pull creates?

A common point of confusion: `vercel env pull` downloads your project's environment variables, and people assume the output lands inside `.vercel`. It doesn't. By default `vercel env pull` writes to `.env.local` in your project root, and *that* file does contain real secrets — API keys, database URLs, tokens.

So you actually have two separate "don't commit" rules in play:

- **`.vercel/`** — local link state. Not a secret, but per-machine. Ignored automatically.
- **`.env.local`** — real credentials pulled from Vercel. A genuine secret. Must be ignored.

Both should be in your `.gitignore`, but for different reasons. A standard Next.js `.gitignore` already covers `.env*.local`; confirm `.vercel` is there too. For how to share the *shape* of your environment without the values, see [Environment Variables and .env Files: What to Commit](./env-files-git-guide), and for where secrets should actually live, [Secret Management Providers](./secret-management-providers).

## Confirming it's ignored

The Vercel CLI appends `.vercel` to your `.gitignore` automatically, but it's worth verifying — especially if your repo predates your first `vercel link`, or if someone regenerated the `.gitignore` from a template that didn't include it.

```bash
# Is .vercel currently ignored?
git check-ignore .vercel
# Prints ".vercel" if ignored; prints nothing if it's NOT ignored.
```

If that command prints nothing, add the rule yourself:

```gitignore
# Vercel CLI local project link
.vercel
```

A single line covers the whole directory. There's no need to enumerate `project.json` or `README.txt` separately.

## If you already committed it

Adding `.vercel` to `.gitignore` does nothing if Git is already tracking the folder — ignore rules only apply to untracked paths. You have to untrack it explicitly while keeping it on disk so your own link still works:

```bash
# Stop tracking the folder, keep the local copy
git rm -r --cached .vercel

# Commit the removal
git commit -m "Stop tracking .vercel; rely on .gitignore"
```

The `--cached` flag removes the path from Git's index without deleting your local link, so your next `vercel` command still knows which project to target. After this commit, the `.gitignore` rule finally takes effect and teammates who pull won't have your link forced onto them.

Because `project.json` holds identifiers rather than credentials, you generally don't need to scrub history or rotate anything — untracking it going forward is enough. The exception is if a teammate had already pulled the committed folder: their local link is now pointing at your project, and they should re-run `vercel link` to connect to the correct one. (This is the opposite of a committed `.env`, where a leaked value *does* demand rotation — see [Should You Commit .gitignore?](./should-you-commit-gitignore) for that case.)

## The bottom line

Leave `.vercel` out of Git. It's the local record of which Vercel project your working copy is linked to — useful on your machine, wrong on everyone else's. The CLI ignores it for you precisely so that each clone, each teammate, and each CI runner establishes its own link instead of inheriting yours. Treat it like `.next/` or `node_modules/`: real, necessary, and entirely local.

Keep the line that matters in your committed `.gitignore` (`/.vercel`), keep your shared config in `vercel.json`, and keep your pulled secrets in an ignored `.env.local`. Three different files, three different homes — and only one of them belongs in your repository.

## See Also

- [The Developer's Guide to What Belongs in Your Git Repository](./git-repository-files-guide) — the committed-vs-ignored framework this series applies
- [Should You Commit .gitignore?](./should-you-commit-gitignore) — why the ignore file itself is the one config you always share
- [Should You Commit the .next Directory?](./should-you-commit-next-directory) — the same "local, regenerated, don't track" logic for Next.js build output
- [Environment Variables and .env Files: What to Commit](./env-files-git-guide) — how to ignore secrets while still sharing their structure
- [Secret Management Providers](./secret-management-providers) — where real credentials belong instead of your repo
- [Vercel](/cloud-and-hosting/vercel) — the platform overview, deployment model, and where this folder comes from
