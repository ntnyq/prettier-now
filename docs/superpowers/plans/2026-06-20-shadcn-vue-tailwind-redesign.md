# shadcn-vue Tailwind Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the extension UI from UnoCSS/local primitives to Tailwind CSS and shadcn-vue while making Home the primary workspace with a full settings drawer and a clearer primary formatting action.

**Architecture:** Use shadcn-vue generated UI primitives directly from `components/ui/*`, keep Pinia stores as the behavior source of truth, and move repeated settings/workspace layouts into focused domain components. Replace old overlay/dropdown/toast infrastructure with shadcn-vue `Sheet`, `Dialog`, `DropdownMenu`, `Tooltip`, and `Sonner`.

**Tech Stack:** WXT, Vue 3 `<script setup lang="ts">`, Pinia, Vue Router, Tailwind CSS v4, shadcn-vue, Reka UI, lucide-vue-next, vue-sonner, Vitest.

---

## File Structure

Create:

- `components.json`: shadcn-vue CLI configuration for Tailwind v4 and local aliases.
- `lib/utils.ts`: shadcn `cn` helper for class merging.
- `components/settings/SettingsSheet.vue`: right-side sheet shell for full settings inside Home.
- `components/settings/SettingsContent.vue`: full options form reused by the sheet and `/options`.
- `components/settings/SettingsSection.vue`: setting group layout.
- `components/settings/SettingItem.vue`: setting row layout.
- `components/settings/SettingSelect.vue`: short select and searchable long-list control wrapper.
- `components/settings/SettingNumberField.vue`: numeric option control wrapper.
- `components/workspace/WorkspaceActionBar.vue`: primary format action and secondary action menu.
- `tests/toast.test.ts`: covers silent mode and sonner calls through the existing `Toast` API.
- `tests/appStore.test.ts`: covers settings sheet state in `appStore`.

Generate with shadcn-vue CLI:

- `components/ui/button/*`
- `components/ui/dialog/*`
- `components/ui/sheet/*`
- `components/ui/dropdown-menu/*`
- `components/ui/select/*`
- `components/ui/number-field/*`
- `components/ui/switch/*`
- `components/ui/tooltip/*`
- `components/ui/sonner/*`
- `components/ui/accordion/*`
- `components/ui/command/*`
- `components/ui/popover/*`
- `components/ui/input/*`
- `components/ui/label/*`
- `components/ui/separator/*`

Modify:

- `package.json`: replace UnoCSS/floating-vue/vercel-toast dependencies with Tailwind/shadcn dependencies.
- `pnpm-lock.yaml`: update via pnpm commands only.
- `wxt.config.ts`: remove WXT UnoCSS module and add Tailwind Vite plugin.
- `tsconfig.json`: add local alias entries required by shadcn-vue if `.wxt/tsconfig.json` does not expose them to the CLI.
- `entrypoints/options/main.ts`: remove UnoCSS/FloatingVue imports and plugin registration.
- `entrypoints/options/style.css`: add Tailwind import and shadcn tokens; preserve app scrollbar and view-transition CSS.
- `entrypoints/options/App.vue`: add `TooltipProvider` and `Toaster`.
- `entrypoints/options/pages/home.vue`: render settings sheet and new action bar.
- `entrypoints/options/pages/options.vue`: replace duplicated options page with standalone settings content.
- `entrypoints/options/router.ts`: keep `/options` compatibility route.
- `components/navbar/index.vue`: replace icon/dropdown/tooltip usages with shadcn/lucide and open settings sheet via `appStore`.
- `components/navbar/LanguageSelect.vue`: replace local dropdown with shadcn `DropdownMenu`.
- `components/navbar/MoreAction.vue`: replace local dropdown/dialog with shadcn `DropdownMenu` and `Dialog`.
- `components/DiffPanel.vue`: replace local `Modal` with shadcn `Sheet`.
- `components/HistoryPanel.vue`: replace local `Modal` with shadcn `Sheet`.
- `components/LogPanel.vue`: replace local `Modal` with shadcn `Sheet`.
- `components/OptionsPresetPanel.vue`: replace local UI primitives with shadcn controls or settings components.
- `stores/app.ts`: add settings sheet visible state and actions.
- `utils/toast.ts`: keep public API and implement with `vue-sonner`.
- `stub.d.ts`: remove `vercel-toast/css` declaration if unused.
- `types/components.d.ts`: regenerate through `unplugin-vue-components` or let typecheck update expectations.

Delete after all references are gone:

- `uno.config.ts`
- `components/ui/ActionButton.vue`
- `components/ui/Dialog.vue`
- `components/ui/IconButton.vue`
- `components/ui/InputNumber.vue`
- `components/ui/Modal.vue`
- `components/ui/OptionItem.vue`
- `components/ui/OptionsBlock.vue`
- `components/ui/Select.vue`
- `components/ui/Switch.vue`
- `components/dropdown/Dropdown.vue`
- `components/dropdown/DropdownItem.vue`
- `components/dropdown/ctx.ts`

---

### Task 1: Baseline and App Store Tests

**Files:**

- Create: `tests/appStore.test.ts`
- Modify: `stores/app.ts`

- [ ] **Step 1: Write the failing test for settings sheet state**

Create `tests/appStore.test.ts`:

```ts
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAppStore } from '@/stores/app'

describe('app store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('controls the settings sheet visibility', () => {
    const appStore = useAppStore()

    expect(appStore.isSettingsSheetVisible).toBe(false)

    appStore.setIsSettingsSheetVisible(true)
    expect(appStore.isSettingsSheetVisible).toBe(true)

    appStore.setIsSettingsSheetVisible(false)
    expect(appStore.isSettingsSheetVisible).toBe(false)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
rtk pnpm run test tests/appStore.test.ts
```

Expected: FAIL because `isSettingsSheetVisible` and `setIsSettingsSheetVisible` do not exist.

- [ ] **Step 3: Implement the minimal store state**

Modify `stores/app.ts`:

```ts
const isSettingsSheetVisible = useStorage<boolean>(
  'isSettingsSheetVisible',
  false,
)

const setIsSettingsSheetVisible = (visible: boolean) => {
  isSettingsSheetVisible.value = visible
}
```

Add both names to the returned object.

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
rtk pnpm run test tests/appStore.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
rtk git add tests/appStore.test.ts stores/app.ts
rtk git commit -m "test: cover settings sheet app state"
```

Expected: Commit succeeds.

---

### Task 2: Tailwind and shadcn-vue Foundation

**Files:**

- Create: `components.json`
- Create: `lib/utils.ts`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `wxt.config.ts`
- Modify: `tsconfig.json`
- Modify: `entrypoints/options/main.ts`
- Modify: `entrypoints/options/style.css`

- [ ] **Step 1: Install Tailwind and shadcn dependencies**

Run:

```bash
rtk pnpm remove @wxt-dev/unocss @unocss/reset unocss floating-vue vercel-toast
rtk pnpm add tailwindcss @tailwindcss/vite class-variance-authority clsx tailwind-merge tw-animate-css reka-ui lucide-vue-next vue-sonner
```

Expected: dependencies update successfully and `pnpm-lock.yaml` changes.

- [ ] **Step 2: Add shadcn-vue config**

Create `components.json`:

```json
{
  "$schema": "https://shadcn-vue.com/schema.json",
  "style": "new-york",
  "typescript": true,
  "tailwind": {
    "config": "",
    "css": "entrypoints/options/style.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "utils": "@/lib/utils",
    "lib": "@/lib",
    "composables": "@/composables"
  },
  "iconLibrary": "lucide"
}
```

- [ ] **Step 3: Add class merge helper**

Create `lib/utils.ts`:

```ts
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 4: Update WXT Vite config**

Modify `wxt.config.ts`:

```ts
import tailwindcss from '@tailwindcss/vite'
import VueComponents from 'unplugin-vue-components/vite'
import { defineConfig } from 'wxt'
import { resolve } from './scripts/utils'
```

Add `tailwindcss()` before `VueComponents(...)` in `plugins`, remove `'@wxt-dev/unocss'` from `modules`, and remove the `unocss` config block.

- [ ] **Step 5: Add aliases for shadcn CLI compatibility**

Modify `tsconfig.json`:

```json
{
  "extends": "./.wxt/tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.tsbuildinfo",
    "erasableSyntaxOnly": true,
    "libReplacement": false,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "noPropertyAccessFromIndexSignature": true,
    "noUncheckedIndexedAccess": true,
    "noUncheckedSideEffectImports": true
  }
}
```

- [ ] **Step 6: Replace entry imports**

Modify `entrypoints/options/main.ts` so it no longer imports UnoCSS reset, `uno.css`, FloatingVue styles, or installs `FloatingVue`:

```ts
import './style.css'
import { createApp } from 'vue'
import pinia from '@/stores'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')
```

- [ ] **Step 7: Replace global CSS foundation**

Modify `entrypoints/options/style.css`:

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@import '@/styles/base.css';

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --radius: 0.5rem;
}

:root.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground;
  }

  .v-codemirror .cm-editor {
    height: 100%;
  }
}

/* Color Mode transition */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root) {
  z-index: 1;
}

::view-transition-new(root) {
  z-index: 2147483646;
}

.dark::view-transition-old(root) {
  z-index: 2147483646;
}

.dark::view-transition-new(root) {
  z-index: 1;
}
```

- [ ] **Step 8: Run typecheck to expose remaining missing UI imports**

Run:

```bash
rtk pnpm run typecheck
```

Expected: FAIL with missing old UI/dropdown/FloatingVue or generated shadcn component references. This confirms the foundation changed before UI replacement.

- [ ] **Step 9: Commit**

Run:

```bash
rtk git add package.json pnpm-lock.yaml components.json lib/utils.ts wxt.config.ts tsconfig.json entrypoints/options/main.ts entrypoints/options/style.css
rtk git commit -m "chore: migrate ui foundation to tailwind"
```

Expected: Commit succeeds.

---

### Task 3: Generate shadcn-vue Components

**Files:**

- Create: generated `components/ui/**`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Run the shadcn-vue add command**

Run:

```bash
rtk pnpm dlx shadcn-vue@latest add button dialog sheet dropdown-menu select number-field switch tooltip sonner accordion command popover input label separator
```

Expected: shadcn-vue creates the requested folders under `components/ui` and installs any missing transitive dependencies.

- [ ] **Step 2: Inspect generated component exports**

Run:

```bash
rtk rg "export \\{|defineProps|data-slot" components/ui -n
```

Expected: generated components export PascalCase shadcn-vue primitives such as `Button`, `Sheet`, `Dialog`, `DropdownMenu`, `Select`, `NumberField`, `Switch`, `Tooltip`, `Popover`, and `Toaster`.

- [ ] **Step 3: Commit**

Run:

```bash
rtk git add components/ui package.json pnpm-lock.yaml
rtk git commit -m "chore: add shadcn vue components"
```

Expected: Commit succeeds.

---

### Task 4: Sonner Toast Compatibility

**Files:**

- Create: `tests/toast.test.ts`
- Modify: `utils/toast.ts`
- Modify: `entrypoints/options/App.vue`
- Modify: `stub.d.ts`

- [ ] **Step 1: Write the failing toast compatibility tests**

Create `tests/toast.test.ts`:

```ts
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useConfigStore } from '@/stores/config'
import { Toast } from '@/utils/toast'

const toastMock = vi.hoisted(() => {
  const toast = vi.fn()
  return Object.assign(toast, {
    dismiss: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  })
})

vi.mock('vue-sonner', () => ({
  toast: toastMock,
}))

describe('Toast', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    toastMock.mockClear()
    toastMock.info.mockClear()
    toastMock.error.mockClear()
    toastMock.dismiss.mockClear()
  })

  it('does not show messages when silent mode is enabled', () => {
    const configStore = useConfigStore()
    configStore.silent = true

    Toast.info('Saved')
    Toast.error('Failed')

    expect(toastMock.info).not.toHaveBeenCalled()
    expect(toastMock.error).not.toHaveBeenCalled()
  })

  it('clears existing toasts before showing by default', () => {
    Toast.info('Saved')

    expect(toastMock.dismiss).toHaveBeenCalledTimes(1)
    expect(toastMock.info).toHaveBeenCalledWith('Saved', {
      duration: 2000,
    })
  })

  it('shows errors through sonner error toasts', () => {
    Toast.error('Failed')

    expect(toastMock.dismiss).toHaveBeenCalledTimes(1)
    expect(toastMock.error).toHaveBeenCalledWith('Failed', {
      duration: 2000,
    })
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
rtk pnpm run test tests/toast.test.ts
```

Expected: FAIL because `utils/toast.ts` still imports `vercel-toast`.

- [ ] **Step 3: Implement sonner-backed Toast**

Replace `utils/toast.ts` with:

```ts
/**
 * @file Toast
 */

import { toast } from 'vue-sonner'
import { useConfigStoreWithout } from '@/stores/config'

export interface ToastOptions {
  /**
   * Show as error toast
   *
   * @default false
   */
  isError?: boolean

  /**
   * Clear all toasts before showing this toast
   *
   * @default true
   */
  clearAll?: boolean

  /**
   * Duration in milliseconds.
   *
   * @default 2000
   */
  timeout?: number
}

function getToastOptions(options: ToastOptions) {
  return {
    duration: options.timeout ?? 2e3,
  }
}

export const Toast = {
  show(msg: string, options: ToastOptions = {}) {
    const opts = {
      clearAll: true,
      isError: false,
      timeout: 2e3,
      ...options,
    }
    const configStore = useConfigStoreWithout()
    if (configStore.silent) {
      return
    }

    if (opts.clearAll) {
      Toast.clearAll()
    }

    if (opts.isError) {
      toast.error(msg, getToastOptions(opts))
      return
    }

    toast.info(msg, getToastOptions(opts))
  },

  info(msg: string, options: Omit<ToastOptions, 'isError'> = {}) {
    Toast.show(msg, options)
  },

  error(msg: string, options: Omit<ToastOptions, 'isError'> = {}) {
    Toast.show(msg, { ...options, isError: true })
  },

  clearAll() {
    toast.dismiss()
  },
}
```

- [ ] **Step 4: Add Toaster to app shell**

Modify `entrypoints/options/App.vue`:

```vue
<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
</script>

<template>
  <TooltipProvider>
    <main class="bg-background text-foreground h-screen min-w-[720px] flex flex-col">
      <Navbar class="h-[var(--h-header)]" />
      <RouterView class="h-[calc(100vh-var(--h-header))]" />
    </main>

    <Toaster class="pointer-events-auto" />
  </TooltipProvider>
</template>
```

- [ ] **Step 5: Remove stale vercel-toast CSS declaration**

Modify `stub.d.ts` and remove:

```ts
declare module 'vercel-toast/css' {
  const css: string
  export default css
}
```

- [ ] **Step 6: Run the toast test**

Run:

```bash
rtk pnpm run test tests/toast.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

Run:

```bash
rtk git add tests/toast.test.ts utils/toast.ts entrypoints/options/App.vue stub.d.ts
rtk git commit -m "refactor: replace toast implementation with sonner"
```

Expected: Commit succeeds.

---

### Task 5: Settings Domain Components

**Files:**

- Create: `components/settings/SettingItem.vue`
- Create: `components/settings/SettingsSection.vue`
- Create: `components/settings/SettingNumberField.vue`
- Create: `components/settings/SettingSelect.vue`
- Create: `components/settings/SettingsContent.vue`
- Create: `components/settings/SettingsSheet.vue`
- Modify: `components/OptionsPresetPanel.vue`
- Modify: `entrypoints/options/pages/options.vue`

- [ ] **Step 1: Create setting row layout**

Create `components/settings/SettingItem.vue`:

```vue
<script lang="ts" setup>
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="bg-card text-card-foreground grid gap-3 border rounded-lg p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
    <div class="min-w-0 space-y-1">
      <h3 class="break-words text-sm font-medium leading-none">
        <slot name="title">
          {{ title }}
        </slot>
      </h3>
      <p
        v-if="description || $slots.description"
        class="text-muted-foreground text-sm leading-5"
      >
        <slot name="description">
          {{ description }}
        </slot>
      </p>
    </div>

    <div class="min-w-0 flex items-center justify-start sm:justify-end">
      <slot name="action" />
    </div>
  </div>
</template>
```

- [ ] **Step 2: Create settings section layout**

Create `components/settings/SettingsSection.vue`:

```vue
<script lang="ts" setup>
defineProps<{
  title: string
}>()
</script>

<template>
  <section class="space-y-3">
    <h2 class="text-base font-semibold tracking-normal">
      {{ title }}
    </h2>
    <div class="space-y-3">
      <slot />
    </div>
  </section>
</template>
```

- [ ] **Step 3: Create number field wrapper**

Create `components/settings/SettingNumberField.vue`:

```vue
<script lang="ts" setup>
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'

withDefaults(
  defineProps<{
    min?: number
    max?: number
    step?: number
  }>(),
  {
    min: 0,
    step: 1,
  },
)

const modelValue = defineModel<number>({ default: 0 })
</script>

<template>
  <NumberField
    v-model="modelValue"
    :min
    :max
    :step
    class="w-32"
  >
    <NumberFieldContent>
      <NumberFieldDecrement />
      <NumberFieldInput />
      <NumberFieldIncrement />
    </NumberFieldContent>
  </NumberField>
</template>
```

- [ ] **Step 4: Create select wrapper for short and long lists**

Create `components/settings/SettingSelect.vue`:

```vue
<script lang="ts" setup>
import { isString } from '@ntnyq/utils'
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { computed, shallowRef } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

type SelectItem = string | { label: string; value: string }

const props = withDefaults(
  defineProps<{
    items?: SelectItem[]
    searchableThreshold?: number
  }>(),
  {
    items: () => [],
    searchableThreshold: 20,
  },
)

const modelValue = defineModel<string>()
const isComboboxOpen = shallowRef(false)

const formattedItems = computed(() =>
  props.items.map(item =>
    isString(item) ? { label: item, value: item } : item,
  ),
)
const selectedItem = computed(() =>
  formattedItems.value.find(item => item.value === modelValue.value),
)
const isSearchable = computed(
  () => formattedItems.value.length > props.searchableThreshold,
)

function selectValue(value: string) {
  modelValue.value = value
  isComboboxOpen.value = false
}
</script>

<template>
  <Popover
    v-model:open="isComboboxOpen"
    v-if="isSearchable"
  >
    <PopoverTrigger as-child>
      <Button
        :aria-expanded="isComboboxOpen"
        variant="outline"
        role="combobox"
        class="w-[280px] justify-between"
      >
        <span class="truncate">
          {{ selectedItem?.label ?? modelValue }}
        </span>
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[280px] p-0">
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              @select="selectValue(item.value)"
              v-for="item in formattedItems"
              :key="item.value"
              :value="item.label"
            >
              <Check
                :class="cn(
                  'mr-2 size-4',
                  item.value === modelValue ? 'opacity-100' : 'opacity-0',
                )"
              />
              {{ item.label }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>

  <Select
    v-model="modelValue"
    v-else
  >
    <SelectTrigger class="w-[180px]">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem
          v-for="item in formattedItems"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
```

- [ ] **Step 5: Run typecheck to catch wrapper import issues**

Run:

```bash
rtk pnpm run typecheck
```

Expected: FAIL only if generated component names differ from the imports. If that happens, inspect `components/ui/<component>/index.ts`, change the import names in the wrapper to the exported names, and rerun this command until the wrapper files typecheck.

- [ ] **Step 6: Move options form into SettingsContent**

Create `components/settings/SettingsContent.vue` by moving the script and template from `entrypoints/options/pages/options.vue`, then replace:

- `OptionsBlock` with `SettingsSection`
- `OptionItem` with `SettingItem`
- `InputNumber` with `SettingNumberField`
- `Select` with `SettingSelect`
- `Switch` with shadcn `Switch`

Use imports:

```ts
import { i18n } from '#i18n'
import OptionsPresetPanel from '@/components/OptionsPresetPanel.vue'
import SettingItem from '@/components/settings/SettingItem.vue'
import SettingNumberField from '@/components/settings/SettingNumberField.vue'
import SettingSelect from '@/components/settings/SettingSelect.vue'
import SettingsSection from '@/components/settings/SettingsSection.vue'
import { Switch } from '@/components/ui/switch'
import { JAVA_ENTRYPOINTS } from '@/constants/options'
import { useConfigStore } from '@/stores/config'
import { useOptionsStore } from '@/stores/options'
```

Wrap content:

```vue
<template>
  <div class="space-y-6">
    <OptionsPresetPanel />
    <SettingsSection :title="i18n.t('prettierOptions')">
      <SettingItem
        :description="i18n.t('optDescPrintWidth')"
        title="printWidth"
      >
        <template #action>
          <SettingNumberField v-model="optionsStore.printWidth" />
        </template>
      </SettingItem>
    </SettingsSection>
  </div>
</template>
```

Continue the same mechanical replacement for every existing `OptionsBlock` and `OptionItem` from `entrypoints/options/pages/options.vue`, preserving each existing `v-model`, `title`, `description`, and option item list.

- [ ] **Step 7: Create settings sheet shell**

Create `components/settings/SettingsSheet.vue`:

```vue
<script lang="ts" setup>
import { i18n } from '#i18n'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import SettingsContent from './SettingsContent.vue'

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent class="max-w-none w-[min(720px,92vw)] flex flex-col gap-0 p-0 sm:max-w-none">
      <SheetHeader class="border-b px-6 py-4 text-left">
        <SheetTitle>{{ i18n.t('settings') }}</SheetTitle>
        <SheetDescription>{{ i18n.t('prettierOptions') }}</SheetDescription>
      </SheetHeader>
      <div class="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <SettingsContent />
      </div>
    </SheetContent>
  </Sheet>
</template>
```

- [ ] **Step 8: Reuse SettingsContent in compatibility route**

Replace `entrypoints/options/pages/options.vue` with:

```vue
<script lang="ts" setup>
import SettingsContent from '@/components/settings/SettingsContent.vue'
</script>

<template>
  <div class="bg-background h-full overflow-y-auto">
    <div class="mx-auto max-w-[720px] p-8">
      <SettingsContent />
    </div>
  </div>
</template>
```

- [ ] **Step 9: Commit**

Run:

```bash
rtk git add components/settings components/OptionsPresetPanel.vue entrypoints/options/pages/options.vue package.json pnpm-lock.yaml
rtk git commit -m "refactor: move options into settings components"
```

Expected: Commit succeeds after typecheck issues from this task are resolved.

---

### Task 6: Workspace Action Bar

**Files:**

- Create: `components/workspace/WorkspaceActionBar.vue`
- Modify: `entrypoints/options/pages/home.vue`
- Delete later: `components/ActionBar.vue`

- [ ] **Step 1: Create the shadcn action bar**

Create `components/workspace/WorkspaceActionBar.vue`:

```vue
<script lang="ts" setup>
import { useClipboard, useFileDialog } from '@vueuse/core'
import {
  Check,
  Copy,
  Download,
  Ellipsis,
  FileUp,
  FolderDown,
  Trash2,
} from 'lucide-vue-next'
import { i18n } from '#i18n'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useFileHandler } from '@/composables/fileHandler'
import { useWorkspaceStore } from '@/stores/workspace'
import { Logger } from '@/utils/logger'
import { Toast } from '@/utils/toast'

const workspaceStore = useWorkspaceStore()
const { loadFileList } = useFileHandler()
const { copy } = useClipboard({ legacy: true })

const {
  open: openFileDialog,
  reset: resetSelectedFile,
  onChange: handleFileDialogChange,
} = useFileDialog({
  multiple: true,
})

handleFileDialogChange(async files => {
  try {
    await loadFileList(files)
  } finally {
    resetSelectedFile()
  }
})

async function formatSource() {
  await workspaceStore.formatActiveJob()
}

async function copyResult() {
  if (!workspaceStore.resultCode) {
    Logger.warn(i18n.t('nothingToCopy'))
    Toast.info(i18n.t('nothingToCopy'))
    return
  }

  try {
    await copy(workspaceStore.resultCode)
    Logger.success(i18n.t('copiedToClipboard'))
    Toast.info(i18n.t('copiedToClipboard'))
  } catch {
    Logger.error(i18n.t('failedToCopyToClipboard'))
    Toast.error(i18n.t('failedToCopyToClipboard'))
  }
}

function clearAll() {
  if (!workspaceStore.sourceCode && !workspaceStore.resultCode) {
    Logger.warn(i18n.t('nothingToClear'))
    Toast.info(i18n.t('nothingToClear'))
    return
  }

  workspaceStore.clearWorkspace()

  Logger.success(i18n.t('clearSuccess'))
  Toast.info(i18n.t('clearSuccess'))
}

function selectFile() {
  openFileDialog()
}
</script>

<template>
  <div class="bg-muted/40 flex items-center justify-between gap-3 border-t px-4 py-3">
    <div class="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            @click="selectFile"
            :aria-label="i18n.t('selectFile')"
            variant="outline"
            size="icon"
          >
            <FileUp class="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{{ i18n.t('selectFile') }}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            @click="copyResult"
            :aria-label="i18n.t('copyResult')"
            variant="outline"
            size="icon"
          >
            <Copy class="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{{ i18n.t('copyResult') }}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            @click="workspaceStore.downloadActiveJob"
            :aria-label="i18n.t('downloadResult')"
            variant="outline"
            size="icon"
          >
            <Download class="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{{ i18n.t('downloadResult') }}</TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            variant="outline"
            size="icon"
            aria-label="More actions"
          >
            <Ellipsis class="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem @click="clearAll">
            <Trash2 class="mr-2 size-4" />
            {{ i18n.t('clearAll') }}
          </DropdownMenuItem>
          <DropdownMenuItem @click="workspaceStore.downloadAllJobs">
            <FolderDown class="mr-2 size-4" />
            {{ i18n.t('downloadAll') }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <Button
      @click="formatSource"
      size="lg"
      class="min-w-36"
    >
      <Check class="mr-2 size-4" />
      {{ i18n.t('formatSource') }}
    </Button>
  </div>
</template>
```

- [ ] **Step 2: Render new action bar and settings sheet on home**

Modify `entrypoints/options/pages/home.vue`:

```vue
<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import SettingsSheet from '@/components/settings/SettingsSheet.vue'
import WorkspaceActionBar from '@/components/workspace/WorkspaceActionBar.vue'
import { useFileHandler } from '@/composables/fileHandler'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const { loadFileList } = useFileHandler()

useEventListener('paste', (evt: ClipboardEvent) => {
  loadFileList(evt.clipboardData?.files)
})
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div class="min-h-0 flex flex-1 gap-3 overflow-y-auto p-3">
      <WorkspaceFileList />
      <EditorSource
        v-show="appStore.showLeftLayout"
        :class="[
          appStore.showRightLayout
            ? 'max-w-1/2 min-w-1/2'
            : 'max-w-full min-w-full',
        ]"
        class="flex-1"
      />
      <EditorResult v-show="appStore.showRightLayout" />
    </div>

    <WorkspaceActionBar />

    <DropZone />
    <DiffPanel />
    <HistoryPanel />
    <LogPanel />
    <SettingsSheet v-model:open="appStore.isSettingsSheetVisible" />
  </div>
</template>
```

- [ ] **Step 3: Run typecheck for action bar**

Run:

```bash
rtk pnpm run typecheck
```

Expected: Remaining failures are from components not yet migrated, not from `WorkspaceActionBar.vue`.

- [ ] **Step 4: Commit**

Run:

```bash
rtk git add components/workspace/WorkspaceActionBar.vue entrypoints/options/pages/home.vue
rtk git commit -m "refactor: prioritize workspace format action"
```

Expected: Commit succeeds once typecheck-blocking imports from this task are fixed.

---

### Task 7: Navbar, Language, More, and About

**Files:**

- Modify: `components/navbar/index.vue`
- Modify: `components/navbar/LanguageSelect.vue`
- Modify: `components/navbar/MoreAction.vue`

- [ ] **Step 1: Replace settings route push with appStore state**

In `components/navbar/index.vue`, replace the settings click handler with:

```vue
<Button
  variant="ghost"
  size="icon"
  :aria-label="i18n.t('settings')"
  @click="appStore.setIsSettingsSheetVisible(true)"
>
  <Settings class="size-4" />
</Button>
```

Import `Settings` from `lucide-vue-next` and `Button` from `@/components/ui/button`.

- [ ] **Step 2: Replace icon buttons with shadcn tooltip buttons**

Use this repeated pattern for each navbar icon button:

```vue
<Tooltip>
  <TooltipTrigger as-child>
    <Button
      variant="ghost"
      size="icon"
      :aria-label="i18n.t('history')"
      @click="appStore.setIsHistoryPanelVisible(true)"
    >
      <History class="size-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent>{{ i18n.t('history') }}</TooltipContent>
</Tooltip>
```

Use lucide icons: `GitCompare`, `History`, `PanelLeft`, `PanelRight`, `FileText`, `Sun`, `Moon`, `Home`.

- [ ] **Step 3: Replace LanguageSelect dropdown**

Modify `components/navbar/LanguageSelect.vue` to use `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, and `Button`. Keep the existing language store/update logic unchanged. Use `Check` to indicate the active language.

- [ ] **Step 4: Replace MoreAction dropdown and about dialog**

Modify `components/navbar/MoreAction.vue` to use:

```ts
import { Github, Info, Menu, MessageSquare, Tags } from 'lucide-vue-next'
import { shallowRef } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
```

Use `const isAboutOpen = shallowRef(false)` and bind `<Dialog v-model:open="isAboutOpen">`.

- [ ] **Step 5: Commit**

Run:

```bash
rtk git add components/navbar/index.vue components/navbar/LanguageSelect.vue components/navbar/MoreAction.vue
rtk git commit -m "refactor: migrate navbar actions to shadcn"
```

Expected: Commit succeeds once typecheck-blocking imports from this task are fixed.

---

### Task 8: Panels and Legacy Overlay Removal

**Files:**

- Modify: `components/DiffPanel.vue`
- Modify: `components/HistoryPanel.vue`
- Modify: `components/LogPanel.vue`
- Delete: `components/ui/Modal.vue`
- Delete: `components/ui/Dialog.vue`
- Delete: `components/dropdown/Dropdown.vue`
- Delete: `components/dropdown/DropdownItem.vue`
- Delete: `components/dropdown/ctx.ts`

- [ ] **Step 1: Migrate panel shells**

For each of `DiffPanel.vue`, `HistoryPanel.vue`, and `LogPanel.vue`, replace the local `<Modal v-model:visible="...">` wrapper with shadcn `Sheet`:

```vue
<Sheet v-model:open="appStore.isDiffPanelVisible">
  <SheetContent class="flex w-[min(760px,92vw)] max-w-none flex-col gap-0 p-0 sm:max-w-none">
    <SheetHeader class="border-b px-6 py-4 text-left">
      <SheetTitle>{{ i18n.t('diff') }}</SheetTitle>
    </SheetHeader>
    <div class="min-h-0 flex-1 overflow-y-auto p-6">
      <!-- existing panel content -->
    </div>
  </SheetContent>
</Sheet>
```

Use `useLogStore()` for `LogPanel.vue` open state and `useAppStore()` for diff/history.

- [ ] **Step 2: Replace panel close buttons**

Replace local `IconButton` close buttons with:

```vue
<Button
  variant="ghost"
  size="icon"
  :aria-label="i18n.t('close')"
  @click="appStore.setIsDiffPanelVisible(false)"
>
  <X class="size-4" />
</Button>
```

If `close` is not available in locales, use a literal accessible label `aria-label="Close"` and do not add visible copy.

- [ ] **Step 3: Delete legacy overlay/dropdown files after references are gone**

Run:

```bash
rtk rg "Modal|<Dialog|Dropdown|DropdownItem|components/dropdown|v-tooltip|floating-vue" components entrypoints utils stores -n
```

Expected: no references to legacy overlay/dropdown primitives remain.

Delete the legacy files listed in this task.

- [ ] **Step 4: Commit**

Run:

```bash
rtk git add components/DiffPanel.vue components/HistoryPanel.vue components/LogPanel.vue components/ui/Modal.vue components/ui/Dialog.vue components/dropdown
rtk git commit -m "refactor: migrate panels to shadcn sheets"
```

Expected: Commit succeeds.

---

### Task 9: Remove Legacy UI Primitives and UnoCSS Classes

**Files:**

- Modify: all Vue/CSS files that still contain UnoCSS-only syntax.
- Delete: stale local UI primitive files.
- Delete: `uno.config.ts`

- [ ] **Step 1: Scan for UnoCSS-only syntax and legacy primitives**

Run:

```bash
rtk rg "\\$c-|--at-apply|i-ri:|i-lucide:|i-vscode-icons:|of-y|of-x|op-|lh-|w-[0-9]+px|h-[0-9]+px|min-w-[0-9]+px|max-w-[0-9]+px|border-base|bg-base|text-base|btn-action|icon-button|kbd-key|z-dialog|z-dropzone|z-tooltip|ActionButton|IconButton|InputNumber|OptionsBlock|OptionItem|<Select|<Switch" -n
```

Expected: output lists remaining files to migrate.

- [ ] **Step 2: Replace common class patterns**

Use these direct replacements:

- `border-base` -> `border-border`
- `bg-base` -> `bg-background`
- `text-base` as color shortcut -> `text-foreground`
- `of-y-auto` -> `overflow-y-auto`
- `of-y-scroll` -> `overflow-y-scroll`
- `of-x-auto` -> `overflow-x-auto`
- `op-70` -> `opacity-70`
- `op-75` -> `opacity-75`
- `hover:op-100` -> `hover:opacity-100`
- `lh-9` -> `leading-9`
- `w-80px` -> `w-20`
- `h-50px` -> `h-[50px]`
- `max-w-720px` -> `max-w-[720px]`
- `min-w-720px` -> `min-w-[720px]`
- `max-w-1/2` -> `max-w-1/2` only if Tailwind supports it in this version; otherwise use `max-w-1/2` replacement `max-w-[50%]`.
- `min-w-1/2` -> `min-w-[50%]`

- [ ] **Step 3: Replace remaining icons**

Replace UnoCSS icon classes with lucide component imports. Examples:

```ts
import { Check, Download, FileText, History, Home, Moon, Settings, Sun } from 'lucide-vue-next'
```

```vue
<Settings class="size-4" />
```

- [ ] **Step 4: Delete stale local UI primitives**

After `rtk rg` confirms no references remain, delete:

```text
components/ui/ActionButton.vue
components/ui/IconButton.vue
components/ui/InputNumber.vue
components/ui/OptionItem.vue
components/ui/OptionsBlock.vue
components/ui/Select.vue
components/ui/Switch.vue
uno.config.ts
```

- [ ] **Step 5: Run typecheck**

Run:

```bash
rtk pnpm run typecheck
```

Expected: PASS or only errors tied to generated `types/components.d.ts`. If `types/components.d.ts` is stale, run:

```bash
rtk pnpm run build
```

Then rerun typecheck.

- [ ] **Step 6: Commit**

Run:

```bash
rtk git add .
rtk git commit -m "refactor: remove legacy unocss ui primitives"
```

Expected: Commit succeeds.

---

### Task 10: Verification and UI Polish

**Files:**

- Modify: any file needed to fix verification failures.

- [ ] **Step 1: Run unit tests**

Run:

```bash
rtk pnpm run test
```

Expected: PASS.

- [ ] **Step 2: Run lint**

Run:

```bash
rtk pnpm run lint
```

Expected: PASS. If formatting-only failures occur, run `rtk pnpm run lint --fix`, inspect the diff, and rerun lint.

- [ ] **Step 3: Run typecheck**

Run:

```bash
rtk pnpm run typecheck
```

Expected: PASS.

- [ ] **Step 4: Run Chromium build**

Run:

```bash
rtk pnpm run build
```

Expected: PASS and `dist/` output updates.

- [ ] **Step 5: Run Firefox build**

Run:

```bash
rtk pnpm run build:firefox
```

Expected: PASS.

- [ ] **Step 6: Start development server for manual verification**

Run:

```bash
rtk pnpm run dev
```

Expected: WXT starts and prints a local development URL or browser launch instructions.

- [ ] **Step 7: Manual verification checklist**

Verify:

- Home workspace renders without route changes.
- Settings button opens the full settings sheet.
- `/options` renders the standalone settings content.
- Number field changes `printWidth`.
- Switch changes `semi`.
- Short select changes `trailingComma`.
- Long searchable select changes `svelteSortOrder`.
- Preset save/apply/delete/import/export/reset still works.
- Format manual text works.
- Select file still formats loaded files.
- Copy result shows sonner toast.
- Download result works.
- Download all works for multiple formatted jobs.
- Clear all works.
- Diff, history, log, and about panels open and close.
- Dark mode toggles and shadcn components follow the theme.
- Narrow and desktop widths do not show incoherent overlap.

- [ ] **Step 8: Final cleanup commit**

Run:

```bash
rtk git status --short
rtk git add .
rtk git commit -m "chore: verify shadcn tailwind redesign"
```

Expected: Commit succeeds if verification produced fixes. If there are no changes after verification, skip the commit.

---

## Plan Self-Review

Spec coverage:

- Tailwind CSS replaces UnoCSS in Task 2 and Task 9.
- shadcn-vue components are generated in Task 3 and adopted in Tasks 4-8.
- Settings move into a Home sheet in Tasks 5-7.
- `/options` compatibility is handled in Task 5.
- ActionBar hierarchy is handled in Task 6.
- Toast, dialog, dropdown, select, number field, switch, tooltip, sheet, and dialog replacement are handled in Tasks 4-8.
- Verification commands and manual checks are handled in Task 10.

Placeholder scan:

- The plan contains no `TBD`, `TODO`, or "implement later" placeholders.
- Generated shadcn-vue component code is intentionally produced by CLI commands rather than retyped manually.

Type consistency:

- Settings sheet state uses `isSettingsSheetVisible` and `setIsSettingsSheetVisible` in both tests and components.
- The existing public toast API remains `Toast.info`, `Toast.error`, and `Toast.clearAll`.
- Settings component names match the file structure and imports in the task steps.
