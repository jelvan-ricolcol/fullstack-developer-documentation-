# Cloudflare Durable Objects

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [CLOUDFLARE.md](../../CLOUDFLARE.md)

## Overview

Durable Objects provide strongly-consistent, stateful compute. Each DO instance is a single actor globally.

## Use Cases

- WebSocket chat rooms
- User presence/online status
- Collaborative document editing
- Rate limiting with strong consistency
- Game state management

## Key Facts

| Property | Value |
|---|---|
| Consistency | Strong (single-writer) |
| Location | Single region (by default) |
| Storage | DO Storage API (durable) |
| Binding | `env.DO` |

## Basic Pattern

```typescript
export class ChatRoom implements DurableObject {
  private connections: Set<WebSocket> = new Set();

  constructor(
    private readonly state: DurableObjectState,
    private readonly env: Env
  ) {}

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') === 'websocket') {
      const { 0: client, 1: server } = new WebSocketPair();
      server.accept();
      this.connections.add(server);

      server.addEventListener('message', (event) => {
        // Broadcast to all connections
        for (const conn of this.connections) {
          conn.send(event.data);
        }
      });

      server.addEventListener('close', () => {
        this.connections.delete(server);
      });

      return new Response(null, { status: 101, webSocket: client });
    }
    return new Response('Not WebSocket', { status: 400 });
  }
}
```

## Access from Worker

```typescript
// Get DO instance by name
const id = env.DO.idFromName('chat-room-general');
const stub = env.DO.get(id);
const response = await stub.fetch(request);
```

## Limitations

- Single-region by default (latency for global users)
- Billed per request + storage
- Not suitable for high-frequency short-lived operations

## Verified Sources

- Cloudflare Durable Objects Docs — https://developers.cloudflare.com/durable-objects/


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
