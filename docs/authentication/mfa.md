# Multi-Factor Authentication (MFA)

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [AUTHENTICATION.md](../../AUTHENTICATION.md)

## Overview

MFA adds a second factor beyond password. Currently **planned** for v1.2.0.

## Planned Implementation

| Method | Status | Notes |
|---|---|---|
| TOTP (Authenticator app) | 📋 Planned | Google Authenticator, Authy |
| Backup codes | 📋 Planned | 10 single-use codes |
| SMS OTP | 🚫 Not recommended | NIST 800-63B discourages SMS |

## TOTP Flow (Planned)

```
1. User enables MFA in settings
2. Backend generates TOTP secret → returns QR code URI
3. User scans with authenticator app
4. User confirms with first TOTP code
5. Backend marks MFA as verified
6. All subsequent logins require TOTP code after password
```

## TOTP Implementation (Reference)

```typescript
import { generateTOTPSecret, verifyTOTP } from 'otplib'; // (planned)

// Generate secret for enrollment
const secret = generateTOTPSecret();
const otpauthUrl = `otpauth://totp/${encodeURIComponent(email)}?secret=${secret}&issuer=MyApp`;

// Verify code on login
const isValid = verifyTOTP(userProvidedCode, storedSecret);
```

## Verified Sources

- RFC 6238 (TOTP) — https://www.rfc-editor.org/rfc/rfc6238
- NIST SP 800-63B — https://pages.nist.gov/800-63-3/sp800-63b.html
- OWASP MFA Cheatsheet — https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
