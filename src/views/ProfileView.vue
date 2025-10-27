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
          <button class="edit-profile-btn" @click="openEditProfile">
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
            <span v-if="profileData.website" class="meta-item">
              <span class="meta-label">个人网站:</span>
              <a :href="profileData.website" target="_blank" class="meta-value website-link">{{ formatWebsite(profileData.website) }}</a>
            </span>
            <span v-if="profileData.qq" class="meta-item">
              <span class="meta-label">QQ:</span>
              <span class="meta-value">{{ profileData.qq }}</span>
            </span>
          </div>
          
          <div v-if="profileData.skills && profileData.skills.length > 0" class="user-skills">
            <span class="skills-label">擅长领域:</span>
            <span v-for="skill in profileData.skills" :key="skill" class="skill-tag">
              {{ skill }}
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
        class="tab-button" 
        :class="{ active: activeTab === 'works' }"
        @click="activeTab = 'works'"
      >
        作品
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'collections' }"
        @click="activeTab = 'collections'"
      >
        收藏
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'activities' }"
        @click="activeTab = 'activities'"
      >
        动态
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="profile-content">
      <!-- 作品列表 -->
      <div v-if="activeTab === 'works'" class="works-grid">
        <div v-for="work in userWorks" :key="work.id" class="work-item">
          <div class="work-image">
            <img :src="work.image" alt="作品图片" />
          </div>
          <div class="work-info">
            <h3 class="work-title">{{ work.title }}</h3>
            <div class="work-stats">
              <span class="stat-like">{{ work.likes }} 喜欢</span>
              <span class="stat-comment">{{ work.comments }} 评论</span>
            </div>
          </div>
        </div>
        
        <!-- 没有作品提示 -->
        <div v-if="userWorks.length === 0" class="no-works">
          <div class="no-works-icon">📷</div>
          <p class="no-works-text">
            {{ isCurrentUser ? '您还没有发布任何作品' : '该用户还没有发布任何作品' }}
          </p>
        </div>
      </div>

      <!-- 收藏列表 -->
      <div v-if="activeTab === 'collections'" class="collections-grid">
        <div v-for="collection in userCollections" :key="collection.id" class="collection-item">
          <div class="collection-preview">
            <img :src="collection.coverImage" alt="收藏集封面" />
            <span class="collection-count">{{ collection.worksCount }} 个作品</span>
          </div>
          <h3 class="collection-title">{{ collection.title }}</h3>
        </div>
        
        <!-- 没有收藏提示 -->
        <div v-if="userCollections.length === 0" class="no-collections">
          <div class="no-collections-icon">⭐</div>
          <p class="no-collections-text">
            {{ isCurrentUser ? '您还没有创建任何收藏集' : '该用户还没有创建任何收藏集' }}
          </p>
        </div>
      </div>

      <!-- 动态列表 -->
      <div v-if="activeTab === 'activities'" class="activities-list">
        <div v-for="activity in userActivities" :key="activity.id" class="activity-item">
          <div class="activity-header">
            <img :src="profileData.avatar || `https://picsum.photos/seed/${profileData.username}/200/200`" alt="用户头像" class="activity-avatar" />
            <div class="activity-user-info">
              <span class="activity-username">{{ profileData.username }}</span>
              <span class="activity-time">{{ formatRelativeTime(activity.time) }}</span>
            </div>
          </div>
          <div class="activity-content">
            <p class="activity-text">{{ activity.content }}</p>
            <div v-if="activity.media" class="activity-media">
              <img :src="activity.media" alt="动态图片" />
            </div>
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

    <!-- 编辑资料弹窗 -->
    <div v-if="isEditModalOpen" class="edit-profile-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">编辑个人资料</h2>
          <button class="close-button" @click="closeEditProfile">×</button>
        </div>
        
        <div class="modal-body">
          <!-- 基本信息 -->
          <div class="form-section">
            <h3>基本信息</h3>
            
            <div class="form-group">
              <label>用户名</label>
              <input 
                type="text" 
                v-model="editFormData.username" 
                placeholder="请输入用户名"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label>个人简介</label>
              <textarea 
                v-model="editFormData.bio" 
                placeholder="介绍一下自己吧"
                class="form-textarea"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label>所在地</label>
              <input 
                type="text" 
                v-model="editFormData.location" 
                placeholder="请输入所在地"
                class="form-input"
              />
            </div>
          </div>
          
          <!-- 联系方式 -->
          <div class="form-section">
            <h3>联系方式</h3>
            
            <div class="form-group">
              <label>个人网站</label>
              <input 
                type="url" 
                v-model="editFormData.website" 
                placeholder="https://"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label>邮箱</label>
              <input 
                type="email" 
                v-model="editFormData.email" 
                placeholder="请输入邮箱地址"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label>手机号码</label>
              <input 
                type="tel" 
                v-model="editFormData.phone" 
                placeholder="请输入手机号码"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label>QQ</label>
              <input 
                type="text" 
                v-model="editFormData.qq" 
                placeholder="请输入QQ号码"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label>微信</label>
              <input 
                type="text" 
                v-model="editFormData.wechat" 
                placeholder="请输入微信号"
                class="form-input"
              />
            </div>
          </div>
          
          <!-- 社交链接 -->
          <div class="form-section">
            <h3>社交链接</h3>
            
            <div class="social-links-grid">
              <div class="social-link-item">
                <div class="social-icon">🔵</div>
                <div class="social-input-wrapper">
                  <label>微博</label>
                  <input 
                    type="url" 
                    v-model="editFormData.socialLinks.weibo" 
                    placeholder="https://weibo.com/"
                    class="form-input"
                  />
                </div>
              </div>
              
              <div class="social-link-item">
                <div class="social-icon">📸</div>
                <div class="social-input-wrapper">
                  <label>Instagram</label>
                  <input 
                    type="url" 
                    v-model="editFormData.socialLinks.instagram" 
                    placeholder="https://instagram.com/"
                    class="form-input"
                  />
                </div>
              </div>
              
              <div class="social-link-item">
                <div class="social-icon">🐦</div>
                <div class="social-input-wrapper">
                  <label>Twitter</label>
                  <input 
                    type="url" 
                    v-model="editFormData.socialLinks.twitter" 
                    placeholder="https://twitter.com/"
                    class="form-input"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <!-- 擅长领域 -->
          <div class="form-section">
            <h3>擅长领域</h3>
            
            <div class="skills-container">
              <span 
                v-for="skill in editFormData.skills" 
                :key="skill"
                class="skill-tag"
              >
                {{ skill }}
                <button class="remove-skill-btn" @click="removeSkill(skill)">×</button>
              </span>
            </div>
            
            <div class="add-skill">
              <input 
                type="text" 
                v-model="newSkill" 
                placeholder="添加擅长领域"
                class="add-skill-input"
                @keyup.enter="addSkill"
              />
              <button 
                class="add-skill-btn" 
                @click="addSkill"
                :disabled="!newSkill.trim()"
              >
                添加
              </button>
            </div>
          </div>
          
          <!-- 头像和封面图 -->
          <div class="form-section">
            <h3>头像和封面</h3>
            
            <div class="media-upload-section">
              <div class="upload-group">
                <label>头像</label>
                <div class="avatar-upload">
                  <img 
                    v-if="editFormData.avatar" 
                    :src="editFormData.avatar" 
                    alt="头像预览"
                    class="avatar-preview"
                  />
                  <div v-else class="avatar-placeholder">
                    <span>+</span>
                  </div>
                  <input type="file" accept="image/*" class="avatar-input" />
                </div>
              </div>
              
              <div class="upload-group">
                <label>封面图</label>
                <div class="cover-upload">
                  <img 
                    v-if="editFormData.coverImage" 
                    :src="editFormData.coverImage" 
                    alt="封面预览"
                    class="cover-preview"
                  />
                  <div v-else class="cover-placeholder">
                    <span>+</span>
                  </div>
                  <input type="file" accept="image/*" class="cover-input" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="cancel-button" @click="closeEditProfile">取消</button>
          <button class="save-button" @click="saveProfile">保存</button>
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
const isEditModalOpen = ref(false);
const editFormData = ref({});
const newSkill = ref('');

// 模拟数据 - 个人资料
const profileData = ref({
  id: 1,
  username: 'admin',
  avatar: '',
  bio: '摄影爱好者',
  joinDate: '2023-01-01',
  certification: '',
  location: '北京',
  website: '',
  email: '',
  phone: '',
  qq: '',
  wechat: '',
  skills: ['人像摄影', '风光摄影'],
  socialLinks: {
    weibo: '',
    instagram: '',
    twitter: ''
  },
  coverImage: '',
  worksCount: 12,
  followersCount: 156,
  followingCount: 89,
  likesCount: 567
});

// 模拟数据 - 作品列表
const userWorks = ref([
  {
    id: 1,
    title: '城市夜景',
    image: 'https://picsum.photos/seed/work1/600/400',
    likes: 45,
    comments: 8
  },
  {
    id: 2,
    title: '山间小路',
    image: 'https://picsum.photos/seed/work2/600/400',
    likes: 32,
    comments: 5
  },
  {
    id: 3,
    title: '人像摄影',
    image: 'https://picsum.photos/seed/work3/600/400',
    likes: 67,
    comments: 12
  }
]);

// 模拟数据 - 收藏列表
const userCollections = ref([
  {
    id: 1,
    title: '风景摄影合集',
    coverImage: 'https://picsum.photos/seed/collection1/600/400',
    worksCount: 24
  },
  {
    id: 2,
    title: '人像摄影精选',
    coverImage: 'https://picsum.photos/seed/collection2/600/400',
    worksCount: 18
  }
]);

// 模拟数据 - 动态列表
const userActivities = ref([
  {
    id: 1,
    content: '今天拍摄了一组很棒的城市风光照片！',
    time: '2024-01-15T14:30:00',
    media: 'https://picsum.photos/seed/activity1/600/400'
  },
  {
    id: 2,
    content: '分享一个摄影技巧：如何在弱光环境下拍摄清晰的照片',
    time: '2024-01-10T09:15:00',
    media: ''
  }
]);

// 认证标签
const certificationLabels = {
  photographer: '认证摄影师',
  designer: '认证设计师',
  artist: '认证艺术家'
};

// 计算属性 - 是否是当前用户
const isCurrentUser = computed(() => {
  // 实际项目中应该根据用户ID或token判断
  return true;
});

// 方法 - 打开编辑资料
const openEditProfile = () => {
  // 复制当前资料到编辑表单
  editFormData.value = {
    ...JSON.parse(JSON.stringify(profileData.value))
  };
  isEditModalOpen.value = true;
};

// 方法 - 关闭编辑资料
const closeEditProfile = () => {
  isEditModalOpen.value = false;
  newSkill.value = '';
};

// 方法 - 保存资料
const saveProfile = () => {
  // 复制编辑表单数据到资料对象
  profileData.value = {
    ...editFormData.value
  };
  
  // 显示保存成功提示
  alert('资料保存成功！');
  closeEditProfile();
};

// 方法 - 添加擅长领域
const addSkill = () => {
  const skill = newSkill.value.trim();
  if (skill && !editFormData.value.skills.includes(skill)) {
    editFormData.value.skills.push(skill);
    newSkill.value = '';
  }
};

// 方法 - 移除擅长领域
const removeSkill = (skill) => {
  const index = editFormData.value.skills.indexOf(skill);
  if (index > -1) {
    editFormData.value.skills.splice(index, 1);
  }
};

// 方法 - 切换关注状态
const toggleFollow = () => {
  isFollowing.value = !isFollowing.value;
  // 实际项目中应该调用API更新关注状态
};

// 方法 - 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

// 方法 - 格式化相对时间
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 60) {
    return `${minutes}分钟前`;
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else if (days < 30) {
    return `${days}天前`;
  } else {
    return formatDate(dateString);
  }
};

// 方法 - 格式化网站显示
const formatWebsite = (url) => {
  let displayUrl = url;
  if (url.startsWith('https://')) {
    displayUrl = url.substring(8);
  } else if (url.startsWith('http://')) {
    displayUrl = url.substring(7);
  }
  return displayUrl;
};

// 方法 - 返回上一页
const goBack = () => {
  router.back();
};

// 组件挂载时执行
onMounted(() => {
  // 实际项目中应该从API获取用户资料
});
</script>

<style scoped>
/* 页面容器 */
.profile-page {
  min-height: 100vh;
  background-color: #f5f5f5;
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
  gap: 6px;
  padding: 8px 12px;
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
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.certification-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #0d6efd;
  color: #fff;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  border: 2px solid #fff;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 28px;
  font-weight: 700;
  color: #212529;
  margin: 0 0 12px 0;
}

.user-bio {
  font-size: 16px;
  color: #6c757d;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.user-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6c757d;
}

.meta-label {
  color: #adb5bd;
}

.website-link {
  color: #0d6efd;
  text-decoration: none;
  transition: color 0.2s ease;
}

.website-link:hover {
  color: #0b5ed7;
  text-decoration: underline;
}

.user-skills {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.skills-label {
  font-size: 14px;
  font-weight: 500;
  color: #495057;
}

.skill-tag {
  padding: 6px 12px;
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #e1e7ef;
  border-radius: 16px;
  font-size: 13px;
  transition: all 0.2s ease;
}

/* 统计数据 */
.user-stats {
  display: flex;
  gap: 40px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #212529;
}

.stat-label {
  font-size: 14px;
  color: #6c757d;
  margin-top: 4px;
}

/* 操作按钮 */
.profile-actions {
  display: flex;
  gap: 12px;
}

.follow-button {
  padding: 8px 24px;
  background-color: #0d6efd;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.follow-button:hover {
  background-color: #0b5ed7;
}

.follow-button.following {
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
}

.follow-button.following:hover {
  background-color: #e9ecef;
}

.message-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.message-button:hover {
  background-color: #e9ecef;
}

/* 内容选项卡 */
.content-tabs {
  background-color: #fff;
  border-bottom: 1px solid #e1e7ef;
  margin-bottom: 20px;
}

.content-tabs-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 40px;
}

.tab-button {
  padding: 16px 0;
  background: none;
  border: none;
  color: #6c757d;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;
}

.tab-button:hover {
  color: #212529;
}

.tab-button.active {
  color: #0d6efd;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #0d6efd;
  border-radius: 3px;
}

/* 内容区域 */
.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 作品列表 */
.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.work-item {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.work-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.work-image {
  height: 200px;
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
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 12px 0;
}

.work-stats {
  display: flex;
  gap: 20px;
}

.stat-like,
.stat-comment {
  font-size: 14px;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 收藏列表 */
.collections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.collection-item {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.collection-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.collection-preview {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.collection-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.collection-item:hover .collection-preview img {
  transform: scale(1.05);
}

.collection-count {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.collection-title {
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

/* 动态列表 */
.activities-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.activity-item {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.activity-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.activity-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.activity-user-info {
  flex: 1;
}

.activity-username {
  font-size: 15px;
  font-weight: 600;
  color: #212529;
  display: block;
}

.activity-time {
  font-size: 13px;
  color: #6c757d;
  display: block;
  margin-top: 2px;
}

.activity-content {
  margin-left: 60px;
}

.activity-text {
  font-size: 15px;
  color: #212529;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.activity-media img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
}

/* 空状态样式 */
.no-works,
.no-collections,
.no-activities {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
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
  font-size: 16px;
  margin: 0;
}

/* 编辑资料弹窗样式 */
.edit-profile-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background-color: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e1e7ef;
}

.modal-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.close-button {
  background: none;
  border: none;
  font-size: 28px;
  color: #6b7280;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.close-button:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 24px;
}

.form-section {
  margin-bottom: 32px;
}

.form-section h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  background-color: #fff;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* 社交链接样式 */
.social-links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.social-link-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.social-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  border-radius: 12px;
  font-size: 20px;
  flex-shrink: 0;
}

.social-input-wrapper {
  flex: 1;
}

.social-input-wrapper label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 4px;
}

/* 擅长领域样式 */
.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: #e7f3ff;
  color: #0d6efd;
  border: 1px solid #b3d9ff;
  border-radius: 16px;
  font-size: 13px;
}

.remove-skill-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.remove-skill-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.add-skill {
  display: flex;
  align-items: center;
  gap: 12px;
}

.add-skill-input {
  flex: 1;
  max-width: 250px;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}

.add-skill-input:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
}

.add-skill-btn {
  padding: 10px 20px;
  background-color: #0d6efd;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.add-skill-btn:hover:not(:disabled) {
  background-color: #0b5ed7;
}

.add-skill-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

/* 媒体上传样式 */
.media-upload-section {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 24px;
}

.upload-group {
  margin-bottom: 24px;
}

.upload-group:last-child {
  margin-bottom: 0;
}

.upload-group label {
  display: block;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.avatar-upload,
.cover-upload {
  position: relative;
  display: inline-block;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cover-preview {
  width: 300px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.avatar-placeholder,
.cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e5e7eb;
  border: 2px dashed #9ca3af;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.cover-placeholder {
  width: 300px;
  height: 150px;
}

.avatar-placeholder:hover,
.cover-placeholder:hover {
  background-color: #d1d5db;
  border-color: #6b7280;
}

.avatar-placeholder span,
.cover-placeholder span {
  font-size: 32px;
  color: #6b7280;
}

.avatar-input,
.cover-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

/* 底部按钮样式 */
.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #e1e7ef;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-button {
  padding: 10px 20px;
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  background-color: #e5e7eb;
}

.save-button {
  padding: 10px 20px;
  background-color: #0d6efd;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.save-button:hover {
  background-color: #0b5ed7;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    padding: 16px;
  }
  
  .page-title {
    font-size: 18px;
  }
  
  .profile-info {
    padding: 0 16px;
    padding-top: 80px;
    padding-bottom: 30px;
    flex-direction: column;
    gap: 20px;
  }
  
  .avatar-container {
    position: static;
    display: flex;
    justify-content: center;
    margin-top: -80px;
    margin-bottom: -20px;
  }
  
  .profile-avatar {
    width: 150px;
    height: 150px;
  }
  
  .user-details {
    text-align: center;
  }
  
  .user-meta {
    justify-content: center;
  }
  
  .user-skills {
    justify-content: center;
  }
  
  .user-stats {
    justify-content: center;
    gap: 20px;
  }
  
  .profile-actions {
    justify-content: center;
  }
  
  .content-tabs-container {
    padding: 0 16px;
    gap: 20px;
  }
  
  .tab-button {
    font-size: 14px;
    padding: 16px 8px;
  }
  
  .profile-content {
    padding: 0 16px;
  }
  
  .works-grid,
  .collections-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
  
  .activity-header {
    margin-bottom: 12px;
  }
  
  .activity-content {
    margin-left: 0;
  }
  
  .modal-content {
    margin: 10px;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }
  
  .social-links-grid {
    grid-template-columns: 1fr;
  }
  
  .cover-preview,
  .cover-placeholder {
    width: 100%;
    max-width: 300px;
  }
}
</style>