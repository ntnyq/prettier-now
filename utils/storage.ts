/**
 * Recover arrays serialized as numeric-key objects by older Chromium builds.
 *
 * @param input - Untrusted persisted array representation.
 * @returns An array when numeric keys form a contiguous sequence.
 */
export function normalizeStoredArray(input: unknown): unknown {
  if (input !== null && typeof input === 'object' && !Array.isArray(input)) {
    const entries = Object.entries(input)
    if (entries.every(([key], index) => key === String(index))) {
      return entries.map(([, item]) => item)
    }
  }
  return input
}

/**
 * Compare JSON representations without treating object key order as a change.
 *
 * @param left - Current storage value.
 * @param right - Normalized value to compare.
 * @returns Whether both values contain the same JSON data.
 */
export function areStorageValuesEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) {
    return true
  }
  if (
    !left
    || !right
    || typeof left !== 'object'
    || typeof right !== 'object'
    || Array.isArray(left) !== Array.isArray(right)
  ) {
    return false
  }
  const leftEntries = Object.entries(left)
  const rightEntries = Object.entries(right)
  if (
    Array.isArray(left)
    && Array.isArray(right)
    && left.length !== right.length
  ) {
    return false
  }
  if (leftEntries.length !== rightEntries.length) {
    return false
  }
  const rightValues = new Map(rightEntries)
  return leftEntries.every(
    ([key, value]) =>
      rightValues.has(key)
      && areStorageValuesEqual(value, rightValues.get(key)),
  )
}

/**
 * Resolve a field patch for a nested edit to a JSON object.
 *
 * @param previous - Last observed local snapshot.
 * @param next - Snapshot after the edit.
 * @returns Changed fields, or undefined when a replacement is required.
 */
export function getStorageFieldChanges(
  previous: unknown,
  next: unknown,
): Record<string, unknown> | undefined {
  if (
    !previous
    || !next
    || typeof previous !== 'object'
    || typeof next !== 'object'
    || Array.isArray(previous)
    || Array.isArray(next)
  ) {
    return undefined
  }
  if (Object.keys(previous).some(key => !Object.hasOwn(next, key))) {
    return undefined
  }
  const previousValues = new Map(Object.entries(previous))
  return Object.fromEntries(
    Object.entries(next).filter(
      ([key, value]) => !areStorageValuesEqual(value, previousValues.get(key)),
    ),
  )
}

/**
 * Serialize storage operations sharing an existing local key.
 *
 * @param key - Storage key, including its storage-area prefix.
 * @param operation - Work that must finish before another writer can proceed.
 * @returns The operation's acknowledged result.
 */
export function withStorageLock<Result>(
  key: string,
  operation: () => Promise<Result>,
): Promise<Result> {
  return navigator.locks.request(`prettier-now:${key}`, operation)
}
