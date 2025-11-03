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
      <TabNavigation 
        :activeTab="state.activeTab"
        @tabChange="handleTabChange"
      />

      <!--  搜索和筛选  -->
      <ToolFilter
        :searchTerm="state.searchTerm"
        :selectedCategory="state.selectedCategory"
        :selectedTags="state.selectedTags"
        :categories="categories"
        :sortBy="state.sortBy"
        :showSort="state.activeTab === 'online'"
        @searchChange="handleSearchChange"
        @categoryChange="handleCategoryChange"
        @sortChange="handleSortChange"
        @toggleTag="handleToggleTag"
        @clearTags="handleClearTags"
      />

      <template v-if="state.activeTab === 'online'">
        <!--  已添加工具列表  -->
        <div class="mb-10">
          <h2 class="text-xl font-bold text-[#F5F7FA] mb-4 flex items-center">
            <i class="fa-solid fa-toolbox mr-2 text-[#4A5F8B]"></i>
            已添加工具
          </h2>

          <div v-if="filteredAddedTools.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AddedToolCard
              v-for="tool in filteredAddedTools"
              :key="tool.id"
              :tool="tool"
              @open="handleOpenTool"
            />
          </div>

          <template v-else>
            <EmptyState 
              message="暂无符合条件的已添加工具"
              icon="fa-toolbox"
            />
          </template>
        </div>

        <!--  推荐工具列表  -->
        <div>
          <h2 class="text-xl font-bold text-[#F5F7FA] mb-4 flex items-center">
            <i class="fa-solid fa-thumbs-up mr-2 text-[#4A5F8B]"></i>
            推荐工具
          </h2>

          <div v-if="filteredRecommendedTools.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <RecommendedToolCard
              v-for="tool in filteredRecommendedTools"
              :key="tool.id"
              :tool="tool"
              @add="handleAddTool"
            />
          </div>

          <template v-else>
            <EmptyState 
              message="暂无符合条件的推荐工具"
              icon="fa-thumbs-up"
            />
          </template>
        </div>
      </template>

      <template v-if="state.activeTab === 'presets'">
        <ComingSoon
          title="个人预设"
          description="您的个人预设功能正在开发中，敬请期待"
          icon="fa-palette"
          :showButton="true"
          buttonText="功能上线提醒我"
          buttonIcon="fa-bell"
          @buttonClick="handleNotifyMe"
        />
      </template>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { motion } from 'framer-motion';

// 导入组件
import TabNavigation from '../components/Layout/TabNavigation.vue';
import ToolFilter from '../components/Form/ToolFilter.vue';
import AddedToolCard from '../components/Section/AddedToolCard.vue';
import RecommendedToolCard from '../components/Section/RecommendedToolCard.vue';
import EmptyState from '../components/Common/EmptyState.vue';
import ComingSoon from '../components/Common/ComingSoon.vue';
// 定义类型
interface AddedTool {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  usageCount: number;
  rating: number;
}

interface RecommendedTool {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  rating: number;
  users: number;
}

// Mock数据
const mockAddedTools: AddedTool[] = [
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

const mockRecommendedTools: RecommendedTool[] = [
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

// 分类数据
const categories = ['全部', '预设工具', '图像编辑', '格式转换', '批量处理', 'AI工具', '图像合成'];

// 状态管理
const state = reactive({
  activeTab: 'online',
  searchTerm: '',
  selectedCategory: '全部',
  selectedTags: [] as string[],
  sortBy: 'usage',
});

// 计算属性 - 过滤已添加工具
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

// 计算属性 - 过滤推荐工具
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

// 事件处理函数
const handleTabChange = (tab: string) => {
  state.activeTab = tab;
};

const handleSearchChange = (value: string) => {
  state.searchTerm = value;
};

const handleCategoryChange = (value: string) => {
  state.selectedCategory = value;
};

const handleSortChange = (value: string) => {
  state.sortBy = value;
};

const handleToggleTag = (tag: string) => {
  if (state.selectedTags.includes(tag)) {
    state.selectedTags = state.selectedTags.filter((t) => t !== tag);
  } else {
    state.selectedTags = [...state.selectedTags, tag];
  }
};

const handleClearTags = () => {
  state.selectedTags = [];
};

const handleOpenTool = (toolId: string) => {
  // 处理打开工具的逻辑
  console.log('打开工具:', toolId);
  // 这里可以添加实际的工具打开逻辑，比如跳转到工具页面或打开工具弹窗
};

const handleAddTool = (toolId: string) => {
  // 处理添加工具的逻辑
  console.log('添加工具:', toolId);
  // 这里可以添加实际的工具添加逻辑，比如调用API添加工具到用户账户
};

const handleNotifyMe = () => {
  // 处理功能上线提醒的逻辑
  console.log('用户请求功能上线提醒');
  // 这里可以添加实际的通知订阅逻辑，比如调用API订阅通知
};
</script>

<style lang="less" scoped src="./index.less"></style>
