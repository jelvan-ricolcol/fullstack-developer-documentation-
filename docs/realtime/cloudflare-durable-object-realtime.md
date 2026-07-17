# Cloudflare Durable Object Realtime

> **Back to:** [INDEX.md](../../INDEX.md) | **Related:** [docs/cloudflare/durable-objects.md](../cloudflare/durable-objects.md) | [docs/realtime/websocket.md](websocket.md)

## Overview

Real-time features using Cloudflare Durable Objects for stateful WebSocket management.

## Architecture

```
Client ──WebSocket──► Worker ──► Durable Object (ChatRoom)
                                    │
                               [All WS connections]
                               [DO Storage for history]
```

## Chat Room Pattern

```typescript
export class ChatRoom implements DurableObject {
  private sessions: Map<string, WebSocket> = new Map();

  constructor(
    private state: DurableObjectState,
    private env: Env
  ) {}

  async fetch(request: Request): Promise<Response> {
    const { 0: client, 1: server } = new WebSocketPair();
    const sessionId = crypto.randomUUID();

    server.accept();
    this.sessions.set(sessionId, server);

    server.addEventListener('message', (event) => {
      this.broadcast(sessionId, event.data as string);
    });

    server.addEventListener('close', () => {
      this.sessions.delete(sessionId);
    });

    return new Response(null, { status: 101, webSocket: client });
  }

  private broadcast(senderSessionId: string, data: string): void {
    for (const [id, ws] of this.sessions) {
      if (id !== senderSessionId) {
        ws.send(data);
      }
    }
  }
}
```

## Verified Sources

- Cloudflare Durable Objects — https://developers.cloudflare.com/durable-objects/
- Cloudflare Realtime Example — https://developers.cloudflare.com/durable-objects/examples/websocket-hibernation-server/
