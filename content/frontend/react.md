# React

React is a JavaScript library for building user interfaces, created by Meta. It is the foundation of Next.js and the most widely used frontend framework. React uses a component-based architecture where you build UIs by composing reusable pieces, each managing their own state and rendering.

## Core Concepts

### Components

Everything in React is a component — a function that returns JSX (HTML-like syntax):

```tsx
function Welcome({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}
```

### State and Hooks

React Hooks manage state and side effects in components:

```tsx
'use client';
import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### Common Hooks

| Hook | Purpose |
|------|---------|
| `useState` | Manage local component state |
| `useEffect` | Run side effects (API calls, subscriptions, DOM updates) |
| `useRef` | Reference DOM elements or persist values across renders |
| `useMemo` | Cache expensive calculations |
| `useCallback` | Cache function references for performance |
| `useContext` | Access shared state without prop drilling |

### Props

Components communicate through props (properties passed from parent to child):

```tsx
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border rounded p-4">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

// Usage:
<Card title="Welcome">
  <p>This is the card content.</p>
</Card>
```

## Server Components vs Client Components

In Next.js with the App Router:

- **Server Components** (default): Render on the server, can directly access databases and APIs, no client-side JavaScript shipped
- **Client Components** (with `'use client'`): Run in the browser, support hooks, event handlers, and browser APIs

```tsx
// Server Component (default) — no 'use client' directive
async function UserProfile({ userId }: { userId: string }) {
  const user = await db.users.find(userId); // Direct database access
  return <h1>{user.name}</h1>;
}

// Client Component — needs interactivity
'use client';
function LikeButton() {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>{liked ? 'Liked' : 'Like'}</button>;
}
```

## Best Practices

- Keep components small and focused on a single responsibility
- Use Server Components by default; add `'use client'` only when you need interactivity
- Lift state up to the nearest common parent when siblings need to share data
- Use TypeScript for type-safe props and state
- Avoid unnecessary re-renders by memoizing expensive computations

## Resources

- [React Documentation](https://react.dev)
- [React Hooks Reference](https://react.dev/reference/react/hooks)
- [Next.js React Foundations](https://nextjs.org/learn/react-foundations)
