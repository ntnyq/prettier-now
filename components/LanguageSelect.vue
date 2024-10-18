<script lang="ts" setup>
import { computed, ref } from 'vue'
import { isDark } from '@/composables/useDark'
import { useEditorStore } from '@/stores/editor'

export interface Language {
  id: string
  label: string
  icon: string
}

const editorStore = useEditorStore()

const languages = ref<Language[]>([
  {
    id: 'javascript',
    label: 'JavaScript',
    icon: 'i-vscode-icons:file-type-js-official',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    icon: 'i-vscode-icons:file-type-typescript',
  },
  {
    id: 'html',
    label: 'HTML',
    icon: 'i-vscode-icons:file-type-html',
  },
  {
    id: 'vue',
    label: 'Vue',
    icon: 'i-vscode-icons:file-type-vue',
  },
  {
    id: 'svelte',
    label: 'Svelte',
    icon: 'i-vscode-icons:file-type-svelte',
  },
  {
    id: 'angular',
    label: 'Angular',
    icon: 'i-vscode-icons:file-type-angular',
  },
  {
    id: 'css',
    label: 'CSS',
    icon: 'i-vscode-icons:file-type-css',
  },
  {
    id: 'less',
    label: 'Less',
    icon: 'i-vscode-icons:file-type-less',
  },
  {
    id: 'scss',
    label: 'SCSS',
    icon: 'i-vscode-icons:file-type-scss',
  },
  {
    id: 'graphql',
    label: 'GraphQL',
    icon: 'i-vscode-icons:file-type-graphql',
  },
  {
    id: 'json',
    label: 'JSON',
    icon: 'i-vscode-icons:file-type-json',
  },
  {
    id: 'yaml',
    label: 'YAML',
    icon: 'i-vscode-icons:file-type-light-yaml',
  },
  {
    id: 'markdown',
    label: 'Markdown',
    icon: 'i-vscode-icons:file-type-markdown',
  },
])
const currentLanguage = computed(() => {
  return languages.value.find(lang => lang.id === editorStore.activeLanguage)
})
</script>

<template>
  <Dropdown
    :class="{ dark: isDark }"
    class="flex"
  >
    <button class="flex items-center gap-1">
      <div :class="currentLanguage?.icon" />
      {{ currentLanguage?.label }}
    </button>
    <template #popper>
      <DropdownItem
        @click="editorStore.setActiveLanguage(lang.id)"
        v-for="lang in languages"
        :key="lang.id"
        :icon="lang.icon"
        :text="lang.label"
        :checked="editorStore.activeLanguage === lang.id"
      />
    </template>
  </Dropdown>
</template>
