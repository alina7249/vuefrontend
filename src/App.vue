<template>
  <div class="app-container">
    <!-- 应用导航栏 -->
    <nav class="app-navbar">
      <div class="navbar-brand">
        <h1>摄影交流平台</h1>
      </div>
      <div class="navbar-links">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/community" class="nav-link">社区</router-link>
        <router-link to="/tutorials" class="nav-link">教程</router-link>
        <router-link to="/equipment" class="nav-link">器材</router-link>
        <router-link to="/activities" class="nav-link">活动</router-link>
      </div>
      <div class="navbar-user">
          <template v-if="isLoggedIn">
            <router-link to="/upload" class="nav-link upload-btn">上传作品</router-link>
            <router-link to="/user" class="nav-link user-avatar" title="查看个人主页">
              <div class="avatar">{{ username.substring(0, 2) }}</div>
            </router-link>
          </template>
          <template v-else>
            <router-link to="/login" class="nav-link login-btn">登录</router-link>
          </template>
        </div>
    </nav>

    <!-- 主内容区域 -->
    <main class="app-main">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-links">
          <a href="#about" class="footer-link">关于我们</a>
          <a href="#contact" class="footer-link">联系我们</a>
          <a href="#terms" class="footer-link">服务条款</a>
          <a href="#privacy" class="footer-link">隐私政策</a>
        </div>
        <div class="footer-copyright">
          © 2024 摄影交流平台. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

// 计算属性，获取登录状态和用户名
const isLoggedIn = computed(() => userStore.isLoggedIn);
const username = computed(() => userStore.username || 'Guest');

// 组件挂载时检查登录状态
onMounted(() => {
  userStore.checkLoginStatus();
});
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #F8F9FA;
  color: #212529;
}

/* 应用容器 */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 导航栏样式 */
.app-navbar {
  background-color: #2D3A4B; /* 深灰蓝 */
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-brand h1 {
  font-size: 24px;
  color: #FFFFFF; /* 白字 */
  font-weight: 700;
}

.navbar-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  text-decoration: none;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #FFFFFF;
  background-color: #3A4A5F; /* hover 微亮 */
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 16px;
}

.upload-btn {
  background-color: #E8B04C; /* 暖金强调色 */
  color: #2D3A4B !important;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 700;
}

.upload-btn:hover {
  background-color: #f0c066;
  color: #2D3A4B !important;
}

.login-btn {
  background-color: transparent;
  border: 1px solid rgba(255,255,255,0.24);
  color: #FFFFFF;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 600;
}

.login-btn:hover {
  background-color: #3A4A5F;
  color: #FFFFFF !important;
}

.user-avatar {
  width: 40px;
  height: 40px;
}

.avatar {
  width: 100%;
  height: 100%;
  background-color: #4A90E2; /* 主色 */
  color: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

/* 主内容区域 */
.app-main {
  flex: 1;
  padding: 24px;
}

/* 页脚样式 */
.app-footer {
  background-color: #FFFFFF;
  border-top: 1px solid #EAEFF5;
  padding: 24px;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-link {
  color: #555;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #4A90E2;
}

.footer-copyright {
  color: #ADB5BD;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-navbar {
    padding: 0 16px;
  }
  
  .navbar-brand h1 {
    font-size: 20px;
  }
  
  .navbar-links {
    display: none;
  }
  
  .app-main {
    padding: 16px;
  }
  
  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>