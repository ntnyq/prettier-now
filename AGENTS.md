# Repository Guidelines

## Project Structure & Module Organization

This is a WXT-powered Vue browser extension. Extension entry points live in `entrypoints/`: `background.ts` handles background work, while `popup/` and `options/` contain their own HTML, Vue apps, router, pages, and styles. Shared UI belongs in `components/`, reusable composition logic in `composables/`, Pinia stores in `stores/`, constants in `constants/`, utility functions in `utils/`, and shared types in `types/`. Static source assets are in `assets/`; generated extension output goes to `dist/` and should not be edited by hand. Screenshots used by the README are in `screenshots/`, and localized messages are in `locales/*.yaml`.

## Build, Test, and Development Commands

Use pnpm 11 (`packageManager` is pinned in `package.json`).

- `pnpm install --frozen-lockfile`: install dependencies reproducibly.
- `pnpm run dev`: start WXT development for Chromium.
- `pnpm run dev:firefox`: start WXT development for Firefox.
- `pnpm run build`: build the Chromium extension into `dist/`.
- `pnpm run build:firefox`: build the Firefox variant.
- `pnpm run lint`: run ESLint across the project.
- `pnpm run typecheck`: run `vue-tsc --build`.
- `pnpm run zip` / `pnpm run zip:firefox`: package release zips.

CI runs install, build, lint, and typecheck on pushes and pull requests to `main`.

## Coding Style & Naming Conventions

Write TypeScript and Vue 3 SFCs using existing Composition API patterns. Keep components PascalCase (`EditorResult.vue`, `IconButton.vue`), composables camelCase (`fileHandler.ts`, `storage.ts`), and stores/constants named by domain. Formatting is governed by `@ntnyq/prettier-config`; linting uses `@ntnyq/eslint-config` with SVGO enabled. Let `eslint --fix` or the pre-commit `nano-staged` hook handle mechanical formatting.

## Testing Guidelines

There is currently no dedicated test script or test directory. For changes, at minimum run `pnpm run lint`, `pnpm run typecheck`, and the relevant build command. For UI or extension behavior changes, manually verify the affected popup/options flow in the WXT dev browser and include what you checked in the PR.

## Commit & Pull Request Guidelines

History uses Conventional Commit-style messages such as `feat: add fully i18n support`, `fix: ...`, and `chore(deps): ...`. Keep commits scoped and imperative. Pull requests should describe the change, link related issues when available, note validation commands, and include screenshots or recordings for visible UI changes.

## Agent-Specific Instructions

When running shell commands as an agent in this repository, prefix them with `rtk`, for example `rtk pnpm run lint` or `rtk git status`.
