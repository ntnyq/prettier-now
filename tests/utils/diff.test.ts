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

  it('returns a truncated diff instead of building large comparison tables', () => {
    const before = Array.from(
      { length: 251 },
      (_, index) => `old ${index}`,
    ).join('\n')
    const after = Array.from(
      { length: 251 },
      (_, index) => `new ${index}`,
    ).join('\n')

    expect(createLineDiff(before, after)).toEqual([
      {
        id: 'truncated',
        kind: 'unchanged',
        lineNumber: 1,
        text: 'Diff is too large to display.',
      },
    ])
  })
})
