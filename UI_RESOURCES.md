# UI_RESOURCES.md — UI Design Resources and Delivery Guide

> **Back to:** [INDEX.md](INDEX.md) | **Related:** [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | [COMPONENT_LIBRARY.md](COMPONENT_LIBRARY.md) | [FRONTEND.md](FRONTEND.md) | [DEPLOYMENT.md](DEPLOYMENT.md)

---

## Metadata

| Field | Value |
|---|---|
| **Version** | 1.0.0 |
| **Owner** | @jelvan-ricolcol |
| **Last Updated** | 2026-07-17 |
| **Status** | Active |
| **Scope** | UI assets, design inputs, AI probing, email HTML, serverless, and automation delivery |

---

## Overview

This document centralizes the free, production-appropriate resources and decision policies used to design and ship web apps, websites, dashboards, HTML emails, serverless flows, and automation-enabled products across desktop, tablet, mobile, and responsive surfaces.

Use this page before designing a new product or feature. It defines what to gather, which assets are allowed, what to build, and how UI decisions connect to backend, deployment, and GitHub workflow requirements.

---

## Supported Delivery Surfaces

| Surface | Primary Goal | Required Outputs |
|---|---|---|
| Marketing website | Convert visitors | Responsive layouts, CTA sections, analytics events, SEO metadata |
| Product web app | Complete user tasks | App shell, authenticated flows, empty/loading/error states |
| Admin dashboard | Operate system safely | Dense data views, permissions-aware actions, audit-friendly UX |
| Mobile web / PWA | Fast task completion | Touch targets, reduced payload, offline-aware behavior |
| Transactional email | Confirm or prompt action | HTML email template, plain-text fallback, tracked links |
| Serverless workflow UI | Trigger or observe automation | Job status UI, retry state, webhook or queue observability |
| Automation console | Configure recurring tasks | Schedules, rules, logs, failure notifications |

---

## Approved Free UI Resource Catalog

All external assets must allow commercial use and redistribution appropriate to the product. Record the exact license and source URL in the consuming feature documentation.

### SVG Icons

| Resource | Best Use | Notes |
|---|---|---|
| [Lucide](https://lucide.dev/) | Product UI, dashboards, apps | Clean open-source icon set with React support |
| [Heroicons](https://heroicons.com/) | SaaS apps, admin interfaces | Works well with Tailwind-driven systems |
| [Tabler Icons](https://tabler.io/icons) | Dense products, settings, data tools | Broad icon coverage |
| [Phosphor Icons](https://phosphoricons.com/) | Marketing + product hybrid styles | Multiple visual weights |
| [Simple Icons](https://simpleicons.org/) | Brand/logo references | Use only for approved brand usage |

### Fonts

| Resource | Best Use | Notes |
|---|---|---|
| [Inter](https://fonts.google.com/specimen/Inter) | Default UI font | Excellent readability across devices |
| [Manrope](https://fonts.google.com/specimen/Manrope) | Modern marketing pages | Strong headings |
| [Public Sans](https://fonts.google.com/specimen/Public+Sans) | Accessibility-focused products | Neutral, highly readable |
| [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) | Product + landing page blend | Friendly without losing clarity |
| [IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) | Technical apps | Balanced with data-heavy interfaces |
| [JetBrains Mono](https://www.jetbrains.com/lp/mono/) | Code, logs, terminal surfaces | Use only where monospacing improves clarity |

### Illustrations and Visual Systems

| Resource | Best Use | Notes |
|---|---|---|
| [unDraw](https://undraw.co/illustrations) | Empty states, onboarding, marketing | Free customizable SVG illustrations |
| [Storyset](https://storyset.com/) | Landing pages, feature explainers | Multiple styles and edit options |
| [Humaaans](https://www.humaaans.com/) | Editorial/product storytelling | Good for modular hero scenes |
| [Open Doodles](https://www.opendoodles.com/) | Friendly onboarding and support pages | Informal visual tone |

### UI Kits and Inspiration

| Resource | Best Use | Notes |
|---|---|---|
| [Figma Community](https://www.figma.com/community) | Free wireframes and UI starters | Verify license per file |
| [Flowbite](https://flowbite.com/) | Tailwind-aligned component inspiration | Good for dashboards and forms |
| [DaisyUI](https://daisyui.com/) | Rapid prototyping | Use as reference, not as a substitute for design policy |
| [Can I Email](https://www.caniemail.com/) | Email HTML support checks | Required before shipping new email patterns |

---

## Cross-Device Design Matrix

| Surface | Target Width | Primary Layout Pattern | Key Rules |
|---|---|---|---|
| Small mobile | 320–374px | Single-column stack | 16px minimum body text, 44px touch targets |
| Standard mobile | 375–767px | Single-column stack with sticky primary action | Prioritize task completion above decoration |
| Tablet | 768–1023px | Split layout or 8-column grid | Preserve tap comfort and reduce side-panel density |
| Desktop | 1024–1439px | 12-column grid | Use progressive disclosure for secondary actions |
| Large desktop | 1440px+ | Centered content with max width | Avoid uncontrolled line length and stretched cards |
| HTML email | 320–600px effective | Table-based single column | Inline CSS, conservative spacing, image fallbacks |

---

## UI Structure Policy

Every feature design must define the following structure before implementation:

1. **Page shell** — header, navigation, content frame, footer or utility tray.
2. **Primary workflow** — the main user action and the success condition.
3. **Support states** — loading, empty, error, success, locked, and offline variants.
4. **Component inventory** — primitives, composite blocks, and any new design tokens.
5. **Content hierarchy** — title, summary, body, metadata, action zones, help text.
6. **Accessibility controls** — keyboard flow, focus order, contrast, labels, announcements.
7. **Analytics hooks** — CTA clicks, submissions, failures, retention events.
8. **Deployment dependency** — API, queue, cron, webhook, email, or third-party integration.

### Component Alignment Rules

| Area | Policy |
|---|---|
| Tokens | Use [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) tokens first; add new ones only when repeated need is proven |
| Components | Reuse shared primitives before creating feature-specific UI |
| Copy | UI text must state action, outcome, or constraint directly |
| Accessibility | WCAG 2.1 AA minimum |
| State design | Every async action has idle, loading, success, and failure states |
| Responsiveness | Layout must be reviewed at mobile, tablet, and desktop widths |
| Security | Never expose secrets, internal IDs, or privileged controls without authorization checks |

---

## AI Discovery Questionnaire

Use these probing questions before generating UI, backend, or deployment plans.

| Category | Questions to Answer |
|---|---|
| Product type | Is this a marketing site, SaaS app, admin portal, mobile-first tool, email flow, automation console, or mixed platform? |
| Users | Who are the primary users, what is their role, and what task must become easier or faster? |
| Core workflow | What is the single most important action? What does success look like? |
| Content | What text, media, forms, tables, charts, or documents must appear? |
| Brand | Which colors, tone, icon style, and typography are required or preferred? |
| Devices | Which device is primary, and which views must be optimized second? |
| Accessibility | What assistive needs, localization, reduced motion, or readability constraints apply? |
| Data | Which entities, API calls, uploads, filters, or real-time updates are required? |
| Integrations | Does the product send email, call third-party APIs, use payments, maps, AI, or auth providers? |
| Serverless | Which actions should trigger Workers, Queues, Durable Objects, cron jobs, or webhooks? |
| Automation | What can be scheduled, retried, approved, escalated, or summarized automatically? |
| Deployment | Is the target Cloudflare Pages, Workers, static hosting, email platform, or mixed infrastructure? |

### Output Mapping

| If answers indicate... | Create... |
|---|---|
| Acquisition or brand storytelling | Landing page system, lead capture forms, SEO pages |
| Repeated authenticated workflows | Product app shell, protected routes, dashboard patterns |
| Frequent operational actions | Admin console, permission-aware table and detail views |
| Triggered notifications | Transactional HTML email templates and event pipeline |
| Event-driven backend tasks | Queue-backed serverless workflow and status UI |
| Scheduled rules or no-code actions | Automation builder, logs, retry, and audit surfaces |

---

## HTML Email Design Creator Option

HTML email support is required whenever the product sends onboarding, verification, alerting, billing, or lifecycle messaging.

### Email Template Policy

| Requirement | Standard |
|---|---|
| Layout | Table-based, 600px max content width |
| Styling | Inline CSS only for critical rendering |
| Typography | Use safe fallbacks: `Arial, Helvetica, sans-serif` |
| Content | One primary CTA per email |
| Accessibility | Meaningful preheader, alt text, readable contrast |
| Compatibility | Validate against [Can I Email](https://www.caniemail.com/) before shipping |
| Deliverability | Include plain-text fallback, unsubscribe or preference link when required |

### Recommended Free Email Tooling

| Tool | Purpose | Notes |
|---|---|---|
| [MJML](https://mjml.io/) | Responsive email authoring | Strong default compatibility |
| [Maizzle](https://maizzle.com/) | HTML email framework | Useful for larger email systems |
| [Can I Email](https://www.caniemail.com/) | Feature compatibility testing | Required reference |
| [Email Markup Consortium](https://emailmarkup.org/) | Email HTML standards guidance | Good for interoperability checks |

---

## Serverless and Automation Alignment

UI planning must include the backend execution model so the designed surface matches how the system is deployed.

| Capability | Recommended Platform Pattern | UI Requirement |
|---|---|---|
| Public website + forms | Cloudflare Pages + Worker API | Fast forms, bot protection, success/error states |
| Product API | Cloudflare Workers | Auth-aware API feedback and optimistic UI only where safe |
| Async job processing | Cloudflare Queues + Worker consumers | Job status, retries, audit trail |
| Realtime collaboration | Durable Objects | Presence, conflict handling, reconnection states |
| Scheduled automation | Cron triggers / scheduled Workers | Schedule editor, last-run status, failure alerting |
| Email sending | Worker + email provider | Template preview, send status, bounce/error visibility |
| GitHub automation | GitHub Actions | Deployment status, preview links, rollback notes |

---

## End-to-End Delivery Checklist

1. Define the product surface and primary user workflow.
2. Choose asset sources for icons, fonts, illustrations, and layout inspiration.
3. Confirm responsive behavior for mobile, tablet, desktop, and email if applicable.
4. Map screens to components, design tokens, and accessibility requirements.
5. Map UI actions to API endpoints, queues, realtime state, or scheduled jobs.
6. Define required emails, webhooks, automations, and serverless triggers.
7. Document deployment target, GitHub workflow, rollback path, and observability hooks.
8. Update related docs: frontend, backend, deployment, GitHub, and feature registry when scope expands.

---

## Verified Sources

- Google Fonts — https://fonts.google.com/
- Lucide — https://lucide.dev/
- Heroicons — https://heroicons.com/
- Tabler Icons — https://tabler.io/icons
- Phosphor Icons — https://phosphoricons.com/
- Simple Icons — https://simpleicons.org/
- Figma Community — https://www.figma.com/community
- Can I Email — https://www.caniemail.com/
- MJML — https://mjml.io/
- Maizzle — https://maizzle.com/
- Cloudflare Workers Docs — https://developers.cloudflare.com/workers/
- GitHub Actions Docs — https://docs.github.com/actions

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-17 | Initial UI design resources and delivery guide |

---

## Related Documents

- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — Tokens, typography, and visual language
- [COMPONENT_LIBRARY.md](COMPONENT_LIBRARY.md) — Shared components and interaction standards
- [FRONTEND.md](FRONTEND.md) — Frontend architecture and delivery patterns
- [BACKEND.md](BACKEND.md) — Backend and API integration patterns
- [DEPLOYMENT.md](DEPLOYMENT.md) — Deployment runbooks and environments
- [GITHUB.md](GITHUB.md) — GitHub workflows and governance
