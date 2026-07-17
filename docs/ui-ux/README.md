# UI/UX Guidelines

> **Back to:** [INDEX.md](../../INDEX.md) | **Related:** [DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md) | [COMPONENT_LIBRARY.md](../../COMPONENT_LIBRARY.md)

## Overview

UI/UX principles for building consistent, user-friendly interfaces.

## Design Principles

1. **Clarity** — Users should always know where they are and what to do next
2. **Feedback** — Every action must have visible feedback (loading, success, error)
3. **Consistency** — Same patterns for same behaviors throughout the app
4. **Accessibility** — Designed for all users including those using assistive tech
5. **Responsiveness** — Works on mobile (375px) through desktop (1440px)

## Loading States

Every async operation must show a loading state:
- Button loading: spinner + disabled
- Page loading: skeleton screens (not spinners for layout elements)
- Data fetching: use React Query's `isLoading` state

## Error States

- Show error message inline, near the cause
- Always provide a recovery action (retry, go back)
- Never leave users at a dead end

## Empty States

- Empty lists must have a descriptive empty state
- Include a call-to-action when possible

## Responsive Breakpoints

| Name | Width |
|---|---|
| Mobile | 320–767px |
| Tablet | 768–1023px |
| Desktop | 1024px+ |

## Verified Sources

- Material Design Guidelines — https://m3.material.io/
- Apple HIG — https://developer.apple.com/design/human-interface-guidelines/
- Nielsen Norman Group — https://www.nngroup.com/
