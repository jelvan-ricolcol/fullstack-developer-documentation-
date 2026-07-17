import { useEffect, useState, useCallback } from 'react';
import {
  Cloud,
  RefreshCw,
  ExternalLink,
  Play,
  RotateCcw,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { Layout } from '@/components/Layout';
import { TopBar } from '@/components/TopBar';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { EmptyState } from '@/components/EmptyState';
import { Modal } from '@/components/Modal';
import { useAuth } from '@/context/AuthContext';
import {
  listPagesProjects,
  listDeployments,
  triggerDeployment,
  retryDeployment,
  rollbackDeployment,
  listWorkers,
} from '@/services/cloudflare';
import type { CloudflareProject, CloudflareDeployment } from '@/types';

type Tab = 'pages' | 'workers';

function deployStatusConfig(status: string): {
  variant: 'success' | 'danger' | 'warning' | 'default';
  icon: React.ReactNode;
  label: string;
} {
  switch (status) {
    case 'success':
      return { variant: 'success', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Success' };
    case 'failure':
      return { variant: 'danger', icon: <XCircle className="w-3 h-3" />, label: 'Failed' };
    case 'active':
      return { variant: 'warning', icon: <Clock className="w-3 h-3" />, label: 'Building' };
    case 'canceled':
      return { variant: 'default', icon: <AlertCircle className="w-3 h-3" />, label: 'Canceled' };
    default:
      return { variant: 'default', icon: <Clock className="w-3 h-3" />, label: status };
  }
}

export function Cloudflare() {
  const { auth } = useAuth();
  const { cloudflare_token: token, cloudflare_account_id: accountId } = auth.tokens;

  const [activeTab, setActiveTab] = useState<Tab>('pages');
  const [projects, setProjects] = useState<CloudflareProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<CloudflareProject | null>(null);
  const [deployments, setDeployments] = useState<CloudflareDeployment[]>([]);
  const [workers, setWorkers] = useState<{ id: string; etag: string; created_on: string; modified_on: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [deployLoading, setDeployLoading] = useState<string | null>(null);

  // Rollback modal
  const [rollbackOpen, setRollbackOpen] = useState(false);
  const [rollbackTarget, setRollbackTarget] = useState<CloudflareDeployment | null>(null);

  const hasTokens = !!(token && accountId);

  const loadProjects = useCallback(async () => {
    if (!token || !accountId) return;
    setLoading(true);
    try {
      const data = await listPagesProjects(token, accountId);
      setProjects(data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [token, accountId]);

  const loadWorkers = useCallback(async () => {
    if (!token || !accountId) return;
    setLoading(true);
    try {
      const data = await listWorkers(token, accountId);
      setWorkers(data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load workers');
    } finally {
      setLoading(false);
    }
  }, [token, accountId]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  async function selectProject(project: CloudflareProject) {
    setSelectedProject(project);
    setLoading(true);
    try {
      const data = await listDeployments(token, accountId, project.name);
      setDeployments(data);
    } catch {
      toast.error('Failed to load deployments');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeploy(project: CloudflareProject) {
    setDeployLoading(project.id);
    try {
      const dep = await triggerDeployment(token, accountId, project.name);
      toast.success('Deployment triggered: ' + dep.short_id);
      await selectProject(project);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to trigger deployment');
    } finally {
      setDeployLoading(null);
    }
  }

  async function handleRetry(dep: CloudflareDeployment) {
    if (!selectedProject) return;
    try {
      await retryDeployment(token, accountId, selectedProject.name, dep.id);
      toast.success('Deployment retried');
      await selectProject(selectedProject);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to retry');
    }
  }

  async function handleRollback() {
    if (!selectedProject || !rollbackTarget) return;
    try {
      await rollbackDeployment(token, accountId, selectedProject.name, rollbackTarget.id);
      toast.success('Rolled back to deployment ' + rollbackTarget.short_id);
      setRollbackOpen(false);
      setRollbackTarget(null);
      await selectProject(selectedProject);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to rollback');
    }
  }

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    if (tab === 'workers') loadWorkers();
    if (tab === 'pages') loadProjects();
  }

  return (
    <Layout>
      <TopBar
        title="Cloudflare"
        subtitle={selectedProject ? selectedProject.name : 'Manage Pages & Workers deployments'}
        actions={
          <Button
            size="sm"
            variant="outline"
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            loading={loading}
            onClick={activeTab === 'pages' ? loadProjects : loadWorkers}
          >
            Refresh
          </Button>
        }
      />

      {!hasTokens ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={<Cloud className="w-7 h-7" />}
            title="Cloudflare not connected"
            description="Add your Cloudflare API token and Account ID in Settings to get started."
          />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="flex items-center gap-1 px-6 pt-4 border-b border-gray-200 bg-white">
            {([
              { id: 'pages' as Tab, label: 'Pages', icon: <Cloud className="w-4 h-4" /> },
              { id: 'workers' as Tab, label: 'Workers', icon: <Zap className="w-4 h-4" /> },
            ] as { id: Tab; label: string; icon: React.ReactNode }[]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={
                  'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ' +
                  (activeTab === tab.id
                    ? 'text-primary-600 border-primary-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700')
                }
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-hidden flex">
            {/* Left: Project list */}
            {activeTab === 'pages' && (
              <div className="w-64 flex-shrink-0 border-r border-gray-200 overflow-y-auto bg-white p-3 space-y-1">
                {loading && projects.length === 0 ? (
                  <div className="space-y-2 p-2">
                    {[1, 2, 3].map((i) => <div key={i} className="h-10 rounded-lg bg-gray-100 animate-pulse" />)}
                  </div>
                ) : projects.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6 px-2">No Pages projects found</p>
                ) : (
                  projects.map((proj) => {
                    const status = proj.latest_deployment?.latest_stage?.status ?? 'idle';
                    const cfg = deployStatusConfig(status);
                    return (
                      <button
                        key={proj.id}
                        onClick={() => selectProject(proj)}
                        className={
                          'w-full text-left px-3 py-2.5 rounded-lg transition-colors ' +
                          (selectedProject?.id === proj.id
                            ? 'bg-primary-50 text-primary-700'
                            : 'hover:bg-gray-100 text-gray-700')
                        }
                      >
                        <p className="text-sm font-medium truncate">{proj.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Badge variant={cfg.variant} size="sm">
                            {cfg.icon}
                            {cfg.label}
                          </Badge>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {/* Right: Detail pane */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'pages' && (
                <>
                  {!selectedProject ? (
                    <div className="h-full flex items-center justify-center">
                      <EmptyState
                        icon={<Cloud className="w-6 h-6" />}
                        title="Select a project"
                        description="Click a project on the left to view its deployments."
                      />
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fade-in">
                      {/* Project header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-base font-semibold text-gray-900">{selectedProject.name}</h2>
                          <a
                            href={'https://' + selectedProject.subdomain + '.pages.dev'}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-primary-600 hover:underline flex items-center gap-1"
                          >
                            {selectedProject.subdomain}.pages.dev
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <Button
                          size="sm"
                          icon={<Play className="w-3.5 h-3.5" />}
                          loading={deployLoading === selectedProject.id}
                          onClick={() => handleDeploy(selectedProject)}
                        >
                          Deploy Now
                        </Button>
                      </div>

                      {/* Deployments list */}
                      <div className="space-y-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Deployments</h3>
                        {loading ? (
                          <div className="space-y-2">
                            {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />)}
                          </div>
                        ) : deployments.length === 0 ? (
                          <EmptyState icon={<Cloud className="w-6 h-6" />} title="No deployments" description="No deployments found for this project." />
                        ) : (
                          deployments.map((dep) => {
                            const cfg = deployStatusConfig(dep.latest_stage.status);
                            return (
                              <Card key={dep.id} padding="md">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge variant={cfg.variant}>
                                        {cfg.icon}
                                        {cfg.label}
                                      </Badge>
                                      <Badge variant={dep.environment === 'production' ? 'info' : 'default'}>
                                        {dep.environment}
                                      </Badge>
                                      <code className="text-xs text-gray-400 font-mono">{dep.short_id}</code>
                                    </div>
                                    {dep.deployment_trigger.metadata.commit_message && (
                                      <p className="text-sm text-gray-700 font-medium line-clamp-1">
                                        {dep.deployment_trigger.metadata.commit_message}
                                      </p>
                                    )}
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      {dep.deployment_trigger.metadata.branch && (
                                        <span>{dep.deployment_trigger.metadata.branch} · </span>
                                      )}
                                      {formatDistanceToNow(new Date(dep.created_on), { addSuffix: true })}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <a
                                      href={dep.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                    {dep.latest_stage.status === 'failure' && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        icon={<RefreshCw className="w-3 h-3" />}
                                        onClick={() => handleRetry(dep)}
                                      >
                                        Retry
                                      </Button>
                                    )}
                                    {dep.latest_stage.status === 'success' && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        icon={<RotateCcw className="w-3 h-3" />}
                                        onClick={() => { setRollbackTarget(dep); setRollbackOpen(true); }}
                                      >
                                        Rollback
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'workers' && (
                <div className="space-y-3 animate-fade-in">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Workers Scripts</h3>
                  {loading ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" />)}
                    </div>
                  ) : workers.length === 0 ? (
                    <EmptyState
                      icon={<Zap className="w-6 h-6" />}
                      title="No Workers found"
                      description="Deploy a Worker using wrangler or the Cloudflare dashboard."
                    />
                  ) : (
                    workers.map((w) => (
                      <Card key={w.id} padding="md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-semibold text-gray-800 font-mono">{w.id}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span>Modified {formatDistanceToNow(new Date(w.modified_on), { addSuffix: true })}</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rollback Modal */}
      <Modal
        open={rollbackOpen}
        onClose={() => { setRollbackOpen(false); setRollbackTarget(null); }}
        title="Confirm Rollback"
        footer={
          <>
            <Button variant="outline" onClick={() => setRollbackOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleRollback}>Rollback</Button>
          </>
        }
      >
        {rollbackTarget && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Are you sure you want to rollback to deployment{' '}
              <strong className="font-mono">{rollbackTarget.short_id}</strong>?
            </p>
            <p className="text-sm text-gray-500">
              This will make the selected deployment the current production deployment.
            </p>
          </div>
        )}
      </Modal>
    </Layout>
  );
}
