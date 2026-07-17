# JavaScript Standards

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [FRONTEND.md](../../FRONTEND.md) | **Related:** [CODING_STANDARDS.md](../../CODING_STANDARDS.md)

## Overview

JavaScript/TypeScript standards. Prefer TypeScript for all new code. See [docs/frontend/typescript.md](typescript.md).

## ES Features Used

- ES2022+ features enabled via Vite + esbuild
- `async/await` for all asynchronous code
- Optional chaining (`?.`) and nullish coalescing (`??`)
- Destructuring, spread operator
- Array methods (`map`, `filter`, `reduce`, `flatMap`)
- `crypto.randomUUID()` for IDs

## Avoid

- `var` — Use `const`/`let`
- `==` — Use `===`
- `arguments` — Use rest parameters `...args`
- `Promise` chains — Use `async/await`
- `eval()` — Never (security risk)
- `document.write()` — Never

## Module System

ES Modules only (`import`/`export`). No CommonJS (`require`/`module.exports`).

```typescript
// ✅ ESM
import { UserService } from './user.service';
export { UserService };

// ❌ CJS
const { UserService } = require('./user.service');
```

## Verified Sources

- ECMAScript Spec — https://tc39.es/ecma262/
- MDN JavaScript — https://developer.mozilla.org/en-US/docs/Web/JavaScript


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
