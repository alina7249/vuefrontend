<template>
  <div
    class="bg-[#2D3748] rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#4A5F8B] transition-all duration-300 border border-[#4A5F8B] h-[500px] flex flex-col"
  >
    <!-- 图片容器 -->
    <div class="relative flex-shrink-0">
      <RouterLink :to="`/photo/${post.id}`" class="block">
        <img
          :src="post.image"
          :alt="post.title"
          class="w-full h-60 object-cover transition-transform duration-300 hover:scale-105"
        />
      </RouterLink>
      
      <!-- 标签 - 作品标签浅蓝灰 #4A5F8B + 浅白 #F5F7FA -->
      <div class="absolute top-3 right-3 flex space-x-2">
        <span
          v-for="(tag, index) in post.tags.slice(0, 2)"
          :key="index"
          class="px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] text-xs rounded-full border border-[#4A5F8B]"
        >
          #{{ tag }}
        </span>
        <span 
          v-if="post.tags.length > 2"
          class="px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] text-xs rounded-full border border-[#4A5F8B]"
        >
          +{{ post.tags.length - 2 }}
        </span>
      </div>
    </div>

    <!-- 内容容器 -->
    <div class="p-5 flex flex-col flex-grow">
      <!-- 作者信息 -->
      <div class="flex items-center mb-3">
        <RouterLink :to="`/profile/${post.author.id}`" class="block mr-3">
          <img
            :src="post.author.avatar"
            :alt="post.author.name"
            class="w-8 h-8 rounded-full object-cover border border-[#B8C6D8]"
          />
        </RouterLink>
        <div>
          <RouterLink
            :to="`/profile/${post.author.id}`"
            class="block font-medium text-[#F5F7FA] hover:text-[#4A5F8B] transition-colors"
          >
            {{ post.author.name }}
          </RouterLink>
          <p class="text-xs text-[#B8C6D8]">
            {{ post.date }}
          </p>
        </div>
      </div>

      <!-- 标题 -->
      <RouterLink :to="`/photo/${post.id}`" class="block mb-2">
        <h3 class="text-lg font-bold text-[#F5F7FA] hover:text-[#4A5F8B] transition-colors">
          {{ post.title }}
        </h3>
      </RouterLink>

      <!-- 设备参数 -->
      <p v-if="equipmentParams" class="text-xs text-[#B8C6D8] mb-4 font-mono">{{ equipmentParams }}</p>

      <!-- 互动按钮 - 互动数据 (点赞/评论) 浅冷灰 #B8C6D8 -->
      <div class="flex items-center justify-between mt-auto">
        <div class="flex items-center space-x-4">
          <button
            @click="handleLike"
            :class="`flex items-center space-x-1 text-sm transition-colors ${
              isLiked
                ? 'text-[#4A5F8B]'
                : 'text-[#B8C6D8] hover:text-[#4A5F8B]'
            }`"
          >
            <i
              :class="`fa-solid ${isLiked ? 'fa-heart' : 'fa-heart'} transition-transform duration-300 ${isLiked ? 'scale-110' : 'scale-100'}`"
            ></i>
            <span>{{ likeCount }}</span>
          </button>
          <RouterLink
            :to="`/photo/${post.id}#comments`"
            class="flex items-center space-x-1 text-sm text-[#B8C6D8] hover:text-[#4A5F8B] transition-colors"
          >
            <i class="fa-solid fa-comment"></i>
            <span>{{ post.comments }}</span>
          </RouterLink>
        </div>
        
        <button class="text-[#B8C6D8] hover:text-[#4A5F8B] transition-colors">
          <i class="fa-solid fa-bookmark"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

// 摄影作品类型定义
export interface PhotographyPost {
  id: string;
  title: string;
  description: string;
  image: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  tags: string[];
  date: string;
}

// 摄影卡片组件属性
interface PhotographyCardProps {
  post: PhotographyPost;
}

const props = defineProps<PhotographyCardProps>();

const auth = useAuth();
const { isAuthenticated } = auth;

const isLiked = ref(false);
const likeCount = ref(props.post.likes);

// 处理点赞
const handleLike = () => {
  if (!isAuthenticated) {
    // 如果未登录，可以引导用户登录
    return;
  }
  
  isLiked.value = !isLiked.value;
  likeCount.value = isLiked.value ? likeCount.value + 1 : likeCount.value - 1;
};

// 提取设备参数信息
const equipmentParams = computed(() => {
  const firstLine = props.post.description.split('\n')[0];
  // 检查是否包含设备参数格式
  if (firstLine.includes('|')) {
    return firstLine;
  }
  return '';
});
</script>