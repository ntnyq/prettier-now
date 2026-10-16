<script setup lang="ts">
import { computed, ref } from 'vue'
import { i18n } from '#i18n'
import { browser } from '#imports'
import { isSafeSourceUrl } from '@/utils/codeBlocks/protocol'
import type { CodeBlockOrigin } from '@/types/codeBlocks'

const props = defineProps<{ origin: CodeBlockOrigin }>()
const canLink = computed(() => isSafeSourceUrl(props.origin.pageUrl))
const label = computed(() =>
  canLink.value
    ? new URL(props.origin.pageUrl).hostname
    : props.origin.pageTitle,
)
const hasError = ref(false)

async function openSource() {
  const source = props.origin
  try {
    const tab = await browser.tabs.get(source.tabId)
    if (
      tab.id !== undefined
      && !tab.incognito
      && (!tab.url || /^(?:https?|file):/.test(tab.url))
    ) {
      await browser.tabs.update(tab.id, { active: true })
      await browser.windows.update(tab.windowId, { focused: true })
      return
    }
  } catch {
    /* Closed source tabs fall back to the validated redacted URL. */
  }
  if (canLink.value) {
    try {
      await browser.tabs.create({ url: source.pageUrl })
    } catch {
      hasError.value = true
    }
  } else {
    hasError.value = true
  }
}
</script>

<template>
  <aside
    class="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 border-b border-border px-4 py-2 text-xs text-muted-foreground"
  >
    <span>{{ i18n.t('codeBlocksFrom', [label]) }}</span>
    <span
      :title="origin.pageTitle"
      class="max-w-72 truncate"
      >{{ origin.pageTitle }}</span
    >
    <time :datetime="new Date(origin.capturedAt).toISOString()">{{
      new Date(origin.capturedAt).toLocaleString()
    }}</time>
    <span
      >{{ origin.language.rawLabel }} ·
      {{ i18n.t(`codeBlocksEvidence.${origin.language.evidence}`) }}</span
    >
    <a
      @click.prevent="openSource"
      v-if="canLink"
      :href="origin.pageUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="underline"
      >{{ i18n.t('codeBlocksSource') }}</a
    >
    <button
      @click="openSource"
      v-else
      type="button"
      class="underline"
    >
      {{ i18n.t('codeBlocksSource') }}
    </button>
    <span
      v-if="hasError"
      role="alert"
      >{{ i18n.t('codeBlocksErrors.PAGE_UNAVAILABLE') }}</span
    >
  </aside>
</template>
