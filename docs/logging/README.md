# Logging

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [OBSERVABILITY.md](../../OBSERVABILITY.md) | **Related:** [MONITORING.md](../../MONITORING.md)

## Overview

Logging standards for Cloudflare Workers. All log output is structured JSON.

## Log Format

```typescript
interface LogEntry {
  timestamp: string;   // ISO 8601
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  requestId?: string;
  userId?: string;
  method?: string;
  path?: string;
  status?: number;
  durationMs?: number;
  error?: { code: string; message: string; stack?: string };
}
```

## Usage

```typescript
import { log } from '../lib/logger';

log({ level: 'info', message: 'User created', userId, requestId });
log({ level: 'error', message: 'DB query failed', error: { code: 'DB_ERROR', message: err.message } });
```

## Log Levels by Environment

| Level | Local | Staging | Production |
|---|---|---|---|
| debug | ✅ | ❌ | ❌ |
| info | ✅ | ✅ | ✅ |
| warn | ✅ | ✅ | ✅ |
| error | ✅ | ✅ | ✅ |

## Shipping Logs

- Local: `console.log` output
- Staging/Production: Cloudflare Logpush → R2 or external SIEM

## Verified Sources

- Cloudflare Workers Logging — https://developers.cloudflare.com/workers/observability/logs/
- Cloudflare Logpush — https://developers.cloudflare.com/logs/
