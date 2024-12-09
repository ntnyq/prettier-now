/**
 * @file types/json-value.d.ts
 * @copyright type-fest
 * @see {@link https://github.com/sindresorhus/type-fest}
 */

export type JsonArray = JsonValue[] | readonly JsonValue[]
export type JsonObject = { [Key in string]: JsonValue } & {
  [Key in string]?: JsonValue | undefined
}
export type JsonPrimitive = boolean | number | string | null
export type JsonValue = JsonArray | JsonObject | JsonPrimitive
