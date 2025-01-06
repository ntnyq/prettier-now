<script lang="ts" setup>
import { computed } from 'vue'
import { languages } from '@/constants/language'
import { useEditorStore } from '@/stores/editor'
import type { Language } from '@/constants/language'

const editorStore = useEditorStore()

const currentLanguage = computed(() =>
  languages.find(language => language.id === editorStore.languageId),
)

function handSelectLanguage(language: Language) {
  editorStore.setLanguageId(language.id)
}
</script>

<template>
  <Dropdown class="flex">
    <button
      type="button"
      role="button"
      class="flex items-center gap-1 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-700"
    >
      <div :class="currentLanguage?.icon" />
      <span>{{ currentLanguage?.name }}</span>
      <div class="i-ri:arrow-down-s-line op-50" />
    </button>
    <template #popper>
      <DropdownItem
        @click="handSelectLanguage(language)"
        v-for="language in languages"
        :key="language.id"
        :icon="language.icon"
        :text="language.name"
        :checked="editorStore.languageId === language.id"
        checkable
      />
    </template>
  </Dropdown>
</template>
