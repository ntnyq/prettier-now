import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function readComponent(path: string) {
  return readFileSync(resolve(import.meta.dirname, `../${path}`), 'utf8')
}

describe('vue template bindings', () => {
  it('uses explicit primitive bindings for shadcn buttons', () => {
    const source = readComponent('components/ui/button/Button.vue')

    expect(source).toContain(':as="props.as"')
    expect(source).toContain(':as-child="props.asChild"')
    expect(source).not.toContain('\n    :as\n')
    expect(source).not.toContain('\n    :as-child\n')
  })

  it('forwards setting control props with explicit expressions', () => {
    const switchSource = readComponent('components/settings/SettingSwitch.vue')
    const numberSource = readComponent(
      'components/settings/SettingNumberField.vue',
    )
    const selectSource = readComponent('components/settings/SettingSelect.vue')

    for (const source of [switchSource, numberSource, selectSource]) {
      expect(source).toContain(':aria-describedby="props.ariaDescribedby"')
      expect(source).toContain(':aria-labelledby="props.ariaLabelledby"')
      expect(source).not.toContain('\n    :aria-describedby\n')
      expect(source).not.toContain('\n    :aria-labelledby\n')
    }

    expect(numberSource).toContain(':max="props.max"')
    expect(numberSource).toContain(':min="props.min"')
    expect(numberSource).toContain(':step="props.step"')
    expect(numberSource).not.toContain('\n    :max\n')
    expect(numberSource).not.toContain('\n    :min\n')
    expect(numberSource).not.toContain('\n    :step\n')
  })
})
