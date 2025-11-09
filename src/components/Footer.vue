<template>
  <footer class="w-full py-10 mt-12 bg-[#1E2532]">
    <div class="container mx-auto px-4">
      <!-- 上下区域过渡条 -->
      <div class="h-4 bg-[#1E2A3A] rounded-t-xl mb-8"></div>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- 品牌信息 -->
        <div class="space-y-4">
          <div class="flex items-center">
            <i class="fa-solid fa-camera text-2xl text-[#E0E5EC] mr-2"></i>
            <span class="text-xl font-bold text-[#E0E5EC]">
              影研社
            </span>
          </div>
          <p class="text-sm text-[#718096]">
            聚焦艺术摄影、商业创作及黑白影像领域，为追求质感的摄影师与爱好者，打造"深邃夜空"风格的专业交流空间。
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-[#E2E8F0] hover:text-[#63B3ED] transition-colors">
              <i class="fa-brands fa-weibo"></i>
            </a>
            <a href="#" class="text-[#E0E5EC] hover:text-[#B8C6D8] transition-colors">
              <i class="fa-brands fa-weixin"></i>
            </a>
            <a href="#" class="text-[#E0E5EC] hover:text-[#B8C6D8] transition-colors">
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a href="#" class="text-[#E0E5EC] hover:text-[#B8C6D8] transition-colors">
              <i class="fa-brands fa-twitter"></i>
            </a>
          </div>
        </div>

        <!-- 快速链接 -->
        <div class="bg-[#1E2A3A] rounded-lg p-5 border border-[#4A5568]">
          <h4 class="text-lg font-bold mb-4 text-[#FFFFFF]">快速链接</h4>
          <ul class="space-y-2">
            <li>
              <RouterLink to="/" class="text-sm text-[#E2E8F0] hover:text-[#63B3ED] transition-colors">
                首页
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/community" class="text-sm text-[#E2E8F0] hover:text-[#63B3ED] transition-colors">
                社区
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/resources" class="text-sm text-[#E2E8F0] hover:text-[#63B3ED] transition-colors">
                资源
              </RouterLink>
            </li>
            <li>
              <RouterLink to="#" class="text-sm text-[#E2E8F0] hover:text-[#63B3ED] transition-colors">
                赛事
              </RouterLink>
            </li>
            <li>
              <RouterLink to="#" class="text-sm text-[#E2E8F0] hover:text-[#63B3ED] transition-colors">
                器材交易
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- 支持 -->
        <div class="bg-[#1E2A3A] rounded-lg p-5 border border-[#4A5568]">
          <h4 class="text-lg font-bold mb-4 text-[#FFFFFF]">支持</h4>
          <ul class="space-y-2">
            <li>
              <RouterLink to="#" class="text-sm text-[#E2E8F0] hover:text-[#63B3ED] transition-colors">
                帮助中心
              </RouterLink>
            </li>
            <li>
              <RouterLink to="#" class="text-sm text-[#E2E8F0] hover:text-[#63B3ED] transition-colors">
                社区准则
              </RouterLink>
            </li>
            <li>
              <RouterLink to="#" class="text-sm text-[#E2E8F0] hover:text-[#63B3ED] transition-colors">
                隐私政策
              </RouterLink>
            </li>
            <li>
              <RouterLink to="#" class="text-sm text-[#E2E8F0] hover:text-[#63B3ED] transition-colors">
                服务条款
              </RouterLink>
            </li>
            <li>
              <RouterLink to="#" class="text-sm text-[#E2E8F0] hover:text-[#63B3ED] transition-colors">
                联系我们
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- 订阅 -->
        <div class="bg-[#1E2A3A] rounded-lg p-5 border border-[#4A5568]">
          <h4 class="text-lg font-bold mb-4 text-[#FFFFFF]">订阅更新</h4>
          <p class="text-sm mb-4 text-[#E0E5EC]/80">
            订阅我们的新闻通讯，获取最新的摄影技巧、赛事信息和社区动态。
          </p>
          <div class="flex">
            <input
              type="email"
              placeholder="您的邮箱地址"
              class="flex-1 px-4 py-2 bg-[#4A5568] text-[#FFFFFF] rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#63B3ED]"
            />
            <button class="px-4 py-2 bg-[#63B3ED] text-[#0F1C2D] hover:bg-[#4299E1] rounded-r-lg text-sm font-medium transition-colors">
              订阅
            </button>
          </div>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="mt-10 pt-6 border-t border-[#B8C6D8]/30 text-center">
        <p class="text-sm text-[#E0E5EC]/80">
          © 2025 影研社. 保留所有权利。
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
/* Footer 组件样式 */
</style>