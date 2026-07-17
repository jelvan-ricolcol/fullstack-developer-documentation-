# Enterprise Decision Trees

## Storage Selection
```mermaid
graph TD
    A[Needs Storage?] --> B{Relational Data?}
    B -->|Yes| C[Cloudflare D1]
    B -->|No| D{Key-Value?}
    D -->|Yes| E[Cloudflare KV]
    D -->|No| F{Large Blobs/Files?}
    F -->|Yes| G[Cloudflare R2]
    F -->|No| H[Durable Objects for State]
```

## Other Decision Trees
- **Authentication:** Use built-in OAuth/JWT flows documented in `AUTHENTICATION.md`.
- **API Design:** RESTful principles with Hono.
- **State Management:** React Context + React Query.
- **Error Handling:** Standardized JSON error responses.


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
