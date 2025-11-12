<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5 }"
    >
      <!-- 页面标题 -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">器材数据库</h1>
        <p class="text-[#B8C6D8] max-w-2xl mx-auto">
          探索专业摄影器材的详细参数、实测性能和用户评价，为您的创作选择最合适的工具
        </p>
      </div>

      <div v-if="!isComparisonMode">
        <!-- 搜索和筛选 -->
        <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
          <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div class="relative flex-1">
              <input
                type="text"
                placeholder="搜索器材型号、品牌或功能..."
                :value="searchTerm"
                @input="(e) => searchTerm = (e.target as HTMLInputElement).value"
                class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
              />
              <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
            </div>
            
            <select
              :value="selectedBrand"
              @change="(e) => selectedBrand = (e.target as HTMLSelectElement).value"
              class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
            </select>
          </div>
        </div>

        <!-- 器材类型选择 -->
        <div class="grid grid-cols-3 gap-4 mb-8">
          <motion.button
            v-for="type in equipmentTypes"
            :key="type.id"
            :whileHover="{ y: -5 }"
            @click="() => activeType = type.id"
            :class="[
              'py-4 rounded-xl flex flex-col items-center justify-center transition-all',
              activeType === type.id
                ? 'bg-[#4A5F8B] border-2 border-[#4A5F8B] text-[#F5F7FA] shadow-md'
                : 'bg-[#2D3748] border border-[#4A5F8B] text-[#B8C6D8] hover:border-[#4A5F8B]'
            ]"
          >
            <i :class="`fa-solid ${type.icon} text-2xl mb-2 text-[#F5F7FA]`"></i>
            <span class="font-medium">{{ type.name }}</span>
          </motion.button>
        </div>

        <!-- 对比工具栏 -->
        <div v-if="selectedItems.length > 0" class="fixed bottom-0 left-0 right-0 bg-[#2D3748] border-t border-[#4A5F8B] py-3 px-4 z-50 flex items-center justify-between shadow-lg">
          <div class="flex items-center">
            <i class="fa-solid fa-balance-scale text-[#4A5F8B] mr-2"></i>
            <span class="text-[#F5F7FA]">已选择 {{ selectedItems.length }}/3 件器材进行对比</span>
          </div>
          <motion.button
            :hover="{ scale: 1.05 }"
            :tap="{ scale: 0.95 }"
            @click="viewComparison"
            class="px-6 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#4A5F8B] transition-colors"
          >
            查看对比
          </motion.button>
        </div>

        <!-- 器材列表 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          <motion.div
            v-for="item in filteredEquipment"
            :key="item.id"
            :hover="{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }"
            class="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm"
          >
            <!-- 器材图片和对比选择 -->
            <div class="relative">
              <img
                :src="item.image"
                :alt="item.name"
                class="w-full h-48 object-cover"
              />
              <button
                @click="toggleCompareItem(item.id)"
                :class="[
                  'absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-colors',
                  selectedItems.includes(item.id)
                    ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                    : 'bg-[#2D3748]/80 text-[#B8C6D8]'
                ]"
                :title="selectedItems.includes(item.id) ? '取消对比' : '添加对比'"
              >
                <i :class="`fa-solid ${selectedItems.includes(item.id) ? 'fa-check' : 'fa-plus'}`"></i>
              </button>
            </div>
            
            <!-- 器材信息 -->
            <div class="p-5 bg-[#2D3748]">
              <!-- 品牌和类型 -->
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-[#6B7C93] font-medium">{{ item.brand }}</span>
                <span class="text-xs px-2 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full border border-[#4A5F8B]">{{ item.type }}</span>
              </div>
              
              <!-- 器材名称和价格 -->
              <h3 class="text-lg font-bold text-[#F5F7FA] mb-2">{{ item.name }}</h3>
              <p class="text-[#6B7C93] mb-4">¥{{ parseInt(item.price).toLocaleString() }}</p>
              
              <!-- 评分 -->
              <div class="flex items-center mb-4">
                <div class="flex items-center mr-2">
                  <i
                    v-for="i in 5"
                    :key="i"
                    :class="`fa-solid fa-star ${
                      i < Math.floor(item.rating / 2)
                        ? 'text-[#4A5F8B]'
                        : 'text-[#B8C6D8]'
                    }`"
                  ></i>
                </div>
                <span class="text-sm text-[#6B7C93]">{{ item.rating }}/10 ({{ item.reviewCount }} 评价)</span>
              </div>
              
              <!-- 适用场景标签 -->
              <div class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="(scenario, index) in item.suitableFor.slice(0, 3)"
                  :key="index"
                  class="px-2 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B]"
                >
                  {{ scenario }}
                </span>
              </div>
              
              <!-- 详情按钮 -->
              <RouterLink
                :to="`/equipment/${item.id}`"
                class="block w-full py-2 text-center bg-gradient-to-r from-[#4A5F8B] to-[#2D3748] text-[#F5F7FA] rounded-lg font-medium transition-colors border border-[#4A5F8B]"
              >
                查看详情
              </RouterLink>
            </div>
          </motion.div>
          
          <div v-if="filteredEquipment.length === 0" class="col-span-full p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
            <div class="w-16 h-16 bg-[#2D3748] rounded-full flex items-center justify-center text-[#63B3ED] mx-auto mb-4 border border-[#4A5F8B]">
              <i class="fa-solid fa-search text-2xl"></i>
            </div>
            <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">未找到相关器材</h3>
            <p class="text-[#B8C6D8]">
              请尝试调整筛选条件或搜索其他关键词
            </p>
          </div>
        </div>
      </div>

      <!-- 对比模式 -->
      <div v-else class="mb-8">
        <!-- 返回按钮 -->
        <button
          @click="isComparisonMode = false"
          class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors mb-6"
        >
          <i class="fa-solid fa-arrow-left"></i>
          <span>返回器材列表</span>
        </button>
        
        <!-- 对比标题 -->
        <h2 class="text-2xl font-bold text-[#F5F7FA] mb-6">器材对比</h2>
        
        <!-- 对比表格 -->
        <div class="bg-[#2D3748] rounded-xl border border-[#4A5F8B] overflow-hidden mb-8">
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="bg-[#2D3748] border-b border-[#4A5F8B]">
                  <th class="px-6 py-4 text-left text-sm font-medium text-[#F5F7FA]">参数</th>
                  <th v-for="item in comparisonData" :key="item.id" class="px-6 py-4 text-left text-sm font-medium text-[#F5F7FA]">
                    <div class="flex items-center">
                      <button
                        @click="toggleCompareItem(item.id)"
                        class="w-5 h-5 rounded-full flex items-center justify-center bg-[#2D3748] text-[#4A5F8B] mr-2 text-xs"
                        title="移除对比"
                      >
                        <i class="fa-solid fa-times"></i>
                      </button>
                      <div>
                        <p class="font-bold text-[#F5F7FA]">{{ item.name }}</p>
                        <p class="text-xs text-[#B8C6D8]">{{ item.brand }}</p>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <!-- 器材图片 -->
                <tr class="border-b border-[#4A5F8B]">
                  <td class="px-6 py-4 text-sm text-[#F5F7FA] font-medium">外观</td>
                  <td v-for="(item, index) in comparisonData" :key="index" class="px-6 py-4 text-[#F5F7FA]">
                    <img
                      :src="item.image"
                      :alt="item.name"
                      class="w-24 h-16 object-cover rounded border border-[#4A5F8B]"
                    />
                  </td>
                </tr>
                
                <!-- 价格 -->
                <tr class="border-b border-[#4A5F8B]">
                  <td class="px-6 py-4 text-sm text-[#F5F7FA] font-medium">价格</td>
                  <td v-for="(item, index) in comparisonData" :key="index" :class="[
                    'px-6 py-4 text-sm',
                    comparisonData.length > 1 && 
                    item.price === Math.min(...comparisonData.map(i => parseInt(i.price))).toString()
                      ? 'bg-[#4A5F8B] font-medium text-[#F5F7FA]'
                      : 'text-[#F5F7FA]'
                  ]">
                    ¥{{ parseInt(item.price).toLocaleString() }}
                  </td>
                </tr>
                
                <!-- 主要规格 -->
                <template v-if="comparisonData[0]?.specs && Object.keys(comparisonData[0].specs).length > 0">
                  <tr v-for="(_, rowIndex) in Object.entries(comparisonData[0].specs)" :key="rowIndex" class="border-b border-[#4A5F8B]">
                    <td class="px-6 py-4 text-sm text-[#F5F7FA] font-medium">
                      {{ translateSpecKey(Object.keys(comparisonData[0].specs)[rowIndex]) }}
                    </td>
                    <td v-for="(item, index) in comparisonData" :key="index" class="px-6 py-4 text-sm text-[#F5F7FA]">
                      {{ item.specs && item.specs[Object.keys(comparisonData[0].specs)[rowIndex]] }}
                    </td>
                  </tr>
                </template>
                
                <!-- 优缺点 -->
                <tr class="border-b border-[#4A5F8B]">
                  <td class="px-6 py-4 text-sm text-[#F5F7FA] font-medium">优点</td>
                  <td v-for="(item, index) in comparisonData" :key="index" class="px-6 py-4 text-sm text-[#F5F7FA]">
                    <ul class="list-disc pl-5 space-y-1">
                      <li v-for="(pro, i) in item.pros.slice(0, 3)" :key="i">{{ pro }}</li>
                    </ul>
                  </td>
                </tr>
                <tr class="border-b border-[#4A5F8B]">
                  <td class="px-6 py-4 text-sm text-[#F5F7FA] font-medium">缺点</td>
                  <td v-for="(item, index) in comparisonData" :key="index" class="px-6 py-4 text-sm text-[#F5F7FA]">
                    <ul class="list-disc pl-5 space-y-1">
                      <li v-for="(con, i) in item.cons.slice(0, 3)" :key="i">{{ con }}</li>
                    </ul>
                  </td>
                </tr>
                
                <!-- 适用场景 -->
                <tr class="border-b border-[#4A5F8B]">
                  <td class="px-6 py-4 text-sm text-[#F5F7FA] font-medium">适用场景</td>
                  <td v-for="(item, index) in comparisonData" :key="index" class="px-6 py-4 text-sm text-[#F5F7FA]">
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="(scenario, i) in item.suitableFor"
                        :key="i"
                        class="px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-xs"
                      >
                        {{ scenario }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- 性能对比雷达图 -->
        <div v-if="comparisonData.length > 0" class="bg-[#2D3748] rounded-xl border border-[#4A5F8B] p-6 mb-8">
          <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">性能对比</h3>
          <div class="h-80">
            <ResponsiveContainer :width="'100%'" :height="'100%'" :children="true">
              <RadarChart :outerRadius="90" :data="radarData">
                <PolarGrid stroke="#4A5F8B" />
                <PolarAngleAxis dataKey="category" :tick="{ fill: '#B8C6D8', fontSize: 12 }" />
                <Radar
                  v-for="(item, index) in comparisonData"
                  :key="index"
                  :name="item.name"
                  :dataKey="`item${index + 1}`"
                  :stroke="COLORS[index % COLORS.length]"
                  :fill="COLORS[index % COLORS.length]"
                  :fillOpacity="0.3"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div class="flex justify-center mt-4 space-x-6">
            <div v-for="(item, index) in comparisonData" :key="index" class="flex items-center">
              <span
                class="w-3 h-3 rounded-full mr-2"
                :style="{ backgroundColor: COLORS[index % COLORS.length] }"
              ></span>
              <span class="text-sm text-[#F5F7FA]">{{ item.name }}</span>
            </div>
          </div>
        </div>
        
        <!-- 推荐购买链接 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="(item, index) in comparisonData" :key="index" class="bg-[#2D3748] rounded-xl border border-[#4A5F8B] p-4">
            <h4 class="text-md font-medium text-[#F5F7FA] mb-3">{{ item.name }}</h4>
            <p class="text-lg font-bold text-[#F5F7FA] mb-4">¥{{ parseInt(item.price).toLocaleString() }}</p>
            <div class="flex justify-between">
              <RouterLink
                :to="`/equipment/${item.id}`"
                class="px-4 py-2 bg-[#2D3748] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors text-sm border border-[#4A5F8B]"
              >
                查看详情
              </RouterLink>
              <button class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#4A5F8B] transition-colors text-sm border border-[#4A5F8B]">
                立即购买
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    
    <!-- 3D模型展示弹窗 -->
    <div v-if="show3DModel" class="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div class="bg-[#2D3748] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-[#4A5F8B]">
        <div class="flex justify-between items-center p-4 border-b border-[#4A5F8B]">
          <h3 class="text-xl font-bold text-[#F5F7FA]">3D模型展示</h3>
          <button @click="show3DModel = false" class="text-[#6B7C93] hover:text-[#F5F7FA]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4">
          <!-- 3D模型展示区域 -->
          <div class="bg-[#1E2532] rounded-lg h-[60vh] flex items-center justify-center">
            <div class="text-center">
              <div class="text-5xl mb-4">🔄</div>
              <h4 class="text-xl font-bold text-[#F5F7FA] mb-2">3D交互模型</h4>
              <p class="text-[#B8C6D8]">拖动可360°旋转查看器材细节</p>
              <p class="mt-4 text-sm text-[#6B7C93]">（模拟3D模型加载中...）</p>
            </div>
          </div>
          <div class="mt-4 grid grid-cols-3 gap-2">
            <button class="px-3 py-1 bg-[#2D3748] border border-[#4A5F8B] rounded text-sm text-[#F5F7FA] hover:bg-[#4A5F8B] transition-colors">正面视图</button>
            <button class="px-3 py-1 bg-[#2D3748] border border-[#4A5F8B] rounded text-sm text-[#F5F7FA] hover:bg-[#4A5F8B] transition-colors">侧面视图</button>
            <button class="px-3 py-1 bg-[#2D3748] border border-[#4A5F8B] rounded text-sm text-[#F5F7FA] hover:bg-[#4A5F8B] transition-colors">俯视图</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { motion } from 'motion-v'
import { RouterLink } from 'vue-router'

// 模拟器材数据
const mockCameras = [
  {
    id: '1',
    name: 'Sony A7R V',
    type: '微单',
    brand: 'Sony',
    price: '26999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20a7rv%20mirrorless%20camera%20professional%20photography&sign=6b099a6dd31856f91c56e9cc8bcfe622',
    specs: {
      sensor: '6100万像素全画幅CMOS',
      processor: 'BIONZ XR',
      iso: '100-32000 (可扩展至50-102400)',
      autofocus: '693点相位检测+425点对比度检测',
      video: '8K 24p / 4K 60p',
      battery: 'NP-FZ100 (约520张)',
      weight: '657g'
    },
    performance: {
      dynamicRange: 9.5,
      lowLight: 9.0,
      autofocus: 9.8,
      ergonomics: 8.5,
      buildQuality: 9.2,
      valueForMoney: 8.7
    },
    pros: ['高分辨率传感器', '出色的自动对焦系统', '优秀的图像质量', '专业视频功能'],
    cons: ['价格较高', '电池续航一般', '体积相对较大'],
    suitableFor: ['风景摄影', '商业摄影', '人像摄影', '视频创作'],
    rating: 9.4,
    reviewCount: 124,
    tags: ['全画幅', '高像素', '专业', '视频']
  },
  // ... 其他相机数据
]

const mockLenses = [
  {
    id: 'l1',
    name: 'Sony FE 24-70mm F2.8 GM II',
    type: '变焦镜头',
    brand: 'Sony',
    price: '19999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20fe%2024-70mm%20f2.8%20gm%20ii%20lens%20professional&sign=cf947b7d5153c26105db97fef95b85ef',
    specs: {
      focalLength: '24-70mm',
      aperture: 'F2.8',
      mount: 'Sony E',
      construction: '16组21片（含3片XA、1片ED、2片Super ED镜片）',
      filterSize: '82mm',
      weight: '695g',
      minFocusDistance: '0.38m'
    },
    performance: {
      sharpness: 9.8,
      bokeh: 9.2,
      autofocus: 9.7,
      buildQuality: 9.5,
      handling: 9.0,
      valueForMoney: 8.5
    },
    pros: ['出色的锐度', '快速安静的自动对焦', '轻巧的体积', '优秀的光学素质'],
    cons: ['价格昂贵', '滤镜尺寸大', '全焦段F2.8稍重'],
    suitableFor: ['商业摄影', '人像摄影', '婚礼摄影', '风光摄影'],
    rating: 9.6,
    reviewCount: 89,
    tags: ['全画幅', '大三元', '标准变焦', '专业']
  },
  // ... 其他镜头数据
]

const mockAccessories = [
  {
    id: 'a1',
    name: 'Gitzo GT3543LS Systematic碳纤维三脚架',
    type: '三脚架',
    brand: 'Gitzo',
    price: '8999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=gitzo%20tripod%20carbon%20fiber%20professional&sign=1c0fe9951c0482da7c884f40006d4717',
    specs: {
      material: '碳纤维',
      maximumHeight: '170cm',
      minimumHeight: '11cm',
      weight: '1.95kg',
      loadCapacity: '30kg',
      sections: '4节'
    },
    performance: {
      stability: 9.8,
      buildQuality: 9.9,
      portability: 8.5,
      versatility: 9.0,
      valueForMoney: 8.0
    },
    pros: ['超高稳定性', '轻巧便携', '坚固耐用', '精准的调节'],
    cons: ['价格昂贵', '调节稍复杂', '收纳长度较长'],
    suitableFor: ['风景摄影', '长时间曝光', '微距摄影', '视频拍摄'],
    rating: 9.5,
    reviewCount: 43,
    tags: ['专业', '碳纤维', '稳定', '高端']
  },
  // ... 其他配件数据
]

// 品牌列表
const brands = ['全部', 'Sony', 'Canon', 'Nikon', 'Fujifilm', 'Panasonic', 'Leica', 'Sigma', 'Tamron', 'DJI']

// 器材类型
const equipmentTypes = [
  { id: 'cameras', name: '相机', icon: 'fa-camera' },
  { id: 'lenses', name: '镜头', icon: 'fa-video' },
  { id: 'accessories', name: '配件', icon: 'fa-toolbox' }
]

// 颜色配置
const COLORS = ['#4A5F8B', '#8884d8', '#B8C6D8', '#E6EBF2']

// 响应式状态
const activeType = ref('cameras')
const selectedBrand = ref('全部')
const selectedItems = ref<string[]>([])
const isComparisonMode = ref(false)
const searchTerm = ref('')

// 过滤器材
const filteredEquipment = computed(() => {
  let equipment = []
  
  switch(activeType.value) {
    case 'cameras':
      equipment = mockCameras
      break
    case 'lenses':
      equipment = mockLenses
      break
    case 'accessories':
      equipment = mockAccessories
      break
    default:
      equipment = mockCameras
  }
  
  // 按品牌过滤
  if (selectedBrand.value !== '全部') {
    equipment = equipment.filter(item => item.brand === selectedBrand.value)
  }
  
  // 按搜索词过滤
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    equipment = equipment.filter(item => 
      item.name.toLowerCase().includes(term) || 
      item.brand.toLowerCase().includes(term) ||
      (item.type && item.type.toLowerCase().includes(term))
    )
  }
  
  return equipment
})

// 获取对比数据
const comparisonData = computed(() => {
  let allEquipment: any[] = [...mockCameras, ...mockLenses, ...mockAccessories]
  return selectedItems.value.map(id => allEquipment.find(item => item.id === id)).filter(Boolean)
})

// 获取性能雷达图数据
const radarData = computed(() => {
  const items = comparisonData.value
  if (!items || items.length === 0) return []
  
  const radarData: any[] = []
  const categories = Object.keys(items[0].performance)
  
  categories.forEach(category => {
    const dataPoint: any = { category: translateCategory(category) }
    items.forEach((item, index) => {
      dataPoint[`item${index + 1}`] = item.performance[category as keyof typeof item.performance] || 0
    })
    radarData.push(dataPoint)
  })
  
  return radarData
})

// 分类名称翻译
const translateCategory = (category: string) => {
  const translations: {[key: string]: string} = {
    dynamicRange: '动态范围',
    lowLight: '弱光性能',
    autofocus: '自动对焦',
    ergonomics: '人体工学',
    buildQuality: '做工质量',
    valueForMoney: '性价比',
    sharpness: '锐度',
    bokeh: '虚化效果',
    handling: '操控性',
    stability: '稳定性',
    portability: '便携性',
    versatility: '多功能性',
    batteryLife: '电池续航',
    easeOfUse: '易用性',
    power: '功率'
  }
  
  return translations[category] || category
}

// 规格键名翻译
const translateSpecKey = (key: string) => {
  const translations: {[key: string]: string} = {
    sensor: '传感器',
    processor: '处理器',
    iso: 'ISO范围',
    autofocus: '自动对焦',
    video: '视频规格',
    battery: '电池',
    weight: '重量',
    focalLength: '焦距',
    aperture: '光圈',
    mount: '卡口',
    construction: '镜片结构',
    filterSize: '滤镜尺寸',
    minFocusDistance: '最近对焦距离',
    material: '材质',
    maximumHeight: '最大高度',
    minimumHeight: '最小高度',
    loadCapacity: '承重',
    sections: '节数',
    power: '功率',
    recyclingTime: '回电时间',
    compatibility: '兼容性'
  }
  
  return translations[key] || key
}

// 添加/移除对比项
const toggleCompareItem = (id: string) => {
  if (selectedItems.value.includes(id)) {
    selectedItems.value = selectedItems.value.filter(itemId => itemId !== id)
  } else {
    if (selectedItems.value.length < 3) {
      selectedItems.value = [...selectedItems.value, id]
    }
  }
}

// 查看对比
const viewComparison = () => {
  isComparisonMode.value = true
}

// 3D模型展示相关
const show3DModel = ref(false)
const selectedEquipmentId = ref('')
const has3DModel = (id: string) => {
  // 模拟部分热门器材有3D模型
  return ['c1', 'c2', 'l1', 'a1'].includes(id)
}

const open3DModel = (id: string) => {
  selectedEquipmentId.value = id
  show3DModel.value = true
}

// 器材搭配推荐
const equipmentRecommendations = computed(() => {
  if (selectedItems.value.length === 0) return []
  
  // 模拟推荐逻辑
  const recommendations: any[] = []
  const allEquipment: any[] = [...mockCameras, ...mockLenses, ...mockAccessories]
  
  selectedItems.value.forEach(id => {
    const equipment = allEquipment.find(item => item.id === id)
    if (!equipment) return
    
    // 根据器材类型推荐搭配
    if (equipment.type === '相机' || equipment.type.includes('camera')) {
      // 推荐镜头和配件
      const lensRecommendations = mockLenses.slice(0, 2).map(lens => ({
        ...lens,
        recommendationReason: '与您选择的相机完美搭配的专业镜头'
      }))
      const accessoryRecommendations = mockAccessories.slice(0, 1).map(acc => ({
        ...acc,
        recommendationReason: '提升拍摄体验的必备配件'
      }))
      recommendations.push(...lensRecommendations, ...accessoryRecommendations)
    } else if (equipment.type === '镜头' || equipment.type.includes('lens')) {
      // 推荐相机和滤镜等配件
      const cameraRecommendations = mockCameras.slice(0, 1).map(camera => ({
        ...camera,
        recommendationReason: '搭配此镜头的理想相机'
      }))
      recommendations.push(...cameraRecommendations)
    }
  })
  
  // 去重并限制数量
  return [...new Map(recommendations.map(item => [item.id, item])).values()].slice(0, 3)
})

// 用户提问区
const questions = ref([
  {
    id: 'q1',
    equipmentId: 'c1',
    equipmentName: 'Sony A7R V',
    question: '这款相机的弱光拍摄表现如何？',
    asker: {
      name: '摄影新手小王',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=young%20photographer%20avatar&sign=1a2b3c4d5e6f7g8h9i0j'
    },
    date: '2023-10-28',
    answers: [
      {
        id: 'a1',
        answer: 'A7R V的弱光表现非常出色，原生ISO可达32000，在高ISO下噪点控制很好。我经常在室内光线不足的环境下使用，效果令人满意。',
        answerer: {
          name: '资深摄影师老李',
          avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=professional%20photographer%20avatar&sign=9j8i7h6g5f4e3d2c1b0a',
          isExpert: true
        },
        date: '2023-10-29',
        likes: 24
      }
    ]
  },
  {
    id: 'q2',
    equipmentId: 'l1',
    equipmentName: 'Sony FE 24-70mm F2.8 GM II',
    question: '这款镜头和上一代相比有什么主要提升？',
    asker: {
      name: '器材爱好者小张',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=equipment%20enthusiast%20avatar&sign=abcdef123456789'
    },
    date: '2023-10-25',
    answers: []
  }
])

const newQuestion = ref('')
const selectedEquipmentForQuestion = ref('')

const submitQuestion = () => {
  if (!newQuestion.value.trim() || !selectedEquipmentForQuestion.value) return
  
  const equipment = [...mockCameras, ...mockLenses, ...mockAccessories]
    .find(item => item.id === selectedEquipmentForQuestion.value)
  
  if (!equipment) return
  
  const question = {
    id: `q${Date.now()}`,
    equipmentId: selectedEquipmentForQuestion.value,
    equipmentName: equipment.name,
    question: newQuestion.value,
    asker: {
      name: '当前用户',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar&sign=123456abcdef'
    },
    date: new Date().toISOString().split('T')[0],
    answers: []
  }
  
  questions.value.unshift(question)
  newQuestion.value = ''
  selectedEquipmentForQuestion.value = ''
}

// 获取特定器材的问题
const getEquipmentQuestions = (id: string) => {
  return questions.value.filter(q => q.equipmentId === id)
}
</script>

<style scoped>
/* 样式已通过 Tailwind CSS 实现，无需额外 CSS */
</style>