/**
 * @file types/json-value.d.ts
 * @copyright type-fest
 * @see {@link https://github.com/sindresorhus/type-fest}
 */

/**
 * JSON-compatible array value.
 */
export type JsonArray = JsonValue[] | readonly JsonValue[]

/**
 * JSON-compatible object value.
 */
export type JsonObject = { [Key in string]: JsonValue } & {
  /**
   * JSON-compatible object property value.
   */
  [Key in string]?: JsonValue | undefined
}

/**
 * Primitive value supported by JSON.
 */
export type JsonPrimitive = boolean | number | string | null

/**
 * Any value that can be safely represented as JSON.
 */
export type JsonValue = JsonArray | JsonObject | JsonPrimitive
