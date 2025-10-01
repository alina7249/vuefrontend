<template>
  <div class="discover-container">
    <!-- 页面头部 -->
    <div class="discover-header">
      <div class="darkroom-light"></div>
      <h1 class="page-title">发现优秀摄影作品</h1>
      <p class="page-subtitle">探索光影的艺术，发现瞬间的永恒</p>
      
      <!-- 搜索栏 -->
      <div class="search-container">
        <input 
          type="text" 
          class="search-input glass-effect"
          placeholder="搜索作品、摄影师或标签..."
          v-model="searchQuery"
        />
        <button class="search-btn shutter-button">
          <i class="search-icon">🔍</i>
        </button>
      </div>
    </div>
    
    <!-- 筛选栏 -->
    <div class="filter-section glass-effect">
      <div class="filter-group">
        <label class="filter-label">题材</label>
        <div class="filter-options">
          <button class="filter-btn" :class="{ active: selectedCategory === 'all' }" @click="selectCategory('all')">全部</button>
          <button class="filter-btn" :class="{ active: selectedCategory === 'landscape' }" @click="selectCategory('landscape')">风光</button>
          <button class="filter-btn" :class="{ active: selectedCategory === 'portrait' }" @click="selectCategory('portrait')">人像</button>
          <button class="filter-btn" :class="{ active: selectedCategory === 'street' }" @click="selectCategory('street')">街拍</button>
          <button class="filter-btn" :class="{ active: selectedCategory === 'nature' }" @click="selectCategory('nature')">自然</button>
          <button class="filter-btn" :class="{ active: selectedCategory === 'abstract' }" @click="selectCategory('abstract')">抽象</button>
        </div>
      </div>
      
      <div class="filter-group">
        <label class="filter-label">器材</label>
        <div class="filter-options">
          <button class="filter-btn" :class="{ active: selectedCamera === 'all' }" @click="selectCamera('all')">全部</button>
          <button class="filter-btn" :class="{ active: selectedCamera === 'canon' }" @click="selectCamera('canon')">佳能</button>
          <button class="filter-btn" :class="{ active: selectedCamera === 'nikon' }" @click="selectCamera('nikon')">尼康</button>
          <button class="filter-btn" :class="{ active: selectedCamera === 'sony' }" @click="selectCamera('sony')">索尼</button>
          <button class="filter-btn" :class="{ active: selectedCamera === 'fuji' }" @click="selectCamera('fuji')">富士</button>
          <button class="filter-btn" :class="{ active: selectedCamera === 'mobile' }" @click="selectCamera('mobile')">手机</button>
        </div>
      </div>
      
      <div class="filter-group">
        <label class="filter-label">排序</label>
        <div class="filter-options">
          <button class="filter-btn" :class="{ active: selectedSort === 'latest' }" @click="selectSort('latest')">最新</button>
          <button class="filter-btn" :class="{ active: selectedSort === 'popular' }" @click="selectSort('popular')">热门</button>
          <button class="filter-btn" :class="{ active: selectedSort === 'featured' }" @click="selectSort('featured')">精选</button>
        </div>
      </div>
    </div>
    
    <!-- 作品瀑布流 -->
    <div class="photo-grid">
      <PhotoCard v-for="photo in filteredPhotos" :key="photo.id" :photo="photo" />
    </div>
    
    <!-- 加载更多 -->
    <div class="load-more">
      <button class="load-more-btn shutter-button" @click="loadMorePhotos" :disabled="loading">
        {{ loading ? '加载中...' : '加载更多' }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import PhotoCard from '../components/PhotoCard.vue';

export default {
  name: 'DiscoverView',
  components: {
    PhotoCard
  },
  setup() {
    const searchQuery = ref('');
    const selectedCategory = ref('all');
    const selectedCamera = ref('all');
    const selectedSort = ref('latest');
    const loading = ref(false);
    const photos = ref([]);
    
    // 生成模拟数据
    const generateMockPhotos = (count) => {
      const categories = ['landscape', 'portrait', 'street', 'nature', 'abstract'];
      const cameras = ['canon', 'nikon', 'sony', 'fuji', 'mobile'];
      const mockPhotos = [];
      
      for (let i = 0; i < count; i++) {
        const randomId = i + 1;
        const category = categories[Math.floor(Math.random() * categories.length)];
        const camera = cameras[Math.floor(Math.random() * cameras.length)];
        
        mockPhotos.push({
          id: randomId,
          title: getRandomTitle(category),
          url: `https://picsum.photos/800/600?random=${randomId}`,
          likes: Math.floor(Math.random() * 500) + 10,
          comments: Math.floor(Math.random() * 100) + 1,
          favorites: Math.floor(Math.random() * 200) + 5,
          category: category,
          camera: camera,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
          author: {
            id: Math.floor(Math.random() * 1000) + 1,
            name: getRandomAuthorName(),
            avatar: `https://picsum.photos/100/100?random=${Math.floor(Math.random() * 1000) + 1}`
          }
        });
      }
      
      return mockPhotos;
    };
    
    // 随机标题生成函数
    const getRandomTitle = (category) => {
      const titles = {
        landscape: ['山间晨雾', '海边日落', '城市天际线', '雪山之巅', '湖泊倒影'],
        portrait: ['午后时光', '岁月痕迹', '城市肖像', '自然表情', '人文瞬间'],
        street: ['城市角落', '雨中漫步', '街头艺人', '匆忙身影', '市井生活'],
        nature: ['森林晨曲', '野花盛开', '野生动物', '溪流石滩', '星空璀璨'],
        abstract: ['光影交错', '几何构成', '色彩斑斓', '模糊边界', '线条韵律']
      };
      
      const categoryTitles = titles[category] || titles.landscape;
      return categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
    };
    
    // 随机作者名生成函数
    const getRandomAuthorName = () => {
      const names = ['光影记录者', '瞬间捕捉师', '色彩旅人', '黑白映像', '城市摄影师', '自然探索者', '人文观察者', '抽象艺术家'];
      return names[Math.floor(Math.random() * names.length)];
    };
    
    // 初始化加载
    const initializePhotos = () => {
      photos.value = generateMockPhotos(24);
    };
    
    // 加载更多
    const loadMorePhotos = () => {
      loading.value = true;
      
      // 模拟网络延迟
      setTimeout(() => {
        const morePhotos = generateMockPhotos(12);
        photos.value = [...photos.value, ...morePhotos];
        loading.value = false;
      }, 1500);
    };
    
    // 计算筛选后的照片
    const filteredPhotos = computed(() => {
      let result = [...photos.value];
      
      // 搜索筛选
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(photo => 
          photo.title.toLowerCase().includes(query) ||
          photo.author.name.toLowerCase().includes(query) ||
          photo.category.toLowerCase().includes(query)
        );
      }
      
      // 分类筛选
      if (selectedCategory.value !== 'all') {
        result = result.filter(photo => photo.category === selectedCategory.value);
      }
      
      // 器材筛选
      if (selectedCamera.value !== 'all') {
        result = result.filter(photo => photo.camera === selectedCamera.value);
      }
      
      // 排序
      if (selectedSort.value === 'latest') {
        result.sort((a, b) => b.createdAt - a.createdAt);
      } else if (selectedSort.value === 'popular') {
        result.sort((a, b) => b.likes - a.likes);
      }
      
      return result;
    });
    
    // 筛选处理函数
    const selectCategory = (category) => {
      selectedCategory.value = category;
    };
    
    const selectCamera = (camera) => {
      selectedCamera.value = camera;
    };
    
    const selectSort = (sort) => {
      selectedSort.value = sort;
    };
    
    onMounted(() => {
      initializePhotos();
    });
    
    return {
      searchQuery,
      selectedCategory,
      selectedCamera,
      selectedSort,
      loading,
      photos,
      filteredPhotos,
      selectCategory,
      selectCamera,
      selectSort,
      loadMorePhotos
    };
  }
};
</script>

<style scoped>
.discover-container {
  min-height: 100vh;
  padding: var(--spacing-lg) var(--spacing-xl);
  position: relative;
}

.discover-header {
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

.search-container {
  display: flex;
  justify-content: center;
  max-width: 600px;
  margin: 0 auto;
  gap: var(--spacing-sm);
  position: relative;
  z-index: 1;
}

.search-input {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  box-shadow: 0 0 0 2px var(--primary-color);
}

.search-btn {
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius);
  background-color: var(--primary-color);
  color: white;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background-color: var(--primary-dark);
}

.filter-section {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-medium);
}

.filter-group {
  margin-bottom: var(--spacing-md);
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-label {
  display: block;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
}

.filter-options {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.filter-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  border: 1px solid var(--border-color);
  background-color: transparent;
  color: var(--text-secondary);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.filter-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--accent-color);
  transition: width 0.3s ease;
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

.filter-btn.active::after {
  width: 100%;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
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

/* 响应式设计 */
@media (max-width: 1200px) {
  .photo-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .filter-section {
    padding: var(--spacing-sm);
  }
}

@media (max-width: 768px) {
  .discover-container {
    padding: var(--spacing-md);
  }
  
  .photo-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .search-container {
    flex-direction: column;
  }
  
  .search-input, .search-btn {
    width: 100%;
  }
}
</style>