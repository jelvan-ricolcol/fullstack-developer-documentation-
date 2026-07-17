# KNOWN_LIMITATIONS.md — Known Limitations & Constraints

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | [ROADMAP.md](ROADMAP.md) | [CLOUDFLARE.md](CLOUDFLARE.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | All known platform limitations, constraints, and workarounds |

---

## Overview

This document catalogs known platform limitations, architectural constraints, and accepted trade-offs. AI assistants and developers must consult this before proposing solutions that may hit these boundaries.

---

## Cloudflare Workers

| Limitation | Value | Impact | Workaround |
|---|---|---|---|
| CPU time (free tier) | 10ms/request | Limits heavy computation | Move to paid plan or offload to queues |
| CPU time (paid tier) | 30s/request | Very long jobs can't run in-request | Use Queues for long async tasks |
| Memory per isolate | 128MB | Large in-memory data structures | Use R2/KV for large data |
| Request body size | 100MB | Large file uploads hit limit | Use multipart + stream to R2 |
| Subrequest limit | 50 per request | Many API fan-outs fail | Batch or chain via Queue |
| No `fs` module | N/A | Can't use Node.js file system APIs | Use R2 for file storage |
| No `process.env` | N/A | Environment access is different | Use `env` bindings from Worker entry |
| No TCP connections (free) | N/A | Can't connect to external DBs directly | Use Hyperdrive for PostgreSQL |
| Cold starts | ~0ms (V8 reuse) | Generally not an issue | N/A |

---

## Cloudflare D1 (SQLite)

| Limitation | Value | Impact | Workaround |
|---|---|---|---|
| Database size | 2GB | Large datasets require migration | Shard or migrate to PostgreSQL via Hyperdrive |
| Single writer | Yes | High write throughput will queue | Use queues; migrate to PostgreSQL |
| No stored procedures | N/A | Business logic must be in app layer | OK — preferred pattern |
| No full-text search (built-in) | N/A | Search features limited | FTS5 available; or use external search |
| No `RETURNING` clause (older) | N/A | Must re-fetch after insert | Use `last_insert_rowid()` or re-query |
| Eventual read consistency | Yes (reads) | Reads may be slightly stale | Cache critical reads in KV |
| Limited JSON functions | Partial | Complex JSON queries limited | Process in application layer |

---

## Cloudflare KV

| Limitation | Value | Impact | Workaround |
|---|---|---|---|
| Eventual consistency | Yes | Writes take ~60s globally | Not suitable for counters or locks |
| Max value size | 25MB | Large blobs can't be stored | Use R2 for objects |
| Max key size | 512 bytes | Very long keys need hashing | Hash long keys with SHA-256 |
| No transactions | N/A | Can't atomically update multiple keys | Use D1 for transactional state |
| List performance | Slow on large sets | Listing many keys is expensive | Use D1 for queryable sets |

---

## Cloudflare Durable Objects

| Limitation | Value | Impact | Workaround |
|---|---|---|---|
| Single-region by default | Yes | Latency for geographically distant users | Use regional hints; accept latency |
| Storage limit per DO | 128KB (metadata) / unlimited (SQL) | Large state needs careful design | Use D1 or R2 for large state |
| No cross-DO transactions | N/A | Coordinating across DOs is complex | Design for independent DOs |
| Billing per request | Yes | Many short connections expensive | Batch operations where possible |

---

## Cloudflare Queues

| Limitation | Value | Impact | Workaround |
|---|---|---|---|
| Max message size | 128KB | Large payloads can't be queued | Store payload in R2, queue reference key |
| Max batch size | 100 messages | Large batches need splitting | Process in sub-batches |
| Delivery guarantee | At-least-once | Duplicate processing possible | Make consumers idempotent |
| No DLQ (dead-letter queue) | Yes (no native) | Failed messages may be lost after retries | Log failures; implement manual DLQ in D1 |

---

## Architectural Constraints

| Constraint | Detail | Impact |
|---|---|---|
| JWT-only auth | No opaque server-side sessions (stateless) | Token revocation requires KV blacklist |
| SQLite in production | D1 is SQLite, not PostgreSQL | Limited query features; must plan migration path |
| No server-side rendering | Pages + Workers SPA model | SEO requires extra effort (prerendering) |
| CORS restrictions | Browser enforces CORS | All cross-origin requests need proper headers |
| No WebSocket keep-alive (free) | Workers free tier | Long-lived WebSocket requires paid plan or Durable Objects |

---

## Browser / Platform Compatibility

| Feature | Limitation |
|---|---|
| Web Crypto API | Available in all modern browsers + Workers; not Node.js compatible |
| Fetch API | Available; Workers use `fetch` differently from browsers |
| Streams API | Available in Workers; use for large R2 responses |
| WebSocket | Available in Workers via Durable Objects |
| Service Workers | Frontend only; separate from Cloudflare Workers |

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial known limitations documentation |

---

## Related Documents

- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — Resolution steps for issues
- [CLOUDFLARE.md](CLOUDFLARE.md) — Cloudflare services
- [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) — Design decisions accounting for limitations
- [ROADMAP.md](ROADMAP.md) — Planned mitigations
