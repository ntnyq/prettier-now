<script lang="ts" setup>
import { useI18n } from 'petite-vue-i18n'
import { computed, useTemplateRef } from 'vue'
import { LINKS } from '@/constants/meta'
import { version } from '@/package.json'
import { openExternalURL } from '@/utils'

const { t } = useI18n()

const dialogRef = useTemplateRef('dialogRef')

const actions = computed(() => [
  {
    name: t('feedback'),
    icon: 'i-ri:feedback-line',
    action() {
      openExternalURL(LINKS.feedback)
    },
  },
  {
    name: t('changelog'),
    icon: 'i-ri:price-tag-3-line',
    action() {
      openExternalURL(LINKS.changelog)
    },
  },
  {
    name: t('sourceCode'),
    icon: 'i-ri:github-fill',
    action() {
      openExternalURL(LINKS.github)
    },
  },
  {
    name: t('about'),
    icon: 'i-ri:file-info-line',
    action() {
      handleShowDialog()
    },
  },
])

function handleShowDialog() {
  dialogRef.value?.show()
}
</script>

<template>
  <Dropdown
    :show-triggers="['click', 'hover']"
    placement="bottom"
    class="flex"
  >
    <IconButton icon="i-ri:menu-fill" />

    <template #popper>
      <DropdownItem
        @click="item.action?.()"
        v-for="item in actions"
        :key="item.icon"
        :icon="item.icon"
        :text="item.name"
      />
    </template>
  </Dropdown>

  <Dialog
    ref="dialogRef"
    :title="t('aboutApp', { name: 'Prettier Now' })"
  >
    <div class="h-full flex flex-col items-center justify-center gap-2">
      <img
        src="/icon/128.png"
        class="mx-auto mt-10 block w-80px"
        alt="PrettierNow"
      />
      <p class="op-70">v{{ version }}</p>
      <div class="mt-auto p-2 text-center text-sm op-75 hover:op-100">
        <a
          class="hover:underline"
          href="https://github.com/ntnyq/prettier-now"
        >
          source
        </a>
        &middot; made with ❤️ by
        <a
          class="font-semibold hover:underline"
          href="https://twitter.com/ntnyq"
        >
          @ntnyq
        </a>
      </div>
    </div>
  </Dialog>
</template>
