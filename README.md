# Nexus DSL (.nx) Language Support for VS Code

Editor support for the `.nx` DSL used by the open-nexus-OS project (declarative UI apps: stores, events, effects, pages, components, routes, queries).

## Status

Currently included:

- Language registration for `.nx` files (comments, bracket matching, auto-closing pairs).
- A TextMate grammar covering the `.nx` v1 surface: declarations (`Store`/`Event`/`reduce`/`Page`/`Component`/`Routes`/`Window`/`Query`), control keywords, `$state`/`$props`/`@effect`/`@t`/`@persist` sigils, modifier-call highlighting (`.foo(...)`), operators, numeric/string/boolean literals, and capitalized identifiers as types.
- Format-on-save-style formatting wired to `nx-dsl fmt` (via `vscode.languages.registerDocumentFormattingEditProvider`).
- Diagnostics wired to `nx-dsl lint` (parses the CLI's `path:line:col: severity[code]: message` output into squiggles, updates on open/edit/save).
- Hover: on a diagnostic squiggle, shows the full explanation from `nx-dsl explain`; on a `.modifier(...)` call, shows its arguments and meaning (from a hand-transcribed copy of `docs/dev/dsl/modifiers.md`).
- Completion: after `.` on a widget node, suggests the modifier catalog (with snippet placeholders); otherwise suggests declaration/control keywords.
- Snippets for common skeletons: `store`, `event`, `reduce`, `effect`, `page`, `component`, `routes`, `query`, `window`.

This extension shells out to the `nx-dsl` CLI binary from the [open-nexus-OS](https://github.com/open-nexus-OS) monorepo — it is not bundled, since it isn't published anywhere yet. Build it yourself:

```
cargo build -p nx-dsl   # inside the open-nexus-OS repo
```

Then either put the resulting binary on your `PATH` as `nx-dsl`, or point the extension at it via the `nxDsl.executablePath` setting.

Known limitation: completion decides "modifier vs. keyword" from the raw text before the cursor (does it end in `.identifier`?), so it can't tell `$state.foo` (a field access) from `widget.foo(` (a modifier call) — it will offer modifier names after `$state.` too. Fixing that needs real parsing, which is language-server territory (see below).

Planned next (see the project's effort-estimation plan):

- A real language server (semantic hover, go-to-definition, contextual completion that understands `$state`/`$props`/`svc.*` vs. modifier-call position).

## Development

```
npm install
npm run compile
```

Then press `F5` in VS Code to launch an Extension Development Host with this extension loaded. Set `nxDsl.executablePath` in that workspace to your locally built `nx-dsl` binary.

## Publishing

See [PUBLISHING.md](./PUBLISHING.md) for how to set up a Marketplace publisher account and release a new version.
