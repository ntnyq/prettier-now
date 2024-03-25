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
