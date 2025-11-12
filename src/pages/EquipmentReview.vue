<template>
  <div class="container mx-auto px-4 py-8 bg-[#F5F7FA] star-texture min-h-screen">
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5 }"
    >
      <!-- 页面标题 -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-[#4A5059] mb-2">专业测评</h1>
        <p class="text-[#4A5059]/80 max-w-2xl mx-auto">
          深入了解各类摄影器材的真实性能，专业编辑评测与用户实际使用体验分享
        </p>
      </div>

      <!-- 内容区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 主要内容 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 搜索和排序 -->
          <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div class="relative flex-1">
              <input
                type="text"
                placeholder="搜索测评内容、器材型号或作者..."
                :value="searchTerm"
                @input="(e) => searchTerm = (e.target as HTMLInputElement).value"
                class="w-full px-4 py-3 pl-12 bg-[#F5F7FA] border border-[#B8C6D8] text-[#4A5059] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
              />
              <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4A5059]/50"></i>
            </div>
            
            <select
              :value="sortBy"
              @change="(e) => sortBy = (e.target as HTMLSelectElement).value"
              class="px-4 py-3 bg-[#F5F7FA] border border-[#B8C6D8] text-[#4A5059] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option value="latest">最新发布</option>
              <option value="popular">最多阅读</option>
              <option value="rating">最高评分</option>
            </select>
          </div>

          <!-- 测评分类选项卡 -->
          <div class="bg-[#E6EBF2] rounded-xl shadow-sm border border-[#B8C6D8] overflow-hidden">
            <div class="flex">
              <button
                v-for="category in reviewCategories"
                :key="category.id"
                @click="activeCategory = category.id"
                :class="`px-6 py-4 font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'text-[#4A5059] border-b-2 border-[#4A5F8B]'
                    : 'text-[#4A5059]/70 hover:text-[#4A5059]'
                }`"
              >
                {{ category.name }} ({{ category.count }})
              </button>
            </div>
          </div>

          <!-- 测评列表 -->
          <div class="space-y-6">
            <motion.div
              v-for="review in filteredReviews"
              :key="review.id"
              :whileHover="{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }"
              class="bg-[#F5F7FA] rounded-xl overflow-hidden border border-[#B8C6D8] transition-all shadow-sm"
            >
              <!-- 测评图片 -->
              <div class="md:flex">
                <div class="md:w-1/3">
                  <img
                    :src="review.featuredImage"
                    :alt="review.title"
                    class="w-full h-48 md:h-full object-cover"
                  />
                </div>
                
                <!-- 测评内容 -->
                <div class="p-5 md:w-2/3">
                  <!-- 测评类型和日期 -->
                  <div class="flex items-center justify-between mb-3">
                    <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E6EBF2] text-[#4A5F8B] border border-[#B8C6D8]/30">
                      {{ review.type }}
                    </span>
                    <div class="text-xs text-[#4A5059]/70 flex items-center space-x-2">
                      <span>{{ review.date }}</span>
                      <span>•</span>
                      <span>{{ review.readTime }}</span>
                    </div>
                  </div>
                  
                  <!-- 标题和摘要 -->
                  <h3 class="text-lg font-bold text-[#4A5059] mb-2 hover:text-[#4A5F8B] transition-colors">
                    {{ review.title }}
                  </h3>
                  <p class="text-sm text-[#4A5059]/80 mb-4 line-clamp-2">
                    {{ review.excerpt }}
                  </p>
                  
                  <!-- 测评的器材 -->
                  <div class="flex items-center mb-4">
                    <img
                      :src="review.equipment.image"
                      :alt="review.equipment.name"
                      class="w-10 h-10 object-cover rounded border border-[#B8C6D8] mr-3"
                    />
                    <div>
                      <p class="text-sm font-medium text-[#4A5059]">{{ review.equipment.name }}</p>
                      <p class="text-xs text-[#4A5059]/70">{{ review.equipment.type }}</p>
                    </div>
                  </div>
                  
                  <!-- 标签 -->
                  <div class="flex flex-wrap gap-2 mb-4">
                    <button
                      v-for="(tag, index) in review.tags"
                      :key="index"
                      @click="toggleTag(tag)"
                      :class="`px-2 py-1 rounded-full text-xs ${
                        selectedTags.includes(tag)
                          ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                          : 'bg-[#E6EBF2] text-[#4A5059] border border-[#B8C6D8]/30'
                      } transition-colors`"
                    >
                      #{{ tag }}
                    </button>
                  </div>
                  
                  <!-- 作者和统计信息 -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <img
                        :src="review.author.avatar"
                        :alt="review.author.name"
                        class="w-8 h-8 rounded-full mr-2 object-cover border border-[#B8C6D8]/30"
                      />
                      <div>
                        <p class="text-sm font-medium text-[#4A5059]">{{ review.author.name }}</p>
                        <p class="text-xs text-[#4A5059]/70">{{ review.author.role }}</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-4 text-sm text-[#4A5059]/70">
                      <div class="flex items-center">
                        <i class="fa-solid fa-eye mr-1"></i>
                        <span>{{ review.views.toLocaleString() }}</span>
                      </div>
                      <div class="flex items-center">
                        <i class="fa-solid fa-heart mr-1"></i>
                        <span>{{ review.likes.toLocaleString() }}</span>
                      </div>
                      <div class="flex items-center">
                        <i class="fa-solid fa-comment mr-1"></i>
                        <span>{{ review.comments.toLocaleString() }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 性能摘要 -->
              <div class="px-5 py-4 bg-[#E6EBF2]/50 border-t border-[#B8C6D8]">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-sm font-medium text-[#4A5059]">性能评分</h4>
                  <div class="flex items-center">
                    <span class="text-lg font-bold text-[#4A5F8B]">{{ review.rating }}</span>
                    <span class="text-sm text-[#4A5059]/70 ml-1">/10</span>
                  </div>
                </div>
                
                <div class="flex flex-wrap gap-3">
                  <div 
                    v-for="[key, value] in Object.entries(review.performance || {}).slice(0, 4)" 
                    :key="key"
                    class="flex items-center"
                  >
                    <span class="text-xs text-[#4A5059] mr-1">{{ translateKey(key) }}:</span>
                    <div class="w-16 bg-[#B8C6D8]/30 rounded-full h-1.5 overflow-hidden">
                      <div
                        class="h-full bg-[#4A5F8B] rounded-full"
                        :style="{ width: `${(value as number) * 10}%` }"
                      ></div>
                    </div>
                    <span class="text-xs font-medium text-[#4A5059] ml-1">{{ value }}</span>
                  </div>
                </div>
              </div>
              
              <!-- 底部操作按钮 -->
              <div class="px-5 py-4 border-t border-[#B8C6D8] bg-[#E6EBF2]/20 flex items-center justify-between">
                <RouterLink
                  :to="`/review/${review.id}`"
                  class="px-4 py-2 bg-[#E6EBF2] text-[#4A5059] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#B8C6D8]"
                >
                  阅读全文
                </RouterLink>
                <div class="flex items-center space-x-3">
                  <button class="text-[#4A5059]/50 hover:text-[#4A5059] transition-colors">
                    <i class="fa-solid fa-bookmark"></i>
                  </button>
                  <button class="text-[#4A5059]/50 hover:text-[#4A5059] transition-colors">
                    <i class="fa-solid fa-share-alt"></i>
                  </button>
                  <RouterLink
                    :to="`/equipment/${review.equipment.id}`"
                    class="text-sm text-[#4A5F8B] hover:underline transition-colors"
                  >
                    查看器材详情
                  </RouterLink>
                </div>
              </div>
            </motion.div>
            
            <div v-if="filteredReviews.length === 0" class="p-8 bg-[#F5F7FA] rounded-xl border border-[#B8C6D8] text-center">
              <div class="w-16 h-16 bg-[#E6EBF2] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
                <i class="fa-solid fa-search text-2xl"></i>
              </div>
              <h3 class="text-lg font-medium text-[#4A5059] mb-2">未找到相关测评</h3>
              <p class="text-[#4A5059]/70">
                请尝试使用不同的关键词或筛选条件
              </p>
            </div>
          </div>
          
          <!-- 分页 -->
          <div v-if="filteredReviews.length > 0" class="flex justify-center">
            <nav class="flex items-center space-x-1 bg-[#E6EBF2] p-2 rounded-lg border border-[#B8C6D8]">
              <button class="px-3 py-2 rounded border border-[#B8C6D8] text-[#4A5059] hover:bg-[#F5F7FA] transition-colors">
                <i class="fa-solid fa-chevron-left text-xs"></i>
              </button>
              <button class="px-3 py-2 rounded border border-[#B8C6D8] bg-[#F5F7FA] text-[#4A5059]">
                1
              </button>
              <button class="px-3 py-2 rounded border border-[#B8C6D8] text-[#4A5059] hover:bg-[#F5F7FA] transition-colors">
                2
              </button>
              <span class="px-2 text-[#4A5059]/70">...</span>
              <button class="px-3 py-2 rounded border border-[#B8C6D8] text-[#4A5059] hover:bg-[#F5F7FA] transition-colors">
                5
              </button>
              <button class="px-3 py-2 rounded border border-[#B8C6D8] text-[#4A5059] hover:bg-[#F5F7FA] transition-colors">
                <i class="fa-solid fa-chevron-right text-xs"></i>
              </button>
            </nav>
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="lg:col-span-1 space-y-6">
          <!-- 测评标签筛选 -->
          <div class="bg-[#F5F7FA] rounded-xl p-6 shadow-sm border border-[#B8C6D8]">
            <h3 class="text-lg font-bold mb-4 text-[#4A5059]">筛选标签</h3>
            
            <!-- 器材类型 -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-[#4A5059] mb-3">器材类型</h4>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tag in equipmentTypeTags"
                  :key="tag"
                  @click="toggleTag(tag)"
                  :class="`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag)
                      ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                      : 'bg-[#E6EBF2] text-[#4A5059] border border-[#B8C6D8]/30'
                  } transition-colors`"
                >
                  {{ tag }}
                </button>
              </div>
            </div>
            
            <!-- 价格区间 -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-[#4A5059] mb-3">价格区间</h4>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tag in priceRangeTags"
                  :key="tag"
                  @click="toggleTag(tag)"
                  :class="`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag)
                      ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                      : 'bg-[#E6EBF2] text-[#4A5059] border border-[#B8C6D8]/30'
                  } transition-colors`"
                >
                  {{ tag }}
                </button>
              </div>
            </div>
            
            <!-- 使用场景 -->
            <div>
              <h4 class="text-sm font-medium text-[#4A5059] mb-3">使用场景</h4>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tag in usageScenarioTags"
                  :key="tag"
                  @click="toggleTag(tag)"
                  :class="`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag)
                      ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                      : 'bg-[#E6EBF2] text-[#4A5059] border border-[#B8C6D8]/30'
                  } transition-colors`"
                >
                  {{ tag }}
                </button>
              </div>
            </div>
            
            <!-- 清除筛选 -->
            <button
              v-if="selectedTags.length > 0"
              @click="selectedTags = []"
              class="mt-4 w-full py-2 text-center text-sm text-[#4A5059] hover:text-[#4A5F8B] transition-colors"
            >
              <i class="fa-solid fa-times mr-1"></i> 清除所有筛选
            </button>
          </div>
          
          <!-- 热门测评作者 -->
          <div class="bg-[#F5F7FA] rounded-xl p-6 shadow-sm border border-[#B8C6D8]">
            <h3 class="text-lg font-bold mb-4 text-[#4A5059]">热门测评作者</h3>
            <div class="space-y-4">
              <div 
                v-for="author in popularAuthors" 
                :key="author.id"
                class="flex items-center justify-between"
              >
                <div class="flex items-center space-x-3">
                  <img
                    :src="author.avatar"
                    :alt="author.name"
                    class="w-12 h-12 rounded-full object-cover border border-[#B8C6D8]"
                  />
                  <div>
                    <p class="font-medium text-[#4A5059]">{{ author.name }}</p>
                    <p class="text-xs text-[#4A5F8B]">{{ author.reviews }} 篇测评</p>
                  </div>
                </div>
                <button class="px-3 py-1 text-xs font-medium text-[#4A5059] border border-[#B8C6D8] rounded-full hover:bg-[#E6EBF2] transition-colors">
                  关注
                </button>
              </div>
            </div>
          </div>
          
          <!-- 最新器材动态 -->
          <div class="bg-[#F5F7FA] rounded-xl p-6 shadow-sm border border-[#B8C6D8]">
            <h3 class="text-lg font-bold mb-4 text-[#4A5059]">最新器材动态</h3>
            <div class="space-y-4">
              <motion.div
                v-for="news in latestNews"
                :key="news.id"
                :whileHover="{ x: 5 }"
                class="flex space-x-3 cursor-pointer"
              >
                <div class="w-24 h-16 flex-shrink-0">
                  <img
                    :src="news.image"
                    :alt="news.title"
                    class="w-full h-full object-cover rounded-lg border border-[#B8C6D8]"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-[#4A5059] hover:text-[#4A5F8B] transition-colors truncate">
                    {{ news.title }}
                  </h4>
                  <p class="text-xs text-[#4A5059]/70 mt-1">{{ news.date }}</p>
                </div>
              </motion.div>
            </div>
            <RouterLink
              to="#"
              class="mt-4 text-sm text-[#4A5F8B] hover:underline transition-colors flex items-center"
            >
              <span>查看更多动态</span>
              <i class="fa-solid fa-arrow-right text-xs ml-1"></i>
            </RouterLink>
          </div>
          
          <!-- 测评贡献者招募 -->
          <div class="bg-gradient-to-r from-[#4A5F8B] to-[#B8C6D8] rounded-xl p-6 shadow-sm text-white">
            <h3 class="text-lg font-bold mb-3">成为测评作者</h3>
            <p class="text-sm mb-4 text-white/90">
              如果你对摄影器材有深入研究，欢迎加入我们的测评团队，分享你的专业见解
            </p>
            <button class="w-full py-2 bg-white text-[#4A5F8B] font-medium rounded-lg hover:bg-[#E6EBF2] transition-colors">
              了解详情
            </button>
          </div>
        </div>
      </div>
      
      <!-- 用户提问区 -->
      <div class="mt-12 bg-[#2D3748] p-6 rounded-xl border border-[#4A5F8B]">
        <h2 class="text-2xl font-bold text-[#F5F7FA] mb-6">用户提问区</h2>
        
        <div class="mb-8">
          <h3 class="text-xl font-semibold text-[#F5F7FA] mb-4">提问器材</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div 
              v-for="equipment in popularEquipment" 
              :key="equipment.id"
              :class="[
                'p-4 rounded-lg border cursor-pointer transition-all',
                selectedEquipmentForQuestion === equipment.id 
                  ? 'bg-[#4A5F8B] border-[#4A5F8B] text-[#F5F7FA]'
                  : 'bg-[#2D3748] border-[#4A5F8B] text-[#B8C6D8] hover:border-[#4A5F8B]'
              ]"
              @click="selectedEquipmentForQuestion = equipment.id"
            >
              <div class="flex items-center justify-between">
                <span>{{ equipment.name }}</span>
                <i class="fa-solid fa-chevron-right"></i>
              </div>
            </div>
          </div>
          
          <div 
            v-if="selectedEquipmentForQuestion"
            class="bg-[#1E2532] p-5 rounded-lg border border-[#4A5F8B] mt-6"
          >
            <h4 class="text-lg font-medium text-[#F5F7FA] mb-4">
              提问关于: {{ getSelectedEquipmentName() }}
            </h4>
            
            <div class="mb-4">
              <label class="block text-[#B8C6D8] mb-2 text-sm">问题标题</label>
              <input 
                v-model="newQuestion.title"
                type="text" 
                placeholder="请输入问题标题" 
                class="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] rounded-lg text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]"
              >
            </div>
            
            <div class="mb-4">
              <label class="block text-[#B8C6D8] mb-2 text-sm">问题描述</label>
              <textarea 
                v-model="newQuestion.content"
                rows="3" 
                placeholder="详细描述您的问题..." 
                class="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] rounded-lg text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]"
              ></textarea>
            </div>
            
            <button 
              @click="submitQuestion"
              :disabled="!newQuestion.title.trim() || !newQuestion.content.trim()"
              class="px-6 py-2 bg-[#4A5F8B] hover:bg-[#3A4F7B] text-[#F5F7FA] rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              提交问题
            </button>
          </div>
        </div>
        
        <!-- 已提问列表 -->
        <div>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-[#F5F7FA]">热门问题</h3>
            <div class="relative">
              <input 
                v-model="questionSearchQuery"
                type="text" 
                placeholder="搜索问题..." 
                class="pl-10 pr-4 py-2 bg-[#2D3748] border border-[#4A5F8B] rounded-lg text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]"
              >
              <i class="fa-solid fa-search absolute left-3 top-2.5 text-[#4A5F8B]"></i>
            </div>
          </div>
          
          <div class="space-y-4">
            <div 
              v-for="question in filteredQuestions" 
              :key="question.id"
              class="bg-[#1E2532] p-5 rounded-lg border border-[#4A5F8B] hover:border-[#4A5F8B] transition-colors"
            >
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h4 class="text-lg font-medium text-[#F5F7FA]">{{ question.title }}</h4>
                  <span class="text-xs text-[#4A5F8B]">{{ question.equipmentName }}</span>
                </div>
                <div class="flex items-center text-[#4A5F8B]">
                  <span class="text-sm mr-4">{{ formatDate(question.createdAt) }}</span>
                  <div class="flex items-center">
                    <i class="fa-solid fa-comment-dots mr-1"></i>
                    <span>{{ question.answers.length }}</span>
                  </div>
                </div>
              </div>
              
              <p class="text-[#B8C6D8] text-sm mb-3 line-clamp-2">{{ question.content }}</p>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <img 
                    :src="question.userAvatar"
                    alt="User avatar" 
                    class="w-6 h-6 rounded-full mr-2"
                  >
                  <span class="text-sm text-[#F5F7FA]">{{ question.userName }}</span>
                </div>
                
                <button 
                  class="text-sm text-[#4A5F8B] hover:text-[#3A4F7B] flex items-center"
                >
                  查看详情 <i class="fa-solid fa-arrow-right ml-1"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div class="flex justify-center mt-8">
            <button class="px-6 py-2 border border-[#4A5F8B] text-[#F5F7FA] rounded-lg hover:bg-[#4A5F8B] transition-colors">
              查看更多问题
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { motion } from 'motion-v'
import { RouterLink } from 'vue-router'

interface Review {
  id: string
  title: string
  type: string
  author: {
    id: string
    name: string
    avatar: string
    role: string
    experience: string
  }
  equipment: {
    id: string
    name: string
    type: string
    image: string
  }
  date: string
  readTime: string
  views: number
  likes: number
  comments: number
  rating: number
  featuredImage: string
  tags: string[]
  excerpt: string
  pros: string[]
  cons: string[]
  performance?: Record<string, number>
}

// 模拟测评数据
const mockReviews: Review[] = [
  {
    id: 'r1',
    title: '索尼A7R V深度测评：高像素摄影的新标杆',
    type: '专业编辑测评',
    author: {
      id: '101',
      name: '器材专家张明',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20equipment%20expert%20male%20professional&sign=56fa5f34db1fbce04f76c7576c6ad020',
      role: '资深器材编辑',
      experience: '10年摄影器材评测经验'
    },
    equipment: {
      id: '1',
      name: 'Sony A7R V',
      type: '微单相机',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20a7rv%20mirrorless%20camera%20professional%20photography&sign=6b099a6dd31856f91c56e9cc8bcfe622'
    },
    date: '2023-10-25',
    readTime: '15分钟',
    views: 12543,
    likes: 2890,
    comments: 345,
    rating: 9.4,
    featuredImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=sony%20a7rv%20review%20professional%20test%20setup&sign=0f74a0352f70258c33141b5bd423cda9',
    tags: ['索尼', '全画幅', '高像素', '专业', '微单'],
    excerpt: '索尼A7R V作为一款高像素全画幅微单相机，带来了诸多技术革新。本文将从画质、对焦、视频、操控等多个维度进行深度测评，帮助您了解这款相机是否值得入手。',
    pros: ['出色的6100万像素画质', '革命性的自动对焦系统', '优秀的电池续航', '专业级视频功能'],
    cons: ['价格较高', '体积相对较大', '菜单系统复杂'],
    performance: {
      imageQuality: 9.8,
      autofocus: 9.9,
      video: 9.5,
      handling: 9.0,
      battery: 9.2,
      value: 8.7
    }
  },
  {
    id: 'r2',
    title: '佳能EOS R6 II用户实测：婚礼摄影的可靠选择',
    type: '用户实测分享',
    author: {
      id: '102',
      name: '婚礼摄影师李华',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=wedding%20photographer%20male%20creative&sign=82c2687369cb5518e618423326b5a47c',
      role: '职业婚礼摄影师',
      experience: '8年婚礼拍摄经验'
    },
    equipment: {
      id: '2',
      name: 'Canon EOS R6 II',
      type: '微单相机',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=canon%20eos%20r6%20ii%20mirrorless%20camera%20professional&sign=5c10cdaa6af6f617051ab2b5672a9a55'
    },
    date: '2023-10-20',
    readTime: '10分钟',
    views: 8765,
    likes: 1987,
    comments: 234,
    rating: 9.2,
    featuredImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=wedding%20photography%20canon%20camera%20real%20usage&sign=eef22ed73ef34e8fa8163b2953ee2828',
    tags: ['佳能', '婚礼摄影', '高速连拍', '微单', '弱光性能'],
    excerpt: '作为一名职业婚礼摄影师，我在过去的三个月里使用佳能EOS R6 II拍摄了20多场婚礼。本文将分享我的实际使用体验，包括对焦性能、高感表现、电池续航等关键指标。',
    pros: ['卓越的自动对焦系统', '优秀的弱光性能', '可靠的高速连拍', '良好的人体工学设计'],
    cons: ['4K 60p有裁剪', '菜单系统复杂', '价格略高'],
    performance: {
      imageQuality: 9.3,
      autofocus: 9.8,
      video: 9.2,
      handling: 9.5,
      battery: 9.0,
      value: 9.0
    }
  },
  {
    id: 'r3',
    title: '富士X-T5开箱体验：复古外观与现代性能的完美结合',
    type: '用户实测分享',
    author: {
      id: '103',
      name: '街头摄影师王强',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=street%20photographer%20male%20urban&sign=c49a759749c39b9f82ea2702f7f9adc6',
      role: '街拍摄影师',
      experience: '5年街头摄影经验'
    },
    equipment: {
      id: '3',
      name: 'Fujifilm X-T5',
      type: '微单相机',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=fujifilm%20x-t5%20mirrorless%20camera%20retro%20style&sign=cbc979cbc3abed815ce131f384076fa8'
    },
    date: '2023-10-15',
    readTime: '8分钟',
    views: 7654,
    likes: 1765,
    comments: 189,
    rating: 9.0,
    featuredImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=fujifilm%20x-t5%20unboxing%20retro%20design%20modern%20features&sign=0eb54e522fb51913a6c810ff7bc07a4a',
    tags: ['富士', '复古', '街拍', 'APS-C', '高像素'],
    excerpt: '富士X-T5以其复古的外观设计和强大的性能吸引了众多摄影爱好者。本文将从开箱体验开始，详细介绍这款相机的外观、功能和实际拍摄表现。',
    pros: ['复古优雅的外观设计', '4020万像素高分辨率', '优秀的色彩科学', '轻巧便携的机身'],
    cons: ['APS-C画幅', '视频功能相对有限', '自动对焦追焦一般'],
    performance: {
      imageQuality: 9.5,
      autofocus: 9.0,
      video: 8.5,
      handling: 9.6,
      battery: 8.8,
      value: 8.9
    }
  },
  {
    id: 'r4',
    title: '索尼FE 24-70mm F2.8 GM II镜头深度测评',
    type: '专业编辑测评',
    author: {
      id: '104',
      name: '镜头专家刘芳',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20lens%20expert%20female%20professional&sign=c9dd2373388218683b3e980d22233258',
      role: '资深镜头评测师',
      experience: '12年摄影镜头评测经验'
    },
    equipment: {
      id: 'l1',
      name: 'Sony FE 24-70mm F2.8 GM II',
      type: '变焦镜头',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20fe%2024-70mm%20f2.8%20gm%20ii%20lens%20professional&sign=cf947b7d5153c26105db97fef95b85ef'
    },
    date: '2023-10-10',
    readTime: '12分钟',
    views: 9876,
    likes: 2345,
    comments: 278,
    rating: 9.6,
    featuredImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=sony%20fe%2024-70mm%20f2.8%20gm%20ii%20lens%20test%20chart&sign=bf971eeae817dba1e6f998b5430cfbb2',
    tags: ['索尼', '大三元', '标准变焦', '专业', '镜头'],
    excerpt: '作为索尼新一代大三元标准变焦镜头，FE 24-70mm F2.8 GM II带来了哪些提升？本文通过实验室测试和实际拍摄，全面解析这款镜头的光学性能。',
    pros: ['出色的锐度和解析力', '优秀的色散控制', '快速安静的自动对焦', '相对轻巧的体积'],
    cons: ['价格昂贵', '滤镜尺寸大', '全焦段F2.8稍重'],
    performance: {
      sharpness: 9.8,
      bokeh: 9.2,
      autofocus: 9.7,
      buildQuality: 9.5,
      handling: 9.0,
      value: 8.5
    }
  }
]

// 测评分类
const reviewCategories = [
  { id: 'all', name: '全部', count: mockReviews.length },
  { id: 'professional', name: '专业编辑测评', count: mockReviews.filter(r => r.type === '专业编辑测评').length },
  { id: 'user', name: '用户实测分享', count: mockReviews.filter(r => r.type === '用户实测分享').length }
]

// 器材类型标签
const equipmentTypeTags = ['相机', '镜头', '配件', '无人机', '三脚架', '滤镜', '闪光灯']

// 价格区间标签
const priceRangeTags = ['入门级 (0-5000元)', '进阶级 (5000-15000元)', '专业级 (15000元以上)']

// 使用场景标签
const usageScenarioTags = ['风光', '人像', '街头', '婚礼', '商业', '视频', '旅行']

// 热门作者
const popularAuthors = [
  {
    id: '101',
    name: '器材专家张明',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20equipment%20expert%20male%20professional&sign=56fa5f34db1fbce04f76c7576c6ad020',
    reviews: 48,
    followers: 12543,
    rating: 9.4
  },
  {
    id: '104',
    name: '镜头专家刘芳',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20lens%20expert%20female%20professional&sign=c9dd2373388218683b3e980d22233258',
    reviews: 36,
    followers: 9876,
    rating: 9.5
  },
  {
    id: '102',
    name: '婚礼摄影师李华',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=wedding%20photographer%20male%20creative&sign=82c2687369cb5518e618423326b5a47c',
    reviews: 24,
    followers: 7654,
    rating: 9.2
  }
]

// 最新动态
const latestNews = [
  {
    id: 'n1',
    title: '索尼发布全新FE 50mm F1.4 GM镜头',
    date: '2023-10-28',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20fe%2050mm%20f1.4%20gm%20new%20lens%20announcement&sign=065ec6ce07308a1967c2f98357dc845c'
  },
  {
    id: 'n2',
    title: '佳能EOS R5 Mark II规格曝光',
    date: '2023-10-25',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=canon%20eos%20r5%20mark%20ii%20rumor%20specs&sign=972fefe44dd95b251299ec0bd90375c9'
  },
  {
    id: 'n3',
    title: '富士X-S20固件更新提升视频性能',
    date: '2023-10-22',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=fujifilm%20x-s20%20firmware%20update%20improvement&sign=e3c3283ac365e9940fb2ef57f8ef0dfd'
  }
]

const activeCategory = ref('all')
const searchTerm = ref('')
const selectedTags = ref<string[]>([])
const sortBy = ref('latest')

// 过滤测评
const filteredReviews = computed(() => {
  let reviews = [...mockReviews]
  
  // 按分类过滤
  if (activeCategory.value === 'professional') {
    reviews = reviews.filter(review => review.type === '专业编辑测评')
  } else if (activeCategory.value === 'user') {
    reviews = reviews.filter(review => review.type === '用户实测分享')
  }
  
  // 按搜索词过滤
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    reviews = reviews.filter(review => 
      review.title.toLowerCase().includes(term) || 
      review.equipment.name.toLowerCase().includes(term) ||
      review.author.name.toLowerCase().includes(term)
    )
  }
  
  // 按标签过滤
  if (selectedTags.value.length > 0) {
    reviews = reviews.filter(review => 
      review.tags.some(tag => selectedTags.value.includes(tag))
    )
  }
  
  // 排序
  if (sortBy.value === 'latest') {
    reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } else if (sortBy.value === 'popular') {
    reviews.sort((a, b) => b.views - a.views)
  } else if (sortBy.value === 'rating') {
    reviews.sort((a, b) => b.rating - a.rating)
  }
  
  return reviews
})

// 切换标签
const toggleTag = (tag: string) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
  } else {
    selectedTags.value = [...selectedTags.value, tag]
  }
}

// 键名翻译
const translateKey = (key: string) => {
  const translations: Record<string, string> = {
    imageQuality: '画质',
    autofocus: '自动对焦',
    video: '视频',
    handling: '操控',
    battery: '电池',
    value: '性价比',
    sharpness: '锐度',
    bokeh: '虚化',
    buildQuality: '做工'
  }
  
  return translations[key] || key
}
</script>

<style scoped>
.star-texture {
  background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0);
  background-size: 20px 20px;
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