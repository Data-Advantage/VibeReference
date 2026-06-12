---
title: "Should You Commit .DS_Store to Git?"
description: "No, never. .DS_Store is macOS Finder metadata with no project value. Here's why, how to ignore it globally, and how to remove one that's already committed."
---

# Should You Commit .DS_Store?

No. `.DS_Store` is a hidden file macOS creates in every folder Finder touches, and it holds nothing your project needs — just how a window looked on your Mac. Committing it adds noise, churns on every pull, leaks your local folder layout, and means nothing to teammates on Windows or Linux who never generate the file at all. There is no version of "yes" here. The only real question is *where* you ignore it: in the project's `.gitignore`, or globally on your machine so you never think about it again.

This one trips up new macOS developers constantly because the file is invisible in Finder and created silently. You open a folder, switch to icon view, resize the window — and macOS quietly writes a `.DS_Store` recording that state. Run `git add .` without a `.gitignore` entry and it sails into your commit. The fix is permanent and takes one line; the trick is knowing which line and where to put it.

## The short answer

| Question | Answer |
|---|---|
| Commit `.DS_Store`? | **No** — under any circumstances. |
| Add it to `.gitignore`? | **Yes** — project-level, global, or both. |
| Best long-term fix? | A **global** gitignore on every Mac you use. |
| Already committed it? | `git rm --cached`, then ignore it. |
| Does it affect Windows/Linux teammates? | No — they never create it, but they inherit yours if committed. |

The principle: `.DS_Store` is **machine state, not project state.** Anything that records how *your* OS displayed a folder belongs on your machine, never in shared history. The same rule retires every other OS-generated junk file below.

## What .DS_Store actually is

`.DS_Store` stands for **Desktop Services Store**. The macOS Finder writes it to store per-folder display attributes:

- Icon positions and the folder's view mode (icon, list, column, gallery)
- Window size and scroll position
- Background image or color for that folder
- Spotlight comments and a few other Finder-only flags

That's the entire scope. None of it describes your code, your dependencies, or your build. It's the macOS equivalent of remembering which way you tilted a picture frame — useful to you, irrelevant to the project, and meaningless on any other operating system. Finder creates one automatically the moment it renders a folder, including folders inside your repository, which is why they appear without you ever creating one deliberately.

## Why committing it is always wrong

Four concrete problems, each on its own enough to keep it out:

1. **Pure noise.** A `.DS_Store` carries zero information another developer can use. It clutters `git status`, pull requests, and `git log` with a file nobody can review.
2. **Constant churn.** The file is rewritten whenever you so much as resize a Finder window. Commit it and it reappears as a modified file again and again, generating meaningless diffs and merge conflicts between teammates whose Finders disagree.
3. **It leaks your local layout.** The binary contents encode folder names and structure as they existed on your machine — including, sometimes, names of sibling files you'd rather not broadcast. It's a small information leak with no upside.
4. **It's irrelevant cross-platform.** Windows and Linux contributors never generate `.DS_Store`. Committing yours forces an Apple-specific artifact onto people whose machines have no concept of it, and they can't even clean it up meaningfully.

There is no scenario where a teammate benefits from your `.DS_Store`. That's what makes this an unconditional "no" rather than the "it depends" you get with editor config or lock files.

## How to ignore it: project vs. global

Two places to add the rule, and the right answer is usually **both**.

**Project-level** — add it to the repository's `.gitignore` so the rule travels with the repo and protects every contributor on a Mac:

```gitignore
# macOS Finder metadata
.DS_Store
.DS_Store?
.AppleDouble
.LSOverride
```

The bare `.DS_Store` line matches the file in any directory of the repo. Adding it to the project `.gitignore` is the polite default for any repo a Mac user might touch, even a team that's mostly on Linux.

**Global (recommended)** — configure one gitignore for your whole machine so *every* repository you ever clone ignores `.DS_Store` without needing the line:

```bash
# Create a global ignore file and point Git at it
echo ".DS_Store" >> ~/.gitignore_global
git config --global core.excludesFile ~/.gitignore_global
```

The global approach is the real fix. It means you never accidentally commit a `.DS_Store` to someone else's repo that forgot the project-level rule, and you stop relying on every project maintainer to remember an Apple-specific file. Best practice on a shared team: maintainers add it to the project `.gitignore` (protects everyone), and each Mac developer also sets a global ignore (protects them everywhere).

## Removing one that's already committed

Adding a `.gitignore` rule does **not** remove a file Git is already tracking — `.gitignore` only affects untracked files. If `.DS_Store` is already in history, stop tracking it explicitly:

```bash
# Remove a single tracked .DS_Store from the index, keep it on disk
git rm --cached .DS_Store

# Remove every tracked .DS_Store anywhere in the repo
find . -name .DS_Store -print0 | xargs -0 git rm --cached --ignore-unmatch

# Then add the ignore rule and commit
echo ".DS_Store" >> .gitignore
git commit -m "Stop tracking .DS_Store and ignore it"
```

`--cached` removes the file from Git's tracking but leaves the actual file on your disk, so Finder is unaffected. `--ignore-unmatch` keeps the command from failing in directories that happen not to have one. After this commit, the ignore rule takes over and the file stays out for good.

To also delete the physical files from your working tree (they'll just regenerate, but if you want a clean sweep):

```bash
find . -name .DS_Store -delete
```

Purging `.DS_Store` from *past* history entirely is rarely worth it — it requires rewriting history with `git filter-repo` or BFG and force-pushing, which disrupts every collaborator. Unless the leaked folder names are genuinely sensitive, stop tracking it going forward and move on.

## .DS_Store vs. other OS junk files

`.DS_Store` is one of a family of OS-generated files that follow the exact same rule — machine state, never commit:

| File | Created by | Commit? | What it stores |
|---|---|---|---|
| `.DS_Store` | macOS Finder | **No** | Folder view and icon layout |
| `._*` (AppleDouble) | macOS on non-Mac filesystems | **No** | Resource forks and metadata |
| `Thumbs.db` | Windows Explorer | **No** | Thumbnail cache for a folder |
| `desktop.ini` | Windows Explorer | **No** | Folder display customization |
| `Icon\r` | macOS custom folder icons | **No** | Custom folder icon data |

A thorough cross-platform `.gitignore` ignores all of them, which is exactly what GitHub's own [`Global/macOS.gitignore`](https://github.com/github/gitignore) and `Windows.gitignore` templates do. If you maintain a repo with mixed-OS contributors, pull those templates in rather than listing files one at a time — they stay current as Apple and Microsoft invent new metadata files.

## The bottom line

`.DS_Store` never belongs in a Git repository. It's Finder's private note about how a folder looked on your Mac, it changes every time you touch a window, and it means nothing to anyone else — least of all teammates who aren't on macOS. Add `.DS_Store` to the project's `.gitignore` so the rule ships with the repo, and set a **global** gitignore on each Mac so you stop committing it to other people's projects too.

If one already slipped in, `git rm --cached` it, add the ignore rule, and commit. Then forget the file exists — which is exactly where it belongs in your mental model of the repo.

## See Also

- [The Developer's Guide to What Belongs in Your Git Repository](./git-repository-files-guide) — the full committed-vs-ignored reference
- [Should You Commit node_modules?](./should-you-commit-node-modules) — another unconditional "no," for a very different reason
- [Should You Commit the dist Folder?](./should-you-commit-dist-folder) — build output that follows the same ignore-it logic
- [Should You Commit the .vscode Directory?](./should-you-commit-vscode-directory) — editor config, where the answer is "it depends" instead
- [.env Files and Git: What to Commit and What to Ignore](./env-files-git-guide) — the other file new developers commit by accident
