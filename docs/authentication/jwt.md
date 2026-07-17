# JWT (JSON Web Tokens)

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [AUTHENTICATION.md](../../AUTHENTICATION.md)

## Overview

JWTs are used as access tokens for API authentication. See [AUTHENTICATION.md](../../AUTHENTICATION.md) for the full authentication flow.

## Token Structure

```
HEADER.PAYLOAD.SIGNATURE

Header: { "alg": "HS256", "typ": "JWT" }
Payload: {
  "sub": "cuid2abc123",
  "email": "user@example.com",
  "role": "admin",
  "iss": "https://api.{domain}",
  "aud": "https://{domain}",
  "iat": 1719600000,
  "exp": 1719600900,
  "jti": "unique-id"
}
```

## Token TTL

| Token | TTL |
|---|---|
| Access token | 15 minutes |
| Refresh token | 7 days |

## Signing (HS256)

```typescript
import { SignJWT } from 'jose';

const accessToken = await new SignJWT({
  sub: userId,
  email: user.email,
  role: user.role,
})
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setIssuer(env.JWT_ISSUER)
  .setAudience(env.JWT_AUDIENCE)
  .setExpirationTime('15m')
  .setJti(crypto.randomUUID())
  .sign(new TextEncoder().encode(env.JWT_SECRET));
```

## Verification

```typescript
import { jwtVerify } from 'jose';

const { payload } = await jwtVerify(
  token,
  new TextEncoder().encode(env.JWT_SECRET),
  { issuer: env.JWT_ISSUER, audience: env.JWT_AUDIENCE }
);
```

## Security

- Store access token in **memory only** (never localStorage)
- Use HS256 with ≥256-bit secret, or RS256 for distributed verification
- `jti` claim prevents token replay after revocation
- Short TTL (15min) limits blast radius of token theft

## Verified Sources

- RFC 7519 (JWT) — https://www.rfc-editor.org/rfc/rfc7519
- jose library — https://github.com/panva/jose
- OWASP JWT Cheatsheet — https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
