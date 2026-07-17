# Docker

> **Back to:** [INDEX.md](../../INDEX.md) | **Related:** [DEPLOYMENT.md](../../DEPLOYMENT.md)

## Overview

Docker is used for local development environments and optional containerized deployments (not Cloudflare Workers — those are edge-native).

## Use Cases

| Use Case | Docker? |
|---|---|
| Cloudflare Workers (production) | ❌ Not needed |
| Local PostgreSQL (dev) | ✅ |
| Local development services | ✅ |
| CI testing environment | ✅ |
| Optional origin server | ✅ |

## Local Development Services

```yaml
# docker-compose.yml
version: '3.9'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: myapp
      POSTGRES_PASSWORD: local_password
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

```bash
# Start local services
docker compose up -d

# Stop local services
docker compose down
```

## Verified Sources

- Docker Docs — https://docs.docker.com/
- Docker Compose Docs — https://docs.docker.com/compose/


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
