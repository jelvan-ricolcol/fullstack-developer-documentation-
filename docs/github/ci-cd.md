# CI/CD (GitHub Actions)

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [CI_CD.md](../../CI_CD.md) | **Related:** [DEPLOYMENT.md](../../DEPLOYMENT.md)

## Overview

GitHub Actions CI/CD pipeline. See [CI_CD.md](../../CI_CD.md) for full workflow YAML and configuration.

## Workflows

| Workflow | File | Trigger |
|---|---|---|
| CI | `.github/workflows/ci.yml` | Push, PR |
| Deploy Preview | `.github/workflows/deploy-preview.yml` | PR opened/updated |
| Deploy Staging | `.github/workflows/deploy-staging.yml` | Push to develop |
| Deploy Production | `.github/workflows/deploy-production.yml` | Push to main |
| CodeQL | `.github/workflows/codeql.yml` | Push + weekly |

## Secrets Required

| Secret | Purpose |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Deploy Workers and Pages |
| `CLOUDFLARE_ACCOUNT_ID` | CF account identifier |

## Required Status Checks

All PRs to `main` must pass:
1. `Lint & Type Check`
2. `Unit & Integration Tests`
3. `Build`

## Actions Pinning

All third-party Actions are pinned to a specific commit SHA to prevent supply chain attacks:

```yaml
# ✅ Pinned
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4.2.2

# ❌ Not pinned
- uses: actions/checkout@v4
```

## Verified Sources

- GitHub Actions Docs — https://docs.github.com/actions
- GitHub Actions Security — https://docs.github.com/actions/security-for-github-actions
- Wrangler Action — https://github.com/cloudflare/wrangler-action


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
