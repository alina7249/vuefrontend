<template>
  <div class="login-container">
    <!-- 主登录卡片 -->
    <div class="login-card">
      <!-- 品牌信息 -->
      <div class="brand-section">
        <h1>摄影视界</h1>
        <p>欢迎回到您的摄影社区</p>
      </div>
      
      <!-- 登录表单区域 -->
      <div class="login-form">
        <div class="input-group">
          <label for="username">用户名</label>
          <input 
            id="username"
            type="text" 
            v-model="username" 
            placeholder="请输入用户名/邮箱/手机号"
            class="form-input"
          />
        </div>
        <div class="input-group">
          <label for="password">密码</label>
          <input 
            id="password"
            type="password" 
            v-model="password" 
            placeholder="请输入密码"
            class="form-input"
          />
        </div>
        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" />
            <span>记住我</span>
          </label>
          <a href="#" class="forgot-password">忘记密码？</a>
        </div>
        <button class="login-btn" @click="handleLogin">
          <span class="login-text">登录</span>
          <span class="login-loading" v-if="isLoading">⟳</span>
        </button>
        
        <div class="register-option">
          <span>还没有账号？</span>
          <RouterLink to="/register" class="register-link">立即注册</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'

const router = useRouter()
const username = ref('admin')
const password = ref('123456')
const rememberMe = ref(false)
const isLoading = ref(false)

const handleLogin = () => {
  // 模拟登录加载状态
  isLoading.value = true
  
  // 模拟登录验证延迟
  setTimeout(() => {
    // 模拟登录验证
    if (username.value === 'admin' && password.value === '123456') {
      // 登录成功后设置登录状态
      localStorage.setItem('isLoggedIn', 'true')
      
      // 如果用户选择记住我，则设置过期时间
      if (rememberMe.value) {
        // 设置7天过期时间
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + 7)
        localStorage.setItem('loginExpiry', expiryDate.toISOString())
      }
      
      // 登录成功后跳转到首页
      router.push('/')
    } else {
      // 登录失败动画
      const loginBtn = document.querySelector('.login-btn')
      loginBtn.classList.add('login-error')
      setTimeout(() => {
        loginBtn.classList.remove('login-error')
      }, 1000)
      alert('账号或密码错误，请重试')
    }
    isLoading.value = false
  }, 1500)
}
</script>

<style scoped>
/* 摄影交流网站配色方案 */
:root {
  --primary-color: #3a7bd5;
  --primary-hover: #2968c8;
  --secondary-color: #4facfe;
  --accent-color: #f093fb;
  --dark-bg: #f8f9fa;
  --card-bg: #ffffff;
  --border-color: #e9ecef;
  --text-color: #212529;
  --text-secondary: #6c757d;
  --text-light: #adb5bd;
  --success-color: #28a745;
  --warning-color: #ffc107;
  --error-color: #dc3545;
  --shadow: 0 4px 15px rgba(58, 123, 213, 0.1);
  --glow: 0 0 10px rgba(58, 123, 213, 0.3);
}

/* 基础布局 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--dark-bg);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* 背景装饰元素 */
.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(58, 123, 213, 0.05) 0%, transparent 20%),
    radial-gradient(circle at 80% 30%, rgba(79, 172, 254, 0.05) 0%, transparent 25%),
    radial-gradient(circle at 40% 70%, rgba(240, 147, 251, 0.05) 0%, transparent 15%);
  background-size: 100% 100%;
  z-index: 0;
  pointer-events: none;
}

/* 登录卡片 - 摄影风格设计 */
.login-card {
  width: 400px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: var(--shadow);
  padding: 30px;
  box-sizing: border-box;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

/* 卡片装饰效果 */
.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  z-index: 2;
}

/* 品牌信息区域 */
.brand-section {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.brand-section h1 {
  color: var(--text-color);
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-shadow: 0 0 10px rgba(58, 123, 213, 0.2);
}

.brand-section p {
  color: var(--text-secondary);
  font-size: 16px;
  margin: 0;
}

/* 表单样式 */
.login-form {
  width: 100%;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: var(--primary-color);
  box-shadow: var(--glow);
}

.form-input::placeholder {
  color: var(--text-light);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.remember-me input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--primary-color);
}

.remember-me span {
  color: var(--text-secondary);
  font-size: 14px;
}

.forgot-password {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

/* 登录按钮 - 摄影风格样式 */
.login-btn {
  width: 100%;
  height: 48px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
}

.login-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.login-btn:hover::after {
  left: 100%;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--glow);
}

.login-btn:active {
  transform: translateY(0);
}

.login-error {
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

.login-loading {
  animation: spin 1s linear infinite;
  font-size: 14px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.register-option {
  text-align: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.register-option span {
  color: var(--text-secondary);
  font-size: 14px;
}

.register-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  margin-left: 4px;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
    width: 100%;
    padding: 24px;
  }
  
  .brand-section h1 {
    font-size: 24px;
  }
}
</style>