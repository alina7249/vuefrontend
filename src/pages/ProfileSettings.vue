<template>
  <div v-if="!isAuthenticated" class="container mx-auto px-4 py-8 bg-[#1E2A3A] min-h-screen">
    <div class="flex flex-col items-center justify-center h-[60vh] text-center">
      <div class="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
        <i class="fa-solid fa-user-lock text-2xl"></i>
      </div>
      <h2 class="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
      <p class="text-[#B8C6D8] mb-6 max-w-md">登录后管理您的账号设置和隐私偏好</p>
      <router-link
        to="/login"
        class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors"
      >
        立即登录
      </router-link>
    </div>
  </div>
  
  <div v-else class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div
      v-motion="{ initial: { opacity: 0, y: 20 }, enter: { opacity: 1, y: 0 }, transition: { duration: 0.5 } }"
    >
      <!-- 返回按钮 -->
      <div class="mb-6">
        <router-link
          to="/profile-center"
          class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
        >
          <i class="fa-solid fa-arrow-left"></i>
          <span>返回个人中心</span>
        </router-link>
      </div>

      <!-- 页面标题 -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">账号设置</h1>
        <p class="text-[#B8C6D8] max-w-2xl mx-auto">
          管理您的账号信息、隐私设置和通知偏好
        </p>
      </div>

      <!-- 标签页导航 -->
      <div class="bg-[#2D3748] rounded-xl p-1 mb-8 flex flex-wrap">
        <button
          @click="activeTab = 'account'"
          :class="`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${
            activeTab === 'account'
              ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium'
              : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
          }`"
        >
          账号信息
        </button>
        <button
          @click="activeTab = 'privacy'"
          :class="`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${
            activeTab === 'privacy'
              ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium'
              : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
          }`"
        >
          隐私设置
        </button>
        <button
          @click="activeTab = 'preferences'"
          :class="`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${
            activeTab === 'preferences'
              ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium'
              : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
          }`"
        >
          偏好设置
        </button>
        <button
          @click="activeTab = 'security'"
          :class="`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${
            activeTab === 'security'
              ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium'
              : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
          }`"
        >
          安全设置
        </button>
      </div>

      <!-- 保存成功提示 -->
      <div
        v-if="showSuccessToast"
        v-motion="{ initial: { opacity: 0, y: -20 }, enter: { opacity: 1, y: 0 }, leave: { opacity: 0, y: -20 } }"
        class="fixed top-4 right-4 bg-[#4A5F8B] text-[#F5F7FA] px-4 py-3 rounded-lg shadow-lg z-50 flex items-center"
      >
        <i class="fa-solid fa-check-circle mr-2"></i>
        <span>保存成功！</span>
      </div>

      <!-- 内容区域 -->
      <div v-if="activeTab === 'account'">
        <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-[#F5F7FA]">个人信息</h3>
            <button 
              @click="isEditing = !isEditing"
              class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] mt-3 md:mt-0"
            >
              {{ isEditing ? '取消' : '编辑' }}
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- 左侧 - 头像和封面 -->
            <div>
              <h4 class="text-sm font-medium text-[#F5F7FA] mb-4">头像设置</h4>
              <div class="flex flex-col items-center mb-8">
                <div class="relative mb-4">
                  <div class="w-32 h-32 rounded-full border-4 border-[#B8C6D8] overflow-hidden shadow-md">
                    <img
                      :src="formData.avatar"
                      alt="User avatar"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div v-if="isEditing" class="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#4A5F8B] text-[#F5F7FA] flex items-center justify-center cursor-pointer hover:bg-[#6B7C93] transition-colors">
                    <i class="fa-solid fa-camera"></i>
                  </div>
                </div>
                <button v-if="isEditing" class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] text-sm">
                  更换头像
                </button>
              </div>

              <h4 class="text-sm font-medium text-[#F5F7FA] mb-4">封面设置</h4>
              <div class="relative mb-4">
                <div class="h-40 rounded-lg overflow-hidden border-2 border-[#B8C6D8]">
                  <img
                    :src="formData.coverImage"
                    alt="Cover image"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div v-if="isEditing" class="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#4A5F8B] text-[#F5F7FA] flex items-center justify-center cursor-pointer hover:bg-[#6B7C93] transition-colors">
                  <i class="fa-solid fa-camera"></i>
                </div>
              </div>
              <button v-if="isEditing" class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] text-sm">
                更换封面
              </button>
            </div>

            <!-- 右侧 - 基本信息 -->
            <div class="space-y-6">
              <div>
                <label for="username" class="block text-sm font-medium text-[#F5F7FA] mb-1">用户名</label>
                <input
                  type="text"
                  id="username"
                  :value="formData.username"
                  @input="(e) => handleInputChange('username', (e.target as HTMLInputElement).value)"
                  :disabled="!isEditing"
                  :class="`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all ${!isEditing ? 'cursor-not-allowed' : ''}`"
                />
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-[#F5F7FA] mb-1">电子邮箱</label>
                <input
                  type="email"
                  id="email"
                  :value="formData.email"
                  @input="(e) => handleInputChange('email', (e.target as HTMLInputElement).value)"
                  :disabled="!isEditing"
                  :class="`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all ${!isEditing ? 'cursor-not-allowed' : ''}`"
                />
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-[#F5F7FA] mb-1">手机号码</label>
                <input
                  type="tel"
                  id="phone"
                  :value="formData.phone"
                  @input="(e) => handleInputChange('phone', (e.target as HTMLInputElement).value)"
                  :disabled="!isEditing"
                  :class="`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all ${!isEditing ? 'cursor-not-allowed' : ''}`"
                />
              </div>

              <div>
                <label for="bio" class="block text-sm font-medium text-[#F5F7FA] mb-1">个人简介</label>
                <textarea
                  id="bio"
                  :value="formData.bio"
                  @input="(e) => handleInputChange('bio', (e.target as HTMLTextAreaElement).value)"
                  :disabled="!isEditing"
                  rows="3"
                  :class="`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all resize-none ${!isEditing ? 'cursor-not-allowed' : ''}`"
                />
              </div>

              <div>
                <label for="location" class="block text-sm font-medium text-[#F5F7FA] mb-1">所在地区</label>
                <input
                  type="text"
                  id="location"
                  :value="formData.location"
                  @input="(e) => handleInputChange('location', (e.target as HTMLInputElement).value)"
                  :disabled="!isEditing"
                  :class="`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all ${!isEditing ? 'cursor-not-allowed' : ''}`"
                />
              </div>

              <div>
                <label for="website" class="block text-sm font-medium text-[#F5F7FA] mb-1">个人网站</label>
                <input
                  type="url"
                  id="website"
                  :value="formData.website"
                  @input="(e) => handleInputChange('website', (e.target as HTMLInputElement).value)"
                  :disabled="!isEditing"
                  :class="`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all ${!isEditing ? 'cursor-not-allowed' : ''}`"
                />
              </div>

              <div v-if="isEditing" class="flex justify-end mt-4">
                <button 
                  @click="handleSaveAccount"
                  class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
                >
                  保存更改
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 隐私设置标签页 -->
      <div v-if="activeTab === 'privacy'">
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
                      :checked="privacySettings.profileVisible"
                      @change="(e) => handlePrivacyChange('profileVisible', (e.target as HTMLInputElement).checked)"
                    />
                    <div class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
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
                      :checked="privacySettings.photosPublic"
                      @change="(e) => handlePrivacyChange('photosPublic', (e.target as HTMLInputElement).checked)"
                    />
                    <div class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
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
                      :checked="privacySettings.allowComments"
                      @change="(e) => handlePrivacyChange('allowComments', (e.target as HTMLInputElement).checked)"
                    />
                    <div class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
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
                      :checked="privacySettings.allowFollowing"
                      @change="(e) => handlePrivacyChange('allowFollowing', (e.target as HTMLInputElement).checked)"
                    />
                    <div class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
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
                      :checked="privacySettings.showLocation"
                      @change="(e) => handlePrivacyChange('showLocation', (e.target as HTMLInputElement).checked)"
                    />
                    <div class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
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
                      :checked="privacySettings.showEmail"
                      @change="(e) => handlePrivacyChange('showEmail', (e.target as HTMLInputElement).checked)"
                    />
                    <div class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
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
                      :checked="privacySettings.showPhone"
                      @change="(e) => handlePrivacyChange('showPhone', (e.target as HTMLInputElement).checked)"
                    />
                    <div class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
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
      </div>

      <!-- 偏好设置标签页 -->
      <div v-if="activeTab === 'preferences'">
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
                    :value="preferences.theme"
                    @change="(e) => handlePreferencesChange('theme', (e.target as HTMLSelectElement).value)"
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
                    :value="preferences.language"
                    @change="(e) => handlePreferencesChange('language', (e.target as HTMLSelectElement).value)"
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
                    :value="preferences.defaultTab"
                    @change="(e) => handlePreferencesChange('defaultTab', (e.target as HTMLSelectElement).value)"
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
                      :checked="preferences.notifications.newFollower"
                      @change="(e) => handleNotificationChange('newFollower', (e.target as HTMLInputElement).checked)"
                    />
                    <div class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
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
                      :checked="preferences.notifications.newLike"
                      @change="(e) => handleNotificationChange('newLike', (e.target as HTMLInputElement).checked)"
                    />
                    <div class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
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
                      :checked="preferences.notifications.newComment"
                      @change="(e) => handleNotificationChange('newComment', (e.target as HTMLInputElement).checked)"
                    />
                    <div class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
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
                      :checked="preferences.notifications.newMessage"
                      @change="(e) => handleNotificationChange('newMessage', (e.target as HTMLInputElement).checked)"
                    />
                    <div class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
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
                      :checked="preferences.notifications.systemUpdates"
                      @change="(e) => handleNotificationChange('systemUpdates', (e.target as HTMLInputElement).checked)"
                    />
                    <div class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
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
                      :checked="preferences.notifications.activityReminders"
                      @change="(e) => handleNotificationChange('activityReminders', (e.target as HTMLInputElement).checked)"
                    />
                    <div class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
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
                      :checked="preferences.emailNotifications.weeklyDigest"
                      @change="(e) => handleEmailNotificationChange('weeklyDigest', (e.target as HTMLInputElement).checked)"
                    />
                    <div class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
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
                      :checked="preferences.emailNotifications.eventReminders"
                      @change="(e) => handleEmailNotificationChange('eventReminders', (e.target as HTMLInputElement).checked)"
                    />
                    <div class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
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
                      :checked="preferences.emailNotifications.promotionalOffers"
                      @change="(e) => handleEmailNotificationChange('promotionalOffers', (e.target as HTMLInputElement).checked)"
                    />
                    <div class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 安全设置标签页 -->
      <div v-if="activeTab === 'security'">
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
                  <button class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] text-sm"
                    @click="showPasswordModal = true">
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
                      :checked="securitySettings.twoFactorEnabled"
                      @change="(e) => handleSecurityChange('twoFactorEnabled', (e.target as HTMLInputElement).checked)"
                    />
                    <div class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">绑定手机</label>
                    <p class="text-xs text-[#B8C6D8]">绑定手机可以用于账号恢复和安全验证</p>
                  </div>
                  <button class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] text-sm">
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
              <button class="px-4 py-2 bg-[#6B7C93] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#F56565] hover:text-[#F5F7FA] transition-colors text-sm">
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
          
          <!-- 修改密码弹窗 -->
          <div
            v-if="showPasswordModal"
            v-motion="{ initial: { opacity: 0 }, enter: { opacity: 1 } }"
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div class="bg-[#2D3748] rounded-xl p-6 max-w-md w-full border border-[#4A5F8B]">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold text-[#F5F7FA]">修改密码</h3>
                <button 
                  @click="closePasswordModal"
                  class="text-[#F5F7FA] hover:text-[#4A5F8B]"
                >
                  <i class="fa-solid fa-times"></i>
                </button>
              </div>
              
              <div class="space-y-4 mb-4">
                <div>
                  <label for="currentPassword" class="block text-sm font-medium text-[#F5F7FA] mb-1">当前密码</label>
                  <input
                    type="password"
                    id="currentPassword"
                    v-model="currentPassword"
                    class="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                  />
                </div>
                
                <div>
                  <label for="newPassword" class="block text-sm font-medium text-[#F5F7FA] mb-1">新密码</label>
                  <input
                    type="password"
                    id="newPassword"
                    v-model="newPassword"
                    class="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                  />
                </div>
                
                <div>
                  <label for="confirmPassword" class="block text-sm font-medium text-[#F5F7FA] mb-1">确认新密码</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    v-model="confirmPassword"
                    class="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                  />
                </div>
              </div>
              
              <div class="flex space-x-3">
                <button 
                  @click="closePasswordModal"
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 用户认证状态（模拟）
const isAuthenticated = ref(true)
const user = ref({
  username: '@光影捕手',
  email: 'photographer@example.com',
  avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc'
})

const router = useRouter()

// 响应式状态
const activeTab = ref('account')
const isEditing = ref(false)
const showSuccessToast = ref(false)
const showPasswordModal = ref(false)

// 表单数据
const formData = reactive({
  username: user.value.username || '@光影捕手',
  email: user.value.email || 'photographer@example.com',
  phone: '138****6789',
  bio: '热爱风光和人像摄影，正在不断学习和进步中',
  location: '上海',
  website: 'https://photographer.example.com',
  avatar: user.value.avatar || 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc',
  coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=photography%20studio%20background%20professional&sign=47d4a7099d77fa3997b410d6959c5bc6'
})

// 隐私设置
const privacySettings = reactive({
  profileVisible: true,
  photosPublic: true,
  allowComments: true,
  allowFollowing: true,
  showLocation: true,
  showEmail: false,
  showPhone: false
})

// 偏好设置
const preferences = reactive({
  theme: 'dark',
  language: 'zh-CN',
  defaultTab: 'feed',
  notifications: {
    newFollower: true,
    newLike: true,
    newComment: true,
    newMessage: true,
    systemUpdates: true,
    activityReminders: true
  },
  emailNotifications: {
    weeklyDigest: true,
    eventReminders: true,
    promotionalOffers: false
  }
})

// 安全设置
const securitySettings = reactive({
  twoFactorEnabled: false,
  lastLogin: '2023-10-25 14:30:22',
  lastIp: '192.168.1.1'
})

// 密码修改相关
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// 监听用户数据变化
watch(user, (newUser) => {
  if (newUser) {
    formData.username = newUser.username || formData.username
    formData.email = newUser.email || formData.email
    formData.avatar = newUser.avatar || formData.avatar
  }
}, { immediate: true })

// 处理表单输入变化
const handleInputChange = (field: string, value: string) => {
  ;(formData as any)[field] = value
}

// 处理隐私设置变化
const handlePrivacyChange = (field: string, value: boolean) => {
  ;(privacySettings as any)[field] = value
}

// 处理偏好设置变化
const handlePreferencesChange = (field: string, value: string) => {
  ;(preferences as any)[field] = value
}

// 处理通知设置变化
const handleNotificationChange = (field: string, value: boolean) => {
  ;(preferences.notifications as any)[field] = value
}

// 处理邮件通知设置变化
const handleEmailNotificationChange = (field: string, value: boolean) => {
  ;(preferences.emailNotifications as any)[field] = value
}

// 处理安全设置变化
const handleSecurityChange = (field: string, value: boolean) => {
  ;(securitySettings as any)[field] = value
}

// 保存账户设置
const handleSaveAccount = () => {
  isEditing.value = false
  showSuccessToast.value = true
  
  setTimeout(() => {
    showSuccessToast.value = false
    
    // 更新用户数据
    if (user.value) {
      user.value.username = formData.username
      user.value.email = formData.email
      user.value.avatar = formData.avatar
    }
  }, 1500)
}

// 保存其他设置
const handleSaveSettings = () => {
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 1500)
}

// 处理密码修改
const handleChangePassword = () => {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    alert('请填写所有密码字段')
    return
  }
  
  if (newPassword.value !== confirmPassword.value) {
    alert('新密码与确认密码不匹配')
    return
  }
  
  // 模拟密码修改成功
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  showPasswordModal.value = false
  showSuccessToast.value = true
  
  setTimeout(() => {
    showSuccessToast.value = false
  }, 1500)
}

// 关闭密码修改弹窗
const closePasswordModal = () => {
  showPasswordModal.value = false
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

// 处理登出
const handleLogout = () => {
  isAuthenticated.value = false
  router.push('/login')
}

onMounted(() => {
  // 组件挂载后的初始化逻辑
})
</script>

<style scoped>
/* 样式保持不变，直接使用Tailwind CSS类 */
</style>
