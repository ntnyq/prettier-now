import '@unocss/reset/tailwind.css'
import 'uno.css'
import 'floating-vue/dist/style.css'
import './style.css'
import FloatingVue from 'floating-vue'
import { createApp } from 'vue'
import pinia from '@/stores'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(FloatingVue)

app.mount('#app')
