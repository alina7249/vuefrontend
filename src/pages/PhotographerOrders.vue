<template>
  <div class="container mx-auto px-4 py-8 bg-[#F5F7FA] star-texture min-h-screen">
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
        <h1 class="text-3xl font-bold text-[#4A5059] mb-2">摄影师接单</h1>
        <p class="text-[#4A5059]/80 max-w-2xl mx-auto">
          浏览各类摄影需求，承接商业拍摄、内容创作和教学合作项目，展示你的专业能力
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
                placeholder="搜索需求、关键词或地点..."
                :value="searchTerm"
                @change="(e) => (state.searchTerm = e.target.value)"
                class="w-full px-4 py-3 pl-12 bg-[#F5F7FA] border border-[#B8C6D8] text-[#4A5059] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
              />
              <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4A5059]/50"></i>
            </div>

            <select
              :value="sortBy"
              @change="(e) => (state.sortBy = e.target.value)"
              class="px-4 py-3 bg-[#F5F7FA] border border-[#B8C6D8] text-[#4A5059] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option value="newest">最新发布</option>
              <option value="popular">最受关注</option>
              <option value="budget-asc">价格从低到高</option>
              <option value="budget-desc">价格从高到低</option>
            </select>
          </div>

          <!--  服务类型和分类选项卡  -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-[#E6EBF2] rounded-xl shadow-sm border border-[#B8C6D8] overflow-hidden">
              <div class="p-3 border-b border-[#B8C6D8]">
                <h4 class="text-sm font-medium text-[#4A5059]">服务类型</h4>
              </div>
              <div class="grid grid-cols-3 p-2">
                <template v-for="type in serviceTypes" :key="">
                  <button
                    :key="type"
                    @click="() => (state.selectedType = type)"
                    :class="`py-2 px-1 text-center text-sm font-medium transition-colors ${
                      selectedType === type
                        ? 'bg-[#F5F7FA] text-[#4A5F8B] rounded-lg'
                        : 'text-[#4A5059]/70 hover:text-[#4A5059]'
                    }`"
                  >
                    {{ type }}
                  </button>
                </template>
              </div>
            </div>

            <div class="bg-[#E6EBF2] rounded-xl shadow-sm border border-[#B8C6D8] overflow-hidden">
              <div class="p-3 border-b border-[#B8C6D8]">
                <h4 class="text-sm font-medium text-[#4A5059]">服务分类</h4>
              </div>
              <div class="grid grid-cols-4 p-2">
                <template v-for="category in serviceCategories" :key="">
                  <button
                    :key="category"
                    @click="() => (state.selectedCategory = category)"
                    :class="`py-2 px-1 text-center text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-[#F5F7FA] text-[#4A5F8B] rounded-lg'
                        : 'text-[#4A5059]/70 hover:text-[#4A5059]'
                    }`"
                  >
                    {{ category }}
                  </button>
                </template>
              </div>
            </div>
          </div>

          <!--  需求列表  -->
          <div class="space-y-6">
            <template v-for="request in filteredRequests" :key="">
              <motion.div
                :key="request.id"
                :whileHover="{
                  y: -5,
                  boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)',
                }"
                class="bg-[#F5F7FA] rounded-xl overflow-hidden border border-[#B8C6D8] transition-all shadow-sm"
              >
                <!--  需求图片  -->
                <div class="md:flex">
                  <div class="md:w-1/3">
                    <img :src="request.image" :alt="request.title" class="w-full h-48 md:h-full object-cover" />
                  </div>

                  <!--  需求信息  -->
                  <div class="p-5 md:w-2/3">
                    <!--  需求类型和状态  -->
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex space-x-2">
                        <span class="text-sm text-[#4A5F8B] font-medium">{{ request.type }}</span>
                        <span class="text-xs px-2 py-1 bg-[#E6EBF2] text-[#4A5F8B] rounded-full">{{
                          request.category
                        }}</span>
                      </div>
                      <span
                        :class="`text-xs px-2 py-1 rounded-full ${
                          request.status === '待接单' ? 'bg-[#4A5F8B]/20 text-[#4A5F8B]' : 'bg-[#E6EBF2] text-[#4A5059]'
                        }`"
                      >
                        {{ request.status }}
                      </span>
                    </div>

                    <!--  需求标题  -->
                    <h3 class="text-lg font-bold text-[#4A5059] mb-2 hover:text-[#4A5F8B] transition-colors">
                      {{ request.title }}
                    </h3>

                    <!--  需求基本信息  -->
                    <div class="space-y-1 mb-4">
                      <div class="flex items-center text-sm text-[#4A5059]/70">
                        <i class="fa-solid fa-map-marker-alt mr-2 text-[#4A5F8B]"></i>
                        <span>{{ request.location }}</span>
                      </div>
                      <div class="flex items-center text-sm text-[#4A5059]/70">
                        <i class="fa-solid fa-calendar-alt mr-2 text-[#4A5F8B]"></i>
                        <span>截止日期：{{ request.deadline }}</span>
                      </div>
                      <div class="flex items-center text-sm text-[#4A5059]/70">
                        <i class="fa-solid fa-wallet mr-2 text-[#4A5F8B]"></i>
                        <span>预算：{{ request.budget }}</span>
                      </div>
                    </div>

                    <!--  需求描述  -->
                    <p class="text-sm text-[#4A5059]/80 mb-4 line-clamp-2">
                      {{ request.description }}
                    </p>

                    <!--  客户信息  -->
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center">
                        <img
                          :src="request.client.avatar"
                          :alt="request.client.name"
                          class="w-8 h-8 rounded-full mr-2 object-cover border border-[#B8C6D8]"
                        />
                        <div>
                          <p class="text-sm font-medium text-[#4A5059]">{{ request.client.name }}</p>
                          <div class="flex items-center">
                            <i class="fa-solid fa-star text-xs text-[#4A5F8B]"></i>
                            <span class="text-xs text-[#4A5059]/70 ml-1">{{ request.client.rating }}</span>
                            <span class="text-xs text-[#4A5059]/50 mx-1">|</span>
                            <span class="text-xs text-[#4A5059]/70">{{ request.client.completedProjects }} 个项目</span>
                          </div>
                        </div>
                      </div>
                      <div class="flex items-center space-x-3 text-sm text-[#4A5059]/70">
                        <div class="flex items-center">
                          <i class="fa-solid fa-eye mr-1"></i>
                          <span>{{ request.views }} 次浏览</span>
                        </div>
                        <div class="flex items-center">
                          <i class="fa-solid fa-user-plus mr-1"></i>
                          <span>{{ request.applications }} 人申请</span>
                        </div>
                      </div>
                    </div>

                    <!--  需求标签  -->
                    <div class="flex flex-wrap gap-2 mb-4">
                      <template v-for="(tag, index) in request.tags.slice(0, 5)" :key="index">
                        <button
                          :key="index"
                          @click="() => toggleTag(tag)"
                          :class="`px-2 py-1 rounded-full text-xs ${
                            selectedTags.includes(tag)
                              ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                              : 'bg-[#E6EBF2] text-[#4A5059] border border-[#B8C6D8]/30'
                          } transition-colors`"
                        >
                          #{{ tag }}
                        </button>
                      </template>
                    </div>

                    <!--  操作按钮  -->
                    <Link
                      :to="`/request/${request.id}`"
                      class="block w-full py-2 text-center bg-[#E6EBF2] text-[#4A5059] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#B8C6D8]"
                    >
                      查看详情
                    </Link>
                  </div>
                </div>
              </motion.div>
            </template>

            <template v-if="filteredRequests.length === 0">
              <div class="p-8 bg-[#F5F7FA] rounded-xl border border-[#B8C6D8] text-center">
                <div
                  class="w-16 h-16 bg-[#E6EBF2] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4"
                >
                  <i class="fa-solid fa-search text-2xl"></i>
                </div>
                <h3 class="text-lg font-medium text-[#4A5059] mb-2">未找到相关需求</h3>
                <p class="text-[#4A5059]/70">
                  请尝试使用不同的关键词或筛选条件
                </p>
              </div>
            </template>
          </div>

          <!--  分页  -->

          <template v-if="filteredRequests.length > 0">
            <div class="flex justify-center">
              <nav class="flex items-center space-x-1 bg-[#E6EBF2] p-2 rounded-lg border border-[#B8C6D8]">
                <button
                  class="px-3 py-2 rounded border border-[#B8C6D8] text-[#4A5059] hover:bg-[#F5F7FA] transition-colors"
                >
                  <i class="fa-solid fa-chevron-left text-xs"></i>
                </button>
                <button class="px-3 py-2 rounded border border-[#B8C6D8] bg-[#F5F7FA] text-[#4A5059]">
                  1
                </button>
                <button
                  class="px-3 py-2 rounded border border-[#B8C6D8] text-[#4A5059] hover:bg-[#F5F7FA] transition-colors"
                >
                  2
                </button>
                <button
                  class="px-3 py-2 rounded border border-[#B8C6D8] text-[#4A5059] hover:bg-[#F5F7FA] transition-colors"
                >
                  3
                </button>
                <span class="px-2 text-[#4A5059]/70">...</span>
                <button
                  class="px-3 py-2 rounded border border-[#B8C6D8] text-[#4A5059] hover:bg-[#F5F7FA] transition-colors"
                >
                  7
                </button>
                <button
                  class="px-3 py-2 rounded border border-[#B8C6D8] text-[#4A5059] hover:bg-[#F5F7FA] transition-colors"
                >
                  <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
              </nav>
            </div>
          </template>
        </div>

        <!--  侧边栏  -->
        <div class="lg:col-span-1 space-y-6">
          <!--  需求筛选  -->
          <div class="bg-[#F5F7FA] rounded-xl p-6 shadow-sm border border-[#B8C6D8]">
            <h3 class="text-lg font-bold mb-4 text-[#4A5059]">筛选条件</h3>

            <!--  预算范围  -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-[#4A5059] mb-3">预算范围</h4>
              <div class="space-y-2">
                <template v-for="range in budgetRanges" :key="">
                  <div :key="range" class="flex items-center">
                    <input
                      type="radio"
                      :id="`budget-${range}`"
                      name="budget-range"
                      :checked="selectedBudgetRange === range"
                      @change="() => (state.selectedBudgetRange = range)"
                      class="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#B8C6D8] bg-[#E6EBF2]"
                    />
                    <label :htmlFor="`budget-${range}`" class="ml-2 text-sm text-[#4A5059]">
                      {{ range }}
                    </label>
                  </div>
                </template>
              </div>
            </div>

            <!--  地点选择  -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-[#4A5059] mb-3">地点</h4>
              <div class="space-y-2">
                <template v-for="location in ['全部', '北京', '上海', '广州', '深圳', '成都', '杭州', '其他']" :key="">
                  <div :key="location" class="flex items-center">
                    <input
                      type="radio"
                      :id="`location-${location}`"
                      name="location"
                      :checked="location === '全部'"
                      @change="() => {}"
                      class="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#B8C6D8] bg-[#E6EBF2]"
                    />
                    <label :htmlFor="`location-${location}`" class="ml-2 text-sm text-[#4A5059]">
                      {{ location }}
                    </label>
                  </div>
                </template>
              </div>
            </div>

            <!--  发布时间  -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-[#4A5059] mb-3">发布时间</h4>
              <div class="space-y-2">
                <template v-for="time in ['全部', '今天', '本周', '本月', '三个月内']" :key="">
                  <div :key="time" class="flex items-center">
                    <input
                      type="radio"
                      :id="`time-${time}`"
                      name="time"
                      :checked="time === '全部'"
                      @change="() => {}"
                      class="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#B8C6D8] bg-[#E6EBF2]"
                    />
                    <label :htmlFor="`time-${time}`" class="ml-2 text-sm text-[#4A5059]">
                      {{ time }}
                    </label>
                  </div>
                </template>
              </div>
            </div>

            <!--  应用筛选按钮  -->
            <button
              class="w-full py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#4A5059] transition-colors"
            >
              应用筛选
            </button>
          </div>

          <!--  热门标签  -->
          <div class="bg-[#F5F7FA] rounded-xl p-6 shadow-sm border border-[#B8C6D8]">
            <h3 class="text-lg font-bold mb-4 text-[#4A5059]">热门标签</h3>
            <div class="flex flex-wrap gap-2">
              <template v-for="tag in popularTags" :key="">
                <button
                  :key="tag.id"
                  @click="() => toggleTag(tag.name)"
                  :class="`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag.name)
                      ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                      : 'bg-[#E6EBF2] text-[#4A5059] border border-[#B8C6D8]/30'
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
                class="mt-4 w-full py-2 text-center text-sm text-[#4A5059] hover:text-[#4A5F8B] transition-colors"
              >
                <i class="fa-solid fa-times mr-1"></i> 清除所有标签
              </button>
            </template>
          </div>

          <!--  如何提高接单率  -->
          <div class="bg-[#F5F7FA] rounded-xl p-6 shadow-sm border border-[#B8C6D8]">
            <h3 class="text-lg font-bold mb-4 text-[#4A5059]">如何提高接单率</h3>
            <div class="space-y-3">
              <div class="flex items-start">
                <div
                  class="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3 flex-shrink-0"
                >
                  <i class="fa-solid fa-camera"></i>
                </div>
                <div>
                  <h4 class="font-medium text-[#4A5059] mb-1">完善作品集</h4>
                  <p class="text-sm text-[#4A5059]/70">
                    上传高质量、多样化的作品，展示你的专业能力和创作风格
                  </p>
                </div>
              </div>
              <div class="flex items-start">
                <div
                  class="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3 flex-shrink-0"
                >
                  <i class="fa-solid fa-file-signature"></i>
                </div>
                <div>
                  <h4 class="font-medium text-[#4A5059] mb-1">撰写专业介绍</h4>
                  <p class="text-sm text-[#4A5059]/70">
                    详细描述你的专业背景、擅长领域和服务内容，让客户了解你的优势
                  </p>
                </div>
              </div>
              <div class="flex items-start">
                <div
                  class="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3 flex-shrink-0"
                >
                  <i class="fa-solid fa-comment-dots"></i>
                </div>
                <div>
                  <h4 class="font-medium text-[#4A5059] mb-1">及时响应需求</h4>
                  <p class="text-sm text-[#4A5059]/70">
                    看到感兴趣的需求，尽快提交申请并与客户沟通，提高成功几率
                  </p>
                </div>
              </div>
              <div class="flex items-start">
                <div
                  class="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3 flex-shrink-0"
                >
                  <i class="fa-solid fa-star"></i>
                </div>
                <div>
                  <h4 class="font-medium text-[#4A5059] mb-1">保持良好评价</h4>
                  <p class="text-sm text-[#4A5059]/70">
                    认真完成每一单，获取客户好评，建立良好的口碑和信用记录
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!--  成为认证摄影师  -->
          <div class="bg-gradient-to-r from-[#4A5F8B] to-[#B8C6D8] rounded-xl p-6 shadow-sm text-white">
            <h3 class="text-lg font-bold mb-3">成为认证摄影师</h3>
            <p class="text-sm mb-4 text-white/90">
              通过认证，获得更多优质订单机会，提高曝光度和接单率
            </p>
            <div class="space-y-2 mb-4">
              <div class="flex items-center text-sm">
                <i class="fa-solid fa-check-circle mr-2"></i>
                <span>优先推荐给优质客户</span>
              </div>
              <div class="flex items-center text-sm">
                <i class="fa-solid fa-check-circle mr-2"></i>
                <span>获得"认证摄影师"标识</span>
              </div>
              <div class="flex items-center text-sm">
                <i class="fa-solid fa-check-circle mr-2"></i>
                <span>专属客服和订单管理</span>
              </div>
            </div>
            <button
              class="w-full py-2 bg-white text-[#4A5F8B] font-medium rounded-lg hover:bg-[#E6EBF2] transition-colors"
            >
              立即申请认证
            </button>
          </div>

          <!--  摄影师入驻指南  -->
          <div class="bg-[#F5F7FA] rounded-xl p-6 shadow-sm border border-[#B8C6D8]">
            <h3 class="text-lg font-bold mb-4 text-[#4A5059]">入驻指南</h3>
            <div class="space-y-3">
              <div class="flex items-start">
                <div
                  class="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3 flex-shrink-0"
                >
                  <span>1</span>
                </div>
                <div>
                  <h4 class="font-medium text-[#4A5059] mb-1">注册账号</h4>
                  <p class="text-sm text-[#4A5059]/70">
                    注册影研社账号，完善个人基本信息
                  </p>
                </div>
              </div>
              <div class="flex items-start">
                <div
                  class="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3 flex-shrink-0"
                >
                  <span>2</span>
                </div>
                <div>
                  <h4 class="font-medium text-[#4A5059] mb-1">创建作品集</h4>
                  <p class="text-sm text-[#4A5059]/70">
                    上传你的摄影作品，展示专业能力和创作风格
                  </p>
                </div>
              </div>
              <div class="flex items-start">
                <div
                  class="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3 flex-shrink-0"
                >
                  <span>3</span>
                </div>
                <div>
                  <h4 class="font-medium text-[#4A5059] mb-1">设置服务项目</h4>
                  <p class="text-sm text-[#4A5059]/70">
                    选择你提供的服务类型、价格和工作范围
                  </p>
                </div>
              </div>
              <div class="flex items-start">
                <div
                  class="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3 flex-shrink-0"
                >
                  <span>4</span>
                </div>
                <div>
                  <h4 class="font-medium text-[#4A5059] mb-1">开始接单</h4>
                  <p class="text-sm text-[#4A5059]/70">
                    浏览需求，提交申请，开始你的摄影接单之旅
                  </p>
                </div>
              </div>
            </div>
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
  const mockRequests = [
    {
      id: 'r1',
      title: '企业宣传照片拍摄',
      type: '商业拍摄',
      category: '产品',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=corporate%20product%20photography%20commercial%20shooting&sign=262f6cd0c5b8f759b02c054e9801514a',
      client: {
        id: 'c1',
        name: '科技有限公司',
        avatar:
          'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=company%20logo%20tech%20corporate&sign=81556d24a2ea17c3d00c4ed54386292b',
        rating: 4.8,
        completedProjects: 23,
      },
      budget: '10000-20000元',
      deadline: '2023-11-10',
      location: '上海',
      description:
        '为我司最新电子产品系列拍摄宣传照片，需要专业的产品摄影，包括白底图、场景图和细节图，用于官网和电商平台展示。',
      requirements: ['有电子产品拍摄经验', '提供专业摄影设备和灯光', '熟悉后期修图', '能够配合产品特性设计拍摄方案'],
      status: '待接单',
      views: 34,
      applications: 8,
      tags: ['商业', '产品', '企业', '上海', '电子产品'],
    },
    {
      id: 'r2',
      title: '婚礼跟拍服务',
      type: '商业拍摄',
      category: '人像',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=wedding%20photography%20service%20couple%20romantic&sign=f2ff486680e37244dc6996ad83d4ba22',
      client: {
        id: 'c2',
        name: '张先生&李女士',
        avatar:
          'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=couple%20avatar%20wedding%20portrait&sign=c14c3c27939bad675916a9023c713c78',
        rating: 4.9,
        completedProjects: 5,
      },
      budget: '8000-15000元',
      deadline: '2023-12-05',
      location: '北京',
      description:
        '为我们的婚礼提供全程跟拍服务，包括接亲、仪式、晚宴等环节，需要捕捉自然真实的情感瞬间，风格偏向清新自然。',
      requirements: ['有婚礼跟拍经验', '熟悉婚礼流程', '能够捕捉感人瞬间', '提供精修照片和相册'],
      status: '待接单',
      views: 45,
      applications: 12,
      tags: ['婚礼', '人像', '跟拍', '北京', '纪实'],
    },
    {
      id: 'r3',
      title: '时尚杂志配图拍摄',
      type: '内容创作',
      category: '人像',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=fashion%20magazine%20photography%20stylish%20portrait&sign=40cdde524236d0a1413425139e15ae4c',
      client: {
        id: 'c3',
        name: '时尚杂志编辑部',
        avatar:
          'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=fashion%20magazine%20logo%20stylish&sign=58d1a46dfccce004a4e80da25fdf4bd7',
        rating: 4.7,
        completedProjects: 15,
      },
      budget: '15000-30000元',
      deadline: '2023-11-20',
      location: '上海',
      description:
        '为我刊十二月刊拍摄时尚人像大片，主题为"都市冬季时尚"，需要专业的模特、造型和灯光团队，风格偏向高端时尚。',
      requirements: ['有时尚杂志拍摄经验', '能够指导模特摆姿', '提供专业灯光和设备', '熟悉时尚摄影后期风格'],
      status: '待接单',
      views: 28,
      applications: 6,
      tags: ['时尚', '杂志', '人像', '上海', '高端'],
    },
    {
      id: 'r4',
      title: '美食菜单摄影',
      type: '商业拍摄',
      category: '产品',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=food%20photography%20menu%20commercial%20restaurant&sign=3e35109b1d0b0fb43aacaa5b5870ed67',
      client: {
        id: 'c4',
        name: '西餐厅',
        avatar:
          'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=restaurant%20logo%20western%20food&sign=a547408676c3f250e7de2b6a11b3b79d',
        rating: 4.6,
        completedProjects: 12,
      },
      budget: '5000-8000元',
      deadline: '2023-11-05',
      location: '广州',
      description:
        '为我餐厅新菜单拍摄美食照片，需要拍摄20道菜品，风格偏向清新自然，突出食物的质感和色彩，用于菜单和线上宣传。',
      requirements: ['有美食摄影经验', '提供专业灯光和道具', '熟悉食物造型', '能够快速高效完成拍摄'],
      status: '待接单',
      views: 22,
      applications: 5,
      tags: ['美食', '菜单', '商业', '广州', '餐厅'],
    },
  ];
  const serviceTypes = ['全部', '商业拍摄', '内容创作', '教学合作'];
  const serviceCategories = ['全部', '人像', '产品', '活动', '风景', '创意', '教学'];
  const budgetRanges = ['全部', '5000元以下', '5000-10000元', '10000-20000元', '20000元以上'];
  const popularTags = [
    { id: '1', name: '商业', count: 124 },
    { id: '2', name: '人像', count: 87 },
    { id: '3', name: '产品', count: 65 },
    { id: '4', name: '婚礼', count: 43 },
    { id: '5', name: '上海', count: 32 },
    { id: '6', name: '北京', count: 28 },
    { id: '7', name: '时尚', count: 25 },
    { id: '8', name: '美食', count: 20 },
  ];
  const state = reactive({
    selectedType: '全部',
    selectedCategory: '全部',
    selectedBudgetRange: '全部',
    searchTerm: '',
    sortBy: 'newest',
    selectedTags: [],
  });
  // newest, popular, budget-asc, budget-desc
  // 过滤需求
  const getFilteredRequests = () => {
    let requests = [...mockRequests]; // 按类型过滤

    if (selectedType !== '全部') {
      requests = requests.filter((request) => request.type === selectedType);
    } // 按分类过滤

    if (selectedCategory !== '全部') {
      requests = requests.filter((request) => request.category === selectedCategory);
    } // 按预算范围过滤

    if (selectedBudgetRange !== '全部') {
      requests = requests.filter((request) => {
        const budgetMin = parseInt(request.budget.split('-')[0]);
        const budgetMax = parseInt(request.budget.split('-')[1]);

        switch (selectedBudgetRange) {
          case '5000元以下':
            return budgetMax < 5000;

          case '5000-10000元':
            return budgetMin >= 5000 && budgetMax <= 10000;

          case '10000-20000元':
            return budgetMin > 10000 && budgetMax <= 20000;

          case '20000元以上':
            return budgetMin > 20000;

          default:
            return true;
        }
      });
    } // 按搜索词过滤

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      requests = requests.filter(
        (request) =>
          request.title.toLowerCase().includes(term) ||
          request.description.toLowerCase().includes(term) ||
          request.location.toLowerCase().includes(term)
      );
    } // 按标签过滤

    if (selectedTags.length > 0) {
      requests = requests.filter((request) => selectedTags.some((tag) => request.tags.includes(tag)));
    } // 排序

    if (sortBy === 'newest') {
      requests.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
    } else if (sortBy === 'popular') {
      requests.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'budget-asc') {
      requests.sort((a, b) => {
        const budgetA = parseInt(a.budget.split('-')[0]);
        const budgetB = parseInt(b.budget.split('-')[0]);
        return budgetA - budgetB;
      });
    } else if (sortBy === 'budget-desc') {
      requests.sort((a, b) => {
        const budgetA = parseInt(a.budget.split('-')[0]);
        const budgetB = parseInt(b.budget.split('-')[0]);
        return budgetB - budgetA;
      });
    }

    return requests;
  }; // 切换标签
  // 切换标签
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      state.selectedTags = selectedTags.filter((t) => t !== tag);
    } else {
      state.selectedTags = [...selectedTags, tag];
    }
  };
  const filteredRequests = getFilteredRequests();
</script>

<style lang="less" scoped src="./index.less"></style>
