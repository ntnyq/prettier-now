/**
 * @file WXT config
 * @see {@link https://wxt.dev/api/config.html}
 */

import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import VueComponents from 'unplugin-vue-components/vite'
import { defineConfig } from 'wxt'
import { resolve } from './scripts/utils'
import type { Manifest } from 'wxt/browser'
import type { Command } from '@/constants/command'

export default defineConfig({
  imports: false,

  outDir: 'dist',

  vite: () => ({
    build: {
      // Max per file size for Firefox is 4MB.
      chunkSizeWarningLimit: 4 * 1024,
    },

    css: {
      devSourcemap: true,
    },

    define: {
      __INTLIFY_JIT_COMPILATION__: JSON.stringify(true),
    },

    plugins: [
      Vue(),

      UnoCSS(),

      VueComponents({
        dirs: [resolve('components')],
        dts: 'types/components.d.ts',
        resolvers: [],
      }),
    ],
  }),

  manifest: {
    homepage_url: 'https://github.com/ntnyq/prettier-now',
    name: 'Prettier Now',
    permissions: ['storage', 'contextMenus'],
    commands: {
      openOptionsPage: {
        description: 'Open the Options page',
        suggested_key: {
          default: 'Alt+O',
        },
      },
    } satisfies Record<Command, Manifest.WebExtensionManifestCommandsType>,
  },

  runner: {
    chromiumArgs: ['--auto-open-devtools-for-tabs'],
    startUrls: ['https://ntnyq.com'],
  },
})
