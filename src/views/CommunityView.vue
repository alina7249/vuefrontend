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
    <!-- 帖子列表区域 -->
    <div v-else-if="currentTab === 'posts'" class="posts-section">
      <div class="posts-layout">
        <!-- 左栏：社区导航 -->
        <div class="posts-sidebar">
          <!-- 帖子分类 -->
          <div class="category-section">
            <h3>帖子分类</h3>
            <ul class="category-list">
              <li 
                v-for="category in postCategories" 
                :key="category.value"
                class="category-item"
                :class="{ active: currentCategory === category.value }"
                @click="currentCategory = category.value"
              >
                <span class="category-icon">{{ category.icon }}</span>
                <span class="category-name">{{ category.label }}</span>
              </li>
            </ul>
          </div>
          
          <!-- 热门话题 -->
          <div class="topics-section">
            <h3>热门话题</h3>
            <ul class="topics-list">
              <li v-for="topic in hotTopics" :key="topic.id" class="topic-item">
                <span class="topic-hashtag"># {{ topic.name }}</span>
                <span class="topic-count">{{ topic.count }} 人讨论</span>
              </li>
            </ul>
          </div>
          
          <!-- 活跃用户 -->
          <div class="active-users-section">
            <h3>活跃用户</h3>
            <div class="active-users-list">
              <div v-for="user in activeUsers" :key="user.id" class="active-user-item">
                <div class="user-avatar">
                  <img :src="user.avatarUrl" :alt="user.name" />
                </div>
                <div class="user-info">
                  <span class="user-name">{{ user.name }}</span>
                </div>
                <button 
                  class="follow-user-button"
                  :class="{ following: user.isFollowing }"
                  @click="toggleUserFollow(user.id)"
                >
                  {{ user.isFollowing ? '已关注' : '关注' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右栏：帖子列表 -->
        <div class="posts-main">
          <!-- 排序工具栏 -->
          <div class="posts-toolbar">
            <div class="sort-options">
              <button 
                v-for="option in sortOptions" 
                :key="option.value"
                class="sort-button"
                :class="{ active: currentSort === option.value }"
                @click="currentSort = option.value"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
          
          <!-- 帖子列表 -->
          <div class="posts-list">
            <div 
              v-for="post in filteredPosts" 
              :key="post.id" 
              class="post-item"
              @click="viewPostDetail(post.id)"
            >
              <div class="post-avatar">
                <img :src="post.authorAvatar" :alt="post.authorName" />
              </div>
              
              <div class="post-content">
                <h4 class="post-title">{{ post.title }}</h4>
                <p class="post-summary">{{ post.summary }}</p>
                <div class="post-tags">
                  <span v-for="tag in post.tags" :key="tag" class="post-tag">{{ tag }}</span>
                </div>
              </div>
              
              <div class="post-stats">
                <span class="stat-item">
                  <i class="stat-icon">💬</i>
                  {{ post.commentCount }}
                </span>
                <span class="stat-item">
                  <i class="stat-icon">👍</i>
                  {{ post.likeCount }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- 加载更多 -->
          <div v-if="isLoadingMore" class="loading-more">
            <div class="loading-spinner"></div>
            <span>加载中...</span>
          </div>
          
          <div v-else-if="hasMorePosts" class="load-more-trigger" @click="loadMorePosts">
            点击加载更多
          </div>
          
          <div v-else-if="filteredPosts.length > 0" class="no-more-posts">
            没有更多帖子了
          </div>
          
          <div v-else class="no-posts">
            <div class="no-posts-icon">📝</div>
            <p>暂无相关帖子</p>
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
const currentTab = ref('posts');
const communityTabs = [
  { label: '帖子', value: 'posts' },
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

// 帖子相关数据
const currentCategory = ref('all');
const currentSort = ref('latest');
const isLoadingMore = ref(false);
const hasMorePosts = ref(true);
const displayedPostsCount = ref(10);

// 帖子分类
const postCategories = [
  { label: '全部', value: 'all', icon: '📋' },
  { label: '问答求助', value: 'help', icon: '❓' },
  { label: '作品分享', value: 'share', icon: '📷' },
  { label: '经验交流', value: 'experience', icon: '💡' },
  { label: '器材讨论', value: 'equipment', icon: '🎥' }
];

// 排序选项
const sortOptions = [
  { label: '最新发布', value: 'latest' },
  { label: '热门', value: 'popular' },
  { label: '高评论', value: 'comments' }
];

// 热门话题
const hotTopics = ref([
  { id: 1, name: '新手如何选相机', count: 238 },
  { id: 2, name: '风光摄影技巧', count: 187 },
  { id: 3, name: '人像拍摄构图', count: 156 },
  { id: 4, name: '后期修图教程', count: 124 },
  { id: 5, name: '无人机摄影', count: 98 }
]);

// 活跃用户
const activeUsers = ref([
  { id: 101, name: '风光大师', avatarUrl: 'https://picsum.photos/100/100?random=101', isFollowing: false },
  { id: 102, name: '人像摄影师', avatarUrl: 'https://picsum.photos/100/100?random=102', isFollowing: true },
  { id: 103, name: '器材党', avatarUrl: 'https://picsum.photos/100/100?random=103', isFollowing: false }
]);

// 模拟帖子数据
const postsData = ref([
  {
    id: 1,
    title: '新手求助：如何选择第一台单反相机？',
    summary: '刚接触摄影，预算5000左右，主要想拍风光和人像，有什么推荐吗？',
    content: '大家好，我是摄影新手，最近对摄影产生了浓厚的兴趣，想入手第一台单反相机。我的预算大概在5000元左右，主要想拍风光和人像。我已经看了几款相机：佳能EOS 200D II、尼康D3500和索尼A5100。想请教各位大神，哪一款更适合新手？有没有其他更好的推荐？另外，镜头应该怎么选择呢？',
    authorName: '摄影新手',
    authorAvatar: 'https://picsum.photos/100/100?random=1',
    category: 'help',
    tags: ['相机推荐', '新手入门', '预算5000', '风光摄影', '人像摄影'],
    imageUrls: [],
    commentCount: 24,
    likeCount: 56,
    createdAt: '2023-10-15T10:30:00',
    viewCount: 356
  },
  {
    id: 2,
    title: '【作品分享】秋日银杏人像',
    summary: '周末去公园拍的银杏人像，第一次尝试这种风格，大家觉得怎么样？',
    content: '上周末和朋友去了中山公园拍银杏人像，这是我第一次尝试这种温暖色调的人像拍摄。使用的设备是索尼A7M3 + 85mm F1.8镜头，光圈F2.0，快门1/200，ISO100。后期主要调整了色温偏暖，加强了金黄色调，轻微磨皮保留细节。想请大家帮忙看看有什么可以改进的地方，尤其是构图和光线方面。',
    authorName: '人像摄影师',
    authorAvatar: 'https://picsum.photos/100/100?random=2',
    category: 'share',
    tags: ['人像', '银杏', '秋季', '索尼', '85mm', '自然光'],
    imageUrls: [
      'https://picsum.photos/800/600?random=21',
      'https://picsum.photos/800/600?random=22'
    ],
    commentCount: 38,
    likeCount: 124,
    createdAt: '2023-10-14T15:45:00',
    viewCount: 892
  },
  {
    id: 3,
    title: '浅谈风光摄影中的构图技巧',
    summary: '总结了一些个人在风光摄影中的构图经验，希望对大家有帮助。',
    content: '作为一名有5年经验的风光摄影爱好者，今天想和大家分享一些实用的构图技巧。\n\n1. 三分法构图：将画面分为九宫格，将主体放在交叉点上\n2. 引导线构图：利用道路、河流等自然线条引导视线\n3. 框架式构图：利用门窗、树干等形成天然框架\n4. 对角线构图：创造动感和延伸感\n5. 黄金螺旋：更自然的视觉引导\n\n个人认为，构图没有绝对的规则，最重要的是要表达出自己的情感和想法。附上几张示例照片，欢迎大家交流讨论。',
    authorName: '风光大师',
    authorAvatar: 'https://picsum.photos/100/100?random=3',
    category: 'experience',
    tags: ['风光', '构图', '技巧', '三分法', '引导线', '黄金螺旋'],
    imageUrls: [
      'https://picsum.photos/800/600?random=31',
      'https://picsum.photos/800/600?random=32',
      'https://picsum.photos/800/600?random=33'
    ],
    commentCount: 42,
    likeCount: 189,
    createdAt: '2023-10-13T09:20:00',
    viewCount: 1245
  },
  {
    id: 4,
    title: '索尼A7M4使用体验分享',
    summary: '使用A7M4三个月的心得，包括优缺点分析和使用技巧。',
    content: '入手索尼A7M4已经三个月了，从A7M3升级过来，想和大家分享一下真实使用感受。\n\n优点：\n1. 3300万像素传感器，细节表现出色\n2. 对焦系统大幅提升，眼部识别更精准\n3. 10-bit 4:2:2内录，视频能力强大\n4. 电池续航明显改善\n5. 菜单系统优化，操作更便捷\n\n缺点：\n1. 高感表现相比A7M3略有下降\n2. 机身发热问题在长时间拍摄视频时仍然存在\n3. 价格偏高\n\n实用技巧：\n- 自定义按键设置可以大幅提升拍摄效率\n- S-Cinetone色彩科学非常适合直出\n- 建议搭配索尼原厂镜头获得最佳体验\n\n总体来说，A7M4是一款非常全面的相机，适合专业摄影师和摄影爱好者使用。',
    authorName: '器材党',
    authorAvatar: 'https://picsum.photos/100/100?random=4',
    category: 'equipment',
    tags: ['索尼', 'A7M4', '器材', '微单', '使用体验', '优缺点', '视频拍摄'],
    imageUrls: [
      'https://picsum.photos/800/600?random=41'
    ],
    commentCount: 67,
    likeCount: 234,
    createdAt: '2023-10-12T14:10:00',
    viewCount: 1876
  },
  {
    id: 5,
    title: '求推荐一款适合旅行的轻便三脚架',
    summary: '经常出去旅行拍照，想要一款轻便但稳定的三脚架，大家有什么好推荐？',
    content: '最近经常出去旅行拍照，需要一款轻便但又能保证稳定性的三脚架。我的需求是：\n1. 重量最好在1.5kg以下\n2. 收纳后长度不超过50cm\n3. 能承受至少2kg的重量（我的相机+镜头大概1.8kg）\n4. 预算1000元左右\n\n我看了几款：曼富图Befree、富图宝X4i、思锐T-025X，不知道哪个更适合？或者有其他更好的推荐吗？主要用于旅行中的风光和夜景拍摄。',
    authorName: '旅行摄影师',
    authorAvatar: 'https://picsum.photos/100/100?random=5',
    category: 'help',
    tags: ['三脚架', '旅行', '配件', '轻便', '夜景', '风光'],
    imageUrls: [],
    commentCount: 18,
    likeCount: 36,
    createdAt: '2023-10-11T11:50:00',
    viewCount: 432
  },
  {
    id: 6,
    title: '【城市夜景】上海外滩灯光秀',
    summary: '昨晚在外滩拍摄的灯光秀，分享一些拍摄参数和后期思路。',
    content: '昨晚在外滩拍摄了灯光秀，天气非常给力，给大家分享一下拍摄参数和后期思路。\n\n拍摄参数：\n- 相机：佳能EOS R6\n- 镜头：24-70mm F2.8\n- 光圈：F8\n- 快门：8秒\n- ISO：100\n- 三脚架：必须使用，保持稳定\n\n拍摄技巧：\n1. 使用延时快门或遥控器，避免按快门时的震动\n2. 寻找合适的前景，增加画面层次感\n3. 黄金时段（蓝调时分）拍摄效果最佳\n\n后期思路：\n- 轻微提高对比度和饱和度\n- 调整色温偏冷，突出城市夜景的现代感\n- 加强暗部细节\n- 使用渐变滤镜压暗天空\n\n第一次拍外滩夜景，欢迎大家指点！',
    authorName: '夜景达人',
    authorAvatar: 'https://picsum.photos/100/100?random=6',
    category: 'share',
    tags: ['夜景', '城市', '上海', '外滩', '灯光秀', '长曝光', '蓝调时分'],
    imageUrls: [
      'https://picsum.photos/800/600?random=61',
      'https://picsum.photos/800/600?random=62',
      'https://picsum.photos/800/600?random=63'
    ],
    commentCount: 29,
    likeCount: 87,
    createdAt: '2023-10-10T20:30:00',
    viewCount: 945
  },
  {
    id: 7,
    title: '如何用手机拍出专业级照片',
    summary: '现代手机相机性能越来越强，掌握这些技巧，手机也能拍出好照片。',
    content: '现在的手机相机性能已经非常强大，只要掌握一些技巧，完全可以拍出媲美专业相机的照片。今天就和大家分享一下我的手机摄影经验。\n\n基础技巧：\n1. 保持手机稳定，使用网格辅助构图\n2. 点击屏幕对焦并调整曝光\n3. 利用手机的人像模式拍摄背景虚化效果\n4. 尝试不同的角度和高度\n\n进阶技巧：\n1. 使用手机三脚架和延时摄影功能拍摄夜景\n2. 善用HDR模式应对大光比场景\n3. 尝试使用慢动作和延时摄影创作\n4. 学习基础的后期处理\n\n推荐APP：\n- 拍摄：原生相机、ProCam X\n- 后期：Snapseed、Lightroom Mobile\n- 创意：PicsArt、Union（双重曝光）\n\n最重要的是多拍多练，培养自己的摄影眼。附上几张用iPhone 13 Pro拍摄的照片，全部手机直出+简单后期。',
    authorName: '手机摄影',
    authorAvatar: 'https://picsum.photos/100/100?random=7',
    category: 'experience',
    tags: ['手机摄影', '技巧', '入门', 'iPhone', '后期', 'APP推荐', '构图'],
    imageUrls: [
      'https://picsum.photos/800/600?random=71',
      'https://picsum.photos/800/600?random=72'
    ],
    commentCount: 53,
    likeCount: 167,
    createdAt: '2023-10-09T16:40:00',
    viewCount: 2341
  },
  {
    id: 8,
    title: '佳能R5与尼康Z7II对比评测',
    summary: '两款热门全画幅微单相机的详细对比，帮助你做出选择。',
    content: '最近有很多朋友问我佳能R5和尼康Z7II该如何选择，今天就给大家做一个详细的对比评测。\n\n参数对比：\n- 传感器：佳能4500万像素 vs 尼康4575万像素\n- 对焦：佳能双像素对焦 vs 尼康复合自动对焦系统\n- 连拍：佳能20fps（电子快门） vs 尼康10fps\n- 视频：佳能8K内录 vs 尼康4K 60p\n- 防抖：佳能机身8级防抖 vs 尼康机身5轴防抖\n\n实际使用体验：\n1. 佳能R5优势在于视频能力和对焦系统，但发热问题需要注意\n2. 尼康Z7II优势在于高感表现和电池续航\n3. 镜头生态方面，佳能RF卡口镜头选择更多，但尼康Z口镜头素质也很高\n4. 操作习惯因人而异，佳能菜单更直观，尼康按键布局更专业\n\n购买建议：\n- 以视频创作为主：推荐佳能R5\n- 以静态摄影为主：两款都可以，根据品牌偏好选择\n- 预算充足且重视综合性能：佳能R5\n- 注重性价比：尼康Z7II\n\n最后，没有完美的相机，只有最适合自己的相机。希望这个对比能帮助大家做出选择。',
    authorName: '器材评测师',
    authorAvatar: 'https://picsum.photos/100/100?random=8',
    category: 'equipment',
    tags: ['佳能', '尼康', '对比', '评测', 'R5', 'Z7II', '微单', '全画幅'],
    imageUrls: [
      'https://picsum.photos/800/600?random=81',
      'https://picsum.photos/800/600?random=82'
    ],
    commentCount: 78,
    likeCount: 245,
    createdAt: '2023-10-08T13:20:00',
    viewCount: 2890
  },
  {
    id: 9,
    title: '求问如何拍摄星空',
    summary: '想尝试星空摄影，但不知道需要哪些装备和参数设置，求指导！',
    content: '一直对星空摄影很感兴趣，最近终于有机会去郊外拍摄了，但是没有什么经验，想请教各位大神几个问题：\n\n1. 除了相机和三脚架，还需要哪些必备装备？赤道仪有必要吗？\n2. 拍摄参数一般怎么设置？光圈、快门、ISO大概多少合适？\n3. 有什么推荐的拍摄地点和时间？\n4. 后期处理有什么技巧？\n\n我的设备是索尼A7R3 + 16-35mm F2.8镜头，应该可以拍星空吧？希望大家能分享一些经验，谢谢！',
    authorName: '星空爱好者',
    authorAvatar: 'https://picsum.photos/100/100?random=9',
    category: 'help',
    tags: ['星空', '夜景', '新手', '索尼', '16-35mm', '参数设置', '后期处理'],
    imageUrls: [],
    commentCount: 34,
    likeCount: 78,
    createdAt: '2023-10-07T21:10:00',
    viewCount: 654
  },
  {
    id: 10,
    title: '【生态摄影】野生鸟类拍摄作品集',
    summary: '分享近期在湿地拍摄的野生鸟类照片，记录大自然的美丽瞬间。',
    content: '最近去了郊外的湿地保护区，拍摄了一些野生鸟类的照片。使用的设备是佳能EOS R3 + 100-500mm镜头，配合1.4倍增距镜。\n\n拍摄心得：\n1. 耐心是关键，有时候需要等待数小时才能捕捉到理想的瞬间\n2. 了解鸟类的习性和栖息环境非常重要\n3. 使用高速连拍模式提高成功率\n4. 早晨和傍晚是拍摄的黄金时段\n5. 保持安静，避免惊吓到鸟类\n\n这次拍摄最大的收获是拍到了一只罕见的白鹭捕鱼的瞬间，分享给大家，希望大家喜欢！',
    authorName: '生态摄影师',
    authorAvatar: 'https://picsum.photos/100/100?random=10',
    category: 'share',
    tags: ['生态摄影', '鸟类', '野生动物', '佳能', '长焦', '湿地'],
    imageUrls: [
      'https://picsum.photos/800/600?random=101',
      'https://picsum.photos/800/600?random=102',
      'https://picsum.photos/800/600?random=103'
    ],
    commentCount: 47,
    likeCount: 198,
    createdAt: '2023-10-06T08:20:00',
    viewCount: 1354
  },
  {
    id: 11,
    title: '室内人像布光技巧分享',
    summary: '从零开始学习室内人像布光，打造专业质感照片。',
    content: '很多摄影爱好者在室外拍摄得心应手，但一到室内就不知所措。今天我来分享几个实用的室内人像布光技巧。\n\n基础三点布光：\n1. 主光：照亮主体的主要光源，通常位于模特45度角上方\n2. 辅助光：减弱主光造成的阴影，位于另一侧\n3. 背光：勾勒主体轮廓，增加深度感\n\n简易布光方案：\n- 两盏灯设置：主光+反光板\n- 单灯设置：窗户自然光+反光板\n\n实用设备推荐：\n- 神牛SL60W LED常亮灯\n- 柔光箱和反光伞\n- 简易背景纸\n\n附上几张不同布光方案的对比照片，希望对大家有帮助！',
    authorName: '灯光师小王',
    authorAvatar: 'https://picsum.photos/100/100?random=11',
    category: 'experience',
    tags: ['人像', '布光', '室内摄影', '技巧', '灯光', '三点布光'],
    imageUrls: [
      'https://picsum.photos/800/600?random=111',
      'https://picsum.photos/800/600?random=112'
    ],
    commentCount: 58,
    likeCount: 213,
    createdAt: '2023-10-05T14:30:00',
    viewCount: 1789
  },
  {
    id: 12,
    title: '富士XT5深度评测：复古外观下的现代性能',
    summary: '上手富士XT5两周，从外观到性能的全面体验。',
    content: '作为一名富士粉丝，我第一时间入手了XT5，使用两周后，想和大家分享一下真实体验。\n\n外观与操控：\n- 复古设计非常漂亮，金属机身质感出色\n- 拨盘操作直观，手动控制感强\n- 机身重量适中，长时间拍摄不累\n\n性能表现：\n- 4000万像素传感器，细节丰富\n- 对焦系统相比XT4有明显提升\n- 内置5轴防抖，手持拍摄更稳定\n- 胶片模拟依然是富士的最大特色\n\n缺点：\n- 电池续航一般，建议多备一块\n- 视频功能相比竞品略显不足\n\n总体来说，XT5是一款非常适合街拍、人文和风光摄影的相机，尤其是喜欢胶片风格的摄影师，绝对值得考虑。',
    authorName: '富士用户',
    authorAvatar: 'https://picsum.photos/100/100?random=12',
    category: 'equipment',
    tags: ['富士', 'XT5', '评测', '复古相机', 'APS-C', '胶片模拟'],
    imageUrls: [
      'https://picsum.photos/800/600?random=121',
      'https://picsum.photos/800/600?random=122'
    ],
    commentCount: 63,
    likeCount: 256,
    createdAt: '2023-10-04T11:15:00',
    viewCount: 2431
  }
]);

// 计算属性：过滤和排序帖子
{
    id: 10,
    title; '【生态摄影】野生鸟类拍摄作品集',
    summary; '分享近期拍摄的野生鸟类照片,使用了600mm长焦镜头。',
    authorName; '生态摄影师',
    authorAvatar; 'https://picsum.photos/100/100?random=10',
    category; 'share',
    tags; ['生态', '鸟类', '长焦'],
    commentCount; 21,
    likeCount; 76,
    createdAt; '2023-10-06T08:50:00'
  }
  {
    id: 11,
    title; '后期修图中如何调整白平衡',
    summary; '详细讲解白平衡的概念和在后期修图中的调整技巧。',
    authorName; '修图师',
    authorAvatar; 'https://picsum.photos/100/100?random=11',
    category; 'experience',
    tags; ['后期', '白平衡', '修图'],
    commentCount; 45,
    likeCount; 132,
    createdAt; '2023-10-05T15:30:00'
  }
  {
    id: 12,
    title; '富士X-T4使用一年心得',
    summary; '作为一名街头摄影师，富士X-T4陪伴我一年的使用感受。',
    authorName; '街头摄影师',
    authorAvatar; 'https://picsum.photos/100/100?random=12',
    category; 'equipment',
    tags; ['富士', 'X-T4', '街拍'],
    commentCount; 37,
    likeCount; 98,
    createdAt; '2023-10-04T12:15:00'
  }


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

// 根据分类和排序过滤帖子
const filteredPosts = computed(() => {
  let filtered = [...postsData.value];
  
  // 按分类过滤
  if (currentCategory.value !== 'all') {
    filtered = filtered.filter(post => post.category === currentCategory.value);
  }
  
  // 按排序选项排序
  switch (currentSort.value) {
    case 'latest':
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'popular':
      filtered.sort((a, b) => b.likeCount - a.likeCount);
      break;
    case 'comments':
      filtered.sort((a, b) => b.commentCount - a.commentCount);
      break;
  }
  
  // 限制显示数量
  return filtered.slice(0, displayedPostsCount.value);
});

// 加载更多帖子
const loadMorePosts = () => {
  if (isLoadingMore.value || displayedPostsCount.value >= postsData.value.length) return;
  
  isLoadingMore.value = true;
  
  // 模拟加载延迟
  setTimeout(() => {
    displayedPostsCount.value += 5;
    isLoadingMore.value = false;
    
    // 检查是否还有更多帖子
    hasMorePosts.value = displayedPostsCount.value < postsData.value.length;
  }, 1000);
};

// 查看帖子详情
const viewPostDetail = (postId) => {
  router.push(`/post/${postId}`);
};

// 切换用户关注状态
const toggleUserFollow = (userId) => {
  const user = activeUsers.value.find(u => u.id === userId);
  if (user) {
    user.isFollowing = !user.isFollowing;
  }
};

// 监听滚动事件，实现下拉加载更多
const handleScroll = () => {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const clientHeight = document.documentElement.clientHeight;
  
  // 当滚动到底部附近时，加载更多
  if (scrollTop + clientHeight >= scrollHeight - 200 && !isLoadingMore.value && hasMorePosts.value) {
    loadMorePosts();
  }
};

// 添加滚动监听
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', handleScroll);
}

// 组件卸载时移除滚动监听
const cleanup = () => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll);
  }
};

// 在组件卸载时执行清理
import { onUnmounted } from 'vue';
onUnmounted(cleanup);
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

/* 帖子列表样式 */
.posts-section {
  margin-bottom: 48px;
}

.posts-layout {
  display: flex;
  gap: 24px;
  min-height: 600px;
}

/* 左栏：社区导航 */
.posts-sidebar {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 帖子分类样式 */
.category-section h3,
.topics-section h3,
.active-users-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin-bottom: 16px;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  border-radius: 0 8px 8px 0;
}

.category-item:hover {
  background-color: #F8F9FA;
}

.category-item.active {
  background-color: #FFF7E6;
  border-left-color: #FF7E00;
  font-weight: 500;
  color: #FF7E00;
}

.category-icon {
  font-size: 18px;
}

.category-name {
  font-size: 14px;
}

/* 热门话题样式 */
.topics-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.topic-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 8px;
}

.topic-item:hover {
  background-color: #F8F9FA;
}

.topic-hashtag {
  display: block;
  font-size: 14px;
  color: #212529;
  margin-bottom: 4px;
}

.topic-count {
  font-size: 12px;
  color: #6C757D;
}

/* 活跃用户样式 */
.active-users-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.active-user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.active-user-item:hover {
  background-color: #F8F9FA;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-size: 14px;
  color: #212529;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.follow-user-button {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  border: 1px solid #0D6EFD;
  background-color: #FFFFFF;
  color: #0D6EFD;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.follow-user-button:hover {
  background-color: #0D6EFD;
  color: #FFFFFF;
}

.follow-user-button.following {
  border-color: #6C757D;
  color: #6C757D;
}

.follow-user-button.following:hover {
  background-color: #6C757D;
  color: #FFFFFF;
}

/* 右栏：帖子列表 */
.posts-main {
  flex: 1;
  min-width: 0;
}

/* 排序工具栏 */
.posts-toolbar {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 16px;
}

.sort-options {
  display: flex;
  gap: 12px;
}

.sort-button {
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 14px;
  border: 1px solid #E9ECEF;
  background-color: #FFFFFF;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-button:hover {
  border-color: #0D6EFD;
  color: #0D6EFD;
}

.sort-button.active {
  background-color: #0D6EFD;
  border-color: #0D6EFD;
  color: #FFFFFF;
}

/* 帖子列表样式 */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.post-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.post-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.post-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content {
  flex: 1;
  min-width: 0;
}

.post-title {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 8px 0;
  transition: color 0.2s ease;
}

.post-item:hover .post-title {
  color: #0D6EFD;
}

.post-summary {
  font-size: 14px;
  color: #6C757D;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.post-tag {
  font-size: 12px;
  color: #6C757D;
  background-color: #F8F9FA;
  padding: 4px 10px;
  border-radius: 12px;
}

.post-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  flex-shrink: 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #6C757D;
}

.stat-icon {
  font-size: 16px;
}

/* 加载更多样式 */
.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  color: #6C757D;
  font-size: 14px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #E9ECEF;
  border-top: 2px solid #0D6EFD;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.load-more-trigger {
  text-align: center;
  padding: 24px;
  color: #0D6EFD;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s ease;
}

.load-more-trigger:hover {
  color: #0B5ED7;
  text-decoration: underline;
}

.no-more-posts,
.no-posts {
  text-align: center;
  padding: 48px 24px;
  color: #6C757D;
  font-size: 14px;
}

.no-posts-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

/* 响应式设计 - 帖子列表部分 */
@media (max-width: 992px) {
  .posts-layout {
    flex-direction: column;
  }
  
  .posts-sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .category-section,
  .topics-section,
  .active-users-section {
    width: calc(50% - 12px);
  }
}

@media (max-width: 768px) {
  .posts-sidebar {
    flex-direction: column;
  }
  
  .category-section,
  .topics-section,
  .active-users-section {
    width: 100%;
  }
  
  .post-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .post-stats {
    flex-direction: row;
    align-items: center;
    align-self: stretch;
    padding-top: 12px;
    border-top: 1px solid #E9ECEF;
    margin-top: 12px;
  }
  
  .post-avatar {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 576px) {
  .sort-options {
    flex-wrap: wrap;
  }
  
  .sort-button {
    flex: 1;
    min-width: 100px;
    text-align: center;
  }
  
  .post-title {
    font-size: 15px;
  }
  
  .post-summary {
    font-size: 13px;
  }
}

/* 其他响应式设计 */
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