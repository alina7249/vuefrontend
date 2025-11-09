import { ref, watch, type Ref } from 'vue'

type Theme = 'light' | 'dark'

export function useTheme() {
  const getInitialTheme = (): Theme => {
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme) {
      return savedTheme
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  
  const theme: Ref<Theme> = ref<Theme>(getInitialTheme())

  // 监听主题变化
  watch(theme, (newTheme) => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(newTheme)
    localStorage.setItem('theme', newTheme)
  }, { immediate: true })

  const toggleTheme = (): void => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const isDark = ref(theme.value === 'dark')

  // 监听主题变化更新isDark
  watch(theme, (newTheme) => {
    isDark.value = newTheme === 'dark'
  })

  return {
    theme,
    toggleTheme,
    isDark
  }
}