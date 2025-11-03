<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
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
        <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">摄影赛事</h1>
        <p class="text-[#B8C6D8] max-w-2xl mx-auto">
          参与各类摄影比赛，展示你的才华，赢取丰厚奖金和专业认可
        </p>
      </div>

      <!--  内容区域  -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!--  主要内容  -->
        <div class="lg:col-span-2 space-y-6">
          <!--  搜索和排序  -->
          <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div class="relative flex-1">
              <input
                type="text"
                placeholder="搜索赛事、主题或关键词..."
                :value="searchTerm"
                @change="(e) => (state.searchTerm = e.target.value)"
                class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
              />
              <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
            </div>

            <select
              :value="sortBy"
              @change="(e) => (state.sortBy = e.target.value)"
              class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option value="deadline">按截止日期</option>
              <option value="popular">最受欢迎</option>
              <option value="newest">最新发布</option>
            </select>
          </div>

          <!--  赛事类型和状态选项卡  -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] overflow-hidden">
              <div class="p-3 border-b border-[#4A5F8B]">
                <h4 class="text-sm font-medium text-[#F5F7FA]">赛事类型</h4>
              </div>
              <div class="grid grid-cols-3 p-2">
                <template v-for="type in contestTypes" :key="">
                  <button
                    :key="type"
                    @click="() => (state.selectedType = type)"
                    :class="`py-2 px-1 text-center text-sm font-medium transition-colors ${
                      selectedType === type
                        ? 'bg-[#4A5F8B] text-[#F5F7FA] rounded-lg'
                        : 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B]/50'
                    }`"
                  >
                    {{ type }}
                  </button>
                </template>
              </div>
            </div>

            <div class="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] overflow-hidden">
              <div class="p-3 border-b border-[#4A5F8B]">
                <h4 class="text-sm font-medium text-[#F5F7FA]">赛事状态</h4>
              </div>
              <div class="grid grid-cols-3 p-2">
                <template v-for="status in contestStatuses" :key="">
                  <button
                    :key="status"
                    @click="() => (state.selectedStatus = status)"
                    :class="`py-2 px-1 text-center text-sm font-medium transition-colors ${
                      selectedStatus === status
                        ? 'bg-[#4A5F8B] text-[#F5F7FA] rounded-lg'
                        : 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B]/50'
                    }`"
                  >
                    {{ status }}
                  </button>
                </template>
              </div>
            </div>
          </div>

          <!--  赛事列表  -->
          <div class="space-y-6">
            <template v-for="contest in filteredContests" :key="">
              <motion.div
                :key="contest.id"
                :whileHover="{
                  y: -5,
                  boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)',
                }"
                class="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm"
              >
                <!--  赛事图片  -->
                <div class="md:flex">
                  <div class="md:w-1/3">
                    <img :src="contest.image" :alt="contest.title" class="w-full h-48 md:h-full object-cover" />
                  </div>

                  <!--  赛事信息  -->
                  <div class="p-5 md:w-2/3">
                    <!--  赛事类型和状态  -->
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm text-[#F5F7FA] font-medium">{{ contest.type }}</span>
                      <span
                        :class="`text-xs px-2 py-1 rounded-full ${
                          contest.status === '进行中'
                            ? 'bg-[#2D3748]/50 text-[#F5F7FA]'
                            : contest.status === '已截止'
                            ? 'bg-[#6B7C93] text-[#F5F7FA]'
                            : 'bg-[#2D3748]/50 text-[#F5F7FA]'
                        }`"
                      >
                        {{ contest.status }}
                      </span>
                    </div>

                    <!--  赛事标题和主办方  -->
                    <h3 class="text-lg font-bold text-[#F5F7FA] mb-2 hover:text-[#FFFFFF] transition-colors">
                      {{ contest.title }}
                    </h3>

                    <template v-if="contest.organizer">
                      <p class="text-xs text-[#F5F7FA]/80 mb-4">主办方：{{ contest.organizer }}</p>
                    </template>

                    <!--  赛事基本信息  -->
                    <div class="space-y-1 mb-4">
                      <div class="flex items-center text-sm text-[#F5F7FA]">
                        <i class="fa-solid fa-calendar-alt mr-2 text-[#F5F7FA]"></i>
                        <span>截止日期：{{ contest.deadline }}</span>
                      </div>
                      <div class="flex items-center text-sm text-[#F5F7FA]">
                        <i class="fa-solid fa-user-group mr-2 text-[#F5F7FA]"></i>
                        <span>已有 {{ contest.entries }} 人参赛</span>
                      </div>
                      <div class="flex items-center text-sm text-[#F5F7FA]">
                        <i class="fa-solid fa-tags mr-2 text-[#F5F7FA]"></i>
                        <span>分类：{{ contest.categories.join('、') }}</span>
                      </div>
                    </div>

                    <!--  赛事描述  -->
                    <p class="text-sm text-[#F5F7FA]/90 mb-4 line-clamp-2">
                      {{ contest.description }}
                    </p>

                    <!--  奖励信息  -->
                    <div class="mb-4">
                      <h4 class="text-sm font-medium text-[#F5F7FA] mb-2">奖励设置</h4>
                      <div class="flex flex-wrap gap-2">
                        <template v-for="(prize, index) in contest.prizes.slice(0, 3)" :key="index">
                          <span
                            :key="index"
                            class="px-2 py-1 bg-[#2D3748]/50 text-[#F5F7FA] rounded-full text-xs border border-[#6B7C93]/30"
                          >
                            {{ prize.rank }}
                          </span>
                        </template>

                        <template v-if="contest.prizes.length > 3">
                          <span
                            class="px-2 py-1 bg-[#2D3748]/50 text-[#F5F7FA] rounded-full text-xs border border-[#6B7C93]/30"
                          >
                            +{{ contest.prizes.length - 3 }}
                          </span>
                        </template>
                      </div>
                    </div>

                    <!--  赛事标签  -->
                    <div class="flex flex-wrap gap-2 mb-4">
                      <template v-for="(tag, index) in contest.tags.slice(0, 5)" :key="index">
                        <button
                          :key="index"
                          @click="() => toggleTag(tag)"
                          :class="`px-2 py-1 rounded-full text-xs ${
                            selectedTags.includes(tag)
                              ? 'bg-[#F5F7FA] text-[#4A5F8B]'
                              : 'bg-[#2D3748]/50 text-[#F5F7FA] border border-[#6B7C93]/30'
                          } transition-colors`"
                        >
                          #{{ tag }}
                        </button>
                      </template>
                    </div>

                    <!--  操作按钮  -->
                    <Link
                      :to="`/contest/${contest.id}`"
                      class="block w-full py-2 text-center bg-[#F5F7FA] text-[#4A5F8B] rounded-lg font-medium hover:bg-[#FFFFFF] transition-colors border border-[#F5F7FA]"
                    >
                      {{ contest.status === '进行中' ? '立即参赛' : '查看详情' }}
                    </Link>
                  </div>
                </div>
              </motion.div>
            </template>

            <template v-if="filteredContests.length === 0">
              <div class="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
                <div
                  class="w-16 h-16 bg-[#1E2A3A] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4"
                >
                  <i class="fa-solid fa-search text-2xl"></i>
                </div>
                <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">未找到相关赛事</h3>
                <p class="text-[#B8C6D8]">
                  请尝试使用不同的关键词或筛选条件
                </p>
              </div>
            </template>
          </div>

          <!--  分页  -->

          <template v-if="filteredContests.length > 0">
            <div class="flex justify-center">
              <nav class="flex items-center space-x-1 bg-[#2D3748] p-2 rounded-lg border border-[#4A5F8B]">
                <button
                  class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                >
                  <i class="fa-solid fa-chevron-left text-xs"></i>
                </button>
                <button class="px-3 py-2 rounded border border-[#4A5F8B] bg-[#4A5F8B] text-[#F5F7FA]">
                  1
                </button>
                <button
                  class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                >
                  2
                </button>
                <button
                  class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                >
                  3
                </button>
                <span class="px-2 text-[#B8C6D8]">...</span>
                <button
                  class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                >
                  6
                </button>
                <button
                  class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                >
                  <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
              </nav>
            </div>
          </template>
        </div>

        <!--  侧边栏  -->
        <div class="lg:col-span-1 space-y-6">
          <!--  热门标签模块  -->
          <div class="bg-[#4A5F8B] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">热门标签</h3>
            <div class="flex flex-wrap gap-2">
              <template v-for="tag in popularTags" :key="">
                <button
                  :key="tag.id"
                  @click="() => toggleTag(tag.name)"
                  :class="`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag.name)
                      ? 'bg-[#F5F7FA] text-[#4A5F8B]'
                      : 'bg-[#6B7C93] text-[#F5F7FA] border border-[#6B7C93]'
                  } transition-colors`"
                >
                  #{{ tag.name }} ({{ tag.count }})
                </button>
              </template>
            </div>

            <!--  清除标签  -->

            <template v-if="selectedTags.length > 0">
              <button
                @click="() => (state.selectedTags = [])"
                class="mt-4 w-full py-2 text-center text-sm text-[#F5F7FA] hover:text-[#FFFFFF] transition-colors"
              >
                <i class="fa-solid fa-times mr-1"></i> 清除所有标签
              </button>
            </template>
          </div>

          <!--  即将截止  -->
          <div
            class="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 shadow-sm border border-[#4A5F8B] text-[#F5F7FA]"
          >
            <h3 class="text-lg font-bold mb-4">即将截止</h3>
            <div class="space-y-4">
              <template
                v-for="contest in mockContests
                  .filter((contest) => contest.status === '进行中')
                  .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                  .slice(0, 3)"
                :key=""
              >
                <motion.div
                  :key="contest.id"
                  :whileHover="{
                    x: 5,
                  }"
                  class="flex space-x-3 cursor-pointer"
                >
                  <div
                    class="w-16 h-16 flex-shrink-0 flex flex-col items-center justify-center bg-[#2D3748]/30 rounded-lg text-[#F5F7FA]"
                  >
                    <span class="text-lg font-bold">{{ diffDays }}</span>
                    <span class="text-xs">天后截止</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-[#F5F7FA] hover:text-[#FFFFFF] transition-colors truncate">
                      {{ contest.title }}
                    </h4>
                    <div class="flex items-center space-x-2 mt-1 text-xs text-[#F5F7FA]/80">
                      <span>{{ contest.type }}</span>
                      <span>•</span>
                      <span>{{ contest.entries }} 人参赛</span>
                    </div>
                  </div>
                </motion.div>
              </template>
            </div>
            <Link
              to="#"
              class="mt-4 inline-block text-sm text-[#F5F7FA] hover:text-[#FFFFFF] transition-colors flex items-center justify-center w-full"
            >
              <span>查看全部即将截止的赛事</span>
            </Link>
          </div>

          <!--  赛事常见问题  -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">参赛指南</h3>
            <div class="space-y-3">
              <div>
                <h4 class="font-medium text-[#F5F7FA] mb-1">如何参赛？</h4>
                <p class="text-sm text-[#B8C6D8]">
                  浏览感兴趣的赛事，点击"立即参赛"按钮，按照要求上传作品并填写相关信息即可完成报名。
                </p>
              </div>
              <div>
                <h4 class="font-medium text-[#F5F7FA] mb-1">作品有什么要求？</h4>
                <p class="text-sm text-[#B8C6D8]">
                  不同赛事有不同的作品要求，包括题材、格式、大小等，请务必仔细阅读每个赛事的具体规则。
                </p>
              </div>
              <div>
                <h4 class="font-medium text-[#F5F7FA] mb-1">如何提高获奖几率？</h4>
                <p class="text-sm text-[#B8C6D8]">
                  了解赛事主题和评审标准，提交符合要求的高质量原创作品，注意作品的创意性、技术性和表现力。
                </p>
              </div>
              <div>
                <h4 class="font-medium text-[#F5F7FA] mb-1">获奖后如何领奖？</h4>
                <p class="text-sm text-[#B8C6D8]">
                  赛事结果公布后，工作人员会通过站内信、邮件或电话联系获奖者，安排奖金发放和奖品寄送事宜。
                </p>
              </div>
            </div>
          </div>

          <!--  赛事日历模块  -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">赛事日历</h3>
            <!--  简化的日历组件  -->
            <div class="text-center mb-3">
              <h4 class="font-medium text-[#F5F7FA]">2023年四季度</h4>
            </div>
            <div class="space-y-3">
              <div class="flex items-start">
                <div class="w-16 text-center flex-shrink-0">
                  <span class="text-sm font-medium text-[#4A5F8B]">10月</span>
                </div>
                <div class="flex-1 space-y-2">
                  <div class="flex items-center">
                    <span
                      class="w-6 h-6 rounded-full bg-[#4A5F8B] text-[#F5F7FA] text-xs flex items-center justify-center flex-shrink-0"
                      >15</span
                    >
                    <span class="text-sm text-[#F5F7FA] ml-2">自然生态摄影展截止</span>
                  </div>
                </div>
              </div>
              <div class="flex items-start">
                <div class="w-16 text-center flex-shrink-0">
                  <span class="text-sm font-medium text-[#4A5F8B]">11月</span>
                </div>
                <div class="flex-1 space-y-2">
                  <div class="flex items-center">
                    <span
                      class="w-6 h-6 rounded-full bg-[#4A5F8B] text-[#F5F7FA] text-xs flex items-center justify-center flex-shrink-0"
                      >15</span
                    >
                    <span class="text-sm text-[#F5F7FA] ml-2">索尼Alpha创意摄影挑战赛截止</span>
                  </div>
                  <div class="flex items-center">
                    <span
                      class="w-6 h-6 rounded-full bg-[#4A5F8B] text-[#F5F7FA] text-xs flex items-center justify-center flex-shrink-0"
                      >30</span
                    >
                    <span class="text-sm text-[#F5F7FA] ml-2">城市人文纪实摄影大赛截止</span>
                  </div>
                </div>
              </div>
              <div class="flex items-start">
                <div class="w-16 text-center flex-shrink-0">
                  <span class="text-sm font-medium text-[#4A5F8B]">12月</span>
                </div>
                <div class="flex-1 space-y-2">
                  <div class="flex items-center">
                    <span
                      class="w-6 h-6 rounded-full bg-[#4A5F8B] text-[#F5F7FA] text-xs flex items-center justify-center flex-shrink-0"
                      >31</span
                    >
                    <span class="text-sm text-[#F5F7FA] ml-2">年度黑白摄影大赛截止</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!--  创建赛事  -->
          <div class="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 shadow-sm text-white">
            <h3 class="text-lg font-bold mb-3">创建个人赛事</h3>
            <p class="text-sm mb-4 text-white/90">
              你也可以创建自己的摄影赛事，邀请好友参与，自定义规则和奖励
            </p>
            <button
              class="w-full py-2 bg-[#F5F7FA] text-[#4A5F8B] font-medium rounded-lg hover:bg-[#FFFFFF] transition-colors"
            >
              立即创建
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { Link } from 'react-router-dom';
  import { motion } from 'framer-motion';
  const mockContests = [
    {
      id: 'c1',
      title: '2023年度黑白摄影大赛',
      type: '官方主办',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=black%20and%20white%20photography%20contest%20banner%20minimalist&sign=5958a9112dbd48d52283b3d3b68c22df',
      deadline: '2023-12-31',
      status: '进行中',
      entries: 1254,
      prizes: [
        { rank: '一等奖', value: '20000元', count: 1 },
        { rank: '二等奖', value: '10000元', count: 2 },
        { rank: '三等奖', value: '5000元', count: 3 },
        { rank: '优秀奖', value: '1000元', count: 10 },
      ],
      description:
        '展现黑白摄影的独特魅力，通过光影、构图和情感表达，呈现经典而永恒的视觉艺术作品。大赛面向全球摄影爱好者，欢迎各类黑白摄影作品参赛。',
      categories: ['风光', '人像', '纪实', '创意'],
      rules: [
        '参赛作品必须为黑白照片',
        '每位参赛者最多提交5幅作品',
        '作品必须为原创，不得抄袭',
        '保留EXIF信息，便于评审',
        '投稿即视为同意主办方拥有作品使用权',
      ],
      tags: ['黑白', '年度', '官方', '奖金', '全球'],
    },
    {
      id: 'c2',
      title: '索尼Alpha创意摄影挑战赛',
      type: '合作赛事',
      organizer: '索尼中国',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=sony%20alpha%20creative%20photography%20challenge%20banner&sign=38f14ccad69f3dbb399991f5317127ce',
      deadline: '2023-11-15',
      status: '进行中',
      entries: 876,
      prizes: [
        { rank: '金奖', value: '索尼A7R V相机一台', count: 1 },
        { rank: '银奖', value: '索尼FE 24-70mm F2.8 GM镜头', count: 2 },
        { rank: '铜奖', value: '索尼ZV-1相机一台', count: 3 },
        { rank: '入围奖', value: '索尼相机包一个', count: 20 },
      ],
      description:
        '使用索尼Alpha系列相机创作，展示你的创意视角和摄影才华。本次挑战赛不限题材，鼓励创新和实验性的摄影作品。',
      categories: ['不限'],
      rules: [
        '参赛作品必须使用索尼Alpha系列相机拍摄',
        '每位参赛者最多提交8幅作品',
        '作品可进行后期处理',
        '保留原始文件，获奖后需提供验证',
        '投稿即视为同意活动规则和版权条款',
      ],
      tags: ['索尼', '创意', '器材', '相机', '合作'],
    },
    {
      id: 'c3',
      title: '城市人文纪实摄影大赛',
      type: '官方主办',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=urban%20documentary%20photography%20contest%20banner%20street%20life&sign=818fdf65887ba3b9c9d321794542006b',
      deadline: '2023-11-30',
      status: '进行中',
      entries: 654,
      prizes: [
        { rank: '金奖', value: '15000元', count: 1 },
        { rank: '银奖', value: '8000元', count: 2 },
        { rank: '铜奖', value: '3000元', count: 3 },
        { rank: '人气奖', value: '2000元', count: 1 },
      ],
      description:
        '记录城市生活的瞬间，展现都市人文风情和社会变迁。通过摄影镜头，讲述城市中的故事，传递人文关怀和思考。',
      categories: ['人文', '纪实', '街拍'],
      rules: [
        '参赛作品必须为纪实摄影风格',
        '每位参赛者最多提交6幅作品',
        '可以是单幅或组照（组照不超过8张）',
        '作品需附带简短文字说明',
        '保留真实性，不得过度修改',
      ],
      tags: ['城市', '人文', '纪实', '街拍', '官方'],
    },
    {
      id: 'c4',
      title: '自然生态摄影展',
      type: '官方主办',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=natural%20ecology%20photography%20exhibition%20banner%20wildlife&sign=c47d5cf3d76049534c98c3f640cbd2f0',
      deadline: '2023-10-15',
      status: '已截止',
      entries: 432,
      prizes: [
        { rank: '金奖', value: '12000元', count: 1 },
        { rank: '银奖', value: '6000元', count: 2 },
        { rank: '铜奖', value: '3000元', count: 3 },
        { rank: '优秀奖', value: '1000元', count: 8 },
      ],
      description: '展现大自然的美丽与神奇，记录生态环境和野生动植物的精彩瞬间，提高公众的环保意识和对自然的敬畏之心。',
      categories: ['风光', '野生动物', '植物', '生态环境'],
      rules: [
        '参赛作品必须为自然生态主题',
        '每位参赛者最多提交5幅作品',
        '作品需注明拍摄地点和物种信息',
        '不得伤害或干扰拍摄对象',
        '严禁摆拍和人为干预自然行为',
      ],
      tags: ['自然', '生态', '风光', '野生动物', '环保'],
    },
  ];
  const contestTypes = ['全部', '官方主办', '合作赛事', '用户自创'];
  const contestStatuses = ['全部', '进行中', '已截止', '评选中', '已结束'];
  const popularTags = [
    { id: '1', name: '黑白', count: 124 },
    { id: '2', name: '人文', count: 87 },
    { id: '3', name: '风光', count: 65 },
    { id: '4', name: '创意', count: 43 },
    { id: '5', name: '索尼', count: 32 },
    { id: '6', name: '城市', count: 28 },
    { id: '7', name: '自然', count: 25 },
    { id: '8', name: '生态', count: 20 },
  ];
  const state = reactive({
    selectedType: '全部',
    selectedStatus: '全部',
    searchTerm: '',
    sortBy: 'deadline',
    selectedTags: [],
  });
  // deadline, popular, newest
  // 过滤赛事
  const getFilteredContests = () => {
    let contests = [...mockContests]; // 按类型过滤

    if (selectedType !== '全部') {
      contests = contests.filter((contest) => contest.type === selectedType);
    } // 按状态过滤

    if (selectedStatus !== '全部') {
      contests = contests.filter((contest) => contest.status === selectedStatus);
    } // 按搜索词过滤

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      contests = contests.filter(
        (contest) =>
          contest.title.toLowerCase().includes(term) ||
          contest.description.toLowerCase().includes(term) ||
          (contest.organizer && contest.organizer.toLowerCase().includes(term))
      );
    } // 按标签过滤

    if (selectedTags.length > 0) {
      contests = contests.filter((contest) => selectedTags.some((tag) => contest.tags.includes(tag)));
    } // 排序

    if (sortBy === 'deadline') {
      contests.sort((a, b) => {
        if (a.status === '进行中' && b.status !== '进行中') return -1;
        if (a.status !== '进行中' && b.status === '进行中') return 1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    } else if (sortBy === 'popular') {
      contests.sort((a, b) => b.entries - a.entries);
    } else if (sortBy === 'newest') {
      contests.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
    }

    return contests;
  }; // 切换标签
  // 切换标签
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      state.selectedTags = selectedTags.filter((t) => t !== tag);
    } else {
      state.selectedTags = [...selectedTags, tag];
    }
  };
  const filteredContests = getFilteredContests();
</script>

<style lang="less" scoped src="./index.less"></style>
