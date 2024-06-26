import '@unocss/reset/tailwind.css'
import 'uno.css'
import '@/styles/base.css'
import i18n from '@/i18n'
import App from './App.vue'

const app = createApp(App)

app.use(i18n)

app.mount('#app')
