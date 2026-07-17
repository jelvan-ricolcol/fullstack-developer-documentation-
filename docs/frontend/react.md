# React Patterns

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [FRONTEND.md](../../FRONTEND.md)

## Overview

React patterns used in this project.

## Component Patterns

```tsx
// Functional component with forwardRef
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => (
    <div>
      <label htmlFor={props.id}>{label}</label>
      <input ref={ref} aria-invalid={!!error} {...props} />
      {error && <span role="alert">{error}</span>}
    </div>
  )
);
Input.displayName = 'Input';
```

## Hook Patterns

```typescript
// Custom data-fetching hook
function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => apiClient.get<User>(`/v1/users/${id}`),
    enabled: !!id,
  });
}

// Custom mutation hook
function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserInput) => apiClient.patch('/v1/users/me', data),
    onSuccess: (user) => {
      queryClient.setQueryData(['users', user.id], user);
    },
  });
}
```

## Error Boundary

```tsx
// Wrap each route in an error boundary
<ErrorBoundary fallback={<ErrorPage />}>
  <Suspense fallback={<PageSkeleton />}>
    <Dashboard />
  </Suspense>
</ErrorBoundary>
```

## Verified Sources

- React Docs — https://react.dev/
- TanStack Query — https://tanstack.com/query/latest
