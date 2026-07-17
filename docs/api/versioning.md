# API Versioning

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [API.md](../../API.md)

## Overview

API versioning strategy. See [API.md](../../API.md) for the full versioning policy.

## Strategy: URI Path Versioning

```
/api/v1/users    ← Current version
/api/v2/users    ← New version (breaking change)
```

## Version Policy

- **Minor/patch changes** (new fields, new optional params): no version bump
- **Breaking changes** (removed fields, changed types, removed endpoints): new version
- **Deprecation period:** 6 months minimum with `Deprecation` response header

## Deprecation Headers

```http
HTTP/1.1 200 OK
Deprecation: true
Sunset: Sat, 01 Jan 2027 00:00:00 GMT
Link: <https://api.{domain}/v2/users>; rel="successor-version"
```

## Migration Guide

When a new version is released:
1. Update [API.md](../../API.md) with new endpoints
2. Update [CHANGELOG.md](../../CHANGELOG.md) with breaking changes
3. Notify API consumers via response headers
4. Keep old version running for deprecation period
5. Remove old version after sunset date

## Verified Sources

- API Versioning Best Practices — https://www.mnot.net/blog/2012/12/04/api-evolution
- HTTP Deprecation Header (RFC 8594) — https://www.rfc-editor.org/rfc/rfc8594


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
