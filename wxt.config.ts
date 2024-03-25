import { defineConfig } from 'wxt'
import vue from '@vitejs/plugin-vue'
import unoCSS from 'unocss/vite'
import vueComponents from 'unplugin-vue-components/vite'
import { resolve } from './scripts/utils'

// See https://wxt.dev/api/config.html
export default defineConfig({
  outDir: 'dist',

  manifest: {
    name: 'Prettier Now',
    permissions: [
      'storage',
      // Open tabs in background
      'tabs',
    ],
    homepage_url: 'https://github.com/ntnyq/prettier-now',
  },

  runner: {
    chromiumArgs: ['--auto-open-devtools-for-tabs'],
    startUrls: ['https://ntnyq.com'],
  },

  imports: {
    addons: {
      vueTemplate: true,
    },
  },

  vite: () => ({
    css: {
      devSourcemap: true,
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
