<script lang="ts" setup>
import { computed } from 'vue'
import { languages } from '@/constants/language'
import { useEditorStore } from '@/stores/editor'

const editorStore = useEditorStore()

const currentLanguage = computed(() =>
  languages.find(lang => lang.id === editorStore.activeLanguage),
)
</script>

<template>
  <Dropdown class="flex">
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
        checkable
      />
    </template>
  </Dropdown>
</template>
