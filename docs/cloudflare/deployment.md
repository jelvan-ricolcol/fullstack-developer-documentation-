# Cloudflare Deployment

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [DEPLOYMENT.md](../../DEPLOYMENT.md) | **Related:** [CI_CD.md](../../CI_CD.md)

## Overview

Deployment to Cloudflare Workers and Pages via Wrangler CLI and GitHub Actions.

## Wrangler Commands

```bash
# Deploy Worker
wrangler deploy --env production

# Deploy Pages
wrangler pages deploy dist --project-name my-frontend

# Apply D1 migrations
wrangler d1 migrations apply DB --env production

# Rollback Worker
wrangler rollback [deployment-id] --env production

# List deployments
wrangler deployments list --env production

# Live logs
wrangler tail --env production
```

## GitHub Actions (Automated)

```yaml
- uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    command: deploy --env production
```

## Environment Configuration

See [ENVIRONMENT_VARIABLES.md](../../ENVIRONMENT_VARIABLES.md) for all environment-specific configuration.

## Verified Sources

- Wrangler Docs — https://developers.cloudflare.com/workers/wrangler/
- Cloudflare Pages Deploy — https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
- Wrangler GitHub Action — https://github.com/cloudflare/wrangler-action
