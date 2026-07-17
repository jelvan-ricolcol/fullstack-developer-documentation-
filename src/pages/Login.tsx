import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Cloud, Sparkles, Eye, EyeOff, ArrowRight, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import type { ApiTokens } from '@/types';
import { getAuthenticatedUser } from '@/services/github';
import { verifyToken } from '@/services/cloudflare';

type Step = 'credentials' | 'tokens';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState<Step>('credentials');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const [tokens, setTokens] = useState<ApiTokens>({
    github: '',
    cloudflare_token: '',
    cloudflare_account_id: '',
    openai: '',
  });
  const [showTokens, setShowTokens] = useState({
    github: false,
    cloudflare_token: false,
    openai: false,
  });

  function handleCredentials(e: FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('Please enter username and password');
      return;
    }
    setStep('tokens');
  }

  async function handleTokenSetup(e: FormEvent) {
    e.preventDefault();
    if (!tokens.github) {
      toast.error('GitHub token is required');
      return;
    }
    setLoading(true);
    try {
      // Validate GitHub token
      const ghUser = await getAuthenticatedUser(tokens.github);
      const displayName = ghUser.name || ghUser.login;

      // Optionally validate Cloudflare token
      if (tokens.cloudflare_token) {
        await verifyToken(tokens.cloudflare_token);
      }

      login(tokens, displayName);
      toast.success('Welcome, ' + displayName + '!');
      navigate('/');
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Authentication failed. Check your tokens.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function toggleToken(key: keyof typeof showTokens) {
    setShowTokens((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">DevPilot</h1>
          <p className="text-sm text-gray-500 mt-1">AI-Powered Developer Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden">
          {/* Step tabs */}
          <div className="flex border-b border-gray-100">
            {(['credentials', 'tokens'] as Step[]).map((s, i) => (
              <div
                key={s}
                className={
                  'flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors ' +
                  (step === s ? 'text-primary-600 border-b-2 border-primary-600 -mb-px' : 'text-gray-400')
                }
              >
                <span className={
                  'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ' +
                  (step === s ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500')
                }>
                  {i + 1}
                </span>
                {s === 'credentials' ? 'Identity' : 'API Tokens'}
              </div>
            ))}
          </div>

          <div className="p-6">
            {step === 'credentials' ? (
              <form onSubmit={handleCredentials} className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Enter your workspace credentials to continue.
                  </p>
                  <div className="space-y-3">
                    <Input
                      label="Username"
                      placeholder="your-username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                      autoFocus
                    />
                    <Input
                      label="Password"
                      type={showPw ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      rightIcon={
                        <button
                          type="button"
                          className="pointer-events-auto p-1"
                          onClick={() => setShowPw(!showPw)}
                        >
                          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
                  Continue
                </Button>
              </form>
            ) : (
              <form onSubmit={handleTokenSetup} className="space-y-4">
                <p className="text-sm text-gray-600 mb-1">
                  Connect your API tokens. Tokens are stored locally in your browser.
                </p>

                {/* GitHub Token */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Github className="w-4 h-4 text-gray-800" />
                    <span className="text-sm font-semibold text-gray-800">GitHub</span>
                    <span className="ml-auto text-xs text-red-500 font-medium">Required</span>
                  </div>
                  <Input
                    label="Personal Access Token"
                    type={showTokens.github ? 'text' : 'password'}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    value={tokens.github}
                    onChange={(e) => setTokens((t) => ({ ...t, github: e.target.value }))}
                    hint="Needs repo, workflow scopes"
                    leftIcon={<Key className="w-3.5 h-3.5" />}
                    rightIcon={
                      <button
                        type="button"
                        className="pointer-events-auto"
                        onClick={() => toggleToken('github')}
                      >
                        {showTokens.github ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    }
                  />
                </div>

                {/* Cloudflare Token */}
                <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Cloud className="w-4 h-4 text-cloudflare-orange" />
                    <span className="text-sm font-semibold text-gray-800">Cloudflare</span>
                    <span className="ml-auto text-xs text-gray-400 font-medium">Optional</span>
                  </div>
                  <div className="space-y-2.5">
                    <Input
                      label="API Token"
                      type={showTokens.cloudflare_token ? 'text' : 'password'}
                      placeholder="your-cloudflare-api-token"
                      value={tokens.cloudflare_token}
                      onChange={(e) => setTokens((t) => ({ ...t, cloudflare_token: e.target.value }))}
                      hint="Needs Pages and Workers read/write"
                      leftIcon={<Key className="w-3.5 h-3.5" />}
                      rightIcon={
                        <button
                          type="button"
                          className="pointer-events-auto"
                          onClick={() => toggleToken('cloudflare_token')}
                        >
                          {showTokens.cloudflare_token ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      }
                    />
                    <Input
                      label="Account ID"
                      placeholder="32-char hex account ID"
                      value={tokens.cloudflare_account_id}
                      onChange={(e) => setTokens((t) => ({ ...t, cloudflare_account_id: e.target.value }))}
                    />
                  </div>
                </div>

                {/* OpenAI Token */}
                <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-gray-800">OpenAI</span>
                    <span className="ml-auto text-xs text-gray-400 font-medium">Optional</span>
                  </div>
                  <Input
                    label="API Key"
                    type={showTokens.openai ? 'text' : 'password'}
                    placeholder="sk-xxxxxxxxxxxxxxxxxxxx"
                    value={tokens.openai}
                    onChange={(e) => setTokens((t) => ({ ...t, openai: e.target.value }))}
                    hint="For AI code generation (GPT-4o)"
                    leftIcon={<Key className="w-3.5 h-3.5" />}
                    rightIcon={
                      <button
                        type="button"
                        className="pointer-events-auto"
                        onClick={() => toggleToken('openai')}
                      >
                        {showTokens.openai ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    }
                  />
                </div>

                <div className="flex gap-2.5 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('credentials')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button type="submit" loading={loading} className="flex-1">
                    Launch Dashboard
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Tokens are stored only in your browser's local storage and are never transmitted to any third-party server.
        </p>
      </div>
    </div>
  );
}
