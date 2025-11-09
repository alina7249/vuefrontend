<template>
  <div v-if="!isAuthenticated" class="container mx-auto px-4 py-8 bg-[#1E2A3A] star-texture min-h-screen">
    <div class="flex flex-col items-center justify-center h-[60vh] text-center">
      <div class="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
        <i class="fa-solid fa-user-lock text-2xl"></i>
      </div>
      <h2 class="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
      <p class="text-[#B8C6D8] mb-6 max-w-md">登录后查看您的成长值和可领取的福利</p>
      <RouterLink
        to="/login"
        class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors"
      >
        立即登录
      </RouterLink>
    </div>
  </div>
  <div v-else class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div
      v-motion
      :initial="{
        opacity: 0,
        y: 20,
      }"
      :enter="{
        opacity: 1,
        y: 0,
        transition: {
          duration: 500,
        },
      }"
    >
      <!-- 返回按钮 -->
      <div class="mb-6">
        <RouterLink
          to="/profile-center"
          class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
        >
          <i class="fa-solid fa-arrow-left"></i>
          <span>返回个人中心</span>
        </RouterLink>
      </div>

      <!-- 页面标题 -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">成长福利</h1>
        <p class="text-[#B8C6D8] max-w-2xl mx-auto">
          查看您的成长进度，完成任务获得成长值，兑换丰富的摄影福利
        </p>
      </div>

      <!-- 等级卡片 - 底色浅蓝灰渐变 #4A5F8B→#6B7C93，文字浅白 #F5F7FA -->
      <div class="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 shadow-lg mb-8 text-[#F5F7FA]">
        <div class="flex flex-col md:flex-row md:items-center justify-between">
          <!-- 左侧信息 -->
          <div class="mb-6 md:mb-0">
            <div class="flex items-center mb-3">
              <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <i class="fa-solid fa-trophy text-3xl text-[#F5F7FA]"></i>
              </div>
              <div>
                <h2 class="text-2xl font-bold">{{ mockGrowthData.currentLevel.name }}</h2>
                <p class="text-[#F5F7FA]/80">LV.{{ mockGrowthData.currentLevel.level }}</p>
              </div>
            </div>
            <div class="w-full bg-white/20 rounded-full h-2.5 mb-2 overflow-hidden">
              <div
                class="h-full bg-[#4A5F8B]"
                :style="{
                  width: `${(mockGrowthData.currentLevel.progress / mockGrowthData.currentLevel.maxProgress) * 100}%`,
                }"
              ></div>
            </div>
            <div class="flex justify-between text-sm">
              <span>成长值: {{ mockGrowthData.currentLevel.progress }}/{{ mockGrowthData.currentLevel.maxProgress }}</span>
              <span>距离升级还需: {{ mockGrowthData.currentLevel.maxProgress - mockGrowthData.currentLevel.progress }}点</span>
            </div>
          </div>
          
          <!-- 右侧统计 -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white/20 p-4 rounded-lg text-center">
              <p class="text-3xl font-bold mb-1">{{ totalPoints }}</p>
              <p class="text-sm text-[#F5F7FA]/80">总成长值</p>
            </div>
            <div class="bg-white/20 p-4 rounded-lg text-center">
              <p class="text-3xl font-bold mb-1">{{ Object.keys(mockGrowthData.completedTasks).length }}</p>
              <p class="text-sm text-[#F5F7FA]/80">已完成任务</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 标签页导航 - 未选中：深灰蓝 #2D3748 + 浅冷灰 #B8C6D8；选中：浅蓝灰 #4A5F8B + 浅白 #F5F7FA -->
      <div class="bg-[#2D3748] rounded-xl p-1 mb-8 flex flex-wrap">
        <button
          @click="activeTab = 'growth'"
          :class="`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${
            activeTab === 'growth'
              ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium'
              : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
          }`"
        >
          成长记录
        </button>
        <button
          @click="activeTab = 'rewards'"
          :class="`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${
            activeTab === 'rewards'
              ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium'
              : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
          }`"
        >
          福利兑换
        </button>
        <button
          @click="activeTab = 'tasks'"
          :class="`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${
            activeTab === 'tasks'
              ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium'
              : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
          }`"
        >
          任务中心
        </button>
      </div>

      <!-- 内容区域 -->
      <template v-if="activeTab === 'growth'">
        <div class="space-y-8">
          <!-- 成长值记录 - 底色深灰蓝 #2D3748 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">成长值记录</h3>
            <div class="space-y-4">
              <template v-for="item in mockGrowthData.growthHistory" :key="item.date">
                <div
                  class="flex items-center justify-between p-4 bg-[#2D3748] rounded-lg border-[#4A5F8B] hover:border-2 hover:border-[#4A5F8B] transition-all"
                >
                  <div class="flex items-center">
                    <div
                      class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4"
                    >
                      <i class="fa-solid fa-plus-circle"></i>
                    </div>
                    <div>
                      <h4 class="font-medium text-[#F5F7FA]">{{ item.action }}</h4>
                      <p class="text-sm text-[#B8C6D8]">{{ item.date }}</p>
                    </div>
                  </div>
                  <div class="text-[#6B7C93] font-bold">+{{ item.points }}</div>
                </div>
              </template>
            </div>
            
            <!-- 分页 -->
            <div class="flex justify-center mt-6">
              <nav class="flex items-center space-x-1 bg-[#1E2532] p-2 rounded-lg border border-[#4A5F8B]">
                <button class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                  <i class="fa-solid fa-chevron-left text-xs"></i>
                </button>
                <button class="px-3 py-2 rounded border border-[#4A5F8B] bg-[#4A5F8B] text-[#F5F7FA]">
                  1
                </button>
                <button class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                  <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
              </nav>
            </div>
          </div>

          <!-- 升级指南模块 - 底色深灰蓝 #2D3748，标题浅白 #F5F7FA，内容文字浅冷灰 #B8C6D8 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">升级指南</h3>
            <div class="space-y-4">
              <div class="flex items-start">
                <div
                  class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0"
                >
                  <i class="fa-solid fa-chart-line"></i>
                </div>
                <div>
                  <h4 class="font-medium text-[#F5F7FA] mb-1">如何获得成长值？</h4>
                  <ul class="list-disc pl-5 space-y-1 text-sm text-[#B8C6D8]">
                    <li>发布优质作品并获得点赞和收藏</li>
                    <li>参加摄影比赛和线上活动</li>
                    <li>完成新手任务和日常任务</li>
                    <li>邀请好友注册并活跃</li>
                    <li>发表高质量评论和互动</li>
                  </ul>
                </div>
              </div>
              <div class="flex items-start">
                <div
                  class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0"
                >
                  <i class="fa-solid fa-gift"></i>
                </div>
                <div>
                  <h4 class="font-medium text-[#F5F7FA] mb-1">升级有什么好处？</h4>
                  <ul class="list-disc pl-5 space-y-1 text-sm text-[#B8C6D8]">
                    <li>解锁更多高级功能和特权</li>
                    <li>获得专属的徽章和标识</li>
                    <li>作品获得更多曝光和推荐机会</li>
                    <li>参与独家活动和线下聚会</li>
                    <li>获得专业摄影师的指导和点评</li>
                  </ul>
                </div>
              </div>
              <div class="flex items-start">
                <div
                  class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0"
                >
                  <i class="fa-solid fa-rocket"></i>
                </div>
                <div>
                  <h4 class="font-medium text-[#F5F7FA] mb-1">加速升级的技巧</h4>
                  <ul class="list-disc pl-5 space-y-1 text-sm text-[#B8C6D8]">
                    <li>保持每周至少发布1篇优质作品</li>
                    <li>积极参与社区互动，评论和点赞他人作品</li>
                    <li>加入摄影小组，与其他摄影师交流学习</li>
                    <li>参加平台组织的各类线上线下活动</li>
                    <li>分享您的作品到社交媒体，吸引更多关注</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-if="activeTab === 'rewards'">
        <div class="space-y-8">
          <!-- 福利兑换 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-bold text-[#F5F7FA]">可兑换福利</h3>
              <div class="flex items-center">
                <span class="text-sm text-[#B8C6D8] mr-2">显示已兑换:</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    class="sr-only peer" 
                    :checked="showClaimedRewards"
                    @change="showClaimedRewards = !showClaimedRewards"
                  />
                  <div class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                </label>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <template v-for="reward in filteredRewards" :key="reward.id">
                <div
                  v-motion
                  :initial="{ y: 0, boxShadow: 'none' }"
                  :hover="{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }"
                  :class="`bg-[#1E2532] rounded-xl overflow-hidden border transition-all ${
                    reward.available 
                      ? 'border-[#4A5F8B]' 
                      : 'border-[#4A5F8B]/50 opacity-80'
                  }`"
                >
                  <div class="relative">
                    <img
                      :src="reward.image"
                      :alt="reward.name"
                      class="w-full h-36 object-cover"
                    />
                    <div class="absolute top-3 right-3">
                      <span :class="`px-2 py-1 bg-[#4A5F8B]/80 text-[#F5F7FA] text-xs rounded-full flex items-center`">
                        <i class="fa-solid fa-coins mr-1"></i>
                        {{ reward.points }}
                      </span>
                    </div>
                    <div v-if="!reward.available" class="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium">已兑换</span>
                    </div>
                  </div>
                  
                  <div class="p-5">
                    <h4 class="font-bold text-[#F5F7FA] mb-2">{{ reward.name }}</h4>
                    <p class="text-sm text-[#B8C6D8] mb-4">{{ reward.description }}</p>
                    
                    <div class="flex justify-between items-center">
                      <button 
                        v-if="reward.available"
                        :class="`px-4 py-2 rounded-lg font-medium transition-colors ${
                          totalPoints >= reward.points
                            ? 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#63B3ED]'
                            : 'bg-[#6B7C93] text-[#B8C6D8] cursor-not-allowed'
                        }`"
                        :disabled="totalPoints < reward.points"
                      >
                        立即兑换
                      </button>
                      <span v-else class="text-sm text-[#B8C6D8]">
                        兑换时间: 2023-10-15
                      </span>
                      <div :class="`text-sm font-medium ${
                        totalPoints >= reward.points && reward.available
                          ? 'text-[#4A5F8B]'
                          : 'text-[#ED8936]'
                      }`">
                        <template v-if="reward.available && totalPoints < reward.points">
                          还需{{ reward.points - totalPoints }}点
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            
            <div v-if="filteredRewards.length === 0" class="p-8 text-center">
              <div class="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
                <i class="fa-solid fa-gift text-2xl"></i>
              </div>
              <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">暂无可用福利</h3>
              <p class="text-sm text-[#B8C6D8]">
                继续活跃获取更多成长值，解锁更多福利
              </p>
            </div>
          </div>

          <!-- 兑换记录 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">兑换记录</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b border-[#4A5F8B]">
                    <th class="px-4 py-3 text-left text-sm font-medium text-[#F5F7FA]">福利名称</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-[#F5F7FA]">消耗积分</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-[#F5F7FA]">兑换时间</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-[#F5F7FA]">状态</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-[#F5F7FA]">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b border-[#4A5F8B]">
                    <td class="px-4 py-4 text-sm text-[#B8C6D8]">基础后期预设包</td>
                    <td class="px-4 py-4 text-sm text-[#B8C6D8]">50</td>
                    <td class="px-4 py-4 text-sm text-[#B8C6D8]">2023-10-10</td>
                    <td class="px-4 py-4">
                      <span class="px-2 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] rounded-full text-xs">已完成</span>
                    </td>
                    <td class="px-4 py-4">
                      <button class="text-sm text-[#4A5F8B] hover:underline transition-colors">查看详情</button>
                    </td>
                  </tr>
                  <tr>
                    <td class="px-4 py-4 text-sm text-[#B8C6D8]">RAW素材下载券</td>
                    <td class="px-4 py-4 text-sm text-[#B8C6D8]">80</td>
                    <td class="px-4 py-4 text-sm text-[#B8C6D8]">2023-09-25</td>
                    <td class="px-4 py-4">
                      <span class="px-2 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] rounded-full text-xs">已完成</span>
                    </td>
                    <td class="px-4 py-4">
                      <button class="text-sm text-[#4A5F8B] hover:underline transition-colors">查看详情</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>

      <template v-if="activeTab === 'tasks'">
        <div class="space-y-8">
          <!-- 进行中任务 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">进行中任务</h3>
            <div class="space-y-4">
              <template v-for="task in mockGrowthData.ongoingTasks" :key="task.id">
                <div class="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B] hover:border-2 hover:border-[#4A5F8B] transition-all">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-start">
                      <div class="w-8 h-8 rounded-full bg-[#1E2532] text-[#4A5F8B] border border-[#4A5F8B] flex items-center justify-center mr-3 flex-shrink-0">
                        <i class="fa-solid fa-spinner fa-spin"></i>
                      </div>
                      <div>
                        <h4 class="font-medium text-[#F5F7FA]">{{ task.name }}</h4>
                        <p class="text-sm text-[#B8C6D8] mt-1">{{ task.description }}</p>
                      </div>
                    </div>
                    <div class="text-[#4A5F8B] font-bold flex items-center">
                      <i class="fa-solid fa-coins mr-1"></i>
                      {{ task.points }}
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-xs text-[#B8C6D8]">进度</span>
                      <span class="text-xs text-[#4A5F8B]">{{ task.progress || 0 }}/{{ task.total || 0 }}</span>
                    </div>
                    <div class="w-full h-1.5 bg-[#1E2532] rounded-full overflow-hidden border border-[#4A5F8B]">
                      <div 
                        class="h-full bg-[#4A5F8B]" 
                        :style="{ width: `${((task.progress || 0) / (task.total || 1)) * 100}%` }"
                      ></div>
                    </div>
                    <div class="mt-2 text-right">
                      <button class="text-xs text-[#4A5F8B] hover:underline transition-colors">
                        去完成 <i class="fa-solid fa-arrow-right ml-1 text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- 已完成任务 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">已完成任务</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <template v-for="task in mockGrowthData.completedTasks" :key="task.id">
                <div class="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B] flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4">
                      <i class="fa-solid fa-check"></i>
                    </div>
                    <div>
                      <h4 class="font-medium text-[#F5F7FA]">{{ task.name }}</h4>
                      <p class="text-sm text-[#B8C6D8]">{{ task.description }}</p>
                    </div>
                  </div>
                  <div class="text-[#4A5F8B] font-bold">+{{ task.points }}</div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

// 类型定义
interface GrowthHistoryItem {
  date: string
  action: string
  points: number
}

interface Reward {
  id: string
  name: string
  description: string
  points: number
  image: string
  available: boolean
}

interface Task {
  id: string
  name: string
  description: string
  points: number
  completed: boolean
  progress?: number
  total?: number
}

interface CurrentLevel {
  name: string
  level: number
  progress: number
  maxProgress: number
  joinDate: string
}

interface MockGrowthData {
  currentLevel: CurrentLevel
  growthHistory: GrowthHistoryItem[]
  availableRewards: Reward[]
  completedTasks: Task[]
  ongoingTasks: Task[]
}

// 模拟用户成长数据
const mockGrowthData: MockGrowthData = {
  currentLevel: {
    name: '新锐摄影师',
    level: 3,
    progress: 120,
    maxProgress: 200,
    joinDate: '2023-03-15',
  },
  growthHistory: [
    { date: '2023-10-25', action: '发布作品获得收藏', points: 15 },
    { date: '2023-10-22', action: '参加摄影比赛', points: 30 },
    { date: '2023-10-18', action: '作品获得点赞', points: 5 },
    { date: '2023-10-15', action: '完成新手任务', points: 20 },
    { date: '2023-10-10', action: '发布作品获得收藏', points: 10 },
    { date: '2023-10-05', action: '邀请好友注册', points: 20 },
  ],
  availableRewards: [
    { id: 'r1', name: '基础后期预设包', description: '10个专业摄影后期预设', points: 50, image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photo%20preset%20pack%20thumbnail%20photography%20editing&sign=e8c6e47f437ba890910bd7f636a11f1b', available: true },
    { id: 'r2', name: 'RAW素材下载券', description: '5个高质量RAW素材下载权限', points: 80, image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=raw%20photo%20download%20voucher%20thumbnail&sign=05dbb388d7010c5c0355b7ca1fcf8775', available: true },
    { id: 'r3', name: '摄影课程折扣券', description: '线上摄影课程8折优惠', points: 100, image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20course%20discount%20voucher%20thumbnail&sign=9ab6fe1c09a5f10cf322494fa9d02fdb', available: true },
    { id: 'r4', name: '高级会员体验卡', description: '7天高级会员免费体验', points: 150, image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=premium%20membership%20trial%20card%20thumbnail%20gold%20glow&sign=1c989a761cbbc5239aefecefd0fb57bf', available: true },
    { id: 'r5', name: '专业器材租赁券', description: '专业相机镜头租赁一天免费', points: 200, image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=camera%20equipment%20rental%20voucher%20thumbnail&sign=526fa89bffb356b8ee6de91d54131e4f', available: false },
    { id: 'r6', name: '线下活动免费券', description: '免费参加一次线下摄影活动', points: 250, image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20event%20free%20ticket%20thumbnail&sign=603c66e6e40f8e7fb5a2c9abab507bff', available: false },
  ],
  completedTasks: [
    { id: 't1', name: '完善个人资料', description: '上传头像并填写个人简介', points: 10, completed: true },
    { id: 't2', name: '发布第一篇作品', description: '上传并发布您的第一篇摄影作品', points: 20, completed: true },
    { id: 't3', name: '关注5位摄影师', description: '关注5位您感兴趣的摄影师', points: 15, completed: true },
    { id: 't4', name: '收藏10篇作品', description: '收藏10篇您喜欢的摄影作品', points: 10, completed: true },
  ],
  ongoingTasks: [
    { id: 't5', name: '参加摄影比赛', description: '提交作品参加一次摄影比赛', points: 30, progress: 0, total: 1, completed: false },
    { id: 't6', name: '作品获得100赞', description: '您的作品累计获得100个点赞', points: 25, progress: 72, total: 100, completed: false },
    { id: 't7', name: '发布5篇优质作品', description: '上传并发布5篇获得推荐的优质作品', points: 50, progress: 2, total: 5, completed: false },
    { id: 't8', name: '邀请3位好友', description: '邀请3位好友注册并完成认证', points: 30, progress: 1, total: 3, completed: false },
  ]
}

// 响应式状态
const isAuthenticated = ref(true) // 模拟认证状态
const activeTab = ref('growth') // growth, rewards, tasks
const showClaimedRewards = ref(false)

// 计算属性
const totalPoints = computed(() => {
  return mockGrowthData.growthHistory.reduce((sum, item) => sum + item.points, 0)
})

const filteredRewards = computed(() => {
  return mockGrowthData.availableRewards.filter(reward => {
    if (showClaimedRewards.value) {
      return true
    }
    return reward.available
  })
})
</script>

<style scoped>
/* 样式已通过 Tailwind CSS 实现，无需额外 CSS */
</style>