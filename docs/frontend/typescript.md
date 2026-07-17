# TypeScript Standards

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [FRONTEND.md](../../FRONTEND.md) | **Related:** [CODING_STANDARDS.md](../../CODING_STANDARDS.md)

## Overview

TypeScript conventions for this project. See [CODING_STANDARDS.md](../../CODING_STANDARDS.md) for general coding standards.

## tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## Type Patterns

```typescript
// Prefer interface for object shapes
interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// Use type for unions and computed types
type UserRole = 'admin' | 'editor' | 'viewer';
type PartialUser = Partial<Pick<User, 'name' | 'email'>>;

// Avoid `any` — use `unknown` + type narrowing
function processData(data: unknown): string {
  if (typeof data !== 'string') throw new TypeError('Expected string');
  return data.toUpperCase();
}

// Use `satisfies` for config validation
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
} satisfies AppConfig;
```

## React + TypeScript

```tsx
// Typed props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

// Generic components
function List<T extends { id: string }>({ items, renderItem }: {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}) {
  return <ul>{items.map(item => <li key={item.id}>{renderItem(item)}</li>)}</ul>;
}
```

## Verified Sources

- TypeScript Docs — https://www.typescriptlang.org/docs/
- React TypeScript Guide — https://react-typescript-cheatsheet.netlify.app/
