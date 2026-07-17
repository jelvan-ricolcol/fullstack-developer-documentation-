# Monitoring

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [MONITORING.md](../../MONITORING.md) | **Related:** [OBSERVABILITY.md](../../OBSERVABILITY.md)

## Overview

Monitoring documentation. See [MONITORING.md](../../MONITORING.md) for the full setup and alerting configuration.

## Tools

| Tool | Purpose |
|---|---|
| Cloudflare Analytics | Worker metrics, error rates, CPU |
| `wrangler tail` | Live log streaming |
| Sentry | Error tracking and alerting |
| Uptime monitoring | Endpoint availability |

## Key Metrics

- API error rate (target < 0.1%)
- API p99 latency (target < 300ms)
- Worker CPU p99 (target < 10ms)
- Health check availability (target 99.9%)

## Quick Commands

```bash
# Live Worker logs
wrangler tail --env production

# Filter errors only
wrangler tail --env production --status error

# Health check
curl https://api.{domain}/health
```

## Alerting

Alerts defined in [MONITORING.md](../../MONITORING.md):
- API down: Critical (Email + SMS)
- Error rate > 1%: High (Email)
- Latency p99 > 500ms: Medium (Email)

## Verified Sources

- Cloudflare Analytics — https://developers.cloudflare.com/analytics/
- Sentry Cloudflare SDK — https://docs.sentry.io/platforms/javascript/guides/cloudflare/
