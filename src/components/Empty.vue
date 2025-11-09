<template>
  <div class="flex h-full items-center justify-center" @click="onClick">Empty</div>
</template>

<script setup lang="ts">
import { toastAPI } from "@/composables/useToast";

const onClick = () => {
  toastAPI.default('Coming soon');
};
</script>

<style scoped>
/* 样式由 Tailwind 类控制，保留空白以便扩展 */
</style>