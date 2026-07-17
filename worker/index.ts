/**
 * DevPilot Cloudflare Worker — Backend API Proxy
 *
 * Proxies requests to GitHub and Cloudflare APIs so tokens
 * can optionally be stored server-side using Worker secrets.
 *
 * Deploy with: wrangler deploy
 * Set secrets:  wrangler secret put GITHUB_TOKEN
 *               wrangler secret put CF_TOKEN
 *               wrangler secret put CF_ACCOUNT_ID
 */

export interface Env {
  // Optional: store tokens as Worker secrets for server-side auth
  GITHUB_TOKEN?: string;
  CF_TOKEN?: string;
  CF_ACCOUNT_ID?: string;
  // KV namespace for caching (optional)
  CACHE?: KVNamespace;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-GitHub-Token, X-CF-Token, X-CF-Account',
};

function corsResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

function errorResponse(message: string, status = 400) {
  return corsResponse({ error: message, success: false }, status);
}

async function proxyGitHub(
  request: Request,
  env: Env,
  path: string
): Promise<Response> {
  const token =
    request.headers.get('X-GitHub-Token') ?? env.GITHUB_TOKEN ?? '';
  if (!token) return errorResponse('GitHub token required', 401);

  const url = 'https://api.github.com' + path;
  const init: RequestInit = {
    method: request.method,
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'DevPilot/1.0',
    },
  };

  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    init.body = await request.text();
    (init.headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, init);
  const data = await res.json();
  return corsResponse(data, res.status);
}

async function proxyCloudflare(
  request: Request,
  env: Env,
  path: string
): Promise<Response> {
  const token = request.headers.get('X-CF-Token') ?? env.CF_TOKEN ?? '';
  if (!token) return errorResponse('Cloudflare token required', 401);

  const url = 'https://api.cloudflare.com/client/v4' + path;
  const init: RequestInit = {
    method: request.method,
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  };

  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    init.body = await request.text();
  }

  const res = await fetch(url, init);
  const data = await res.json();
  return corsResponse(data, res.status);
}

async function runAI(request: Request, env: Env): Promise<Response> {
  const body = (await request.json()) as {
    provider: 'openai' | 'cloudflare';
    prompt: string;
    model?: string;
    apiKey?: string;
    accountId?: string;
    cfToken?: string;
  };

  if (body.provider === 'openai') {
    const apiKey = body.apiKey ?? '';
    if (!apiKey) return errorResponse('OpenAI API key required', 401);

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: body.model ?? 'gpt-4o',
        messages: [{ role: 'user', content: body.prompt }],
        temperature: 0.2,
      }),
    });
    const data = await res.json();
    return corsResponse(data, res.status);
  }

  if (body.provider === 'cloudflare') {
    const accountId = body.accountId ?? env.CF_ACCOUNT_ID ?? '';
    const token = body.cfToken ?? env.CF_TOKEN ?? '';
    if (!accountId || !token) return errorResponse('Cloudflare credentials required', 401);

    const model = body.model ?? '@cf/meta/llama-3.1-8b-instruct';
    const res = await fetch(
      'https://api.cloudflare.com/client/v4/accounts/' + accountId + '/ai/run/' + model,
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: body.prompt }],
        }),
      }
    );
    const data = await res.json();
    return corsResponse(data, res.status);
  }

  return errorResponse('Unknown provider');
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // Health check
    if (url.pathname === '/api/health') {
      return corsResponse({ status: 'ok', version: '1.0.0' });
    }

    // GitHub proxy: /api/github/**
    if (url.pathname.startsWith('/api/github/')) {
      const path = url.pathname.replace('/api/github', '') + url.search;
      return proxyGitHub(request, env, path);
    }

    // Cloudflare proxy: /api/cloudflare/**
    if (url.pathname.startsWith('/api/cloudflare/')) {
      const path = url.pathname.replace('/api/cloudflare', '') + url.search;
      return proxyCloudflare(request, env, path);
    }

    // AI generation: /api/ai
    if (url.pathname === '/api/ai' && request.method === 'POST') {
      return runAI(request, env);
    }

    return errorResponse('Not found', 404);
  },
};
