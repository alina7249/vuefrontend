<template>
  <header class="sticky top-0 z-50 w-full bg-[#2D3748] border-b border-[#4A5F8B] shadow-md">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- 品牌标志 -->
        <div class="flex items-center">
          <RouterLink to="/" class="flex items-center">
            <motion.div
              :hover="{ rotate: 10 }"
              class="mr-2 text-2xl text-[#63B3ED]"
            >
              <i class="fa-solid fa-camera"></i>
            </motion.div>
            <span class="text-xl font-bold text-[#F5F7FA]">
              影研社
            </span>
          </RouterLink>
        </div>

        <!-- 桌面导航 -->
        <nav class="hidden md:flex items-center space-x-8">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            :class="[
              'font-medium transition-colors relative',
              route.path === link.path
                ? 'text-[#F5F7FA] after:content-[\'\'] after:block after:w-full after:h-[2px] after:bg-[#4A5F8B] after:absolute after:bottom-[-6px] after:left-0'
                : 'text-[#B8C6D8] hover:text-[#F5F7FA]'
            ]"
          >
            {{ link.name }}
          </RouterLink>
          
          <!-- 用户菜单 -->
          <div v-if="isAuthenticated" class="relative">
            <button 
              class="flex items-center space-x-2"
              @click="toggleProfileDropdown"
              aria-label="打开个人信息下拉菜单"
            >
              <motion.img
                :whileHover="{ scale: 1.1 }"
                :src="userAvatar"
                :alt="username"
                class="w-10 h-10 rounded-full object-cover border-2 border-[#4A5568] cursor-pointer transition-transform"
              />
              <span class="font-medium text-[#FFFFFF] hidden lg:inline">
                {{ username }}
              </span>
            </button>
          </div>
          <div v-else class="flex items-center space-x-3">
            <RouterLink
              to="/login"
              class="px-4 py-2 rounded-lg text-sm font-medium text-[#E2E8F0] border border-[#4A5568] hover:bg-[#4A5568] transition-colors"
            >
              登录
            </RouterLink>
            <RouterLink
              to="/register"
              class="px-4 py-2 rounded-lg text-sm font-medium text-[#0F1C2D] bg-[#63B3ED] hover:bg-[#4299E1] transition-colors shadow-[0_2px_8px_rgba(99,179,237,0.3)]"
            >
              注册
            </RouterLink>
          </div>
        </nav>

        <!-- 移动端菜单按钮 -->
        <div class="md:hidden flex items-center space-x-3">
          <motion.button
            v-if="isAuthenticated"
            :hover="{ scale: 1.1 }"
            :tap="{ scale: 0.9 }"
            @click="toggleProfileDropdown"
            class="p-2 rounded-full hover:bg-[#4A5568] transition-colors"
            aria-label="打开个人侧边栏"
          >
            <img
              :src="userAvatar"
              :alt="username"
              class="w-8 h-8 rounded-full object-cover cursor-pointer"
            />
          </motion.button>
          <motion.button
            :hover="{ scale: 1.1 }"
            :tap="{ scale: 0.9 }"
            @click="toggleMobileMenu"
            class="p-2 rounded-full hover:bg-[#4A5568] transition-colors text-[#E2E8F0]"
            aria-label="Open menu"
          >
            <i :class="`fa-solid ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-[#F5F7FA]`"></i>
          </motion.button>
        </div>
      </div>

      <!-- 移动端导航菜单 -->
      <motion.div
        v-if="isMobileMenuOpen"
        :initial="{ opacity: 0, height: 0 }"
        :animate="{ opacity: 1, height: 'auto' }"
        :exit="{ opacity: 0, height: 0 }"
        class="md:hidden py-4 space-y-4 border-t border-[#4A5568] bg-[#1E2A3A]"
      >
        <RouterLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          :class="[
            'block px-4 py-2 font-medium transition-colors',
            route.path === link.path
              ? 'text-[#63B3ED] bg-[#4A5568] rounded-lg border-l-2 border-[#63B3ED]'
              : 'text-[#E2E8F0]/70 hover:text-[#FFFFFF]'
          ]"
          @click="closeMobileMenu"
        >
          {{ link.name }}
        </RouterLink>
        
        <div v-if="isAuthenticated" class="px-4 space-y-2">
          <div class="grid grid-cols-3 gap-3">
            <RouterLink
              :to="`/profile/${user?.id || ''}`"
              class="flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium bg-[#4A5568] text-[#E2E8F0] hover:bg-[#4A5F8B] transition-colors"
              @click="closeMobileMenu"
            >
              <i class="fa-solid fa-image mb-1"></i>
              作品
            </RouterLink>
            <RouterLink
              to="#"
              class="flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium bg-[#4A5568] text-[#E2E8F0] hover:bg-[#4A5F8B] transition-colors"
              @click="closeMobileMenu"
            >
              <i class="fa-solid fa-heart mb-1"></i>
              收藏
            </RouterLink>
            <RouterLink
              to="#"
              class="flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium bg-[#4A5568] text-[#E2E8F0] hover:bg-[#4A5F8B] transition-colors"
              @click="closeMobileMenu"
            >
              <i class="fa-solid fa-cog mb-1"></i>
              设置
            </RouterLink>
          </div>
          
          <button
            @click="handleLogoutAndClose"
            class="w-full flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium bg-[#4A5568] text-[#E2E8F0] hover:bg-[#718096] transition-colors"
          >
            <i class="fa-solid fa-sign-out-alt mr-2"></i> 退出登录
          </button>
        </div>
        <div v-else class="px-4 space-y-3">
          <RouterLink
            to="/login"
            class="block w-full text-center px-4 py-3 rounded-lg text-sm font-medium bg-[#4A5568] text-[#E2E8F0] hover:bg-[#4A5F8B] transition-colors"
            @click="closeMobileMenu"
          >
            登录
          </RouterLink>
          <RouterLink
            to="/register"
            class="block w-full text-center px-4 py-3 rounded-lg text-sm font-medium text-[#0F1C2D] bg-[#63B3ED] hover:bg-[#4299E1] transition-colors"
            @click="closeMobileMenu"
          >
            注册
          </RouterLink>
        </div>
      </motion.div>
    </div>

    <!-- 个人下拉菜单 -->
    <ProfileDropdown
      :isOpen="isProfileDropdownOpen"
      :onClose="() => isProfileDropdownOpen = false"
      :username="username"
      :level="mockUserData.level"
      :levelNum="mockUserData.levelNum"
      :progress="mockUserData.progress"
      :progressMax="mockUserData.progressMax"
      :stats="mockUserData.stats"
      :avatarSrc="userAvatar"
    />
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { motion } from 'motion-v';
import { RouterLink } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

import ProfileDropdown from './ProfileDropdown.vue';

interface NavLink {
  name: string;
  path: string;
}

interface UserStats {
  posts: number;
  likes: number;
  collections: number;
}

interface MockUserData {
  username: string;
  level: string;
  levelNum: number;
  progress: number;
  progressMax: number;
  stats: UserStats;
}

const auth = useAuth();
const { isAuthenticated, user, logout } = auth;
const route = useRoute();


const isMobileMenuOpen = ref(false);

const isProfileDropdownOpen = ref(false);

// 模拟用户数据
const mockUserData: MockUserData = {
  username: '@光影捕手',
  level: '新锐摄影师',
  levelNum: 3,
  progress: 120,
  progressMax: 200,
  stats: {
    posts: 12,
    likes: 236,
    collections: 48
  }
};

// 导航链接
const navLinks: NavLink[] = [
  { name: '作品库', path: '/' },
  { name: '器材区', path: '/equipment-database' },
  { name: '课程', path: '/online-courses' },
  { name: '社区', path: '/community' },
  { name: '资源', path: '/resources' },
  { name: '活动与赛事', path: '/offline-events' },
];

// 确保用户头像有默认图片
const userAvatar = computed(() => 
  user.value?.avatar || 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional&sign=b0609ecfca466fa5510f7df4adb33529'
);

const username = computed(() => user.value?.username || mockUserData.username);

// 处理登出
const handleLogout = () => {
  logout();
};

// 切换移动菜单
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// 关闭移动菜单
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};



// 打开下拉菜单
const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value;
};

// 处理登出并关闭菜单
const handleLogoutAndClose = () => {
  handleLogout();
  closeMobileMenu();
};
</script>

<style scoped>
/* 样式由 Tailwind 类控制，保留空白以便扩展 */
</style>