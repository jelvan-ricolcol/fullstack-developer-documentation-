# SQL Patterns

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [DATABASE.md](../../DATABASE.md)

## Overview

SQL patterns for Cloudflare D1 (SQLite). See [DATABASE.md](../../DATABASE.md) for schema and migration documentation.

## Safe Query Pattern

```typescript
// ✅ Always parameterize — never interpolate
const user = await env.DB
  .prepare('SELECT id, email, name FROM users WHERE id = ?')
  .bind(userId)
  .first<User>();

// ❌ Never do this
const user = await env.DB
  .prepare(`SELECT * FROM users WHERE id = '${userId}'`) // SQL injection!
  .first();
```

## Common Patterns

```sql
-- Soft delete
UPDATE users SET deleted_at = ? WHERE id = ?;

-- Active records only
SELECT * FROM users WHERE deleted_at IS NULL;

-- Pagination (cursor-based)
SELECT * FROM users
WHERE created_at < ?  -- cursor
ORDER BY created_at DESC
LIMIT ?;

-- Upsert
INSERT INTO users (id, email, name) VALUES (?, ?, ?)
ON CONFLICT(email) DO UPDATE SET name = excluded.name, updated_at = excluded.updated_at;
```

## Data Types

| Use Case | SQLite Type |
|---|---|
| ID | TEXT (CUID2) |
| Timestamp | TEXT (ISO 8601) |
| Boolean | INTEGER (0/1) |
| Currency | INTEGER (cents) |
| JSON | TEXT + json_extract() |
| Enum | TEXT + CHECK constraint |

## Verified Sources

- SQLite Documentation — https://www.sqlite.org/docs.html
- Cloudflare D1 Docs — https://developers.cloudflare.com/d1/
- OWASP SQL Injection Prevention — https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
