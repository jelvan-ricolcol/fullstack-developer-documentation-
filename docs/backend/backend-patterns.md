# Backend Patterns

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [BACKEND.md](../../BACKEND.md)

## Overview

Common backend design patterns used in Cloudflare Workers. See [BACKEND.md](../../BACKEND.md) for the full architecture.

## Repository Pattern

```typescript
// Base repository with common operations
export abstract class BaseRepository<T> {
  constructor(protected readonly db: D1Database) {}

  abstract tableName: string;

  async findById(id: string): Promise<T | null> {
    return this.db
      .prepare(`SELECT * FROM ${this.tableName} WHERE id = ? AND deleted_at IS NULL`)
      .bind(id)
      .first<T>();
  }

  async softDelete(id: string): Promise<void> {
    await this.db
      .prepare(`UPDATE ${this.tableName} SET deleted_at = ? WHERE id = ?`)
      .bind(new Date().toISOString(), id)
      .run();
  }
}
```

## Service Layer Pattern

Services contain business logic and orchestrate repositories:

```typescript
export class UserService {
  constructor(
    private readonly repo: UserRepository,
    private readonly kv: KVNamespace,
    private readonly queue: Queue
  ) {}

  async createUser(data: CreateUserInput): Promise<User> {
    // 1. Validate business rules
    const existing = await this.repo.findByEmail(data.email);
    if (existing) throw new ConflictError('Email already in use');

    // 2. Create in DB
    const user = await this.repo.create(data);

    // 3. Enqueue welcome email
    await this.queue.send({ type: 'welcome-email', userId: user.id });

    return user;
  }
}
```

## Middleware Chain Pattern

```typescript
const middlewares = [
  corsMiddleware(),
  rateLimitMiddleware(),
  requestLoggerMiddleware(),
  // Route-specific:
  authMiddleware(),
  authorizeMiddleware('users', 'create'),
  validateBody(CreateUserSchema),
];
```

## Verified Sources

- Cloudflare Workers Docs — https://developers.cloudflare.com/workers/
- Hono Framework — https://hono.dev/
