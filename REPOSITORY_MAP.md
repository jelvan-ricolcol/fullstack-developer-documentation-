# Repository Knowledge Map

## Component Interaction

```mermaid
graph TD
    Docs[Documentation /docs/] --> GitHub[GitHub Actions /CI_CD/]
    GitHub --> CF[Cloudflare Infra]
    Frontend[Frontend /src/] --> Backend[Worker /worker/]
    Backend --> D1[(Cloudflare D1)]
    Backend --> R2[Cloudflare R2]
    Backend --> KV[Cloudflare KV]
    Backend --> DO[Durable Objects]
    Backend --> Queues[Cloudflare Queues]
```

## Directory Structure
- `/docs/`: All documentation.
- `/src/`: Frontend React application.
- `/worker/`: Cloudflare Worker API.
- `/.github/`: CI/CD and deployment workflows.
- `/assets/`: Static assets and diagrams.
- `/scripts/`: Utility scripts.


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
