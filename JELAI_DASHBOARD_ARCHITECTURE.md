# JelAI Dashboard Architecture

## System Architecture

```mermaid
graph TD
    User[User/Admin] --> Dash[JelAI Dashboard Frontend]
    Dash --> Auth[Auth Service]
    Dash --> GitHubAPI[GitHub Integration]
    Dash --> CFAPI[Cloudflare Integration]
    Dash --> AIChat[AI Chat Assistant]
    
    CFAPI --> Workers[Workers Dashboard]
    CFAPI --> D1[D1 Explorer]
    CFAPI --> R2[R2 Browser]
    
    GitHubAPI --> Repo[Repository Management]
    GitHubAPI --> Deploy[Deployment Dashboard]
```

## Features
- **Code & Deploy:** Commit Assistant, AI Code Review, Deployment Monitoring.
- **Data Management:** D1, R2, KV, and Queue explorers.
- **Admin:** User Roles, Permissions, Cost Monitoring, Audit Logs, Secrets Manager.


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
