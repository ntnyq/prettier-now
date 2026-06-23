<script lang="ts" setup>
import { i18n } from '#i18n'
import { browser } from '#imports'
import { Button } from '@/components/ui/button'
import { useThemeColor } from '@/composables/themeColor'

const isMac = navigator.userAgent.includes('Mac OS X')

useThemeColor()

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <div class="flex h-40 w-60 flex-col items-center justify-center gap-5">
    <Button
      @click="openOptionsPage"
      type="button"
    >
      {{ i18n.t('openOptionsPage') }}
    </Button>
    <p class="inline-flex items-center text-lg">
      <span class="mr-2">{{ i18n.t('popupOrUse') }}</span>
      <kbd
        class="inline-flex items-center justify-center rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-muted-foreground shadow-[0px_2px_0px_0px_rgba(0,0,0,0.08)] dark:shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)]"
      >
        {{ `${isMac ? 'Option' : 'Alt'}+O` }}
      </kbd>
    </p>
  </div>
</template>
