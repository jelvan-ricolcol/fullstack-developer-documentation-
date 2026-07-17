import axios from 'axios';
import type { CloudflareProject, CloudflareDeployment, CloudflareWorker, CloudflareZone } from '@/types';

const BASE = 'https://api.cloudflare.com/client/v4';

function client(token: string) {
  return axios.create({
    baseURL: BASE,
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  });
}

interface CFResponse<T> {
  result: T;
  success: boolean;
  errors: { message: string }[];
}

// ─── Pages ────────────────────────────────────────────────────────────────────

export async function listPagesProjects(
  token: string,
  accountId: string
): Promise<CloudflareProject[]> {
  const { data } = await client(token).get<CFResponse<CloudflareProject[]>>(
    '/accounts/' + accountId + '/pages/projects'
  );
  if (!data.success) throw new Error(data.errors[0]?.message ?? 'Cloudflare API error');
  return data.result;
}

export async function getPagesProject(
  token: string,
  accountId: string,
  projectName: string
): Promise<CloudflareProject> {
  const { data } = await client(token).get<CFResponse<CloudflareProject>>(
    '/accounts/' + accountId + '/pages/projects/' + projectName
  );
  if (!data.success) throw new Error(data.errors[0]?.message ?? 'Cloudflare API error');
  return data.result;
}

export async function listDeployments(
  token: string,
  accountId: string,
  projectName: string
): Promise<CloudflareDeployment[]> {
  const { data } = await client(token).get<CFResponse<CloudflareDeployment[]>>(
    '/accounts/' + accountId + '/pages/projects/' + projectName + '/deployments'
  );
  if (!data.success) throw new Error(data.errors[0]?.message ?? 'Cloudflare API error');
  return data.result;
}

export async function triggerDeployment(
  token: string,
  accountId: string,
  projectName: string
): Promise<CloudflareDeployment> {
  const { data } = await client(token).post<CFResponse<CloudflareDeployment>>(
    '/accounts/' + accountId + '/pages/projects/' + projectName + '/deployments'
  );
  if (!data.success) throw new Error(data.errors[0]?.message ?? 'Cloudflare API error');
  return data.result;
}

export async function retryDeployment(
  token: string,
  accountId: string,
  projectName: string,
  deploymentId: string
): Promise<CloudflareDeployment> {
  const { data } = await client(token).post<CFResponse<CloudflareDeployment>>(
    '/accounts/' + accountId + '/pages/projects/' + projectName + '/deployments/' + deploymentId + '/retry'
  );
  if (!data.success) throw new Error(data.errors[0]?.message ?? 'Cloudflare API error');
  return data.result;
}

export async function rollbackDeployment(
  token: string,
  accountId: string,
  projectName: string,
  deploymentId: string
): Promise<CloudflareDeployment> {
  const { data } = await client(token).post<CFResponse<CloudflareDeployment>>(
    '/accounts/' + accountId + '/pages/projects/' + projectName + '/deployments/' + deploymentId + '/rollback'
  );
  if (!data.success) throw new Error(data.errors[0]?.message ?? 'Cloudflare API error');
  return data.result;
}

// ─── Workers ──────────────────────────────────────────────────────────────────

export async function listWorkers(
  token: string,
  accountId: string
): Promise<{ id: string; etag: string; created_on: string; modified_on: string }[]> {
  const { data } = await client(token).get<CFResponse<{ scripts: { id: string; etag: string; created_on: string; modified_on: string }[] }>>(
    '/accounts/' + accountId + '/workers/scripts'
  );
  if (!data.success) throw new Error(data.errors[0]?.message ?? 'Cloudflare API error');
  return data.result.scripts ?? [];
}

export async function getWorkerScript(
  token: string,
  accountId: string,
  scriptName: string
): Promise<CloudflareWorker> {
  const { data } = await client(token).get<CFResponse<CloudflareWorker>>(
    '/accounts/' + accountId + '/workers/scripts/' + scriptName
  );
  if (!data.success) throw new Error(data.errors[0]?.message ?? 'Cloudflare API error');
  return data.result;
}

// ─── Zones / Domains ──────────────────────────────────────────────────────────

export async function listZones(token: string, accountId: string): Promise<CloudflareZone[]> {
  const { data } = await client(token).get<CFResponse<CloudflareZone[]>>('/zones', {
    params: { account_id: accountId, per_page: 50 },
  });
  if (!data.success) throw new Error(data.errors[0]?.message ?? 'Cloudflare API error');
  return data.result;
}

// ─── Account ──────────────────────────────────────────────────────────────────

export async function verifyToken(token: string): Promise<{ id: string; status: string }> {
  const { data } = await client(token).get<CFResponse<{ id: string; status: string }>>(
    '/user/tokens/verify'
  );
  if (!data.success) throw new Error(data.errors[0]?.message ?? 'Invalid token');
  return data.result;
}
