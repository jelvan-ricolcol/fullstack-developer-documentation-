export class ChatDO implements DurableObject {
  state: DurableObjectState
  env: any
  constructor(state: DurableObjectState, env: any) {
    this.state = state
    this.env = env
  }

  async fetch(request: Request) {
    // Simple DO that keeps a list of recent messages in state
    if (request.method === 'POST') {
      const payload = await request.json()
      const messages = (await this.state.storage.get('messages')) || []
      messages.push({ id: payload.id, body: payload.body, at: Date.now() })
      await this.state.storage.put('messages', messages.slice(-50))
      return new Response(JSON.stringify({ ok: true }))
    }

    if (request.method === 'GET') {
      const messages = (await this.state.storage.get('messages')) || []
      return new Response(JSON.stringify({ messages }))
    }

    return new Response('Not found', { status: 404 })
  }
}
