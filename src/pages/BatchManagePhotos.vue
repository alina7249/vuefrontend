<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5 }"
    >
      <!-- 未登录状态 -->
      <div v-if="!isAuthenticated" class="flex flex-col items-center justify-center h-[60vh] text-center">
        <div class="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
          <i class="fa-solid fa-user-lock text-2xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
        <p class="text-[#B8C6D8] mb-6 max-w-md">登录后管理您的作品，支持批量操作</p>
        <RouterLink to="/login" class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">
          立即登录
        </RouterLink>
      </div>

      <!-- 已登录状态 -->
      <div v-else>
        <!-- 返回按钮 -->
        <div class="mb-6">
          <RouterLink
            to="/profile-center/works"
            class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
          >
            <i class="fa-solid fa-arrow-left"></i>
            <span>返回我的作品集</span>
          </RouterLink>
        </div>

        <!-- 页面标题 -->
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">批量管理作品</h1>
          <p class="text-[#B8C6D8] max-w-2xl mx-auto">
            批量删除、修改可见性、添加标签等操作，提高作品管理效率
          </p>
        </div>
        
        <!-- 批量操作栏 -->
        <div class="bg-[#2D3748] rounded-xl p-4 shadow-sm border border-[#4A5F8B] mb-8">
          <div class="flex flex-col md:flex-row gap-4 items-center md:items-end">
            <div class="flex items-center">
              <input
                type="checkbox"
                id="select-all"
                :checked="selectedPhotos.length > 0 && selectedPhotos.length === filteredPosts.length"
                @change="toggleSelectAll"
                class="w-4 h-4 bg-[#2D3748] border-[#4A5F8B] text-[#4A5F8B] rounded focus:ring-[#4A5F8B]"
              />
              <label for="select-all" class="ml-2 text-[#B8C6D8]">
                全选 ({{ selectedPhotos.length }}/{{ filteredPosts.length }})
              </label>
            </div>
            
            <div class="flex flex-wrap gap-2 flex-1 md:flex-initial">
              <button 
                @click="handleBatchDelete"
                :disabled="selectedPhotos.length === 0"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  selectedPhotos.length > 0 
                    ? 'bg-[#6B7C93] text-[#F5F7FA] hover:bg-[#F56565]' 
                    : 'bg-[#6B7C93]/50 text-[#B8C6D8] cursor-not-allowed'
                ]"
              >
                <i class="fa-solid fa-trash mr-2"></i>
                批量删除
              </button>
              
              <div class="relative">
                <button 
                  :disabled="selectedPhotos.length === 0"
                  :class="[
                    'px-4 py-2 rounded-lg font-medium transition-colors',
                    selectedPhotos.length > 0 
                      ? 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]' 
                      : 'bg-[#6B7C93]/50 text-[#B8C6D8] cursor-not-allowed'
                  ]"
                >
                  <i class="fa-solid fa-eye mr-2"></i>
                  批量修改可见性
                </button>
                <div class="absolute right-0 mt-1 w-48 bg-[#2D3748] rounded-lg shadow-lg border border-[#4A5F8B] z-10">
                  <button 
                    @click="() => handleBatchVisibility('公开')"
                    class="block w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                  >
                    设为公开
                  </button>
                  <button 
                    @click="() => handleBatchVisibility('仅好友可见')"
                    class="block w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                  >
                    设为仅好友可见
                  </button>
                  <button 
                    @click="() => handleBatchVisibility('私密')"
                    class="block w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                  >
                    设为私密
                  </button>
                </div>
              </div>
              
              <div class="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="输入标签..."
                  :value="tagToAdd"
                  @input="(e: InputEvent) => tagToAdd = (e.target as HTMLInputElement).value"
                  class="px-3 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8] text-sm"
                />
                <button 
                  @click="handleBatchAddTag"
                  :disabled="selectedPhotos.length === 0 || !tagToAdd.trim()"
                  :class="[
                    'px-4 py-2 rounded-lg font-medium transition-colors',
                    selectedPhotos.length > 0 && tagToAdd.trim()
                      ? 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]' 
                      : 'bg-[#6B7C93]/50 text-[#B8C6D8] cursor-not-allowed'
                  ]"
                >
                  <i class="fa-solid fa-tags mr-2"></i>
                  添加标签
                </button>
              </div>
            </div>
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
                @input="(e: InputEvent) => searchTerm = (e.target as HTMLInputElement).value"
                class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
              />
              <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
            </div>
            
            <div class="flex space-x-4">
              <select
                :value="visibilityFilter"
                @change="(e: Event) => visibilityFilter = (e.target as HTMLSelectElement).value"
                class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
              >
                <option value="all">全部可见性</option>
                <option value="public">公开</option>
                <option value="friends">仅好友可见</option>
                <option value="private">私密</option>
              </select>
              
              <select
                :value="formatFilter"
                @change="(e: Event) => formatFilter = (e.target as HTMLSelectElement).value"
                class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
              >
                <option value="all">全部格式</option>
                <option value="raw">RAW</option>
                <option value="jpg">JPG</option>
              </select>
              
              <select
                :value="sortBy"
                @change="(e: Event) => sortBy = (e.target as HTMLSelectElement).value"
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
                :class="[
                  'px-3 py-1 rounded-full text-sm transition-colors',
                  selectedTag === tag
                    ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                    : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]'
                ]"
              >
                {{ tag }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- 作品列表 -->
        <div class="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="bg-[#2D3748] border-b border-[#4A5F8B]">
                  <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] w-12">选择</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] w-40">预览</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8]">标题</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8]">日期</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8]">格式</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8]">可见性</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8]">标签</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8]">互动</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] w-24">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#4A5F8B]">
                <tr v-for="post in filteredPosts" :key="post.id" class="hover:bg-[#1E2532] transition-colors">
                  <td class="px-6 py-4">
                    <input
                      type="checkbox"
                      :checked="selectedPhotos.includes(post.id)"
                      @change="() => togglePhotoSelection(post.id)"
                      class="w-4 h-4 bg-[#2D3748] border-[#4A5F8B] text-[#4A5F8B] rounded focus:ring-[#4A5F8B]"
                    />
                  </td>
                  <td class="px-6 py-4">
                    <div class="w-20 h-20 rounded overflow-hidden">
                      <img
                        :src="post.image"
                        :alt="post.title"
                        class="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="font-medium text-[#F5F7FA]">{{ post.title }}</div>
                    <div class="text-xs text-[#B8C6D8] truncate max-w-xs mt-1">{{ post.description }}</div>
                  </td>
                  <td class="px-6 py-4 text-sm text-[#B8C6D8]">{{ post.date }}</td>
                  <td class="px-6 py-4">
                    <span :class="[
                      'px-2 py-1 rounded-full text-xs',
                      post.format === 'RAW' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'bg-[#6B7C93] text-[#F5F7FA]'
                    ]">
                      {{ post.format }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="[
                      'px-2 py-1 rounded-full text-xs',
                      post.visibility === '公开' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 
                      post.visibility === '仅好友可见' ? 'bg-[#6B7C93] text-[#F5F7FA]' : 'bg-[#B8C6D8] text-[#2D3748]'
                    ]">
                      {{ post.visibility }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex flex-wrap gap-1">
                      <span v-for="(tag, index) in post.tags" :key="index" class="px-2 py-0.5 bg-[#2D3748] text-[#B8C6D8] text-xs rounded-full border border-[#4A5F8B]">
                        {{ tag }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-[#B8C6D8]">
                    <div class="flex items-center space-x-4">
                      <span class="flex items-center">
                        <i class="fa-solid fa-heart mr-1 text-[#4A5F8B]"></i>
                        {{ post.likes }}
                      </span>
                      <span class="flex items-center">
                        <i class="fa-solid fa-comment mr-1 text-[#4A5F8B]"></i>
                        {{ post.comments }}
                      </span>
                      <span class="flex items-center">
                        <i class="fa-solid fa-eye mr-1 text-[#4A5F8B]"></i>
                        {{ post.views }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex space-x-2">
                      <RouterLink 
                        :to="`/photo/${post.id}`"
                        class="p-1.5 text-[#B8C6D8] hover:text-[#4A5F8B] transition-colors"
                        title="查看详情"
                      >
                        <i class="fa-solid fa-eye"></i>
                      </RouterLink>
                      <button 
                        class="p-1.5 text-[#B8C6D8] hover:text-[#4A5F8B] transition-colors"
                        title="编辑"
                      >
                        <i class="fa-solid fa-edit"></i>
                      </button>
                      <button 
                        class="p-1.5 text-[#B8C6D8] hover:text-[#F56565] transition-colors"
                        title="删除"
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- 空状态 -->
          <div v-if="filteredPosts.length === 0" class="p-12 text-center">
            <div class="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
              <i class="fa-solid fa-image text-2xl"></i>
            </div>
            <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">暂无作品</h3>
            <p class="text-[#B8C6D8] max-w-md mx-auto">
              您当前没有符合筛选条件的作品
            </p>
          </div>
          
          <!-- 分页 -->
          <div v-if="filteredPosts.length > 0" class="flex justify-center mt-8 pb-6">
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
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { motion } from 'motion-v'
import { useAuth } from '@/composables/useAuth'
import toast from '@/composables/useToast'

// 摄影作品类型定义
interface PhotographyPost {
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
  views: number
  format: 'RAW' | 'JPG'
  visibility: '公开' | '仅好友可见' | '私密'
  copyrightType: '独家授权' | '非独家'
}

const { isAuthenticated } = useAuth()

// 响应式状态
const selectedPhotos = ref<string[]>([])
const sortBy = ref('latest')
const selectedTag = ref('全部')
const searchTerm = ref('')
const visibilityFilter = ref('all')
const formatFilter = ref('all')
const tagToAdd = ref('')

// 模拟用户作品数据
const mockUserPosts: PhotographyPost[] = [
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
  },
  // ... 其他作品数据保持不变
]

// 计算属性：过滤和排序作品
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

// 计算属性：获取所有标签
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

// 切换选中状态
const togglePhotoSelection = (id: string) => {
  if (selectedPhotos.value.includes(id)) {
    selectedPhotos.value = selectedPhotos.value.filter(photoId => photoId !== id)
  } else {
    selectedPhotos.value = [...selectedPhotos.value, id]
  }
}

// 全选/取消全选
const toggleSelectAll = () => {
  if (selectedPhotos.value.length === filteredPosts.value.length) {
    selectedPhotos.value = []
  } else {
    selectedPhotos.value = filteredPosts.value.map(post => post.id)
  }
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedPhotos.value.length === 0) {
    toast.warning('请先选择要删除的作品')
    return
  }
  
  if (window.confirm(`确定要删除选中的 ${selectedPhotos.value.length} 个作品吗？此操作不可恢复。`)) {
    // 模拟删除操作
    toast.success(`成功删除 ${selectedPhotos.value.length} 个作品`)
    selectedPhotos.value = []
  }
}

// 批量设置可见性
const handleBatchVisibility = (visibility: '公开' | '仅好友可见' | '私密') => {
  if (selectedPhotos.value.length === 0) {
    toast.warning('请先选择要修改的作品')
    return
  }
  
  // 模拟更新操作
  toast.success(`成功将 ${selectedPhotos.value.length} 个作品设置为 ${visibility}`)
}

// 批量添加标签
const handleBatchAddTag = () => {
  if (selectedPhotos.value.length === 0) {
    toast.warning('请先选择要添加标签的作品')
    return
  }
  
  if (!tagToAdd.value.trim()) {
    toast.warning('请输入标签内容')
    return
  }
  
  // 模拟添加标签操作
  toast.success(`成功为 ${selectedPhotos.value.length} 个作品添加标签：${tagToAdd.value}`)
  tagToAdd.value = ''
}
</script>

<style scoped>
/* BatchManagePhotos 组件样式 */
</style>