import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { sendMessage, ChatMessage } from './openaiClient';

export class ChatPanel {
  static current: ChatPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _history: ChatMessage[] = [];
  private _currentCode = '';
  private _currentLanguage = '';

  static createOrShow(extensionUri: vscode.Uri): ChatPanel {
    const column = vscode.ViewColumn.Beside;

    if (ChatPanel.current) {
      ChatPanel.current._panel.reveal(column);
      return ChatPanel.current;
    }

    const panel = vscode.window.createWebviewPanel(
      'codeTutor',
      'Code Tutor',
      column,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')],
        retainContextWhenHidden: true,
      }
    );

    ChatPanel.current = new ChatPanel(panel, extensionUri);
    return ChatPanel.current;
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._panel.webview.html = this._getHtml();

    this._panel.webview.onDidReceiveMessage(async (msg) => {
      if (msg.type === 'userMessage') {
        await this._handleUserMessage(msg.text);
      } else if (msg.type === 'newSession') {
        this._resetSession();
      }
    });

    this._panel.onDidDispose(() => {
      ChatPanel.current = undefined;
    });
  }

  startSession(code: string, language: string): void {
    this._currentCode = code;
    this._currentLanguage = language;
    this._history = [];
    this._panel.reveal(vscode.ViewColumn.Beside);
    this._panel.webview.postMessage({
      type: 'init',
      code,
      language,
    });
    this._askFirst();
  }

  private async _askFirst(): Promise<void> {
    const firstUserMessage = `Ich habe folgenden Code markiert und möchte ihn verstehen:\n\`\`\`${this._currentLanguage}\n${this._currentCode}\n\`\`\``;
    this._history.push({ role: 'user', content: firstUserMessage });

    try {
      const response = await sendMessage(this._history, this._currentCode, this._currentLanguage);
      this._history.push({ role: 'assistant', content: response });
      this._panel.webview.postMessage({ type: 'aiResponse', text: response });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this._panel.webview.postMessage({ type: 'error', text: msg });
    }
  }

  private async _handleUserMessage(text: string): Promise<void> {
    this._history.push({ role: 'user', content: text });
    try {
      const response = await sendMessage(this._history, this._currentCode, this._currentLanguage);
      this._history.push({ role: 'assistant', content: response });
      this._panel.webview.postMessage({ type: 'aiResponse', text: response });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this._panel.webview.postMessage({ type: 'error', text: msg });
    }
  }

  private _resetSession(): void {
    this._history = [];
    this._currentCode = '';
    this._currentLanguage = '';
    this._panel.webview.postMessage({ type: 'reset' });
  }

  private _getHtml(): string {
    const nonce = crypto.randomBytes(16).toString('hex');
    const cssUri = this._panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'chat.css')
    );
    const cspSource = this._panel.webview.cspSource;

    const templatePath = path.join(this._extensionUri.fsPath, 'media', 'chat.html');
    let html = fs.readFileSync(templatePath, 'utf8');
    html = html
      .replace(/{{nonce}}/g, nonce)
      .replace(/{{cssUri}}/g, cssUri.toString())
      .replace(/{{cspSource}}/g, cspSource);

    return html;
  }
}