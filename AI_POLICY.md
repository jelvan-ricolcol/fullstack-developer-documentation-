# AI_POLICY.md — AI Usage & Governance Policy

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [AI_CONTEXT.md](AI_CONTEXT.md) | [AI_REFERENCE.md](AI_REFERENCE.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | Repository-wide AI assistant governance |

---

## Overview

This document governs how AI assistants (GitHub Copilot, Claude, Gemini, Codex, Cursor, Windsurf, etc.) interact with this repository. It defines acceptable use, documentation requirements, decision-making authority, and safety constraints.

---

## Purpose

- Ensure AI-generated code is production-ready and reviewed before merge.
- Preserve documentation-first principles across AI-assisted workflows.
- Prevent AI assistants from making undocumented or conflicting changes.
- Define clear ownership of AI-assisted decisions.

---

## Scope

Applies to:
- All AI code generation tools used in this repository
- All AI documentation generation
- All AI-assisted code review
- All AI-assisted architecture decisions

---

## Governing Principles

### 1. Documentation-First
Every AI-generated change must be accompanied by documentation updates. AI assistants must update relevant documents before a change is considered complete.

### 2. Human Oversight Required
All AI-generated code changes require human review before merging to protected branches. AI is a collaborator, not an autonomous decision-maker.

### 3. No Silent Side Effects
AI assistants must not modify configuration files, environment variables, CI/CD pipelines, or infrastructure definitions without explicit human approval and documentation.

### 4. Security Non-Negotiable
AI assistants must never:
- Commit secrets, API keys, or credentials to any file
- Disable security checks or linters
- Bypass branch protection rules
- Weaken authentication or authorization logic
- Introduce unvalidated user input into queries or commands

### 5. Backward Compatibility
AI assistants must preserve backward compatibility unless a breaking change is explicitly requested, documented, and versioned.

### 6. Source Verification
AI-generated documentation must cite official sources. AI must not fabricate references, version numbers, or API behaviors.

---

## Approved AI Tools

| Tool | Use Case | Approval Level |
|---|---|---|
| GitHub Copilot | Code completion, PR review | Developer |
| Claude (Anthropic) | Architecture, documentation, complex refactoring | Senior Developer |
| Gemini (Google) | Research, code review | Developer |
| OpenAI Codex | Code generation | Developer |
| Cursor | IDE integration, refactoring | Developer |
| Windsurf | IDE integration | Developer |

---

## Required Actions for AI-Generated Changes

1. **Before implementation:** Verify the change does not conflict with existing configuration, deployments, or documented architecture.
2. **During implementation:** Follow [CODING_STANDARDS.md](CODING_STANDARDS.md) exactly.
3. **After implementation:** Update all affected documentation per [INDEX.md](INDEX.md).
4. **Before commit:** Run secret scanning. Never commit credentials.
5. **Before merge:** Human review required. All CI checks must pass.

---

## AI Context Preservation

AI assistants should always consult:
1. [AI_CONTEXT.md](AI_CONTEXT.md) — Current project state
2. [AI_REFERENCE.md](AI_REFERENCE.md) — Quick lookup reference
3. [ARCHITECTURE.md](ARCHITECTURE.md) — System constraints
4. [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) — Configuration
5. [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md) — What not to attempt

---

## Decision Authority Matrix

| Decision Type | AI Role | Human Role |
|---|---|---|
| Boilerplate code | Generate | Review |
| Business logic | Suggest | Own and verify |
| Architecture changes | Propose | Approve and document |
| Security policies | Reference | Define and enforce |
| Database schema changes | Suggest | Approve, migrate, test |
| Environment variables | Reference existing | Define new |
| Breaking changes | Flag | Decide and document |
| Secret management | Never touch | Own entirely |

---

## AI Knowledge Base Maintenance

This repository is an AI knowledge base. All documents must be:
- **Machine-readable:** Consistent structure, predictable headings, code blocks labeled with language.
- **Cross-referenced:** Every document links back to INDEX.md and related docs.
- **Version-aware:** All documents carry version and last-updated metadata.
- **Non-conflicting:** No two documents should contain contradictory information.

When AI detects a conflict between documents, it must:
1. Flag the conflict in a comment or PR description.
2. Not silently resolve it in favor of either document.
3. Surface it to the human developer for resolution.

---

## Prohibited AI Actions

AI assistants **must not**:
- Push directly to `main` or protected branches
- Modify `.github/` directory without explicit instruction
- Change Cloudflare `wrangler.toml` without instruction
- Alter CI/CD pipeline configurations without instruction
- Generate or reference fake documentation
- Assume undocumented behavior is safe
- Skip documentation updates when making code changes
- Create files in paths that conflict with existing structure

---

## Security Constraints for AI

Reference: [SECURITY.md](SECURITY.md)

- All AI-generated code is subject to the same security review as human-written code.
- AI must apply OWASP Top 10 mitigations by default.
- AI must apply input validation at all trust boundaries.
- AI must use parameterized queries for all database interactions.
- AI must encode outputs according to the target context (HTML, JSON, SQL, etc.).
- AI must not suggest disabling security headers, CSP, or CORS protections.

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial policy document |

---

## Related Documents

- [INDEX.md](INDEX.md) — Documentation map
- [AI_CONTEXT.md](AI_CONTEXT.md) — Project context for AI
- [AI_REFERENCE.md](AI_REFERENCE.md) — AI quick reference
- [SECURITY.md](SECURITY.md) — Security policy
- [CODING_STANDARDS.md](CODING_STANDARDS.md) — Code conventions
- [CONTRIBUTING.md](CONTRIBUTING.md) — Contribution guidelines


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
