# DATABASE.md — Database Architecture

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [BACKEND.md](BACKEND.md) | [DATA_DICTIONARY.md](DATA_DICTIONARY.md) | [STORAGE.md](STORAGE.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | Database design, schema, migrations, and query patterns |

---

## Overview

The primary database is **Cloudflare D1** — a SQLite-compatible serverless SQL database available as a Cloudflare Workers binding. It is accessed directly from Workers without a connection pool. For high-write or complex-query workloads, migration to PostgreSQL via Cloudflare Hyperdrive is documented below.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| Cloudflare D1 | Primary relational database (SQLite) |
| Cloudflare KV | Ephemeral key-value, cache, sessions |
| Cloudflare R2 | Binary/blob storage (not relational) |
| Hyperdrive + PostgreSQL | Optional: high-performance relational |

---

## D1 Constraints (SQLite)

| Constraint | Value |
|---|---|
| Max DB size | 2GB (current D1 limit) |
| Max row size | 1MB |
| Max columns per table | 2000 |
| Concurrent writes | Single-writer (serialized) |
| Full-text search | FTS5 available |
| JSON support | `json_extract()` available |
| No stored procedures | Use application layer |
| No `RETURNING` (older D1) | Use `last_insert_rowid()` |

---

## Schema Conventions

- All tables use **snake_case** names
- All columns use **snake_case** names
- Primary keys: `id TEXT PRIMARY KEY` (CUID2 or UUIDv7 generated in application)
- Every table has: `created_at TEXT NOT NULL`, `updated_at TEXT NOT NULL`
- Soft deletes: `deleted_at TEXT` (null = active)
- Foreign keys: named `{table_singular}_id`
- Indexes on all FK columns and common filter columns

---

## Core Schema

```sql
-- Users
CREATE TABLE IF NOT EXISTS users (
  id         TEXT PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  name       TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  avatar_url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

-- Sessions (for refresh token storage)
CREATE TABLE IF NOT EXISTS sessions (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id),
  refresh_token TEXT NOT NULL UNIQUE,
  user_agent    TEXT,
  ip_address    TEXT,
  expires_at    TEXT NOT NULL,
  created_at    TEXT NOT NULL,
  revoked_at    TEXT
);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON sessions(refresh_token);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_logs (
  id          TEXT PRIMARY KEY,
  user_id     TEXT REFERENCES users(id),
  action      TEXT NOT NULL,
  resource    TEXT NOT NULL,
  resource_id TEXT,
  metadata    TEXT,  -- JSON
  ip_address  TEXT,
  created_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_user_id   ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_resource  ON audit_logs(resource, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_created   ON audit_logs(created_at);
```

---

## Migration Strategy

Migrations are SQL files stored in `migrations/` directory and applied with Wrangler CLI.

### File Naming
```
migrations/
├── 0001_initial.sql
├── 0002_add_audit_logs.sql
└── 0003_add_user_preferences.sql
```

### Apply Migrations
```bash
# Local
wrangler d1 migrations apply DB

# Staging
wrangler d1 migrations apply DB --env staging

# Production
wrangler d1 migrations apply DB --env production
```

### Migration Rules
1. Never modify existing migrations — create a new one
2. Migrations must be idempotent (`CREATE TABLE IF NOT EXISTS`)
3. Include rollback SQL as a comment at the bottom of each file
4. Test migrations on staging before production
5. Document breaking schema changes in [CHANGELOG.md](CHANGELOG.md)

---

## Query Patterns

### Safe Query (Parameterized)
```typescript
// Always use bound parameters — never string interpolation
const user = await env.DB
  .prepare('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL')
  .bind(userId)
  .first<User>();
```

### Batch Queries
```typescript
const [users, count] = await env.DB.batch([
  env.DB.prepare('SELECT * FROM users LIMIT ? OFFSET ?').bind(limit, offset),
  env.DB.prepare('SELECT COUNT(*) as total FROM users WHERE deleted_at IS NULL'),
]);
```

### Transactions (D1)
```typescript
// D1 supports transactions via batch with implicit transaction
const result = await env.DB.batch([
  env.DB.prepare('INSERT INTO orders (...) VALUES (?)').bind(...),
  env.DB.prepare('UPDATE inventory SET stock = stock - 1 WHERE id = ?').bind(itemId),
]);
```

---

## Indexing Strategy

- Index all foreign key columns
- Index all `WHERE` clause columns used in common queries
- Index `created_at` for time-range queries
- Composite indexes for multi-column queries (order: most selective first)
- Review `EXPLAIN QUERY PLAN` for slow queries

---

## Data Types (SQLite)

| Use Case | SQLite Type | Notes |
|---|---|---|
| IDs | `TEXT` | CUID2 or UUIDv7 |
| Strings | `TEXT` | UTF-8 |
| Integers | `INTEGER` | 64-bit signed |
| Decimals | `REAL` or `TEXT` | Use TEXT for currency (store cents as INTEGER) |
| Booleans | `INTEGER` | 0 = false, 1 = true |
| Timestamps | `TEXT` | ISO 8601: `2026-07-17T13:00:00.000Z` |
| JSON | `TEXT` | Use `json_extract()` for queries |
| Enums | `TEXT` with CHECK | `CHECK (role IN ('admin', 'viewer'))` |

---

## Backup & Recovery

- D1 automatic daily snapshots (Cloudflare-managed)
- Export database: `wrangler d1 export DB --output backup.sql`
- Restore: `wrangler d1 execute DB --file backup.sql`
- Point-in-time recovery: Review current D1 plan capabilities

---

## Performance Guidelines

- Use `LIMIT` on all list queries
- Use indexes for all `WHERE` and `ORDER BY` columns
- Avoid `SELECT *` — specify required columns
- Use `EXPLAIN QUERY PLAN` to verify index usage
- Cache frequently-read data in KV (avoid repeated D1 reads)
- For analytics/aggregations, consider exporting to R2 + D1 Analytics

---

## Security

- Use parameterized queries **always** — never string interpolation
- Restrict D1 access to Worker bindings only (no public access)
- Audit sensitive data access via audit_logs table
- Encrypt sensitive columns (PII) in application layer before storage

---

## Migration to PostgreSQL (Hyperdrive)

When D1 limitations are reached (size, write throughput, complex queries):

1. Provision PostgreSQL (Supabase, Neon, or self-hosted)
2. Enable Cloudflare Hyperdrive for connection pooling
3. Update Worker binding: `env.DB` → Hyperdrive connection
4. Migrate schema (SQLite → PostgreSQL syntax differences)
5. Update data types: `TEXT` IDs → `UUID`, `TEXT` booleans → `BOOLEAN`
6. Document in [CHANGELOG.md](CHANGELOG.md) and [DEPLOYMENT.md](DEPLOYMENT.md)

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial database documentation |

---

## Related Documents

- [BACKEND.md](BACKEND.md) — Repository layer patterns
- [DATA_DICTIONARY.md](DATA_DICTIONARY.md) — Field-level definitions
- [CLOUDFLARE.md](CLOUDFLARE.md) — D1 binding configuration
- [STORAGE.md](STORAGE.md) — Non-relational storage
- [SECURITY.md](SECURITY.md) — Data security requirements
- [docs/database/sql.md](docs/database/sql.md) — SQL patterns
- [docs/database/migrations.md](docs/database/migrations.md) — Migration guide
- [docs/cloudflare/d1.md](docs/cloudflare/d1.md) — D1 deep dive


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
