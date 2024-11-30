import { defineESLintConfig } from '@ntnyq/eslint-config'

export default defineESLintConfig({
  perfectionist: {
    overridesConstantsRules: {
      'perfectionist/sort-objects': [
        'error',
        {
          order: 'asc',
          partitionByComment: true,
          type: 'alphabetical',
        },
      ],
    },
  },
})
