import { spawnSync } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const { CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID } = process.env;

if (!CLOUDFLARE_API_TOKEN) {
  throw new Error('Missing CLOUDFLARE_API_TOKEN');
}

if (!CLOUDFLARE_ACCOUNT_ID) {
  throw new Error('Missing CLOUDFLARE_ACCOUNT_ID');
}

const tempDir = await mkdtemp(join(tmpdir(), 'devpilot-worker-secrets-'));
const secretsFile = join(tempDir, 'worker-secrets.json');

try {
  await writeFile(
    secretsFile,
    JSON.stringify({
      CF_TOKEN: CLOUDFLARE_API_TOKEN,
      CF_ACCOUNT_ID: CLOUDFLARE_ACCOUNT_ID,
    }),
    { mode: 0o600 }
  );

  const result = spawnSync(
    'npx',
    ['wrangler', 'secret', 'bulk', secretsFile, '--env', 'production'],
    {
      stdio: 'inherit',
      env: process.env,
    }
  );

  if (typeof result.status === 'number' && result.status !== 0) {
    process.exit(result.status);
  }

  if (result.error) {
    throw result.error;
  }
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
