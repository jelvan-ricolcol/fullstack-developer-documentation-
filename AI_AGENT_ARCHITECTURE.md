# AI Agent Architecture

## Overview
The JelAI ecosystem employs specialized AI agents to manage the software development lifecycle.

### Architecture Agent
- **Responsibilities:** System design, structural integrity.
- **Authority:** High. Can block PRs.
- **Required Inputs:** Requirements, current architecture.
- **Expected Outputs:** Architecture diagrams, decision logs.

### Frontend Agent
- **Responsibilities:** UI/UX implementation, React/Vite code.
- **Scope:** `src/`, `public/`.
- **Limitations:** Cannot alter backend APIs.

### Backend Agent
- **Responsibilities:** Cloudflare Workers, Hono APIs.
- **Scope:** `worker/`, API routes.

### Database Agent
- **Responsibilities:** D1 schemas, KV, R2 configurations.
- **Scope:** `D1_SCHEMA.sql`, migrations.

### Cloudflare & DevOps Agents
- **Responsibilities:** `wrangler.toml`, `.github/workflows/`.
- **Escalation Rules:** Any secret or critical infra change must be escalated to human DevOps.

### Security, Documentation, Testing Agents
- **Responsibilities:** Audits, test generation, cross-referencing.


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
