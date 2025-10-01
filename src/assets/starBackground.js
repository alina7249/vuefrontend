// 星空背景生成器 - LensFlow亮调器材蓝灰风


 /**
 * 生成星空背景SVG并直接创建SVG元素
 * @param {number} width - SVG宽度
 * @param {number} height - SVG高度
 * @param {number} starDensity - 星点密度百分比
 * @returns {SVGElement} SVG元素
 */
export function generateStarBackground(width, height, starDensity = 100) {
  console.log('[星空背景] generateStarBackground called with:', {width, height, starDensity});
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  
  // 确保SVG有背景色，这样更容易看到
  svg.setAttribute('style', 'background-color: rgba(42, 92, 140, 0.1);');
  console.log('[星空背景] SVG元素创建完成');
  
  // 使用足够多的星点以确保可见性
  const totalStars = 300; // 增加星点数量到300个
  
  // 星点大小和颜色调整，使其更明显
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#D4AF37'];
  
  // 生成所有星点，使用更大的尺寸和更鲜艳的颜色
  for (let i = 0; i < totalStars; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    
    // 增大星点尺寸，使它们更容易被看到
    const r = 2 + Math.random() * 3; // 随机大小2-5px
    
    // 随机选择一个鲜艳的颜色
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // 保持较高的透明度
    const opacity = 0.7 + Math.random() * 0.3; // 0.7-1.0
    
    const star = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    star.setAttribute('cx', cx);
    star.setAttribute('cy', cy);
    star.setAttribute('r', r);
    star.setAttribute('fill', color);
    star.setAttribute('opacity', opacity);
    
    // 添加闪烁动画
    star.setAttribute('style', `fill: ${color}; opacity: ${opacity}; animation: starPulse 2s infinite ease-in-out;`);
    
    svg.appendChild(star);
  }
  
  console.log('[星空背景] 星点生成完成，总数:', totalStars);
  return svg; // 直接返回SVG元素而不是字符串
}

/**
 * 初始化星空背景
 */
export function initStarBackground() {
  console.log('[星空背景] 开始初始化星空背景');
  
  try {
    // 检查并移除已存在的星空容器，避免重复创建
    const existingStarBg = document.querySelector('.star-bg');
    const existingOverlay = document.querySelector('.star-bg-overlay');
    
    if (existingStarBg) {
      console.log('[星空背景] 移除已存在的星空容器');
      document.body.removeChild(existingStarBg);
    }
    if (existingOverlay) {
      console.log('[星空背景] 移除已存在的星空覆盖层');
      document.body.removeChild(existingOverlay);
    }
    
    // 创建星空背景容器
    const starBgContainer = document.createElement('div');
    starBgContainer.className = 'star-bg';
    
    // 强制设置容器样式，防止被覆盖
    starBgContainer.style.position = 'fixed';
    starBgContainer.style.top = '0';
    starBgContainer.style.left = '0';
    starBgContainer.style.width = '100%';
    starBgContainer.style.height = '100%';
    starBgContainer.style.pointerEvents = 'none';
    starBgContainer.style.zIndex = '-1';
    starBgContainer.style.opacity = '1';
    
    // 创建星空覆盖层
    const starBgOverlay = document.createElement('div');
    starBgOverlay.className = 'star-bg-overlay';
    
    // 强制设置覆盖层样式
    starBgOverlay.style.position = 'fixed';
    starBgOverlay.style.top = '0';
    starBgOverlay.style.left = '0';
    starBgOverlay.style.width = '100%';
    starBgOverlay.style.height = '100%';
    starBgOverlay.style.backgroundColor = 'rgba(240, 242, 245, 0.1)';
    starBgOverlay.style.pointerEvents = 'none';
    starBgOverlay.style.zIndex = '0';
    
    // 添加到body
    document.body.appendChild(starBgContainer);
    document.body.appendChild(starBgOverlay);
    console.log('[星空背景] 星空容器和覆盖层已添加到body');
    
    // 确保body背景是透明的
    document.body.style.background = 'transparent !important';
    document.documentElement.style.background = 'transparent !important';
    
    // 根据屏幕尺寸生成星空
    function createStars() {
      console.log('[星空背景] 开始创建星空');
      // 清空现有星空
      starBgContainer.innerHTML = '';
      
      // 获取屏幕尺寸
      const width = window.innerWidth;
      const height = window.innerHeight;
      console.log('[星空背景] 屏幕尺寸:', width, 'x', height);
      
      // 直接生成并添加星空SVG元素（使用100%密度，确保足够多的星点）
      const svgElement = generateStarBackground(width, height, 100);
      
      // 强制设置SVG样式，防止被覆盖
      svgElement.style.width = '100%';
      svgElement.style.height = '100%';
      svgElement.style.opacity = '1';
      svgElement.style.transform = 'none'; // 禁用可能的缩放效果
      
      starBgContainer.appendChild(svgElement);
      console.log('[星空背景] 星空SVG已添加到容器');
      
      // 检查SVG是否成功添加
      setTimeout(() => {
        const addedSvg = starBgContainer.querySelector('svg');
        if (addedSvg) {
          console.log('[星空背景] SVG添加成功，子元素数量:', addedSvg.children.length);
        } else {
          console.log('[星空背景] SVG添加失败');
        }
      }, 100);
    }
    
    // 初始创建星空
    createStars();
    
    // 窗口大小改变时重新生成星空
    window.addEventListener('resize', () => {
      console.log('[星空背景] 窗口大小改变，准备重新生成星空');
      // 使用防抖函数避免频繁重绘
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(() => {
        console.log('[星空背景] 执行窗口大小改变后的星空重绘');
        createStars();
      }, 200);
    });
    
    console.log('[星空背景] 初始化完成');
  } catch (error) {
    console.error('[星空背景] 初始化过程中出现错误:', error);
  }
}

/**
 * 添加星空hover交互效果到指定元素
 * @param {HTMLElement} element - 要添加交互效果的元素
 */
export function addStarHoverEffect(element) {
  // 查找元素周围的星点
  function findNearbyStars(x, y, radius = 50) {
    const stars = document.querySelectorAll('.star-big, .star-small');
    const nearbyStars = [];
    
    stars.forEach(star => {
      const starRect = star.getBoundingClientRect();
      const starX = starRect.left + starRect.width / 2;
      const starY = starRect.top + starRect.height / 2;
      
      const distance = Math.sqrt(Math.pow(x - starX, 2) + Math.pow(y - starY, 2));
      if (distance <= radius) {
        nearbyStars.push({ star, distance });
      }
    });
    
    return nearbyStars;
  }
  
  // 高亮星点
  function highlightStars(stars) {
    stars.forEach(({ star, distance }) => {
      const originalOpacity = star.getAttribute('data-original-opacity') || star.style.opacity || 1;
      star.setAttribute('data-original-opacity', originalOpacity);
      
      // 根据距离计算高亮强度
      const highlightFactor = 1 + (1 - distance / 50) * 2;
      star.style.opacity = Math.min(parseFloat(originalOpacity) * highlightFactor, 1);
    });
  }
  
  // 恢复星点原始状态
  function resetStars(stars) {
    stars.forEach(({ star }) => {
      const originalOpacity = star.getAttribute('data-original-opacity') || 1;
      star.style.opacity = originalOpacity;
    });
  }
  
  // 为元素添加鼠标移动事件
  element.addEventListener('mousemove', (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    const nearbyStars = findNearbyStars(x, y);
    highlightStars(nearbyStars);
    
    // 鼠标离开后恢复
    setTimeout(() => {
      resetStars(nearbyStars);
    }, 300);
  });
}

/**
 * 初始化所有星空交互效果
 */
export function initAllStarInteractions() {
  // 为所有按钮添加交互
  document.querySelectorAll('button, .tag').forEach(button => {
    addStarHoverEffect(button);
  });
  
  // 为所有作品卡片添加交互
  document.querySelectorAll('.photo-item, .article-item').forEach(card => {
    card.addEventListener('mouseenter', () => {
      // 添加浅金轮廓效果
      const outline = document.createElement('div');
      outline.className = 'star-outline';
      outline.style.cssText = `
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border: 1px solid rgba(212, 175, 55, 0.3);
        border-radius: inherit;
        pointer-events: none;
        z-index: -1;
        animation: starOutline 0.3s ease-out;
      `;
      
      card.style.position = 'relative';
      card.appendChild(outline);
      
      // 鼠标离开时移除轮廓
      card.addEventListener('mouseleave', function removeOutline() {
        if (outline && outline.parentNode === card) {
          outline.style.opacity = '0';
          setTimeout(() => {
            if (outline && outline.parentNode === card) {
              card.removeChild(outline);
            }
          }, 300);
        }
        card.removeEventListener('mouseleave', removeOutline);
      });
    });
  });
}

// 定义轮廓动画
const style = document.createElement('style');
style.textContent = `
  @keyframes starOutline {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
document.head.appendChild(style);