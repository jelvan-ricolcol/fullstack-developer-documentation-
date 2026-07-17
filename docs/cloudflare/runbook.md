# Runbook for Cloudflare Workers example

This folder includes a runnable Cloudflare Workers example and CI configuration. It is intentionally minimal and uses placeholder bindings. Do not commit secrets to this repository.

Quick start (local)

1. Install dependencies: npm ci
2. Build: npm run build
3. Run locally (Wrangler): npm run dev

Environment and secrets

- Store CF API token in repo secrets as CF_API_TOKEN to enable deploy workflow.
- Set ACCOUNT_ID, MY_R2_BUCKET, and other variables in your Cloudflare environment or via wrangler secrets.

Verified sources

- https://developers.cloudflare.com/workers/
- https://developers.cloudflare.com/d1/
- https://developers.cloudflare.com/r2/
- https://developers.cloudflare.com/workers/cli-wrangler/
