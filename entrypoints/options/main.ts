import './style.css'
import { createApp } from 'vue'
import pinia from '@/stores'
import { Logger } from '@/utils/logger'
import { readStoredTomlOptions } from '@/utils/tomlStorage'
import App from './App.vue'
import router from './router'

async function mountApp() {
  try {
    await readStoredTomlOptions()
  } catch (error) {
    Logger.error(
      error instanceof Error ? error.message : 'Failed to migrate TOML options',
    )
  }

  const app = createApp(App)

  app.use(router)
  app.use(pinia)

  app.mount('#app')
}

mountApp()
