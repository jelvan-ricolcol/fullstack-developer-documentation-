# DATA_DICTIONARY.md — Data Dictionary

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [DATABASE.md](DATABASE.md) | [API.md](API.md) | [SERVICE_REGISTRY.md](SERVICE_REGISTRY.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | Canonical definitions of all data fields, types, and models |

---

## Overview

The Data Dictionary is the authoritative reference for all data fields across the system. Use this to ensure consistent naming, types, and validation rules across the API, database, and frontend.

---

## ID Format

All entity IDs use **CUID2** (Collision-resistant Unique Identifier).

- Format: 24-character string, starts with letter `c`
- Example: `cuid2abc123def456ghi789`
- Library: `@paralleldrive/cuid2`
- Stored as `TEXT` in D1

---

## Timestamp Format

All timestamps are stored and transmitted as **ISO 8601** strings in UTC:
- Format: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Example: `2026-07-17T13:54:52.000Z`
- Stored as `TEXT` in D1 (SQLite has no native TIMESTAMP)

---

## Entities

---

### User

**Table:** `users` | **API Resource:** `/api/v1/users`

| Field | DB Column | Type | Required | Description |
|---|---|---|---|---|
| `id` | `id` | CUID2 string | Yes | Unique user identifier |
| `email` | `email` | string (email) | Yes | Unique email address |
| `name` | `name` | string (1–100) | Yes | Display name |
| `role` | `role` | enum | Yes | `admin` / `editor` / `viewer` |
| `avatarUrl` | `avatar_url` | string (URL) | No | Profile picture URL |
| `createdAt` | `created_at` | ISO 8601 | Yes | Record creation time |
| `updatedAt` | `updated_at` | ISO 8601 | Yes | Last modification time |
| `deletedAt` | `deleted_at` | ISO 8601 | No | Soft delete timestamp (null = active) |

**Constraints:**
- `email` must be unique and lowercase-normalized
- `role` defaults to `viewer`
- `deletedAt IS NULL` required to be considered "active"

---

### Session

**Table:** `sessions`

| Field | DB Column | Type | Required | Description |
|---|---|---|---|---|
| `id` | `id` | CUID2 string | Yes | Unique session ID |
| `userId` | `user_id` | CUID2 string | Yes | FK → users.id |
| `refreshToken` | `refresh_token` | string (64 chars) | Yes | Opaque refresh token (hashed) |
| `userAgent` | `user_agent` | string | No | Browser/client user agent |
| `ipAddress` | `ip_address` | string (IP) | No | Client IP at creation |
| `expiresAt` | `expires_at` | ISO 8601 | Yes | When this session expires |
| `createdAt` | `created_at` | ISO 8601 | Yes | Session creation time |
| `revokedAt` | `revoked_at` | ISO 8601 | No | Revocation time (null = active) |

---

### Audit Log

**Table:** `audit_logs`

| Field | DB Column | Type | Required | Description |
|---|---|---|---|---|
| `id` | `id` | CUID2 string | Yes | Unique log entry ID |
| `userId` | `user_id` | CUID2 string | No | Who performed the action (null = system) |
| `action` | `action` | string | Yes | Action performed (e.g., `users:update`) |
| `resource` | `resource` | string | Yes | Resource type (e.g., `users`) |
| `resourceId` | `resource_id` | string | No | ID of affected resource |
| `metadata` | `metadata` | JSON string | No | Additional context |
| `ipAddress` | `ip_address` | string | No | Client IP address |
| `createdAt` | `created_at` | ISO 8601 | Yes | When action occurred |

---

## Enumerations

### UserRole
| Value | Description |
|---|---|
| `admin` | Full system access |
| `editor` | Read/write content access |
| `viewer` | Read-only access |
| `service` | Machine-to-machine access |

### ApiErrorCode
See full list in [ERROR_HANDLING.md](ERROR_HANDLING.md)

---

## API Field Naming (Camel Case)

The API returns `camelCase` field names:
```json
{
  "id": "cuid2abc123",
  "userId": "cuid2xyz456",
  "createdAt": "2026-07-17T13:54:52.000Z"
}
```

Database stores `snake_case` column names:
```sql
user_id, created_at, deleted_at
```

Mapping is handled in the repository layer.

---

## Validation Rules

| Field | Rule |
|---|---|
| Email | RFC 5322 format, max 254 chars, normalized to lowercase |
| Password | Min 12 chars, 1 upper, 1 lower, 1 digit, 1 special |
| Name | Min 1, max 100 chars, no HTML |
| ID (path param) | Must match CUID2 format |
| Pagination limit | Integer 1–100 |
| Pagination cursor | Opaque string, max 512 chars |

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial data dictionary |

---

## Related Documents

- [DATABASE.md](DATABASE.md) — SQL schema
- [API.md](API.md) — API response models
- [BACKEND.md](BACKEND.md) — Repository layer
- [AUTHENTICATION.md](AUTHENTICATION.md) — Session data model
