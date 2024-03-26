/**
 * @file Validate Prettier Options
 */

import { object, safeParse } from 'valibot'

const PrettierOptionsSchema = object({})

export function validatePrettierOptions(val = {}) {
  return safeParse(PrettierOptionsSchema, val)
}
