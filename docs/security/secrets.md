# Secrets Management

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [SECURITY.md](../../SECURITY.md) | **Related:** [ENVIRONMENT_VARIABLES.md](../../ENVIRONMENT_VARIABLES.md)

## Overview

Secrets management policy. No secret may ever be committed to the repository.

## Where Secrets Live

| Secret Type | Storage | Access |
|---|---|---|
| Worker runtime secrets | Cloudflare Secrets | `env.SECRET_NAME` |
| CI/CD secrets | GitHub Secrets | `${{ secrets.NAME }}` |
| Local dev secrets | `.env.local` (gitignored) | `process.env` (Wrangler dev) |

## Setting Cloudflare Secrets

```bash
# Set a secret
wrangler secret put JWT_SECRET

# List secrets (names only — values never shown)
wrangler secret list

# Delete a secret
wrangler secret delete OLD_SECRET

# Set for specific environment
wrangler secret put OAUTH_SECRET --env production
```

## Secret Rotation

When rotating a secret:
1. Generate new secret value
2. Deploy new secret: `wrangler secret put KEY`
3. Verify services function with new secret
4. Invalidate all existing tokens/sessions signed with old secret
5. Document rotation in incident log

## What Never to Do

- ❌ Never put secrets in `wrangler.toml` (committed to git)
- ❌ Never put secrets in `.env` files that are committed
- ❌ Never log secret values
- ❌ Never hardcode secrets in source code
- ❌ Never pass secrets as URL parameters

## Verified Sources

- OWASP Secrets Management — https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
- Cloudflare Secrets — https://developers.cloudflare.com/workers/configuration/secrets/
- GitHub Encrypted Secrets — https://docs.github.com/actions/security-guides/encrypted-secrets
