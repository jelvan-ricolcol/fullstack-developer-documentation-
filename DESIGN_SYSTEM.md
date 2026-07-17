# DESIGN_SYSTEM.md — Design System

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [COMPONENT_LIBRARY.md](COMPONENT_LIBRARY.md) | [FRONTEND.md](FRONTEND.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | Design tokens, typography, color palette, spacing, and theming |

---

## Overview

The design system defines the visual language: tokens, typography, colors, spacing, and motion. All UI components use these tokens consistently via Tailwind CSS custom properties.

---

## Color Palette

### Brand Colors
```css
:root {
  --color-primary-50:  #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;  /* Primary */
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;
}
```

### Semantic Colors
```css
:root {
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error:   #ef4444;
  --color-info:    #3b82f6;

  /* Light mode */
  --color-background: #ffffff;
  --color-surface:    #f9fafb;
  --color-border:     #e5e7eb;
  --color-text:       #111827;
  --color-muted:      #6b7280;
}

[data-theme="dark"] {
  --color-background: #0f172a;
  --color-surface:    #1e293b;
  --color-border:     #334155;
  --color-text:       #f1f5f9;
  --color-muted:      #94a3b8;
}
```

---

## Typography

### Font Stack
```css
:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

### Type Scale
| Token | Size | Line Height | Use |
|---|---|---|---|
| `text-xs` | 12px | 1.5 | Labels, captions |
| `text-sm` | 14px | 1.5 | Body small |
| `text-base` | 16px | 1.5 | Body default |
| `text-lg` | 18px | 1.4 | Body large |
| `text-xl` | 20px | 1.3 | Heading 4 |
| `text-2xl` | 24px | 1.3 | Heading 3 |
| `text-3xl` | 30px | 1.2 | Heading 2 |
| `text-4xl` | 36px | 1.1 | Heading 1 |
| `text-5xl` | 48px | 1 | Display |

---

## Spacing Scale

Based on 4px base unit:

| Token | Value | Use |
|---|---|---|
| `space-1` | 4px | Micro gap |
| `space-2` | 8px | Tight gap |
| `space-3` | 12px | Small gap |
| `space-4` | 16px | Default gap |
| `space-5` | 20px | Medium gap |
| `space-6` | 24px | Section gap |
| `space-8` | 32px | Large gap |
| `space-12` | 48px | Section spacing |
| `space-16` | 64px | Layout spacing |

---

## Border Radius
| Token | Value | Use |
|---|---|---|
| `rounded-sm` | 2px | Subtle rounding |
| `rounded` | 4px | Default rounding |
| `rounded-md` | 6px | Cards, inputs |
| `rounded-lg` | 8px | Larger cards |
| `rounded-xl` | 12px | Modals |
| `rounded-full` | 9999px | Pills, avatars |

---

## Shadows
```css
:root {
  --shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1);
}
```

---

## Motion / Animation

```css
:root {
  --transition-fast:   150ms ease-in-out;
  --transition-base:   200ms ease-in-out;
  --transition-slow:   300ms ease-in-out;
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

---

## Z-Index Scale

| Token | Value | Use |
|---|---|---|
| `z-base` | 0 | Default stacking |
| `z-raised` | 10 | Dropdowns |
| `z-overlay` | 20 | Modals, drawers (backdrop) |
| `z-modal` | 30 | Modals (content) |
| `z-toast` | 40 | Toast notifications |
| `z-tooltip` | 50 | Tooltips |

---

## Tailwind Config

```typescript
// tailwind.config.ts
export default {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          500: 'var(--color-primary-500)',
          // ...
        },
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
    },
  },
};
```

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial design system documentation |

---

## Related Documents

- [COMPONENT_LIBRARY.md](COMPONENT_LIBRARY.md) — Components using these tokens
- [FRONTEND.md](FRONTEND.md) — Frontend architecture
- [CODING_STANDARDS.md](CODING_STANDARDS.md) — CSS/Tailwind conventions
