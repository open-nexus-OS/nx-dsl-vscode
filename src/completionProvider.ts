import * as vscode from 'vscode';
import { MODIFIERS } from './modifiers';
import { CONTROL_KEYWORDS, DECLARATION_KEYWORDS, OTHER_KEYWORDS } from './keywords';

const KEYWORDS = [...DECLARATION_KEYWORDS, ...CONTROL_KEYWORDS, ...OTHER_KEYWORDS];

export function createCompletionItemProvider(): vscode.CompletionItemProvider {
  return {
    provideCompletionItems(document, position) {
      const linePrefix = document.lineAt(position.line).text.slice(0, position.character);
      if (/\.[A-Za-z_]*$/.test(linePrefix)) {
        return MODIFIERS.map((m) => {
          const item = new vscode.CompletionItem(m.name, vscode.CompletionItemKind.Method);
          item.detail = `.${m.name}(${m.args})`;
          item.documentation = new vscode.MarkdownString(m.meaning);
          const firstArg = m.args.split(',')[0]?.trim() || '';
          item.insertText = new vscode.SnippetString(`${m.name}(\${1:${firstArg}})`);
          return item;
        });
      }

      return KEYWORDS.map((k) => {
        const item = new vscode.CompletionItem(k.name, vscode.CompletionItemKind.Keyword);
        item.detail = k.detail;
        return item;
      });
    },
  };
}
