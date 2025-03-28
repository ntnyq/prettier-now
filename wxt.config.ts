/**
 * @file WXT config
 * @see {@link https://wxt.dev/api/config.html}
 */

import VueComponents from 'unplugin-vue-components/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { defineConfig } from 'wxt'
import { resolve } from './scripts/utils'
// import type { Browser } from 'wxt/browser'
// import type { Command } from '@/constants/command'

export default defineConfig({
  imports: false,
  outDir: 'dist',

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
    },
    // Browser.Manifest.WebExtensionManifestCommandsType
    content_security_policy: {
      extension_pages: `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';`,
    },
  },

  modules: [
    '@wxt-dev/unocss',
    '@wxt-dev/auto-icons',
    '@wxt-dev/module-vue',
    '@wxt-dev/i18n/module',
  ],

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
      nodePolyfills({
        include: ['assert', 'process', 'util'],
      }),
      VueComponents({
        dirs: [resolve('components')],
        dts: resolve('types/components.d.ts'),
        resolvers: [],
      }),
    ],
  }),
})
