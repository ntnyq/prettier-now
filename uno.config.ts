/**
 * @file UnoCSS config
 */

import {
  defineConfig,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  safelist: [],

  shortcuts: {
    'bg-base': 'bg-$c-bg-base',
    'text-base': 'text-$c-text-base',
    'border-base': 'border-$c-border',
    'border-bg-base': 'border-$c-bg-base',

    'flex-center': 'flex items-center justify-center',

    'z-tooltip': 'z-200',
    'z-dialog': 'z-500',
    'z-dropzone': 'z-1000',

    'kbd-key':
      'inline-flex items-center justify-center border border-gray-200 rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs text-gray-800 font-semibold font-mono shadow-[0px_2px_0px_0px_rgba(0,0,0,0.08)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)]',

    'icon-button':
      'h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700',
    'btn-action':
      'min-w-140px rounded-md bg-$c-text-base px-3 py-2 text-$c-bg-base transition hover:opacity-90',
  },

  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      autoInstall: true,
      extraProperties: {
        color: 'inherit',
        // Avoid crushing of icons in crowded situations
        'min-width': '1.2em',
      },
    }),
  ],

  transformers: [transformerDirectives(), transformerVariantGroup()],
})
