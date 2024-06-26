import { defineConfig } from 'wxt'
import vue from '@vitejs/plugin-vue'
import unoCSS from 'unocss/vite'
import vueComponents from 'unplugin-vue-components/vite'
import { resolve } from './scripts/utils'
import type { Command } from '@/constants/command'
import type { Manifest } from 'wxt/browser'

// See https://wxt.dev/api/config.html
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
    presets: [
      'vue',
      'pinia',
      'vue-router',
      'vue-i18n',
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
      // Workaround for vue-i18n CSP issue
      __INTLIFY_JIT_COMPILATION__: JSON.stringify(true),
    },

    plugins: [
      vue(),

      unoCSS(),

      vueComponents({
        dirs: [resolve('components')],
        dts: 'types/components.d.ts',
        resolvers: [],
      }),
    ],
  }),
})
