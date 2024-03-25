<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Menu as VMenu } from 'floating-vue'
import { isDark } from '@/hooks/useDark'
import { LANGUAGES } from '@/constants/languages'
import type { Language } from '@/constants/languages'

const languages = ref<Language[]>(LANGUAGES)
const currentLanguageId = ref('javascript')
const currentLanguage = computed(() => {
  return languages.value.find(lang => lang.id === currentLanguageId.value)
})

const changeLanguage = (id: string) => {
  currentLanguageId.value = id
}
</script>

<template>
  <VMenu
    :class="{ dark: isDark }"
    :auto-hide="false"
    :dispose-timeout="1000000"
    class="flex"
  >
    <button class="flex items-center gap-1">
      <div :class="currentLanguage?.icon" />
      {{ currentLanguage?.label }}
    </button>
    <template #popper>
      <DropdownItem
        @click="changeLanguage(lang.id)"
        v-for="lang in languages"
        :key="lang.id"
        :icon="lang.icon"
        :text="lang.label"
        :checked="currentLanguageId === lang.id"
      />
    </template>
  </VMenu>
</template>
