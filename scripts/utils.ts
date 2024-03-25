import path from 'node:path'
import { URL, fileURLToPath } from 'node:url'

export const __dirname = fileURLToPath(new URL('.', import.meta.url))

export const resolve = (...args: string[]) => path.resolve(__dirname, '..', ...args)
