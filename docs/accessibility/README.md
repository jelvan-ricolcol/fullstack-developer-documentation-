# Accessibility

> **Back to:** [INDEX.md](../../INDEX.md) | **Related:** [DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md) | [COMPONENT_LIBRARY.md](../../COMPONENT_LIBRARY.md)

## Overview

All UI must meet WCAG 2.1 Level AA. Accessibility is not optional.

## Requirements

- All interactive elements must be keyboard-navigable
- Color contrast ratio: 4.5:1 for normal text, 3:1 for large text
- All images must have descriptive alt text (or `alt=""` if decorative)
- All form fields must have associated labels
- Focus must be visible at all times
- Screen reader tested with NVDA (Windows) and VoiceOver (macOS/iOS)
- No content flashes more than 3 times per second (seizure prevention)

## ARIA Patterns

```tsx
// Button with icon only — must have label
<button aria-label="Close modal">×</button>

// Loading state
<button aria-busy={loading} disabled={loading}>
  {loading ? 'Saving...' : 'Save'}
</button>

// Dialog
<div role="dialog" aria-modal aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm Delete</h2>
</div>
```

## Testing Tools

- axe DevTools (browser extension)
- Playwright `a11y` plugin for automated checks
- Manual keyboard navigation testing
- NVDA + Chrome for Windows
- VoiceOver + Safari for macOS/iOS

## Verified Sources

- WCAG 2.1 — https://www.w3.org/TR/WCAG21/
- ARIA Authoring Practices — https://www.w3.org/WAI/ARIA/apg/
- axe Rules — https://dequeuniversity.com/rules/axe/


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
