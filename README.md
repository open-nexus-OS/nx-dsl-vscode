# Nexus DSL (.nx) Language Support for VS Code

Editor support for the `.nx` DSL used by the open-nexus-OS project (declarative UI apps: stores, events, effects, pages, components, routes, queries).

## Status

Currently included:

- Language registration for `.nx` files (comments, bracket matching, auto-closing pairs).
- A TextMate grammar covering the `.nx` v1 surface: declarations (`Store`/`Event`/`reduce`/`Page`/`Component`/`Routes`/`Window`/`Query`), control keywords, `$state`/`$props`/`@effect`/`@t`/`@persist` sigils, modifier-call highlighting (`.foo(...)`), operators, numeric/string/boolean literals, and capitalized identifiers as types.
- Format-on-save-style formatting wired to `nx-dsl fmt` (via `vscode.languages.registerDocumentFormattingEditProvider`).
- Diagnostics wired to `nx-dsl lint` (parses the CLI's `path:line:col: severity[code]: message` output into squiggles, updates on open/edit/save).

This extension shells out to the `nx-dsl` CLI binary from the [open-nexus-OS](https://github.com/open-nexus-OS) monorepo — it is not bundled, since it isn't published anywhere yet. Build it yourself:

```
cargo build -p nx-dsl   # inside the open-nexus-OS repo
```

Then either put the resulting binary on your `PATH` as `nx-dsl`, or point the extension at it via the `nxDsl.executablePath` setting.

Planned next (see the project's effort-estimation plan):

- Hover text for diagnostic codes (`nx-dsl explain`) and static modifier/keyword completion.
- A real language server (semantic hover, go-to-definition, contextual completion).

## Development

```
npm install
npm run compile
```

Then press `F5` in VS Code to launch an Extension Development Host with this extension loaded. Set `nxDsl.executablePath` in that workspace to your locally built `nx-dsl` binary.

## Publishing

See [PUBLISHING.md](./PUBLISHING.md) for how to set up a Marketplace publisher account and release a new version.
