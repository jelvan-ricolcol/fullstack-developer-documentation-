# CODING_STANDARDS.md — Coding Standards & Conventions

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [FILE_STRUCTURE.md](FILE_STRUCTURE.md) | [STYLE_GUIDE.md](STYLE_GUIDE.md) | [CONTRIBUTING.md](CONTRIBUTING.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | All code style, naming, and convention rules |

---

## Overview

Consistent code style reduces cognitive load, enables AI-assisted development, and ensures maintainability. All standards are enforced by ESLint, TypeScript, and Prettier.

---

## Language Standards

### TypeScript

- **Strict mode:** `"strict": true` in tsconfig
- **Explicit return types:** Required on all public functions and module exports
- **No `any`:** Use `unknown` and narrow with type guards
- **Prefer `interface` for object shapes:** `interface User {}` not `type User = {}`
- **Prefer `type` for unions/intersections:** `type Role = 'admin' | 'viewer'`
- **No implicit undefined:** Use `string | undefined` explicitly

```typescript
// ✅ Good
export function getUserById(id: string): Promise<User | null> {
  return repo.findById(id);
}

// ❌ Bad
export function getUserById(id) {
  return repo.findById(id);
}
```

---

## Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Variables | `camelCase` | `userId`, `accessToken` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT` |
| Functions | `camelCase` | `getUserById` |
| Classes | `PascalCase` | `UserService` |
| Interfaces | `PascalCase` | `UserProfile` |
| Types | `PascalCase` | `ApiError` |
| Enums | `PascalCase` values | `Role.Admin` |
| Files | `kebab-case` | `user-service.ts` |
| React components | `PascalCase.tsx` | `UserProfile.tsx` |
| CSS classes | `kebab-case` | `modal-overlay` |
| Database tables | `snake_case` | `user_sessions` |
| Database columns | `snake_case` | `created_at` |
| Environment variables | `UPPER_SNAKE_CASE` | `JWT_SECRET` |
| API endpoints | `kebab-case` path | `/api/v1/user-profiles` |
| Git branches | `kebab-case` | `feature/add-auth` |

---

## Import Order

Imports must be ordered (enforced by ESLint):
1. External packages
2. Internal packages / path aliases
3. Relative imports
4. Type-only imports (last)

```typescript
// 1. External
import { Hono } from 'hono';
import { z } from 'zod';

// 2. Internal aliases
import { AppError } from '@/lib/errors';

// 3. Relative
import { userSchema } from './validators';

// 4. Types
import type { User } from './types';
```

---

## Function Design

- Functions do one thing (Single Responsibility Principle)
- Max function length: ~40 lines (prefer shorter)
- Max function arguments: 3 positional (use object parameter beyond that)
- Pure functions preferred where possible

```typescript
// ✅ Good — options object for multiple params
async function sendEmail(options: {
  to: string;
  subject: string;
  body: string;
  templateId?: string;
}): Promise<void>

// ❌ Bad — too many positional params
async function sendEmail(to: string, subject: string, body: string, templateId?: string)
```

---

## Error Handling

- Never swallow errors silently
- Always rethrow or log caught errors
- Use typed error classes (see [ERROR_HANDLING.md](ERROR_HANDLING.md))
- Use `try/catch` only at the appropriate boundary (route handler or service)

---

## Comments

- Comments explain **why**, not **what**
- Avoid obvious comments that mirror the code
- Use JSDoc for all public functions, classes, and interfaces
- Mark TODOs: `// TODO(username): description` — do not leave untracked TODOs

```typescript
/**
 * Returns the user by ID, or null if not found.
 * Uses KV cache with 5-minute TTL to reduce D1 reads.
 */
export async function getUserById(id: string): Promise<User | null> {
  // Check cache first to avoid unnecessary D1 reads
  const cached = await kv.get(`user:${id}`);
  // ...
}
```

---

## React Component Standards

- One component per file
- Prefer function components and hooks
- Name the default export and use `displayName` for forwardRef
- Avoid inline functions in JSX for stable references
- Use `useCallback` and `useMemo` only when profiling shows a need

---

## Security Coding Rules

- Never concatenate user input into SQL queries
- Never use `dangerouslySetInnerHTML` with untrusted content
- Validate all inputs with Zod at API boundaries
- Never log sensitive data (passwords, tokens, PII)
- Use HTTPS everywhere; Workers enforce this via Cloudflare

---

## Linting & Formatting

```bash
# Run linter
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run typecheck
```

### ESLint Rules (key)
- `no-unused-vars`: error
- `no-explicit-any`: error
- `prefer-const`: error
- `no-console`: warn (use logger instead)
- `import/order`: enforced
- `react-hooks/rules-of-hooks`: error
- `react-hooks/exhaustive-deps`: warn

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial coding standards documentation |

---

## Related Documents

- [FILE_STRUCTURE.md](FILE_STRUCTURE.md) — File organization
- [STYLE_GUIDE.md](STYLE_GUIDE.md) — Documentation style
- [CONTRIBUTING.md](CONTRIBUTING.md) — Contribution process
- [ERROR_HANDLING.md](ERROR_HANDLING.md) — Error conventions
- [TESTING.md](TESTING.md) — Test conventions
