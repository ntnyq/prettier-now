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
    'border-base': 'border-$c-border',
    'border-bg-base': 'border-$c-bg-base',
    'bg-base': 'bg-$c-bg-base',
    'text-base': 'text-$c-text-base',
    'btn-icon':
      'h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700',
    'btn-action':
      'text-lg min-w-[140px] rounded-md bg-$c-text-base px-3 py-2 text-$c-bg-base transition hover:opacity-90',
  },

  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        color: 'inherit',
        // Avoid crushing of icons in crowded situations
        'min-width': '1.2em',
      },
    }),
  ],

  transformers: [transformerDirectives(), transformerVariantGroup()],
})
