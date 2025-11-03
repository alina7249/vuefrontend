<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div v-if="!isAuthenticated" class="flex flex-col items-center justify-center h-[60vh] text-center">
      <div class="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
        <i class="fa-solid fa-user-lock text-2xl"></i>
      </div>
      <h2 class="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
      <p class="text-[#B8C6D8] mb-6 max-w-md">登录后查看您的会员等级和专属权益</p>
      <router-link
        to="/login"
        class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors"
      >
        立即登录
      </router-link>
    </div>

    <div v-else>
      <div class="mb-6">
        <router-link
          to="/profile-center"
          class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
        >
          <i class="fa-solid fa-arrow-left"></i>
          <span>返回个人中心</span>
        </router-link>
      </div>

      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">会员中心</h1>
        <p class="text-[#B8C6D8] max-w-2xl mx-auto">查看您的会员等级、专属权益和成长进度</p>
      </div>

      <div class="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 shadow-lg mb-8 text-white">
        <div class="flex flex-col md:flex-row md:items-center justify-between">
          <div class="mb-6 md:mb-0">
            <div class="flex items-center mb-3">
              <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <i class="fa-solid fa-crown text-3xl text-[#F5F7FA]"></i>
              </div>
              <div>
                <h2 class="text-2xl font-bold">{{ mockMembershipData.currentPlan.name }}</h2>
                <p class="text-[#F5F7FA]">有效期至：{{ mockMembershipData.currentPlan.endDate }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <span class="text-lg font-bold mr-2">{{ mockMembershipData.currentPlan.daysLeft }}</span>
                <span class="text-[#F5F7FA]">天剩余</span>
              </div>
              <div class="flex items-center">
                <span class="text-lg font-bold mr-2">LV.{{ mockMembershipData.currentPlan.level }}</span>
                <span class="text-[#F5F7FA]">会员等级</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col space-y-3 md:items-end">
            <button
              class="px-6 py-3 bg-[#F5F7FA] text-[#4A5F8B] rounded-lg font-medium hover:bg-white transition-colors shadow-md"
            >
              立即续费
            </button>
            <button
              class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors"
            >
              升级会员
            </button>
          </div>
        </div>
      </div>

      <div class="bg-[#2D3748] rounded-xl p-1 mb-8 flex flex-wrap">
        <button
          @click="activeTab = 'overview'"
          class="flex-1 py-3 px-4 text-center rounded-lg transition-colors"
          :class="activeTab === 'overview' ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium' : 'text-[#B8C6D8] hover:text-[#F5F7FA]'"
        >
          总览
        </button>
        <button
          @click="activeTab = 'benefits'"
          class="flex-1 py-3 px-4 text-center rounded-lg transition-colors"
          :class="activeTab === 'benefits' ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium' : 'text-[#B8C6D8] hover:text-[#F5F7FA]'"
        >
          会员权益
        </button>
        <button
          @click="activeTab = 'upgrade'"
          class="flex-1 py-3 px-4 text-center rounded-lg transition-colors"
          :class="activeTab === 'upgrade' ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium' : 'text-[#B8C6D8] hover:text-[#F5F7FA]'"
        >
          等级提升
        </button>
        <button
          @click="activeTab = 'billing'"
          class="flex-1 py-3 px-4 text-center rounded-lg transition-colors"
          :class="activeTab === 'billing' ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium' : 'text-[#B8C6D8] hover:text-[#F5F7FA]'"
        >
          账单管理
        </button>
      </div>

      <!-- 总览标签内容 -->
      <div v-if="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1 space-y-6">
          <!-- 使用统计 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#B8C6D8] mb-4">使用统计</h3>
            <div class="space-y-4">
              <div v-for="(value, key) in mockMembershipData.usageStats" :key="key">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-[#B8C6D8]">{{ key }}</span>
                  <span class="text-sm text-[#4A5F8B]">{{ value.used }}/{{ value.total }}</span>
                </div>
                <div class="w-full h-2 bg-[#1E2532] rounded-full overflow-hidden">
                  <div
                    class="h-full bg-[#4A5F8B]"
                    :style="{ width: `${(value.used / value.total) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 当前订阅 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#B8C6D8] mb-4">当前订阅</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-[#B8C6D8]">会员等级</span>
                <span class="text-sm text-[#B8C6D8] font-medium">LV.{{ mockMembershipData.currentPlan.level }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-[#B8C6D8]">订阅计划</span>
                <span class="text-sm text-[#B8C6D8] font-medium">{{ mockMembershipData.currentPlan.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-[#B8C6D8]">开始日期</span>
                <span class="text-sm text-[#B8C6D8]">{{ mockMembershipData.currentPlan.startDate }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-[#B8C6D8]">结束日期</span>
                <span class="text-sm text-[#B8C6D8]">{{ mockMembershipData.currentPlan.endDate }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-[#B8C6D8]">支付方式</span>
                <span class="text-sm text-[#B8C6D8]">{{ mockMembershipData.currentPlan.paymentFrequency }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-[#B8C6D8]">下次付款</span>
                <span class="text-sm text-[#B8C6D8]">¥{{ mockMembershipData.currentPlan.price }}</span>
              </div>
            </div>
            <button
              class="w-full mt-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors border border-[#4A5F8B]"
            >
              管理订阅
            </button>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-6">
          <!-- 专属特权 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#B8C6D8] mb-4">您的专属特权</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="benefit in mockMembershipData.benefits.active.slice(0, 4)"
                :key="benefit.id"
                class="flex items-start p-4 bg-[#1E2532] rounded-lg"
              >
                <div
                  class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0"
                >
                  <i :class="['fa-solid', benefit.icon]"></i>
                </div>
                <div>
                  <h4 class="font-medium text-[#B8C6D8] mb-1">{{ benefit.name }}</h4>
                  <p class="text-sm text-[#B8C6D8] mb-1">{{ benefit.description }}</p>
                  <span v-if="benefit.count" class="text-xs text-[#4A5F8B] font-medium">{{ benefit.count }}</span>
                </div>
              </div>
            </div>
            <div class="mt-4 text-center">
              <button
                @click="activeTab = 'benefits'"
                class="inline-flex items-center text-sm text-[#4A5F8B] hover:underline transition-colors"
              >
                <span>查看全部会员特权</span>
                <i class="fa-solid fa-chevron-right ml-1 text-xs"></i>
              </button>
            </div>
          </div>

          <!-- 推荐套餐 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#B8C6D8] mb-4">推荐套餐</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                v-for="plan in mockMembershipData.availablePlans"
                :key="plan.id"
                class="rounded-xl overflow-hidden border transition-all"
                :class="plan.recommended ? 'border-[#4A5F8B] bg-[#1E2532] relative' : 'border-[#4A5F8B] bg-[#1E2532]'"
              >
                <div v-if="plan.recommended" class="absolute top-0 right-0">
                  <div class="bg-[#4A5F8B] text-[#F5F7FA] text-xs px-3 py-1 font-medium rounded-bl-lg">
                    推荐
                  </div>
                </div>
                <div class="p-5">
                  <h4 class="font-bold text-[#B8C6D8] mb-2">{{ plan.name }}</h4>
                  <div class="mb-4">
                    <span class="text-2xl font-bold text-[#4A5F8B]">¥{{ plan.price }}</span>
                    <span class="text-[#B8C6D8] ml-1">{{ plan.period }}</span>
                  </div>
                  <ul class="space-y-2 mb-6">
                    <li v-for="(feature, index) in plan.features" :key="index" class="flex items-start text-sm">
                      <i class="fa-solid fa-check text-[#4A5F8B] mr-2 mt-0.5 flex-shrink-0"></i>
                      <span class="text-[#B8C6D8]">{{ feature }}</span>
                    </li>
                  </ul>
                  <button
                    class="w-full py-2 rounded-lg font-medium transition-colors"
                    :class="plan.recommended ? 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#63B3ED]' : 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#63B3ED] border border-[#4A5F8B]'"
                  >
                    {{ plan.id === 2 ? '当前套餐' : '立即订阅' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 会员权益标签内容 -->
      <div v-if="activeTab === 'benefits'" class="space-y-8">
        <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <h3 class="text-lg font-bold text-[#B8C6D8] mb-4">当前可用权益</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="benefit in mockMembershipData.benefits.active"
              :key="benefit.id"
              class="flex items-start p-4 bg-[#1E2532] rounded-lg"
            >
              <div
                class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0"
              >
                <i :class="['fa-solid', benefit.icon]"></i>
              </div>
              <div>
                <h4 class="font-medium text-[#B8C6D8] mb-1">{{ benefit.name }}</h4>
                <p class="text-sm text-[#B8C6D8] mb-1">{{ benefit.description }}</p>
                <span v-if="benefit.count" class="text-xs text-[#4A5F8B] font-medium">{{ benefit.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="mockMembershipData.benefits.upcoming.length > 0" class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <h3 class="text-lg font-bold text-[#B8C6D8] mb-4">升级后可享权益</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="benefit in mockMembershipData.benefits.upcoming"
              :key="benefit.id"
              class="flex items-start p-4 bg-[#1E2532] rounded-lg"
            >
              <div
                class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0"
              >
                <i :class="['fa-solid', benefit.icon]"></i>
              </div>
              <div>
                <h4 class="font-medium text-[#B8C6D8] mb-1">{{ benefit.name }}</h4>
                <p class="text-sm text-[#B8C6D8] mb-1">{{ benefit.description }}</p>
                <span class="text-xs text-[#4A5F8B] font-medium">LV.{{ benefit.level }} 解锁</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 等级提升标签内容 -->
      <div v-if="activeTab === 'upgrade'" class="space-y-8">
        <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <h3 class="text-lg font-bold text-[#B8C6D8] mb-4">下一级：{{ mockMembershipData.nextLevel.name }}</h3>
          <div class="space-y-4">
            <div v-for="requirement in mockMembershipData.nextLevel.requirements" :key="requirement.id" class="flex items-center justify-between">
              <div class="flex items-center">
                <div
                  class="w-6 h-6 rounded-full flex items-center justify-center mr-3"
                  :class="requirement.completed ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B]'"
                >
                  <i v-if="requirement.completed" class="fa-solid fa-check text-xs"></i>
                  <span v-else class="text-xs">{{ requirement.progress }}%</span>
                </div>
                <span class="text-[#B8C6D8]">{{ requirement.name }}</span>
              </div>
              <div v-if="requirement.progress !== undefined" class="w-40">
                <div class="w-full h-2 bg-[#1E2532] rounded-full overflow-hidden">
                  <div
                    class="h-full bg-[#4A5F8B]"
                    :style="{ width: `${(requirement.progress / requirement.total) * 100}%` }"
                  ></div>
                </div>
                <div class="flex justify-between mt-1">
                  <span class="text-xs text-[#B8C6D8]">{{ requirement.progress }}</span>
                  <span class="text-xs text-[#B8C6D8]">{{ requirement.total }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-6">
            <button
              class="w-full py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors"
            >
              查看升级攻略
            </button>
          </div>
        </div>
      </div>

      <!-- 账单管理标签内容 -->
      <div v-if="activeTab === 'billing'" class="space-y-8">
        <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <h3 class="text-lg font-bold text-[#B8C6D8] mb-4">支付历史</h3>
          <div class="space-y-4">
            <!-- 这里可以添加支付历史记录 -->
            <div class="p-4 bg-[#1E2532] rounded-lg flex justify-between items-center">
              <div>
                <h4 class="font-medium text-[#B8C6D8]">{{ mockMembershipData.currentPlan.name }} 续费</h4>
                <p class="text-xs text-[#B8C6D8] mt-1">2023-06-15 10:23:45</p>
              </div>
              <div class="text-right">
                <p class="text-[#4A5F8B] font-medium">¥{{ mockMembershipData.currentPlan.price }}</p>
                <p class="text-xs text-[#B8C6D8] mt-1">支付成功</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);
const activeTab = ref('overview');

// 模拟会员数据
const mockMembershipData = {
  currentPlan: {
    name: "银河会员·年卡",
    level: "3",
    startDate: "2023-06-15",
    endDate: "2024-06-15",
    daysLeft: 128,
    price: "299",
    paymentFrequency: "年付"
  },

  nextLevel: {
    name: "星云会员",
    level: "4",
    requirements: [
      {
        id: 1,
        name: "连续开通会员6个月",
        completed: true
      },
      {
        id: 2,
        name: "发布10篇优质作品",
        completed: true
      },
      {
        id: 3,
        name: "获得500个收藏",
        completed: false,
        progress: 342,
        total: 500
      },
      {
        id: 4,
        name: "拥有100个粉丝",
        completed: false,
        progress: 72,
        total: 100
      }
    ]
  },

  benefits: {
    active: [
      {
        id: 1,
        name: "免费RAW素材下载",
        description: "每月可下载10个高质量RAW素材",
        icon: "fa-file-image",
        count: "10/10"
      },
      {
        id: 2,
        name: "赛事优先报名",
        description: "热门赛事提前3天报名资格",
        icon: "fa-trophy",
        count: null
      },
      {
        id: 3,
        name: "专属后期预设包",
        description: "10个专业摄影后期预设",
        icon: "fa-sliders-h",
        count: null
      },
      {
        id: 4,
        name: "免费在线课程",
        description: "每月2门会员专属摄影课程",
        icon: "fa-graduation-cap",
        count: "2/2"
      },
      {
        id: 5,
        name: "作品优先推荐",
        description: "作品在首页推荐几率提升50%",
        icon: "fa-star",
        count: null
      },
      {
        id: 6,
        name: "无水印导出",
        description: "在线编辑工具支持无水印导出",
        icon: "fa-image",
        count: null
      }
    ],

    upcoming: [
      {
        id: 1,
        name: "专属客服通道",
        description: "1对1专属客服咨询服务",
        icon: "fa-headset",
        level: 4
      },
      {
        id: 2,
        name: "器材租赁优惠",
        description: "专业摄影器材租赁9折优惠",
        icon: "fa-video",
        level: 4
      },
      {
        id: 3,
        name: "线下活动免费",
        description: "每月1次免费参与线下摄影活动",
        icon: "fa-calendar-check",
        level: 5
      }
    ]
  },

  availablePlans: [
    {
      id: 1,
      name: "月卡",
      price: "39",
      period: "1个月",
      features: ["全部基础功能", "每月5个素材", "在线客服", "会员专属标识"]
    },
    {
      id: 2,
      name: "年卡",
      price: "299",
      period: "13个月",
      features: ["全部基础功能", "每月10个素材", "优先报名", "专属预设包", "免费课程", "作品优先推荐", "无水印导出"],
      recommended: true
    },
    {
      id: 3,
      name: "终身卡",
      price: "1999",
      period: "终身",
      features: ["全部高级功能", "无限素材下载", "专属客服", "器材租赁8折", "免费线下活动", "专属标识"]
    }
  ],

  usageStats: {
    "素材下载": {
      used: 8,
      total: 10
    },
    "课程学习": {
      used: 2,
      total: 2
    },
    "赛事报名": {
      used: 3,
      total: 10
    },
    "预设使用": {
      used: 5,
      total: 10
    }
  }
};
</script>

<style scoped>
/* 组件特定样式可以在这里添加 */
</style>