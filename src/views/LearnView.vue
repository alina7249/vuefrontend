<template>
  <div class="learn-container">
    <!-- 摄影风格背景装饰 -->
    <div class="photo-bg"></div>
    
    <!-- 页面头部 -->
    <div class="learn-header">
      <h1>探索摄影视界</h1>
      <p>分享精彩瞬间，交流摄影技巧，发现视觉之美</p>
    </div>
    
    <!-- 侧边导航 -->
      <aside class="learn-sidebar">
        <nav class="category-nav">
          <h2 class="nav-title">摄影分类</h2>
          <a href="#" class="category-item active">
            <span class="category-icon">📷</span>
            <span>推荐作品</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">🏞️</span>
            <span>风景摄影</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">👤</span>
            <span>人像摄影</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">🌆</span>
            <span>城市建筑</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">🐾</span>
            <span>野生动物</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">🍽️</span>
            <span>美食摄影</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">📸</span>
            <span>摄影技巧</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">🔍</span>
            <span>器材测评</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">🎨</span>
            <span>后期处理</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">🏆</span>
            <span>热门榜单</span>
          </a>
        </nav>
      </aside>
      
      <!-- 主要内容区 -->
      <main class="learn-content">
        <!-- 标签栏 -->
        <div class="tags-bar">
          <button class="tag active">推荐</button>
          <button class="tag">最新</button>
        </div>
        
        <!-- 摄影作品列表 -->
        <div class="article-list">
          <!-- 摄影作品项 -->
          <div class="article-item">
            <div class="photo-preview" style="background: url('https://picsum.photos/id/10/800/500') center/cover no-repeat;"></div>
            <div class="article-content">
              <h3 class="article-title">山间晨雾</h3>
              <p class="article-excerpt">清晨的山间云雾缭绕，宛如仙境。使用索尼A7R4和24-70mm F2.8镜头拍摄，ISO100，光圈F8，快门1/200s。</p>
              <div class="article-meta">
                <span class="author">自然摄影者</span>
                <span class="views">12.5k 浏览</span>
                <span class="likes">956 点赞</span>
                <div class="article-tags">
                  <span class="tag">风景</span>
                  <span class="tag">晨雾</span>
                  <span class="tag">索尼</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="article-item">
            <div class="photo-preview" style="background: url('https://picsum.photos/id/26/800/500') center/cover no-repeat;"></div>
            <div class="article-content">
              <h3 class="article-title">城市夜景</h3>
              <p class="article-excerpt">城市的夜晚灯火辉煌，展现出不一样的魅力。使用佳能5D4和16-35mm F2.8镜头，长时间曝光捕捉城市光影。</p>
              <div class="article-meta">
                <span class="author">城市探索者</span>
                <span class="views">8.3k 浏览</span>
                <span class="likes">742 点赞</span>
                <div class="article-tags">
                  <span class="tag">城市</span>
                  <span class="tag">夜景</span>
                  <span class="tag">佳能</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="article-item">
            <div class="photo-preview" style="background: url('https://picsum.photos/id/64/800/500') center/cover no-repeat;"></div>
            <div class="article-content">
              <h3 class="article-title">人像摄影技巧分享</h3>
              <p class="article-excerpt">分享10个提升人像摄影水平的实用技巧，包括光线运用、构图方法、引导模特等方面的经验。</p>
              <div class="article-meta">
                <span class="author">人像摄影师</span>
                <span class="views">15.2k 浏览</span>
                <span class="likes">1253 点赞</span>
                <div class="article-tags">
                  <span class="tag">人像</span>
                  <span class="tag">技巧</span>
                  <span class="tag">教程</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="article-item">
            <div class="photo-preview" style="background: url('https://picsum.photos/id/42/800/500') center/cover no-repeat;"></div>
            <div class="article-content">
              <h3 class="article-title">野生动物瞬间</h3>
              <p class="article-excerpt">在非洲草原上捕捉到的精彩瞬间，狮子家族的日常生活。使用尼康D5和600mm F4镜头，远距离拍摄。</p>
              <div class="article-meta">
                <span class="author">野生动物摄影师</span>
                <span class="views">10.8k 浏览</span>
                <span class="likes">867 点赞</span>
                <div class="article-tags">
                  <span class="tag">野生动物</span>
                  <span class="tag">非洲</span>
                  <span class="tag">尼康</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="article-item">
            <div class="photo-preview" style="background: url('https://picsum.photos/id/96/800/500') center/cover no-repeat;"></div>
            <div class="article-content">
              <h3 class="article-title">美食摄影布光技巧</h3>
              <p class="article-excerpt">详解美食摄影中的布光方法，如何让食物看起来更加诱人，以及常用的道具和背景选择。</p>
              <div class="article-meta">
                <span class="author">美食摄影师</span>
                <span class="views">7.6k 浏览</span>
                <span class="likes">624 点赞</span>
                <div class="article-tags">
                  <span class="tag">美食</span>
                  <span class="tag">布光</span>
                  <span class="tag">技巧</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="article-item">
            <div class="photo-preview" style="background: url('https://picsum.photos/id/25/800/500') center/cover no-repeat;"></div>
            <div class="article-content">
              <h3 class="article-title">极简主义摄影</h3>
              <p class="article-excerpt">探讨极简主义摄影的构图原则和审美价值，如何通过简洁的画面表达深刻的主题。</p>
              <div class="article-meta">
                <span class="author">艺术摄影师</span>
                <span class="views">9.4k 浏览</span>
                <span class="likes">798 点赞</span>
                <div class="article-tags">
                  <span class="tag">极简</span>
                  <span class="tag">艺术</span>
                  <span class="tag">构图</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 加载更多 -->
        <div class="load-more">
          <button>加载更多</button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
// 可以在这里添加学习页面的逻辑
</script>

<style scoped>
:root {
  --primary-color: #3a7bd5;
  --primary-hover: #2968c8;
  --accent-color: #f093fb;
  --secondary-color: #4facfe;
  --border-color: #2c3e50;
  --bg-color: #f8f9fa;
  --dark-bg: #e9ecef;
  --card-bg: #ffffff;
  --text-color: #212529;
  --text-light: #6c757d;
  --text-secondary: #495057;
  --white: #ffffff;
  --shadow: 0 4px 12px rgba(58, 123, 213, 0.15);
}

.learn-container {
    max-width: 1600px;
    margin: 0 auto;
    padding: 30px;
    position: relative;
    z-index: 1;
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
    background-color: var(--dark-bg);
    border-radius: 12px;
    box-shadow: var(--shadow);
    border: 1px solid var(--border-color);
    position: relative;
    overflow: hidden;
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
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
}

.learn-header h1 {
    margin: 0 0 16px 0;
    font-size: 42px;
    font-weight: 700;
    color: var(--primary-color);
    text-shadow: 0 0 10px rgba(0, 188, 212, 0.3);
    background: linear-gradient(90deg, var(--primary-color), #4dd0e1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
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
    color: var(--text-light);
  }
  
  /* 大屏幕副标题优化 */
  @media (min-width: 1400px) {
    .learn-header p {
      font-size: 22px;
    }
  }

/* 布局 */
.learn-layout {
  display: flex;
  gap: 20px;
}

/* 侧边导航 */
  .learn-sidebar {
    width: 280px;
    flex-shrink: 0;
  }
  
  /* 大屏幕侧边栏优化 */
  @media (min-width: 1400px) {
    .learn-sidebar {
      width: 300px;
    }
  }

.category-nav {
    background-color: var(--dark-bg);
    border-radius: 8px;
    box-shadow: var(--shadow);
    padding: 25px;
    border: 1px solid var(--border-color);
  }
  
  /* 大屏幕侧边栏内容优化 */
  @media (min-width: 1400px) {
    .category-nav {
      padding: 30px;
    }
    
    .category-item {
      font-size: 16px;
      padding: 14px 18px;
      gap: 15px;
    }
    
    .category-icon {
      font-size: 22px;
    }
  }

.nav-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color);
  text-align: center;
  position: relative;
  padding-bottom: 10px;
}

.nav-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 50%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
}

.category-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 6px;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
}

.category-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 188, 212, 0.1), transparent);
  transition: left 0.5s ease;
}

.category-item:hover {
  background-color: rgba(0, 188, 212, 0.05);
  color: var(--primary-color);
  border-color: var(--primary-color);
  transform: translateX(5px);
}

.category-item:hover::before {
  left: 100%;
}

.category-item.active {
  background-color: rgba(0, 188, 212, 0.1);
  color: var(--primary-color);
  font-weight: 500;
  border-color: var(--primary-color);
  box-shadow: 0 0 10px rgba(0, 188, 212, 0.2);
}

.category-icon {
  font-size: 20px;
}

/* 主内容区 */
.learn-content {
  flex: 1;
  min-width: 0;
}

/* 标签栏 */
.tags-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding: 20px;
  background-color: var(--dark-bg);
  border-radius: 8px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
}

.tag {
  padding: 8px 20px;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 14px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.tag::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 188, 212, 0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tag:hover {
  background-color: rgba(0, 188, 212, 0.05);
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.tag:hover::before {
  opacity: 1;
}

.tag.active {
  background-color: var(--primary-color);
  color: var(--white);
  border-color: var(--primary-color);
  box-shadow: 0 0 15px rgba(0, 188, 212, 0.3);
}

/* 摄影作品列表 */
  .article-list {
    margin-bottom: 30px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  /* 大屏幕文章列表优化 - 使用多列布局 */
  @media (min-width: 1400px) {
    .article-list {
      grid-template-columns: 1fr 1fr;
      gap: 25px;
    }
  }

.article-item {
    background-color: var(--card-bg);
    border-radius: 8px;
    box-shadow: var(--shadow);
    transition: all 0.3s ease;
    border: 1px solid var(--border-color);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  /* 摄影预览图样式 */
  .photo-preview {
    height: 220px;
    width: 100%;
    border-radius: 8px 8px 0 0;
    overflow: hidden;
    position: relative;
    transition: transform 0.5s ease;
  }
  
  .article-item:hover .photo-preview {
    transform: scale(1.03);
  }
  
  .photo-preview::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .article-item:hover .photo-preview::before {
    opacity: 1;
  }
  
  /* 大屏幕文章项优化 */
  @media (min-width: 1400px) {
    .article-item {
      transform: scale(1);
      transition: all 0.4s ease;
    }
    
    .article-item:hover {
      transform: translateY(-4px) scale(1.01);
      box-shadow: 0 0 30px rgba(0, 188, 212, 0.25);
    }
  }

.article-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 188, 212, 0.05) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.article-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, var(--primary-color), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.article-item:hover::before,
.article-item:hover::after {
  opacity: 1;
}

.article-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(0, 188, 212, 0.2);
  border-color: var(--primary-color);
}

.article-content {
    padding: 25px;
  }
  
  /* 大屏幕文章内容优化 */
  @media (min-width: 1400px) {
    .article-content {
      padding: 30px;
    }
  }

.article-title {
    margin: 0 0 16px 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-color);
    transition: color 0.3s ease;
    position: relative;
    display: inline-block;
  }
  
  /* 大屏幕文章标题优化 */
  @media (min-width: 1400px) {
    .article-title {
      font-size: 22px;
      margin-bottom: 18px;
    }
  }

.article-item:hover .article-title {
  color: var(--primary-color);
}

.article-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.article-item:hover .article-title::after {
  width: 100%;
}

.article-excerpt {
    margin: 0 0 20px 0;
    font-size: 15px;
    color: var(--text-light);
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* 大屏幕文章摘要优化 */
  @media (min-width: 1400px) {
    .article-excerpt {
      font-size: 16px;
      margin-bottom: 24px;
      -webkit-line-clamp: 3;
    }
  }

.article-meta {
    display: flex;
    align-items: center;
    gap: 20px;
    font-size: 13px;
  }
  
  /* 大屏幕文章元信息优化 */
  @media (min-width: 1400px) {
    .article-meta {
      font-size: 14px;
      gap: 24px;
    }
  }

.author {
  color: var(--primary-color);
  font-weight: 500;
  position: relative;
  padding: 2px 8px;
  border-radius: 12px;
  background-color: rgba(0, 188, 212, 0.1);
  border: 1px solid rgba(0, 188, 212, 0.2);
}

.views,
.likes {
  color: var(--text-secondary);
}

.article-tags {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.article-tags .tag {
  padding: 4px 12px;
  font-size: 12px;
  background-color: rgba(0, 188, 212, 0.05);
  border-color: var(--border-color);
  color: var(--text-secondary);
}

/* 加载更多 */
  .load-more {
    text-align: center;
    padding: 30px;
    margin-top: 20px;
  }
  
  /* 大屏幕加载更多按钮优化 */
  @media (min-width: 1400px) {
    .load-more {
      padding: 40px;
      margin-top: 30px;
    }
    
    .load-more button {
      padding: 14px 36px;
      font-size: 15px;
    }
  }

.load-more button {
  padding: 12px 32px;
  background-color: var(--dark-bg);
  border: 1px solid var(--primary-color);
  border-radius: 6px;
  font-size: 14px;
  color: var(--primary-color);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.load-more button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 188, 212, 0.2), transparent);
  transition: left 0.5s ease;
}

.load-more button:hover::before {
  left: 100%;
}

.load-more button:hover {
  box-shadow: 0 0 15px rgba(0, 188, 212, 0.3);
  transform: translateY(-2px);
}

.load-more button:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

/* 响应式设计 */
  @media (max-width: 1400px) {
    /* 大屏幕到桌面端的过渡 */
    .learn-sidebar {
      width: 280px;
    }
    
    .article-list {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 1200px) {
    /* 桌面端优化 */
    .learn-container {
      padding: 25px;
    }
    
    .learn-header {
      padding: 50px 30px;
      margin-bottom: 40px;
    }
    
    .learn-header h1 {
      font-size: 38px;
    }
    
    .learn-header p {
      font-size: 19px;
    }
    
    .article-list {
      gap: 18px;
    }
  }
  
  @media (max-width: 1024px) {
    /* 平板端布局 */
    .learn-layout {
      flex-direction: column;
    }
    
    .learn-sidebar {
      width: 100%;
    }
    
    .category-nav {
      padding: 16px;
    }
    
    .nav-title {
      margin-bottom: 16px;
    }
    
    .article-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    
    .article-tags {
      margin-left: 0;
    }

    /* 添加科技风格响应式调整 */
    .learn-header h1 {
      font-size: 32px;
    }
  }

@media (max-width: 768px) {
  .learn-container {
    padding: 16px;
  }
  
  .learn-header {
    padding: 30px 16px;
    margin-bottom: 30px;
  }
  
  .learn-header h1 {
    font-size: 28px;
  }
  
  .learn-header p {
    font-size: 16px;
  }
  
  .tags-bar {
    padding: 16px;
    overflow-x: auto;
  }
  
  .article-content {
    padding: 16px;
  }
  
  .article-title {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .learn-header h1 {
    font-size: 24px;
  }
  
  .learn-header p {
    font-size: 14px;
  }
  
  .category-item {
    padding: 10px 12px;
  }
  
  .tag {
    padding: 6px 16px;
    font-size: 12px;
  }
}
</style>