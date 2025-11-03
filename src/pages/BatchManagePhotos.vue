<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div class="flex flex-col items-center justify-center h-[60vh] text-center">
      <div class="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
        <i class="fa-solid fa-user-lock text-2xl"></i>
      </div>
      <h2 class="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
      <p class="text-[#B8C6D8] mb-6 max-w-md">登录后管理您的作品，支持批量操作</p>
      <Link
        to="/login"
        class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
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
          to="/profile-center/works"
          class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
        >
          <i class="fa-solid fa-arrow-left"></i>
          <span>返回我的作品集</span>
        </Link>
      </div>

      <!--  页面标题  -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">批量管理作品</h1>
        <p class="text-[#B8C6D8] max-w-2xl mx-auto">
          批量删除、修改可见性、添加标签等操作，提高作品管理效率
        </p>
      </div>

      <!--  批量操作栏 - 浅蓝灰 #4A5F8B + 浅白 #F5F7FA  -->
      <div class="bg-[#2D3748] rounded-xl p-4 shadow-sm border border-[#4A5F8B] mb-8">
        <div class="flex flex-col md:flex-row gap-4 items-center md:items-end">
          <div class="flex items-center">
            <input
              type="checkbox"
              id="select-all"
              :checked="selectedPhotos.length > 0 && selectedPhotos.length === filteredPosts.length"
              @change="toggleSelectAll"
              class="w-4 h-4 bg-[#2D3748] border-[#4A5F8B] text-[#4A5F8B] rounded focus:ring-[#4A5F8B]"
            />
            <label htmlFor="select-all" class="ml-2 text-[#B8C6D8]">
              全选 ({{ selectedPhotos.length }}/{{ filteredPosts.length }})
            </label>
          </div>

          <div class="flex flex-wrap gap-2 flex-1 md:flex-initial">
            <button
              @click="handleBatchDelete"
              :disabled="selectedPhotos.length === 0"
              :class="`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPhotos.length > 0
                  ? 'bg-[#6B7C93] text-[#F5F7FA] hover:bg-[#F56565]'
                  : 'bg-[#6B7C93]/50 text-[#B8C6D8] cursor-not-allowed'
              }`"
            >
              <i class="fa-solid fa-trash mr-2"></i>
              批量删除
            </button>

            <div class="relative">
              <button
                :disabled="selectedPhotos.length === 0"
                :class="`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPhotos.length > 0
                    ? 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]'
                    : 'bg-[#6B7C93]/50 text-[#B8C6D8] cursor-not-allowed'
                }`"
              >
                <i class="fa-solid fa-eye mr-2"></i>
                批量修改可见性
              </button>
              <div class="absolute right-0 mt-1 w-48 bg-[#2D3748] rounded-lg shadow-lg border border-[#4A5F8B] z-10">
                <button
                  @click="() => handleBatchVisibility('公开')"
                  class="block w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                >
                  设为公开
                </button>
                <button
                  @click="() => handleBatchVisibility('仅好友可见')"
                  class="block w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                >
                  设为仅好友可见
                </button>
                <button
                  @click="() => handleBatchVisibility('私密')"
                  class="block w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                >
                  设为私密
                </button>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <input
                type="text"
                placeholder="输入标签..."
                :value="tagToAdd"
                @change="(e) => (state.tagToAdd = e.target.value)"
                class="px-3 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8] text-sm"
              />
              <button
                @click="handleBatchAddTag"
                :disabled="selectedPhotos.length === 0 || !tagToAdd.trim()"
                :class="`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPhotos.length > 0 && tagToAdd.trim()
                    ? 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]'
                    : 'bg-[#6B7C93]/50 text-[#B8C6D8] cursor-not-allowed'
                }`"
              >
                <i class="fa-solid fa-tags mr-2"></i>
                添加标签
              </button>
            </div>
          </div>
        </div>
      </div>

      <!--  搜索和筛选  -->
      <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div class="relative flex-1">
            <input
              type="text"
              placeholder="搜索作品标题或描述..."
              :value="searchTerm"
              @change="(e) => (state.searchTerm = e.target.value)"
              class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
            />
            <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
          </div>

          <div class="flex space-x-4">
            <select
              :value="visibilityFilter"
              @change="(e) => (state.visibilityFilter = e.target.value)"
              class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option value="all">全部可见性</option>
              <option value="public">公开</option>
              <option value="friends">仅好友可见</option>
              <option value="private">私密</option>
            </select>

            <select
              :value="formatFilter"
              @change="(e) => (state.formatFilter = e.target.value)"
              class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option value="all">全部格式</option>
              <option value="raw">RAW</option>
              <option value="jpg">JPG</option>
            </select>

            <select
              :value="sortBy"
              @change="(e) => (state.sortBy = e.target.value)"
              class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option value="latest">最新发布</option>
              <option value="popular">最受欢迎</option>
              <option value="views">最多浏览</option>
            </select>
          </div>
        </div>

        <!--  标签筛选  -->
        <div class="mt-4">
          <h4 class="text-sm font-medium text-[#B8C6D8] mb-2">按标签筛选</h4>
          <div class="flex flex-wrap gap-2">
            <template v-for="tag in allTags" :key="">
              <button
                :key="tag"
                @click="() => (state.selectedTag = tag)"
                :class="`px-3 py-1 rounded-full text-sm ${
                  selectedTag === tag
                    ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                    : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]'
                } transition-colors`"
              >
                {{ tag }}
              </button>
            </template>
          </div>
        </div>
      </div>

      <!--  作品列表  -->
      <div class="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="bg-[#2D3748] border-b border-[#4A5F8B]">
                <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] w-12">选择</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] w-40">预览</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8]">标题</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8]">日期</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8]">格式</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8]">可见性</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8]">标签</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8]">互动</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] w-24">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#4A5F8B]">
              <template v-for="post in filteredPosts" :key="">
                <tr :key="post.id" class="hover:bg-[#1E2532] transition-colors">
                  <td class="px-6 py-4">
                    <input
                      type="checkbox"
                      :checked="selectedPhotos.includes(post.id)"
                      @change="() => togglePhotoSelection(post.id)"
                      class="w-4 h-4 bg-[#2D3748] border-[#4A5F8B] text-[#4A5F8B] rounded focus:ring-[#4A5F8B]"
                    />
                  </td>
                  <td class="px-6 py-4">
                    <div class="w-20 h-20 rounded overflow-hidden">
                      <img :src="post.image" :alt="post.title" class="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="font-medium text-[#F5F7FA]">{{ post.title }}</div>
                    <div class="text-xs text-[#B8C6D8] truncate max-w-xs mt-1">{{ post.description }}</div>
                  </td>
                  <td class="px-6 py-4 text-sm text-[#B8C6D8]">{{ post.date }}</td>
                  <td class="px-6 py-4">
                    <span
                      :class="`px-2 py-1 rounded-full text-xs ${
                        post.format === 'RAW' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'bg-[#6B7C93] text-[#F5F7FA]'
                      }`"
                    >
                      {{ post.format }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      :class="`px-2 py-1 rounded-full text-xs ${
                        post.visibility === '公开'
                          ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                          : post.visibility === '仅好友可见'
                          ? 'bg-[#6B7C93] text-[#F5F7FA]'
                          : 'bg-[#B8C6D8] text-[#2D3748]'
                      }`"
                    >
                      {{ post.visibility }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex flex-wrap gap-1">
                      <template v-for="(tag, index) in post.tags" :key="index">
                        <span
                          :key="index"
                          class="px-2 py-0.5 bg-[#2D3748] text-[#B8C6D8] text-xs rounded-full border border-[#4A5F8B]"
                        >
                          {{ tag }}
                        </span>
                      </template>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-[#B8C6D8]">
                    <div class="flex items-center space-x-4">
                      <span class="flex items-center">
                        <i class="fa-solid fa-heart mr-1 text-[#4A5F8B]"></i>
                        {{ post.likes }}
                      </span>
                      <span class="flex items-center">
                        <i class="fa-solid fa-comment mr-1 text-[#4A5F8B]"></i>
                        {{ post.comments }}
                      </span>
                      <span class="flex items-center">
                        <i class="fa-solid fa-eye mr-1 text-[#4A5F8B]"></i>
                        {{ post.views }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex space-x-2">
                      <Link
                        :to="`/photo/${post.id}`"
                        class="p-1.5 text-[#B8C6D8] hover:text-[#4A5F8B] transition-colors"
                        title="查看详情"
                      >
                        <i class="fa-solid fa-eye"></i>
                      </Link>
                      <button class="p-1.5 text-[#B8C6D8] hover:text-[#4A5F8B] transition-colors" title="编辑">
                        <i class="fa-solid fa-edit"></i>
                      </button>
                      <button class="p-1.5 text-[#B8C6D8] hover:text-[#F56565] transition-colors" title="删除">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <template v-if="filteredPosts.length === 0">
          <div class="p-12 text-center">
            <div
              class="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4"
            >
              <i class="fa-solid fa-image text-2xl"></i>
            </div>
            <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">暂无作品</h3>
            <p class="text-[#B8C6D8] max-w-md mx-auto">
              您当前没有符合筛选条件的作品
            </p>
          </div>
        </template>

        <!--  分页  -->

        <template v-if="filteredPosts.length > 0">
          <div class="flex justify-center mt-8 pb-6">
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
                <i class="fa-solid fa-chevron-right text-xs"></i>
              </button>
            </nav>
          </div>
        </template>
      </div>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { Link } from 'react-router-dom';
  import { motion } from 'framer-motion';
  import { AuthContext } from '../contexts/authContext';
  import { toast } from 'sonner';
  const { isAuthenticated, user } = useContext(AuthContext);
  const state = reactive({
    selectedPhotos: [],
    sortBy: 'latest',
    selectedTag: '全部',
    searchTerm: '',
    visibilityFilter: 'all',
    formatFilter: 'all',
    tagToAdd: '',
  });
  // 模拟用户作品数据
  const mockUserPosts: PhotographyPost[] = [
    {
      id: '1',
      title: '晨曦中的山峦',
      description: '捕捉清晨第一缕阳光洒在山峦上的壮丽景色，使用长曝光展现云海的流动感。',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=morning%20sunrise%20mountain%20landscape%20mist%20china&sign=a50c8d6084b10f76978cc2afb1ca29a9',
      author: {
        id: 'user-123',
        name: '@光影捕手',
        avatar:
          'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc',
      },
      likes: 324,
      comments: 45,
      tags: ['风光', '日出', '云海', '自然'],
      date: '2023-10-25',
      views: 1256,
      format: 'RAW',
      visibility: '公开',
      copyrightType: '独家授权',
    },
    {
      id: '2',
      title: '城市剪影',
      description: '从高处俯瞰城市天际线，记录夕阳下城市建筑的剪影效果。',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=city%20skyline%20silhouette%20sunset%20urban%20architecture%20modern&sign=8de72287cf83cda70c057b89bfc1d186',
      author: {
        id: 'user-123',
        name: '@光影捕手',
        avatar:
          'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc',
      },
      likes: 289,
      comments: 37,
      tags: ['城市', '建筑', '剪影', '夕阳'],
      date: '2023-10-22',
      views: 987,
      format: 'JPG',
      visibility: '公开',
      copyrightType: '非独家',
    },
    {
      id: '3',
      title: '海浪与礁石',
      description: '长时间曝光拍摄海浪拍打礁石的场景，展现水的丝绸质感。',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=ocean%20waves%20crashing%20on%20rocks%20long%20exposure%20seascape&sign=e3c4cd3840caaaedc19f43f96183a958',
      author: {
        id: 'user-123',
        name: '@光影捕手',
        avatar:
          'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc',
      },
      likes: 412,
      comments: 53,
      tags: ['海景', '慢门', '自然', '礁石'],
      date: '2023-10-18',
      views: 1452,
      format: 'RAW',
      visibility: '仅好友可见',
      copyrightType: '独家授权',
    },
    {
      id: '4',
      title: '森林晨雾',
      description: '在山间森林中捕捉晨雾弥漫的神秘氛围，阳光透过树叶形成丁达尔效应。',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=forest%20morning%20mist%20sunlight%20rays%20trees%20mystical&sign=0d866462637658cb7796789831e1cc68',
      author: {
        id: 'user-123',
        name: '@光影捕手',
        avatar:
          'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc',
      },
      likes: 387,
      comments: 49,
      tags: ['森林', '晨雾', '丁达尔效应', '自然'],
      date: '2023-10-15',
      views: 1328,
      format: 'JPG',
      visibility: '公开',
      copyrightType: '非独家',
    },
    {
      id: '5',
      title: '湖畔日落',
      description: '平静的湖面倒映着绚丽的晚霞，形成对称的美感。',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=lake%20sunset%20reflection%20mountains%20evening%20colorful%20sky&sign=c039f18a4bf0746344422a50690ffb6c',
      author: {
        id: 'user-123',
        name: '@光影捕手',
        avatar:
          'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc',
      },
      likes: 456,
      comments: 61,
      tags: ['湖泊', '日落', '倒影', '晚霞'],
      date: '2023-10-12',
      views: 1689,
      format: 'RAW',
      visibility: '公开',
      copyrightType: '独家授权',
    },
    {
      id: '6',
      title: '星空下的古堡',
      description: '在远离城市光污染的地方，拍摄星空下的古堡遗迹，展现历史与自然的交融。',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=castle%20ruins%20under%20starry%20sky%20milky%20way%20night%20long%20exposure&sign=4f691b61d53a7e9b6b0869b95858dbb2',
      author: {
        id: 'user-123',
        name: '@光影捕手',
        avatar:
          'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc',
      },
      likes: 523,
      comments: 78,
      tags: ['星空', '夜景', '古堡', '银河'],
      date: '2023-10-08',
      views: 1976,
      format: 'RAW',
      visibility: '私密',
      copyrightType: '独家授权',
    },
  ]; // 过滤和排序作品
  // 过滤和排序作品
  const getFilteredPosts = () => {
    let posts = [...mockUserPosts]; // 按标签过滤

    if (selectedTag !== '全部') {
      posts = posts.filter((post) => post.tags.includes(selectedTag));
    } // 按搜索词过滤

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.description.toLowerCase().includes(term) ||
          post.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    } // 按可见性过滤

    if (visibilityFilter !== 'all') {
      posts = posts.filter((post) => {
        if (visibilityFilter === 'public') return post.visibility === '公开';
        if (visibilityFilter === 'friends') return post.visibility === '仅好友可见';
        if (visibilityFilter === 'private') return post.visibility === '私密';
        return true;
      });
    } // 按格式过滤

    if (formatFilter !== 'all') {
      posts = posts.filter((post) => {
        if (formatFilter === 'raw') return post.format === 'RAW';
        if (formatFilter === 'jpg') return post.format === 'JPG';
        return true;
      });
    } // 排序

    if (sortBy === 'latest') {
      posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'popular') {
      posts.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'views') {
      posts.sort((a, b) => b.views - a.views);
    }

    return posts;
  }; // 获取所有标签
  // 获取所有标签
  const getAllTags = () => {
    const tags = ['全部'];
    mockUserPosts.forEach((post) => {
      post.tags.forEach((tag) => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    });
    return tags;
  };
  const filteredPosts = getFilteredPosts();
  const allTags = getAllTags(); // 切换选中状态
  // 切换选中状态
  const togglePhotoSelection = (id: string) => {
    if (selectedPhotos.includes(id)) {
      state.selectedPhotos = selectedPhotos.filter((photoId) => photoId !== id);
    } else {
      state.selectedPhotos = [...selectedPhotos, id];
    }
  }; // 全选/取消全选
  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedPhotos.length === filteredPosts.length) {
      state.selectedPhotos = [];
    } else {
      state.selectedPhotos = filteredPosts.map((post) => post.id);
    }
  }; // 批量删除
  // 批量删除
  const handleBatchDelete = () => {
    if (selectedPhotos.length === 0) {
      toast.warning('请先选择要删除的作品');
      return;
    }

    if (window.confirm(`确定要删除选中的 ${selectedPhotos.length} 个作品吗？此操作不可恢复。`)) {
      // 模拟删除操作
      toast.success(`成功删除 ${selectedPhotos.length} 个作品`);
      state.selectedPhotos = [];
    }
  }; // 批量设置可见性
  // 批量设置可见性
  const handleBatchVisibility = (visibility: '公开' | '仅好友可见' | '私密') => {
    if (selectedPhotos.length === 0) {
      toast.warning('请先选择要修改的作品');
      return;
    } // 模拟更新操作

    toast.success(`成功将 ${selectedPhotos.length} 个作品设置为 ${visibility}`);
  }; // 批量添加标签
  // 批量添加标签
  const handleBatchAddTag = () => {
    if (selectedPhotos.length === 0) {
      toast.warning('请先选择要添加标签的作品');
      return;
    }

    if (!tagToAdd.trim()) {
      toast.warning('请输入标签内容');
      return;
    } // 模拟添加标签操作

    toast.success(`成功为 ${selectedPhotos.length} 个作品添加标签：${tagToAdd}`);
    state.tagToAdd = '';
  };
</script>

<style lang="less" scoped src="./index.less"></style>
