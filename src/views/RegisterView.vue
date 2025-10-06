<template>
  <div class="register-container">
    <div class="register-wrapper">
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
import { ref, onUnmounted } from 'vue'
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
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
/* 基础样式 */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--background-color);
  padding: 20px;
}

/* 主容器 */
.register-wrapper {
  width: 100%;
  max-width: 600px;
  background-color: var(--surface-color);
  border-radius: 16px;
  box-shadow: var(--shadow-light);
  padding: 40px;
}

/* 表单头部 */
.form-header {
  text-align: center;
  margin-bottom: 30px;
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
  line-height: 1.5;
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
  background-color: var(--primary-color);
  border-radius: 3px;
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
  transition: all 0.3s ease;
  z-index: 1;
}

.form-input {
  flex: 1;
  height: 50px;
  padding: 0 16px 0 48px;
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
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
  background-color: white;
}

.input-group.focused .input-icon {
  color: var(--primary-color);
}

/* 验证码按钮 */
.verification-btn {
  height: 50px;
  padding: 0 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.verification-btn:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.verification-btn:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
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
  flex-wrap: wrap;
}

.agree-terms input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin-top: 2px;
  accent-color: var(--primary-color);
}

.agreement-link {
  color: var(--primary-color);
  text-decoration: none;
}

.agreement-link:hover {
  text-decoration: underline;
}

/* 注册按钮 */
.register-btn {
  width: 100%;
  height: 50px;
  background-color: var(--primary-color);
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
  position: relative;
  overflow: hidden;
}

.register-btn:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.register-btn:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
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
  transition: all 0.3s ease;
}

.login-link:hover {
  color: var(--primary-dark);
  text-decoration: none;
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
  background-color: var(--border-color);
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
  margin-bottom: 10px;
}

.social-btn {
  flex: 1;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.social-btn:hover {
  background-color: white;
  border-color: var(--primary-color);
}

.social-icon {
  font-size: 18px;
}
</style>