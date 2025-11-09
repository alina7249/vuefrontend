<template>
  <!-- 未登录状态 -->
  <div v-if="!isAuthenticated" class="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen">
    <div class="flex flex-col items-center justify-center h-[60vh] text-center">
      <div class="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
        <i class="fa-solid fa-user-lock text-2xl"></i>
      </div>
      <h2 class="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
      <p class="text-[#B8C6D8] mb-6 max-w-md">登录后查看您的个人作品集，管理和分享您的摄影作品</p>
      <router-link
        to="/login"
        class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
      >
        立即登录
      </router-link>
    </div>
  </div>

  <!-- 已登录状态 -->
  <div v-else class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div
      v-motion="{ initial: { opacity: 0, y: 20 }, enter: { opacity: 1, y: 0 }, transition: { duration: 0.5 } }"
    >
      <!-- 返回按钮 -->
      <div class="mb-6">
        <router-link
          to="/profile-center"
          class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
        >
          <i class="fa-solid fa-arrow-left"></i>
          <span>返回个人中心</span>
        </router-link>
      </div>

      <!-- 页面标题 -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">我的作品集</h1>
        <p class="text-[#B8C6D8] max-w-2xl mx-auto">
          管理和展示您的摄影作品，支持多种格式上传和版权管理
        </p>
      </div>

      <!-- 作品数据趋势图 -->
      <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
        <h2 class="text-xl font-bold text-[#B8C6D8] mb-4">作品数据趋势</h2>

        <!-- 图表区域 -->
        <div class="h-80">
          <!-- 使用CSS实现图表 -->
          <div class="relative h-full w-full">
            <!-- 网格背景 -->
            <div class="absolute inset-0 grid grid-cols-6 grid-rows-5 gap-0">
              <div v-for="i in 30" :key="i" class="border-t border-r border-[#4A5F8B]/20"></div>
            </div>
            
            <!-- 数据线容器 -->
            <div class="relative h-full w-full">
              <!-- 浏览量线 -->
              <svg class="absolute inset-0 w-full h-full">
                <path 
                  :d="generateLinePath(monthlyViewsData, 'views')"
                  fill="none" 
                  stroke="#4A5F8B" 
                  stroke-width="2"
                  class="transition-all duration-300"
                />
                <!-- 数据点 -->
                <circle 
                  v-for="(item, index) in monthlyViewsData" 
                  :key="index"
                  :cx="(index / (monthlyViewsData.length - 1)) * 100 + '%'"
                  :cy="100 - (item.views / 300) * 100 + '%'"
                  r="4"
                  fill="#4A5F8B"
                  stroke="#FFFFFF"
                  stroke-width="2"
                  class="transition-all duration-300 hover:r-6"
                />
              </svg>
              
              <!-- 点赞量线 -->
              <svg class="absolute inset-0 w-full h-full">
                <path 
                  :d="generateLinePath(monthlyViewsData, 'likes')"
                  fill="none" 
                  stroke="#6B7C93" 
                  stroke-width="2"
                  class="transition-all duration-300"
                />
                <!-- 数据点 -->
                <circle 
                  v-for="(item, index) in monthlyViewsData" 
                  :key="index"
                  :cx="(index / (monthlyViewsData.length - 1)) * 100 + '%'"
                  :cy="100 - (item.likes / 300) * 100 + '%'"
                  r="4"
                  fill="#6B7C93"
                  stroke="#FFFFFF"
                  stroke-width="2"
                  class="transition-all duration-300 hover:r-6"
                />
              </svg>
            </div>
            
            <!-- X轴标签 -->
            <div class="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-[#B8C6D8] px-2">
              <span v-for="item in monthlyViewsData.filter((_, i) => i % 5 === 0)" :key="item.date">
                {{ item.date }}
              </span>
            </div>
            
            <!-- Y轴标签 -->
            <div class="absolute top-0 bottom-0 left-0 flex flex-col justify-between text-xs text-[#B8C6D8] py-2">
              <span>300</span>
              <span>200</span>
              <span>100</span>
              <span>0</span>
            </div>
            
            <!-- 图例 -->
            <div class="absolute top-2 right-2 flex space-x-4 text-sm">
              <div class="flex items-center">
                <div class="w-3 h-0.5 bg-[#4A5F8B] mr-2"></div>
                <span class="text-[#B8C6D8]">浏览量</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-0.5 bg-[#6B7C93] mr-2"></div>
                <span class="text-[#B8C6D8]">点赞量</span>
              </div>
            </div>
            
            <!-- Tooltip模拟 -->
            <div 
              v-for="(item, index) in monthlyViewsData" 
              :key="index"
              class="absolute hidden group-hover:block bg-[#2D3748] border border-[#4A5F8B] rounded-lg p-3 text-xs text-[#B8C6D8] shadow-lg"
              :style="{ 
                left: `${(index / (monthlyViewsData.length - 1)) * 100}%`,
                bottom: `${(item.views / 300) * 100 + 5}%`,
                transform: 'translateX(-50%)'
              }"
            >
              <div class="font-medium">{{ item.workName }}</div>
              <div>浏览量: {{ item.views }}</div>
              <div>点赞量: {{ item.likes }}</div>
              <div>日期: {{ item.date }}</div>
            </div>
          </div>
        </div>

        <div class="mt-4 text-sm text-[#B8C6D8]">
          <p>提示：鼠标悬停在数据点上可查看对应作品详情</p>
        </div>
      </div>

      <!-- 搜索和筛选 -->
      <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div class="relative flex-1">
            <input
              type="text"
              placeholder="搜索作品标题或描述..."
              :value="searchTerm"
              @input="(e) => searchTerm = (e.target as HTMLInputElement).value"
              class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
            />
            <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
          </div>

          <div class="flex space-x-4">
            <select
              :value="visibilityFilter"
              @change="(e) => visibilityFilter = (e.target as HTMLSelectElement).value"
              class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option value="all">全部可见性</option>
              <option value="public">公开</option>
              <option value="friends">仅好友可见</option>
              <option value="private">私密</option>
            </select>

            <select
              :value="formatFilter"
              @change="(e) => formatFilter = (e.target as HTMLSelectElement).value"
              class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option value="all">全部格式</option>
              <option value="raw">RAW</option>
              <option value="jpg">JPG</option>
            </select>

            <select
              :value="sortBy"
              @change="(e) => sortBy = (e.target as HTMLSelectElement).value"
              class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option value="latest">最新发布</option>
              <option value="popular">最受欢迎</option>
              <option value="views">最多浏览</option>
            </select>
          </div>
        </div>

        <!-- 标签筛选 -->
        <div class="mt-4">
          <h4 class="text-sm font-medium text-[#B8C6D8] mb-2">按标签筛选</h4>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in allTags"
              :key="tag"
              @click="selectedTag = tag"
              :class="['px-3 py-1 rounded-full text-sm transition-colors', 
                selectedTag === tag
                  ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                  : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'
              ]"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>

      <!-- 添加新作品按钮 -->
      <div class="mb-8 text-center">
        <button
          @click="handleUpload"
          class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors inline-flex items-center"
        >
          <i class="fa-solid fa-plus mr-2"></i>
          添加新作品（支持RAW/JPG/视频）
        </button>
      </div>

      <!-- 作品列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="post in filteredPosts"
          :key="post.id"
          v-motion="{ initial: { opacity: 0, y: 20 }, enter: { opacity: 1, y: 0 }, transition: { duration: 0.5 } }"
          class="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm"
        >
          <!-- 作品图片 -->
          <div class="relative">
            <img
              :src="post.image"
              :alt="post.title"
              class="w-full h-48 object-cover"
            />
            <!-- 版权标签 -->
            <div :class="['absolute top-3 left-3 px-2 py-1 rounded text-xs', 
              post.copyrightType === '独家授权' 
                ? 'bg-[#4A5F8B] text-[#F5F7FA]' 
                : 'bg-[#6B7C93] text-[#F5F7FA]'
            ]">
              {{ post.copyrightType }}
            </div>
            <!-- 格式和可见性标签 -->
            <div class="absolute top-3 right-3 flex space-x-2">
              <span class="px-2 py-1 bg-[#2D3748]/80 text-[#B8C6D8] text-xs rounded">
                {{ post.format }}
              </span>
              <span class="px-2 py-1 bg-[#2D3748]/80 text-[#B8C6D8] text-xs rounded">
                {{ post.visibility }}
              </span>
            </div>
          </div>
          
          <!-- 作品信息 -->
          <div class="p-4">
            <!-- 标题和描述 -->
            <h3 class="text-base font-bold text-[#F5F7FA] mb-2">{{ post.title }}</h3>
            <p class="text-sm text-[#B8C6D8] mb-3 line-clamp-2">
              {{ post.description }}
            </p>
            
            <!-- 标签 -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="(tag, index) in post.tags"
                :key="index"
                class="px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] text-xs rounded"
              >
                #{{ tag }}
              </span>
            </div>
            
            <!-- 互动数据 -->
            <div class="flex items-center justify-between mb-4 text-sm text-[#B8C6D8]">
              <div class="flex items-center space-x-4">
                <span class="flex items-center">
                  <i class="fa-solid fa-heart mr-1"></i>
                  {{ post.likes }}
                </span>
                <span class="flex items-center">
                  <i class="fa-solid fa-comment mr-1"></i>
                  {{ post.comments }}
                </span>
                <span class="flex items-center">
                  <i class="fa-solid fa-eye mr-1"></i>
                  {{ post.views }}
                </span>
              </div>
              <span>{{ post.date }}</span>
            </div>
            
            <!-- 操作按钮 -->
            <div class="flex justify-between space-x-2">
              <router-link 
                :to="`/photo/${post.id}`"
                class="flex-1 py-2 text-center bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors text-sm border border-[#4A5F8B]"
              >
                查看详情
              </router-link>
              <button 
                @click="() => openEditModal(post.id)"
                class="px-3 py-2 text-center bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors text-sm border border-[#4A5F8B]"
              >
                <i class="fa-solid fa-edit"></i>
              </button>
              <button 
                @click="() => openDeleteModal(post.id)"
                class="px-3 py-2 text-center bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors text-sm border border-[#4A5F8B]"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
              <button 
                @click="() => openCopyrightModal(post.id)"
                class="px-3 py-2 text-center bg-gradient-to-r from-[#4A5F8B] to-[#2D3748] text-[#F5F7FA] rounded-lg font-medium hover:from-[#6B7C93] hover:to-[#4A5F8B] transition-colors text-sm border border-[#4A5F8B]"
              >
                <i class="fa-solid fa-copyright"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="filteredPosts.length === 0" class="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center mt-8">
        <div class="w-16 h-16 bg-[#1E2A3A] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
          <i class="fa-solid fa-image text-2xl"></i>
        </div>
        <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">暂无作品</h3>
        <p class="text-[#B8C6D8] mb-6">
          点击"添加新作品"开始上传和分享您的摄影作品
        </p>
        <button 
          @click="handleUpload"
          class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">
          <i class="fa-solid fa-plus mr-2"></i>
          添加新作品
        </button>
      </div>

      <!-- 分页按钮 -->
      <div v-if="filteredPosts.length > 0" class="flex justify-center mt-10">
        <nav class="flex items-center space-x-1 bg-[#2D3748] p-2 rounded-lg border border-[#4A5F8B]">
          <button class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
            <i class="fa-solid fa-chevron-left text-xs"></i>
          </button>
          <button class="px-3 py-2 rounded border border-[#4A5F8B] bg-[#4A5F8B] text-[#F5F7FA]">
            1
          </button>
          <button class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
            <i class="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated } = useAuth()

// 模拟用户作品数据
const mockUserPosts = [
  {
    id: '1',
    title: '晨曦中的山峦',
    description: '捕捉清晨第一缕阳光洒在山峦上的壮丽景色，使用长曝光展现云海的流动感。',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=morning%20sunrise%20mountain%20landscape%20mist%20china&sign=a50c8d6084b10f76978cc2afb1ca29a9',
    author: {
      id: 'user-123',
      name: '@光影捕手',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc',
    },
    likes: 324,
    comments: 45,
    tags: ['风光', '日出', '云海', '自然'],
    date: '2023-10-25',
    views: 1256,
    format: 'RAW',
    visibility: '公开',
    copyrightType: '独家授权',
    exif: {
      camera: '索尼 A7R IV',
      lens: 'FE 16-35mm F2.8 GM',
      aperture: 'f/8',
      shutter: '1/125s',
      iso: '100',
      focalLength: '24mm',
      whiteBalance: '自动',
      date: '2023-10-25 06:45:32'
    }
  },
  {
    id: '2',
    title: '城市剪影',
    description: '从高处俯瞰城市天际线，记录夕阳下城市建筑的剪影效果。',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=city%20skyline%20silhouette%20sunset%20urban%20architecture%20modern&sign=8de72287cf83cda70c057b89bfc1d186',
    author: {
      id: 'user-123',
      name: '@光影捕手',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc',
    },
    likes: 289,
    comments: 37,
    tags: ['城市', '建筑', '剪影', '夕阳'],
    date: '2023-10-22',
    views: 987,
    format: 'JPG',
    visibility: '公开',
    copyrightType: '非独家',
    exif: {
      camera: '佳能 EOS R6',
      lens: 'RF 24-70mm F2.8 L USM',
      aperture: 'f/5.6',
      shutter: '1/250s',
      iso: '200',
      focalLength: '70mm',
      whiteBalance: '日光',
      date: '2023-10-22 18:30:15'
    }
  },
  {
    id: '3',
    title: '海浪与礁石',
    description: '长时间曝光拍摄海浪拍打礁石的场景，展现水的丝绸质感。',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=ocean%20waves%20crashing%20on%20rocks%20long%20exposure%20seascape&sign=e3c4cd3840caaaedc19f43f96183a958',
    author: {
      id: 'user-123',
      name: '@光影捕手',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc',
    },
    likes: 412,
    comments: 53,
    tags: ['海景', '慢门', '自然', '礁石'],
    date: '2023-10-18',
    views: 1452,
    format: 'RAW',
    visibility: '仅好友可见',
    copyrightType: '独家授权',
    exif: {
      camera: '尼康 Z7 II',
      lens: 'NIKKOR Z 14-24mm f/2.8 S',
      aperture: 'f/16',
      shutter: '30s',
      iso: '64',
      focalLength: '14mm',
      whiteBalance: '自动',
      date: '2023-10-18 17:45:00'
    }
  },
  {
    id: '4',
    title: '森林晨雾',
    description: '在山间森林中捕捉晨雾弥漫的神秘氛围，阳光透过树叶形成丁达尔效应。',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=forest%20morning%20mist%20sunlight%20rays%20trees%20mystical&sign=0d866462637658cb7796789831e1cc68',
    author: {
      id: 'user-123',
      name: '@光影捕手',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc',
    },
    likes: 387,
    comments: 49,
    tags: ['森林', '晨雾', '丁达尔效应', '自然'],
    date: '2023-10-15',
    views: 1328,
    format: 'JPG',
    visibility: '公开',
    copyrightType: '非独家',
    exif: {
      camera: '富士 X-T4',
      lens: 'XF 16-80mm F4 R OIS WR',
      aperture: 'f/5.6',
      shutter: '1/60s',
      iso: '400',
      focalLength: '35mm',
      whiteBalance: '阴天',
      date: '2023-10-15 07:30:45'
    }
  },
  {
    id: '5',
    title: '湖畔日落',
    description: '平静的湖面倒映着绚丽的晚霞，形成对称的美感。',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=lake%20sunset%20reflection%20mountains%20evening%20colorful%20sky&sign=c039f18a4bf0746344422a50690ffb6c',
    author: {
      id: 'user-123',
      name: '@光影捕手',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc',
    },
    likes: 456,
    comments: 61,
    tags: ['湖泊', '日落', '倒影', '晚霞'],
    date: '2023-10-12',
    views: 1689,
    format: 'RAW',
    visibility: '公开',
    copyrightType: '独家授权',
    exif: {
      camera: '索尼 A7R V',
      lens: 'FE 24-70mm F2.8 GM II',
      aperture: 'f/11',
      shutter: '1/125s',
      iso: '100',
      focalLength: '40mm',
      whiteBalance: '日光',
      date: '2023-10-12 19:15:22'
    }
  },
  {
    id: '6',
    title: '星空下的古堡',
    description: '在远离城市光污染的地方，拍摄星空下的古堡遗迹，展现历史与自然的交融。',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=castle%20ruins%20under%20starry%20sky%20milky%20way%20night%20long%20exposure&sign=4f691b61d53a7e9b6b0869b95858dbb2',
    author: {
      id: 'user-123',
      name: '@光影捕手',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc',
    },
    likes: 523,
    comments: 78,
    tags: ['星空', '夜景', '古堡', '银河'],
    date: '2023-10-08',
    views: 1976,
    format: 'RAW',
    visibility: '私密',
    copyrightType: '独家授权',
    exif: {
      camera: '佳能 EOS R5',
      lens: 'RF 15-35mm F2.8 L IS USM',
      aperture: 'f/2.8',
      shutter: '25s',
      iso: '3200',
      focalLength: '15mm',
      whiteBalance: '自定义',
      date: '2023-10-08 22:10:30'
    }
  },
]

// 近30天作品浏览量和点赞量数据
const monthlyViewsData = [
  { date: '9/30', views: 120, likes: 20, workName: '晨曦中的山峦' },
  { date: '10/1', views: 150, likes: 25, workName: '城市剪影' },
  { date: '10/2', views: 80, likes: 15, workName: '海浪与礁石' },
  { date: '10/3', views: 200, likes: 35, workName: '森林晨雾' },
  { date: '10/4', views: 170, likes: 30, workName: '湖畔日落' },
  { date: '10/5', views: 250, likes: 45, workName: '星空下的古堡' },
  { date: '10/6', views: 220, likes: 40, workName: '晨曦中的山峦' },
  { date: '10/7', views: 180, likes: 32, workName: '城市剪影' },
  { date: '10/8', views: 190, likes: 36, workName: '海浪与礁石' },
  { date: '10/9', views: 230, likes: 42, workName: '森林晨雾' },
  { date: '10/10', views: 210, likes: 38, workName: '湖畔日落' },
  { date: '10/11', views: 260, likes: 48, workName: '星空下的古堡' },
  { date: '10/12', views: 170, likes: 30, workName: '晨曦中的山峦' },
  { date: '10/13', views: 190, likes: 34, workName: '城市剪影' },
  { date: '10/14', views: 200, likes: 36, workName: '海浪与礁石' },
  { date: '10/15', views: 240, likes: 44, workName: '森林晨雾' },
  { date: '10/16', views: 220, likes: 40, workName: '湖畔日落' },
  { date: '10/17', views: 270, likes: 50, workName: '星空下的古堡' },
  { date: '10/18', views: 180, likes: 32, workName: '晨曦中的山峦' },
  { date: '10/19', views: 210, likes: 38, workName: '城市剪影' },
  { date: '10/20', views: 190, likes: 35, workName: '海浪与礁石' },
  { date: '10/21', views: 230, likes: 42, workName: '森林晨雾' },
  { date: '10/22', views: 250, likes: 46, workName: '湖畔日落' },
  { date: '10/23', views: 280, likes: 52, workName: '星空下的古堡' },
  { date: '10/24', views: 200, likes: 36, workName: '晨曦中的山峦' },
  { date: '10/25', views: 220, likes: 40, workName: '城市剪影' },
  { date: '10/26', views: 210, likes: 38, workName: '海浪与礁石' },
  { date: '10/27', views: 250, likes: 46, workName: '森林晨雾' },
  { date: '10/28', views: 270, likes: 50, workName: '湖畔日落' },
  { date: '10/29', views: 300, likes: 56, workName: '星空下的古堡' },
]

// 响应式状态
const sortBy = ref('latest') // latest, popular, views
const selectedTag = ref('全部')
const searchTerm = ref('')
const visibilityFilter = ref('all') // all, public, friends, private
const formatFilter = ref('all') // all, raw, jpg

// 获取所有标签
const allTags = computed(() => {
  const tags = ['全部']
  mockUserPosts.forEach(post => {
    post.tags.forEach(tag => {
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    })
  })
  return tags
})

// 过滤和排序作品
const filteredPosts = computed(() => {
  let posts = [...mockUserPosts]
  
  // 按标签过滤
  if (selectedTag.value !== '全部') {
    posts = posts.filter(post => post.tags.includes(selectedTag.value))
  }
  
  // 按搜索词过滤
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    posts = posts.filter(post => 
      post.title.toLowerCase().includes(term) || 
      post.description.toLowerCase().includes(term) ||
      post.tags.some(tag => tag.toLowerCase().includes(term))
    )
  }
  
  // 按可见性过滤
  if (visibilityFilter.value !== 'all') {
    posts = posts.filter(post => {
      if (visibilityFilter.value === 'public') return post.visibility === '公开'
      if (visibilityFilter.value === 'friends') return post.visibility === '仅好友可见'
      if (visibilityFilter.value === 'private') return post.visibility === '私密'
      return true
    })
  }
  
  // 按格式过滤
  if (formatFilter.value !== 'all') {
    posts = posts.filter(post => {
      if (formatFilter.value === 'raw') return post.format === 'RAW'
      if (formatFilter.value === 'jpg') return post.format === 'JPG'
      return true
    })
  }
  
  // 排序
  if (sortBy.value === 'latest') {
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } else if (sortBy.value === 'popular') {
    posts.sort((a, b) => b.likes - a.likes)
  } else if (sortBy.value === 'views') {
    posts.sort((a, b) => b.views - a.views)
  }
  
  return posts
})

// 打开作品编辑模态框
const openEditModal = (postId: string) => {
  console.log('Edit post:', postId)
  // 这里可以实现打开编辑模态框的逻辑
}

// 打开删除确认模态框
const openDeleteModal = (postId: string) => {
  console.log('Delete post:', postId)
  // 这里可以实现打开删除确认模态框的逻辑
}

// 打开版权设置模态框
const openCopyrightModal = (postId: string) => {
  console.log('Set copyright for post:', postId)
  // 这里可以实现打开版权设置模态框的逻辑
}

// 处理作品上传
const handleUpload = () => {
  console.log('Upload new work')
  // 这里可以实现打开上传模态框的逻辑
}

// 生成SVG路径数据
const generateLinePath = (data: typeof monthlyViewsData, key: 'views' | 'likes') => {
  const maxValue = 300
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((item[key] / maxValue) * 100)
    return `${x},${y}`
  })
  return `M ${points.join(' L ')}`
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  overflow: hidden;
}

.star-texture {
  background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.1) 1px, transparent 0);
  background-size: 20px 20px;
}
</style>