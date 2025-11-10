import { ref, computed, type Ref, type ComputedRef } from 'vue'

// 用户接口定义
export interface User {
  id: string
  username: string
  name: string
  email: string
  avatar: string
  role: 'user' | 'admin'
  bio?: string
  coverImage?: string
}

// 认证状态
const user: Ref<User | null> = ref(null)
const isAuthenticated: ComputedRef<boolean> = computed(() => !!user.value)
const isAdmin: ComputedRef<boolean> = computed(() => user.value?.role === 'admin')

// 模拟登录函数
export function login(email: string, password: string): Promise<boolean> {
  return new Promise((resolve) => {
    // 模拟网络请求延迟
    setTimeout(() => {
      if (email === 'admin@example.com' && password === 'password') {
        user.value = {
          id: '1',
          username: 'admin',
          name: '管理员',
          email: 'admin@example.com',
          avatar: '/images/avatars/admin.jpg',
          role: 'admin'
        }
        // 设置 localStorage 认证状态，确保页面能正确识别登录状态
        localStorage.setItem('isAuthenticated', 'true')
        resolve(true)
      } else if (email && password) {
        user.value = {
          id: '2',
          username: email.split('@')[0],
          name: '普通用户',
          email: email,
          avatar: '/images/avatars/user.jpg',
          role: 'user'
        }
        // 设置 localStorage 认证状态，确保页面能正确识别登录状态
        localStorage.setItem('isAuthenticated', 'true')
        resolve(true)
      } else {
        resolve(false)
      }
    }, 1000)
  })
}

// 模拟注册函数
export function register(name: string, email: string, password: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (name && email && password) {
        user.value = {
          id: Date.now().toString(),
          username: email.split('@')[0],
          name,
          email,
          avatar: '/images/avatars/user.jpg',
          role: 'user'
        }
        // 设置 localStorage 认证状态，确保页面能正确识别登录状态
        localStorage.setItem('isAuthenticated', 'true')
        resolve(true)
      } else {
        resolve(false)
      }
    }, 1000)
  })
}

// 退出登录
export function logout(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      user.value = null
      resolve()
    }, 500)
  })
}

// 获取当前用户
export function getCurrentUser(): User | null {
  return user.value
}

// 检查权限
export function hasPermission(permission: string): boolean {
  if (!user.value) return false
  
  // 简单的权限检查逻辑
  const permissions = {
    admin: ['manage_users', 'manage_content', 'view_reports'],
    user: ['view_content', 'upload_photos', 'comment']
  }
  
  return permissions[user.value.role]?.includes(permission) || false
}

// 主要导出
export function useAuth() {
  return {
    // 状态
    user: computed(() => user.value),
    isAuthenticated,
    isAdmin,
    
    // 方法
    login,
    register,
    logout,
    getCurrentUser,
    hasPermission
  }
}

export default useAuth