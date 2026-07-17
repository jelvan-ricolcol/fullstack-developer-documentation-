# COMPONENT_LIBRARY.md — UI Component Library

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | [FRONTEND.md](FRONTEND.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | UI component system, primitive and composite components |

---

## Overview

The component library contains all shared, reusable UI components. Components are built on top of the design system tokens and follow accessibility, composability, and consistency principles.

---

## Component Architecture

```
components/
├── primitives/         # Atomic, unstyled or minimally styled
│   ├── Button/
│   ├── Input/
│   ├── Label/
│   ├── Select/
│   ├── Checkbox/
│   ├── RadioGroup/
│   ├── Switch/
│   └── Textarea/
├── layout/             # Page structure
│   ├── Container/
│   ├── Grid/
│   ├── Stack/
│   └── Divider/
├── feedback/           # User feedback
│   ├── Alert/
│   ├── Toast/
│   ├── Spinner/
│   └── Skeleton/
├── overlay/            # Floating elements
│   ├── Modal/
│   ├── Drawer/
│   ├── Popover/
│   └── Tooltip/
├── navigation/         # Navigation elements
│   ├── Breadcrumb/
│   ├── Tabs/
│   ├── Pagination/
│   └── Sidebar/
└── data-display/       # Data presentation
    ├── Table/
    ├── Card/
    ├── Badge/
    └── Avatar/
```

---

## Component Standards

Every component must:
1. Accept and forward `className` for style overrides
2. Forward `ref` where applicable
3. Support keyboard navigation
4. Have ARIA roles/labels for accessibility
5. Have a `data-testid` prop for testing
6. Be exported from the `components/index.ts` barrel file
7. Have a corresponding test file

---

## Button Component

```tsx
// components/primitives/Button/Button.tsx
import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', loading, disabled, children, className, ...props },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading && <Spinner size="sm" aria-hidden />}
      {children}
    </button>
  )
);
Button.displayName = 'Button';
```

---

## Modal Component

```tsx
// components/overlay/Modal/Modal.tsx
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Focus management
  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  // Keyboard close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!open) return null;

  return createPortal(
    <div role="dialog" aria-modal aria-labelledby="modal-title">
      <div className="overlay" onClick={onClose} aria-hidden />
      <div ref={ref} tabIndex={-1} className="modal-content">
        <h2 id="modal-title">{title}</h2>
        {children}
        <button onClick={onClose} aria-label="Close modal">×</button>
      </div>
    </div>,
    document.body
  );
}
```

---

## Component Catalog

| Component | Status | Accessibility | Notes |
|---|---|---|---|
| Button | ✅ | ARIA busy, disabled | Variants: primary, secondary, ghost, destructive |
| Input | ✅ | ARIA required, invalid | Controlled + uncontrolled |
| Select | ✅ | Native select | Use for simple dropdowns |
| Checkbox | ✅ | ARIA checked | Group support |
| Modal | ✅ | focus-trap, role=dialog | Portal-based |
| Toast | ✅ | role=alert | Auto-dismiss |
| Spinner | ✅ | aria-hidden or aria-label | size: sm, md, lg |
| Table | ✅ | thead/tbody, scope | Sortable, selectable |
| Tabs | ✅ | role=tablist | Keyboard navigation |
| Tooltip | ✅ | role=tooltip | Hover + focus |
| Skeleton | ✅ | aria-hidden | Loading state |
| Avatar | ✅ | alt text required | Image + initials fallback |
| Badge | ✅ | — | Status, count variants |
| Pagination | ✅ | aria-label on pages | Cursor-based |

---

## Storybook (Planned)

Component documentation and interactive playground planned via Storybook:
```bash
npm run storybook
```

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial component library documentation |

---

## Related Documents

- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — Design tokens and theming
- [FRONTEND.md](FRONTEND.md) — Frontend architecture
- [TESTING.md](TESTING.md) — Component testing
- [CODING_STANDARDS.md](CODING_STANDARDS.md) — Component code conventions
