import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initStarBackground, initAllStarInteractions } from './assets/starBackground.js'

const app = createApp(App)

app.use(router)

app.mount('#app')

// 星空背景初始化
// 初始化星空背景
document.addEventListener('DOMContentLoaded', () => {
  console.log('[主应用] DOMContentLoaded事件触发，开始初始化星空背景');
  try {
    console.log('[主应用] 调用initStarBackground()函数前');
    initStarBackground();
    console.log('[主应用] initStarBackground()函数调用完成');
    
    // 检查星空容器是否存在
    setTimeout(() => {
      const starBg = document.querySelector('.star-bg');
      const svg = starBg ? starBg.querySelector('svg') : null;
      
      if (starBg) {
        console.log('[主应用] 星空容器存在:', starBg);
        console.log('[主应用] 星空容器样式: 位置=', window.getComputedStyle(starBg).position);
        console.log('[主应用] 星空容器样式: z-index=', window.getComputedStyle(starBg).zIndex);
        console.log('[主应用] 星空容器样式: 透明度=', window.getComputedStyle(starBg).opacity);
        console.log('[主应用] 星空容器样式: 宽度=', window.getComputedStyle(starBg).width);
        console.log('[主应用] 星空容器样式: 高度=', window.getComputedStyle(starBg).height);
      } else {
        console.log('[主应用] 错误: 未找到星空容器');
      }
      
      if (svg) {
        console.log('[主应用] SVG元素存在，星点数量:', svg.children.length);
        console.log('[主应用] SVG样式: 透明度=', window.getComputedStyle(svg).opacity);
        console.log('[主应用] SVG样式: 宽度=', window.getComputedStyle(svg).width);
        console.log('[主应用] SVG样式: 高度=', window.getComputedStyle(svg).height);
        
        // 检查body背景
        console.log('[主应用] body背景:', window.getComputedStyle(document.body).backgroundColor);
        console.log('[主应用] body样式: 透明度=', window.getComputedStyle(document.body).opacity);
        console.log('[主应用] body样式: 最小高度=', window.getComputedStyle(document.body).minHeight);
      } else {
        console.log('[主应用] 错误: 未找到SVG元素');
      }
    }, 1000);
    
    // 初始化星空交互效果
    console.log('[主应用] 调用initAllStarInteractions()');
    try {
      initAllStarInteractions();
      console.log('[主应用] initAllStarInteractions()调用完成');
    } catch (error) {
      console.error('[主应用] 调用initAllStarInteractions()时出错:', error);
    }
    
    // 为路由切换添加星空交互效果
    router.afterEach(() => {
      console.log('[主应用] 路由切换完成');
      // 延迟执行，确保新页面内容已渲染
      setTimeout(() => {
        console.log('[主应用] 路由切换，调用initAllStarInteractions()');
        try {
          initAllStarInteractions();
          console.log('[主应用] initAllStarInteractions()调用完成');
        } catch (error) {
          console.error('[主应用] 调用initAllStarInteractions()时出错:', error);
        }
      }, 100);
    });
  } catch (error) {
    console.error('[主应用] 初始化星空背景时出错:', error);
  }
});
