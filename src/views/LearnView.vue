<template>
  <div class="learn-container">
    <!-- 页面头部 - 主视觉模块 -->
    <div class="learn-header">
      <h1 class="page-title">探索摄影视界</h1>
      <p class="page-subtitle">分享精彩瞬间，交流摄影技巧，发现视觉之美</p>
      <div class="title-decoration"></div>
    </div>
    
    <!-- 布局容器 -->
    <div class="learn-layout">
      <!-- 摄影分类侧边栏 - 符合浅色主题设计 -->
      <aside class="learn-sidebar">
        <nav class="category-nav">
          <h2 class="nav-title">摄影分类</h2>
          <a href="#" class="category-item active">
            <span class="category-icon">📷</span>
            <span class="category-text">推荐作品</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">🏞️</span>
            <span class="category-text">风景摄影</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">👤</span>
            <span class="category-text">人像摄影</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">🌆</span>
            <span class="category-text">城市建筑</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">🐾</span>
            <span class="category-text">野生动物</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">🍽️</span>
            <span class="category-text">美食摄影</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">📸</span>
            <span class="category-text">摄影技巧</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">🔍</span>
            <span class="category-text">器材测评</span>
          </a>
        </nav>
      </aside>
      
      <!-- 主要内容区 -->
      <main class="learn-main">
        <!-- 标签栏 -->
        <div class="tag-bar">
          <h2 class="section-title">热门标签</h2>
          <div class="tag-list">
            <span class="tag">极简</span>
            <span class="tag">城市</span>
            <span class="tag">自然</span>
            <span class="tag">人文</span>
            <span class="tag">黑白</span>
            <span class="tag">街拍</span>
            <span class="tag">旅行</span>
            <span class="tag">光绘</span>
            <span class="tag">微距</span>
            <span class="tag">纪实</span>
          </div>
        </div>
        
        <!-- 作品列表 -->
        <div class="content-section">
          <div class="section-header">
            <h2 class="section-title">精选作品</h2>
            <div class="view-options">
              <button class="view-btn active">网格视图</button>
              <button class="view-btn">列表视图</button>
            </div>
          </div>
          
          <!-- 作品网格 -->
          <div class="works-grid">
            <!-- 作品项 1 -->
            <div class="work-item">
              <div class="work-image">
                <img src="https://picsum.photos/seed/photo1/800/600" alt="城市日落" class="photo">
                <div class="image-overlay">
                  <div class="overlay-content">
                    <span class="likes">❤️ 3.2k</span>
                    <span class="comments">💬 142</span>
                  </div>
                </div>
              </div>
              <div class="work-info">
                <h3 class="work-title">城市日落的温柔时刻</h3>
                <div class="work-meta">
                  <span class="author">@城市摄影师</span>
                  <span class="date">2天前</span>
                </div>
                <div class="work-tags">
                  <span class="tag">城市</span>
                  <span class="tag">日落</span>
                  <span class="tag">建筑</span>
                </div>
              </div>
            </div>
            
            <!-- 作品项 2 -->
            <div class="work-item">
              <div class="work-image">
                <img src="https://picsum.photos/seed/photo2/800/600" alt="山间晨雾" class="photo">
                <div class="image-overlay">
                  <div class="overlay-content">
                    <span class="likes">❤️ 2.8k</span>
                    <span class="comments">💬 98</span>
                  </div>
                </div>
              </div>
              <div class="work-info">
                <h3 class="work-title">山间晨雾的神秘面纱</h3>
                <div class="work-meta">
                  <span class="author">@自然探索者</span>
                  <span class="date">5天前</span>
                </div>
                <div class="work-tags">
                  <span class="tag">自然</span>
                  <span class="tag">山水</span>
                  <span class="tag">雾气</span>
                </div>
              </div>
            </div>
            
            <!-- 作品项 3 -->
            <div class="work-item">
              <div class="work-image">
                <img src="https://picsum.photos/seed/photo3/800/600" alt="人像摄影" class="photo">
                <div class="image-overlay">
                  <div class="overlay-content">
                    <span class="likes">❤️ 4.5k</span>
                    <span class="comments">💬 213</span>
                  </div>
                </div>
              </div>
              <div class="work-info">
                <h3 class="work-title">光影下的人物肖像</h3>
                <div class="work-meta">
                  <span class="author">@人像大师</span>
                  <span class="date">1周前</span>
                </div>
                <div class="work-tags">
                  <span class="tag">人像</span>
                  <span class="tag">光影</span>
                  <span class="tag">情绪</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 摄影文章 -->
        <div class="content-section">
          <div class="section-header">
            <h2 class="section-title">摄影教程</h2>
            <a href="#" class="view-more">查看全部</a>
          </div>
          
          <!-- 文章列表 -->
          <div class="articles-list">
            <!-- 文章项 1 -->
            <div class="article-item">
              <div class="article-image">
                <img src="https://picsum.photos/seed/tutorial1/400/300" alt="构图技巧" class="article-photo">
              </div>
              <div class="article-content">
                <h3 class="article-title">新手必学：摄影构图的十大法则</h3>
                <p class="article-excerpt">掌握这些基本构图技巧，让你的照片立即提升一个层次。从三分法到引导线，从框架构图到对比构图...</p>
                <div class="article-meta">
                  <span class="author">@摄影学院</span>
                  <span class="date">3天前</span>
                  <span class="views">👁️ 5.8k</span>
                </div>
                <div class="article-tags">
                  <span class="tag">构图</span>
                  <span class="tag">技巧</span>
                  <span class="tag">新手</span>
                </div>
              </div>
            </div>
            
            <!-- 文章项 2 -->
            <div class="article-item">
              <div class="article-image">
                <img src="https://picsum.photos/seed/tutorial2/400/300" alt="光线控制" class="article-photo">
              </div>
              <div class="article-content">
                <h3 class="article-title">光线控制：如何利用自然光拍出专业照片</h3>
                <p class="article-excerpt">自然光摄影是每个摄影师的必修课。本文将详细讲解不同时段的自然光特点，以及如何利用反光板和柔光...</p>
                <div class="article-meta">
                  <span class="author">@光影工作室</span>
                  <span class="date">1周前</span>
                  <span class="views">👁️ 4.2k</span>
                </div>
                <div class="article-tags">
                  <span class="tag">光线</span>
                  <span class="tag">自然光</span>
                  <span class="tag">技巧</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 加载更多 -->
        <div class="load-more">
          <button class="load-more-btn">加载更多</button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 可以在这里添加学习页面的逻辑
const activeCategory = ref('推荐作品')

const handleCategoryClick = (category) => {
  activeCategory.value = category
  // 这里可以添加切换分类的逻辑
}
</script>

<style scoped>
/* 浅色主题 - 摄影社区样式 */
.learn-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 30px;
  min-height: calc(100vh - 200px);
}

/* 大屏幕优化 */
@media (min-width: 1400px) {
  .learn-container {
    padding: 40px;
  }
}

/* 页面头部 */
.learn-header {
  text-align: center;
  margin-bottom: 50px;
  padding: 60px 40px;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.05) 0%, rgba(46, 204, 113, 0.05) 100%);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #E2E8F0;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  z-index: 1;
}

.learn-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: inherit;
  opacity: var(--star-opacity-hero, 0.12);
  z-index: -1;
}

/* 大屏幕头部优化 */
@media (min-width: 1400px) {
  .learn-header {
    margin-bottom: 60px;
    padding: 70px 60px;
  }
}

.learn-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #2A5C8C, #D4AF37);
}

.learn-header h1 {
  margin: 0 0 16px 0;
  font-size: 42px;
  font-weight: 700;
  color: #2A5C8C;
  text-shadow: 0 0 10px rgba(52, 152, 219, 0.3);
  background: linear-gradient(90deg, #2A5C8C, #1E4A73);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}

/* 大屏幕标题优化 */
@media (min-width: 1400px) {
  .learn-header h1 {
    font-size: 48px;
    margin-bottom: 20px;
  }
}

.learn-header p {
  margin: 0;
  font-size: 20px;
  color: #666;
}

/* 布局容器 */
.learn-layout {
  display: flex;
  gap: 30px;
}

/* 侧边栏样式 */
.learn-sidebar {
  width: 280px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.category-nav {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #E2E8F0;
  overflow: hidden;
  position: sticky;
  top: 30px;
  backdrop-filter: blur(5px);
  z-index: 1;
}

.category-nav::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: inherit;
  opacity: var(--star-opacity-sidebar, 0.06);
  z-index: -1;
}

.nav-title {
  padding: 20px 24px;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2A5C8C;
  border-bottom: 1px solid #E2E8F0;
  background-color: #F8FAFC;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
  border-bottom: 1px solid #F1F5F9;
}

.category-item:last-child {
  border-bottom: none;
}

.category-item:hover {
  background-color: #F8FAFC;
  color: #2A5C8C;
}

.category-item.active {
  background-color: #F0F7FF;
  color: #2A5C8C;
  border-left: 4px solid #2A5C8C;
  padding-left: 20px;
}

.category-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.category-text {
  font-size: 15px;
  font-weight: 500;
}

/* 主要内容区 */
.learn-main {
  flex: 1;
  position: relative;
  z-index: 1;
}

/* 标签栏 */
.tag-bar {
    margin-bottom: 40px;
    padding: 24px 30px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #E2E8F0;
    position: relative;
    z-index: 1;
  }

.tag-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: inherit;
  opacity: var(--star-opacity-content, 0.05);
  z-index: -1;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: inline-block;
  padding: 8px 20px;
  background-color: #F1F5F9;
  color: #333;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.tag:hover {
  background-color: #2A5C8C;
  color: #FFFFFF;
  transform: translateY(-2px);
}

/* 内容区块 */
.content-section {
    margin-bottom: 40px;
    padding: 30px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #E2E8F0;
    position: relative;
    z-index: 1;
  }

.content-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: inherit;
  opacity: var(--star-opacity-content, 0.05);
  z-index: -1;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.view-options {
  display: flex;
  gap: 8px;
}

.view-btn {
  padding: 8px 16px;
  background-color: #F1F5F9;
  color: #333;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn:hover {
  background-color: #E2E8F0;
}

.view-btn.active {
  background-color: #2A5C8C;
  color: #FFFFFF;
  border-color: #2A5C8C;
}

.view-more {
  color: #2A5C8C;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.view-more:hover {
  text-decoration: underline;
}

/* 作品网格 */
.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
}

.work-item {
    background-color: rgba(248, 250, 252, 0.95);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    z-index: 1;
  }

.work-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.work-image {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4/3;
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.work-item:hover .photo {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.6));
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.work-item:hover .image-overlay {
  opacity: 1;
}

.overlay-content {
  padding: 20px;
  display: flex;
  gap: 16px;
  color: #FFFFFF;
  font-size: 14px;
}

.work-info {
  padding: 20px;
}

.work-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.work-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.author {
  font-weight: 500;
  color: #2A5C8C;
}

.work-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.work-tags .tag {
  padding: 4px 12px;
  font-size: 12px;
  background-color: #E2E8F0;
}

/* 文章列表 */
.articles-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.article-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background-color: rgba(248, 250, 252, 0.95);
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(5px);
}

.article-item:hover {
  background-color: #F0F7FF;
  transform: translateY(-3px);
}

.article-image {
  flex-shrink: 0;
  width: 200px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
}

.article-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  flex: 1;
}

.article-title {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.article-excerpt {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #666;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.article-tags .tag {
  padding: 4px 12px;
  font-size: 12px;
  background-color: #E2E8F0;
}

/* 加载更多按钮 */
.load-more {
  text-align: center;
  margin-top: 40px;
}

.load-more-btn {
  padding: 16px 48px;
  background-color: #2A5C8C;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(42, 92, 140, 0.3);
}

.load-more-btn:hover {
  background-color: #1E4A73;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(42, 92, 140, 0.4);
}

/* 响应式设计 - 仅保留PC端样式 */
/* 已移除平板和移动端样式 */

/* 特殊效果 */
.title-decoration {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #2A5C8C, #D4AF37);
  margin: 20px auto 0;
  border-radius: 2px;
}

/* 器材技术参数特殊样式 */
.tech-specs {
  padding: 16px 20px;
  background-color: #F0F7FF;
  border-radius: 8px;
  border-left: 4px solid #2A5C8C;
  margin-top: 16px;
}

.specs-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #2A5C8C;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.specs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.spec-item {
  font-size: 13px;
  color: #333;
}

.spec-label {
  font-weight: 500;
  color: #666;
}

.spec-value {
  font-weight: 600;
  color: #2A5C8C;
}
</style>