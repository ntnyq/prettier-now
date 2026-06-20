<script lang="ts" setup>
import { isString } from '@ntnyq/utils'
import { computed } from 'vue'
import { isDark } from '@/composables/dark'
import { languages } from '@/constants/language'
import { useWorkspaceStore } from '@/stores/workspace'
import type { Language } from '@/types/language'

const workspaceStore = useWorkspaceStore()

const currentLanguage = computed(() =>
  languages.find(language => language.id === workspaceStore.languageId),
)
const currentLanguageIcon = computed(() => {
  if (!currentLanguage.value?.icon) {
    return
  }
  if (isString(currentLanguage.value.icon)) {
    return currentLanguage.value.icon
  }
  return isDark.value
    ? currentLanguage.value.icon.dark
    : currentLanguage.value.icon.light
})

function handSelectLanguage(language: Language) {
  workspaceStore.setLanguageId(language.id)
}
</script>

<template>
  <Dropdown class="flex">
    <button
      type="button"
      role="button"
      class="flex items-center gap-1 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-700"
    >
      <div :class="currentLanguageIcon" />
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
        :checked="workspaceStore.languageId === language.id"
        checkable
      />
    </template>
  </Dropdown>
</template>
