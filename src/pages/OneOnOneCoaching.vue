<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2A3A] star-texture min-h-screen">
    <div>
      <!-- 页面标题 -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-[#4A5059] mb-2">导师一对一</h1>
        <p class="text-[#4A5059]/80 max-w-2xl mx-auto">
          与专业摄影师进行一对一指导，快速提升摄影技能，定制专属学习计划
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
                placeholder="搜索导师、专业领域或技能..."
                v-model="searchTerm"
                class="w-full px-4 py-3 pl-12 bg-[#F5F7FA] border border-[#B8C6D8] text-[#4A5059] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
              />
              <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4A5059]/50"></i>
            </div>
            
            <select
              v-model="sortBy"
              class="px-4 py-3 bg-[#F5F7FA] border border-[#B8C6D8] text-[#4A5059] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option value="recommended">推荐排序</option>
              <option value="rating">评分最高</option>
              <option value="price-asc">价格从低到高</option>
              <option value="price-desc">价格从高到低</option>
              <option value="experience">经验丰富</option>
            </select>
          </div>

          <!-- 导师列表 -->
          <div class="space-y-6">
            <div
              v-for="instructor in filteredInstructors"
              :key="instructor.id"
              v-motion="{ hover: { y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' } }"
              class="bg-[#F5F7FA] rounded-xl overflow-hidden border border-[#B8C6D8] transition-all shadow-sm"
            >
              <!-- 导师封面图 -->
              <div class="relative h-48">
                <img
                  :src="instructor.coverImage"
                  :alt="instructor.name"
                  class="w-full h-full object-cover"
                />
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#F5F7FA] to-transparent p-4">
                  <div class="flex items-center">
                    <img
                      :src="instructor.avatar"
                      :alt="instructor.name"
                      class="w-20 h-20 rounded-full object-cover border-4 border-[#F5F7FA] shadow-md"
                    />
                    <div class="ml-4">
                      <h3 class="text-xl font-bold text-[#4A5059]">{{ instructor.name }}</h3>
                      <p class="text-sm text-[#4A5F8B]">{{ instructor.title }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 导师信息 -->
              <div class="p-5">
                <!-- 导师简介 -->
                <p class="text-sm text-[#4A5059]/80 mb-4">
                  {{ instructor.bio }}
                </p>
                
                <!-- 专业领域 -->
                <div class="mb-4">
                  <h4 class="text-sm font-medium text-[#4A5059] mb-2">专业领域</h4>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(specialty, index) in instructor.specialties"
                      :key="index"
                      class="px-3 py-1 bg-[#E6EBF2] text-[#4A5059] rounded-full text-xs border border-[#B8C6D8]/30"
                    >
                      {{ specialty }}
                    </span>
                  </div>
                </div>
                
                <!-- 统计数据 -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div class="text-center p-3 bg-[#E6EBF2]/50 rounded-lg">
                    <p class="text-lg font-bold text-[#4A5059]">{{ instructor.experience }}</p>
                    <p class="text-xs text-[#4A5059]/70">教学经验</p>
                  </div>
                  <div class="text-center p-3 bg-[#E6EBF2]/50 rounded-lg">
                    <p class="text-lg font-bold text-[#4A5059]">{{ instructor.students }}</p>
                    <p class="text-xs text-[#4A5059]/70">指导学员</p>
                  </div>
                  <div class="text-center p-3 bg-[#E6EBF2]/50 rounded-lg">
                    <p class="text-lg font-bold text-[#4A5059]">{{ instructor.rating }}</p>
                    <p class="text-xs text-[#4A5059]/70">平均评分</p>
                  </div>
                  <div class="text-center p-3 bg-[#E6EBF2]/50 rounded-lg">
                    <p class="text-lg font-bold text-[#4A5059]">{{ instructor.reviews }}</p>
                    <p class="text-xs text-[#4A5059]/70">学员评价</p>
                  </div>
                </div>
                
                <!-- 技能雷达图 -->
                <div class="mb-4">
                  <h4 class="text-sm font-medium text-[#4A5059] mb-2">技能评估</h4>
                  <div class="h-48">
                    <ResponsiveContainer :width="'100%'" :height="'100%'" :children="true">
                      <RadarChart outerRadius="80%" :data="getSkillsRadarData(instructor)">
                        <PolarGrid />
                        <PolarAngleAxis :dataKey="'name'" />
                        <Radar
                          name="技能"
                          :dataKey="'value'"
                          stroke="#4A5F8B"
                          fill="#4A5F8B"
                          fillOpacity="0.6"
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <!-- 价格和可用性 -->
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
                  <div class="flex space-x-4 mb-3 md:mb-0">
                    <div class="text-center">
                      <p class="text-sm text-[#4A5059]/70">线上指导</p>
                      <p class="text-lg font-bold text-[#4A5F8B]">¥{{ instructor.price.online }}/小时</p>
                    </div>
                    <div class="text-center">
                      <p class="text-sm text-[#4A5059]/70">线下带拍</p>
                      <p class="text-lg font-bold text-[#4A5F8B]">¥{{ instructor.price.offline }}/小时</p>
                    </div>
                  </div>
                  <div class="text-sm text-[#4A5059]">
                    <span class="font-medium">可用时间：</span>
                    {{ instructor.availableSlots.join('、') }}
                  </div>
                </div>
                
                <!-- 作品集预览 -->
                <div class="mb-4">
                  <h4 class="text-sm font-medium text-[#4A5059] mb-2">代表作品</h4>
                  <div class="flex space-x-2 overflow-x-auto pb-2">
                    <div v-for="(image, imgIndex) in instructor.portfolio" :key="image" class="w-20 h-20 flex-shrink-0">
                      <img
                        :src="image"
                        :alt="`作品 ${imgIndex + 1}`"
                        class="w-full h-full object-cover rounded-lg border border-[#B8C6D8]"
                      />
                    </div>
                  </div>
                </div>
                
                <!-- 操作按钮 -->
                <div class="flex space-x-3">
                  <RouterLink
                    :to="`/instructor/${instructor.id}`"
                    class="flex-1 py-2 text-center bg-[#E6EBF2] text-[#4A5059] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#B8C6D8]"
                  >
                    查看详情
                  </RouterLink>
                  <button class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#4A5059] transition-colors">
                    预约指导
                  </button>
                </div>
              </div>
            </div>
            
            <div v-if="filteredInstructors.length === 0" class="p-8 bg-[#F5F7FA] rounded-xl border border-[#B8C6D8] text-center">
              <div class="w-16 h-16 bg-[#E6EBF2] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
                <i class="fa-solid fa-search text-2xl"></i>
              </div>
              <h3 class="text-lg font-medium text-[#4A5059] mb-2">未找到相关导师</h3>
              <p class="text-[#4A5059]/70">
                请尝试使用不同的关键词或筛选条件
              </p>
            </div>
          </div>
          
          <!-- 分页 -->
          <div v-if="filteredInstructors.length > 0" class="flex justify-center">
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
              <button class="px-3 py-2 rounded border border-[#B8C6D8] text-[#4A5059] hover:bg-[#F5F7FA] transition-colors">
                3
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
          <!-- 导师筛选 -->
          <div class="bg-[#F5F7FA] rounded-xl p-6 shadow-sm border border-[#B8C6D8]">
            <h3 class="text-lg font-bold mb-4 text-[#4A5059]">筛选条件</h3>
            
            <!-- 专业领域 -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-[#4A5059] mb-3">专业领域</h4>
              <div class="space-y-2">
                <div v-for="specialty in specialties" :key="specialty" class="flex items-center">
                  <input
                    type="radio"
                    :id="`specialty-${specialty}`"
                    name="specialty"
                    :checked="selectedSpecialty === specialty"
                    @change="() => selectedSpecialty = specialty"
                    class="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#B8C6D8] bg-[#E6EBF2]"
                  />
                  <label
                    :for="`specialty-${specialty}`"
                    class="ml-2 text-sm text-[#4A5059]"
                  >
                    {{ specialty }}
                  </label>
                </div>
              </div>
            </div>
            
            <!-- 指导类型 -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-[#4A5059] mb-3">指导类型</h4>
              <div class="space-y-2">
                <div v-for="type in coachingTypes" :key="type" class="flex items-center">
                  <input
                    type="radio"
                    :id="`type-${type}`"
                    name="coaching-type"
                    :checked="selectedType === type"
                    @change="() => selectedType = type"
                    class="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#B8C6D8] bg-[#E6EBF2]"
                  />
                  <label
                    :for="`type-${type}`"
                    class="ml-2 text-sm text-[#4A5059]"
                  >
                    {{ type }}
                  </label>
                </div>
              </div>
            </div>
            
            <!-- 价格范围 -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-[#4A5059] mb-3">价格范围</h4>
              <div class="space-y-2">
                <div v-for="range in priceRanges" :key="range" class="flex items-center">
                  <input
                    type="radio"
                    :id="`price-${range}`"
                    name="price-range"
                    :checked="selectedPriceRange === range"
                    @change="() => selectedPriceRange = range"
                    class="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#B8C6D8] bg-[#E6EBF2]"
                  />
                  <label
                    :for="`price-${range}`"
                    class="ml-2 text-sm text-[#4A5059]"
                  >
                    {{ range }}
                  </label>
                </div>
              </div>
            </div>
            
            <!-- 应用筛选按钮 -->
            <button class="w-full py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#4A5059] transition-colors">
              应用筛选
            </button>
          </div>
          
          <!-- 为什么选择一对一指导 -->
          <div class="bg-[#F5F7FA] rounded-xl p-6 shadow-sm border border-[#B8C6D8]">
            <h3 class="text-lg font-bold mb-4 text-[#4A5059]">为什么选择一对一指导</h3>
            <div class="space-y-3">
              <div class="flex items-start">
                <div class="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3 flex-shrink-0">
                  <i class="fa-solid fa-bullseye"></i>
                </div>
                <div>
                  <h4 class="font-medium text-[#4A5059] mb-1">针对性指导</h4>
                  <p class="text-sm text-[#4A5059]/70">
                    根据个人水平和需求，定制专属学习计划，解决实际问题
                  </p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3 flex-shrink-0">
                  <i class="fa-solid fa-graduation-cap"></i>
                </div>
                <div>
                  <h4 class="font-medium text-[#4A5059] mb-1">快速提升</h4>
                  <p class="text-sm text-[#4A5059]/70">
                    直接向专业摄影师学习，避免走弯路，加速技能提升
                  </p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3 flex-shrink-0">
                  <i class="fa-solid fa-comments"></i>
                </div>
                <div>
                  <h4 class="font-medium text-[#4A5059] mb-1">即时反馈</h4>
                  <p class="text-sm text-[#4A5059]/70">
                    获得实时反馈和建议，及时调整拍摄思路和技术
                  </p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3 flex-shrink-0">
                  <i class="fa-solid fa-handshake"></i>
                </div>
                <div>
                  <h4 class="font-medium text-[#4A5059] mb-1">建立联系</h4>
                  <p class="text-sm text-[#4A5059]/70">
                    与行业专业人士建立联系，获取更多创作和发展机会
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 指导流程 -->
          <div class="bg-[#F5F7FA] rounded-xl p-6 shadow-sm border border-[#B8C6D8]">
            <h3 class="text-lg font-bold mb-4 text-[#4A5059]">指导流程</h3>
            <div class="space-y-4 relative before:absolute before:content-[''] before:left-4 before:top-[25px] before:bottom-[25px] before:w-0.5 before:bg-[#B8C6D8]">
              <div class="relative flex">
                <div class="w-8 h-8 rounded-full bg-[#4A5F8B] text-white flex items-center justify-center mr-3 z-10">
                  <span>1</span>
                </div>
                <div>
                  <h4 class="font-medium text-[#4A5059] mb-1">选择导师</h4>
                  <p class="text-sm text-[#4A5059]/70">
                    根据专业领域、评价和价格选择合适的导师
                  </p>
                </div>
              </div>
              <div class="relative flex">
                <div class="w-8 h-8 rounded-full bg-[#4A5F8B] text-white flex items-center justify-center mr-3 z-10">
                  <span>2</span>
                </div>
                <div>
                  <h4 class="font-medium text-[#4A5059] mb-1">提交需求</h4>
                  <p class="text-sm text-[#4A5059]/70">
                    填写期望学习的内容和目标，帮助导师了解你的需求
                  </p>
                </div>
              </div>
              <div class="relative flex">
                <div class="w-8 h-8 rounded-full bg-[#4A5F8B] text-white flex items-center justify-center mr-3 z-10">
                  <span>3</span>
                </div>
                <div>
                  <h4 class="font-medium text-[#4A5059] mb-1">支付定金</h4>
                  <p class="text-sm text-[#4A5059]/70">
                    支付30%的定金，确认预约
                  </p>
                </div>
              </div>
              <div class="relative flex">
                <div class="w-8 h-8 rounded-full bg-[#4A5F8B] text-white flex items-center justify-center mr-3 z-10">
                  <span>4</span>
                </div>
                <div>
                  <h4 class="font-medium text-[#4A5059] mb-1">确认时间</h4>
                  <p class="text-sm text-[#4A5059]/70">
                    与导师确认具体的指导时间和方式
                  </p>
                </div>
              </div>
              <div class="relative flex">
                <div class="w-8 h-8 rounded-full bg-[#4A5F8B] text-white flex items-center justify-center mr-3 z-10">
                  <span>5</span>
                </div>
                <div>
                  <h4 class="font-medium text-[#4A5059] mb-1">完成指导</h4>
                  <p class="text-sm text-[#4A5059]/70">
                    接受导师指导，完成学习内容
                  </p>
                </div>
              </div>
              <div class="relative flex">
                <div class="w-8 h-8 rounded-full bg-[#4A5F8B] text-white flex items-center justify-center mr-3 z-10">
                  <span>6</span>
                </div>
                <div>
                  <h4 class="font-medium text-[#4A5059] mb-1">评价反馈</h4>
                  <p class="text-sm text-[#4A5059]/70">
                    支付余款并对导师进行评价，分享学习体验
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 常见问题 -->
          <div class="bg-[#F5F7FA] rounded-xl p-6 shadow-sm border border-[#B8C6D8]">
            <h3 class="text-lg font-bold mb-4 text-[#4A5059]">常见问题</h3>
            <div class="space-y-4">
              <div>
                <h4 class="font-medium text-[#4A5059] mb-1">如何选择适合我的导师？</h4>
                <p class="text-sm text-[#4A5059]/70">
                  可以根据导师的专业领域、评价、教学经验和价格等因素进行选择，建议先查看导师的作品集和详细介绍。
                </p>
              </div>
              <div>
                <h4 class="font-medium text-[#4A5059] mb-1">线上指导和线下带拍有什么区别？</h4>
                <p class="text-sm text-[#4A5059]/70">
                  线上指导通过视频通话进行作品点评和技术讲解，时间灵活；线下带拍则是跟随导师外出拍摄，获得实时指导和实践经验。
                </p>
              </div>
              <div>
                <h4 class="font-medium text-[#4A5059] mb-1">如果临时有事可以取消预约吗？</h4>
                <p class="text-sm text-[#4A5059]/70">
                  可以在预约开始前24小时取消，定金将全额退还；24小时内取消，定金将扣除50%作为违约金。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

// 模拟导师数据
const mockInstructors = [
  {
    id: 't1',
    name: '李明',
    title: '风光摄影导师',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20male%20professional%20outdoor&sign=40c357e2b6e150256acfb8f243e292fd',
    coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=landscape%20photography%20master%20workshop%20mountain%20view&sign=c11aa40a3e0184b247944895ec34c214',
    bio: '国家地理认证摄影师，15年风光摄影经验，擅长雪山、湖泊、星空等自然景观拍摄，已指导超过500名摄影爱好者。',
    specialties: ['风光摄影', '星空摄影', '后期修图', '构图指导'],
    experience: '15年',
    students: 1254,
    rating: 4.9,
    reviews: 432,
    price: {
      online: 399, // 线上指导价格/小时
      offline: 899, // 线下指导价格/小时
    },
    availableSlots: ['周一', '周三', '周五', '周六'],
    portfolio: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=landscape%20photography%20mountain%20lake%20sunset&sign=8bbb440e7f682233aac63291ce55e255',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=star%20photography%20night%20sky%20milky%20way&sign=6a7f85cdf8260946438af6a14f791e2b',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=waterfall%20long%20exposure%20misty%20forest&sign=9cb719c1dae2252ef32547b8ae566784',
    ],
    skills: {
      photography: 9.8,
      teaching: 9.7,
      communication: 9.5,
      patience: 9.6,
      technicalKnowledge: 9.9,
    }
  },
  {
    id: 't2',
    name: '张婷',
    title: '人像摄影导师',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=portrait%20photographer%20female%20professional%20studio&sign=0c00c5f05df90880252f980b049fe44f',
    coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=portrait%20photography%20workshop%20studio%20lighting&sign=74773791a8eb7b39af923086b45e27e1',
    bio: '时尚杂志签约摄影师，12年人像摄影经验，擅长商业人像、时尚写真和婚礼摄影，曾为多位明星拍摄封面。',
    specialties: ['人像摄影', '布光技巧', '模特引导', '商业摄影'],
    experience: '12年',
    students: 987,
    rating: 4.8,
    reviews: 321,
    price: {
      online: 499,
      offline: 999,
    },
    availableSlots: ['周二', '周四', '周六', '周日'],
    portfolio: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=fashion%20portrait%20studio%20lighting%20model&sign=d4e7f86bbb4253d3c401c3cf5ce35f75',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=natural%20light%20portrait%20outdoor%20female&sign=3e572772b63b0ecaf4957ab5f5811a00',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=wedding%20photography%20couple%20romantic%20moment&sign=1ad38c75572983c46a6dc4e48a187579',
    ],
    skills: {
      photography: 9.7,
      teaching: 9.6,
      communication: 9.8,
      patience: 9.5,
      technicalKnowledge: 9.7,
    }
  },
  {
    id: 't3',
    name: '王强',
    title: '后期修图导师',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photo%20editor%20male%20professional%20workstation&sign=bcd668474e2f710618deaf25b9036a6c',
    coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=photo%20editing%20workshop%20post-processing%20tutorial&sign=8126c958d436c2ae320338f0c114a87c',
    bio: 'Adobe认证讲师，10年后期修图经验，擅长商业修图、人像精修和创意合成，出版过多本后期教程书籍。',
    specialties: ['后期修图', 'Lightroom', 'Photoshop', '商业修图'],
    experience: '10年',
    students: 1567,
    rating: 4.9,
    reviews: 543,
    price: {
      online: 349,
      offline: 799,
    },
    availableSlots: ['周一', '周二', '周四', '周五'],
    portfolio: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=photo%20retouching%20before%20after%20comparison&sign=d34f470c6b9ea3c92b71db347b6393a8',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=creative%20photo%20manipulation%20digital%20art&sign=4782a5998bc6375bc48097845e7ac754',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=commercial%20product%20photo%20editing%20studio&sign=17217e3464121e858b92ea1f58574a14',
    ],
    skills: {
      photography: 9.5,
      teaching: 9.8,
      communication: 9.7,
      patience: 9.6,
      technicalKnowledge: 9.9,
    }
  },
  {
    id: 't4',
    name: '陈明',
    title: '街头人文导师',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=street%20photographer%20male%20urban%20explorer&sign=04b29bd56dafee8a6fcb66ebf36c2ca6',
    coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=street%20photography%20workshop%20urban%20documentary&sign=ec47e157ee26a5691af1bb8a160b9bce',
    bio: '国际街头摄影奖得主，8年街头摄影经验，擅长捕捉城市瞬间、人文故事和纪实摄影，作品曾在多个国家展出。',
    specialties: ['街头摄影', '人文纪实', '瞬间捕捉', '黑白摄影'],
    experience: '8年',
    students: 765,
    rating: 4.8,
    reviews: 234,
    price: {
      online: 399,
      offline: 899,
    },
    availableSlots: ['周三', '周五', '周六', '周日'],
    portfolio: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=street%20photography%20urban%20moment%20black%20white&sign=b86c7702102cef481d97c375181ed929',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=documentary%20photography%20street%20life%20city&sign=f75b5911724b702f43d140e6fa48aa18',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=candid%20photography%20people%20interaction%20urban&sign=742c86694fece82caea3643d45b9fe60',
    ],
    skills: {
      photography: 9.7,
      teaching: 9.5,
      communication: 9.6,
      patience: 9.4,
      technicalKnowledge: 9.6,
    }
  },
]

// 导师专业领域
const specialties = [
  '全部', '风光摄影', '人像摄影', '后期修图', '街头摄影', '商业摄影', '星空摄影', '建筑摄影', '黑白摄影', '儿童摄影'
]

// 指导类型
const coachingTypes = [
  '全部', '线上指导', '线下带拍', '作品点评', '技术答疑', '创作方案规划'
]

// 价格范围
const priceRanges = [
  '全部', '300元以下', '300-500元', '500-800元', '800元以上'
]

// 响应式状态
const selectedSpecialty = ref('全部')
const selectedType = ref('全部')
const selectedPriceRange = ref('全部')
const searchTerm = ref('')
const sortBy = ref('recommended') // recommended, rating, price-asc, price-desc, experience

// 过滤导师
const filteredInstructors = computed(() => {
  let instructors = [...mockInstructors]
  
  // 按专业领域过滤
  if (selectedSpecialty.value !== '全部') {
    instructors = instructors.filter(instructor => 
      instructor.specialties.includes(selectedSpecialty.value)
    )
  }
  
  // 按指导类型过滤
  if (selectedType.value !== '全部') {
    // 这里简化处理，实际应用中可能需要更复杂的逻辑
    // 假设所有导师都提供所有类型的指导
  }
  
  // 按价格范围过滤
  if (selectedPriceRange.value !== '全部') {
    instructors = instructors.filter(instructor => {
      const price = instructor.price.online // 以线上价格为例进行筛选
      switch(selectedPriceRange.value) {
        case '300元以下':
          return price < 300
        case '300-500元':
          return price >= 300 && price <= 500
        case '500-800元':
          return price > 500 && price <= 800
        case '800元以上':
          return price > 800
        default:
          return true
      }
    })
  }
  
  // 按搜索词过滤
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    instructors = instructors.filter(instructor => 
      instructor.name.toLowerCase().includes(term) || 
      instructor.title.toLowerCase().includes(term) ||
      instructor.bio.toLowerCase().includes(term) ||
      instructor.specialties.some(s => s.toLowerCase().includes(term))
    )
  }
  
  // 排序
  if (sortBy.value === 'rating') {
    instructors.sort((a, b) => b.rating - a.rating)
  } else if (sortBy.value === 'price-asc') {
    instructors.sort((a, b) => a.price.online - b.price.online)
  } else if (sortBy.value === 'price-desc') {
    instructors.sort((a, b) => b.price.online - a.price.online)
  } else if (sortBy.value === 'experience') {
    instructors.sort((a, b) => parseInt(b.experience) - parseInt(a.experience))
  }
  
  return instructors
})

// 获取导师技能雷达图数据
const getSkillsRadarData = (instructor: any) => {
  if (!instructor.skills) return []
  
  return Object.entries(instructor.skills).map(([key, value]) => ({
    name: translateSkill(key),
    value: value
  }))
}

// 技能名称翻译
const translateSkill = (skill: string) => {
  const translations: {[key: string]: string} = {
    photography: '摄影技术',
    teaching: '教学能力',
    communication: '沟通能力',
    patience: '耐心度',
    technicalKnowledge: '专业知识',
  }
  
  return translations[skill] || skill
}


</script>

<style scoped>
/* 样式已通过Tailwind CSS类实现，无需额外CSS */
</style>