import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initStarBackground, initAllStarInteractions } from './assets/starBackground.js'

const app = createApp(App)

app.use(router)

app.mount('#app')

// 等待DOM加载完成后初始化星空背景
document.addEventListener('DOMContentLoaded', () => {
  // 初始化星空背景
  initStarBackground();
  
  // 初始化星空交互效果
  initAllStarInteractions();
  
  // 为路由切换添加星空交互效果
  router.afterEach(() => {
    // 延迟执行，确保新页面内容已渲染
    setTimeout(() => {
      initAllStarInteractions();
    }, 100);
  });
});
