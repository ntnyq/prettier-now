/**
 * Maximum UTF-8 size of one original snippet.
 */
export const CODE_BLOCK_MAX_BYTES = 256 * 1024
/**
 * Maximum selected blocks in one request.
 */
export const CODE_BLOCK_MAX_ITEMS = 8
/**
 * Maximum registered blocks in a document.
 */
export const CODE_BLOCK_MAX_CANDIDATES = 200
/**
 * Maximum simultaneous overlay controls.
 */
export const CODE_BLOCK_MAX_BUTTONS = 30
/**
 * Maximum serialized session inbox size.
 */
export const CODE_BLOCK_QUEUE_BYTES = 2 * 1024 * 1024
/**
 * Maximum unconsumed requests in the inbox.
 */
export const CODE_BLOCK_QUEUE_REQUESTS = 20
/**
 * Unconsumed request lifetime in milliseconds.
 */
export const CODE_BLOCK_TTL = 10 * 60 * 1000
/**
 * Lifetime of consumed identifiers without source text.
 */
export const CODE_BLOCK_RECEIPT_TTL = 30 * 60 * 1000
