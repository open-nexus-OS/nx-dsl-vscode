import * as vscode from 'vscode';
import { formatSource, lintSource, NxDslCliError } from './nxDslCli';
import { createHoverProvider } from './hoverProvider';
import { createCompletionItemProvider } from './completionProvider';

const NX_LANGUAGE = 'nx';

function getCliPath(): string {
  return vscode.workspace.getConfiguration('nxDsl').get<string>('executablePath', 'nx-dsl');
}

let warnedMissingCli = false;

function reportCliMissing(error: NxDslCliError) {
  if (warnedMissingCli) return;
  warnedMissingCli = true;
  vscode.window
    .showWarningMessage(
      `${error.message}. Set "nxDsl.executablePath" to your built nx-dsl binary.`,
      'Open Settings',
    )
    .then((choice) => {
      if (choice === 'Open Settings') {
        vscode.commands.executeCommand('workbench.action.openSettings', 'nxDsl.executablePath');
      }
    });
}

export function activate(context: vscode.ExtensionContext) {
  const diagnostics = vscode.languages.createDiagnosticCollection(NX_LANGUAGE);
  context.subscriptions.push(diagnostics);

  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider(NX_LANGUAGE, {
      async provideDocumentFormattingEdits(document) {
        try {
          const formatted = await formatSource(getCliPath(), document.getText());
          if (formatted === undefined) return [];
          const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(document.getText().length),
          );
          return [vscode.TextEdit.replace(fullRange, formatted)];
        } catch (error) {
          if (error instanceof NxDslCliError) {
            reportCliMissing(error);
            return [];
          }
          throw error;
        }
      },
    }),
    vscode.languages.registerHoverProvider(NX_LANGUAGE, createHoverProvider(getCliPath)),
    vscode.languages.registerCompletionItemProvider(NX_LANGUAGE, createCompletionItemProvider(), '.'),
  );

  async function updateDiagnostics(document: vscode.TextDocument) {
    if (document.languageId !== NX_LANGUAGE) return;
    try {
      const found = await lintSource(getCliPath(), document.getText());
      diagnostics.set(
        document.uri,
        found.map((d) => {
          const line = Math.max(0, d.line - 1);
          const col = Math.max(0, d.column - 1);
          const range = document.validateRange(new vscode.Range(line, col, line, col + 1));
          const diagnostic = new vscode.Diagnostic(
            range,
            d.message,
            d.severity === 'error' ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning,
          );
          diagnostic.source = 'nx-dsl';
          diagnostic.code = d.code;
          return diagnostic;
        }),
      );
    } catch (error) {
      if (error instanceof NxDslCliError) {
        reportCliMissing(error);
        return;
      }
      throw error;
    }
  }

  const debounced = new Map<string, ReturnType<typeof setTimeout>>();
  function scheduleLint(document: vscode.TextDocument) {
    if (document.languageId !== NX_LANGUAGE) return;
    const key = document.uri.toString();
    clearTimeout(debounced.get(key));
    debounced.set(
      key,
      setTimeout(() => updateDiagnostics(document), 300),
    );
  }

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(updateDiagnostics),
    vscode.workspace.onDidSaveTextDocument(updateDiagnostics),
    vscode.workspace.onDidChangeTextDocument((e) => scheduleLint(e.document)),
    vscode.workspace.onDidCloseTextDocument((doc) => diagnostics.delete(doc.uri)),
  );

  for (const document of vscode.workspace.textDocuments) {
    void updateDiagnostics(document);
  }
}

export function deactivate() {}
