# API Authentication

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [AUTHENTICATION.md](../../AUTHENTICATION.md) | **Related:** [API.md](../../API.md)

## Overview

How to authenticate API requests. See [AUTHENTICATION.md](../../AUTHENTICATION.md) for the full auth implementation.

## ******

All protected endpoints require a JWT access token:

```http
GET /api/v1/users/me HTTP/1.1
Authorization: ******
```

## Obtaining a Token

```http
POST /api/v1/auth/login HTTP/1.1
Content-Type: application/json

{ "email": "user@example.com", "password": "..." }
```

Response:
```json
{
  "data": {
    "accessToken": "eyJhbGci...",
    "expiresIn": 900,
    "tokenType": "Bearer"
  }
}
```

## Refreshing a Token

```http
POST /api/v1/auth/refresh HTTP/1.1
Cookie: refresh_token=...
```

## Token Expiry

| Token | TTL |
|---|---|
| Access token | 15 minutes |
| Refresh token | 7 days |

## Verified Sources

- RFC 6750 (****** — https://www.rfc-editor.org/rfc/rfc6750
- RFC 7519 (JWT) — https://www.rfc-editor.org/rfc/rfc7519
