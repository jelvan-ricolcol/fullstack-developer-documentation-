# AI Prompt Library

> **Back to:** [INDEX.md](../../INDEX.md) | **Related:** [AI_CONTEXT.md](../../AI_CONTEXT.md) | [AI_POLICY.md](../../AI_POLICY.md)

## Overview

This directory contains reusable prompts for AI-assisted development tasks. Prompts are designed to produce production-ready, documentation-compliant output.

## System Prompt (For AI Assistants)

Use this as a system prompt when working on this repository:

```
You are working on the jelvan-ricolcol/fullstack-developer-documentation- repository.

Before making any changes:
1. Read AI_CONTEXT.md for project state and architecture
2. Check AI_REFERENCE.md for quick lookup
3. Read KNOWN_LIMITATIONS.md to avoid hitting platform limits
4. Follow CODING_STANDARDS.md for code conventions
5. Update all affected documentation after any change
6. Never commit secrets
7. Always validate input with Zod
8. Use parameterized D1 queries
9. Check INDEX.md to find where to document your changes
```

## Task Prompts

### Create a new API endpoint
```
Create a new REST endpoint at GET /api/v1/{resource}. 
- Follow the patterns in BACKEND.md
- Add auth middleware (authMiddleware)
- Add authorization check (authorize function)
- Validate query params with Zod
- Add to API.md endpoint registry
- Add to FEATURE_REGISTRY.md
```

### Add a database table
```
Add a new D1 table for {entity}.
- Follow DATABASE.md schema conventions (snake_case, CUID2 ids, ISO timestamps)
- Create migration file in migrations/
- Add to DATA_DICTIONARY.md
- Add repository class following BACKEND.md patterns
```

### Create a React component
```
Create a new React component {ComponentName}.
- Follow COMPONENT_LIBRARY.md standards
- Use DESIGN_SYSTEM.md tokens
- Add ARIA attributes for accessibility
- Write unit test with React Testing Library
- Export from components/index.ts
```

## Verified Sources

- Anthropic Prompt Library — https://docs.anthropic.com/
- OpenAI Prompt Engineering — https://platform.openai.com/docs/guides/prompt-engineering
