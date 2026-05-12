import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext): void {
  const command = vscode.commands.registerCommand('codeTutor.explain', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('Code Tutor: Kein aktiver Editor gefunden.');
      return;
    }

    const selection = editor.selection;
    if (selection.isEmpty) {
      vscode.window.showWarningMessage('Code Tutor: Bitte zuerst Code markieren.');
      return;
    }

    const code = editor.document.getText(selection);
    const language = editor.document.languageId;

    vscode.window.showInformationMessage(
      `Code Tutor: ${language} – ${code.length} Zeichen markiert.`
    );
  });

  context.subscriptions.push(command);
}

export function deactivate(): void {}