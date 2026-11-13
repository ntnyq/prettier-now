import type * as v from 'valibot'
import type { JsonValue } from '@/types/json'

/**
 * Runtime validator for a JSON-compatible persisted value.
 */
export type StorageSchema<Value extends JsonValue> = v.BaseSchema<
  unknown,
  Value,
  v.BaseIssue<unknown>
>
