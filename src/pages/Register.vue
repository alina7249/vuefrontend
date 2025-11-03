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
      <!--  返回按钮  -->
      <div class="mb-6">
        <RouterLink
          to="/profile-center"
          class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
        >
          <i class="fa-solid fa-arrow-left"></i>
          <span>返回个人中心</span>
        </RouterLink>
      </div>

      <!--  页面标题  -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">我的后期工具</h1>
        <p class="text-[#B8C6D8] max-w-2xl mx-auto">
          管理和使用您的在线后期工具，提升照片编辑效率
        </p>
      </div>

      <!--  顶部选项卡  -->
      <div class="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] mb-8">
        <div class="flex">
          <button
            @click="() => (state.activeTab = 'online')"
            :class="`flex-1 py-4 font-medium transition-colors ${
              state.activeTab === 'online'
                ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
            }`"
          >
            在线工具
          </button>
          <button
            @click="() => (state.activeTab = 'presets')"
            :class="`flex-1 py-4 font-medium transition-colors ${
              state.activeTab === 'presets'
                ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
            }`"
          >
            个人预设
          </button>
        </div>
      </div>

      <!--  搜索和筛选  -->
      <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div class="relative flex-1">
            <input
              type="text"
              placeholder="搜索工具或功能..."
              :value="state.searchTerm"
              @change="(e) => (state.searchTerm = (e.target as HTMLInputElement).value)"
              class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
            />
            <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
          </div>

          <div class="flex space-x-4">
            <select
              :value="state.selectedCategory"
              @change="(e) => (state.selectedCategory = (e.target as HTMLSelectElement).value)"
              class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
            </select>

            <template v-if="state.activeTab === 'online'">
              <select
                :value="state.sortBy"
                @change="(e) => (state.sortBy = (e.target as HTMLSelectElement).value)"
                class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
              >
                <option value="usage">使用频率</option>
                <option value="rating">评分</option>
                <option value="name">名称排序</option>
              </select>
            </template>
          </div>
        </div>

        <!--  标签筛选  -->
        <div class="mt-4">
          <h4 class="text-sm font-medium text-[#B8C6D8] mb-2">按标签筛选</h4>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="category in categories.filter((cat) => cat !== '全部')"
              :key="category"
              @click="() => toggleTag(category)"
              :class="`px-3 py-1 rounded-full text-sm ${
                state.selectedTags.includes(category)
                  ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                  : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]'
              } transition-colors`"
            >
              #{{ category }}
            </button>
          </div>

          <!--  清除标签  -->
          <template v-if="state.selectedTags.length > 0">
            <button
              @click="() => (state.selectedTags = [])"
              class="mt-3 text-sm text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
            >
              <i class="fa-solid fa-times mr-1"></i> 清除所有标签
            </button>
          </template>
        </div>
      </div>

      <template v-if="state.activeTab === 'online'">
        <!--  已添加工具列表  -->
        <div class="mb-10">
          <h2 class="text-xl font-bold text-[#F5F7FA] mb-4 flex items-center">
            <i class="fa-solid fa-toolbox mr-2 text-[#4A5F8B]"></i>
            已添加工具
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              v-for="tool in filteredAddedTools"
              :key="tool.id"
              :whileHover="{
                y: -5,
                boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)',
              }"
              class="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm"
            >
              <!--  工具缩略图  -->
              <div class="relative">
                <img :src="tool.thumbnail" :alt="tool.name" class="w-full h-36 object-cover" />
                <div class="absolute top-3 right-3">
                  <span class="px-2 py-1 bg-[#4A5F8B]/80 text-[#F5F7FA] text-xs rounded">
                    {{ tool.category }}
                  </span>
                </div>
              </div>

              <!--  工具信息  -->
              <div class="p-4">
                <h3 class="text-base font-bold text-[#F5F7FA] mb-1">{{ tool.name }}</h3>
                <p class="text-xs text-[#B8C6D8] mb-3 line-clamp-2">
                  {{ tool.description }}
                </p>

                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center space-x-2 text-xs text-[#B8C6D8]">
                    <span class="flex items-center">
                      <i class="fa-solid fa-star mr-1 text-[#4A5F8B]"></i>
                      {{ tool.rating }}
                    </span>
                    <span class="flex items-center">
                      <i class="fa-solid fa-clock mr-1 text-[#4A5F8B]"></i>
                      {{ tool.usageCount }}次使用
                    </span>
                  </div>
                </div>

                <!--  操作按钮  -->
                <button
                  class="w-full py-2 text-center bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-sm"
                >
                  <i class="fa-solid fa-external-link-alt mr-1"></i> 打开工具
                </button>
              </div>
            </motion.div>
          </div>

          <template v-if="filteredAddedTools.length === 0">
            <div class="p-6 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
              <div
                class="w-12 h-12 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-3"
              >
                <i class="fa-solid fa-toolbox text-xl"></i>
              </div>
              <p class="text-[#B8C6D8]">暂无符合条件的已添加工具</p>
            </div>
          </template>
        </div>

        <!--  推荐工具列表  -->
        <div>
          <h2 class="text-xl font-bold text-[#F5F7FA] mb-4 flex items-center">
            <i class="fa-solid fa-thumbs-up mr-2 text-[#4A5F8B]"></i>
            推荐工具
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              v-for="tool in filteredRecommendedTools"
              :key="tool.id"
              :whileHover="{
                y: -5,
                boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)',
              }"
              class="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm"
            >
              <!--  工具缩略图  -->
              <div class="relative">
                <img :src="tool.thumbnail" :alt="tool.name" class="w-full h-36 object-cover" />
                <div class="absolute top-3 right-3">
                  <span class="px-2 py-1 bg-[#4A5F8B]/80 text-[#F5F7FA] text-xs rounded">
                    {{ tool.category }}
                  </span>
                </div>
              </div>

              <!--  工具信息  -->
              <div class="p-4">
                <h3 class="text-base font-bold text-[#F5F7FA] mb-1">{{ tool.name }}</h3>
                <p class="text-xs text-[#B8C6D8] mb-3 line-clamp-2">
                  {{ tool.description }}
                </p>

                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center space-x-2 text-xs text-[#B8C6D8]">
                    <span class="flex items-center">
                      <i class="fa-solid fa-star mr-1 text-[#4A5F8B]"></i>
                      {{ tool.rating }}
                    </span>
                    <span class="flex items-center">
                      <i class="fa-solid fa-user mr-1 text-[#4A5F8B]"></i>
                      {{ tool.users }}人使用
                    </span>
                  </div>
                </div>

                <!--  操作按钮  -->
                <button
                  class="w-full py-2 text-center bg-[#6B7C93] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors text-sm"
                >
                  <i class="fa-solid fa-plus mr-1"></i> 添加工具
                </button>
              </div>
            </motion.div>
          </div>

          <template v-if="filteredRecommendedTools.length === 0">
            <div class="p-6 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
              <div
                class="w-12 h-12 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-3"
              >
                <i class="fa-solid fa-thumbs-up text-xl"></i>
              </div>
              <p class="text-[#B8C6D8]">暂无符合条件的推荐工具</p>
            </div>
          </template>
        </div>
      </template>

      <template v-if="state.activeTab === 'presets'">
        <div class="bg-[#2D3748] rounded-xl p-10 text-center border border-[#4A5F8B]">
          <div class="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
            <i class="fa-solid fa-palette text-2xl"></i>
          </div>
          <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">个人预设</h3>
          <p class="text-[#B8C6D8] mb-6 max-w-md mx-auto">
            您的个人预设功能正在开发中，敬请期待
          </p>
          <button
            class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors inline-flex items-center"
          >
            <i class="fa-solid fa-bell mr-2"></i>
            功能上线提醒我
          </button>
        </div>
      </template>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { motion } from 'framer-motion';

const mockAddedTools = [
  {
    id: 't1',
    name: 'Lightroom 预设编辑器',
    description: '自定义和应用Lightroom预设，调整照片色调、对比度等参数',
    thumbnail:
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=lightroom%20preset%20editor%20interface%20tool&sign=42661b7d2c987e965f113dcc6f3dac60',
    category: '预设工具',
    usageCount: 35,
    rating: 4.8,
  },
  {
    id: 't2',
    name: 'Photoshop 在线编辑器',
    description: '基础的在线Photoshop功能，适合快速编辑和调整照片',
    thumbnail:
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=photoshop%20online%20editor%20interface%20tool&sign=ba958b5aae10d256ff78fd63cdd9317e',
    category: '图像编辑',
    usageCount: 28,
    rating: 4.7,
  },
  {
    id: 't3',
    name: 'RAW 格式转换器',
    description: '将RAW格式照片转换为各种常用图像格式，支持批量处理',
    thumbnail:
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=raw%20format%20converter%20interface%20tool&sign=4b092bc64a2cfa96e4b3e8a40f290cf7',
    category: '格式转换',
    usageCount: 19,
    rating: 4.5,
  },
  {
    id: 't4',
    name: '批量水印工具',
    description: '为多张照片添加自定义水印，支持调整位置、透明度和大小',
    thumbnail:
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=batch%20watermark%20tool%20interface%20utility&sign=a1f93a0268496bbb87f0338ad8bf46f9',
    category: '批量处理',
    usageCount: 14,
    rating: 4.6,
  },
];

const mockRecommendedTools = [
  {
    id: 'r1',
    name: 'AI 图像增强器',
    description: '利用AI技术增强照片细节，提升图像质量和清晰度',
    thumbnail:
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=ai%20image%20enhancer%20interface%20technology&sign=768e0f379d08771771ae078ef49eea14',
    category: 'AI工具',
    rating: 4.9,
    users: 1254,
  },
  {
    id: 'r2',
    name: '智能修图助手',
    description: '自动识别照片问题并提供智能修复建议，简化后期流程',
    thumbnail:
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=smart%20photo%20editing%20assistant%20interface&sign=b84f99b6914c313fa707037053558c76',
    category: 'AI工具',
    rating: 4.8,
    users: 987,
  },
  {
    id: 'r3',
    name: '照片拼接工具',
    description: '将多张照片拼接成全景图或接片，支持自动对齐和色调匹配',
    thumbnail:
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=photo%20stitching%20tool%20interface%20panorama&sign=f7e67a8de86c9cb816820d67f4fd53a0',
    category: '图像合成',
    rating: 4.7,
    users: 876,
  },
  {
    id: 'r4',
    name: 'HDR 合成工具',
    description: '将多张不同曝光的照片合成为HDR图像，保留更多细节',
    thumbnail:
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=hdr%20image%20merge%20tool%20interface%20photography&sign=941b75b668557d29e52aefb0289a6d9a',
    category: '图像合成',
    rating: 4.6,
    users: 765,
  },
];

const categories = ['全部', '预设工具', '图像编辑', '格式转换', '批量处理', 'AI工具', '图像合成'];

const state = reactive({
  activeTab: 'online',
  searchTerm: '',
  selectedCategory: '全部',
  selectedTags: [],
  sortBy: 'usage',
});

// 切换标签
const toggleTag = (tag: string) => {
  if (state.selectedTags.includes(tag)) {
    state.selectedTags = state.selectedTags.filter((t) => t !== tag);
  } else {
    state.selectedTags = [...state.selectedTags, tag];
  }
};

// 过滤已添加工具
const filteredAddedTools = computed(() => {
  let tools = [...mockAddedTools];
  
  // 按分类过滤
  if (state.selectedCategory !== '全部') {
    tools = tools.filter((tool) => tool.category === state.selectedCategory);
  }
  
  // 按搜索词过滤
  if (state.searchTerm) {
    const term = state.searchTerm.toLowerCase();
    tools = tools.filter(
      (tool) => tool.name.toLowerCase().includes(term) || tool.description.toLowerCase().includes(term)
    );
  }
  
  // 按标签过滤
  if (state.selectedTags.length > 0) {
    tools = tools.filter((tool) => state.selectedTags.some((tag) => tool.category === tag));
  }
  
  // 排序
  if (state.sortBy === 'usage') {
    tools.sort((a, b) => b.usageCount - a.usageCount);
  } else if (state.sortBy === 'rating') {
    tools.sort((a, b) => b.rating - a.rating);
  } else if (state.sortBy === 'name') {
    tools.sort((a, b) => a.name.localeCompare(b.name));
  }

  return tools;
});

// 过滤推荐工具
const filteredRecommendedTools = computed(() => {
  let tools = [...mockRecommendedTools];
  
  // 按分类过滤
  if (state.selectedCategory !== '全部') {
    tools = tools.filter((tool) => tool.category === state.selectedCategory);
  }
  
  // 按搜索词过滤
  if (state.searchTerm) {
    const term = state.searchTerm.toLowerCase();
    tools = tools.filter(
      (tool) => tool.name.toLowerCase().includes(term) || tool.description.toLowerCase().includes(term)
    );
  }
  
  // 按标签过滤
  if (state.selectedTags.length > 0) {
    tools = tools.filter((tool) => state.selectedTags.some((tag) => tool.category === tag));
  }

  return tools;
});
</script>

<style scoped>
/* Register page styles */
</style>
