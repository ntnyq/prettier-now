import './style.css'
import { createApp } from 'vue'
import pinia from '@/stores'
import App from './App.vue'

const app = createApp(App)

app.use(pinia)

app.mount('#app')
