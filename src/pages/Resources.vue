<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen">
    <div
      v-motion="{ initial: { opacity: 0, y: 20 }, enter: { opacity: 1, y: 0 }, transition: { duration: 0.5 } }"
    >
      <!-- 页面标题 -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">
          资源交易平台
        </h1>
        <p class="text-[#B8C6D8] max-w-2xl mx-auto">
          连接摄影师与客户的专业平台，寻找合适的拍摄项目，展示您的摄影才华
        </p>
      </div>

      <!-- 内容区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 主要内容 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 顶部功能标签 -->
          <div class="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] overflow-hidden">
            <div class="flex">
              <button
                @click="activeTab = 'photographer'"
                :class="['flex-1 py-4 px-6 text-center font-medium transition-colors', 
                  activeTab === 'photographer' 
                    ? 'bg-[#4A5F8B] text-[#F5F7FA]' 
                    : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
                ]"
              >
                摄影师接单
              </button>
              <button
                @click="activeTab = 'client'"
                :class="['flex-1 py-4 px-6 text-center font-medium transition-colors', 
                  activeTab === 'client' 
                    ? 'bg-[#4A5F8B] text-[#F5F7FA]' 
                    : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
                ]"
              >
                客户发布需求
              </button>
            </div>
          </div>

          <!-- 搜索和筛选 -->
          <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div class="relative flex-1">
              <input
                type="text"
                placeholder="搜索项目、客户或关键词..."
                :value="searchTerm"
                @input="(e) => searchTerm = (e.target as HTMLInputElement).value"
                class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
              />
              <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
            </div>

            <select
              :value="sortBy"
              @change="(e) => sortBy = (e.target as HTMLSelectElement).value"
              class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option value="recommended">推荐排序</option>
              <option value="newest">最新发布</option>
              <option value="price-asc">价格从低到高</option>
              <option value="price-desc">价格从高到低</option>
            </select>
          </div>

          <!-- 项目类型筛选 -->
          <div class="bg-[#2D3748] rounded-xl p-4 shadow-sm border border-[#4A5F8B]">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="type in projectTypes"
                :key="type.id"
                @click="selectedType = type.id"
                :class="['px-3 py-1.5 rounded-full text-sm font-medium transition-colors', 
                  selectedType === type.id 
                    ? 'bg-[#4A5F8B] text-[#F5F7FA]' 
                    : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:border-[#4A5F8B] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'
                ]"
              >
                {{ type.name }}
              </button>
            </div>
          </div>

          <!-- 接单卡片列表 -->
          <div class="space-y-6">
            <div
              v-for="project in filteredProjects"
              :key="project.id"
              v-motion="{ hover: { y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' } }"
              class="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm"
            >
              <!-- 项目信息头部 -->
              <div class="p-5 border-b border-[#4A5F8B]">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h3 class="text-xl font-bold text-[#F5F7FA] mb-1">
                      {{ project.title }}
                    </h3>
                    <div class="flex items-center space-x-3 text-sm text-[#B8C6D8]">
                      <span class="px-2 py-0.5 bg-[#1E2532] rounded-md border border-[#4A5F8B]">
                        {{ project.type }}
                      </span>
                      <div class="flex items-center">
                        <i class="fa-solid fa-map-marker-alt mr-1"></i>
                        {{ project.location }}
                      </div>
                      <div class="flex items-center">
                        <i class="fa-solid fa-eye mr-1"></i>
                        {{ project.views }}
                      </div>
                      <div class="flex items-center">
                        <i class="fa-solid fa-file-signature mr-1"></i>
                        {{ project.applications }}
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-bold text-[#F5F7FA]">¥{{ project.price }}</p>
                    <p class="text-sm text-[#F5F7FA]">截止日期: {{ project.deadline }}</p>
                  </div>
                </div>

                <!-- 客户信息 -->
                <div class="flex items-center justify-between mt-4">
                  <div class="flex items-center">
                    <div class="relative">
                      <img
                        :src="project.company.avatar"
                        :alt="project.company.name"
                        class="w-10 h-10 rounded-full object-cover border border-[#4A5F8B]"
                        onerror="this.src='https://via.placeholder.com/40x40/4A5F8B/FFFFFF?text=' + project.company.name.charAt(0)"
                      />
                      <div
                        v-if="project.company.verified"
                        class="absolute bottom-0 right-0 w-3 h-3 bg-[#4A5F8B] rounded-full border-2 border-[#2D3748]"
                      ></div>
                    </div>
                    <div class="ml-3">
                      <p class="font-medium text-[#F5F7FA]">{{ project.company.name }}</p>
                      <div class="flex items-center text-xs text-[#B8C6D8]">
                        <div class="flex items-center mr-2">
                          <i class="fa-solid fa-star text-[#4A5F8B] mr-1"></i>
                          <span>{{ project.company.rating }}</span>
                        </div>
                        <span>{{ project.company.completedProjects }} 个项目</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 项目描述 -->
              <div class="p-5 border-b border-[#4A5F8B]">
                <h4 class="font-medium text-[#F5F7FA] mb-2">项目描述</h4>
                <p class="text-sm text-[#B8C6D8] mb-4">
                  {{ project.description }}
                </p>

                <h4 class="font-medium text-[#F5F7FA] mb-2">需求要求</h4>
                <ul class="space-y-1 mb-4">
                  <li
                    v-for="(req, index) in project.requirements"
                    :key="index"
                    class="flex items-start text-sm text-[#B8C6D8]"
                  >
                    <i class="fa-solid fa-check-circle text-[#4A5F8B] mt-1 mr-2 flex-shrink-0"></i>
                    <span>{{ req }}</span>
                  </li>
                </ul>

                <!-- 项目标签 -->
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(tag, index) in project.tags"
                    :key="index"
                    class="px-2 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B]"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="p-5 flex justify-between items-center">
                <div class="flex space-x-3">
                  <button
                    class="px-4 py-2 bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                  >
                    <i class="fa-solid fa-bookmark mr-2"></i>
                    收藏
                  </button>
                </div>
                <router-link
                  :to="`/project/${project.id}`"
                  class="px-6 py-2 bg-gradient-to-r from-[#4A5F8B] to-[#2D3748] text-[#F5F7FA] rounded-lg font-medium transition-colors border border-[#4A5F8B]"
                >
                  查看详情
                </router-link>
              </div>
            </div>

            <div v-if="filteredProjects.length === 0" class="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
              <div class="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
                <i class="fa-solid fa-search text-2xl"></i>
              </div>
              <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">未找到相关项目</h3>
              <p class="text-[#B8C6D8]">
                请尝试调整筛选条件或搜索其他关键词
              </p>
            </div>
          </div>

          <!-- 分页 -->
          <div v-if="filteredProjects.length > 0" class="flex justify-center">
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
              <span class="px-2 text-[#B8C6D8]">...</span>
              <button
                class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
              >
                5
              </button>
              <button
                class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
              >
                <i class="fa-solid fa-chevron-right text-xs"></i>
              </button>
            </nav>
          </div>
        </div>

        <!-- 侧边栏内容 -->
        <div class="lg:col-span-1 space-y-6">
          <!-- 摄影师入驻指南模块 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">摄影师入驻指南</h3>
            <div class="space-y-6">
              <div v-for="(step, index) in onboardingSteps" :key="step.id" class="flex">
                <div class="flex-shrink-0 mr-4">
                  <div class="w-8 h-8 rounded-full bg-[#4A5F8B] text-[#F5F7FA] flex items-center justify-center font-bold">
                    {{ index + 1 }}
                  </div>
                </div>
                <div>
                  <h4 class="font-medium text-[#F5F7FA] mb-1">{{ step.title }}</h4>
                  <p class="text-sm text-[#B8C6D8]">{{ step.description }}</p>
                </div>
              </div>
            </div>
            <button
              v-motion="{ hover: { scale: 1.02 }, tap: { scale: 0.98 } }"
              class="w-full mt-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B]"
            >
              立即入驻
            </button>
          </div>

          <!-- 价格区间筛选 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">价格区间</h3>
            <div class="space-y-2">
              <div v-for="range in priceRanges" :key="range.id" class="flex items-center">
                <input
                  type="radio"
                  :id="`price-${range.id}`"
                  name="price-range"
                  :checked="selectedPriceRange === range.id"
                  @change="selectedPriceRange = range.id"
                  class="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] bg-[#1E2532]"
                />
                <label :for="`price-${range.id}`" class="ml-2 text-sm text-[#B8C6D8]">
                  {{ range.name }}
                </label>
              </div>
            </div>
          </div>

          <!-- 热门标签 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">热门标签</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in popularTags"
                :key="tag.id"
                @click="toggleTag(tag.name)"
                :class="['px-3 py-1 rounded-full text-sm transition-colors', 
                  selectedTags.includes(tag.name)
                    ? 'bg-[#4A5F8B] text-[#F5F7FA] border border-[#4A5F8B]'
                    : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'
                ]"
              >
                #{{ tag.name }} ({{ tag.count }})
              </button>
            </div>

            <!-- 清除标签 -->
            <button
              v-if="selectedTags.length > 0"
              @click="selectedTags = []"
              class="mt-4 w-full py-2 text-center text-sm text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
            >
              <i class="fa-solid fa-times mr-1"></i> 清除所有标签
            </button>
          </div>

          <!-- 平台优势 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">平台优势</h3>
            <ul class="space-y-3">
              <li class="flex items-start">
                <i class="fa-solid fa-shield-alt text-[#4A5F8B] mt-0.5 mr-2 flex-shrink-0"></i>
                <span class="text-sm text-[#B8C6D8]">安全可靠的交易保障，资金托管，无忧接单</span>
              </li>
              <li class="flex items-start">
                <i class="fa-solid fa-handshake text-[#4A5F8B] mt-0.5 mr-2 flex-shrink-0"></i>
                <span class="text-sm text-[#B8C6D8]">优质客户资源，提供更多商业合作机会</span>
              </li>
              <li class="flex items-start">
                <i class="fa-solid fa-headset text-[#4A5F8B] mt-0.5 mr-2 flex-shrink-0"></i>
                <span class="text-sm text-[#B8C6D8]">专业客服团队，7x12小时在线服务支持</span>
              </li>
              <li class="flex items-start">
                <i class="fa-solid fa-certificate text-[#4A5F8B] mt-0.5 mr-2 flex-shrink-0"></i>
                <span class="text-sm text-[#B8C6D8]">摄影师认证体系，提升专业形象和竞争力</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// 模拟接单数据
const mockProjects = [
  {
    id: 'p1',
    title: '商业人像拍摄',
    type: '人像摄影',
    location: '上海市',
    price: '5000-8000',
    deadline: '2023-11-10',
    description: '为服装品牌拍摄秋冬季新品宣传照，需要拍摄模特人像照片，包含室内和室外场景，提供完整的后期修图服务。',
    requirements: [
      '具有商业人像拍摄经验',
      '能够指导模特摆姿',
      '提供专业摄影设备',
      '熟悉后期修图流程'
    ],
    tags: ['商业', '人像', '服装', '后期'],
    company: {
      name: '时尚前沿服饰有限公司',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=fashion%20company%20logo%20professional&sign=cdf45d87bd032e57c2a0dcbfc02251e9',
      verified: true,
      completedProjects: 125,
      rating: 4.8
    },
    views: 324,
    applications: 18
  },
  {
    id: 'p2',
    title: '产品摄影服务',
    type: '产品摄影',
    location: '北京市',
    price: '3000-5000',
    deadline: '2023-11-15',
    description: '为电子产品新品拍摄高清产品照片，主要用于电商平台展示和宣传资料。需要拍摄多角度产品图和场景图。',
    requirements: [
      '有产品摄影经验',
      '拥有专业摄影棚和灯光设备',
      '能够处理产品反光问题',
      '提供快速出图服务'
    ],
    tags: ['产品', '电商', '静物', '电子'],
    company: {
      name: '科技创新有限公司',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=tech%20company%20logo%20modern&sign=445a51379e165c0a7195033431714e16',
      verified: true,
      completedProjects: 89,
      rating: 4.7
    },
    views: 256,
    applications: 12
  },
  {
    id: 'p3',
    title: '婚礼跟拍服务',
    type: '婚礼摄影',
    location: '广州市',
    price: '8000-12000',
    deadline: '2023-12-05',
    description: '为新人提供全程婚礼跟拍服务，包括接亲、仪式、晚宴等环节，要求捕捉温馨感人的瞬间，提供高质量的照片和视频。',
    requirements: [
      '有婚礼摄影经验',
      '熟悉婚礼流程',
      '能够捕捉瞬间情感',
      '提供快速精修服务'
    ],
    tags: ['婚礼', '跟拍', '纪实', '人像'],
    company: {
      name: '幸福时刻婚礼策划',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=wedding%20planner%20logo%20elegant&sign=9b3474ad243bb441517ed4ad3fc149f4',
      verified: true,
      completedProjects: 156,
      rating: 4.9
    },
    views: 412,
    applications: 23
  },
  {
    id: 'p4',
    title: '活动现场摄影',
    type: '活动摄影',
    location: '深圳市',
    price: '4000-6000',
    deadline: '2023-11-20',
    description: '为科技峰会活动提供现场摄影服务，需要拍摄演讲嘉宾、互动环节、产品展示等内容，用于活动宣传和媒体报道。',
    requirements: [
      '有活动摄影经验',
      '能够在弱光环境下拍摄',
      '熟悉大型活动流程',
      '提供快速出图服务'
    ],
    tags: ['活动', '会议', '科技', '纪实'],
    company: {
      name: '未来科技峰会组委会',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=tech%20conference%20logo%20futuristic&sign=c8f9692a8042dfb02e2775e75fbca398',
      verified: true,
      completedProjects: 67,
      rating: 4.6
    },
    views: 189,
    applications: 9
  },
  {
    id: 'p5',
    title: '建筑空间摄影',
    type: '建筑摄影',
    location: '成都市',
    price: '6000-10000',
    deadline: '2023-12-10',
    description: '为新建成的商业中心拍摄建筑空间照片，需要展示建筑外观、内部空间设计和细节，用于宣传和招商资料。',
    requirements: [
      '有建筑摄影经验',
      '拥有广角和移轴镜头',
      '能够处理大光比场景',
      '熟悉建筑空间构图'
    ],
    tags: ['建筑', '空间', '商业', '广角'],
    company: {
      name: '城市建设发展有限公司',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=construction%20company%20logo%20professional&sign=5c942136e148b13f0761427e7784f634',
      verified: true,
      completedProjects: 54,
      rating: 4.8
    },
    views: 225,
    applications: 14
  },
  {
    id: 'p6',
    title: '美食摄影服务',
    type: '美食摄影',
    location: '杭州市',
    price: '3000-5000',
    deadline: '2023-11-25',
    description: '为新开业的高级餐厅拍摄菜品照片，需要拍摄精美的菜品图和餐厅环境图，用于菜单设计和社交媒体宣传。',
    requirements: [
      '有美食摄影经验',
      '拥有专业灯光设备',
      '熟悉食物造型和摆盘',
      '能够突出菜品质感'
    ],
    tags: ['美食', '餐厅', '静物', '商业'],
    company: {
      name: '品味人生餐饮管理',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=restaurant%20logo%20elegant%20food&sign=60810ff0ccd916355892a13144957b65',
      verified: true,
      completedProjects: 78,
      rating: 4.7
    },
    views: 267,
    applications: 15
  }
];

// 项目类型
const projectTypes = [
  { id: 'all', name: '全部类型' },
  { id: 'portrait', name: '人像摄影' },
  { id: 'product', name: '产品摄影' },
  { id: 'wedding', name: '婚礼摄影' },
  { id: 'event', name: '活动摄影' },
  { id: 'architecture', name: '建筑摄影' },
  { id: 'food', name: '美食摄影' }
];

// 价格区间
const priceRanges = [
  { id: 'all', name: '全部价格' },
  { id: '0-3000', name: '3000元以下' },
  { id: '3000-6000', name: '3000-6000元' },
  { id: '6000-10000', name: '6000-10000元' },
  { id: '10000+', name: '10000元以上' }
];

// 热门标签
const popularTags = [
  { id: '1', name: '商业', count: 124 },
  { id: '2', name: '人像', count: 98 },
  { id: '3', name: '产品', count: 87 },
  { id: '4', name: '婚礼', count: 76 },
  { id: '5', name: '活动', count: 65 },
  { id: '6', name: '建筑', count: 54 },
  { id: '7', name: '美食', count: 43 },
  { id: '8', name: '电商', count: 32 }
];

// 入驻步骤
const onboardingSteps = [
  {
    id: 'step1',
    title: '注册账号',
    description: '创建您的摄影师账号，填写基本信息',
    icon: 'fa-user-plus'
  },
  {
    id: 'step2',
    title: '完善资料',
    description: '上传作品集，填写专业技能和服务内容',
    icon: 'fa-pencil-alt'
  },
  {
    id: 'step3',
    title: '资质认证',
    description: '提交身份证明和相关专业资质',
    icon: 'fa-id-card'
  },
  {
    id: 'step4',
    title: '开始接单',
    description: '设置服务价格，开始接收项目邀请',
    icon: 'fa-check-circle'
  }
];

// 响应式状态
const activeTab = ref('photographer');
const selectedType = ref('all');
const selectedPriceRange = ref('all');
const searchTerm = ref('');
const sortBy = ref('recommended');
const selectedTags = ref<string[]>([]);

// 过滤项目
const filteredProjects = computed(() => {
  let projects = [...mockProjects];
  
  // 按类型过滤
  if (selectedType.value !== 'all') {
    const typeMap: { [key: string]: string } = {
      'portrait': '人像摄影',
      'product': '产品摄影',
      'wedding': '婚礼摄影',
      'event': '活动摄影',
      'architecture': '建筑摄影',
      'food': '美食摄影'
    };
    projects = projects.filter(project => project.type === typeMap[selectedType.value]);
  }
  
  // 按价格区间过滤
  if (selectedPriceRange.value !== 'all') {
    projects = projects.filter(project => {
      const priceRange = project.price.split('-');
      const minPrice = parseInt(priceRange[0]);
      const maxPrice = priceRange.length > 1 ? parseInt(priceRange[1]) : minPrice;
      
      switch(selectedPriceRange.value) {
        case '0-3000':
          return maxPrice <= 3000;
        case '3000-6000':
          return minPrice >= 3000 && maxPrice <= 6000;
        case '6000-10000':
          return minPrice >= 6000 && maxPrice <= 10000;
        case '10000+':
          return minPrice >= 10000;
        default:
          return true;
      }
    });
  }
  
  // 按搜索词过滤
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    projects = projects.filter(project => 
      project.title.toLowerCase().includes(term) || 
      project.description.toLowerCase().includes(term) ||
      project.company.name.toLowerCase().includes(term)
    );
  }
  
  // 按标签过滤
  if (selectedTags.value.length > 0) {
    projects = projects.filter(project => 
      selectedTags.value.every(tag => project.tags.includes(tag))
    );
  }
  
  // 排序
  if (sortBy.value === 'newest') {
    projects.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
  } else if (sortBy.value === 'price-asc') {
    projects.sort((a, b) => {
      const aPrice = parseInt(a.price.split('-')[0]);
      const bPrice = parseInt(b.price.split('-')[0]);
      return aPrice - bPrice;
    });
  } else if (sortBy.value === 'price-desc') {
    projects.sort((a, b) => {
      const aPrice = parseInt(a.price.split('-')[0]);
      const bPrice = parseInt(b.price.split('-')[0]);
      return bPrice - aPrice;
    });
  }
  
  return projects;
});

// 切换标签
const toggleTag = (tag: string) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag);
  } else {
    selectedTags.value = [...selectedTags.value, tag];
  }
};
</script>

<style scoped>
/* 保持原有的样式不变 */
</style>