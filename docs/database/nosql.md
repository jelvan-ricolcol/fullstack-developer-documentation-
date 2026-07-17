# NoSQL Patterns

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [DATABASE.md](../../DATABASE.md)

## Overview

NoSQL alternatives when D1 (SQLite) is not the right fit.

## When to Use NoSQL

| Use Case | Alternative |
|---|---|
| Key-value lookup | Cloudflare KV |
| Document storage | D1 JSON columns |
| Time-series | D1 with date indexes |
| Full-text search | D1 FTS5 or external (Typesense) |
| Graph data | Not recommended on CF; use PostgreSQL with pg_graph |

## Cloudflare KV as NoSQL

KV stores arbitrary values (JSON, binary):

```typescript
// Store document
await env.KV.put(`doc:${docId}`, JSON.stringify(document), { expirationTtl: 86400 });

// Retrieve
const doc = JSON.parse(await env.KV.get(`doc:${docId}`) ?? 'null');
```

**Limitation:** No query capabilities. Must know the key. Not suitable for range or filter queries.

## D1 JSON Support

```sql
-- Store JSON in TEXT column
INSERT INTO items (id, metadata) VALUES (?, ?);

-- Query JSON fields
SELECT * FROM items WHERE json_extract(metadata, '$.category') = 'article';
```

## Verified Sources

- Cloudflare KV Docs — https://developers.cloudflare.com/kv/
- SQLite JSON Functions — https://www.sqlite.org/json1.html
