<template>
  <div class="equipment-container">
    <!-- 器材模块头部 -->
    <div class="equipment-header">
      <h1>器材交流</h1>
      <p>发现、评测、交易摄影器材的全生命周期平台</p>
    </div>
    
    <!-- 器材内容 -->
    <div class="equipment-content">
      <!-- 器材数据库 -->
      <div class="database-section">
        <div class="database-header">
          <h2>热门器材</h2>
          <div class="database-filters">
            <div class="filter-group">
              <label>类型:</label>
              <select v-model="equipmentType" class="filter-select">
                <option value="all">全部类型</option>
                <option value="camera">相机</option>
                <option value="lens">镜头</option>
                <option value="accessory">配件</option>
              </select>
            </div>
            <div class="filter-group">
              <label>品牌:</label>
              <select v-model="equipmentBrand" class="filter-select">
                <option value="all">全部品牌</option>
                <option value="canon">佳能</option>
                <option value="nikon">尼康</option>
                <option value="sony">索尼</option>
                <option value="fujifilm">富士</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="equipment-grid">
          <div v-for="equipment in equipmentData" :key="equipment.id" class="equipment-card">
            <div class="equipment-image">
              <img :src="equipment.imageUrl" :alt="equipment.name" />
            </div>
            
            <div class="equipment-info">
              <div class="equipment-brand">{{ getBrandLabel(equipment.brand) }}</div>
              <h3 class="equipment-name">{{ equipment.name }}</h3>
              
              <div class="equipment-rating">
                <div class="rating-stars">
                  <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= equipment.rating }">★</span>
                </div>
                <span class="rating-text">{{ equipment.rating.toFixed(1) }} ({{ equipment.ratingCount }})</span>
              </div>
              
              <div class="equipment-price">¥{{ equipment.price.toLocaleString() }}</div>
              
              <div class="equipment-stats">
                <span class="stat-item">
                  <i class="like-icon">♥</i>
                  {{ equipment.likes || 0 }}
                </span>
                <span class="stat-item">
                  <i class="comment-icon">💬</i>
                  {{ equipment.comments || 0 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 器材筛选
const equipmentType = ref('all');
const equipmentBrand = ref('all');

// 品牌标签映射
const getBrandLabel = (brand) => {
  const labels = {
    canon: '佳能',
    nikon: '尼康',
    sony: '索尼',
    fujifilm: '富士',
    panasonic: '松下',
    leica: '徕卡',
    sigma: '适马',
    tamron: '腾龙',
  };
  return labels[brand] || brand;
};

// 模拟器材数据
const equipmentData = ref([
  {
    id: 1,
    name: 'EOS R5',
    brand: 'canon',
    type: 'camera',
    imageUrl: 'https://picsum.photos/600/400?random=401',
    rating: 4.8,
    ratingCount: 356,
    price: 25999,
    likes: 520,
    comments: 98,
  },
  {
    id: 2,
    name: 'A7R IV',
    brand: 'sony',
    type: 'camera',
    imageUrl: 'https://picsum.photos/600/400?random=402',
    rating: 4.7,
    ratingCount: 423,
    price: 22999,
    likes: 480,
    comments: 87,
  },
  {
    id: 3,
    name: 'Z7 II',
    brand: 'nikon',
    type: 'camera',
    imageUrl: 'https://picsum.photos/600/400?random=403',
    rating: 4.6,
    ratingCount: 289,
    price: 19999,
    likes: 410,
    comments: 76,
  },
  {
    id: 4,
    name: 'X-T4',
    brand: 'fujifilm',
    type: 'camera',
    imageUrl: 'https://picsum.photos/600/400?random=404',
    rating: 4.5,
    ratingCount: 312,
    price: 12499,
    likes: 390,
    comments: 65,
  },
  {
    id: 5,
    name: 'RF 24-70mm f/2.8L IS USM',
    brand: 'canon',
    type: 'lens',
    imageUrl: 'https://picsum.photos/600/400?random=405',
    rating: 4.9,
    ratingCount: 189,
    price: 18999,
    likes: 350,
    comments: 54,
  },
  {
    id: 6,
    name: 'FE 24-70mm f/2.8 GM',
    brand: 'sony',
    type: 'lens',
    imageUrl: 'https://picsum.photos/600/400?random=406',
    rating: 4.8,
    ratingCount: 215,
    price: 16999,
    likes: 320,
    comments: 48,
  },
]);
</script>

<style scoped>
.equipment-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.equipment-header {
  text-align: center;
  margin-bottom: 40px;
}

.equipment-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #333;
}

.equipment-header p {
  font-size: 1.1rem;
  color: #666;
}

.database-section {
  margin-bottom: 40px;
}

.database-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 20px;
}

.database-header h2 {
  font-size: 1.8rem;
  color: #333;
}

.database-filters {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 0.9rem;
  color: #333;
}

.filter-select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 0.9rem;
}

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.equipment-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.equipment-card:hover {
  transform: translateY(-5px);
}

.equipment-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.equipment-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.equipment-card:hover .equipment-image img {
  transform: scale(1.05);
}

.equipment-info {
  padding: 20px;
}

.equipment-brand {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.equipment-name {
  font-size: 1.2rem;
  margin-bottom: 12px;
  color: #333;
}

.equipment-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 1rem;
}

.star.filled {
  color: #ffb800;
}

.rating-text {
  font-size: 0.9rem;
  color: #666;
}

.equipment-price {
  font-size: 1.4rem;
  font-weight: bold;
  color: #e74c3c;
  margin-bottom: 12px;
}

.equipment-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  font-size: 0.9rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 768px) {
  .database-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .equipment-grid {
    grid-template-columns: 1fr;
  }
  
  .equipment-header h1 {
    font-size: 2rem;
  }
}
</style>