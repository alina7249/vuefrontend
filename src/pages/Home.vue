<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture">
    <!-- 焦点区：全屏轮播 -->
    <div class="relative h-[60vh] overflow-hidden rounded-xl mb-12 bg-[#2D3748] border border-[#4A5F8B]">
      <div
        v-for="(slide, index) in sliderImages"
        :key="slide.id"
        v-motion="{ 
          initial: { opacity: 0 },
          animate: { 
            opacity: index === currentSlide ? 1 : 0,
          },
          transition: { 
            duration: 1,
            ease: 'easeInOut'
          }
        }"
        :class="`absolute inset-0 w-full h-full ${index === currentSlide ? 'z-10' : 'z-0'}`"
      >
        <img 
          :src="slide.image" 
          :alt="slide.title"
          class="w-full h-full object-cover"
        />
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1E2532]/80 to-transparent p-8 h-1/5 flex flex-col justify-end">
          <div class="flex items-center mb-2">
            <img 
              :src="slide.avatar" 
              :alt="slide.author"
              class="w-8 h-8 rounded-full mr-2 border-2 border-[#4A5F8B]"
            />
            <span class="text-[#F5F7FA] text-sm">专访 {{ slide.author }}</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-[#F5F7FA] mb-1">{{ slide.title }}</h2>
          <p class="text-[#B8C6D8]/70 mb-2">{{ slide.description }}</p>
          <button class="border-2 border-[#4A5F8B] bg-gradient-to-r from-[#4A5F8B] to-[#2D3748] text-[#F5F7FA] px-6 py-2 rounded-lg font-medium transition-colors self-start hover:from-[#6B7C93] hover:to-[#4A5F8B]">
            阅读详情
          </button>
        </div>
      </div>
      
      <!-- 轮播指示器 -->
      <div class="absolute bottom-4 right-4 z-20 flex space-x-2">
        <button
          v-for="(_, index) in sliderImages"
          :key="index"
          @click="setCurrentSlide(index)"
          :class="`w-3 h-3 rounded-full transition-all ${
            index === currentSlide ? 'bg-[#4A5F8B] w-8' : 'bg-[#6B7C93]/50'
          }`"
        />
      </div>
    </div>

    <!-- 核心入口区 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      <div
        v-for="entry in coreEntries"
        :key="entry.id"
        class="bg-[#2D3748] border border-[#4A5F8B] rounded-lg overflow-hidden cursor-pointer transition-all shadow-sm hover:-translate-y-1 hover:border-[#4A5F8B] hover:shadow-lg"
      >
        <div class="h-48 overflow-hidden">
          <img 
            :src="entry.image" 
            :alt="entry.title"
            class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div class="p-5">
          <h3 class="text-lg font-bold text-[#F5F7FA] mb-2">{{ entry.title }}</h3>
          <p class="text-sm text-[#B8C6D8]">{{ entry.description }}</p>
        </div>
      </div>
    </div>

    <!-- 灵感专栏 -->
    <div class="mb-12">
      <h2 class="text-2xl font-bold text-[#F5F7FA] mb-6">灵感专栏</h2>
      <div class="flex overflow-x-auto pb-4 scrollbar-hide space-x-6">
        <div
          v-for="item in inspirationItems"
          :key="item.id"
          class="flex-shrink-0 w-80 bg-[#2D3748] border border-[#4A5F8B] rounded-lg overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all"
        >
          <div class="h-48 overflow-hidden">
            <img 
              :src="item.image" 
              :alt="item.title"
              class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div class="p-4">
            <h3 class="text-lg font-bold text-[#F5F7FA] mb-2">{{ item.title }}</h3>
            <p class="text-sm text-[#B8C6D8] mb-3 line-clamp-2">{{ item.description }}</p>
            <div class="flex items-center text-sm text-[#4A5F8B]">
              <span>by {{ item.author }}</span>
              <i class="fa-solid fa-chevron-right ml-auto text-xs"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 主要内容 -->
      <div class="lg:col-span-2">
        <!-- 类别筛选 -->
        <div class="mb-8 overflow-x-auto pb-2">
          <div class="flex space-x-2 min-w-max">
            <button
              @click="setSelectedCategory('all')"
              :class="`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                  : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:border-[#4A5F8B]'
              }`"
            >
              全部
            </button>
            <button
              @click="setSelectedCategory('极简主义')"
              :class="`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === '极简主义'
                  ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                  : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:border-[#4A5F8B]'
              }`"
            >
              极简主义
            </button>
            <button
              @click="setSelectedCategory('黑白')"
              :class="`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === '黑白'
                  ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                  : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:border-[#4A5F8B]'
              }`"
            >
              黑白
            </button>
            <button
              @click="setSelectedCategory('胶片')"
              :class="`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === '胶片'
                  ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                  : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:border-[#4A5F8B]'
              }`"
            >
              胶片质感
            </button>
            <button
              @click="setSelectedCategory('暗调')"
              :class="`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === '暗调'
                  ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                  : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:border-[#4A5F8B]'
              }`"
            >
              暗调氛围
            </button>
          </div>
        </div>

        <!-- 摄影作品网格 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="post in filteredPosts"
            :key="post.id"
            v-motion="{
              initial: { opacity: 0, y: 20 },
              enter: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }"
          >
            <PhotographyCard :post="post" />
          </div>
        </div>

        <!-- 加载更多作品按钮 -->
        <div class="mt-10 text-center">
          <button
            class="px-8 py-3 bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:border-[#4A5F8B] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] rounded-lg font-medium transition-all hover:scale-105 active:scale-95"
          >
            加载更多作品
          </button>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="lg:col-span-1 space-y-8">
        <!-- 搜索框 -->
        <div class="relative">
          <input
            type="text"
            placeholder="搜索作品、摄影师或风格..."
            class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
          />
          <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
        </div>

        <!-- 热门标签 -->
        <div 
          v-motion="{ hover: { y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' } }"
          class="bg-[#2D3748] border border-[#4A5F8B] rounded-lg p-6 transition-all"
        >
          <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">热门风格</h3>
          <div class="flex flex-wrap gap-2">
            <RouterLink
              v-for="tag in popularTags"
              :key="tag.id"
              :to="`/search?tag=${tag.name}`"
              class="px-3 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full text-sm hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]"
            >
              #{{ tag.name }} ({{ tag.count }})
            </RouterLink>
          </div>
        </div>

        <!-- 推荐艺术家 -->
        <div 
          v-motion="{ hover: { y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' } }"
          class="bg-[#2D3748] border border-[#4A5F8B] rounded-lg p-6 transition-all"
        >
          <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">推荐艺术家</h3>
          <div class="space-y-4">
            <div v-for="photographer in featuredPhotographers" :key="photographer.id" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <img
                  :src="photographer.avatar"
                  :alt="photographer.name"
                  class="w-12 h-12 rounded-full object-cover border border-[#B8C6D8]"
                />
                <div>
                  <p class="font-medium text-[#F5F7FA]">{{ photographer.name }}</p>
                  <p class="text-xs text-[#4A5F8B]">{{ photographer.level }}</p>
                  <p class="text-sm text-[#B8C6D8]">
                    {{ photographer.followers.toLocaleString() }} 粉丝 · {{ photographer.posts }} 作品
                  </p>
                </div>
              </div>
              <button class="px-3 py-1 text-xs font-medium text-[#F5F7FA] bg-[#4A5F8B] hover:bg-[#3A4B6F] rounded-full transition-colors">
                关注
              </button>
            </div>
          </div>
        </div>

        <!-- 艺术专题 -->
        <div 
          v-motion="{ hover: { y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' } }"
          class="bg-[#2D3748] border border-[#4A5F8B] rounded-lg p-6 transition-all"
        >
          <h3 class="text-lg font-bold mb-3 text-[#F5F7FA]">黑白影像专题</h3>
          <p class="text-sm text-[#B8C6D8] mb-4">
            探索黑白摄影的艺术魅力，感受光影交织的视觉语言和情感表达
          </p>
          <img 
            src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=black%20and%20white%20photography%20exhibition%20minimalist&sign=2604dd032070909ae9c1f7445ad24156"
            alt="黑白影像专题" 
            class="w-full h-40 object-cover rounded-lg mb-4"
          />
          <button class="w-full py-2 bg-gradient-to-r from-[#4A5F8B] to-[#2D3748] text-[#F5F7FA] rounded-lg font-medium transition-colors border border-[#4A5F8B]">
            探索专题
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import PhotographyCard from '../components/PhotographyCard.vue';

// 模拟摄影作品数据 - 银河氛围摄影平台
const photographyPosts = [
  {
    id: '1',
    title: '黑白光影',
    description: 'Leica Q2 Monochrom | 光圈: f/2.8 | 快门: 1/125s | ISO: 800\n极简主义黑白摄影，通过光影对比展现建筑的几何美感。',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=black%20and%20white%20architecture%20geometric%20composition&sign=7f2b53dd226ab1ffb3f3eae704bada52',
    author: {
      id: '1',
      name: '极简摄影师林风',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c',
    },
    likes: 342,
    comments: 42,
    tags: ['极简主义', '黑白', '建筑', '徕卡'],
    date: '2023-10-25',
  },
  {
    id: '2',
    title: '胶片质感人像',
    description: 'Canon AE-1 + 50mm f/1.4 | 光圈: f/2.0 | 快门: 1/125s | ISO: 400\n使用复古胶片相机拍摄的人像作品，自然柔和的色调与颗粒感。',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=film%20photography%20portrait%20natural%20light%20soft%20colors&sign=c33fc387d9611cfbf5948eab73b3426b',
    author: {
      id: '2',
      name: '胶片摄影师安娜',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=film%20photographer%20female%20vintage%20style&sign=5ec915debce76b46483be485e236cee2',
    },
    likes: 412,
    comments: 56,
    tags: ['人像', '胶片', '复古', '自然光'],
    date: '2023-10-24',
  },
  {
    id: '3',
    title: '暗调氛围',
    description: 'Sony A7R IV + 35mm f/1.4 GM | 光圈: f/2.8 | 快门: 1/60s | ISO: 1600\n营造神秘而富有故事感的暗调氛围人像，强调光影层次与情绪表达。',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=moody%20portrait%20low%20key%20dramatic%20lighting&sign=667d5b0612922acbe1a4e0355faeb800',
    author: {
      id: '3',
      name: '情绪摄影师李明',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=moody%20photographer%20male%20creative&sign=b74f18a9e01693163824506fbbcc8c47',
    },
    likes: 389,
    comments: 49,
    tags: ['暗调', '氛围', '情绪', '人像'],
    date: '2023-10-23',
  },
  {
    id: '4',
    title: '极简静物',
    description: 'Fujifilm GFX 100S + 120mm f/4 Macro | 光圈: f/5.6 | 快门: 1/125s | ISO: 200\n通过简洁的构图和柔和的光线，展现日常物品的质感与美感。',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=minimalist%20still%20life%20composition%20natural%20light&sign=d50543b56e3575f63623ea5055f2f854',
    author: {
      id: '4',
      name: '静物摄影师王静',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=still%20life%20photographer%20female%20detail-oriented&sign=3bfd67c585c96ccf90c0560aadfc6c75',
    },
    likes: 276,
    comments: 32,
    tags: ['静物', '极简', '中画幅', '富士'],
    date: '2023-10-22',
  },
  {
    id: '5',
    title: '城市几何',
    description: 'iPhone 15 Pro + 原生相机 | 光圈: f/2.2 | 快门: 1/1000s | ISO: 25\n从独特视角发现城市中的几何美感，手机摄影也能创造艺术作品。',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=urban%20geometry%20city%20architecture%20minimalist%20composition&sign=b5c56f91ceaddbb80362822c8664e0ae',
    author: {
      id: '5',
      name: '手机摄影师张强',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=mobile%20photographer%20male%20urban%20explorer&sign=1eff3d26acd6475fd9c84ba0ee8e5d74',
    },
    likes: 321,
    comments: 41,
    tags: ['城市', '几何', '手机摄影', '极简'],
    date: '2023-10-21',
  },
  {
    id: '6',
    title: '黑白纪实',
    description: 'Canon EOS R6 + 24-70mm f/2.8 | 光圈: f/4 | 快门: 1/250s | ISO: 800\n用黑白影像记录城市中的人文瞬间，展现生活的真实与温度。',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=black%20and%20white%20street%20photography%20documentary%20moment&sign=d29476f80a3d538bddc7d6b20fcd017d',
    author: {
      id: '6',
      name: '纪实摄影师陈默',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=documentary%20photographer%20male%20street&sign=788a26eea5ce0ca5b0473146963afcf0',
    },
    likes: 398,
    comments: 52,
    tags: ['黑白', '纪实', '人文', '街头'],
    date: '2023-10-20',
  },
];

// 热门标签
const popularTags = [
  { id: 1, name: '极简主义', count: 1456 },
  { id: 2, name: '黑白', count: 1245 },
  { id: 3, name: '胶片质感', count: 987 },
  { id: 4, name: '暗调氛围', count: 765 },
  { id: 5, name: '建筑', count: 654 },
  { id: 6, name: '人像', count: 543 },
  { id: 7, name: '城市几何', count: 432 },
  { id: 8, name: '静物', count: 321 },
];

// 推荐摄影师
const featuredPhotographers = [
  {
    id: '101',
    name: '黑白影像达人',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=black%20and%20white%20photographer%20male%20serious&sign=7651d7d16421ab76c2b59b1bd71a39c2',
    followers: 12543,
    posts: 324,
    level: '新锐艺术家',
  },
  {
    id: '102',
    name: '胶片艺术师',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=film%20photographer%20female%20vintage&sign=1742134c6641907308d9b1410d65842c',
    followers: 8765,
    posts: 213,
    level: '资深摄影师',
  },
  {
    id: '103',
    name: '建筑几何控',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=architecture%20photographer%20male%20creative&sign=17c8985a6812f53b55a5f015db719ac3',
    followers: 6543,
    posts: 187,
    level: '创意摄影师',
  },
];

// 核心入口区数据
const coreEntries = [
  {
    id: '1',
    title: '艺术新作',
    description: '探索最新的艺术摄影作品，感受创作者的独特视角',
    icon: 'fa-images',
    link: '/new-artworks',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=contemporary%20art%20photography%20abstract%20composition&sign=3805149232bf973f6fefafdda0625e1c',
  },
  {
    id: '2',
    title: '黑白影像',
    description: '专注黑白摄影作品，欣赏光影、线条与质感的艺术表达',
    icon: 'fa-monochrome',
    link: '/black-white',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=black%20and%20white%20photography%20minimalist%20light%20shadow&sign=feb6a8c250dd990bde311e318624c6fc',
  },
  {
    id: '3',
    title: '商业案例',
    description: '浏览专业摄影师的商业摄影作品，获取创作灵感',
    icon: 'fa-briefcase',
    link: '/commercial',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=commercial%20photography%20product%20minimalist%20lighting&sign=d16a83dd10d81cdc1f75111914078131',
  },
];

// 灵感专栏数据
const inspirationItems = [
  {
    id: '1',
    title: '黑白摄影的光影艺术',
    author: '林风',
    description: '探索如何通过光影对比创造出富有情感和深度的黑白影像作品...',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=black%20and%20white%20photography%20tutorial%20light%20shadow&sign=581ada31389ae6719d75794988b72a4c',
  },
  {
    id: '2',
    title: '胶片摄影的复兴与现代应用',
    author: '安娜',
    description: '探讨胶片摄影在数字时代的独特魅力和应用场景，以及如何将传统技术融入现代创作...',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=film%20camera%20vintage%20photography%20process&sign=e4d693788f49256f00febe15b1f68df2',
  },
  {
    id: '3',
    title: '极简主义摄影的构图法则',
    author: '李明',
    description: '解析极简主义摄影的核心构图原则，帮助你创造简洁而有力的视觉表达...',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=minimalist%20photography%20composition%20rules&sign=fd587b41706f60a738a2464cc11304ac',
  },
  {
    id: '4',
    title: '暗房技术与现代数字暗房',
    author: '张强',
    description: '比较传统暗房技术与现代数字暗房的异同，以及如何在后期制作中保留胶片质感...',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=darkroom%20photography%20digital%20workflow&sign=c372da4647ca0d3c6ef6803314856aec',
  },
];

// 焦点区轮播图片
const sliderImages = [
  {
    id: '1',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=minimalist%20black%20and%20white%20photography%20architecture%20geometric&sign=6a132f48365a1faa666584d6144957fd',
    title: '极简黑白建筑摄影展',
    description: '探索建筑中的几何美感与光影艺术',
    author: '林风',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c',
  },
  {
    id: '2',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=film%20photography%20portrait%20vintage%20style%20natural%20light&sign=04b4b9f4517dc870e3dfeac483c020d4',
    title: '胶片摄影的永恒魅力',
    description: '专访胶片摄影师安娜，探讨传统摄影的现代意义',
    author: '安娜',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=film%20photographer%20female%20vintage%20style&sign=5ec915debce76b46483be485e236cee2',
  },
  {
    id: '3',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=moody%20dark%20portrait%20atmospheric%20lighting&sign=aa5713a64a57d8212d2c074cb9e608d2',
    title: '暗调摄影的情绪表达',
    description: '如何通过暗调摄影传达深沉的情感与故事',
    author: '李明',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=moody%20photographer%20male%20creative&sign=b74f18a9e01693163824506fbbcc8c47',
  },
];



const selectedCategory = ref('all');
const currentSlide = ref(0);
let timer: number | null = null;

// 过滤作品（根据类别）
const filteredPosts = computed(() => 
  selectedCategory.value === 'all' 
    ? photographyPosts 
    : photographyPosts.filter(post => post.tags.includes(selectedCategory.value))
);

// 设置当前轮播图
const setCurrentSlide = (index: number) => {
  currentSlide.value = index;
};

// 设置选中的类别
const setSelectedCategory = (category: string) => {
  selectedCategory.value = category;
};

// 轮播图自动切换
onMounted(() => {
  timer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % 3;
  }, 5000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  overflow: hidden;
}
</style>