import axios from 'axios';
import type { GitHubRepo, GitHubCommit, GitHubPR, GitHubBranch, GitHubUser } from '@/types';

const BASE = 'https://api.github.com';

function client(token: string) {
  return axios.create({
    baseURL: BASE,
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
}

export async function getAuthenticatedUser(token: string): Promise<GitHubUser> {
  const { data } = await client(token).get<GitHubUser>('/user');
  return data;
}

export async function listRepos(token: string, page = 1): Promise<GitHubRepo[]> {
  const { data } = await client(token).get<GitHubRepo[]>('/user/repos', {
    params: { sort: 'updated', per_page: 30, page },
  });
  return data;
}

export async function listCommits(
  token: string,
  owner: string,
  repo: string,
  branch?: string,
  page = 1
): Promise<GitHubCommit[]> {
  const { data } = await client(token).get<GitHubCommit[]>(
    '/repos/' + owner + '/' + repo + '/commits',
    { params: { sha: branch, per_page: 30, page } }
  );
  return data;
}

export async function listPullRequests(
  token: string,
  owner: string,
  repo: string,
  state: 'open' | 'closed' | 'all' = 'open',
  page = 1
): Promise<GitHubPR[]> {
  const { data } = await client(token).get<GitHubPR[]>(
    '/repos/' + owner + '/' + repo + '/pulls',
    { params: { state, per_page: 30, page } }
  );
  return data;
}

export async function listBranches(
  token: string,
  owner: string,
  repo: string
): Promise<GitHubBranch[]> {
  const { data } = await client(token).get<GitHubBranch[]>(
    '/repos/' + owner + '/' + repo + '/branches',
    { params: { per_page: 100 } }
  );
  return data;
}

export async function createPullRequest(
  token: string,
  owner: string,
  repo: string,
  payload: { title: string; head: string; base: string; body?: string }
): Promise<GitHubPR> {
  const { data } = await client(token).post<GitHubPR>(
    '/repos/' + owner + '/' + repo + '/pulls',
    payload
  );
  return data;
}

export async function mergePullRequest(
  token: string,
  owner: string,
  repo: string,
  pullNumber: number
): Promise<{ merged: boolean; message: string }> {
  const { data } = await client(token).put<{ merged: boolean; message: string }>(
    '/repos/' + owner + '/' + repo + '/pulls/' + pullNumber + '/merge'
  );
  return data;
}

export async function createOrUpdateFile(
  token: string,
  owner: string,
  repo: string,
  payload: {
    message: string;
    content: string; // base64
    path: string;
    branch?: string;
    sha?: string;
  }
): Promise<{ commit: { sha: string } }> {
  const { data } = await client(token).put<{ commit: { sha: string } }>(
    '/repos/' + owner + '/' + repo + '/contents/' + payload.path,
    {
      message: payload.message,
      content: payload.content,
      branch: payload.branch,
      sha: payload.sha,
    }
  );
  return data;
}

export async function getRepoContents(
  token: string,
  owner: string,
  repo: string,
  path: string,
  branch?: string
): Promise<{ content: string; sha: string; name: string; type: string }[]> {
  const { data } = await client(token).get(
    '/repos/' + owner + '/' + repo + '/contents/' + path,
    { params: { ref: branch } }
  );
  return Array.isArray(data) ? data : [data];
}

export async function triggerWorkflow(
  token: string,
  owner: string,
  repo: string,
  workflowId: string,
  ref: string,
  inputs?: Record<string, string>
): Promise<void> {
  await client(token).post(
    '/repos/' + owner + '/' + repo + '/actions/workflows/' + workflowId + '/dispatches',
    { ref, inputs }
  );
}

export async function listWorkflowRuns(
  token: string,
  owner: string,
  repo: string
): Promise<{
  workflow_runs: {
    id: number;
    name: string;
    status: string;
    conclusion: string;
    created_at: string;
    html_url: string;
  }[];
}> {
  const { data } = await client(token).get(
    '/repos/' + owner + '/' + repo + '/actions/runs',
    { params: { per_page: 10 } }
  );
  return data;
}
