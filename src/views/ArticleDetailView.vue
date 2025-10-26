<template>
  <div class="article-detail-container">
    <!-- 文章详情头部 -->
    <div class="article-header">
      <button class="back-button" @click="goBack">
        <span>← 返回教程列表</span>
      </button>
      <h1 class="article-title">{{ article.title }}</h1>
      
      <!-- 作者信息 -->
      <div class="author-info">
        <img :src="article.authorAvatar" alt="作者头像" class="author-avatar">
        <div class="author-details">
          <span class="author-name">{{ article.authorName }}</span>
          <span class="publish-date">{{ formatDate(article.publishDate) }}</span>
        </div>
        <div class="article-meta">
          <span class="meta-item">
            <i class="icon-view">👁️</i> {{ formatNumber(article.views) }}
          </span>
          <span class="meta-item">
            <i class="icon-like">👍</i> {{ formatNumber(article.likes) }}
          </span>
          <span class="meta-item">
            <i class="icon-comment">💬</i> {{ formatNumber(article.comments) }}
          </span>
          <span class="meta-item">
            <i class="icon-time">⏱️</i> {{ article.readingTime }}分钟阅读
          </span>
        </div>
      </div>
      
      <!-- 标签 -->
      <div class="article-tags">
        <span class="tag category-tag">{{ getCategoryLabel(article.category) }}</span>
        <span class="tag difficulty-tag">{{ getDifficultyLabel(article.difficulty) }}</span>
      </div>
    </div>
    
    <!-- 文章摘要 -->
    <div class="article-excerpt">
      <p>{{ article.excerpt }}</p>
    </div>
    
    <!-- 文章主体内容 -->
    <div class="article-content">
      <div v-for="(section, index) in article.content.sections" :key="index" class="content-section">
        <h2 class="section-title">{{ section.title }}</h2>
        <p class="section-text">{{ section.content }}</p>
        <div class="section-image-container">
          <img :src="section.image" :alt="section.title" class="section-image">
        </div>
      </div>
    </div>
    
    <!-- 技巧提示 -->
    <div class="tips-section">
      <h3 class="tips-title">💡 实用技巧</h3>
      <ul class="tips-list">
        <li v-for="(tip, index) in article.content.tips" :key="index" class="tip-item">
          {{ tip }}
        </li>
      </ul>
    </div>
    
    <!-- 练习建议 -->
    <div class="exercise-section">
      <h3 class="exercise-title">📝 实践练习</h3>
      <p class="exercise-description">{{ article.content.exercises }}</p>
    </div>
    
    <!-- 互动区域 -->
    <div class="interaction-section">
      <div class="action-buttons">
        <button class="action-button like-button" @click="toggleLike">
          <span>{{ isLiked ? '❤️ 已点赞' : '🤍 点赞' }}</span>
        </button>
        <button class="action-button collect-button" @click="toggleCollect">
          <span>{{ isCollected ? '⭐ 已收藏' : '☆ 收藏' }}</span>
        </button>
        <button class="action-button share-button" @click="shareArticle">
          <span>📤 分享</span>
        </button>
      </div>
      
      <!-- 评论区 -->
      <div class="comments-section">
        <h3 class="comments-title">评论 ({{ article.comments }})</h3>
        <div class="comment-input-area">
          <input 
            v-model="commentText" 
            type="text" 
            placeholder="写下你的评论..." 
            class="comment-input"
            @keyup.enter="submitComment"
          >
          <button class="submit-comment" @click="submitComment">发送</button>
        </div>
        <div class="comments-list">
          <div class="no-comments" v-if="!article.comments">
            暂无评论，快来抢沙发吧！
          </div>
          <!-- 实际项目中这里会动态加载评论 -->
        </div>
      </div>
    </div>
    
    <!-- 相关推荐 -->
    <div class="related-articles">
      <h3 class="related-title">📚 相关推荐</h3>
      <div class="related-list">
        <div 
          v-for="related in relatedArticles" 
          :key="related.id" 
          class="related-item"
          @click="goToRelatedArticle(related.id)"
        >
          <img :src="related.thumbnailUrl" alt="相关文章缩略图" class="related-thumbnail">
          <div class="related-info">
            <h4 class="related-article-title">{{ related.title }}</h4>
            <span class="related-meta">{{ related.readingTime }}分钟阅读</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// 路由实例
const router = useRouter();
const route = useRoute();

// 状态管理
const article = ref({
  id: null,
  title: '',
  excerpt: '',
  content: {
    sections: [],
    tips: [],
    exercises: ''
  },
  thumbnailUrl: '',
  category: '',
  difficulty: '',
  authorName: '',
  authorAvatar: '',
  views: 0,
  likes: 0,
  comments: 0,
  readingTime: 0,
  publishDate: ''
});

const commentText = ref('');
const isLiked = ref(false);
const isCollected = ref(false);
const relatedArticles = ref([]);

// 分类标签映射
const getCategoryLabel = (category) => {
  const labels = {
    pre: '前期',
    post: '后期',
    equipment: '器材',
    composition: '构图',
    lighting: '用光',
    street: '街拍',
    portrait: '人像',
    landscape: '风光',
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

// 格式化数字
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toString();
};

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

// 返回上一页
const goBack = () => {
  router.push('/tutorials');
};

// 切换点赞状态
const toggleLike = () => {
  isLiked.value = !isLiked.value;
  article.value.likes += isLiked.value ? 1 : -1;
};

// 切换收藏状态
const toggleCollect = () => {
  isCollected.value = !isCollected.value;
};

// 分享文章
const shareArticle = () => {
  alert('分享功能已触发！在实际应用中会调用系统分享API。');
};

// 提交评论
const submitComment = () => {
  if (commentText.value.trim()) {
    article.value.comments += 1;
    commentText.value = '';
    alert('评论提交成功！');
  }
};

// 跳转到相关文章
const goToRelatedArticle = (articleId) => {
  router.push({
    path: `/tutorials/article/${articleId}`,
    query: { articleId: articleId }
  });
};

// 模拟获取文章数据
const fetchArticleData = (articleId) => {
  // 这里应该从API获取数据，现在使用模拟数据
  const mockArticles = [
    {
      id: 1,
      title: '摄影入门：曝光三要素详解',
      excerpt: '本文详细介绍摄影中的光圈、快门和ISO三个核心参数，帮助初学者快速掌握曝光技巧...',
      content: {
        sections: [
          {
            title: '曝光的基础概念',
            content: '曝光是摄影中最基础也最重要的概念之一。正确的曝光能够让照片呈现出理想的亮度和细节，使图像更加清晰和生动。曝光过度会导致照片过亮，细节丢失；曝光不足则会使照片过暗，难以辨认细节。',
            image: 'https://picsum.photos/800/450?random=301'
          },
          {
            title: '光圈的作用与影响',
            content: '光圈控制着相机进光量的大小，同时也影响着景深效果。大光圈(f/1.8)可以创造浅景深效果，使主体清晰而背景虚化，非常适合人像和微距摄影；小光圈(f/16)则可以获得更大的景深，使整个画面都保持清晰，适合风光和建筑摄影。',
            image: 'https://picsum.photos/800/450?random=302'
          },
          {
            title: '快门速度的选择',
            content: '快门速度决定了相机感光元件曝光的时间长短。高速快门(1/1000秒)可以冻结运动物体，捕捉瞬间动态；慢速快门(1/30秒以下)则可以创造动感模糊效果，如丝绸般的流水、光轨等。选择合适的快门速度对于表达拍摄意图至关重要。',
            image: 'https://picsum.photos/800/450?random=303'
          },
          {
            title: 'ISO的合理使用',
            content: 'ISO代表相机的感光度，较高的ISO可以在光线不足的环境下拍摄，但会带来噪点。ISO 100-400通常可以获得最佳画质，适合光线充足的场景；ISO 800-3200适合弱光环境；而更高的ISO则应在必要时谨慎使用，因为会明显降低图像质量。',
            image: 'https://picsum.photos/800/450?random=304'
          },
          {
            title: '三者的平衡与应用',
            content: '在实际拍摄中，需要根据拍摄场景和创作意图，灵活调整光圈、快门和ISO的组合。例如，拍摄运动物体时，可能需要优先考虑快门速度；拍摄人像时，则可能优先考虑光圈；而在光线不足的情况下，则需要综合考虑三者的平衡。',
            image: 'https://picsum.photos/800/450?random=305'
          }
        ],
        tips: [
          '使用光圈优先模式(f/模式)可以专注于控制景深，让相机自动选择合适的快门速度',
          '在光线充足的情况下尽量使用低ISO以获得最佳画质，保留更多细节',
          '拍摄运动物体时，可以使用快门优先模式(S/Tv模式)，确保捕捉到清晰的动态瞬间',
          '使用三脚架可以在使用慢速快门时避免相机抖动，获得更清晰的图像',
          '学会使用相机的曝光补偿功能，可以在自动模式下微调曝光效果'
        ],
        exercises: '选择不同场景进行曝光练习，尝试用不同的光圈、快门组合拍摄同一物体，观察效果差异。特别推荐在同一地点、同一时间，分别使用大光圈和小光圈拍摄，比较景深效果；以及在拍摄流水时，尝试不同的快门速度，感受从清晰到模糊的变化。'        
      },
      thumbnailUrl: 'https://picsum.photos/600/400?random=101',
      category: 'pre',
      difficulty: 'beginner',
      authorName: '张老师',
      authorAvatar: 'https://picsum.photos/100/100?random=10',
      views: 12500,
      likes: 890,
      comments: 128,
      readingTime: 8,
      publishDate: '2023-10-15'
    },
    // 这里可以添加更多文章数据...
  ];
  
  // 根据ID查找文章
  const foundArticle = mockArticles.find(a => a.id === parseInt(articleId));
  if (foundArticle) {
    article.value = foundArticle;
    // 增加浏览量
    article.value.views += 1;
    
    // 获取相关文章（这里简单地排除当前文章，实际应用中应该根据分类等进行推荐）
    relatedArticles.value = mockArticles.filter(a => a.id !== parseInt(articleId)).slice(0, 3);
  } else {
    // 如果找不到文章，返回教程列表
    alert('未找到该文章');
    router.push('/tutorials');
  }
};

// 组件挂载时获取数据
onMounted(() => {
  const articleId = route.query.articleId || route.params.id;
  if (articleId) {
    fetchArticleData(articleId);
  } else {
    router.push('/tutorials');
  }
});
</script>

<style scoped>
.article-detail-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

/* 头部样式 */
.article-header {
  margin-bottom: 30px;
}

.back-button {
  background: none;
  border: none;
  color: #2c3e50;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 0;
  transition: color 0.3s;
}

.back-button:hover {
  color: #3498db;
}

.article-title {
  font-size: 2.2rem;
  color: #2c3e50;
  margin-bottom: 20px;
  line-height: 1.3;
}

.author-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.author-name {
  font-weight: bold;
  color: #2c3e50;
}

.publish-date {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.article-meta {
  display: flex;
  gap: 15px;
  margin-left: auto;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.article-tags {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tag {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.category-tag {
  background-color: #e3f2fd;
  color: #1976d2;
}

.difficulty-tag {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

/* 文章内容样式 */
.article-excerpt {
  font-size: 1.1rem;
  color: #555;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  border-left: 4px solid #3498db;
}

.article-content {
  margin-bottom: 40px;
}

.content-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.6rem;
  color: #2c3e50;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #ecf0f1;
}

.section-text {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #34495e;
  margin-bottom: 20px;
}

.section-image-container {
  margin: 25px 0;
  text-align: center;
}

.section-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 技巧和练习部分 */
.tips-section,
.exercise-section {
  background-color: #f8f9fa;
  padding: 25px;
  border-radius: 10px;
  margin-bottom: 30px;
}

.tips-title,
.exercise-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tips-list {
  list-style: none;
  padding: 0;
}

.tip-item {
  padding: 8px 0;
  padding-left: 20px;
  position: relative;
  line-height: 1.6;
  color: #34495e;
}

.tip-item::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #27ae60;
  font-weight: bold;
}

.exercise-description {
  line-height: 1.6;
  color: #34495e;
}

/* 互动区域 */
.interaction-section {
  margin-bottom: 40px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.action-button {
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
  background-color: #f8f9fa;
  color: #495057;
}

.action-button:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
}

.like-button:hover {
  background-color: #ffe6e6;
  color: #e74c3c;
}

.collect-button:hover {
  background-color: #fff8e1;
  color: #ffc107;
}

.share-button:hover {
  background-color: #e3f2fd;
  color: #1976d2;
}

/* 评论区 */
.comments-section {
  border-top: 1px solid #dee2e6;
  padding-top: 30px;
}

.comments-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 20px;
}

.comment-input-area {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.comment-input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.comment-input:focus {
  outline: none;
  border-color: #3498db;
}

.submit-comment {
  padding: 12px 25px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.submit-comment:hover {
  background-color: #2980b9;
}

.no-comments {
  color: #7f8c8d;
  text-align: center;
  padding: 40px 0;
  font-style: italic;
}

/* 相关推荐 */
.related-articles {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #dee2e6;
}

.related-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 20px;
}

.related-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.related-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.related-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.related-thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.related-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.related-article-title {
  font-size: 1rem;
  color: #2c3e50;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-meta {
  font-size: 0.85rem;
  color: #7f8c8d;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-detail-container {
    padding: 15px;
  }
  
  .article-title {
    font-size: 1.8rem;
  }
  
  .author-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .article-meta {
    margin-left: 0;
    flex-wrap: wrap;
  }
  
  .action-buttons {
    flex-wrap: wrap;
  }
  
  .action-button {
    flex: 1;
    min-width: 120px;
  }
  
  .related-list {
    grid-template-columns: 1fr;
  }
}
</style>