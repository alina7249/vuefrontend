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
        <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">器材数据库</h1>
        <p class="text-[#B8C6D8] max-w-2xl mx-auto">
          探索专业摄影器材的详细参数、实测性能和用户评价，为您的创作选择最合适的工具
        </p>
      </div>

      <template v-if="!isComparisonMode">
        <!--  搜索和筛选  -->
        <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
          <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div class="relative flex-1">
              <input
                type="text"
                placeholder="搜索器材型号、品牌或功能..."
                :value="searchTerm"
                @change="(e) => (state.searchTerm = e.target.value)"
                class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
              />
              <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
            </div>

            <select
              :value="selectedBrand"
              @change="(e) => (state.selectedBrand = e.target.value)"
              class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <template v-for="brand in brands" :key="">
                <option :key="brand" :value="brand">{{ brand }}</option>
              </template>
            </select>
          </div>
        </div>

        <!--  器材类型选择  -->
        <div class="grid grid-cols-3 gap-4 mb-8">
          <template v-for="type in equipmentTypes" :key="">
            <motion.button
              :key="type.id"
              :whileHover="{
                y: -5,
              }"
              @click="() => (state.activeType = type.id)"
              :class="`py-4 rounded-xl flex flex-col items-center justify-center transition-all ${
                activeType === type.id
                  ? 'bg-[#4A5F8B] border-2 border-[#4A5F8B] text-[#F5F7FA] shadow-md'
                  : 'bg-[#2D3748] border border-[#4A5F8B] text-[#B8C6D8] hover:border-[#4A5F8B]'
              }`"
            >
              <i :class="`fa-solid ${type.icon} text-2xl mb-2 text-[#F5F7FA]`"></i>
              <span class="font-medium">{{ type.name }}</span>
            </motion.button>
          </template>
        </div>

        <!--  对比工具栏  -->

        <template v-if="selectedItems.length > 0">
          <div
            class="fixed bottom-0 left-0 right-0 bg-[#2D3748] border-t border-[#4A5F8B] py-3 px-4 z-50 flex items-center justify-between shadow-lg"
          >
            <div class="flex items-center">
              <i class="fa-solid fa-balance-scale text-[#4A5F8B] mr-2"></i>
              <span class="text-[#F5F7FA]">已选择 {{ selectedItems.length }}/3 件器材进行对比</span>
            </div>
            <motion.button
              :whileHover="{
                scale: 1.05,
              }"
              :whileTap="{
                scale: 0.95,
              }"
              @click="viewComparison"
              class="px-6 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#4A5F8B] transition-colors"
            >
              查看对比
            </motion.button>
          </div>
        </template>

        <!--  器材列表  -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          <template v-for="item in filteredEquipment" :key="">
            <motion.div
              :key="item.id"
              :whileHover="{
                y: -5,
                boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)',
              }"
              class="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm"
            >
              <!--  器材图片和对比选择  -->
              <div class="relative">
                <img :src="item.image" :alt="item.name" class="w-full h-48 object-cover" />
                <button
                  @click="
                    (e) => {
                      e.stopPropagation();
                      toggleCompareItem(item.id);
                    }
                  "
                  :class="`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center ${
                    selectedItems.includes(item.id) ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'bg-[#2D3748]/80 text-[#B8C6D8]'
                  } transition-colors`"
                  :title="selectedItems.includes(item.id) ? '取消对比' : '添加对比'"
                >
                  <i :class="`fa-solid ${selectedItems.includes(item.id) ? 'fa-check' : 'fa-plus'}`"></i>
                </button>
              </div>

              <!--  器材信息  -->
              <div class="p-5 bg-[#2D3748]">
                <!--  品牌和类型  -->
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-[#6B7C93] font-medium">{{ item.brand }}</span>
                  <span class="text-xs px-2 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full border border-[#4A5F8B]">{{
                    item.type
                  }}</span>
                </div>

                <!--  器材名称和价格  -->
                <h3 class="text-lg font-bold text-[#F5F7FA] mb-2">{{ item.name }}</h3>
                <p class="text-[#6B7C93] mb-4">¥{{ parseInt(item.price).toLocaleString() }}</p>

                <!--  评分  -->
                <div class="flex items-center mb-4">
                  <div class="flex items-center mr-2">
                    <template
                      v-for="(_, i) in Array.from({
                        length: 5,
                      })"
                      :key="i"
                    >
                      <i
                        :key="i"
                        :class="`fa-solid fa-star ${
                          i < Math.floor(item.rating / 2) ? 'text-[#4A5F8B]' : 'text-[#B8C6D8]'
                        }`"
                      ></i>
                    </template>
                  </div>
                  <span class="text-sm text-[#6B7C93]">{{ item.rating }}/10 ({{ item.reviewCount }} 评价)</span>
                </div>

                <!--  适用场景标签  -->
                <div class="flex flex-wrap gap-2 mb-4">
                  <template v-for="(scenario, index) in item.suitableFor.slice(0, 3)" :key="index">
                    <span
                      :key="index"
                      class="px-2 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B]"
                    >
                      {{ scenario }}
                    </span>
                  </template>
                </div>

                <!--  详情按钮  -->
                <Link
                  :to="`/equipment/${item.id}`"
                  class="block w-full py-2 text-center bg-gradient-to-r from-[#4A5F8B] to-[#2D3748] text-[#F5F7FA] rounded-lg font-medium transition-colors border border-[#4A5F8B]"
                >
                  查看详情
                </Link>
              </div>
            </motion.div>
          </template>

          <template v-if="filteredEquipment.length === 0">
            <div class="col-span-full p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
              <div
                class="w-16 h-16 bg-[#2D3748] rounded-full flex items-center justify-center text-[#63B3ED] mx-auto mb-4 border border-[#4A5F8B]"
              >
                <i class="fa-solid fa-search text-2xl"></i>
              </div>
              <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">未找到相关器材</h3>
              <p class="text-[#B8C6D8]">
                请尝试调整筛选条件或搜索其他关键词
              </p>
            </div>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="mb-8">
          <!--  返回按钮  -->
          <button
            @click="() => (state.isComparisonMode = false)"
            class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors mb-6"
          >
            <i class="fa-solid fa-arrow-left"></i>
            <span>返回器材列表</span>
          </button>

          <!--  对比标题  -->
          <h2 class="text-2xl font-bold text-[#F5F7FA] mb-6">器材对比</h2>

          <!--  对比表格  -->
          <div class="bg-[#2D3748] rounded-xl border border-[#4A5F8B] overflow-hidden mb-8">
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="bg-[#2D3748] border-b border-[#4A5F8B]">
                    <th class="px-6 py-4 text-left text-sm font-medium text-[#F5F7FA]">参数</th>

                    <template v-for="(item, index) in comparisonData" :key="index">
                      <th :key="index" class="px-6 py-4 text-left text-sm font-medium text-[#F5F7FA]">
                        <div class="flex items-center">
                          <button
                            @click="() => toggleCompareItem(item.id)"
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
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <!--  器材图片  -->
                  <tr class="border-b border-[#4A5F8B]">
                    <td class="px-6 py-4 text-sm text-[#F5F7FA] font-medium">外观</td>

                    <template v-for="(item, index) in comparisonData" :key="index">
                      <td :key="index" class="px-6 py-4 text-[#F5F7FA]">
                        <img
                          :src="item.image"
                          :alt="item.name"
                          class="w-24 h-16 object-cover rounded border border-[#4A5F8B]"
                        />
                      </td>
                    </template>
                  </tr>

                  <!--  价格  -->
                  <tr class="border-b border-[#4A5F8B]">
                    <td class="px-6 py-4 text-sm text-[#F5F7FA] font-medium">价格</td>

                    <template v-for="(item, index) in comparisonData" :key="index">
                      <td
                        :key="index"
                        :class="`px-6 py-4 text-sm ${
                          comparisonData.length > 1 &&
                          item.price === Math.min(...comparisonData.map((i) => parseInt(i.price))).toString()
                            ? 'bg-[#4A5F8B] font-medium text-[#F5F7FA]'
                            : 'text-[#F5F7FA]'
                        }`"
                      >
                        ¥{{ parseInt(item.price).toLocaleString() }}
                      </td>
                    </template>
                  </tr>

                  <!--  主要规格  -->

                  <template v-if="comparisonData[0].specs && Object.keys(comparisonData[0].specs).length > 0">
                    <template v-for="rowIndex in Object.entries(comparisonData[0].specs)" :key="rowIndex">
                      <tr :key="rowIndex" class="border-b border-[#4A5F8B]">
                        <td class="px-6 py-4 text-sm text-[#F5F7FA] font-medium">
                          {{
                            key === 'sensor'
                              ? '传感器'
                              : key === 'processor'
                              ? '处理器'
                              : key === 'iso'
                              ? 'ISO范围'
                              : key === 'autofocus'
                              ? '自动对焦'
                              : key === 'video'
                              ? '视频规格'
                              : key === 'battery'
                              ? '电池'
                              : key === 'weight'
                              ? '重量'
                              : key === 'focalLength'
                              ? '焦距'
                              : key === 'aperture'
                              ? '光圈'
                              : key === 'mount'
                              ? '卡口'
                              : key === 'construction'
                              ? '镜片结构'
                              : key === 'filterSize'
                              ? '滤镜尺寸'
                              : key === 'minFocusDistance'
                              ? '最近对焦距离'
                              : key === 'material'
                              ? '材质'
                              : key === 'maximumHeight'
                              ? '最大高度'
                              : key === 'minimumHeight'
                              ? '最小高度'
                              : key === 'loadCapacity'
                              ? '承重'
                              : key === 'sections'
                              ? '节数'
                              : key === 'power'
                              ? '功率'
                              : key === 'recyclingTime'
                              ? '回电时间'
                              : key === 'compatibility'
                              ? '兼容性'
                              : key
                          }}
                        </td>

                        <template v-for="(item, index) in comparisonData" :key="index">
                          <td :key="index" class="px-6 py-4 text-sm text-[#F5F7FA]">
                            <template v-if="item.specs"> </template>
                          </td>
                        </template>
                      </tr>
                    </template>
                  </template>

                  <!--  优缺点  -->
                  <tr class="border-b border-[#4A5F8B]">
                    <td class="px-6 py-4 text-sm text-[#F5F7FA] font-medium">优点</td>

                    <template v-for="(item, index) in comparisonData" :key="index">
                      <td :key="index" class="px-6 py-4 text-sm text-[#F5F7FA]">
                        <ul class="list-disc pl-5 space-y-1">
                          <template v-for="(pro, i) in item.pros.slice(0, 3)" :key="i">
                            <li :key="i">{{ pro }}</li>
                          </template>
                        </ul>
                      </td>
                    </template>
                  </tr>
                  <tr class="border-b border-[#4A5F8B]">
                    <td class="px-6 py-4 text-sm text-[#F5F7FA] font-medium">缺点</td>

                    <template v-for="(item, index) in comparisonData" :key="index">
                      <td :key="index" class="px-6 py-4 text-sm text-[#F5F7FA]">
                        <ul class="list-disc pl-5 space-y-1">
                          <template v-for="(con, i) in item.cons.slice(0, 3)" :key="i">
                            <li :key="i">{{ con }}</li>
                          </template>
                        </ul>
                      </td>
                    </template>
                  </tr>

                  <!--  适用场景  -->
                  <tr class="border-b border-[#4A5F8B]">
                    <td class="px-6 py-4 text-sm text-[#F5F7FA] font-medium">适用场景</td>

                    <template v-for="(item, index) in comparisonData" :key="index">
                      <td :key="index" class="px-6 py-4 text-sm text-[#F5F7FA]">
                        <div class="flex flex-wrap gap-1">
                          <template v-for="(scenario, i) in item.suitableFor" :key="i">
                            <span :key="i" class="px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-xs">
                              {{ scenario }}
                            </span>
                          </template>
                        </div>
                      </td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!--  性能对比雷达图  -->

          <template v-if="comparisonData.length > 0">
            <div class="bg-[#2D3748] rounded-xl border border-[#4A5F8B] p-6 mb-8">
              <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">性能对比</h3>
              <div class="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart :outerRadius="90" :data="radarData">
                    <PolarGrid stroke="#4A5F8B" />
                    <PolarAngleAxis
                      dataKey="category"
                      :tick="{
                        fill: '#B8C6D8',
                        fontSize: 12,
                      }"
                    />

                    <template v-for="(item, index) in comparisonData" :key="index">
                      <Radar
                        :key="index"
                        :name="item.name"
                        :dataKey="`item${index + 1}`"
                        :stroke="COLORS[index % COLORS.length]"
                        :fill="COLORS[index % COLORS.length]"
                        :fillOpacity="0.3"
                      />
                    </template>
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div class="flex justify-center mt-4 space-x-6">
                <template v-for="(item, index) in comparisonData" :key="index">
                  <div :key="index" class="flex items-center">
                    <span
                      class="w-3 h-3 rounded-full mr-2"
                      :style="{
                        backgroundColor: COLORS[index % COLORS.length],
                      }"
                    ></span>
                    <span class="text-sm text-[#F5F7FA]">{{ item.name }}</span>
                  </div>
                </template>
              </div>
            </div>
          </template>

          <!--  推荐购买链接  -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <template v-for="(item, index) in comparisonData" :key="index">
              <div :key="index" class="bg-[#2D3748] rounded-xl border border-[#4A5F8B] p-4">
                <h4 class="text-md font-medium text-[#F5F7FA] mb-3">{{ item.name }}</h4>
                <p class="text-lg font-bold text-[#F5F7FA] mb-4">¥{{ parseInt(item.price).toLocaleString() }}</p>
                <div class="flex justify-between">
                  <Link
                    :to="`/equipment/${item.id}`"
                    class="px-4 py-2 bg-[#2D3748] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors text-sm border border-[#4A5F8B]"
                  >
                    查看详情
                  </Link>
                  <button
                    class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#4A5F8B] transition-colors text-sm border border-[#4A5F8B]"
                  >
                    立即购买
                  </button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { Link } from 'react-router-dom';
  import { motion } from 'framer-motion';
  import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
  const mockCameras = [
    {
      id: '1',
      name: 'Sony A7R V',
      type: '微单',
      brand: 'Sony',
      price: '26999',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20a7rv%20mirrorless%20camera%20professional%20photography&sign=6b099a6dd31856f91c56e9cc8bcfe622',
      specs: {
        sensor: '6100万像素全画幅CMOS',
        processor: 'BIONZ XR',
        iso: '100-32000 (可扩展至50-102400)',
        autofocus: '693点相位检测+425点对比度检测',
        video: '8K 24p / 4K 60p',
        battery: 'NP-FZ100 (约520张)',
        weight: '657g',
      },
      performance: {
        dynamicRange: 9.5,
        lowLight: 9.0,
        autofocus: 9.8,
        ergonomics: 8.5,
        buildQuality: 9.2,
        valueForMoney: 8.7,
      },
      pros: ['高分辨率传感器', '出色的自动对焦系统', '优秀的图像质量', '专业视频功能'],
      cons: ['价格较高', '电池续航一般', '体积相对较大'],
      suitableFor: ['风景摄影', '商业摄影', '人像摄影', '视频创作'],
      rating: 9.4,
      reviewCount: 124,
      tags: ['全画幅', '高像素', '专业', '视频'],
    },
    {
      id: '2',
      name: 'Canon EOS R6 II',
      type: '微单',
      brand: 'Canon',
      price: '18999',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=canon%20eos%20r6%20ii%20mirrorless%20camera%20professional&sign=5c10cdaa6af6f617051ab2b5672a9a55',
      specs: {
        sensor: '2420万像素全画幅CMOS',
        processor: 'DIGIC X',
        iso: '100-102400 (可扩展至50-204800)',
        autofocus: '4503点相位检测',
        video: '4K 60p / Full HD 180p',
        battery: 'LP-E6NH (约510张)',
        weight: '680g',
      },
      performance: {
        dynamicRange: 8.8,
        lowLight: 9.3,
        autofocus: 9.7,
        ergonomics: 9.0,
        buildQuality: 9.0,
        valueForMoney: 9.0,
      },
      pros: ['高速连拍', '优秀的弱光性能', '可靠的自动对焦', '良好的人体工学'],
      cons: ['像素略低', '4K 60p有裁剪', '菜单系统复杂'],
      suitableFor: ['运动摄影', '人像摄影', '新闻摄影', '视频创作'],
      rating: 9.2,
      reviewCount: 98,
      tags: ['全画幅', '高速', '专业', '视频'],
    },
    {
      id: '3',
      name: 'Fujifilm X-T5',
      type: '微单',
      brand: 'Fujifilm',
      price: '15999',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=fujifilm%20x-t5%20mirrorless%20camera%20retro%20style&sign=cbc979cbc3abed815ce131f384076fa8',
      specs: {
        sensor: '4020万像素APS-C CMOS',
        processor: 'X-Processor 5',
        iso: '160-12800 (可扩展至80-51200)',
        autofocus: '425点相位检测',
        video: '4K 60p',
        battery: 'NP-W235 (约510张)',
        weight: '557g',
      },
      performance: {
        dynamicRange: 8.7,
        lowLight: 8.5,
        autofocus: 9.0,
        ergonomics: 9.3,
        buildQuality: 9.2,
        valueForMoney: 8.8,
      },
      pros: ['复古外观', '高分辨率', '优秀的色彩科学', '轻巧便携'],
      cons: ['APS-C画幅', '视频功能相对有限', '自动对焦追焦一般'],
      suitableFor: ['风景摄影', '街头摄影', '人像摄影', '旅行摄影'],
      rating: 9.0,
      reviewCount: 76,
      tags: ['APS-C', '复古', '高像素', '便携'],
    },
    {
      id: '4',
      name: 'Nikon Z7 II',
      type: '微单',
      brand: 'Nikon',
      price: '21999',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=nikon%20z7%20ii%20mirrorless%20camera%20professional&sign=6a497fab6e33e8ccc3413db6dfdea97d',
      specs: {
        sensor: '4575万像素全画幅CMOS',
        processor: '双EXPEED 6',
        iso: '64-25600 (可扩展至32-102400)',
        autofocus: '493点相位检测',
        video: '4K 60p',
        battery: 'EN-EL15c (约420张)',
        weight: '675g',
      },
      performance: {
        dynamicRange: 9.4,
        lowLight: 8.8,
        autofocus: 9.2,
        ergonomics: 8.8,
        buildQuality: 9.3,
        valueForMoney: 8.5,
      },
      pros: ['高分辨率', '优秀的动态范围', '坚固耐用', '兼容FTZ适配器'],
      cons: ['电池续航较短', '自动对焦性能一般', '视频功能不如竞品'],
      suitableFor: ['风景摄影', '商业摄影', '人像摄影', '建筑摄影'],
      rating: 9.1,
      reviewCount: 65,
      tags: ['全画幅', '高像素', '专业', '耐用'],
    },
  ];
  const mockLenses = [
    {
      id: 'l1',
      name: 'Sony FE 24-70mm F2.8 GM II',
      type: '变焦镜头',
      brand: 'Sony',
      price: '19999',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20fe%2024-70mm%20f2.8%20gm%20ii%20lens%20professional&sign=cf947b7d5153c26105db97fef95b85ef',
      specs: {
        focalLength: '24-70mm',
        aperture: 'F2.8',
        mount: 'Sony E',
        construction: '16组21片（含3片XA、1片ED、2片Super ED镜片）',
        filterSize: '82mm',
        weight: '695g',
        minFocusDistance: '0.38m',
      },
      performance: {
        sharpness: 9.8,
        bokeh: 9.2,
        autofocus: 9.7,
        buildQuality: 9.5,
        handling: 9.0,
        valueForMoney: 8.5,
      },
      pros: ['出色的锐度', '快速安静的自动对焦', '轻巧的体积', '优秀的光学素质'],
      cons: ['价格昂贵', '滤镜尺寸大', '全焦段F2.8稍重'],
      suitableFor: ['商业摄影', '人像摄影', '婚礼摄影', '风光摄影'],
      rating: 9.6,
      reviewCount: 89,
      tags: ['全画幅', '大三元', '标准变焦', '专业'],
    },
    {
      id: 'l2',
      name: 'Canon RF 50mm F1.2L USM',
      type: '定焦镜头',
      brand: 'Canon',
      price: '15999',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=canon%20rf%2050mm%20f1.2l%20usm%20lens%20portrait&sign=ccbbff2b63dea2a85dd6a48b863fe95d',
      specs: {
        focalLength: '50mm',
        aperture: 'F1.2',
        mount: 'Canon RF',
        construction: '15组18片（含1片UD、1片研磨非球面镜片）',
        filterSize: '77mm',
        weight: '950g',
        minFocusDistance: '0.45m',
      },
      performance: {
        sharpness: 9.5,
        bokeh: 9.8,
        autofocus: 9.3,
        buildQuality: 9.6,
        handling: 8.7,
        valueForMoney: 8.2,
      },
      pros: ['出色的虚化效果', '优秀的弱光表现', '坚固的做工', '高质量的图像'],
      cons: ['价格昂贵', '体积重量大', '对焦稍慢'],
      suitableFor: ['人像摄影', '街头摄影', '婚礼摄影', '艺术摄影'],
      rating: 9.4,
      reviewCount: 76,
      tags: ['全画幅', '大光圈', '标准定焦', '人像'],
    },
  ];
  const mockAccessories = [
    {
      id: 'a1',
      name: 'Gitzo GT3543LS Systematic碳纤维三脚架',
      type: '三脚架',
      brand: 'Gitzo',
      price: '8999',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=gitzo%20tripod%20carbon%20fiber%20professional&sign=1c0fe9951c0482da7c884f40006d4717',
      specs: {
        material: '碳纤维',
        maximumHeight: '170cm',
        minimumHeight: '11cm',
        weight: '1.95kg',
        loadCapacity: '30kg',
        sections: '4节',
      },
      performance: {
        stability: 9.8,
        buildQuality: 9.9,
        portability: 8.5,
        versatility: 9.0,
        valueForMoney: 8.0,
      },
      pros: ['超高稳定性', '轻巧便携', '坚固耐用', '精准的调节'],
      cons: ['价格昂贵', '调节稍复杂', '收纳长度较长'],
      suitableFor: ['风景摄影', '长时间曝光', '微距摄影', '视频拍摄'],
      rating: 9.5,
      reviewCount: 43,
      tags: ['专业', '碳纤维', '稳定', '高端'],
    },
    {
      id: 'a2',
      name: 'Profoto A1X AirTTL-C 闪光灯',
      type: '闪光灯',
      brand: 'Profoto',
      price: '11999',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=profoto%20a1x%20flash%20portable%20professional&sign=e3f116ecaf94060b4684b34ee2593bef',
      specs: {
        power: '76Ws',
        recyclingTime: '0.05-1.2秒',
        battery: '可充电锂电池（约450次闪光）',
        weight: '540g',
        compatibility: 'Canon、Nikon、Sony、Fujifilm等',
      },
      performance: {
        power: 9.5,
        portability: 8.5,
        batteryLife: 9.0,
        easeOfUse: 8.7,
        valueForMoney: 7.8,
      },
      pros: ['强大的输出', '便携设计', '无线控制', '高速回电'],
      cons: ['价格昂贵', '体积较大', '配件系统复杂'],
      suitableFor: ['人像摄影', '商业摄影', '婚礼摄影', '创意摄影'],
      rating: 9.2,
      reviewCount: 35,
      tags: ['专业', '便携', '高速', '无线'],
    },
  ];
  const brands = ['全部', 'Sony', 'Canon', 'Nikon', 'Fujifilm', 'Panasonic', 'Leica', 'Sigma', 'Tamron', 'DJI'];
  const equipmentTypes = [
    { id: 'cameras', name: '相机', icon: 'fa-camera' },
    { id: 'lenses', name: '镜头', icon: 'fa-video' },
    { id: 'accessories', name: '配件', icon: 'fa-toolbox' },
  ];
  const state = reactive({
    activeType: 'cameras',
    selectedBrand: '全部',
    selectedItems: [],
    isComparisonMode: false,
    searchTerm: '',
  });
  // 过滤器材
  const getFilteredEquipment = () => {
    let equipment = [];

    switch (activeType) {
      case 'cameras':
        equipment = mockCameras;
        break;

      case 'lenses':
        equipment = mockLenses;
        break;

      case 'accessories':
        equipment = mockAccessories;
        break;

      default:
        equipment = mockCameras;
    } // 按品牌过滤

    if (selectedBrand !== '全部') {
      equipment = equipment.filter((item) => item.brand === selectedBrand);
    } // 按搜索词过滤

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      equipment = equipment.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.brand.toLowerCase().includes(term) ||
          (item.type && item.type.toLowerCase().includes(term))
      );
    }

    return equipment;
  }; // 添加/移除对比项
  // 添加/移除对比项
  const toggleCompareItem = (id: string) => {
    if (selectedItems.includes(id)) {
      state.selectedItems = selectedItems.filter((itemId) => itemId !== id);
    } else {
      if (selectedItems.length < 3) {
        state.selectedItems = [...selectedItems, id];
      }
    }
  }; // 查看对比
  // 查看对比
  const viewComparison = () => {
    state.isComparisonMode = true;
  }; // 获取对比数据
  // 获取对比数据
  const getComparisonData = () => {
    let allEquipment: any[] = [...mockCameras, ...mockLenses, ...mockAccessories];
    return selectedItems.map((id) => allEquipment.find((item) => item.id === id)).filter(Boolean);
  }; // 获取性能雷达图数据
  // 获取性能雷达图数据
  const getRadarData = (items: any[]) => {
    if (!items || items.length === 0) return [];
    const radarData: any[] = [];
    const categories = Object.keys(items[0].performance);
    categories.forEach((category) => {
      const dataPoint: any = {
        category: translateCategory(category),
      };
      items.forEach((item, index) => {
        dataPoint[`item${index + 1}`] = item.performance[category as keyof typeof item.performance] || 0;
      });
      radarData.push(dataPoint);
    });
    return radarData;
  }; // 分类名称翻译
  // 分类名称翻译
  const translateCategory = (category: string) => {
    const translations: {
      [key: string]: string;
    } = {
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
      power: '功率',
    };
    return translations[category] || category;
  }; // 颜色配置
  // 颜色配置
  const COLORS = ['#4A5F8B', '#8884d8', '#B8C6D8', '#E6EBF2'];
  const filteredEquipment = getFilteredEquipment();
  const comparisonData = getComparisonData();
  const radarData = getRadarData(comparisonData);
</script>

<style lang="less" scoped src="./index.less"></style>
