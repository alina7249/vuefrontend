<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">页面未找到</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8">抱歉，您访问的页面不存在。</p>
      <button 
        @click="goHome" 
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>