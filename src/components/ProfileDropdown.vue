<template>
  <div v-if="isOpen" class="fixed inset-0 z-40">
    <!-- 背景遮罩 -->
    <motion.div 
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      class="absolute inset-0 bg-black/50"
      @click="onClose"
    />
    
    <!-- 下拉面板 -->
    <motion.div
      :initial="{ opacity: 0, y: -20 }"
      :animate="{ opacity: 1, y: 0 }"
      :exit="{ opacity: 0, y: -20 }"
      class="absolute top-16 right-4 w-[320px] max-w-[90%] bg-[#1E2A3A] border border-[#4A5568] rounded-lg shadow-lg overflow-hidden z-50 profile-dropdown-container"
    >
      <!-- 顶部身份信息区 -->
      <div class="px-6 py-4 border-b border-[#4A5568]">
        <div class="flex items-center space-x-4">
          <!-- 头像 -->
          <div class="w-16 h-16 rounded-full border-2 border-[#63B3ED] overflow-hidden shadow-md">
            <img 
              :src="avatarSrc"
              alt="User avatar"
              class="w-full h-full object-cover"
            />
          </div>
          
          <!-- 用户信息 -->
          <div class="flex-1">
            <h2 class="text-lg font-bold text-[#FFFFFF] mb-1">{{ username }}</h2>
            <p class="text-[#E2E8F0]/70 text-sm">风光/人像双题材创作者</p>
            
            <!-- 等级和进度条 -->
            <div class="mt-2">
              <div class="flex justify-between items-center mb-1">
                <span class="text-[#63B3ED] text-xs">{{ level }} LV.{{ levelNum }}</span>
                <span class="text-[#63B3ED] text-xs">{{ progress }}/{{ progressMax }}成长值</span>
              </div>
              <div class="w-full h-1.5 bg-[#4A5568] rounded-full overflow-hidden">
                <div 
                  class="h-full bg-[#63B3ED]" 
                  :style="{ width: `${progressPercentage}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 会员标识 -->
        <div class="mt-4 bg-[#2B3445] text-[#FFFFFF] text-xs font-medium py-1.5 px-3 rounded-full text-center border border-[#4A5568]">
          银河会员·年卡（剩余128天）
        </div>
      </div>
      
      <!-- 中间核心数据统计区 -->
      <div class="grid grid-cols-3 gap-1 px-4 py-3 bg-[#2B3445]">
        <div class="text-center">
          <p class="text-[#E2E8F0]/70 text-xs mb-1">作品</p>
          <p class="text-[#FFFFFF] font-bold text-lg">{{ stats.posts }}</p>
        </div>
        <div class="text-center">
          <p class="text-[#E2E8F0]/70 text-xs mb-1">获赞</p>
          <p class="text-[#FFFFFF] font-bold text-lg">{{ stats.likes }}</p>
        </div>
        <div class="text-center">
          <p class="text-[#E2E8F0]/70 text-xs mb-1">收藏</p>
          <p class="text-[#FFFFFF] font-bold text-lg">{{ stats.collections }}</p>
        </div>
      </div>
      
      <!-- 下方功能列表区 -->
      <div class="max-h-[300px] overflow-y-auto">
        <RouterLink 
          v-for="item in menuItems"
          :key="item.id"
          :to="getLink(item.id)"
          @click="onClose"
          class="flex items-center py-3 px-6 text-[#E2E8F0] hover:bg-[#2B3445] transition-colors"
        >
          <i :class="`fa-solid ${item.icon} mr-3 text-[#63B3ED]`"></i>
          <span>{{ item.text }}</span>
        </RouterLink>
      </div>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
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
  avatarSrc: string
}

const props = defineProps<Props>()

// 计算进度百分比
const progressPercentage = computed(() => {
  return (props.progress / props.progressMax) * 100
})

// 功能菜单数据
const menuItems: MenuItem[] = [
  { id: 'center', icon: 'fa-user', text: '个人中心', link: '/profile-center' },
  { id: 'works', icon: 'fa-camera', text: '我的作品集', link: '/profile-center/works' },
  { id: 'locations', icon: 'fa-map-marker-alt', text: '我的拍摄地点', link: '/profile-center/photo-locations' },
  { id: 'materials', icon: 'fa-microchip', text: '我的素材库', link: '/profile-center/materials' },
  { id: 'events', icon: 'fa-flag', text: '摄影活动', link: '/profile-center/events' },
  { id: 'tools', icon: 'fa-palette', text: '后期工具', link: '/profile-center/editor' },
  { id: 'membership', icon: 'fa-crown', text: '会员中心', link: '/profile-center/membership' },
  { id: 'orders', icon: 'fa-shopping-cart', text: '我的订单', link: '/profile-center/orders' },
  { id: 'benefits', icon: 'fa-award', text: '成长福利', link: '/profile-center/benefits' },
  { id: 'settings', icon: 'fa-cog', text: '设置', link: '/profile-center/settings' },
]

// 获取链接地址
const getLink = (id: string) => {
  const linkMap: Record<string, string> = {
    'works': '/profile-center/works',
    'locations': '/profile-center/photo-locations',
    'materials': '/profile-center/materials',
    'events': '/profile-center/events',
    'tools': '/profile-center/editor',
    'membership': '/profile-center/membership',
    'orders': '/profile-center/orders',
    'benefits': '/profile-center/benefits',
    'settings': '/profile-center/settings',
    'center': '/profile-center'
  }
  return linkMap[id] || '/profile-center'
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (props.isOpen && !target.closest('.profile-dropdown-container')) {
    props.onClose()
  }
}

onMounted(() => {
  if (props.isOpen) {
    document.addEventListener('mousedown', handleClickOutside)
  }
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
/* ProfileDropdown 组件样式 */
</style>