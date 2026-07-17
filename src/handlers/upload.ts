export async function handleUpload(request: Request, env: any) {
  try {
    const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2,8)}`
    const body = await request.arrayBuffer()
    // write to R2
    await env.MY_R2.put(key, body)
    const publicUrl = `https://${env.ACCOUNT_ID || '<account_id>'}.r2.cloudflarestorage.com/${env.MY_R2_BUCKET || 'MY_R2_BUCKET'}/${key}`
    return new Response(JSON.stringify({ key, url: publicUrl }), { status: 201 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}
