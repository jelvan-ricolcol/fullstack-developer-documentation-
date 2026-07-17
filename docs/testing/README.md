# Testing

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [TESTING.md](../../TESTING.md) | **Related:** [CI_CD.md](../../CI_CD.md)

## Overview

This directory contains detailed testing documentation. For the testing strategy overview, see [TESTING.md](../../TESTING.md).

## Tools

| Tool | Version | Purpose |
|---|---|---|
| Vitest | 1.x | Unit and integration tests |
| @cloudflare/vitest-pool-workers | latest | Run tests in real Workers runtime |
| React Testing Library | 14.x | Component testing |
| MSW | 2.x | API mocking in frontend tests |
| Playwright | 1.x | End-to-end browser testing |
| Miniflare | 3.x | Local Workers emulator |

## Test Types

### Unit Tests
- Location: `**/__tests__/*.test.ts(x)` co-located with source
- Run: `npm run test`
- Covers: Services, utilities, validators, components

### Integration Tests
- Location: `test/integration/**/*.test.ts`
- Run: `npm run test:integration`
- Covers: Route handlers with real Worker bindings (Miniflare)

### E2E Tests
- Location: `e2e/**/*.spec.ts`
- Run: `npm run test:e2e`
- Covers: Critical user flows (login, create, read, delete)

## Running Tests

```bash
npm run test              # All unit tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
npm run test:e2e          # E2E with Playwright
```

## Coverage Thresholds

| Metric | Threshold |
|---|---|
| Lines | 80% |
| Functions | 80% |
| Branches | 75% |

## Verified Sources

- Vitest Docs — https://vitest.dev/
- Playwright Docs — https://playwright.dev/
- React Testing Library — https://testing-library.com/
- Cloudflare Vitest Pool — https://developers.cloudflare.com/workers/testing/vitest-integration/


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
