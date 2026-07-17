# ENVIRONMENT_VARIABLES.md — Environment Variables

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [DEPLOYMENT.md](DEPLOYMENT.md) | [CLOUDFLARE.md](CLOUDFLARE.md) | [SECURITY.md](SECURITY.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | All environment variables across all tiers |

---

## Overview

This document catalogs every environment variable used across frontend, backend, and CI/CD. Variables are classified by sensitivity and how they are stored.

**Rules:**
- **Secrets** are never committed to the repository
- Secrets live in **Cloudflare Secrets** (production/staging) or **GitHub Secrets** (CI/CD)
- Non-secret config lives in `wrangler.toml` (per environment) or `.env.local` (local only)
- `.env` files are `.gitignore`d

---

## Storage Locations

| Location | Used For | Committed? |
|---|---|---|
| `wrangler.toml` [vars] | Non-secret config | ✅ Yes |
| Cloudflare Secrets | Sensitive runtime secrets | ❌ No |
| GitHub Secrets | CI/CD pipeline secrets | ❌ No |
| `.env.local` | Local dev non-secrets | ❌ No |

---

## Backend (Cloudflare Workers)

### Application Config

| Variable | Type | Where Set | Required | Description |
|---|---|---|---|---|
| `ENVIRONMENT` | string | `wrangler.toml` | Yes | `local` / `staging` / `production` |
| `APP_URL` | string | `wrangler.toml` | Yes | Public URL of the application |
| `API_URL` | string | `wrangler.toml` | Yes | Public URL of the API |
| `LOG_LEVEL` | string | `wrangler.toml` | No | `debug` / `info` / `warn` / `error` (default: `info`) |
| `CORS_ORIGINS` | string | `wrangler.toml` | Yes | Comma-separated allowed CORS origins |

### Authentication Secrets

| Variable | Type | Where Set | Required | Description |
|---|---|---|---|---|
| `JWT_SECRET` | secret | CF Secrets | Yes | HMAC signing secret (≥ 32 bytes) |
| `JWT_ISSUER` | string | `wrangler.toml` | Yes | JWT `iss` claim (e.g., `https://api.{domain}`) |
| `JWT_AUDIENCE` | string | `wrangler.toml` | Yes | JWT `aud` claim (e.g., `https://{domain}`) |
| `OAUTH_GOOGLE_CLIENT_ID` | secret | CF Secrets | OAuth | Google OAuth 2.0 client ID |
| `OAUTH_GOOGLE_CLIENT_SECRET` | secret | CF Secrets | OAuth | Google OAuth 2.0 client secret |
| `OAUTH_GITHUB_CLIENT_ID` | secret | CF Secrets | OAuth | GitHub OAuth 2.0 client ID |
| `OAUTH_GITHUB_CLIENT_SECRET` | secret | CF Secrets | OAuth | GitHub OAuth 2.0 client secret |

### Cloudflare Bindings (wrangler.toml)

| Binding | Type | Description |
|---|---|---|
| `DB` | D1Database | Primary SQLite database |
| `BUCKET` | R2Bucket | Object storage |
| `KV` | KVNamespace | Key-value store |
| `DO` | DurableObjectNamespace | Durable Objects |
| `QUEUE` | Queue | Message queue |

### External Services

| Variable | Type | Where Set | Required | Description |
|---|---|---|---|---|
| `EMAIL_API_KEY` | secret | CF Secrets | Yes | Email provider API key (Resend/SES) |
| `EMAIL_FROM` | string | `wrangler.toml` | Yes | Default sender email address |
| `STRIPE_SECRET_KEY` | secret | CF Secrets | Payments | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | secret | CF Secrets | Payments | Stripe webhook signing secret |
| `SENTRY_DSN` | secret | CF Secrets | No | Sentry error tracking DSN |

### Current Worker Runtime Secrets Used In This Repository

| Variable | Type | Where Set | Required | Description |
|---|---|---|---|---|
| `CF_TOKEN` | secret | CF Secret (synced from GitHub Secret in deploy workflow) | Yes | Worker-side Cloudflare API token |
| `CF_ACCOUNT_ID` | secret | CF Secret (synced from GitHub Secret in deploy workflow) | Yes | Worker-side Cloudflare account ID |
| `GITHUB_TOKEN` | secret | CF Secret (manual) | Optional | Enables Worker-side GitHub API proxying without browser tokens |

---

## Frontend (Vite / Browser)

> ⚠️ All `VITE_` variables are **exposed to the browser**. Never put secrets here.

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend API base URL |
| `VITE_APP_ENV` | Yes | Environment name |
| `VITE_APP_NAME` | No | Display name for the application |
| `VITE_SENTRY_DSN` | Production | Sentry DSN for frontend error tracking |
| `VITE_POSTHOG_KEY` | No | PostHog analytics key |

---

## CI/CD (GitHub Actions)

| Secret/Variable | Where Set | Purpose |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | GitHub Secret | Deploy Workers and Pages |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub Secret | CF account identifier |
| `CF_PAGES_PROJECT_NAME` | GitHub Variable | Pages project name |
| `CF_WORKER_NAME` | GitHub Variable | Worker script name |
| `STAGING_D1_DATABASE_ID` | GitHub Variable | D1 DB ID for staging |
| `PRODUCTION_D1_DATABASE_ID` | GitHub Variable | D1 DB ID for production |

The current `.github/workflows/deploy.yml` also copies `CLOUDFLARE_API_TOKEN` into the Worker secret `CF_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` into the Worker secret `CF_ACCOUNT_ID` before deploying the backend.

---

## wrangler.toml Example

```toml
name = "my-worker"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[vars]
ENVIRONMENT = "production"
APP_URL = "https://{domain}"
API_URL = "https://api.{domain}"
JWT_ISSUER = "https://api.{domain}"
JWT_AUDIENCE = "https://{domain}"
CORS_ORIGINS = "https://{domain}"
EMAIL_FROM = "noreply@{domain}"
LOG_LEVEL = "info"

[[d1_databases]]
binding = "DB"
database_name = "my-db"
database_id = "xxxx-xxxx-xxxx-xxxx"

[[r2_buckets]]
binding = "BUCKET"
bucket_name = "my-bucket"

[[kv_namespaces]]
binding = "KV"
id = "xxxx-xxxx-xxxx-xxxx"
```

---

## Setting Secrets

```bash
# Cloudflare Workers secrets
wrangler secret put JWT_SECRET
wrangler secret put OAUTH_GOOGLE_CLIENT_SECRET --env production

# List secrets (shows names only, not values)
wrangler secret list
```

---

## Local Development Setup

```bash
# Copy example file
cp .env.example .env.local

# .env.local (never commit this file)
ENVIRONMENT=local
JWT_SECRET=local-dev-secret-32-chars-minimum
VITE_API_URL=http://localhost:8787
```

---

## Validation

Every Worker startup should validate required variables:

```typescript
function validateEnv(env: Env): void {
  const required = ['JWT_SECRET', 'JWT_ISSUER', 'JWT_AUDIENCE'];
  for (const key of required) {
    if (!env[key as keyof Env]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}
```

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial environment variables documentation |

---

## Related Documents

- [DEPLOYMENT.md](DEPLOYMENT.md) — Deployment procedures
- [CLOUDFLARE.md](CLOUDFLARE.md) — Cloudflare configuration
- [SECURITY.md](SECURITY.md) — Secrets management policy
- [CI_CD.md](CI_CD.md) — GitHub Actions secrets
- [AUTHENTICATION.md](AUTHENTICATION.md) — Auth variable usage
