import { describe, it, expect } from 'vitest'
import { handleMessages } from '../src/handlers/messages'

it('parses message payload and returns 201 when missing env', async () => {
  const req = new Request('https://example.test/api/messages', { method: 'POST', body: JSON.stringify({ body: 'hi' }) })
  // call handler with minimal env stub
  const res = await handleMessages(req, { MY_D1: { prepare: () => ({ bind: () => ({ run: async () => {} }) }) }, CHAT_DO: { idFromName: () => ({ toString: () => 'id' }), get: () => ({ fetch: async () => {} }) } })
  expect(res.status).toBe(201)
})
