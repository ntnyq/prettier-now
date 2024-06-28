/**
 * @file Dropdown context
 */

import type { InjectionKey } from 'vue'

export const dropdownContextKey: InjectionKey<{ hide: () => void }> = Symbol('dropdownContextKey')
