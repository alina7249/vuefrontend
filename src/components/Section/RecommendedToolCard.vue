<template>
  <motion.div
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
        @click="onAddTool"
        class="w-full py-2 text-center bg-[#6B7C93] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors text-sm"
      >
        <i class="fa-solid fa-plus mr-1"></i> 添加工具
      </button>
    </div>
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from 'framer-motion';

// 定义推荐工具数据类型
interface RecommendedTool {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  rating: number;
  users: number;
}

// 定义组件属性
const props = defineProps<{
  tool: RecommendedTool;
}>();

// 定义组件事件
const emit = defineEmits<{
  (e: 'add', toolId: string): void;
}>();

// 处理添加工具事件
const onAddTool = () => {
  emit('add', props.tool.id);
};
</script>