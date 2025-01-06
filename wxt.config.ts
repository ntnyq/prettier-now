/**
 * @file WXT config
 * @see {@link https://wxt.dev/api/config.html}
 */

import VueComponents from 'unplugin-vue-components/vite'
import { defineConfig } from 'wxt'
import { resolve } from './scripts/utils'
import type { Manifest } from 'wxt/browser'
import type { Command } from '@/constants/command'

export default defineConfig({
  extensionApi: 'chrome',

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

    optimizeDeps: {
      // https://github.com/vitejs/vite/discussions/13306
      entries: ['**/entrypoints/**/*.html'],
    },

    plugins: [
      VueComponents({
        dirs: [resolve('components')],
        dts: 'types/components.d.ts',
        resolvers: [],
      }),
    ],
  }),

  autoIcons: {
    baseIconPath: 'assets/images/icon.png',
  },

  manifest: {
    default_locale: 'en',
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

  modules: [
    '@wxt-dev/unocss',
    '@wxt-dev/auto-icons',
    '@wxt-dev/module-vue',
    /**
     * @see {@link https://wxt.dev/i18n.html}
     * @see {@link https://developer.chrome.com/docs/extensions/reference/api/i18n}
     */
    '@wxt-dev/i18n/module',
  ],
})
