import '@unocss/reset/tailwind.css'
import 'uno.css'
import 'floating-vue/dist/style.css'
import './style.css'
import { createApp } from 'vue'
import FloatingVue from 'floating-vue'
import pinia from '@/stores'
import router from './router'
import App from './App.vue'

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(FloatingVue)
app.mount('#app')
