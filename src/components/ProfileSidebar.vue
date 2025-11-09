<template>
  <div v-if="isOpen" class="fixed inset-0 z-50">
    <!-- 背景遮罩 -->
    <motion.div 
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      class="absolute inset-0 bg-black/50"
      @click="onClose"
    />
    
    <!-- 侧边栏 -->
    <motion.div
      :initial="{ x: '100%' }"
      :animate="{ x: 0 }"
      :exit="{ x: '100%' }"
      :transition="{ type: 'spring', damping: 20 }"
      class="absolute top-0 right-0 h-full w-[320px] max-w-[90%] bg-[#E6EBF2] border-l border-[#B8C6D8] star-texture overflow-y-auto"
    >
      <!-- 顶部关闭按钮 -->
      <div class="flex justify-end p-4">
        <button 
          @click="onClose"
          class="w-8 h-8 rounded-full flex items-center justify-center text-[#4A5059] hover:bg-[#F5F7FA] transition-colors"
        >
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
      
      <!-- 顶部身份信息区 -->
      <div class="px-6 mb-6">
        <div class="text-center mb-4">
          <div class="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-4 border-[#B8C6D8]">
            <img 
              src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc"
              alt="User avatar"
              class="w-full h-full object-cover"
            />
          </div>
          <h2 class="text-xl font-bold text-[#4A5059] mb-1">{{ username }}</h2>
          <p class="text-[#4A5059]/70 text-sm">风光/人像双题材创作者</p>
        </div>
        
        <!-- 等级和进度条 -->
        <div class="bg-[#F5F7FA] rounded-lg p-4 mb-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-[#4A5F8B] text-sm">{{ level }} LV.{{ levelNum }}</span>
            <span class="text-[#4A5F8B] text-xs">{{ progress }}/{{ progressMax }}成长值</span>
          </div>
          <div class="w-full h-2 bg-[#E6EBF2] rounded-full overflow-hidden">
            <div 
              class="h-full bg-[#4A5F8B]" 
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
        </div>
        
        <!-- 会员标识 -->
        <div class="bg-[#4A5F8B] text-[#F5F7FA] text-sm font-medium py-2 px-4 rounded-full text-center border border-[#4A5F8B]">
          银河会员·年卡（剩余128天）
        </div>
      </div>
      
      <!-- 中间核心数据统计区 -->
      <div class="grid grid-cols-3 gap-1 px-6 mb-6">
        <div class="bg-[#F5F7FA] rounded-lg p-3 text-center">
          <p class="text-[#4A5059] text-sm mb-1">作品</p>
          <p class="text-[#4A5059] font-bold text-lg">{{ stats.posts }}</p>
        </div>
        <div class="bg-[#F5F7FA] rounded-lg p-3 text-center">
          <p class="text-[#4A5059] text-sm mb-1">获赞</p>
          <p class="text-[#4A5059] font-bold text-lg">{{ stats.likes }}</p>
        </div>
        <div class="bg-[#F5F7FA] rounded-lg p-3 text-center">
          <p class="text-[#4A5059] text-sm mb-1">收藏</p>
          <p class="text-[#4A5059] font-bold text-lg">{{ stats.collections }}</p>
        </div>
      </div>
      
      <!-- 下方功能列表区 -->
      <div class="px-4">
        <RouterLink 
          v-for="item in menuItems"
          :key="item.id"
          :to="item.link"
          @click="onClose"
          class="flex items-center py-3 px-4 mb-1 rounded-lg text-[#4A5059] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
        >
          <i :class="`fa-solid ${item.icon} mr-3`"></i>
          <span>{{ item.text }}</span>
        </RouterLink>
      </div>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { motion } from 'motion-v'

// 类型定义
interface ProfileStats {
  posts: number
  likes: number
  collections: number
}

interface MenuItem {
  id: string
  icon: string
  text: string
  link: string
}

// 组件属性定义
interface Props {
  isOpen: boolean
  onClose: () => void
  username: string
  level: string
  levelNum: number
  progress: number
  progressMax: number
  stats: ProfileStats
}

const props = defineProps<Props>()

// 计算进度百分比
const progressPercentage = computed(() => {
  return (props.progress / props.progressMax) * 100
})

// 功能菜单数据
const menuItems: MenuItem[] = [
  { id: 'works', icon: 'fa-camera', text: '我的作品集', link: '/profile-center/works' },
  { id: 'locations', icon: 'fa-map-marker-alt', text: '我的拍摄地点', link: '/profile-center/photo-locations' },
  { id: 'equipment', icon: 'fa-video', text: '我的器材库', link: '/profile-center/equipment' },
  { id: 'materials', icon: 'fa-microchip', text: '我的素材库', link: '/profile-center/materials' },
  { id: 'events', icon: 'fa-flag', text: '摄影活动', link: '/profile-center/events' },
  { id: 'tools', icon: 'fa-palette', text: '后期工具', link: '/profile-center/editor' },
  { id: 'membership', icon: 'fa-crown', text: '会员中心', link: '/profile-center/membership' },
  { id: 'orders', icon: 'fa-shopping-cart', text: '我的订单', link: '/profile-center/orders' },
  { id: 'benefits', icon: 'fa-award', text: '成长福利', link: '/profile-center/benefits' },
  { id: 'settings', icon: 'fa-cog', text: '设置', link: '/profile-center/settings' },
]
</script>

<style scoped>
/* ProfileSidebar 组件样式 */
</style>