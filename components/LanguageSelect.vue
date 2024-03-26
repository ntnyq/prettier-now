<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Menu as VMenu } from 'floating-vue'
import { isDark } from '@/hooks/useDark'
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
    id: 'json',
    label: 'JSON',
    icon: 'i-vscode-icons:file-type-json',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    icon: 'i-vscode-icons:file-type-typescript',
  },
  {
    id: 'vue',
    label: 'Vue',
    icon: 'i-vscode-icons:file-type-vue',
  },
  {
    id: 'html',
    label: 'HTML',
    icon: 'i-vscode-icons:file-type-html',
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
    id: 'yaml',
    label: 'YAML',
    icon: 'i-vscode-icons:file-type-light-yaml',
  },
  {
    id: 'markdown',
    label: 'Markdown',
    icon: 'i-vscode-icons:file-type-markdown',
  },
  {
    id: 'mdx',
    label: 'MDX',
    icon: 'i-vscode-icons:file-type-mdx',
  },
])
const currentLanguage = computed(() => {
  return languages.value.find(lang => lang.id === editorStore.activeLanguage)
})
</script>

<template>
  <VMenu
    :class="{ dark: isDark }"
    class="flex"
  >
    <button class="flex items-center gap-1">
      <div :class="currentLanguage?.icon" />
      {{ currentLanguage?.label }}
    </button>
    <template #popper>
      <DropdownItem
        @click="editorStore.updateActiveLanguage(lang.id)"
        v-for="lang in languages"
        :key="lang.id"
        :icon="lang.icon"
        :text="lang.label"
        :checked="editorStore.activeLanguage === lang.id"
      />
    </template>
  </VMenu>
</template>
