# GitHub Security Settings

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [GITHUB.md](../../GITHUB.md) | **Related:** [SECURITY.md](../../SECURITY.md)

## Overview

GitHub security configuration for this repository. See [SECURITY.md](../../SECURITY.md) for the full security policy.

## Enabled Security Features

| Feature | Status | Purpose |
|---|---|---|
| Secret scanning | ✅ Enabled | Detect secrets committed to code |
| Push protection | ✅ Enabled | Block commits with secrets |
| Dependency review | ✅ Enabled | Review dep changes in PRs |
| Dependabot alerts | ✅ Enabled | Notify on vulnerable deps |
| Dependabot security updates | ✅ Enabled | Auto-PR for security patches |
| CodeQL (JavaScript) | ✅ Enabled | SAST scanning |
| GHAS (if available) | Optional | Advanced security features |

## Secret Scanning

GitHub automatically scans all commits for known secret patterns (API keys, tokens, etc.).

Push protection prevents secrets from being pushed:
- Blocks push immediately
- Developer must remove secret before pushing
- Contact owner if legitimate false positive

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

## Security Reporting

Report vulnerabilities via GitHub Security Advisories — not public issues.

URL: `https://github.com/jelvan-ricolcol/fullstack-developer-documentation-/security/advisories/new`

## Verified Sources

- GitHub Security Docs — https://docs.github.com/code-security
- Secret Scanning — https://docs.github.com/code-security/secret-scanning
- Dependabot — https://docs.github.com/code-security/dependabot


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
