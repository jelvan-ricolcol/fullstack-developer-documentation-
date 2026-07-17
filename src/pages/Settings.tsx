import { useState } from 'react';
import {
  Github,
  Cloud,
  Sparkles,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  ExternalLink,
  Key,
  Shield,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Layout } from '@/components/Layout';
import { TopBar } from '@/components/TopBar';
import { Card, CardHeader } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useAuth } from '@/context/AuthContext';
import { getAuthenticatedUser } from '@/services/github';
import { verifyToken } from '@/services/cloudflare';
import type { ApiTokens } from '@/types';

export function Settings() {
  const { auth, updateTokens, logout } = useAuth();
  const [tokens, setTokens] = useState<ApiTokens>({ ...auth.tokens });
  const [show, setShow] = useState({ github: false, cloudflare_token: false, openai: false });
  const [validating, setValidating] = useState({ github: false, cloudflare: false });
  const [validated, setValidated] = useState({ github: false, cloudflare: false });
  const [saving, setSaving] = useState(false);

  function toggle(key: keyof typeof show) {
    setShow((s) => ({ ...s, [key]: !s[key] }));
  }

  function update(key: keyof ApiTokens, value: string) {
    setTokens((t) => ({ ...t, [key]: value }));
    // Reset validation on edit
    if (key === 'github') setValidated((v) => ({ ...v, github: false }));
    if (key === 'cloudflare_token') setValidated((v) => ({ ...v, cloudflare: false }));
  }

  async function validateGitHub() {
    if (!tokens.github) { toast.error('Enter a GitHub token first'); return; }
    setValidating((v) => ({ ...v, github: true }));
    try {
      const user = await getAuthenticatedUser(tokens.github);
      setValidated((v) => ({ ...v, github: true }));
      toast.success('GitHub token valid — logged in as ' + user.login);
    } catch {
      toast.error('GitHub token is invalid');
    } finally {
      setValidating((v) => ({ ...v, github: false }));
    }
  }

  async function validateCloudflare() {
    if (!tokens.cloudflare_token) { toast.error('Enter a Cloudflare API token first'); return; }
    setValidating((v) => ({ ...v, cloudflare: true }));
    try {
      await verifyToken(tokens.cloudflare_token);
      setValidated((v) => ({ ...v, cloudflare: true }));
      toast.success('Cloudflare token is valid');
    } catch {
      toast.error('Cloudflare token is invalid');
    } finally {
      setValidating((v) => ({ ...v, cloudflare: false }));
    }
  }

  async function saveTokens() {
    setSaving(true);
    try {
      updateTokens(tokens);
      toast.success('Settings saved!');
    } finally {
      setSaving(false);
    }
  }

  function clearAllTokens() {
    if (!confirm('Are you sure you want to clear all API tokens? This will log you out.')) return;
    logout();
  }

  const tokenSections = [
    {
      key: 'github' as const,
      title: 'GitHub',
      icon: <Github className="w-4 h-4 text-gray-800" />,
      bgClass: 'bg-gray-50 border-gray-200',
      fields: [
        {
          key: 'github' as keyof ApiTokens,
          label: 'Personal Access Token',
          placeholder: 'ghp_xxxxxxxxxxxxxxxxxxxx',
          showKey: 'github' as keyof typeof show,
          hint: 'Required scopes: repo, workflow, read:user',
          link: 'https://github.com/settings/tokens/new',
          linkText: 'Create on GitHub →',
        },
      ],
      onValidate: validateGitHub,
      validateLoading: validating.github,
      isValid: validated.github,
      status: auth.tokens.github ? 'connected' : 'disconnected',
    },
    {
      key: 'cloudflare' as const,
      title: 'Cloudflare',
      icon: <Cloud className="w-4 h-4 text-cloudflare-orange" />,
      bgClass: 'bg-orange-50 border-orange-200',
      fields: [
        {
          key: 'cloudflare_token' as keyof ApiTokens,
          label: 'API Token',
          placeholder: 'your-cloudflare-api-token',
          showKey: 'cloudflare_token' as keyof typeof show,
          hint: 'Required: Cloudflare Pages, Workers read/write',
          link: 'https://dash.cloudflare.com/profile/api-tokens',
          linkText: 'Create on Cloudflare →',
        },
        {
          key: 'cloudflare_account_id' as keyof ApiTokens,
          label: 'Account ID',
          placeholder: '32-character hex string',
          showKey: null,
          hint: 'Found in Cloudflare Dashboard → Right sidebar',
          link: null,
          linkText: null,
        },
      ],
      onValidate: validateCloudflare,
      validateLoading: validating.cloudflare,
      isValid: validated.cloudflare,
      status: auth.tokens.cloudflare_token && auth.tokens.cloudflare_account_id ? 'connected' : 'disconnected',
    },
    {
      key: 'openai' as const,
      title: 'OpenAI',
      icon: <Sparkles className="w-4 h-4 text-green-600" />,
      bgClass: 'bg-green-50 border-green-200',
      fields: [
        {
          key: 'openai' as keyof ApiTokens,
          label: 'API Key',
          placeholder: 'sk-proj-xxxxxxxxxxxx',
          showKey: 'openai' as keyof typeof show,
          hint: 'Used for GPT-4o code generation',
          link: 'https://platform.openai.com/api-keys',
          linkText: 'Create on OpenAI →',
        },
      ],
      onValidate: null,
      validateLoading: false,
      isValid: false,
      status: auth.tokens.openai ? 'connected' : 'disconnected',
    },
  ];

  return (
    <Layout>
      <TopBar title="Settings" subtitle="Manage API tokens and preferences" />

      <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Security notice */}
          <Card padding="md">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-0.5">Local storage only</p>
                <p className="text-xs text-gray-500">
                  Your API tokens are stored exclusively in your browser's local storage. They are never
                  transmitted to any third-party server. Clear your browser data or use{' '}
                  <strong>Clear all tokens</strong> to remove them.
                </p>
              </div>
            </div>
          </Card>

          {/* Token cards */}
          {tokenSections.map((section) => (
            <Card key={section.key} padding="md" className={'border ' + section.bgClass}>
              <CardHeader
                title={section.title}
                icon={section.icon}
                action={
                  <Badge variant={section.status === 'connected' ? 'success' : 'default'}>
                    {section.status === 'connected' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Connected
                      </>
                    ) : (
                      'Not connected'
                    )}
                  </Badge>
                }
              />

              <div className="space-y-3 ml-12">
                {section.fields.map((field) => (
                  <div key={field.key}>
                    <Input
                      label={field.label}
                      type={field.showKey && show[field.showKey] ? 'text' : field.showKey ? 'password' : 'text'}
                      placeholder={field.placeholder}
                      value={tokens[field.key]}
                      onChange={(e) => update(field.key, e.target.value)}
                      hint={field.hint}
                      leftIcon={field.showKey ? <Key className="w-3.5 h-3.5" /> : undefined}
                      rightIcon={
                        field.showKey ? (
                          <button
                            type="button"
                            className="pointer-events-auto"
                            onClick={() => field.showKey && toggle(field.showKey)}
                          >
                            {show[field.showKey!] ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        ) : undefined
                      }
                    />
                    {field.link && (
                      <a
                        href={field.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary-600 hover:underline mt-1"
                      >
                        {field.linkText}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}

                {section.onValidate && (
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      loading={section.validateLoading}
                      onClick={section.onValidate}
                    >
                      Validate Token
                    </Button>
                    {section.isValid && (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Valid
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={clearAllTokens}
            >
              Clear all tokens
            </Button>
            <Button
              loading={saving}
              icon={<Save className="w-4 h-4" />}
              onClick={saveTokens}
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
