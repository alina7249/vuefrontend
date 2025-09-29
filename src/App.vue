<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'

const router = useRouter()
const showUserMenu = ref(false)
const isLoggedIn = ref(false)
const currentUser = ref({
  username: 'admin',
  level: 'IV.1',
  exp: 75,
  totalExp: 150,
  following: 1,
  followers: 0,
  likes: 1,
  articles: 2,
  joinDate: '2024-11-21'
})

// 初始化时检查登录状态
const checkLoginStatus = () => {
  const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const expiryDateStr = localStorage.getItem('loginExpiry')
  
  if (loggedIn && expiryDateStr) {
    // 检查是否过期
    const expiryDate = new Date(expiryDateStr)
    const now = new Date()
    if (now > expiryDate) {
      // 已过期，清除登录状态
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('loginExpiry')
      isLoggedIn.value = false
    } else {
      isLoggedIn.value = true
    }
  } else if (loggedIn) {
    isLoggedIn.value = true
  }
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
    <!-- 顶部导航栏 -->
    <header class="main-header" :class="{ 'scrolled': headerScrolled }">
      <div class="header-content">
        <div class="logo-section">
          <RouterLink to="/" class="logo">
            <span class="logo-text">稀土掘金</span>
          </RouterLink>
          
          <nav class="main-nav">
            <RouterLink to="/learn" class="nav-item">首页</RouterLink>
            <RouterLink to="/learn" class="nav-item">学习</RouterLink>
            <a href="#" class="nav-item">沸点</a>
            <a href="#" class="nav-item">课程</a>
            <a href="#" class="nav-item">直播</a>
            <a href="#" class="nav-item">活动</a>
            <a href="#" class="nav-item">AI刷题</a>
            <a href="#" class="nav-item">APP</a>
            <a href="#" class="nav-item">插件</a>
          </nav>
        </div>
        
        <div class="search-section">
          <input type="text" placeholder="搜索掘金上的金" class="search-input" />
        </div>
        
        <div class="user-section">
          <a href="#" class="create-btn">创作者中心</a>
          <a href="#" class="message-btn">消息</a>
          
          <div v-if="isLoggedIn" class="user-profile" @click="toggleUserMenu">
            <div class="avatar">
              <img src="/favicon.ico" alt="用户头像" />
            </div>
            
            <div v-show="showUserMenu" class="user-dropdown">
              <div class="user-info-card">
                <div class="user-info-header">
                  <div class="user-avatar">
                    <img src="/favicon.ico" alt="用户头像" />
                  </div>
                  <div class="user-details">
                    <div class="username">{{ currentUser.username }}</div>
                    <div class="user-level">掘友等级 {{ currentUser.level }}</div>
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
                    <span class="stat-value">{{ currentUser.likes }}</span>
                    <span class="stat-label">收藏</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ currentUser.articles }}</span>
                    <span class="stat-label">文章</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ currentUser.joinDate }}</span>
                    <span class="stat-label">加入</span>
                  </div>
                </div>
              </div>
              
              <div class="menu-divider"></div>
              
              <div class="menu-items">
                <a href="#" class="menu-item" @click="navigateTo('/user')">我的主页</a>
                <a href="#" class="menu-item" @click="navigateTo('/growth')">成长福利</a>
                <a href="#" class="menu-item">内容笔记</a>
                <a href="#" class="menu-item" @click="navigateTo('/member')">会员中心</a>
                <a href="#" class="menu-item">课程中心</a>
                <a href="#" class="menu-item">我的优惠</a>
              <a href="#" class="menu-item">我的报名</a>
              <a href="#" class="menu-item">我的足迹</a>
              
              <div class="menu-divider"></div>
              
              <a href="#" class="menu-item" @click="handleLogout">退出登录</a>
              </div>
            </div>
          </div>
          
          <button v-else class="login-btn" @click="handleLogin">登录</button>
        </div>
      </div>
    </header>
    
    <!-- 主内容区域 -->
    <main class="main-content">
      <RouterView />
    </main>
    
    <!-- 页脚 -->
    <footer class="main-footer">
      <div class="footer-content">
        <div class="footer-links">
          <a href="#">关于我们</a>
          <a href="#">联系我们</a>
          <a href="#">隐私政策</a>
          <a href="#">用户协议</a>
        </div>
        <div class="copyright">© 2024 稀土掘金 All Rights Reserved.</div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
:root {
  --primary-color: #00bcd4;
  --primary-hover: #00acc1;
  --secondary-color: #673ab7;
  --accent-color: #ff5722;
  --dark-bg: #121212;
  --card-bg: #1e1e1e;
  --border-color: #333;
  --text-color: #ffffff;
  --text-secondary: #b0b0b0;
  --text-light: #757575;
  --success-color: #4caf50;
  --warning-color: #ff9800;
  --error-color: #f44336;
  --shadow: 0 4px 15px rgba(0, 188, 212, 0.1);
}
/* 电脑端特定样式优化 */
  @media (min-width: 1200px) {
    .app-container {
      background-size: 90% 90%;
      background-position: center;
    }
  }
  
  @media (min-width: 1400px) {
    .app-container {
      background-size: 80% 80%;
    }
  }
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--dark-bg);
  background-image: 
    radial-gradient(circle at 20% 20%, rgba(0, 188, 212, 0.05) 0%, transparent 20%),
    radial-gradient(circle at 80% 80%, rgba(103, 58, 183, 0.05) 0%, transparent 20%);
  background-size: 100% 100%;
}

/* 顶部导航栏样式 */
.main-header {
  background-color: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--border-color);
   transition: all 0.3s ease; /* 添加过渡效果 */
}
/* 导航栏滚动效果 */
.main-header.scrolled {
  padding: 0;
  background-color: rgba(18, 18, 18, 0.98);
  box-shadow: 0 4px 20px rgba(0, 188, 212, 0.15);
}


.header-content {
    max-width: 1600px;
    margin: 0 auto;
    padding: 0 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
  }

.logo-section {
    display: flex;
    align-items: center;
    gap: 40px;
  }
  
  /* 大屏幕导航优化 */
  @media (min-width: 1400px) {
    .logo-section {
      gap: 60px;
    }
    
    .main-nav {
      gap: 25px;
    }
    
    .nav-item {
      font-size: 15px;
    }
  }

.logo {
  text-decoration: none;
}

.logo-text {
  color: var(--primary-color);
  font-size: 24px;
  font-weight: 700;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.main-nav {
  display: flex;
  gap: 20px;
}

.nav-item {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 0;
  position: relative;
  transition: all 0.3s ease;
}

.nav-item:hover {
  color: var(--primary-color);
  text-shadow: 0 0 8px rgba(0, 188, 212, 0.5);
}

/* 添加导航项下划线效果 */
.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.nav-item:hover::after {
  width: 100%;
}

/* 搜索框样式 */
.search-section {
    flex: 1;
    max-width: 500px;
    margin: 0 60px;
  }
  
  /* 大屏幕搜索框优化 */
  @media (min-width: 1400px) {
    .search-section {
      max-width: 600px;
      margin: 0 80px;
    }
    
    .search-input {
      height: 40px;
      font-size: 15px;
    }
  }

.search-input {
  width: 100%;
  height: 36px;
  padding: 0 16px;
  border: 1px solid var(--border-color);
  border-radius: 18px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  background-color: var(--card-bg);
  color: var(--text-color);
}

.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 15px rgba(0, 188, 212, 0.3);
   transform: translateY(-1px);
}

/* 用户区域样式 */
.user-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 用户头像和下拉菜单样式优化 */
.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  min-width: 280px;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 188, 212, 0.2); /* 增强阴影效果 */
  overflow: hidden;
  border: 1px solid var(--border-color);
  animation: dropdownSlideIn 0.3s ease-out;
  backdrop-filter: blur(10px);
}

/* 主内容区域样式优化 */
  .main-content {
    flex: 1;
    background-color: var(--dark-bg);
    padding: 30px 0;
    position: relative;
    max-width: 1600px;
    margin: 0 auto;
    width: 100%;
  }


.create-btn {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
  padding: 8px 0;
  transition: all 0.3s ease;
}

.message-btn {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  padding: 8px 0;
  transition: all 0.3s ease;
}

.login-btn {
  background-color: var(--primary-color);
  color: var(--text-color);
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.6s ease;
}

.login-btn:hover::before {
  left: 100%;
}

.login-btn:hover {
  background-color: var(--primary-hover);
  box-shadow: 0 0 15px rgba(0, 188, 212, 0.4);
}

/* 用户头像和下拉菜单样式 */
.user-profile {
  position: relative;
  cursor: pointer;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
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
  margin-top: 8px;
  min-width: 280px;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
  border: 1px solid var(--border-color);
  animation: dropdownSlideIn 0.3s ease-out;
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
  padding: 16px;
  background: linear-gradient(135deg, var(--card-bg) 0%, #252525 100%);
}

.user-info-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 4px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.user-level {
  font-size: 12px;
  color: var(--primary-color);
  font-weight: 500;
}

.user-stats {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.stat-item {
  text-align: center;
  position: relative;
  overflow: hidden;
}

.stat-value {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 2px;
  transition: all 0.3s ease;
}

.stat-item:hover .stat-value {
  color: var(--primary-color);
  transform: scale(1.1);
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.menu-divider {
  height: 1px;
  background-color: var(--border-color);
}

.menu-items {
  padding: 8px 0;
}

.menu-item {
  display: block;
  padding: 10px 20px;
  color: var(--text-color);
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.menu-item:hover {
  background-color: rgba(0, 188, 212, 0.1);
  color: var(--primary-color);
}

.menu-item:hover::before {
  transform: scaleY(1);
}

/* 主内容区域样式 */
.main-content {
  flex: 1;
  background-color: var(--dark-bg);
  padding: 20px 0;
  position: relative;
}

/* 页脚样式 */
.main-footer {
  background-color: var(--card-bg);
  padding: 20px 0;
  border-top: 1px solid var(--border-color);
}

.footer-content {
    max-width: 1600px;
    margin: 0 auto;
    padding: 0 30px;
    text-align: center;
  }

.footer-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 12px;
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
}

.footer-links a:hover {
  color: var(--primary-color);
  text-shadow: 0 0 8px rgba(0, 188, 212, 0.5);
}

.copyright {
  color: var(--text-secondary);
  font-size: 12px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 响应式设计 */
  @media (max-width: 1400px) {
    .header-content {
      padding: 0 20px;
    }
    
    .logo-section {
      gap: 40px;
    }
    
    .main-nav {
      gap: 20px;
    }
    
    .search-section {
      max-width: 500px;
      margin: 0 60px;
    }
  }
  
  @media (max-width: 1200px) {
    .header-content {
      padding: 0 16px;
      height: 65px;
    }
    
    .logo-section {
      gap: 30px;
    }
    
    .main-nav {
      gap: 16px;
    }
    
    .search-section {
      max-width: 400px;
      margin: 0 40px;
    }
  }

@media (max-width: 992px) {
  .main-nav {
    display: none;
  }
  
  .search-section {
    max-width: none;
  }
}

@media (max-width: 768px) {
  .search-section {
    display: none;
  }
  
  .user-section {
    gap: 12px;
  }
}
</style>
