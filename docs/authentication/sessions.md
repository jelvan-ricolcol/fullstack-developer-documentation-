# Session Management

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [AUTHENTICATION.md](../../AUTHENTICATION.md) | **Related:** [DATABASE.md](../../DATABASE.md)

## Overview

Session management using refresh tokens stored in D1. See [AUTHENTICATION.md](../../AUTHENTICATION.md) for the full flow.

## Session Storage

Sessions stored in D1 `sessions` table:
```sql
CREATE TABLE sessions (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id),
  refresh_token TEXT NOT NULL UNIQUE,
  user_agent    TEXT,
  ip_address    TEXT,
  expires_at    TEXT NOT NULL,
  created_at    TEXT NOT NULL,
  revoked_at    TEXT
);
```

## Session Lifecycle

| Event | Action |
|---|---|
| Login | Create session record; set HttpOnly cookie |
| Token refresh | Rotate refresh token; invalidate old; update session |
| Logout | Set `revoked_at`; clear cookie |
| Password change | Revoke ALL user sessions |
| Security event | Revoke suspicious session |

## Token Rotation (Security)

Refresh tokens are **rotated on every use**:
```typescript
// On refresh:
// 1. Validate incoming refresh token
// 2. Mark old token revoked
// 3. Generate new refresh token
// 4. Update session record
// 5. Return new access token + set new cookie
```

This prevents token reuse even if a token is intercepted.

## Session Cleanup

Expired sessions should be purged periodically:
```sql
DELETE FROM sessions WHERE expires_at < datetime('now') OR revoked_at IS NOT NULL;
```

Run via a scheduled Cloudflare Workers Cron Trigger or Queue job.

## Verified Sources

- OWASP Session Management — https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- RFC 6749 (OAuth 2.0) — https://www.rfc-editor.org/rfc/rfc6749
