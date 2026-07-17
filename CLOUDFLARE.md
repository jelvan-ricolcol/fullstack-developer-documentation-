# CLOUDFLARE.md — Cloudflare Configuration & Services

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [DEPLOYMENT.md](DEPLOYMENT.md) | [BACKEND.md](BACKEND.md) | [STORAGE.md](STORAGE.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | All Cloudflare services, configuration, and deployment |

---

## Overview

Cloudflare is the primary cloud platform. It provides edge compute (Workers), static hosting (Pages), SQL database (D1), object storage (R2), key-value store (KV), stateful compute (Durable Objects), and message queuing (Queues).

---

## Services Used

| Service | Purpose | Binding |
|---|---|---|
| Workers | Edge API, backend logic | — |
| Pages | Static frontend hosting | — |
| D1 | SQLite relational database | `env.DB` |
| R2 | Object storage (files, images) | `env.BUCKET` |
| KV | Key-value cache and sessions | `env.KV` |
| Durable Objects | Stateful realtime (chat, presence) | `env.DO` |
| Queues | Async background jobs | `env.QUEUE` |
| AI Gateway | Rate-limited AI API proxy | — |
| Turnstile | Bot protection (CAPTCHA-free) | — |
| Access | Zero Trust application access | — |

---

## Workers Configuration

### wrangler.toml
```toml
name = "my-api-worker"
main = "src/index.ts"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[env.staging]
name = "my-api-worker-staging"
vars = { ENVIRONMENT = "staging" }

[env.production]
name = "my-api-worker"
vars = { ENVIRONMENT = "production" }

[[d1_databases]]
binding = "DB"
database_name = "my-db-prod"
database_id = "<production-db-id>"

[[r2_buckets]]
binding = "BUCKET"
bucket_name = "my-bucket-prod"

[[kv_namespaces]]
binding = "KV"
id = "<production-kv-id>"

[[queues.producers]]
queue = "background-jobs"
binding = "QUEUE"

[[queues.consumers]]
queue = "background-jobs"
max_batch_size = 10
max_batch_timeout = 30
```

---

## Pages Configuration

```toml
# pages.toml (or via Cloudflare Dashboard)
[build]
command = "npm run build"
destination = "dist"

[build.environment_variables]
NODE_VERSION = "20"
```

### Pages Deployment via Wrangler
```bash
wrangler pages deploy dist --project-name my-frontend
```

---

## D1 Database

```bash
# Create database
wrangler d1 create my-db

# Apply migrations
wrangler d1 migrations apply DB --env production

# Query database directly
wrangler d1 execute DB --command "SELECT * FROM users LIMIT 5"

# Export database
wrangler d1 export DB --output backup.sql
```

See: [DATABASE.md](DATABASE.md) | [docs/cloudflare/d1.md](docs/cloudflare/d1.md)

---

## R2 Object Storage

```typescript
// Upload object
await env.BUCKET.put(key, body, {
  httpMetadata: { contentType: 'image/jpeg' },
  customMetadata: { uploadedBy: userId },
});

// Get object
const obj = await env.BUCKET.get(key);
if (!obj) throw new NotFoundError('Object not found');
const data = await obj.arrayBuffer();

// Delete object
await env.BUCKET.delete(key);

// Generate presigned URL (requires Cloudflare Workers R2 presigned URL feature)
```

See: [docs/cloudflare/r2.md](docs/cloudflare/r2.md)

---

## KV Store

```typescript
// Write (with TTL)
await env.KV.put(key, JSON.stringify(value), { expirationTtl: 3600 });

// Read
const raw = await env.KV.get(key);
const value = raw ? JSON.parse(raw) : null;

// Delete
await env.KV.delete(key);

// List keys
const list = await env.KV.list({ prefix: 'session:' });
```

**KV Limitations:**
- Eventual consistency — not suitable for counters or transactional state
- Max value size: 25MB
- Max key size: 512 bytes
- Strong consistency within same region only

See: [docs/cloudflare/kv.md](docs/cloudflare/kv.md)

---

## Durable Objects

```typescript
// Declare DO class
export class ChatRoom implements DurableObject {
  private sessions: Set<WebSocket> = new Set();

  constructor(private readonly state: DurableObjectState, private readonly env: Env) {}

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') === 'websocket') {
      const pair = new WebSocketPair();
      this.sessions.add(pair[1]);
      pair[1].accept();
      return new Response(null, { status: 101, webSocket: pair[0] });
    }
    return new Response('Not a WebSocket request', { status: 400 });
  }
}

// Access from another Worker
const id = env.DO.idFromName('chat-room-123');
const stub = env.DO.get(id);
const response = await stub.fetch(request);
```

See: [docs/cloudflare/durable-objects.md](docs/cloudflare/durable-objects.md)

---

## Queues

```typescript
// Produce message
await env.QUEUE.send({ type: 'send-email', userId, templateId });

// Consume messages (in queue consumer Worker)
export default {
  async queue(batch: MessageBatch<QueueMessage>, env: Env): Promise<void> {
    for (const message of batch.messages) {
      try {
        await processMessage(message.body, env);
        message.ack();
      } catch (error) {
        message.retry(); // Will retry with backoff
      }
    }
  },
};
```

See: [docs/cloudflare/queues.md](docs/cloudflare/queues.md)

---

## Turnstile (Bot Protection)

```typescript
// Server-side validation
const response = await fetch(
  'https://challenges.cloudflare.com/turnstile/v0/siteverify',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET_KEY,
      response: turnstileToken,
      remoteip: request.headers.get('CF-Connecting-IP'),
    }),
  }
);
const { success } = await response.json();
if (!success) throw new ForbiddenError('Bot check failed');
```

---

## AI Gateway

```typescript
// Route AI calls through AI Gateway for rate limiting and logging
const aiResponse = await fetch(
  `https://gateway.ai.cloudflare.com/v1/${env.CLOUDFLARE_ACCOUNT_ID}/my-gateway/openai/v1/chat/completions`,
  {
    method: 'POST',
    headers: {
      Authorization: `******
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: 'gpt-4o', messages }),
  }
);
```

---

## Custom Domains

```bash
# Add custom domain to Worker
wrangler deploy --env production
# Then in Cloudflare Dashboard: Workers & Pages → Custom Domains

# Add custom domain to Pages
wrangler pages deploy --project-name my-frontend
# Then in Cloudflare Dashboard: Pages → Custom Domains
```

---

## Security Headers (Worker)

```typescript
function addSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
  );
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  return new Response(response.body, { ...response, headers });
}
```

---

## Monitoring & Analytics

- Cloudflare Analytics: available in Dashboard for Workers and Pages
- `wrangler tail` — live log streaming
- Workers Metrics: CPU time, wall time, error rate, invocation count

See: [MONITORING.md](MONITORING.md) | [OBSERVABILITY.md](OBSERVABILITY.md)

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial Cloudflare documentation |

---

## Related Documents

- [DEPLOYMENT.md](DEPLOYMENT.md) — Deployment procedures
- [BACKEND.md](BACKEND.md) — Worker implementation
- [DATABASE.md](DATABASE.md) — D1 schema
- [STORAGE.md](STORAGE.md) — R2 usage
- [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) — CF bindings and secrets
- [docs/cloudflare/workers.md](docs/cloudflare/workers.md) — Workers deep dive
- [docs/cloudflare/d1.md](docs/cloudflare/d1.md) — D1 deep dive
- [docs/cloudflare/r2.md](docs/cloudflare/r2.md) — R2 deep dive
- [docs/cloudflare/kv.md](docs/cloudflare/kv.md) — KV deep dive
