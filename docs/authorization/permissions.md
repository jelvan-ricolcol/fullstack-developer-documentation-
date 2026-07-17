# Permissions

> **Back to:** [INDEX.md](../../INDEX.md) | **Root doc:** [AUTHORIZATION.md](../../AUTHORIZATION.md)

## Overview

Detailed permission definitions per role. See [AUTHORIZATION.md](../../AUTHORIZATION.md) for the permission matrix.

## Role Definitions

### admin
- Full read/write access to all resources
- Can manage users (create, update role, delete)
- Can view audit logs
- Can modify system settings

### editor
- Read/write access to content resources
- Cannot manage users (except own profile)
- Cannot view audit logs
- Cannot modify system settings

### viewer
- Read-only access to permitted content
- Can update own profile
- No administrative capabilities

### service
- Machine-to-machine role
- Full read access to all resources
- Write access to data-plane operations
- No destructive operations (delete users)

## Adding Custom Permissions

For dynamic permissions beyond the static RBAC map:

```sql
CREATE TABLE IF NOT EXISTS user_permissions (
  user_id    TEXT NOT NULL REFERENCES users(id),
  resource   TEXT NOT NULL,
  action     TEXT NOT NULL,
  granted_at TEXT NOT NULL,
  granted_by TEXT NOT NULL,
  PRIMARY KEY (user_id, resource, action)
);
```

## Verified Sources

- OWASP Authorization Testing — https://owasp.org/www-project-web-security-testing-guide/
- NIST RBAC — https://csrc.nist.gov/projects/role-based-access-control


---
*Enterprise AI-First Development Standard - [Return to Index](INDEX.md)*
