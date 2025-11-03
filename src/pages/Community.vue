<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen">
    <motion.div
      :initial="{
        opacity: 0,
        y: 20,
      }"
      :animate="{
        opacity: 1,
        y: 0,
      }"
      :transition="{
        duration: 0.5,
      }"
    >
      <!--  页面标题  -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">
          摄影社区论坛
        </h1>
        <p class="text-[#B8C6D8] max-w-2xl mx-auto">
          加入我们的讨论，分享你的摄影经验，提问和回答问题，结交志同道合的摄影爱好者
        </p>
      </div>

      <!--  内容区域  -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!--  主要内容  -->
        <div class="lg:col-span-2 space-y-6">
          <!--  创建新话题按钮 - 使用浅蓝灰 #4A5F8B + 浅白 #F5F7FA  -->

          <template v-if="isAuthenticated">
            <motion.button
              :whileHover="{
                scale: 1.02,
              }"
              :whileTap="{
                scale: 0.98,
              }"
              class="w-full py-3 px-6 bg-[#4A5F8B] text-[#F5F7FA] font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <i class="fa-solid fa-plus"></i>
              <span>创建新话题</span>
            </motion.button>
          </template>
          <template v-else>
            <div class="p-4 bg-[#2D3748] rounded-lg border border-[#4A5F8B] flex items-center justify-center space-x-3">
              <i class="fa-solid fa-info-circle text-[#4A5F8B]"></i>
              <p class="text-[#B8C6D8] text-sm">
                登录后可以创建话题和参与讨论
              </p>
              <RouterLink to="/login" class="text-xs px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full transition-colors">
                立即登录
              </RouterLink>
            </div>
          </template>

          <!--  搜索和筛选  -->
          <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div class="relative flex-1">
              <input
                type="text"
                placeholder="搜索话题..."
                :value="state.searchTerm"
                @change="(e) => (state.searchTerm = (e.target as HTMLInputElement).value)"
                class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
              />
              <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
            </div>

            <select
              :value="state.selectedCategory"
              @change="(e) => (state.selectedCategory = (e.target as HTMLSelectElement).value)"
              class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option value="all">所有分类</option>

              <template v-for="category in forumCategories" :key="category.id">
                <option :value="category.id">{{ category.name }}</option>
              </template>
            </select>
          </div>

          <!--  话题列表卡片 - 使用底色深灰蓝 #2D3748，热帖标签浅蓝灰 #4A5F8B  -->
          <div class="bg-[#2D3748] rounded-xl overflow-hidden shadow-sm">
            <div
              class="p-4 border-b border-[#4A5F8B] flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <h2 class="text-lg font-bold text-[#F5F7FA] mb-2 sm:mb-0">论坛话题 ({{ filteredTopics.length }})</h2>
              <div class="flex space-x-2">
                <button class="px-3 py-1 text-xs font-medium text-[#F5F7FA] bg-[#4A5F8B] rounded-full">
                  最新
                </button>
                <button
                  class="px-3 py-1 text-xs font-medium text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] rounded-full transition-colors"
                >
                  热门
                </button>
                <button
                  class="px-3 py-1 text-xs font-medium text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] rounded-full transition-colors"
                >
                  精华
                </button>
              </div>
            </div>

            <div class="divide-y divide-[#4A5F8B]">
               <template v-for="topic in filteredTopics" :key="topic.id">
                  <motion.div
                    :whileHover="{
                    backgroundColor: '#1E2532',
                  }"
                  class="p-4 hover:shadow-[0_2px_8px_rgba(74,95,139,0.3)] transition-all cursor-pointer"
                >
                  <div class="flex items-start">
                    <!--  分类标签  -->
                    <div class="flex-shrink-0 mr-4">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]"
                      >
                        {{ topic.category }}
                      </span>
                    </div>

                    <!--  话题内容  -->
                    <div class="flex-1">
                      <h3
                        class="font-medium text-[#F5F7FA] hover:text-[#4A5F8B] transition-colors mb-1 flex items-center"
                      >
                        {{ topic.title }}

                        <template v-if="topic.isHot">
                          <span class="ml-2 text-xs px-1.5 py-0.5 bg-[#4A5F8B] text-[#F5F7FA] rounded">
                            热
                          </span>
                        </template>
                      </h3>

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
                  </div>
                </motion.div>
              </template>

              <template v-if="filteredTopics.length === 0">
                <div class="p-8 text-center">
                  <div
                    class="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4"
                  >
                    <i class="fa-solid fa-search text-2xl"></i>
                  </div>
                  <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">未找到相关话题</h3>
                  <p class="text-[#B8C6D8]">
                    请尝试使用其他关键词或浏览其他分类
                  </p>
                </div>
              </template>
            </div>

            <!--  分页  -->

            <template v-if="filteredTopics.length > 0">
              <div class="p-4 border-t border-[#4A5F8B] flex justify-center">
                <nav class="flex items-center space-x-1 bg-[#2D3748] p-1 rounded-lg">
                  <button
                    class="px-3 py-1 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                  >
                    <i class="fa-solid fa-chevron-left text-xs"></i>
                  </button>
                  <button class="px-3 py-1 rounded border border-[#4A5F8B] bg-[#4A5F8B] text-[#F5F7FA]">
                    1
                  </button>
                  <button
                    class="px-3 py-1 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                  >
                    2
                  </button>
                  <button
                    class="px-3 py-1 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                  >
                    3
                  </button>
                  <span class="px-2 text-[#B8C6D8]">...</span>
                  <button
                    class="px-3 py-1 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                  >
                    10
                  </button>
                  <button
                    class="px-3 py-1 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                  >
                    <i class="fa-solid fa-chevron-right text-xs"></i>
                  </button>
                </nav>
              </div>
            </template>
          </div>
        </div>

        <!--  侧边栏内容  -->
        <div class="space-y-6">
          <!--  社区活跃度图表 - 使用图表色块：浅蓝灰 #4A5F8B、#6B7C93 等蓝灰系；文字色浅冷灰 #B8C6D8  -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm">
            <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">社区活跃度</h3>
            <div class="h-60">
              <ResponsiveContainer :width="'100%'" :height="'100%'">
                <PieChart>
                  <Pie
                    :data="communityActivityData"
                    cx="50%"
                    cy="50%"
                    :innerRadius="60"
                    :outerRadius="80"
                    :paddingAngle="5"
                    dataKey="value"
                    :label="({ name, percent }: { name: string, percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`"
                  >
                    <template v-for="(entry, index) in communityActivityData" :key="`cell-${index}`">
                      <Cell :fill="COLORS[index % COLORS.length]" />
                    </template>
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            </div>

          <!--  论坛分类模块 - 使用底色深灰蓝 #2D3748，分类文字浅冷灰 #B8C6D8；右侧数字浅蓝灰 #6B7C93  -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm">
            <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">论坛分类</h3>
            <div class="space-y-3">
               <template v-for="category in forumCategories" :key="category.id">
                  <motion.div
                    :whileHover="{
                    x: 5,
                  }"
                  class="flex items-center justify-between p-2 hover:bg-[#1E2532] rounded-lg transition-colors"
                >
                  <div class="flex items-center">
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]"
                    >
                      <i :class="`fa-solid ${category.icon}`"></i>
                    </div>
                    <span class="font-medium text-[#B8C6D8]">{{ category.name }}</span>
                  </div>
                  <span class="text-sm text-[#6B7C93]">{{ category.count }}</span>
                </motion.div>
              </template>
            </div>
          </div>

          <!--  热门标签模块 - 同作品库热门风格标签  -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm">
            <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">热门标签</h3>
            <div class="flex flex-wrap gap-2">
               <template v-for="tag in trendingTags" :key="tag.id">
                  <span
                    class="px-3 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full text-sm hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors cursor-pointer border border-[#4A5F8B]"
                >
                  #{{ tag.name }} ({{ tag.count }})
                </span>
              </template>
            </div>
          </div>

          <!--  论坛规则模块 - 使用底色深灰蓝 #2D3748，规则文字浅冷灰 #B8C6D8  -->
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
    </motion.div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { RouterLink } from 'vue-router';
  import { motion } from 'framer-motion';
  import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
  const forumTopics = [
    {
      id: '1',
      title: '如何提高人像摄影的光线控制技巧？',
      author: {
        id: '1',
        name: '人像摄影师',
        avatar:
          'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male%20portrait&sign=27af74b48db72cd2f24d34eeb61cb3f3',
      },
      category: '摄影技巧',
      replies: 42,
      views: 356,
      lastReply: '30分钟前',
      isHot: true,
    },
    {
      id: '2',
      title: '【器材讨论】索尼A7M4 vs 佳能R6II 怎么选？',
      author: {
        id: '2',
        name: '器材发烧友',
        avatar:
          'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male%20smiling&sign=2180d942fb37ae6d21ad7b23b2400e93',
      },
      category: '器材讨论',
      replies: 78,
      views: 1245,
      lastReply: '2小时前',
      isHot: true,
    },
    {
      id: '3',
      title: '分享我的后期修图工作流',
      author: {
        id: '3',
        name: '后期大师',
        avatar:
          'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20female%20glasses&sign=fdcb693d1ba7bf1f730425fa2c19e913',
      },
      category: '后期技巧',
      replies: 36,
      views: 876,
      lastReply: '5小时前',
      isHot: false,
    },
    {
      id: '4',
      title: '【约拍活动】周末人像外拍活动招募',
      author: {
        id: '4',
        name: '活动组织者',
        avatar:
          'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=event%20organizer%20avatar%20male&sign=08873292f21875c3156b2e79365f4b4c',
      },
      category: '约拍活动',
      replies: 24,
      views: 512,
      lastReply: '昨天',
      isHot: true,
    },
    {
      id: '5',
      title: '新手求助：推荐一款适合初学者的相机',
      author: {
        id: '5',
        name: '摄影新手',
        avatar:
          'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=young%20photographer%20avatar%20male&sign=aa905961a7695265d97987d8b5d94dec',
      },
      category: '新手问答',
      replies: 56,
      views: 943,
      lastReply: '昨天',
      isHot: false,
    },
    {
      id: '6',
      title: '【作品分享】我的城市夜景作品集',
      author: {
        id: '6',
        name: '城市摄影师',
        avatar:
          'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male%20urban&sign=8ea5856167ada098eaccdfddc303b6fd',
      },
      category: '作品分享',
      replies: 32,
      views: 678,
      lastReply: '3天前',
      isHot: false,
    },
  ];
  const forumCategories = [
    { id: '1', name: '摄影技巧', count: 1254, icon: 'fa-camera' },
    { id: '2', name: '器材讨论', count: 876, icon: 'fa-video' },
    { id: '3', name: '后期技巧', count: 654, icon: 'fa-magic' },
    { id: '4', name: '作品分享', count: 987, icon: 'fa-image' },
    { id: '5', name: '约拍活动', count: 345, icon: 'fa-calendar-alt' },
    { id: '6', name: '新手问答', count: 765, icon: 'fa-question-circle' },
  ];
  const communityActivityData = [
    { name: '摄影技巧', value: 35 },
    { name: '器材讨论', value: 25 },
    { name: '后期技巧', value: 15 },
    { name: '作品分享', value: 20 },
    { name: '其他', value: 5 },
  ];
  const COLORS = ['#4A5F8B', '#6B7C93', '#8B9BB6', '#A8B5C9', '#B8C6D8'];
  const trendingTags = [
    { id: '1', name: '人像摄影', count: 1245 },
    { id: '2', name: '风景摄影', count: 987 },
    { id: '3', name: '后期修图', count: 756 },
    { id: '4', name: '索尼相机', count: 643 },
    { id: '5', name: '佳能相机', count: 521 },
    { id: '6', name: '尼康相机', count: 432 },
    { id: '7', name: '富士相机', count: 321 },
    { id: '8', name: '街头摄影', count: 289 },
  ];
  // 模拟认证状态
  const isAuthenticated = true;
  const state = reactive({
    selectedCategory: 'all',
    searchTerm: '',
  });
  // 过滤话题
  const filteredTopics = forumTopics.filter((topic) => {
    const matchesCategory = state.selectedCategory === 'all' || topic.category === state.selectedCategory;
    const matchesSearch = state.searchTerm === '' || topic.title.toLowerCase().includes(state.searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
</script>

<style scoped>
/* Community page styles */
</style>
