import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext): void {
  const command = vscode.commands.registerCommand('codeTutor.explain', () => {
    vscode.window.showInformationMessage('Code Tutor ist aktiv!');
  });
  context.subscriptions.push(command);
}

export function deactivate(): void {}