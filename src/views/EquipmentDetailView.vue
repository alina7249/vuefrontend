<template>
  <div class="equipment-detail-container">
    <div class="back-button" @click="goBack">
      <span>←</span> 返回列表
    </div>
    
    <div v-if="equipment" class="equipment-detail-content">
      <div class="equipment-detail-header">
        <div class="equipment-main-image">
          <img :src="equipment.imageUrl" :alt="equipment.name" />
        </div>
        
        <div class="equipment-main-info">
          <div class="equipment-brand">{{ getBrandLabel(equipment.brand) }}</div>
          <h1 class="equipment-name">{{ equipment.name }}</h1>
          
          <div class="equipment-rating">
            <div class="rating-stars">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= equipment.rating }">★</span>
            </div>
            <span class="rating-text">{{ equipment.rating.toFixed(1) }} ({{ equipment.ratingCount }} 评价)</span>
          </div>
          
          <div class="equipment-price">¥{{ equipment.price.toLocaleString() }}</div>
          
          <div class="equipment-actions">
            <button class="action-button like-btn" @click="toggleLike">
              <span class="action-icon">{{ isLiked ? '❤️' : '🤍' }}</span>
              {{ isLiked ? '已收藏' : '收藏' }}
            </button>
            <button class="action-button comment-btn" @click="toggleReviewModal">
              <span class="action-icon">💬</span>
              添加评价
            </button>
          </div>
          
          <div class="equipment-stats">
            <span class="stat-item">
              <i class="stat-icon">👁</i>
              {{ equipment.views || 0 }} 浏览
            </span>
            <span class="stat-item">
              <i class="stat-icon">❤️</i>
              {{ equipment.likes || 0 }} 收藏
            </span>
            <span class="stat-item">
              <i class="stat-icon">💬</i>
              {{ equipment.comments || 0 }} 评价
            </span>
          </div>
        </div>
      </div>
      
      <div class="equipment-detail-tabs">
        <div class="tab-button" :class="{ active: activeTab === 'description' }" @click="activeTab = 'description'">
          产品描述
        </div>
        <div class="tab-button" :class="{ active: activeTab === 'specs' }" @click="activeTab = 'specs'">
          规格参数
        </div>
        <div class="tab-button" :class="{ active: activeTab === 'reviews' }" @click="activeTab = 'reviews'">
          用户评价 ({{ equipment.ratingCount }})
        </div>
      </div>
      
      <div class="tab-content">
        <div v-if="activeTab === 'description'" class="description-tab">
          <p>{{ equipment.description || '暂无详细描述' }}</p>
        </div>
        
        <div v-if="activeTab === 'specs'" class="specs-tab">
          <div class="specs-list">
            <div class="spec-item">
              <span class="spec-label">类型:</span>
              <span class="spec-value">{{ getTypeLabel(equipment.type) }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">品牌:</span>
              <span class="spec-value">{{ getBrandLabel(equipment.brand) }}</span>
            </div>
            <div class="spec-item" v-if="equipment.type === 'camera'">
              <span class="spec-label">传感器类型:</span>
              <span class="spec-value">{{ equipment.sensor || '全画幅' }}</span>
            </div>
            <div class="spec-item" v-if="equipment.type === 'lens'">
              <span class="spec-label">焦距:</span>
              <span class="spec-value">{{ equipment.focalLength || '24-70mm' }}</span>
            </div>
            <div class="spec-item" v-if="equipment.type === 'lens'">
              <span class="spec-label">光圈:</span>
              <span class="spec-value">{{ equipment.aperture || 'f/2.8' }}</span>
            </div>
          </div>
        </div>
        
        <div v-if="activeTab === 'reviews'" class="reviews-tab">
          <div class="review-summary">
            <div class="overall-rating">
              <div class="rating-score">{{ equipment.rating.toFixed(1) }}</div>
              <div class="rating-stars-large">
                <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= equipment.rating }">★</span>
              </div>
            </div>
          </div>
          
          <div class="reviews-list">
            <div v-for="review in equipment.reviews" :key="review.id" class="review-item">
              <div class="reviewer-info">
                <div class="reviewer-avatar">
                  <img :src="review.userAvatar" :alt="review.userName" />
                </div>
                <div class="reviewer-details">
                  <div class="reviewer-name">{{ review.userName }}</div>
                  <div class="review-date">{{ review.date }}</div>
                </div>
                <div class="review-rating">
                  <div class="rating-stars">
                    <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</span>
                  </div>
                </div>
              </div>
              <div class="review-content">
                {{ review.content }}
              </div>
            </div>
            
            <div v-if="!(equipment.reviews && equipment.reviews.length)" class="no-reviews">
              暂无评价，成为第一个评价的用户吧！
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 评价弹窗 -->
    <div v-if="showReviewModal" class="review-modal-overlay" @click.self="toggleReviewModal">
      <div class="review-modal">
        <div class="modal-header">
          <h3>添加评价</h3>
          <button class="close-button" @click="toggleReviewModal">×</button>
        </div>
        
        <div class="modal-body">
          <div class="rating-selection">
            <label>总体评分：</label>
            <div class="rating-input">
              <span 
                v-for="i in 5" 
                :key="i" 
                class="star-rating" 
                :class="{ active: i <= reviewRating }"
                @click="reviewRating = i"
              >★</span>
            </div>
          </div>
          
          <div class="content-selection">
            <label for="reviewContent">评价内容：</label>
            <textarea 
              id="reviewContent"
              v-model="reviewContent"
              class="review-textarea"
              placeholder="请分享您使用这款产品的体验和感受..."
              rows="5"
            ></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="cancel-button" @click="toggleReviewModal">取消</button>
          <button class="submit-button" @click="submitReview">提交评价</button>
        </div>
      </div>
    </div>
    
    <div v-else class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const activeTab = ref('description');
const isLiked = ref(false);
const equipment = ref(null);
const showReviewModal = ref(false);
const reviewRating = ref(5);
const reviewContent = ref('');
const currentUserName = ref('当前用户');
const currentUserAvatar = ref('https://picsum.photos/40/40?random=600');

// 获取品牌标签
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

// 获取类型标签
const getTypeLabel = (type) => {
  const labels = {
    camera: '相机',
    lens: '镜头',
    accessory: '配件'
  };
  return labels[type] || type;
};

// 返回列表页
const goBack = () => {
  router.push('/equipment');
};

// 切换收藏状态
const toggleLike = () => {
  isLiked.value = !isLiked.value;
  if (equipment.value) {
    equipment.value.likes += isLiked.value ? 1 : -1;
  }
};

// 切换评价弹窗
const toggleReviewModal = () => {
  showReviewModal.value = !showReviewModal.value;
  if (!showReviewModal.value) {
    // 重置表单
    reviewRating.value = 5;
    reviewContent.value = '';
  }
};

// 提交评价
const submitReview = () => {
  if (!reviewContent.value.trim()) {
    alert('请输入评价内容');
    return;
  }
  
  if (equipment.value) {
    // 创建新评价
    const newReview = {
      id: Date.now(), // 使用时间戳作为唯一ID
      userName: currentUserName.value,
      userAvatar: currentUserAvatar.value,
      rating: reviewRating.value,
      date: new Date().toISOString().split('T')[0],
      content: reviewContent.value
    };
    
    // 添加到评价列表
    if (!equipment.value.reviews) {
      equipment.value.reviews = [];
    }
    equipment.value.reviews.unshift(newReview); // 添加到列表开头
    
    // 更新统计数据
    equipment.value.comments++;
    equipment.value.ratingCount++;
    
    // 重新计算平均评分
    const totalRating = equipment.value.reviews.reduce((sum, review) => sum + review.rating, 0);
    equipment.value.rating = totalRating / equipment.value.reviews.length;
    
    // 关闭弹窗并重置表单
    toggleReviewModal();
    
    // 自动切换到评价标签页
    activeTab.value = 'reviews';
  }
};

// 模拟获取器材详情数据
const fetchEquipmentDetail = () => {
  const equipmentId = parseInt(route.params.id);
  
  // 模拟器材详情数据
  const mockEquipmentData = [
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
      views: 3200,
      description: '佳能EOS R5是一款全画幅无反相机，配备4500万像素CMOS传感器和8K视频录制能力。采用机身防抖系统，可实现高达8级的防抖效果。高速连拍可达12fps机械快门或20fps电子快门，对焦系统拥有5940个自动对焦点，覆盖几乎整个画面。',
      sensor: '全画幅CMOS',
      reviews: [
        {
          id: 101,
          userName: '摄影爱好者小王',
          userAvatar: 'https://picsum.photos/40/40?random=501',
          rating: 5,
          date: '2023-09-15',
          content: '画质惊人，8K视频功能非常强大，防抖效果超出预期。电池续航也比想象中要好，推荐给专业摄影师。'
        },
        {
          id: 102,
          userName: '专业摄影师老李',
          userAvatar: 'https://picsum.photos/40/40?random=502',
          rating: 4,
          date: '2023-08-22',
          content: '对焦系统非常精准，在弱光环境下表现也很出色。唯一的缺点是价格有点高，但考虑到性能还是值得的。'
        }
      ]
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
      views: 2900,
      description: '索尼A7R IV搭载6100万像素全画幅Exmor R CMOS传感器，拥有先进的图像处理系统。采用改进的 autofocus系统，具备实时眼部对焦功能。可录制4K HDR视频，拥有高分辨率电子取景器和可翻转触摸屏。',
      sensor: '全画幅Exmor R CMOS',
      reviews: [
        {
          id: 201,
          userName: '风景摄影师小张',
          userAvatar: 'https://picsum.photos/40/40?random=503',
          rating: 5,
          date: '2023-07-10',
          content: '6100万像素带来惊人的细节表现，风景摄影的利器。高分辨率屏幕也很实用，可以方便地检查细节。'
        }
      ]
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
      views: 2500,
      description: '尼康Z7 II是一款4571万像素全画幅无反相机，配备双EXPEED 6影像处理器。改进的对焦系统和双存储卡插槽设计，提升了专业用户的工作效率。机身防抖系统可提供约5轴VR防抖，配合VR镜头使用可达到更高的防抖级别。',
      sensor: '全画幅CMOS'
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
      views: 2100,
      description: '富士X-T4搭载2610万像素APS-C画幅X-Trans CMOS 4传感器，内置机身防抖系统。采用机械快门可实现15fps连拍，电子快门可达到20fps。具备翻转触摸屏和高性能 autofocus系统，支持4K/60p视频录制。'
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
      views: 1800,
      description: '佳能RF 24-70mm f/2.8L IS USM是一款专业标准变焦镜头，为EOS R系统设计。采用17组21片光学结构，包括多片特殊镜片。内置光学防抖系统，可提供最多5级防抖效果。USM超声波马达提供快速、安静的自动对焦。',
      focalLength: '24-70mm',
      aperture: 'f/2.8'
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
      views: 1900,
      description: '索尼FE 24-70mm f/2.8 GM是一款G大师级标准变焦镜头，采用先进的光学设计。包含多片特殊低色散和非球面镜片，有效抑制各种像差。双线性马达提供快速、精准的自动对焦。专业级防尘防滴设计，适合恶劣环境使用。',
      focalLength: '24-70mm',
      aperture: 'f/2.8'
    }
  ];
  
  // 查找匹配的器材
  equipment.value = mockEquipmentData.find(item => item.id === equipmentId) || null;
};

onMounted(() => {
  fetchEquipmentDetail();
});
</script>

<style scoped>
.equipment-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #e0e0e0;
}

.back-button span {
  font-size: 1.2rem;
  margin-right: 5px;
}

.equipment-detail-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.equipment-detail-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  padding: 30px;
  border-bottom: 1px solid #e0e0e0;
}

.equipment-main-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}

.equipment-brand {
  font-size: 1rem;
  color: #666;
  margin-bottom: 5px;
}

.equipment-name {
  font-size: 1.8rem;
  color: #333;
  margin: 0 0 15px 0;
}

.equipment-rating {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.rating-stars .star {
  color: #e0e0e0;
  font-size: 1.2rem;
  margin-right: 2px;
}

.rating-stars .star.filled {
  color: #ff9800;
}

.rating-text {
  margin-left: 10px;
  color: #666;
}

.equipment-price {
  font-size: 1.5rem;
  color: #f44336;
  font-weight: bold;
  margin-bottom: 20px;
}

.equipment-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.like-btn {
  background-color: #fff;
  border: 1px solid #ddd;
  color: #333;
}

.like-btn:hover {
  background-color: #f5f5f5;
}

.comment-btn {
  background-color: #2196f3;
  color: white;
}

.comment-btn:hover {
  background-color: #1976d2;
}

.action-icon {
  margin-right: 5px;
  font-size: 1.1rem;
}

.equipment-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  color: #666;
}

.stat-icon {
  margin-right: 5px;
  font-style: normal;
}

.equipment-detail-tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
}

.tab-button {
  padding: 15px 30px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tab-button:hover {
  background-color: #f5f5f5;
}

.tab-button.active {
  border-bottom-color: #2196f3;
  color: #2196f3;
  font-weight: bold;
}

.tab-content {
  padding: 30px;
}

.description-tab p {
  line-height: 1.6;
  color: #333;
}

.specs-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.spec-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.spec-label {
  flex: 0 0 100px;
  color: #666;
}

.spec-value {
  flex: 1;
  color: #333;
  font-weight: 500;
}

.review-summary {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.overall-rating {
  display: flex;
  align-items: center;
  gap: 15px;
}

.rating-score {
  font-size: 2.5rem;
  font-weight: bold;
  color: #ff9800;
}

.rating-stars-large .star {
  color: #e0e0e0;
  font-size: 1.5rem;
  margin-right: 2px;
}

.rating-stars-large .star.filled {
  color: #ff9800;
}

.review-item {
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.reviewer-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.reviewer-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.reviewer-details {
  margin-left: 10px;
  flex: 1;
}

.reviewer-name {
  font-weight: 500;
  color: #333;
}

.review-date {
  font-size: 0.9rem;
  color: #999;
}

.review-content {
  line-height: 1.6;
  color: #333;
}

.no-reviews {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2196f3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 评价弹窗样式 */
.review-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.review-modal {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.close-button:hover {
  background-color: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 20px;
}

.rating-selection {
  margin-bottom: 20px;
}

.rating-selection label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #333;
}

.rating-input {
  display: flex;
  gap: 5px;
}

.star-rating {
  font-size: 2rem;
  color: #e0e0e0;
  cursor: pointer;
  transition: color 0.3s;
}

.star-rating:hover,
.star-rating.active {
  color: #ff9800;
}

.content-selection label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #333;
}

.review-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-size: 1rem;
  line-height: 1.5;
}

.review-textarea:focus {
  outline: none;
  border-color: #2196f3;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
}

.cancel-button,
.submit-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #666;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

.submit-button {
  background-color: #2196f3;
  color: white;
}

.submit-button:hover {
  background-color: #1976d2;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .equipment-detail-header {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .specs-list {
    grid-template-columns: 1fr;
  }
  
  .review-summary {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .review-modal {
    width: 95%;
    margin: 20px;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 15px;
  }
}
</style>