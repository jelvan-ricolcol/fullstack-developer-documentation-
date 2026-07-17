# Serverless Patterns

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [BACKEND.md](../../BACKEND.md) | **Related:** [CLOUDFLARE.md](../../CLOUDFLARE.md)

## Overview

Serverless principles applied to Cloudflare Workers.

## Key Differences from Traditional Server

| Traditional Server | Cloudflare Workers |
|---|---|
| Node.js process | V8 isolate |
| Long-lived | Request-scoped |
| `process.env` | `env` bindings |
| TCP connections | Worker bindings |
| `fs` module | R2/KV bindings |
| Horizontal scaling | Automatic edge scaling |

## Stateless Request Handling

Workers are stateless per request. State lives in:
- D1 (structured data)
- R2 (files)
- KV (cache/sessions)
- Durable Objects (realtime state)

## Background Work

```typescript
// ctx.waitUntil — run after response is sent
ctx.waitUntil(
  auditLog(env.DB, { userId, action: 'users:create' })
);
```

## Cold Start

Workers use V8 isolates — cold start is near-zero (~0ms). New isolates are created on new requests but V8 isolates are reused aggressively.

## Verified Sources

- Cloudflare Workers Docs — https://developers.cloudflare.com/workers/
- The Twelve-Factor App — https://12factor.net/
