# AWS Cloud Services

> **Back to:** [INDEX.md](../../INDEX.md) | **Related:** [CLOUDFLARE.md](../../CLOUDFLARE.md) | [DEPLOYMENT.md](../../DEPLOYMENT.md)

## Overview

AWS services used as optional components alongside Cloudflare.

## Services Reference

| Service | CF Equivalent | Use When |
|---|---|---|
| Lambda | Workers | Node.js-specific code, longer CPU |
| S3 | R2 | Existing AWS ecosystem, S3 SDK |
| SES | Resend | High-volume email, existing AWS account |
| CloudFront | Cloudflare CDN | AWS-native deployments |
| RDS/Aurora | Hyperdrive + PostgreSQL | Advanced SQL features |

## Email via SES

```typescript
// Using SES for transactional email
const response = await fetch(`https://email.${region}.amazonaws.com/v2/email/outbound-emails`, {
  method: 'POST',
  headers: {
    'X-Amz-Date': amzDate,
    Authorization: awsSignature,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    FromEmailAddress: env.EMAIL_FROM,
    Destination: { ToAddresses: [to] },
    Content: { Simple: { Subject: { Data: subject }, Body: { Html: { Data: html } } } },
  }),
});
```

## Verified Sources

- AWS Documentation — https://docs.aws.amazon.com/
- AWS SES Docs — https://docs.aws.amazon.com/ses/


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
