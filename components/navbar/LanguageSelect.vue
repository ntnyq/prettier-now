<script lang="ts" setup>
import { Check, ChevronDown } from '@lucide/vue'
import { isString } from '@ntnyq/utils'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  return getLanguageIcon(currentLanguage.value)
})

function getLanguageIcon(language: Language) {
  if (!language.icon) {
    return
  }
  if (isString(language.icon)) {
    return language.icon
  }
  return isDark.value ? language.icon.dark : language.icon.light
}

function handSelectLanguage(language: Language) {
  workspaceStore.setLanguageId(language.id)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        :aria-label="currentLanguage?.name"
        variant="ghost"
        size="sm"
        type="button"
        class="h-8 gap-1 px-2"
      >
        <div :class="currentLanguageIcon" />
        <span>{{ currentLanguage?.name }}</span>
        <ChevronDown class="size-4 opacity-50" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      class="w-44"
    >
      <DropdownMenuItem
        @click="handSelectLanguage(language)"
        v-for="language in languages"
        :key="language.id"
      >
        <Check
          :class="[
            workspaceStore.languageId === language.id
              ? 'opacity-100'
              : 'opacity-0',
          ]"
          class="size-4"
        />
        <div :class="getLanguageIcon(language)" />
        <span>{{ language.name }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
