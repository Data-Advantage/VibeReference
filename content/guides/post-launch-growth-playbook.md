---
title: "Post-Launch Growth Playbook"
---

# Post-Launch Growth Playbook

Analytics setup, user feedback loops, iteration strategies, and marketing channels for indie SaaS.

## The First Week After Launch

### Day 1: Monitor everything
- Watch Vercel Analytics for errors and performance issues
- Check Supabase logs for failed queries or auth issues
- Monitor Stripe for payment processing problems
- Respond to every piece of user feedback within hours

### Days 2-3: Fix critical issues
- Prioritize bugs that block core functionality
- Fix any mobile/responsive issues users report
- Address confusing UX that causes support requests

### Days 4-7: Gather insights
- Identify the most-used and least-used features
- Note where users drop off in onboarding
- Collect feedback themes (what do people love? what frustrates them?)

## Analytics Setup

### Vercel Analytics

Enable in your Vercel project settings. It provides:
- **Web Vitals** — Real performance data from users
- **Page views** — Traffic patterns by page
- **Top referrers** — Where traffic comes from

### Custom Event Tracking

Track key user actions beyond page views:

```typescript
// lib/analytics.ts
export function trackEvent(name: string, properties?: Record<string, string>) {
  // Vercel Analytics
  if (typeof window !== 'undefined' && window.va) {
    window.va('event', { name, ...properties })
  }
}
```

### Events Worth Tracking

| Event | Why It Matters |
|-------|---------------|
| `signup_completed` | Measures top-of-funnel conversion |
| `onboarding_completed` | Measures activation |
| `core_feature_used` | Measures engagement |
| `upgrade_clicked` | Measures purchase intent |
| `subscription_created` | Measures revenue conversion |
| `subscription_canceled` | Measures churn |
| `invite_sent` | Measures viral growth |

### Key Metrics to Watch

**Activation rate**: % of signups who complete the core action within 7 days. If this is low, your onboarding needs work.

**Retention**: % of users who return in week 2, week 4, week 8. This is the most important metric for long-term viability.

**Conversion rate**: % of free users who upgrade to paid. Benchmarks vary, but 2-5% is typical for freemium SaaS.

**Churn rate**: % of paying customers who cancel per month. Keep this under 5% monthly.

## User Feedback Loops

### In-App Feedback

Add a simple feedback mechanism:

```tsx
// components/FeedbackWidget.tsx
'use client'
import { useState } from 'react'

export function FeedbackWidget() {
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit() {
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback, page: window.location.pathname }),
    })
    setSubmitted(true)
  }

  if (submitted) return <p className="text-sm text-green-600">Thanks!</p>

  return (
    <div className="fixed bottom-4 right-4">
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Feedback or bug report..."
        className="border rounded p-2 text-sm w-64"
      />
      <button onClick={handleSubmit} className="mt-1 text-sm text-blue-600">
        Send
      </button>
    </div>
  )
}
```

### Talking to Users

The highest-signal feedback comes from conversations:

1. **Reach out to active users** — "Thanks for using [app]. I'd love to hear what's working and what isn't. Do you have 15 minutes for a quick chat?"
2. **Ask open-ended questions** — "What were you trying to do when you signed up?" and "What's the most frustrating part of using [app]?"
3. **Watch them use it** — Screen share sessions reveal UX issues that users won't think to report

### Prioritizing Feedback

Use the ICE framework:

| Factor | Question |
|--------|----------|
| **Impact** | How many users does this affect? How much value does it create? |
| **Confidence** | How sure are we this will work? Is it validated by multiple users? |
| **Ease** | How quickly can we implement this? |

Score each 1-10, multiply for a total. Work on highest-scoring items first.

## Growth Channels

### Content Marketing (Highest ROI for Indie SaaS)

Write content that attracts your target users:
- **SEO blog posts** — "How to [solve problem your product addresses]"
- **Tutorials** — Show your product solving real problems
- **Comparison pages** — "[Your product] vs [competitor]"

See the **SEO Fundamentals for SaaS** guide for implementation details.

### Product Hunt Launch

Tips for a successful launch:
- Launch on Tuesday or Wednesday
- Have 5-10 supporters ready to upvote and comment early
- Prepare a compelling tagline (under 60 chars) and description
- Include a demo GIF or video
- Be active in the comments all day

### Social Media

**Twitter/X**: Share your building journey. Developers and founders follow indie makers. Post about:
- Problems you solved
- Metrics and milestones
- Technical decisions and why
- Lessons learned

**Reddit**: Find relevant subreddits for your niche. Contribute value first, share your product when relevant. Never spam.

**Hacker News**: Submit a "Show HN" post. Be genuine about what you built and why. Respond to all comments.

### Email Marketing

Build a list from day one:
- Add a waitlist/newsletter signup to your landing page
- Send a welcome email immediately after signup
- Share product updates and tips weekly or biweekly
- Segment by engagement (active users vs churned vs free)

See the reference pages on email marketing tools for implementation details.

## Iteration Strategy

### Weekly Rhythm

| Day | Focus |
|-----|-------|
| Monday | Review metrics, prioritize tasks for the week |
| Tue-Thu | Build and ship improvements |
| Friday | Write content, engage community, plan next week |

### Release Cadence

Ship small, ship often:
- **Bug fixes**: Deploy immediately
- **Small improvements**: Deploy daily or every few days
- **New features**: Weekly or biweekly
- **Major changes**: Monthly with announcement

### When to Pivot vs Persist

**Keep going** if:
- Users love the product but want more features
- Activation rate is improving over time
- You have a clear path to more users

**Consider pivoting** if:
- Nobody returns after the first visit
- Users sign up but never use the core feature
- You can't explain the value in one sentence
- After 3 months, retention is flat or declining

## Scaling Considerations

You probably don't need to worry about scale yet. But when you do:

1. **Database**: Add indexes for slow queries, optimize N+1 queries, consider read replicas
2. **Caching**: Add Redis or in-memory caching for frequently-accessed data
3. **CDN**: Vercel handles this by default, but verify static assets are cached
4. **Background jobs**: Move slow operations (emails, AI calls, image processing) to background workers
5. **Monitoring**: Add error tracking (Sentry) and uptime monitoring (Better Uptime)

Focus on product-market fit first. Optimize later.
