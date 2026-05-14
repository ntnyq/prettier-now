# AGENTS.md

This repository is a `pnpm`-managed browser extension built with WXT, Vue 3, Pinia, UnoCSS, and CodeMirror.

## Start Here

Read these files before making non-trivial changes:

1. [README.md](README.md)
2. [package.json](package.json)
3. [wxt.config.ts](wxt.config.ts)
4. [stores/editor.ts](stores/editor.ts)
5. [utils/format.ts](utils/format.ts)
6. [utils/cache.ts](utils/cache.ts)
7. [composables/storage.ts](composables/storage.ts)
8. [entrypoints/background.ts](entrypoints/background.ts)

## Commands

- `pnpm dev`: run the Chromium extension in dev mode
- `pnpm dev:firefox`: run the Firefox extension in dev mode
- `pnpm build`: production build for Chromium
- `pnpm build:firefox`: production build for Firefox
- `pnpm typecheck`: run `vue-tsc --build`
- `pnpm lint`: run ESLint
- `pnpm zip`: build distributable archive

Use `pnpm typecheck` after TypeScript, Vue SFC, store, config, or composable changes.
Use `pnpm lint` after code edits.
Use `pnpm build` when changing WXT config, entrypoints, plugin loading, or extension packaging behavior.

## Architecture

- `entrypoints/background.ts`: background service worker, context menu, command wiring
- `entrypoints/options/`: main application UI with Vue Router
- `entrypoints/popup/`: lightweight popup entry
- `stores/`: Pinia composition stores; `stores/editor.ts` is the main formatting workflow coordinator
- `utils/format.ts`: dynamic Prettier loading and formatting
- `utils/cache.ts`: lazy CodeMirror language and Prettier plugin caches
- `composables/storage.ts`: WXT storage wrapper used for persisted settings

## Conventions

- Use Vue 3 Composition API and existing store/composable patterns.
- Keep route and entrypoint components thin; move reusable logic into `stores/`, `composables/`, or focused components.
- Prefer existing setter methods on stores when they exist instead of mutating store refs ad hoc.
- The `@/` alias points to the repository root, not a `src/` directory.
- Formatting and linting are opinionated via [eslint.config.mjs](eslint.config.mjs) and [prettier.config.mjs](prettier.config.mjs).
- TypeScript is strict enough to surface index-signature and unchecked-access issues; avoid papering over them with broad casts.

## Gotchas

- `wxt prepare` generates `.wxt/`; do not hand-edit generated files there unless the task is specifically about generated output.
- `composables/storage.ts` syncs persisted values asynchronously, so defaults may exist briefly before storage hydration completes.
- `utils/format.ts` and `utils/cache.ts` rely on dynamic imports; changes there should be validated with both `pnpm typecheck` and `pnpm build`.
- WXT and Vite types can drift between direct and transitive dependencies. Keep config typing changes local and minimal unless you are intentionally aligning dependency versions.
- There is no dedicated test suite in this repository right now; validation is primarily `typecheck`, `lint`, and `build`.

## Editing Guidance

- Prefer focused changes over broad refactors.
- Preserve the browser-extension entrypoint split instead of moving logic across background, popup, and options surfaces without need.
- When changing supported languages or formatting behavior, inspect both [constants/language.ts](constants/language.ts) and [utils/cache.ts](utils/cache.ts).
- When changing user-facing settings, inspect both `stores/config.ts` or `stores/options.ts` and the matching UI in `entrypoints/options/pages/`.
