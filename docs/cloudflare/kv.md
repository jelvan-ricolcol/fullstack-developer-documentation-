# Cloudflare KV

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [CLOUDFLARE.md](../../CLOUDFLARE.md) | **Related:** [STORAGE.md](../../STORAGE.md)

## Overview

KV is a globally-distributed, eventually-consistent key-value store.

## Key Facts

| Property | Value |
|---|---|
| Consistency | Eventually consistent (≤60s globally) |
| Max value size | 25MB |
| Max key size | 512 bytes |
| Read latency | < 1ms at edge |
| Binding | `env.KV` |

## Setup

```toml
[[kv_namespaces]]
binding = "KV"
id = "xxxx-xxxx-xxxx-xxxx"
```

## Operations

```typescript
// Write with TTL
await env.KV.put(key, JSON.stringify(value), { expirationTtl: 3600 });

// Read
const raw = await env.KV.get(key);
const value = raw ? JSON.parse(raw) : null;

// Delete
await env.KV.delete(key);

// List keys
const list = await env.KV.list({ prefix: 'user:', limit: 100 });
```

## Limitations

- **Not for counters** — eventual consistency means lost updates
- **Not for transactions** — no atomic multi-key operations
- **Not for large values** — max 25MB per value
- Use D1 for transactional state

See: [KNOWN_LIMITATIONS.md](../../KNOWN_LIMITATIONS.md)

## Verified Sources

- Cloudflare KV Docs — https://developers.cloudflare.com/kv/


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
