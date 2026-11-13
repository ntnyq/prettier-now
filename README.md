# prettier-now

> :hammer: Yet another [prettier](https://prettier.io) browser extension.

[![CI](https://github.com/ntnyq/prettier-now/workflows/CI/badge.svg)](https://github.com/ntnyq/prettier-now/actions)
[![LICENSE](https://img.shields.io/github/license/ntnyq/prettier-now.svg)](https://github.com/ntnyq/prettier-now/blob/main/LICENSE)

## Install

[link-chrome]: https://chromewebstore.google.com/detail/prettier-now/jdclalpfpcpojbhnkjebiepeeegmlhdf 'Version published on Chrome Web Store'
[link-firefox]: https://addons.mozilla.org/zh-CN/firefox/addon/prettier-now 'Version published to Mozilla Addons'

[<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/chrome/chrome.svg" width="48" alt="Chrome" valign="middle">][link-chrome] [<img valign="middle" src="https://img.shields.io/chrome-web-store/v/jdclalpfpcpojbhnkjebiepeeegmlhdf.svg?label=%20" alt="version">][link-chrome] and other Chromium browsers

[<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/firefox/firefox.svg" width="48" alt="Chrome" valign="middle">][link-firefox] [<img valign="middle" src="https://img.shields.io/amo/v/prettier-now.svg?label=%20" alt="version">][link-firefox]

## Features

- ✨ Format source code with customizable Prettier options
- 📥 Drag and drop files into the formatter
- 📁 Select one or more files to format
- 📋 Paste files directly into the workspace
- 🖱️ Open Prettier Now actions from browser context menus
- 🎯 Format the focused editor directly from the context menu or extension command
- ⚡ Open the options page from the popup, context menu, or `Alt+O`
- 🧩 Edit source and formatted output side by side with CodeMirror-powered editors
- 🧠 Select languages manually or infer them from file names and focused editor context
- 📦 Batch format multiple selected, dropped, or pasted files with a file job list
- 📤 Copy formatted output, download the current result, or download all formatted files
- 🔍 View line-by-line diffs between source and formatted result
- 🕘 Keep format history that can restore previous results
- 🧾 Inspect runtime logs for successful formats and formatter errors
- 💾 Save, apply, delete, import, export, and reset formatting option presets
- 🔧 Configure core Prettier options plus XML, PHP, Java, Svelte, and TOML plugin options
- 🎛️ Toggle source/result layouts, color mode, toast verbosity, debug logging, auto-format, and theme color
- 🌐 Localized UI for English, Simplified Chinese, Traditional Chinese, Japanese, and Korean

## Supported languages

### Built-in language plugins

- JavaScript
- TypeScript
- HTML
- Vue
- Angular
- CSS
- Less
- SCSS
- GraphQL
- JSON
- YAML
- Markdown

### Official language plugins

- XML (via [@prettier/plugin-xml](https://github.com/prettier/plugin-xml))
- PHP (via [@prettier/plugin-php](https://github.com/prettier/plugin-php))
- Pug (via [@prettier/plugin-pug](https://github.com/prettier/plugin-pug))

### Community language plugins

- Java (via [prettier-plugin-java](https://github.com/jhipster/prettier-java))
- Svelte (via [prettier-plugin-svelte](https://github.com/sveltejs/prettier-plugin-svelte))
- TOML (via [prettier-plugin-toml ](https://github.com/un-ts/prettier/tree/master/packages/toml))

TOML settings expose Tombi's 17 plugin options. Select **Default** to use the
formatter default; string quotes and inline table spacing inherit `SingleQuote`
and `BracketSpacing` unless explicitly overridden. Existing Taplo preferences and
version 1 option presets migrate automatically where an equivalent setting exists.
Array auto-collapse/expansion and key sorting have no equivalent. Blank-line
limits migrate to `GroupBlankLinesLimit`, clamped to its supported range of 1–255.
New exports use snapshot version 2.

## Screenshots

![light](./screenshots/light.png)

![dark](./screenshots/dark.png)

## Development

Install dependencies with `pnpm install --frozen-lockfile`, then run `pnpm run dev`
for Chromium or `pnpm run dev:firefox` for Firefox.

Validate changes with `pnpm run test`, `pnpm run lint`, and `pnpm run typecheck`.
Build both browser targets with `pnpm run build` and `pnpm run build:firefox`.

Workspace components live in `components/workspace/`; settings and presets live
in `components/settings/`. The workspace store coordinates formatting jobs and
rejects stale results, while the history store owns persisted history. UI command
notifications and downloads belong to `composables/workspaceActions.ts`.

Prettier plugin loading and CodeMirror language loading are independent. Shared
option values and schemas drive the settings store, presets, and the webpage
formatter. Existing per-option storage keys and version 1 preset migration remain
supported.

History and preset mutations use origin-scoped Web Locks to serialize updates
across extension pages while keeping the existing storage keys and array format.
Explicit settings commands report success after persistence completes; storage
failures remain visible and can be retried. Each batch uses one settings snapshot.

Nested TOML setting edits merge under the same per-key lock; applying or resetting
options replaces the full TOML configuration. The webpage formatter reads legacy
preferences without writing migrations, so a failed repair does not block reading
valid settings. Unrecognized history and preset data is preserved rather than
silently replaced by a new entry.

History retains up to 50 entries with a 4 MiB serialized budget. Entries larger
than 128 KiB of combined source and output, and older bodies beyond the total
budget, retain metadata without restorable code.

## Credits

- UI design from [AST Explorer](https://ast-explorer.dev/) created by [sxzz](https://github.com/sxzz)
- Built on top of [WXT](https://wxt.dev), the next-gen web extension framework

## License

[MIT](./LICENSE) License © 2024 to PRESENT [ntnyq](https://github.com/ntnyq)
