# shadcn-vue and Tailwind Redesign

## Context

`prettier-now` is a WXT-powered Vue browser extension. The current UI uses UnoCSS, local UI components, `floating-vue` for dropdowns/tooltips, and `vercel-toast` for feedback. The options page is a separate route, while the home page is the main formatting workspace.

The redesign will migrate the UI foundation to Tailwind CSS and shadcn-vue while keeping core formatting behavior stable.

## Goals

- Replace UnoCSS with Tailwind CSS.
- Replace local `components/ui` primitives with shadcn-vue component implementations.
- Replace local dialog, modal, dropdown, select, number input, button, tooltip, switch, and toast patterns with shadcn-vue equivalents.
- Move the full options experience into a right-side settings drawer opened from the home workspace.
- Rework the action bar so formatting is the primary action and secondary actions are visually subordinate.
- Improve layout hierarchy so the main editing and formatting workflow has the highest visual weight.

## Non-Goals

- Do not change the core Prettier formatting behavior.
- Do not change option persistence semantics.
- Do not remove batch file formatting or history/log/diff features.
- Do not redesign the popup entrypoint unless required by shared UI changes.
- Do not introduce a separate design system wrapper that hides shadcn-vue conventions.

## Architecture

The project will migrate to Tailwind CSS v4 and shadcn-vue.

`wxt.config.ts` will remove the WXT UnoCSS module and add Tailwind through Vite. `uno.config.ts` will be removed. `entrypoints/options/style.css` will become the global style entry for Tailwind and shadcn theme tokens, while preserving project-specific scrollbar styling and color-mode view transitions.

The `components/ui` directory will follow shadcn-vue component layout. Expected component groups include:

- `button`
- `dialog`
- `sheet`
- `dropdown-menu`
- `select`
- `number-field`
- `switch`
- `tooltip`
- `sonner`
- `accordion` or an equivalent shadcn-vue disclosure component for settings groups
- `command` or combobox support for long searchable option lists

Dependencies that become obsolete after the migration should be removed, including UnoCSS packages, `floating-vue`, and `vercel-toast`.

The existing `/options` route can remain as a compatibility route, but it should render the same settings content used by the drawer. It must not keep a separate copy of the options UI.

## Layout

Home remains the primary workspace:

- Top navigation contains brand, language, timing, panel entries, settings, theme, and more actions.
- The main workspace keeps the current file list, source editor, and result editor roles.
- The bottom action bar becomes a high-signal command surface with one primary action.

Settings move into a right-side shadcn-vue `Sheet`:

- The sheet opens from the settings button in the navbar.
- Width should be approximately `min(720px, 92vw)` on desktop and fit mobile widths.
- Content is full height and scrollable.
- The header contains a clear title and close affordance without promotional copy.
- Presets appear first.
- Prettier core options are the most prominent settings group.
- XML, PHP, Java, Svelte, TOML, and user config groups are organized below with clear section boundaries.

## Action Bar

`components/ActionBar.vue` will be replaced or refactored into `components/workspace/WorkspaceActionBar.vue`.

The new action bar will use:

- A primary `Format` button with the strongest visual weight.
- Secondary icon buttons for common actions such as selecting files, copying result, and downloading result.
- A `DropdownMenu` for lower-frequency actions such as clearing all and downloading all.

The existing behavior should remain stable:

- Select file still opens a multi-file dialog and loads files.
- Clear all still clears the workspace.
- Copy result still copies the active result and reports feedback.
- Download result and download all still call the existing workspace store methods.
- Format still calls `formatActiveJob`.

Where practical, unavailable actions may be shown as disabled. Toast feedback should still cover no-op cases to preserve current behavioral clarity.

## Components

Route and shell components should stay thin:

- `entrypoints/options/pages/home.vue` composes the workspace and renders the settings sheet.
- `entrypoints/options/pages/options.vue` reuses the same settings content for compatibility.
- `Navbar` emits or triggers the settings sheet instead of routing away from the workspace.

New domain components:

- `components/settings/SettingsSheet.vue`: owns the shadcn `Sheet` shell and renders settings content.
- `components/settings/SettingsContent.vue`: renders the full options form and reads `optionsStore` and `configStore`.
- `components/settings/SettingsSection.vue`: renders settings group structure.
- `components/settings/SettingItem.vue`: renders the common setting row layout with slots for controls.
- `components/workspace/WorkspaceActionBar.vue`: owns the action handlers from the current `ActionBar.vue` and renders the new action layout.

Existing panel components such as diff, history, log, and about should migrate from local `Modal`/`Dialog` patterns to shadcn-vue `Sheet` or `Dialog` according to their purpose:

- Diff, history, and log behave like panels and should use `Sheet`.
- About behaves like a focused modal and should use `Dialog`.

## Data Flow

Formatting and persistence stores remain the source of truth.

- Settings controls continue using `v-model` directly against Pinia store fields.
- Workspace actions continue calling existing workspace store methods.
- The settings drawer visible state should live in `appStore` because it is triggered by `Navbar` and rendered by the home workspace.
- `Toast.info`, `Toast.error`, and `Toast.clearAll` should remain the public utility API, but the implementation should move to sonner/shadcn toast infrastructure.

## Styling

The visual direction should be restrained and tool-focused:

- Prioritize editor space and formatting commands.
- Use shadcn semantic tokens for background, foreground, border, muted, accent, destructive, and primary states.
- Keep components dense enough for a browser extension workspace.
- Avoid marketing-style cards or large hero treatments.
- Keep cards for repeated items or bounded panels only.
- Preserve dark mode support.
- Ensure responsive behavior for narrow extension windows.

Icons should use lucide Vue components when available. Existing UnoCSS icon class usage should be replaced during the migration.

## Accessibility

- Use shadcn-vue trigger/content primitives for menu, dialog, sheet, tooltip, and select semantics.
- Keep icon buttons labelled with accessible names.
- Preserve keyboard focus visibility.
- Ensure settings controls have readable labels and descriptions.
- Ensure disabled actions are exposed with correct disabled state.

## Verification

Automated verification:

- `rtk pnpm run test`
- `rtk pnpm run lint`
- `rtk pnpm run typecheck`
- `rtk pnpm run build`

Manual verification:

- Open the options entrypoint and confirm the home workspace renders.
- Open and close the settings sheet.
- Change representative settings: number, switch, short select, and long searchable select.
- Save, apply, import, export, delete, and reset presets.
- Format manual text.
- Select one or more files and confirm batch formatting still works.
- Copy result.
- Download result.
- Download all for multiple formatted files.
- Clear all.
- Open diff, history, log, and about panels.
- Toggle dark mode.
- Check narrow and desktop widths for layout overflow.

## Risks

- Tailwind v4 and shadcn-vue setup may require WXT/Vite configuration adjustments.
- Replacing UnoCSS icon classes touches many templates and can cause missing icons if incomplete.
- Select and searchable long-list behavior must be carefully preserved for Svelte sort order and Java entrypoint options.
- Toast migration must keep the existing silent config behavior.
- Full settings in a sheet can feel crowded if groups are not structured carefully.

## Decisions

- The compatibility `/options` route should render a standalone page that reuses `SettingsContent`. The home workspace owns the sheet version. This avoids route-triggered modal state while keeping one copy of the settings form.
- Disabled secondary actions should supplement, not replace, existing no-op toast behavior in the first implementation.
