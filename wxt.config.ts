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
  // TODO: use dynamic import
  // hooks: {
  //   'vite:build:extendConfig': (entrypoints, viteConfig) => {
  //     if (entrypoints.some(entrypoint => entrypoint.type === 'options')) {
  //       if (!viteConfig.build?.rollupOptions?.output) return

  //       function manualChunks(id: string) {
  //         if (!id.includes('node_modules')) return

  //         if (id.includes('codemirror')) {
  //           return 'libs-codemirror'
  //         } else if (id.includes('vue')) {
  //           return 'libs-vue'
  //         } else if (id.includes('lodash')) {
  //           return 'libs-lodash'
  //         } else if (id.includes('@prettier') || id.includes('prettier/plugin')) {
  //           return 'libs-prettier-official'
  //         } else if (id.includes('svelte')) {
  //           return 'libs-lang-svelte'
  //         } else if (id.includes('javascript')) {
  //           return 'libs-lang-javascript'
  //         } else if (id.includes('java')) {
  //           return 'libs-lang-java'
  //         } else if (id.includes('graphql')) {
  //           return 'libs-lang-graphql'
  //         }
  //       }

  //       if (Array.isArray(viteConfig.build.rollupOptions.output)) {
  //         viteConfig.build.rollupOptions.output.forEach(item => {
  //           item.manualChunks = manualChunks
  //         })
  //       } else {
  //         viteConfig.build.rollupOptions.output.manualChunks = manualChunks
  //       }
  //     }
  //   },
  // },

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

  imports: false,

  vite: () => ({
    css: {
      devSourcemap: true,
    },

    build: {
      // Max per file size for Firefox is 4MB.
      chunkSizeWarningLimit: 4 * 1024,
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
