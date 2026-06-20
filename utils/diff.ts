export type DiffLineKind = 'added' | 'removed' | 'unchanged'

export interface DiffLine {
  id: string
  kind: DiffLineKind
  lineNumber: number
  text: string
}

function splitLines(source: string) {
  if (!source.length) {
    return []
  }

  return source.split('\n')
}

export function createLineDiff(before: string, after: string) {
  const beforeLines = splitLines(before)
  const afterLines = splitLines(after)
  const table = Array.from({ length: beforeLines.length + 1 }, () =>
    Array.from({ length: afterLines.length + 1 }, () => 0),
  )

  for (
    let beforeIndex = beforeLines.length - 1;
    beforeIndex >= 0;
    beforeIndex--
  ) {
    for (
      let afterIndex = afterLines.length - 1;
      afterIndex >= 0;
      afterIndex--
    ) {
      table[beforeIndex]![afterIndex] =
        beforeLines[beforeIndex] === afterLines[afterIndex]
          ? table[beforeIndex + 1]![afterIndex + 1]! + 1
          : Math.max(
              table[beforeIndex + 1]![afterIndex]!,
              table[beforeIndex]![afterIndex + 1]!,
            )
    }
  }

  const diffLines: DiffLine[] = []
  let beforeIndex = 0
  let afterIndex = 0

  while (beforeIndex < beforeLines.length && afterIndex < afterLines.length) {
    const beforeLine = beforeLines[beforeIndex]!
    const afterLine = afterLines[afterIndex]!

    if (beforeLine === afterLine) {
      diffLines.push({
        id: `same-${beforeIndex}-${afterIndex}`,
        kind: 'unchanged',
        lineNumber: afterIndex + 1,
        text: beforeLine,
      })
      beforeIndex++
      afterIndex++
      continue
    }

    if (
      table[beforeIndex + 1]![afterIndex]!
      >= table[beforeIndex]![afterIndex + 1]!
    ) {
      diffLines.push({
        id: `remove-${beforeIndex}-${afterIndex}`,
        kind: 'removed',
        lineNumber: beforeIndex + 1,
        text: beforeLine,
      })
      beforeIndex++
    } else {
      diffLines.push({
        id: `add-${beforeIndex}-${afterIndex}`,
        kind: 'added',
        lineNumber: afterIndex + 1,
        text: afterLine,
      })
      afterIndex++
    }
  }

  while (beforeIndex < beforeLines.length) {
    diffLines.push({
      id: `remove-${beforeIndex}-${afterIndex}`,
      kind: 'removed',
      lineNumber: beforeIndex + 1,
      text: beforeLines[beforeIndex]!,
    })
    beforeIndex++
  }

  while (afterIndex < afterLines.length) {
    diffLines.push({
      id: `add-${beforeIndex}-${afterIndex}`,
      kind: 'added',
      lineNumber: afterIndex + 1,
      text: afterLines[afterIndex]!,
    })
    afterIndex++
  }

  return diffLines
}
