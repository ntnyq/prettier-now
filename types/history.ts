import type { JsonObject } from '@/types/json'

export interface FormatHistoryEntry extends JsonObject {
  fileName: string
  formatCost: number
  formattedAt: number
  id: string
  languageId: string
  resultCode: string
  sourceCode: string
}
