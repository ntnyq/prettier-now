import './style.css'
import { createApp } from 'vue'
import pinia from '@/stores'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')
