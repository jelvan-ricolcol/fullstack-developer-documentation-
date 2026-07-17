# STATE_MANAGEMENT.md — State Management

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [FRONTEND.md](FRONTEND.md) | [API.md](API.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | Client-side and server state management patterns |

---

## Overview

State is categorized into server state (data from APIs) and client state (UI, preferences, auth). Different tools are used for each to avoid mixing concerns.

---

## State Categories

| Category | Tool | Storage | Examples |
|---|---|---|---|
| Server data | React Query (TanStack) | Memory + Cache | Users, posts, orders |
| Auth state | Zustand + React Query | Memory | Current user, roles |
| UI state | useState / Zustand | Memory | Modals, drawers, tabs |
| Form state | React Hook Form | Memory | Form fields, validation |
| URL/route state | React Router | URL | Filters, pagination |
| User preferences | Zustand + localStorage | localStorage | Theme, language |

---

## Server State (React Query)

```typescript
// queries/users.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';

// Query
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.get<User[]>('/v1/users'),
    staleTime: 60_000,    // Data fresh for 1 minute
    gcTime: 300_000,      // Kept in cache for 5 minutes
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => apiClient.get<User>(`/v1/users/${id}`),
    enabled: !!id,
  });
}

// Mutation with cache invalidation
export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      apiClient.patch<User>(`/v1/users/${id}`, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['users', updated.id], updated);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

### Query Key Convention
```typescript
// Hierarchical keys enable targeted invalidation
['users']                    // All users list
['users', userId]            // Single user
['users', userId, 'posts']   // User's posts
['auth', 'me']               // Current user
```

---

## Client State (Zustand)

```typescript
// stores/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  // Don't persist accessToken (memory only for security)
  (set) => ({
    accessToken: null,
    isAuthenticated: false,
    setAccessToken: (token) => set({ accessToken: token, isAuthenticated: true }),
    clearAuth: () => set({ accessToken: null, isAuthenticated: false }),
  })
);

// UI preferences store (persisted to localStorage)
interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'light',
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'ui-preferences' }
  )
);
```

---

## Form State (React Hook Form)

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof LoginSchema>;

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    // ... submit logic
  });

  return (
    <form onSubmit={onSubmit}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      {/* ... */}
    </form>
  );
}
```

---

## URL State (React Router)

```typescript
// Use URL for state that should be shareable/bookmarkable
function UserList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');
  const search = searchParams.get('q') ?? '';

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearchParams({ q: e.target.value, page: '1' })}
      />
      {/* ... */}
    </div>
  );
}
```

---

## Anti-Patterns to Avoid

- ❌ Storing server data in Zustand (use React Query)
- ❌ Storing access tokens in localStorage (use memory only)
- ❌ Global state for UI state that is component-local (use useState)
- ❌ Mixing server and client state in the same store
- ❌ Manual loading/error state management when React Query handles it

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial state management documentation |

---

## Related Documents

- [FRONTEND.md](FRONTEND.md) — Frontend architecture
- [API.md](API.md) — API contracts consumed by queries
- [AUTHENTICATION.md](AUTHENTICATION.md) — Auth state management
- [docs/frontend/state-management.md](docs/frontend/state-management.md) — State deep dive


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
