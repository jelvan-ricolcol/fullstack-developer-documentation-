export async function handleMessages(request: Request, env: any) {
  try {
    const payload = await request.json()
    const id = crypto.randomUUID()
    const text = payload.body || ''
    // Parameterized insert using D1
    const prepared = env.MY_D1.prepare('INSERT INTO messages (id, user_id, body) VALUES (?, ?, ?)')
    await prepared.bind(id, payload.user_id || null, text).run()

    // Notify durable object
    const objId = env.CHAT_DO.idFromName('global-chat')
    const obj = env.CHAT_DO.get(objId)
    await obj.fetch('https://internal.local/notify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, body: text })
    })

    return new Response(JSON.stringify({ id }), { status: 201 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}
