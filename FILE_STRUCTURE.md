# FILE_STRUCTURE.md — Repository File Structure

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [CODING_STANDARDS.md](CODING_STANDARDS.md) | [AI_CONTEXT.md](AI_CONTEXT.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | Complete repository and project file layout |

---

## Repository Root

```
/
├── .github/                    # GitHub configuration
│   ├── workflows/              # GitHub Actions workflows
│   │   ├── ci.yml
│   │   ├── deploy-preview.yml
│   │   ├── deploy-staging.yml
│   │   ├── deploy-production.yml
│   │   └── codeql.yml
│   ├── CODEOWNERS
│   ├── dependabot.yml
│   └── pull_request_template.md
│
├── docs/                       # Detailed topic documentation
│   ├── architecture/
│   ├── api/
│   ├── authentication/
│   ├── authorization/
│   ├── backend/
│   ├── cloudflare/
│   ├── database/
│   ├── frontend/
│   ├── github/
│   ├── security/
│   ├── testing/
│   ├── performance/
│   ├── monitoring/
│   ├── observability/
│   ├── deployment/
│   ├── realtime/
│   ├── accessibility/
│   ├── caching/
│   ├── storage/
│   ├── logging/
│   ├── docker/
│   ├── kubernetes/
│   ├── aws/
│   ├── integrations/
│   ├── ui-ux/
│   ├── seo/
│   ├── prompts/
│   ├── standards/
│   ├── references/
│   └── queues/
│
├── assets/                     # Documentation assets (images, diagrams)
├── examples/                   # Code examples
├── snippets/                   # Reusable code snippets
├── templates/                  # Project templates
│
├── INDEX.md                    ← Start here (documentation map)
├── README.md                   ← Repository overview
├── ARCHITECTURE.md
├── SYSTEM_DESIGN.md
├── FRONTEND.md
├── BACKEND.md
├── API.md
├── DATABASE.md
├── AUTHENTICATION.md
├── AUTHORIZATION.md
├── ENVIRONMENT_VARIABLES.md
├── DEPLOYMENT.md
├── CLOUDFLARE.md
├── GITHUB.md
├── CI_CD.md
├── SECURITY.md
├── PERFORMANCE.md
├── MONITORING.md
├── OBSERVABILITY.md
├── TESTING.md
├── ERROR_HANDLING.md
├── STATE_MANAGEMENT.md
├── COMPONENT_LIBRARY.md
├── DESIGN_SYSTEM.md
├── STORAGE.md
├── FILE_STRUCTURE.md           ← This file
├── CODING_STANDARDS.md
├── TROUBLESHOOTING.md
├── AI_POLICY.md
├── AI_CONTEXT.md
├── AI_REFERENCE.md
├── FEATURE_REGISTRY.md
├── SERVICE_REGISTRY.md
├── DATA_DICTIONARY.md
├── KNOWN_LIMITATIONS.md
├── ROADMAP.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── STYLE_GUIDE.md
├── GLOSSARY.md
├── CODE_OF_CONDUCT.md
└── LICENSE
```

---

## Frontend Application Structure

```
src/
├── app/
│   ├── App.tsx                 # Root component
│   ├── router.tsx              # Route definitions
│   └── providers.tsx           # React context providers
│
├── pages/                      # Route-level page components
│   ├── Home/
│   │   ├── Home.tsx
│   │   ├── Home.test.tsx
│   │   └── index.ts
│   ├── Dashboard/
│   └── Settings/
│
├── features/                   # Feature modules (co-located)
│   ├── auth/
│   │   ├── components/         # Auth-specific components
│   │   ├── hooks/              # Auth hooks
│   │   ├── queries/            # React Query definitions
│   │   ├── store.ts            # Zustand store
│   │   └── index.ts
│   └── users/
│
├── components/                 # Shared components
│   ├── primitives/             # Atoms (Button, Input)
│   ├── layout/                 # Grid, Stack
│   ├── feedback/               # Toast, Alert
│   ├── overlay/                # Modal, Drawer
│   └── index.ts                # Barrel export
│
├── hooks/                      # Shared custom hooks
├── lib/                        # Utilities
│   ├── api-client.ts
│   ├── utils.ts
│   └── validators.ts
├── stores/                     # Global Zustand stores
├── types/                      # Global TypeScript types
└── styles/                     # Global CSS, Tailwind config
```

---

## Backend (Worker) Structure

```
worker/
├── src/
│   ├── index.ts                # Entry point
│   ├── router.ts               # Route registration
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── repositories/
│   ├── lib/
│   └── types/
├── migrations/                 # D1 SQL migrations
├── test/                       # Integration tests
├── wrangler.toml
└── package.json
```

---

## Naming Rules

| Type | Convention | Example |
|---|---|---|
| Root markdown docs | `UPPER_SNAKE_CASE.md` | `ARCHITECTURE.md` |
| Docs subdirectory files | `kebab-case.md` | `api-standards.md` |
| TypeScript files | `kebab-case.ts` | `auth-middleware.ts` |
| React components | `PascalCase.tsx` | `UserProfile.tsx` |
| Test files | `*.test.ts(x)` | `Button.test.tsx` |
| Directories | `kebab-case` | `auth-service/` |

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial file structure documentation |

---

## Related Documents

- [CODING_STANDARDS.md](CODING_STANDARDS.md) — Naming and code conventions
- [AI_CONTEXT.md](AI_CONTEXT.md) — Folder structure for AI context
- [FRONTEND.md](FRONTEND.md) — Frontend folder detail
- [BACKEND.md](BACKEND.md) — Backend folder detail
