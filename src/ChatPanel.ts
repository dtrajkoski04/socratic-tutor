import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class ChatPanel {
  static current: ChatPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;

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
      }
    );

    ChatPanel.current = new ChatPanel(panel, extensionUri);
    return ChatPanel.current;
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._panel.webview.html = this._getHtml();

    this._panel.onDidDispose(() => {
      ChatPanel.current = undefined;
    });
  }

  startSession(code: string, language: string): void {
    this._panel.reveal(vscode.ViewColumn.Beside);
  }

  private _getHtml(): string {
    const templatePath = path.join(this._extensionUri.fsPath, 'media', 'chat.html');
    return fs.readFileSync(templatePath, 'utf8');
  }
}