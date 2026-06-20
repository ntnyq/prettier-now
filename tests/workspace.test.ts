import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createFormatJobsFromFiles,
  downloadTextFile,
  getFormattedFileName,
  updateFormatJobLanguage,
} from '@/utils/workspace'

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

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
        id: expect.stringMatching(/^index\.ts-0-/),
        fileName: 'index.ts',
        languageId: 'typescript',
        sourceCode: 'const a=1',
        resultCode: '',
        status: 'pending',
        errorMessage: '',
        formatCost: 0,
      },
      {
        id: expect.stringMatching(/^data\.json-3-/),
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

  it('creates fresh job ids for repeated file selections', async () => {
    const files = [new File(['const a=1'], 'index.ts')]

    const firstJobs = await createFormatJobsFromFiles(files)
    const secondJobs = await createFormatJobsFromFiles(files)

    expect(firstJobs[0]?.id).not.toBe(secondJobs[0]?.id)
  })

  it('defers object url revocation until after the download click', () => {
    vi.useFakeTimers()

    const createObjectURL = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:download')
    const revokeObjectURL = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {})
    const click = vi.fn()
    vi.stubGlobal('document', {
      createElement: vi.fn(() => ({
        click,
        download: '',
        href: '',
      })),
    })
    vi.stubGlobal('window', {
      setTimeout,
    })

    downloadTextFile('index.ts', 'const a=1')

    expect(createObjectURL).toHaveBeenCalledOnce()
    expect(click).toHaveBeenCalledOnce()
    expect(revokeObjectURL).not.toHaveBeenCalled()

    vi.runAllTimers()

    expect(revokeObjectURL).toHaveBeenCalledWith('blob:download')
  })
})
