# HTML & CSS Standards

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [FRONTEND.md](../../FRONTEND.md) | **Related:** [DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md)

## HTML Standards

- Use semantic HTML elements (`<nav>`, `<main>`, `<article>`, `<section>`, etc.)
- All images require `alt` attribute
- All form inputs require `<label>` with `for` attribute
- Use `<button>` for interactive elements, not `<div onClick>`
- Use `lang` attribute on `<html>` element

## CSS Standards

This project uses **Tailwind CSS** for styling.

```tsx
// ✅ Tailwind utility classes
<button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md">
  Save
</button>

// Use cn() utility for conditional classes
import { cn } from '@/lib/utils';
<div className={cn('base-class', { 'conditional-class': isActive })}>
```

## CSS Modules (for complex components)

```tsx
// Button.module.css
.button { /* ... */ }
.button--primary { /* ... */ }

// Button.tsx
import styles from './Button.module.css';
<button className={cn(styles.button, styles['button--primary'])}>
```

## Responsive Design

Mobile-first approach with Tailwind breakpoints:
```
sm: 640px   → Tablet portrait
md: 768px   → Tablet landscape
lg: 1024px  → Desktop
xl: 1280px  → Large desktop
2xl: 1536px → Extra large
```

## Verified Sources

- MDN HTML — https://developer.mozilla.org/en-US/docs/Web/HTML
- MDN CSS — https://developer.mozilla.org/en-US/docs/Web/CSS
- Tailwind CSS — https://tailwindcss.com/docs/
- WHATWG HTML Living Standard — https://html.spec.whatwg.org/
