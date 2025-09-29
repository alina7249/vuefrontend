<template>
  <div class="register-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circuit-bg"></div>
    </div>
    
    <div class="register-wrapper">
      <!-- 侧边品牌信息 -->
      <div class="brand-side">
        <div class="brand-logo">
          <div class="camera-icon">
            📷
          </div>
          <h1>摄影视界</h1>
        </div>
        <div class="brand-slogan">
          <p>加入我们的摄影社区</p>
          <p>分享你的精彩瞬间</p>
        </div>
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon">🔐</div>
            <span>安全的账户系统</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">👥</div>
            <span>专业的摄影交流</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🚀</div>
            <span>展示你的作品</span>
          </div>
        </div>
      </div>
      
      <!-- 注册表单区域 -->
      <div class="register-form-container">
        <div class="form-header">
          <h2>创建新账号</h2>
          <p>加入摄影视界，分享你的摄影作品</p>
        </div>
        
        <div class="tabs">
          <button class="tab-btn active">邮箱注册</button>
          <button class="tab-btn">手机号注册</button>
        </div>
        
        <div class="register-form">
          <div class="input-group">
            <div class="input-icon">✉️</div>
            <input 
              type="email" 
              v-model="email"
              placeholder="请输入邮箱地址"
              class="form-input"
              @focus="onInputFocus($event)"
              @blur="onInputBlur($event)"
            />
          </div>
          <div class="input-group">
            <div class="input-icon">👤</div>
            <input 
              type="text" 
              v-model="username"
              placeholder="请设置用户名"
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
              placeholder="请设置密码（8-20位字母、数字和符号组合）"
              class="form-input"
              @focus="onInputFocus($event)"
              @blur="onInputBlur($event)"
            />
          </div>
          <div class="input-group">
            <div class="input-icon">🔑</div>
            <input 
              type="password" 
              v-model="confirmPassword"
              placeholder="请确认密码"
              class="form-input"
              @focus="onInputFocus($event)"
              @blur="onInputBlur($event)"
            />
          </div>
          <div class="input-group">
            <div class="input-icon">📱</div>
            <input 
              type="text" 
              v-model="verificationCode"
              placeholder="请输入验证码"
              class="form-input code-input"
              @focus="onInputFocus($event)"
              @blur="onInputBlur($event)"
            />
            <button 
              class="verification-btn"
              @click="sendVerificationCode"
              :disabled="isSendingCode"
            >
              {{ isSendingCode ? `${countdown}秒后重发` : '获取验证码' }}
            </button>
          </div>
          <div class="form-options">
            <label class="agree-terms">
              <input type="checkbox" v-model="agreeTerms" />
              <span>我已阅读并同意</span>
              <a href="#" class="agreement-link">用户协议</a>
              <span>和</span>
              <a href="#" class="agreement-link">隐私政策</a>
            </label>
          </div>
          <button 
            class="register-btn" 
            @click="handleRegister"
            :disabled="isLoading"
          >
            <span class="register-text">立即注册</span>
            <span class="register-loading" v-if="isLoading">⟳</span>
          </button>
          
          <div class="login-option">
            <span>已有账号？</span>
            <RouterLink to="/login" class="login-link">立即登录</RouterLink>
          </div>
        </div>
        
        <div class="divider">
          <span>其他注册方式</span>
        </div>
        
        <div class="other-register">
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'

const router = useRouter()
const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const verificationCode = ref('')
const agreeTerms = ref(false)
const isLoading = ref(false)
const isSendingCode = ref(false)
const countdown = ref(60)
let countdownTimer = null

const handleRegister = () => {
  // 表单验证
  if (!email.value) {
    alert('请输入邮箱地址')
    return
  }
  
  if (!username.value) {
    alert('请设置用户名')
    return
  }
  
  if (!password.value || password.value.length < 8) {
    alert('密码长度不能少于8位')
    return
  }
  
  if (password.value !== confirmPassword.value) {
    alert('两次输入的密码不一致')
    return
  }
  
  if (!verificationCode.value) {
    alert('请输入验证码')
    return
  }
  
  if (!agreeTerms.value) {
    alert('请阅读并同意用户协议和隐私政策')
    return
  }
  
  // 模拟注册加载状态
  isLoading.value = true
  
  // 模拟注册验证延迟
  setTimeout(() => {
    // 模拟注册成功
    console.log('注册成功，用户信息:', {
      email: email.value,
      username: username.value
    })
    
    // 注册成功后跳转到登录页面
    router.push('/login')
    isLoading.value = false
  }, 2000)
}

const sendVerificationCode = () => {
  // 邮箱验证
  if (!email.value || !validateEmail(email.value)) {
    alert('请输入有效的邮箱地址')
    return
  }
  
  // 模拟发送验证码
  isSendingCode.value = true
  
  // 模拟验证码发送延迟
  setTimeout(() => {
    alert('验证码已发送到您的邮箱，请查收')
    
    // 开始倒计时
    startCountdown()
  }, 1500)
}

const startCountdown = () => {
  countdown.value = 60
  
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
  
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
      isSendingCode.value = false
    }
  }, 1000)
}

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const onInputFocus = (event) => {
  event.target.parentElement.classList.add('focused')
}

const onInputBlur = (event) => {
  if (!event.target.value) {
    event.target.parentElement.classList.remove('focused')
  }
}

// 组件销毁时清除定时器
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
/* 摄影交流网站配色方案 */
:root {
  --primary-color: #1a73e8;
  --primary-dark: #1557b0;
  --secondary-color: #4285f4;
  --accent-color: #ea4335;
  --bg-dark: #f8f9fa;
  --bg-light: #ffffff;
  --bg-lighter: #f5f5f5;
  --text-primary: #333333;
  --text-secondary: #666666;
  --border-color: #e0e0e0;
  --success-color: #34a853;
  --error-color: #ea4335;
  --shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  --glow: 0 0 10px rgba(26, 115, 232, 0.3);
}

/* 基础布局 */
.register-container {
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
    radial-gradient(circle at 10% 20%, rgba(26, 115, 232, 0.05) 0%, transparent 20%),
    radial-gradient(circle at 80% 30%, rgba(66, 133, 244, 0.05) 0%, transparent 25%),
    radial-gradient(circle at 40% 70%, rgba(234, 67, 53, 0.05) 0%, transparent 15%);
  background-size: 100% 100%;
}

/* 主容器 */
.register-wrapper {
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
  background: linear-gradient(135deg, #f8f9fa 0%, var(--secondary-color) 100%);
  position: relative;
  overflow: hidden;
}

/* 相机图标 */
.brand-logo {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 60px;
}

.camera-icon {
  font-size: 48px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.brand-logo h1 {
  color: white;
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
  color: rgba(255, 255, 255, 0.9);
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
  color: white;
  font-size: 16px;
}

/* 右侧注册表单区域 */
.register-form-container {
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
.register-form {
  margin-bottom: 30px;
}

.input-group {
  margin-bottom: 20px;
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 16px;
  transition: color 0.3s ease;
  z-index: 1;
}

.form-input {
  flex: 1;
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

.code-input {
  border-radius: 8px 0 0 8px;
  margin-right: 0;
}

.form-input:focus {
  border-color: var(--primary-color);
  box-shadow: var(--glow);
}

.input-group.focused .input-icon {
  color: var(--primary-color);
}

/* 验证码按钮 */
.verification-btn {
  height: 50px;
  padding: 0 20px;
  background: var(--secondary-color);
  color: var(--text-primary);
  border: none;
  border-radius: 0 8px 8px 0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.verification-btn:hover:not(:disabled) {
  background: #5a52d4;
  transform: translateY(-2px);
  box-shadow: 0 0 10px rgba(108, 99, 255, 0.5);
}

.verification-btn:disabled {
  background: var(--border-color);
  cursor: not-allowed;
  transform: none;
}

/* 协议选项 */
.form-options {
  margin-bottom: 30px;
}

.agree-terms {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.agree-terms input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin-top: 2px;
  accent-color: var(--primary-color);
  cursor: pointer;
}

.agreement-link {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.agreement-link:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

/* 注册按钮 */
.register-btn {
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

.register-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.register-btn:hover:not(:disabled)::before {
  left: 100%;
}

.register-btn:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--glow);
}

.register-btn:active {
  transform: translateY(0);
}

.register-btn:disabled {
  background: var(--border-color);
  cursor: not-allowed;
  transform: none;
}

.register-loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 登录选项 */
.login-option {
  text-align: center;
  margin-top: 20px;
}

.login-option span {
  color: var(--text-secondary);
  font-size: 14px;
}

.login-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  margin-left: 4px;
  transition: color 0.3s ease;
}

.login-link:hover {
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

/* 其他注册方式 */
.other-register {
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

/* 电脑端适配和响应式设计 */
@media (max-width: 1280px) {
  .register-wrapper {
    width: 1000px;
    height: 600px;
  }
  
  .brand-side,
  .register-form-container {
    padding: 40px;
  }
}

@media (max-width: 1024px) {
  .register-wrapper {
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
  .register-container {
    padding: 20px;
  }
  
  .register-form-container {
    padding: 30px 20px;
  }
  
  .other-register {
    flex-direction: column;
  }
  
  .input-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .form-input {
    border-radius: 8px;
  }
  
  .code-input {
    margin-bottom: 12px;
  }
  
  .verification-btn {
    border-radius: 8px;
  }
  
  .form-header h2 {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .register-wrapper {
    border-radius: 12px;
  }
  
  .form-input,
  .register-btn,
  .verification-btn,
  .social-btn {
    height: 44px;
    font-size: 14px;
  }
  
  .brand-logo h1 {
    font-size: 24px;
  }
}
</style>