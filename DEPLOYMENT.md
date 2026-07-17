# DEPLOYMENT.md — Deployment Procedures

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [CI_CD.md](CI_CD.md) | [CLOUDFLARE.md](CLOUDFLARE.md) | [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | All deployment procedures and runbooks |

---

## Overview

Deployments are automated via GitHub Actions. Manual deployments using Wrangler CLI are documented for emergencies. All deployments require passing CI checks.

---

## Environments

| Environment | Branch | Trigger | URL |
|---|---|---|---|
| Local | Any | Manual | `localhost` |
| Preview | PR branches | PR opened/updated | `*.pages.dev` |
| Staging | `develop` | Push to develop | `staging.{domain}` |
| Production | `main` | Push to main (after PR merge) | `{domain}` |

---

## Deployment Flow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant GH as GitHub
    participant CI as GitHub Actions
    participant CF as Cloudflare

    Dev->>GH: Push to feature branch / Open PR
    GH->>CI: Trigger CI workflow
    CI->>CI: Lint + Type check
    CI->>CI: Run unit tests
    CI->>CI: Build frontend + worker
    CI->>CF: Deploy to Preview (Pages + Worker)
    CI-->>Dev: Preview URL posted to PR

    Dev->>GH: Merge PR to main
    GH->>CI: Trigger production workflow
    CI->>CI: Full test suite
    CI->>CF: Run D1 migrations (production)
    CI->>CF: Deploy Worker to production
    CI->>CF: Deploy Pages to production
    CI-->>Dev: Deployment complete notification
```

---

## Pre-Deployment Checklist

Before every production deployment:

- [ ] All tests pass in CI
- [ ] Code reviewed and approved
- [ ] Breaking changes documented in [CHANGELOG.md](CHANGELOG.md)
- [ ] Database migrations tested in staging
- [ ] Environment variables verified in Cloudflare Dashboard
- [ ] Rollback plan documented

---

## GitHub Actions Workflow

See: [CI_CD.md](CI_CD.md)

### Production Deploy (automated on merge to main)
```yaml
# .github/workflows/deploy.yml (summarized)
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: d1 migrations apply DB --env production
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy --env production
```

---

## Manual Deployment (Emergency)

```bash
# 1. Authenticate
wrangler login

# 2. Run migrations
wrangler d1 migrations apply DB --env production

# 3. Deploy Worker
wrangler deploy --env production

# 4. Deploy Pages
wrangler pages deploy dist --project-name my-frontend --branch main
```

---

## Rollback Procedures

### Worker Rollback
```bash
# List recent deployments
wrangler deployments list

# Roll back to previous deployment
wrangler rollback [deployment-id]
```

### Database Rollback
```bash
# D1 does not support automatic rollback
# Apply rollback SQL from migration file footer
wrangler d1 execute DB --file migrations/rollback_XXXX.sql --env production
```

---

## Zero-Downtime Deployments

Cloudflare Workers supports zero-downtime deployment:
- New Worker version deployed while old version continues serving requests
- Cloudflare gradually routes traffic to new version
- No restart, no connection drop

**Database migrations must be backward-compatible:**
- Add columns (never remove in the same deploy)
- Deploy new code that handles both old and new schema
- Remove deprecated columns in a subsequent deploy

---

## Post-Deployment Verification

```bash
# Check Worker health
curl https://api.{domain}/health

# Check database connectivity
curl https://api.{domain}/health/db

# Tail Worker logs
wrangler tail --env production
```

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial deployment documentation |

---

## Related Documents

- [CI_CD.md](CI_CD.md) — CI/CD pipeline detail
- [CLOUDFLARE.md](CLOUDFLARE.md) — Cloudflare services
- [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) — Env vars per environment
- [DATABASE.md](DATABASE.md) — Migration procedures
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — Deployment failure resolution
