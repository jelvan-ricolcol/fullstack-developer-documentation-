# Queues

> **Back to:** [INDEX.md](../../INDEX.md) | **Related:** [CLOUDFLARE.md](../../CLOUDFLARE.md) | [BACKEND.md](../../BACKEND.md)

## Overview

Cloudflare Queues provide reliable, at-least-once message delivery for background jobs.

## Use Cases

- Sending transactional emails
- Webhook delivery
- Image/file processing after upload
- Scheduled notifications
- Analytics event batching

## Queue Producer Pattern

```typescript
// Enqueue a job from API handler
await env.QUEUE.send({
  type: 'send-welcome-email',
  userId,
  email: user.email,
});

// Return 202 Accepted immediately
return new Response(null, { status: 202 });
```

## Queue Consumer Pattern

```typescript
export default {
  async queue(batch: MessageBatch<QueueMessage>, env: Env): Promise<void> {
    for (const message of batch.messages) {
      try {
        await processMessage(message.body, env);
        message.ack();
      } catch (error) {
        console.error('Queue processing failed:', error);
        // Retry with exponential backoff
        message.retry({ delaySeconds: Math.min(2 ** message.attempts * 10, 3600) });
      }
    }
  },
};
```

## Idempotency

Queue delivers messages **at-least-once**. Consumers must be idempotent:

```typescript
// Check if already processed before acting
const alreadyProcessed = await env.KV.get(`processed:${message.id}`);
if (alreadyProcessed) {
  message.ack();
  return;
}
// ... process
await env.KV.put(`processed:${message.id}`, '1', { expirationTtl: 86400 });
```

## Limitations

- Max message size: 128KB (store large payloads in R2)
- At-least-once delivery (duplicates possible)
- No native dead-letter queue (implement manually with D1)

## Verified Sources

- Cloudflare Queues Docs — https://developers.cloudflare.com/queues/


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
