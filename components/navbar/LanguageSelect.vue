<script lang="ts" setup>
import { addCollection, Icon } from '@iconify/vue'
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
import { languageIconCollection } from '@/constants/languageIconCollection'
import { useWorkspaceStore } from '@/stores/workspace'
import type { ThemeableValue } from '@/types'
import type { Language } from '@/types/language'

const workspaceStore = useWorkspaceStore()

addCollection(languageIconCollection)

const currentLanguage = computed(() =>
  languages.find(language => language.id === workspaceStore.languageId),
)
const currentLanguageIcon = computed(() =>
  currentLanguage.value ? getLanguageIcon(currentLanguage.value.icon) : '',
)

function getLanguageIcon(icon: ThemeableValue<string>) {
  return isString(icon) ? icon : isDark.value ? icon.dark : icon.light
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
        <Icon
          :icon="currentLanguageIcon"
          class="size-4"
        />
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
        <Icon
          :icon="getLanguageIcon(language.icon)"
          class="size-4"
        />
        <span>{{ language.name }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
