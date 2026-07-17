import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Copy,
  CheckCheck,
  Cloud,
  Zap,
  Code2,
  Trash2,
  Download,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Layout } from '@/components/Layout';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useAuth } from '@/context/AuthContext';
import { generateCode, runCloudflareAI } from '@/services/openai';
import type { AIMessage } from '@/types';
import clsx from 'clsx';

type Provider = 'openai' | 'cloudflare';

const STARTER_PROMPTS = [
  'Create a React component with TypeScript for a user profile card',
  'Write a Cloudflare Worker that proxies API requests with rate limiting',
  'Generate a Tailwind CSS responsive navbar with mobile menu',
  'Write a GitHub Actions workflow for CI/CD with Cloudflare Pages',
  'Create a TypeScript REST API client with error handling',
  'Build a React hook for fetching data with loading & error states',
];

function CodeBlock({ content, language }: { content: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard!');
  }

  function download() {
    const ext = language === 'typescript' ? 'ts' : language === 'javascript' ? 'js' : 'txt';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-code.' + ext;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-950 mt-2">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
        {language && (
          <span className="text-xs text-gray-400 font-mono">{language}</span>
        )}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={download}
            className="p-1.5 rounded text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
            title="Download"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={copy}
            className="p-1.5 rounded text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
            title="Copy"
          >
            {copied ? <CheckCheck className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto p-4 text-sm text-gray-100 font-mono leading-relaxed">
        <code>{content}</code>
      </pre>
    </div>
  );
}

function MessageBubble({ msg }: { msg: AIMessage }) {
  const isUser = msg.role === 'user';
  const isAssistant = msg.role === 'assistant';

  // Parse code blocks from markdown
  const parts = msg.content.split(/(```[\w]*\n[\s\S]*?```)/g);

  return (
    <div className={clsx('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={clsx(
          'max-w-[80%] rounded-2xl',
          isUser
            ? 'bg-primary-600 text-white px-4 py-3'
            : 'bg-white border border-gray-200 shadow-card px-4 py-3 text-gray-800'
        )}
      >
        {parts.map((part, i) => {
          if (part.startsWith('```')) {
            const lines = part.split('\n');
            const lang = lines[0].replace('```', '').trim();
            const code = lines.slice(1, -1).join('\n');
            return <CodeBlock key={i} content={code} language={lang || undefined} />;
          }
          return (
            <p key={i} className={clsx('text-sm whitespace-pre-wrap', isUser ? 'text-white' : 'text-gray-700')}>
              {part}
            </p>
          );
        })}
        {isAssistant && (
          <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
            <Sparkles className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400">AI Generated</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function AICodeGen() {
  const { auth } = useAuth();
  const { openai: openaiKey, cloudflare_token: cfToken, cloudflare_account_id: cfAccountId } = auth.tokens;

  const [provider, setProvider] = useState<Provider>('openai');
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('typescript');

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasOpenAI = !!openaiKey;
  const hasCF = !!(cfToken && cfAccountId);
  const canGenerate = provider === 'openai' ? hasOpenAI : hasCF;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function adjustTextarea() {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
    }
  }

  async function handleSend() {
    const prompt = input.trim();
    if (!prompt || loading) return;
    if (!canGenerate) {
      toast.error('Add your ' + (provider === 'openai' ? 'OpenAI' : 'Cloudflare') + ' API key in Settings');
      return;
    }

    const systemMsg: AIMessage = {
      role: 'system',
      content:
        'You are DevPilot, an expert full-stack developer AI. Generate clean, production-ready ' +
        language +
        ' code. Use markdown code blocks with proper language tags. Be concise but thorough.',
    };

    const userMsg: AIMessage = { role: 'user', content: prompt };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setLoading(true);

    try {
      let response = '';
      if (provider === 'openai') {
        response = await generateCode(openaiKey, [systemMsg, ...history]);
      } else {
        const fullPrompt =
          history.map((m) => m.role.toUpperCase() + ': ' + m.content).join('\n\n');
        response = await runCloudflareAI(cfAccountId, cfToken, fullPrompt);
      }

      const assistantMsg: AIMessage = { role: 'assistant', content: response };
      setMessages([...history, assistantMsg]);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'AI request failed');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function clearConversation() {
    setMessages([]);
  }

  return (
    <Layout>
      <TopBar
        title="AI Code Generator"
        subtitle="Generate production-ready code with OpenAI GPT-4o or Cloudflare AI"
        actions={
          messages.length > 0 ? (
            <Button size="sm" variant="ghost" icon={<Trash2 className="w-3.5 h-3.5" />} onClick={clearConversation}>
              Clear
            </Button>
          ) : undefined
        }
      />

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-200 bg-white">
          {/* Provider selector */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setProvider('openai')}
              className={
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ' +
                (provider === 'openai'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700')
              }
            >
              <Sparkles className="w-3.5 h-3.5 text-green-500" />
              OpenAI GPT-4o
              {!hasOpenAI && <Badge variant="warning" size="sm">No key</Badge>}
            </button>
            <button
              onClick={() => setProvider('cloudflare')}
              className={
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ' +
                (provider === 'cloudflare'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700')
              }
            >
              <Cloud className="w-3.5 h-3.5 text-cloudflare-orange" />
              Cloudflare AI
              {!hasCF && <Badge variant="warning" size="sm">No key</Badge>}
            </button>
          </div>

          {/* Language selector */}
          <div className="flex items-center gap-2 ml-auto">
            <Code2 className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="rust">Rust</option>
              <option value="go">Go</option>
              <option value="bash">Bash</option>
              <option value="sql">SQL</option>
              <option value="html">HTML/CSS</option>
            </select>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center py-10 animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">DevPilot AI</h2>
              <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
                Describe what you want to build and I'll generate production-ready code for you.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="text-left text-xs text-gray-600 p-3 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition-all duration-150"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.filter((m) => m.role !== 'system').map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 shadow-card rounded-2xl px-4 py-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary-500 animate-pulse" />
                <span className="text-sm text-gray-500">Generating code…</span>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"
                      style={{ animationDelay: i * 0.15 + 's' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex items-end gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => { setInput(e.target.value); adjustTextarea(); }}
                onKeyDown={handleKeyDown}
                placeholder="Describe the code you want to generate… (Shift+Enter for newline)"
                className="w-full resize-none rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm px-4 py-3 pr-12 text-gray-800 placeholder:text-gray-400 transition-colors"
              />
            </div>
            <Button
              onClick={handleSend}
              loading={loading}
              disabled={!input.trim() || !canGenerate}
              icon={<Send className="w-4 h-4" />}
              className="flex-shrink-0 h-11"
            >
              Generate
            </Button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            {provider === 'openai' ? 'Using GPT-4o via OpenAI API' : 'Using Llama 3.1 via Cloudflare AI'}
          </p>
        </div>
      </div>
    </Layout>
  );
}
