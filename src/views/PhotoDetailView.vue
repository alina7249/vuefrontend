<template>
  <div class="photo-detail-container">
    <div class="back-button" @click="goBack">
      <span>&larr; 返回</span>
    </div>
    
    <!-- 图片展示区 -->
    <div class="image-container" @wheel.prevent="handleZoom">
      <div 
        class="image-wrapper" 
        :style="{ transform: `scale(${currentScale})` }"
      >
        <img 
          :src="photoData?.imageUrl" 
          :alt="photoData?.title" 
          :style="{ opacity: photoLoaded ? 1 : 0 }"
          @load="photoLoaded = true"
          @error="handleImageError"
        />
        <div v-if="!photoLoaded" class="loading-placeholder">
          <div class="loading-spinner"></div>
        </div>
      </div>
      <div class="zoom-controls">
        <button @click="zoomIn" class="zoom-btn">+</button>
        <button @click="zoomOut" class="zoom-btn">-</button>
        <button @click="resetZoom" class="zoom-btn">重置</button>
      </div>
    </div>
    
    <!-- 信息互动区 -->
    <div class="info-section">
      <!-- 作者栏 -->
      <div class="author-section">
        <img 
          :src="photoData?.authorAvatar" 
          :alt="photoData?.author" 
          class="author-avatar"
        />
        <div class="author-info">
          <h3 class="author-name">{{ photoData?.author }}</h3>
          <div v-if="photoData?.authorVerified" class="verification-badge">
            {{ photoData?.verificationText }}
          </div>
        </div>
        <button 
          class="follow-button" 
          :class="{ followed: photoData?.isFollowing }"
          @click="handleFollow"
        >
          {{ photoData?.isFollowing ? '已关注' : '关注' }}
        </button>
      </div>
      
      <!-- 拍摄参数 -->
      <div class="photo-params">
        <h3 class="section-title">拍摄信息</h3>
        <div class="params-grid">
          <div class="param-item">
            <span class="param-label">相机型号</span>
            <span class="param-value">{{ photoData?.camera }}</span>
          </div>
          <div class="param-item">
            <span class="param-label">镜头型号</span>
            <span class="param-value">{{ photoData?.lens }}</span>
          </div>
          <div class="param-item">
            <span class="param-label">光圈值</span>
            <span class="param-value">{{ photoData?.aperture }}</span>
          </div>
          <div class="param-item">
            <span class="param-label">快门速度</span>
            <span class="param-value">{{ photoData?.shutterSpeed }}</span>
          </div>
          <div class="param-item">
            <span class="param-label">ISO</span>
            <span class="param-value">{{ photoData?.iso }}</span>
          </div>
          <div class="param-item">
            <span class="param-label">拍摄时间</span>
            <span class="param-value">{{ photoData?.date }}</span>
          </div>
        </div>
      </div>
      
      <!-- 互动区 -->
      <div class="interaction-section">
        <div class="interaction-buttons">
          <button 
            class="interaction-btn like-btn" 
            :class="{ active: photoData?.liked }"
            @click="handleLike"
          >
            <span class="icon">{{ photoData?.liked ? '❤️' : '🤍' }}</span>
            <span class="count">{{ photoData?.likes }}</span>
          </button>
          <button 
            class="interaction-btn collect-btn" 
            :class="{ active: photoData?.collected }"
            @click="handleCollect"
          >
            <span class="icon">{{ photoData?.collected ? '⭐' : '☆' }}</span>
            <span class="count">{{ photoData?.collections }}</span>
          </button>
          <button class="interaction-btn share-btn" @click="handleShare">
            <span class="icon">🔗</span>
            <span class="count">{{ photoData?.comments }}</span>
          </button>
        </div>
      </div>
      
      <!-- 评论区 -->
      <div class="comments-section">
        <h3 class="section-title">评论 ({{ photoData?.comments }})</h3>
        
        <!-- 评论输入框 -->
        <div class="comment-input-container">
          <img src="https://picsum.photos/seed/currentuser/40/40" alt="Your avatar" class="user-avatar" />
          <div class="comment-input-wrapper">
            <textarea 
              v-model="commentText" 
              placeholder="写下你的评论..." 
              class="comment-textarea"
              rows="2"
            ></textarea>
            <button 
              class="submit-comment-btn" 
              :disabled="!commentText.trim()"
              @click="submitComment"
            >
              发布评论
            </button>
          </div>
        </div>
        
        <!-- 评论列表 -->
        <div class="comments-list">
          <div 
            v-for="comment in photoData?.commentList" 
            :key="comment.id" 
            class="comment-item"
          >
            <img :src="comment.avatar" :alt="comment.author" class="comment-avatar" />
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-author">{{ comment.author }}</span>
                <span class="comment-time">{{ comment.time }}</span>
              </div>
              <p class="comment-text">{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'PhotoDetailView',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const photoData = ref(null);
    const photoLoaded = ref(false);
    const currentScale = ref(1);
    const commentText = ref('');
    
    // 获取作品数据
    const fetchPhotoData = async () => {
      const photoId = parseInt(route.params.id);
      
      // 模拟网络请求
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 生成模拟数据
      const generateMockData = () => {
        const categoryNames = ['人像摄影', '风光摄影', '纪实摄影', '街拍摄影', '生态摄影', '建筑摄影', '器材评测', '后期教程', 'AI摄影'];
        const cameraModels = ['佳能 EOS R5', '索尼 A7R IV', '尼康 Z7 II', '富士 GFX 100S'];
        const lensModels = ['24-70mm f/2.8', '70-200mm f/2.8', '35mm f/1.4', '85mm f/1.4', '16-35mm f/2.8'];
        const locations = ['北京故宫', '上海外滩', '杭州西湖', '成都锦里', '西安兵马俑', '三亚亚龙湾'];
        const titles = [
          '城市夜景', '山间云雾', '人物肖像', '街头瞬间', '自然生态',
          '建筑之美', '光影交错', '季节变换', '旅途风光', '人文纪实'
        ];
        const authors = [
          '摄影师小明', '光影猎人', '城市记录者', '自然探索家', '人文摄影师',
          '风景大师', '人像专家', '街拍达人', '后期高手', '器材评测师'
        ];
        const commentTexts = [
          '这张照片拍得真不错！构图和光线都很到位，学习了。',
          '色彩搭配很和谐，请问是用什么后期软件处理的？',
          '这个角度选得很好，捕捉到了难得的瞬间。',
          '景深控制得很棒，主体突出，背景虚化自然。',
          '构图很有创意，有故事感。',
          '请问这是在哪里拍的？景色太美了！',
          '光效很特别，是自然光还是人工光？',
          '后期处理得很自然，没有过度的感觉。'
        ];
        const commentAuthors = [
          '摄影爱好者A', '新手求带', '光影追随者', '器材党', '风景控',
          '人像爱好者', '街拍控', '后期大神'
        ];
        
        const authorIndex = Math.floor(Math.random() * authors.length);
        
        // 生成随机评论数
        const commentCount = Math.floor(Math.random() * 200);
        // 创建评论列表
        const commentList = [];
        
        // 为每个作品生成一些模拟评论
        const numComments = Math.min(Math.floor(Math.random() * 10) + 3, 15); // 每个作品3-10条评论
        for (let j = 0; j < numComments; j++) {
          const commentAuthorIndex = Math.floor(Math.random() * commentAuthors.length);
          const commentTextIndex = Math.floor(Math.random() * commentTexts.length);
          const hoursAgo = Math.floor(Math.random() * 168) + 1; // 评论时间1-168小时前
          
          commentList.push({
            id: Date.now() + j,
            author: commentAuthors[commentAuthorIndex],
            avatar: `https://picsum.photos/seed/comment${commentAuthorIndex}/40/40`,
            content: commentTexts[commentTextIndex],
            time: hoursAgo === 1 ? '1小时前' : `${hoursAgo}小时前`
          });
        }
        
        return {
          id: photoId,
          title: `${titles[Math.floor(Math.random() * titles.length)]} ${photoId}`,
          imageUrl: `https://picsum.photos/seed/${photoId}/1600/1200`, // 高清图
          imageWidth: 1600,
          imageHeight: 1200,
          author: authors[authorIndex],
          authorAvatar: `https://picsum.photos/seed/avatar${authorIndex}/100/100`,
          authorVerified: authorIndex < 5,
          verificationText: ['资深摄影师', '官方认证', '人气创作者', '技术顾问', '教程讲师'][authorIndex % 5],
          likes: Math.floor(Math.random() * 1000),
          comments: commentCount,
          collections: Math.floor(Math.random() * 300),
          camera: cameraModels[Math.floor(Math.random() * cameraModels.length)],
          lens: lensModels[Math.floor(Math.random() * lensModels.length)],
          aperture: `f/${(Math.random() * 3 + 1.4).toFixed(1)}`,
          shutterSpeed: `1/${Math.floor(Math.random() * 1000) + 1}s`,
          iso: Math.floor(Math.random() * 1600) + 100,
          focalLength: `${Math.floor(Math.random() * 200) + 14}mm`,
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          location: locations[Math.floor(Math.random() * locations.length)],
          category: categoryNames[Math.floor(Math.random() * categoryNames.length)],
          liked: false,
          collected: false,
          isFollowing: false,
          commentList: commentList
        };
      };
      
      photoData.value = generateMockData();
    };
    
    // 处理鼠标滚轮放大
    const handleZoom = (event) => {
      if (event.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
    };
    
    // 放大图片
    const zoomIn = () => {
      if (currentScale.value < 3) {
        currentScale.value += 0.1;
      }
    };
    
    // 缩小图片
    const zoomOut = () => {
      if (currentScale.value > 0.5) {
        currentScale.value -= 0.1;
      }
    };
    
    // 重置缩放
    const resetZoom = () => {
      currentScale.value = 1;
    };
    
    // 处理图片加载错误
    const handleImageError = (event) => {
      event.target.src = 'https://picsum.photos/seed/default/1600/1200';
    };
    
    // 处理关注/取消关注
    const handleFollow = () => {
      if (photoData.value) {
        photoData.value.isFollowing = !photoData.value.isFollowing;
      }
    };
    
    // 处理点赞
    const handleLike = () => {
      if (photoData.value) {
        if (photoData.value.liked) {
          photoData.value.likes -= 1;
        } else {
          photoData.value.likes += 1;
        }
        photoData.value.liked = !photoData.value.liked;
      }
    };
    
    // 处理收藏
    const handleCollect = () => {
      if (photoData.value) {
        if (photoData.value.collected) {
          photoData.value.collections -= 1;
        } else {
          photoData.value.collections += 1;
        }
        photoData.value.collected = !photoData.value.collected;
      }
    };
    
    // 处理分享
    const handleShare = () => {
      alert('分享功能已触发！');
    };
    
    // 提交评论
    const submitComment = () => {
      if (!commentText.value.trim() || !photoData.value) return;
      
      const newComment = {
        id: Date.now(),
        author: '当前用户',
        avatar: 'https://picsum.photos/seed/currentuser/40/40',
        content: commentText.value.trim(),
        time: '刚刚'
      };
      
      photoData.value.commentList.unshift(newComment);
      photoData.value.comments += 1;
      commentText.value = '';
    };
    
    // 返回上一页
    const goBack = () => {
      router.back();
    };
    
    onMounted(() => {
      fetchPhotoData();
    });
    
    return {
      photoData,
      photoLoaded,
      currentScale,
      commentText,
      handleZoom,
      zoomIn,
      zoomOut,
      resetZoom,
      handleImageError,
      handleFollow,
      handleLike,
      handleCollect,
      handleShare,
      submitComment,
      goBack
    };
  }
};
</script>

<style scoped>
.photo-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.back-button {
  margin-bottom: 20px;
  cursor: pointer;
  font-size: 16px;
  color: #333;
  transition: color 0.3s;
}

.back-button:hover {
  color: #007bff;
}

.image-container {
  position: relative;
  width: 100%;
  height: 600px;
  overflow: hidden;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  border-radius: 8px;
}

.image-wrapper {
  transition: transform 0.3s ease;
  max-width: 100%;
  max-height: 100%;
}

.image-wrapper img {
  transition: opacity 0.5s;
  max-width: 100%;
  max-height: 600px;
  object-fit: contain;
}

.loading-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0e0e0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.zoom-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

.zoom-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.zoom-btn:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.info-section {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.author-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.author-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  flex: 1;
}

.author-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 5px 0;
}

.verification-badge {
  background-color: #007bff;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  display: inline-block;
}

.follow-button {
  padding: 8px 20px;
  border: 1px solid #007bff;
  background-color: white;
  color: #007bff;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.follow-button:hover {
  background-color: #007bff;
  color: white;
}

.follow-button.followed {
  background-color: #007bff;
  color: white;
}

.photo-params {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.params-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.param-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.param-label {
  color: #666;
  font-size: 14px;
}

.param-value {
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.interaction-section {
  margin-bottom: 30px;
}

.interaction-buttons {
  display: flex;
  gap: 30px;
}

.interaction-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  transition: color 0.3s;
}

.interaction-btn:hover {
  color: #007bff;
}

.interaction-btn.active {
  color: #007bff;
}

.interaction-btn .icon {
  font-size: 20px;
}

.interaction-btn .count {
  font-size: 14px;
}

.like-btn.active .icon {
  color: #e74c3c;
}

.collect-btn.active .icon {
  color: #f39c12;
}

.comments-section {
  margin-top: 30px;
}

.comment-input-container {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-input-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comment-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  font-size: 14px;
  font-family: inherit;
}

.comment-textarea:focus {
  outline: none;
  border-color: #007bff;
}

.submit-comment-btn {
  align-self: flex-end;
  padding: 8px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.submit-comment-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-comment-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 15px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  gap: 10px;
  margin-bottom: 5px;
}

.comment-author {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.comment-time {
  color: #999;
  font-size: 12px;
}

.comment-text {
  color: #333;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .photo-detail-container {
    padding: 10px;
  }
  
  .image-container {
    height: 400px;
  }
  
  .params-grid {
    grid-template-columns: 1fr;
  }
  
  .interaction-buttons {
    justify-content: space-around;
  }
}
</style>