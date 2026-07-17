# TESTING.md — Testing Strategy & Standards

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [CI_CD.md](CI_CD.md) | [BACKEND.md](BACKEND.md) | [FRONTEND.md](FRONTEND.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | Testing strategy, tools, and standards across all layers |

---

## Overview

Testing is mandatory for all production code. The strategy follows the testing pyramid: many unit tests, fewer integration tests, minimal but critical E2E tests.

---

## Testing Pyramid

```
        /\
       /E2E\          Playwright: critical user flows
      /------\
     /Integr. \       Vitest + Miniflare: route handlers, middleware
    /----------\
   /   Unit     \     Vitest: services, utilities, components
  /--------------\
```

---

## Tools

| Tool | Purpose |
|---|---|
| Vitest | Unit and integration tests (Workers + Frontend) |
| Miniflare | Cloudflare Workers emulator for integration tests |
| React Testing Library | React component testing |
| MSW (Mock Service Worker) | API mocking for frontend tests |
| Playwright | End-to-end browser testing |
| @cloudflare/vitest-pool-workers | Run tests inside real Workers runtime |

---

## Coverage Targets

| Layer | Target Coverage |
|---|---|
| Backend services | 80%+ |
| Backend routes | 70%+ |
| Frontend components | 70%+ |
| Utilities/helpers | 90%+ |
| E2E (critical flows) | 100% of critical paths |

---

## Backend Unit Tests

```typescript
// services/__tests__/user.service.test.ts
import { describe, it, expect, vi } from 'vitest';
import { UserService } from '../user.service';

describe('UserService', () => {
  it('returns cached user from KV', async () => {
    const mockKV = {
      get: vi.fn().mockResolvedValue(JSON.stringify({ id: '1', email: 'a@b.com' })),
    } as unknown as KVNamespace;

    const service = new UserService(mockRepo, mockKV);
    const user = await service.getUserById('1');

    expect(user.email).toBe('a@b.com');
    expect(mockKV.get).toHaveBeenCalledWith('user:1');
  });

  it('throws NotFoundError for unknown user', async () => {
    const mockRepo = { findById: vi.fn().mockResolvedValue(null) };
    const mockKV = { get: vi.fn().mockResolvedValue(null) } as unknown as KVNamespace;

    const service = new UserService(mockRepo as any, mockKV);
    await expect(service.getUserById('unknown')).rejects.toThrow('User not found');
  });
});
```

---

## Backend Integration Tests (Miniflare)

```typescript
// routes/__tests__/users.test.ts
import { SELF } from 'cloudflare:test';
import { describe, it, expect, beforeAll } from 'vitest';

describe('GET /api/v1/users/:id', () => {
  it('returns 401 without auth token', async () => {
    const response = await SELF.fetch('http://localhost/api/v1/users/123');
    expect(response.status).toBe(401);
  });

  it('returns user when authenticated', async () => {
    const response = await SELF.fetch('http://localhost/api/v1/users/test-user-id', {
      headers: { Authorization: `****** },
    });
    expect(response.status).toBe(200);
    const { data } = await response.json();
    expect(data.id).toBe('test-user-id');
  });
});
```

---

## Frontend Component Tests

```typescript
// components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## E2E Tests (Playwright)

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can login and view dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'SecurePass123!');
  await page.click('[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Dashboard');
});

test('redirects unauthenticated users to login', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL('/login');
});
```

---

## Test Configuration

```typescript
// vitest.config.ts
import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.toml' },
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
      },
    },
  },
});
```

---

## Running Tests

```bash
# All tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests (requires running server)
npm run test:e2e

# E2E tests with UI
npx playwright test --ui
```

---

## Test Data & Fixtures

- Use factory functions to create test data
- Never use production data in tests
- Seed test database with known state before integration tests
- Reset test state between tests via `beforeEach` hooks

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial testing documentation |

---

## Related Documents

- [CI_CD.md](CI_CD.md) — Tests in pipeline
- [BACKEND.md](BACKEND.md) — Backend test patterns
- [FRONTEND.md](FRONTEND.md) — Frontend test patterns
- [ERROR_HANDLING.md](ERROR_HANDLING.md) — Testing error cases
- [docs/testing/README.md](docs/testing/README.md) — Testing deep dive
