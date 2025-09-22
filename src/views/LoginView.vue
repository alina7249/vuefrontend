<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circuit-bg"></div>
      <div class="binary-code"></div>
    </div>
    
    <div class="login-wrapper">
      <!-- 侧边品牌信息 -->
      <div class="brand-side">
        <div class="brand-logo">
          <div class="terminal-icon">
            <div class="terminal-top"></div>
            <div class="terminal-screen">
              <div class="code-line">10101010</div>
              <div class="code-line">01010101</div>
              <div class="code-line">10101010</div>
            </div>
          </div>
          <h1>TechLearn Hub</h1>
        </div>
        <div class="brand-slogan">
          <p>探索数字世界的无限可能</p>
          <p>提升你的技术实力</p>
        </div>
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon">📚</div>
            <span>海量学习资源</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">💻</div>
            <span>编程实战训练</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎯</div>
            <span>个性化学习路径</span>
          </div>
        </div>
      </div>
      
      <!-- 登录表单区域 -->
      <div class="login-form-container">
        <div class="form-header">
          <h2>欢迎回来</h2>
          <p>请登录您的账户继续学习</p>
        </div>
        
        <div class="tabs">
          <button class="tab-btn active">账号密码登录</button>
          <button class="tab-btn">验证码登录</button>
        </div>
        
        <div class="login-form">
          <div class="input-group">
            <div class="input-icon">👤</div>
            <input 
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
              type="password" 
              v-model="password" 
              placeholder="请输入密码"
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
          <button class="login-btn" @click="handleLogin">
            <span class="login-text">登录</span>
            <span class="login-loading" v-if="isLoading">⟳</span>
          </button>
          
          <div class="register-option">
            <span>还没有账号？</span>
            <RouterLink to="/register" class="register-link">立即注册</RouterLink>
          </div>
        </div>
        
        <div class="divider">
          <span>其他登录方式</span>
        </div>
        
        <div class="other-login">
          <a href="#" class="social-btn github-btn">
            <span class="social-icon">🐙</span>
            GitHub
          </a>
          <a href="#" class="social-btn google-btn">
            <span class="social-icon">G</span>
            Google
          </a>
          <a href="#" class="social-btn wechat-btn">
            <span class="social-icon">💬</span>
            微信
          </a>
        </div>
        
        <div class="agreement">
          <span>登录即表示您同意</span>
          <a href="#">用户协议</a>
          <span>和</span>
          <a href="#">隐私政策</a>
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
      
      // 登录成功后跳转到学习页面
      router.push('/learn')
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

const onInputFocus = (event) => {
  event.target.parentElement.classList.add('focused')
}

const onInputBlur = (event) => {
  if (!event.target.value) {
    event.target.parentElement.classList.remove('focused')
  }
}
</script>

<style scoped>
/* 计算机科技风格配色方案 */
:root {
  --primary-color: #00bcd4;
  --primary-dark: #008ba3;
  --secondary-color: #6c63ff;
  --accent-color: #ff6584;
  --bg-dark: #121212;
  --bg-light: #1e1e1e;
  --bg-lighter: #2a2a2a;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --border-color: #333333;
  --success-color: #4caf50;
  --error-color: #f44336;
  --shadow: 0 4px 20px rgba(0, 188, 212, 0.15);
  --glow: 0 0 10px rgba(0, 188, 212, 0.5);
}

/* 基础布局 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--bg-dark);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  overflow: hidden;
}

/* 背景装饰元素 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.circuit-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(0, 188, 212, 0.05) 0%, transparent 20%),
    radial-gradient(circle at 80% 30%, rgba(108, 99, 255, 0.05) 0%, transparent 25%),
    radial-gradient(circle at 40% 70%, rgba(255, 101, 132, 0.05) 0%, transparent 15%);
  background-size: 100% 100%;
}

.binary-code {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-family: monospace;
  font-size: 12px;
  line-height: 12px;
  opacity: 0.03;
  overflow: hidden;
  background-image: 
    linear-gradient(to bottom, transparent, var(--bg-dark)),
    repeating-linear-gradient(90deg, transparent, transparent 9px, var(--primary-color) 9px, var(--primary-color) 10px);
}

/* 主容器 */
.login-wrapper {
  display: flex;
  width: 1200px;
  height: 700px;
  background: var(--bg-light);
  border-radius: 16px;
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
  z-index: 1;
}

/* 左侧品牌区域 */
.brand-side {
  flex: 1;
  padding: 60px;
  background: linear-gradient(135deg, var(--bg-dark) 0%, var(--secondary-color) 100%);
  position: relative;
  overflow: hidden;
}

/* 终端图标 */
.brand-logo {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 60px;
}

.terminal-icon {
  width: 60px;
  height: 45px;
  background: var(--bg-dark);
  border-radius: 8px 8px 0 0;
  position: relative;
}

.terminal-top {
  width: 100%;
  height: 8px;
  background: var(--bg-lighter);
  border-radius: 8px 8px 0 0;
  position: relative;
}

.terminal-top::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 8px;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  background: #ff5f56;
  border-radius: 50%;
}

.terminal-top::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 18px;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  background: #ffbd2e;
  border-radius: 50%;
}

.terminal-screen {
  padding: 4px;
  font-family: monospace;
  font-size: 8px;
  color: var(--success-color);
}

.code-line {
  height: 7px;
  overflow: hidden;
  animation: typing 2s steps(8) infinite;
}

@keyframes typing {
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
}

.brand-logo h1 {
  color: var(--text-primary);
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.brand-slogan {
  margin-bottom: 60px;
}

.brand-slogan p {
  color: var(--text-secondary);
  font-size: 18px;
  margin: 8px 0;
  line-height: 1.5;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.feature-icon {
  font-size: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.feature-item span {
  color: var(--text-primary);
  font-size: 16px;
}

/* 右侧登录表单区域 */
.login-form-container {
  flex: 1;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.form-header h2 {
  color: var(--text-primary);
  font-size: 28px;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.form-header p {
  color: var(--text-secondary);
  font-size: 16px;
  margin: 0;
}

/* 标签页 */
.tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 30px;
}

.tab-btn {
  flex: 1;
  padding: 12px 16px;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  outline: none;
}

.tab-btn.active {
  color: var(--primary-color);
  font-weight: 500;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-color);
  box-shadow: var(--glow);
}

/* 表单样式 */
.login-form {
  margin-bottom: 30px;
}

.input-group {
  margin-bottom: 20px;
  position: relative;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 16px;
  transition: color 0.3s ease;
}

.form-input {
  width: 100%;
  height: 50px;
  padding: 0 16px 0 48px;
  background: var(--bg-lighter);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: var(--primary-color);
  box-shadow: var(--glow);
}

.input-group.focused .input-icon {
  color: var(--primary-color);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
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
  accent-color: var(--primary-color);
  cursor: pointer;
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
  color: var(--primary-dark);
  text-decoration: underline;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  height: 50px;
  background: var(--primary-color);
  color: var(--text-primary);
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
  transition: left 0.5s ease;
}

.login-btn:hover::before {
  left: 100%;
}

.login-btn:hover {
  background: var(--primary-dark);
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
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.login-loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.register-option {
  text-align: center;
  margin-top: 20px;
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
  color: var(--primary-dark);
  text-decoration: underline;
}

/* 分隔线 */
.divider {
  display: flex;
  align-items: center;
  margin: 30px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-color);
}

.divider span {
  padding: 0 20px;
  color: var(--text-secondary);
  font-size: 14px;
}

/* 其他登录方式 */
.other-login {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
}

.social-btn {
  flex: 1;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--bg-lighter);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.social-btn:hover {
  background: var(--border-color);
  transform: translateY(-2px);
}

.social-icon {
  font-size: 18px;
}

/* 协议部分 */
.agreement {
  text-align: center;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.agreement a {
  color: var(--primary-color);
  text-decoration: none;
}

.agreement a:hover {
  text-decoration: underline;
}

/* 电脑端适配和响应式设计 */
@media (max-width: 1280px) {
  .login-wrapper {
    width: 1000px;
    height: 600px;
  }
  
  .brand-side,
  .login-form-container {
    padding: 40px;
  }
}

@media (max-width: 1024px) {
  .login-wrapper {
    width: 90%;
    height: auto;
    flex-direction: column;
  }
  
  .brand-side {
    text-align: center;
    padding: 40px 20px;
  }
  
  .brand-logo {
    justify-content: center;
    margin-bottom: 30px;
  }
  
  .feature-list {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .feature-item {
    flex-direction: column;
    flex: 1;
    min-width: 100px;
  }
}

@media (max-width: 768px) {
  .login-container {
    padding: 20px;
  }
  
  .login-form-container {
    padding: 30px 20px;
  }
  
  .other-login {
    flex-direction: column;
  }
  
  .form-header h2 {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .login-wrapper {
    border-radius: 12px;
  }
  
  .form-input,
  .login-btn,
  .social-btn {
    height: 44px;
    font-size: 14px;
  }
  
  .brand-logo h1 {
    font-size: 24px;
  }
</style>