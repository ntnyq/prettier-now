<script setup lang="ts">
import { ref } from 'vue'
import { i18n } from '#i18n'
import { Button } from '@/components/ui/button'
import { languages } from '@/constants/language'
import { downloadTextFile } from '@/utils/workspace'
import type { PendingCodeBlock } from '@/composables/codeBlockImport'

defineProps<{ pendingItems: PendingCodeBlock[]; isBusy: boolean }>()
const emit = defineEmits<{ resolve: [key: string, languageId?: string] }>()
const selected = ref<Record<string, string>>({})
const copyMessage = ref('')

async function copy(source: string) {
  try {
    await navigator.clipboard.writeText(source)
    copyMessage.value = i18n.t('copiedToClipboard')
  } catch {
    copyMessage.value = i18n.t('failedToCopyToClipboard')
  }
}
</script>

<template>
  <section
    v-if="pendingItems.length"
    class="max-h-[40vh] shrink-0 space-y-3 overflow-y-auto border-b border-border bg-muted/30 p-4"
  >
    <h2 class="font-semibold">
      {{ i18n.t('codeBlocksPending', [pendingItems.length]) }}
    </h2>
    <p class="text-xs text-muted-foreground">
      {{ i18n.t('codeBlocksHistoryNotice') }}
    </p>
    <article
      v-for="entry in pendingItems"
      :key="entry.key"
      class="space-y-2 rounded-md border border-border p-3"
    >
      <p class="text-sm">
        {{ entry.request.source.pageTitle }} ·
        {{ entry.item.language.rawLabel ?? i18n.t('codeBlocksUnknown') }} ·
        {{ i18n.t(`codeBlocksEvidence.${entry.item.language.evidence}`) }}
      </p>
      <p
        v-if="entry.item.language.status === 'unsupported'"
        class="text-sm"
      >
        {{
          i18n.t('codeBlocksUnsupported', [entry.item.language.rawLabel ?? ''])
        }}
      </p>
      <pre
        tabindex="0"
        class="max-h-36 overflow-auto rounded bg-background p-2 text-xs"
        >{{ entry.item.sourceCode }}</pre>
      <div class="flex flex-wrap items-center gap-2">
        <select
          v-model="selected[entry.key]"
          :aria-label="i18n.t('codeBlocksChooseLanguage')"
          class="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option
            :value="undefined"
            disabled
          >
            {{ i18n.t('codeBlocksChooseLanguage') }}
          </option>
          <option
            v-for="language in languages"
            :key="language.id"
            :value="language.id"
          >
            {{ language.name }}
          </option>
        </select>
        <Button
          @click="emit('resolve', entry.key, selected[entry.key])"
          :disabled="isBusy || !selected[entry.key]"
          size="sm"
          >{{ i18n.t('codeBlocksImport') }}</Button
        >
        <Button
          @click="copy(entry.item.sourceCode)"
          variant="outline"
          size="sm"
          >{{ i18n.t('codeBlocksCopy') }}</Button
        >
        <Button
          @click="downloadTextFile('snippet.txt', entry.item.sourceCode)"
          variant="outline"
          size="sm"
          >{{ i18n.t('codeBlocksDownload') }}</Button
        >
        <Button
          @click="emit('resolve', entry.key)"
          :disabled="isBusy"
          variant="ghost"
          size="sm"
          >{{ i18n.t('codeBlocksDiscard') }}</Button
        >
      </div>
    </article>
    <p
      role="status"
      class="text-sm"
    >
      {{ copyMessage }}
    </p>
  </section>
</template>
