<script lang="ts" setup>
import { computed } from 'vue'
import { isDark } from '@/composables/useDark'
import { languages } from '@/constants/language'
import { useEditorStore } from '@/stores/editor'

export interface Language {
  id: string
  label: string
  icon: string
}

const editorStore = useEditorStore()

const currentLanguage = computed(() => {
  return languages.find(lang => lang.id === editorStore.activeLanguage)
})
</script>

<template>
  <Dropdown
    :class="{ dark: isDark }"
    class="flex"
  >
    <button class="flex items-center gap-1">
      <div :class="currentLanguage?.icon" />
      {{ currentLanguage?.name }}
    </button>
    <template #popper>
      <DropdownItem
        @click="editorStore.setActiveLanguage(lang.id)"
        v-for="lang in languages"
        :key="lang.id"
        :icon="lang.icon"
        :text="lang.name"
        :checked="editorStore.activeLanguage === lang.id"
      />
    </template>
  </Dropdown>
</template>
