<template>
  <div class="p-6 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
    <div
      class="w-12 h-12 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-3"
    >
      <i class="fa-solid" :class="icon"></i>
    </div>
    <p class="text-[#B8C6D8]">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">

// 定义组件属性
const props = defineProps<{
  message: string;
  icon?: string;
}>();

// 设置默认图标
const icon = props.icon || 'fa-toolbox';
</script>