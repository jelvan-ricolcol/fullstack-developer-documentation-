# WebSocket

> **Back to:** [INDEX.md](../../INDEX.md) | **Related:** [docs/realtime/cloudflare-durable-object-realtime.md](cloudflare-durable-object-realtime.md)

## Overview

WebSocket patterns for real-time communication. In Cloudflare Workers, WebSocket connections require Durable Objects for stateful management.

## WebSocket via Durable Objects

```typescript
// In a Durable Object class
async fetch(request: Request): Promise<Response> {
  const upgradeHeader = request.headers.get('Upgrade');
  if (upgradeHeader !== 'websocket') {
    return new Response('Expected WebSocket', { status: 426 });
  }

  const { 0: client, 1: server } = new WebSocketPair();
  server.accept();

  server.addEventListener('message', (event) => {
    // Broadcast or process message
    const data = JSON.parse(event.data as string);
    this.broadcast(data);
  });

  server.addEventListener('close', () => {
    this.connections.delete(server);
  });

  this.connections.add(server);

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}
```

## Client-Side Connection

```typescript
const ws = new WebSocket('wss://api.{domain}/ws/room-123');

ws.addEventListener('open', () => {
  ws.send(JSON.stringify({ type: 'join', userId }));
});

ws.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  handleMessage(message);
});

ws.addEventListener('close', (event) => {
  // Reconnect with exponential backoff
  setTimeout(() => reconnect(), Math.min(reconnectAttempts * 1000, 30000));
});
```

## Verified Sources

- Cloudflare WebSockets — https://developers.cloudflare.com/workers/examples/websockets/
- MDN WebSocket API — https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
- RFC 6455 (WebSocket) — https://www.rfc-editor.org/rfc/rfc6455
