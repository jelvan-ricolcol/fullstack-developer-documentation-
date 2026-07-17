# Cloudflare Deployment

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [DEPLOYMENT.md](../../DEPLOYMENT.md) | **Related:** [CI_CD.md](../../CI_CD.md)

## Overview

Deployment to Cloudflare Workers and Pages via Wrangler CLI and GitHub Actions. The current repository workflow deploys the `devpilot-api` Worker and the `devpilot-dashboard` Pages project from `.github/workflows/deploy.yml`.

## Wrangler Commands

```bash
# Deploy Worker
wrangler deploy --env production

# Deploy Pages
wrangler pages deploy dist --project-name devpilot-dashboard

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
- run: npm run build
- run: |
    printf '%s' "$CLOUDFLARE_API_TOKEN" | npx wrangler secret put CF_TOKEN --env production
    printf '%s' "$CLOUDFLARE_ACCOUNT_ID" | npx wrangler secret put CF_ACCOUNT_ID --env production
- uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    command: deploy --env production
- uses: cloudflare/pages-action@v1
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    projectName: devpilot-dashboard
    directory: dist
    gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

## Manual follow-up still required

- Create the Cloudflare Pages project `devpilot-dashboard` before the first automated deploy
- Keep the Worker runtime secret `GITHUB_TOKEN` manual if server-side GitHub proxying is needed
- Add any additional runtime secrets and bindings that are not derived from the two GitHub deployment secrets
- Configure custom domains or routes in Cloudflare if production traffic should not use default `*.pages.dev` or worker subdomains

## Environment Configuration

See [ENVIRONMENT_VARIABLES.md](../../ENVIRONMENT_VARIABLES.md) for all environment-specific configuration.

## Verified Sources

- Wrangler Docs — https://developers.cloudflare.com/workers/wrangler/
- Cloudflare Pages Deploy — https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
- Wrangler GitHub Action — https://github.com/cloudflare/wrangler-action
