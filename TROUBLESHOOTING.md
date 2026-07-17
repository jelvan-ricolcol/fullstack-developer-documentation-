# TROUBLESHOOTING.md — Troubleshooting Guide

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [MONITORING.md](MONITORING.md) | [DEPLOYMENT.md](DEPLOYMENT.md) | [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | Common issues, root causes, and resolutions |

---

## Diagnostic Tools

```bash
# Live Worker logs
wrangler tail --env production

# Check deployment status
wrangler deployments list

# Check D1 database
wrangler d1 execute DB --command "SELECT 1" --env production

# Check Worker status
curl https://api.{domain}/health
```

---

## Common Issues

---

### Worker Returns 500 on All Requests

**Symptoms:** All API calls return 500 Internal Server Error immediately after deployment.

**Causes:**
1. Missing required environment variable or secret
2. Syntax error in Worker code
3. Failed D1 migration that left schema in bad state

**Resolution:**
```bash
# Check live logs for error details
wrangler tail --env production

# Verify secrets are set
wrangler secret list --env production

# Rollback to previous deployment
wrangler rollback --env production
```

---

### JWT Token Always Returns 401 "Invalid Token"

**Symptoms:** Valid JWT returns 401, token appears correctly formatted.

**Causes:**
1. `JWT_SECRET` mismatch between token issuer and validator
2. Token signed with wrong algorithm (RS256 vs HS256)
3. `JWT_ISSUER` or `JWT_AUDIENCE` mismatch

**Resolution:**
```bash
# Verify JWT_SECRET is set correctly
wrangler secret list

# Decode token (without verification) to inspect claims
# Use jwt.io in browser or:
echo "YOUR_TOKEN_HERE" | cut -d. -f2 | base64 -d 2>/dev/null | python3 -m json.tool
```

---

### D1 Migration Fails

**Symptoms:** `wrangler d1 migrations apply` returns error.

**Causes:**
1. Migration SQL syntax error (SQLite not PostgreSQL)
2. Table already exists (migration not idempotent)
3. Wrong database ID in wrangler.toml

**Resolution:**
```bash
# Check migration SQL for SQLite compatibility
# Use IF NOT EXISTS in all CREATE TABLE statements

# Check migration status
wrangler d1 migrations list --env production

# Apply specific migration
wrangler d1 execute DB --file migrations/0002_fix.sql --env production
```

---

### KV Data Not Updating (Stale Cache)

**Symptoms:** Updated data in D1 not reflected via API.

**Causes:**
1. KV cache TTL not expired
2. Cache invalidation not triggered on write

**Resolution:**
```bash
# Manually delete KV key
wrangler kv key delete --binding=KV "user:abc123" --env production

# Delete all keys with prefix
wrangler kv key list --binding=KV --prefix="user:" | jq '.[].name' | xargs -I{} wrangler kv key delete --binding=KV "{}"
```

---

### CORS Error in Browser

**Symptoms:** Browser console shows CORS error; `OPTIONS` request fails with 403.

**Causes:**
1. Worker not handling `OPTIONS` preflight requests
2. `Access-Control-Allow-Origin` missing or incorrect

**Resolution:**
```typescript
// Ensure CORS middleware handles OPTIONS
app.options('*', (c) => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': c.env.CORS_ORIGINS,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
});
```

---

### Cloudflare Pages Deploy Fails

**Symptoms:** CI pipeline fails at Pages deploy step.

**Causes:**
1. `CLOUDFLARE_API_TOKEN` does not have Pages permission
2. Build output directory incorrect
3. Pages project does not exist

**Resolution:**
```bash
# Verify token has Cloudflare Pages:Edit permission
# In Cloudflare Dashboard: Profile → API Tokens

# Check build output exists
ls -la dist/

# Create Pages project if missing
wrangler pages project create my-frontend
```

---

### R2 Upload Returns 403

**Symptoms:** File upload to R2 returns 403 Forbidden.

**Causes:**
1. R2 binding not configured in wrangler.toml
2. `BUCKET` binding name mismatch

**Resolution:**
```toml
# Verify wrangler.toml has correct R2 binding
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "my-bucket-prod"
```

---

### High Worker CPU Usage

**Symptoms:** Worker CPU time p99 exceeds 10ms; requests slowing.

**Causes:**
1. Synchronous heavy computation in request path
2. Too many sequential D1 queries (N+1)
3. Large JSON serialization

**Resolution:**
- Move heavy computation to background via `ctx.waitUntil()`
- Batch D1 queries with `env.DB.batch()`
- Cache results in KV
- Profile with `wrangler tail --format=json | jq '.cpuTime'`

---

## Escalation Path

1. Check this document for known issues
2. Check `wrangler tail` for live logs
3. Check Cloudflare Analytics dashboard
4. Check Sentry for error details
5. Open GitHub Issue with: error logs, Worker version, environment, steps to reproduce

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial troubleshooting guide |

---

## Related Documents

- [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md) — Platform limitations
- [MONITORING.md](MONITORING.md) — Alerting setup
- [DEPLOYMENT.md](DEPLOYMENT.md) — Deployment procedures
- [CLOUDFLARE.md](CLOUDFLARE.md) — Cloudflare configuration
- [ERROR_HANDLING.md](ERROR_HANDLING.md) — Error codes reference
