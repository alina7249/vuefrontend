<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5 }"
    >
      <!-- 返回按钮 -->
      <div class="mb-6">
        <RouterLink
          to="/profile-center"
          class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
        >
          <i class="fa-solid fa-arrow-left"></i>
          <span>返回个人中心</span>
        </RouterLink>
      </div>

      <!-- 页面标题 -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">我的器材库</h1>
        <p class="text-[#B8C6D8] max-w-2xl mx-auto">
          记录和管理您的摄影器材，查看他人常用器材，分享使用心得
        </p>
      </div>
      
      <!-- 添加新器材按钮 - 浅蓝灰 #4A5F8B + 浅白 #F5F7FA -->
      <div class="mb-8 text-center">
        <motion.button
          :hover="{ scale: 1.02 }"
          :tap="{ scale: 0.98 }"
          @click="isAddingNew = !isAddingNew"
          class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors inline-flex items-center"
        >
          <i class="fa-solid fa-plus mr-2"></i>
          {{ isAddingNew ? '取消添加' : '添加新器材' }}
        </motion.button>
      </div>
      
      <!-- 添加新器材表单 -->
      <motion.div
        v-if="isAddingNew"
        :initial="{ opacity: 0, height: 0 }"
        :animate="{ opacity: 1, height: 'auto' }"
        :exit="{ opacity: 0, height: 0 }"
        class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8"
      >
        <h3 class="text-lg font-bold text-[#F5F7FA] mb-6">添加新器材</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-[#B8C6D8] mb-1">器材名称</label>
            <input
              type="text"
              :value="newEquipment.name"
              @input="(e: InputEvent) => newEquipment.name = (e.target as HTMLInputElement).value"
              class="w-full px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
              placeholder="例如：索尼 A7R IV"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#B8C6D8] mb-1">器材类型</label>
            <select
              :value="newEquipment.type"
              @change="(e: Event) => newEquipment.type = (e.target as HTMLSelectElement).value as 'camera' | 'lens' | 'tripod' | 'flash' | 'other' | undefined"
              class="w-full px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option value="camera">相机</option>
              <option value="lens">镜头</option>
              <option value="tripod">三脚架</option>
              <option value="flash">闪光灯</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-[#B8C6D8] mb-1">品牌</label>
            <input
              type="text"
              :value="newEquipment.brand"
              @input="(e: InputEvent) => newEquipment.brand = (e.target as HTMLInputElement).value"
              class="w-full px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
              placeholder="例如：Sony"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#B8C6D8] mb-1">型号</label>
            <input
              type="text"
              :value="newEquipment.model"
              @input="(e: InputEvent) => newEquipment.model = (e.target as HTMLInputElement).value"
              class="w-full px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
              placeholder="例如：A7R IV"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#B8C6D8] mb-1">购买日期</label>
            <input
              type="date"
              :value="newEquipment.purchaseDate"
              @input="(e: InputEvent) => newEquipment.purchaseDate = (e.target as HTMLInputElement).value"
              class="w-full px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#B8C6D8] mb-1">成色</label>
            <select
              :value="newEquipment.condition"
              @change="(e: Event) => newEquipment.condition = (e.target as HTMLSelectElement).value as 'new' | 'like-new' | 'good' | 'used' | undefined"
              class="w-full px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option value="new">全新</option>
              <option value="like-new">几乎全新</option>
              <option value="good">良好</option>
              <option value="used">使用过</option>
            </select>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-[#B8C6D8] mb-1">序列号（选填）</label>
            <input
              type="text"
              :value="newEquipment.serialNumber"
              @input="(e: InputEvent) => newEquipment.serialNumber = (e.target as HTMLInputElement).value"
              class="w-full px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
              placeholder="输入器材序列号"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-[#B8C6D8] mb-1">备注（选填）</label>
            <textarea
              :value="newEquipment.notes"
              @input="(e: InputEvent) => newEquipment.notes = (e.target as HTMLTextAreaElement).value"
              rows="3"
              class="w-full px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all resize-none placeholder:text-[#B8C6D8]"
              placeholder="输入器材相关备注信息"
            />
          </div>
          <div class="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              id="is-public"
              :checked="newEquipment.isPublic"
              @change="(e: Event) => newEquipment.isPublic = (e.target as HTMLInputElement).checked"
              class="w-4 h-4 bg-[#2D3748] border-[#4A5F8B] text-[#4A5F8B] rounded focus:ring-[#4A5F8B]"
            />
            <label for="is-public" class="ml-2 text-[#B8C6D8]">
              设为公开，允许其他用户查看
            </label>
          </div>
        </div>
        <div class="flex justify-end mt-6">
          <motion.button
            :whileHover="{ scale: 1.02 }"
            :whileTap="{ scale: 0.98 }"
            @click="handleAddEquipment"
            class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
          >
            保存器材
          </motion.button>
        </div>
      </motion.div>
      
      <!-- 搜索和筛选 -->
      <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div class="relative flex-1">
            <input
              type="text"
              placeholder="搜索器材名称、品牌或型号..."
              :value="searchTerm"
              @input="(e: InputEvent) => searchTerm = (e.target as HTMLInputElement).value"
              class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
            />
            <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
          </div>
          
          <div class="flex space-x-4">
            <select
              :value="selectedType"
              @change="(e: Event) => selectedType = (e.target as HTMLSelectElement).value"
              class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option value="all">全部类型</option>
              <option value="camera">相机</option>
              <option value="lens">镜头</option>
              <option value="tripod">三脚架</option>
              <option value="flash">闪光灯</option>
              <option value="other">其他</option>
            </select>
            
            <select
              :value="selectedBrand"
              @change="(e: Event) => selectedBrand = (e.target as HTMLSelectElement).value"
              class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option v-for="brand in allBrands" :key="brand" :value="brand">{{ brand === 'all' ? '全部品牌' : brand }}</option>
            </select>
            
            <select
              :value="sortBy"
              @change="(e: Event) => sortBy = (e.target as HTMLSelectElement).value"
              class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option value="recent">最新添加</option>
              <option value="name">按名称排序</option>
              <option value="brand">按品牌排序</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- 器材列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          v-for="equipment in filteredEquipment"
          :key="equipment.id"
          :hover="{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }"
          class="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm"
        >
          <!-- 器材图片 -->
          <div class="relative">
            <img
              :src="equipment.image"
              :alt="equipment.name"
              class="w-full h-48 object-cover"
            />
            <!-- 类型标签 -->
            <div class="absolute top-3 left-3">
              <span class="px-2 py-1 bg-[#4A5F8B]/80 text-[#F5F7FA] text-xs rounded-full">
                {{ getTypeLabel(equipment.type) }}
              </span>
            </div>
            <!-- 公开状态标签 -->
            <div class="absolute top-3 right-3">
              <span :class="`px-2 py-1 rounded-full text-xs ${
                equipment.isPublic 
                  ? 'bg-[#4A5F8B]/80 text-[#F5F7FA]' 
                  : 'bg-[#6B7C93]/80 text-[#F5F7FA]'
              } flex items-center`">
                <i :class="`fa-solid mr-1 ${equipment.isPublic ? 'fa-globe' : 'fa-lock'}`"></i>
                {{ equipment.isPublic ? '公开' : '私密' }}
              </span>
            </div>
          </div>
          
          <!-- 器材信息 -->
          <div class="p-5">
            <!-- 器材名称和品牌 -->
            <h3 class="text-lg font-bold text-[#F5F7FA] mb-1">{{ equipment.name }}</h3>
            <p class="text-sm text-[#B8C6D8] mb-3">{{ equipment.brand }} {{ equipment.model }}</p>
            
            <!-- 基本信息 -->
            <div class="grid grid-cols-2 gap-2 mb-4 text-sm">
              <div>
                <p class="text-[#B8C6D8]">购买日期</p>
                <p class="text-[#F5F7FA]">{{ equipment.purchaseDate }}</p>
              </div>
              <div>
                <p class="text-[#B8C6D8]">成色</p>
                <p class="text-[#F5F7FA]">{{ getConditionLabel(equipment.condition) }}</p>
              </div>
            </div>
            
            <!-- 备注 -->
            <div v-if="equipment.notes" class="mb-4">
              <p class="text-sm text-[#B8C6D8] mb-1">备注</p>
              <p class="text-xs text-[#F5F7FA]">{{ equipment.notes }}</p>
            </div>
            
            <!-- 操作按钮 -->
            <div class="flex space-x-2">
              <button 
                @click="togglePublicStatus(equipment.id)"
                class="flex-1 py-2 text-center bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors text-sm border border-[#4A5F8B]"
              >
                <i :class="`fa-solid mr-1 ${equipment.isPublic ? 'fa-lock' : 'fa-globe'}`"></i>
                {{ equipment.isPublic ? '设为私密' : '设为公开' }}
              </button>
              <button 
                @click="handleDeleteEquipment(equipment.id)"
                class="px-3 py-2 text-center bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#6B7C93] hover:text-[#F5F7FA] transition-colors text-sm border border-[#4A5F8B]"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div v-if="filteredEquipment.length === 0" class="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center mt-8">
        <div class="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
          <i class="fa-solid fa-video text-2xl"></i>
        </div>
        <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">暂无器材</h3>
        <p class="text-[#B8C6D8] mb-6">
          点击"添加新器材"开始记录您的摄影装备
        </p>
        <button 
          @click="isAddingNew = true"
          class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
        >
          <i class="fa-solid fa-plus mr-2"></i>
          添加新器材
        </button>
      </div>
      
      <!-- 统计信息 -->
      <div v-if="equipmentList.length > 0" class="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mt-8">
        <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">器材统计</h3>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="bg-white/10 p-4 rounded-lg text-center">
            <p class="text-3xl font-bold text-[#F5F7FA] mb-1">{{ equipmentList.length }}</p>
            <p class="text-sm text-[#F5F7FA]/80">总器材数</p>
          </div>
          <div class="bg-white/10 p-4 rounded-lg text-center">
            <p class="text-3xl font-bold text-[#F5F7FA] mb-1">{{ getEquipmentCountByType('camera') }}</p>
            <p class="text-sm text-[#F5F7FA]/80">相机</p>
          </div>
          <div class="bg-white/10 p-4 rounded-lg text-center">
            <p class="text-3xl font-bold text-[#F5F7FA] mb-1">{{ getEquipmentCountByType('lens') }}</p>
            <p class="text-sm text-[#F5F7FA]/80">镜头</p>
          </div>
          <div class="bg-white/10 p-4 rounded-lg text-center">
            <p class="text-3xl font-bold text-[#F5F7FA] mb-1">{{ getPublicEquipmentCount() }}</p>
            <p class="text-sm text-[#F5F7FA]/80">公开器材</p>
          </div>
          <div class="bg-white/10 p-4 rounded-lg text-center">
            <p class="text-3xl font-bold text-[#F5F7FA] mb-1">{{ getBrandCount() }}</p>
            <p class="text-sm text-[#F5F7FA]/80">品牌数</p>
          </div>
        </div>
      </div>
      
      <!-- 器材租赁信息 -->
      <div class="mt-12 bg-[#2D3748] p-6 rounded-xl border border-[#4A5F8B]">
        <h2 class="text-2xl font-bold text-[#F5F7FA] mb-6">器材租赁服务</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="service in rentalServices" 
            :key="service.id" 
            class="bg-[#2D3748] rounded-lg p-5 border border-[#4A5F8B] hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-lg font-bold text-[#F5F7FA]">{{ service.name }}</h3>
              <div class="flex items-center text-yellow-400">
                <i class="fa-solid fa-star mr-1"></i>
                <span>{{ service.rating }}</span>
              </div>
            </div>
            
            <div class="space-y-3">
              <div class="flex items-start">
                <i class="fa-solid fa-map-marker-alt text-[#4A5F8B] mt-1 mr-3"></i>
                <span class="text-[#B8C6D8]">{{ service.location }}</span>
              </div>
              <div class="flex items-start">
                <i class="fa-solid fa-camera text-[#4A5F8B] mt-1 mr-3"></i>
                <span class="text-[#B8C6D8]">可租赁: {{ service.availableEquipment.join('、') }}</span>
              </div>
              <div class="flex items-start">
                <i class="fa-solid fa-tag text-[#4A5F8B] mt-1 mr-3"></i>
                <span class="text-[#B8C6D8]">价格区间: {{ service.priceRange }}</span>
              </div>
              <div class="flex items-start">
                <i class="fa-solid fa-phone text-[#4A5F8B] mt-1 mr-3"></i>
                <span class="text-[#B8C6D8]">{{ service.contact }}</span>
              </div>
            </div>
            
            <a 
              :href="service.website" 
              target="_blank" 
              class="mt-4 inline-block px-4 py-2 bg-[#4A5F8B] hover:bg-[#3A4F7B] text-[#F5F7FA] rounded-lg text-sm font-medium transition-colors"
            >
              访问官网
            </a>
          </div>
        </div>
      </div>
      
      <!-- 二手交易链接 -->
      <div class="mt-12 bg-[#2D3748] p-6 rounded-xl border border-[#4A5F8B]">
        <h2 class="text-2xl font-bold text-[#F5F7FA] mb-6">二手交易市场</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            v-for="link in secondHandLinks" 
            :key="link.id"
            :href="link.url"
            :target="link.url.startsWith('http') ? '_blank' : '_self'"
            class="bg-[#2D3748] rounded-lg p-5 border border-[#4A5F8B] hover:bg-[#4A5F8B] transition-colors flex flex-col items-center text-center"
          >
            <div class="w-12 h-12 bg-[#1E2532] rounded-full flex items-center justify-center mb-4">
              <i class="fa-solid fa-handshake text-[#4A5F8B] text-xl"></i>
            </div>
            <h3 class="font-bold text-[#F5F7FA] mb-2">{{ link.platform }}</h3>
            <p class="text-sm text-[#B8C6D8] mb-3">{{ link.description }}</p>
            <span class="text-xs px-2 py-1 bg-green-900/50 text-green-300 rounded-full">{{ link.safety }}</span>
          </a>
        </div>
        
        <div class="mt-6 p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
          <h3 class="text-lg font-semibold text-[#F5F7FA] mb-3">二手价格参考</h3>
          <p class="text-[#B8C6D8] text-sm mb-4">根据您的器材库，以下是部分器材的二手市场价格参考</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div 
              v-for="item in equipmentList.slice(0, 6)" 
              :key="item.id" 
              class="flex justify-between items-center p-3 bg-[#2D3748] rounded-lg border border-[#4A5F8B]"
            >
              <span class="text-sm text-[#F5F7FA]">{{ item.name }}</span>
              <span class="text-sm font-medium text-[#4A5F8B]">{{ getMarketPrice(item.name) }}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { motion } from 'motion-v'
import { RouterLink } from 'vue-router'
import { useEquipmentRental } from '@/composables/useEquipmentRental'
import { useSecondHandMarketplace } from '@/composables/useSecondHandMarketplace'
import { useAuth } from '@/composables/useAuth'
import toast from '@/composables/useToast'

interface Equipment {
  id: string
  name: string
  type: 'camera' | 'lens' | 'tripod' | 'flash' | 'other'
  brand: string
  model: string
  purchaseDate: string
  condition: 'new' | 'like-new' | 'good' | 'used'
  image: string
  serialNumber?: string
  notes?: string
  isPublic: boolean
}

const { isAuthenticated } = useAuth()

const selectedType = ref('all')
const selectedBrand = ref('all')
const searchTerm = ref('')
const sortBy = ref('recent')
const isAddingNew = ref(false)
const newEquipment = ref<Partial<Equipment>>({
  name: '',
  type: 'camera',
  brand: '',
  model: '',
  purchaseDate: '',
  condition: 'new',
  isPublic: false
})

// 模拟器材数据
const equipmentList = ref<Equipment[]>([
  {
    id: '1',
    name: '索尼 A7R IV',
    type: 'camera',
    brand: 'Sony',
    model: 'A7R IV',
    purchaseDate: '2022-03-15',
    condition: 'good',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20a7rv%20mirrorless%20camera%20professional%20photography&sign=6b099a6dd31856f91c56e9cc8bcfe622',
    serialNumber: '789456123',
    notes: '全画幅高像素相机，适合风光和商业摄影',
    isPublic: true
  },
  {
    id: '2',
    name: '佳能 EF 24-70mm f/2.8L',
    type: 'lens',
    brand: 'Canon',
    model: 'EF 24-70mm f/2.8L USM',
    purchaseDate: '2021-11-20',
    condition: 'like-new',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=canon%20ef%2024-70mm%20f2.8l%20usm%20lens%20professional&sign=ad9888417bc6499f7c167d2264115bc1',
    serialNumber: '456789123',
    notes: '标准变焦镜头，适合人像和婚礼摄影',
    isPublic: true
  },
  {
    id: '3',
    name: 'DJI Mavic 3',
    type: 'camera',
    brand: 'DJI',
    model: 'Mavic 3',
    purchaseDate: '2023-01-10',
    condition: 'new',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=dji%20mavic%203%20drone%20professional%20photography%20cinematic&sign=f0f67062e9c838e72cf78b46a4281181',
    serialNumber: '123456789',
    notes: '专业航拍无人机，支持4K视频',
    isPublic: false
  },
  {
    id: '4',
    name: 'Gitzo 碳纤维三脚架',
    type: 'tripod',
    brand: 'Gitzo',
    model: 'GT3543LS',
    purchaseDate: '2022-05-05',
    condition: 'good',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=gitzo%20tripod%20carbon%20fiber%20professional&sign=1c0fe9951c0482da7c884f40006d4717',
    serialNumber: '987654321',
    notes: '轻巧稳定，适合风光摄影',
    isPublic: true
  },
  {
    id: '5',
    name: 'Profoto A1X 闪光灯',
    type: 'flash',
    brand: 'Profoto',
    model: 'A1X',
    purchaseDate: '2022-09-18',
    condition: 'like-new',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=profoto%20a1x%20flash%20portable%20professional&sign=e3f116ecaf94060b4684b34ee2593bef',
    serialNumber: '321654987',
    notes: '便携式闪光灯，适合人像和商业摄影',
    isPublic: true
  }
])

// 获取所有品牌
const allBrands = computed(() => {
  const brands = ['all']
  equipmentList.value.forEach(item => {
    if (!brands.includes(item.brand)) {
      brands.push(item.brand)
    }
  })
  return brands
})

// 过滤器材
const filteredEquipment = computed(() => {
  let equipment = [...equipmentList.value]
  
  // 按类型过滤
  if (selectedType.value !== 'all') {
    equipment = equipment.filter(item => item.type === selectedType.value)
  }
  
  // 按品牌过滤
  if (selectedBrand.value !== 'all') {
    equipment = equipment.filter(item => item.brand === selectedBrand.value)
  }
  
  // 按搜索词过滤
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    equipment = equipment.filter(item => 
      item.name.toLowerCase().includes(term) || 
      item.brand.toLowerCase().includes(term) ||
      item.model.toLowerCase().includes(term)
    )
  }
  
  // 排序
  if (sortBy.value === 'recent') {
    equipment.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
  } else if (sortBy.value === 'name') {
    equipment.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'brand') {
    equipment.sort((a, b) => a.brand.localeCompare(b.brand))
  }
  
  return equipment
})

// 添加新器材
const handleAddEquipment = () => {
  if (!newEquipment.value.name || !newEquipment.value.brand || !newEquipment.value.model || !newEquipment.value.purchaseDate) {
    toast.warning('请填写必要的器材信息')
    return
  }
  
  const equipmentToAdd: Equipment = {
    id: `eq-${Date.now()}`,
    name: newEquipment.value.name!,
    type: newEquipment.value.type as 'camera' | 'lens' | 'tripod' | 'flash' | 'other',
    brand: newEquipment.value.brand!,
    model: newEquipment.value.model!,
    purchaseDate: newEquipment.value.purchaseDate!,
    condition: newEquipment.value.condition as 'new' | 'like-new' | 'good' | 'used',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=camera%20equipment%20placeholder&sign=3b459504fe868e742ae48b1a1488be95',
    serialNumber: newEquipment.value.serialNumber,
    notes: newEquipment.value.notes,
    isPublic: newEquipment.value.isPublic || false
  }
  
  equipmentList.value = [equipmentToAdd, ...equipmentList.value]
  isAddingNew.value = false
  newEquipment.value = {
    name: '',
    type: 'camera',
    brand: '',
    model: '',
    purchaseDate: '',
    condition: 'new',
    isPublic: false
  }
  toast.success('器材添加成功')
}

// 删除器材
const handleDeleteEquipment = (id: string) => {
  if (window.confirm('确定要删除这个器材吗？')) {
    equipmentList.value = equipmentList.value.filter(item => item.id !== id)
    toast.success('器材删除成功')
  }
}

// 切换公开状态
const togglePublicStatus = (id: string) => {
  equipmentList.value = equipmentList.value.map(item => 
    item.id === id ? { ...item, isPublic: !item.isPublic } : item
  )
  toast.success('器材状态更新成功')
}

// 辅助函数
const getTypeLabel = (type: string) => {
  const typeMap = {
    camera: '相机',
    lens: '镜头',
    tripod: '三脚架',
    flash: '闪光灯',
    other: '其他'
  }
  return typeMap[type as keyof typeof typeMap] || type
}

// 器材租赁信息
const rentalServices = ref([
  {
    id: 'r1',
    name: '摄影器材租赁中心',
    location: '北京市朝阳区建国路88号',
    rating: 4.8,
    availableEquipment: ['相机', '镜头', '三脚架', '闪光灯'],
    priceRange: '100-1000元/天',
    contact: '400-888-7777',
    website: 'https://rent.example.com'
  },
  {
    id: 'r2',
    name: '专业影像租赁',
    location: '上海市浦东新区陆家嘴金融中心',
    rating: 4.6,
    availableEquipment: ['高级相机', '电影镜头', '航拍设备'],
    priceRange: '200-2000元/天',
    contact: '400-666-5555',
    website: 'https://pro-rent.example.com'
  }
])

// 获取推荐租赁服务
const getRecommendedRental = (equipmentType: string) => {
  return rentalServices.value.filter(service => 
    service.availableEquipment.some(type => type.includes(equipmentType))
  )[0]
}

// 二手交易链接
const secondHandLinks = [
  {
    id: 's1',
    platform: '摄影器材二手市场',
    url: '/equipment-trade',
    description: '平台内专业二手交易区',
    safety: '平台担保交易'
  },
  {
    id: 's2',
    platform: '闲鱼摄影专区',
    url: 'https://2.taobao.com',
    description: '综合性二手交易平台',
    safety: '可选平台担保'
  },
  {
    id: 's3',
    platform: '蜂鸟二手交易',
    url: 'https://bbs.fengniao.com/forum/forumdisplay.php?fid=34',
    description: '摄影爱好者聚集地',
    safety: '论坛监管'
  }
]

// 查看器材的二手市场价格参考
const getMarketPrice = (equipmentName: string) => {
  // 模拟二手市场价格数据
  const mockPrices: { [key: string]: string } = {
    'Sony A7M4': '12000-13500元',
    'Canon EOS R6': '15000-16500元',
    'Nikon Z6 II': '13000-14500元',
    'DJI Mavic 3': '18000-20000元',
    'Gitzo 碳纤维三脚架': '5000-6000元',
    'Profoto A1X 闪光灯': '4000-4800元'
  }
  return mockPrices[equipmentName] || '暂无参考价格'
}

const getConditionLabel = (condition: string) => {
  const conditionMap = {
    new: '全新',
    'like-new': '几乎全新',
    good: '良好',
    used: '使用过'
  }
  return conditionMap[condition as keyof typeof conditionMap] || condition
}

const getEquipmentCountByType = (type: string) => {
  return equipmentList.value.filter(item => item.type === type).length
}

const getPublicEquipmentCount = () => {
  return equipmentList.value.filter(item => item.isPublic).length
}

const getBrandCount = () => {
  return new Set(equipmentList.value.map(item => item.brand)).size
}

onMounted(() => {
  if (!isAuthenticated.value) {
    // 可以在这里添加重定向逻辑
  }
})
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