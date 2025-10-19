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
          
          <router-link :to="'/user/' + photographer.id" class="ranking-avatar" title="查看个人主页">
            <img :src="photographer.avatarUrl" :alt="photographer.name" />
          </router-link>
          
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
                <router-link :to="'/user/' + user.id" class="user-avatar" title="查看个人主页">
            <img :src="user.avatarUrl" :alt="user.name" />
          </router-link>
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
              <router-link :to="'/user/' + post.authorId" class="post-avatar" title="查看个人主页">
                <img :src="post.authorAvatar" :alt="post.authorName" />
              </router-link>
              
              <div class="post-content">
                <div class="post-author-name">{{ post.authorName }}</div>
                <h4 class="post-title">{{ post.title }}</h4>
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
    title: '求助！新手想入门摄影，纠结选哪款相机好~',
    summary: '最近突然迷上摄影，预算5000左右想入手第一台相机，主要想拍拍风景和朋友，求大神们推荐~',
    content: 'hi大家好！我是完全的摄影小白，最近刷小红书看到好多漂亮照片，突然就对摄影产生了兴趣~\n\n预算大概5000块左右，主要想拍点风景照和给朋友拍拍人像。我自己做了点功课，看了佳能EOS 200D II、尼康D3500和索尼A5100，但是完全不知道怎么选...有没有用过这些相机的朋友能分享下真实体验？\n\n另外镜头应该怎么选啊？套机镜头够用吗？还是需要额外买？\n\n小白提问，勿喷~感激不尽！❤️',
    authorName: '摄影小白小明',
    authorAvatar: 'https://picsum.photos/100/100?random=1',
    authorId: 101,
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
    title: '周末拍了组银杏人像！第一次尝试这种风格，求轻拍~',
    summary: '上周和闺蜜去中山公园拍银杏，第一次拍这种温暖色调的照片，大家帮我看看有什么可以改进的？',
    content: '上周末终于赶上银杏季的尾巴啦！拉着闺蜜去中山公园拍了一组照片~这是我第一次尝试这种温暖色调的人像，还有点小紧张呢😆\n\n设备用的是索尼A7M3 + 85mm F1.8，那天光线特别好，几乎都是自然光拍摄。参数大概是光圈F2.0，快门1/200，ISO100这样。后期主要就是把色温调暖了一点，加强了金黄色调，给闺蜜稍微磨了个皮但尽量保留细节~\n\n第一次拍这种风格，感觉构图还有点生硬，光线处理也不太到位...请各位大神指点下，尤其是构图和光线方面有什么可以改进的地方？万分感谢！\n\n附两张我觉得还不错的成片~',
    authorName: '喜欢拍照的小李',
    authorAvatar: 'https://picsum.photos/100/100?random=2',
    authorId: 102,
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
    title: '分享几个我拍风光时常用的构图技巧！亲测好用~',
    summary: '玩了5年风光摄影，总结了几个超实用的构图方法，新手朋友可以参考一下！',
    content: '作为一个玩了5年风光摄影的老油条😂今天想和刚入门的朋友们分享几个我平时拍照最常用的构图技巧~\n\n1️⃣ 三分法构图：这个应该是最基础的了！把画面想象成九宫格，把重点放在四个交叉点上，比如把地平线放在下三分之一处，会让天空更有层次感~\n\n2️⃣ 引导线构图：利用道路、河流这些自然线条，把观众的视线引导到你想突出的地方，超有用！上次拍长城的时候就用了这个技巧~\n\n3️⃣ 框架式构图：找个天然的框架（比如树洞、拱门）把主体框起来，瞬间增加画面层次感！\n\n4️⃣ 对角线构图：让画面里的元素呈对角线分布，会显得更有动感，特别适合拍山脉或者海岸线~\n\n其实构图这东西没有绝对的规则，最重要的是表达出你想传达的感觉！附上几张我用这些技巧拍的照片，欢迎大家一起交流~你们平时最喜欢用哪种构图？',
    authorName: '大山的风光日记',
    authorAvatar: 'https://picsum.photos/100/100?random=3',
    authorId: 103,
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
    title: 'A7M4用了三个月，分享真实感受！优缺点都有~',
    summary: '从A7M3升级到A7M4三个月了，说说真实体验，给纠结要不要升级的朋友做个参考',
    content: '作为一个从A7M3升级到A7M4的用户，用了三个月想和大家聊聊真实感受~\n\n先说好的方面：\n✅ 3300万像素真的香！细节比M3好太多了，放大看睫毛都清晰~\n✅ 对焦系统真的升级了！尤其是拍娃的时候，眼部识别快准狠，再也不用担心娃跑焦了😂\n✅ 视频能力提升明显，10-bit内录色彩确实好很多\n✅ 电池续航终于给力了！出门拍一天基本不用带备用电池了\n✅ 菜单比之前好用多了，终于不用翻七八层菜单了~\n\n缺点也得说说：\n❌ 高感感觉反而不如M3，晚上拍噪点有点明显\n❌ 拍视频时间长了还是有点发热，夏天出门得带个小风扇\n❌ 价格是真的贵...钱包在滴血\n\n小技巧分享：强烈建议大家好好研究自定义按键！设置好了效率提升不是一点点~还有S-Cinetone模式直出真的好看！\n\n总体来说，如果是拍视频为主或者需要更高像素，升级还是值得的，但如果只是拍照且对像素要求不高，M3其实完全够用啦~\n\n大家有什么问题可以在评论区问我哦！',
    authorName: '器材党老王',
    authorAvatar: 'https://picsum.photos/100/100?random=4',
    authorId: 104,
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
    title: '有什么轻便三脚架推荐吗？旅行党急需！',
    summary: '每次旅行带三脚架都累成狗，求推荐轻便但稳的三脚架，预算1000左右~',
    content: '最近频繁出去旅行拍照，原来的三脚架太重了！每次背出去都像背了块砖😭有没有轻便一点但又不会太晃的三脚架推荐啊？\n\n我的基本需求：\n✨ 重量最好别超过1.5kg\n✨ 折叠后最好能塞进我的登机箱（不超过50cm）\n✨ 能架稳我的索尼+24-70镜头（大概1.8kg）\n✨ 预算大概1000块左右\n\n目前看上了曼富图Befree、富图宝X4i和思锐T-025X，有没有用过的朋友能说说真实使用感受？主要用来拍风光和夜景，有时候会延时摄影~\n\n感谢感谢！🙏',
    authorName: '背包客小张',
    authorAvatar: 'https://picsum.photos/100/100?random=5',
    authorId: 105,
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
    title: '昨晚在外滩拍了灯光秀！终于赶上好天气了~',
    summary: '分享下上海外滩夜景拍摄经验，第一次拍，大家给点意见呀',
    content: '昨天晚上终于等到外滩灯光秀了！而且天气超级给力，没什么云，拍出来效果比预期好太多~开心😆\n\n分享一下我的拍摄设置：\n📷 相机：佳能EOS R6\n🔍 镜头：24-70mm F2.8\n⚙️ 参数：F8光圈 + 8秒快门 + ISO100\n⚠️ 一定要带三脚架！长曝光必备\n\n小经验分享：\n1. 用了延时快门，避免按快门的时候震动\n2. 找了个有栏杆的位置当前景，感觉画面更有层次感了\n3. 刚好赶上蓝调时分（日落后半小时左右），天空颜色超美~\n\n后期大概调了下：稍微提了点对比度和饱和度，色温调冷了点突出城市感，还压了压天空让建筑更突出~\n\n第一次认真拍城市夜景，大家有什么建议都可以提哦！希望下次能拍得更好😊',
    authorName: '城市探索者',
    authorAvatar: 'https://picsum.photos/100/100?random=6',
    authorId: 106,
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
    authorId: 107,
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
    authorId: 108,
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
    authorId: 109,
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
    title: '今天终于拍到白鹭捕鱼了！等了整整3小时~',
    summary: '周末去湿地蹲守拍鸟，虽然很累但超有成就感！分享几张今天的收获',
    content: '周末起了个大早，扛着装备去郊外的湿地拍鸟。五点多就到了，架好相机开始蹲守~🦅\n\n今天用的是佳能R3 + 100-500mm镜头，还加了1.4倍增距镜，这样能拍得更远一点。\n\n拍鸟真的太考验耐心了！我在那里蹲了整整三个小时，腿都麻了😂不过功夫不负有心人，终于等到了一只白鹭捕鱼的瞬间！那动作真的太快了，要不是开了高速连拍根本拍不到~\n\n给大家分享几个拍鸟小技巧：\n• 一定要早去！清晨是鸟儿最活跃的时候\n• 穿深色衣服，别太鲜艳\n• 保持绝对安静，说话都要轻声细语\n• 了解一下你要拍的鸟的习性，知道它们喜欢在哪里活动\n• 带个小马扎！不然蹲三个小时真的顶不住😂\n\n附上今天拍的几张照片，最满意的就是那张白鹭捕鱼的瞬间~大家觉得怎么样？',
    authorName: '自然爱好者老李',
    authorAvatar: 'https://picsum.photos/100/100?random=10',
    authorId: 110,
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
    title: '室内拍人像不会布光？这几个简单技巧让你的照片秒变专业！',
    summary: '分享几个新手也能轻松掌握的室内布光方法，不用专业设备也能拍出好看的人像',
    content: '好多朋友跟我说，在室外拍照还挺好，但一到室内就拍不好了，主要是光线问题~今天我就来分享几个超实用的室内布光技巧，新手也能轻松上手！\n\n💡 三点布光超简单版：\n• 主光：放在模特斜上方45度，这是主要光源\n• 辅助光：在对面稍微弱一点的光，用来减轻阴影\n• 背光：从后面照过来，能勾出人物轮廓，瞬间有层次感\n\n但如果设备不多怎么办？别担心！我平时常用的简易方案：\n1. 两盏灯：一个主灯加一个反光板就够了\n2. 单灯甚至不用灯：窗户自然光+反光板，省钱又好用！\n\n📸 新手友好设备推荐：\n• 神牛SL60W LED灯：价格实惠，操作简单\n• 柔光箱/反光伞：让光线更柔和，皮肤拍出来更好看\n• 便宜的背景纸：纯色背景立刻提升照片质感\n\n附上几张不同布光的对比图，大家可以看看效果差别~有问题评论区问我呀！\n\n记住，布光没有标准答案，多试多调整才是王道~',
    authorName: '喜欢拍人像的小王',
    authorAvatar: 'https://picsum.photos/100/100?random=11',
    authorId: 111,
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
    title: '富士XT5用了两周！颜值与性能兼备，胶片党狂喜~',
    summary: '作为富士粉第一时间入手XT5，分享真实使用感受，优缺点都告诉你',
    content: '作为一个从XT2用到XT4的富士老粉，XT5一发布我就果断入手了！用了整整两周，今天来跟大家聊聊真实感受~\n\n📸 颜值控必入！\n这复古外观真的太戳我了！金属机身拿在手里质感超级好，拨盘操作也特别有仪式感~每次拿出去拍照都有人问这是什么相机😂\n\n⚡ 性能提升明显\n• 4000万像素真的香！细节比XT4好太多了\n• 对焦速度快了不少，特别是追焦，拍娃拍宠物更轻松了\n• 防抖升级后手持拍摄稳多了，以前1/30秒都虚，现在1/15秒也能出片\n• 当然啦，胶片模拟还是yyds！我最喜欢Classic Chrome和Provia\n\n😅 缺点也得说说\n• 电池真的不耐用...一天出门至少得带两块电池\n• 视频功能感觉一般，和同价位比不算出色\n• 价格还是有点小贵，但谁让它好看呢~\n\n总结一下：如果你喜欢街拍、人文或者风光，又特别爱胶片风，XT5绝对值得买！颜值和性能都在线~但如果主要拍视频，可能要再考虑考虑~\n\n大家有什么关于XT5的问题都可以在评论区问我哦！',
    authorName: '富士老粉阿文',
    authorAvatar: 'https://picsum.photos/100/100?random=12',
    authorId: 112,
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

// 计算属性：过滤和排序帖子已经在下面正确定义


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

.post-author-name {
  font-size: 14px;
  color: #6C757D;
  margin-bottom: 8px;
  font-weight: 500;
}

.post-title {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin: 0;
  transition: color 0.2s ease;
  line-height: 1.4;
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