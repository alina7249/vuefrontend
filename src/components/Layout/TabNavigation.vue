<template>
  <div class="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] mb-8">
    <div class="flex">
      <button
        @click="onTabChange('online')"
        :class="`flex-1 py-4 font-medium transition-colors ${activeTab === 'online' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'}`"
      >
        在线工具
      </button>
      <button
        @click="onTabChange('presets')"
        :class="`flex-1 py-4 font-medium transition-colors ${activeTab === 'presets' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'}`"
      >
        个人预设
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">

// 定义组件属性
const props = defineProps<{
  activeTab: string;
}>();

// 定义组件事件
const emit = defineEmits<{
  (e: 'tabChange', tab: string): void;
}>();

// 处理标签页切换
const onTabChange = (tab: string) => {
  emit('tabChange', tab);
};
</script>