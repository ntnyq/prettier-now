import { describe, expect, it } from 'vitest'
import { createLineDiff } from '@/utils/diff'

describe('line diff utilities', () => {
  it('marks unchanged, removed, and added lines', () => {
    expect(
      createLineDiff(
        'const a=1\nconsole.log(a)',
        'const a = 1\nconsole.log(a)',
      ),
    ).toEqual([
      {
        id: 'remove-0-0',
        kind: 'removed',
        lineNumber: 1,
        text: 'const a=1',
      },
      {
        id: 'add-1-0',
        kind: 'added',
        lineNumber: 1,
        text: 'const a = 1',
      },
      {
        id: 'same-1-1',
        kind: 'unchanged',
        lineNumber: 2,
        text: 'console.log(a)',
      },
    ])
  })

  it('returns an empty diff for two empty inputs', () => {
    expect(createLineDiff('', '')).toEqual([])
  })
})
