<script lang="ts" setup>
import { computed, watch } from 'vue'
import { languages } from '@/constants/language'
import { useEditorStore } from '@/stores/editor'
import { codemirrorLanguageCache } from '@/utils/cache'
import type { Language } from '@/constants/language'

const editorStore = useEditorStore()

const currentLanguage = computed(() =>
  languages.find(language => language.id === editorStore.activeLanguageId),
)

function handSelectLanguage(language: Language) {
  editorStore.setActiveLanguageId(language.id)
}

watch(
  currentLanguage,
  async () => {
    const languageId = editorStore.activeLanguageId

    if (codemirrorLanguageCache.has(languageId)) return

    const languageSupport = await currentLanguage.value?.extension()

    if (!languageSupport) return

    codemirrorLanguageCache.set(languageId, languageSupport)
  },
  {
    immediate: true,
  },
)
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
        :checked="editorStore.activeLanguageId === language.id"
        checkable
      />
    </template>
  </Dropdown>
</template>
