<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // 自动重定向到学习页面
  router.replace('/learn')
})
</script>

<template>
  <!-- 此页面会自动重定向到学习页面 -->
  <div style="text-align: center; padding: 40px;">
    <p>正在跳转到学习页面...</p>
  </div>
</template>
