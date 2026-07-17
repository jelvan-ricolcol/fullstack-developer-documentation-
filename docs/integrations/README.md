# Third-Party Integrations

> **Back to:** [INDEX.md](../../INDEX.md) | **Related:** [SERVICE_REGISTRY.md](../../SERVICE_REGISTRY.md) | [ENVIRONMENT_VARIABLES.md](../../ENVIRONMENT_VARIABLES.md)

## Overview

This document covers third-party service integrations. For service contracts and SLAs, see [SERVICE_REGISTRY.md](../../SERVICE_REGISTRY.md).

## Active Integrations

| Service | Purpose | Auth |
|---|---|---|
| Google OAuth | Social login | Client ID + Secret |
| GitHub OAuth | Developer login | Client ID + Secret |
| Resend / SES | Transactional email | API Key |
| Stripe | Payments | Secret Key + Webhook Secret |
| Sentry | Error tracking | DSN |
| Cloudflare Turnstile | Bot protection | Site Key + Secret |

## Adding a New Integration

1. Evaluate necessity — avoid unnecessary dependencies
2. Review service SLA and privacy policy
3. Store credentials in Cloudflare Secrets (never code)
4. Document in [SERVICE_REGISTRY.md](../../SERVICE_REGISTRY.md)
5. Add environment variables to [ENVIRONMENT_VARIABLES.md](../../ENVIRONMENT_VARIABLES.md)
6. Implement error handling for service unavailability
7. Update [CHANGELOG.md](../../CHANGELOG.md)

## Integration Pattern

```typescript
// Wrap external calls with error handling
async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `****** env.EMAIL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: env.EMAIL_FROM, to, subject, html }),
  });
  if (!response.ok) {
    throw new Error(`Email send failed: ${response.status}`);
  }
}
```

## Verified Sources

- Resend Docs — https://resend.com/docs
- Stripe Docs — https://stripe.com/docs
- Sentry Cloudflare — https://docs.sentry.io/platforms/javascript/guides/cloudflare/


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
