# Cloudflare Workers
## 1. Overview
- What it is
  Cloudflare Workers is a serverless platform that runs JavaScript/TypeScript at Cloudflare’s edge network. Workers allow you to run application logic in response to HTTP requests with minimal cold-start and high global performance.
- Why it is used
  Used for building APIs, edge caching, authentication gateways, image transformation, and realtime/lightweight backend services close to users to reduce latency.
- When to use it
  Use Workers when you need low-latency responses globally, want to offload simple to moderate compute to the edge, or when you need to implement dynamic behavior at the CDN layer.
- Production use cases
  - Global REST or GraphQL APIs with low-latency reads
  - Image optimization and manipulation at edge
  - Realtime messaging glue using Durable Objects
  - Background processing with Queues
  - File upload endpoints backed by R2
  - Edge caching and A/B testing

## 2. Architecture
- System design
  Workers run stateless code on edge nodes. For stateful or long-lived state, integrate with D1 (SQL), R2 (object storage), KV (key-value store), Durable Objects (single-instance per object), and Queues for background jobs.
- Data flow
  1. Client sends HTTP request to Cloudflare-managed domain.
  2. Request hits nearest edge node and executes Worker.
  3. Worker may read/write KV, D1, R2, or forward to origin services.
  4. Worker responds immediately or enqueues background job.
- Components
  - Worker scripts (TypeScript/JavaScript)
  - Wrangler (CLI) for development and deployment
  - D1: SQLite-compatible SQL database for Cloudflare
  - R2: S3-compatible object storage
  - KV: global key-value cache for small values
  - Durable Objects: single-instance, strongly-consistent objects (sessions, locks)
  - Queues: reliable task enqueuing and consumption
  - Pages: static site hosting integrated with Workers for SSR
- Security considerations
  - Use environment bindings for secrets (DO NOT hardcode keys)
  - Validate and sanitize all inputs in Workers
  - Rate limit abusive requests
  - Use signed URLs for R2 uploads where appropriate
  - Use separate KV namespaces for staging/production

## 3. Requirements
- Required accounts
  - Cloudflare account with Workers, R2, D1 access (some features may require specific plan)
  - Optional: Cloudflare Pages account for static hosting
- Dependencies
  - Node.js (>= 18 recommended for local development)
  - Wrangler CLI (v2+)
  - Git
- Environment setup
  - CF API token with appropriate permissions (Workers Scripts, D1, R2, KV, Pages)
  - Local environment variables for secrets (use .dev.vars or direnv)

## 4. Installation / Setup
Commands:
- Install packages
  - npm init -y
  - npm install --save-dev wrangler typescript esbuild
- Configure environment
  - wrangler login
  - export CF_API_TOKEN="<token>" (or store in your system secret manager)
- Create resources
  - wrangler init --yes --site (for Pages/Workers)
  - wrangler d1 create my-d1-db
  - wrangler r2 create my-r2-bucket
  - wrangler kv:namespace create "MY_KV"
  - wrangler durable-object create ChatObject (if supported via wrangler)

## 5. Implementation
Example:
- Project structure
  - wrangler.toml
  - src/
    - index.ts
    - handlers/
      - upload.ts
      - api.ts
      - chat_do.ts
    - worker.d.ts
  - migrations/
    - 001-create-tables.sql
  - package.json

- Configuration files
wrangler.toml

```toml
name = "my-workers-app"
main = "./dist/index.js"
dev = { port = 8787 }
compatibility_date = "2026-01-01"

[vars]
  NODE_ENV = "development"

[triggers]
  crons = [ "0 0 * * *" ]

[build]
  command = "npm run build"

[workers_dev]
  # use the workers.dev subdomain during development
  enabled = true

[[r2_buckets]]
  binding = "MY_R2"
  bucket_name = "my-r2-bucket"

[[d1_databases]]
  binding = "MY_D1"
  database_name = "my_d1_db"

[[kv_namespaces]]
  binding = "MY_KV"
  id = "<kv-namespace-id>"

[durable_objects]
  bindings = [ { name = "CHAT_DO", class_name = "ChatDO" } ]

[env.production]
  compatibility_date = "2026-01-01"
  vars = { NODE_ENV = "production" }
```

- Backend code
TypeScript Worker example (src/index.ts)

```typescript
import { Router } from 'itty-router'
import { handleUpload } from './handlers/upload'
import { handleApi } from './handlers/api'

const router = Router()

router.post('/upload', handleUpload)
router.get('/api/users', handleApi)

addEventListener('fetch', (event) => {
  event.respondWith(router.handle(event.request))
})
```

Upload handler (src/handlers/upload.ts)

```typescript
export async function handleUpload(request: Request, env: any) {
  // Expect multipart/form-data or presigned URL
  // Simple example: accept raw body and store to R2
  const key = `uploads/${Date.now()}.bin`
  const body = await request.arrayBuffer()
  await env.MY_R2.put(key, body)
  const publicUrl = `https://<account_id>.r2.cloudflarestorage.com/${env.MY_R2_BUCKET}/${key}`
  return new Response(JSON.stringify({ key, url: publicUrl }), { status: 201 })
}
```

- Frontend code
A minimal fetch to the Worker endpoint from React:

```ts
async function uploadFile(file: File) {
  const resp = await fetch('/upload', { method: 'POST', body: file })
  return resp.json()
}
```

- Database schema
migrations/001-create-tables.sql

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  body TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

- API endpoints
- POST /upload -> store object in R2
- GET /api/users -> return users from D1
- POST /api/messages -> store message in D1 and notify Durable Object

## 6. Complete Code Examples
Example:
```javascript
// production example
// TypeScript implementation

// src/index.ts
import { Router } from 'itty-router'
import { json } from 'itty-router-extras'

const router = Router()

router.get('/health', () => new Response('ok'))

router.post('/messages', async (request, env) => {
  const payload = await request.json()
  const id = crypto.randomUUID()
  // Insert into D1
  await env.MY_D1.prepare(`INSERT INTO messages (id, user_id, body) VALUES (?, ?, ?)`)
    .bind(id, payload.user_id, payload.body)
    .run()
  // Notify Durable Object
  const objId = env.CHAT_DO.idFromName('global-chat')
  const obj = env.CHAT_DO.get(objId)
  await obj.fetch('https://dummy.local/send', { method: 'POST', body: JSON.stringify({ id, body: payload.body })})
  return json({ id }, 201)
})

addEventListener('fetch', (e) => e.respondWith(router.handle(e.request)))
```

-- Database example
```sql
-- migrations/001-create-tables.sql
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  body TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

7. Deployment

* Local development
  - wrangler dev --local
  - Use wrangler preview or workers.dev
* Staging
  - Configure wrangler environment: [env.staging]
  - wrangler publish --env staging
* Production
  - Set env vars in Cloudflare dashboard or via wrangler secret put
  - wrangler publish --env production
* CI/CD workflow
  - Example GitHub Actions job: build, run tests, wrangler publish using CF API token stored in repo secrets.

Example .github/workflows/deploy.yml snippet

```yaml
name: Deploy Workers
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - name: Publish to Cloudflare
        env:
          CF_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
        run: npx wrangler publish --env production
```

8. Security

* Authentication
  - Use JWTs signed with a secret stored in Cloudflare Workers secrets (wrangler secret put JWT_SECRET)
  - For OAuth, perform flow server-side in Worker and store tokens in secure cookie or Durable Object
* Authorization
  - Use role claims in JWT and enforce in Worker middleware
* Secrets management
  - Use wrangler secrets and environment variables; do not commit secrets
* Common vulnerabilities
  - SSRF via uncontrolled fetch URLs: validate origin
  - Large body DoS: enforce content-length limits
  - Injection attacks in D1: use parameterized queries

9. Performance Optimization

* Scaling
  - Workers scale automatically; design idempotent operations and minimize external round-trips
* Caching
  - Use Cloudflare cache API and KV for public content
  - Use Cache-Control headers for client and edge caching
* Monitoring
  - Use Cloudflare Analytics and Logs (if available)
  - Integrate with external observability (Datadog, Sentry) via batches to avoid per-request overhead

10. Troubleshooting

Common errors:

* Error message: "D1 prepare failed"
  * Cause: SQL syntax error or missing migration
  * Solution: Verify migrations ran, check SQL syntax, run d1/sql migrations logs

* Error message: "R2 put failed"
  * Cause: Missing binding or insufficient permissions
  * Solution: Ensure R2 bucket binding in wrangler.toml and CF token has R2 write permissions

* Error message: "Unhandled exception in Durable Object"
  * Cause: Unhandled runtime error in DO class
  * Solution: Add try/catch, log errors to durable logs, add unit tests for DO logic

11. Official References

- https://developers.cloudflare.com/workers/
- https://developers.cloudflare.com/workers/cli-wrangler/
- https://developers.cloudflare.com/d1/
- https://developers.cloudflare.com/r2/
- https://developers.cloudflare.com/workers/runtime-apis/kv/
- https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
- https://developers.cloudflare.com/workers/queues/
- https://developers.cloudflare.com/pages/
