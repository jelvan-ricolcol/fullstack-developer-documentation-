# Frontend State Management

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [STATE_MANAGEMENT.md](../../STATE_MANAGEMENT.md) | **Related:** [FRONTEND.md](../../FRONTEND.md)

## Overview

Frontend state management patterns. See [STATE_MANAGEMENT.md](../../STATE_MANAGEMENT.md) for the full documentation.

## Quick Reference

| State Type | Tool |
|---|---|
| Server data | React Query (TanStack) |
| Auth | Zustand |
| UI (modals, etc.) | useState or Zustand |
| Forms | React Hook Form + Zod |
| URL | React Router params |
| Preferences | Zustand + localStorage |

## React Query Key Conventions

```typescript
// Hierarchical keys enable targeted invalidation
queryClient.invalidateQueries({ queryKey: ['users'] })           // All users
queryClient.invalidateQueries({ queryKey: ['users', userId] })   // One user
queryClient.setQueryData(['users', user.id], updatedUser)        // Optimistic update
```

## Verified Sources

- TanStack Query Docs — https://tanstack.com/query/latest
- Zustand Docs — https://docs.pmnd.rs/zustand/getting-started/introduction
- React Hook Form — https://react-hook-form.com/


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
