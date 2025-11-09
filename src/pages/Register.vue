<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0F1C2D]">
    <div
      class="max-w-md w-full space-y-8 bg-[#1E2A3A] p-8 rounded-xl shadow-xl border border-[#4A5568]"
    >
      <div class="text-center relative">
        <div
          class="absolute inset-0 bg-[url('https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=galaxy%20background%20stars%20purple%20blue&sign=9a9229c82aef2e4f5ac40648383863bf')] bg-cover opacity-10 rounded-full w-20 h-20 mx-auto -mt-12"
        ></div>
        <div
          v-motion="{ hover: { rotate: 10 } }"
          class="relative inline-flex items-center justify-center mb-4 text-3xl text-[#63B3ED]"
        >
          <i class="fa-solid fa-camera"></i>
        </div>
        <h1 class="text-2xl font-bold text-[#FFFFFF]">创建 影研社 账号</h1>
        <p class="mt-2 text-sm text-[#E2E8F0]">
          加入专业摄影创作与交流平台，展示你的作品
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
              name="username"
              type="text"
              required
              :value="username"
              @input="(e: InputEvent) => username = (e.target as HTMLInputElement).value"
              class="w-full px-4 py-3 rounded-lg border border-[#4A5568] bg-[#4A5568] text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#63B3ED] transition-colors"
              placeholder="请输入用户名"
            />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-[#E2E8F0] mb-1">
              手机号码
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              :value="phone"
              @input="(e: InputEvent) => phone = (e.target as HTMLInputElement).value"
              class="w-full px-4 py-3 rounded-lg border border-[#4A5568] bg-[#4A5568] text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#63B3ED] transition-colors"
              placeholder="请输入手机号码"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-[#E2E8F0] mb-1">
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              :value="password"
              @input="(e: InputEvent) => password = (e.target as HTMLInputElement).value"
              class="w-full px-4 py-3 rounded-lg border border-[#4A5568] bg-[#4A5568] text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#63B3ED] transition-colors"
              placeholder="至少8个字符"
            />
          </div>

          <div>
            <label for="confirm-password" class="block text-sm font-medium text-[#E2E8F0] mb-1">
              确认密码
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              :value="confirmPassword"
              @input="(e: InputEvent) => confirmPassword = (e.target as HTMLInputElement).value"
              class="w-full px-4 py-3 rounded-lg border border-[#4A5568] bg-[#4A5568] text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#63B3ED] transition-colors"
              placeholder="再次输入密码"
            />
          </div>

          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                class="h-4 w-4 text-[#38B2AC] focus:ring-[#38B2AC] border-[#4A5568] rounded bg-[#1E2A3A]"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="terms" class="text-[#718096]">
                我已阅读并同意
                <a href="#" class="text-[#63B3ED] hover:text-[#63B3ED] transition-colors">
                  服务条款
                </a>
                和
                <a href="#" class="text-[#63B3ED] hover:text-[#63B3ED] transition-colors">
                  隐私政策
                </a>
              </label>
            </div>
          </div>
        </div>

        <div
          v-motion="{ hover: { scale: 1.02 }, tap: { scale: 0.98 } }"
        >
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-[#63B3ED] hover:bg-[#4299E1] text-[#0F1C2D] font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-[#63B3ED] transition-colors"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <i class="fa-solid fa-circle-notch fa-spin mr-2"></i>
              注册中...
            </span>
            <span v-else>注册</span>
          </button>
        </div>
      </form>

      <div class="mt-6 relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-[#4A5568]"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-[#1E2A3A] text-[#718096]">
            或通过以下方式注册
          </span>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-3 gap-3">
        <button
          v-motion="{ hover: { scale: 1.05 }, tap: { scale: 0.95 } }"
          class="inline-flex justify-center items-center px-4 py-2 border border-[#4A5568] rounded-lg bg-[#1E2A3A] text-[#E2E8F0] hover:bg-[#4A5568] transition-colors"
        >
          <i class="fa-brands fa-weixin text-green-500"></i>
        </button>

        <button
          v-motion="{ hover: { scale: 1.05 }, tap: { scale: 0.95 } }"
          class="inline-flex justify-center items-center px-4 py-2 border border-[#4A5568] rounded-lg bg-[#1E2A3A] text-[#E2E8F0] hover:bg-[#4A5568] transition-colors"
        >
          <i class="fa-brands fa-weibo text-red-500"></i>
        </button>

        <button
          v-motion="{ hover: { scale: 1.05 }, tap: { scale: 0.95 } }"
          class="inline-flex justify-center items-center px-4 py-2 border border-[#4A5568] rounded-lg bg-[#1E2A3A] text-[#E2E8F0] hover:bg-[#4A5568] transition-colors"
        >
          <i class="fa-brands fa-qq text-blue-400"></i>
        </button>
      </div>

      <div class="text-center mt-6">
        <p class="text-sm text-[#718096]">
          已有账号？
          <router-link
            to="/login"
            class="font-medium text-[#63B3ED] hover:text-[#63B3ED] transition-colors"
          >
            立即登录
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import toast from '@/composables/useToast'

const router = useRouter()
const { register: authRegister } = useAuth()

// 响应式状态
const username = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

// 处理表单提交
const handleSubmit = async (e: Event) => {
  e.preventDefault()
  
  // 简单验证
  if (!username.value || !phone.value || !password.value || !confirmPassword.value) {
    toast.warning('请填写所有必填字段')
    return
  }
  
  // 用户名验证
  if (username.value.length < 2 || username.value.length > 20) {
    toast.warning('用户名长度应在2-20个字符之间')
    return
  }
  
  // 手机号格式验证
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(phone.value)) {
    toast.warning('请输入有效的手机号码')
    return
  }
  
  // 密码验证
  if (password.value.length < 8) {
    toast.warning('密码长度至少为8个字符')
    return
  }
  
  // 确认密码
  if (password.value !== confirmPassword.value) {
    toast.warning('两次输入的密码不一致')
    return
  }
  
  isLoading.value = true
  
  try {
    const success = await authRegister(username.value, phone.value, password.value)
    
    if (success) {
      toast.success('注册成功，请登录！')
      router.push('/login')
    } else {
      toast.error('注册失败，请稍后重试')
    }
  } catch (error) {
    toast.error('注册失败，请稍后重试')
    console.error('Registration error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 保持原有的样式，无需额外修改 */
</style>