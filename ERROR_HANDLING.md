# ERROR_HANDLING.md — Error Handling Standards

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [API.md](API.md) | [BACKEND.md](BACKEND.md) | [OBSERVABILITY.md](OBSERVABILITY.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | Error handling patterns across backend, frontend, and APIs |

---

## Overview

Errors must be caught, classified, logged, and returned in a consistent format. Users receive friendly messages; developers receive actionable context in logs. Internal stack traces are never exposed in production.

---

## Error Classification

| Class | HTTP Range | Examples |
|---|---|---|
| Client errors | 4xx | Validation, auth, not found |
| Server errors | 5xx | DB failure, unexpected exception |
| Business errors | 422 | Rule violation (e.g., email already exists) |
| Rate limit | 429 | Too many requests |

---

## Error Response Schema

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested user was not found",
    "status": 404,
    "requestId": "req_01HXYZ123",
    "details": [
      { "field": "id", "message": "Must be a valid CUID2" }
    ]
  }
}
```

`details` is optional — used for validation errors to identify specific fields.

---

## Backend Error Types

```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(
    message = 'Validation failed',
    public readonly details?: Array<{ field: string; message: string }>
  ) {
    super('VALIDATION_ERROR', message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super('RESOURCE_NOT_FOUND', message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super('UNAUTHORIZED', message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super('FORBIDDEN', message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super('DUPLICATE_RESOURCE', message, 409);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super('RATE_LIMIT_EXCEEDED', message, 429);
  }
}

export class InternalError extends AppError {
  constructor(message = 'An internal error occurred') {
    super('INTERNAL_ERROR', message, 500);
  }
}
```

---

## Global Error Handler (Hono)

```typescript
// middleware/error-handler.ts
import { AppError, InternalError } from '../lib/errors';
import { log } from '../lib/logger';

app.onError((error, c) => {
  const requestId = c.req.header('X-Request-Id') ?? crypto.randomUUID();

  if (error instanceof AppError) {
    // Known application error — log at appropriate level
    log({
      level: error.status >= 500 ? 'error' : 'warn',
      message: error.message,
      requestId,
      error: { code: error.code, message: error.message },
      status: error.status,
    });

    return c.json(
      {
        error: {
          code: error.code,
          message: error.message,
          status: error.status,
          requestId,
        },
      },
      error.status as any
    );
  }

  // Unknown error — log full context, return safe message
  log({
    level: 'error',
    message: 'Unhandled error',
    requestId,
    error: {
      code: 'INTERNAL_ERROR',
      message: error.message,
      stack: c.env.ENVIRONMENT !== 'production' ? error.stack : undefined,
    },
  });

  return c.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An internal error occurred',
        status: 500,
        requestId,
      },
    },
    500
  );
});
```

---

## Input Validation Errors (Zod)

```typescript
import { z, ZodError } from 'zod';
import { ValidationError } from '../lib/errors';

function parseZodError(error: ZodError): ValidationError {
  const details = error.errors.map((e) => ({
    field: e.path.join('.'),
    message: e.message,
  }));
  return new ValidationError('Validation failed', details);
}

// Usage
try {
  const body = CreateUserSchema.parse(await c.req.json());
} catch (error) {
  if (error instanceof ZodError) {
    throw parseZodError(error);
  }
  throw error;
}
```

---

## Frontend Error Handling

### React Error Boundary
```tsx
// components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    Sentry.captureException(error);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
```

### API Error Handling (React Query)
```typescript
useQuery({
  queryKey: ['user', id],
  queryFn: () => apiClient.get<User>(`/v1/users/${id}`),
  retry: (failureCount, error) => {
    // Don't retry 4xx client errors
    if (error instanceof ApiError && error.status < 500) return false;
    return failureCount < 3;
  },
});
```

---

## Error Codes Reference

| Code | Status | Description |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Input failed validation |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `TOKEN_EXPIRED` | 401 | JWT has expired |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `RESOURCE_NOT_FOUND` | 404 | Entity does not exist |
| `METHOD_NOT_ALLOWED` | 405 | HTTP method not supported |
| `DUPLICATE_RESOURCE` | 409 | Unique constraint violation |
| `UNPROCESSABLE_ENTITY` | 422 | Business rule violation |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit hit |
| `INTERNAL_ERROR` | 500 | Unexpected server failure |
| `SERVICE_UNAVAILABLE` | 503 | Dependency unavailable |

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial error handling documentation |

---

## Related Documents

- [API.md](API.md) — Error response contract
- [BACKEND.md](BACKEND.md) — Error middleware implementation
- [OBSERVABILITY.md](OBSERVABILITY.md) — Error logging
- [MONITORING.md](MONITORING.md) — Error rate alerting
- [FRONTEND.md](FRONTEND.md) — Frontend error handling
