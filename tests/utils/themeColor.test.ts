import { describe, expect, it } from 'vitest'
import {
  applyThemeColorVars,
  DEFAULT_THEME_COLOR,
  getThemeForegroundColor,
  normalizeHexColor,
  toRgbColor,
} from '@/utils/themeColor'

describe('theme color', () => {
  it('normalizes RGB-only hex colors', () => {
    expect(normalizeHexColor('#abc')).toBe('#aabbcc')
    expect(normalizeHexColor('ABCDEF')).toBe('#abcdef')
    expect(normalizeHexColor('#123456')).toBe('#123456')
  })

  it('falls back to the default color for invalid values', () => {
    expect(normalizeHexColor('red')).toBe(DEFAULT_THEME_COLOR)
    expect(normalizeHexColor('#1234')).toBe(DEFAULT_THEME_COLOR)
    expect(normalizeHexColor('#12345678')).toBe(DEFAULT_THEME_COLOR)
  })

  it('converts hex colors to RGB CSS values', () => {
    expect(toRgbColor('#0f75bc')).toBe('rgb(15 117 188)')
  })

  it('chooses readable foreground colors', () => {
    expect(getThemeForegroundColor('#ffffff')).toBe('rgb(24 24 27)')
    expect(getThemeForegroundColor('#111827')).toBe('rgb(255 255 255)')
  })

  it('applies theme CSS variables to an element', () => {
    const element = document.createElement('div')

    applyThemeColorVars('#0f75bc', element)

    expect(element.style.getPropertyValue('--primary')).toBe('rgb(15 117 188)')
    expect(element.style.getPropertyValue('--ring')).toBe('rgb(15 117 188)')
    expect(element.style.getPropertyValue('--sidebar-primary')).toBe(
      'rgb(15 117 188)',
    )
    expect(element.style.getPropertyValue('--primary-foreground')).toBe(
      'rgb(255 255 255)',
    )
  })
})
