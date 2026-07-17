# Frontend Security

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [FRONTEND.md](../../FRONTEND.md) | **Related:** [SECURITY.md](../../SECURITY.md)

## Overview

Frontend security practices. See [SECURITY.md](../../SECURITY.md) for the full security policy.

## XSS Prevention

React escapes all values in JSX by default. Never use `dangerouslySetInnerHTML` with untrusted content:

```tsx
// ✅ Safe — React escapes this
<p>{userInput}</p>

// ❌ Dangerous — Never do this with untrusted data
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ If HTML rendering is required, sanitize first
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

## Token Storage

```typescript
// ✅ Access token in memory only
let accessToken: string | null = null;

// ✅ Refresh token in HttpOnly cookie (set by server)
// Cannot be accessed by JavaScript

// ❌ Never store tokens in localStorage
localStorage.setItem('token', accessToken); // VULNERABLE
```

## CSRF Protection

- Refresh tokens in SameSite=Strict cookies prevent CSRF
- Custom header check: `X-Requested-With: XMLHttpRequest`
- Origin validation on server

## Content Security Policy

Set by Cloudflare Workers response headers — not configurable from frontend. See [CLOUDFLARE.md](../../CLOUDFLARE.md).

## Dependency Security

```bash
# Audit dependencies
npm audit

# Check for known vulnerabilities
npx better-npm-audit audit
```

## Verified Sources

- OWASP XSS — https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- OWASP CSRF — https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
