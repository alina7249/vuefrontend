// 星空背景生成器 - LensFlow亮调器材蓝灰风


 /**
 * 生成星空背景SVG并直接创建SVG元素
 * @param {number} width - SVG宽度
 * @param {number} height - SVG高度
 * @param {number} starDensity - 星点密度百分比
 * @returns {SVGElement} SVG元素
 */
export function generateStarBackground(width, height, starDensity = 100) {
  console.log('generateStarBackground called with:', {width, height, starDensity});
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  console.log('SVG element created');
  
  // 使用固定数量的星点以确保可见性
  const totalStars = 200; // 固定生成200个星点
  
  // 大星点（浅金）占30%，小星点（纯白）占70%
  const bigStarCount = Math.floor(totalStars * 0.3);
  const smallStarCount = totalStars - bigStarCount;
  
  // 生成大星点（浅金，直径2px）
  for (let i = 0; i < bigStarCount; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    const opacity = 0.5 + Math.random() * 0.5; // 随机透明度0.5-1.0
    
    const star = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    star.setAttribute('cx', cx);
    star.setAttribute('cy', cy);
    star.setAttribute('r', '2');
    star.setAttribute('fill', '#D4AF37'); // 浅金
    star.setAttribute('opacity', opacity);
    
    svg.appendChild(star);
  }
  
  // 生成小星点（纯白，直径1px）
  for (let i = 0; i < smallStarCount; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    const opacity = 0.3 + Math.random() * 0.7; // 随机透明度0.3-1.0
    
    const star = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    star.setAttribute('cx', cx);
    star.setAttribute('cy', cy);
    star.setAttribute('r', '1');
    star.setAttribute('fill', '#FFFFFF'); // 纯白
    star.setAttribute('opacity', opacity);
    
    svg.appendChild(star);
  }
  
  console.log('星点生成完成，总数:', totalStars);
  return svg; // 直接返回SVG元素而不是字符串
}

/**
 * 初始化星空背景
 */
export function initStarBackground() {
  // 创建星空背景容器
    const starBgContainer = document.createElement('div');
    starBgContainer.className = 'star-bg';
    
    // 创建星空覆盖层
    const starBgOverlay = document.createElement('div');
    starBgOverlay.className = 'star-bg-overlay';
  
  // 添加到body
  document.body.appendChild(starBgContainer);
  document.body.appendChild(starBgOverlay);
  
  // 根据屏幕尺寸生成星空
  function createStars() {
    // 清空现有星空
    starBgContainer.innerHTML = '';
    
    // 获取屏幕尺寸
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // 根据设备类型调整星点密度
    let starDensity = 100; // 默认密度
    
    if (window.innerWidth <= 767) {
      // 移动端：星点密度降低40%
      starDensity = 60;
    } else if (window.innerWidth <= 1199) {
      // 平板端：星点密度降低20%
      starDensity = 80;
    }
    
    // 直接生成并添加星空SVG元素
    const svgElement = generateStarBackground(width, height, starDensity);
    starBgContainer.appendChild(svgElement);
    console.log('星空SVG已添加到容器');
    
    // 添加滚动交互
    addScrollInteraction(starBgContainer);
  }
  
  // 滚动交互
  function addScrollInteraction(starBg) {
    let lastScrollY = window.scrollY;
    let isAnimating = false;
    
    window.addEventListener('scroll', () => {
      if (isAnimating) return;
      
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY;
      
      // 计算星点偏移量（最大5px）
      const offset = Math.min(Math.abs(scrollDiff) / 50, 5);
      const direction = scrollDiff > 0 ? 1 : -1;
      
      // 应用偏移
      starBg.style.transform = `translateY(${direction * offset}px)`;
      
      lastScrollY = currentScrollY;
      
      // 滚动停止后归位
      isAnimating = true;
      setTimeout(() => {
        starBg.style.transform = 'translateY(0)';
        isAnimating = false;
      }, 500);
    });
  }
  
  // 初始创建星空
  createStars();
  
  // 窗口大小改变时重新生成星空
  window.addEventListener('resize', () => {
    // 使用防抖函数避免频繁重绘
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(createStars, 200);
  });
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