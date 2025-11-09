<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0F1C2D]">
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5 }"
      class="max-w-md w-full space-y-8 bg-[#1E2A3A] p-8 rounded-xl shadow-xl border border-[#4A5568]"
    >
      <div class="text-center relative">
        <div class="absolute inset-0 bg-[url('https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=galaxy%20background%20stars%20purple%20blue&sign=9a9229c82aef2e4f5ac40648383863bf')] bg-cover opacity-10 rounded-full w-20 h-20 mx-auto -mt-12"></div>
        <motion.div
          :hover="{ rotate: 10 }"
          class="relative inline-flex items-center justify-center mb-4 text-3xl text-[#63B3ED]"
        >
          <i class="fa-solid fa-camera"></i>
        </motion.div>
        <h1 class="text-2xl font-bold text-[#FFFFFF]">登录 影研社</h1>
        <p class="mt-2 text-sm text-[#E2E8F0]">
          专业摄影创作与交流平台，连接全球摄影人
        </p>
      </div>
      
      <form @submit="handleSubmit" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-[#E2E8F0] mb-1">
              用户名
            </label>
            <input
              id="username"
              v-model="username"
              name="username"
              type="text"
              required
              class="w-full px-4 py-3 rounded-lg border border-[#4A5568] bg-[#4A5568] text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#63B3ED] transition-colors"
              placeholder="请输入用户名"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-[#E2E8F0] mb-1">
              密码
            </label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="w-full px-4 py-3 rounded-lg border border-[#4A5568] bg-[#4A5568] text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#63B3ED] transition-colors"
              placeholder="••••••••"
            />
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-[#38B2AC] focus:ring-[#38B2AC] border-[#4A5568] rounded bg-[#1E2A3A]"
              />
              <label for="remember-me" class="ml-2 block text-sm text-[#E2E8F0]">
                记住我
              </label>
            </div>
            
            <div>
              <a
                href="#"
                class="text-sm font-medium text-[#63B3ED] hover:text-[#63B3ED] transition-colors"
              >
                忘记密码？
              </a>
            </div>
          </div>
        </div>
        
        <motion.div
          :hover="{ scale: 1.02 }"
          :tap="{ scale: 0.98 }"
        >
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-[#63B3ED] hover:bg-[#4299E1] text-[#0F1C2D] font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-[#63B3ED] transition-colors"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <i class="fa-solid fa-circle-notch fa-spin mr-2"></i>
              登录中...
            </span>
            <span v-else>登录</span>
          </button>
        </motion.div>
      </form>
      
      <div class="mt-6 relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-[#4A5568]"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-[#1E2A3A] text-[#718096]">
            或通过以下方式登录
          </span>
        </div>
      </div>
      
      <div class="mt-6 grid grid-cols-3 gap-3">
        <motion.button
          :hover="{ scale: 1.05 }"
          :tap="{ scale: 0.95 }"
          class="inline-flex justify-center items-center px-4 py-2 border border-[#4A5568] rounded-lg bg-[#1E2A3A] text-[#E2E8F0] hover:bg-[#4A5568] transition-colors"
        >
          <i class="fa-brands fa-weixin text-green-500"></i>
        </motion.button>
        
        <motion.button
          :hover="{ scale: 1.05 }"
          :tap="{ scale: 0.95 }"
          class="inline-flex justify-center items-center px-4 py-2 border border-[#4A5568] rounded-lg bg-[#1E2A3A] text-[#E2E8F0] hover:bg-[#4A5568] transition-colors"
        >
          <i class="fa-brands fa-weibo text-red-500"></i>
        </motion.button>
        
        <motion.button
          :hover="{ scale: 1.05 }"
          :tap="{ scale: 0.95 }"
          class="inline-flex justify-center items-center px-4 py-2 border border-[#4A5568] rounded-lg bg-[#1E2A3A] text-[#E2E8F0] hover:bg-[#4A5568] transition-colors"
        >
          <i class="fa-brands fa-qq text-blue-400"></i>
        </motion.button>
      </div>
      
      <div class="text-center mt-6">
        <p class="text-sm text-[#718096]">
          还没有账号？{' '}
          <RouterLink
            to="/register"
            class="font-medium text-[#63B3ED] hover:text-[#63B3ED] transition-colors"
          >
            立即注册
          </RouterLink>
        </p>
      </div>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { motion } from 'motion-v'
import toast from '@/composables/useToast'
import { useAuth } from '@/composables/useAuth'

// 响应式状态
const username = ref('admin')
const password = ref('123456')
const isLoading = ref(false)

// 路由和认证
const router = useRouter()
const { login } = useAuth()

// 处理表单提交
const handleSubmit = async (e: Event) => {
  e.preventDefault()
  
  // 简单验证
  if (!username.value || !password.value) {
    toast.warning('请输入用户名和密码')
    return
  }
  
  isLoading.value = true
  
  try {
    const success = await login(username.value, password.value)
    
    if (success) {
      toast.success('登录成功，欢迎回来！')
      router.push('/')
    } else {
      toast.error('用户名或密码错误，请重试')
    }
  } catch (error) {
    toast.error('登录失败，请稍后重试')
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 登录页面样式 */
</style>