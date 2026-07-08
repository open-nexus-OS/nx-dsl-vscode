import * as vscode from 'vscode';
import { explainCode } from './nxDslCli';
import { MODIFIERS } from './modifiers';

export function createHoverProvider(getCliPath: () => string): vscode.HoverProvider {
  return {
    async provideHover(document, position) {
      const diagnostic = vscode.languages
        .getDiagnostics(document.uri)
        .find((d) => d.source === 'nx-dsl' && d.range.contains(position));
      if (diagnostic?.code) {
        const code = String(typeof diagnostic.code === 'object' ? diagnostic.code.value : diagnostic.code);
        try {
          const explanation = await explainCode(getCliPath(), code);
          if (explanation) {
            return new vscode.Hover(new vscode.MarkdownString(`**${code}**: ${explanation}`), diagnostic.range);
          }
        } catch {
          // Missing-binary UX is already surfaced by the formatter/linter; stay quiet here.
        }
      }

      const range = document.getWordRangeAtPosition(position, /[A-Za-z_][A-Za-z0-9_]*/);
      if (range && range.start.character > 0) {
        const before = document.getText(new vscode.Range(range.start.translate(0, -1), range.start));
        if (before === '.') {
          const modifier = MODIFIERS.find((m) => m.name === document.getText(range));
          if (modifier) {
            return new vscode.Hover(
              new vscode.MarkdownString(`\`.${modifier.name}(${modifier.args})\`\n\n${modifier.meaning}`),
              range,
            );
          }
        }
      }
      return null;
    },
  };
}
