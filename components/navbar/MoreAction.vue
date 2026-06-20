<script lang="ts" setup>
import { Info, Menu, MessageSquareText, SquareCode, Tag } from '@lucide/vue'
import { shallowRef } from 'vue'
import { i18n } from '#i18n'
import { browser } from '#imports'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LINKS } from '@/constants/meta'
import { version } from '@/package.json'
import { openExternalURL } from '@/utils'

const logoUrl = browser.runtime.getURL('/icons/48.png')
const isAboutDialogOpen = shallowRef(false)

function openAboutDialog() {
  isAboutDialogOpen.value = true
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        :aria-label="`${i18n.t('feedback')} / ${i18n.t('about')}`"
        variant="ghost"
        size="icon-sm"
        type="button"
      >
        <Menu class="size-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      class="w-44"
    >
      <DropdownMenuItem @click="openExternalURL(LINKS.feedback)">
        <MessageSquareText class="size-4" />
        {{ i18n.t('feedback') }}
      </DropdownMenuItem>
      <DropdownMenuItem @click="openExternalURL(LINKS.changelog)">
        <Tag class="size-4" />
        {{ i18n.t('changelog') }}
      </DropdownMenuItem>
      <DropdownMenuItem @click="openExternalURL(LINKS.github)">
        <SquareCode class="size-4" />
        {{ i18n.t('sourceCode') }}
      </DropdownMenuItem>
      <DropdownMenuItem @click="openAboutDialog">
        <Info class="size-4" />
        {{ i18n.t('about') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <Dialog v-model:open="isAboutDialogOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ i18n.t('aboutApp', [i18n.t('appName')]) }}
        </DialogTitle>
      </DialogHeader>

      <div class="flex min-h-56 flex-col items-center justify-center gap-2">
        <img
          :src="logoUrl"
          :alt="i18n.t('brandAlt')"
          class="mx-auto mt-6 block w-20"
        />
        <p class="opacity-70">v{{ version }}</p>
        <div
          class="mt-auto p-2 text-center text-sm opacity-75 hover:opacity-100"
        >
          <a
            class="hover:underline"
            href="https://github.com/ntnyq/prettier-now"
          >
            {{ i18n.t('aboutSource') }}
          </a>
          &middot; {{ i18n.t('aboutMadeWithBy') }}
          <a
            class="font-semibold hover:underline"
            href="https://twitter.com/ntnyq"
          >
            @ntnyq
          </a>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
