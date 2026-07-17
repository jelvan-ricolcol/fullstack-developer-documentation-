# GLOSSARY.md — Terms & Definitions

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [AI_REFERENCE.md](AI_REFERENCE.md) | [DATA_DICTIONARY.md](DATA_DICTIONARY.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | All technical terms used across this repository |

---

## A

**Access Token** — A short-lived JWT (15-minute TTL) used to authenticate API requests. Stored in browser memory only. See [AUTHENTICATION.md](AUTHENTICATION.md).

**AI Gateway** — Cloudflare service that acts as a proxy for AI API calls (OpenAI, Anthropic, etc.) with rate limiting, caching, and logging.

**Argon2id** — Password hashing algorithm. The recommended choice per OWASP. Preferred over bcrypt.

---

## B

**Binding** — In Cloudflare Workers, a named reference to a resource (D1, R2, KV, etc.) available as `env.BINDING_NAME`.

**Branch Protection** — GitHub rule preventing direct pushes to a branch; requires PR and passing checks.

---

## C

**CUID2** — Collision-resistant Unique Identifier v2. 24-character string starting with `c`. Used as primary keys.

**Conventional Commits** — Commit message format: `type(scope): description`. See [GITHUB.md](GITHUB.md).

**CSP** — Content-Security-Policy HTTP header. Prevents XSS by restricting script sources.

**CORS** — Cross-Origin Resource Sharing. Controls which origins can call the API from a browser.

---

## D

**D1** — Cloudflare's serverless SQLite database, accessible as a Worker binding.

**Durable Object (DO)** — Cloudflare primitive for strongly-consistent stateful compute. Single-instance per name/key.

---

## E

**Edge** — Cloudflare's global network of 300+ Points of Presence. Workers execute here.

**Eventual Consistency** — Property of KV store: writes may not be immediately visible in all regions.

---

## H

**Hono** — Lightweight TypeScript web framework for Cloudflare Workers.

**HSTS** — HTTP Strict Transport Security. Forces HTTPS for all connections.

**Hyperdrive** — Cloudflare service that accelerates connections to external PostgreSQL/MySQL databases from Workers.

---

## I

**Idempotency-Key** — Request header for POST operations that ensures repeated calls with the same key return the original result.

**Isolate** — V8 JavaScript isolate. Cloudflare Workers run in isolates, not full Node.js processes.

---

## J

**JWT** — JSON Web Token. Compact, URL-safe token format for authentication claims. See [AUTHENTICATION.md](AUTHENTICATION.md).

---

## K

**KV** — Cloudflare Key-Value store. Global, eventually-consistent, low-latency key-value storage.

---

## M

**Miniflare** — Local Cloudflare Workers emulator for development and testing.

**MFA** — Multi-Factor Authentication. Requires a second verification method beyond password.

---

## O

**OAuth 2.0** — Authorization framework for third-party login (Google, GitHub). See [AUTHENTICATION.md](AUTHENTICATION.md).

**OIDC** — OpenID Connect. Identity layer on top of OAuth 2.0; provides ID tokens with user claims.

**OWASP Top 10** — List of the most critical web application security risks. See [SECURITY.md](SECURITY.md).

---

## P

**Pages** — Cloudflare Pages. Static site hosting with global CDN and optional Workers integration.

**PKCE** — Proof Key for Code Exchange. OAuth 2.0 extension for public clients (SPAs, mobile apps).

---

## R

**R2** — Cloudflare's S3-compatible object storage service. Zero egress fees.

**RBAC** — Role-Based Access Control. Access permissions assigned by role. See [AUTHORIZATION.md](AUTHORIZATION.md).

**Refresh Token** — Long-lived (7-day), opaque token used to obtain new access tokens. Stored in HttpOnly cookie.

---

## S

**SameSite** — Cookie attribute controlling cross-site request behavior. `Strict` = only same-site requests.

**Soft Delete** — Setting `deleted_at` timestamp instead of removing a database row. Enables audit trail and recovery.

**SQLite** — Embedded SQL database engine. Cloudflare D1 is SQLite-compatible.

---

## T

**TOTP** — Time-based One-Time Password. Algorithm for 2FA via authenticator apps (RFC 6238).

**Turnstile** — Cloudflare's CAPTCHA-free bot protection challenge system.

---

## V

**V8** — Google's JavaScript engine. Cloudflare Workers run V8 isolates, not Node.js.

**Vitest** — Vite-native unit testing framework compatible with Cloudflare Workers via Miniflare.

---

## W

**Worker** — A Cloudflare Workers script. Stateless request handler running in V8 at the edge.

**Wrangler** — Cloudflare's CLI for developing and deploying Workers, Pages, D1, R2, and KV.

---

## Z

**Zod** — TypeScript-first schema validation library. Used for all input validation at API boundaries.

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Comprehensive glossary |

---

## Related Documents

- [AI_REFERENCE.md](AI_REFERENCE.md) — Quick AI reference
- [DATA_DICTIONARY.md](DATA_DICTIONARY.md) — Data field definitions
- [INDEX.md](INDEX.md) — Documentation map

## Documentation template for contributors

- **Decision:** What implementation choice was made?
- **Source:** Which official document backs the choice?
- **Reason:** Why is it appropriate for this project?
- **Risk:** What breaks if the assumption changes?
- **Validation:** Which test, command, or review proves it works?

## Verified sources

- Docker Docs — https://docs.docker.com/
- Kubernetes Docs — https://kubernetes.io/docs/
- OpenTelemetry Docs — https://opentelemetry.io/docs/
- Prometheus Docs — https://prometheus.io/docs/
- The Twelve-Factor App — https://12factor.net/

