<script lang="ts" setup>
import { Check, ChevronDown, FileCode2 } from '@lucide/vue'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { languages } from '@/constants/language'
import { useWorkspaceStore } from '@/stores/workspace'
import type { Language } from '@/types/language'

const workspaceStore = useWorkspaceStore()

const currentLanguage = computed(() =>
  languages.find(language => language.id === workspaceStore.languageId),
)

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
        <FileCode2 class="size-4 text-muted-foreground" />
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
        <FileCode2 class="size-4 text-muted-foreground" />
        <span>{{ language.name }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
