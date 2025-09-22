<template>
  <div class="user-home">
    <!-- 用户信息展示 -->
    <div class="user-info">
      <div class="avatar">
        <img src="/favicon.ico" alt="用户头像" />
      </div>
      <div class="user-details">
        <div class="username-row">
          <h1>admin</h1>
          <div class="action-buttons">
            <button class="edit-btn">编辑</button>
            <button class="settings-btn">设置</button>
          </div>
        </div>
        <p>掘友等级 IV.1</p>
        <div class="level-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 50%;"></div>
          </div>
          <span class="exp-text">75/150</span>
        </div>
      </div>
    </div>

    <!-- 用户统计数据 -->
    <div class="user-stats">
      <div class="stat-item">
        <span class="stat-value">1</span>
        <span class="stat-label">关注</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">0</span>
        <span class="stat-label">粉丝</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">1</span>
        <span class="stat-label">收藏</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">2</span>
        <span class="stat-label">文章</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">2024-11-21</span>
        <span class="stat-label">加入</span>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-access">
      <div class="access-item">
        <div class="access-icon">💻</div>
        <span>课程中心</span>
      </div>
      <div class="access-item">
        <div class="access-icon">🎁</div>
        <span>我的优惠</span>
      </div>
      <div class="access-item">
        <div class="access-icon">📝</div>
        <span>我的报名</span>
      </div>
    </div>

    <!-- 侧边导航 -->
    <div class="user-center-layout">
      <aside class="side-nav">
        <nav>
          <a href="#" class="nav-link active">我的主页</a>
          <a href="/growth" class="nav-link">成长福利</a>
          <a href="#" class="nav-link">内容笔记</a>
          <a href="/member" class="nav-link">会员中心</a>
          <a href="#" class="nav-link">课程中心</a>
          <a href="#" class="nav-link">我的优惠</a>
          <a href="#" class="nav-link">我的报名</a>
          <a href="#" class="nav-link">我的足迹</a>
        </nav>
      </aside>
      
      <main class="content-area">
        <!-- 内容区域 -->
        <div class="welcome-message">
          <h2>欢迎回来，admin！</h2>
          <p>这是您的个人主页，可以查看和管理您的所有信息。</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
:root {
  --primary-color: #3e7bf2;
  --primary-hover: #2a5bda;
  --border-color: #e0e0e0;
  --bg-color: #f5f6f8;
  --text-color: #333;
  --text-light: #666;
  --white: #ffffff;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 用户信息样式 */
.user-info {
  display: flex;
  align-items: center;
  background-color: var(--white);
  padding: 20px;
  border-radius: 8px;
  box-shadow: var(--shadow);
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;
  background-color: #f0f0f0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  flex: 1;
}

.username-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.user-details h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.edit-btn, .settings-btn {
  padding: 6px 16px;
  border: 1px solid var(--border-color);
  background-color: var(--white);
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn:hover, .settings-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.user-details p {
  margin: 0 0 8px 0;
  color: var(--text-light);
  font-size: 14px;
}

.level-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 3px;
}

.exp-text {
  font-size: 12px;
  color: var(--text-light);
}

/* 用户统计数据样式 */
.user-stats {
  display: flex;
  justify-content: space-around;
  background-color: var(--white);
  padding: 20px;
  border-radius: 8px;
  box-shadow: var(--shadow);
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-light);
}

/* 快捷入口样式 */
.quick-access {
  display: flex;
  gap: 20px;
  background-color: var(--white);
  padding: 20px;
  border-radius: 8px;
  box-shadow: var(--shadow);
  margin-bottom: 20px;
}

.access-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.access-item:hover {
  box-shadow: var(--shadow);
  border-color: var(--primary-color);
}

.access-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.access-item span {
  font-size: 14px;
  color: var(--text-color);
}

/* 布局样式 */
.user-center-layout {
  display: flex;
  gap: 20px;
}

.side-nav {
  width: 200px;
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 20px 0;
}

.side-nav nav {
  display: flex;
  flex-direction: column;
}

.nav-link {
  padding: 12px 20px;
  color: var(--text-color);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: var(--bg-color);
  color: var(--primary-color);
}

.nav-link.active {
  background-color: #e6f0ff;
  color: var(--primary-color);
  font-weight: 500;
}

.content-area {
  flex: 1;
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 20px;
  min-height: 400px;
}

.welcome-message {
  text-align: center;
  padding: 60px 20px;
}

.welcome-message h2 {
  margin: 0 0 12px 0;
  font-size: 24px;
  color: var(--text-color);
}

.welcome-message p {
  margin: 0;
  font-size: 16px;
  color: var(--text-light);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .user-center-layout {
    flex-direction: column;
  }
  
  .side-nav {
    width: 100%;
  }
  
  .side-nav nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .nav-link {
    flex: 1;
    min-width: 120px;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .user-info {
    flex-direction: column;
    text-align: center;
  }
  
  .avatar {
    margin-right: 0;
    margin-bottom: 16px;
  }
  
  .username-row {
    flex-direction: column;
    gap: 12px;
  }
  
  .user-stats {
    flex-wrap: wrap;
  }
  
  .stat-item {
    flex: 1 1 40%;
    margin-bottom: 12px;
  }
  
  .quick-access {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .stat-item {
    flex: 1 1 100%;
  }
}
</style>