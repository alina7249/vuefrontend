<template>
  <div class="equipment-container">
    <!-- 页面头部 -->
    <div class="equipment-header">
      <h1 class="page-title">器材查询</h1>
      <p class="page-subtitle">探索专业摄影器材，了解真实用户评价</p>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter-section">
      <div class="search-container">
        <input 
          type="text" 
          class="search-input"
          placeholder="搜索相机、镜头或品牌..."
          v-model="searchQuery"
        />
        <button class="search-btn shutter-button">
          <i class="search-icon">🔍</i>
          搜索
        </button>
      </div>
      
      <div class="filter-container">
        <div class="filter-group">
          <label class="filter-label">类型</label>
          <select class="filter-select" v-model="selectedType">
            <option value="all">全部类型</option>
            <option value="camera">相机</option>
            <option value="lens">镜头</option>
            <option value="accessory">配件</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">品牌</label>
          <select class="filter-select" v-model="selectedBrand">
            <option value="all">全部品牌</option>
            <option value="canon">佳能</option>
            <option value="nikon">尼康</option>
            <option value="sony">索尼</option>
            <option value="fuji">富士</option>
            <option value="panasonic">松下</option>
            <option value="sigma">适马</option>
            <option value="tamron">腾龙</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">价格范围</label>
          <select class="filter-select" v-model="selectedPriceRange">
            <option value="all">全部价格</option>
            <option value="low">1000元以下</option>
            <option value="mid-low">1000-5000元</option>
            <option value="mid">5000-10000元</option>
            <option value="mid-high">10000-20000元</option>
            <option value="high">20000元以上</option>
          </select>
        </div>
        
        <button class="reset-btn" @click="resetFilters">重置筛选</button>
      </div>
    </div>
    
    <!-- 热门器材 -->
    <section class="featured-equipment">
      <h2 class="section-title">热门器材推荐</h2>
      <div class="featured-grid">
        <div class="featured-item" v-for="item in featuredEquipment" :key="item.id">
          <img :src="item.imageUrl" :alt="item.name" class="featured-image" />
          <div class="featured-info">
            <div class="featured-name">{{ item.name }}</div>
            <div class="featured-rating">
              <div class="rating-stars">
                <span v-for="star in 5" :key="star" :class="{ 'filled': star <= item.rating }">★</span>
              </div>
              <span class="rating-text">{{ item.rating }} ({{ item.reviewCount }}条评价)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 器材列表 -->
    <section class="equipment-list-section">
      <div class="section-header">
        <h2 class="section-title">器材列表</h2>
        <div class="sort-options">
          <label class="sort-label">排序方式：</label>
          <select class="sort-select" v-model="sortBy">
            <option value="rating">评分优先</option>
            <option value="newest">最新发布</option>
            <option value="price-asc">价格从低到高</option>
            <option value="price-desc">价格从高到低</option>
          </select>
        </div>
      </div>
      
      <div class="equipment-grid">
        <div class="equipment-card" v-for="item in filteredEquipment" :key="item.id">
          <img :src="item.imageUrl" :alt="item.name" class="equipment-image" />
          <div class="equipment-info">
            <div class="equipment-brand">{{ item.brand }}</div>
            <h3 class="equipment-name">{{ item.name }}</h3>
            <div class="equipment-type">{{ getItemTypeText(item.type) }}</div>
            <div class="equipment-price">{{ formatPrice(item.price) }}</div>
            <div class="equipment-rating">
              <div class="rating-stars">
                <span v-for="star in 5" :key="star" :class="{ 'filled': star <= item.rating }">★</span>
              </div>
              <span class="rating-text">{{ item.rating }} ({{ item.reviewCount }}条评价)</span>
            </div>
            <div class="equipment-features">
              <span v-for="feature in item.keyFeatures.slice(0, 2)" :key="feature" class="feature-tag">{{ feature }}</span>
            </div>
            <div class="equipment-actions">
              <button class="view-btn shutter-button" @click="viewEquipmentDetails(item.id)">查看详情</button>
              <button class="compare-btn shutter-button" @click="addCompare(item.id)">
                <span v-if="isInCompare(item.id)">已加入对比</span>
                <span v-else>加入对比</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 对比栏 -->
    <div class="compare-bar" v-if="compareList.length > 0">
      <div class="compare-content">
        <div class="compare-items">
          <span class="compare-text">已选择 {{ compareList.length }} 件器材</span>
          <span class="compare-item" v-for="itemId in compareList" :key="itemId">
            {{ getEquipmentName(itemId) }}
            <button class="remove-compare" @click="removeCompare(itemId)">×</button>
          </span>
        </div>
        <button class="compare-btn-primary shutter-button" @click="showCompareModal">
          对比器材
        </button>
      </div>
    </div>
    
    <!-- 加载更多 -->
    <div class="load-more">
      <button class="load-more-btn shutter-button" @click="loadMoreEquipment" :disabled="loading">
        {{ loading ? '加载中...' : '加载更多' }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'EquipmentView',
  setup() {
    const searchQuery = ref('');
    const selectedType = ref('all');
    const selectedBrand = ref('all');
    const selectedPriceRange = ref('all');
    const sortBy = ref('rating');
    const loading = ref(false);
    const equipment = ref([]);
    const compareList = ref([]);
    
    // 热门器材数据
    const featuredEquipment = ref([
      {
        id: 1,
        name: 'Sony A7M4 全画幅微单相机',
        imageUrl: 'https://picsum.photos/600/400?random=101',
        rating: 4.8,
        reviewCount: 125
      },
      {
        id: 2,
        name: 'Canon EOS R5 全画幅微单相机',
        imageUrl: 'https://picsum.photos/600/400?random=102',
        rating: 4.9,
        reviewCount: 98
      },
      {
        id: 3,
        name: 'Sigma 24-70mm F2.8 DG DN Art',
        imageUrl: 'https://picsum.photos/600/400?random=103',
        rating: 4.7,
        reviewCount: 76
      },
      {
        id: 4,
        name: 'Fujifilm X-T5 无反相机',
        imageUrl: 'https://picsum.photos/600/400?random=104',
        rating: 4.6,
        reviewCount: 65
      }
    ]);
    
    // 生成模拟器材数据
    const generateMockEquipment = (count) => {
      const types = ['camera', 'lens', 'accessory'];
      const brands = ['canon', 'nikon', 'sony', 'fuji', 'panasonic', 'sigma', 'tamron'];
      const mockEquipment = [];
      
      for (let i = 0; i < count; i++) {
        const randomId = i + 1;
        const type = types[Math.floor(Math.random() * types.length)];
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const price = Math.floor(Math.random() * 30000) + 500;
        const rating = Math.round((3.5 + Math.random() * 1.5) * 10) / 10;
        const reviewCount = Math.floor(Math.random() * 200) + 10;
        
        mockEquipment.push({
          id: randomId,
          name: getRandomEquipmentName(type, brand),
          type: type,
          brand: getBrandText(brand),
          price: price,
          rating: rating,
          reviewCount: reviewCount,
          imageUrl: `https://picsum.photos/600/400?random=${randomId + 200}`,
          keyFeatures: getRandomFeatures(type),
          releaseDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000)
        });
      }
      
      return mockEquipment;
    };
    
    // 获取品牌中文名称
    const getBrandText = (brand) => {
      const brandMap = {
        'canon': '佳能',
        'nikon': '尼康',
        'sony': '索尼',
        'fuji': '富士',
        'panasonic': '松下',
        'sigma': '适马',
        'tamron': '腾龙'
      };
      return brandMap[brand] || brand;
    };
    
    // 获取器材类型中文名称
    const getItemTypeText = (type) => {
      const typeMap = {
        'camera': '相机',
        'lens': '镜头',
        'accessory': '配件'
      };
      return typeMap[type] || type;
    };
    
    // 随机器材名称生成函数
    const getRandomEquipmentName = (type, brand) => {
      const names = {
        'camera': [
          'EOS R5 全画幅微单相机',
          'EOS R6 Mark II 全画幅微单相机',
          'A7 IV 全画幅微单相机',
          'A7R V 全画幅微单相机',
          'Z7 II 全画幅微单相机',
          'Z6 II 全画幅微单相机',
          'X-T5 无反相机',
          'X-S20 无反相机',
          'GH6 无反相机'
        ],
        'lens': [
          'RF 24-70mm F2.8L IS USM 标准变焦镜头',
          'RF 70-200mm F2.8L IS USM 远摄变焦镜头',
          'FE 24-70mm F2.8 GM II 标准变焦镜头',
          'FE 70-200mm F2.8 GM OSS II 远摄变焦镜头',
          '24-70mm F2.8 DG DN Art 标准变焦镜头',
          '16-35mm F2.8 DG DN Art 超广角镜头',
          '100-400mm F4.5-6.3 Di VC USD 远摄变焦镜头'
        ],
        'accessory': [
          'BG-R10 电池手柄',
          'NP-FZ100 高容量电池',
          'G Master 镜头保护滤镜',
          '专业三脚架套装',
          '高速SD存储卡',
          '无线遥控器',
          '相机背包',
          '外置闪光灯'
        ]
      };
      
      const brandText = getBrandText(brand);
      const randomName = names[type][Math.floor(Math.random() * names[type].length)];
      
      // 为相机和镜头添加品牌前缀
      if (type === 'camera' || type === 'lens') {
        return brandText + ' ' + randomName;
      }
      
      return randomName;
    };
    
    // 随机特性生成函数
    const getRandomFeatures = (type) => {
      const features = {
        'camera': [
          '高分辨率传感器',
          '优秀的低光表现',
          '高速连拍',
          '先进的自动对焦',
          '4K视频拍摄',
          '机身防抖',
          '全天候机身'
        ],
        'lens': [
          '大光圈设计',
          '优质光学玻璃',
          '防抖功能',
          '高速自动对焦',
          '防尘防水溅',
          '轻量设计',
          '优秀的焦外表现'
        ],
        'accessory': [
          '耐用材质',
          '轻便设计',
          '高兼容性',
          '专业级性能',
          '长时间续航',
          '易于携带',
          '多功能设计'
        ]
      };
      
      // 随机选择2-4个特性
      const selectedFeatures = [];
      const featureList = features[type];
      const count = Math.floor(Math.random() * 3) + 2;
      
      while (selectedFeatures.length < count) {
        const randomIndex = Math.floor(Math.random() * featureList.length);
        if (!selectedFeatures.includes(featureList[randomIndex])) {
          selectedFeatures.push(featureList[randomIndex]);
        }
      }
      
      return selectedFeatures;
    };
    
    // 格式化价格
    const formatPrice = (price) => {
      return '¥' + price.toLocaleString('zh-CN');
    };
    
    // 初始化加载
    const initializeEquipment = () => {
      equipment.value = generateMockEquipment(20);
    };
    
    // 加载更多
    const loadMoreEquipment = () => {
      loading.value = true;
      
      // 模拟网络延迟
      setTimeout(() => {
        const moreEquipment = generateMockEquipment(10);
        equipment.value = [...equipment.value, ...moreEquipment];
        loading.value = false;
      }, 1500);
    };
    
    // 计算筛选后的器材
    const filteredEquipment = computed(() => {
      let result = [...equipment.value];
      
      // 搜索筛选
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(item => 
          item.name.toLowerCase().includes(query) ||
          item.brand.toLowerCase().includes(query) ||
          item.keyFeatures.some(feature => feature.toLowerCase().includes(query))
        );
      }
      
      // 类型筛选
      if (selectedType.value !== 'all') {
        result = result.filter(item => item.type === selectedType.value);
      }
      
      // 品牌筛选
      if (selectedBrand.value !== 'all') {
        const brandText = getBrandText(selectedBrand.value);
        result = result.filter(item => item.brand === brandText);
      }
      
      // 价格范围筛选
      result = result.filter(item => {
        switch (selectedPriceRange.value) {
          case 'low': return item.price < 1000;
          case 'mid-low': return item.price >= 1000 && item.price < 5000;
          case 'mid': return item.price >= 5000 && item.price < 10000;
          case 'mid-high': return item.price >= 10000 && item.price < 20000;
          case 'high': return item.price >= 20000;
          default: return true;
        }
      });
      
      // 排序
      switch (sortBy.value) {
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
          break;
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
      }
      
      return result;
    });
    
    // 筛选处理函数已移除，使用计算属性自动响应变更
    
    const resetFilters = () => {
      searchQuery.value = '';
      selectedType.value = 'all';
      selectedBrand.value = 'all';
      selectedPriceRange.value = 'all';
      sortBy.value = 'rating';
    };
    
    // 对比功能
    const addCompare = (itemId) => {
      if (!compareList.value.includes(itemId) && compareList.value.length < 4) {
        compareList.value.push(itemId);
      }
    };
    
    const removeCompare = (itemId) => {
      compareList.value = compareList.value.filter(id => id !== itemId);
    };
    
    const isInCompare = (itemId) => {
      return compareList.value.includes(itemId);
    };
    
    const getEquipmentName = (itemId) => {
      const item = equipment.value.find(e => e.id === itemId);
      return item ? item.name : '';
    };
    
    const showCompareModal = () => {};
    const viewEquipmentDetails = (itemId) => {};
    
    onMounted(() => {
      initializeEquipment();
    });
    
    return {
      searchQuery,
      selectedType,
      selectedBrand,
      selectedPriceRange,
      sortBy,
      loading,
      equipment,
      featuredEquipment,
      filteredEquipment,
      compareList,
      resetFilters,
      loadMoreEquipment,
      getItemTypeText,
      formatPrice,
      addCompare,
      removeCompare,
      isInCompare,
      getEquipmentName,
      showCompareModal,
      viewEquipmentDetails
    };
  }
};
</script>

<style scoped>
.equipment-container {
  min-height: 100vh;
  padding: var(--spacing-lg) var(--spacing-xl);
  position: relative;
}

.equipment-header {
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

.search-filter-section {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-medium);
}

.search-container {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.search-input {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(42, 92, 140, 0.1);
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
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.search-btn:hover {
  background-color: var(--primary-dark);
}

.filter-container {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.filter-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.filter-select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: transparent;
  color: var(--text-primary);
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

.filter-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(42, 92, 140, 0.1);
}

.reset-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.featured-equipment {
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.featured-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  background-color: var(--card-bg);
  box-shadow: var(--shadow-medium);
  transition: all 0.3s ease;
  cursor: pointer;
}

.featured-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-large);
}

.featured-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-md);
  transition: transform 0.3s ease;
}

.featured-item:hover .featured-image {
  transform: scale(1.05);
}

.featured-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
}

.featured-rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.rating-stars {
  color: var(--accent-color);
  font-size: 0.9rem;
}

.rating-stars .filled {
  opacity: 1;
}

.rating-stars span {
  opacity: 0.3;
}

.rating-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.equipment-list-section {
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

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

.equipment-card {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-medium);
  transition: all 0.3s ease;
}

.equipment-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-large);
}

.equipment-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-md);
  transition: transform 0.3s ease;
}

.equipment-card:hover .equipment-image {
  transform: scale(1.03);
}

.equipment-brand {
  font-size: 0.9rem;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

.equipment-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
}

.equipment-type {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.equipment-price {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--accent-color);
  margin-bottom: var(--spacing-sm);
  font-family: 'Roboto Mono', monospace;
}

.equipment-rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
}

.equipment-features {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
}

.feature-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(42, 92, 140, 0.1);
  color: var(--primary-color);
  border-radius: 15px;
  font-size: 0.8rem;
}

.equipment-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: auto;
}

.view-btn,
.compare-btn {
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

.compare-btn {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.compare-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.compare-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--dark-bg);
  border-top: 1px solid var(--border-color);
  padding: var(--spacing-md);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.compare-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.compare-items {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.compare-text {
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 500;
}

.compare-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(42, 92, 140, 0.1);
  color: var(--primary-color);
  border-radius: 15px;
  font-size: 0.9rem;
}

.remove-compare {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-compare:hover {
  color: var(--primary-color);
}

.compare-btn-primary {
  padding: var(--spacing-md) var(--spacing-xl);
  border: none;
  border-radius: var(--border-radius);
  background-color: var(--primary-color);
  color: white;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.compare-btn-primary:hover {
  background-color: var(--primary-dark);
}

.load-more {
  text-align: center;
  margin-top: var(--spacing-xl);
  padding-bottom: 100px; /* 为底部对比栏留出空间 */
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
  .equipment-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>