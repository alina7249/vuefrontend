<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen">
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5 }"
    >
      <!-- 页面标题 -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">
          摄影社区论坛
        </h1>
        <p class="text-[#B8C6D8] max-w-2xl mx-auto">
          加入我们的讨论，分享你的摄影经验，提问和回答问题，结交志同道合的摄影爱好者
        </p>
      </div>

      <!-- 草稿箱提示 -->
      <div v-if="isAuthenticated && savedDrafts.length > 0" class="mb-6 bg-[#2D3748]/80 border border-[#4A5F8B] rounded-lg p-4 flex items-center justify-between">
        <div class="flex items-center">
          <i class="fa-solid fa-file-lines text-[#4A5F8B] mr-3"></i>
          <p class="text-[#B8C6D8]">您有 <span class="text-[#4A5F8B] font-medium">{{ savedDrafts.length }}</span> 个未完成的话题草稿</p>
        </div>
        <button class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg text-sm hover:bg-[#6B7C93] transition-colors" @click="showDrafts = true">
          查看草稿
        </button>
      </div>

      <!-- 内容区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 主要内容 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 创建新话题按钮 - 使用浅蓝灰 #4A5F8B + 浅白 #F5F7FA -->
          <div v-if="isAuthenticated">
            <motion.button
              :whileHover="{ scale: 1.02 }"
              :whileTap="{ scale: 0.98 }"
              class="w-full py-3 px-6 bg-[#4A5F8B] text-[#F5F7FA] font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
              @click="showCreateTopicModal = true"
            >
              <i class="fa-solid fa-plus"></i>
              <span>创建新话题</span>
            </motion.button>
          </div>
          <div v-else class="p-4 bg-[#2D3748] rounded-lg border border-[#4A5F8B] flex items-center justify-center space-x-3">
            <i class="fa-solid fa-info-circle text-[#4A5F8B]"></i>
            <p class="text-[#B8C6D8] text-sm">
              登录后可以创建话题和参与讨论
            </p>
            <RouterLink
              to="/login"
              class="text-xs px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full transition-colors"
            >
              立即登录
            </RouterLink>
          </div>

          <!-- 搜索和筛选 -->
          <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div class="relative flex-1">
              <input
                type="text"
                placeholder="搜索话题..."
                :value="searchTerm"
                @input="handleSearchInput"
                class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
              />
              <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
            </div>
            
            <select
              :value="selectedCategory"
              @change="handleCategoryChange"
              class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option value="all">所有分类</option>
              <option v-for="category in forumCategories" :key="category.id" :value="category.name">
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <!-- 标签筛选 -->
          <div class="flex flex-wrap gap-2 pt-3">
            <button 
              v-for="tag in availableTags" 
              :key="tag.id"
              :class="['px-3 py-1 rounded-full text-xs transition-colors', 
                selectedTags.includes(tag.name) 
                  ? 'bg-[#4A5F8B] text-[#F5F7FA] border border-[#4A5F8B]'
                  : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:bg-[#4A5F8B]/50'
              ]"
              @click="toggleTag(tag.name)"
            >
              #{{ tag.name }}
            </button>
            <button v-if="selectedTags.length > 0" 
              class="px-3 py-1 rounded-full text-xs bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:bg-[#4A5F8B]/50 transition-colors"
              @click="clearTags"
            >
              清除标签
            </button>
          </div>

          <!-- 话题列表卡片 - 使用底色深灰蓝 #2D3748，热帖标签浅蓝灰 #4A5F8B -->
          <div class="bg-[#2D3748] rounded-xl overflow-hidden shadow-sm">
            <div class="p-4 border-b border-[#4A5F8B] flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h2 class="text-lg font-bold text-[#F5F7FA] mb-2 sm:mb-0">
                论坛话题 ({{ filteredTopics.length }})
              </h2>
              <div class="flex space-x-2">
                <button 
                  class="px-3 py-1 text-xs font-medium rounded-full transition-colors"
                  :class="activeSort === 'latest' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'"
                  @click="setSortBy('latest')"
                >
                  最新
                </button>
                <button 
                  class="px-3 py-1 text-xs font-medium rounded-full transition-colors"
                  :class="activeSort === 'popular' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'"
                  @click="setSortBy('popular')"
                >
                  热门
                </button>
                <button 
                  class="px-3 py-1 text-xs font-medium rounded-full transition-colors"
                  :class="activeSort === 'featured' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'"
                  @click="setSortBy('featured')"
                >
                  精华
                </button>
              </div>
            </div>
            
            <div class="divide-y divide-[#4A5F8B]">
              <motion.div
                v-for="topic in filteredTopics"
                :key="topic.id"
                :whileHover="{ backgroundColor: '#1E2532' }"
                class="p-4 hover:shadow-[0_2px_8px_rgba(74,95,139,0.3)] transition-all cursor-pointer"
                @click="viewTopic(topic.id)"
              >
                <div class="flex items-start">
                  <!-- 分类标签 -->
                  <div class="flex-shrink-0 mr-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]">
                      {{ topic.category }}
                    </span>
                  </div>
                  
                  <!-- 话题内容 -->
                  <div class="flex-1">
                    <h3 class="font-medium text-[#F5F7FA] hover:text-[#4A5F8B] transition-colors mb-1 flex items-center">
                      {{ topic.title }}
                      <span v-if="topic.isHot" class="ml-2 text-xs px-1.5 py-0.5 bg-[#4A5F8B] text-[#F5F7FA] rounded">
                        热
                      </span>
                    </h3>
                    
                    <!-- 话题标签 -->
                    <div class="flex flex-wrap gap-1 mb-2">
                      <span 
                        v-for="tag in topic.tags" 
                        :key="tag"
                        class="px-2 py-0.5 bg-[#2D3748] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B]/50"
                      >
                        #{{ tag }}
                      </span>
                    </div>
                    
                    <div class="flex items-center text-sm text-[#B8C6D8]">
                      <div class="flex items-center mr-4">
                        <img
                          :src="topic.author.avatar"
                          :alt="topic.author.name"
                          class="w-5 h-5 rounded-full mr-1.5"
                        />
                        <span>{{ topic.author.name }}</span>
                      </div>
                      <div class="mr-4 flex items-center">
                        <i class="fa-solid fa-comment mr-1"></i>
                        <span>{{ topic.replies }}</span>
                      </div>
                      <div class="mr-4 flex items-center">
                        <i class="fa-solid fa-eye mr-1"></i>
                        <span>{{ topic.views }}</span>
                      </div>
                      <div class="flex items-center">
                        <i class="fa-solid fa-clock mr-1"></i>
                        <span>{{ topic.lastReply }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 操作按钮 -->
                  <div v-if="isAuthenticated" class="flex flex-col ml-4 space-y-2">
                    <button 
                      class="text-[#B8C6D8] hover:text-[#4A5F8B] transition-colors p-1"
                      :title="isFavorited(topic.id) ? '取消收藏' : '收藏话题'"
                      @click.stop="toggleFavorite(topic.id)"
                    >
                      <i :class="`fa-solid ${isFavorited(topic.id) ? 'fa-bookmark' : 'fa-bookmark-o'}`"></i>
                    </button>
                    <button 
                      class="text-[#B8C6D8] hover:text-[#4A5F8B] transition-colors p-1"
                      :title="isSubscribed(topic.id) ? '取消订阅' : '订阅话题'"
                      @click.stop="toggleSubscribe(topic.id)"
                    >
                      <i :class="`fa-solid ${isSubscribed(topic.id) ? 'fa-bell' : 'fa-bell-o'}`"></i>
                    </button>
                    <button 
                      class="text-[#B8C6D8] hover:text-[#4A5F8B] transition-colors p-1"
                      title="举报话题"
                      @click.stop="reportTopic(topic.id)"
                    >
                      <i class="fa-solid fa-flag"></i>
                    </button>
                  </div>
                </div>
              </motion.div>
              
              <div v-if="filteredTopics.length === 0" class="p-8 text-center">
                <div class="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
                  <i class="fa-solid fa-search text-2xl"></i>
                </div>
                <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">未找到相关话题</h3>
                <p class="text-[#B8C6D8]">
                  请尝试使用其他关键词或浏览其他分类
                </p>
              </div>
            </div>
            
            <!-- 分页 -->
            <div v-if="filteredTopics.length > 0" class="p-4 border-t border-[#4A5F8B] flex justify-center">
              <nav class="flex items-center space-x-1 bg-[#2D3748] p-1 rounded-lg">
                <button class="px-3 py-1 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                  <i class="fa-solid fa-chevron-left text-xs"></i>
                </button>
                <button class="px-3 py-1 rounded border border-[#4A5F8B] bg-[#4A5F8B] text-[#F5F7FA]">
                  1
                </button>
                <button class="px-3 py-1 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                  2
                </button>
                <button class="px-3 py-1 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                  3
                </button>
                <span class="px-2 text-[#B8C6D8]">...</span>
                <button class="px-3 py-1 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                  10
                </button>
                <button class="px-3 py-1 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                  <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
        
        <!-- 侧边栏内容 -->
        <div class="space-y-6">
          <!-- 热门话题榜单 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-[#F5F7FA]">热门话题榜单</h3>
              <select 
                v-model="trendingPeriod" 
                class="text-xs bg-[#2D3748] border border-[#4A5F8B] text-[#B8C6D8] rounded-md px-2 py-1"
              >
                <option value="week">本周</option>
                <option value="month">本月</option>
              </select>
            </div>
            <div class="space-y-3">
              <motion.div 
                v-for="(topic, index) in trendingTopics" 
                :key="topic.id"
                :whileHover="{ x: 5, backgroundColor: '#1E2532' }"
                class="flex items-start p-2 rounded-lg transition-colors cursor-pointer"
                @click="viewTopic(topic.id)"
              >
                <span class="w-5 h-5 rounded-full bg-[#4A5F8B] text-[#F5F7FA] text-xs flex items-center justify-center mr-3 flex-shrink-0">
                  {{ index + 1 }}
                </span>
                <div class="flex-1">
                  <h4 class="text-sm font-medium text-[#F5F7FA] line-clamp-1">{{ topic.title }}</h4>
                  <p class="text-xs text-[#B8C6D8] mt-1">{{ topic.replies }} 回复 · {{ topic.views }} 浏览</p>
                </div>
              </motion.div>
            </div>
          </div>

          <!-- 社区活跃度图表 - 使用图表色块：浅蓝灰 #4A5F8B、#6B7C93 等蓝灰系；文字色浅冷灰 #B8C6D8 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm">
            <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">社区活跃度</h3>
            <div class="h-60">
              <VChart 
                :option="pieChartOption" 
                class="w-full h-full"
                autoresize
              />
            </div>
          </div>

          <!-- 论坛分类模块 - 使用底色深灰蓝 #2D3748，分类文字浅冷灰 #B8C6D8；右侧数字浅蓝灰 #6B7C93 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm">
            <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">论坛分类</h3>
            <div class="space-y-3">
              <motion.div
                v-for="category in forumCategories"
                :key="category.id"
                :hover="{ x: 5 }"
                class="flex items-center justify-between p-2 hover:bg-[#1E2532] rounded-lg transition-colors"
              >
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]">
                    <i :class="`fa-solid ${category.icon}`"></i>
                  </div>
                  <span class="font-medium text-[#B8C6D8]">{{ category.name }}</span>
                </div>
                <span class="text-sm text-[#6B7C93]">{{ category.count }}</span>
              </motion.div>
            </div>
          </div>

          <!-- 热门标签模块 - 同作品库热门风格标签 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm">
            <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">热门标签</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in trendingTags"
                :key="tag.id"
                class="px-3 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full text-sm hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors cursor-pointer border border-[#4A5F8B]"
              >
                #{{ tag.name }} ({{ tag.count }})
              </span>
            </div>
          </div>

          <!-- 论坛规则模块 - 使用底色深灰蓝 #2D3748，规则文字浅冷灰 #B8C6D8 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm">
            <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">论坛规则</h3>
            <ul class="space-y-2 text-sm text-[#B8C6D8]">
              <li class="flex items-start">
                <i class="fa-solid fa-circle-exclamation text-[#4A5F8B] mt-0.5 mr-2"></i>
                <span>尊重他人，禁止发布侮辱、歧视或攻击性言论</span>
              </li>
              <li class="flex items-start">
                <i class="fa-solid fa-circle-exclamation text-[#4A5F8B] mt-0.5 mr-2"></i>
                <span>禁止发布广告、垃圾信息或无关内容</span>
              </li>
              <li class="flex items-start">
                <i class="fa-solid fa-circle-exclamation text-[#4A5F8B] mt-0.5 mr-2"></i>
                <span>禁止分享盗版软件、破解资源或侵犯版权的内容</span>
              </li>
              <li class="flex items-start">
                <i class="fa-solid fa-circle-exclamation text-[#4A5F8B] mt-0.5 mr-2"></i>
                <span>保持讨论主题相关，避免刷屏和无意义回复</span>
              </li>
            </ul>
            <a href="#" class="mt-4 inline-block text-sm text-[#4A5F8B] hover:text-[#6B7C93] transition-colors">
              查看完整论坛规则
            </a>
          </div>
        </div>
      </div>
      
      <!-- 创建话题模态框 -->
      <div v-if="showCreateTopicModal" class="fixed inset-0 bg-[#1E2532]/80 flex items-center justify-center z-50 p-4">
        <motion.div 
          :initial="{ opacity: 0, scale: 0.9 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.9 }"
          class="bg-[#2D3748] rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] overflow-auto"
        >
          <div class="p-6 border-b border-[#4A5F8B]">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-[#F5F7FA]">创建新话题</h2>
              <button class="text-[#B8C6D8] hover:text-[#F5F7FA]" @click="showCreateTopicModal = false">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
          </div>
          <div class="p-6">
            <div class="mb-4">
              <label class="block text-sm font-medium text-[#B8C6D8] mb-2">标题</label>
              <input 
                v-model="newTopic.title" 
                type="text" 
                class="w-full px-4 py-2 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]"
                placeholder="请输入话题标题"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-[#B8C6D8] mb-2">分类</label>
              <select 
                v-model="newTopic.category" 
                class="w-full px-4 py-2 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]"
              >
                <option v-for="category in forumCategories" :key="category.id" :value="category.name">{{ category.name }}</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-[#B8C6D8] mb-2">内容</label>
              <textarea 
                v-model="newTopic.content" 
                class="w-full px-4 py-2 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] h-40"
                placeholder="请输入话题内容"
              ></textarea>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-[#B8C6D8] mb-2">标签 (用逗号分隔)</label>
              <input 
                v-model="newTopic.tagsInput" 
                type="text" 
                class="w-full px-4 py-2 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]"
                placeholder="例如: 人像摄影, 后期技巧, 索尼相机"
              />
            </div>
          </div>
          <div class="p-6 border-t border-[#4A5F8B] flex justify-between">
            <button 
              class="px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#B8C6D8] rounded-lg hover:bg-[#4A5F8B]/20 transition-colors"
              @click="saveDraft"
            >
              保存草稿
            </button>
            <div class="flex space-x-3">
              <button 
                class="px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#B8C6D8] rounded-lg hover:bg-[#4A5F8B]/20 transition-colors"
                @click="showCreateTopicModal = false"
              >
                取消
              </button>
              <button 
                class="px-6 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg hover:bg-[#6B7C93] transition-colors"
                @click="submitTopic"
              >
                发布话题
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      
      <!-- 草稿箱模态框 -->
      <div v-if="showDrafts" class="fixed inset-0 bg-[#1E2532]/80 flex items-center justify-center z-50 p-4">
        <motion.div 
          :initial="{ opacity: 0, scale: 0.9 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.9 }"
          class="bg-[#2D3748] rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] overflow-auto"
        >
          <div class="p-6 border-b border-[#4A5F8B]">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-[#F5F7FA]">我的草稿箱</h2>
              <button class="text-[#B8C6D8] hover:text-[#F5F7FA]" @click="showDrafts = false">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
          </div>
          <div class="p-6">
            <div v-if="savedDrafts.length === 0" class="text-center py-8">
              <i class="fa-solid fa-file-lines text-[#4A5F8B] text-3xl mb-4"></i>
              <p class="text-[#B8C6D8]">暂无保存的草稿</p>
            </div>
            <div v-else class="space-y-4">
              <div 
                v-for="draft in savedDrafts" 
                :key="draft.id"
                class="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B]"
              >
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-[#F5F7FA]">{{ draft.title || '未命名话题' }}</h4>
                  <div class="flex space-x-2">
                    <button class="text-[#B8C6D8] hover:text-[#4A5F8B]" @click="editDraft(draft.id)">
                      <i class="fa-solid fa-edit"></i>
                    </button>
                    <button class="text-[#B8C6D8] hover:text-[#4A5F8B]" @click="deleteDraft(draft.id)">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
                <p class="text-sm text-[#B8C6D8] line-clamp-2">{{ draft.content || '无内容' }}</p>
                <p class="text-xs text-[#6B7C93] mt-2">保存时间: {{ draft.saveTime }}</p>
              </div>
            </div>
          </div>
          <div class="p-6 border-t border-[#4A5F8B]">
            <button 
              class="w-full py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg hover:bg-[#6B7C93] transition-colors"
              @click="showDrafts = false"
            >
              关闭
            </button>
          </div>
        </motion.div>
      </div>
      
      <!-- 举报模态框 -->
      <div v-if="showReportModal" class="fixed inset-0 bg-[#1E2532]/80 flex items-center justify-center z-50 p-4">
        <motion.div 
          :initial="{ opacity: 0, scale: 0.9 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.9 }"
          class="bg-[#2D3748] rounded-xl shadow-lg w-full max-w-md"
        >
          <div class="p-6 border-b border-[#4A5F8B]">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-[#F5F7FA]">举报话题</h2>
              <button class="text-[#B8C6D8] hover:text-[#F5F7FA]" @click="showReportModal = false">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
          </div>
          <div class="p-6">
            <p class="text-[#B8C6D8] mb-4">请选择举报原因：</p>
            <div class="space-y-3">
              <label 
                v-for="reason in reportReasons" 
                :key="reason.value"
                class="flex items-center p-3 bg-[#1E2532] rounded-lg border border-[#4A5F8B] cursor-pointer hover:border-[#4A5F8B] transition-colors"
              >
                <input 
                  type="radio" 
                  :value="reason.value" 
                  v-model="reportData.reason" 
                  class="mr-3 accent-[#4A5F8B]"
                />
                <span class="text-[#F5F7FA]">{{ reason.label }}</span>
              </label>
            </div>
            <div class="mt-4">
              <textarea 
                v-model="reportData.description" 
                class="w-full px-4 py-2 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] h-24"
                placeholder="请填写补充说明（选填）"
              ></textarea>
            </div>
          </div>
          <div class="p-6 border-t border-[#4A5F8B] flex justify-end space-x-3">
            <button 
              class="px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#B8C6D8] rounded-lg hover:bg-[#4A5F8B]/20 transition-colors"
              @click="showReportModal = false"
            >
              取消
            </button>
            <button 
              class="px-6 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg hover:bg-[#6B7C93] transition-colors"
              @click="submitReport"
            >
              提交举报
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { motion } from 'motion-v'
import { useAuth } from '@/composables/useAuth'
import toastAPI from '@/composables/useToast'
// 导入图表组件
import { use } from 'echarts/core'
import { PieChart as EchartsPieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'

// 注册必要的组件
use([EchartsPieChart, CanvasRenderer, TooltipComponent, LegendComponent])
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (type === 'success') {
    toastAPI.success(message)
  } else {
    toastAPI.error(message)
  }
}

// 模拟论坛话题数据
const forumTopics = [
  {
    id: '1',
    title: '如何提高人像摄影的光线控制技巧？',
    author: {
      id: '1',
      name: '人像摄影师',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male%20portrait&sign=27af74b48db72cd2f24d34eeb61cb3f3',
    },
    category: '摄影技巧',
    replies: 42,
    views: 356,
    lastReply: '30分钟前',
    isHot: true,
    tags: ['人像摄影', '光线控制', '技巧分享']
  },
  {
    id: '2',
    title: '【器材讨论】索尼A7M4 vs 佳能R6II 怎么选？',
    author: {
      id: '2',
      name: '器材发烧友',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male%20smiling&sign=2180d942fb37ae6d21ad7b23b2400e93',
    },
    category: '器材讨论',
    replies: 78,
    views: 1245,
    lastReply: '2小时前',
    isHot: true,
    tags: ['索尼', '佳能', '相机对比', '器材选择']
  },
  {
    id: '3',
    title: '分享我的后期修图工作流',
    author: {
      id: '3',
      name: '后期大师',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20female%20glasses&sign=fdcb693d1ba7bf1f730425fa2c19e913',
    },
    category: '后期技巧',
    replies: 36,
    views: 876,
    lastReply: '5小时前',
    isHot: false,
    tags: ['后期', '修图', '工作流', 'Lightroom']
  },
  {
    id: '4',
    title: '【约拍活动】周末人像外拍活动招募',
    author: {
      id: '4',
      name: '活动组织者',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=event%20organizer%20avatar%20male&sign=08873292f21875c3156b2e79365f4b4c',
    },
    category: '约拍活动',
    replies: 24,
    views: 512,
    lastReply: '昨天',
    isHot: true,
    tags: ['约拍', '活动', '人像', '外拍']
  },
  {
    id: '5',
    title: '新手求助：推荐一款适合初学者的相机',
    author: {
      id: '5',
      name: '摄影新手',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=young%20photographer%20avatar%20male&sign=aa905961a7695265d97987d8b5d94dec',
    },
    category: '新手问答',
    replies: 56,
    views: 943,
    lastReply: '昨天',
    isHot: false,
    tags: ['新手', '相机推荐', '入门', '器材选择']
  },
  {
    id: '6',
    title: '【作品分享】我的城市夜景作品集',
    author: {
      id: '6',
      name: '城市摄影师',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male%20urban&sign=8ea5856167ada098eaccdfddc303b6fd',
    },
    category: '作品分享',
    replies: 32,
    views: 678,
    lastReply: '3天前',
    isHot: false,
    tags: ['城市', '夜景', '作品分享', '风光']
  },
]

// 热门标签数据
const trendingTags = [
  { id: '1', name: '摄影技巧', count: 567 },
  { id: '2', name: '器材讨论', count: 432 },
  { id: '3', name: '后期处理', count: 389 },
  { id: '4', name: '风光摄影', count: 298 },
  { id: '5', name: '人像摄影', count: 267 },
  { id: '6', name: '城市夜景', count: 213 },
  { id: '7', name: '新手教程', count: 189 },
  { id: '8', name: '镜头推荐', count: 167 }
]

// 论坛分类数据
const forumCategories = [
  { id: '1', name: '摄影技巧', count: 1254, icon: 'fa-camera' },
  { id: '2', name: '器材讨论', count: 876, icon: 'fa-video' },
  { id: '3', name: '后期技巧', count: 654, icon: 'fa-magic' },
  { id: '4', name: '作品分享', count: 987, icon: 'fa-image' },
  { id: '5', name: '约拍活动', count: 345, icon: 'fa-calendar-alt' },
  { id: '6', name: '新手问答', count: 765, icon: 'fa-question-circle' },
]

// 社区活跃度数据（用于饼图）
const communityActivityData = [
  { name: '摄影技巧', value: 35 },
  { name: '器材讨论', value: 25 },
  { name: '后期技巧', value: 15 },
  { name: '作品分享', value: 20 },
  { name: '其他', value: 5 },
]

// 饼图颜色 - 使用设计规范中定义的蓝灰系颜色
const COLORS = ['#4A5F8B', '#6B7C93', '#8B9BB6', '#A8B5C9', '#B8C6D8']

// ECharts 饼图配置
const pieChartOption = {
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
    backgroundColor: 'rgba(45, 55, 72, 0.9)',
    borderColor: '#4A5F8B',
    textStyle: {
      color: '#F5F7FA'
    }
  },
  series: [
    {
      name: '社区活跃度',
      type: 'pie',
      radius: ['50%', '70%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#2D3748',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b} {d}%',
        color: '#B8C6D8'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '16',
          fontWeight: 'bold',
          color: '#F5F7FA'
        }
      },
      labelLine: {
        show: true,
        lineStyle: {
          color: '#4A5F8B'
        }
      },
      data: communityActivityData.map((item, index) => ({
        ...item,
        itemStyle: {
          color: COLORS[index % COLORS.length]
        }
      }))
    }
  ]
}

// 热门话题榜单数据
const trendingTopics = computed(() => {
  // 根据选择的周期获取不同的热门话题
  return forumTopics
    .sort((a, b) => b.views - a.views) // 按浏览量排序
    .slice(0, 5) // 取前5个
})

// 可用标签列表
const availableTags = [
  { id: '1', name: '人像摄影' },
  { id: '2', name: '风景摄影' },
  { id: '3', name: '后期修图' },
  { id: '4', name: '索尼相机' },
  { id: '5', name: '佳能相机' },
  { id: '6', name: '尼康相机' },
  { id: '7', name: '富士相机' },
  { id: '8', name: '街头摄影' },
  { id: '9', name: '夜景摄影' },
  { id: '10', name: '入门教程' },
  { id: '11', name: '约拍活动' },
  { id: '12', name: '器材推荐' },
]

const { isAuthenticated } = useAuth()
const selectedCategory = ref('all')
const searchTerm = ref('')
const selectedTags = ref<string[]>([])
const activeSort = ref('latest')
const trendingPeriod = ref('week')

// 用户数据
const favoritedTopics = ref<string[]>([])
const subscribedTopics = ref<string[]>([])
const savedDrafts = ref<any[]>([
  {
    id: '1',
    title: '我的构图技巧分享',
    content: '在这篇文章中，我想分享一些我多年来总结的构图技巧...',
    category: '摄影技巧',
    tags: ['构图', '技巧分享'],
    saveTime: '2024-01-15 14:30'
  }
])

// 模态框状态
const showCreateTopicModal = ref(false)
const showDrafts = ref(false)
const showReportModal = ref(false)
const reportedTopicId = ref('')

// 举报数据
const reportReasons = [
  { value: 'spam', label: '垃圾信息/广告' },
  { value: 'inappropriate', label: '不当内容' },
  { value: 'copyright', label: '侵犯版权' },
  { value: 'harassment', label: '骚扰/攻击' },
  { value: 'other', label: '其他原因' }
]
const reportData = reactive({
  reason: '',
  description: ''
})

// 新话题数据
const newTopic = reactive({
  title: '',
  content: '',
  category: '',
  tagsInput: '',
  tags: [] as string[]
})

// 处理搜索输入
const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchTerm.value = target.value
}

// 处理分类选择
const handleCategoryChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  selectedCategory.value = target.value
}

// 设置排序方式
const setSortBy = (sort: string) => {
  activeSort.value = sort
}

// 切换标签选择
const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

// 清除所有标签
const clearTags = () => {
  selectedTags.value = []
}

// 查看话题详情
const viewTopic = (topicId: string) => {
  // 这里应该跳转到话题详情页
  console.log('查看话题:', topicId)
  // router.push(`/community/topic/${topicId}`)
}

// 切换收藏状态
const toggleFavorite = (topicId: string) => {
  const index = favoritedTopics.value.indexOf(topicId)
  if (index > -1) {
    favoritedTopics.value.splice(index, 1)
    showToast('已取消收藏', 'success')
  } else {
    favoritedTopics.value.push(topicId)
    showToast('收藏成功', 'success')
  }
}

// 检查是否已收藏
const isFavorited = (topicId: string) => {
  return favoritedTopics.value.includes(topicId)
}

// 切换订阅状态
const toggleSubscribe = (topicId: string) => {
  const index = subscribedTopics.value.indexOf(topicId)
  if (index > -1) {
    subscribedTopics.value.splice(index, 1)
    showToast('已取消订阅', 'success')
  } else {
    subscribedTopics.value.push(topicId)
    showToast('订阅成功，有新回复时会通知您', 'success')
  }
}

// 检查是否已订阅
const isSubscribed = (topicId: string) => {
  return subscribedTopics.value.includes(topicId)
}

// 举报话题
const reportTopic = (topicId: string) => {
  reportedTopicId.value = topicId
  reportData.reason = ''
  reportData.description = ''
  showReportModal.value = true
}

// 提交举报
const submitReport = () => {
  if (!reportData.reason) {
    showToast('请选择举报原因', 'error')
    return
  }
  
  console.log('提交举报:', { topicId: reportedTopicId.value, ...reportData })
  showToast('举报已提交，我们会尽快处理', 'success')
  showReportModal.value = false
}

// 保存草稿
const saveDraft = () => {
  const tags = newTopic.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
  
  const draft = {
    id: Date.now().toString(),
    title: newTopic.title,
    content: newTopic.content,
    category: newTopic.category,
    tags: tags,
    saveTime: new Date().toLocaleString('zh-CN')
  }
  
  savedDrafts.value.push(draft)
  showToast('草稿保存成功', 'success')
}

// 编辑草稿
const editDraft = (draftId: string) => {
  const draft = savedDrafts.value.find(d => d.id === draftId)
  if (draft) {
    newTopic.title = draft.title
    newTopic.content = draft.content
    newTopic.category = draft.category
    newTopic.tagsInput = draft.tags.join(', ')
    showDrafts.value = false
    showCreateTopicModal.value = true
  }
}

// 删除草稿
const deleteDraft = (draftId: string) => {
  const index = savedDrafts.value.findIndex(d => d.id === draftId)
  if (index > -1) {
    savedDrafts.value.splice(index, 1)
    showToast('草稿已删除', 'success')
  }
}

// 提交新话题
const submitTopic = () => {
  if (!newTopic.title || !newTopic.content || !newTopic.category) {
    showToast('请填写完整信息', 'error')
    return
  }
  
  const tags = newTopic.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
  
  console.log('发布话题:', {
    ...newTopic,
    tags: tags
  })
  
  showToast('话题发布成功', 'success')
  showCreateTopicModal.value = false
  
  // 重置表单
  newTopic.title = ''
  newTopic.content = ''
  newTopic.category = ''
  newTopic.tagsInput = ''
}

// 过滤话题
const filteredTopics = computed(() => {
  let result = forumTopics.filter(topic => {
    const matchesCategory = selectedCategory.value === 'all' || topic.category === selectedCategory.value
    const matchesSearch = searchTerm.value === '' || topic.title.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesTags = selectedTags.value.length === 0 || 
      selectedTags.value.some(tag => topic.tags.includes(tag))
    return matchesCategory && matchesSearch && matchesTags
  })
  
  // 根据排序方式排序
  if (activeSort.value === 'popular') {
    result = result.sort((a, b) => b.views - a.views)
  } else if (activeSort.value === 'featured') {
    result = result.filter(topic => topic.isHot).concat(result.filter(topic => !topic.isHot))
  } else { // latest
    // 默认按最后回复时间排序（这里使用模拟数据）
    const timeOrder: Record<string, number> = {
      '30分钟前': 1,
      '2小时前': 2,
      '5小时前': 3,
      '昨天': 4,
      '3天前': 5
    }
    result = result.sort((a, b) => (timeOrder[a.lastReply] || 99) - (timeOrder[b.lastReply] || 99))
  }
  
  return result
})
</script>

<style scoped>
/* 样式已通过 Tailwind CSS 实现，无需额外 CSS */
</style>