# Cloudflare Workers Backend

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [BACKEND.md](../../BACKEND.md) | **Related:** [CLOUDFLARE.md](../../CLOUDFLARE.md)

## Overview

Cloudflare Workers-specific backend patterns. See [BACKEND.md](../../BACKEND.md) for the full backend architecture.

## Environment Bindings Type

```typescript
// types/env.ts
export interface Env {
  // Cloudflare bindings
  DB: D1Database;
  BUCKET: R2Bucket;
  KV: KVNamespace;
  DO: DurableObjectNamespace;
  QUEUE: Queue;

  // Secrets (set via wrangler secret put)
  JWT_SECRET: string;
  JWT_ISSUER: string;
  JWT_AUDIENCE: string;
  EMAIL_API_KEY: string;

  // Vars (set via wrangler.toml [vars])
  ENVIRONMENT: 'local' | 'staging' | 'production';
  CORS_ORIGINS: string;
}
```

## Worker Limitations to Remember

- No `process.env` → use `env.VAR_NAME`
- No `fs` → use R2 (`env.BUCKET`)
- No `require()` → use ESM `import`
- No `__dirname` → not needed in Workers
- CPU limit: 10ms (free) / 30s (paid)
- Web Crypto: `crypto.subtle` (not Node.js `crypto`)

## Execution Context

```typescript
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // ctx.waitUntil — schedule async work after response
    ctx.waitUntil(logRequest(request, env));

    // ctx.passThroughOnException — fall through to origin on error
    // ctx.passThroughOnException(); (use cautiously)

    return app.fetch(request, env, ctx);
  },
};
```

## Verified Sources

- Cloudflare Workers Runtime — https://developers.cloudflare.com/workers/runtime-apis/
- Cloudflare Workers Limits — https://developers.cloudflare.com/workers/platform/limits/
