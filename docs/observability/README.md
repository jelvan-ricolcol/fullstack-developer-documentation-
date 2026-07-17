# Observability

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [OBSERVABILITY.md](../../OBSERVABILITY.md) | **Related:** [MONITORING.md](../../MONITORING.md)

## Overview

Observability documentation. See [OBSERVABILITY.md](../../OBSERVABILITY.md) for the full observability stack: logs, metrics, and traces.

## Three Pillars

| Pillar | Tool | Location |
|---|---|---|
| Logs | Structured JSON → wrangler tail / Logpush | Workers console |
| Metrics | Cloudflare Analytics | Dashboard |
| Traces | Sentry Traces | Sentry Dashboard |

## Structured Log Format

```json
{
  "timestamp": "2026-07-17T13:54:52.000Z",
  "level": "info",
  "message": "Request completed",
  "requestId": "req_abc123",
  "userId": "cuid2abc",
  "method": "GET",
  "path": "/api/v1/users",
  "status": 200,
  "durationMs": 42
}
```

## Log Levels

| Level | When |
|---|---|
| debug | Detailed diagnostic (disabled in production) |
| info | Normal operations |
| warn | Unexpected but handled |
| error | Failures requiring attention |

## Verified Sources

- OpenTelemetry Docs — https://opentelemetry.io/docs/
- Cloudflare Logpush — https://developers.cloudflare.com/logs/get-started/
