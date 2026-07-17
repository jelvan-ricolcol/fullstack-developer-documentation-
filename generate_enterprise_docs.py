import os
import re

files_to_create = {
    "AI_GOVERNANCE.md": """# AI Governance Framework

## Overview
This document outlines the Enterprise AI-First Development Standard governance model. Every AI assistant and human contributor must adhere to these policies.

## AI Decision Matrix
When encountering conflicting requirements or ambiguous architecture, AI agents must use the following priority:
1. Security & Compliance
2. Cloudflare & GitHub Source of Truth Integrity
3. Documentation & State Synchronization
4. Performance & Scalability
5. Developer Experience

## AI Conflict Resolution Policy
- **Minor Conflicts:** Automatically resolve by favoring the more restrictive security policy.
- **Major Conflicts:** Halt generation, document the conflict in `AI_CONFLICT_RESOLUTION.md`, and request human review.

## AI Escalation Procedures
1. Log warning to Dashboard.
2. Flag pull request as `AI-Escalation`.
3. Require Principal Architect approval.

## AI Confidence Levels
- **High (>95%):** Auto-merge allowed if tests pass.
- **Medium (75-95%):** Requires 1 Human PR review.
- **Low (<75%):** Must be generated as a Draft PR.

## AI Approval Workflow
```mermaid
graph TD
    A[AI Proposal] --> B{Confidence Level}
    B -->|High| C[Automated Tests]
    B -->|Medium| D[Human Review]
    B -->|Low| E[Draft PR & Architect Review]
    C --> F[Merge]
    D --> F
    E --> F
```

## AI Risk Assessment
Risk levels must be assessed per AI intervention. Any changes to `wrangler.toml`, `deploy.yml`, or `D1_SCHEMA.sql` automatically trigger High Risk protocols.

## AI Documentation Standards
All AI output must include Mermaid diagrams for flows and adhere to this repository's Markdown structure.

## AI Development & Security Policies
- Never commit secrets.
- Always use typed interfaces.
- Validate all inputs.

## AI Validation Rules & Review Process
AI agents must cross-reference their changes with `INDEX.md`, `ARCHITECTURE.md`, and `CI_CD.md` prior to finalizing a PR.
""",
    "GITHUB_CLOUDFLARE_SOURCE_OF_TRUTH.md": """# GitHub ↔ Cloudflare Source of Truth

## Single Source of Truth
GitHub is the definitive and canonical source of truth for the codebase, configurations, and documentation. Cloudflare is the sole execution environment. No manual changes via the Cloudflare UI are permitted if they alter state tracked in GitHub.

## Deployment Lifecycles

### Preview Deployment Lifecycle
Triggered on every PR.
```mermaid
graph LR
    PR[Pull Request] --> Build[GitHub Actions Build]
    Build --> Deploy[Cloudflare Pages/Workers Preview]
    Deploy --> Test[Automated Smoke Tests]
    Test --> URL[Preview URL Generated]
```

### Production Deployment Lifecycle
Triggered on merge to `main`.
```mermaid
graph LR
    Merge[Merge to main] --> Build[Production Build]
    Build --> Deploy[Cloudflare Production Deployment]
    Deploy --> Verify[Post-Deploy Verification]
    Verify --> Monitor[Active Monitoring]
```

## Rollback & Emergency Hotfix Workflow
- **Rollback:** Revert commit on `main`, which triggers a production deployment of the previous state.
- **Hotfix:** Branch from `main`, implement fix, open PR, fast-track approval, merge, deploy.

## Branch Protection & Merge Requirements
- `main` branch is protected.
- Requires passing CI checks (build, test, AI review).
- Requires at least 1 approval.

## Environment Promotion Strategy
Development -> Preview (PR) -> Production (`main`).
""",
    "DEPLOYMENT_STATE_MACHINE.md": """# Enterprise Deployment State Machine

## Complete Deployment Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Requirements
    Requirements --> Architecture
    Architecture --> Design
    Design --> Development
    Development --> Code_Review
    Code_Review --> Testing
    Testing --> Documentation_Update
    Documentation_Update --> Pull_Request
    Pull_Request --> Approval
    Approval --> Merge
    Merge --> Cloudflare_Preview
    Cloudflare_Preview --> Smoke_Testing
    Smoke_Testing --> Production
    Production --> Monitoring
    Monitoring --> Maintenance
    Maintenance --> [*]
    
    Monitoring --> Rollback: Failure Detected
    Rollback --> Maintenance
```

Every deployment must strictly traverse these states. Bypassing states is only allowed under the Emergency Hotfix workflow, which still mandates Documentation Update and Code Review retroactively.
""",
    "AI_AGENT_ARCHITECTURE.md": """# AI Agent Architecture

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
""",
    "REPOSITORY_MAP.md": """# Repository Knowledge Map

## Component Interaction

```mermaid
graph TD
    Docs[Documentation /docs/] --> GitHub[GitHub Actions /CI_CD/]
    GitHub --> CF[Cloudflare Infra]
    Frontend[Frontend /src/] --> Backend[Worker /worker/]
    Backend --> D1[(Cloudflare D1)]
    Backend --> R2[Cloudflare R2]
    Backend --> KV[Cloudflare KV]
    Backend --> DO[Durable Objects]
    Backend --> Queues[Cloudflare Queues]
```

## Directory Structure
- `/docs/`: All documentation.
- `/src/`: Frontend React application.
- `/worker/`: Cloudflare Worker API.
- `/.github/`: CI/CD and deployment workflows.
- `/assets/`: Static assets and diagrams.
- `/scripts/`: Utility scripts.
""",
    "ENTERPRISE_DECISION_TREES.md": """# Enterprise Decision Trees

## Storage Selection
```mermaid
graph TD
    A[Needs Storage?] --> B{Relational Data?}
    B -->|Yes| C[Cloudflare D1]
    B -->|No| D{Key-Value?}
    D -->|Yes| E[Cloudflare KV]
    D -->|No| F{Large Blobs/Files?}
    F -->|Yes| G[Cloudflare R2]
    F -->|No| H[Durable Objects for State]
```

## Other Decision Trees
- **Authentication:** Use built-in OAuth/JWT flows documented in `AUTHENTICATION.md`.
- **API Design:** RESTful principles with Hono.
- **State Management:** React Context + React Query.
- **Error Handling:** Standardized JSON error responses.
""",
    "UNIVERSAL_DEVELOPMENT_LIFECYCLE.md": """# Universal Development Lifecycle

## Mandatory Lifecycle
No feature may bypass the following phases:
1. **Planning:** Requirements gathering.
2. **Architecture:** System design review.
3. **Implementation:** Code writing.
4. **Testing:** Unit, integration, and e2e tests.
5. **Documentation:** Updating all relevant `.md` files.
6. **Review:** AI and Human PR review.
7. **Deployment:** Preview and Production.
8. **Monitoring:** Post-deployment observability.
9. **Maintenance:** Iterative updates.

Any feature violating this lifecycle will be rejected by CI/CD.
""",
    "ENTERPRISE_CODING_POLICIES.md": """# Enterprise Coding Policies

## Mandatory Rules
- **DRY Principle:** Never duplicate code. Refactor before creating new implementations.
- **Documentation First:** Update documentation after every architectural change.
- **Environment Variables:** Every environment variable must be documented in `ENVIRONMENT_VARIABLES.md`.
- **API Completeness:** Every API requires documentation.
- **Test Coverage:** Every feature requires tests.
- **Deployment & Schema:** Every deployment updates deployment docs. Every schema change updates `DATABASE.md`.
- **Cloudflare Native:** Cloudflare compatibility is mandatory. Node.js specific APIs are forbidden in Workers.
- **GitHub Canonical:** GitHub remains the canonical repository.
- **Security:** Security takes precedence over convenience.
- **Backward Compatibility:** Must be evaluated before breaking changes.
""",
    "JELAI_DASHBOARD_ARCHITECTURE.md": """# JelAI Dashboard Architecture

## System Architecture

```mermaid
graph TD
    User[User/Admin] --> Dash[JelAI Dashboard Frontend]
    Dash --> Auth[Auth Service]
    Dash --> GitHubAPI[GitHub Integration]
    Dash --> CFAPI[Cloudflare Integration]
    Dash --> AIChat[AI Chat Assistant]
    
    CFAPI --> Workers[Workers Dashboard]
    CFAPI --> D1[D1 Explorer]
    CFAPI --> R2[R2 Browser]
    
    GitHubAPI --> Repo[Repository Management]
    GitHubAPI --> Deploy[Deployment Dashboard]
```

## Features
- **Code & Deploy:** Commit Assistant, AI Code Review, Deployment Monitoring.
- **Data Management:** D1, R2, KV, and Queue explorers.
- **Admin:** User Roles, Permissions, Cost Monitoring, Audit Logs, Secrets Manager.
""",
    "AI_PROMPT_STANDARDS.md": """# AI Prompt Standards

## Standard Prompt Instructions
To ensure consistency across GitHub Copilot, Codex, Gemini, Claude, Cursor, and Windsurf, all AI systems must be primed with:

> "You are an Enterprise AI Systems Engineer working on the JelAI platform. All code must be compatible with Cloudflare Workers (no Node APIs). All frontend code is React/Vite. You must adhere strictly to the Enterprise Coding Policies. Never output secrets. Always provide complete, working code. Update documentation for any architectural changes. Use Mermaid diagrams for complex logic."

## Cross-Platform Consistency
Every AI output must be deterministic regarding architecture, coding standards, and documentation.
"""
}

# Write new files
for filename, content in files_to_create.items():
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)

# Update INDEX.md
with open("INDEX.md", "r", encoding="utf-8") as f:
    index_content = f.read()

append_str = "\n## Enterprise AI Standards\n"
for filename in files_to_create.keys():
    # Only append if not already in index
    if filename not in index_content:
        title = filename.replace('.md', '').replace('_', ' ').title()
        append_str += f"- [{title}]({filename})\n"

if "## Enterprise AI Standards" not in index_content:
    with open("INDEX.md", "a", encoding="utf-8") as f:
        f.write(append_str)

