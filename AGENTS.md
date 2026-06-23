# Repository Guidelines

## Project Structure & Module Organization

This is a WXT-powered Vue browser extension. Extension entry points live in `entrypoints/`: `background.ts` handles background behavior, while `popup/` and `options/` contain their own Vue apps, pages, styles, and routing. Shared UI belongs in `components/`, reusable logic in `composables/`, Pinia stores in `stores/`, constants in `constants/`, utilities in `utils/`, shared types in `types/`, and global styles in `styles/`. Static assets live in `assets/` and `public/`; localized messages are in `locales/*.yaml`. Tests are in `tests/`. Generated output in `dist/` must not be edited by hand.

## Build, Test, and Development Commands

Use pnpm 11 as pinned in `package.json`.

- `pnpm install --frozen-lockfile`: install dependencies reproducibly.
- `pnpm run dev`: start WXT development for Chromium.
- `pnpm run dev:firefox`: start WXT development for Firefox.
- `pnpm run test`: run Vitest.
- `pnpm run lint`: run ESLint.
- `pnpm run typecheck`: run `vue-tsc --build`.
- `pnpm run build`: build the Chromium extension.
- `pnpm run build:firefox`: build the Firefox extension.
- `pnpm run zip` / `pnpm run zip:firefox`: package release archives.

## Coding Style & Naming Conventions

Write TypeScript and Vue 3 SFCs with Composition API and `<script setup>`. Keep components PascalCase, such as `EditorResult.vue`, composables camelCase, such as `fileHandler.ts`, and stores/constants named by domain. UI primitives under `components/ui/` follow shadcn-vue patterns. Formatting uses `@ntnyq/prettier-config`; linting uses `@ntnyq/eslint-config`. Let ESLint and the pre-commit `nano-staged` hook handle mechanical formatting.

Use multiline TSDoc blocks (`/** ... */`) for TypeScript methods, functions, classes, interfaces, object-shaped type aliases, and exported constants in `types/` and `utils/`. Every property inside an interface or object-shaped type must have its own TSDoc block, including nested parameter object properties.

## Testing Guidelines

Use Vitest for unit tests. Place tests in `tests/` with `*.test.ts` names, and prefer behavior-focused cases such as `workspaceStore.test.ts` or `optionsPreset.test.ts`. For code changes, run `pnpm run test`, `pnpm run lint`, and `pnpm run typecheck`; for extension or UI changes, also run the relevant build command and manually verify the affected popup/options flow.

## Commit & Pull Request Guidelines

Git history uses Conventional Commit-style messages, for example `fix: address workspace review findings` or `refactor: migrate panels to shadcn sheets`. Keep commits scoped and imperative. Pull requests should explain the change, link related issues when available, list validation commands, and include screenshots or recordings for visible UI updates.

## Agent-Specific Instructions

When running shell commands as an agent in this repository, prefix them with `rtk`, for example `rtk pnpm run lint` or `rtk git status`.
