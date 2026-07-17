# FEATURE_REGISTRY.md — Feature Registry

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [SERVICE_REGISTRY.md](SERVICE_REGISTRY.md) | [ROADMAP.md](ROADMAP.md) | [CHANGELOG.md](CHANGELOG.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | All features tracked with status, ownership, and dependencies |

---

## Overview

The Feature Registry tracks every product feature, its implementation status, dependencies, and documentation references. It serves as the authoritative source for "what is built."

---

## Feature Status Legend

| Status | Meaning |
|---|---|
| ✅ Complete | Shipped to production |
| 🔄 In Progress | Currently being developed |
| 📋 Planned | Approved for development |
| 🔬 Research | Under investigation |
| ❌ Deprecated | No longer supported |
| 🚫 Cancelled | Will not be built |

---

## Authentication & Authorization

| ID | Feature | Status | Version | Docs |
|---|---|---|---|---|
| AUTH-001 | Email/password login | ✅ Complete | 1.0.0 | [AUTHENTICATION.md](AUTHENTICATION.md) |
| AUTH-002 | JWT access token | ✅ Complete | 1.0.0 | [AUTHENTICATION.md](AUTHENTICATION.md) |
| AUTH-003 | Refresh token rotation | ✅ Complete | 1.0.0 | [AUTHENTICATION.md](AUTHENTICATION.md) |
| AUTH-004 | OAuth Google login | ✅ Complete | 1.0.0 | [AUTHENTICATION.md](AUTHENTICATION.md) |
| AUTH-005 | OAuth GitHub login | ✅ Complete | 1.0.0 | [AUTHENTICATION.md](AUTHENTICATION.md) |
| AUTH-006 | Magic link login | 📋 Planned | 1.1.0 | — |
| AUTH-007 | TOTP MFA | 📋 Planned | 1.2.0 | — |
| AUTHZ-001 | RBAC (admin/editor/viewer) | ✅ Complete | 1.0.0 | [AUTHORIZATION.md](AUTHORIZATION.md) |
| AUTHZ-002 | Resource-level ownership | ✅ Complete | 1.0.0 | [AUTHORIZATION.md](AUTHORIZATION.md) |

---

## User Management

| ID | Feature | Status | Version | Docs |
|---|---|---|---|---|
| USER-001 | Create user | ✅ Complete | 1.0.0 | [API.md](API.md) |
| USER-002 | List users (admin) | ✅ Complete | 1.0.0 | [API.md](API.md) |
| USER-003 | Get user by ID | ✅ Complete | 1.0.0 | [API.md](API.md) |
| USER-004 | Update user profile | ✅ Complete | 1.0.0 | [API.md](API.md) |
| USER-005 | Soft delete user | ✅ Complete | 1.0.0 | [API.md](API.md) |
| USER-006 | Avatar upload | 📋 Planned | 1.1.0 | — |
| USER-007 | Email change with verification | 📋 Planned | 1.1.0 | — |

---

## Storage & Files

| ID | Feature | Status | Version | Docs |
|---|---|---|---|---|
| STOR-001 | File upload to R2 | ✅ Complete | 1.0.0 | [STORAGE.md](STORAGE.md) |
| STOR-002 | File download via Worker | ✅ Complete | 1.0.0 | [STORAGE.md](STORAGE.md) |
| STOR-003 | Image thumbnail generation | 📋 Planned | 1.1.0 | — |
| STOR-004 | Signed URL generation | 📋 Planned | 1.1.0 | — |

---

## Infrastructure & Operations

| ID | Feature | Status | Version | Docs |
|---|---|---|---|---|
| OPS-001 | Health check endpoint | ✅ Complete | 1.0.0 | [MONITORING.md](MONITORING.md) |
| OPS-002 | D1 connectivity check | ✅ Complete | 1.0.0 | [MONITORING.md](MONITORING.md) |
| OPS-003 | Request logging | ✅ Complete | 1.0.0 | [OBSERVABILITY.md](OBSERVABILITY.md) |
| OPS-004 | Audit logging | ✅ Complete | 1.0.0 | [OBSERVABILITY.md](OBSERVABILITY.md) |
| OPS-005 | Rate limiting | ✅ Complete | 1.0.0 | [BACKEND.md](BACKEND.md) |
| OPS-006 | Sentry error tracking | 📋 Planned | 1.1.0 | [MONITORING.md](MONITORING.md) |

---

## How to Add a Feature

1. Assign a unique ID: `{CATEGORY}-{NNN}`
2. Add row to this registry with status `🔄 In Progress`
3. Create feature branch: `feature/{kebab-name}`
4. Implement with tests and documentation
5. Update status to `✅ Complete` on merge
6. Update [CHANGELOG.md](CHANGELOG.md)

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial feature registry |

---

## Related Documents

- [SERVICE_REGISTRY.md](SERVICE_REGISTRY.md) — Service contracts
- [ROADMAP.md](ROADMAP.md) — Planned features
- [CHANGELOG.md](CHANGELOG.md) — Shipped features
- [API.md](API.md) — API endpoints


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
