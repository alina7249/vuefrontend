<template>
  <div class="tutorials-container">
    <!-- 教程模块头部 -->
    <div class="tutorials-header">
      <h1>摄影教程</h1>
      <p>提升你的摄影技能，探索专业摄影知识</p>
    </div>
  
  <!-- 文章详情模态框 -->
  <div id="article-modal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 hidden" :class="{ 'flex': showArticleModal }">
    <div class="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
      <div class="p-4 flex justify-between items-center border-b">
        <h3 class="text-xl font-bold">教程详情</h3>
        <button id="close-article-modal" class="text-gray-500 hover:text-gray-700 text-2xl" @click="closeArticleModal">×</button>
      </div>
      <div class="p-6">
        <img id="article-image" :src="currentArticle?.thumbnailUrl" alt="教程封面" class="w-full h-64 object-cover rounded-lg mb-6">
        <div class="mb-6">
          <div class="flex items-center mb-4">
            <span id="article-category" class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-4">{{ getCategoryLabel(currentArticle?.category) }}</span>
            <span id="article-author" class="text-gray-600">{{ currentArticle?.authorName }}</span>
          </div>
          <h4 id="article-title" class="text-2xl font-bold mb-4">{{ currentArticle?.title }}</h4>
          <div class="flex justify-between items-center mb-6">
            <div class="flex space-x-4">
              <span id="article-likes" class="text-gray-500">❤️ {{ currentArticle?.likes }}</span>
              <span id="article-comments" class="text-gray-500">💬 {{ currentArticle?.comments }}</span>
            </div>
            <span id="article-date" class="text-gray-400">{{ articleDate }}</span>
          </div>
          <div id="article-content" class="prose max-w-none text-gray-700 mb-6">
            <p>{{ currentArticle?.excerpt }} 这是一篇详细的摄影教程，包含了丰富的专业知识和实用技巧。通过学习本教程，你将能够掌握更多摄影技能，提升你的作品质量。教程内容涵盖了理论知识和实践指导，适合不同水平的摄影爱好者学习。</p>
          </div>
        </div>
        
        <!-- 评论区域 -->
        <div class="border-t pt-6">
          <h4 class="text-lg font-bold mb-4">评论</h4>
          <div id="article-comments-list" class="space-y-4 mb-6">
            <div v-for="comment in articleComments" :key="comment.id" class="comment-item">
              <div class="flex items-start gap-3">
                <img :src="comment.avatar" alt="用户头像" class="w-8 h-8 rounded-full object-cover">
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <span class="font-medium text-gray-900">{{ comment.username }}</span>
                    <span class="text-sm text-gray-500">{{ comment.time }}</span>
                  </div>
                  <p class="text-gray-700 text-sm">{{ comment.content }}</p>
                </div>
              </div>
            </div>
            <div v-if="articleComments.length === 0" class="text-center text-gray-500 py-6">
              暂无评论，快来发表第一条评论吧！
            </div>
          </div>
          
          <!-- 评论表单 -->
          <div>
            <textarea id="article-comment-input" v-model="newArticleComment" class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2" placeholder="写下你的评论..." rows="3"></textarea>
            <button id="submit-article-comment" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition" @click="submitArticleCommentModal">发表评论</button>
          </div>
        </div>
      </div>
    </div>
  </div>
    
    <!-- 教程导航 -->
    <div class="tutorials-nav">
      <button
        v-for="tab in tutorialsTabs"
        :key="tab.value"
        class="nav-tab"
        :class="{ active: currentTab === tab.value }"
        @click="setTab(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <!-- 图文教程区域 -->
    <div v-if="currentTab === 'articles'" class="articles-section">
      <div class="articles-header">
        <h2>图文教程</h2>
        <div class="articles-filters">
          <div class="filter-group">
            <label>难度:</label>
            <select v-model="articleDifficulty" class="filter-select">
              <option value="all">全部难度</option>
              <option value="beginner">入门</option>
              <option value="intermediate">进阶</option>
              <option value="advanced">大师</option>
            </select>
          </div>
          <div class="filter-group">
            <label>分类:</label>
            <select v-model="articleCategory" class="filter-select">
              <option value="all">全部分类</option>
              <option value="pre">前期</option>
              <option value="post">后期</option>
              <option value="equipment">器材</option>
              <option value="composition">构图</option>
              <option value="lighting">用光</option>
            </select>
          </div>
          <div class="filter-group">
            <label>排序:</label>
            <select v-model="articleSort" class="filter-select">
              <option value="latest">最新发布</option>
              <option value="popular">最受欢迎</option>
              <option value="recommended">推荐教程</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="articles-list">
        <div v-for="article in articlesData" :key="article.id" class="article-card" :data-id="article.id" @click="openArticleModal(article)">
          <div class="article-thumbnail">
            <img :src="article.thumbnailUrl" :alt="article.title" />
          </div>
          
          <div class="article-content">
            <div class="article-meta">
              <span class="article-category" :class="article.category">{{ getCategoryLabel(article.category) }}</span>
              <span class="article-difficulty" :class="article.difficulty">{{ getDifficultyLabel(article.difficulty) }}</span>
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

          <!-- Hover 白底详情层（统一交互） -->
          <div class="tutorial-hover-detail">
            <div class="tutorial-hover-left">
              <img :src="article.thumbnailUrl" :alt="article.title" class="tutorial-hover-image" />
            </div>
            <div class="tutorial-hover-right">
              <h3 class="tutorial-hover-title">{{ article.title }}</h3>
              <div class="tutorial-hover-sub">{{ getCategoryLabel(article.category) }} · {{ getDifficultyLabel(article.difficulty) }}</div>
              <div class="tutorial-hover-exif">
                <div class="exif-item"><span class="label">作者</span><span class="value">{{ article.authorName }}</span></div>
                <div class="exif-item"><span class="label">浏览</span><span class="value">{{ article.views }}</span></div>
                <div class="exif-item"><span class="label">点赞</span><span class="value">{{ article.likes }}</span></div>
                <div class="exif-item"><span class="label">评论</span><span class="value">{{ article.comments }}</span></div>
              </div>
              <div class="tutorial-hover-actions">
                <button class="hover-btn like" :class="{ active: article.liked }" @click.stop="likeArticle(article.id)">❤ {{ article.likes }}</button>
                <div class="collect-wrap" @click.stop>
                  <button class="hover-btn collect" :class="{ active: article.collected }" @click="toggleArticleCollectMenu(article.id)">🔖 {{ article.collections }}</button>
                  <div class="collect-menu" v-if="articleCollectMenuFor === article.id">
                    <div class="menu-title">加入个人灵感集</div>
                    <div class="menu-item" @click="confirmArticleCollect(article.id, '我的灵感A')">我的灵感A</div>
                    <div class="menu-item" @click="confirmArticleCollect(article.id, '我的灵感B')">我的灵感B</div>
                    <div class="menu-item" @click="confirmArticleCollect(article.id, '新建灵感集')">+ 新建灵感集</div>
                  </div>
                </div>
                <div class="comment-wrap" @click.stop>
                  <button class="hover-btn comment" @click="focusArticleComment(article.id)">💬 {{ article.comments }}</button>
                </div>
                <div class="share-wrap" @click.stop>
                  <button class="hover-btn share" @click="shareArticle(article.id)">🔗 分享</button>
                </div>
              </div>
              <div class="tutorial-hover-comment" v-if="articleCommentFor === article.id" @click.stop>
                <div class="rich-tools">
                  <button class="tool" @click="insertArticleEmoji('😊')">😊</button>
                  <button class="tool" @click="insertArticleEmoji('📷')">📷</button>
                  <label class="tool upload">
                    📎
                    <input type="file" accept="image/*" @change="attachArticleImage($event)" hidden />
                  </label>
                </div>
                <textarea class="rich-input" v-model="articleCommentText" placeholder="发表你的看法，支持表情与图片链接"></textarea>
                <div class="comment-actions">
                  <button class="submit" @click="submitArticleComment(article.id)">发布</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 分页 -->
      <div class="pagination">
        <button class="pagination-button" :disabled="currentPage === 1">上一页</button>
        <span class="pagination-info">第 {{ currentPage }} / {{ totalPages }} 页</span>
        <button class="pagination-button" :disabled="currentPage === totalPages">下一页</button>
      </div>
    </div>
    
    <!-- 视频课程区域 -->
    <div v-else-if="currentTab === 'videos'" class="videos-section">
      <div class="videos-header">
        <h2>视频课程</h2>
        <div class="videos-filters">
          <div class="filter-group">
            <label>难度:</label>
            <select v-model="videoDifficulty" class="filter-select">
              <option value="all">全部难度</option>
              <option value="beginner">入门</option>
              <option value="intermediate">进阶</option>
              <option value="advanced">大师</option>
            </select>
          </div>
          <div class="filter-group">
            <label>分类:</label>
            <select v-model="videoCategory" class="filter-select">
              <option value="all">全部分类</option>
              <option value="pre">前期</option>
              <option value="post">后期</option>
              <option value="equipment">器材</option>
              <option value="composition">构图</option>
              <option value="lighting">用光</option>
            </select>
          </div>
          <div class="filter-group">
            <label>排序:</label>
            <select v-model="videoSort" class="filter-select">
              <option value="latest">最新发布</option>
              <option value="popular">最受欢迎</option>
              <option value="recommended">推荐课程</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="videos-list">
        <div v-for="video in videosData" :key="video.id" class="video-card">
          <div class="video-thumbnail">
            <img :src="video.thumbnailUrl" :alt="video.title" />
            <div class="video-duration">{{ video.duration }}</div>
            <div v-if="video.progress > 0" class="video-progress">
              <div class="progress-bar" :style="{ width: video.progress + '%' }"></div>
            </div>
          </div>
          
          <div class="video-content">
            <div class="video-meta">
              <span class="video-category" :class="video.category">{{ getCategoryLabel(video.category) }}</span>
              <span class="video-difficulty" :class="video.difficulty">{{ getDifficultyLabel(video.difficulty) }}</span>
            </div>
            
            <h3 class="video-title">{{ video.title }}</h3>
            <p class="video-excerpt">{{ video.excerpt }}</p>
            
            <div class="video-footer">
              <div class="video-author">
                <img :src="video.authorAvatar" :alt="video.authorName" class="author-avatar" />
                <span class="author-name">{{ video.authorName }}</span>
              </div>
              <div class="video-stats">
                <span class="stat-item">
                  <i class="view-icon">👁️</i>
                  {{ video.views }}
                </span>
                <span class="stat-item">
                  <i class="like-icon">♥</i>
                  {{ video.likes }}
                </span>
                <span class="stat-item">
                  <i class="lesson-icon">📚</i>
                  {{ video.lessons }} 课时
                </span>
              </div>
              
              <div v-if="video.progress > 0" class="video-progress-text">
                学习进度: {{ video.progress }}%
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 分页 -->
      <div class="pagination">
        <button class="pagination-button" :disabled="currentPage === 1">上一页</button>
        <span class="pagination-info">第 {{ currentPage }} / {{ totalPages }} 页</span>
        <button class="pagination-button" :disabled="currentPage === totalPages">下一页</button>
      </div>
    </div>
    
    <!-- 参数库区域 -->
    <div v-else-if="currentTab === 'params'" class="params-section">
      <div class="params-header">
        <h2>拍摄参数库</h2>
        <p>按场景和器材分类的参数模板，助你快速设置相机参数</p>
      </div>
      
      <div class="params-search">
        <input type="text" placeholder="搜索参数模板..." class="search-input" v-model="paramSearch" />
        <button class="search-button">搜索</button>
      </div>
      
      <div class="params-categories">
        <button
          v-for="category in paramCategories"
          :key="category.value"
          class="category-button"
          :class="{ active: selectedParamCategory === category.value }"
          @click="setParamCategory(category.value)"
        >
          {{ category.label }}
        </button>
      </div>
      
      <div class="params-list">
        <div v-for="param in paramsData" :key="param.id" class="param-card">
          <div class="param-header">
            <h3 class="param-title">{{ param.title }}</h3>
            <div class="param-actions">
              <button class="action-button" @click="copyParams(param.id)">
                <i class="copy-icon">📋</i>
                复制参数
              </button>
              <button class="action-button" @click="saveParams(param.id)">
                <i class="save-icon">💾</i>
                保存
              </button>
            </div>
          </div>
          
          <div class="param-content">
            <div class="param-image">
              <img :src="param.imageUrl" :alt="param.title" />
            </div>
            
            <div class="param-details">
              <div class="param-specs">
                <div class="spec-item">
                  <span class="spec-label">推荐相机:</span>
                  <span class="spec-value">{{ param.camera }}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">推荐镜头:</span>
                  <span class="spec-value">{{ param.lens }}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">光圈:</span>
                  <span class="spec-value">{{ param.aperture }}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">快门速度:</span>
                  <span class="spec-value">{{ param.shutter }}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">ISO:</span>
                  <span class="spec-value">{{ param.iso }}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">白平衡:</span>
                  <span class="spec-value">{{ param.whiteBalance }}</span>
                </div>
              </div>
              
              <div class="param-description">
                <h4>参数说明:</h4>
                <p>{{ param.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 问答社区区域 -->
    <div v-else-if="currentTab === 'qa'" class="qa-section">
      <div class="qa-header">
        <h2>问答社区</h2>
        <button class="ask-question-button" @click="openAskModal">提问</button>
      </div>
      
      <div class="qa-search">
        <input type="text" placeholder="搜索问题..." class="search-input" v-model="qaSearch" />
        <button class="search-button">搜索</button>
      </div>
      
      <div class="qa-filters">
        <button
          v-for="filter in qaFilters"
          :key="filter.value"
          class="filter-button"
          :class="{ active: selectedQAFilter === filter.value }"
          @click="setQAFilter(filter.value)"
        >
          {{ filter.label }}
        </button>
      </div>
      
      <div class="qa-list">
        <div v-for="question in questionsData" :key="question.id" class="question-card" :class="{ resolved: question.isResolved }">
          <div class="question-header">
            <h3 class="question-title">{{ question.title }}</h3>
            <div v-if="question.isResolved" class="resolved-badge">已解决</div>
          </div>
          
          <div class="question-content">
            <p class="question-excerpt">{{ question.content }}</p>
            <div class="question-tags">
              <span v-for="tag in question.tags" :key="tag" class="question-tag">{{ tag }}</span>
            </div>
          </div>
          
          <div class="question-footer">
            <div class="question-author">
              <img :src="question.authorAvatar" :alt="question.authorName" class="author-avatar" />
              <span class="author-name">{{ question.authorName }}</span>
              <span class="question-time">{{ question.time }}</span>
            </div>
            
            <div class="question-stats">
              <span class="stat-item">
                <i class="answer-icon">💬</i>
                {{ question.answers }} 回答
              </span>
              <span class="stat-item">
                <i class="view-icon">👁️</i>
                {{ question.views }} 浏览
              </span>
              <span class="stat-item">
                <i class="like-icon">♥</i>
                {{ question.likes }} 点赞
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 分页 -->
      <div class="pagination">
        <button class="pagination-button" :disabled="currentPage === 1">上一页</button>
        <span class="pagination-info">第 {{ currentPage }} / {{ totalPages }} 页</span>
        <button class="pagination-button" :disabled="currentPage === totalPages">下一页</button>
      </div>
    </div>
    
    <!-- 学习路径区域 -->
    <div v-else-if="currentTab === 'paths'" class="paths-section">
      <div class="paths-header">
        <h2>学习路径</h2>
        <p>个性化学习计划，助你系统性提升摄影技能</p>
      </div>
      
      <div class="paths-list">
        <div v-for="path in learningPaths" :key="path.id" class="path-card">
          <div class="path-header">
            <div class="path-icon">{{ path.icon }}</div>
            <h3 class="path-title">{{ path.title }}</h3>
          </div>
          
          <div class="path-content">
            <p class="path-description">{{ path.description }}</p>
            <div class="path-stats">
              <span class="stat-item">
                <i class="course-icon">📚</i>
                {{ path.courses }} 课程
              </span>
              <span class="stat-item">
                <i class="time-icon">⏱️</i>
                {{ path.duration }} 小时
              </span>
              <span class="stat-item">
                <i class="student-icon">👨‍🎓</i>
                {{ path.students }} 学员
              </span>
            </div>
          </div>
          
          <div class="path-steps">
            <div v-for="(step, index) in path.steps" :key="index" class="step-item">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-content">
                <h4 class="step-title">{{ step.title }}</h4>
                <p class="step-description">{{ step.description }}</p>
              </div>
            </div>
          </div>
          
          <div class="path-actions">
            <button v-if="path.progress > 0" class="continue-button" @click="continuePath(path.id)">
              继续学习 ({{ path.progress }}%)
            </button>
            <button v-else class="start-button" @click="startPath(path.id)">
              开始学习
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 教程标签页
const currentTab = ref('articles');
const tutorialsTabs = [
  { label: '图文教程', value: 'articles' },
  { label: '视频课程', value: 'videos' },
  { label: '参数库', value: 'params' },
  { label: '问答社区', value: 'qa' },
  { label: '学习路径', value: 'paths' },
];

// 图文教程筛选
const articleDifficulty = ref('all');
const articleCategory = ref('all');
const articleSort = ref('latest');

// 视频课程筛选
const videoDifficulty = ref('all');
const videoCategory = ref('all');
const videoSort = ref('latest');

// 参数库搜索和筛选
const paramSearch = ref('');
const paramCategories = [
  { label: '全部场景', value: 'all' },
  { label: '夜景', value: 'night' },
  { label: '人像', value: 'portrait' },
  { label: '风光', value: 'landscape' },
  { label: '运动', value: 'sports' },
  { label: '微距', value: 'macro' },
];
const selectedParamCategory = ref('all');

// 问答社区搜索和筛选
const qaSearch = ref('');
const qaFilters = [
  { label: '全部问题', value: 'all' },
  { label: '未解决', value: 'unresolved' },
  { label: '已解决', value: 'resolved' },
  { label: '热门问题', value: 'popular' },
];
const selectedQAFilter = ref('all');

// 分页
const currentPage = ref(1);
const totalPages = ref(10);

// 统一交互：点赞/收藏/评论/分享（本地模拟）
const articleCollectMenuFor = ref(null);
const articleCommentFor = ref(null);
const articleCommentText = ref('');

// 文章详情模态框相关
const showArticleModal = ref(false);
const currentArticle = ref(null);
const articleComments = ref([]);
const newArticleComment = ref('');
const articleDate = ref('');

// 打开文章详情模态框
const openArticleModal = (article) => {
  currentArticle.value = article;
  showArticleModal.value = true;
  // 设置日期（模拟）
  const now = new Date();
  articleDate.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  // 加载评论（模拟）
  loadArticleComments(article.id);
};

// 关闭文章详情模态框
const closeArticleModal = () => {
  showArticleModal.value = false;
  currentArticle.value = null;
  articleComments.value = [];
  newArticleComment.value = '';
};

// 加载文章评论（模拟）
const loadArticleComments = (articleId) => {
  // 模拟评论数据
  articleComments.value = [
    {
      id: 1,
      username: '摄影爱好者',
      avatar: 'https://picsum.photos/100/100?random=51',
      content: '这篇教程真的很有帮助，学到了很多实用技巧！',
      time: '2小时前'
    },
    {
      id: 2,
      username: '新手小白',
      avatar: 'https://picsum.photos/100/100?random=52',
      content: '谢谢分享，对我这样的新手非常友好！',
      time: '昨天'
    }
  ];
};

// 提交评论
const submitArticleCommentModal = () => {
  if (!newArticleComment.value.trim() || !currentArticle.value) return;
  
  // 添加新评论
  const newComment = {
    id: articleComments.value.length + 1,
    username: '当前用户', // 实际项目中应该是登录用户的信息
    avatar: 'https://picsum.photos/100/100?random=50',
    content: newArticleComment.value.trim(),
    time: '刚刚'
  };
  
  articleComments.value.unshift(newComment);
  currentArticle.value.comments += 1;
  newArticleComment.value = '';
  
  // 更新原数据中的评论数
  const article = articlesData.value.find(a => a.id === currentArticle.value.id);
  if (article) {
    article.comments += 1;
  }
};

// 初始化互动字段
articlesData.value = articlesData.value.map(a => ({
  ...a,
  collections: a.collections || Math.floor(Math.random() * 300),
  liked: false,
  collected: false,
}));

const likeArticle = (id) => {
  const a = articlesData.value.find(x => x.id === id);
  if (!a) return;
  a.liked = !a.liked;
  a.likes += a.liked ? 1 : -1;
};

const toggleArticleCollectMenu = (id) => {
  articleCollectMenuFor.value = articleCollectMenuFor.value === id ? null : id;
};
const confirmArticleCollect = (id, folder) => {
  const a = articlesData.value.find(x => x.id === id);
  if (!a) return;
  if (!a.collected) a.collections += 1;
  a.collected = true;
  articleCollectMenuFor.value = null;
};

const focusArticleComment = (id) => { articleCommentFor.value = id; };
const insertArticleEmoji = (emoji) => { articleCommentText.value += ` ${emoji} `; };
const attachArticleImage = (evt) => {
  const file = evt.target.files?.[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  articleCommentText.value += ` [图片](${url}) `;
};
const submitArticleComment = (id) => {
  const a = articlesData.value.find(x => x.id === id);
  if (!a) return;
  if (articleCommentText.value.trim()) {
    a.comments += 1;
    articleCommentText.value = '';
    articleCommentFor.value = null;
  }
};

const shareArticle = (id) => {
  const a = articlesData.value.find(x => x.id === id);
  if (!a) return;
  const url = encodeURIComponent(window.location.origin + '/tutorials/article/' + id);
  const title = encodeURIComponent(a.title);
  const pic = encodeURIComponent(a.thumbnailUrl);
  window.open(`https://service.weibo.com/share/share.php?title=${title}&url=${url}&pic=${pic}`, '_blank');
};

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
  {
    id: 5,
    title: '索尼A7M4相机深度评测',
    excerpt: '全面解析索尼最新全画幅微单相机的性能表现和使用体验...',
    thumbnailUrl: 'https://picsum.photos/600/400?random=105',
    category: 'equipment',
    difficulty: 'intermediate',
    authorName: '赵器材',
    authorAvatar: 'https://picsum.photos/100/100?random=14',
    views: 11200,
    likes: 980,
    comments: 176,
  },
  {
    id: 6,
    title: '街头摄影的艺术与技巧',
    excerpt: '探索街头摄影的构图、时机把握和人文表达技巧...',
    thumbnailUrl: 'https://picsum.photos/600/400?random=106',
    category: 'composition',
    difficulty: 'advanced',
    authorName: '刘街拍',
    authorAvatar: 'https://picsum.photos/100/100?random=15',
    views: 7600,
    likes: 650,
    comments: 112,
  },
]);

// 模拟视频课程数据
const videosData = ref([
  {
    id: 21,
    title: '零基础摄影入门课程',
    excerpt: '适合完全不懂摄影的新手，从相机操作到基础构图，全面讲解摄影基础知识...',
    thumbnailUrl: 'https://picsum.photos/600/400?random=201',
    category: 'pre',
    difficulty: 'beginner',
    duration: '5小时30分钟',
    lessons: 12,
    authorName: '张老师',
    authorAvatar: 'https://picsum.photos/100/100?random=10',
    views: 25800,
    likes: 2100,
    progress: 0,
  },
  {
    id: 22,
    title: 'Photoshop后期修图实战',
    excerpt: '学习专业修图师常用的Photoshop技巧，让你的照片更加完美...',
    thumbnailUrl: 'https://picsum.photos/600/400?random=202',
    category: 'post',
    difficulty: 'intermediate',
    duration: '8小时15分钟',
    lessons: 18,
    authorName: '王后期',
    authorAvatar: 'https://picsum.photos/100/100?random=12',
    views: 18900,
    likes: 1750,
    progress: 45,
  },
  {
    id: 23,
    title: '单反相机使用完全指南',
    excerpt: '详细讲解单反相机的各项功能和使用技巧，帮助你充分发挥相机性能...',
    thumbnailUrl: 'https://picsum.photos/600/400?random=203',
    category: 'equipment',
    difficulty: 'beginner',
    duration: '6小时45分钟',
    lessons: 15,
    authorName: '赵器材',
    authorAvatar: 'https://picsum.photos/100/100?random=14',
    views: 21300,
    likes: 1890,
    progress: 0,
  },
  {
    id: 24,
    title: '高级构图与视觉表达',
    excerpt: '深入学习摄影构图的高级技巧，提升照片的艺术表现力...',
    thumbnailUrl: 'https://picsum.photos/600/400?random=204',
    category: 'composition',
    difficulty: 'advanced',
    duration: '7小时20分钟',
    lessons: 16,
    authorName: '李摄影师',
    authorAvatar: 'https://picsum.photos/100/100?random=11',
    views: 12500,
    likes: 1100,
    progress: 28,
  },
]);

// 模拟参数库数据
const paramsData = ref([
  {
    id: 31,
    title: '城市夜景拍摄参数',
    imageUrl: 'https://picsum.photos/400/300?random=301',
    camera: '索尼A7R IV / 佳能EOS R5 / 尼康Z7 II',
    lens: '16-35mm f/2.8 或 24-70mm f/2.8',
    aperture: 'f/8 - f/11',
    shutter: '2-30秒 (使用三脚架)',
    iso: '100-400',
    whiteBalance: '自动或钨丝灯模式',
    description: '城市夜景拍摄建议使用较小光圈保证景深，低ISO减少噪点，慢门捕捉灯光轨迹。建议使用三脚架和遥控器避免抖动。',
  },
  {
    id: 32,
    title: '室外人像拍摄参数',
    imageUrl: 'https://picsum.photos/400/300?random=302',
    camera: '任意单反/微单相机',
    lens: '85mm f/1.4 或 50mm f/1.8',
    aperture: 'f/1.4 - f/2.8',
    shutter: '1/200秒以上',
    iso: '100-800',
    whiteBalance: '自动或日光模式',
    description: '室外人像拍摄建议使用大光圈虚化背景，保证足够的快门速度避免模糊。如果光线不足，可以适当提高ISO，但注意控制噪点。',
  },
  {
    id: 33,
    title: '风景摄影黄金参数',
    imageUrl: 'https://picsum.photos/400/300?random=303',
    camera: '全画幅相机最佳',
    lens: '16-35mm f/4 或 24-70mm f/4',
    aperture: 'f/8 - f/16',
    shutter: '1/125秒 - 1/500秒',
    iso: '100-200',
    whiteBalance: '自动或日光模式',
    description: '风景摄影通常使用较小光圈获得最大景深，低ISO保证画质。在光线不足的情况下，建议使用三脚架稳定相机。',
  },
  {
    id: 34,
    title: '运动摄影参数设置',
    imageUrl: 'https://picsum.photos/400/300?random=304',
    camera: '高速对焦系统相机',
    lens: '70-200mm f/2.8 或 100-400mm f/4.5-5.6',
    aperture: 'f/2.8 - f/5.6',
    shutter: '1/1000秒以上',
    iso: '400-3200',
    whiteBalance: '自动',
    description: '运动摄影需要高速快门冻结动作，使用连续对焦模式追踪移动物体。在光线不足的情况下，适当提高ISO以保证足够的快门速度。',
  },
]);

// 模拟问答社区数据
const questionsData = ref([
  {
    id: 41,
    title: '如何拍摄星空照片？需要哪些设备和参数？',
    content: '最近对星空摄影很感兴趣，但不知道从何入手。请问需要哪些设备？如何设置参数？有什么技巧可以分享吗？',
    tags: ['星空', '风光', '参数设置'],
    authorName: '摄影新手',
    authorAvatar: 'https://picsum.photos/100/100?random=20',
    time: '2小时前',
    answers: 8,
    views: 320,
    likes: 15,
    isResolved: false,
  },
  {
    id: 42,
    title: 'Lightroom如何批量处理照片？',
    content: '最近拍了很多照片，想知道如何在Lightroom中批量处理，提高效率。有什么好的工作流推荐吗？',
    tags: ['后期', 'Lightroom', '批量处理'],
    authorName: '摄影爱好者',
    authorAvatar: 'https://picsum.photos/100/100?random=21',
    time: '昨天',
    answers: 12,
    views: 450,
    likes: 28,
    isResolved: true,
  },
  {
    id: 43,
    title: '佳能和索尼相机如何选择？',
    content: '准备升级相机，纠结于佳能EOS R5和索尼A7R IV之间。主要用于风光和人像摄影，请问哪个更适合？',
    tags: ['器材', '佳能', '索尼', '选购建议'],
    authorName: '纠结的摄影人',
    authorAvatar: 'https://picsum.photos/100/100?random=22',
    time: '3天前',
    answers: 15,
    views: 680,
    likes: 42,
    isResolved: false,
  },
  {
    id: 44,
    title: '如何提高照片构图水平？',
    content: '感觉自己拍的照片总是不够吸引人，构图很平淡。有什么方法可以系统地提高构图水平吗？',
    tags: ['构图', '技巧', '学习方法'],
    authorName: '构图小白',
    authorAvatar: 'https://picsum.photos/100/100?random=23',
    time: '1周前',
    answers: 20,
    views: 890,
    likes: 65,
    isResolved: true,
  },
]);

// 模拟学习路径数据
const learningPaths = ref([
  {
    id: 51,
    title: '摄影新手入门',
    description: '适合完全没有摄影基础的新手，从相机操作到基础构图，循序渐进地学习摄影知识。',
    icon: '📸',
    courses: 12,
    duration: 25,
    students: 15600,
    progress: 0,
    steps: [
      {
        title: '相机基础操作',
        description: '了解相机的基本结构和操作方法，掌握曝光模式、对焦模式等基础知识。',
      },
      {
        title: '曝光三要素',
        description: '学习光圈、快门和ISO的概念及其对照片的影响，掌握曝光补偿的使用方法。',
      },
      {
        title: '构图基础',
        description: '学习常见的构图法则，如三分法、黄金分割、引导线等，提高照片的视觉表现力。',
      },
      {
        title: '光线的运用',
        description: '了解不同光线条件下的拍摄技巧，学习如何利用自然光和人工光。',
      },
    ],
  },
  {
    id: 52,
    title: '后期处理进阶',
    description: '从基础后期到高级修图，全面提升你的照片后期处理能力。',
    icon: '🎨',
    courses: 18,
    duration: 35,
    students: 8900,
    progress: 32,
    steps: [
      {
        title: 'Lightroom基础',
        description: '学习Lightroom的界面和基本操作，掌握导入、整理和基础调整技巧。',
      },
      {
        title: 'Photoshop进阶',
        description: '深入学习Photoshop的高级功能，如图层、蒙版、调整图层等。',
      },
      {
        title: '色彩管理',
        description: '学习色彩理论和色彩管理技巧，掌握照片的色彩调整方法。',
      },
      {
        title: '特效与创意后期',
        description: '学习如何使用后期软件创建特效和创意效果，提升照片的艺术表现力。',
      },
    ],
  },
  {
    id: 53,
    title: '风光摄影大师班',
    description: '专为风光摄影爱好者打造的高级课程，学习专业风光摄影的技巧和理念。',
    icon: '🏞️',
    courses: 15,
    duration: 30,
    students: 6500,
    progress: 0,
    steps: [
      {
        title: '风光摄影器材选择',
        description: '了解风光摄影所需的专业器材，包括相机、镜头、三脚架等附件的选择和使用。',
      },
      {
        title: '风光摄影构图与光线',
        description: '学习风光摄影的高级构图技巧和光线运用方法，提升作品的艺术表现力。',
      },
      {
        title: '特殊环境拍摄',
        description: '学习在不同环境下的拍摄技巧，如日出日落、星空、云海、雪景等。',
      },
      {
        title: '风光摄影后期工作流',
        description: '掌握专业风光摄影师的后期处理工作流，从原片到成品的完整流程。',
      },
    ],
  },
]);

// 设置当前标签页
const setTab = (tab) => {
  currentTab.value = tab;
};

// 设置参数库分类
const setParamCategory = (category) => {
  selectedParamCategory.value = category;
};

// 设置问答筛选
const setQAFilter = (filter) => {
  selectedQAFilter.value = filter;
};

// 复制参数
const copyParams = (paramId) => {
  // 实际项目中应实现复制到剪贴板功能
  alert('参数已复制到剪贴板！');
};

// 保存参数
const saveParams = (paramId) => {
  // 实际项目中应实现保存功能
  alert('参数已保存到您的收藏夹！');
};

// 打开提问模态框
const openAskModal = () => {
  // 实际项目中应打开提问模态框
  alert('提问功能正在开发中...');
};

// 开始学习路径
const startPath = (pathId) => {
  router.push(`/tutorials/path/${pathId}`);
};

// 继续学习路径
const continuePath = (pathId) => {
  router.push(`/tutorials/path/${pathId}/continue`);
};
</script>

<style>
/* 教程容器样式 */
.tutorials-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 教程头部样式 */
.tutorials-header {
  text-align: center;
  margin-bottom: 32px;
}

.tutorials-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #212529;
  margin-bottom: 8px;
}

.tutorials-header p {
  font-size: 16px;
  color: #6C757D;
}

/* 教程导航样式 */
.tutorials-nav {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.nav-tab {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-tab:hover {
  background-color: #F8F9FA;
  border-color: #0D6EFD;
  color: #0D6EFD;
}

.nav-tab.active {
  background-color: #0D6EFD;
  border-color: #0D6EFD;
  color: #FFFFFF;
}

/* 通用区域头部样式 */
.articles-header,
.videos-header,
.params-header,
.qa-header,
.paths-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.articles-header h2,
.videos-header h2,
.params-header h2,
.qa-header h2,
.paths-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #212529;
}

.params-header p,
.paths-header p {
  font-size: 16px;
  color: #6C757D;
  margin-left: 16px;
}

/* 通用筛选样式 */
.articles-filters,
.videos-filters {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  color: #495057;
  font-weight: 500;
}

.filter-select {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  color: #495057;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  border-color: #0D6EFD;
}

/* 图文教程列表样式 */
.articles-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.article-card {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  gap: 20px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.article-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
  border-color: #0D6EFD;
}

.article-thumbnail {
  width: 200px;
  height: 140px;
  flex-shrink: 0;
  overflow: hidden;
}

.article-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .article-thumbnail img {
  transform: scale(1.05);
}

/* Hover 白底详情层（与首页统一） */
.tutorial-hover-detail { position: relative; background: #fff; color: #2D3A4B; display: none; grid-template-columns: 1.2fr 1fr; gap: 16px; padding: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
.article-card { position: relative; }
.article-card:hover .tutorial-hover-detail { position: absolute; inset: 0; display: grid; }
.tutorial-hover-left { display: flex; align-items: center; justify-content: center; overflow: hidden; }
.tutorial-hover-image { max-width: 100%; max-height: 100%; object-fit: contain; }
.tutorial-hover-right { display: flex; flex-direction: column; gap: 12px; }
.tutorial-hover-title { font-size: 18px; font-weight: 700; }
.tutorial-hover-sub { font-size: 12px; color: #98a2b3; }
.tutorial-hover-exif { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; }
.tutorial-hover-exif .exif-item { display: flex; gap: 8px; font-size: 13px; }
.tutorial-hover-exif .label { color: #7a869a; min-width: 68px; }
.tutorial-hover-exif .value { color: #2D3A4B; font-weight: 500; }
.tutorial-hover-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.hover-btn { background: #F5F8FF; border: 1px solid #e9edf3; color: #2D3A4B; border-radius: 18px; padding: 6px 12px; font-size: 13px; }
.hover-btn.like.active, .hover-btn.like:hover { background: rgba(13,110,253,0.08); border-color: #0D6EFD; color: #0D6EFD; }
.collect-wrap, .comment-wrap, .share-wrap { position: relative; }
.collect-menu { position: absolute; top: 36px; left: 0; background: #fff; border: 1px solid #e9edf3; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); min-width: 160px; z-index: 5; }
.collect-menu .menu-title { padding: 8px 12px; font-size: 12px; color: #7a869a; border-bottom: 1px solid #e9edf3; }
.collect-menu .menu-item { padding: 10px 12px; cursor: pointer; }
.collect-menu .menu-item:hover { background: #F5F8FF; }
.tutorial-hover-comment { display: flex; flex-direction: column; gap: 8px; }
.rich-tools { display: flex; gap: 6px; }
.tool { background: #fff; border: 1px solid #e9edf3; border-radius: 6px; padding: 4px 8px; }
.rich-input { width: 100%; min-height: 64px; padding: 8px; border: 1px solid #e9edf3; border-radius: 8px; resize: vertical; }
.comment-actions { display: flex; justify-content: flex-end; }
.comment-actions .submit { background: #4A90E2; color: #fff; border: none; border-radius: 6px; padding: 6px 12px; }

.article-content {
  flex: 1;
  padding: 20px 20px 20px 0;
  min-width: 0;
}

.article-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.article-category,
.article-difficulty {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.article-category.pre {
  background-color: #E7F1FF;
  color: #0D6EFD;
}

.article-category.post {
  background-color: #FFF3CD;
  color: #856404;
}

.article-category.equipment {
  background-color: #D1ECF1;
  color: #0C5460;
}

.article-category.composition {
  background-color: #D4EDDA;
  color: #155724;
}

.article-category.lighting {
  background-color: #F8D7DA;
  color: #721C24;
}

.article-difficulty.beginner {
  background-color: #E7F1FF;
  color: #0D6EFD;
}

.article-difficulty.intermediate {
  background-color: #FFF3CD;
  color: #856404;
}

.article-difficulty.advanced {
  background-color: #F8D7DA;
  color: #721C24;
}

.article-title {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-excerpt {
  font-size: 14px;
  color: #6C757D;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
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
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 14px;
  color: #495057;
  font-weight: 500;
}

.article-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #ADB5BD;
}

/* 视频课程列表样式 */
.videos-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.video-card {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  gap: 20px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.video-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
  border-color: #0D6EFD;
}

.video-thumbnail {
  width: 200px;
  height: 140px;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.video-card:hover .video-thumbnail img {
  transform: scale(1.05);
}

.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #FFFFFF;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.video-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
}

.progress-bar {
  height: 100%;
  background-color: #0D6EFD;
  transition: width 0.3s ease;
}

.video-content {
  flex: 1;
  padding: 20px 20px 20px 0;
  min-width: 0;
}

.video-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.video-category,
.video-difficulty {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.video-category.pre {
  background-color: #E7F1FF;
  color: #0D6EFD;
}

.video-category.post {
  background-color: #FFF3CD;
  color: #856404;
}

.video-category.equipment {
  background-color: #D1ECF1;
  color: #0C5460;
}

.video-category.composition {
  background-color: #D4EDDA;
  color: #155724;
}

.video-category.lighting {
  background-color: #F8D7DA;
  color: #721C24;
}

.video-difficulty.beginner {
  background-color: #E7F1FF;
  color: #0D6EFD;
}

.video-difficulty.intermediate {
  background-color: #FFF3CD;
  color: #856404;
}

.video-difficulty.advanced {
  background-color: #F8D7DA;
  color: #721C24;
}

.video-title {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.video-excerpt {
  font-size: 14px;
  color: #6C757D;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.5;
}

.video-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.video-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.video-stats {
  display: flex;
  gap: 16px;
}

.video-progress-text {
  width: 100%;
  font-size: 12px;
  color: #0D6EFD;
  font-weight: 500;
  margin-top: 8px;
}

/* 参数库搜索和分类样式 */
.params-search,
.qa-search {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #E9ECEF;
  border-radius: 8px;
  font-size: 14px;
  color: #495057;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #0D6EFD;
}

.search-button {
  background-color: #0D6EFD;
  color: #FFFFFF;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-button:hover {
  background-color: #0B5ED7;
}

.params-categories {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.category-button {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-button:hover {
  border-color: #0D6EFD;
  color: #0D6EFD;
}

.category-button.active {
  background-color: #0D6EFD;
  border-color: #0D6EFD;
  color: #FFFFFF;
}

/* 参数库列表样式 */
.params-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.param-card {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;
}

.param-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.param-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.param-title {
  font-size: 20px;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.param-actions {
  display: flex;
  gap: 12px;
}

.action-button {
  background-color: #F8F9FA;
  border: 1px solid #E9ECEF;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  color: #495057;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.action-button:hover {
  background-color: #E9ECEF;
  border-color: #0D6EFD;
  color: #0D6EFD;
}

.param-content {
  display: flex;
  gap: 24px;
}

.param-image {
  width: 300px;
  height: 200px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 8px;
}

.param-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.param-details {
  flex: 1;
  min-width: 0;
}

.param-specs {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.spec-item {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.spec-label {
  font-weight: 500;
  color: #495057;
  font-size: 14px;
  min-width: 80px;
}

.spec-value {
  color: #6C757D;
  font-size: 14px;
}

.param-description h4 {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 8px 0;
}

.param-description p {
  font-size: 14px;
  color: #6C757D;
  line-height: 1.6;
}

/* 问答社区筛选样式 */
.qa-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-button {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-button:hover {
  border-color: #0D6EFD;
  color: #0D6EFD;
}

.filter-button.active {
  background-color: #0D6EFD;
  border-color: #0D6EFD;
  color: #FFFFFF;
}

.ask-question-button {
  background-color: #0D6EFD;
  color: #FFFFFF;
  border: none;
  padding: 10px 24px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.ask-question-button:hover {
  background-color: #0B5ED7;
}

/* 问答列表样式 */
.qa-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.question-card {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;
  cursor: pointer;
  border-left: 4px solid #0D6EFD;
}

.question-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.question-card.resolved {
  border-left-color: #198754;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.question-title {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin: 0;
  flex: 1;
  min-width: 0;
}

.resolved-badge {
  background-color: #D4EDDA;
  color: #155724;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.question-content {
  margin-bottom: 16px;
}

.question-excerpt {
  font-size: 14px;
  color: #6C757D;
  margin: 0 0 12px 0;
  line-height: 1.6;
}

.question-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.question-tag {
  background-color: #E7F1FF;
  color: #0D6EFD;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.question-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.question-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.question-time {
  font-size: 12px;
  color: #ADB5BD;
}

.question-stats {
  display: flex;
  gap: 16px;
}

/* 学习路径列表样式 */
.paths-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.path-card {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  border-left: 4px solid #0D6EFD;
}

.path-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* 文章详情模态框样式 */
#article-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

#article-modal.hidden {
  display: none;
}

#article-modal .bg-white {
  background-color: white;
  border-radius: 8px;
  max-width: 64rem;
  width: 100%;
  max-height: 100vh;
  overflow-y: auto;
}

#article-image {
  width: 100%;
  height: 40rem;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 2.5rem;
}

#article-content {
  color: #4B5563;
  line-height: 1.8;
}

.comment-item {
  padding: 1rem 0;
  border-bottom: 1px solid #E5E7EB;
}

.comment-item:last-child {
  border-bottom: none;
}

/* 文章卡片点击样式 */
.article-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.path-header {
  background: linear-gradient(135deg, #E7F1FF 0%, #FFFFFF 100%);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.path-icon {
  font-size: 32px;
  width: 64px;
  height: 64px;
  background-color: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.path-title {
  font-size: 20px;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.path-content {
  padding: 20px;
  border-bottom: 1px solid #E9ECEF;
}

.path-description {
  font-size: 14px;
  color: #6C757D;
  margin: 0 0 12px 0;
  line-height: 1.6;
}

.path-stats {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #ADB5BD;
}

.path-steps {
  padding: 0 20px 20px 20px;
}

.step-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: flex-start;
}

.step-item:last-child {
  margin-bottom: 0;
}

.step-number {
  width: 24px;
  height: 24px;
  background-color: #0D6EFD;
  color: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
  margin-top: 2px;
}

.step-content {
  flex: 1;
  min-width: 0;
}

.step-title {
  font-size: 14px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 4px 0;
}

.step-description {
  font-size: 12px;
  color: #6C757D;
  margin: 0;
  line-height: 1.5;
}

.path-actions {
  padding: 20px;
  text-align: center;
}

.start-button,
.continue-button {
  background-color: #0D6EFD;
  color: #FFFFFF;
  border: none;
  padding: 12px 32px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
}

.start-button:hover,
.continue-button:hover {
  background-color: #0B5ED7;
}

.continue-button {
  background-color: #198754;
}

.continue-button:hover {
  background-color: #157347;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
}

.pagination-button {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  background-color: #F8F9FA;
  border-color: #0D6EFD;
  color: #0D6EFD;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
  color: #6C757D;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .articles-list,
  .videos-list {
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  }
  
  .paths-list {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .tutorials-container {
    padding: 0 16px;
  }
  
  .tutorials-nav {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 8px;
  }
  
  .articles-header,
  .videos-header,
  .params-header,
  .qa-header,
  .paths-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .articles-filters,
  .videos-filters {
    width: 100%;
  }
  
  .filter-group {
    flex: 1;
    min-width: 150px;
  }
  
  .articles-list,
  .videos-list {
    grid-template-columns: 1fr;
  }
  
  .article-card,
  .video-card {
    flex-direction: column;
  }
  
  .article-thumbnail,
  .video-thumbnail {
    width: 100%;
    height: 200px;
  }
  
  .article-content,
  .video-content {
    padding: 20px;
  }
  
  .params-content {
    flex-direction: column;
  }
  
  .param-image {
    width: 100%;
    height: 200px;
  }
  
  .params-search,
  .qa-search {
    flex-direction: column;
  }
  
  .search-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .tutorials-header h1 {
    font-size: 24px;
  }
  
  .nav-tab {
    padding: 10px 16px;
    font-size: 14px;
  }
  
  .articles-header h2,
  .videos-header h2,
  .params-header h2,
  .qa-header h2,
  .paths-header h2 {
    font-size: 20px;
  }
  
  .param-specs {
    grid-template-columns: 1fr;
  }
  
  .path-header {
    flex-direction: column;
    text-align: center;
  }
  
  .step-item {
    flex-direction: column;
    gap: 8px;
  }
  
  .step-number {
    align-self: center;
  }
}
</style>