import '@unocss/reset/tailwind.css'
import 'uno.css'
import 'floating-vue/dist/style.css'
import '@/assets/styles/app.css'
import { createApp } from 'vue'
import FloatingVue from 'floating-vue'
import pinia from '@/stores'
import App from './App.vue'

const app = createApp(App)

app.use(pinia)
app.use(FloatingVue)
app.mount('#app')
