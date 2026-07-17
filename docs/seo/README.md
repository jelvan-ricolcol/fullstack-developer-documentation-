# SEO

> **Back to:** [INDEX.md](../../INDEX.md) | **Related:** [FRONTEND.md](../../FRONTEND.md) | [PERFORMANCE.md](../../PERFORMANCE.md)

## Overview

SEO considerations for the Cloudflare Pages + React SPA deployment.

## SPA SEO Challenge

React SPAs are client-rendered. Search engines may not index client-rendered content reliably.

**Options:**
1. **Prerendering** — Generate static HTML at build time (Vite SSG)
2. **SSR via Workers** — Render React on the edge with Worker + Pages Functions
3. **Static pages for landing** — Serve pre-rendered HTML for marketing pages

## Meta Tags

```tsx
// Use react-helmet-async or @tanstack/react-router meta
<head>
  <title>{pageTitle} | My App</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage} />
  <link rel="canonical" href={canonicalUrl} />
</head>
```

## Performance & SEO

Core Web Vitals directly affect Google ranking. Target:
- LCP ≤ 2.5s
- INP ≤ 200ms
- CLS ≤ 0.1

See [PERFORMANCE.md](../../PERFORMANCE.md).

## robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Sitemap: https://{domain}/sitemap.xml
```

## Verified Sources

- Google Search Central — https://developers.google.com/search
- Web Vitals — https://web.dev/vitals/
- Schema.org — https://schema.org/
