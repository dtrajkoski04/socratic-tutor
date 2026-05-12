import OpenAI from 'openai';
import * as vscode from 'vscode';
import { SOCRATIC_TUTOR_PROMPT } from './prompts';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function getClient(): OpenAI {
  const config = vscode.workspace.getConfiguration('codeTutor');
  const apiKey = config.get<string>('openaiApiKey', '');
  if (!apiKey) {
    throw new Error(
      'Kein OpenAI API Key konfiguriert. Bitte in den VS Code Einstellungen unter "codeTutor.openaiApiKey" eintragen.'
    );
  }
  return new OpenAI({ apiKey });
}

export async function sendMessage(
  history: ChatMessage[],
  _codeSnippet: string,
  _language: string
): Promise<string> {
  const client = getClient();
  const config = vscode.workspace.getConfiguration('codeTutor');
  const model = config.get<string>('model', 'gpt-4o');

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SOCRATIC_TUTOR_PROMPT },
    ...history.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  ];

  const completion = await client.chat.completions.create({
    model,
    messages,
    temperature: 0.4,
    max_tokens: 600,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Leere Antwort vom Modell erhalten.');
  }
  return content;
}