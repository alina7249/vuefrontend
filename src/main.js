import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initStarBackground, initAllStarInteractions } from './assets/starBackground.js'

const app = createApp(App)

app.use(router)

app.mount('#app')

// 星空背景初始化 - 亮调器材蓝灰风格
// 确保符合WCAG可读性标准（对比度≥4.5:1）
document.addEventListener('DOMContentLoaded', () => {
  console.log('[主应用] DOMContentLoaded事件触发，开始初始化星空背景');
  try {
    // 确保body和html背景透明
    document.body.style.background = 'transparent !important';
    document.body.style.backgroundColor = 'transparent !important';
    document.documentElement.style.background = 'transparent !important';
    document.documentElement.style.backgroundColor = 'transparent !important';
    console.log('[主应用] 已设置body和html背景透明');
    
    console.log('[主应用] 调用initStarBackground()函数前');
    initStarBackground();
    console.log('[主应用] initStarBackground()函数调用完成');
    
    // 检查当前路由是否为登录页面
    const currentPath = window.location.pathname;
    if (currentPath === '/login') {
      console.log('[主应用] 当前在登录页面，增强星空背景可见性');
      
      // 登录页面专用星空背景增强
      setTimeout(() => {
        enhanceLoginPageStarBackground();
      }, 500);
    }
    
    // 检查星空容器和模块覆盖层
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
        // 如果没有星空容器，尝试创建一个
        createStarBgContainer();
      }
      
      if (svg) {
        console.log('[主应用] SVG元素存在，星点数量:', svg.children.length);
        console.log('[主应用] SVG样式: 透明度=', window.getComputedStyle(svg).opacity);
        console.log('[主应用] SVG样式: 宽度=', window.getComputedStyle(svg).width);
        console.log('[主应用] SVG样式: 高度=', window.getComputedStyle(svg).height);
        
        // 统计不同类型的星点
        const bigStars = svg.querySelectorAll('.star-big');
        const smallStars = svg.querySelectorAll('.star-small');
        console.log('[主应用] 大星点数量(浅金):', bigStars.length);
        console.log('[主应用] 小星点数量(纯白):', smallStars.length);
        
        // 检查body背景
        console.log('[主应用] body背景:', window.getComputedStyle(document.body).backgroundColor);
        console.log('[主应用] body样式: 透明度=', window.getComputedStyle(document.body).opacity);
        console.log('[主应用] body样式: 最小高度=', window.getComputedStyle(document.body).minHeight);
      } else {
        console.log('[主应用] 错误: 未找到SVG元素');
        // 如果没有SVG元素，尝试创建一个
        if (document.querySelector('.star-bg')) {
          const width = window.innerWidth;
          const height = window.innerHeight;
          const svgElement = generateStarBackground(width, height, 120); // 增加密度120%
          document.querySelector('.star-bg').appendChild(svgElement);
        }
      }
      
      // 检查不同模块的星空覆盖层是否正确应用
      const moduleOverlays = document.querySelectorAll('.star-bg-module-overlay');
      console.log('[主应用] 模块覆盖层数量:', moduleOverlays.length);
      
      // 检查特定模块
      const moduleTypes = ['header', 'hero', 'gallery', 'sidebar', 'form', 'footer', 'login-container'];
      moduleTypes.forEach(moduleType => {
        const module = document.querySelector(`.${moduleType}`);
        const overlay = document.querySelector(`.star-bg-${moduleType}-overlay`);
        
        if (module && overlay) {
          console.log(`[主应用] 模块 ${moduleType} 覆盖层存在，透明度:`, window.getComputedStyle(overlay).opacity);
          console.log(`[主应用] 模块 ${moduleType} 覆盖层动画:`, window.getComputedStyle(overlay).animation);
        } else {
          console.log(`[主应用] 模块 ${moduleType} 或其覆盖层不存在`);
        }
      });
      
      // 检查是否添加了动画样式
      const styleElement = document.getElementById('star-animations');
      console.log('[主应用] 动画样式是否已添加:', styleElement ? '是' : '否');
    }, 1000);
    
    // 初始化星空交互效果
    console.log('[主应用] 调用initAllStarInteractions()');
    try {
      initAllStarInteractions();
      console.log('[主应用] initAllStarInteractions()调用完成');
      
      // 检查是否有可交互元素
      const interactiveElements = document.querySelectorAll('button, .tag, .nav-link, .photo-item, .article-item, .equipment-card');
      console.log('[主应用] 可交互元素数量:', interactiveElements.length);
    } catch (error) {
      console.error('[主应用] 调用initAllStarInteractions()时出错:', error);
    }
    
    // 增强登录页面星空背景可见性
      function enhanceLoginPageStarBackground() {
        // 确保星空容器z-index正确
        const starBg = document.querySelector('.star-bg');
        if (starBg) {
          starBg.style.zIndex = '0'; // 确保在登录容器下方
        }
        
        // 获取并增强星空SVG
        const svg = starBg ? starBg.querySelector('svg') : null;
        if (svg) {
          // 增强登录页面的星点可见性
          const bigStars = svg.querySelectorAll('.star-big');
          bigStars.forEach(star => {
            star.setAttribute('opacity', '0.6'); // 增加大星点透明度
          });
          
          const smallStars = svg.querySelectorAll('.star-small');
          smallStars.forEach(star => {
            star.setAttribute('opacity', '0.4'); // 增加小星点透明度
          });
          
          console.log('[主应用] 已增强登录页面星空可见性');
        }
        
        // 为登录容器添加特殊的星空覆盖层
        const loginContainer = document.querySelector('.login-container');
        if (loginContainer && !document.querySelector('.star-bg-login-container-overlay')) {
          const overlay = document.createElement('div');
          overlay.className = 'star-bg-module-overlay star-bg-login-container-overlay';
          overlay.style.position = 'absolute';
          overlay.style.top = '0';
          overlay.style.left = '0';
          overlay.style.width = '100%';
          overlay.style.height = '100%';
          overlay.style.pointerEvents = 'none';
          overlay.style.zIndex = '0';
          overlay.style.opacity = '0.2';
          
          loginContainer.appendChild(overlay);
        }
      }
      
      // 创建星空背景容器
      function createStarBgContainer() {
        const starBgContainer = document.createElement('div');
        starBgContainer.className = 'star-bg';
        
        // 强制设置容器样式
        starBgContainer.style.position = 'fixed';
        starBgContainer.style.top = '0';
        starBgContainer.style.left = '0';
        starBgContainer.style.width = '100%';
        starBgContainer.style.height = '100%';
        starBgContainer.style.pointerEvents = 'none';
        starBgContainer.style.zIndex = '0';
        starBgContainer.style.opacity = '1';
        
        document.body.appendChild(starBgContainer);
        console.log('[主应用] 已创建星空容器');
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
