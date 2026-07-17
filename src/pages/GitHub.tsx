import { useEffect, useState, useCallback } from 'react';
import {
  Github,
  GitCommit,
  GitPullRequest,
  GitBranch,
  Star,
  GitFork,
  RefreshCw,
  ExternalLink,
  Plus,
  Merge,
  Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { Layout } from '@/components/Layout';
import { TopBar } from '@/components/TopBar';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { EmptyState } from '@/components/EmptyState';
import { useAuth } from '@/context/AuthContext';
import {
  listRepos,
  listCommits,
  listPullRequests,
  listBranches,
  createPullRequest,
  mergePullRequest,
} from '@/services/github';
import type { GitHubRepo, GitHubCommit, GitHubPR, GitHubBranch } from '@/types';

type Tab = 'repos' | 'commits' | 'prs' | 'branches';

export function GitHub() {
  const { auth } = useAuth();
  const token = auth.tokens.github;

  const [activeTab, setActiveTab] = useState<Tab>('repos');
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [prs, setPrs] = useState<GitHubPR[]>([]);
  const [branches, setBranches] = useState<GitHubBranch[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // Create PR modal
  const [createPROpen, setCreatePROpen] = useState(false);
  const [prForm, setPrForm] = useState({ title: '', head: '', base: '', body: '' });
  const [prLoading, setPrLoading] = useState(false);

  const hasToken = !!token;

  const loadRepos = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await listRepos(token);
      setRepos(data);
    } catch {
      toast.error('Failed to load repositories');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadRepos();
  }, [loadRepos]);

  async function selectRepo(repo: GitHubRepo) {
    setSelectedRepo(repo);
    setActiveTab('commits');
    await loadCommits(repo);
  }

  async function loadCommits(repo: GitHubRepo) {
    if (!token) return;
    setLoading(true);
    try {
      const [owner, name] = repo.full_name.split('/');
      const data = await listCommits(token, owner, name);
      setCommits(data);
    } catch {
      toast.error('Failed to load commits');
    } finally {
      setLoading(false);
    }
  }

  async function loadPRs() {
    if (!token || !selectedRepo) return;
    setLoading(true);
    try {
      const [owner, name] = selectedRepo.full_name.split('/');
      const data = await listPullRequests(token, owner, name, 'all');
      setPrs(data);
    } catch {
      toast.error('Failed to load pull requests');
    } finally {
      setLoading(false);
    }
  }

  async function loadBranches() {
    if (!token || !selectedRepo) return;
    setLoading(true);
    try {
      const [owner, name] = selectedRepo.full_name.split('/');
      const data = await listBranches(token, owner, name);
      setBranches(data);
    } catch {
      toast.error('Failed to load branches');
    } finally {
      setLoading(false);
    }
  }

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    if (!selectedRepo) return;
    if (tab === 'commits') loadCommits(selectedRepo);
    if (tab === 'prs') loadPRs();
    if (tab === 'branches') loadBranches();
  }

  async function handleCreatePR() {
    if (!token || !selectedRepo) return;
    if (!prForm.title || !prForm.head || !prForm.base) {
      toast.error('Title, head branch, and base branch are required');
      return;
    }
    setPrLoading(true);
    try {
      const [owner, name] = selectedRepo.full_name.split('/');
      const pr = await createPullRequest(token, owner, name, prForm);
      setPrs((prev) => [pr, ...prev]);
      setCreatePROpen(false);
      setPrForm({ title: '', head: '', base: '', body: '' });
      toast.success('Pull request created!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create PR');
    } finally {
      setPrLoading(false);
    }
  }

  async function handleMergePR(pr: GitHubPR) {
    if (!token || !selectedRepo) return;
    if (!confirm('Merge PR #' + pr.number + ': ' + pr.title + '?')) return;
    try {
      const [owner, name] = selectedRepo.full_name.split('/');
      await mergePullRequest(token, owner, name, pr.number);
      toast.success('PR merged!');
      await loadPRs();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to merge PR');
    }
  }

  const filteredRepos = repos.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.description ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const tabs: { id: Tab; label: string; icon: React.ReactNode; disabled?: boolean }[] = [
    { id: 'repos', label: 'Repositories', icon: <Github className="w-4 h-4" /> },
    { id: 'commits', label: 'Commits', icon: <GitCommit className="w-4 h-4" />, disabled: !selectedRepo },
    { id: 'prs', label: 'Pull Requests', icon: <GitPullRequest className="w-4 h-4" />, disabled: !selectedRepo },
    { id: 'branches', label: 'Branches', icon: <GitBranch className="w-4 h-4" />, disabled: !selectedRepo },
  ];

  return (
    <Layout>
      <TopBar
        title="GitHub"
        subtitle={selectedRepo ? selectedRepo.full_name : 'Manage repositories, commits & PRs'}
        actions={
          <Button size="sm" variant="outline" icon={<RefreshCw className="w-3.5 h-3.5" />} loading={loading} onClick={loadRepos}>
            Refresh
          </Button>
        }
      />

      {!hasToken ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={<Github className="w-7 h-7" />}
            title="GitHub not connected"
            description="Add your GitHub Personal Access Token in Settings to get started."
          />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="flex items-center gap-1 px-6 pt-4 border-b border-gray-200 bg-white">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                disabled={tab.disabled}
                onClick={() => handleTabChange(tab.id)}
                className={
                  'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ' +
                  (tab.disabled
                    ? 'text-gray-300 border-transparent cursor-not-allowed'
                    : activeTab === tab.id
                    ? 'text-primary-600 border-primary-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700')
                }
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
            {/* ── Repos ── */}
            {activeTab === 'repos' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Search repositories…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    leftIcon={<Search className="w-3.5 h-3.5" />}
                    className="max-w-xs"
                  />
                  <span className="text-sm text-gray-500">{filteredRepos.length} repos</span>
                </div>
                {loading && repos.length === 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredRepos.map((repo) => (
                      <Card key={repo.id} hover padding="md">
                        <div onClick={() => selectRepo(repo)} className="cursor-pointer">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                                {repo.name}
                                {repo.private && <Badge variant="warning" size="sm">Private</Badge>}
                              </h3>
                              {repo.description && (
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{repo.description}</p>
                              )}
                            </div>
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            {repo.language && (
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                                {repo.language}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3" /> {repo.stargazers_count}
                            </span>
                            <span className="flex items-center gap-1">
                              <GitFork className="w-3 h-3" /> {repo.forks_count}
                            </span>
                            <span className="ml-auto">
                              {formatDistanceToNow(new Date(repo.updated_at), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Commits ── */}
            {activeTab === 'commits' && (
              <div className="space-y-2">
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />)}
                  </div>
                ) : commits.length === 0 ? (
                  <EmptyState icon={<GitCommit className="w-6 h-6" />} title="No commits" description="No commits found for this repository." />
                ) : (
                  commits.map((c) => (
                    <Card key={c.sha} padding="md">
                      <div className="flex items-start gap-3">
                        {c.author?.avatar_url && (
                          <img src={c.author.avatar_url} alt="" className="w-7 h-7 rounded-full flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <a
                            href={c.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-medium text-gray-900 hover:text-primary-600 line-clamp-2"
                          >
                            {c.commit.message.split('\n')[0]}
                          </a>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {c.commit.author.name} ·{' '}
                            {formatDistanceToNow(new Date(c.commit.author.date), { addSuffix: true })}
                          </p>
                        </div>
                        <code className="text-xs text-gray-400 font-mono flex-shrink-0">
                          {c.sha.slice(0, 7)}
                        </code>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* ── Pull Requests ── */}
            {activeTab === 'prs' && (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    icon={<Plus className="w-3.5 h-3.5" />}
                    onClick={() => setCreatePROpen(true)}
                  >
                    New PR
                  </Button>
                </div>
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />)}
                  </div>
                ) : prs.length === 0 ? (
                  <EmptyState icon={<GitPullRequest className="w-6 h-6" />} title="No pull requests" description="No pull requests found." />
                ) : (
                  prs.map((pr) => (
                    <Card key={pr.id} padding="md">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={pr.state === 'open' ? 'success' : pr.merged_at ? 'purple' : 'danger'}>
                              {pr.merged_at ? 'Merged' : pr.state}
                            </Badge>
                            <a
                              href={pr.html_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm font-medium text-gray-900 hover:text-primary-600 line-clamp-1"
                            >
                              #{pr.number} {pr.title}
                            </a>
                          </div>
                          <p className="text-xs text-gray-400">
                            {pr.head.ref} → {pr.base.ref} · by {pr.user.login} ·{' '}
                            {formatDistanceToNow(new Date(pr.created_at), { addSuffix: true })}
                          </p>
                          {pr.labels.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {pr.labels.map((l) => (
                                <span
                                  key={l.name}
                                  className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                                  style={{
                                    backgroundColor: '#' + l.color + '20',
                                    color: '#' + l.color,
                                  }}
                                >
                                  {l.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {pr.state === 'open' && (
                          <Button
                            size="sm"
                            variant="outline"
                            icon={<Merge className="w-3.5 h-3.5" />}
                            onClick={() => handleMergePR(pr)}
                          >
                            Merge
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* ── Branches ── */}
            {activeTab === 'branches' && (
              <div className="space-y-2">
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => <div key={i} className="h-10 rounded-xl bg-gray-100 animate-pulse" />)}
                  </div>
                ) : branches.length === 0 ? (
                  <EmptyState icon={<GitBranch className="w-6 h-6" />} title="No branches" description="No branches found." />
                ) : (
                  branches.map((b) => (
                    <Card key={b.name} padding="sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-sm font-mono font-medium text-gray-800">{b.name}</span>
                          {b.protected && <Badge variant="warning">Protected</Badge>}
                          {b.name === selectedRepo?.default_branch && <Badge variant="info">Default</Badge>}
                        </div>
                        <code className="text-xs text-gray-400 font-mono">{b.commit.sha.slice(0, 7)}</code>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create PR Modal */}
      <Modal
        open={createPROpen}
        onClose={() => setCreatePROpen(false)}
        title="Create Pull Request"
        footer={
          <>
            <Button variant="outline" onClick={() => setCreatePROpen(false)}>Cancel</Button>
            <Button loading={prLoading} onClick={handleCreatePR}>Create PR</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input
            label="Title"
            placeholder="PR title"
            value={prForm.title}
            onChange={(e) => setPrForm((f) => ({ ...f, title: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Head branch"
              placeholder="feature/my-branch"
              value={prForm.head}
              onChange={(e) => setPrForm((f) => ({ ...f, head: e.target.value }))}
            />
            <Input
              label="Base branch"
              placeholder="main"
              value={prForm.base}
              onChange={(e) => setPrForm((f) => ({ ...f, base: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description (optional)</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              rows={4}
              placeholder="Describe your changes…"
              value={prForm.body}
              onChange={(e) => setPrForm((f) => ({ ...f, body: e.target.value }))}
            />
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
