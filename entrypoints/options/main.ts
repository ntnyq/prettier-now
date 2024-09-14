import '@unocss/reset/tailwind.css'
import 'uno.css'
import 'floating-vue/dist/style.css'
import './style.css'
import FloatingVue from 'floating-vue'
import { createApp } from 'vue'
import i18n from '@/i18n'
import pinia from '@/stores'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(i18n)
app.use(FloatingVue)

app.mount('#app')
