# Troubleshooting

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [TROUBLESHOOTING.md](../../TROUBLESHOOTING.md) | **Related:** [KNOWN_LIMITATIONS.md](../../KNOWN_LIMITATIONS.md)

## Overview

Troubleshooting guide. See [TROUBLESHOOTING.md](../../TROUBLESHOOTING.md) for common issues and resolutions.

## Quick Diagnostics

```bash
# Live Worker logs
wrangler tail --env production

# Check deployment
wrangler deployments list

# Health check
curl https://api.{domain}/health

# Check D1
wrangler d1 execute DB --command "SELECT 1" --env production
```

## Common Issues

| Symptom | First Check |
|---|---|
| 500 on all requests | `wrangler tail` for missing secrets |
| 401 on valid JWT | JWT_SECRET mismatch |
| CORS error | OPTIONS handler missing |
| Stale data | KV cache not invalidated |
| Deploy fails | Token permissions in CF Dashboard |

See [TROUBLESHOOTING.md](../../TROUBLESHOOTING.md) for detailed resolution steps.
