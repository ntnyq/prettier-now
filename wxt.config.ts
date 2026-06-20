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
    // Max per file size for Firefox is 4MB.
    chunkSizeWarningLimit: 4 * 1024,
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
})) as WxtViteConfigFactory

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
    permissions: ['storage', 'contextMenus'],
    commands: {
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
  },

  modules: [
    '@wxt-dev/auto-icons',
    '@wxt-dev/module-vue',
    '@wxt-dev/i18n/module',
  ],
})
