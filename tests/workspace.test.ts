import { describe, expect, it } from 'vitest'
import {
  createFormatJobsFromFiles,
  getFormattedFileName,
  updateFormatJobLanguage,
} from '@/utils/workspace'

describe('workspace utilities', () => {
  it('creates format jobs for supported non-empty files only', async () => {
    const files = [
      new File(['const a=1'], 'index.ts'),
      new File(['   '], 'empty.js'),
      new File(['hello'], 'notes.txt'),
      new File(['{"a":1}'], 'data.json'),
    ]

    const jobs = await createFormatJobsFromFiles(files)

    expect(jobs).toEqual([
      {
        id: 'index.ts-0',
        fileName: 'index.ts',
        languageId: 'typescript',
        sourceCode: 'const a=1',
        resultCode: '',
        status: 'pending',
        errorMessage: '',
        formatCost: 0,
      },
      {
        id: 'data.json-3',
        fileName: 'data.json',
        languageId: 'json',
        sourceCode: '{"a":1}',
        resultCode: '',
        status: 'pending',
        errorMessage: '',
        formatCost: 0,
      },
    ])
  })

  it('adds formatted before the original file extension', () => {
    expect(getFormattedFileName('index.ts')).toBe('index.formatted.ts')
    expect(getFormattedFileName('Makefile')).toBe('Makefile.formatted')
  })

  it('preserves source when changing a job language', () => {
    const job = updateFormatJobLanguage(
      {
        id: 'index.ts-0',
        fileName: 'index.ts',
        languageId: 'typescript',
        sourceCode: 'const a=1',
        resultCode: 'const a = 1\\n',
        status: 'formatted',
        errorMessage: 'old error',
        formatCost: 12,
      },
      'javascript',
    )

    expect(job).toEqual({
      id: 'index.ts-0',
      fileName: 'index.ts',
      languageId: 'javascript',
      sourceCode: 'const a=1',
      resultCode: '',
      status: 'pending',
      errorMessage: '',
      formatCost: 0,
    })
  })
})
