<template>
  <div class="tutorials-container">
    <!-- 教程模块头部 -->
    <div class="tutorials-header">
      <h1>摄影教程</h1>
      <p>提升你的摄影技能，探索专业摄影知识</p>
    </div>
    
    <!-- 教程内容 -->
    <div class="tutorials-content">
      <!-- 图文教程列表 -->
      <div class="articles-section">
        <div class="section-header">
          <h2>热门图文教程</h2>
        </div>
        
        <div class="articles-grid">
          <div v-for="article in articlesData" :key="article.id" class="article-card">
            <div class="article-image">
              <img :src="article.thumbnailUrl" :alt="article.title" />
            </div>
            
            <div class="article-info">
              <div class="article-meta">
                <span class="article-category">{{ getCategoryLabel(article.category) }}</span>
                <span class="article-difficulty">{{ getDifficultyLabel(article.difficulty) }}</span>
              </div>
              
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-excerpt">{{ article.excerpt }}</p>
              
              <div class="article-footer">
                <div class="article-author">
                  <img :src="article.authorAvatar" :alt="article.authorName" class="author-avatar" />
                  <span class="author-name">{{ article.authorName }}</span>
                </div>
                
                <div class="article-stats">
                  <span class="stat-item">
                    <i class="view-icon">👁️</i>
                    {{ article.views }}
                  </span>
                  <span class="stat-item">
                    <i class="like-icon">♥</i>
                    {{ article.likes }}
                  </span>
                  <span class="stat-item">
                    <i class="comment-icon">💬</i>
                    {{ article.comments }}
                  </span>
                </div>
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

// 分类标签映射
const getCategoryLabel = (category) => {
  const labels = {
    pre: '前期',
    post: '后期',
    equipment: '器材',
    composition: '构图',
    lighting: '用光',
  };
  return labels[category] || category;
};

// 难度标签映射
const getDifficultyLabel = (difficulty) => {
  const labels = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '大师',
  };
  return labels[difficulty] || difficulty;
};

// 模拟图文教程数据
const articlesData = ref([
  {
    id: 1,
    title: '摄影入门：曝光三要素详解',
    excerpt: '本文详细介绍摄影中的光圈、快门和ISO三个核心参数，帮助初学者快速掌握曝光技巧...',
    thumbnailUrl: 'https://picsum.photos/600/400?random=101',
    category: 'pre',
    difficulty: 'beginner',
    authorName: '张老师',
    authorAvatar: 'https://picsum.photos/100/100?random=10',
    views: 12500,
    likes: 890,
    comments: 128,
  },
  {
    id: 2,
    title: '风光摄影构图技巧大全',
    excerpt: '掌握这些构图技巧，让你的风光照片更具视觉冲击力和艺术感...',
    thumbnailUrl: 'https://picsum.photos/600/400?random=102',
    category: 'composition',
    difficulty: 'intermediate',
    authorName: '李摄影师',
    authorAvatar: 'https://picsum.photos/100/100?random=11',
    views: 8900,
    likes: 760,
    comments: 95,
  },
  {
    id: 3,
    title: 'Lightroom后期处理全攻略',
    excerpt: '从基础调整到高级技巧，全面掌握Lightroom照片后期处理流程...',
    thumbnailUrl: 'https://picsum.photos/600/400?random=103',
    category: 'post',
    difficulty: 'intermediate',
    authorName: '王后期',
    authorAvatar: 'https://picsum.photos/100/100?random=12',
    views: 15600,
    likes: 1200,
    comments: 189,
  },
  {
    id: 4,
    title: '人像摄影布光技巧',
    excerpt: '学习专业人像摄影中的布光方法，让你的人像作品更具质感...',
    thumbnailUrl: 'https://picsum.photos/600/400?random=104',
    category: 'lighting',
    difficulty: 'advanced',
    authorName: '陈大师',
    authorAvatar: 'https://picsum.photos/100/100?random=13',
    views: 9800,
    likes: 850,
    comments: 142,
  },
]);
</script>

<style scoped>
.tutorials-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.tutorials-header {
  text-align: center;
  margin-bottom: 40px;
}

.tutorials-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #333;
}

.tutorials-header p {
  font-size: 1.1rem;
  color: #666;
}

.articles-section {
  margin-bottom: 40px;
}

.section-header h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #333;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.article-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
}

.article-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .article-image img {
  transform: scale(1.05);
}

.article-info {
  padding: 20px;
}

.article-meta {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.article-category, .article-difficulty {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  background-color: #f0f0f0;
}

.article-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
}

.article-excerpt {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.article-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 0.9rem;
  color: #333;
}

.article-stats {
  display: flex;
  gap: 15px;
}

.stat-item {
  font-size: 0.85rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 768px) {
  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .tutorials-header h1 {
    font-size: 2rem;
  }
}
</style>