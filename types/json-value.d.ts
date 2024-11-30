/**
 * @file types/json-value.d.ts
 * @copyright type-fest
 * @see {@link https://github.com/sindresorhus/type-fest}
 */

export type JsonArray = JsonValue[] | readonly JsonValue[]
export type JsonObject = { [Key in string]: JsonValue } & {
  [Key in string]?: JsonValue | undefined
}
export type JsonPrimitive = boolean | null | number | string
export type JsonValue = JsonArray | JsonObject | JsonPrimitive
