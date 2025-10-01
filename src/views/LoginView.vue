<template>
  <div class="login-container">
    <!-- 背景图片 -->
    <div class="login-bg">
      <img src="https://picsum.photos/id/1015/1920/1080" alt="摄影背景" />
      <div class="overlay"></div>
    </div>
    
    <!-- 主登录卡片 -->
    <div class="login-card">
      <!-- 左侧品牌信息 -->
      <div class="brand-section">
        <div class="logo-container">
          <div class="logo-icon">📷</div>
          <h1>摄影视界</h1>
        </div>
        <p class="brand-slogan">捕捉精彩瞬间，分享艺术之美</p>
        
        <!-- 特色展示 -->
        <div class="features">
          <div class="feature-item">
            <div class="feature-icon">🌟</div>
            <span>高质量摄影作品</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">👥</div>
            <span>专业摄影师社区</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎓</div>
            <span>摄影技巧分享</span>
          </div>
        </div>
      </div>
      
      <!-- 右侧登录表单区域 -->
      <div class="login-form-container">
        <div class="form-header">
          <h2>欢迎回来</h2>
          <p>登录您的账号，继续摄影之旅</p>
        </div>
        
        <form class="login-form">
          <div class="input-group">
            <div class="input-icon">👤</div>
            <input 
              id="username" 
              type="text" 
              v-model="username" 
              placeholder="用户名/邮箱/手机号"
              class="form-input"
              @focus="onInputFocus($event)"
              @blur="onInputBlur($event)"
            />
          </div>
          <div class="input-group">
            <div class="input-icon">🔒</div>
            <input 
              id="password" 
              type="password" 
              v-model="password" 
              placeholder="密码"
              class="form-input"
              @focus="onInputFocus($event)"
              @blur="onInputBlur($event)"
            />
          </div>
          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe" />
              <span>记住我</span>
            </label>
            <a href="#" class="forgot-password">忘记密码？</a>
          </div>
          <button type="button" class="login-btn" @click="handleLogin" :disabled="isLoading">
            <span class="login-text" v-if="!isLoading">登录</span>
            <span class="login-loading" v-else>⟳</span>
          </button>
          
          <!-- 分隔线 -->
          <div class="divider">
            <span>或</span>
          </div>
          
          <!-- 第三方登录 -->
          <div class="social-login">
            <button type="button" class="social-btn google">
              <span class="social-icon">G</span>
              <span>Google 登录</span>
            </button>
            <button type="button" class="social-btn wechat">
              <span class="social-icon">微信</span>
              <span>微信登录</span>
            </button>
          </div>
          
          <div class="register-option">
            <span>还没有账号？</span>
            <RouterLink to="/register" class="register-link">立即注册</RouterLink>
          </div>
        </form>
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

// 处理输入框聚焦效果
const onInputFocus = (event) => {
  event.target.parentElement.classList.add('focused')
}

// 处理输入框失焦效果
const onInputBlur = (event) => {
  if (!event.target.value) {
    event.target.parentElement.classList.remove('focused')
  }
}

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

// 第三方登录按钮直接使用alert提示，无需单独函数
</script>

<style scoped>
/* 摄影主题配色方案优化 */
:root {
  --primary-color: #00bcd4;
  --secondary-color: #ff9800;
  --accent-color: #ff5722;
  --text-primary: #333;
  --text-secondary: #666;
  --bg-color: #f8f9fa;
  --dark-bg: #121212;
  --card-bg: #fff;
  --border-color: #e0e0e0;
  --border-radius: 16px;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 6px 16px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.18);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 主容器布局 */
.login-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--dark-bg);
  padding: 20px;
  overflow: hidden;
}

/* 背景图片 - 摄影主题优化 */
.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.login-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.4) contrast(1.1);
  transform: scale(1.02);
  transition: transform 12s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.login-bg:hover img {
  transform: scale(1.1);
}

.login-bg .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 40%, rgba(0, 188, 212, 0.25) 0%, transparent 40%),
              radial-gradient(circle at 70% 60%, rgba(255, 152, 0, 0.2) 0%, transparent 40%);
}

/* 登录卡片 - 摄影主题优化 */
.login-card {
  position: relative;
  width: 100%;
  max-width: 900px;
  display: flex;
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: var(--transition);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: fadeInUp 0.8s ease-out;
}

.login-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  transform: translateY(-5px);
}

/* 品牌部分 - 摄影主题优化 */
.brand-section {
  width: 50%;
  padding: 60px;
  background: linear-gradient(135deg, #1a237e, #1565c0);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.brand-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://picsum.photos/id/1018/800/1200');
  background-size: cover;
  background-position: center;
  opacity: 0.15;
  z-index: 0;
  transform: scale(1.05);
  animation: scaleBackground 20s infinite alternate;
}

@keyframes scaleBackground {
  0% { transform: scale(1.05); }
  100% { transform: scale(1.15); }
}

/* 顶部渐变装饰条 */
.brand-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color), var(--accent-color));
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.6s ease-out;
}

.logo-icon {
  font-size: 32px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 15px rgba(0, 188, 212, 0.3);
  transition: transform 0.3s ease;
}

.logo-icon:hover {
  transform: scale(1.1) rotate(5deg);
}

.brand-section h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(to right, #ffffff, #f0f0f0);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 品牌口号 - 摄影主题设计 */
.brand-slogan {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

/* 特色展示 - 摄影主题优化 */
.features {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 1;
}

/* 功能项动画 */
.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 12px 16px;
  border-radius: 8px;
  transition: var(--transition);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: fadeInUp 0.6s ease-out both;
}

.feature-item:nth-child(1) { animation-delay: 0.4s; }
.feature-item:nth-child(2) { animation-delay: 0.6s; }
.feature-item:nth-child(3) { animation-delay: 0.8s; }

.feature-item:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 188, 212, 0.2);
}

.feature-icon {
  font-size: 20px;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.feature-item span {
  color: white;
  font-size: 16px;
  font-weight: 500;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* 登录表单部分 - 摄影主题优化 */
.login-form-container {
  width: 50%;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 表单背景装饰 */
.login-form-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 80% 20%, rgba(0, 188, 212, 0.05) 0%, transparent 25%),
    radial-gradient(circle at 20% 80%, rgba(255, 152, 0, 0.05) 0%, transparent 25%);
  pointer-events: none;
}

/* 表单头部 - 摄影主题设计 */
.form-header {
  text-align: center;
  margin-bottom: 40px;
  animation: fadeInUp 0.6s ease-out;
}

.form-header h2 {
  color: var(--text-primary);
  font-size: 32px;
  margin: 0 0 8px 0;
  font-weight: 700;
  position: relative;
  display: inline-block;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.form-header h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  border-radius: 3px;
}

.form-header p {
  color: var(--text-secondary);
  font-size: 16px;
  margin: 0;
}

.login-form {
  width: 100%;
}

/* 输入组 - 摄影主题优化 */
.input-group {
  position: relative;
  margin-bottom: 24px;
  animation: fadeInUp 0.6s ease-out both;
  transform-origin: top center;
}

.input-group:nth-child(1) { animation-delay: 0.8s; }
.input-group:nth-child(2) { animation-delay: 1s; }

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 16px;
  transition: var(--transition);
  z-index: 1;
}

.input-group.focused .input-icon {
  color: var(--primary-color);
  transform: translateY(-50%) scale(1.1);
}

.form-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 16px;
  transition: var(--transition);
  background-color: white;
  color: var(--text-primary);
  font-weight: 500;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  z-index: 0;
}

.form-input::placeholder {
  color: #999;
  transition: var(--transition);
  font-weight: 400;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: white;
  box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.15);
  transform: translateY(-2px);
}

.form-input:focus::placeholder {
  color: #ccc;
}

.form-input:hover:not(:focus) {
  border-color: var(--primary-color);
}

/* 表单选项 - 摄影主题优化 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  animation: fadeInUp 0.6s ease-out 1.2s both;
}

.remember-me {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-secondary);
  transition: var(--transition);
}

.remember-me:hover {
  color: var(--text-primary);
}

.remember-me input {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  accent-color: var(--primary-color);
  transition: var(--transition);
}

.forgot-password {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: var(--transition);
  position: relative;
  padding: 4px 0;
}

.forgot-password::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  transition: width 0.3s ease;
}

.forgot-password:hover {
  color: var(--accent-color);
}

.forgot-password:hover::after {
  width: 100%;
}

/* 登录按钮 - 摄影主题优化 */
.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 4px 12px rgba(0, 188, 212, 0.3);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out 1.4s both;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.login-btn:hover::before {
  left: 100%;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 188, 212, 0.4);
}

.login-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 188, 212, 0.3);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 6px rgba(0, 188, 212, 0.2);
}

.login-btn.login-error {
  animation: shake 0.5s;
  background: linear-gradient(135deg, var(--accent-color), #e53935);
  box-shadow: 0 4px 12px rgba(255, 87, 34, 0.3);
}

.login-loading {
  display: inline-block;
  animation: spin 1s linear infinite;
  font-size: 18px;
}

/* 分隔线 - 摄影主题优化 */
.divider {
  position: relative;
  text-align: center;
  margin: 30px 0;
  color: var(--text-secondary);
  animation: fadeInUp 0.6s ease-out 1.6s both;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 20px);
  height: 1px;
  background: linear-gradient(to right, transparent, var(--border-color), transparent);
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

/* 第三方登录 - 摄影主题优化 */
.social-login {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  animation: fadeInUp 0.6s ease-out 1.8s both;
}

.social-btn {
  flex: 1;
  padding: 12px;
  border: 2px solid var(--border-color);
  background-color: white;
  border-radius: 12px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-color);
}

.social-btn.google:hover {
  border-color: #db4437;
  color: #db4437;
  box-shadow: 0 4px 12px rgba(219, 68, 55, 0.2);
}

.social-btn.wechat:hover {
  border-color: #07C160;
  color: #07C160;
  box-shadow: 0 4px 12px rgba(7, 193, 96, 0.2);
}

.social-icon {
  font-weight: bold;
  font-size: 16px;
}

/* 注册选项 - 摄影主题优化 */
.register-option {
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
  animation: fadeInUp 0.6s ease-out 2s both;
}

.register-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
  position: relative;
  padding: 4px 0;
}

.register-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  transition: width 0.3s ease;
  border-radius: 1px;
}

.register-link:hover {
  color: var(--accent-color);
}

.register-link:hover::after {
  width: 100%;
}

/* 动画定义 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 188, 212, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 188, 212, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 188, 212, 0);
  }
}

/* 响应式设计 - 摄影主题优化 */
@media (max-width: 992px) {
  .login-card {
    flex-direction: column;
  }
  
  .brand-section,
  .login-form-container {
    width: 100%;
  }
  
  .brand-section {
    padding: 40px 20px;
    background: linear-gradient(135deg, #1a237e, #1565c0);
    position: relative;
    overflow: hidden;
  }
  
  .login-form-container {
    padding: 40px 20px;
    background-color: white;
  }
  
  .brand-section::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
  }
  
  .features {
    gap: 15px;
  }
  
  .login-card {
    border-radius: var(--border-radius);
  }
}

@media (max-width: 768px) {
  .login-card {
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .features {
    gap: 15px;
  }
  
  .feature-item {
    padding: 15px;
  }
  
  .form-header h2 {
    font-size: 28px;
  }
  
  .form-header p {
    font-size: 15px;
  }
}

@media (max-width: 576px) {
  .login-container {
    padding: 10px;
  }
  
  .login-form {
    padding: 25px;
  }
  
  .social-login {
    flex-direction: column;
    gap: 10px;
  }
  
  .social-btn {
    padding: 12px;
    font-size: 14px;
  }
  
  .brand-section {
    padding: 30px 15px;
  }
  
  .login-form-container {
    padding: 30px 15px;
  }
  
  .features {
    gap: 12px;
  }
  
  .logo-icon {
    font-size: 24px;
    width: 50px;
    height: 50px;
  }
  
  .brand-section h1 {
    font-size: 24px;
  }
  
  .form-header h2 {
    font-size: 26px;
  }
  
  .form-header p {
    font-size: 14px;
  }
}

@media (max-width: 400px) {
  .login-card {
    padding: 25px;
    border-radius: 20px;
  }
  
  .form-header h2 {
    font-size: 24px;
  }
  
  .form-header p {
    font-size: 13px;
  }
  
  .input-group {
    margin-bottom: 16px;
  }
  
  .social-btn {
    font-size: 13px;
    padding: 11px;
  }
  
  .register-option {
    font-size: 13px;
  }
  
  .login-btn {
    padding: 14px;
    font-size: 15px;
  }
}
</style>