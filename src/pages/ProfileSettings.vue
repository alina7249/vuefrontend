<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2A3A] min-h-screen">
    <div class="flex flex-col items-center justify-center h-[60vh] text-center">
      <div class="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
        <i class="fa-solid fa-user-lock text-2xl"></i>
      </div>
      <h2 class="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
      <p class="text-[#B8C6D8] mb-6 max-w-md">登录后管理您的账号设置和隐私偏好</p>
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
        <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">账号设置</h1>
        <p class="text-[#B8C6D8] max-w-2xl mx-auto">
          管理您的账号信息、隐私设置和通知偏好
        </p>
      </div>

      <!--  标签页导航 - 未选中：深灰蓝 #2D3748 + 浅冷灰 #B8C6D8；选中：浅蓝灰 #4A5F8B + 浅白 #F5F7FA  -->
      <div class="bg-[#2D3748] rounded-xl p-1 mb-8 flex flex-wrap">
        <button
          @click="() => (state.activeTab = 'account')"
          :class="`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${
            activeTab === 'account'
              ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium'
              : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
          }`"
        >
          账号信息
        </button>
        <button
          @click="() => (state.activeTab = 'privacy')"
          :class="`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${
            activeTab === 'privacy'
              ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium'
              : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
          }`"
        >
          隐私设置
        </button>
        <button
          @click="() => (state.activeTab = 'preferences')"
          :class="`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${
            activeTab === 'preferences'
              ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium'
              : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
          }`"
        >
          偏好设置
        </button>
        <button
          @click="() => (state.activeTab = 'security')"
          :class="`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${
            activeTab === 'security'
              ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium'
              : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
          }`"
        >
          安全设置
        </button>
      </div>

      <!--  保存成功提示  -->

      <template v-if="showSuccessToast">
        <motion.div
          :initial="{
            opacity: 0,
            y: -20,
          }"
          :animate="{
            opacity: 1,
            y: 0,
          }"
          :exit="{
            opacity: 0,
            y: -20,
          }"
          class="fixed top-4 right-4 bg-[#4A5F8B] text-[#F5F7FA] px-4 py-3 rounded-lg shadow-lg z-50 flex items-center"
        >
          <i class="fa-solid fa-check-circle mr-2"></i>
          <span>保存成功！</span>
        </motion.div>
      </template>

      <!--  内容区域  -->

      <template v-if="activeTab === 'account'">
        <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-[#F5F7FA]">个人信息</h3>
            <button
              @click="() => (state.isEditing = !isEditing)"
              class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] mt-3 md:mt-0"
            >
              {{ isEditing ? '取消' : '编辑' }}
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!--  左侧 - 头像和封面  -->
            <div>
              <h4 class="text-sm font-medium text-[#F5F7FA] mb-4">头像设置</h4>
              <div class="flex flex-col items-center mb-8">
                <div class="relative mb-4">
                  <div class="w-32 h-32 rounded-full border-4 border-[#B8C6D8] overflow-hidden shadow-md">
                    <img :src="formData.avatar" alt="User avatar" class="w-full h-full object-cover" />
                  </div>

                  <template v-if="isEditing">
                    <div
                      class="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#4A5F8B] text-[#F5F7FA] flex items-center justify-center cursor-pointer hover:bg-[#6B7C93] transition-colors"
                    >
                      <i class="fa-solid fa-camera"></i>
                    </div>
                  </template>
                </div>

                <template v-if="isEditing">
                  <button
                    class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] text-sm"
                  >
                    更换头像
                  </button>
                </template>
              </div>

              <h4 class="text-sm font-medium text-[#F5F7FA] mb-4">封面设置</h4>
              <div class="relative mb-4">
                <div class="h-40 rounded-lg overflow-hidden border-2 border-[#B8C6D8]">
                  <img :src="formData.coverImage" alt="Cover image" class="w-full h-full object-cover" />
                </div>

                <template v-if="isEditing">
                  <div
                    class="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#4A5F8B] text-[#F5F7FA] flex items-center justify-center cursor-pointer hover:bg-[#6B7C93] transition-colors"
                  >
                    <i class="fa-solid fa-camera"></i>
                  </div>
                </template>
              </div>

              <template v-if="isEditing">
                <button
                  class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] text-sm"
                >
                  更换封面
                </button>
              </template>
            </div>

            <!--  右侧 - 基本信息  -->
            <div class="space-y-6">
              <div>
                <label htmlFor="username" class="block text-sm font-medium text-[#F5F7FA] mb-1">用户名</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  :value="formData.username"
                  @change="handleInputChange"
                  :disabled="!isEditing"
                  :class="`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all ${
                    !isEditing ? 'cursor-not-allowed' : ''
                  }`"
                />
              </div>

              <div>
                <label htmlFor="email" class="block text-sm font-medium text-[#F5F7FA] mb-1">电子邮箱</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  :value="formData.email"
                  @change="handleInputChange"
                  :disabled="!isEditing"
                  :class="`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all ${
                    !isEditing ? 'cursor-not-allowed' : ''
                  }`"
                />
              </div>

              <div>
                <label htmlFor="phone" class="block text-sm font-medium text-[#F5F7FA] mb-1">手机号码</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  :value="formData.phone"
                  @change="handleInputChange"
                  :disabled="!isEditing"
                  :class="`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all ${
                    !isEditing ? 'cursor-not-allowed' : ''
                  }`"
                />
              </div>

              <div>
                <label htmlFor="bio" class="block text-sm font-medium text-[#F5F7FA] mb-1">个人简介</label>
                <textarea
                  id="bio"
                  name="bio"
                  :value="formData.bio"
                  @change="handleInputChange"
                  :disabled="!isEditing"
                  :rows="3"
                  :class="`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all resize-none ${
                    !isEditing ? 'cursor-not-allowed' : ''
                  }`"
                />
              </div>

              <div>
                <label htmlFor="location" class="block text-sm font-medium text-[#F5F7FA] mb-1">所在地区</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  :value="formData.location"
                  @change="handleInputChange"
                  :disabled="!isEditing"
                  :class="`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all ${
                    !isEditing ? 'cursor-not-allowed' : ''
                  }`"
                />
              </div>

              <div>
                <label htmlFor="website" class="block text-sm font-medium text-[#F5F7FA] mb-1">个人网站</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  :value="formData.website"
                  @change="handleInputChange"
                  :disabled="!isEditing"
                  :class="`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all ${
                    !isEditing ? 'cursor-not-allowed' : ''
                  }`"
                />
              </div>

              <template v-if="isEditing">
                <div class="flex justify-end mt-4">
                  <button
                    @click="handleSaveAccount"
                    class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
                  >
                    保存更改
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>

      <template v-if="activeTab === 'privacy'">
        <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-[#F5F7FA]">隐私设置</h3>
            <button
              @click="handleSaveSettings"
              class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
            >
              保存设置
            </button>
          </div>

          <div class="space-y-6">
            <div class="p-4 bg-[#1E2532] rounded-lg">
              <h4 class="font-medium text-[#F5F7FA] mb-4">个人资料可见性</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">允许他人查看我的个人资料</label>
                    <p class="text-xs text-[#B8C6D8]">关闭后，其他用户将无法找到和查看您的个人主页</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      name="profileVisible"
                      :checked="privacySettings.profileVisible"
                      @change="handlePrivacyChange"
                    />
                    <div
                      class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"
                    ></div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">作品公开可见</label>
                    <p class="text-xs text-[#B8C6D8]">关闭后，只有您关注的用户可以查看您的作品</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      name="photosPublic"
                      :checked="privacySettings.photosPublic"
                      @change="handlePrivacyChange"
                    />
                    <div
                      class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"
                    ></div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">允许评论我的作品</label>
                    <p class="text-xs text-[#B8C6D8]">关闭后，其他用户将无法对您的作品发表评论</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      name="allowComments"
                      :checked="privacySettings.allowComments"
                      @change="handlePrivacyChange"
                    />
                    <div
                      class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"
                    ></div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">允许他人关注我</label>
                    <p class="text-xs text-[#B8C6D8]">关闭后，其他用户将无法关注您的账号</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      name="allowFollowing"
                      :checked="privacySettings.allowFollowing"
                      @change="handlePrivacyChange"
                    />
                    <div
                      class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div class="p-4 bg-[#1E2532] rounded-lg">
              <h4 class="font-medium text-[#F5F7FA] mb-4">个人信息展示</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">显示我的所在地区</label>
                    <p class="text-xs text-[#B8C6D8]">在个人主页显示您设置的所在地区信息</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      name="showLocation"
                      :checked="privacySettings.showLocation"
                      @change="handlePrivacyChange"
                    />
                    <div
                      class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"
                    ></div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">显示我的电子邮箱</label>
                    <p class="text-xs text-[#B8C6D8]">在个人主页显示您的电子邮箱地址</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      name="showEmail"
                      :checked="privacySettings.showEmail"
                      @change="handlePrivacyChange"
                    />
                    <div
                      class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"
                    ></div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">显示我的手机号码</label>
                    <p class="text-xs text-[#B8C6D8]">在个人主页显示您的手机号码</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      name="showPhone"
                      :checked="privacySettings.showPhone"
                      @change="handlePrivacyChange"
                    />
                    <div
                      class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div class="p-4 bg-[#1E2532] rounded-lg">
              <h4 class="font-medium text-[#F5F7FA] mb-2">隐私提示</h4>
              <p class="text-sm text-[#B8C6D8]">
                保护您的隐私对我们至关重要。请根据您的需求调整上述设置，控制谁可以查看您的个人信息和作品。如果您有任何疑问或需要帮助，请联系我们的客服团队。
              </p>
            </div>
          </div>
        </div>
      </template>

      <template v-if="activeTab === 'preferences'">
        <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-[#F5F7FA]">偏好设置</h3>
            <button
              @click="handleSaveSettings"
              class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
            >
              保存设置
            </button>
          </div>

          <div class="space-y-6">
            <div class="p-4 bg-[#1E2532] rounded-lg">
              <h4 class="font-medium text-[#F5F7FA] mb-4">界面设置</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-[#F5F7FA] mb-1">主题偏好</label>
                  <select
                    name="theme"
                    :value="preferences.theme"
                    @change="handlePreferencesChange"
                    class="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
                  >
                    <option value="dark">深色模式</option>
                    <option value="light">浅色模式</option>
                    <option value="system">跟随系统</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-[#F5F7FA] mb-1">语言</label>
                  <select
                    name="language"
                    :value="preferences.language"
                    @change="handlePreferencesChange"
                    class="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
                  >
                    <option value="zh-CN">简体中文</option>
                    <option value="en-US">English (US)</option>
                    <option value="ja-JP">日本語</option>
                    <option value="ko-KR">한국어</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-[#F5F7FA] mb-1">默认首页</label>
                  <select
                    name="defaultTab"
                    :value="preferences.defaultTab"
                    @change="handlePreferencesChange"
                    class="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
                  >
                    <option value="feed">推荐动态</option>
                    <option value="explore">发现作品</option>
                    <option value="profile">个人主页</option>
                    <option value="community">社区</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="p-4 bg-[#1E2532] rounded-lg">
              <h4 class="font-medium text-[#F5F7FA] mb-4">通知设置</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">新粉丝提醒</label>
                    <p class="text-xs text-[#B8C6D8]">当有新用户关注您时接收通知</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      name="notifications.newFollower"
                      :checked="preferences.notifications.newFollower"
                      @change="handlePreferencesChange"
                    />
                    <div
                      class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"
                    ></div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">新点赞提醒</label>
                    <p class="text-xs text-[#B8C6D8]">当您的作品获得新点赞时接收通知</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      name="notifications.newLike"
                      :checked="preferences.notifications.newLike"
                      @change="handlePreferencesChange"
                    />
                    <div
                      class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"
                    ></div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">新评论提醒</label>
                    <p class="text-xs text-[#B8C6D8]">当您的作品收到新评论时接收通知</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      name="notifications.newComment"
                      :checked="preferences.notifications.newComment"
                      @change="handlePreferencesChange"
                    />
                    <div
                      class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"
                    ></div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">新消息提醒</label>
                    <p class="text-xs text-[#B8C6D8]">当您收到新私信时接收通知</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      name="notifications.newMessage"
                      :checked="preferences.notifications.newMessage"
                      @change="handlePreferencesChange"
                    />
                    <div
                      class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"
                    ></div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">系统更新提醒</label>
                    <p class="text-xs text-[#B8C6D8]">接收平台系统更新和维护通知</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      name="notifications.systemUpdates"
                      :checked="preferences.notifications.systemUpdates"
                      @change="handlePreferencesChange"
                    />
                    <div
                      class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"
                    ></div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">活动提醒</label>
                    <p class="text-xs text-[#B8C6D8]">接收您报名的活动和赛事提醒</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      name="notifications.activityReminders"
                      :checked="preferences.notifications.activityReminders"
                      @change="handlePreferencesChange"
                    />
                    <div
                      class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div class="p-4 bg-[#1E2532] rounded-lg">
              <h4 class="font-medium text-[#F5F7FA] mb-4">邮件通知设置</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">每周精选</label>
                    <p class="text-xs text-[#B8C6D8]">每周发送精选作品和摄影技巧到您的邮箱</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      name="emailNotifications.weeklyDigest"
                      :checked="preferences.emailNotifications.weeklyDigest"
                      @change="handlePreferencesChange"
                    />
                    <div
                      class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"
                    ></div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">活动提醒邮件</label>
                    <p class="text-xs text-[#B8C6D8]">通过邮件接收您报名的活动和赛事提醒</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      name="emailNotifications.eventReminders"
                      :checked="preferences.emailNotifications.eventReminders"
                      @change="handlePreferencesChange"
                    />
                    <div
                      class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"
                    ></div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">优惠促销邮件</label>
                    <p class="text-xs text-[#B8C6D8]">接收平台优惠活动和促销信息</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      name="emailNotifications.promotionalOffers"
                      :checked="preferences.emailNotifications.promotionalOffers"
                      @change="handlePreferencesChange"
                    />
                    <div
                      class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-if="activeTab === 'security'">
        <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-[#F5F7FA]">安全设置</h3>
          </div>

          <div class="space-y-6">
            <div class="p-4 bg-[#1E2532] rounded-lg">
              <h4 class="font-medium text-[#F5F7FA] mb-4">账号安全</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">修改密码</label>
                    <p class="text-xs text-[#B8C6D8]">定期修改密码可以提高账号安全性</p>
                  </div>
                  <button
                    class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] text-sm"
                  >
                    修改
                  </button>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">两步验证</label>
                    <p class="text-xs text-[#B8C6D8]">开启后登录需要额外的验证码确认</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      name="twoFactorEnabled"
                      :checked="securitySettings.twoFactorEnabled"
                      @change="handleSecurityChange"
                    />
                    <div
                      class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"
                    ></div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">绑定手机</label>
                    <p class="text-xs text-[#B8C6D8]">绑定手机可以用于账号恢复和安全验证</p>
                  </div>
                  <button
                    class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] text-sm"
                  >
                    绑定
                  </button>
                </div>
              </div>
            </div>

            <div class="p-4 bg-[#1E2532] rounded-lg">
              <h4 class="font-medium text-[#F5F7FA] mb-4">登录记录</h4>
              <div class="space-y-3">
                <div class="flex justify-between text-sm">
                  <span class="text-[#B8C6D8]">上次登录时间</span>
                  <span class="text-[#F5F7FA]">{{ securitySettings.lastLogin }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-[#B8C6D8]">上次登录IP</span>
                  <span class="text-[#F5F7FA]">{{ securitySettings.lastIp }}</span>
                </div>
                <button class="w-full py-2 text-center text-sm text-[#4A5F8B] hover:underline transition-colors">
                  查看更多登录记录
                </button>
              </div>
            </div>

            <div class="p-4 bg-[#1E2532] rounded-lg">
              <h4 class="font-medium text-[#F5F7FA] mb-2">安全建议</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm text-[#B8C6D8]">
                <li>定期修改密码，使用字母、数字和特殊字符的组合</li>
                <li>开启两步验证，提高账号安全性</li>
                <li>不要在不安全的网络环境下登录账号</li>
                <li>不要将账号密码告诉他人或在其他网站使用相同密码</li>
                <li>如果发现可疑登录，请立即修改密码并联系客服</li>
              </ul>
            </div>

            <div class="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
              <h4 class="font-medium text-[#F5F7FA] mb-2">账号注销</h4>
              <p class="text-sm text-[#B8C6D8] mb-4">
                注销账号后，您的所有数据将被永久删除，此操作无法撤销。
              </p>
              <button
                class="px-4 py-2 bg-[#6B7C93] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#F56565] hover:text-[#F5F7FA] transition-colors text-sm"
              >
                注销账号
              </button>
            </div>

            <div class="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
              <h4 class="font-medium text-[#F5F7FA] mb-2">退出登录</h4>
              <p class="text-sm text-[#B8C6D8] mb-4">
                退出当前账号，需要重新登录才能继续使用。
              </p>
              <button
                @click="handleLogout"
                class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] hover:text-[#F5F7FA] transition-colors text-sm"
              >
                退出登录
              </button>
            </div>
          </div>

          <!--  修改密码弹窗（默认隐藏）  -->

          <template v-if="currentPassword || newPassword || confirmPassword">
            <motion.div
              :initial="{
                opacity: 0,
              }"
              :animate="{
                opacity: 1,
              }"
              class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <div class="bg-[#2D3748] rounded-xl p-6 max-w-md w-full border border-[#4A5F8B]">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-bold text-[#F5F7FA]">修改密码</h3>
                  <button
                    @click="
                      () => {
                        state.currentPassword = '';
                        state.newPassword = '';
                        state.confirmPassword = '';
                      }
                    "
                    class="text-[#F5F7FA] hover:text-[#4A5F8B]"
                  >
                    <i class="fa-solid fa-times"></i>
                  </button>
                </div>

                <div class="space-y-4 mb-4">
                  <div>
                    <label htmlFor="currentPassword" class="block text-sm font-medium text-[#F5F7FA] mb-1"
                      >当前密码</label
                    >
                    <input
                      type="password"
                      id="currentPassword"
                      :value="currentPassword"
                      @change="(e) => (state.currentPassword = e.target.value)"
                      class="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" class="block text-sm font-medium text-[#F5F7FA] mb-1">新密码</label>
                    <input
                      type="password"
                      id="newPassword"
                      :value="newPassword"
                      @change="(e) => (state.newPassword = e.target.value)"
                      class="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" class="block text-sm font-medium text-[#F5F7FA] mb-1"
                      >确认新密码</label
                    >
                    <input
                      type="password"
                      id="confirmPassword"
                      :value="confirmPassword"
                      @change="(e) => (state.confirmPassword = e.target.value)"
                      class="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                    />
                  </div>
                </div>

                <div class="flex space-x-3">
                  <button
                    @click="
                      () => {
                        state.currentPassword = '';
                        state.newPassword = '';
                        state.confirmPassword = '';
                      }
                    "
                    class="flex-1 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] text-sm"
                  >
                    取消
                  </button>
                  <button
                    @click="handleChangePassword"
                    class="flex-1 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-sm"
                  >
                    确认修改
                  </button>
                </div>
              </div>
            </motion.div>
          </template>
          <template v-else> </template>
        </div>
      </template>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, watchEffect } from 'vue';
  import { Link, useNavigate } from 'react-router-dom';
  import { motion } from 'framer-motion';
  import { AuthContext } from '../contexts/authContext';
  const { isAuthenticated, user, logout, setUser } = useContext(AuthContext);
  const state = reactive({
    activeTab: 'account',
    formData: {
      username: user?.username || '@光影捕手',
      email: user?.email || 'photographer@example.com',
      phone: '138****6789',
      bio: '热爱风光和人像摄影，正在不断学习和进步中',
      location: '上海',
      website: 'https://photographer.example.com',
      avatar:
        user?.avatar ||
        'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc',
      coverImage:
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=photography%20studio%20background%20professional&sign=47d4a7099d77fa3997b410d6959c5bc6',
    },
    privacySettings: {
      profileVisible: true,
      photosPublic: true,
      allowComments: true,
      allowFollowing: true,
      showLocation: true,
      showEmail: false,
      showPhone: false,
    },
    preferences: {
      theme: 'dark',
      // dark, light, system
      language: 'zh-CN',
      defaultTab: 'feed',
      notifications: {
        newFollower: true,
        newLike: true,
        newComment: true,
        newMessage: true,
        systemUpdates: true,
        activityReminders: true,
      },
      emailNotifications: {
        weeklyDigest: true,
        eventReminders: true,
        promotionalOffers: false,
      },
    },
    securitySettings: {
      twoFactorEnabled: false,
      lastLogin: '2023-10-25 14:30:22',
      lastIp: '192.168.1.1',
    },
    isEditing: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showSuccessToast: false,
  });
  const navigate = useNavigate(); // 当用户数据变化时更新表单数据
  // 当用户数据变化时更新表单数据
  watchEffect(() => {
    if (user) {
      state.formData = (prev) => ({
        ...prev,
        username: user.username || prev.username,
        email: user.email || prev.email,
        avatar: user.avatar || prev.avatar,
      });
    }
  }); // 处理表单输入变化
  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    state.formData = (prev) => ({ ...prev, [name]: value });
  }; // 处理隐私设置变化
  // 处理隐私设置变化
  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    state.privacySettings = (prev) => ({ ...prev, [name]: checked });
  }; // 处理偏好设置变化
  // 处理偏好设置变化
  const handlePreferencesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target; // 处理通知设置

    if (name.startsWith('notifications.')) {
      const notificationKey = name.split('.')[1];
      state.preferences = (prev) => ({
        ...prev,
        notifications: { ...prev.notifications, [notificationKey]: type === 'checkbox' ? checked : value },
      });
    } else if (name.startsWith('emailNotifications.')) {
      const emailKey = name.split('.')[1];
      state.preferences = (prev) => ({
        ...prev,
        emailNotifications: { ...prev.emailNotifications, [emailKey]: type === 'checkbox' ? checked : value },
      });
    } else {
      // 处理其他偏好设置
      state.preferences = (prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value });
    }
  }; // 处理安全设置变化
  // 处理安全设置变化
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    state.securitySettings = (prev) => ({ ...prev, [name]: checked });
  }; // 保存账户设置
  // 保存账户设置
  const handleSaveAccount = () => {
    // 在实际应用中，这里会调用API保存用户数据
    // 这里我们只是模拟保存成功
    state.isEditing = false;
    state.showSuccessToast = true; // 模拟API调用延迟

    setTimeout(() => {
      state.showSuccessToast = false; // 更新用户上下文

      if (user) {
        setUser({
          ...user,
          username: formData.username,
          email: formData.email,
          bio: formData.bio,
          avatar: formData.avatar,
        });
      }
    }, 1500);
  }; // 保存其他设置
  // 保存其他设置
  const handleSaveSettings = () => {
    // 模拟保存成功
    state.showSuccessToast = true; // 模拟API调用延迟

    setTimeout(() => {
      state.showSuccessToast = false;
    }, 1500);
  }; // 处理密码修改
  // 处理密码修改
  const handleChangePassword = () => {
    // 简单验证
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('请填写所有密码字段');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('新密码与确认密码不匹配');
      return;
    } // 模拟密码修改成功

    state.currentPassword = '';
    state.newPassword = '';
    state.confirmPassword = '';
    state.showSuccessToast = true;
    setTimeout(() => {
      state.showSuccessToast = false;
    }, 1500);
  }; // 处理登出
  // 处理登出
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
</script>

<style lang="less" scoped src="./index.less"></style>
