# Deployment

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [DEPLOYMENT.md](../../DEPLOYMENT.md) | **Related:** [CI_CD.md](../../CI_CD.md)

## Overview

Deployment documentation. See [DEPLOYMENT.md](../../DEPLOYMENT.md) for full procedures and runbooks.

## Environments

| Environment | Branch | URL |
|---|---|---|
| Local | Any | localhost |
| Preview | PR branches | *.pages.dev |
| Staging | develop | staging.{domain} |
| Production | main | {domain} |

## Deploy Commands

```bash
# Deploy Worker to production
wrangler deploy --env production

# Deploy Pages
wrangler pages deploy dist --project-name my-frontend --branch main

# Run migrations
wrangler d1 migrations apply DB --env production

# Rollback Worker
wrangler rollback --env production
```

## Verified Sources

- Wrangler CLI Docs — https://developers.cloudflare.com/workers/wrangler/
- Cloudflare Pages Docs — https://developers.cloudflare.com/pages/
- GitHub Actions Cloudflare — https://github.com/cloudflare/wrangler-action


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
