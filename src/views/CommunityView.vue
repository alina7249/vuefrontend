<template>
  <div class="community-container">
    <!-- 页面头部 -->
    <div class="community-header">
      <h1 class="page-title">社区动态</h1>
      <p class="page-subtitle">连接全球摄影爱好者，分享创作心得与技巧</p>
    </div>
    
    <!-- 社区内容区 -->
    <div class="community-content">
      <!-- 左侧边栏 -->
      <aside class="sidebar">
        <!-- 社区统计 -->
        <div class="community-stats">
          <h3 class="section-title">社区数据</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ communityStats.members }}</div>
              <div class="stat-label">活跃成员</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ communityStats.photos }}</div>
              <div class="stat-label">摄影作品</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ communityStats.topics }}</div>
              <div class="stat-label">讨论话题</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ communityStats.comments }}</div>
              <div class="stat-label">互动评论</div>
            </div>
          </div>
        </div>
        
        <!-- 热门标签 -->
        <div class="trending-tags">
          <h3 class="section-title">热门标签</h3>
          <div class="tags-container">
            <a href="#" class="tag" v-for="tag in trendingTags" :key="tag.name">
              #{{ tag.name }}
              <span class="tag-count">{{ tag.count }}</span>
            </a>
          </div>
        </div>
        
        <!-- 近期活动 -->
        <div class="upcoming-events">
          <h3 class="section-title">近期活动</h3>
          <div class="event-list">
            <div class="event-item" v-for="event in upcomingEvents" :key="event.id">
              <div class="event-date">
                <div class="event-day">{{ event.day }}</div>
                <div class="event-month">{{ event.month }}</div>
              </div>
              <div class="event-info">
                <div class="event-title">{{ event.title }}</div>
                <div class="event-location">{{ event.location }}</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      <!-- 主内容区 -->
      <main class="community-main">
        <!-- 发帖表单 -->
        <div class="post-form">
          <div class="form-header">
            <img src="https://picsum.photos/100/100?random=user" alt="Your avatar" class="user-avatar" />
            <button class="create-post-btn shutter-button" @click="createNewPost">发布新话题</button>
          </div>
          <div class="form-options">
            <button class="option-btn">
              <i class="option-icon">📷</i>
              <span>分享作品</span>
            </button>
            <button class="option-btn">
              <i class="option-icon">💡</i>
              <span>提问求助</span>
            </button>
            <button class="option-btn">
              <i class="option-icon">💬</i>
              <span>讨论交流</span>
            </button>
            <button class="option-btn">
              <i class="option-icon">🏆</i>
              <span>参与活动</span>
            </button>
          </div>
        </div>
        
        <!-- 话题筛选 -->
        <div class="topic-filter">
          <button class="filter-btn active" @click="selectFilter('all')">全部</button>
          <button class="filter-btn" @click="selectFilter('popular')">热门</button>
          <button class="filter-btn" @click="selectFilter('latest')">最新</button>
          <button class="filter-btn" @click="selectFilter('questions')">问题</button>
          <button class="filter-btn" @click="selectFilter('share')">分享</button>
        </div>
        
        <!-- 话题列表 -->
        <div class="topics-list">
          <div class="topic-item" v-for="topic in filteredTopics" :key="topic.id">
            <div class="topic-header">
              <div class="topic-author">
                <img :src="topic.author.avatar" :alt="topic.author.name" class="author-avatar" />
                <div class="author-info">
                  <div class="author-name">{{ topic.author.name }}</div>
                  <div class="topic-time">{{ formatTime(topic.createdAt) }}</div>
                </div>
              </div>
              <div class="topic-category">{{ topic.category }}</div>
            </div>
            <div class="topic-content">
              <h3 class="topic-title">{{ topic.title }}</h3>
              <p class="topic-description" v-if="topic.description">{{ topic.description }}</p>
              <div class="topic-media" v-if="topic.mediaUrl">
                <img :src="topic.mediaUrl" :alt="topic.title" class="topic-image" />
              </div>
            </div>
            <div class="topic-footer">
              <div class="topic-stats">
                <span class="stat">{{ topic.views }} 浏览</span>
                <span class="stat">{{ topic.replies }} 回复</span>
                <span class="stat">{{ topic.likes }} 点赞</span>
              </div>
              <div class="topic-actions">
                <button class="action-btn shutter-button" @click="likeTopic(topic.id)">
                  <i class="action-icon">❤️</i>
                  点赞
                </button>
                <button class="action-btn shutter-button" @click="replyTopic(topic.id)">
                  <i class="action-icon">💬</i>
                  回复
                </button>
                <button class="action-btn shutter-button" @click="shareTopic(topic.id)">
                  <i class="action-icon">📤</i>
                  分享
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 加载更多 -->
        <div class="load-more">
          <button class="load-more-btn shutter-button" @click="loadMoreTopics" :disabled="loading">
            {{ loading ? '加载中...' : '加载更多' }}
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'CommunityView',
  setup() {
    const loading = ref(false);
    const selectedFilter = ref('all');
    const topics = ref([]);
    
    // 社区统计数据
    const communityStats = ref({
      members: '12.5k',
      photos: '48.2k',
      topics: '8.7k',
      comments: '120.5k'
    });
    
    // 热门标签
    const trendingTags = ref([
      { name: '风光摄影', count: 1250 },
      { name: '人像摄影', count: 980 },
      { name: '街拍摄影', count: 870 },
      { name: '后期修图', count: 650 },
      { name: '器材讨论', count: 540 },
      { name: '新手提问', count: 480 },
      { name: '黑白摄影', count: 390 },
      { name: '手机摄影', count: 320 }
    ]);
    
    // 近期活动
    const upcomingEvents = ref([
      { id: 1, day: '15', month: '5月', title: '城市风光摄影 workshop', location: '线上直播' },
      { id: 2, day: '22', month: '5月', title: '人像摄影技巧分享会', location: '北京朝阳区' },
      { id: 3, day: '30', month: '5月', title: '2024夏季摄影比赛', location: '全国线上' }
    ]);
    
    // 生成模拟话题数据
    const generateMockTopics = (count) => {
      const categories = ['讨论交流', '提问求助', '作品分享', '活动通知', '经验分享'];
      const mockTopics = [];
      
      for (let i = 0; i < count; i++) {
        const randomId = i + 1;
        const hasMedia = Math.random() > 0.5;
        
        mockTopics.push({
          id: randomId,
          title: getRandomTopicTitle(),
          description: Math.random() > 0.3 ? getRandomTopicDescription() : '',
          mediaUrl: hasMedia ? `https://picsum.photos/600/400?random=${randomId}` : null,
          views: Math.floor(Math.random() * 1000) + 10,
          replies: Math.floor(Math.random() * 100) + 1,
          likes: Math.floor(Math.random() * 200) + 5,
          category: categories[Math.floor(Math.random() * categories.length)],
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
          author: {
            id: Math.floor(Math.random() * 1000) + 1,
            name: getRandomAuthorName(),
            avatar: `https://picsum.photos/100/100?random=${Math.floor(Math.random() * 1000) + 1}`
          }
        });
      }
      
      return mockTopics;
    };
    
    // 随机话题标题生成函数
    const getRandomTopicTitle = () => {
      const titles = [
        '分享我的第一组城市夜景作品，请大家指点',
        '新手请教：如何拍摄出好看的人像照片？',
        '佳能和索尼的微单怎么选？纠结中...',
        '刚入手的新镜头，迫不及待想出去创作',
        '请教各位大佬，如何处理逆光拍摄的照片？',
        '分享一个小众但很美的拍摄地点',
        '大家平时都用什么后期软件？求推荐',
        '关于构图的一些心得体会',
        '想组织一次线下摄影活动，有人感兴趣吗？',
        '最近参加摄影比赛的作品，求点评',
        '手机摄影有什么技巧可以提升画质？',
        '黑白摄影的魅力，我被征服了',
        '拍了一组星空照片，但是噪点很多怎么办？',
        '如何在旅行中拍出有故事的照片？',
        '儿童摄影的难点和技巧分享'
      ];
      
      return titles[Math.floor(Math.random() * titles.length)];
    };
    
    // 随机话题描述生成函数
    const getRandomTopicDescription = () => {
      const descriptions = [
        '这是我第一次尝试这种风格的拍摄，感觉还有很多不足的地方，希望得到大家的宝贵意见...',
        '最近对这个题材很感兴趣，但是一直拍不出满意的效果，想请教一下各位老师有什么好的建议...',
        '纠结了很久，预算有限，不知道该选择哪一款器材，主要用于日常记录和旅行拍摄...',
        '天气终于好转了，周末准备去郊外拍摄，有一起的小伙伴吗？',
        '刚刚学习后期处理，感觉自己调的颜色总是很奇怪，有没有推荐的教程或者参数设置？'
      ];
      
      return descriptions[Math.floor(Math.random() * descriptions.length)];
    };
    
    // 随机作者名生成函数
    const getRandomAuthorName = () => {
      const names = ['光影记录者', '瞬间捕捉师', '色彩旅人', '黑白映像', '城市摄影师', '自然探索者', '人文观察者', '抽象艺术家'];
      return names[Math.floor(Math.random() * names.length)];
    };
    
    // 初始化加载
    const initializeTopics = () => {
      topics.value = generateMockTopics(15);
    };
    
    // 加载更多
    const loadMoreTopics = () => {
      loading.value = true;
      
      // 模拟网络延迟
      setTimeout(() => {
        const moreTopics = generateMockTopics(10);
        topics.value = [...topics.value, ...moreTopics];
        loading.value = false;
      }, 1500);
    };
    
    // 格式化时间
    const formatTime = (date) => {
      const now = new Date();
      const diff = now - new Date(date);
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      
      if (minutes < 60) {
        return `${minutes}分钟前`;
      } else if (hours < 24) {
        return `${hours}小时前`;
      } else {
        return `${days}天前`;
      }
    };
    
    // 计算筛选后的话题
    const filteredTopics = computed(() => {
      let result = [...topics.value];
      
      // 筛选
      if (selectedFilter.value === 'popular') {
        result.sort((a, b) => b.replies - a.replies);
      } else if (selectedFilter.value === 'latest') {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (selectedFilter.value === 'questions') {
        result = result.filter(topic => topic.category === '提问求助');
      } else if (selectedFilter.value === 'share') {
        result = result.filter(topic => topic.category === '作品分享');
      }
      
      return result;
    });
    
    // 筛选处理函数
    const selectFilter = (filter) => {
      selectedFilter.value = filter;
    };
    
    // 话题交互函数
    const createNewPost = () => {};
    const likeTopic = (topicId) => {};
    const replyTopic = (topicId) => {};
    const shareTopic = (topicId) => {};
    
    onMounted(() => {
      initializeTopics();
    });
    
    return {
      loading,
      selectedFilter,
      topics,
      communityStats,
      trendingTags,
      upcomingEvents,
      filteredTopics,
      selectFilter,
      formatTime,
      loadMoreTopics,
      createNewPost,
      likeTopic,
      replyTopic,
      shareTopic
    };
  }
};
</script>

<style scoped>
.community-container {
  min-height: 100vh;
  padding: var(--spacing-lg) var(--spacing-xl);
}

.community-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  position: relative;
  padding: var(--spacing-xxl) 0;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  position: relative;
  z-index: 1;
}

.page-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  position: relative;
  z-index: 1;
}

.community-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--spacing-lg);
  max-width: 1400px;
  margin: 0 auto;
}

.sidebar {
  position: sticky;
  top: calc(var(--header-height) + var(--spacing-lg));
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.community-stats,
.trending-tags,
.upcoming-events {
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-medium);
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--accent-color);
  font-family: 'Roboto Mono', monospace;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(42, 92, 140, 0.1);
  color: var(--primary-color);
  border-radius: 15px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.tag:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

.tag-count {
  font-size: 0.8rem;
  opacity: 0.7;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.event-item {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: var(--accent-color);
  border-radius: 8px;
  color: white;
  font-weight: 600;
}

.event-day {
  font-size: 1.5rem;
}

.event-month {
  font-size: 0.8rem;
}

.event-info {
  flex: 1;
}

.event-title {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.event-location {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.community-main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.post-form {
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-medium);
}

.form-header {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.create-post-btn {
  flex: 1;
  padding: var(--spacing-md);
  border: 1px dashed var(--border-color);
  background-color: transparent;
  color: var(--text-secondary);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.create-post-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.form-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-sm);
}

.option-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  border: none;
  background-color: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: var(--border-radius);
}

.option-btn:hover {
  background-color: rgba(42, 92, 140, 0.1);
  color: var(--primary-color);
}

.option-icon {
  font-size: 1.5rem;
}

.topic-filter {
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: auto;
  padding: var(--spacing-sm) 0;
}

.filter-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  border: 1px solid var(--border-color);
  background-color: transparent;
  color: var(--text-secondary);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filter-btn:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.filter-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.topics-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.topic-item {
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-medium);
  transition: all 0.3s ease;
}

.topic-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-large);
}

.topic-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.topic-author {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 500;
  color: var(--text-primary);
}

.topic-time {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.topic-category {
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(42, 92, 140, 0.1);
  color: var(--primary-color);
  border-radius: 15px;
  font-size: 0.8rem;
}

.topic-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
}

.topic-description {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
}

.topic-media {
  margin-bottom: var(--spacing-md);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.topic-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.topic-item:hover .topic-image {
  transform: scale(1.02);
}

.topic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.topic-stats {
  display: flex;
  gap: var(--spacing-md);
}

.stat {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.topic-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border: none;
  background-color: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
}

.action-btn:hover {
  background-color: rgba(42, 92, 140, 0.1);
  color: var(--primary-color);
}

.load-more {
  text-align: center;
  margin-top: var(--spacing-xl);
}

.load-more-btn {
  padding: var(--spacing-md) var(--spacing-xl);
  border: none;
  border-radius: var(--border-radius);
  background-color: var(--primary-color);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more-btn:hover:not(:disabled) {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
}

.load-more-btn:disabled {
  background-color: var(--text-secondary);
  cursor: not-allowed;
}

/* 响应式设计 - 仅保留PC端样式 */
@media (max-width: 1200px) {
  .community-content {
    grid-template-columns: 250px 1fr;
  }
}
</style>