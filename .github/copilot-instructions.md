# Prettier Now - AI Coding Instructions

## Architecture Overview

**prettier-now** is a Vue 3 browser extension that provides a code formatting interface using Prettier. Built with WXT framework for cross-browser compatibility.

### Core Components

- **WXT Framework**: Extension manifest and build system (`wxt.config.ts`)
- **Vue 3 + Pinia**: UI with reactive state management
- **CodeMirror 6**: Split-pane editor with syntax highlighting
- **Prettier Standalone**: Client-side code formatting with dynamic plugin loading
- **UnoCSS**: Utility-first styling with dark/light theme support

### Data Flow

1. User inputs code via file upload, paste, or direct typing in `EditorSource`
2. `useEditorStore.formatCode()` triggers formatting via `formatViaPrettier()`
3. Prettier plugins are dynamically loaded and cached in `utils/cache.ts`
4. Formatted output appears in `EditorResult` component

## Key Patterns

### Storage & Persistence

```typescript
// All user preferences persist via browser extension storage
const setting = useStorage<boolean>('settingName', defaultValue)
```

- Use `useStorage()` composable for any persistent state
- Follows pattern: `local:${key}` for storage keys
- Options store (`stores/options.ts`) manages 20+ Prettier configuration options

### Language Support Architecture

```typescript
// Language definitions in constants/language.ts
export const languages: Language[] = [
  {
    id: 'javascript',
    parser: 'babel',
    icon: 'i-vscode-icons:file-type-js-official',
  },
]

// Loader mapping pattern in utils/cache.ts - avoids excessive if-else chains
const codemirrorLoaders = {
  [LANGUAGE_ID.javascript]: async () => {
    const { javascript } = await interopDefault(
      import('@codemirror/lang-javascript'),
    )
    return javascript()
  },
  // ... more loaders
} as const
```

- Each language requires: CodeMirror extension + Prettier parser + file extensions mapping
- **Loader Pattern**: Use mapping objects instead of if-else chains for plugin loading
- Dynamic loading pattern: check cache first, then lazy-load via dynamic imports
- Plugin loading in `utils/cache.ts` with separate caches for CodeMirror and Prettier

### Store Organization

- `stores/editor.ts`: Source/result code, language selection, formatting logic
- `stores/options.ts`: All Prettier configuration options with reactive storage
- `stores/config.ts`: App-level settings (debug, silent mode, auto-format)
- `stores/app.ts`: UI state (layout visibility, theme)

## Development Workflows

### Build & Development

```bash
pnpm dev              # Chrome development
pnpm dev:firefox      # Firefox development
pnpm build            # Production build
pnpm build:firefox    # Firefox production build
```

### Extension Structure

- `entrypoints/popup/`: Simple popup redirecting to options page
- `entrypoints/options/`: Main application UI with Vue Router
- `entrypoints/background.ts`: Context menu integration and keyboard shortcuts
- Auto-opens options page in development mode

### Component Patterns

- **Single File Components**: All Vue components use `<script setup>` syntax
- **Composables**: Logic extraction pattern (e.g., `useFileHandler`, `useStorage`)
- **Constants**: Centralized configuration in `constants/` (languages, options, commands)

## Plugin Integration

### Adding New Language Support

1. Add language definition to `constants/language.ts`
2. Update file extension mapping in `languageExtensions`
3. Add CodeMirror loader case in `utils/cache.ts loadCodemirrorLanguage()`
4. Add Prettier plugin loader in `utils/cache.ts loadPrettierPlugin()`
5. Install corresponding npm packages for both CodeMirror and Prettier

### Prettier Options Extension

- New options go in `constants/options.ts` as defaults
- Add reactive storage in `stores/options.ts` using `useStorage()`
- Create UI components in `entrypoints/options/pages/options.vue`
- Follow existing pattern: boolean switches, select dropdowns, number inputs

## Common Tasks

### File Handling

- `composables/fileHandler.ts` manages drag-drop and file selection
- Auto-detects language from file extension
- Triggers immediate formatting after successful file load

### Error Handling & Logging

- `utils/logger.ts`: Conditional logging based on debug mode
- `utils/toast.ts`: User notifications with vercel-toast
- Always check for empty content and unsupported file types

### Theme & Styling

- Dark mode via `composables/dark.ts` with system preference detection
- UnoCSS utility classes throughout components
- CodeMirror themes in `components/Editor/theme.ts`

## Extension-Specific Considerations

### Browser API Usage

- Manifest v3 permissions: `storage`, `contextMenus`
- Background script for context menu and keyboard shortcuts (`Alt+O`)
- Use `browser.*` APIs via WXT's auto-imports

### Performance Optimization

- Plugin caching prevents repeated downloads
- Lazy loading of CodeMirror language extensions
- Debounced formatting to avoid excessive computation

When adding features, maintain the reactive storage pattern and ensure proper plugin caching for optimal user experience.
