# Repository Standard

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [GITHUB.md](../../GITHUB.md) | **Related:** [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Overview

Repository configuration and governance standards. See [GITHUB.md](../../GITHUB.md) for full governance documentation.

## Required Files

| File | Purpose |
|---|---|
| `README.md` | Repository overview |
| `INDEX.md` | Documentation map |
| `LICENSE` | License declaration |
| `CODE_OF_CONDUCT.md` | Community standards |
| `CONTRIBUTING.md` | Contribution guidelines |
| `SECURITY.md` | Security policy |
| `.github/CODEOWNERS` | Review ownership |
| `.github/dependabot.yml` | Dependency updates |
| `.gitignore` | Excluded files |

## Branch Protection (main)

- Require PR before merging
- Require 1 approving review
- Require CODEOWNER review
- Require status checks (lint, test, build)
- Require branch up-to-date
- No force pushes
- No direct deletions

## Repository Settings

- **Visibility:** Public (documentation) / Private (app code)
- **Default branch:** `main`
- **Issues:** Enabled
- **Discussions:** Enabled (for Q&A and announcements)
- **Projects:** Enabled
- **Wiki:** Disabled (use docs/ instead)
- **Squash merge:** Enabled
- **Merge commits:** Disabled
- **Rebase merge:** Enabled

## Verified Sources

- GitHub Repository Docs — https://docs.github.com/repositories
- GitHub Branch Protection — https://docs.github.com/repositories/configuring-branches-and-merges
