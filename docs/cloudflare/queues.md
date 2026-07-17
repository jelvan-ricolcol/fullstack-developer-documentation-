# Cloudflare Queues

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [CLOUDFLARE.md](../../CLOUDFLARE.md) | **Related:** [docs/queues/README.md](../queues/README.md)

## Overview

Cloudflare Queues provide reliable, at-least-once message delivery for async background processing.

## Setup

```toml
[[queues.producers]]
queue = "background-jobs"
binding = "QUEUE"

[[queues.consumers]]
queue = "background-jobs"
max_batch_size = 10
max_batch_timeout = 30
max_retries = 3
dead_letter_queue = "background-jobs-dlq"
```

## Producer (send message)

```typescript
await env.QUEUE.send({
  type: 'send-welcome-email',
  userId,
  email,
});
// Returns 202 Accepted to client
```

## Consumer (process messages)

```typescript
export default {
  async queue(batch: MessageBatch<JobMessage>, env: Env): Promise<void> {
    for (const msg of batch.messages) {
      try {
        await handleJob(msg.body, env);
        msg.ack();
      } catch (error) {
        msg.retry({ delaySeconds: 30 });
      }
    }
  },
};
```

## Verified Sources

- Cloudflare Queues Docs — https://developers.cloudflare.com/queues/
