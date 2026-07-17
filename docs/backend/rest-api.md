# REST API Patterns

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [API.md](../../API.md) | **Related:** [BACKEND.md](../../BACKEND.md)

## Overview

REST API design patterns. See [API.md](../../API.md) for the full API contract.

## Resource Naming

```
/api/v1/users              → Collection
/api/v1/users/:id          → Single resource
/api/v1/users/:id/posts    → Sub-collection
```

## HTTP Methods

| Method | Action | Idempotent |
|---|---|---|
| GET | Read | Yes |
| POST | Create | No (use Idempotency-Key) |
| PUT | Replace | Yes |
| PATCH | Partial update | No |
| DELETE | Remove | Yes |

## Response Codes

See [API.md](../../API.md) for the full status code reference.

## Pagination Pattern

```
GET /api/v1/users?limit=20&cursor=next_cursor
```

Response:
```json
{
  "data": [...],
  "pagination": { "cursor": "...", "hasMore": true, "limit": 20 }
}
```

## Verified Sources

- REST API Design — https://restfulapi.net/
- HTTP/1.1 RFC 7231 — https://www.rfc-editor.org/rfc/rfc7231
- API Design Patterns (Google) — https://cloud.google.com/apis/design


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
