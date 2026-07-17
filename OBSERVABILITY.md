# OBSERVABILITY.md — Observability: Logs, Metrics & Traces

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [MONITORING.md](MONITORING.md) | [PERFORMANCE.md](PERFORMANCE.md) | [ERROR_HANDLING.md](ERROR_HANDLING.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | Logging, metrics, and distributed tracing |

---

## Three Pillars of Observability

| Pillar | Tool | Purpose |
|---|---|---|
| **Logs** | `wrangler tail` + Logpush + Sentry | Event records, errors, audit trail |
| **Metrics** | Cloudflare Analytics + Custom | Performance indicators, counters |
| **Traces** | Cloudflare Trace + Sentry Traces | Request lifecycle, bottleneck identification |

---

## Structured Logging

All log output is structured JSON for machine readability.

```typescript
// lib/logger.ts
export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  requestId?: string;
  userId?: string;
  method?: string;
  path?: string;
  status?: number;
  durationMs?: number;
  error?: {
    code: string;
    message: string;
    stack?: string;
  };
  [key: string]: unknown;
}

export function log(entry: LogEntry): void {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    ...entry,
  }));
}
```

---

## Log Levels

| Level | When to Use |
|---|---|
| `debug` | Detailed diagnostic info (disabled in production) |
| `info` | Normal operations (requests, completions) |
| `warn` | Unexpected but handled situations |
| `error` | Failures requiring attention |

---

## Request Logging Middleware

```typescript
export async function requestLogger(
  request: Request,
  handler: () => Promise<Response>
): Promise<Response> {
  const start = Date.now();
  const requestId = crypto.randomUUID();

  const response = await handler();

  log({
    level: response.status >= 500 ? 'error' : 'info',
    message: 'Request completed',
    requestId,
    method: request.method,
    path: new URL(request.url).pathname,
    status: response.status,
    durationMs: Date.now() - start,
  });

  return response;
}
```

---

## Log Fields Reference

| Field | Type | Description |
|---|---|---|
| `timestamp` | ISO 8601 | When the log was emitted |
| `level` | enum | Log severity |
| `message` | string | Human-readable description |
| `requestId` | string | Unique per-request ID |
| `userId` | string | Authenticated user (if known) |
| `method` | string | HTTP method |
| `path` | string | Request URL path |
| `status` | number | HTTP response status |
| `durationMs` | number | Request processing time |
| `error.code` | string | Error type code |
| `error.message` | string | Error description |
| `cfRay` | string | Cloudflare Ray ID |
| `cfCountry` | string | Request origin country |

---

## Metrics

Metrics collected via Cloudflare Analytics + custom counters:

| Metric | Type | Description |
|---|---|---|
| `request_count` | Counter | Total API requests |
| `error_count` | Counter | Total errors by type |
| `auth_failure_count` | Counter | Failed authentication attempts |
| `request_duration_ms` | Histogram | Request latency distribution |
| `db_query_duration_ms` | Histogram | D1 query latency |
| `kv_hit_ratio` | Gauge | KV cache hit percentage |

---

## Distributed Tracing

For multi-step request flows, attach a trace ID:

```typescript
// Attach X-Request-Id to all responses
const requestId = request.headers.get('X-Request-Id') ?? crypto.randomUUID();
response.headers.set('X-Request-Id', requestId);
```

Use Sentry traces for performance profiling:
```typescript
const transaction = Sentry.startTransaction({ name: 'API Request', op: 'http' });
const span = transaction.startChild({ op: 'db.query', description: 'fetch user' });
// ... DB query
span.finish();
transaction.finish();
```

---

## Audit Logs

All security-relevant actions logged to D1 `audit_logs` table:
- User login / logout
- Failed authentication
- Permission denied
- Admin actions (create/update/delete users)
- Data exports

Query audit logs:
```sql
SELECT * FROM audit_logs
WHERE user_id = '?'
ORDER BY created_at DESC
LIMIT 50;
```

See: [DATABASE.md](DATABASE.md)

---

## Log Retention

| Environment | Retention | Storage |
|---|---|---|
| Production | 90 days | Logpush → R2 or external |
| Staging | 30 days | Logpush → R2 |
| Local | Session only | Console |

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial observability documentation |

---

## Related Documents

- [MONITORING.md](MONITORING.md) — Alerting and dashboards
- [PERFORMANCE.md](PERFORMANCE.md) — Performance targets
- [ERROR_HANDLING.md](ERROR_HANDLING.md) — Error response patterns
- [SECURITY.md](SECURITY.md) — Security audit logging
- [docs/observability/README.md](docs/observability/README.md) — Observability deep dive
