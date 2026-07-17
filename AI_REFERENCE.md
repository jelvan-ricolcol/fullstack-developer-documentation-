# AI_REFERENCE.md — AI Quick Reference

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [AI_CONTEXT.md](AI_CONTEXT.md) | [AI_POLICY.md](AI_POLICY.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Last Updated** | 2026-07-17 |
| **Purpose** | Fast lookup for AI assistants — minimal prose, maximum signal |

---

## Document Lookup Table

| Question | Document |
|---|---|
| How does the overall system work? | [ARCHITECTURE.md](ARCHITECTURE.md) |
| What are the system design decisions? | [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) |
| What does the frontend do? | [FRONTEND.md](FRONTEND.md) |
| What does the backend do? | [BACKEND.md](BACKEND.md) |
| What are the API contracts? | [API.md](API.md) |
| How is the database structured? | [DATABASE.md](DATABASE.md) |
| How does authentication work? | [AUTHENTICATION.md](AUTHENTICATION.md) |
| How does authorization work? | [AUTHORIZATION.md](AUTHORIZATION.md) |
| What environment variables exist? | [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) |
| How is deployment done? | [DEPLOYMENT.md](DEPLOYMENT.md) |
| How is Cloudflare configured? | [CLOUDFLARE.md](CLOUDFLARE.md) |
| How are GitHub workflows set up? | [GITHUB.md](GITHUB.md) |
| How does CI/CD work? | [CI_CD.md](CI_CD.md) |
| What are the security requirements? | [SECURITY.md](SECURITY.md) |
| What are the performance budgets? | [PERFORMANCE.md](PERFORMANCE.md) |
| How is monitoring configured? | [MONITORING.md](MONITORING.md) |
| How is observability structured? | [OBSERVABILITY.md](OBSERVABILITY.md) |
| What is the testing strategy? | [TESTING.md](TESTING.md) |
| How are errors handled? | [ERROR_HANDLING.md](ERROR_HANDLING.md) |
| How is state managed? | [STATE_MANAGEMENT.md](STATE_MANAGEMENT.md) |
| What UI components exist? | [COMPONENT_LIBRARY.md](COMPONENT_LIBRARY.md) |
| What are the design tokens? | [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) |
| How is file storage handled? | [STORAGE.md](STORAGE.md) |
| What is the file structure? | [FILE_STRUCTURE.md](FILE_STRUCTURE.md) |
| What are the coding standards? | [CODING_STANDARDS.md](CODING_STANDARDS.md) |
| How to fix a common issue? | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| What features are built? | [FEATURE_REGISTRY.md](FEATURE_REGISTRY.md) |
| What services are registered? | [SERVICE_REGISTRY.md](SERVICE_REGISTRY.md) |
| What do data fields mean? | [DATA_DICTIONARY.md](DATA_DICTIONARY.md) |
| What are the known limitations? | [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md) |
| What is planned for the future? | [ROADMAP.md](ROADMAP.md) |
| What changed recently? | [CHANGELOG.md](CHANGELOG.md) |
| What are the AI rules? | [AI_POLICY.md](AI_POLICY.md) |
| What is the project context? | [AI_CONTEXT.md](AI_CONTEXT.md) |

---

## Quick Code Patterns

### API Error Response (TypeScript / Cloudflare Workers)
```typescript
export function errorResponse(
  code: string,
  message: string,
  status: number,
  requestId?: string
): Response {
  return Response.json(
    { error: { code, message, status, requestId } },
    { status }
  );
}
```

### JWT Validation (Workers)
```typescript
import { jwtVerify } from 'jose';

async function validateJWT(token: string, secret: string) {
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(secret)
  );
  return payload;
}
```

### D1 Query Pattern
```typescript
const result = await env.DB.prepare(
  'SELECT * FROM users WHERE id = ?'
).bind(userId).first();
```

### R2 Upload Pattern
```typescript
await env.BUCKET.put(key, body, {
  httpMetadata: { contentType: 'image/jpeg' },
  customMetadata: { uploadedBy: userId },
});
```

### KV Read/Write Pattern
```typescript
// Write
await env.KV.put(key, JSON.stringify(value), { expirationTtl: 3600 });

// Read
const raw = await env.KV.get(key);
const value = raw ? JSON.parse(raw) : null;
```

### Cloudflare Worker Entry Point
```typescript
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    // route based on url.pathname
  },
};
```

### Input Validation Pattern
```typescript
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['admin', 'user', 'viewer']),
});

const data = CreateUserSchema.parse(await request.json());
```

---

## Naming Conventions (Quick Reference)

| Item | Convention |
|---|---|
| JS/TS variables | `camelCase` |
| JS/TS constants | `UPPER_SNAKE_CASE` |
| TS types/interfaces | `PascalCase` |
| Files | `kebab-case.ts` |
| Root docs | `UPPER_CASE.md` |
| Subdocs | `kebab-case.md` |
| DB tables | `snake_case` |
| DB columns | `snake_case` |
| API paths | `/kebab-case` |
| Env vars | `UPPER_SNAKE_CASE` |
| Branches | `feature/kebab-case` |
| Commits | `type(scope): message` |

---

## Commit Type Reference

| Type | When to Use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code restructure, no behavior change |
| `test` | Adding or updating tests |
| `chore` | Build, config, dependency updates |
| `perf` | Performance improvement |
| `ci` | CI/CD changes |
| `revert` | Reverting a commit |
| `security` | Security fix |

---

## HTTP Status Code Reference

| Status | Meaning | When to Use |
|---|---|---|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST creating a resource |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input / validation error |
| 401 | Unauthorized | Missing or invalid auth token |
| 403 | Forbidden | Valid token, insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate resource, state conflict |
| 422 | Unprocessable Entity | Valid syntax, business rule violation |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server failure |
| 503 | Service Unavailable | Dependency down, maintenance mode |

---

## Environment Variables (Quick Reference)

See full docs: [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)

| Variable | Where Set | Purpose |
|---|---|---|
| `DATABASE_URL` | CF Secret / Local | D1 database binding |
| `JWT_SECRET` | CF Secret | JWT signing secret |
| `JWT_ISSUER` | CF Secret | JWT issuer claim |
| `CLOUDFLARE_API_TOKEN` | GitHub Secret | CF deployment token |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub Secret | CF account identifier |
| `R2_BUCKET_NAME` | wrangler.toml | R2 bucket binding |
| `KV_NAMESPACE_ID` | wrangler.toml | KV namespace binding |
| `ENVIRONMENT` | Determined by deploy | `local`/`preview`/`staging`/`production` |

---

## Cloudflare Resource Quick Reference

| Resource | Type | Purpose | Binding |
|---|---|---|---|
| D1 | SQLite DB | Primary structured data | `env.DB` |
| R2 | Object Storage | Files, images, assets | `env.BUCKET` |
| KV | Key-Value Store | Cache, sessions, config | `env.KV` |
| Durable Objects | Stateful Actor | Realtime, locks, counters | `env.DO` |
| Queues | Message Queue | Async background jobs | `env.QUEUE` |
| AI Gateway | AI Proxy | Rate-limited AI API calls | `env.AI` |

---

## Security Checklist (Quick)

- [ ] Input validated with Zod or equivalent schema library
- [ ] JWT validated on every protected endpoint
- [ ] Authorization check after authentication
- [ ] SQL queries use parameterized bindings
- [ ] Secrets in CF/GH secrets, never in code
- [ ] CORS configured with allowlist
- [ ] Rate limiting applied to public endpoints
- [ ] Response does not leak stack traces in production
- [ ] Content-Security-Policy header set
- [ ] HTTPS enforced (CF handles TLS)

---

## Related Documents

- [AI_CONTEXT.md](AI_CONTEXT.md) — Full project context
- [AI_POLICY.md](AI_POLICY.md) — AI governance rules
- [INDEX.md](INDEX.md) — Full documentation map
- [CODING_STANDARDS.md](CODING_STANDARDS.md) — Detailed code conventions
- [API.md](API.md) — Full API documentation
