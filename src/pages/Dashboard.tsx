import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Github,
  Cloud,
  Sparkles,
  GitCommit,
  GitPullRequest,
  BookOpen,
  ArrowRight,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { TopBar } from '@/components/TopBar';
import { Card, CardHeader } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { listRepos, listPullRequests } from '@/services/github';
import { listPagesProjects } from '@/services/cloudflare';
import type { GitHubRepo, GitHubPR, CloudflareProject } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  to?: string;
}

function StatCard({ label, value, icon, color, to }: StatCardProps) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => to && navigate(to)}
      className={'bg-white rounded-xl border border-gray-200 shadow-card p-5 flex items-center gap-4' + (to ? ' cursor-pointer hover:shadow-card-hover hover:border-gray-300 transition-all duration-200' : '')}
    >
      <div className={'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ' + color}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function prStatusVariant(pr: GitHubPR): 'success' | 'danger' | 'info' | 'warning' {
  if (pr.merged_at) return 'success';
  if (pr.state === 'closed') return 'danger';
  if (pr.draft) return 'warning';
  return 'info';
}

function deployStatusVariant(status: string): 'success' | 'danger' | 'warning' | 'default' {
  if (status === 'success') return 'success';
  if (status === 'failure') return 'danger';
  if (status === 'active') return 'warning';
  return 'default';
}

function deployStatusIcon(status: string) {
  if (status === 'success') return <CheckCircle2 className="w-3 h-3" />;
  if (status === 'failure') return <XCircle className="w-3 h-3" />;
  return <Clock className="w-3 h-3" />;
}

export function Dashboard() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [prs, setPrs] = useState<GitHubPR[]>([]);
  const [projects, setProjects] = useState<CloudflareProject[]>([]);
  const [loadingGH, setLoadingGH] = useState(true);
  const [loadingCF, setLoadingCF] = useState(false);

  const hasGH = !!auth.tokens.github;
  const hasCF = !!(auth.tokens.cloudflare_token && auth.tokens.cloudflare_account_id);

  useEffect(() => {
    if (!hasGH) { setLoadingGH(false); return; }
    let cancelled = false;
    setLoadingGH(true);

    Promise.all([
      listRepos(auth.tokens.github),
      // Grab open PRs from the first repo for summary
    ]).then(([r]) => {
      if (cancelled) return;
      setRepos(r);
      // Fetch PRs from the most recently updated repo
      if (r.length > 0) {
        const [owner, repo] = r[0].full_name.split('/');
        listPullRequests(auth.tokens.github, owner, repo, 'open').then((p) => {
          if (!cancelled) setPrs(p.slice(0, 5));
        }).catch(() => {});
      }
    }).catch(() => {}).finally(() => { if (!cancelled) setLoadingGH(false); });

    return () => { cancelled = true; };
  }, [auth.tokens.github, hasGH]);

  useEffect(() => {
    if (!hasCF) return;
    let cancelled = false;
    setLoadingCF(true);
    listPagesProjects(auth.tokens.cloudflare_token, auth.tokens.cloudflare_account_id)
      .then((p) => { if (!cancelled) setProjects(p.slice(0, 5)); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingCF(false); });
    return () => { cancelled = true; };
  }, [auth.tokens.cloudflare_token, auth.tokens.cloudflare_account_id, hasCF]);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <Layout>
      <TopBar
        title="Dashboard"
        subtitle={greeting + ', ' + auth.username + ' 👋'}
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-6 animate-fade-in">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Repositories"
            value={loadingGH ? '…' : repos.length}
            icon={<BookOpen className="w-5 h-5 text-blue-600" />}
            color="bg-blue-50"
            to="/github"
          />
          <StatCard
            label="Open Pull Requests"
            value={loadingGH ? '…' : prs.length}
            icon={<GitPullRequest className="w-5 h-5 text-purple-600" />}
            color="bg-purple-50"
            to="/github"
          />
          <StatCard
            label="CF Projects"
            value={loadingCF ? '…' : hasCF ? projects.length : '—'}
            icon={<Cloud className="w-5 h-5 text-orange-500" />}
            color="bg-orange-50"
            to="/cloudflare"
          />
          <StatCard
            label="AI Generations"
            value="Ready"
            icon={<Sparkles className="w-5 h-5 text-green-600" />}
            color="bg-green-50"
            to="/ai-code"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Repos */}
          <Card>
            <CardHeader
              title="Recent Repositories"
              icon={<Github className="w-4 h-4 text-gray-700" />}
              action={
                <Button size="sm" variant="ghost" icon={<ArrowRight className="w-3.5 h-3.5" />} onClick={() => navigate('/github')}>
                  View all
                </Button>
              }
            />
            {loadingGH ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 rounded-lg bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : !hasGH ? (
              <p className="text-sm text-gray-500 py-4 text-center">
                Connect your GitHub token in{' '}
                <button onClick={() => navigate('/settings')} className="text-primary-600 font-medium hover:underline">Settings</button>
              </p>
            ) : repos.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">No repositories found</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {repos.slice(0, 5).map((repo) => (
                  <div key={repo.id} className="py-2.5 flex items-start justify-between">
                    <div>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-gray-800 hover:text-primary-600"
                      >
                        {repo.name}
                      </a>
                      {repo.description && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{repo.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 ml-3">
                      {repo.language && <Badge>{repo.language}</Badge>}
                      {repo.private && <Badge variant="warning">Private</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Open PRs */}
          <Card>
            <CardHeader
              title="Open Pull Requests"
              icon={<GitPullRequest className="w-4 h-4 text-purple-600" />}
              action={
                <Button size="sm" variant="ghost" icon={<ArrowRight className="w-3.5 h-3.5" />} onClick={() => navigate('/github')}>
                  View all
                </Button>
              }
            />
            {loadingGH ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 rounded-lg bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : !hasGH ? (
              <p className="text-sm text-gray-500 py-4 text-center">
                Connect your GitHub token in{' '}
                <button onClick={() => navigate('/settings')} className="text-primary-600 font-medium hover:underline">Settings</button>
              </p>
            ) : prs.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">No open pull requests</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {prs.map((pr) => (
                  <div key={pr.id} className="py-2.5 flex items-start justify-between">
                    <div>
                      <a
                        href={pr.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-gray-800 hover:text-primary-600 line-clamp-1"
                      >
                        #{pr.number} {pr.title}
                      </a>
                      <p className="text-xs text-gray-400 mt-0.5">
                        by {pr.user.login} · {formatDistanceToNow(new Date(pr.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <Badge variant={prStatusVariant(pr)}>
                      {pr.merged_at ? 'Merged' : pr.state}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Cloudflare Deployments */}
          <Card>
            <CardHeader
              title="Cloudflare Projects"
              icon={<Cloud className="w-4 h-4 text-cloudflare-orange" />}
              action={
                <Button size="sm" variant="ghost" icon={<ArrowRight className="w-3.5 h-3.5" />} onClick={() => navigate('/cloudflare')}>
                  View all
                </Button>
              }
            />
            {loadingCF ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-10 rounded-lg bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : !hasCF ? (
              <p className="text-sm text-gray-500 py-4 text-center">
                Connect Cloudflare tokens in{' '}
                <button onClick={() => navigate('/settings')} className="text-primary-600 font-medium hover:underline">Settings</button>
              </p>
            ) : projects.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">No Pages projects found</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {projects.map((proj) => {
                  const status = proj.latest_deployment?.latest_stage?.status ?? 'idle';
                  return (
                    <div key={proj.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{proj.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{proj.subdomain}.pages.dev</p>
                      </div>
                      <Badge variant={deployStatusVariant(status)}>
                        {deployStatusIcon(status)}
                        {status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader
              title="Quick Actions"
              icon={<Activity className="w-4 h-4 text-primary-600" />}
            />
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Browse Repos', icon: <Github className="w-4 h-4" />, to: '/github' },
                { label: 'Manage PRs', icon: <GitPullRequest className="w-4 h-4" />, to: '/github' },
                { label: 'View Commits', icon: <GitCommit className="w-4 h-4" />, to: '/github' },
                { label: 'Deploy to CF', icon: <Cloud className="w-4 h-4" />, to: '/cloudflare' },
                { label: 'AI Code Gen', icon: <Sparkles className="w-4 h-4" />, to: '/ai-code' },
                { label: 'API Tokens', icon: <BookOpen className="w-4 h-4" />, to: '/settings' },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={() => navigate(a.to)}
                  className="flex items-center gap-2.5 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 text-left transition-all duration-150 group"
                >
                  <span className="text-gray-500 group-hover:text-primary-600">{a.icon}</span>
                  <span className="text-xs font-medium text-gray-700 group-hover:text-primary-700">{a.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
