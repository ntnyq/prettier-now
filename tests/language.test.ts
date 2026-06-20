import { describe, expect, it } from 'vitest'
import { LANGUAGE_ID, languages } from '@/constants/language'
import { languageIconCollection } from '@/constants/languageIconCollection'
import type { Language } from '@/types/language'

function getIconNames(icon: Language['icon']) {
  return typeof icon === 'string' ? [icon] : [icon.dark, icon.light]
}

describe('language metadata', () => {
  it('keeps language icons for every selectable language', () => {
    expect(languages.every(language => Boolean(language.icon))).toBe(true)
  })

  it('exposes pug as a selectable language', () => {
    expect(languages).toContainEqual(
      expect.objectContaining({
        id: LANGUAGE_ID.pug,
        name: 'Pug',
      }),
    )
  })

  it('keeps theme-aware icons for languages that need light variants', () => {
    expect(
      languages.find(language => language.id === LANGUAGE_ID.json)?.icon,
    ).toEqual({
      dark: 'vscode-icons:file-type-json',
      light: 'vscode-icons:file-type-light-json',
    })
    expect(
      languages.find(language => language.id === LANGUAGE_ID.yaml)?.icon,
    ).toEqual({
      dark: 'vscode-icons:file-type-yaml-official',
      light: 'vscode-icons:file-type-light-yaml-official',
    })
    expect(
      languages.find(language => language.id === LANGUAGE_ID.toml)?.icon,
    ).toEqual({
      dark: 'vscode-icons:file-type-toml',
      light: 'vscode-icons:file-type-light-toml',
    })
  })

  it('keeps every referenced language icon in the local icon collection', () => {
    const registeredIcons = new Set(
      Object.keys(languageIconCollection.icons).map(
        icon => `${languageIconCollection.prefix}:${icon}`,
      ),
    )

    expect(
      languages
        .flatMap(language => getIconNames(language.icon))
        .every(icon => registeredIcons.has(icon)),
    ).toBe(true)
  })

  it('keeps the original vscode icon viewport size', () => {
    expect(languageIconCollection.width).toBe(32)
    expect(languageIconCollection.height).toBe(32)
  })
})
