/**
 * @file Dropdown context
 */

import type { InjectionKey } from 'vue'

export interface DropdownContext {
  hide: () => void
}

export const dropdownContextKey: InjectionKey<DropdownContext> = Symbol('dropdownContextKey')
