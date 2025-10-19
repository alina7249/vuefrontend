<template>
  <div class="profile-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <button class="back-button" @click="goBack">
          <span class="back-icon">←</span>
          <span>返回</span>
        </button>
        <h1 class="page-title">个人主页</h1>
        <div v-if="isCurrentUser" class="header-actions">
          <button class="edit-profile-btn" @click="editProfile">
            <span class="btn-icon">✏️</span>
            <span>编辑资料</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 个人信息头部 -->
    <div class="profile-header">
      <!-- 背景图 -->
      <div class="profile-cover">
        <img :src="profileData.coverImage || 'https://picsum.photos/seed/cover/1200/400'" alt="个人主页背景" />
      </div>
      
      <!-- 用户信息 -->
      <div class="profile-info">
        <div class="avatar-container">
          <img :src="profileData.avatar || `https://picsum.photos/seed/${profileData.username}/200/200`" alt="用户头像" class="profile-avatar" />
          <span v-if="profileData.certification" class="certification-badge">
            {{ certificationLabels[profileData.certification] || '认证用户' }}
          </span>
        </div>
        
        <div class="user-details">
          <h1 class="user-name">{{ profileData.username }}</h1>
          <p class="user-bio">{{ profileData.bio || '这个人很懒，什么都没有留下' }}</p>
          <div class="user-meta">
            <span class="meta-item">
              <span class="meta-label">加入时间:</span>
              <span class="meta-value">{{ formatDate(profileData.joinDate) }}</span>
            </span>
            <span v-if="profileData.location" class="meta-item">
              <span class="meta-label">所在地:</span>
              <span class="meta-value">{{ profileData.location }}</span>
            </span>
          </div>
          
          <!-- 统计数据 -->
          <div class="user-stats">
            <div class="stat-item">
              <span class="stat-value">{{ profileData.worksCount || 0 }}</span>
              <span class="stat-label">作品</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ profileData.followersCount || 0 }}</span>
              <span class="stat-label">粉丝</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ profileData.followingCount || 0 }}</span>
              <span class="stat-label">关注</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ profileData.likesCount || 0 }}</span>
              <span class="stat-label">获赞</span>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="profile-actions">
            <template v-if="!isCurrentUser">
              <button 
                class="follow-button" 
                :class="{ following: isFollowing }"
                @click="toggleFollow"
              >
                {{ isFollowing ? '已关注' : '关注' }}
              </button>
              <button class="message-button">
                <span class="btn-icon">💬</span>
                <span>发消息</span>
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容选项卡 -->
    <div class="content-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.value"
        class="tab-button"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="profile-content">
      <!-- 作品列表 -->
      <div v-if="activeTab === 'works'" class="works-grid">
        <div 
          v-for="work in userWorks" 
          :key="work.id"
          class="work-item"
          @click="viewWorkDetail(work.id)"
        >
          <div class="work-image">
            <img :src="work.imageUrl" :alt="work.title" />
          </div>
          <div class="work-info">
            <h3 class="work-title">{{ work.title }}</h3>
            <div class="work-stats">
              <span class="stat">{{ work.likes }} ❤️</span>
              <span class="stat">{{ work.comments }} 💬</span>
            </div>
          </div>
        </div>
        
        <!-- 没有作品提示 -->
        <div v-if="userWorks.length === 0" class="no-works">
          <div class="no-works-icon">📷</div>
          <p class="no-works-text">
            {{ isCurrentUser ? '您还没有发布任何作品' : '该用户还没有发布任何作品' }}
          </p>
          <button v-if="isCurrentUser" class="upload-first-work-btn">上传第一个作品</button>
        </div>
      </div>

      <!-- 收藏列表 -->
      <div v-else-if="activeTab === 'collections'" class="collections-grid">
        <div 
          v-for="collection in userCollections" 
          :key="collection.id"
          class="collection-item"
          @click="viewCollectionDetail(collection.id)"
        >
          <div class="collection-thumbnail">
            <img 
              v-for="(item, index) in collection.items.slice(0, 4)" 
              :key="index"
              :src="item.imageUrl" 
              :alt="item.title" 
              class="thumbnail-image"
              :style="getThumbnailStyle(index, collection.items.length)"
            />
          </div>
          <div class="collection-info">
            <h3 class="collection-title">{{ collection.title }}</h3>
            <p class="collection-count">{{ collection.items.length }} 个作品</p>
          </div>
        </div>
        
        <!-- 没有收藏提示 -->
        <div v-if="userCollections.length === 0" class="no-collections">
          <div class="no-collections-icon">⭐</div>
          <p class="no-collections-text">
            {{ isCurrentUser ? '您还没有收藏任何作品' : '该用户还没有收藏任何作品' }}
          </p>
        </div>
      </div>

      <!-- 动态列表 -->
      <div v-else-if="activeTab === 'activities'" class="activities-list">
        <div 
          v-for="activity in userActivities" 
          :key="activity.id"
          class="activity-item"
        >
          <div class="activity-icon">
            {{ activity.icon }}
          </div>
          <div class="activity-content">
            <p class="activity-text">{{ activity.text }}</p>
            <span class="activity-time">{{ formatTimeAgo(activity.time) }}</span>
          </div>
        </div>
        
        <!-- 没有动态提示 -->
        <div v-if="userActivities.length === 0" class="no-activities">
          <div class="no-activities-icon">📝</div>
          <p class="no-activities-text">
            {{ isCurrentUser ? '您还没有任何动态' : '该用户还没有任何动态' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// 状态管理
const activeTab = ref('works');
const isFollowing = ref(false);
const profileData = ref({
  id: 1,
  username: 'admin',
  avatar: '',
  bio: '摄影爱好者',
  joinDate: '2023-01-01',
  certification: '',
  location: '北京',
  worksCount: 12,
  followersCount: 156,
  followingCount: 45,
  likesCount: 892,
  coverImage: 'https://picsum.photos/seed/cover/1200/400'
});

// 选项卡配置
const tabs = [
  { value: 'works', label: '作品' },
  { value: 'collections', label: '收藏' },
  { value: 'activities', label: '动态' }
];

// 认证标签
const certificationLabels = {
  'official': '官方认证',
  'photographer': '摄影师认证',
  'expert': '专家认证'
};

// 模拟用户作品数据
const userWorks = ref([
  {
    id: 1,
    title: '城市夜景',
    imageUrl: 'https://picsum.photos/seed/work1/600/400',
    likes: 128,
    comments: 32
  },
  {
    id: 2,
    title: '自然风光',
    imageUrl: 'https://picsum.photos/seed/work2/600/400',
    likes: 96,
    comments: 24
  },
  {
    id: 3,
    title: '人像摄影',
    imageUrl: 'https://picsum.photos/seed/work3/600/400',
    likes: 215,
    comments: 56
  },
  {
    id: 4,
    title: '静物特写',
    imageUrl: 'https://picsum.photos/seed/work4/600/400',
    likes: 87,
    comments: 18
  },
  {
    id: 5,
    title: '街拍纪实',
    imageUrl: 'https://picsum.photos/seed/work5/600/400',
    likes: 143,
    comments: 42
  },
  {
    id: 6,
    title: '创意摄影',
    imageUrl: 'https://picsum.photos/seed/work6/600/400',
    likes: 178,
    comments: 48
  }
]);

// 模拟用户收藏数据
const userCollections = ref([
  {
    id: 1,
    title: '精选风景',
    items: [
      { id: 1, imageUrl: 'https://picsum.photos/seed/col1-1/300/300', title: '山川湖海' },
      { id: 2, imageUrl: 'https://picsum.photos/seed/col1-2/300/300', title: '日出日落' },
      { id: 3, imageUrl: 'https://picsum.photos/seed/col1-3/300/300', title: '云雾缭绕' },
      { id: 4, imageUrl: 'https://picsum.photos/seed/col1-4/300/300', title: '星空璀璨' }
    ]
  },
  {
    id: 2,
    title: '人像精选',
    items: [
      { id: 5, imageUrl: 'https://picsum.photos/seed/col2-1/300/300', title: '微笑瞬间' },
      { id: 6, imageUrl: 'https://picsum.photos/seed/col2-2/300/300', title: '眼神故事' }
    ]
  }
]);

// 模拟用户动态数据
const userActivities = ref([
  {
    id: 1,
    icon: '📸',
    text: '发布了新作品《城市夜景》',
    time: '2小时前'
  },
  {
    id: 2,
    icon: '❤️',
    text: '点赞了作品《自然风光》',
    time: '昨天'
  },
  {
    id: 3,
    icon: '💬',
    text: '评论了作品《人像摄影》',
    time: '3天前'
  },
  {
    id: 4,
    icon: '⭐',
    text: '收藏了作品《创意摄影》',
    time: '1周前'
  }
]);

// 计算属性
const isCurrentUser = computed(() => {
  // 如果没有指定用户ID，则显示当前用户的主页
  const userId = route.params.id;
  return !userId || (userStore.userInfo && userId == userStore.userInfo.id);
});

// 方法
const goBack = () => {
  router.back();
};

const editProfile = () => {
  // 编辑资料功能
  console.log('编辑资料');
  // 这里可以跳转到编辑资料页面或显示编辑资料弹窗
};

const toggleFollow = () => {
  isFollowing.value = !isFollowing.value;
  // 更新粉丝数
  if (isFollowing.value) {
    profileData.value.followersCount++;
  } else {
    profileData.value.followersCount--;
  }
};

const viewWorkDetail = (workId) => {
  router.push(`/photo/${workId}`);
};

const viewCollectionDetail = (collectionId) => {
  // 查看收藏集详情
  console.log('查看收藏集:', collectionId);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTimeAgo = (timeAgo) => {
  // 简单的时间格式化
  return timeAgo;
};

const getThumbnailStyle = (index, total) => {
  // 根据索引返回不同的缩略图样式
  if (total === 1) {
    return {
      width: '100%',
      height: '100%'
    };
  } else if (total === 2) {
    return {
      width: '48%',
      height: '100%',
      marginRight: index === 0 ? '4%' : '0'
    };
  } else {
    return {
      width: '48%',
      height: '48%',
      marginRight: index % 2 === 0 ? '4%' : '0',
      marginBottom: '4%'
    };
  }
};

// 组件挂载时加载数据
onMounted(() => {
  // 在实际应用中，这里应该根据用户ID获取用户数据
  const userId = route.params.id;
  if (userId && userStore.userInfo && userId != userStore.userInfo.id) {
    // 加载其他用户的数据
    console.log('加载用户ID:', userId, '的数据');
    // 模拟加载其他用户数据
    // 实际应用中应该调用API获取数据
  } else if (userStore.userInfo) {
    // 加载当前用户的数据
    profileData.value = {
      ...profileData.value,
      id: userStore.userInfo.id,
      username: userStore.userInfo.username,
      bio: userStore.userInfo.bio || profileData.value.bio,
      avatar: userStore.userInfo.avatar || profileData.value.avatar
    };
  }
});
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 页面头部 */
.page-header {
  background-color: #fff;
  border-bottom: 1px solid #e1e7ef;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background-color: transparent;
  color: #212529;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.back-button:hover {
  background-color: #f8f9fa;
}

.back-icon {
  font-size: 18px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.edit-profile-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: #0d6efd;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.edit-profile-btn:hover {
  background-color: #0b5ed7;
}

.btn-icon {
  font-size: 16px;
}

/* 个人信息头部 */
.profile-header {
  position: relative;
  background-color: #fff;
  border-bottom: 1px solid #e1e7ef;
}

.profile-cover {
  height: 300px;
  overflow: hidden;
  position: relative;
}

.profile-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  padding-top: 100px;
  padding-bottom: 40px;
  display: flex;
  gap: 40px;
  position: relative;
}

.avatar-container {
  position: absolute;
  top: -100px;
  left: 20px;
}

.profile-avatar {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 6px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  object-fit: cover;
}

.certification-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #10b981;
  color: #fff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  border: 2px solid #fff;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.user-bio {
  font-size: 16px;
  color: #4b5563;
  margin: 0 0 16px 0;
  line-height: 1.6;
}

.user-meta {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.meta-item {
  display: flex;
  gap: 6px;
  font-size: 14px;
  color: #6b7280;
}

.meta-label {
  font-weight: 500;
}

.user-stats {
  display: flex;
  gap: 40px;
  margin-bottom: 24px;
  padding: 16px 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

.profile-actions {
  display: flex;
  gap: 12px;
}

.follow-button {
  padding: 10px 24px;
  background-color: #0d6efd;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.follow-button:hover {
  background-color: #0b5ed7;
}

.follow-button.following {
  background-color: #6c757d;
}

.follow-button.following:hover {
  background-color: #5a6268;
}

.message-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  background-color: #fff;
  color: #212529;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.message-button:hover {
  background-color: #f8f9fa;
  border-color: #adb5bd;
}

/* 内容选项卡 */
.content-tabs {
  background-color: #fff;
  border-bottom: 1px solid #e1e7ef;
  position: sticky;
  top: 60px;
  z-index: 90;
}

.tabs-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.tab-button {
  padding: 16px 24px;
  background-color: transparent;
  border: none;
  color: #6b7280;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
}

.tab-button:hover {
  color: #212529;
  background-color: rgba(0, 0, 0, 0.02);
}

.tab-button.active {
  color: #0d6efd;
  border-bottom-color: #0d6efd;
}

/* 内容区域 */
.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* 作品列表 */
.works-grid {
  display: grid;
  /* 在大屏幕上使用固定的3列布局 */
  grid-template-columns: repeat(3, 1fr);
  /* 确保所有图片之间的间隙大小统一 */
  gap: 24px;
  
  /* 响应式调整 */
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.work-item {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  /* 确保所有作品项高度统一 */
  height: 100%;
}

.work-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.work-image {
  /* 使用固定的宽高比，确保所有图片区域大小一致 */
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

.work-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.work-item:hover .work-image img {
  transform: scale(1.05);
}

.work-info {
  padding: 16px;
}

.work-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.work-stats {
  display: flex;
  gap: 16px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #6b7280;
}

/* 收藏列表 */
.collections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.collection-item {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  cursor: pointer;
}

.collection-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.collection-thumbnail {
  height: 200px;
  padding: 16px;
  background-color: #f8f9fa;
  position: relative;
}

.thumbnail-image {
  object-fit: cover;
  border-radius: 8px;
  position: absolute;
}

.collection-info {
  padding: 16px;
}

.collection-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.collection-count {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* 动态列表 */
.activities-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.activity-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-text {
  font-size: 16px;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.activity-time {
  font-size: 14px;
  color: #9ca3af;
}

/* 空状态 */
.no-works,
.no-collections,
.no-activities {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  text-align: center;
}

.no-works-icon,
.no-collections-icon,
.no-activities-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-works-text,
.no-collections-text,
.no-activities-text {
  font-size: 18px;
  color: #6b7280;
  margin: 0 0 24px 0;
}

.upload-first-work-btn {
  padding: 10px 24px;
  background-color: #0d6efd;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.upload-first-work-btn:hover {
  background-color: #0b5ed7;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-info {
    flex-direction: column;
    padding-top: 180px;
  }
  
  .avatar-container {
    position: absolute;
    top: -80px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .profile-avatar {
    width: 120px;
    height: 120px;
  }
  
  .user-name {
    text-align: center;
    font-size: 24px;
  }
  
  .user-bio {
    text-align: center;
  }
  
  .user-meta {
    justify-content: center;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .user-stats {
    gap: 20px;
    justify-content: space-around;
  }
  
  .profile-actions {
    justify-content: center;
  }
  
  .works-grid,
  .collections-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
}
</style>