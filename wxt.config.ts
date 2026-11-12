/**
 * @file WXT config
 * @see {@link https://wxt.dev/api/config.html}
 */

import tailwindcss from '@tailwindcss/vite'
import VueComponents from 'unplugin-vue-components/vite'
import { defineConfig } from 'wxt'
import { resolve } from './scripts/utils'

type WxtConfig = Parameters<typeof defineConfig>[0]
type WxtViteConfigFactory = NonNullable<WxtConfig['vite']>

const viteConfig = (() => ({
  build: {
    // AMO's text parsing limit is 5 MiB; binary WASM assets are exempt.
    // Vite measures this JS chunk warning threshold in decimal kB.
    // https://github.com/mozilla/addons-linter/blob/master/src/const.js
    chunkSizeWarningLimit: (5 * 1024 ** 2) / 1000,
    rolldownOptions: {
      logLevel: 'silent',
    },
  },

  css: {
    devSourcemap: true,
  },

  optimizeDeps: {
    // https://github.com/vitejs/vite/discussions/13306
    entries: ['**/entrypoints/**/*.html'],
  },

  plugins: [
    tailwindcss(),
    VueComponents({
      dirs: [resolve('components')],
      dts: resolve('types/components.d.ts'),
      resolvers: [],
    }),
  ],

  resolve: {
    alias: {
      // Use single-threaded WASM in extension pages, including Firefox.
      tombit: resolve('utils/tomlBrowser.ts'),
    },
  },
})) satisfies WxtViteConfigFactory

export default defineConfig({
  imports: false,
  outDir: 'dist',

  vite: viteConfig,

  autoIcons: {
    baseIconPath: 'assets/images/icon.png',
  },

  manifest: {
    default_locale: 'en',
    description: '__MSG_appDescription__',
    homepage_url: 'https://github.com/ntnyq/prettier-now',
    name: '__MSG_appName__',
    permissions: ['storage', 'contextMenus', 'activeTab'],
    commands: {
      formatFocusedEditor: {
        description: '__MSG_formatFocusedEditor__',
      },
      openOptionsPage: {
        description: '__MSG_openOptionsPage__',
        suggested_key: {
          default: 'Alt+O',
        },
      },
    },
    // Browser.Manifest.WebExtensionManifestCommandsType
    content_security_policy: {
      // Required by wasm-based parser/runtime chunks used by formatter plugins.
      // This applies only to extension pages (not web pages) under MV3.
      extension_pages: `script-src 'self' 'wasm-unsafe-eval'; object-src 'self';`,
    },
    web_accessible_resources: [
      {
        matches: ['<all_urls>'],
        resources: ['focused-editor-formatter.html', 'chunks/*'],
      },
    ],
  },

  modules: [
    '@wxt-dev/auto-icons',
    '@wxt-dev/module-vue',
    '@wxt-dev/i18n/module',
  ],
})
