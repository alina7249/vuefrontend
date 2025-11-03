import { ref, onMounted, computed } from 'vue';

export const useTheme = () => {
  // 初始化主题状态
  const theme = ref('light');
  const isLoading = ref(true);

  // 初始化主题
  onMounted(() => {
    // 检查localStorage中的主题设置
    const savedTheme = localStorage.getItem('theme');
    // 检查系统偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 确定初始主题
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    theme.value = initialTheme;
    
    // 应用主题到文档
    applyTheme(initialTheme);
    
    // 设置加载状态为完成
    isLoading.value = false;
  });

  // 应用主题到文档
  const applyTheme = (themeName) => {
    // 移除所有主题类
    document.documentElement.classList.remove('dark', 'light');
    // 添加当前主题类
    document.documentElement.classList.add(themeName);
    // 更新meta主题颜色（用于移动浏览器地址栏）
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        themeName === 'dark' ? '#121212' : '#ffffff'
      );
    }
  };

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light';
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  // 设置特定主题
  const setSpecificTheme = (themeName) => {
    if (['light', 'dark'].includes(themeName)) {
      theme.value = themeName;
      localStorage.setItem('theme', themeName);
      applyTheme(themeName);
      return true;
    }
    return false;
  };

  // 计算属性
  const isDark = computed(() => theme.value === 'dark');

  return {
    theme,
    isLoading,
    toggleTheme,
    setSpecificTheme,
    isDark,
  };
};