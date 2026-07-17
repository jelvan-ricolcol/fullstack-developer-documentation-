# API Design

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [API.md](../../API.md) | **Related:** [BACKEND.md](../../BACKEND.md)

## Overview

API design principles for the backend. See [API.md](../../API.md) for the full API documentation.

## Route Handler Structure

```typescript
// routes/users.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

const users = new Hono<{ Bindings: Env }>();

users.get('/', authorize('users', 'list'), async (c) => {
  const { limit, cursor } = PaginationSchema.parse(c.req.query());
  const service = new UserService(new UserRepository(c.env.DB), c.env.KV);
  const result = await service.listUsers({ limit, cursor });
  return c.json({ data: result.users, pagination: result.pagination });
});

users.post(
  '/',
  authorize('users', 'create'),
  zValidator('json', CreateUserSchema),
  async (c) => {
    const data = c.req.valid('json');
    const service = new UserService(new UserRepository(c.env.DB), c.env.KV);
    const user = await service.createUser(data);
    return c.json({ data: user }, 201);
  }
);

export { users as usersRouter };
```

## Verified Sources

- Hono Framework — https://hono.dev/
- REST API Design — https://restfulapi.net/
