<template>
  <div class="bg-[#2D3748] rounded-xl p-10 text-center border border-[#4A5F8B]">
    <div class="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
      <i class="fa-solid" :class="icon"></i>
    </div>
    <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">{{ title }}</h3>
    <p class="text-[#B8C6D8] mb-6 max-w-md mx-auto">
      {{ description }}
    </p>
    <button
      v-if="showButton"
      @click="onButtonClick"
      class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors inline-flex items-center"
    >
      <i class="fa-solid" :class="buttonIcon"></i>
      <span class="ml-2">{{ buttonText }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">

// 定义组件属性
const props = defineProps<{
  title: string;
  description: string;
  icon?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonIcon?: string;
}>();

// 设置默认值
const icon = props.icon || 'fa-palette';
const buttonIcon = props.buttonIcon || 'fa-bell';

// 定义组件事件
const emit = defineEmits<{
  (e: 'buttonClick'): void;
}>();

// 处理按钮点击
const onButtonClick = () => {
  emit('buttonClick');
};
</script>