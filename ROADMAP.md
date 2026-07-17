# ROADMAP.md — Development Roadmap

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [FEATURE_REGISTRY.md](FEATURE_REGISTRY.md) | [CHANGELOG.md](CHANGELOG.md) | [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | Development roadmap and future improvements |

---

## Overview

This roadmap outlines the planned evolution of the system. Items are grouped by phase and priority. All shipped items are tracked in [CHANGELOG.md](CHANGELOG.md) and [FEATURE_REGISTRY.md](FEATURE_REGISTRY.md).

---

## Current Status (v1.0.0)

- ✅ Documentation knowledge base (40+ documents)
- ✅ Core authentication (email/password + OAuth)
- ✅ RBAC authorization
- ✅ REST API with Cloudflare Workers
- ✅ D1 database with migrations
- ✅ R2 file storage
- ✅ KV caching
- ✅ CI/CD with GitHub Actions

---

## Phase 2 — v1.1.0 (Planned)

| Feature | Priority | Docs |
|---|---|---|
| Magic link (passwordless) login | High | AUTH-006 |
| Avatar upload with image optimization | Medium | USER-006 |
| Email change with verification flow | Medium | USER-007 |
| Sentry error tracking integration | High | OPS-006 |
| Signed R2 URL generation | Medium | STOR-004 |
| Storybook for component library | Low | — |

---

## Phase 3 — v1.2.0 (Planned)

| Feature | Priority | Notes |
|---|---|---|
| TOTP MFA for admin accounts | High | AUTH-007 |
| Real-time notifications via Durable Objects | Medium | — |
| Full-text search | Medium | FTS5 or external |
| Audit log dashboard (admin) | Low | — |
| Dark mode | Low | Design system |

---

## Phase 4 — v2.0.0 (Research)

| Feature | Priority | Notes |
|---|---|---|
| Migrate to PostgreSQL via Hyperdrive | Medium | When D1 limits are reached |
| Multi-tenant architecture | High | For SaaS scaling |
| GraphQL API layer | Low | In addition to REST |
| Mobile app (React Native or Flutter) | Medium | Shares Workers API |
| AI features via Cloudflare AI Gateway | Medium | — |

---

## Infrastructure Improvements

| Item | Priority | Notes |
|---|---|---|
| Cloudflare Zero Trust access for admin | High | Replace IP-based allow |
| Logpush to R2 for log archival | Medium | 90-day retention |
| Uptime monitoring (BetterUptime) | High | Alert on downtime |
| Performance RUM (PostHog) | Low | Real user monitoring |

---

## Documentation Roadmap

| Item | Status |
|---|---|
| OpenAPI spec (openapi.yaml) | 📋 Planned |
| Storybook component docs | 📋 Planned |
| Architecture Decision Records (ADRs) | 📋 Planned |
| Video walkthrough of architecture | 🔬 Research |

---

## Known Technical Debt

| Item | Impact | Planned Fix |
|---|---|---|
| D1 single-writer bottleneck | Medium | Phase 4: Hyperdrive + PostgreSQL |
| No circuit breaker for external APIs | Low | KV-based flag in Phase 3 |
| No DLQ for failed queue messages | Medium | Phase 2: D1-backed DLQ |

See: [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md)

---

## Verified Sources

- Cloudflare Roadmap — https://developers.cloudflare.com/changelog/
- GitHub Actions Docs — https://docs.github.com/actions
- NIST Cybersecurity Framework — https://www.nist.gov/cyberframework

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Comprehensive roadmap documentation |

---

## Related Documents

- [FEATURE_REGISTRY.md](FEATURE_REGISTRY.md) — Feature status tracking
- [CHANGELOG.md](CHANGELOG.md) — Shipped changes
- [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md) — Constraints driving roadmap
- [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) — Architecture decisions

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



---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
