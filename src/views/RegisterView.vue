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
/* 摄影主题配色方案 */
:root {
  --primary-color: #3498db;
  --primary-dark: #2980b9;
  --secondary-color: #2ecc71;
  --accent-color: #e74c3c;
  --bg-dark: #f5f5f5;
  --bg-light: #ffffff;
  --bg-lighter: #f9f9f9;
  --text-primary: #333333;
  --text-secondary: #666666;
  --border-color: #e0e0e0;
  --success-color: #2ecc71;
  --error-color: #e74c3c;
  --shadow-light: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 8px 24px rgba(0, 0, 0, 0.12);
  --shadow-hover: 0 12px 36px rgba(0, 0, 0, 0.18);
  --glow: 0 0 10px rgba(52, 152, 219, 0.3);
  --transition: all 0.3s ease;
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
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(52, 152, 219, 0.1) 0%, transparent 25%),
    radial-gradient(circle at 80% 60%, rgba(46, 204, 113, 0.1) 0%, transparent 30%);
}

/* 背景装饰元素 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  pointer-events: none;
}

.circuit-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(52, 152, 219, 0.07) 0%, transparent 25%),
    radial-gradient(circle at 80% 60%, rgba(46, 204, 113, 0.07) 0%, transparent 30%);
  background-size: 100% 100%;
  animation: background-shift 20s ease infinite;
}

@keyframes background-shift {
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
}

/* 主容器 */
.register-wrapper {
  display: flex;
  width: 1200px;
  height: 700px;
  background: var(--bg-light);
  border-radius: 16px;
  box-shadow: var(--shadow-medium);
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: var(--transition);
}

.register-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
}

/* 左侧品牌区域 */
.brand-side {
  flex: 1;
  padding: 60px;
  background: linear-gradient(135deg, #1e293b 0%, var(--primary-color) 100%);
  position: relative;
  overflow: hidden;
}

/* 相机图标 */
.brand-logo {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 60px;
  animation: fadeInUp 0.6s ease-out;
}

.camera-icon {
  font-size: 48px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  animation: pulse 2s infinite;
}

.brand-logo h1 {
  color: white;
  font-size: 36px;
  font-weight: 800;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.brand-slogan {
  margin-bottom: 60px;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.brand-slogan p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 20px;
  margin: 10px 0;
  line-height: 1.5;
  font-weight: 300;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 16px;
  transition: var(--transition);
  transform: translateY(10px);
  opacity: 0;
  animation: fadeInUp 0.5s ease-out forwards;
}

.feature-item:nth-child(1) { animation-delay: 0.6s; }
.feature-item:nth-child(2) { animation-delay: 0.8s; }
.feature-item:nth-child(3) { animation-delay: 1s; }

.feature-icon {
  font-size: 20px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  backdrop-filter: blur(5px);
  transition: var(--transition);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.feature-item span {
  color: white;
  font-size: 16px;
  font-weight: 500;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* 右侧注册表单区域 */
.register-form-container {
  flex: 1;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.register-form-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 80% 20%, rgba(52, 152, 219, 0.05) 0%, transparent 25%),
    radial-gradient(circle at 20% 80%, rgba(46, 204, 113, 0.05) 0%, transparent 25%);
  pointer-events: none;
}

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
}

.form-header h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  border-radius: 3px;
}

.form-header p {
  color: var(--text-secondary);
  font-size: 16px;
  margin: 15px 0 0 0;
  line-height: 1.5;
}

/* 标签页 */
.tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 30px;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.tab-btn {
  flex: 1;
  padding: 12px 16px;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 16px;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  outline: none;
  font-weight: 500;
}

.tab-btn.active {
  color: var(--primary-color);
  font-weight: 600;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  box-shadow: var(--glow);
  border-radius: 3px;
}

/* 表单样式 */
.register-form {
  margin-bottom: 30px;
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

.input-group {
  margin-bottom: 20px;
  position: relative;
  display: flex;
  align-items: center;
  animation: fadeInUp 0.5s ease-out;
  transform-origin: top center;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 16px;
  transition: var(--transition);
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
  transition: var(--transition);
  font-weight: 500;
}

.form-input::placeholder {
  color: var(--text-secondary);
  font-weight: 400;
}

.code-input {
  border-radius: 8px 0 0 8px;
  margin-right: 0;
  border-right: none;
}

.form-input:focus {
  border-color: var(--primary-color);
  box-shadow: var(--glow);
  background-color: white;
}

.input-group.focused .input-icon {
  color: var(--primary-color);
  transform: translateY(-50%) scale(1.1);
}

/* 验证码按钮 */
.verification-btn {
  height: 50px;
  padding: 0 20px;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.verification-btn:hover:not(:disabled) {
  background: #27ae60;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
}

.verification-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.verification-btn:hover:not(:disabled)::before {
  left: 100%;
}

.verification-btn:disabled {
  background: var(--border-color);
  cursor: not-allowed;
  transform: none;
}

/* 协议选项 */
.form-options {
  margin-bottom: 30px;
  animation: fadeInUp 0.5s ease-out 0.4s both;
}

.agree-terms {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.4;
  flex-wrap: wrap;
}

.agree-terms input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin-top: 2px;
  accent-color: var(--primary-color);
  cursor: pointer;
  transition: var(--transition);
}

.agreement-link {
  color: var(--primary-color);
  text-decoration: none;
  transition: var(--transition);
  font-weight: 500;
}

.agreement-link:hover {
  color: var(--primary-dark);
  text-decoration: underline;
  text-shadow: 0 0 5px rgba(52, 152, 219, 0.2);
}

/* 注册按钮 */
.register-btn {
  width: 100%;
  height: 50px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.5s ease-out 0.5s both;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
  letter-spacing: 1px;
}

.register-btn:active {
  transform: translateY(0);
}

.register-btn:disabled {
  background: var(--border-color);
  cursor: not-allowed;
  transform: none;
  letter-spacing: 0.5px;
}

.register-loading {
  animation: spin 1s linear infinite;
  font-size: 18px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 登录选项 */
.login-option {
  text-align: center;
  margin-top: 20px;
  animation: fadeInUp 0.5s ease-out 0.6s both;
}

.login-option span {
  color: var(--text-secondary);
  font-size: 14px;
}

.login-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  margin-left: 4px;
  transition: var(--transition);
  position: relative;
  padding: 2px 6px;
  border-radius: 4px;
}

.login-link:hover {
  color: var(--primary-dark);
  text-decoration: none;
  background-color: rgba(52, 152, 219, 0.1);
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.15);
}

/* 分隔线 */
.divider {
  display: flex;
  align-items: center;
  margin: 30px 0;
  animation: fadeInUp 0.5s ease-out 0.7s both;
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
  font-weight: 500;
}

/* 其他注册方式 */
.other-register {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  animation: fadeInUp 0.5s ease-out 0.8s both;
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
  border-radius: 8px;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: var(--transition);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.social-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.05), transparent);
  transition: left 0.5s ease;
  z-index: -1;
}

.social-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
  border-color: var(--primary-color);
}

.social-btn:hover::before {
  left: 100%;
}

.social-icon {
  font-size: 18px;
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

@keyframes pulse {
  0% {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    transform: scale(1.03);
  }
  100% {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    transform: scale(1);
  }
}

/* 电脑端适配和响应式设计 */
@media (max-width: 1280px) {
  .register-wrapper {
    width: 1000px;
    height: 600px;
    transition: var(--transition);
  }
  
  .brand-side,
  .register-form-container {
    padding: 40px;
  }
  
  .brand-logo h1 {
    font-size: 32px;
  }
}

@media (max-width: 1024px) {
  .register-wrapper {
    width: 90%;
    height: auto;
    flex-direction: column;
    transition: var(--transition);
  }
  
  .brand-side {
    text-align: center;
    padding: 40px 20px;
    background: linear-gradient(180deg, #1e293b 0%, var(--primary-color) 100%);
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
    text-align: center;
    gap: 12px;
  }
  
  .feature-icon {
    width: 45px;
    height: 45px;
  }
}

@media (max-width: 768px) {
  .register-container {
    padding: 20px;
  }
  
  .register-wrapper {
    border-radius: 12px;
  }
  
  .register-form-container {
    padding: 30px 20px;
  }
  
  .other-register {
    flex-direction: column;
    gap: 10px;
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
    border-right: 2px solid var(--border-color);
  }
  
  .verification-btn {
    border-radius: 8px;
    margin-top: 12px;
  }
  
  .form-header h2 {
    font-size: 26px;
  }
  
  .form-header h2::after {
    width: 40px;
  }
  
  .register-btn {
    letter-spacing: 0.3px;
  }
  
  .agree-terms {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 10px;
  }
  
  .register-wrapper {
    border-radius: 12px;
    width: 95%;
  }
  
  .form-input,
  .register-btn,
  .verification-btn,
  .social-btn {
    height: 44px;
    font-size: 14px;
  }
  
  .brand-logo h1 {
    font-size: 26px;
  }
  
  .brand-slogan p {
    font-size: 18px;
  }
  
  .camera-icon {
    width: 60px;
    height: 60px;
    font-size: 36px;
  }
  
  .feature-icon {
    width: 40px;
    height: 40px;
  }
  
  .feature-item span {
    font-size: 14px;
  }
  
  .divider span {
    padding: 0 15px;
    font-size: 12px;
  }
  
  .login-option span,
  .login-link {
    font-size: 13px;
  }
}
</style>