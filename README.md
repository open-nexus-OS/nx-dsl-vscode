# Nexus DSL (.nx) Language Support for VS Code

Editor support for the `.nx` DSL used by the open-nexus-OS project (declarative UI apps: stores, events, effects, pages, components, routes, queries).

## Status

This is an early scaffold. Currently included:

- Basic language registration for `.nx` files (comments, bracket matching, auto-closing pairs).
- Placeholder syntax highlighting (comments + strings only).

Planned next (see the project's effort-estimation plan):

- Full TextMate grammar covering the `.nx` v1 grammar (keywords, modifier chains, `$state`/`$props`/`device.*` sigils, literals).
- Format-on-save wired to the `nx-dsl fmt` compiler command.
- Diagnostics wired to `nx-dsl lint`/`check`.
- Hover/completion hints, eventually a real language server.

## Development

```
npm install
npm run compile
```

Then press `F5` in VS Code to launch an Extension Development Host with this extension loaded.

## Publishing

See [PUBLISHING.md](./PUBLISHING.md) for how to set up a Marketplace publisher account and release a new version.
