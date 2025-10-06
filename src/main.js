import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 创建应用实例
const app = createApp(App)

// 创建并使用pinia状态管理
const pinia = createPinia()
app.use(pinia)

// 使用路由
app.use(router)

// 挂载应用
app.mount('#app')
