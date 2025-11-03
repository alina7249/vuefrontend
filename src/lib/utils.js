// 格式化日期时间
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return '无效日期';
  }
  
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // 小于一天显示相对时间
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      if (diffMinutes === 0) {
        return '刚刚';
      }
      return `${diffMinutes}分钟前`;
    }
    return `${diffHours}小时前`;
  }
  
  // 小于一周显示天数
  if (diffDays < 7) {
    return `${diffDays}天前`;
  }
  
  // 超过一周显示完整日期
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  // 如果是今年，不显示年份
  if (year === now.getFullYear()) {
    return `${month}-${day} ${hours}:${minutes}`;
  }
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 格式化数字，添加千分位分隔符
export const formatNumber = (num) => {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }
  
  // 处理大数字显示
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 截断文本
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength) + suffix;
};

// 验证邮箱
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 验证密码强度
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      message: '请输入密码',
      strength: 'weak'
    };
  }
  
  // 检查密码长度
  if (password.length < 6) {
    return {
      isValid: false,
      message: '密码长度至少为6个字符',
      strength: 'weak'
    };
  }
  
  let strength = 'weak';
  let score = 0;
  
  // 包含小写字母
  if (/[a-z]/.test(password)) score++;
  // 包含大写字母
  if (/[A-Z]/.test(password)) score++;
  // 包含数字
  if (/\d/.test(password)) score++;
  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  // 长度大于8
  if (password.length > 8) score++;
  
  // 确定强度
  if (score >= 4) {
    strength = 'strong';
  } else if (score >= 3) {
    strength = 'medium';
  }
  
  return {
    isValid: true,
    message: strength === 'strong' ? '密码强度很强' : strength === 'medium' ? '密码强度适中' : '密码强度较弱',
    strength
  };
};

// 生成唯一ID
export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 9);
  return prefix ? `${prefix}-${timestamp}-${randomStr}` : `${timestamp}-${randomStr}`;
};

// 防抖函数
export const debounce = (func, delay) => {
  let timeoutId;
  
  return function (...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

// 节流函数
export const throttle = (func, limit) => {
  let inThrottle;
  
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

// 深拷贝对象
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

// 图片预加载
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

// 获取相对路径
export const getRelativePath = (basePath, fullPath) => {
  if (!basePath || !fullPath) {
    return fullPath;
  }
  
  if (fullPath.startsWith(basePath)) {
    return fullPath.slice(basePath.length).replace(/^\//, '');
  }
  
  return fullPath;
};

// 滚动到指定元素
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// 检查元素是否在视口内
export const isElementInViewport = (element) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// 计算阅读时间
export const calculateReadingTime = (text, wordsPerMinute = 200) => {
  if (!text || typeof text !== 'string') {
    return 0;
  }
  
  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
  
  return Math.max(1, readingTimeMinutes);
};