<template>
  <div class="learn-container">
    <!-- 科技感背景装饰 -->
    <div class="circuit-bg"></div>
    <div class="binary-code"></div>
    
    <!-- 页面头部 -->
    <div class="learn-header">
      <h1>学习计算机</h1>
      <p>探索编程、开发工具、前端、后端、移动开发等技术领域</p>
    </div>
    
    <!-- 侧边导航 -->
    <div class="learn-layout">
      <aside class="learn-sidebar">
        <nav class="category-nav">
          <h2 class="nav-title">学习分类</h2>
          <a href="#" class="category-item active">
            <span class="category-icon">📚</span>
            <span>综合</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">👨‍💻</span>
            <span>后端</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">🎨</span>
            <span>前端</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">📱</span>
            <span>Android</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">🍎</span>
            <span>iOS</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">🤖</span>
            <span>人工智能</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">🔧</span>
            <span>开发工具</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">💼</span>
            <span>程序员人生</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">📖</span>
            <span>阅读</span>
          </a>
          <a href="#" class="category-item">
            <span class="category-icon">🏆</span>
            <span>排行榜</span>
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
        
        <!-- 内容列表 -->
        <div class="article-list">
          <!-- 文章项 -->
          <div class="article-item">
            <div class="article-content">
              <h3 class="article-title">Cursor你要毁了我吗</h3>
              <p class="article-excerpt">最近在使用Cursor进行开发，发现它的AI功能确实很强大，但是有时候也会出现一些奇怪的小问题...</p>
              <div class="article-meta">
                <span class="author">前端小王子</span>
                <span class="views">38k 浏览</span>
                <span class="likes">270 点赞</span>
                <div class="article-tags">
                  <span class="tag">Cursor</span>
                  <span class="tag">AI编程</span>
                  <span class="tag">VSCode</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="article-item">
            <div class="article-content">
              <h3 class="article-title">7000块帮朋友做了2个小程序和一个后台管理系统,值不值?</h3>
              <p class="article-excerpt">朋友找我帮忙开发两个小程序和一个后台管理系统，总共给了7000块。这个价格在市场上算是个什么水平？</p>
              <div class="article-meta">
                <span class="author">小程序开发</span>
                <span class="views">25k 浏览</span>
                <span class="likes">156 点赞</span>
                <div class="article-tags">
                  <span class="tag">小程序开发</span>
                  <span class="tag">后台管理</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="article-item">
            <div class="article-content">
              <h3 class="article-title">小米汽车这薪资是认真的吗？</h3>
              <p class="article-excerpt">看到小米汽车发布的招聘信息，薪资待遇确实很诱人，但是要求也很高。大家觉得这个薪资水平合理吗？</p>
              <div class="article-meta">
                <span class="author">汽车工程师</span>
                <span class="views">18k 浏览</span>
                <span class="likes">89 点赞</span>
                <div class="article-tags">
                  <span class="tag">小米</span>
                  <span class="tag">汽车</span>
                  <span class="tag">前端</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="article-item">
            <div class="article-content">
              <h3 class="article-title">分享10个炸天的油猴脚本2025最新版!</h3>
              <p class="article-excerpt">整理了10个非常实用的油猴脚本，包括网页增强、广告屏蔽、功能扩展等，个个炸天的让你的浏览器更加强大！</p>
              <div class="article-meta">
                <span class="author">脚本达人</span>
                <span class="views">32k 浏览</span>
                <span class="likes">234 点赞</span>
                <div class="article-tags">
                  <span class="tag">油猴脚本</span>
                  <span class="tag">浏览器</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="article-item">
            <div class="article-content">
              <h3 class="article-title">Docker+Kubernetes从入门到精通</h3>
              <p class="article-excerpt">从零开始学习容器化技术，掌握Docker和Kubernetes的核心概念和实践技巧，成为DevOps工程师。</p>
              <div class="article-meta">
                <span class="author">DevOps专家</span>
                <span class="views">56k 浏览</span>
                <span class="likes">432 点赞</span>
                <div class="article-tags">
                  <span class="tag">Docker</span>
                  <span class="tag">Kubernetes</span>
                  <span class="tag">DevOps</span>
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
  --primary-color: #00bcd4;
  --primary-hover: #00acc1;
  --accent-color: #f50057;
  --secondary-color: #4caf50;
  --border-color: #2a3747;
  --bg-color: #121212;
  --dark-bg: #1e1e1e;
  --card-bg: #1e1e1e;
  --text-color: #e0e0e0;
  --text-light: #a0a0a0;
  --text-secondary: #82b1ff;
  --white: #ffffff;
  --shadow: 0 4px 12px rgba(0, 188, 212, 0.15);
}

.learn-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 1;
}

/* 页面头部 */
.learn-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
  background-color: var(--dark-bg);
  border-radius: 12px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
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
  font-size: 36px;
  font-weight: 700;
  color: var(--primary-color);
  text-shadow: 0 0 10px rgba(0, 188, 212, 0.3);
  background: linear-gradient(90deg, var(--primary-color), #4dd0e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.learn-header p {
  margin: 0;
  font-size: 18px;
  color: var(--text-light);
}

/* 布局 */
.learn-layout {
  display: flex;
  gap: 20px;
}

/* 侧边导航 */
.learn-sidebar {
  width: 240px;
  flex-shrink: 0;
}

.category-nav {
  background-color: var(--dark-bg);
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 20px;
  border: 1px solid var(--border-color);
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

/* 文章列表 */
.article-list {
  margin-bottom: 20px;
}

.article-item {
  margin-bottom: 16px;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
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
  padding: 20px;
}

.article-title {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  transition: color 0.3s ease;
  position: relative;
  display: inline-block;
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
  margin: 0 0 16px 0;
  font-size: 14px;
  color: var(--text-light);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
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
  padding: 20px;
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
@media (max-width: 1024px) {
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