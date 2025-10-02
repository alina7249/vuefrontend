/**
 * 星空背景生成器 - 星空宇宙风格
 * 根据用户提供的星空图片优化效果
 */

// 网站模块配置 - 增强登录页面可见性
const MODULE_CONFIG = {
  header: { opacity: 0.08, animation: 'none', description: '导航栏 - 避免干扰导航点击' },
  hero: { opacity: 0.12, animation: 'slow', description: '首页主视觉区 - 强化摄影主题' },
  gallery: { opacity: 0.05, animation: 'none', description: '作品展示区 - 完全不干扰作品查看' },
  sidebar: { opacity: 0.06, animation: 'hover', description: '器材分类侧边栏 - 增加交互感' },
  form: { opacity: 0.05, animation: 'none', description: '个人资料表单区 - 确保表单输入清晰' },
  footer: { opacity: 0.10, animation: 'flow', description: '页脚 - 提升高级感' },
  'login-container': { 
    opacity: 0.25, 
    animation: 'slow', 
    description: '登录页面 - 增强可见性',
    specialBg: true,  // 启用特殊背景效果
    starSize: 1.2     // 星点尺寸倍数
  },
  default: { opacity: 0.05, animation: 'none', description: '默认区域 - 保持低调' }
};

/**
 * 生成银河效果
 * @param {SVGSVGElement} svg - SVG元素
 * @param {number} width - SVG宽度
 * @param {number} height - SVG高度
 */
function addGalaxyEffect(svg, width, height) {
  // 创建3-5条银河带
  const bandCount = 3 + Math.floor(Math.random() * 3);
  
  for (let i = 0; i < bandCount; i++) {
    // 随机生成银河带的位置和形状
    const startX = Math.random() * width * 0.3;
    const startY = Math.random() * height * 0.4 + height * 0.3;
    const endX = width - Math.random() * width * 0.3;
    const endY = Math.random() * height * 0.4 + height * 0.3;
    
    // 贝塞尔曲线控制点
    const cp1X = Math.random() * width * 0.4 + width * 0.3;
    const cp1Y = Math.random() * height * 0.2 + height * 0.2;
    const cp2X = Math.random() * width * 0.4 + width * 0.3;
    const cp2Y = Math.random() * height * 0.2 + height * 0.6;
    
    // 随机宽度
    const bandWidth = 30 + Math.random() * 100;
    
    const galaxyBand = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    galaxyBand.setAttribute('d', `M${startX},${startY} C${cp1X},${cp1Y} ${cp2X},${cp2Y} ${endX},${endY}`);
    galaxyBand.setAttribute('fill', 'none');
    galaxyBand.setAttribute('stroke', 'rgba(200, 210, 255, 0.03)');
    galaxyBand.setAttribute('stroke-width', bandWidth.toString());
    galaxyBand.setAttribute('stroke-linecap', 'round');
    galaxyBand.setAttribute('class', 'galaxy-band');
    
    svg.appendChild(galaxyBand);
  }
}

/**
 * 生成星云效果
 * @param {SVGSVGElement} svg - SVG元素
 * @param {number} width - SVG宽度
 * @param {number} height - SVG高度
 */
function addNebulaEffect(svg, width, height) {
  // 创建多个模糊的椭圆作为星云
  const nebulaCount = 4 + Math.floor(Math.random() * 3);
  
  for (let i = 0; i < nebulaCount; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    const rx = 50 + Math.random() * 200;
    const ry = 30 + Math.random() * 100;
    const rotation = Math.random() * 360;
    
    const nebula = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    nebula.setAttribute('cx', cx.toString());
    nebula.setAttribute('cy', cy.toString());
    nebula.setAttribute('rx', rx.toString());
    nebula.setAttribute('ry', ry.toString());
    nebula.setAttribute('fill', 'rgba(100, 120, 180, 0.05)');
    nebula.setAttribute('transform', `rotate(${rotation} ${cx} ${cy})`);
    nebula.setAttribute('class', 'nebula');
    
    svg.appendChild(nebula);
  }
}

// 计算星点数量的工具函数 - 增加基数以确保足够的星点
function calculateStarCount(width, height, densityPercentage) {
  // 每100px²的星点数量 = densityPercentage
  const area = width * height / 100; // 转换为100px²的数量
  const baseCount = Math.floor(area * densityPercentage / 100);
  // 确保至少有一定数量的星点
  return Math.max(baseCount, 100); // 最小100个星点
}

/**
 * 生成星空背景SVG并直接创建SVG元素
 * @param {number} width - SVG宽度
 * @param {number} height - SVG高度
 * @param {number} starDensity - 星点密度百分比 (100 = 原始密度)
 * @returns {SVGElement} SVG元素
 */
export function generateStarBackground(width, height, starDensity = 100) {
  console.log('[星空背景] 生成星空背景，尺寸:', { width, height, starDensity });
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  
  // 添加滤镜定义
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  
  // 星点光晕滤镜
  const starGlowFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
  starGlowFilter.setAttribute('id', 'starGlow');
  starGlowFilter.setAttribute('x', '-50%');
  starGlowFilter.setAttribute('y', '-50%');
  starGlowFilter.setAttribute('width', '200%');
  starGlowFilter.setAttribute('height', '200%');
  
  const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
  blur.setAttribute('stdDeviation', '1.5');
  blur.setAttribute('result', 'blur');
  
  const merge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
  const mergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
  mergeNode1.setAttribute('in', 'blur');
  const mergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
  mergeNode2.setAttribute('in', 'SourceGraphic');
  
  merge.appendChild(mergeNode1);
  merge.appendChild(mergeNode2);
  starGlowFilter.appendChild(blur);
  starGlowFilter.appendChild(merge);
  defs.appendChild(starGlowFilter);
  svg.appendChild(defs);
  
  // 设置星空底色 - 深蓝色，与背景层颜色协调
  svg.setAttribute('style', 'background-color: transparent;');
  
  // 简化星点生成逻辑，确保在登录页面能看到明显的星点
  const isLoginPage = window.location.pathname === '/login';
  
  // 登录页面使用固定数量的星点，确保视觉效果
  const bigStarCount = isLoginPage ? 50 : Math.floor(calculateStarCount(width, height, 3) * (starDensity / 100));
  const smallStarCount = isLoginPage ? 100 : Math.floor(calculateStarCount(width, height, 5) * (starDensity / 100));
  const mediumStarCount = isLoginPage ? 70 : Math.floor(calculateStarCount(width, height, 2) * (starDensity / 100));
  
  console.log('[星空背景] 星点数量 - 大星点:', bigStarCount, '中星点:', mediumStarCount, '小星点:', smallStarCount);
  console.log('[星空背景] 当前页面是否为登录页:', isLoginPage);
  
  // 登录页面特殊处理 - 显著增加星点大小和可见性
  const sizeAdjustment = isLoginPage ? 1.5 : 1;
  const opacityAdjustment = isLoginPage ? 2 : 1;
  
  // 生成大星点（白色、浅蓝色、浅粉色）- 分布在页面边缘及模块间隙
  for (let i = 0; i < bigStarCount; i++) {
    // 优先在页面边缘生成大星点
    let cx, cy;
    const edgeProbability = 0.6; // 60%的概率在边缘
    
    if (Math.random() < edgeProbability) {
      // 边缘位置
      const edgeSide = Math.floor(Math.random() * 4); // 0: 上, 1: 右, 2: 下, 3: 左
      const margin = width * 0.15; // 边缘区域宽度
      
      switch (edgeSide) {
        case 0: // 上边缘
          cx = Math.random() * width;
          cy = Math.random() * margin;
          break;
        case 1: // 右边缘
          cx = width - Math.random() * margin;
          cy = Math.random() * height;
          break;
        case 2: // 下边缘
          cx = Math.random() * width;
          cy = height - Math.random() * margin;
          break;
        case 3: // 左边缘
          cx = Math.random() * margin;
          cy = Math.random() * height;
          break;
      }
    } else {
      // 随机位置
      cx = Math.random() * width;
      cy = Math.random() * height;
    }
    
    // 随机星点颜色（白色、浅蓝色、浅粉色）
    const colors = ['#ffffff', '#f0f8ff', '#fff0f5'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // 大星点尺寸和透明度 - 登录页面更大更明显
    const radius = isLoginPage ? 3 : 2.5;
    const opacity = isLoginPage ? 0.5 : 0.3;
    
    const star = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    star.setAttribute('cx', cx.toString());
    star.setAttribute('cy', cy.toString());
    star.setAttribute('r', (radius * sizeAdjustment).toString());
    star.setAttribute('fill', color);
    star.setAttribute('opacity', (opacity * opacityAdjustment).toString());
    star.setAttribute('class', 'star-big');
    star.setAttribute('filter', 'url(#starGlow)');
    star.setAttribute('style', `animation: starPulse ${3 + Math.random() * 5}s infinite ease-in-out;`);
    
    svg.appendChild(star);
  }
  
  // 生成中星点（浅灰蓝）- 均匀分布
  for (let i = 0; i < mediumStarCount; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    
    // 随机颜色
    const colors = ['#ffffff', '#e6e6fa'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // 中星点尺寸和透明度
    const radius = isLoginPage ? 2 : 1.5;
    const opacity = isLoginPage ? 0.4 : 0.25;
    
    const star = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    star.setAttribute('cx', cx.toString());
    star.setAttribute('cy', cy.toString());
    star.setAttribute('r', (radius * sizeAdjustment).toString());
    star.setAttribute('fill', color);
    star.setAttribute('opacity', (opacity * opacityAdjustment).toString());
    star.setAttribute('class', 'star-medium');
    star.setAttribute('filter', 'url(#starGlow)');
    
    svg.appendChild(star);
  }
  
  // 生成小星点（纯白）- 均匀分布
  for (let i = 0; i < smallStarCount; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    
    // 小星点尺寸和透明度
    const radius = isLoginPage ? 1.5 : 1;
    const opacity = isLoginPage ? 0.3 : 0.2;
    
    const star = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    star.setAttribute('cx', cx.toString());
    star.setAttribute('cy', cy.toString());
    star.setAttribute('r', (radius * sizeAdjustment).toString());
    star.setAttribute('fill', '#FFFFFF'); // 纯白
    star.setAttribute('opacity', (opacity * opacityAdjustment).toString());
    star.setAttribute('class', 'star-small');
    
    svg.appendChild(star);
  }
  
  console.log('[星空背景] 星点生成完成');
  return svg;
}

/**
 * 获取设备类型
 * @returns {string} 设备类型 (desktop/tablet/mobile)
 */
function getDeviceType() {
  if (window.innerWidth >= 1200) {
    return 'desktop';
  } else if (window.innerWidth >= 768) {
    return 'tablet';
  } else {
    return 'mobile';
  }
}

/**
 * 根据设备类型调整星点密度
 * @returns {number} 调整后的密度百分比
 */
function getAdjustedDensity() {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'desktop':
      return 100; // PC端：星点密度正常
    case 'tablet':
      return 80; // 平板端：星点密度降低20%
    case 'mobile':
      return 60; // 移动端：星点密度降低40%
    default:
      return 100;
  }
}

/**
 * 根据模块ID获取模块配置
 * @param {string} moduleId - 模块ID
 * @returns {Object} 模块配置
 */
function getModuleConfig(moduleId) {
  return MODULE_CONFIG[moduleId] || MODULE_CONFIG.default;
}

/**
 * 初始化星空背景 - 增强版本，确保在所有页面都能正确显示
 */
export function initStarBackground() {
  console.log('[星空背景] 开始初始化星空背景');
  
  try {
    // 检查当前页面
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath === '/login';
    console.log('[星空背景] 当前页面:', currentPath, '登录页面:', isLoginPage);
    
    // 检查并移除已存在的星空容器和图片背景，避免重复创建
    const existingStarBg = document.querySelector('.star-bg');
    const existingOverlay = document.querySelector('.star-bg-overlay');
    const existingImageBg = document.querySelector('.star-bg-image');
    
    if (existingStarBg) {
      document.body.removeChild(existingStarBg);
    }
    if (existingOverlay) {
      document.body.removeChild(existingOverlay);
    }
    if (existingImageBg) {
      document.body.removeChild(existingImageBg);
    }
    
    // 创建图片背景层 - 仅在登录页面添加
    if (isLoginPage) {
      console.log('[星空背景] 开始创建登录页面图片背景');
      
      // 确保没有已存在的图片背景层
      const existingImageBg = document.querySelector('.star-bg-image');
      if (existingImageBg) {
        document.body.removeChild(existingImageBg);
        console.log('[星空背景] 已移除旧的背景层');
      }
      
      const imageBg = document.createElement('div');
      imageBg.className = 'star-bg-image';
      
      // 简化的纯色背景，确保一定能显示
      imageBg.style.position = 'fixed';
      imageBg.style.top = '0';
      imageBg.style.left = '0';
      imageBg.style.width = '100%';
      imageBg.style.height = '100%';
      
      // 强化背景颜色，使用更明显的深蓝色
      imageBg.style.backgroundColor = '#0a0e2a'; // 深蓝色背景
      imageBg.style.backgroundImage = 'none'; // 先禁用背景图片，确保纯色背景能显示
      
      // 设置其他样式
      imageBg.style.opacity = '1'; // 完全不透明
      imageBg.style.pointerEvents = 'none';
      imageBg.style.zIndex = '-10'; // 最底层，但确保能被看到
      imageBg.style.display = 'block';
      
      // 添加到body的第一个子元素位置
      document.body.insertBefore(imageBg, document.body.firstChild);
      console.log('[星空背景] 已添加登录页面背景');
      
      // 调试信息
      console.log('[星空背景] 图片背景元素:', imageBg);
      console.log('[星空背景] 图片背景样式:', getComputedStyle(imageBg));
      console.log('[星空背景] 文档中图片背景数量:', document.querySelectorAll('.star-bg-image').length);
      
      // 强制设置z-index
      setTimeout(() => {
        imageBg.style.zIndex = '-10';
        console.log('[星空背景] 强制更新z-index:', imageBg.style.zIndex);
      }, 100);
    }
    
    // 创建星空背景容器
    const starBgContainer = document.createElement('div');
    starBgContainer.className = 'star-bg';
    
    // 强制设置容器样式，确保层级正确 - 登录页面特殊调整
    starBgContainer.style.position = 'fixed';
    starBgContainer.style.top = '0';
    starBgContainer.style.left = '0';
    starBgContainer.style.width = '100%';
    starBgContainer.style.height = '100%';
    starBgContainer.style.pointerEvents = 'none';
    starBgContainer.style.zIndex = isLoginPage ? '0' : '-1'; // 登录页面提高层级
    starBgContainer.style.opacity = isLoginPage ? '0.9' : '0.8'; // 登录页面提高透明度，增强可见性
    
    // 创建星空覆盖层
    const starBgOverlay = document.createElement('div');
    starBgOverlay.className = 'star-bg-overlay';
    
    // 强制设置覆盖层样式
    starBgOverlay.style.position = 'fixed';
    starBgOverlay.style.top = '0';
    starBgOverlay.style.left = '0';
    starBgOverlay.style.width = '100%';
    starBgOverlay.style.height = '100%';
    // 登录页面特殊设置覆盖层颜色和透明度
    starBgOverlay.style.background = isLoginPage ? 
      'linear-gradient(to bottom, rgba(0, 10, 30, 0.8), rgba(0, 20, 60, 0.95))' : 
      'rgba(240, 242, 245, 0.1)';
    starBgOverlay.style.pointerEvents = 'none';
    starBgOverlay.style.zIndex = isLoginPage ? '0' : '0';
    
    // 添加到body
    document.body.appendChild(starBgContainer);
    document.body.appendChild(starBgOverlay);
    
    // 强制设置z-index，确保图片背景在最底层
    // 将这部分逻辑移到isLoginPage条件块内部，避免变量未定义错误
    
    // 确保body和html背景是透明的
    document.body.style.background = 'transparent !important';
    document.body.style.backgroundColor = 'transparent !important';
    document.documentElement.style.background = 'transparent !important';
    document.documentElement.style.backgroundColor = 'transparent !important';
    
    // 为登录页面添加特殊样式
    if (isLoginPage) {
      // 确保没有其他元素覆盖星空背景
      const loginContainer = document.querySelector('.login-container');
      if (loginContainer) {
        loginContainer.style.background = 'transparent !important';
        loginContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.02) !important';
        loginContainer.style.backdropFilter = 'blur(10px)';
        loginContainer.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        console.log('[星空背景] 已设置登录容器背景透明');
      }
    }
    
    // 根据屏幕尺寸生成星空
    function createStars() {
      console.log('[星空背景] 开始创建星空');
      
      // 清空现有星空
      starBgContainer.innerHTML = '';
      
      // 获取屏幕尺寸
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // 根据设备类型调整星点密度
      const density = getAdjustedDensity();
      
      // 生成并添加星空SVG元素
      const svgElement = generateStarBackground(width, height, density);
      
      // 强制设置SVG样式
      svgElement.style.width = '100%';
      svgElement.style.height = '100%';
      svgElement.style.transform = 'none';
      
      starBgContainer.appendChild(svgElement);
      
      // 为不同模块应用差异化样式
      applyModuleStyles();
      
      // 添加全局滚动交互
      addScrollInteraction(starBgContainer);
    }
    
    // 为不同模块应用差异化样式
    function applyModuleStyles() {
      const deviceType = getDeviceType();
      
      // 遍历所有定义的模块
      Object.keys(MODULE_CONFIG).forEach(moduleId => {
        if (moduleId === 'default') return;
        
        const elements = document.querySelectorAll(`.${moduleId}`);
        if (elements.length === 0) return;
        
        const config = getModuleConfig(moduleId);
        
        elements.forEach(element => {
          // 创建该模块的星空覆盖层
          const moduleOverlay = document.createElement('div');
          moduleOverlay.className = `star-bg-module-overlay star-bg-${moduleId}-overlay`;
          
          // 设置模块覆盖层样式
          moduleOverlay.style.position = 'absolute';
          moduleOverlay.style.top = '0';
          moduleOverlay.style.left = '0';
          moduleOverlay.style.width = '100%';
          moduleOverlay.style.height = '100%';
          moduleOverlay.style.pointerEvents = 'none';
          moduleOverlay.style.zIndex = '-1';
          moduleOverlay.style.opacity = config.opacity;
          
          // 根据设备类型和配置应用动效
          if (config.animation === 'slow' && deviceType === 'desktop') {
            // 缓慢闪烁动画
            moduleOverlay.style.animation = 'starPulse 10s infinite ease-in-out';
          } else if (config.animation === 'flow' && deviceType === 'desktop') {
            // 流动动画
            moduleOverlay.style.animation = 'starFlow 30s infinite linear';
          }
          
          // 确保元素是相对定位或绝对定位
          const elementStyle = window.getComputedStyle(element);
          if (!['relative', 'absolute', 'fixed'].includes(elementStyle.position)) {
            element.style.position = 'relative';
          }
          
          // 添加到元素中
          element.appendChild(moduleOverlay);
        });
      });
    }
    
    // 滚动交互
    function addScrollInteraction(starBg) {
      const deviceType = getDeviceType();
      // 移动端禁用滚动交互
      if (deviceType === 'mobile') return;
      
      let lastScrollY = window.scrollY;
      let isAnimating = false;
      
      window.addEventListener('scroll', () => {
        if (isAnimating) return;
        
        const currentScrollY = window.scrollY;
        const scrollDiff = currentScrollY - lastScrollY;
        
        // 计算星点偏移量（最大5px）
        const offset = Math.min(Math.abs(scrollDiff) / 50, 5);
        const direction = scrollDiff > 0 ? 1 : -1;
        
        // 应用偏移 - 模拟相机移动视角
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
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(() => {
        console.log('[星空背景] 窗口大小改变，重新生成星空');
        createStars();
      }, 200);
    });
    
    console.log('[星空背景] 初始化完成');
  } catch (error) {
    console.error('[星空背景] 初始化过程中出现错误:', error);
    
    // 降级处理 - 为低版本浏览器提供静态深蓝色背景
    try {
      const fallbackBg = document.createElement('div');
      fallbackBg.className = 'star-bg-fallback';
      fallbackBg.style.position = 'fixed';
      fallbackBg.style.top = '0';
      fallbackBg.style.left = '0';
      fallbackBg.style.width = '100%';
      fallbackBg.style.height = '100%';
      fallbackBg.style.backgroundColor = 'rgba(0, 20, 60, 0.95)';
      fallbackBg.style.pointerEvents = 'none';
      fallbackBg.style.zIndex = '-1';
      
      // 移除所有已存在的星空元素
      document.querySelectorAll('.star-bg, .star-bg-overlay').forEach(el => el.remove());
      
      // 添加降级背景
      document.body.appendChild(fallbackBg);
      console.log('[星空背景] 降级处理完成');
    } catch (fallbackError) {
      console.error('[星空背景] 降级处理失败:', fallbackError);
    }
  }
}

/**
 * 添加星空hover交互效果到指定元素
 * @param {HTMLElement} element - 要添加交互效果的元素
 */
export function addStarHoverEffect(element) {
  const deviceType = getDeviceType();
  // 移动端弱化动效
  const isMobile = deviceType === 'mobile';
  const hoverRadius = isMobile ? 30 : 50;
  const highlightDuration = isMobile ? 200 : 300;
  
  // 查找元素周围的星点
  function findNearbyStars(x, y, radius = hoverRadius) {
    const stars = document.querySelectorAll('.star-big, .star-medium, .star-small');
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
      const originalOpacity = star.getAttribute('data-original-opacity') || star.getAttribute('opacity') || '0.2';
      star.setAttribute('data-original-opacity', originalOpacity);
      
      // 根据距离计算高亮强度 - 模拟镜头对焦光斑
      const highlightFactor = isMobile ? 1.5 : (1 + (1 - distance / hoverRadius) * 3);
      const newOpacity = Math.min(parseFloat(originalOpacity) * highlightFactor, 0.3); // 最大透明度不超过30%
      
      star.setAttribute('opacity', newOpacity);
      
      // 添加过渡效果
      star.style.transition = `opacity ${highlightDuration}ms ease-out`;
    });
  }
  
  // 恢复星点原始状态
  function resetStars(stars) {
    stars.forEach(({ star }) => {
      const originalOpacity = star.getAttribute('data-original-opacity') || '0.2';
      
      star.setAttribute('opacity', originalOpacity);
      
      // 清除过渡效果
      setTimeout(() => {
        if (star && star.parentNode) {
          star.style.transition = '';
        }
      }, highlightDuration);
    });
  }
  
  // 为元素添加鼠标移动事件
  element.addEventListener('mouseenter', (e) => {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    const nearbyStars = findNearbyStars(x, y);
    highlightStars(nearbyStars);
  });
  
  // 鼠标离开时恢复
  element.addEventListener('mouseleave', (e) => {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    const nearbyStars = findNearbyStars(x, y);
    setTimeout(() => {
      resetStars(nearbyStars);
    }, highlightDuration);
  });
}

/**
 * 初始化所有星空交互效果
 */
export function initAllStarInteractions() {
  const deviceType = getDeviceType();
  
  // 为所有按钮和标签添加交互
  document.querySelectorAll('button, .tag, .nav-link').forEach(button => {
    addStarHoverEffect(button);
  });
  
  // 为所有作品卡片添加交互
  if (deviceType !== 'mobile') { // 移动端禁用卡片轮廓效果
    document.querySelectorAll('.photo-item, .article-item, .equipment-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        // 检查是否已存在轮廓
        if (card.querySelector('.star-outline')) return;
        
        // 添加浅金轮廓效果 - 沿卡片边缘排列
        const outline = document.createElement('div');
        outline.className = 'star-outline';
        
        // 计算卡片尺寸和位置
        const rect = card.getBoundingClientRect();
        
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
        
        // 确保卡片是相对定位
        const cardStyle = window.getComputedStyle(card);
        if (!['relative', 'absolute', 'fixed'].includes(cardStyle.position)) {
          card.style.position = 'relative';
        }
        
        card.appendChild(outline);
        
        // 鼠标离开时移除轮廓
        card.addEventListener('mouseleave', function removeOutline() {
          if (outline && outline.parentNode === card) {
            outline.style.opacity = '0';
            outline.style.transition = 'opacity 0.3s ease-out';
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
}

// 添加必要的CSS动画样式
function addStarAnimations() {
  // 检查是否已添加动画样式
  if (document.getElementById('star-animations')) return;
  
  const style = document.createElement('style');
  style.id = 'star-animations';
  style.textContent = `
    /* 星点缓慢闪烁动画 */
    @keyframes starPulse {
      0%, 100% { opacity: 0.05; }
      50% { opacity: 0.12; }
    }
    
    /* 星点流动动画 */
    @keyframes starFlow {
      0% { background-position: 0% 0%; }
      100% { background-position: 100% 0%; }
    }
    
    /* 轮廓动画 */
    @keyframes starOutline {
      0% {
        opacity: 0;
        transform: scale(0.98);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    /* 确保所有星点动效仅用CSS实现 */
    .star-big, .star-small, .star-medium {
      transition: opacity 0.3s ease-out;
    }
    
    /* 银河和星云效果 */
    .galaxy-band {
      filter: blur(15px);
    }
    
    .nebula {
      filter: blur(30px);
    }
    
    /* 响应式设计 - 仅保留PC端样式 */
    /* 已移除移动端优化 */
  `;
  
  document.head.appendChild(style);
}

// 初始化动画样式
addStarAnimations();