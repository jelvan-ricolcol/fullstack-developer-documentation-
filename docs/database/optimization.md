# Query Optimization

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [DATABASE.md](../../DATABASE.md)

## Overview

D1 (SQLite) query optimization techniques.

## Indexing

```sql
-- Index on frequently-queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role  ON users(role);

-- Composite index (most selective column first)
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);

-- Check if index is used
EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = 'a@b.com';
-- Should show: SEARCH users USING INDEX idx_users_email
```

## Query Patterns

```typescript
// ✅ Select only needed columns
const user = await env.DB
  .prepare('SELECT id, email, name, role FROM users WHERE id = ?')
  .bind(id)
  .first();

// ✅ Use LIMIT always
const { results } = await env.DB
  .prepare('SELECT * FROM users WHERE role = ? ORDER BY created_at DESC LIMIT ?')
  .bind(role, limit)
  .all();

// ✅ Batch independent queries
const [users, count] = await env.DB.batch([
  env.DB.prepare('SELECT * FROM users LIMIT 20'),
  env.DB.prepare('SELECT COUNT(*) as total FROM users'),
]);
```

## Avoid

- `SELECT *` — Fetches unused data
- Missing `LIMIT` — Can return unbounded rows
- String-interpolated queries — SQL injection risk AND no query plan reuse
- N+1 queries — Use JOINs or batch

## KV Caching for Hot Queries

```typescript
// Cache frequently-read rows
const cacheKey = `user:${id}`;
const cached = await env.KV.get(cacheKey);
if (cached) return JSON.parse(cached);

const user = await queryUser(id);
await env.KV.put(cacheKey, JSON.stringify(user), { expirationTtl: 300 });
```

## Verified Sources

- SQLite Query Planning — https://www.sqlite.org/queryplanner.html
- SQLite EXPLAIN — https://www.sqlite.org/eqp.html


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
