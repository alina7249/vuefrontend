<template>

  <div class="min-h-screen flex flex-col bg-[#1E2532]">
    <!-- 全局 Header 组件 -->
    <Header />
    
    <main class="flex-1">
      <!-- Vue Router 视图 -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <!-- 全局 Footer 组件 -->
    <Footer />
    
    <!-- 全局通知组件 -->
    <div style="z-index: 9999;">
      <Toaster />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './store/modules/user'
import Header from './components/Layout/Header.vue'
import Footer from './components/Layout/Footer.vue'
import { Toaster } from 'sonner'

const authStore = useAuthStore()

// 应用启动时初始化认证状态
onMounted(() => {
  authStore.initializeAuth()
})
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1E2532;
}

::-webkit-scrollbar-thumb {
  background: #4A5F8B;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #63B3ED;
}
</style>
