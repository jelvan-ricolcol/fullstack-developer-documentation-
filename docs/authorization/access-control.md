# Access Control

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [AUTHORIZATION.md](../../AUTHORIZATION.md)

## Overview

Access control policies defining what each role can access. See [AUTHORIZATION.md](../../AUTHORIZATION.md) for the full RBAC model.

## Access Control Principles

1. **Deny by default** — No access unless explicitly granted
2. **Least privilege** — Users get minimum permissions needed
3. **Fail securely** — Errors result in access denied, not access granted
4. **Complete mediation** — Every request is checked, no bypass paths

## Route-Level Access

```typescript
// Define access required for each route
const routes = {
  'GET /api/v1/users':       { resource: 'users', action: 'list' },
  'POST /api/v1/users':      { resource: 'users', action: 'create' },
  'GET /api/v1/users/:id':   { resource: 'users', action: 'read' },
  'PATCH /api/v1/users/:id': { resource: 'users', action: 'update' },
  'DELETE /api/v1/users/:id':{ resource: 'users', action: 'delete' },
};
```

## Verified Sources

- OWASP Access Control — https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html
- NIST RBAC Standard — https://csrc.nist.gov/projects/role-based-access-control
