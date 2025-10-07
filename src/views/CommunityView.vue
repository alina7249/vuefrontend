<template>
  <div class="community-container">
    <!-- 社区头部 -->
    <div class="community-header">
      <h1>摄影师社区</h1>
      <p>连接全球摄影爱好者，分享创作灵感与经验</p>
    </div>
    
    <!-- 社区导航 -->
    <div class="community-nav">
      <button
        v-for="tab in communityTabs"
        :key="tab.value"
        class="nav-tab"
        :class="{ active: currentTab === tab.value }"
        @click="setTab(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <!-- 排行榜区域 -->
    <div v-if="currentTab === 'ranking'" class="ranking-section">
      <div class="ranking-header">
        <h2>摄影师排行榜</h2>
        <div class="ranking-filters">
          <button
            v-for="filter in rankingFilters"
            :key="filter.value"
            class="filter-button"
            :class="{ active: currentRankingFilter === filter.value }"
            @click="setRankingFilter(filter.value)"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>
      
      <div class="ranking-list">
        <div v-for="(photographer, index) in rankingData" :key="photographer.id" class="ranking-item">
          <div class="ranking-position">
            <span class="position-number" :class="getRankClass(index)">{{ index + 1 }}</span>
          </div>
          
          <div class="ranking-avatar">
            <img :src="photographer.avatarUrl" :alt="photographer.name" />
          </div>
          
          <div class="ranking-info">
            <div class="ranking-name-row">
              <h3 class="ranking-name">{{ photographer.name }}</h3>
              <span v-if="photographer.certification" class="certification-badge" :class="photographer.certification.toLowerCase()">
                {{ certificationLabels[photographer.certification] }}
              </span>
            </div>
            <p class="ranking-bio">{{ photographer.bio }}</p>
            <div class="ranking-stats">
              <span class="stat-item">作品: {{ photographer.worksCount }}</span>
              <span class="stat-item">粉丝: {{ photographer.followersCount }}</span>
              <span class="stat-item">获赞: {{ photographer.likesCount }}</span>
            </div>
          </div>
          
          <div class="ranking-actions">
            <button 
              class="follow-button" 
              :class="{ following: photographer.isFollowing }"
              @click="toggleFollow(photographer.id)"
            >
              {{ photographer.isFollowing ? '已关注' : '关注' }}
            </button>
            <button class="view-button" @click="viewPhotographerProfile(photographer.id)">
              查看主页
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 同城摄影师区域 -->
    <div v-else-if="currentTab === 'local'" class="local-section">
      <div class="local-header">
        <h2>同城摄影师</h2>
        <div class="location-selector">
          <button class="location-button">
            <i class="location-icon">📍</i>
            {{ currentLocation }}
            <i class="arrow-icon">▼</i>
          </button>
        </div>
      </div>
      
      <div class="local-map-container">
        <div class="map-placeholder">
          <!-- 地图占位符，实际项目中应集成地图API -->
          <div class="map-markers">
            <div v-for="photographer in localPhotographers" :key="photographer.id" class="map-marker" :style="{ left: photographer.left, top: photographer.top }" @mouseenter="showMarkerInfo(photographer.id)" @mouseleave="hideMarkerInfo">
              <div class="marker-dot" :class="{ active: hoveredMarker === photographer.id }"></div>
              <div v-if="hoveredMarker === photographer.id" class="marker-info">
                <div class="marker-avatar">
                  <img :src="photographer.avatarUrl" :alt="photographer.name" />
                </div>
                <div class="marker-details">
                  <h4>{{ photographer.name }}</h4>
                  <p>{{ photographer.style }}</p>
                  <button class="marker-view-button" @click.stop="viewPhotographerProfile(photographer.id)">查看</button>
                </div>
              </div>
            </div>
          </div>
          <div class="map-loading">地图加载中...</div>
        </div>
      </div>
      
      <div class="local-photographers-list">
        <h3>同城热门摄影师</h3>
        <div class="photographer-cards">
          <div v-for="photographer in localPhotographers.slice(0, 8)" :key="photographer.id" class="photographer-card">
            <div class="card-avatar">
              <img :src="photographer.avatarUrl" :alt="photographer.name" />
            </div>
            <div class="card-info">
              <h4>{{ photographer.name }}</h4>
              <p class="card-style">{{ photographer.style }}</p>
              <div class="card-stats">
                <span>{{ photographer.worksCount }} 作品</span>
                <span>{{ photographer.followersCount }} 粉丝</span>
              </div>
            </div>
            <button class="card-follow-button" :class="{ following: photographer.isFollowing }" @click="toggleFollow(photographer.id)">
              {{ photographer.isFollowing ? '已关注' : '关注' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 成就墙区域 -->
    <div v-else-if="currentTab === 'achievements'" class="achievements-section">
      <div class="achievements-header">
        <h2>成就墙</h2>
        <p>展示摄影师们的创作成就与里程碑</p>
      </div>
      
      <div class="achievements-list">
        <div v-for="achievement in achievementsData" :key="achievement.id" class="achievement-item">
          <div class="achievement-badge" :class="achievement.type">
            <i class="badge-icon">{{ achievement.icon }}</i>
          </div>
          
          <div class="achievement-info">
            <h3 class="achievement-title">{{ achievement.title }}</h3>
            <p class="achievement-description">{{ achievement.description }}</p>
            <div class="achievement-stats">
              <span class="stat-item">完成人数: {{ achievement.completedCount }}</span>
              <span class="stat-item">难度: {{ achievement.difficulty }}</span>
            </div>
          </div>
          
          <div class="achievement-actions">
            <button v-if="!achievement.isCompleted" class="achievement-button">
              去完成
            </button>
            <span v-else class="completed-badge">已完成</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 私信系统 -->
    <div v-else-if="currentTab === 'messages'" class="messages-section">
      <div class="messages-layout">
        <div class="messages-sidebar">
          <div class="messages-search">
            <input type="text" placeholder="搜索对话" class="search-input" />
          </div>
          
          <div class="conversations-list">
            <div v-for="conversation in conversations" :key="conversation.id" class="conversation-item" :class="{ active: selectedConversation === conversation.id }" @click="selectConversation(conversation.id)">
              <div class="conversation-avatar">
                <img :src="conversation.avatarUrl" :alt="conversation.name" />
                <div v-if="conversation.unreadCount > 0" class="unread-badge">{{ conversation.unreadCount }}</div>
              </div>
              
              <div class="conversation-info">
                <div class="conversation-name-row">
                  <h4 class="conversation-name">{{ conversation.name }}</h4>
                  <span class="conversation-time">{{ conversation.lastTime }}</span>
                </div>
                <p class="conversation-last-message">{{ conversation.lastMessage }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="messages-main">
          <div v-if="selectedConversation" class="message-thread">
            <div class="thread-header">
              <div class="thread-avatar">
                <img :src="getSelectedConversation().avatarUrl" :alt="getSelectedConversation().name" />
              </div>
              <div class="thread-info">
                <h3>{{ getSelectedConversation().name }}</h3>
                <span class="thread-status">在线</span>
              </div>
            </div>
            
            <div class="thread-messages">
              <div v-for="message in messagesData" :key="message.id" class="message-bubble" :class="message.isOwn ? 'own' : 'other'">
                <div class="message-content">
                  <p>{{ message.text }}</p>
                </div>
                <span class="message-time">{{ message.time }}</span>
              </div>
            </div>
            
            <div class="thread-input">
              <div class="input-tools">
                <button class="tool-button"><i>📷</i></button>
                <button class="tool-button"><i>😊</i></button>
                <button class="tool-button"><i>📍</i></button>
              </div>
              <input type="text" v-model="newMessage" placeholder="输入消息..." class="message-input" @keyup.enter="sendMessage" />
              <button class="send-button" @click="sendMessage">发送</button>
            </div>
          </div>
          
          <div v-else class="no-conversation">
            <div class="no-conversation-icon">💬</div>
            <h3>选择一个对话开始聊天</h3>
            <p>或搜索摄影师开始新的对话</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 社区标签页
const currentTab = ref('ranking');
const communityTabs = [
  { label: '排行榜', value: 'ranking' },
  { label: '同城摄影师', value: 'local' },
  { label: '成就墙', value: 'achievements' },
  { label: '私信', value: 'messages' },
];

// 排行榜筛选
const currentRankingFilter = ref('overall');
const rankingFilters = [
  { label: '综合排名', value: 'overall' },
  { label: '人像', value: 'portrait' },
  { label: '风光', value: 'landscape' },
  { label: '同城', value: 'local' },
];

// 认证标签
const certificationLabels = {
  MASTER: '摄影大师',
  SENIOR: '高级认证',
  JUNIOR: '初级认证',
};

// 当前位置
const currentLocation = ref('北京市');
const hoveredMarker = ref(null);

// 私信相关
const selectedConversation = ref(null);
const newMessage = ref('');

// 模拟排行榜数据
const rankingData = ref([
  {
    id: 1,
    name: '张大山',
    avatarUrl: 'https://picsum.photos/100/100?random=1',
    bio: '风光摄影大师，擅长捕捉自然之美',
    certification: 'MASTER',
    worksCount: 286,
    followersCount: 12580,
    likesCount: 36820,
    isFollowing: false,
  },
  {
    id: 2,
    name: '李明',
    avatarUrl: 'https://picsum.photos/100/100?random=2',
    bio: '人像摄影师，专注于人物情感表达',
    certification: 'SENIOR',
    worksCount: 156,
    followersCount: 8920,
    likesCount: 25640,
    isFollowing: true,
  },
  {
    id: 3,
    name: '王小花',
    avatarUrl: 'https://picsum.photos/100/100?random=3',
    bio: '街拍摄影师，记录城市百态',
    certification: 'SENIOR',
    worksCount: 210,
    followersCount: 7540,
    likesCount: 22380,
    isFollowing: false,
  },
  {
    id: 4,
    name: '赵小刚',
    avatarUrl: 'https://picsum.photos/100/100?random=4',
    bio: '生态摄影师，热爱野生动物摄影',
    certification: 'JUNIOR',
    worksCount: 98,
    followersCount: 5230,
    likesCount: 18760,
    isFollowing: false,
  },
  {
    id: 5,
    name: '陈静',
    avatarUrl: 'https://picsum.photos/100/100?random=5',
    bio: '建筑摄影师，擅长捕捉几何之美',
    certification: 'SENIOR',
    worksCount: 178,
    followersCount: 6890,
    likesCount: 21450,
    isFollowing: true,
  },
]);

// 模拟同城摄影师数据
const localPhotographers = ref([
  {
    id: 11,
    name: '刘德华',
    avatarUrl: 'https://picsum.photos/100/100?random=11',
    style: '人像摄影',
    worksCount: 120,
    followersCount: 4500,
    isFollowing: false,
    left: '30%',
    top: '40%',
  },
  {
    id: 12,
    name: '张学友',
    avatarUrl: 'https://picsum.photos/100/100?random=12',
    style: '风光摄影',
    worksCount: 98,
    followersCount: 3200,
    isFollowing: true,
    left: '60%',
    top: '30%',
  },
  {
    id: 13,
    name: '周杰伦',
    avatarUrl: 'https://picsum.photos/100/100?random=13',
    style: '街拍',
    worksCount: 156,
    followersCount: 5800,
    isFollowing: false,
    left: '45%',
    top: '60%',
  },
  {
    id: 14,
    name: '林俊杰',
    avatarUrl: 'https://picsum.photos/100/100?random=14',
    style: '建筑摄影',
    worksCount: 89,
    followersCount: 2800,
    isFollowing: false,
    left: '70%',
    top: '50%',
  },
  {
    id: 15,
    name: '王力宏',
    avatarUrl: 'https://picsum.photos/100/100?random=15',
    style: '生态摄影',
    worksCount: 112,
    followersCount: 3600,
    isFollowing: true,
    left: '20%',
    top: '70%',
  },
  {
    id: 16,
    name: '陈奕迅',
    avatarUrl: 'https://picsum.photos/100/100?random=16',
    style: '人文纪实',
    worksCount: 145,
    followersCount: 4200,
    isFollowing: false,
    left: '55%',
    top: '20%',
  },
]);

// 模拟成就数据
const achievementsData = ref([
  {
    id: 21,
    title: '摄影达人',
    description: '发布10篇高质量作品',
    icon: '🏆',
    type: 'bronze',
    completedCount: 1250,
    difficulty: '简单',
    isCompleted: true,
  },
  {
    id: 22,
    title: '人气王',
    description: '获得1000个作品点赞',
    icon: '👑',
    type: 'silver',
    completedCount: 890,
    difficulty: '中等',
    isCompleted: true,
  },
  {
    id: 23,
    title: '社交明星',
    description: '拥有500个粉丝',
    icon: '⭐',
    type: 'silver',
    completedCount: 1050,
    difficulty: '中等',
    isCompleted: false,
  },
  {
    id: 24,
    title: '创作大师',
    description: '发布100篇高质量作品',
    icon: '🎯',
    type: 'gold',
    completedCount: 320,
    difficulty: '困难',
    isCompleted: false,
  },
  {
    id: 25,
    title: '意见领袖',
    description: '获得10000个作品点赞',
    icon: '💎',
    type: 'diamond',
    completedCount: 150,
    difficulty: '极难',
    isCompleted: false,
  },
]);

// 模拟对话数据
const conversations = ref([
  {
    id: 31,
    name: '李明',
    avatarUrl: 'https://picsum.photos/100/100?random=2',
    lastMessage: '你的作品真不错，有机会一起外拍吗？',
    lastTime: '10:25',
    unreadCount: 2,
  },
  {
    id: 32,
    name: '王小花',
    avatarUrl: 'https://picsum.photos/100/100?random=3',
    lastMessage: '谢谢分享，学到了很多',
    lastTime: '昨天',
    unreadCount: 0,
  },
  {
    id: 33,
    name: '张大山',
    avatarUrl: 'https://picsum.photos/100/100?random=1',
    lastMessage: '下周末有个风光摄影活动，你要参加吗？',
    lastTime: '3天前',
    unreadCount: 0,
  },
  {
    id: 34,
    name: '赵小刚',
    avatarUrl: 'https://picsum.photos/100/100?random=4',
    lastMessage: '关于相机设置的问题，我想请教你一下',
    lastTime: '上周',
    unreadCount: 0,
  },
]);

// 模拟消息数据
const messagesData = ref([
  {
    id: 41,
    text: '你好，看到你最近的作品很棒！',
    time: '10:00',
    isOwn: false,
  },
  {
    id: 42,
    text: '谢谢！我最近在研究新的拍摄技巧。',
    time: '10:05',
    isOwn: true,
  },
  {
    id: 43,
    text: '你的人像作品特别有感觉，能分享一些经验吗？',
    time: '10:10',
    isOwn: false,
  },
  {
    id: 44,
    text: '当然可以，主要是注意光线和构图，还有和模特的沟通很重要。',
    time: '10:15',
    isOwn: true,
  },
  {
    id: 45,
    text: '你的作品真不错，有机会一起外拍吗？',
    time: '10:25',
    isOwn: false,
  },
]);

// 设置当前标签页
const setTab = (tab) => {
  currentTab.value = tab;
};

// 设置排行榜筛选
const setRankingFilter = (filter) => {
  currentRankingFilter.value = filter;
  // 实际项目中应该根据筛选条件重新加载数据
};

// 获取排名样式类
const getRankClass = (index) => {
  if (index === 0) return 'gold';
  if (index === 1) return 'silver';
  if (index === 2) return 'bronze';
  return '';
};

// 切换关注状态
const toggleFollow = (photographerId) => {
  // 更新排行榜数据
  const rankingPhotographer = rankingData.value.find(p => p.id === photographerId);
  if (rankingPhotographer) {
    rankingPhotographer.isFollowing = !rankingPhotographer.isFollowing;
    rankingPhotographer.followersCount += rankingPhotographer.isFollowing ? 1 : -1;
  }
  
  // 更新同城摄影师数据
  const localPhotographer = localPhotographers.value.find(p => p.id === photographerId);
  if (localPhotographer) {
    localPhotographer.isFollowing = !localPhotographer.isFollowing;
    localPhotographer.followersCount += localPhotographer.isFollowing ? 1 : -1;
  }
};

// 查看摄影师主页
const viewPhotographerProfile = (photographerId) => {
  router.push(`/user/${photographerId}`);
};

// 显示地图标记信息
const showMarkerInfo = (markerId) => {
  hoveredMarker.value = markerId;
};

// 隐藏地图标记信息
const hideMarkerInfo = () => {
  hoveredMarker.value = null;
};

// 选择对话
const selectConversation = (conversationId) => {
  selectedConversation.value = conversationId;
  // 清除未读消息计数
  const conversation = conversations.value.find(c => c.id === conversationId);
  if (conversation) {
    conversation.unreadCount = 0;
  }
};

// 获取选中的对话
const getSelectedConversation = () => {
  return conversations.value.find(c => c.id === selectedConversation.value) || { name: '', avatarUrl: '' };
};

// 发送消息
const sendMessage = () => {
  if (!newMessage.value.trim()) return;
  
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  // 添加新消息
  messagesData.value.push({
    id: Date.now(),
    text: newMessage.value,
    time: time,
    isOwn: true,
  });
  
  // 更新对话列表中的最后消息
  if (selectedConversation.value) {
    const conversation = conversations.value.find(c => c.id === selectedConversation.value);
    if (conversation) {
      conversation.lastMessage = newMessage.value;
      conversation.lastTime = time;
    }
  }
  
  // 清空输入框
  newMessage.value = '';
  
  // 滚动到底部（实际项目中需要实现）
};
</script>

<style>
/* 社区容器样式 */
.community-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 社区头部样式 */
.community-header {
  text-align: center;
  margin-bottom: 32px;
}

.community-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #212529;
  margin-bottom: 8px;
}

.community-header p {
  font-size: 16px;
  color: #6C757D;
}

/* 社区导航样式 */
.community-nav {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.nav-tab {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-tab:hover {
  background-color: #F8F9FA;
  border-color: #0D6EFD;
  color: #0D6EFD;
}

.nav-tab.active {
  background-color: #0D6EFD;
  border-color: #0D6EFD;
  color: #FFFFFF;
}

/* 排行榜区域样式 */
.ranking-section {
  margin-bottom: 48px;
}

.ranking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.ranking-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #212529;
}

.ranking-filters {
  display: flex;
  gap: 8px;
}

.filter-button {
  background: none;
  border: 1px solid #E9ECEF;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 14px;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-button:hover {
  border-color: #0D6EFD;
  color: #0D6EFD;
}

.filter-button.active {
  background-color: #0D6EFD;
  border-color: #0D6EFD;
  color: #FFFFFF;
}

/* 排行榜列表样式 */
.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ranking-item {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.2s ease;
}

.ranking-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.ranking-position {
  flex-shrink: 0;
}

.position-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #F8F9FA;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
}

.position-number.gold {
  background-color: #FFD700;
  color: #FFFFFF;
}

.position-number.silver {
  background-color: #C0C0C0;
  color: #FFFFFF;
}

.position-number.bronze {
  background-color: #CD7F32;
  color: #FFFFFF;
}

.ranking-avatar {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #E9ECEF;
}

.ranking-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ranking-info {
  flex: 1;
  min-width: 0;
}

.ranking-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.ranking-name {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.certification-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.certification-badge.master {
  background-color: #FFF3CD;
  color: #856404;
  border: 1px solid #FFEAA7;
}

.certification-badge.senior {
  background-color: #D1ECF1;
  color: #0C5460;
  border: 1px solid #B8DAE9;
}

.certification-badge.junior {
  background-color: #E7F1FF;
  color: #0D6EFD;
  border: 1px solid #BAD7F2;
}

.ranking-bio {
  font-size: 14px;
  color: #6C757D;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ranking-stats {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #ADB5BD;
}

.ranking-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.follow-button {
  background-color: #0D6EFD;
  color: #FFFFFF;
  border: 1px solid #0D6EFD;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.follow-button:hover {
  background-color: #0B5ED7;
  border-color: #0B5ED7;
}

.follow-button.following {
  background-color: #FFFFFF;
  color: #6C757D;
  border: 1px solid #E9ECEF;
}

.follow-button.following:hover {
  background-color: #F8F9FA;
  border-color: #E9ECEF;
}

.view-button {
  background-color: #FFFFFF;
  color: #495057;
  border: 1px solid #E9ECEF;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-button:hover {
  background-color: #F8F9FA;
  border-color: #0D6EFD;
  color: #0D6EFD;
}

/* 同城摄影师区域样式 */
.local-section {
  margin-bottom: 48px;
}

.local-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.local-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #212529;
}

.location-selector {
  position: relative;
}

.location-button {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: #495057;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.location-button:hover {
  border-color: #0D6EFD;
  color: #0D6EFD;
}

.local-map-container {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  height: 400px;
  position: relative;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  background-color: #F8F9FA;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.map-markers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.map-marker {
  position: absolute;
  cursor: pointer;
}

.marker-dot {
  width: 12px;
  height: 12px;
  background-color: #0D6EFD;
  border-radius: 50%;
  border: 2px solid #FFFFFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.marker-dot:hover,
.marker-dot.active {
  transform: scale(1.5);
  background-color: #0B5ED7;
}

.marker-info {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 8px;
  padding: 12px;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.marker-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
  float: left;
}

.marker-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.marker-details h4 {
  font-size: 14px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 4px 0;
}

.marker-details p {
  font-size: 12px;
  color: #6C757D;
  margin: 0 0 8px 0;
}

.marker-view-button {
  background-color: #0D6EFD;
  color: #FFFFFF;
  border: none;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.marker-view-button:hover {
  background-color: #0B5ED7;
}

.map-loading {
  color: #6C757D;
  font-size: 16px;
}

.local-photographers-list {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  padding: 24px;
}

.local-photographers-list h3 {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin-bottom: 20px;
}

.photographer-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.photographer-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: #F8F9FA;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.photographer-card:hover {
  background-color: #E9ECEF;
}

.card-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.card-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-style {
  font-size: 14px;
  color: #6C757D;
  margin: 0 0 8px 0;
}

.card-stats {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #ADB5BD;
}

.card-follow-button {
  background-color: #FFFFFF;
  color: #495057;
  border: 1px solid #E9ECEF;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.card-follow-button:hover {
  border-color: #0D6EFD;
  color: #0D6EFD;
}

.card-follow-button.following {
  background-color: #E9ECEF;
  color: #6C757D;
}

/* 成就墙区域样式 */
.achievements-section {
  margin-bottom: 48px;
}

.achievements-header {
  text-align: center;
  margin-bottom: 32px;
}

.achievements-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #212529;
  margin-bottom: 8px;
}

.achievements-header p {
  font-size: 16px;
  color: #6C757D;
}

.achievements-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.achievement-item {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
  transition: all 0.2s ease;
}

.achievement-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.achievement-badge {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  flex-shrink: 0;
}

.achievement-badge.bronze {
  background-color: #FFF8E1;
  color: #CD7F32;
  border: 2px solid #FFEAA7;
}

.achievement-badge.silver {
  background-color: #F8F9FA;
  color: #6C757D;
  border: 2px solid #E9ECEF;
}

.achievement-badge.gold {
  background-color: #FFF3CD;
  color: #FFC107;
  border: 2px solid #FFEAA7;
}

.achievement-badge.diamond {
  background-color: #E3F2FD;
  color: #2196F3;
  border: 2px solid #BBDEFB;
}

.achievement-info {
  flex: 1;
  min-width: 0;
}

.achievement-title {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 8px 0;
}

.achievement-description {
  font-size: 14px;
  color: #6C757D;
  margin: 0 0 8px 0;
}

.achievement-stats {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #ADB5BD;
  margin-bottom: 12px;
}

.achievement-actions {
  flex-shrink: 0;
}

.achievement-button {
  background-color: #0D6EFD;
  color: #FFFFFF;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.achievement-button:hover {
  background-color: #0B5ED7;
}

.completed-badge {
  background-color: #D4EDDA;
  color: #155724;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

/* 私信系统样式 */
.messages-section {
  margin-bottom: 48px;
}

.messages-layout {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  height: 600px;
}

.messages-sidebar {
  width: 320px;
  border-right: 1px solid #E9ECEF;
  display: flex;
  flex-direction: column;
}

.messages-search {
  padding: 16px;
  border-bottom: 1px solid #E9ECEF;
}

.search-input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #E9ECEF;
  border-radius: 20px;
  font-size: 14px;
  color: #495057;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #0D6EFD;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  padding: 16px;
  border-bottom: 1px solid #E9ECEF;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.conversation-item:hover {
  background-color: #F8F9FA;
}

.conversation-item.active {
  background-color: #E7F1FF;
}

.conversation-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
}

.conversation-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.unread-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: #DC3545;
  color: #FFFFFF;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  border: 2px solid #FFFFFF;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.conversation-name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.conversation-name {
  font-size: 14px;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.conversation-time {
  font-size: 12px;
  color: #ADB5BD;
}

.conversation-last-message {
  font-size: 14px;
  color: #6C757D;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.messages-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.message-thread {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.thread-header {
  padding: 16px 24px;
  border-bottom: 1px solid #E9ECEF;
  display: flex;
  align-items: center;
  gap: 12px;
}

.thread-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.thread-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thread-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 4px 0;
}

.thread-status {
  font-size: 12px;
  color: #198754;
}

.thread-messages {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  position: relative;
}

.message-bubble.own {
  align-self: flex-end;
  background-color: #0D6EFD;
  color: #FFFFFF;
  border-bottom-right-radius: 4px;
}

.message-bubble.other {
  align-self: flex-start;
  background-color: #F8F9FA;
  color: #212529;
  border-bottom-left-radius: 4px;
}

.message-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.message-time {
  position: absolute;
  bottom: -20px;
  font-size: 12px;
  color: #ADB5BD;
}

.message-bubble.own .message-time {
  right: 0;
}

.message-bubble.other .message-time {
  left: 0;
}

.thread-input {
  padding: 16px 24px;
  border-top: 1px solid #E9ECEF;
  display: flex;
  align-items: center;
  gap: 12px;
}

.input-tools {
  display: flex;
  gap: 8px;
}

.tool-button {
  width: 40px;
  height: 40px;
  border: 1px solid #E9ECEF;
  background-color: #FFFFFF;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.tool-button:hover {
  background-color: #F8F9FA;
  border-color: #0D6EFD;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #E9ECEF;
  border-radius: 24px;
  font-size: 14px;
  color: #212529;
  outline: none;
  transition: border-color 0.2s ease;
}

.message-input:focus {
  border-color: #0D6EFD;
}

.send-button {
  background-color: #0D6EFD;
  color: #FFFFFF;
  border: none;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.send-button:hover {
  background-color: #0B5ED7;
}

.no-conversation {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6C757D;
}

.no-conversation-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-conversation h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #495057;
}

.no-conversation p {
  font-size: 14px;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .achievements-list {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  
  .photographer-cards {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .community-container {
    padding: 0 16px;
  }
  
  .community-nav {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 8px;
  }
  
  .ranking-header,
  .local-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .ranking-filters {
    flex-wrap: wrap;
  }
  
  .ranking-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .ranking-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .messages-layout {
    flex-direction: column;
    height: 500px;
  }
  
  .messages-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #E9ECEF;
    max-height: 200px;
  }
  
  .achievement-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .achievement-actions {
    width: 100%;
    text-align: center;
  }
  
  .message-bubble {
    max-width: 85%;
  }
}

@media (max-width: 480px) {
  .community-header h1 {
    font-size: 24px;
  }
  
  .nav-tab {
    padding: 10px 16px;
    font-size: 14px;
  }
  
  .ranking-header h2,
  .local-header h2,
  .achievements-header h2 {
    font-size: 20px;
  }
  
  .map-placeholder {
    height: 300px;
  }
  
  .photographer-cards {
    grid-template-columns: 1fr;
  }
  
  .marker-info {
    min-width: 150px;
    padding: 8px;
  }
  
  .marker-details h4 {
    font-size: 12px;
  }
  
  .marker-details p {
    font-size: 10px;
  }
}
</style>