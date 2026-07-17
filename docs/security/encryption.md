# Encryption

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [SECURITY.md](../../SECURITY.md)

## Overview

Encryption standards for data at rest and in transit.

## Data in Transit

- TLS 1.2+ enforced by Cloudflare on all connections
- TLS 1.3 preferred
- HSTS header set: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- No self-signed certificates needed (Cloudflare manages TLS)

## Data at Rest

- D1 data: encrypted at rest by Cloudflare (AES-256)
- R2 objects: encrypted at rest by Cloudflare (AES-256)
- KV values: encrypted at rest by Cloudflare
- Sensitive fields (e.g., SSN, credit card): encrypt in application layer before storage

## Password Hashing

```typescript
import { hash, verify } from '@node-rs/argon2';

// Hash password
const hashedPassword = await hash(plainPassword, {
  memoryCost: 19456,    // 19 MiB
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
});

// Verify password
const isValid = await verify(hashedPassword, plainPassword);
```

**Algorithm:** Argon2id (per OWASP recommendation)

## JWT Signing

- Algorithm: HS256 (HMAC-SHA256) with ≥256-bit secret
- Or RS256 (RSA-SHA256) for distributed verification
- Key rotation documented in [AUTHENTICATION.md](../../AUTHENTICATION.md)

## Web Crypto (Workers)

```typescript
// Generate random token
const token = crypto.randomUUID();

// Hash with SHA-256
const encoder = new TextEncoder();
const data = encoder.encode(input);
const hashBuffer = await crypto.subtle.digest('SHA-256', data);
const hashHex = Array.from(new Uint8Array(hashBuffer))
  .map(b => b.toString(16).padStart(2, '0'))
  .join('');
```

## Verified Sources

- OWASP Password Storage — https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- NIST SP 800-63B — https://pages.nist.gov/800-63-3/sp800-63b.html
- Web Crypto API — https://www.w3.org/TR/WebCryptoAPI/


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
