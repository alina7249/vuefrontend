<template>
  <div id="app">
    <!-- 导航栏 -->
    <header class="main-header" :class="{ 'scrolled': headerScrolled }">
      <div class="container">
        <nav class="nav">
          <div class="nav-brand">
            <router-link to="/" class="brand-link">
              <span class="brand-icon">📷</span>
              <span class="brand-name">摄影社区</span>
            </router-link>
          </div>
          
          <!-- 桌面导航菜单 -->
          <div class="nav-menu">
            <router-link to="/" class="nav-item">首页</router-link>
            <router-link to="/discover" class="nav-item">发现</router-link>
            <router-link to="/community" class="nav-item">社区</router-link>
            <router-link to="/learn" class="nav-item">学习</router-link>
            <router-link to="/equipment" class="nav-item">器材</router-link>
            <router-link to="/events" class="nav-item">活动</router-link>
          </div>
          
          <!-- 用户菜单 -->
          <div class="nav-user">
            <!-- 未登录状态 -->
            <template v-if="!userStore.isLoggedIn">
              <router-link to="/login" class="nav-item">登录</router-link>
              <router-link to="/register" class="nav-item">注册</router-link>
            </template>
            
            <!-- 登录状态 -->
            <template v-else>
              <button @click="showUserMenu = !showUserMenu" class="user-avatar-button">
                <img 
                  :src="userStore.currentUser.avatar" 
                  alt="用户头像" 
                  class="user-avatar"
                />
                <span class="user-name">{{ userStore.currentUser.username }}</span>
                <span class="dropdown-icon">▼</span>
              </button>
              
              <!-- 用户下拉菜单 -->
              <div v-if="showUserMenu" class="user-dropdown">
                <router-link to="/user/center" class="dropdown-item">个人中心</router-link>
                <router-link to="/user/works" class="dropdown-item">我的作品</router-link>
                <router-link to="/user/favorites" class="dropdown-item">我的收藏</router-link>
                <router-link to="/user/messages" class="dropdown-item">消息通知</router-link>
                <div class="dropdown-divider"></div>
                <button @click="handleLogout" class="dropdown-item logout-item">退出登录</button>
              </div>
            </template>
          </div>
        </nav>
      </div>
    </header>
    
    <!-- 主内容区 -->
    <main class="main-content">
      <RouterView />
    </main>
    
    <!-- 页脚 -->
    <footer class="main-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>摄影社区</h3>
            <p>捕捉精彩瞬间，分享艺术之美</p>
          </div>
          
          <div class="footer-section">
            <h4>快速链接</h4>
            <ul>
              <li><router-link to="/">首页</router-link></li>
              <li><router-link to="/discover">发现</router-link></li>
              <li><router-link to="/community">社区</router-link></li>
              <li><router-link to="/learn">学习</router-link></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>支持</h4>
            <ul>
              <li><a href="#">帮助中心</a></li>
              <li><a href="#">联系我们</a></li>
              <li><a href="#">隐私政策</a></li>
              <li><a href="#">服务条款</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>关注我们</h4>
            <div class="social-links">
              <a href="#" class="social-link">微博</a>
              <a href="#" class="social-link">微信</a>
              <a href="#" class="social-link">抖音</a>
              <a href="#" class="social-link">小红书</a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2024 摄影社区. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterView, useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from './stores/user.js'

const router = useRouter()
const userStore = useUserStore()
const showUserMenu = ref(false)
const headerScrolled = ref(false)

// 初始化时检查登录状态
onMounted(() => {
  checkLoginStatus()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 检查登录状态
const checkLoginStatus = () => {
  userStore.checkLoginStatus()
}

// 处理登出
const handleLogout = () => {
  userStore.logout()
  showUserMenu.value = false
  router.push('/login')
}

// 处理滚动事件
const handleScroll = () => {
  if (window.scrollY > 50) {
    headerScrolled.value = true
  } else {
    headerScrolled.value = false
  }
  
  // 点击页面其他地方关闭用户菜单
  if (showUserMenu.value) {
    showUserMenu.value = false
  }
}
</script>

<style scoped>
.main-header {
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-light);
}

.main-header.scrolled {
  box-shadow: var(--shadow-medium);
  padding: var(--spacing-xs) 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) 0;
}

.nav-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  color: var(--dark-color);
  text-decoration: none;
}

.brand-icon {
  font-size: 1.5rem;
  margin-right: var(--spacing-sm);
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 600;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.nav-item {
  color: var(--dark-gray);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-normal);
  position: relative;
}

.nav-item:hover {
  color: var(--primary-color);
}

.nav-item.router-link-active {
  color: var(--primary-color);
}

.nav-item.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--primary-color);
}

.nav-user {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.user-avatar-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-normal);
}

.user-avatar-button:hover {
  background-color: var(--light-gray);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: var(--spacing-xs);
}

.user-name {
  font-size: 0.875rem;
  color: var(--dark-color);
  margin-right: var(--spacing-xs);
}

.dropdown-icon {
  font-size: 0.75rem;
  color: var(--medium-gray);
  transition: transform var(--transition-normal);
}

.user-avatar-button:hover .dropdown-icon {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--spacing-xs);
  background-color: white;
  border: 1px solid var(--light-gray);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-medium);
  min-width: 160px;
  z-index: 1001;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
  background: none;
  border: none;
  color: var(--dark-color);
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color var(--transition-normal);
  text-decoration: none;
}

.dropdown-item:hover {
  background-color: var(--light-gray);
  color: var(--dark-color);
}

.dropdown-divider {
  height: 1px;
  background-color: var(--light-gray);
  margin: var(--spacing-xs) 0;
}

.logout-item {
  color: var(--danger-color);
}

.logout-item:hover {
  background-color: var(--light-gray);
  color: var(--danger-color);
}

.main-content {
  flex: 1;
  margin-top: 72px; /* 导航栏高度 */
  padding: var(--spacing-lg) 0;
}

.main-footer {
  background-color: white;
  border-top: 1px solid var(--light-gray);
  padding: var(--spacing-xl) 0;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.footer-section h3 {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-md);
  color: var(--dark-color);
}

.footer-section h4 {
  font-size: 1rem;
  margin-bottom: var(--spacing-md);
  color: var(--dark-color);
}

.footer-section p {
  color: var(--medium-gray);
  font-size: 0.875rem;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section li {
  margin-bottom: var(--spacing-sm);
}

.footer-section a {
  color: var(--medium-gray);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color var(--transition-normal);
}

.footer-section a:hover {
  color: var(--primary-color);
}

.social-links {
  display: flex;
  gap: var(--spacing-md);
}

.social-link {
  color: var(--medium-gray);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color var(--transition-normal);
}

.social-link:hover {
  color: var(--primary-color);
}

.footer-bottom {
  text-align: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--light-gray);
}

.footer-bottom p {
  color: var(--medium-gray);
  font-size: 0.875rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
}
</style>
