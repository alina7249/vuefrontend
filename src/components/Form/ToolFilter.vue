<template>
  <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
    <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      <div class="relative flex-1">
        <input
          type="text"
          placeholder="搜索工具或功能..."
          :value="searchTerm"
          @input="onSearchChange"
          class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
        />
        <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
      </div>

      <div class="flex space-x-4">
        <select
          :value="selectedCategory"
          @change="onCategoryChange"
          class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
        >
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>

        <template v-if="showSort">
          <select
            :value="sortBy"
            @change="onSortChange"
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
          @click="onToggleTag(category)"
          :class="`px-3 py-1 rounded-full text-sm ${selectedTags.includes(category) ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]'} transition-colors`"
        >
          #{{ category }}
        </button>
      </div>

      <!--  清除标签  -->
      <template v-if="selectedTags.length > 0">
        <button
          @click="onClearTags"
          class="mt-3 text-sm text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
        >
          <i class="fa-solid fa-times mr-1"></i> 清除所有标签
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">

// 定义组件属性
const props = defineProps<{
  searchTerm: string;
  selectedCategory: string;
  selectedTags: string[];
  categories: string[];
  sortBy: string;
  showSort?: boolean;
}>();

// 定义组件事件
const emit = defineEmits<{
  (e: 'searchChange', value: string): void;
  (e: 'categoryChange', value: string): void;
  (e: 'sortChange', value: string): void;
  (e: 'toggleTag', tag: string): void;
  (e: 'clearTags'): void;
}>();

// 处理搜索输入变化
const onSearchChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('searchChange', target.value);
};

// 处理分类变化
const onCategoryChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('categoryChange', target.value);
};

// 处理排序变化
const onSortChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('sortChange', target.value);
};

// 处理标签切换
const onToggleTag = (tag: string) => {
  emit('toggleTag', tag);
};

// 处理清除标签
const onClearTags = () => {
  emit('clearTags');
};
</script>