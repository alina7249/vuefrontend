<template>
  <div class="post-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <button class="back-button" @click="goBack">
          <span class="back-icon">←</span>
          <span>返回社区</span>
        </button>
        <h1 class="page-title">帖子详情</h1>
        <div class="header-actions">
          <button class="action-button">
            <span class="action-icon">...</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 帖子详情内容 -->
    <div class="post-detail-content">
      <!-- 帖子主体 -->
      <div class="post-main">
        <!-- 作者信息 -->
        <div class="author-section">
          <div class="author-avatar">
            <img :src="currentPost.authorAvatar" :alt="currentPost.authorName" />
          </div>
          <div class="author-info">
            <h3 class="author-name">{{ currentPost.authorName }}</h3>
            <p class="post-time">{{ formatPostTime(currentPost.createdAt) }}</p>
          </div>
          <button 
            class="follow-button"
            :class="{ following: isFollowing }"
            @click="toggleFollow"
          >
            {{ isFollowing ? '已关注' : '关注' }}
          </button>
        </div>

        <!-- 帖子内容 -->
        <div class="post-content">
          <h1 class="post-title">{{ currentPost.title }}</h1>
          <div class="post-tags">
            <span v-for="tag in currentPost.tags" :key="tag" class="post-tag">{{ tag }}</span>
          </div>
          <div class="post-body">
            <p>{{ currentPost.content }}</p>
            <!-- 帖子图片（如果有） -->
            <div v-if="currentPost.imageUrls && currentPost.imageUrls.length > 0" class="post-images">
              <img 
                v-for="(image, index) in currentPost.imageUrls" 
                :key="index" 
                :src="image" 
                :alt="`${currentPost.title} - 图片${index + 1}`" 
                class="post-image"
              />
            </div>
            
            <!-- 浏览量信息 -->
            <div class="post-meta">
              <span class="view-count">
                <i class="meta-icon">👁️</i>
                {{ currentPost.viewCount }} 次浏览
              </span>
            </div>
          </div>
        </div>

        <!-- 互动区域 -->
        <div class="interaction-bar">
          <button 
            class="interaction-button"
            :class="{ active: isLiked }"
            @click="toggleLike"
          >
            <span class="interaction-icon">{{ isLiked ? '👍' : '👍' }}</span>
            <span class="interaction-text">{{ isLiked ? '已点赞' : '点赞' }}</span>
            <span class="interaction-count">({{ likeCount }})</span>
          </button>
          <button class="interaction-button" @click="scrollToComments">
            <span class="interaction-icon">💬</span>
            <span class="interaction-text">评论</span>
            <span class="interaction-count">({{ commentCount }})</span>
          </button>
          <button class="interaction-button" @click="sharePost">
            <span class="interaction-icon">🔗</span>
            <span class="interaction-text">分享</span>
          </button>
          <button class="interaction-button" @click="collectPost">
            <span class="interaction-icon">{{ isCollected ? '⭐' : '☆' }}</span>
            <span class="interaction-text">{{ isCollected ? '已收藏' : '收藏' }}</span>
          </button>
        </div>
      </div>

      <!-- 评论区域 -->
      <div class="comments-section">
        <h3 class="comments-title">评论 ({{ commentCount }})</h3>
        
        <!-- 评论输入框 -->
        <div class="comment-input-section">
          <div class="user-avatar-small">
            <img src="https://picsum.photos/100/100?random=user" alt="用户头像" />
          </div>
          <div class="comment-input-wrapper">
            <textarea 
              v-model="newComment" 
              class="comment-input"
              placeholder="写下你的评论..."
              rows="3"
            ></textarea>
            <div class="comment-input-actions">
              <button class="emoji-button">😊</button>
              <button class="image-button">🖼️</button>
              <button 
                class="submit-comment-button"
                :disabled="!newComment.trim()"
                @click="submitComment"
              >
                发布评论
              </button>
            </div>
          </div>
        </div>

        <!-- 评论列表 -->
        <div class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-avatar">
              <img :src="comment.avatar" :alt="comment.username" />
            </div>
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-username">{{ comment.username }}</span>
                <span class="comment-time">{{ formatCommentTime(comment.time) }}</span>
              </div>
              <p class="comment-text">{{ comment.content }}</p>
              <div class="comment-actions">
                <button class="comment-action">
                  <span class="action-icon">👍</span>
                  <span>{{ comment.likes }}</span>
                </button>
                <button class="comment-action">
                  <span class="action-text">回复</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载更多评论 -->
        <div v-if="hasMoreComments" class="load-more-comments">
          <button @click="loadMoreComments">加载更多评论</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 帖子ID
const postId = computed(() => route.params.id);

// 状态
const isLoading = ref(false);
const isFollowing = ref(false);
const isLiked = ref(false);
const isCollected = ref(false);
const likeCount = ref(0);
const commentCount = ref(0);
const newComment = ref('');
const hasMoreComments = ref(true);

// 当前帖子数据
const currentPost = ref({
  id: '',
  title: '',
  content: '',
  summary: '',
  authorName: '',
  authorAvatar: '',
  category: '',
  tags: [],
  images: [],
  createdAt: ''
});

// 评论数据
const comments = ref([]);

// 模拟获取帖子详情
const fetchPostDetail = () => {
  isLoading.value = true;
  
  // 模拟延迟
  setTimeout(() => {
    // 根据ID获取对应帖子数据
    const mockPost = {
      id: postId.value,
      title: `帖子标题 ${postId.value}`,
      content: `这是帖子 ${postId.value} 的详细内容。这里是完整的帖子正文，可以包含多行文本。\n\n这里是第二段落，详细介绍了帖子相关的信息、背景和作者的想法。\n\n帖子可能包含多个段落，每个段落都有不同的内容结构和重点。`,
      summary: `帖子摘要 ${postId.value}`,
      authorName: `用户${postId.value}`,
      authorAvatar: `https://picsum.photos/100/100?random=${postId.value}`,
      category: 'experience',
      tags: ['标签1', '标签2', '标签3'],
      images: [
        `https://picsum.photos/800/600?random=${postId.value * 10 + 1}`,
        `https://picsum.photos/800/600?random=${postId.value * 10 + 2}`
      ],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)).toISOString()
    };
    
    currentPost.value = mockPost;
    likeCount.value = Math.floor(Math.random() * 500) + 10;
    commentCount.value = Math.floor(Math.random() * 100) + 5;
    
    // 模拟获取评论
    fetchComments();
    
    isLoading.value = false;
  }, 500);
};

// 模拟获取评论
const fetchComments = () => {
  // 模拟评论数据
  const mockComments = [
    {
      id: 1,
      username: '评论用户1',
      avatar: 'https://picsum.photos/100/100?random=101',
      content: '这是一条评论内容，用户对帖子进行了详细的讨论和分析。',
      time: new Date(Date.now() - Math.floor(Math.random() * 3600000 * 24)).toISOString(),
      likes: Math.floor(Math.random() * 50)
    },
    {
      id: 2,
      username: '评论用户2',
      avatar: 'https://picsum.photos/100/100?random=102',
      content: '感谢分享，学到了很多有用的知识！',
      time: new Date(Date.now() - Math.floor(Math.random() * 3600000 * 24)).toISOString(),
      likes: Math.floor(Math.random() * 50)
    },
    {
      id: 3,
      username: '评论用户3',
      avatar: 'https://picsum.photos/100/100?random=103',
      content: '我有不同的看法，觉得这个问题可以从另一个角度来考虑...',
      time: new Date(Date.now() - Math.floor(Math.random() * 3600000 * 24)).toISOString(),
      likes: Math.floor(Math.random() * 50)
    }
  ];
  
  comments.value = mockComments;
};

// 格式化帖子时间
const formatPostTime = (timeStr) => {
  const date = new Date(timeStr);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`;
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`;
  } else if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)}天前`;
  } else {
    return date.toLocaleDateString('zh-CN');
  }
};

// 格式化评论时间
const formatCommentTime = (timeStr) => {
  const date = new Date(timeStr);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) {
    return '刚刚';
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`;
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`;
  } else {
    return date.toLocaleDateString('zh-CN');
  }
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 切换关注状态
const toggleFollow = () => {
  isFollowing.value = !isFollowing.value;
};

// 切换点赞状态
const toggleLike = () => {
  isLiked.value = !isLiked.value;
  likeCount.value += isLiked.value ? 1 : -1;
};

// 收藏帖子
const collectPost = () => {
  isCollected.value = !isCollected.value;
};

// 分享帖子
const sharePost = () => {
  alert('分享功能待实现');
};

// 提交评论
const submitComment = () => {
  if (!newComment.value.trim()) return;
  
  const newCommentObj = {
    id: Date.now(),
    username: '当前用户',
    avatar: 'https://picsum.photos/100/100?random=user',
    content: newComment.value,
    time: new Date().toISOString(),
    likes: 0
  };
  
  comments.value.unshift(newCommentObj);
  commentCount.value += 1;
  newComment.value = '';
};

// 加载更多评论
const loadMoreComments = () => {
  // 模拟加载更多评论
  setTimeout(() => {
    const moreComments = [
      {
        id: comments.value.length + 1,
        username: `更多评论用户${comments.value.length + 1}`,
        avatar: `https://picsum.photos/100/100?random=${100 + comments.value.length + 1}`,
        content: '这是一条新加载的评论内容。',
        time: new Date(Date.now() - Math.floor(Math.random() * 3600000 * 24)).toISOString(),
        likes: Math.floor(Math.random() * 30)
      },
      {
        id: comments.value.length + 2,
        username: `更多评论用户${comments.value.length + 2}`,
        avatar: `https://picsum.photos/100/100?random=${100 + comments.value.length + 2}`,
        content: '感谢楼主分享，很有帮助！',
        time: new Date(Date.now() - Math.floor(Math.random() * 3600000 * 24)).toISOString(),
        likes: Math.floor(Math.random() * 30)
      }
    ];
    
    comments.value.push(...moreComments);
    
    // 模拟没有更多评论
    if (comments.value.length >= 10) {
      hasMoreComments.value = false;
    }
  }, 800);
};

// 滚动到评论区
const scrollToComments = () => {
  document.querySelector('.comments-section').scrollIntoView({ behavior: 'smooth' });
};

// 组件挂载时获取数据
onMounted(() => {
  fetchPostDetail();
});
</script>

<style scoped>
/* 页面布局 */
.post-detail-page {
  min-height: 100vh;
  background-color: #F5F5F5;
}

/* 页面头部 */
.page-header {
  background-color: #FFFFFF;
  border-bottom: 1px solid #E9ECEF;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button:hover {
  background-color: #F8F9FA;
  border-color: #DEE2E6;
}

.back-icon {
  font-size: 16px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.action-button {
  padding: 8px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.action-button:hover {
  background-color: #F8F9FA;
}

.action-icon {
  font-size: 20px;
}

/* 帖子详情内容 */
.post-detail-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
}

/* 帖子主体 */
.post-main {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* 作者信息 */
.author-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.author-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info {
  flex: 1;
  min-width: 0;
}

.author-name {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 4px 0;
}

.post-time {
  font-size: 14px;
  color: #6C757D;
  margin: 0;
}

.follow-button {
  padding: 8px 20px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #0D6EFD;
  background-color: #FFFFFF;
  color: #0D6EFD;
  cursor: pointer;
  transition: all 0.2s ease;
}

.follow-button:hover {
  background-color: #0D6EFD;
  color: #FFFFFF;
}

.follow-button.following {
  border-color: #6C757D;
  color: #6C757D;
}

.follow-button.following:hover {
  background-color: #6C757D;
  color: #FFFFFF;
}

/* 帖子内容 */
.post-content {
  margin-bottom: 24px;
}

.post-title {
  font-size: 24px;
  font-weight: 700;
  color: #212529;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.post-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.post-tag {
  font-size: 13px;
  color: #6C757D;
  background-color: #F8F9FA;
  padding: 4px 12px;
  border-radius: 12px;
}

.post-body {
  font-size: 16px;
  line-height: 1.8;
  color: #495057;
}

.post-body p {
  margin: 0 0 20px 0;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.post-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
  max-height: 500px;
}

/* 互动区域 */
.interaction-bar {
  display: flex;
  gap: 24px;
  padding-top: 20px;
  border-top: 1px solid #E9ECEF;
}

.interaction-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #495057;
}

.interaction-button:hover {
  background-color: #F8F9FA;
  border-color: #DEE2E6;
}

.interaction-button.active {
  background-color: #E7F1FF;
  border-color: #0D6EFD;
  color: #0D6EFD;
}

.interaction-icon {
  font-size: 18px;
}

.interaction-text {
  font-weight: 500;
}

.interaction-count {
  font-size: 12px;
  color: #6C757D;
}

/* 评论区域 */
.comments-section {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.comments-title {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 20px 0;
}

/* 评论输入框 */
.comment-input-section {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.user-avatar-small {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.user-avatar-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comment-input-wrapper {
  flex: 1;
  min-width: 0;
}

.comment-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #E9ECEF;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  min-height: 80px;
}

.comment-input:focus {
  outline: none;
  border-color: #0D6EFD;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
}

.comment-input-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}

.emoji-button,
.image-button {
  padding: 6px 12px;
  background-color: transparent;
  border: 1px solid #E9ECEF;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  margin-right: 8px;
}

.emoji-button:hover,
.image-button:hover {
  background-color: #F8F9FA;
  border-color: #DEE2E6;
}

.submit-comment-button {
  padding: 8px 20px;
  background-color: #0D6EFD;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-comment-button:hover:not(:disabled) {
  background-color: #0B5ED7;
}

.submit-comment-button:disabled {
  background-color: #6C757D;
  cursor: not-allowed;
}

/* 评论列表 */
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 16px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.comment-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-username {
  font-size: 14px;
  font-weight: 600;
  color: #212529;
}

.comment-time {
  font-size: 12px;
  color: #6C757D;
}

.comment-text {
  font-size: 14px;
  line-height: 1.6;
  color: #495057;
  margin: 0 0 12px 0;
  word-wrap: break-word;
}

.comment-actions {
  display: flex;
  gap: 20px;
}

.comment-action {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
  font-size: 13px;
  color: #6C757D;
}

.comment-action:hover {
  color: #0D6EFD;
}

/* 加载更多评论 */
.load-more-comments {
  text-align: center;
  padding: 20px;
}

.load-more-comments button {
  padding: 8px 24px;
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #495057;
  transition: all 0.2s ease;
}

.load-more-comments button:hover {
  background-color: #F8F9FA;
  border-color: #DEE2E6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .post-detail-content {
    padding: 16px 16px;
  }
  
  .post-main,
  .comments-section {
    padding: 20px;
  }
  
  .post-title {
    font-size: 20px;
  }
  
  .post-images {
    grid-template-columns: 1fr;
  }
  
  .interaction-bar {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .interaction-button {
    flex: 1;
    min-width: calc(50% - 6px);
    justify-content: center;
  }
  
  .page-title {
    font-size: 16px;
  }
  
  .header-content {
    padding: 12px 16px;
  }
}

@media (max-width: 480px) {
  .post-detail-content {
    padding: 12px 12px;
  }
  
  .post-main,
  .comments-section {
    padding: 16px;
  }
  
  .post-title {
    font-size: 18px;
  }
  
  .post-body {
    font-size: 15px;
  }
  
  .interaction-button {
    flex: 1;
    min-width: 100%;
  }
}
</style>