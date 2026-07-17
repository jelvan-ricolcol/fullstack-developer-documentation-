# Messaging Platform

> **Back to:** [INDEX.md](../../INDEX.md) | **Related:** [docs/realtime/websocket.md](websocket.md) | [docs/cloudflare/queues.md](../cloudflare/queues.md)

## Overview

Messaging platform architecture combining WebSockets for realtime delivery and Queues for reliable async delivery.

## Delivery Modes

| Mode | Technology | Use Case |
|---|---|---|
| Realtime | WebSocket + Durable Objects | Chat, live presence |
| Near-realtime | Server-Sent Events (SSE) | Notifications, feeds |
| Async | Cloudflare Queues | Email, webhooks |

## Notification Delivery Flow

```
User Action → Worker → Enqueue notification
                     → Durable Object: notify connected WS clients

Queue Consumer → Process notification
              → Email/Push if user offline
```

## Server-Sent Events

```typescript
// Worker SSE endpoint
app.get('/api/v1/notifications/stream', async (c) => {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Send heartbeat every 30s
  const interval = setInterval(() => {
    writer.write(encoder.encode('event: heartbeat\ndata: {}\n\n'));
  }, 30000);

  c.req.raw.signal.addEventListener('abort', () => {
    clearInterval(interval);
    writer.close();
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
});
```

## Verified Sources

- MDN Server-Sent Events — https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
- Cloudflare Queues — https://developers.cloudflare.com/queues/
