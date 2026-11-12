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
      overrides: {
        'vue-perfectionist/padding-line-between-tags': [
          'error',
          {
            ignoreComments: true,
            targets: [
              {
                tag: 'SettingItem',
              },
            ],
          },
        ],
      },
    },
  },
})
