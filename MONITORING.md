# MONITORING.md — Monitoring & Alerting

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [OBSERVABILITY.md](OBSERVABILITY.md) | [PERFORMANCE.md](PERFORMANCE.md) | [CLOUDFLARE.md](CLOUDFLARE.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | All monitoring, alerting, and operational visibility |

---

## Overview

Monitoring provides visibility into system health, performance, and errors. It enables proactive identification of issues before they impact users.

---

## Monitoring Stack

| Tool | Purpose | Tier |
|---|---|---|
| Cloudflare Analytics | Worker metrics, CDN analytics | Free (built-in) |
| Cloudflare Logpush | Ship Worker logs to external system | Paid |
| Sentry | Error tracking and alerting | Recommended |
| Uptime Robot / BetterUptime | Endpoint uptime monitoring | Recommended |
| Datadog / Grafana Cloud | Advanced metrics dashboard | Optional |

---

## Key Metrics to Monitor

### Availability
| Metric | Target | Alert |
|---|---|---|
| API uptime | 99.9% | < 99.5% |
| Error rate (5xx) | < 0.1% | > 1% |
| Health check response | < 500ms | No response |

### Performance
| Metric | Target | Alert |
|---|---|---|
| p50 API latency | < 50ms | > 150ms |
| p99 API latency | < 300ms | > 500ms |
| Worker CPU p99 | < 10ms | > 25ms |
| D1 query time p95 | < 20ms | > 100ms |

### Business Metrics
| Metric | Purpose |
|---|---|
| Active sessions | User engagement |
| API request volume | Traffic trends |
| Auth failures | Security indicator |
| Error codes frequency | Health indicator |

---

## Cloudflare Analytics

Available in Cloudflare Dashboard → Workers & Pages → Analytics:
- Request count per Worker
- CPU time distribution
- Error rate
- Geographic distribution

```bash
# Live log streaming
wrangler tail --env production

# Filter by status
wrangler tail --env production --status error
```

---

## Error Tracking (Sentry)

```typescript
// Worker initialization with Sentry
import * as Sentry from '@sentry/cloudflare';

export default Sentry.withSentry(
  (env: Env) => ({
    dsn: env.SENTRY_DSN,
    tracesSampleRate: 0.1,
    environment: env.ENVIRONMENT,
  }),
  {
    async fetch(request, env, ctx) {
      return app.fetch(request, env, ctx);
    },
  }
);
```

---

## Health Check Endpoints

```typescript
// GET /health
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// GET /health/db
app.get('/health/db', async (c) => {
  try {
    await c.env.DB.prepare('SELECT 1').first();
    return c.json({ status: 'ok', database: 'connected' });
  } catch {
    return c.json({ status: 'error', database: 'disconnected' }, 503);
  }
});
```

---

## Alerting Rules

| Alert | Condition | Channel | Severity |
|---|---|---|---|
| API down | Health check fails 3 times | Email + SMS | Critical |
| High error rate | 5xx > 1% over 5 minutes | Email | High |
| Slow API | p99 > 500ms over 10 minutes | Email | Medium |
| Auth failure spike | > 100 failures/minute | Email | High |
| D1 storage > 80% | D1 size approaching limit | Email | Medium |

---

## Incident Response

1. **Detect:** Alert fires via monitoring tool
2. **Triage:** Check Cloudflare Analytics + Sentry for root cause
3. **Communicate:** Post status update to status page
4. **Mitigate:** Rollback or hotfix
5. **Resolve:** Verify metrics return to normal
6. **Post-mortem:** Document in [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial monitoring documentation |

---

## Related Documents

- [OBSERVABILITY.md](OBSERVABILITY.md) — Distributed tracing and logs
- [PERFORMANCE.md](PERFORMANCE.md) — Performance budgets
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — Issue resolution
- [CLOUDFLARE.md](CLOUDFLARE.md) — Cloudflare analytics
- [docs/monitoring/README.md](docs/monitoring/README.md) — Monitoring deep dive


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
