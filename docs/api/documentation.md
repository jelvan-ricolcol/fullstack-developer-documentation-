# API Documentation Standards

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [API.md](../../API.md)

## Overview

Standards for writing and maintaining API documentation.

## Documentation Requirements

Every API endpoint must document:
- HTTP method and URL
- Authentication requirements
- Request body schema (with Zod schema or TypeScript type)
- Response schema
- Error codes that can be returned
- Example request and response

## OpenAPI Specification

The API should be documented in OpenAPI 3.1 format:

```yaml
# docs/api/openapi.yaml (planned)
openapi: '3.1.0'
info:
  title: My API
  version: '1.0.0'
paths:
  /api/v1/users/{id}:
    get:
      summary: Get user by ID
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      responses:
        '200':
          description: User found
        '404':
          description: User not found
```

## Versioning Documentation

See [docs/api/versioning.md](versioning.md).

## Verified Sources

- OpenAPI 3.1 Spec — https://spec.openapis.org/oas/v3.1.0
- Swagger UI — https://swagger.io/tools/swagger-ui/
