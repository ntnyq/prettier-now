// @ts-check

import { defineESLintConfig } from '@ntnyq/eslint-config'

export default defineESLintConfig({
  oxfmt: true,
  prettier: false,
  svgo: true,
  vue: {
    overrides: {
      'vue/no-literals-in-template': 'off',
    },
  },
})
