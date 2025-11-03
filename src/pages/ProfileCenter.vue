<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div class="flex flex-col items-center justify-center h-[60vh] text-center">
      <div class="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
        <i class="fa-solid fa-user-lock text-2xl"></i>
      </div>
      <h2 class="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
      <p class="text-[#B8C6D8] mb-6 max-w-md">登录后查看您的个人中心，管理作品和查看数据统计</p>
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
      <!--  页面标题  -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">个人中心</h1>
        <p class="text-[#B8C6D8] max-w-2xl mx-auto">
          管理您的作品、查看数据统计、参与摄影活动，提升摄影技能
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!--  主要内容区域（占据3/4宽度）  -->
        <div class="lg:col-span-3 space-y-8">
          <!--  顶部信息区 - 个人信息+数据概览  -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!--  个人信息  -->
              <div class="md:col-span-2">
                <div class="flex flex-col sm:flex-row items-start sm:items-center mb-6">
                  <div class="relative mr-6 mb-4 sm:mb-0">
                    <div class="w-20 h-20 rounded-full border-2 border-[#4A5F8B] overflow-hidden shadow-md">
                      <img :src="mockUserData.avatar" alt="User Avatar" class="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div class="flex-1">
                    <h2 class="text-xl font-bold text-[#F5F7FA] mb-1">{{ mockUserData.username }}</h2>
                    <p class="text-[#B8C6D8] text-sm mb-3">{{ mockUserData.tags }}</p>

                    <!--  等级和进度条  -->
                    <div class="flex items-center mb-4">
                      <span class="text-[#4A5F8B] text-sm mr-2"
                        >{{ mockUserData.level }} LV.{{ mockUserData.levelNum }}</span
                      >
                      <div class="flex-1 h-2 bg-[#1E2532] rounded-full overflow-hidden mr-2">
                        <div
                          class="h-full bg-[#4A5F8B]"
                          :style="{
                            width: `${(mockUserData.progress / mockUserData.progressMax) * 100}%`,
                          }"
                        ></div>
                      </div>
                      <span class="text-[#4A5F8B] text-xs"
                        >{{ mockUserData.progress }}/{{ mockUserData.progressMax }}</span
                      >
                    </div>

                    <!--  关注与粉丝  -->
                    <div class="flex items-center space-x-6">
                      <div class="flex items-center">
                        <span class="font-bold text-[#F5F7FA]">{{ mockUserData.stats.following }}</span>
                        <span class="text-[#B8C6D8] text-sm ml-1">关注</span>
                      </div>
                      <div class="flex items-center">
                        <span class="font-bold text-[#F5F7FA]">{{ mockUserData.stats.followers }}</span>
                        <span class="text-[#B8C6D8] text-sm ml-1">粉丝</span>
                      </div>
                    </div>
                  </div>

                  <!--  操作按钮  -->
                  <div class="flex space-x-3 self-end sm:self-auto">
                    <button
                      class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
                    >
                      <i class="fa-solid fa-pen-to-square mr-2"></i>编辑资料
                    </button>
                    <button
                      class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
                    >
                      <i class="fa-solid fa-cog mr-2"></i>设置
                    </button>
                  </div>
                </div>

                <!--  最近动态  -->
                <div class="bg-[#1E2532] rounded-lg p-4">
                  <h3 class="text-sm font-medium text-[#F5F7FA] mb-3">最近动态</h3>
                  <div class="space-y-3 max-h-40 overflow-y-auto pr-2">
                    <template v-for="activity in recentActivities" :key="">
                      <div :key="activity.id" class="flex items-start">
                        <div
                          class="w-6 h-6 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3 mt-0.5 flex-shrink-0"
                        >
                          <i
                            :class="`fa-solid text-xs ${
                              activity.type === 'post'
                                ? 'fa-image'
                                : activity.type === 'follower'
                                ? 'fa-user-plus'
                                : activity.type === 'task'
                                ? 'fa-check'
                                : activity.type === 'featured'
                                ? 'fa-star'
                                : 'fa-trophy'
                            }`"
                          ></i>
                        </div>
                        <p class="text-sm text-[#B8C6D8]">{{ activity.text }}</p>
                      </div>
                    </template>
                  </div>
                </div>
              </div>

              <!--  数据概览区  -->
              <div class="md:col-span-1">
                <div class="space-y-4">
                  <!--  作品数卡片  -->
                  <motion.div
                    :whileHover="{
                      scale: 1.02,
                    }"
                    class="bg-[#2D3748] rounded-lg p-4 border border-[#4A5F8B] hover:shadow-lg transition-all"
                  >
                    <h3 class="text-sm font-medium text-[#B8C6D8] mb-1">作品数</h3>
                    <div class="flex items-end justify-between">
                      <span class="text-2xl font-bold text-[#F5F7FA]">{{ mockUserData.stats.posts }}</span>
                      <span class="text-xs text-[#4A5F8B]">本月新增 {{ mockUserData.stats.newPosts }} 个</span>
                    </div>
                    <div class="mt-3 h-14">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart :data="trendData">
                          <Line
                            type="monotone"
                            dataKey="posts"
                            stroke="#4A5F8B"
                            :strokeWidth="2"
                            :dot="false"
                            :isAnimationActive="false"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  <!--  获赞数卡片  -->
                  <motion.div
                    :whileHover="{
                      scale: 1.02,
                    }"
                    class="bg-[#2D3748] rounded-lg p-4 border border-[#4A5F8B] hover:shadow-lg transition-all"
                  >
                    <h3 class="text-sm font-medium text-[#B8C6D8] mb-1">获赞数</h3>
                    <div class="flex items-end justify-between">
                      <span class="text-2xl font-bold text-[#F5F7FA]">{{ mockUserData.stats.likes }}</span>
                      <span class="text-xs text-[#4A5F8B]">本月新增 {{ mockUserData.stats.newLikes }} 次</span>
                    </div>
                    <div class="mt-3 h-14">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart :data="trendData">
                          <Line
                            type="monotone"
                            dataKey="likes"
                            stroke="#4A5F8B"
                            :strokeWidth="2"
                            :dot="false"
                            :isAnimationActive="false"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  <!--  收藏数卡片  -->
                  <motion.div
                    :whileHover="{
                      scale: 1.02,
                    }"
                    class="bg-[#2D3748] rounded-lg p-4 border border-[#4A5F8B] hover:shadow-lg transition-all"
                  >
                    <h3 class="text-sm font-medium text-[#B8C6D8] mb-1">收藏数</h3>
                    <div class="flex items-end justify-between">
                      <span class="text-2xl font-bold text-[#F5F7FA]">{{ mockUserData.stats.collections }}</span>
                      <span class="text-xs text-[#4A5F8B]">本月新增 {{ mockUserData.stats.newCollections }} 次</span>
                    </div>
                    <div class="mt-3 h-14">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart :data="trendData">
                          <Line
                            type="monotone"
                            dataKey="collections"
                            stroke="#4A5F8B"
                            :strokeWidth="2"
                            :dot="false"
                            :isAnimationActive="false"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          <!--  核心功能入口  -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h2 class="text-lg font-bold text-[#F5F7FA] mb-6">核心功能</h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!--  作品管理  -->
              <div class="bg-[#1E2532] rounded-lg p-5 border border-[#4A5F8B]">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-base font-medium text-[#F5F7FA] flex items-center">
                    <i class="fa-solid fa-camera text-[#4A5F8B] mr-2"></i>
                    作品管理
                  </h3>
                  <Link to="/profile-center/works" class="text-xs text-[#4A5F8B] hover:text-[#6B7C93]">
                    查看全部
                  </Link>
                </div>

                <p class="text-xs text-[#B8C6D8] mb-4">最近上传作品：《森林晨雾》</p>

                <div class="grid grid-cols-3 gap-2 mb-4">
                  <template v-for="work in recentWorks" :key="">
                    <motion.div
                      :key="work.id"
                      :whileHover="{
                        scale: 1.05,
                      }"
                      class="aspect-square rounded overflow-hidden"
                    >
                      <img :src="work.image" :alt="work.title" class="w-full h-full object-cover" />
                    </motion.div>
                  </template>
                </div>

                <button
                  class="w-full py-2 text-center bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-sm"
                >
                  <i class="fa-solid fa-plus mr-1"></i> 上传作品（支持RAW/JPG/视频）
                </button>
              </div>

              <!--  我的器材库  -->
              <div class="bg-[#1E2532] rounded-lg p-5 border border-[#4A5F8B]">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-base font-medium text-[#F5F7FA] flex items-center">
                    <i class="fa-solid fa-video text-[#4A5F8B] mr-2"></i>
                    我的器材库
                  </h3>
                  <Link to="/profile-center/materials" class="text-xs text-[#4A5F8B] hover:text-[#6B7C93]">
                    查看全部
                  </Link>
                </div>

                <p class="text-xs text-[#B8C6D8] mb-4">最近浏览：索尼 A7R IV</p>

                <div class="space-y-3 mb-4">
                  <template v-for="equipment in recentEquipment" :key="">
                    <div :key="equipment.id" class="flex items-center justify-between">
                      <div class="flex items-center">
                        <div
                          class="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3"
                        >
                          <i
                            :class="`fa-solid ${
                              equipment.type === 'camera'
                                ? 'fa-camera'
                                : equipment.type === 'lens'
                                ? 'fa-camera-retro'
                                : 'fa-drone'
                            }`"
                          ></i>
                        </div>
                        <span class="text-sm text-[#B8C6D8]">{{ equipment.name }}</span>
                      </div>
                      <i class="fa-solid fa-chevron-right text-xs text-[#4A5F8B]"></i>
                    </div>
                  </template>
                </div>

                <button
                  class="w-full py-2 text-center bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-sm"
                >
                  <i class="fa-solid fa-plus mr-1"></i> 添加器材
                </button>
              </div>

              <!--  我的课程  -->
              <div class="bg-[#1E2532] rounded-lg p-5 border border-[#4A5F8B]">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-base font-medium text-[#F5F7FA] flex items-center">
                    <i class="fa-solid fa-book text-[#4A5F8B] mr-2"></i>
                    我的课程
                  </h3>
                  <Link to="/online-courses" class="text-xs text-[#4A5F8B] hover:text-[#6B7C93]">
                    查看全部
                  </Link>
                </div>

                <p class="text-xs text-[#B8C6D8] mb-4">风光摄影课已学 65%</p>

                <div class="space-y-4 mb-4">
                  <template v-for="course in recentCourses" :key="">
                    <div :key="course.id" class="space-y-1">
                      <div class="flex justify-between items-center">
                        <span class="text-sm text-[#B8C6D8]">{{ course.name }}</span>
                        <span class="text-xs text-[#4A5F8B]">{{ course.progress }}%</span>
                      </div>
                      <div class="w-full h-1.5 bg-[#4A5F8B]/20 rounded-full overflow-hidden">
                        <div
                          class="h-full bg-[#4A5F8B]"
                          :style="{
                            width: `${course.progress}%`,
                          }"
                        ></div>
                      </div>
                    </div>
                  </template>
                </div>

                <button
                  class="w-full py-2 text-center bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-sm"
                >
                  <i class="fa-solid fa-play mr-1"></i> 继续学习
                </button>
              </div>
            </div>
          </div>

          <!--  会员中心区  -->
          <div class="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <i class="fa-solid fa-crown text-[#F5F7FA]"></i>
                </div>
                <div>
                  <h2 class="text-lg font-bold text-[#F5F7FA]">{{ mockUserData.memberStatus }}</h2>
                  <p class="text-xs text-[#F5F7FA]/80">剩余{{ mockUserData.memberDaysLeft }}天</p>
                </div>
              </div>
              <div class="flex space-x-3">
                <button
                  class="px-4 py-2 bg-transparent text-[#F5F7FA] rounded-lg font-medium hover:bg-white/10 transition-colors text-sm border border-[#F5F7FA]"
                >
                  续费
                </button>
                <button
                  class="px-4 py-2 bg-[#F5F7FA] text-[#4A5F8B] rounded-lg font-medium hover:bg-white transition-colors text-sm"
                >
                  立即升级
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!--  当前权益  -->
              <div class="bg-[#1E2532]/70 rounded-lg p-5">
                <h3 class="text-sm font-medium text-[#F5F7FA] mb-4 flex items-center">
                  <i class="fa-solid fa-gift text-[#4A5F8B] mr-2"></i>
                  当前权益
                </h3>
                <div class="space-y-3">
                  <template v-for="benefit in memberBenefits" :key="">
                    <div :key="benefit.id" class="flex items-center justify-between">
                      <div class="flex items-center">
                        <div
                          class="w-6 h-6 rounded-full bg-[#4A5F8B] flex items-center justify-center text-[#F5F7FA] mr-2"
                        >
                          <i class="fa-solid fa-check text-xs"></i>
                        </div>
                        <span class="text-sm text-[#F5F7FA]">
                          {{ benefit.name }}

                          <template v-if="benefit.count"> </template>
                        </span>
                      </div>
                      <i class="fa-solid fa-chevron-right text-xs text-[#4A5F8B]"></i>
                    </div>
                  </template>
                </div>
              </div>

              <!--  使用记录  -->
              <div class="bg-[#1E2532]/70 rounded-lg p-5">
                <h3 class="text-sm font-medium text-[#F5F7FA] mb-4 flex items-center">
                  <i class="fa-solid fa-history text-[#4A5F8B] mr-2"></i>
                  使用记录
                </h3>
                <div class="space-y-4">
                  <template v-for="item in benefitUsage" :key="">
                    <div :key="item.id" class="space-y-1">
                      <div class="flex justify-between items-center">
                        <span class="text-sm text-[#F5F7FA]">{{ item.name }}</span>
                        <span class="text-xs text-[#4A5F8B]">{{ item.used }}/{{ item.total }}</span>
                      </div>
                      <div class="w-full h-1.5 bg-[#4A5F8B]/20 rounded-full overflow-hidden">
                        <div
                          class="h-full bg-[#4A5F8B]"
                          :style="{
                            width: `${(item.used / item.total) * 100}%`,
                          }"
                        ></div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>

              <!--  专属活动  -->
              <div class="bg-[#1E2532]/70 rounded-lg p-5">
                <h3 class="text-sm font-medium text-[#F5F7FA] mb-4 flex items-center">
                  <i class="fa-solid fa-calendar-check text-[#4A5F8B] mr-2"></i>
                  专属活动
                </h3>
                <div class="space-y-4">
                  <template v-for="event in memberEvents" :key="">
                    <div :key="event.id" class="p-3 bg-[#1E2532] rounded-lg">
                      <h4 class="text-sm font-medium text-[#F5F7FA] mb-1">{{ event.name }}</h4>
                      <div class="flex justify-between items-center">
                        <span class="text-xs text-[#B8C6D8]">{{ event.date }}</span>
                        <span class="px-2 py-0.5 bg-[#4A5F8B] text-[#F5F7FA] text-xs rounded-full">
                          {{ event.status }}
                        </span>
                      </div>
                    </div>
                  </template>
                </div>
                <button
                  class="w-full mt-4 py-2 text-center bg-transparent text-[#F5F7FA] rounded-lg font-medium hover:bg-white/10 transition-colors text-sm border border-[#F5F7FA]"
                >
                  查看全部
                </button>
              </div>
            </div>
          </div>

          <!--  互动成长区  -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!--  关注与粉丝  -->
              <div class="bg-[#1E2532] rounded-lg p-5 border border-[#4A5F8B]">
                <h3 class="text-base font-medium text-[#F5F7FA] mb-4">关注与粉丝</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div class="text-center p-4 bg-[#2D3748] rounded-lg">
                    <p class="text-sm text-[#B8C6D8] mb-1">我关注的</p>
                    <p class="text-2xl font-bold text-[#F5F7FA]">{{ mockUserData.stats.following }}</p>
                    <button
                      class="mt-2 w-full py-1 text-center bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-xs"
                    >
                      查看列表
                    </button>
                  </div>
                  <div class="text-center p-4 bg-[#2D3748] rounded-lg">
                    <p class="text-sm text-[#B8C6D8] mb-1">我的粉丝</p>
                    <p class="text-2xl font-bold text-[#F5F7FA]">{{ mockUserData.stats.followers }}</p>
                    <button
                      class="mt-2 w-full py-1 text-center bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-xs"
                    >
                      查看列表
                    </button>
                  </div>
                </div>
              </div>

              <!--  成长任务  -->
              <div class="bg-[#1E2532] rounded-lg p-5 border border-[#4A5F8B]">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-base font-medium text-[#F5F7FA]">成长任务</h3>
                  <Link to="/profile-center/benefits" class="text-xs text-[#4A5F8B] hover:text-[#6B7C93]">
                    查看全部
                  </Link>
                </div>
                <div class="space-y-4">
                  <template v-for="task in growthTasks" :key="">
                    <div :key="task.id">
                      <div class="flex justify-between items-center mb-1">
                        <span class="text-sm text-[#B8C6D8]">{{ task.name }}</span>
                        <span class="text-xs text-[#4A5F8B]">{{ task.progress }}/{{ task.total }}</span>
                      </div>
                      <div class="w-full h-1.5 bg-[#4A5F8B]/20 rounded-full overflow-hidden mb-1">
                        <div
                          class="h-full bg-[#4A5F8B]"
                          :style="{
                            width: `${(task.progress / task.total) * 100}%`,
                          }"
                        ></div>
                      </div>
                      <p class="text-xs text-[#B8C6D8]">奖励: {{ task.reward }}</p>
                    </div>
                  </template>
                </div>
                <button
                  class="w-full mt-4 py-2 text-center bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-sm"
                >
                  <i class="fa-solid fa-rocket mr-1"></i> 加速升级
                </button>
              </div>
            </div>
          </div>
        </div>

        <!--  侧边功能列表（占据1/4宽度）  -->
        <div class="lg:col-span-1">
          <div class="bg-[#2D3748] rounded-xl p-4 shadow-sm border border-[#4A5F8B] sticky top-24">
            <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">功能导航</h3>
            <div class="space-y-1">
              <template v-for="item in sidebarItems" :key="">
                <Link
                  :key="item.id"
                  :to="
                    item.id === '作品集'
                      ? '/profile-center/works'
                      : item.id === '拍摄地点'
                      ? '/profile-center/photo-locations'
                      : item.id === '器材库'
                      ? '/profile-center/equipment'
                      : item.id === '素材库'
                      ? '/profile-center/materials'
                      : item.id === '我的活动'
                      ? '/profile-center/events'
                      : item.id === '后期工具'
                      ? '/profile-center/editor'
                      : item.id === '会员中心'
                      ? '/profile-center/membership'
                      : item.id === '我的订单'
                      ? '/profile-center/orders'
                      : item.id === '成长福利'
                      ? '/profile-center/benefits'
                      : item.id === '设置'
                      ? '/profile-center/settings'
                      : '/profile-center'
                  "
                  :class="`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                    activeSidebarItem === item.id ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'text-[#B8C6D8] hover:bg-[#1E2532]'
                  }`"
                >
                  <i :class="`fa-solid ${item.icon} mr-3`"></i>
                  <span>{{ item.text }}</span>
                </Link>
              </template>
            </div>

            <!--  会员卡片  -->
            <div class="mt-6 bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-lg p-4">
              <div class="flex items-center mb-3">
                <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <i class="fa-solid fa-crown text-[#F5F7FA]"></i>
                </div>
                <div>
                  <h4 class="font-medium text-[#F5F7FA]">{{ mockUserData.memberStatus }}</h4>
                  <p class="text-xs text-[#F5F7FA]/80">剩余{{ mockUserData.memberDaysLeft }}天</p>
                </div>
              </div>
              <div class="flex space-x-2">
                <button
                  class="flex-1 py-1.5 text-center bg-transparent text-[#F5F7FA] rounded-lg font-medium hover:bg-white/10 transition-colors text-xs border border-[#F5F7FA]"
                >
                  续费
                </button>
                <button
                  class="flex-1 py-1.5 text-center bg-[#F5F7FA] text-[#4A5F8B] rounded-lg font-medium hover:bg-white transition-colors text-xs"
                >
                  升级
                </button>
              </div>
            </div>

            <!--  快速入口  -->
            <div class="mt-6">
              <h3 class="text-base font-medium text-[#F5F7FA] mb-3">快速入口</h3>
              <div class="grid grid-cols-2 gap-3">
                <Link
                  to="/photography-contests"
                  class="flex flex-col items-center p-3 bg-[#1E2532] rounded-lg border border-[#4A5F8B] hover:bg-[#2D3748] transition-colors"
                >
                  <div
                    class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mb-2"
                  >
                    <i class="fa-solid fa-trophy"></i>
                  </div>
                  <span class="text-xs text-[#B8C6D8]">摄影赛事</span>
                </Link>
                <Link
                  to="/equipment-trade"
                  class="flex flex-col items-center p-3 bg-[#1E2532] rounded-lg border border-[#4A5F8B] hover:bg-[#2D3748] transition-colors"
                >
                  <div
                    class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mb-2"
                  >
                    <i class="fa-solid fa-exchange-alt"></i>
                  </div>
                  <span class="text-xs text-[#B8C6D8]">器材交易</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>

    <!--  移动端优化：底部导航栏  -->
    <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-[#2D3748] border-t border-[#4A5F8B] z-40">
      <div class="grid grid-cols-4 py-2">
        <template v-for="item in sidebarItems.slice(0, 4)" :key="">
          <Link
            :key="item.id"
            :to="
              item.id === '作品集'
                ? '/profile-center/works'
                : item.id === '拍摄地点'
                ? '/profile-center/photo-locations'
                : item.id === '素材库'
                ? '/profile-center/materials'
                : item.id === '我的活动'
                ? '/profile-center/events'
                : item.id === '后期工具'
                ? '/profile-center/editor'
                : '/profile-center'
            "
            :class="`flex flex-col items-center justify-center py-1 ${
              activeSidebarItem === item.id ? 'text-[#4A5F8B]' : 'text-[#B8C6D8]'
            }`"
          >
            <i :class="`fa-solid ${item.icon} text-lg mb-1`"></i>
            <span class="text-xs">{{ item.text }}</span>
          </Link>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, watchEffect } from 'vue';
  import { Link } from 'react-router-dom';
  import { motion } from 'framer-motion';
  import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
  import { AuthContext } from '../contexts/authContext';
  const recentActivities = [
    { id: 1, text: '3天前发布作品《城市剪影》，获赞23次', type: 'post' },
    { id: 2, text: '1周前获得新粉丝5人', type: 'follower' },
    { id: 3, text: '2周前完成新手任务《发布第一张作品》', type: 'task' },
    { id: 4, text: '3周前作品《森林晨雾》被推荐到首页', type: 'featured' },
    { id: 5, text: '1个月前参加摄影比赛《城市风光》', type: 'contest' },
  ];
  const recentWorks = [
    {
      id: 1,
      title: '城市剪影',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=city%20skyline%20silhouette%20sunset%20urban%20architecture%20modern&sign=8de72287cf83cda70c057b89bfc1d186',
    },
    {
      id: 2,
      title: '森林晨雾',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=forest%20morning%20mist%20sunlight%20rays%20trees%20mystical&sign=0d866462637658cb7796789831e1cc68',
    },
    {
      id: 3,
      title: '湖畔日落',
      image:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=lake%20sunset%20reflection%20mountains%20evening%20colorful%20sky&sign=c039f18a4bf0746344422a50690ffb6c',
    },
  ];
  const recentEquipment = [
    { id: 1, name: '索尼 A7R IV', type: 'camera' },
    { id: 2, name: '佳能 EF 24-70mm f/2.8L', type: 'lens' },
    { id: 3, name: 'DJI Mavic 3', type: 'drone' },
  ];
  const recentCourses = [
    { id: 1, name: '风光摄影进阶', progress: 65 },
    { id: 2, name: '后期修图技巧', progress: 32 },
    { id: 3, name: '人像摄影实战', progress: 0 },
  ];
  const benefitUsage = [
    { id: 1, name: 'RAW素材下载', used: 3, total: 10 },
    { id: 2, name: '预设使用', used: 5, total: 10 },
    { id: 3, name: '课程学习', used: 2, total: 2 },
  ];
  const memberEvents = [
    { id: 1, name: '银河会员专属摄影沙龙·上海站', date: '2023-11-15', status: '报名中' },
    { id: 2, name: '后期修图大师直播课', date: '2023-11-10', status: '即将开始' },
  ];
  const growthTasks = [
    { id: 1, name: '发布3个作品', progress: 1, total: 3, reward: '升级LV4' },
    { id: 2, name: '获得50个赞', progress: 23, total: 50, reward: '解锁滤镜包' },
    { id: 3, name: '收藏10个作品', progress: 8, total: 10, reward: '成长值+20' },
  ];
  const trendData = [
    { month: '8月', posts: 2, likes: 56, collections: 12 },
    { month: '9月', posts: 4, likes: 89, collections: 23 },
    { month: '10月', posts: 6, likes: 91, collections: 13 },
  ];
  const { isAuthenticated, user } = useContext(AuthContext);
  const state = reactive({
    activeSidebarItem: '',
  });
  // 根据当前路由设置激活的侧边栏项
  watchEffect(() => {
    const path = window.location.pathname;

    if (path.includes('/profile-center/works')) {
      state.activeSidebarItem = '作品集';
    } else if (path.includes('/profile-center/materials')) {
      state.activeSidebarItem = '素材库';
    } else if (path.includes('/profile-center/events')) {
      state.activeSidebarItem = '我的活动';
    } else if (path.includes('/profile-center/editor')) {
      state.activeSidebarItem = '后期工具';
    } else if (path.includes('/profile-center/membership')) {
      state.activeSidebarItem = '会员中心';
    } else if (path.includes('/profile-center/orders')) {
      state.activeSidebarItem = '我的订单';
    } else if (path.includes('/profile-center/benefits')) {
      state.activeSidebarItem = '成长福利';
    } else if (path.includes('/profile-center/settings')) {
      state.activeSidebarItem = '设置';
    } else {
      state.activeSidebarItem = '';
    }
  }); // 模拟用户数据
  // 模拟用户数据
  const mockUserData = {
    username: '@光影捕手',
    tags: '风光/人像双题材创作者',
    level: '新锐摄影师',
    levelNum: 3,
    progress: 120,
    progressMax: 200,
    memberStatus: '银河会员·年卡',
    memberDaysLeft: 128,
    avatar:
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc',
    stats: {
      posts: 12,
      newPosts: 2,
      likes: 236,
      newLikes: 45,
      collections: 48,
      newCollections: 8,
      followers: 72,
      following: 35,
    },
  }; // 侧边栏功能列表
  // 侧边栏功能列表
  const sidebarItems = [
    {
      id: '作品集',
      icon: 'fa-camera',
      text: '我的作品集',
    },
    {
      id: '拍摄地点',
      icon: 'fa-map-marker-alt',
      text: '我的拍摄地点',
    },
    {
      id: '器材库',
      icon: 'fa-video',
      text: '我的器材库',
    },
    {
      id: '素材库',
      icon: 'fa-microchip',
      text: '我的素材库',
    },
    {
      id: '我的活动',
      icon: 'fa-flag',
      text: '我的活动',
    },
    {
      id: '后期工具',
      icon: 'fa-palette',
      text: '后期工具',
    },
    {
      id: '会员中心',
      icon: 'fa-crown',
      text: '会员中心',
    },
    {
      id: '我的订单',
      icon: 'fa-shopping-cart',
      text: '我的订单',
    },
    {
      id: '成长福利',
      icon: 'fa-award',
      text: '成长福利',
    },
    {
      id: '设置',
      icon: 'fa-cog',
      text: '设置',
    },
  ]; // 会员权益
  // 会员权益
  const memberBenefits = [
    {
      id: 1,
      name: '免费RAW素材',
      count: 10,
    },
    {
      id: 2,
      name: '赛事优先报名',
      count: null,
    },
    {
      id: 3,
      name: '专属后期预设包',
      count: null,
    },
    {
      id: 4,
      name: '作品优先推荐',
      count: null,
    },
  ];
</script>

<style lang="less" scoped src="./index.less"></style>
