# PERFORMANCE.md — Performance Standards & Optimization

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [MONITORING.md](MONITORING.md) | [OBSERVABILITY.md](OBSERVABILITY.md) | [CLOUDFLARE.md](CLOUDFLARE.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | Frontend and backend performance budgets, patterns, and monitoring |

---

## Performance Budgets

### Core Web Vitals (Frontend)

| Metric | Good | Needs Improvement | Poor |
|---|---|---|---|
| LCP (Largest Contentful Paint) | ≤ 2.5s | 2.5s – 4.0s | > 4.0s |
| INP (Interaction to Next Paint) | ≤ 200ms | 200ms – 500ms | > 500ms |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | 0.1 – 0.25 | > 0.25 |

**Target:** Good on all three for all pages on mobile (3G connection).

### API Performance (Backend)

| Metric | Target | Alert Threshold |
|---|---|---|
| p50 latency | < 50ms | > 100ms |
| p95 latency | < 150ms | > 300ms |
| p99 latency | < 300ms | > 500ms |
| Error rate | < 0.1% | > 1% |
| Worker CPU (p99) | < 10ms | > 20ms |

### Bundle Size (Frontend)

| Asset | Target |
|---|---|
| Initial JS bundle | < 200KB gzipped |
| Initial CSS bundle | < 50KB gzipped |
| Per-route chunk | < 100KB gzipped |
| Total page weight | < 1MB |

---

## Frontend Performance

### Code Splitting
```typescript
// Route-level lazy loading
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Settings = React.lazy(() => import('./pages/Settings'));

// Wrap in Suspense
<Suspense fallback={<PageLoader />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Suspense>
```

### Image Optimization
- Use WebP format for photographs
- Use SVG for icons and illustrations
- Set explicit `width` and `height` to prevent CLS
- Use `loading="lazy"` for below-fold images
- Serve via Cloudflare Images or R2 + CF Cache

### Caching Strategy
```typescript
// React Query: cache server data
useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 60_000,      // 1 minute fresh
  gcTime: 300_000,        // 5 minutes in cache
});
```

### Preloading
```html
<!-- Preload critical routes -->
<link rel="prefetch" href="/dashboard" />

<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/inter.woff2" as="font" crossorigin />
```

---

## Backend Performance

### Worker Optimization
```typescript
// Use ctx.waitUntil for non-blocking background work
ctx.waitUntil(auditLog(env.DB, { action: 'read', resource: 'users' }));

// Parallel KV + D1 lookups when independent
const [cached, userCount] = await Promise.all([
  env.KV.get('stats:users'),
  env.DB.prepare('SELECT COUNT(*) as count FROM users').first(),
]);
```

### KV Cache Pattern
```typescript
async function getWithCache<T>(
  kv: KVNamespace,
  key: string,
  fetcher: () => Promise<T>,
  ttl = 300
): Promise<T> {
  const cached = await kv.get(key);
  if (cached) return JSON.parse(cached);

  const data = await fetcher();
  await kv.put(key, JSON.stringify(data), { expirationTtl: ttl });
  return data;
}
```

### Database Query Optimization
- Use indexes on all `WHERE` and `ORDER BY` columns
- Select only required columns (avoid `SELECT *`)
- Use `LIMIT` on all list queries
- Use batch queries (`env.DB.batch()`) for multiple independent queries
- Cache with KV for read-heavy data

---

## Cloudflare CDN Optimization

### Cache-Control Headers
```typescript
// Static assets (long-lived)
headers.set('Cache-Control', 'public, max-age=31536000, immutable');

// API responses (short-lived)
headers.set('Cache-Control', 'private, max-age=0, must-revalidate');

// Public, cacheable API (e.g., public config)
headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
```

---

## Performance Monitoring

- **Cloudflare Analytics:** Request count, CPU time, error rate
- **Core Web Vitals:** Measured via `web-vitals` library and reported to analytics
- **Synthetic monitoring:** Scheduled Playwright tests measuring key user flows
- **Real User Monitoring (RUM):** Consider PostHog or Datadog RUM

See: [MONITORING.md](MONITORING.md)

---

## Performance Testing

```bash
# Lighthouse CI
npm run build && npx lhci autorun

# Bundle analysis
npm run build:analyze  # Opens bundle visualizer

# Load test Worker API (k6 or similar)
k6 run load-test.js
```

---

## Known Performance Risks

- D1 single-writer: high-write workloads will saturate D1. Migrate to Hyperdrive + PostgreSQL.
- Durable Objects are single-region: avoid for latency-sensitive, globally distributed reads.
- KV eventual consistency: cache invalidation bugs can serve stale data.

See: [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md)

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial performance documentation |

---

## Related Documents

- [MONITORING.md](MONITORING.md) — Metrics and alerting
- [OBSERVABILITY.md](OBSERVABILITY.md) — Distributed tracing
- [CLOUDFLARE.md](CLOUDFLARE.md) — CDN and caching
- [BACKEND.md](BACKEND.md) — Backend patterns
- [FRONTEND.md](FRONTEND.md) — Frontend patterns
- [docs/performance/README.md](docs/performance/README.md) — Performance deep dive


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
