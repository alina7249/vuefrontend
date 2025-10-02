<template>
  <div class="photo-card" :class="{ 'in-view': inView }">
    <!-- 暗房柔焦光效 -->
    <div class="photo-card-glow"></div>
    
    <!-- 作品图片 -->
    <img 
      :src="photo.url" 
      :alt="photo.title" 
      class="photo-image" 
      loading="lazy"
    />
    
    <!-- 胶片齿孔边框 -->
    <div class="film-border"></div>
    
    <!-- 作品信息 -->
    <div class="photo-info">
      <h3 class="photo-title">{{ photo.title }}</h3>
      <div class="photo-meta">
        <div class="photo-author">
          <img :src="photo.author.avatar" :alt="photo.author.name" class="author-avatar" />
          <span class="author-name">{{ photo.author.name }}</span>
        </div>
        <div class="photo-stats">
          <span class="stat">{{ photo.likes }} <i class="like-icon">❤️</i></span>
          <span class="stat">{{ photo.comments }} <i class="comment-icon">💬</i></span>
          <span class="stat">{{ photo.favorites }} <i class="favorite-icon">⭐</i></span>
        </div>
      </div>
    </div>
    
    <!-- 交互按钮 -->
    <div class="photo-actions">
      <button class="action-btn shutter-button like-btn" @click="handleLike">
        <span class="action-icon">❤️</span>
      </button>
      <button class="action-btn shutter-button comment-btn" @click="handleComment">
        <span class="action-icon">💬</span>
      </button>
      <button class="action-btn shutter-button favorite-btn" @click="handleFavorite">
        <span class="action-icon">⭐</span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'PhotoCard',
  props: {
    photo: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const inView = ref(false);
    
    // 模拟数据
    const mockPhoto = {
      id: 1,
      title: "山间晨雾",
      url: "https://picsum.photos/800/600?random=1",
      likes: 128,
      comments: 24,
      favorites: 56,
      author: {
        id: 101,
        name: "光影记录者",
        avatar: "https://picsum.photos/100/100?random=101"
      },
      exif: {
        camera: "Canon EOS R5",
        lens: "RF 24-70mm F2.8L IS USM",
        aperture: "f/5.6",
        shutter: "1/250s",
        iso: 400
      }
    };
    
    // 处理图片进入视口
    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        inView.value = entry.isIntersecting;
      });
    };
    
    let observer;
    
    onMounted(() => {
      const options = {
        threshold: 0.2
      };
      
      observer = new IntersectionObserver(handleIntersection, options);
      const cardElement = document.querySelector(`.photo-card:nth-child(${Math.floor(Math.random() * 10) + 1})`);
      if (cardElement) {
        observer.observe(cardElement);
      }
    });
    
    onUnmounted(() => {
      if (observer) {
        observer.disconnect();
      }
    });
    
    // 交互处理函数
    const handleLike = () => {
      // 点赞逻辑
      console.log('Liked photo:', props.photo.id);
    };
    
    const handleComment = () => {
      // 评论逻辑
      console.log('Comment on photo:', props.photo.id);
    };
    
    const handleFavorite = () => {
      // 收藏逻辑
      console.log('Favorite photo:', props.photo.id);
    };
    
    return {
      inView,
      mockPhoto,
      handleLike,
      handleComment,
      handleFavorite
    };
  }
};
</script>

<style scoped>
.photo-card {
  position: relative;
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-medium);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.photo-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

/* 暗房柔焦光效 */
.photo-card-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
  pointer-events: none;
  z-index: 1;
  transition: opacity 0.3s ease;
  opacity: 0;
}

/* 视口内效果 */
.photo-card.in-view .photo-card-glow {
  opacity: 1;
  filter: blur(3px);
}

.photo-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: filter 0.4s ease;
}

.photo-card:hover .photo-image {
  filter: grayscale(100%) contrast(110%);
}

/* 胶片齿孔边框 */
.film-border {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.3s ease;
  background-image: 
    repeating-linear-gradient(to right, transparent 0px, transparent 16px, rgba(248, 248, 248, 0.2) 16px, rgba(248, 248, 248, 0.2) 24px),
    repeating-linear-gradient(to bottom, transparent 0px, transparent 16px, rgba(248, 248, 248, 0.2) 16px, rgba(248, 248, 248, 0.2) 24px),
    repeating-linear-gradient(to left, transparent 0px, transparent 16px, rgba(248, 248, 248, 0.2) 16px, rgba(248, 248, 248, 0.2) 24px),
    repeating-linear-gradient(to top, transparent 0px, transparent 16px, rgba(248, 248, 248, 0.2) 16px, rgba(248, 248, 248, 0.2) 24px);
  background-size: 24px 100%, 100% 24px, 24px 100%, 100% 24px;
  background-position: 0 0, 0 0, 100% 0, 0 100%;
  background-repeat: no-repeat;
  animation: filmBorderScroll 1.5s linear infinite;
}

@keyframes filmBorderScroll {
  0% {
    background-position: 0 0, 0 0, 100% 0, 0 100%;
  }
  100% {
    background-position: 24px 0, 0 24px, calc(100% - 24px) 0, 0 calc(100% - 24px);
  }
}

.photo-card:hover .film-border {
  opacity: 1;
}

.photo-info {
  padding: var(--spacing-md);
  flex: 1;
}

.photo-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
}

.photo-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-sm);
}

.photo-author {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.photo-stats {
  display: flex;
  gap: var(--spacing-md);
}

.stat {
  font-size: 0.8rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 2px;
}

.photo-actions {
  position: absolute;
  bottom: var(--spacing-md);
  right: var(--spacing-md);
  display: flex;
  gap: var(--spacing-xs);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 3;
}

.photo-card:hover .photo-actions {
  opacity: 1;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: rgba(42, 92, 140, 0.9);
  transform: scale(1.1);
}

.action-icon {
  font-size: 1rem;
}

/* 响应式设计 - 仅保留PC端样式 */
</style>