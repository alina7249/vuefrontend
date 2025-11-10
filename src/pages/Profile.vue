<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div
      v-motion
      :initial="{
        opacity: 0,
        y: 20,
      }"
      :enter="{
        opacity: 1,
        y: 0,
        transition: {
          duration: 500,
        },
      }"
    >
      <!-- 返回按钮 -->
      <div class="mb-6">
        <RouterLink
          to="/"
          class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
        >
          <i class="fa-solid fa-arrow-left"></i>
          <span>返回首页</span>
        </RouterLink>
      </div>

      <!-- 个人资料头部 -->
      <div class="bg-[#F5F7FA] rounded-xl overflow-hidden shadow-sm border border-[#B8C6D8] star-texture mb-8">
        <!-- 封面图 -->
        <div class="h-64 overflow-hidden">
          <img :src="profileUser.coverImage" alt="Cover" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/800x256/4A5F8B/FFFFFF?text=封面'" />
        </div>
        
        <!-- 用户信息 -->
        <div class="px-6 pb-6">
          <div class="flex flex-col md:flex-row -mt-20 mb-6">
            <!-- 头像 -->
            <div class="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <div class="w-40 h-40 rounded-full border-4 border-[#B8C6D8] overflow-hidden shadow-md">
                <img
                  :src="profileUser.avatar"
                  :alt="profileUser.username"
                  class="w-full h-full object-cover"
                  onerror="this.src='https://via.placeholder.com/160x160/4A5F8B/FFFFFF?text=头像'"
                />
              </div>
            </div>
            
            <!-- 用户信息和操作按钮 -->
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center">
                  <h1 class="text-2xl font-bold text-[#4A5059] mb-2">
                    {{ profileUser.username }}
                  </h1>
                  <div class="ml-3 flex flex-wrap gap-2">
                    <template v-for="badge in profileUser.badges" :key="badge">
                      <span class="px-2 py-0.5 text-xs bg-[#4A5F8B]/20 text-[#4A5F8B] rounded">
                        {{ badge }}
                      </span>
                    </template>
                  </div>
                </div>
                <p class="text-[#4A5059] mb-4">
                  {{ profileUser.bio }}
                </p>
                
                <!-- 用户基本信息 -->
                <div class="flex flex-wrap items-center space-x-4 text-sm text-[#4A5059]/70 mb-4">
                  <template v-if="profileUser.location">
                    <div class="flex items-center space-x-1">
                      <i class="fa-solid fa-map-marker-alt text-[#4A5F8B]"></i>
                      <span>{{ profileUser.location }}</span>
                    </div>
                  </template>
                  <template v-if="profileUser.website">
                    <div class="flex items-center space-x-1">
                      <i class="fa-solid fa-globe text-[#4A5F8B]"></i>
                      <a :href="profileUser.website" class="text-[#4A5F8B] hover:underline">
                        {{ getWebsiteHostname(profileUser.website) }}
                      </a>
                    </div>
                  </template>
                  <div class="flex items-center space-x-1">
                    <i class="fa-solid fa-calendar-plus text-[#4A5F8B]"></i>
                    <span>加入于 {{ new Date(profileUser.joinDate).toLocaleDateString('zh-CN') }}</span>
                  </div>
                </div>
              </div>
              
              <!-- 操作按钮 -->
              <div class="flex flex-wrap items-center gap-3">
                <template v-if="isOwnProfile">
                  <button
                    class="px-4 py-2 bg-[#E6EBF2] text-[#4A5059] border border-[#B8C6D8] rounded-lg font-medium hover:bg-[#B8C6D8] transition-colors"
                  >
                    <i class="fa-solid fa-pen-to-square mr-2 text-[#4A5F8B]"></i> 编辑资料
                  </button>
                  <button
                    class="px-4 py-2 bg-[#E6EBF2] text-[#4A5059] border border-[#B8C6D8] rounded-lg font-medium hover:bg-[#B8C6D8] transition-colors"
                  >
                    <i class="fa-solid fa-cog mr-2 text-[#4A5F8B]"></i> 设置
                  </button>
                </template>
                <template v-else>
                  <button
                    v-motion="{ hover: { scale: 1.05 }, tap: { scale: 0.95 } }"
                    @click="handleFollowToggle"
                    :class="`px-6 py-2 rounded-lg font-medium transition-colors ${
                      isFollowing
                        ? 'bg-[#E6EBF2] text-[#4A5059] border border-[#B8C6D8] hover:bg-[#B8C6D8]'
                        : 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#63B3ED]'
                    }`"
                  >
                    <template v-if="isFollowing">
                      <i class="fa-solid fa-check mr-2"></i> 已关注
                    </template>
                    <template v-else>
                      <i class="fa-solid fa-plus mr-2"></i> 关注
                    </template>
                  </button>
                  <button
                    class="px-4 py-2 bg-[#E6EBF2] text-[#4A5059] border border-[#B8C6D8] rounded-lg font-medium hover:bg-[#B8C6D8] transition-colors"
                  >
                    <i class="fa-solid fa-paper-plane mr-2 text-[#4A5F8B]"></i> 发消息
                  </button>
                </template>
              </div>
            </div>
          </div>
          
          <!-- 统计数据 -->
          <div class="flex flex-wrap border-t border-[#B8C6D8] pt-4">
            <template v-for="stat in mockUserStats" :key="stat.label">
              <div class="mr-8 mb-2">
                <div class="flex items-center space-x-1">
                  <span class="text-xl font-bold text-[#4A5059]">
                    {{ stat.value.toLocaleString() }}
                  </span>
                  <i :class="`fa-solid ${stat.icon} text-[#B8C6D8]`"></i>
                </div>
                <span class="text-sm text-[#4A5059]">{{ stat.name }}</span>
              </div>
            </template>
            <div class="mr-8 mb-2">
              <div class="flex items-center space-x-1">
                <span class="text-xl font-bold text-[#4A5059]">
                  {{ followerCount.toLocaleString() }}
                </span>
                <i class="fa-solid fa-users text-[#B8C6D8]"></i>
              </div>
              <span class="text-sm text-[#4A5059]">粉丝</span>
            </div>
            <div class="mb-2">
              <div class="flex items-center space-x-1">
                <span class="text-xl font-bold text-[#4A5059]">
                  {{ profileUser.following.toLocaleString() }}
                </span>
                <i class="fa-solid fa-user-plus text-[#B8C6D8]"></i>
              </div>
              <span class="text-sm text-[#4A5059]">关注</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据分析卡片 -->
      <div class="bg-[#F5F7FA] rounded-xl p-6 shadow-sm border border-[#B8C6D8] star-texture mb-8">
        <h2 class="text-xl font-bold text-[#4A5059] mb-4">创作数据</h2>
        <div class="h-64">
          <VChart :option="lineChartOption" autoresize />
        </div>
      </div>

      <!-- 内容标签页 -->
      <div class="bg-[#F5F7FA] rounded-xl shadow-sm border border-[#B8C6D8] mb-8">
        <div class="flex border-b border-[#B8C6D8]">
          <RouterLink
            :to="`/profile/${id}/posts`"
            :class="`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'posts'
                ? 'text-[#4A5059] border-b-2 border-[#4A5F8B]'
                : 'text-[#4A5059]/70 hover:text-[#4A5059]'
            }`"
          >
            作品 ({{ mockUserPosts.length }})
          </RouterLink>
          <RouterLink
            :to="`/profile/${id}/collections`"
            :class="`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'collections'
                ? 'text-[#4A5059] border-b-2 border-[#4A5F8B]'
                : 'text-[#4A5059]/70 hover:text-[#4A5059]'
            }`"
          >
            收藏 (256)
          </RouterLink>
          <RouterLink
            :to="`/profile/${id}/likes`"
            :class="`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'likes'
                ? 'text-[#4A5059] border-b-2 border-[#4A5F8B]'
                : 'text-[#4A5059]/70 hover:text-[#4A5059]'
            }`"
          >
            点赞 (1.2k)
          </RouterLink>
        </div>
        
        <!-- 内容区域 -->
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <template v-for="post in mockUserPosts" :key="post.id">
              <div
                v-motion="{
                  initial: { opacity: 0, y: 20 },
                  enter: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }"
              >
                <PhotographyCard :post="post" />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import PhotographyCard from '../components/PhotographyCard.vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent])

interface User {
  id: string
  username: string
  email: string
  avatar: string
  coverImage: string
  bio: string
  location: string
  website: string
  joinDate: string
  followers: number
  following: number
  posts: number
  isFollowing: boolean
  badges: string[]
  stats: {
    views: number
    likes: number
    collections: number
    comments: number
  }
}

interface Post {
  id: string
  title: string
  description: string
  image: string
  author: {
    id: string
    name: string
    avatar: string
  }
  likes: number
  comments: number
  tags: string[]
  date: string
}

interface Stat {
  name: string
  value: number
  icon: string
}

// 模拟用户数据 - 艺术风摄影平台
const mockUserData: User = {
  id: '1',
  username: '极简摄影师林风',
  email: 'minimal@example.com',
  avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c',
  coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=minimalist%20photography%20studio%20white%20background&sign=cff81e61f4a17365fb4c3e486aa4c4f4',
  bio: '专注极简主义和黑白摄影创作，通过简洁的构图和光影表达深刻的视觉语言。作品曾在多个国际摄影展中展出，现任教于北京电影学院摄影系。',
  location: '中国 上海',
  website: 'https://minimal-photo.com',
  joinDate: '2022-03-15',
  followers: 12543,
  following: 324,
  posts: 187,
  isFollowing: false,
  badges: ['新锐艺术家', '黑白影像达人', '极简主义先锋'],
  stats: {
    views: 158765,
    likes: 24356,
    collections: 8765,
    comments: 4321,
  },
}

// 模拟用户作品数据
const mockUserPosts: Post[] = [
  {
    id: '1',
    title: '黑白光影',
    description: '极简主义黑白摄影，通过光影对比展现建筑的几何美感。',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=black%20and%20white%20architecture%20geometric%20composition&sign=7f2b53dd226ab1ffb3f3eae704bada52',
    author: {
      id: '1',
      name: '极简摄影师林风',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c',
    },
    likes: 2435,
    comments: 132,
    tags: ['极简主义', '黑白', '建筑', '徕卡'],
    date: '2023-10-25',
  },
  {
    id: '2',
    title: '几何构成',
    description: '探索城市中的几何元素，寻找秩序与平衡',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=urban%20geometry%20minimalist%20architecture%20lines&sign=565e12f068e1e4f27a2f54fbebfe7cef',
    author: {
      id: '1',
      name: '极简摄影师林风',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c',
    },
    likes: 1892,
    comments: 98,
    tags: ['几何', '城市', '极简', '构图'],
    date: '2023-10-20',
  },
  {
    id: '3',
    title: '线条韵律',
    description: '通过线条的重复与排列创造视觉韵律感',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=minimalist%20photography%20line%20pattern%20repetition&sign=0c7b3fa171e219e154dcaed955f7f497',
    author: {
      id: '1',
      name: '极简摄影师林风',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c',
    },
    likes: 2156,
    comments: 103,
    tags: ['线条', '重复', '极简', '韵律'],
    date: '2023-10-15',
  },
  {
    id: '4',
    title: '空间分割',
    description: '利用光线和阴影分割画面，创造层次感',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=minimalist%20photography%20light%20shadow%20space%20division&sign=a7b1409a8463a9c9a66cd7abf300d959',
    author: {
      id: '1',
      name: '极简摄影师林风',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c',
    },
    likes: 1789,
    comments: 87,
    tags: ['空间', '光影', '极简', '分割'],
    date: '2023-10-10',
  },
  {
    id: '5',
    title: '极简静物',
    description: '通过简洁的静物组合，探索形式与内容的关系',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=minimalist%20still%20life%20composition%20geometric%20shapes&sign=1b6d2b3ada7743e0b3f0446861066c49',
    author: {
      id: '1',
      name: '极简摄影师林风',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c',
    },
    likes: 3240,
    comments: 142,
    tags: ['静物', '极简', '几何', '形式'],
    date: '2023-10-05',
  },
  {
    id: '6',
    title: '色彩减法',
    description: '减少画面中的色彩元素，专注于构图和光影',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=minimalist%20photography%20limited%20color%20palette%20subtractive%20color&sign=c4f8fb4425e1436881a44e5cec524050',
    author: {
      id: '1',
      name: '极简摄影师林风',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c',
    },
    likes: 2987,
    comments: 115,
    tags: ['色彩', '减法', '极简', '视觉减法'],
    date: '2023-10-01',
  },
]

// 模拟用户统计数据
const mockUserStats = computed<Stat[]>(() => [
  { name: '作品', value: mockUserPosts.length, icon: 'fa-image' },
  { name: '获赞', value: mockUserPosts.reduce((sum, post) => sum + post.likes, 0), icon: 'fa-heart' },
  { name: '收藏', value: mockUserData.stats.collections, icon: 'fa-bookmark' },
  { name: '浏览', value: mockUserData.stats.views, icon: 'fa-eye' },
])

// 模拟数据分析图表数据
const chartData = [
  { month: 'Jan', views: 12000, likes: 1500, comments: 400 },
  { month: 'Feb', views: 15000, likes: 2100, comments: 520 },
  { month: 'Mar', views: 18000, likes: 2800, comments: 680 },
  { month: 'Apr', views: 16500, likes: 2400, comments: 610 },
  { month: 'May', views: 21000, likes: 3200, comments: 780 },
  { month: 'Jun', views: 25000, likes: 3800, comments: 920 },
  { month: 'Jul', views: 28000, likes: 4300, comments: 1100 },
  { month: 'Aug', views: 32000, likes: 4800, comments: 1320 },
]

// ECharts折线图配置
const lineChartOption = {
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '15%',
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#F5F7FA',
    borderColor: '#B8C6D8',
    textStyle: {
      color: '#4A5059'
    }
  },
  legend: {
    data: ['浏览', '获赞', '评论'],
    textStyle: {
      color: '#4A5059'
    }
  },
  xAxis: {
    type: 'category',
    data: chartData.map(item => item.month),
    axisLine: {
      lineStyle: {
        color: '#4A5059'
      }
    },
    axisLabel: {
      color: '#4A5059'
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#4A5059'
      }
    },
    axisLabel: {
      color: '#4A5059'
    },
    splitLine: {
      lineStyle: {
        color: '#B8C6D8',
        type: 'dashed'
      }
    }
  },
  series: [
    {
      name: '浏览',
      type: 'line',
      data: chartData.map(item => item.views),
      smooth: true,
      lineStyle: {
        color: '#4A5F8B',
        width: 2
      },
      itemStyle: {
        color: '#4A5F8B'
      }
    },
    {
      name: '获赞',
      type: 'line',
      data: chartData.map(item => item.likes),
      smooth: true,
      lineStyle: {
        color: '#B8C6D8',
        width: 2
      },
      itemStyle: {
        color: '#B8C6D8'
      }
    },
    {
      name: '评论',
      type: 'line',
      data: chartData.map(item => item.comments),
      smooth: true,
      lineStyle: {
        color: '#63B3ED',
        width: 2
      },
      itemStyle: {
        color: '#63B3ED'
      }
    }
  ]
}

const route = useRoute()
const auth = useAuth()

const id = route.params.id as string
const activeTab = ref('posts')
const isFollowing = ref(mockUserData.isFollowing)
const followerCount = ref(mockUserData.followers)

// 模拟获取用户数据
const profileUser = mockUserData

// 判断是否为当前用户的个人主页
const isOwnProfile = computed(() => 
  auth.isAuthenticated && (auth.user.value?.id === id || auth.user.value?.username === 'admin')
)

// 根据当前路由设置激活的标签页
onMounted(() => {
  const path = window.location.pathname
  if (path.includes(`/profile/${id}/collections`)) {
    activeTab.value = 'collections'
  } else if (path.includes(`/profile/${id}/likes`)) {
    activeTab.value = 'likes'
  } else {
    activeTab.value = 'posts'
  }
})

// 获取网站域名
const getWebsiteHostname = (url: string) => {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

// 处理关注/取消关注
const handleFollowToggle = () => {
  if (!auth.isAuthenticated) {
    // 如果未登录，可以提示用户登录
    return
  }
  
  isFollowing.value = !isFollowing.value
  followerCount.value = isFollowing.value ? followerCount.value - 1 : followerCount.value + 1
}
</script>

<style scoped>
.star-texture {
  background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0);
  background-size: 20px 20px;
}
</style>