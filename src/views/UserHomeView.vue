<template>
  <div class="user-home">
    <!-- 用户信息展示 -->
    <div class="user-info">
      <div class="avatar">
        <img src="/favicon.ico" alt="用户头像" />
      </div>
      <div class="user-details">
        <div class="username-row">
          <h1>摄影爱好者</h1>
          <div class="action-buttons">
            <button class="edit-btn">编辑资料</button>
            <button class="upload-btn">上传作品</button>
          </div>
        </div>
        <p>摄影师等级 LV.3</p>
        <div class="level-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 75%;"></div>
          </div>
          <span class="exp-text">150/200</span>
        </div>
      </div>
    </div>

    <!-- 用户统计数据 -->
    <div class="user-stats">
      <div class="stat-item">
        <span class="stat-value">12</span>
        <span class="stat-label">关注</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">28</span>
        <span class="stat-label">粉丝</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">56</span>
        <span class="stat-label">收藏</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">24</span>
        <span class="stat-label">作品</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">2024-11-21</span>
        <span class="stat-label">加入</span>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-access">
      <div class="access-item">
        <div class="access-icon">📷</div>
        <span>上传作品</span>
      </div>
      <div class="access-item">
        <div class="access-icon">🖼️</div>
        <span>我的作品集</span>
      </div>
      <div class="access-item">
        <div class="access-icon">❤️</div>
        <span>我的收藏</span>
      </div>
    </div>

    <!-- 侧边导航 -->
    <div class="user-center-layout">
      <aside class="side-nav">
        <nav>
          <a href="#" class="nav-link active">我的主页</a>
          <a href="#" class="nav-link">我的作品集</a>
          <a href="#" class="nav-link">我的收藏</a>
          <a href="#" class="nav-link">我的喜欢</a>
          <a href="#" class="nav-link">关注动态</a>
          <a href="#" class="nav-link">消息通知</a>
          <a href="#" class="nav-link">个人设置</a>
        </nav>
      </aside>
      
      <main class="content-area">
        <!-- 内容区域 -->
        <div class="welcome-message">
          <h2>欢迎回来，摄影爱好者！</h2>
          <p>这是您的个人主页，展示您的摄影作品和活动动态。</p>
        </div>
        
        <!-- 最近作品预览 -->
        <div class="recent-photos">
          <h3>最近作品</h3>
          <div class="photos-grid">
            <div class="photo-item" style="background: url('https://picsum.photos/id/1015/400/300') center/cover no-repeat;"></div>
            <div class="photo-item" style="background: url('https://picsum.photos/id/1016/400/300') center/cover no-repeat;"></div>
            <div class="photo-item" style="background: url('https://picsum.photos/id/1018/400/300') center/cover no-repeat;"></div>
            <div class="photo-item" style="background: url('https://picsum.photos/id/1019/400/300') center/cover no-repeat;"></div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
// 后续可以添加交互逻辑
</script>

<style scoped>
:root {
  --primary-color: #165DFF;
  --primary-hover: #0E42D2;
  --secondary-color: #36CFFB;
  --accent-color: #FFB627;
  --dark-bg: #0A0A0A;
  --card-bg: #1A1A1A;
  --border-color: #2D2D2D;
  --text-color: #ffffff;
  --text-secondary: #b0b0b0;
  --text-light: #757575;
  --success-color: #00B42A;
  --warning-color: #FF7D00;
  --error-color: #F53F3F;
  --shadow: 0 4px 15px rgba(22, 93, 255, 0.1);
  --glow: 0 0 10px rgba(22, 93, 255, 0.3);
}

.user-home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--dark-bg);
  min-height: calc(100vh - 120px);
  position: relative;
  overflow: hidden;
}

/* 背景装饰元素 */
.user-home::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(22, 93, 255, 0.05) 0%, transparent 20%),
    radial-gradient(circle at 80% 30%, rgba(54, 207, 251, 0.05) 0%, transparent 25%),
    radial-gradient(circle at 40% 70%, rgba(255, 182, 39, 0.05) 0%, transparent 15%);
  background-size: 100% 100%;
  z-index: 0;
  pointer-events: none;
}

/* 用户信息样式 */
.user-info {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, var(--card-bg) 0%, #252525 100%);
  padding: 20px;
  border-radius: 12px;
  box-shadow: var(--shadow);
  margin-bottom: 20px;
  border: 1px solid var(--border-color);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;
  background-color: var(--card-bg);
  border: 3px solid var(--primary-color);
  box-shadow: 0 0 20px rgba(22, 93, 255, 0.3);
  position: relative;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(22, 93, 255, 0.2) 0%, transparent 70%);
  animation: pulse 3s infinite;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
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
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-shadow: 0 0 10px rgba(22, 93, 255, 0.2);
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.edit-btn, .upload-btn {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  background-color: var(--card-bg);
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-secondary);
}

.edit-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background-color: rgba(58, 123, 213, 0.1);
}

.upload-btn {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.upload-btn:hover {
  background-color: var(--primary-hover);
  border-color: var(--primary-hover);
  color: white;
}

.user-details p {
  margin: 0 0 8px 0;
  color: var(--text-secondary);
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
  background-color: var(--dark-bg);
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  border-radius: 3px;
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.exp-text {
  font-size: 12px;
  color: var(--text-secondary);
}

/* 用户统计数据样式 */
.user-stats {
  display: flex;
  justify-content: space-around;
  background-color: var(--card-bg);
  padding: 20px;
  border-radius: 12px;
  box-shadow: var(--shadow);
  margin-bottom: 20px;
  border: 1px solid var(--border-color);
  position: relative;
  z-index: 1;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 4px;
  text-shadow: 0 0 5px rgba(22, 93, 255, 0.3);
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
}

/* 快捷入口样式 */
.quick-access {
  display: flex;
  gap: 20px;
  background-color: var(--card-bg);
  padding: 20px;
  border-radius: 12px;
  box-shadow: var(--shadow);
  margin-bottom: 20px;
  border: 1px solid var(--border-color);
  position: relative;
  z-index: 1;
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
  background-color: var(--dark-bg);
  position: relative;
  overflow: hidden;
}

.access-item:hover {
  box-shadow: var(--glow);
  border-color: var(--primary-color);
  transform: translateY(-5px);
}

.access-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.access-item:hover::after {
  transform: scaleX(1);
}

.access-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.access-item span {
  font-size: 14px;
  color: var(--text-color);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 布局样式 */
.user-center-layout {
  display: flex;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.side-nav {
  width: 200px;
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow);
  padding: 20px 0;
  border: 1px solid var(--border-color);
  position: sticky;
  top: 20px;
  height: fit-content;
}

.side-nav nav {
  display: flex;
  flex-direction: column;
}

.nav-link {
  padding: 12px 20px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.nav-link:hover {
  background-color: rgba(58, 123, 213, 0.1);
  color: var(--primary-color);
}

.nav-link.active {
  background-color: rgba(58, 123, 213, 0.2);
  color: var(--primary-color);
  font-weight: 500;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(22, 93, 255, 0.1), transparent);
  transition: left 0.5s ease;
  z-index: -1;
}

.nav-link:hover::before {
  left: 100%;
}

.content-area {
  flex: 1;
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow);
  padding: 20px;
  min-height: 400px;
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.welcome-message {
  text-align: center;
  padding: 60px 20px;
}

.welcome-message h2 {
  margin: 0 0 12px 0;
  font-size: 24px;
  color: var(--text-color);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-shadow: 0 0 10px rgba(22, 93, 255, 0.2);
}

.welcome-message p {
  margin: 0;
  font-size: 16px;
  color: var(--text-secondary);
}

/* 添加摄影风格装饰 */
.content-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
}

/* 最近作品预览样式 */
.recent-photos {
  margin-top: 30px;
}

.recent-photos h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: var(--text-color);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  border-left: 4px solid var(--primary-color);
  padding-left: 12px;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.photo-item {
  width: 100%;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
  border: 2px solid var(--border-color);
}

.photo-item:hover {
  transform: scale(1.03);
  box-shadow: var(--glow);
  border-color: var(--primary-color);
}

.photo-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  transition: height 0.3s ease;
}

.photo-item:hover::after {
  height: 100%;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .user-center-layout {
    flex-direction: column;
  }
  
  .side-nav {
    width: 100%;
    position: static;
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
  
  .photos-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
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
    width: 80px;
    height: 80px;
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
  
  .user-home {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .stat-item {
    flex: 1 1 100%;
  }
  
  .user-details h1 {
    font-size: 20px;
  }
  
  .welcome-message h2 {
    font-size: 20px;
  }
  
  .welcome-message p {
    font-size: 14px;
  }
  
  .access-icon {
    font-size: 28px;
  }
}
</style>