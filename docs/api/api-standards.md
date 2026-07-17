# API Standards

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [API.md](../../API.md)

## Overview

API design standards. See [API.md](../../API.md) for the full API contract documentation.

## URL Design

```
# Collections
GET    /api/v1/users        → List users
POST   /api/v1/users        → Create user

# Single resources
GET    /api/v1/users/:id    → Get user
PATCH  /api/v1/users/:id    → Update user
DELETE /api/v1/users/:id    → Delete user

# Sub-resources
GET    /api/v1/users/:id/posts → Get user's posts
```

## Request Standards

```http
POST /api/v1/users HTTP/1.1
Content-Type: application/json
Authorization: ******
Accept: application/json
Idempotency-Key: uuid-v4  (for POST operations that should be idempotent)

{ "email": "user@example.com", "name": "John" }
```

## Response Standards

Success:
```json
{ "data": { ... } }
```

Error:
```json
{ "error": { "code": "...", "message": "...", "status": 400, "requestId": "..." } }
```

## Verified Sources

- REST API Tutorial — https://restfulapi.net/
- HTTP Semantics (RFC 9110) — https://www.rfc-editor.org/rfc/rfc9110
- Google API Design Guide — https://cloud.google.com/apis/design


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
