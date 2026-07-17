# API.md — API Contracts & Standards

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [BACKEND.md](BACKEND.md) | [AUTHENTICATION.md](AUTHENTICATION.md) | [ERROR_HANDLING.md](ERROR_HANDLING.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | All API contracts, standards, and versioning |

---

## Overview

This document defines the API design standards, contracts, and patterns used across all backend services. All APIs must conform to these standards to ensure consistency for frontend clients, AI integrations, and third-party consumers.

---

## Base URL

| Environment | URL |
|---|---|
| Local | `http://localhost:8787/api` |
| Preview | `https://{branch}.{project}.pages.dev/api` |
| Staging | `https://staging.{domain}/api` |
| Production | `https://api.{domain}` |

---

## Versioning

- URI path versioning: `/api/v1/`, `/api/v2/`
- Current version: **v1**
- New versions created only for breaking changes
- Old versions deprecated with 6-month notice and `Deprecation` header
- Non-breaking additions (new fields, new endpoints) do not require version bump

---

## Authentication

All protected endpoints require:
```
Authorization: ******
```

Token obtained via POST `/api/v1/auth/login` or OAuth callback.

See: [AUTHENTICATION.md](AUTHENTICATION.md)

---

## Request Format

- **Content-Type:** `application/json`
- **Accept:** `application/json`
- **Encoding:** UTF-8
- **Max body size:** 10MB (configurable per endpoint)

---

## Response Format

### Success Response
```json
{
  "data": { ... }
}
```

### List Response
```json
{
  "data": [ ... ],
  "pagination": {
    "cursor": "next_cursor_value",
    "hasMore": true,
    "limit": 20,
    "total": 500
  }
}
```

### Error Response
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested user was not found",
    "status": 404,
    "requestId": "req_01HXYZ123"
  }
}
```

---

## HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | OK — GET, PUT, PATCH success |
| 201 | Created — POST success |
| 202 | Accepted — Async operation started |
| 204 | No Content — DELETE success |
| 400 | Bad Request — Validation error |
| 401 | Unauthorized — Missing/invalid token |
| 403 | Forbidden — Insufficient permissions |
| 404 | Not Found — Resource missing |
| 409 | Conflict — Duplicate or state conflict |
| 422 | Unprocessable Entity — Business rule violation |
| 429 | Too Many Requests — Rate limit |
| 500 | Internal Server Error — Unexpected failure |
| 503 | Service Unavailable — Dependency down |

---

## Error Code Reference

| Code | Status | Meaning |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Input failed schema validation |
| `MISSING_REQUIRED_FIELD` | 400 | Required field absent |
| `UNAUTHORIZED` | 401 | No valid auth token |
| `TOKEN_EXPIRED` | 401 | JWT has expired |
| `FORBIDDEN` | 403 | Insufficient role/permission |
| `RESOURCE_NOT_FOUND` | 404 | Entity does not exist |
| `DUPLICATE_RESOURCE` | 409 | Unique constraint violation |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server failure |
| `SERVICE_UNAVAILABLE` | 503 | Dependency unavailable |

---

## Pagination

All list endpoints use **cursor-based pagination**:

### Request
```
GET /api/v1/users?limit=20&cursor=next_cursor_value
```

### Response
```json
{
  "data": [...],
  "pagination": {
    "cursor": "next_cursor_value",
    "hasMore": true,
    "limit": 20
  }
}
```

### Rules
- Default limit: 20
- Max limit: 100
- `cursor` is opaque — do not parse or construct manually
- Omit `cursor` to start from the beginning

---

## Filtering & Sorting

```
GET /api/v1/users?role=admin&sort=created_at&order=desc
```

- Filter params use field name as query param key
- `sort`: field to sort by
- `order`: `asc` | `desc` (default: `desc`)
- Multiple filters combined with `AND`

---

## Idempotency

For POST endpoints that should be idempotent (payments, notifications):
```
POST /api/v1/orders
Idempotency-Key: uuid-v4-value
```

- Responses for duplicate requests return the original result with `X-Idempotent-Response: true`
- Keys stored for 24 hours

---

## Rate Limiting

| Tier | Limit | Window |
|---|---|---|
| Anonymous | 100 requests | 60 seconds |
| Authenticated | 1000 requests | 60 seconds |
| Service account | 10000 requests | 60 seconds |

Rate limit headers returned:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1719600000
Retry-After: 60  (when limited)
```

---

## CORS

```
Access-Control-Allow-Origin: https://{domain}
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

---

## API Endpoints (Registry)

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/login` | None | Email/password login |
| POST | `/api/v1/auth/logout` | Required | Invalidate refresh token |
| POST | `/api/v1/auth/refresh` | Cookie | Refresh access token |
| GET | `/api/v1/auth/me` | Required | Get current user |
| POST | `/api/v1/auth/oauth/callback` | None | OAuth callback |

### Users
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/users` | admin | List all users |
| POST | `/api/v1/users` | admin | Create user |
| GET | `/api/v1/users/:id` | Required | Get user by ID |
| PATCH | `/api/v1/users/:id` | admin/self | Update user |
| DELETE | `/api/v1/users/:id` | admin | Soft-delete user |

### Health
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | None | Worker health check |
| GET | `/health/db` | None | D1 connectivity check |

---

## Data Models

### User
```typescript
interface User {
  id: string;           // CUID2
  email: string;        // Unique
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  avatarUrl?: string;
  createdAt: string;    // ISO 8601
  updatedAt: string;    // ISO 8601
  deletedAt?: string;   // ISO 8601, null = active
}
```

### Auth Tokens
```typescript
interface TokenResponse {
  accessToken: string;   // JWT, 15min TTL
  expiresIn: number;     // Seconds
  tokenType: 'Bearer';
}
```

---

## OpenAPI / Swagger

OpenAPI spec maintained at `/docs/api/openapi.yaml` (when implemented).

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial API documentation |

---

## Related Documents

- [BACKEND.md](BACKEND.md) — API server implementation
- [AUTHENTICATION.md](AUTHENTICATION.md) — Auth endpoints detail
- [AUTHORIZATION.md](AUTHORIZATION.md) — Permission model
- [ERROR_HANDLING.md](ERROR_HANDLING.md) — Error contract detail
- [SERVICE_REGISTRY.md](SERVICE_REGISTRY.md) — All service contracts
- [DATA_DICTIONARY.md](DATA_DICTIONARY.md) — Data field definitions
- [docs/api/api-standards.md](docs/api/api-standards.md) — Detailed API standards
- [docs/api/versioning.md](docs/api/versioning.md) — Versioning strategy
