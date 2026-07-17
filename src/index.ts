import { Router } from 'itty-router'
import { handleUpload } from './handlers/upload'
import { handleMessages } from './handlers/messages'

const router = Router()

router.get('/health', () => new Response('ok'))
router.post('/upload', async (req: Request) => {
  // @ts-ignore
  return handleUpload(req, WORKER_ENV)
})
router.post('/api/messages', async (req: Request) => {
  // @ts-ignore
  return handleMessages(req, WORKER_ENV)
})

addEventListener('fetch', (e: FetchEvent) => {
  e.respondWith(router.handle(e.request))
})
