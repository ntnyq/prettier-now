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
  outDir: 'dist',

  manifest: {
    name: 'Prettier Now',
    permissions: ['storage'],
    homepage_url: 'https://github.com/ntnyq/prettier-now',
    commands: {
      openOptionsPage: {
        suggested_key: {
          default: 'Alt+O',
        },
        description: 'Open the Options page',
      },
    } satisfies Record<Command, Manifest.WebExtensionManifestCommandsType>,
  },

  runner: {
    chromiumArgs: ['--auto-open-devtools-for-tabs'],
    startUrls: ['https://ntnyq.com'],
  },

  imports: {
    dirs: [],
    presets: [
      'vue',
      'pinia',
      'vue-router',
      {
        package: '@vueuse/core',
        ignore: [
          // exported from `vue`
          'toRef',
          'toRefs',
          'toValue',
          // exported from `wxt/storage`
          'useStorage',
        ],
      },
    ],
    addons: {
      vueTemplate: true,
    },
  },

  vite: () => ({
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
})
