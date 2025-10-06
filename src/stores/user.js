import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 用户状态
  const isLoggedIn = ref(false)
  const currentUser = ref(null)
  const loginError = ref('')
  
  // 登录功能
  const login = (username, password, rememberMe) => {
    // 这里是模拟登录逻辑，实际应该调用API
    if (username === 'admin' && password === '123456') {
      isLoggedIn.value = true
      currentUser.value = {
        id: '1',
        username: 'admin',
        avatar: 'https://picsum.photos/id/64/40/40',
        nickname: '摄影爱好者',
        bio: '热爱摄影，分享生活中的美好瞬间',
        following: 128,
        followers: 86,
        likes: 356,
        photos: 23,
        joinDate: '2024',
        level: '高级摄影师',
        badges: ['摄影达人', '人气王']
      }
      loginError.value = ''
      
      // 记住我功能
      if (rememberMe) {
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userData', JSON.stringify(currentUser.value))
        // 设置过期时间（7天）
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + 7)
        localStorage.setItem('loginExpiry', expiryDate.toISOString())
      }
      
      return true
    } else {
      loginError.value = '用户名或密码错误'
      return false
    }
  }
  
  // 登出功能
  const logout = () => {
    isLoggedIn.value = false
    currentUser.value = null
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userData')
    localStorage.removeItem('loginExpiry')
  }
  
  // 检查登录状态
  const checkLoginStatus = () => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const expiryDate = localStorage.getItem('loginExpiry')
    
    if (loggedIn && expiryDate) {
      const now = new Date()
      const expiry = new Date(expiryDate)
      
      if (now < expiry) {
        // 登录未过期
        isLoggedIn.value = true
        try {
          const userData = localStorage.getItem('userData')
          if (userData) {
            currentUser.value = JSON.parse(userData)
          }
        } catch (error) {
          console.error('解析用户数据失败:', error)
          logout()
        }
        return true
      } else {
        // 登录已过期
        logout()
        return false
      }
    }
    
    return false
  }
  
  return {
    isLoggedIn,
    currentUser,
    loginError,
    login,
    logout,
    checkLoginStatus
  }
})