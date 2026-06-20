export type FormatJobStatus = 'error' | 'formatted' | 'formatting' | 'pending'

export interface FormatJob {
  errorMessage: string
  fileName: string
  formatCost: number
  id: string
  languageId: string
  resultCode: string
  sourceCode: string
  status: FormatJobStatus
}
