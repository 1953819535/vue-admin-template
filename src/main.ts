import { createApp } from 'vue'
import router from './router'
import pinia from './stores'
import App from './App.vue'
import { useAppStore } from './stores/modules/app'
import 'vue-sonner/style.css'
import './style.css'

const app = createApp(App)
app.use(pinia)
app.use(router)

// 初始化主题
const appStore = useAppStore()
appStore.applyTheme()

app.mount('#app')