<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen">
    <div class="flex flex-col items-center justify-center h-[60vh] text-center">
      <div class="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
        <i class="fa-solid fa-user-lock text-2xl"></i>
      </div>
      <h2 class="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
      <p class="text-[#B8C6D8] mb-6 max-w-md">登录后查看您的个人素材库，管理RAW素材和预设</p>
      <Link
        to="/login"
        class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors"
      >
        立即登录
      </Link>
    </div>
  </div>
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
      <!--  返回按钮  -->
      <div class="mb-6">
        <Link
          to="/profile-center"
          class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
        >
          <i class="fa-solid fa-arrow-left"></i>
          <span>返回个人中心</span>
        </Link>
      </div>

      <!--  页面标题  -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">我的素材库</h1>
        <p class="text-[#B8C6D8] max-w-2xl mx-auto">
          管理您的RAW素材、后期预设和其他摄影资源
        </p>
      </div>

      <!--  素材类型选择  -->
      <div class="grid grid-cols-2 gap-4 mb-8">
        <motion.button
          :whileHover="{
            y: -5,
          }"
          @click="() => (state.activeTab = 'raw')"
          :class="`py-4 rounded-xl flex flex-col items-center justify-center transition-all ${
            activeTab === 'raw'
              ? 'bg-[#4A5F8B] text-[#F5F7FA] border-2 border-[#4A5F8B] shadow-md'
              : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]'
          }`"
        >
          <i class="fa-solid fa-file-image text-2xl mb-2"></i>
          <span class="font-medium">RAW素材</span>
        </motion.button>

        <motion.button
          :whileHover="{
            y: -5,
          }"
          @click="() => (state.activeTab = 'presets')"
          :class="`py-4 rounded-xl flex flex-col items-center justify-center transition-all ${
            activeTab === 'presets'
              ? 'bg-[#4A5F8B] text-[#F5F7FA] border-2 border-[#4A5F8B] shadow-md'
              : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]'
          }`"
        >
          <i class="fa-solid fa-palette text-2xl mb-2"></i>
          <span class="font-medium">后期预设</span>
        </motion.button>
      </div>

      <!--  搜索和筛选  -->
      <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div class="relative flex-1">
            <input
              type="text"
              :placeholder="`搜索${activeTab === 'raw' ? 'RAW素材' : '预设'}...`"
              :value="searchTerm"
              @change="(e) => (state.searchTerm = e.target.value)"
              class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
            />
            <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
          </div>

          <select
            :value="sortBy"
            @change="(e) => (state.sortBy = e.target.value)"
            class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
          >
            <option value="date">按日期排序</option>
            <option value="name">按名称排序</option>
            <option value="size">按大小排序</option>

            <template v-if="activeTab === 'presets'">
              <option value="used">按使用次数</option>
            </template>
          </select>
        </div>

        <!--  标签筛选  -->

        <template v-if="allTags.length > 0">
          <div class="mt-4">
            <h4 class="text-sm font-medium text-[#B8C6D8] mb-2">按标签筛选</h4>
            <div class="flex flex-wrap gap-2">
              <template v-for="tag in allTags" :key="">
                <button
                  :key="tag"
                  @click="() => toggleTag(tag)"
                  :class="`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag)
                      ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                      : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]'
                  } transition-colors`"
                >
                  #{{ tag }}
                </button>
              </template>
            </div>

            <!--  清除标签  -->

            <template v-if="selectedTags.length > 0">
              <button
                @click="() => (state.selectedTags = [])"
                class="mt-3 text-sm text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
              >
                <i class="fa-solid fa-times mr-1"></i> 清除所有标签
              </button>
            </template>
          </div>
        </template>
      </div>

      <!--  添加素材按钮  -->
      <div class="mb-8 text-center">
        <button
          class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors inline-flex items-center"
        >
          <i class="fa-solid fa-upload mr-2"></i>
          上传{{ activeTab === 'raw' ? 'RAW素材' : '预设' }}
        </button>
      </div>

      <!--  素材列表  -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <template v-for="item in filteredItems" :key="">
          <motion.div
            :key="item.id"
            :whileHover="{
              y: -5,
              boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)',
            }"
            class="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm"
          >
            <!--  素材缩略图  -->
            <div class="relative">
              <img :src="item.thumbnail" :alt="item.name" class="w-full h-48 object-cover" />
              <div class="absolute top-3 right-3">
                <span class="px-2 py-1 bg-[#4A5F8B]/80 text-[#F5F7FA] text-xs rounded">
                  {{ item.type }}
                </span>
              </div>
            </div>

            <!--  素材信息  -->
            <div class="p-5">
              <h3 class="text-lg font-bold text-[#F5F7FA] mb-2">{{ item.name }}</h3>

              <!--  素材基本信息  -->
              <div class="space-y-1 mb-4">
                <div class="flex items-center justify-between text-sm text-[#B8C6D8]">
                  <span>大小</span>
                  <span>{{ item.size }}</span>
                </div>
                <div class="flex items-center justify-between text-sm text-[#B8C6D8]">
                  <span>日期</span>
                  <span>{{ item.date }}</span>
                </div>

                <template v-if="activeTab === 'raw'">
                  <div class="flex items-center justify-between text-sm text-[#B8C6D8]">
                    <span>相机</span>
                    <span>{{(item as any).camera}}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm text-[#B8C6D8]">
                    <span>分辨率</span>
                    <span>{{(item as any).resolution}}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm text-[#B8C6D8]">
                    <span>拍摄地点</span>
                    <span>{{(item as any).location}}</span>
                  </div>
                </template>

                <template v-if="activeTab === 'presets'">
                  <div class="flex items-center justify-between text-sm text-[#B8C6D8]">
                    <span>使用次数</span>
                    <span>{{(item as any).usedCount}} 次</span>
                  </div>
                </template>
              </div>

              <!--  素材标签  -->
              <div class="flex flex-wrap gap-2 mb-4">
                <template v-for="(tag, index) in item.tags.slice(0, 4)" :key="index">
                  <span :key="index" class="px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-xs">
                    #{{ tag }}
                  </span>
                </template>
              </div>

              <!--  操作按钮  -->
              <div class="flex space-x-2">
                <button
                  class="flex-1 py-2 text-center bg-[#6B7C93] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]"
                >
                  <i class="fa-solid fa-eye mr-1"></i> 查看
                </button>
                <button
                  class="flex-1 py-2 text-center bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
                >
                  <i :class="`fa-solid ${activeTab === 'raw' ? 'fa-download' : 'fa-sliders'}`" mr-1="true"></i>
                  {{ activeTab === 'raw' ? '下载' : '应用' }}
                </button>
              </div>
            </div>
          </motion.div>
        </template>
      </div>

      <template v-if="filteredItems.length === 0">
        <div class="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center mt-8">
          <div class="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
            <i :class="`fa-solid ${activeTab === 'raw' ? 'fa-file-image' : 'fa-palette'} text-2xl`"></i>
          </div>
          <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">暂无{{ activeTab === 'raw' ? 'RAW素材' : '预设' }}</h3>
          <p class="text-[#B8C6D8] mb-6">
            点击"上传{{ activeTab === 'raw' ? 'RAW素材' : '预设' }}"开始管理您的摄影资源
          </p>
          <button
            class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
          >
            <i class="fa-solid fa-upload mr-2"></i>
            上传{{ activeTab === 'raw' ? 'RAW素材' : '预设' }}
          </button>
        </div>
      </template>

      <!--  分页  -->

      <template v-if="filteredItems.length > 0">
        <div class="flex justify-center mt-10">
          <nav class="flex items-center space-x-1 bg-[#2D3748] p-2 rounded-lg border border-[#4A5F8B]">
            <button
              class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
            >
              <i class="fa-solid fa-chevron-left text-xs"></i>
            </button>
            <button class="px-3 py-2 rounded border border-[#4A5F8B] bg-[#4A5F8B] text-[#F5F7FA]">
              1
            </button>
            <button
              class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
            >
              2
            </button>
            <button
              class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
            >
              <i class="fa-solid fa-chevron-right text-xs"></i>
            </button>
          </nav>
        </div>
      </template>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { Link } from 'react-router-dom';
  import { motion } from 'framer-motion';
  import { AuthContext } from '../contexts/authContext';
  const mockRawMaterials = [
    {
      id: 'raw1',
      name: '山间云海RAW',
      thumbnail:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=mountain%20cloud%20sea%20raw%20photo%20thumbnail&sign=c1c4a4eaefba83802e62c3088b580089',
      type: 'RAW',
      size: '45.8MB',
      date: '2023-10-25',
      camera: 'Sony A7R IV',
      resolution: '61MP',
      location: '黄山',
      tags: ['云海', '风光', 'RAW', '黄山'],
    },
    {
      id: 'raw2',
      name: '城市日出RAW',
      thumbnail:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=city%20sunrise%20raw%20photo%20thumbnail%20urban&sign=8b60521a0ffedcde44b5022efacdfdfd',
      type: 'RAW',
      size: '52.3MB',
      date: '2023-10-20',
      camera: 'Canon EOS R5',
      resolution: '45MP',
      location: '上海',
      tags: ['城市', '日出', 'RAW', '上海'],
    },
    {
      id: 'raw3',
      name: '海边日落RAW',
      thumbnail:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=seaside%20sunset%20raw%20photo%20thumbnail%20ocean&sign=359d2ed31facaf4efc6b6cf7760fcfc3',
      type: 'RAW',
      size: '48.7MB',
      date: '2023-10-15',
      camera: 'Nikon Z7 II',
      resolution: '45MP',
      location: '三亚',
      tags: ['海边', '日落', 'RAW', '三亚'],
    },
    {
      id: 'raw4',
      name: '森林晨雾RAW',
      thumbnail:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=forest%20morning%20mist%20raw%20photo%20thumbnail&sign=c4644ddd4f8dea9f37e1499f004d06b0',
      type: 'RAW',
      size: '50.2MB',
      date: '2023-10-10',
      camera: 'Sony A7R IV',
      resolution: '61MP',
      location: '西双版纳',
      tags: ['森林', '晨雾', 'RAW', '西双版纳'],
    },
  ];
  const mockPresets = [
    {
      id: 'preset1',
      name: '风光大片预设',
      thumbnail:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=landscape%20preset%20thumbnail%20professional%20photo%20editing&sign=3f4de3b76c0190ea138677cb648dbe7c',
      type: 'Lightroom预设',
      size: '1.2MB',
      date: '2023-10-22',
      usedCount: 35,
      tags: ['风光', '大片', 'Lightroom', '预设'],
    },
    {
      id: 'preset2',
      name: '城市黑白预设',
      thumbnail:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=urban%20black%20white%20preset%20thumbnail%20street%20photography&sign=d09895782f3c5bbd0df519a4cb9d5ad6',
      type: 'Lightroom预设',
      size: '0.8MB',
      date: '2023-10-18',
      usedCount: 28,
      tags: ['城市', '黑白', 'Lightroom', '预设'],
    },
    {
      id: 'preset3',
      name: '人像肤色优化',
      thumbnail:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=portrait%20skin%20tone%20preset%20thumbnail%20photography&sign=f430d0a98ca25341bd7b97f9c8a48a1b',
      type: 'Photoshop动作',
      size: '1.5MB',
      date: '2023-10-15',
      usedCount: 42,
      tags: ['人像', '肤色', 'Photoshop', '动作'],
    },
    {
      id: 'preset4',
      name: '星空降噪预设',
      thumbnail:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=star%20sky%20noise%20reduction%20preset%20thumbnail%20astrophotography&sign=8f8015b78c20ec4e7986c5e4e132dcb3',
      type: 'Lightroom预设',
      size: '0.9MB',
      date: '2023-10-12',
      usedCount: 19,
      tags: ['星空', '降噪', 'Lightroom', '预设'],
    },
  ];
  const { isAuthenticated, user } = useContext(AuthContext);
  const state = reactive({
    activeTab: 'raw',
    selectedTags: [],
    searchTerm: '',
    sortBy: 'date',
  });
  // date, name, size
  // 切换标签
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      state.selectedTags = selectedTags.filter((t) => t !== tag);
    } else {
      state.selectedTags = [...selectedTags, tag];
    }
  }; // 获取所有标签
  // 获取所有标签
  const getAllTags = () => {
    const tags: string[] = [];

    if (activeTab === 'raw') {
      mockRawMaterials.forEach((item) => {
        item.tags.forEach((tag) => {
          if (!tags.includes(tag)) {
            tags.push(tag);
          }
        });
      });
    } else {
      mockPresets.forEach((item) => {
        item.tags.forEach((tag) => {
          if (!tags.includes(tag)) {
            tags.push(tag);
          }
        });
      });
    }

    return tags;
  }; // 过滤和排序素材
  // 过滤和排序素材
  const getFilteredItems = () => {
    let items = activeTab === 'raw' ? [...mockRawMaterials] : [...mockPresets]; // 按标签过滤

    if (selectedTags.length > 0) {
      items = items.filter((item) => selectedTags.some((tag) => item.tags.includes(tag)));
    } // 按搜索词过滤

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.location?.toLowerCase().includes(term) ||
          item.camera?.toLowerCase().includes(term) ||
          item.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    } // 排序

    if (sortBy === 'date') {
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'name') {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'size') {
      items.sort((a, b) => {
        const sizeA = parseFloat(a.size);
        const sizeB = parseFloat(b.size);
        return sizeB - sizeA;
      });
    } else if (sortBy === 'used') {
      // 预设的使用次数排序
      if (activeTab === 'presets') {
        items.sort((a, b) => (b as any).usedCount - (a as any).usedCount);
      }
    }

    return items;
  };
  const filteredItems = getFilteredItems();
  const allTags = getAllTags();
</script>

<style lang="less" scoped src="./index.less"></style>
