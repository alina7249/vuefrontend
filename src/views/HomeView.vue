<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // 自动重定向到摄影学习页面
  router.replace('/learn')
})
</script>

<template>
  <div class="home-container">
    <div class="photography-theme">
      <h1 class="page-title">欢迎来到摄影学习平台</h1>
      <p class="redirect-message">正在跳转到您的摄影学习旅程...</p>
      <div class="camera-icon">📸</div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photography-theme {
  text-align: center;
  padding: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #ffffff;
  background: linear-gradient(90deg, #4CAF50, #2196F3);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.redirect-message {
  color: #b0b0b0;
  font-size: 18px;
  margin-bottom: 30px;
}

.camera-icon {
  font-size: 60px;
  animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>
