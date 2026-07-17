# GITHUB.md — GitHub Governance & Configuration

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [CI_CD.md](CI_CD.md) | [DEPLOYMENT.md](DEPLOYMENT.md) | [CONTRIBUTING.md](CONTRIBUTING.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | GitHub repository governance, workflows, and settings |

---

## Overview

This document describes all GitHub-specific configuration: branch protection, PR standards, Actions workflows, security settings, and repository governance policies.

---

## Branch Strategy

| Branch | Purpose | Protection | Who Merges |
|---|---|---|---|
| `main` | Production | ✅ Protected | Repository admin |
| `develop` | Staging integration | ✅ Protected | PR merge |
| `feature/*` | New features | ❌ | Developer |
| `fix/*` | Bug fixes | ❌ | Developer |
| `chore/*` | Maintenance | ❌ | Developer |
| `docs/*` | Documentation | ❌ | Developer |

### Branch Naming
```
feature/add-user-auth
fix/jwt-refresh-race-condition
chore/update-wrangler-version
docs/update-api-reference
```

---

## Branch Protection Rules (main & develop)

- ✅ Require pull request before merging
- ✅ Require at least 1 approving review
- ✅ Dismiss stale reviews on new push
- ✅ Require review from CODEOWNERS
- ✅ Require status checks to pass (lint, test, build)
- ✅ Require branches to be up to date
- ✅ Require conversation resolution
- ✅ Do not allow force pushes
- ✅ Do not allow deletions

---

## Pull Request Standards

### PR Title (Conventional Commits)
```
feat(auth): add OAuth Google login
fix(api): correct 401 response on expired token
docs(api): update endpoint reference
chore(deps): bump wrangler to 3.x
```

### PR Description Template
```markdown
## Summary
Brief description of what this PR does.

## Changes
- Added X
- Updated Y
- Fixed Z

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Documentation
- [ ] Relevant docs updated
- [ ] INDEX.md updated (if new doc added)
- [ ] CHANGELOG.md updated

## Checklist
- [ ] No secrets committed
- [ ] Breaking changes documented
- [ ] Tests added for new behavior
```

---

## Commit Message Standards (Conventional Commits)

Format: `type(scope): description`

```
feat(auth): add magic link authentication
fix(workers): handle D1 connection timeout
docs(api): add pagination examples
style(frontend): fix button alignment
refactor(service): extract email service
test(auth): add JWT refresh token tests
chore(ci): update GitHub Actions to Node 20
perf(query): add index on users.email
ci(deploy): add staging deployment step
revert: feat(auth): revert magic link (breaks mobile)
security(api): fix CORS misconfiguration
```

---

## CODEOWNERS

```
# .github/CODEOWNERS
# All files require review from repository owner
* @jelvan-ricolcol

# Security-sensitive paths require additional review
/SECURITY.md @jelvan-ricolcol
/.github/ @jelvan-ricolcol
/docs/security/ @jelvan-ricolcol
```

---

## GitHub Actions Workflows

See full detail: [CI_CD.md](CI_CD.md)

| Workflow | Trigger | Purpose |
|---|---|---|
| `ci.yml` | Push, PR | Lint, test, build |
| `deploy-preview.yml` | PR opened/updated | Deploy preview |
| `deploy-staging.yml` | Push to develop | Deploy staging |
| `deploy-production.yml` | Push to main | Deploy production |
| `codeql.yml` | Push, weekly | Security scanning |
| `dependabot-review.yml` | Dependabot PR | Auto-merge minor deps |

---

## Dependabot Configuration

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    groups:
      dev-dependencies:
        patterns: ["*"]
        dependency-type: "development"
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
```

---

## Security Settings

- Secret scanning: **Enabled**
- Push protection: **Enabled** (blocks secrets in commits)
- Dependency review: **Enabled**
- CodeQL: **Enabled** (JavaScript/TypeScript)
- Dependabot security updates: **Enabled**

---

## Repository Secrets

| Secret | Purpose |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Deploy to Cloudflare |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |

> All other secrets are stored in Cloudflare Secrets, not GitHub.

---

## Issues & Discussions

### Issue Labels
| Label | Usage |
|---|---|
| `bug` | Confirmed defect |
| `feature` | New capability |
| `docs` | Documentation update |
| `security` | Security concern |
| `performance` | Performance issue |
| `good first issue` | Suitable for contributors |
| `blocked` | Waiting on external factor |

### Milestones
- Milestones map to minor version releases (e.g., `v1.1.0`)
- Issues assigned to milestones for tracking

---

## Releases

- Semantic versioning: `vMAJOR.MINOR.PATCH`
- Release notes auto-generated from conventional commits
- GitHub Releases created on every production deployment
- Release tags match deployed version

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial GitHub governance documentation |

---

## Related Documents

- [CI_CD.md](CI_CD.md) — Workflow details
- [CONTRIBUTING.md](CONTRIBUTING.md) — Contribution guide
- [SECURITY.md](SECURITY.md) — Security policy
- [DEPLOYMENT.md](DEPLOYMENT.md) — Deployment procedures
- [docs/github/github-actions.md](docs/github/github-actions.md) — Actions deep dive
- [docs/github/repository-standard.md](docs/github/repository-standard.md) — Repository standards


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
