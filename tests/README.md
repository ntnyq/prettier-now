# Tests

Group tests by the module they exercise and keep descriptive `*.test.ts` names.

| Directory | Scope |
| --- | --- |
| `components/` | Vue component rendering, bindings, and interactions |
| `composables/` | Reusable reactive logic |
| `constants/` | Shared metadata and constant definitions |
| `entrypoints/` | Extension entry points, commands, and runtime boundaries |
| `integration/` | Browser bundle and dependency integration |
| `stores/` | Pinia state and actions |
| `utils/` | Shared utilities and formatting logic |
| `helpers/` | Reusable test helpers and component stubs |
| `mocks/` | Module mocks configured in `vitest.config.ts` |

Run all tests with `pnpm run test`, or a group with
`pnpm run test tests/components`.
