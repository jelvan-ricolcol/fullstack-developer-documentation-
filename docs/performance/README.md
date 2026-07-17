# Performance

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [PERFORMANCE.md](../../PERFORMANCE.md) | **Related:** [MONITORING.md](../../MONITORING.md)

## Overview

Performance documentation for the full-stack application. See [PERFORMANCE.md](../../PERFORMANCE.md) for budgets and targets.

## Core Web Vitals Targets

| Metric | Good | Alert |
|---|---|---|
| LCP | ≤ 2.5s | > 4s |
| INP | ≤ 200ms | > 500ms |
| CLS | ≤ 0.1 | > 0.25 |

## API Latency Targets

| Percentile | Target | Alert |
|---|---|---|
| p50 | < 50ms | > 100ms |
| p95 | < 150ms | > 300ms |
| p99 | < 300ms | > 500ms |

## Key Optimizations

### Cloudflare Workers
- Use `ctx.waitUntil()` for non-blocking background tasks
- Cache hot data in KV with appropriate TTL
- Use `env.DB.batch()` for parallel D1 queries
- Keep Worker CPU under 10ms on free tier

### Frontend
- Route-level code splitting with React.lazy
- Image optimization (WebP, lazy loading)
- Preload critical routes and fonts
- Bundle size budget: < 200KB gzipped initial JS

## Profiling Tools

```bash
# Worker CPU time
wrangler tail --env production --format json | jq '.cpuTime'

# Lighthouse audit
npx lhci autorun

# Bundle analysis
npm run build:analyze
```

## Verified Sources

- Web Vitals — https://web.dev/vitals/
- Cloudflare Workers Limits — https://developers.cloudflare.com/workers/platform/limits/
- Lighthouse CI — https://github.com/GoogleChrome/lighthouse-ci
