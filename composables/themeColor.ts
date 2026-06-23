/**
 * @file useThemeColor
 */

import { useCssVar, watchImmediate } from '@vueuse/core'
import { useConfigStore } from '@/stores/config'
import {
  getThemeForegroundColor,
  normalizeHexColor,
  toRgbColor,
} from '@/utils/themeColor'

export function useThemeColor() {
  const configStore = useConfigStore()
  const target = document.documentElement
  const primary = useCssVar('--primary', target)
  const primaryForeground = useCssVar('--primary-foreground', target)
  const ring = useCssVar('--ring', target)
  const sidebarPrimary = useCssVar('--sidebar-primary', target)
  const sidebarPrimaryForeground = useCssVar(
    '--sidebar-primary-foreground',
    target,
  )

  watchImmediate(
    () => configStore.themeColor,
    value => {
      const normalizedColor = normalizeHexColor(value)

      if (normalizedColor !== value) {
        configStore.themeColor = normalizedColor
        return
      }

      const rgbColor = toRgbColor(normalizedColor)
      const foregroundColor = getThemeForegroundColor(normalizedColor)

      primary.value = rgbColor
      ring.value = rgbColor
      sidebarPrimary.value = rgbColor
      primaryForeground.value = foregroundColor
      sidebarPrimaryForeground.value = foregroundColor
    },
  )

  return {
    themeColor: configStore.themeColor,
  }
}
