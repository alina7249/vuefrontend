<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5 }"
    >
      <!-- 页面标题 -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-[#4A5059] mb-2">器材交易平台</h1>
        <p class="text-[#4A5059]/80 max-w-2xl mx-auto">
          安全可靠的摄影器材交易平台，提供专业验机、资金担保等服务，让您买卖无忧
        </p>
      </div>

      <!-- 交易类型选择 -->
      <div class="grid grid-cols-2 gap-4 mb-8">
        <motion.button
          :hover="{ y: -5 }"
          :tap="{ scale: 0.95 }"
          @click="tradeType = 'used'"
          :class="[
            'py-4 rounded-xl flex items-center justify-center transition-all',
            tradeType === 'used'
              ? 'bg-[#4A5568] border-2 border-[#63B3ED] text-[#E2E8F0] shadow-md'
              : 'bg-[#4A5568] border border-[#4A5568] text-[#E2E8F0]'
          ]"
        >
          <i class="fa-solid fa-recycle text-xl mr-2"></i>
          <span class="font-medium">二手器材</span>
        </motion.button>
        <motion.button
          :hover="{ y: -5 }"
          :tap="{ scale: 0.95 }"
          @click="tradeType = 'new'"
          :class="[
            'py-4 rounded-xl flex items-center justify-center transition-all',
            tradeType === 'new'
              ? 'bg-[#4A5568] border-2 border-[#63B3ED] text-[#E2E8F0] shadow-md'
              : 'bg-[#4A5568] border border-[#4A5568] text-[#E2E8F0]'
          ]"
        >
          <i class="fa-solid fa-box-open text-xl mr-2"></i>
          <span class="font-medium">全新器材</span>
        </motion.button>
      </div>

      <!-- 搜索和筛选 -->
      <div class="bg-[#4A5568] rounded-xl p-6 shadow-sm border border-[#4A5568] mb-8">
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
          <div class="relative flex-1">
            <input
              type="text"
              :placeholder="`搜索${tradeType === 'used' ? '二手' : '全新'}器材...`"
              :value="searchTerm"
              @input="(e) => searchTerm = (e.target as HTMLInputElement).value"
              class="input pl-12 w-full"
            />
            <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4A5059]/50"></i>
          </div>
          
          <select
            :value="selectedType"
            @change="(e) => selectedType = (e.target as HTMLSelectElement).value"
            class="input appearance-none cursor-pointer"
          >
            <option v-for="type in equipmentTypes" :key="type" :value="type">{{ type }}</option>
          </select>
          
          <select
            :value="selectedBrand"
            @change="(e) => selectedBrand = (e.target as HTMLSelectElement).value"
            class="input appearance-none cursor-pointer"
          >
            <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
          </select>
          
          <select
            :value="selectedPriceRange"
            @change="(e) => selectedPriceRange = (e.target as HTMLSelectElement).value"
            class="input appearance-none cursor-pointer"
          >
            <option v-for="range in priceRanges" :key="range" :value="range">{{ range }}</option>
          </select>
          
          <select
            v-if="tradeType === 'used'"
            :value="selectedCondition"
            @change="(e) => selectedCondition = (e.target as HTMLSelectElement).value"
            class="input appearance-none cursor-pointer"
          >
            <option v-for="condition in conditions" :key="condition" :value="condition">{{ condition }}</option>
          </select>
        </div>
        
        <!-- 排序选项 -->
        <div class="flex justify-end">
          <select
            :value="sortBy"
            @change="(e) => sortBy = (e.target as HTMLSelectElement).value"
            class="input py-2 appearance-none cursor-pointer"
          >
            <option value="recommended">推荐排序</option>
            <option value="price-asc">价格从低到高</option>
            <option value="price-desc">价格从高到低</option>
            <option value="newest">最新发布</option>
          </select>
        </div>
      </div>

      <!-- 器材列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          v-for="item in currentEquipment"
          :key="item.id"
          :hover="{ y: -5, boxShadow: '0 2px 12px rgba(99, 179, 237, 0.3)' }"
          class="bg-[#4A5568] rounded-xl overflow-hidden border border-[#4A5568] transition-all shadow-sm"
        >
          <!-- 器材图片 -->
          <div class="relative">
            <img
              :src="item.image"
              :alt="item.name"
              class="w-full h-48 object-cover"
            />
            <div v-if="tradeType === 'used' && 'condition' in item" class="absolute top-3 left-3 px-2 py-1 bg-[#63B3ED] text-[#0F1C2D] rounded-full text-xs font-medium">
              {{ (item as any).condition }}
            </div>
            <div v-if="item.seller && 'isOfficial' in item.seller" class="absolute top-3 left-3 px-2 py-1 bg-[#63B3ED] text-[#0F1C2D] rounded-full text-xs font-medium">
              官方授权
            </div>
          </div>
          
          <!-- 器材信息 -->
          <div class="p-5">
            <!-- 品牌和类型 -->
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-[#63B3ED] font-medium">{{ item.brand }}</span>
              <span class="text-xs px-2 py-1 bg-[#1E2A3A] text-[#63B3ED] rounded-full">{{ item.type }}</span>
            </div>
            
            <!-- 器材名称 -->
            <h3 class="text-lg font-bold text-[#FFFFFF] mb-2">{{ item.name }}</h3>
            
            <!-- 价格 -->
            <div class="flex items-center mb-4">
              <p class="text-lg font-bold text-[#63B3ED]">¥{{ parseInt(item.price).toLocaleString() }}</p>
              <p v-if="item.originalPrice !== item.price" class="text-sm text-[#718096] line-through ml-2">¥{{ parseInt(item.originalPrice).toLocaleString() }}</p>
            </div>
            
            <!-- 二手器材特有信息 -->
            <div v-if="tradeType === 'used'" class="space-y-1 mb-4 text-sm">
              <div class="flex justify-between">
                <span class="text-[#718096]">使用时长:</span>
                <span class="text-[#E2E8F0]">{{ (item as any).usageTime }}</span>
              </div>
              <div v-if="tradeType === 'used' && 'shutterCount' in item" class="flex justify-between">
                <span class="text-[#718096]">快门次数:</span>
                <span class="text-[#E2E8F0]">{{ (item as any).shutterCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[#718096]">维修记录:</span>
                <span class="text-[#E2E8F0]">{{ (item as any).repairHistory }}</span>
              </div>
            </div>
            
            <!-- 全新器材特有信息 -->
            <div v-if="tradeType === 'new'" class="mb-4 text-sm">
              <div class="flex justify-between">
                <span class="text-[#718096]">保修:</span>
                <span class="text-[#E2E8F0]">{{ (item as any).warranty }}</span>
              </div>
            </div>
            
            <!-- 卖家信息 -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <img
                  :src="item.seller?.avatar"
                  :alt="item.seller?.name"
                  class="w-8 h-8 rounded-full mr-2 object-cover border border-[#B8C6D8]"
                />
                <div>
                  <p class="text-sm font-medium text-[#FFFFFF]">{{ item.seller?.name }}</p>
                  <div class="flex items-center">
                    <i class="fa-solid fa-star text-xs text-[#63B3ED]"></i>
                    <span class="text-xs text-[#718096] ml-1">{{ item.seller?.rating }}</span>
                    <span class="text-xs text-[#4A5568] mx-1">|</span>
                    <span class="text-xs text-[#718096]">{{ item.seller?.completedTransactions }} 单</span>
                  </div>
                </div>
              </div>
              <span class="text-xs text-[#718096]">{{ item.seller?.location }}</span>
            </div>
            
            <!-- 操作按钮 -->
            <div class="flex items-center space-x-3">
              <RouterLink
                :to="`/equipment/${item.id}`"
                class="flex-1 py-2 text-center bg-[#1E2A3A] text-[#E2E8F0] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#E2E8F0] transition-colors border border-[#4A5568]"
              >
                查看详情
              </RouterLink>
              <button class="px-4 py-2 bg-[#63B3ED] text-[#0F1C2D] rounded-lg font-medium hover:bg-[#4299E1] transition-colors">
                {{ tradeType === 'used' ? '联系卖家' : '立即购买' }}
              </button>
            </div>
          </div>
        </motion.div>
        
        <div v-if="currentEquipment.length === 0" class="col-span-full p-8 bg-[#4A5568] rounded-xl border border-[#4A5568] text-center">
          <div class="w-16 h-16 bg-[#1E2A3A] rounded-full flex items-center justify-center text-[#63B3ED] mx-auto mb-4">
            <i class="fa-solid fa-search text-2xl"></i>
          </div>
          <h3 class="text-lg font-medium text-[#FFFFFF] mb-2">未找到相关器材</h3>
          <p class="text-[#E2E8F0]/70">
            请尝试调整筛选条件或搜索其他关键词
          </p>
        </div>
      </div>
      
      <!-- 交易保障说明 -->
      <div class="mt-12 bg-[#4A5568] rounded-xl p-6 shadow-sm border border-[#4A5568]">
        <h2 class="text-xl font-bold text-[#FFFFFF] mb-4">交易保障</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="flex items-start">
            <div class="w-10 h-10 rounded-full bg-[#1E2A3A] flex items-center justify-center text-[#63B3ED] mr-3 flex-shrink-0">
              <i class="fa-solid fa-check-circle"></i>
            </div>
            <div>
              <h3 class="font-medium text-[#FFFFFF] mb-1">专业验机服务</h3>
              <p class="text-sm text-[#E2E8F0]/70">
                提供第三方专业机构验机服务，确保器材真实状况与描述一致
              </p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="w-10 h-10 rounded-full bg-[#1E2A3A] flex items-center justify-center text-[#63B3ED] mr-3 flex-shrink-0">
              <i class="fa-solid fa-shield-alt"></i>
            </div>
            <div>
              <h3 class="font-medium text-[#FFFFFF] mb-1">资金担保</h3>
              <p class="text-sm text-[#E2E8F0]/70">
                平台提供资金担保服务，买家确认收货后卖家才能收到款项
              </p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="w-10 h-10 rounded-full bg-[#1E2A3A] flex items-center justify-center text-[#63B3ED] mr-3 flex-shrink-0">
              <i class="fa-solid fa-headset"></i>
            </div>
            <div>
              <h3 class="font-medium text-[#FFFFFF] mb-1">7天无理由退换</h3>
              <p class="text-sm text-[#E2E8F0]/70">
                支持7天无理由退换货，让您购物无忧
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 发布器材按钮 -->
      <div class="mt-8 flex justify-center">
        <motion.button
          :hover="{ scale: 1.05 }"
          :tap="{ scale: 0.95 }"
          class="px-8 py-3 bg-[#63B3ED] text-[#0F1C2D] rounded-lg font-medium hover:bg-[#4299E1] transition-colors shadow-md border border-[#63B3ED]"
        >
          <i class="fa-solid fa-plus mr-2"></i>
          {{ tradeType === 'used' ? '发布二手器材' : '成为授权商家' }}
        </motion.button>
      </div>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { motion } from 'motion-v'
import { RouterLink } from 'vue-router'

// 模拟二手器材数据
const mockUsedEquipment = [
  {
    id: 'ue1',
    name: 'Sony A7 III 全画幅微单相机',
    type: '相机',
    brand: 'Sony',
    price: '8500',
    originalPrice: '12999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20a7%20iii%20used%20camera%20excellent%20condition&sign=d370c0cc7eb060b61b17c41f64c37106',
    condition: '95新',
    usageTime: '约1年',
    shutterCount: '8500次',
    repairHistory: '无维修记录',
    accessories: ['原装电池2块', '充电器', '相机包', '说明书'],
    seller: {
      id: 's1',
      name: '摄影爱好者小王',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20male%20smiling%20casual&sign=db92da1c3005295607f7766d7f9263bb',
      location: '上海',
      rating: 4.9,
      completedTransactions: 128
    },
    description: '2022年10月购买，使用非常小心，成色极佳。快门次数仅8500次，无任何磕碰和维修记录。因升级设备故出售，附带全部原装配件。',
    images: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20a7%20iii%20used%20camera%20front%20view&sign=8c23b00c03b06319381d9f7541dfedcb',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20a7%20iii%20used%20camera%20back%20view&sign=a1d945297240d4e2010f8da8e2e2860f',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20a7%20iii%20used%20camera%20serial%20number&sign=efcf5da04302ea28f2034a3cd2af0add',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20a7%20iii%20used%20camera%20all%20accessories&sign=530b17ea4863474381358cf3b76a4f15'
    ],
    tags: ['索尼', '全画幅', '微单', '二手', '高性价比']
  },
  {
    id: 'ue2',
    name: 'Canon EF 24-70mm f/2.8L II USM 镜头',
    type: '镜头',
    brand: 'Canon',
    price: '7200',
    originalPrice: '13999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=canon%20ef%2024-70mm%20f2.8l%20ii%20used%20lens%20good%20condition&sign=574d7e4a7c63e973315252e97f5437a0',
    condition: '9成新',
    usageTime: '约2年',
    shutterCount: '',
    repairHistory: '无维修记录',
    accessories: ['原装遮光罩', '镜头盖', '镜头袋'],
    seller: {
      id: 's2',
      name: '专业摄影师老李',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=professional%20photographer%20male%20experienced&sign=fe817dce4d08957c62787348c72eb1b7',
      location: '北京',
      rating: 4.8,
      completedTransactions: 256
    },
    description: '经典佳能大三元标准变焦镜头，2021年购买，使用状况良好。镜片无霉无划痕，对焦快速准确。因更换RF卡口系统故出售。',
    images: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=canon%20ef%2024-70mm%20f2.8l%20ii%20used%20lens%20front%20view&sign=ec6a24b9271548db591ba1d823b908b6',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=canon%20ef%2024-70mm%20f2.8l%20ii%20used%20lens%20side%20view&sign=540bc9fa3fd5fc9603f545c2effb1a8e',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=canon%20ef%2024-70mm%20f2.8l%20ii%20used%20lens%20serial%20number&sign=25f17c31656a1544db96b07627de306e',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=canon%20ef%2024-70mm%20f2.8l%20ii%20used%20lens%20all%20accessories&sign=bbf6965daf8dc5f306823519e3387b62'
    ],
    tags: ['佳能', '大三元', '标准变焦', '二手', '专业']
  },
  {
    id: 'ue3',
    name: 'Fujifilm X-T30 II 微单相机套机(18-55mm)',
    type: '相机',
    brand: 'Fujifilm',
    price: '5800',
    originalPrice: '7999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=fujifilm%20x-t30%20ii%20used%20camera%20kit%20mint%20condition&sign=dd66874018934a8b4acab4d3277af243',
    condition: '99新',
    usageTime: '约3个月',
    shutterCount: '2300次',
    repairHistory: '无维修记录',
    accessories: ['原装电池', '充电器', '相机包', '肩带', '说明书'],
    seller: {
      id: 's3',
      name: '新手摄影小张',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=young%20photographer%20male%20student&sign=a076fa14f7977e902fe333f899d2603c',
      location: '广州',
      rating: 4.7,
      completedTransactions: 32
    },
    description: '2023年7月购买，几乎全新，仅使用过几次。因工作繁忙无暇使用故出售。相机和镜头均无任何瑕疵，配件齐全。',
    images: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=fujifilm%20x-t30%20ii%20used%20camera%20front%20view&sign=22b413f9f51b4921015924bebe89a80d',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=fujifilm%20x-t30%20ii%20used%20camera%20back%20view&sign=d526ff0ad41fcc6fc025d06839f222c4',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=fujifilm%20x-t30%20ii%20used%20camera%20serial%20number&sign=9033a20ec63ef218567afae8ccf6b5b6',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=fujifilm%20x-t30%20ii%20used%20camera%20all%20accessories&sign=520d381bde3726efe5ada729ca9d8075'
    ],
    tags: ['富士', 'APS-C', '复古', '二手', '套机']
  },
  {
    id: 'ue4',
    name: 'Gitzo Mountaineer GT2545T碳纤维三脚架',
    type: '配件',
    brand: 'Gitzo',
    price: '4200',
    originalPrice: '6999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=gitzo%20mountaineer%20gt2545t%20used%20tripod%20good%20condition&sign=54fd30452764d988a54fac89f0d1b760',
    condition: '9成新',
    usageTime: '约1.5年',
    shutterCount: '',
    repairHistory: '无维修记录',
    accessories: ['原装收纳袋', '说明书'],
    seller: {
      id: 's4',
      name: '风光摄影师老王',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20male%20outdoor&sign=e12559b462289b3e1b2448807304bc67',
      location: '成都',
      rating: 4.9,
      completedTransactions: 187
    },
    description: '2022年3月购买，碳纤维材质，轻巧耐用，承重能力强。使用状况良好，无任何损坏。因升级更大号三脚架故出售。',
    images: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=gitzo%20mountaineer%20gt2545t%20used%20tripod%20extended&sign=6d6c4dcf86394532b55728f9a2455dd0',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=gitzo%20mountaineer%20gt2545t%20used%20tripod%20folded&sign=cfe2d793d45cfe1925e92ba39297cb9f',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=gitzo%20mountaineer%20gt2545t%20used%20tripod%20serial%20number&sign=9efa85947b0fa94a73d4d3ca98bea3c0',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=gitzo%20mountaineer%20gt2545t%20used%20tripod%20all%20accessories&sign=6e6578a3c2edf99ad53058940d6c1b90'
    ],
    tags: ['捷信', '碳纤维', '三脚架', '二手', '专业']
  },
]

// 模拟全新器材数据
const mockNewEquipment = [
  {
    id: 'ne1',
    name: 'Canon EOS R5 全画幅微单相机',
    type: '相机',
    brand: 'Canon',
    price: '25999',
    originalPrice: '25999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=canon%20eos%20r5%20new%20camera%20professional&sign=540cba86fda3af67e78ac69d90b730e1',
    seller: {
      id: 'b1',
      name: '佳能官方授权店',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=canon%20official%20store%20logo&sign=50cd433cb1c90a4b4dca5af8ff32317b',
      location: '上海',
      rating: 4.9,
      completedTransactions: 1254,
      isOfficial: true
    },
    description: '佳能EOS R5是一款专业级全画幅微单相机，具备4500万像素，支持8K视频录制和高速连拍。本商品为全新正品，享受官方保修服务。',
    images: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=canon%20eos%20r5%20new%20camera%20front%20view&sign=b6db1f77019b955b897744aeb6f1fa6a',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=canon%20eos%20r5%20new%20camera%20back%20view&sign=8b6b1d264375c58672223fe1b791c81f',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=canon%20eos%20r5%20new%20camera%20box%20package&sign=55926a109e6eb89cc139daf52eb22306',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=canon%20eos%20r5%20new%20camera%20all%20accessories&sign=c23656b0ee1f1ffc4fdbdcc3bda18b46'
    ],
    tags: ['佳能', '全画幅', '微单', '全新', '专业'],
    warranty: '官方保修2年'
  },
  {
    id: 'ne2',
    name: 'Nikon Z 70-200mm f/2.8 VR S 镜头',
    type: '镜头',
    brand: 'Nikon',
    price: '23999',
    originalPrice: '23999',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=nikon%20z%2070-200mm%20f2.8%20vr%20s%20new%20lens%20professional&sign=38233f6c58be56005f9f35a8b0432feb',
    seller: {
      id: 'b2',
      name: '尼康官方授权店',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=nikon%20official%20store%20logo&sign=1cb76f80ef7e58ff4fd8842daa09e778',
      location: '北京',
      rating: 4.8,
      completedTransactions: 987,
      isOfficial: true
    },
    description: '尼康Z卡口70-200mm F2.8 VR S镜头，采用纳米结晶涂层和ED镜片，提供出色的光学性能和防抖效果。全新正品，支持官方保修。',
    images: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=nikon%20z%2070-200mm%20f2.8%20vr%20s%20new%20lens%20front%20view&sign=c468933d8d507985734f2072eee2863f',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=nikon%20z%2070-200mm%20f2.8%20vr%20s%20new%20lens%20side%20view&sign=d14d92fe583d61b91aac62b0d6df4874',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=nikon%20z%2070-200mm%20f2.8%20vr%20s%20new%20lens%20box%20package&sign=effd778739b00c72a30140deccda8f6a',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=nikon%20z%2070-200mm%20f2.8%20vr%20s%20new%20lens%20all%20accessories&sign=47efc7cc62b8bf90757fd71cae2ff477'
    ],
    tags: ['尼康', '大三元', '长焦', '全新', '专业'],
    warranty: '官方保修2年'
  },
]

// 器材类型
const equipmentTypes = ['全部', '相机', '镜头', '配件', '无人机', '三脚架', '滤镜', '闪光灯']

// 价格区间
const priceRanges = ['全部', '0-5000元', '5000-10000元', '10000-20000元', '20000元以上']

// 成色选项（二手器材）
const conditions = ['全部', '99新', '95新', '9成新', '8成新', '7成新及以下']

// 品牌列表
const brands = ['全部', 'Sony', 'Canon', 'Nikon', 'Fujifilm', 'Panasonic', 'Leica', 'Sigma', 'Tamron', 'DJI']

// 响应式状态
const tradeType = ref<'used' | 'new'>('used')
const selectedType = ref('全部')
const selectedBrand = ref('全部')
const selectedPriceRange = ref('全部')
const selectedCondition = ref('全部')
const searchTerm = ref('')
const sortBy = ref('recommended') // recommended, price-asc, price-desc, newest

// 过滤二手器材
const getFilteredUsedEquipment = () => {
  let equipment = [...mockUsedEquipment]
  
  // 按类型过滤
  if (selectedType.value !== '全部') {
    equipment = equipment.filter(item => item.type === selectedType.value)
  }
  
  // 按品牌过滤
  if (selectedBrand.value !== '全部') {
    equipment = equipment.filter(item => item.brand === selectedBrand.value)
  }
  
  // 按价格区间过滤
  if (selectedPriceRange.value !== '全部') {
    equipment = equipment.filter(item => {
      const price = parseInt(item.price)
      switch(selectedPriceRange.value) {
        case '0-5000元':
          return price <= 5000
        case '5000-10000元':
          return price > 5000 && price <= 10000
        case '10000-20000元':
          return price > 10000 && price <= 20000
        case '20000元以上':
          return price > 20000
        default:
          return true
      }
    })
  }
  
  // 按成色过滤
  if (selectedCondition.value !== '全部') {
    equipment = equipment.filter(item => item.condition === selectedCondition.value)
  }
  
  // 按搜索词过滤
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    equipment = equipment.filter(item => 
      item.name.toLowerCase().includes(term) || 
      item.brand.toLowerCase().includes(term) ||
      item.type.toLowerCase().includes(term)
    )
  }
  
  // 排序
  if (sortBy.value === 'price-asc') {
    equipment.sort((a, b) => parseInt(a.price) - parseInt(b.price))
  } else if (sortBy.value === 'price-desc') {
    equipment.sort((a, b) => parseInt(b.price) - parseInt(a.price))
  } else if (sortBy.value === 'newest') {
    equipment.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime())
  }
  
  return equipment
}

// 过滤全新器材
const getFilteredNewEquipment = () => {
  let equipment = [...mockNewEquipment]
  
  // 按类型过滤
  if (selectedType.value !== '全部') {
    equipment = equipment.filter(item => item.type === selectedType.value)
  }
  
  // 按品牌过滤
  if (selectedBrand.value !== '全部') {
    equipment = equipment.filter(item => item.brand === selectedBrand.value)
  }
  
  // 按价格区间过滤
  if (selectedPriceRange.value !== '全部') {
    equipment = equipment.filter(item => {
      const price = parseInt(item.price)
      switch(selectedPriceRange.value) {
        case '0-5000元':
          return price <= 5000
        case '5000-10000元':
          return price > 5000 && price <= 10000
        case '10000-20000元':
          return price > 10000 && price <= 20000
        case '20000元以上':
          return price > 20000
        default:
          return true
      }
    })
  }
  
  // 按搜索词过滤
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    equipment = equipment.filter(item => 
      item.name.toLowerCase().includes(term) || 
      item.brand.toLowerCase().includes(term) ||
      item.type.toLowerCase().includes(term)
    )
  }
  
  // 排序
  if (sortBy.value === 'price-asc') {
    equipment.sort((a, b) => parseInt(a.price) - parseInt(b.price))
  } else if (sortBy.value === 'price-desc') {
    equipment.sort((a, b) => parseInt(b.price) - parseInt(a.price))
  } else if (sortBy.value === 'newest') {
    equipment.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime())
  }
  
  return equipment
}

// 计算属性
const filteredUsedEquipment = computed(() => getFilteredUsedEquipment())
const filteredNewEquipment = computed(() => getFilteredNewEquipment())
const currentEquipment = computed(() => 
  tradeType.value === 'used' ? filteredUsedEquipment.value : filteredNewEquipment.value
)
</script>

<style scoped>


.star-texture {
  background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.1) 1px, transparent 0);
  background-size: 20px 20px;
}
</style>