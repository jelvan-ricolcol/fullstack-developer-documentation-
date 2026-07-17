# GraphQL

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [BACKEND.md](../../BACKEND.md)

## Overview

GraphQL is an optional API layer. The primary API is REST (see [API.md](../../API.md)).
GraphQL may be considered for complex query requirements in future versions.

## When to Use GraphQL

- Complex nested data requirements with many joins
- Clients needing very different subsets of data
- Real-time subscriptions (via WebSocket)

## Workers + GraphQL

GraphQL can run in Cloudflare Workers using lightweight libraries:

```typescript
import { createSchema, createYoga } from 'graphql-yoga';

const schema = createSchema({
  typeDefs: `
    type User {
      id: ID!
      email: String!
      name: String!
    }
    type Query {
      user(id: ID!): User
    }
  `,
  resolvers: {
    Query: {
      user: async (_, { id }, { env }) => {
        return env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();
      },
    },
  },
});

const yoga = createYoga({ schema });
export default { fetch: yoga.fetch };
```

## Security Considerations

- Depth limiting to prevent deeply nested queries
- Complexity analysis to prevent expensive queries
- Authentication required on all resolvers
- Input validation on all arguments

## Verified Sources

- GraphQL Spec — https://spec.graphql.org/
- GraphQL Yoga — https://the-guild.dev/graphql/yoga-server
- OWASP GraphQL — https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html
