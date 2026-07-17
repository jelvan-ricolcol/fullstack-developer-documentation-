# SECURITY.md — Security Policy & Practices

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [AUTHENTICATION.md](AUTHENTICATION.md) | [AUTHORIZATION.md](AUTHORIZATION.md) | [BACKEND.md](BACKEND.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | Security policy, threat model, and implementation requirements |

---

## Overview

Security is the highest-priority concern after data integrity. All code, configurations, and deployments must meet these requirements before being considered production-ready.

---

## Threat Model

| Threat | Mitigation |
|---|---|
| Injection (SQL, XSS, Command) | Parameterized queries; React escaping; input validation (Zod) |
| Broken authentication | JWT with short TTL; refresh token rotation; account lockout |
| Sensitive data exposure | Encrypt PII at rest; HTTPS enforced; no secrets in code |
| Broken access control | RBAC middleware on all routes; resource ownership checks |
| Security misconfiguration | CSP, CORS, HSTS, security headers set by default |
| Vulnerable dependencies | Dependabot; npm audit in CI; CodeQL scanning |
| CSRF | SameSite cookies; custom header verification |
| SSRF | Whitelist outbound domains; validate URLs before fetching |
| Credential stuffing | Rate limiting; account lockout; CAPTCHA (Turnstile) |
| Mass assignment | Explicit allow-list of accepted fields via Zod schema |

---

## OWASP Top 10 Controls

Reference: https://owasp.org/www-project-top-ten/

| OWASP Category | Status | Control |
|---|---|---|
| A01 Broken Access Control | ✅ | RBAC middleware; ownership checks |
| A02 Cryptographic Failures | ✅ | HTTPS always; JWT RS/HS256; Argon2 passwords |
| A03 Injection | ✅ | Zod validation; D1 parameterized queries |
| A04 Insecure Design | ✅ | Security review in PR checklist |
| A05 Security Misconfiguration | ✅ | Default security headers; no debug in prod |
| A06 Vulnerable Components | ✅ | Dependabot; `npm audit` in CI |
| A07 Auth & Session Failures | ✅ | Short JWT TTL; token rotation; lockout |
| A08 Software & Data Integrity | ✅ | CI checks; signed deploys |
| A09 Logging & Monitoring Failures | ✅ | Audit logs; error tracking (Sentry) |
| A10 SSRF | ✅ | Outbound URL allowlist |

---

## Secrets Management

- **Never** commit secrets to any file in the repository
- Store secrets in **Cloudflare Secrets** (runtime) and **GitHub Secrets** (CI/CD)
- Rotate secrets on suspected compromise immediately
- Use `wrangler secret put KEY` to update secrets without code changes
- `.env` files are `.gitignore`d; use `.env.example` for documentation only
- GitHub push protection is enabled to block secrets in commits

See: [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)

---

## Authentication Security

- Passwords hashed with **Argon2id** (prefer) or bcrypt ≥12 rounds
- JWT access tokens: 15-minute TTL, stored in memory
- Refresh tokens: 7-day TTL, stored in HttpOnly Secure SameSite=Strict cookie
- Account lockout after 10 failed attempts (15-minute cooldown)
- All auth attempts logged to audit_logs

See: [AUTHENTICATION.md](AUTHENTICATION.md)

---

## Authorization Security

- RBAC enforced on every protected route (server-side only)
- Principle of least privilege: default role is `viewer`
- Admin role not self-assigned; requires existing admin or direct DB operation
- All authorization denials logged

See: [AUTHORIZATION.md](AUTHORIZATION.md)

---

## HTTP Security Headers

Set on all Worker responses:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; ...
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## Dependency Security

- `npm audit` runs in CI — failures block merge
- Dependabot configured for weekly security updates
- Security updates auto-merged for patch versions
- Major version updates require manual review
- CodeQL scans run on push to main and weekly

---

## Security Review Checklist (per PR)

- [ ] No secrets in code or committed files
- [ ] Input validated with Zod at all trust boundaries
- [ ] SQL uses parameterized queries only
- [ ] New endpoints protected with auth/authz middleware
- [ ] No new permissions granted without documented justification
- [ ] Security headers present on all responses
- [ ] `npm audit` passes in CI
- [ ] OWASP top 10 considered

---

## Reporting Vulnerabilities

Report security vulnerabilities privately via GitHub Security Advisories:
https://github.com/jelvan-ricolcol/fullstack-developer-documentation-/security/advisories/new

Do **not** open public issues for security vulnerabilities.

Response SLA:
- Critical: 24 hours
- High: 72 hours
- Medium/Low: 7 days

---

## Verified Sources

- OWASP Top 10 — https://owasp.org/www-project-top-ten/
- OWASP Cheat Sheet Series — https://cheatsheetseries.owasp.org/
- NIST Password Guidelines (SP 800-63B) — https://pages.nist.gov/800-63-3/sp800-63b.html
- CISA KEV — https://www.cisa.gov/known-exploited-vulnerabilities-catalog

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Comprehensive security documentation |

---

## Related Documents

- [AUTHENTICATION.md](AUTHENTICATION.md) — Auth implementation
- [AUTHORIZATION.md](AUTHORIZATION.md) — RBAC implementation
- [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) — Secrets management
- [OBSERVABILITY.md](OBSERVABILITY.md) — Security audit logging
- [docs/security/owasp.md](docs/security/owasp.md) — OWASP details
- [docs/security/secrets.md](docs/security/secrets.md) — Secrets management
