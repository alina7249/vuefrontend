<script setup>
import { RouterView, useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'

const router = useRouter()
const showUserMenu = ref(false)
const isLoggedIn = ref(false)
const currentUser = ref({
  username: 'admin',
  avatar: 'https://picsum.photos/id/64/40/40',
  following: 128,
  followers: 86,
  likes: 356,
  photos: 23,
  joinDate: '2024'
})

// 初始化时检查登录状态
const checkLoginStatus = () => {
  const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
  isLoggedIn.value = loggedIn
}

// 组件初始化时检查登录状态
checkLoginStatus()

// 处理登出
const handleLogout = () => {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('loginExpiry')
  isLoggedIn.value = false
  router.push('/login')
}

const headerScrolled = ref(false)

// 添加滚动监听事件
const handleScroll = () => {
  if (window.scrollY > 50) {
    headerScrolled.value = true
  } else {
    headerScrolled.value = false
  }
}

// 组件挂载时添加监听
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

// 组件卸载时移除监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const navigateTo = (path) => {
  router.push(path)
  showUserMenu.value = false
}

const handleLogin = () => {
  // 登录逻辑
  router.push('/login')
}
</script>

<template>
  <div class="app-container">
    <!-- 顶部导航栏 - 经典器材蓝灰调 -->
    <header class="main-header" :class="{ 'scrolled': headerScrolled }">
      <div class="header-content">
        <!-- 品牌区域 -->
        <div class="logo-section">
          <a href="#" class="logo" @click="navigateTo('/')">
            <div class="logo-icon">📷</div>
            <div class="brand-text">
              <span class="brand-name">LENSFLOW</span>
              <span class="brand-tag">高级摄影社区</span>
            </div>
          </a>
          
          <!-- 导航菜单 -->
          <nav class="main-nav">
            <a href="#" class="nav-item active" @click="navigateTo('/')">首页</a>
            <a href="#" class="nav-item" @click="navigateTo('/discover')">发现作品</a>
            <a href="#" class="nav-item" @click="navigateTo('/community')">社区动态</a>
            <a href="#" class="nav-item" @click="navigateTo('/learn')">学习</a>
            <a href="#" class="nav-item" @click="navigateTo('/equipment')">器材</a>
          </nav>
        </div>
        
        <!-- 搜索框 -->
        <div class="search-section">
          <input type="text" placeholder="搜索作品、用户、话题..." class="search-input" />
          <i class="search-icon">🔍</i>
        </div>
        
        <!-- 用户区域 -->
        <div class="user-section">
          <button v-if="isLoggedIn" class="create-btn" @click="navigateTo('/upload')">上传作品</button>
          
          <div v-if="isLoggedIn" class="user-profile" @click="toggleUserMenu">
            <div class="avatar">
              <img :src="currentUser.avatar" alt="用户头像" />
            </div>
            
            <div v-show="showUserMenu" class="user-dropdown">
              <div class="user-info-card">
                <div class="user-info-header">
                  <div class="user-avatar">
                    <img :src="currentUser.avatar" alt="用户头像" />
                  </div>
                  <div class="user-details">
                    <div class="username">{{ currentUser.username }}</div>
                    <div class="user-level">专业摄影师</div>
                  </div>
                </div>
                
                <div class="user-stats">
                  <div class="stat-item">
                    <span class="stat-value">{{ currentUser.following }}</span>
                    <span class="stat-label">关注</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ currentUser.followers }}</span>
                    <span class="stat-label">粉丝</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ currentUser.photos }}</span>
                    <span class="stat-label">作品</span>
                  </div>
                </div>
              </div>
              
              <div class="menu-divider"></div>
              
              <div class="menu-items">
                <a href="#" class="menu-item" @click="navigateTo('/user-center')">个人中心</a>
                <a href="#" class="menu-item" @click="navigateTo('/upload')">上传作品</a>
                <a href="#" class="menu-item" @click="navigateTo('/collections')">我的收藏</a>
                <a href="#" class="menu-item" @click="navigateTo('/settings')">个人设置</a>
                
                <div class="menu-divider"></div>
                
                <a href="#" class="menu-item logout" @click="handleLogout">退出登录</a>
              </div>
            </div>
          </div>
          
          <div v-else class="auth-buttons">
            <button class="login-btn" @click="navigateTo('/login')">登录</button>
            <button class="register-btn" @click="navigateTo('/register')">注册</button>
          </div>
        </div>
      </div>
    </header>
    
    <!-- 主内容区域 -->
    <main class="main-content">
      <RouterView />
    </main>
    
    <!-- 页脚 - 经典器材蓝灰调 -->
    <footer class="main-footer">
      <div class="footer-content">
        <!-- 品牌标志 -->
        <div class="footer-brand">
          <div class="logo-icon">📷</div>
          <div class="brand-text">
            <span class="brand-name">LENSFLOW</span>
            <span class="brand-tag">高级摄影社区</span>
          </div>
        </div>
        
        <!-- 导航链接 -->
        <div class="footer-links">
          <a href="#" @click="navigateTo('/')">首页</a>
          <a href="#" @click="navigateTo('/discover')">发现作品</a>
          <a href="#" @click="navigateTo('/community')">社区动态</a>
          <a href="#" @click="navigateTo('/learn')">学习</a>
          <a href="#" @click="navigateTo('/equipment')">器材</a>
          <a href="#" @click="navigateTo('/about')">关于我们</a>
        </div>
        
        <!-- 社交媒体链接 -->
        <div class="social-links">
          <a href="#" class="social-icon" title="Instagram">📸</a>
          <a href="#" class="social-icon" title="Facebook">📱</a>
          <a href="#" class="social-icon" title="Twitter">🐦</a>
          <a href="#" class="social-icon" title="WeChat">💬</a>
        </div>
        
        <!-- 版权信息 -->
        <div class="copyright">© 2024 LENSFLOW 高级摄影交流社区 All Rights Reserved.</div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* 确保根元素背景透明，不遮挡星空背景 */
#app {
  background: transparent !important;
  position: relative;
  z-index: 1;
}

/* 应用容器 */
.app-container {
  min-height: 100vh;
  background: transparent !important;
  display: flex;
  flex-direction: column;
}

/* 导航栏样式 - 经典器材蓝灰调 */
.main-header {
  background: var(--background-color);
  border-bottom: 1px solid var(--primary-dark);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 72px;
  transition: all 0.3s ease;
}

.main-header.scrolled {
  height: 64px;
  box-shadow: var(--shadow-medium);
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(var(--glass-blur));
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
}

/* 品牌区域样式 */
.logo-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  text-decoration: none;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  box-shadow: var(--shadow-light);
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: var(--font-sans);
  letter-spacing: 1px;
}

.brand-tag {
  font-size: 12px;
  color: var(--accent-color);
  font-weight: 400;
}

/* 导航菜单样式 */
.main-nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.nav-item {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: 400;
  padding: var(--spacing-xs) 0;
  position: relative;
  transition: all 0.3s ease;
}

.nav-item:hover {
  color: var(--primary-color);
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.nav-item:hover::after {
  width: 100%;
}

.nav-item.active {
  color: var(--primary-color);
}

.nav-item.active::after {
  width: 100%;
}

/* 搜索框样式 - 器材风格 */
.search-section {
  flex: 1;
  max-width: 400px;
  position: relative;
}

.search-input {
  width: 100%;
  height: 36px;
  padding: 0 var(--spacing-xl) 0 var(--spacing-md);
  background: var(--surface-color);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: var(--text-sm);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(42, 92, 140, 0.1);
}

.search-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.7;
}

.search-icon {
  position: absolute;
  right: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

/* 用户区域样式 */
.user-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.create-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.create-btn:hover {
  box-shadow: 0 0 15px rgba(42, 92, 140, 0.3);
  transform: translateY(-1px);
}

.create-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: all 0.6s ease;
}

.create-btn:hover::before {
  left: 100%;
}

/* 登录/注册按钮 */
.auth-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.login-btn,
.register-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
}

.login-btn {
  background: transparent;
  color: var(--text-secondary);
}

.login-btn:hover {
  background: var(--surface-color);
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.register-btn {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.register-btn:hover {
  background: var(--primary-light);
  box-shadow: var(--shadow-medium);
}

/* 用户头像和下拉菜单 - 器材风格 */
.user-profile {
  position: relative;
  cursor: pointer;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--border-light);
  transition: all 0.3s ease;
  background: var(--surface-color);
}

.user-profile:hover .avatar {
  border-color: var(--primary-color);
  box-shadow: 0 0 10px rgba(42, 92, 140, 0.3);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--spacing-sm);
  min-width: 240px;
  background: var(--surface-color);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-medium);
  overflow: hidden;
  border: 1px solid var(--border-light);
  animation: dropdownSlideIn 0.3s ease-out;
  z-index: 1000;
}

@keyframes dropdownSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-info-card {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-light);
  background: linear-gradient(145deg, var(--surface-color), #2a2a2d);
}

.user-info-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--primary-color);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details .username {
  font-weight: 600;
  font-size: var(--text-base);
  color: var(--text-primary);
}

.user-details .user-level {
  font-size: var(--text-xs);
  color: var(--accent-color);
}

.user-stats {
  display: flex;
  justify-content: space-between;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
}

.stat-label {
  display: block;
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.menu-divider {
  height: 1px;
  background-color: var(--border-light);
}

.menu-items {
  padding: var(--spacing-sm) 0;
}

.menu-item {
  display: block;
  padding: var(--spacing-sm) var(--spacing-lg);
  color: var(--darker-gray);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: var(--background-color);
  color: var(--primary-color);
}

.menu-item.logout {
  color: #ff4d4f;
}

.menu-item.logout:hover {
  background-color: rgba(255, 77, 79, 0.1);
}

/* 主内容区域样式 */
.main-content {
  flex: 1;
  padding-top: 72px;
  padding-bottom: var(--spacing-xxl);
  background: rgba(240, 242, 245, 0.3);
  position: relative;
  backdrop-filter: blur(5px);
  z-index: 1;
}

/* 页脚样式 - 经典器材蓝灰调 */
.main-footer {
  background: var(--surface-color);
  border-top: 1px solid var(--primary-dark);
  padding: var(--spacing-xl) 0;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xl);
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.footer-links {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
  justify-content: center;
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: var(--primary-color);
}

.social-links {
  display: flex;
  gap: var(--spacing-md);
}

.social-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-color);
  border: 1px solid var(--border-light);
  border-radius: 50%;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 16px;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
  border-color: var(--primary-color);
}

.copyright {
  color: var(--text-secondary);
  font-size: var(--text-xs);
  text-align: center;
  opacity: 0.6;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .header-content {
    padding: 0 var(--spacing-lg);
  }
  
  .logo-section {
    gap: var(--spacing-lg);
  }
  
  .main-nav {
    gap: var(--spacing-md);
  }
  
  .search-section {
    max-width: 300px;
  }
}

@media (max-width: 1024px) {
  .main-nav {
    display: none;
  }
  
  .search-section {
    max-width: 250px;
  }
}

@media (max-width: 768px) {
  .search-section {
    display: none;
  }
  
  .header-content {
    padding: 0 var(--spacing-md);
  }
  
  .footer-links {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
  }
}
</style>
