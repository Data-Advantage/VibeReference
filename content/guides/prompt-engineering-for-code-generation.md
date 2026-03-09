---
title: "Prompt Engineering for Code Generation"
---

# Prompt Engineering for Code Generation

Writing effective prompts for AI coding tools — setting context, iterating on output, debugging, and handling multi-file changes.

## Core Principles

### 1. Context is everything
AI coding tools generate better code when they understand your project. Always provide:
- **Framework and language** (Next.js 14, TypeScript, Tailwind CSS)
- **Project conventions** (App Router vs Pages, server vs client components)
- **Relevant data structures** (database schema, API shapes, types)
- **What already exists** (existing components, utilities, patterns in use)

### 2. Be specific about what you want
Vague prompts produce vague results. Compare:

**Weak**: "Add a user profile page"

**Strong**: "Create a user profile page at /app/profile/page.tsx. It should display the user's name, email, and avatar from the Supabase profiles table. Include an edit form that updates the profile using a server action. Use the existing Card component from @/components/ui/card."

### 3. One thing at a time
Don't ask for an entire feature in one prompt. Break it into logical pieces:
1. Create the data model / types
2. Build the API or server actions
3. Create the UI components
4. Wire everything together
5. Add error handling and loading states

## Prompt Patterns That Work

### The Setup Prompt
Use at the start of a session to establish context:

```
I'm building [app description] with [tech stack].

Here's the current project structure:
- /app — Next.js App Router pages
- /components/ui — shadcn/ui components
- /lib — utilities and helpers
- /lib/supabase — Supabase client and types

The database has these tables:
[paste schema or describe tables]

I'm currently working on [feature].
```

### The Implementation Prompt
For generating new code:

```
Create [component/function/page] that:
1. [Specific requirement]
2. [Specific requirement]
3. [Specific requirement]

Use [existing pattern/component] as a reference.
The data comes from [source].
It should handle [edge cases: loading, errors, empty state].
```

### The Fix Prompt
For debugging:

```
I'm getting this error:
[paste full error message]

Here's the relevant code:
[paste code or reference file]

The expected behavior is [description].
What's actually happening is [description].
```

### The Refactor Prompt
For improving existing code:

```
Refactor [component/function] to:
1. [Specific improvement]
2. [Specific improvement]

Keep the existing API/interface the same.
Don't change [thing that should stay].
```

## Working with Different Tools

### Claude Code (CLI)
Claude Code reads your entire project, so you can reference files by name:
```
Look at /lib/supabase/queries.ts and add a function to
fetch bookmarks by tag. Follow the same pattern as
getBookmarksByUser.
```

It works well with explicit file references and understands project context automatically.

### Cursor
Cursor works best when you:
- Use `@file` to reference specific files
- Use `@codebase` for project-wide context
- Keep `.cursorrules` updated with project conventions
- Use Cmd+K for inline edits, Chat for larger changes

### v0 by Vercel
v0 excels at UI generation:
```
A pricing page with three tiers (Free, Pro, Enterprise)
displayed as cards. Each card shows the plan name, price,
feature list with checkmarks, and a CTA button.
Use a modern SaaS style with the Pro plan highlighted.
```

Be visual and descriptive — v0 understands design language well.

## Advanced Techniques

### Providing examples
When you want code to follow a specific pattern, show an example:

```
I have this existing API route:

[paste example route]

Create a similar route for [new endpoint] that follows
the same pattern for error handling, validation, and
response format.
```

### Chain of thought for complex logic
For complex business logic, walk through the requirements step by step:

```
I need a subscription billing function. Let me walk through
the logic:

1. Check if user has an active subscription
2. If expired, check grace period (3 days)
3. If in grace period, allow access but show warning
4. If past grace period, restrict to free tier features
5. Log all access checks for debugging

Create this as a utility function in /lib/subscription.ts.
```

### Constraint-based prompts
Tell the AI what NOT to do:

```
Add pagination to the bookmarks list page.

Constraints:
- Use URL search params for page state (not React state)
- Don't use a pagination library — keep it simple with
  Previous/Next buttons
- Don't change the existing BookmarkCard component
- Keep the existing sorting behavior
```

## Debugging with AI

### Error message workflow
1. Copy the **full** error message including the stack trace
2. Include the file and line number where it occurs
3. Describe what you were doing when the error appeared
4. Share the relevant code

### Common patterns
**"Module not found"** — Usually a missing import or package:
```
I'm getting "Module not found: Can't resolve '@/lib/utils'"
— is the path correct, or do I need to install something?
```

**Type errors** — Share the type definition and the usage:
```
TypeScript error on line 23 of /app/profile/page.tsx:
"Property 'avatar_url' does not exist on type 'Profile'"

Here's my Profile type: [paste type]
Here's the Supabase query: [paste query]
```

**Runtime errors** — Describe the expected vs actual behavior:
```
The bookmark save function completes without errors,
but the bookmark doesn't appear in the database.

Here's the function: [paste code]
Here's what I see in Supabase logs: [paste logs]
```

## Iterating Effectively

### The refinement loop
1. **Generate** — Get the first version
2. **Test** — Run it and see what happens
3. **Identify** — What specifically needs to change?
4. **Refine** — Ask for targeted changes (don't regenerate everything)

### When to start over vs iterate
**Keep iterating** when:
- The structure is right but details need fixing
- You need to add features to working code
- The approach is sound but has bugs

**Start over** when:
- The fundamental approach is wrong
- The code is too tangled to fix incrementally
- You've gone through 5+ iterations without progress

### Saving good patterns
When AI generates something you like, save the pattern:
- Keep a snippets file of prompts that work well
- Note which tool generated the best result for which task
- Build a CLAUDE.md or .cursorrules file with your project conventions
