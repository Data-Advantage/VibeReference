# TypeScript

TypeScript is a strongly typed programming language that builds on JavaScript by adding static type definitions. It catches errors at compile time instead of runtime, provides better IDE support with autocomplete and refactoring tools, and is the standard for modern web development with React and Next.js.

## Why TypeScript?

- **Catch bugs early**: Type errors are caught during development, not in production
- **Better IDE support**: Autocomplete, inline documentation, and refactoring tools
- **Self-documenting code**: Types serve as documentation for function parameters and return values
- **Safer refactoring**: The compiler tells you everywhere that needs to change
- **Industry standard**: Used by most modern frameworks and libraries

## Key Concepts

### Basic Types

```typescript
const name: string = 'Alice';
const age: number = 30;
const isActive: boolean = true;
const tags: string[] = ['react', 'typescript'];
```

### Interfaces and Types

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

type ButtonVariant = 'primary' | 'secondary' | 'outline';
```

### Function Types

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Arrow function with types
const add = (a: number, b: number): number => a + b;

// Optional parameters
function createUser(name: string, email?: string): User {
  // ...
}
```

### Generics

```typescript
function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

const firstNumber = getFirst([1, 2, 3]); // type: number
const firstName = getFirst(['a', 'b']); // type: string
```

## TypeScript in Next.js

Next.js has built-in TypeScript support. Common patterns:

### Page Props

```typescript
// app/[slug]/page.tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <h1>{slug}</h1>;
}
```

### API Route Types

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body: { name: string } = await request.json();
  return NextResponse.json({ greeting: `Hello, ${body.name}` });
}
```

### Component Props

```typescript
interface CardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

function Card({ title, description, children }: CardProps) {
  return (
    <div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}
```

## Configuration

TypeScript is configured via `tsconfig.json`. Next.js generates this automatically:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Best Practices

- Enable `strict` mode in tsconfig for maximum type safety
- Use interfaces for object shapes and types for unions and primitives
- Avoid `any` — use `unknown` when the type is truly unknown
- Let TypeScript infer types when the type is obvious from context
- Use path aliases (`@/`) for cleaner imports

## Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Next.js TypeScript Guide](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
