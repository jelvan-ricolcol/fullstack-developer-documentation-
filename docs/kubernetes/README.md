# Kubernetes

> **Back to:** [INDEX.md](../../INDEX.md) | **Related:** [DEPLOYMENT.md](../../DEPLOYMENT.md) | [DOCKER](README.md)

## Overview

Kubernetes is **not** used for the primary Cloudflare-based deployment. This document covers Kubernetes as an optional deployment target for origin services or self-hosted components.

## When to Use Kubernetes

| Scenario | Use K8s? |
|---|---|
| Primary API (Cloudflare Workers) | ❌ Not applicable |
| Origin fallback server | ✅ Optional |
| Internal tooling | ✅ Optional |
| Complex microservices | ✅ When needed |

## Basic Deployment Example

```yaml
# deployment.yaml (for origin services only)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-origin-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: my-origin-service
  template:
    spec:
      containers:
        - name: api
          image: my-api:latest
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: url
```

## Verified Sources

- Kubernetes Docs — https://kubernetes.io/docs/
- Kubernetes Security — https://kubernetes.io/docs/concepts/security/
