import { spawnSync } from 'node:child_process';

const { CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID } = process.env;

if (!CLOUDFLARE_API_TOKEN) {
  throw new Error('Missing CLOUDFLARE_API_TOKEN');
}

if (!CLOUDFLARE_ACCOUNT_ID) {
  throw new Error('Missing CLOUDFLARE_ACCOUNT_ID');
}

function syncSecret(name, value) {
  const result = spawnSync(
    'npx',
    ['wrangler', 'secret', 'put', name, '--env', 'production'],
    {
      input: value,
      stdio: ['pipe', 'inherit', 'inherit'],
      env: process.env,
    }
  );

  if (result.status !== 0) {
    process.exit(result.status);
  }

  if (result.error) {
    throw result.error;
  }
}

syncSecret('CF_TOKEN', CLOUDFLARE_API_TOKEN);
syncSecret('CF_ACCOUNT_ID', CLOUDFLARE_ACCOUNT_ID);
