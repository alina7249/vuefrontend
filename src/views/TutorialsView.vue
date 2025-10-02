<template>
  <div class="tutorials-container">
    <!-- 页面头部 -->
    <div class="tutorials-header">
      <h1 class="page-title">摄影教程</h1>
      <p class="page-subtitle">从入门到精通，提升你的摄影技巧</p>
    </div>
    
    <!-- 分类导航 -->
    <div class="category-nav glass-effect">
      <button 
        class="category-btn" 
        v-for="category in categories" 
        :key="category.id"
        :class="{ active: selectedCategory === category.id }"
        @click="selectCategory(category.id)"
      >
        {{ category.name }}
      </button>
    </div>
    
    <!-- 热门推荐 -->
    <section class="featured-tutorials">
      <h2 class="section-title">热门推荐</h2>
      <div class="featured-grid">
        <div class="featured-tutorial" v-for="tutorial in featuredTutorials" :key="tutorial.id">
          <div class="tutorial-image-wrapper">
            <img :src="tutorial.imageUrl" :alt="tutorial.title" class="tutorial-image" />
            <div class="tutorial-duration">{{ formatDuration(tutorial.duration) }}</div>
          </div>
          <div class="tutorial-info">
            <div class="tutorial-category">{{ getCategoryName(tutorial.category) }}</div>
            <h3 class="tutorial-title">{{ tutorial.title }}</h3>
            <div class="tutorial-meta">
              <span class="tutorial-views">{{ tutorial.views }} 次观看</span>
              <span class="tutorial-date">{{ formatDate(tutorial.publishDate) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 教程列表 -->
    <section class="tutorials-list-section">
      <div class="section-header">
        <h2 class="section-title">所有教程</h2>
        <div class="sort-options">
          <label class="sort-label">排序方式：</label>
          <select class="sort-select" v-model="sortBy" @change="handleSortChange">
            <option value="newest">最新发布</option>
            <option value="popular">最受欢迎</option>
            <option value="duration-asc">时长最短</option>
            <option value="duration-desc">时长最长</option>
          </select>
        </div>
      </div>
      
      <div class="tutorials-grid">
        <div class="tutorial-card glass-effect" v-for="tutorial in filteredTutorials" :key="tutorial.id">
          <div class="tutorial-image-wrapper">
            <img :src="tutorial.imageUrl" :alt="tutorial.title" class="tutorial-image" />
            <div class="tutorial-duration">{{ formatDuration(tutorial.duration) }}</div>
          </div>
          <div class="tutorial-info">
            <div class="tutorial-category">{{ getCategoryName(tutorial.category) }}</div>
            <h3 class="tutorial-title">{{ tutorial.title }}</h3>
            <div class="tutorial-author">
              <img :src="tutorial.authorAvatar" :alt="tutorial.authorName" class="author-avatar" />
              <span class="author-name">{{ tutorial.authorName }}</span>
            </div>
            <div class="tutorial-meta">
              <span class="tutorial-level">{{ getLevelText(tutorial.level) }}</span>
              <span class="tutorial-views">{{ tutorial.views }} 次观看</span>
              <span class="tutorial-date">{{ formatDate(tutorial.publishDate) }}</span>
            </div>
            <div class="tutorial-actions">
              <button class="view-btn shutter-button" @click="viewTutorialDetails(tutorial.id)">
                查看教程
              </button>
              <button class="bookmark-btn" @click="toggleBookmark(tutorial.id)">
                <span v-if="isBookmarked(tutorial.id)">已收藏</span>
                <span v-else>收藏</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 加载更多 -->
    <div class="load-more">
      <button class="load-more-btn shutter-button" @click="loadMoreTutorials" :disabled="loading">
        {{ loading ? '加载中...' : '加载更多' }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'TutorialsView',
  setup() {
    const selectedCategory = ref('all');
    const sortBy = ref('newest');
    const loading = ref(false);
    const tutorials = ref([]);
    const bookmarkedTutorials = ref([]);
    
    // 教程分类
    const categories = ref([
      { id: 'all', name: '全部' },
      { id: 'beginner', name: '入门基础' },
      { id: 'composition', name: '构图技巧' },
      { id: 'lighting', name: '光线运用' },
      { id: 'post-processing', name: '后期处理' },
      { id: 'portrait', name: '人像摄影' },
      { id: 'landscape', name: '风景摄影' },
      { id: 'street', name: '街头摄影' },
      { id: 'equipment', name: '器材使用' }
    ]);
    
    // 热门教程数据
    const featuredTutorials = ref([
      {
        id: 1,
        title: '摄影构图的黄金法则：三分法详解',
        imageUrl: 'https://picsum.photos/600/400?random=201',
        category: 'composition',
        duration: 360,
        views: 12580,
        publishDate: new Date('2023-05-15')
      },
      {
        id: 2,
        title: '人像摄影布光技巧大全',
        imageUrl: 'https://picsum.photos/600/400?random=202',
        category: 'lighting',
        duration: 480,
        views: 9860,
        publishDate: new Date('2023-06-20')
      },
      {
        id: 3,
        title: '风光摄影后期调色秘诀',
        imageUrl: 'https://picsum.photos/600/400?random=203',
        category: 'post-processing',
        duration: 540,
        views: 8750,
        publishDate: new Date('2023-07-10')
      },
      {
        id: 4,
        title: '相机曝光三要素详解',
        imageUrl: 'https://picsum.photos/600/400?random=204',
        category: 'beginner',
        duration: 420,
        views: 15600,
        publishDate: new Date('2023-08-05')
      }
    ]);
    
    // 生成模拟教程数据
    const generateMockTutorials = (count) => {
      const mockTutorials = [];
      const titles = {
        'beginner': [
          '相机基础操作指南',
          '曝光补偿的使用技巧',
          '不同场景的白平衡设置',
          '了解景深和光圈关系',
          '自动对焦和手动对焦技巧'
        ],
        'composition': [
          '摄影构图的黄金分割',
          '线条引导在摄影中的运用',
          '对称与平衡构图技巧',
          '前景运用增强画面深度',
          '留白在摄影中的艺术'
        ],
        'lighting': [
          '自然光摄影技巧',
          '室内人像布光入门',
          '夜景摄影光线处理',
          '闪光灯的创意使用',
          '柔光箱与反光板运用'
        ],
        'post-processing': [
          'Lightroom基础调色教程',
          'Photoshop后期修图技巧',
          'RAW格式照片处理流程',
          'HDR摄影与后期合成',
          '照片降噪和锐化技巧'
        ],
        'portrait': [
          '人像摄影摆姿指南',
          '室内人像布光方案',
          '户外人像拍摄技巧',
          '儿童摄影注意事项',
          '黑白人像摄影艺术'
        ],
        'landscape': [
          '日出日落拍摄技巧',
          '星空摄影全攻略',
          '城市风光拍摄指南',
          '山水风光摄影构图',
          '云海雾景拍摄技巧'
        ],
        'street': [
          '街头摄影构图技巧',
          '人文纪实摄影入门',
          '街头摄影器材选择',
          '隐蔽拍摄技巧',
          '捕捉决定性瞬间'
        ],
        'equipment': [
          '相机镜头选择指南',
          '三脚架使用技巧',
          '滤镜系统全面解析',
          '相机清洁与保养',
          '配件选购实用建议'
        ]
      };
      
      // 生成作者信息
      const generateAuthors = () => {
        const authorNames = ['张三', '李四', '王五', '赵六', '陈七', '刘八', '周九'];
        const authors = [];
        
        for (let i = 0; i < authorNames.length; i++) {
          authors.push({
            name: authorNames[i],
            avatar: `https://picsum.photos/100/100?random=${i + 300}`
          });
        }
        
        return authors;
      };
      
      const authors = generateAuthors();
      const categoryKeys = Object.keys(titles);
      
      for (let i = 0; i < count; i++) {
        const randomId = i + 1;
        const category = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
        const categoryTitles = titles[category];
        const title = categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
        const duration = Math.floor(Math.random() * 600) + 180; // 3-13分钟
        const views = Math.floor(Math.random() * 20000) + 1000;
        const level = Math.floor(Math.random() * 3) + 1; // 1-3
        const author = authors[Math.floor(Math.random() * authors.length)];
        const publishDate = new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000);
        
        mockTutorials.push({
          id: randomId,
          title: title,
          imageUrl: `https://picsum.photos/600/400?random=${randomId + 400}`,
          category: category,
          duration: duration,
          views: views,
          level: level,
          authorName: author.name,
          authorAvatar: author.avatar,
          publishDate: publishDate
        });
      }
      
      return mockTutorials;
    };
    
    // 格式化时长
    const formatDuration = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      
      if (hours > 0) {
        return `${hours}h ${minutes}m ${remainingSeconds}s`;
      } else if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
      } else {
        return `${remainingSeconds}s`;
      }
    };
    
    // 格式化日期
    const formatDate = (date) => {
      if (!date) return '';
      
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    };
    
    // 获取分类名称
    const getCategoryName = (categoryId) => {
      const category = categories.value.find(cat => cat.id === categoryId);
      return category ? category.name : '其他';
    };
    
    // 获取难度级别文本
    const getLevelText = (level) => {
      const levels = {
        1: '入门',
        2: '中级',
        3: '高级'
      };
      return levels[level] || '入门';
    };
    
    // 初始化加载
    const initializeTutorials = () => {
      tutorials.value = generateMockTutorials(20);
    };
    
    // 加载更多
    const loadMoreTutorials = () => {
      loading.value = true;
      
      // 模拟网络延迟
      setTimeout(() => {
        const moreTutorials = generateMockTutorials(10);
        tutorials.value = [...tutorials.value, ...moreTutorials];
        loading.value = false;
      }, 1500);
    };
    
    // 计算筛选后的教程
    const filteredTutorials = computed(() => {
      let result = [...tutorials.value];
      
      // 分类筛选
      if (selectedCategory.value !== 'all') {
        result = result.filter(tutorial => tutorial.category === selectedCategory.value);
      }
      
      // 排序
      switch (sortBy.value) {
        case 'newest':
          result.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
          break;
        case 'popular':
          result.sort((a, b) => b.views - a.views);
          break;
        case 'duration-asc':
          result.sort((a, b) => a.duration - b.duration);
          break;
        case 'duration-desc':
          result.sort((a, b) => b.duration - a.duration);
          break;
      }
      
      return result;
    });
    
    // 分类选择
    const selectCategory = (categoryId) => {
      selectedCategory.value = categoryId;
    };
    
    // 排序处理
    const handleSortChange = () => {
      // 排序逻辑已在computed中实现
    };
    
    // 收藏功能
    const toggleBookmark = (tutorialId) => {
      const index = bookmarkedTutorials.value.indexOf(tutorialId);
      if (index > -1) {
        bookmarkedTutorials.value.splice(index, 1);
      } else {
        bookmarkedTutorials.value.push(tutorialId);
      }
    };
    
    const isBookmarked = (tutorialId) => {
      return bookmarkedTutorials.value.includes(tutorialId);
    };
    
    // 查看详情
    const viewTutorialDetails = (tutorialId) => {
      // 查看详情功能
    };
    
    onMounted(() => {
      initializeTutorials();
    });
    
    return {
      selectedCategory,
      sortBy,
      loading,
      tutorials,
      categories,
      featuredTutorials,
      filteredTutorials,
      bookmarkedTutorials,
      selectCategory,
      handleSortChange,
      loadMoreTutorials,
      formatDuration,
      formatDate,
      getCategoryName,
      getLevelText,
      toggleBookmark,
      isBookmarked,
      viewTutorialDetails
    };
  }
};
</script>

<style scoped>
.tutorials-container {
  min-height: 100vh;
  padding: var(--spacing-lg) var(--spacing-xl);
  position: relative;
}

.tutorials-header {
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

.category-nav {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  overflow-x: auto;
  box-shadow: var(--shadow-medium);
}

.category-nav::-webkit-scrollbar {
  height: 4px;
}

.category-nav::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.category-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.category-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  background-color: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.category-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.category-btn.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.featured-tutorials {
  margin-bottom: var(--spacing-xl);
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.featured-tutorial {
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius);
  overflow: hidden;
  background-color: var(--card-bg);
  box-shadow: var(--shadow-medium);
  transition: all 0.3s ease;
  cursor: pointer;
}

.featured-tutorial:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-large);
}

.tutorial-image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.tutorial-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.featured-tutorial:hover .tutorial-image {
  transform: scale(1.05);
}

.tutorial-duration {
  position: absolute;
  bottom: var(--spacing-sm);
  right: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 15px;
  font-size: 0.8rem;
  font-family: 'Roboto Mono', monospace;
}

.tutorial-info {
  padding: var(--spacing-md);
}

.tutorial-category {
  font-size: 0.9rem;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

.tutorial-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  line-height: 1.4;
}

.tutorial-meta {
  display: flex;
  gap: var(--spacing-md);
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.tutorials-list-section {
  margin-bottom: var(--spacing-xl);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.sort-options {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.sort-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.sort-select {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: transparent;
  color: var(--text-primary);
  font-size: 0.9rem;
  outline: none;
}

.tutorials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

.tutorial-card {
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-medium);
  transition: all 0.3s ease;
}

.tutorial-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-large);
}

.tutorial-card .tutorial-image-wrapper {
  height: 200px;
}

.tutorial-card:hover .tutorial-image {
  transform: scale(1.03);
}

.tutorial-author {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.tutorial-level {
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(212, 175, 55, 0.1);
  color: var(--accent-color);
  border-radius: 15px;
  font-size: 0.8rem;
}

.tutorial-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.view-btn,
.bookmark-btn {
  flex: 1;
  padding: var(--spacing-sm);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.view-btn {
  background-color: var(--primary-color);
  color: white;
}

.view-btn:hover {
  background-color: var(--primary-dark);
}

.bookmark-btn {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.bookmark-btn:hover {
  border-color: var(--primary-color);
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
  .tutorials-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>