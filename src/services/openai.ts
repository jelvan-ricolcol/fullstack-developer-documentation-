import axios from 'axios';
import type { AIMessage } from '@/types';

const OPENAI_BASE = 'https://api.openai.com/v1';

export async function generateCode(
  apiKey: string,
  messages: AIMessage[],
  model = 'gpt-4o'
): Promise<string> {
  const { data } = await axios.post(
    OPENAI_BASE + '/chat/completions',
    {
      model,
      messages,
      temperature: 0.2,
      max_tokens: 4096,
    },
    {
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
    }
  );
  return data.choices?.[0]?.message?.content ?? '';
}

export async function runCloudflareAI(
  accountId: string,
  token: string,
  prompt: string,
  model = '@cf/meta/llama-3.1-8b-instruct'
): Promise<string> {
  const { data } = await axios.post(
    'https://api.cloudflare.com/client/v4/accounts/' + accountId + '/ai/run/' + model,
    {
      messages: [
        {
          role: 'system',
          content:
            'You are DevPilot, an expert AI coding assistant. Provide clean, production-ready code with concise explanations.',
        },
        { role: 'user', content: prompt },
      ],
    },
    {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  );
  return data.result?.response ?? '';
}
