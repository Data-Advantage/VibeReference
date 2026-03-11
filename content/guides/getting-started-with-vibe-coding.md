---
title: "Getting Started with Vibe Coding"
---

# Getting Started with Vibe Coding

A practical introduction to building software with AI — what vibe coding is, how to think about it, and how to get your first project off the ground.

## What Is Vibe Coding?

Vibe coding is a development approach where you describe what you want to build in natural language and let AI tools generate the code. Instead of writing every line yourself, you collaborate with AI — guiding it with prompts, reviewing its output, and iterating toward your goal.

The term was coined by Andrej Karpathy in early 2025:

> "There's a new kind of coding I call 'vibe coding', where you fully give in to the vibes, embrace exponentials, and forget that the code even exists."

In practice, vibe coding ranges from fully AI-driven generation to a tight human-AI collaboration loop. Most successful projects fall somewhere in between.

## The Vibe Coding Mindset

### Think in outcomes, not implementation
Instead of thinking "I need to create a React component with useState and useEffect hooks," think "I need a search bar that filters results as the user types." Let the AI handle implementation details.

### Iterate rapidly
Your first prompt won't produce perfect results. The workflow is: prompt → review → refine → repeat. Each iteration gets you closer.

### Stay in control
Vibe coding doesn't mean blindly accepting AI output. You should:
- Review generated code before committing
- Understand the architecture even if you didn't write every line
- Test functionality at each step
- Keep your project organized

## Choosing Your Tools

### AI Coding Assistants
| Tool | Best For | How It Works |
|------|----------|--------------|
| **Claude Code** | Full-stack development, complex reasoning | CLI-based agent that reads your codebase and makes edits |
| **Cursor** | IDE-integrated coding | VS Code fork with AI built into the editor |
| **GitHub Copilot** | Line-by-line code completion | Autocomplete suggestions as you type |
| **v0 by Vercel** | UI component generation | Chat-based UI that generates React components |
| **Bolt** | Full-stack app scaffolding | Browser-based AI that builds and deploys apps |
| **Replit Agent** | Quick prototypes | Cloud IDE with an AI agent that builds features |
| **Lovable** | Full-stack app generation | AI that generates and deploys complete apps |

### Recommended Stack for Beginners
If you're starting your first vibe-coded project, this stack has the most AI tool support and community resources:

- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **Database**: Supabase (Postgres)
- **Auth**: Supabase Auth or Clerk
- **Hosting**: Vercel
- **Payments**: Stripe (when needed)

## Your First Vibe-Coded Project

### Step 1: Start with a clear idea
Write a one-paragraph description of what you want to build. Be specific about:
- Who it's for
- What problem it solves
- The core feature (just one to start)

**Example**: "A simple bookmark manager for developers. Users can save URLs with tags, search their bookmarks, and share collections. The core feature is saving and tagging bookmarks."

### Step 2: Set up your environment
1. Install Node.js (v18+)
2. Choose your AI tool (Claude Code, Cursor, or v0 are good starting points)
3. Create a new Next.js project: `npx create-next-app@latest my-app`
4. Initialize a Git repository and make your first commit

### Step 3: Build incrementally
Don't try to build everything at once. Work in this order:
1. **Landing page** — Get something visual up first
2. **Core feature** — The one thing your app does
3. **Authentication** — Let users sign in
4. **Data persistence** — Connect a database
5. **Polish** — Improve the UI, add error handling

### Step 4: Prompt effectively
When working with AI tools, provide context:

```
I'm building a bookmark manager with Next.js 14 (App Router),
Tailwind CSS, and Supabase.

I need a component that displays a grid of bookmark cards.
Each card should show:
- The page title
- The URL (truncated)
- Tags as colored pills
- A delete button

The bookmarks data comes from a Supabase table called "bookmarks"
with columns: id, title, url, tags (text array), user_id, created_at.
```

### Step 5: Review and iterate
After each AI generation:
- Does it work? Run it and test
- Does it look right? Check the UI
- Is it organized? Check file structure
- Is it secure? Look for exposed keys, missing auth checks

## Common Pitfalls to Avoid

1. **Skipping version control** — Commit frequently. AI can generate broken code, and you need to be able to roll back.

2. **Prompting too vaguely** — "Make it better" won't help. Be specific: "Add loading states to the bookmark cards and handle the empty state when no bookmarks exist."

3. **Building too much at once** — Ship a working MVP before adding features. You can always iterate.

4. **Ignoring errors** — When something breaks, paste the error message to your AI tool and ask it to fix the issue. Don't just skip it.

5. **Not testing on mobile** — Open your browser dev tools and test responsive layouts early. It's harder to fix later.

## Next Steps

Once you're comfortable with the basics:
- Read the **Choosing Your Tech Stack** guide to understand your options
- Read **Prompt Engineering for Code Generation** to level up your prompting
- Read **Deploying to Production** when you're ready to ship
