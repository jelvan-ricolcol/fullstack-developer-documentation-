# Caching

> **Back to:** [INDEX.md](../../INDEX.md) | **Related:** [STORAGE.md](../../STORAGE.md) | [PERFORMANCE.md](../../PERFORMANCE.md)

## Overview

Multi-layer caching strategy.

## Cache Layers

| Layer | Technology | TTL | Use |
|---|---|---|---|
| CDN | Cloudflare Cache | Configurable | Public static assets |
| Application | KV Store | 60s – 24h | API responses, sessions |
| Client | HTTP Cache-Control | Per endpoint | Browser cache |

## KV Cache Pattern

```typescript
async function getWithCache<T>(
  kv: KVNamespace,
  key: string,
  fetcher: () => Promise<T>,
  ttl = 300
): Promise<T> {
  const cached = await kv.get(key);
  if (cached) return JSON.parse(cached);
  const data = await fetcher();
  await kv.put(key, JSON.stringify(data), { expirationTtl: ttl });
  return data;
}
```

## Cache Invalidation

```typescript
// Invalidate on update
await env.KV.delete(`user:${userId}`);
await env.KV.delete('stats:users');
```

## HTTP Cache Headers

```typescript
// Long-lived assets
headers.set('Cache-Control', 'public, max-age=31536000, immutable');

// API responses (private)
headers.set('Cache-Control', 'private, no-cache');

// Short-lived public
headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
```

## Verified Sources

- Cloudflare KV — https://developers.cloudflare.com/kv/
- HTTP Caching (MDN) — https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching
