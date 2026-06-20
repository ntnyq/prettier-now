import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': import.meta.dirname,
      '#i18n': resolve(import.meta.dirname, 'tests/mocks/i18n.ts'),
      '#imports': resolve(import.meta.dirname, 'tests/mocks/imports.ts'),
    },
  },
  test: {
    environment: 'happy-dom',
    watch: false,
  },
})
