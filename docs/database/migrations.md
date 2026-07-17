# Database Migrations

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [DATABASE.md](../../DATABASE.md)

## Overview

D1 database migration strategy. See [DATABASE.md](../../DATABASE.md) for the full schema documentation.

## Migration Files

```
migrations/
├── 0001_initial.sql          ← Initial schema
├── 0002_add_sessions.sql     ← Add sessions table
├── 0003_add_audit_logs.sql   ← Add audit logging
└── 0004_add_user_prefs.sql   ← Add preferences
```

## Naming Convention

`{four-digit-number}_{description}.sql`

## Migration Rules

1. **Never modify existing migrations** — Create new ones
2. **Idempotent:** Use `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`
3. **Include rollback SQL** as a comment at the bottom
4. **Test on staging** before production
5. **Backward compatible:** Deploy code before removing columns

## Migration Template

```sql
-- Migration: 0005_add_avatar.sql
-- Description: Add avatar_url to users table
-- Date: 2026-07-17

ALTER TABLE users ADD COLUMN avatar_url TEXT;

-- Rollback:
-- ALTER TABLE users DROP COLUMN avatar_url;
```

## Running Migrations

```bash
# Local dev
wrangler d1 migrations apply DB

# Staging
wrangler d1 migrations apply DB --env staging

# Production (automated in CI)
wrangler d1 migrations apply DB --env production

# Check status
wrangler d1 migrations list --env production
```

## Verified Sources

- Cloudflare D1 Migrations — https://developers.cloudflare.com/d1/reference/migrations/
- SQLite ALTER TABLE — https://www.sqlite.org/lang_altertable.html


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
