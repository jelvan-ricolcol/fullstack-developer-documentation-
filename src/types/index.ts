// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface ApiTokens {
  github: string;
  cloudflare_token: string;
  cloudflare_account_id: string;
  openai: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  tokens: ApiTokens;
  username: string;
}

// ─── GitHub ───────────────────────────────────────────────────────────────────

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  private: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  default_branch: string;
  topics: string[];
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
  } | null;
  html_url: string;
}

export interface GitHubPR {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed' | 'merged';
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  html_url: string;
  body: string | null;
  labels: { name: string; color: string }[];
  draft: boolean;
  merged_at: string | null;
  base: { ref: string };
  head: { ref: string };
}

export interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

// ─── Cloudflare ───────────────────────────────────────────────────────────────

export interface CloudflareProject {
  id: string;
  name: string;
  subdomain: string;
  domains: string[];
  source?: {
    type: string;
    config?: {
      owner?: string;
      repo_name?: string;
      production_branch?: string;
    };
  };
  latest_deployment?: CloudflareDeployment;
  created_on: string;
}

export interface CloudflareDeployment {
  id: string;
  short_id: string;
  project_name: string;
  environment: 'production' | 'preview';
  url: string;
  created_on: string;
  modified_on: string;
  latest_stage: {
    name: string;
    status: 'idle' | 'active' | 'canceled' | 'success' | 'failure';
    started_on: string | null;
    ended_on: string | null;
  };
  deployment_trigger: {
    type: string;
    metadata: {
      branch?: string;
      commit_hash?: string;
      commit_message?: string;
    };
  };
}

export interface CloudflareWorker {
  id: string;
  created_on: string;
  modified_on: string;
  etag: string;
  handlers: string[];
  last_deployed_from?: string;
}

export interface CloudflareZone {
  id: string;
  name: string;
  status: string;
  plan: { name: string };
}

// ─── AI ───────────────────────────────────────────────────────────────────────

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AICodeRequest {
  prompt: string;
  language?: string;
  context?: string;
  provider: 'openai' | 'cloudflare';
}

// ─── UI ───────────────────────────────────────────────────────────────────────

export type TabId = 'dashboard' | 'github' | 'cloudflare' | 'ai-code' | 'settings';

export interface NavItem {
  id: TabId;
  label: string;
  icon: string;
  badge?: number;
}
