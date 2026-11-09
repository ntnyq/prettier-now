// @ts-check

import { defineESLintConfig } from '@ntnyq/eslint-config'

export default defineESLintConfig({
  svgo: true,
  specials: {
    shadcnVue: {
      overrides: {
        'vue-perfectionist/prefer-define-model': 'off',
      },
    },
  },
  vue: {
    vuePerfectionist: {
      autoImport: true,
      overrides: {},
    },
  },
})
