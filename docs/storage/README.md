# Storage

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [STORAGE.md](../../STORAGE.md) | **Related:** [DATABASE.md](../../DATABASE.md)

## Overview

Storage patterns and configuration. See [STORAGE.md](../../STORAGE.md) for the full storage architecture.

## Storage Decision Matrix

| Data Type | Storage | Binding |
|---|---|---|
| Structured relational | D1 (SQLite) | `env.DB` |
| Files, images, exports | R2 | `env.BUCKET` |
| Cache, sessions, flags | KV | `env.KV` |
| Realtime state | Durable Objects | `env.DO` |
| Background jobs | Queues | `env.QUEUE` |

## R2 Key Naming

```
uploads/{userId}/{timestamp}-{filename}
exports/{userId}/{date}-{type}.csv
avatars/{userId}/avatar.{ext}
```

## KV Key Naming

```
user:{userId}           → TTL: 5min
session:{token}         → TTL: 7d
ratelimit:{ip}:{min}    → TTL: 60s
feature:{flagName}      → TTL: 5min
```

## Verified Sources

- Cloudflare R2 Docs — https://developers.cloudflare.com/r2/
- Cloudflare KV Docs — https://developers.cloudflare.com/kv/
