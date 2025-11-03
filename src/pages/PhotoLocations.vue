<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div class="flex flex-col items-center justify-center h-[60vh] text-center">
      <div class="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
        <i class="fa-solid fa-user-lock text-2xl"></i>
      </div>
      <h2 class="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
      <p class="text-[#B8C6D8] mb-6 max-w-md">登录后查看您的拍摄地点分布和相关作品</p>
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
          to="/profile-center"
          class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
        >
          <i class="fa-solid fa-arrow-left"></i>
          <span>返回个人中心</span>
        </Link>
      </div>

      <!--  页面标题  -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">我的拍摄地点</h1>
        <p class="text-[#B8C6D8] max-w-2xl mx-auto">
          展示您发布作品的拍摄地点分布，探索新的创作灵感
        </p>
      </div>

      <!--  搜索和筛选  -->
      <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div class="relative flex-1">
            <input
              type="text"
              placeholder="搜索地点名称或地址..."
              :value="searchTerm"
              @change="(e) => (state.searchTerm = e.target.value)"
              class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
            />
            <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
          </div>

          <select
            :value="selectedCategory"
            @change="(e) => (state.selectedCategory = e.target.value)"
            class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
          >
            <template v-for="category in allCategories" :key="">
              <option :key="category" :value="category">{{ category }}</option>
            </template>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!--  左侧位置列表  -->
        <div class="lg:col-span-2 space-y-6">
          <!--  模拟地图区域  -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">拍摄地点地图</h3>
            <div class="h-[400px] relative bg-[#1E2532] rounded-lg overflow-hidden">
              <!--  模拟地图背景  -->
              <div class="absolute inset-0 opacity-30">
                <img
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=world%20map%20vintage%20paper%20texture%20blue&sign=a7e6038b84e3276bdf4bf7abc3a1ddb7"
                  alt="Map background"
                  class="w-full h-full object-cover"
                />
              </div>

              <!--  地图标记点  -->

              <template v-for="location in mockLocations" :key="">
                <motion.div
                  :key="location.id"
                  :initial="{
                    scale: 1,
                  }"
                  :animate="{
                    scale: selectedLocation === location.id ? [1, 1.2, 1] : 1,
                    transition:
                      selectedLocation === location.id
                        ? {
                            duration: 2,
                            repeat: Infinity,
                          }
                        : {},
                  }"
                  :whileHover="{
                    scale: 1.2,
                  }"
                  :class="`absolute w-4 h-4 rounded-full cursor-pointer shadow-lg ${
                    selectedLocation === location.id
                      ? 'bg-[#4A5F8B] border-2 border-[#F5F7FA]'
                      : 'bg-[#6B7C93] border-2 border-[#2D3748]'
                  }`"
                  :style="{
                    left: `${((location.longitude + 180) / 360) * 100}%`,
                    top: `${((90 - location.latitude) / 180) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }"
                  @click="() => (state.selectedLocation = location.id)"
                >
                  <div
                    class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#2D3748] text-[#F5F7FA] text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {{ location.name }} ({{ location.photos }}张作品)
                  </div>
                </motion.div>
              </template>
            </div>
            <div class="mt-4 text-center text-sm text-[#B8C6D8]">
              <p>提示：点击地图上的标记点查看该地点的作品</p>
            </div>
          </div>

          <!--  位置列表  -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">位置列表</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <template v-for="location in filteredLocations" :key="">
                <motion.div
                  :key="location.id"
                  :whileHover="{
                    y: -5,
                  }"
                  :class="`bg-[#1E2532] rounded-xl overflow-hidden border transition-all cursor-pointer ${
                    selectedLocation === location.id
                      ? 'border-[#4A5F8B] shadow-lg'
                      : 'border-[#4A5F8B] hover:border-[#4A5F8B]'
                  }`"
                  @click="() => (state.selectedLocation = location.id)"
                >
                  <div class="relative">
                    <img :src="location.image" :alt="location.name" class="w-full h-36 object-cover" />
                    <div class="absolute top-2 right-2 bg-[#1E2532]/80 text-[#F5F7FA] text-xs px-2 py-1 rounded-full">
                      {{ location.photos }} 张作品
                    </div>
                  </div>
                  <div class="p-4">
                    <h4 class="font-bold text-[#F5F7FA] mb-1">{{ location.name }}</h4>
                    <p class="text-sm text-[#B8C6D8] mb-3 line-clamp-1">{{ location.address }}</p>
                    <div class="flex flex-wrap gap-1">
                      <template v-for="(category, index) in location.categories" :key="index">
                        <span :key="index" class="px-2 py-0.5 bg-[#2D3748] text-[#B8C6D8] text-xs rounded">
                          {{ category }}
                        </span>
                      </template>
                    </div>
                  </div>
                </motion.div>
              </template>
            </div>

            <template v-if="filteredLocations.length === 0">
              <div class="p-8 text-center">
                <div
                  class="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4"
                >
                  <i class="fa-solid fa-map-marker-alt text-2xl"></i>
                </div>
                <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">未找到相关地点</h3>
                <p class="text-[#B8C6D8]">
                  尝试使用其他关键词或分类进行搜索
                </p>
              </div>
            </template>
          </div>
        </div>

        <!--  右侧位置详情和作品  -->
        <div class="space-y-6">
          <template v-if="selectedLocation">
            <!--  位置详情  -->
            <div
              class="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 shadow-sm border border-[#4A5F8B]"
            ></div>

            <!--  位置相关作品  -->
            <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">该地点的作品</h3>
              <div class="space-y-4">
                <template v-for="photo in locationPhotos" :key="">
                  <motion.div
                    :key="photo.id"
                    :whileHover="{
                      scale: 1.02,
                    }"
                    class="flex space-x-3 p-3 bg-[#1E2532] rounded-lg border border-[#4A5F8B] hover:border-[#4A5F8B] transition-colors"
                  >
                    <div class="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                      <img :src="photo.image" :alt="photo.title" class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1">
                      <h4 class="font-medium text-[#F5F7FA] mb-1">{{ photo.title }}</h4>
                      <p class="text-xs text-[#B8C6D8]">{{ photo.date }}</p>
                    </div>
                  </motion.div>
                </template>

                <template v-if="locationPhotos.length === 0">
                  <div class="p-4 text-center">
                    <p class="text-[#B8C6D8]">该地点暂无作品</p>
                  </div>
                </template>
              </div>

              <template v-if="locationPhotos.length > 0">
                <div class="mt-4 text-center">
                  <Link
                    to="#"
                    class="inline-flex items-center text-sm text-[#4A5F8B] hover:text-[#6B7C93] transition-colors"
                  >
                    查看更多作品 <i class="fa-solid fa-chevron-right ml-1 text-xs"></i>
                  </Link>
                </div>
              </template>
            </div>
          </template>
          <template v-else>
            <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 class="text-lg font-bold text-[#F5F7FA] mb-2">位置详情</h3>
              <p class="text-[#B8C6D8]">
                从地图或位置列表中选择一个地点，查看详细信息和相关作品
              </p>
              <div class="mt-6 flex flex-col space-y-3">
                <div class="p-3 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
                  <h4 class="font-medium text-[#F5F7FA] mb-1 flex items-center">
                    <i class="fa-solid fa-info-circle text-[#4A5F8B] mr-2"></i>
                    如何添加新地点？
                  </h4>
                  <p class="text-sm text-[#B8C6D8]">
                    上传作品时填写拍摄地点信息，系统会自动将其添加到您的地点列表中
                  </p>
                </div>
                <div class="p-3 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
                  <h4 class="font-medium text-[#F5F7FA] mb-1 flex items-center">
                    <i class="fa-solid fa-lightbulb text-[#4A5F8B] mr-2"></i>
                    创作提示
                  </h4>
                  <p class="text-sm text-[#B8C6D8]">
                    探索新的拍摄地点可以激发创作灵感，尝试在不同时间和天气条件下拍摄同一地点
                  </p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { Link } from 'react-router-dom';
  import { motion } from 'framer-motion';
  import { AuthContext } from '../contexts/authContext';
  const { isAuthenticated, user } = useContext(AuthContext);
  const state = reactive({
    selectedLocation: null,
    searchTerm: '',
    selectedCategory: '全部',
  });
  // 模拟位置数据
  const mockLocations: Location[] = [
    {
      id: '1',
      name: '上海外滩',
      address: '上海市黄浦区中山东一路',
      latitude: 31.2304,
      longitude: 121.4737,
      photos: 256,
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=shanghai%20bund%20skyline%20night%20photography%20location&sign=c5826fa443a4a31ae340466ff9a0c083',
      categories: ['城市', '建筑', '夜景'],
    },
    {
      id: '2',
      name: '北京故宫',
      address: '北京市东城区景山前街4号',
      latitude: 39.9042,
      longitude: 116.4074,
      photos: 189,
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=beijing%20forbidden%20city%20ancient%20architecture%20photography%20location&sign=48da96b2f5b3c60847d97d2acf789507',
      categories: ['历史', '建筑', '人文'],
    },
    {
      id: '3',
      name: '杭州西湖',
      address: '浙江省杭州市西湖区龙井路1号',
      latitude: 30.2741,
      longitude: 120.1551,
      photos: 324,
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=hangzhou%20west%20lake%20scenery%20landscape%20photography%20location&sign=962e534ce7b680e8e2a9e894a4967250',
      categories: ['自然', '风景', '湖泊'],
    },
    {
      id: '4',
      name: '成都锦里',
      address: '四川省成都市武侯区武侯祠大街231号',
      latitude: 30.6575,
      longitude: 104.0663,
      photos: 156,
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=chengdu%20jinli%20ancient%20street%20photography%20location%20china&sign=feb68402462ca5f58dbda88525c932ba',
      categories: ['古镇', '人文', '街拍'],
    },
    {
      id: '5',
      name: '张家界国家森林公园',
      address: '湖南省张家界市武陵源区',
      latitude: 29.1175,
      longitude: 110.4878,
      photos: 218,
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=zhangjiajie%20national%20forest%20park%20mountains%20photography%20location%20china&sign=f696cf51c01cfd7dbe99084a34020ec0',
      categories: ['自然', '风景', '山脉'],
    },
    {
      id: '6',
      name: '广州塔',
      address: '广东省广州市海珠区阅江西路222号',
      latitude: 23.1291,
      longitude: 113.2644,
      photos: 178,
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=guangzhou%20tower%20modern%20architecture%20photography%20location%20china&sign=de1bb556dbf0b35adcc7f22f45323226',
      categories: ['城市', '建筑', '现代'],
    },
  ]; // 模拟位置相关的作品数据
  // 模拟位置相关的作品数据
  const getPhotosByLocation = (locationId: string): PhotographyPost[] => {
    const location = mockLocations.find((loc) => loc.id === locationId);
    if (!location) return []; // 为每个位置生成模拟的作品数据

    return Array.from(
      {
        length: Math.min(4, location.photos),
      },
      (_, i) => ({
        id: `${locationId}-photo-${i + 1}`,
        title: `${location.name}作品 ${i + 1}`,
        image: `https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=${
          location.name
        }%20photography%20${i + 1}&sign=${locationId}${i}`,
        location: location.name,
        date: `2023-10-${10 + i}`,
      })
    );
  }; // 过滤位置数据
  // 过滤位置数据
  const getFilteredLocations = () => {
    let locations = [...mockLocations]; // 按搜索词过滤

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      locations = locations.filter(
        (location) => location.name.toLowerCase().includes(term) || location.address.toLowerCase().includes(term)
      );
    } // 按分类过滤

    if (selectedCategory !== '全部') {
      locations = locations.filter((location) => location.categories.includes(selectedCategory));
    }

    return locations;
  }; // 获取所有分类
  // 获取所有分类
  const getAllCategories = () => {
    const categories = ['全部'];
    mockLocations.forEach((location) => {
      location.categories.forEach((category) => {
        if (!categories.includes(category)) {
          categories.push(category);
        }
      });
    });
    return categories;
  };
  const filteredLocations = getFilteredLocations();
  const allCategories = getAllCategories();
  const locationPhotos = selectedLocation ? getPhotosByLocation(selectedLocation) : [];
</script>

<style lang="less" scoped src="./index.less"></style>
