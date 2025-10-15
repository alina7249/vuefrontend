<template>
  <div class="register-page">
    <!-- 背景装饰元素 -->
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
    
    <!-- 注册卡片 -->
    <div class="register-card">
      <div class="register-card-inner">
        <!-- 注册头部 -->
        <div class="register-header">
          <div class="logo-container">
            <div class="logo-icon">📸</div>
            <h1 class="logo-text">PhotoShare</h1>
          </div>
          <h2 class="register-title">创建新账号</h2>
          <p class="register-subtitle">加入我们的摄影社区，分享您的精彩瞬间</p>
        </div>
        
        <!-- 注册表单 -->
        <form class="register-form" @submit.prevent="handleRegister">
          <!-- 全局错误提示 -->
          <div v-if="errorMessage" class="error-message">
            <i class="error-icon">⚠️</i>
            {{ errorMessage }}
          </div>
          
          <!-- 邮箱/手机号输入框 -->
          <div class="form-group">
            <label for="account" class="form-label">邮箱/手机号</label>
            <div class="input-wrapper" :class="{ 'input-wrapper-focused': accountFocus, 'input-wrapper-error': accountError }">
              <input
                type="text"
                id="account"
                v-model="account"
                class="form-input"
                placeholder="请输入邮箱或手机号"
                @focus="handleAccountFocus"
                @blur="handleAccountBlur"
                @input="validateAccount"
              />
              <div class="input-icon">
                {{ isEmail ? '✉️' : '📱' }}
              </div>
            </div>
            <div v-if="accountError" class="validation-hint error-hint">
              {{ accountErrorMessage }}
            </div>
            <div v-else-if="account && !accountError && accountFocus" class="validation-hint success-hint">
              <i class="success-icon">✓</i> 格式正确
            </div>
          </div>
          
          <!-- 验证码输入框 -->
          <div class="form-group">
            <label for="verificationCode" class="form-label">验证码</label>
            <div class="code-input-container">
              <div class="input-wrapper" :class="{ 'input-wrapper-focused': codeFocus, 'input-wrapper-error': codeError }">
                <input
                  type="text"
                  id="verificationCode"
                  v-model="verificationCode"
                  class="form-input code-input"
                  placeholder="请输入验证码"
                  @focus="codeFocus = true"
                  @blur="codeFocus = false"
                  @input="validateCode"
                />
                <div class="input-icon">
                  🔢
                </div>
              </div>
              <button
                type="button"
                class="send-code-button"
                :disabled="isSendingCode || !canSendCode"
                @click="sendVerificationCode"
              >
                {{ isSendingCode ? '发送中...' : (countdown > 0 ? `${countdown}s后重试` : '获取验证码') }}
              </button>
            </div>
            <div v-if="codeError" class="validation-hint error-hint">
              {{ codeErrorMessage }}
            </div>
          </div>
          
          <!-- 设置密码输入框 -->
          <div class="form-group">
            <label for="password" class="form-label">设置密码</label>
            <div class="input-wrapper" :class="{ 'input-wrapper-focused': passwordFocus, 'input-wrapper-error': passwordError }">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                class="form-input"
                placeholder="请设置6-20位密码"
                @focus="passwordFocus = true"
                @blur="passwordFocus = false"
                @input="validatePassword"
              />
              <button
                type="button"
                class="password-toggle"
                @click="togglePasswordVisibility"
                aria-label="切换密码可见性"
              >
                {{ showPassword ? '👁️‍🗨️' : '👁️' }}
              </button>
            </div>
            
            <!-- 密码强度指示器 -->
            <div v-if="password.length > 0" class="password-strength">
              <div class="strength-bars">
                <div 
                  class="strength-bar"
                  :class="getStrengthClass(1)"
                ></div>
                <div 
                  class="strength-bar"
                  :class="getStrengthClass(2)"
                ></div>
                <div 
                  class="strength-bar"
                  :class="getStrengthClass(3)"
                ></div>
              </div>
              <span class="strength-text">{{ getStrengthText() }}</span>
            </div>
          </div>
          
          <!-- 用户协议 -->
          <div class="agreement-section">
            <label class="agreement-checkbox">
              <input
                type="checkbox"
                v-model="agreedToTerms"
                class="terms-checkbox"
              />
              <span class="checkmark"></span>
              <span class="agreement-text">我已阅读并同意<a href="#" @click.prevent="showTerms">《用户协议》</a>和<a href="#" @click.prevent="showPrivacy">《隐私政策》</a></span>
            </label>
          </div>
          
          <!-- 注册按钮 -->
          <button
            type="submit"
            class="register-button"
            :disabled="!isFormValid || isLoading || !agreedToTerms"
          >
            <span v-if="isLoading" class="loading-spinner"></span>
            <span v-else>注册并登录</span>
          </button>
        </form>
        
        <!-- 登录入口 -->
        <div class="login-section">
          <span class="login-text">已有账号？</span>
          <router-link to="/login" class="login-link">
            立即登录
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

// 表单数据
const account = ref('');
const verificationCode = ref('');
const password = ref('');
const agreedToTerms = ref(false);
const showPassword = ref(false);

// 状态变量
const isLoading = ref(false);
const isSendingCode = ref(false);
const countdown = ref(0);
const errorMessage = ref('');
const accountFocus = ref(false);
const codeFocus = ref(false);
const passwordFocus = ref(false);
const accountError = ref(false);
const codeError = ref(false);
const passwordError = ref(false);
const accountErrorMessage = ref('');
const codeErrorMessage = ref('');
const passwordStrength = ref(0);

// 定时器引用
let countdownTimer = null;

// 判断是邮箱还是手机号
const isEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(account.value);
});

// 判断是否可以发送验证码
const canSendCode = computed(() => {
  return account.value.trim() && !accountError.value && countdown.value === 0;
});

// 表单验证状态
const isFormValid = computed(() => {
  return account.value.trim() && 
         verificationCode.value.trim() && 
         password.value && 
         !accountError.value && 
         !codeError.value && 
         !passwordError.value;
});

// 处理账号输入框焦点
const handleAccountFocus = () => {
  accountFocus.value = true;
  validateAccount();
};

const handleAccountBlur = () => {
  accountFocus.value = false;
  if (account.value.trim()) {
    validateAccount();
  }
};

// 验证账号格式
const validateAccount = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^1[3-9]\d{9}$/;
  
  if (!account.value.trim()) {
    accountError.value = false;
    accountErrorMessage.value = '';
    return;
  }
  
  if (!emailRegex.test(account.value) && !phoneRegex.test(account.value)) {
    accountError.value = true;
    accountErrorMessage.value = '请输入有效的邮箱地址或手机号码';
  } else {
    accountError.value = false;
    accountErrorMessage.value = '';
  }
};

// 验证验证码
const validateCode = () => {
  // 验证码验证规则：6位数字
  const codeRegex = /^\d{6}$/;
  
  if (!verificationCode.value.trim()) {
    codeError.value = false;
    codeErrorMessage.value = '';
    return;
  }
  
  if (!codeRegex.test(verificationCode.value)) {
    codeError.value = true;
    codeErrorMessage.value = '验证码格式不正确（6位数字）';
  } else {
    codeError.value = false;
    codeErrorMessage.value = '';
  }
};

// 验证密码强度
const validatePassword = () => {
  // 简单的密码强度检测
  let strength = 0;
  
  if (password.value.length >= 8) strength++;
  if (/[A-Z]/.test(password.value)) strength++;
  if (/[0-9]/.test(password.value) && /[^A-Za-z0-9]/.test(password.value)) strength++;
  
  passwordStrength.value = strength;
  passwordError.value = password.value.length > 0 && password.value.length < 6;
};

// 获取密码强度级别对应的类名
const getStrengthClass = (level) => {
  if (passwordStrength.value >= level) {
    if (level === 1) return 'strength-weak';
    if (level === 2) return 'strength-medium';
    if (level === 3) return 'strength-strong';
  }
  return '';
};

// 获取密码强度文本
const getStrengthText = () => {
  if (password.value.length === 0) return '';
  if (password.value.length < 6) return '密码太短';
  if (passwordStrength.value === 1) return '弱';
  if (passwordStrength.value === 2) return '中等';
  return '强';
};

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// 发送验证码
const sendVerificationCode = async () => {
  if (!canSendCode.value) return;
  
  isSendingCode.value = true;
  errorMessage.value = '';
  
  try {
    // 模拟网络请求
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 显示发送成功提示
    alert(`${isEmail.value ? '邮箱' : '手机号'}验证码已发送！（演示用：666666）`);
    
    // 开始倒计时
    startCountdown();
  } catch (error) {
    errorMessage.value = '验证码发送失败，请稍后重试';
    console.error('发送验证码错误:', error);
  } finally {
    isSendingCode.value = false;
  }
};

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60;
  
  // 清除之前的定时器
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
  
  // 设置新的定时器
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }, 1000);
};

// 处理注册
const handleRegister = async () => {
  // 清除之前的错误信息
  errorMessage.value = '';
  
  // 表单验证
  if (!account.value.trim()) {
    accountError.value = true;
    accountErrorMessage.value = '请输入邮箱或手机号';
    return;
  }
  
  if (!verificationCode.value.trim()) {
    codeError.value = true;
    codeErrorMessage.value = '请输入验证码';
    return;
  }
  
  if (!password.value) {
    passwordError.value = true;
    return;
  }
  
  if (!agreedToTerms.value) {
    errorMessage.value = '请阅读并同意用户协议和隐私政策';
    return;
  }
  
  // 设置加载状态
  isLoading.value = true;
  
  try {
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 验证码校验（演示用：666666）
    if (verificationCode.value !== '666666') {
      codeError.value = true;
      codeErrorMessage.value = '验证码错误';
      return;
    }
    
    // 注册成功后自动登录
    // 由于是演示，我们使用account的一部分作为用户名
    const username = isEmail.value ? account.value.split('@')[0] : `user_${account.value.slice(-4)}`;
    
    // 调用登录方法
    const loginSuccess = userStore.login(username, password.value);
    
    if (loginSuccess) {
      // 确保localStorage正确设置
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      
      // 注册成功，跳转到首页
      router.push('/');
    } else {
      // 注册失败，显示错误信息
      errorMessage.value = '注册失败，请稍后重试';
    }
  } catch (error) {
    // 处理异常情况
    errorMessage.value = '注册失败，请稍后重试';
    console.error('注册错误:', error);
  } finally {
    // 重置加载状态
    isLoading.value = false;
  }
};

// 显示用户协议
const showTerms = () => {
  alert('用户协议内容正在加载...');
};

// 显示隐私政策
const showPrivacy = () => {
  alert('隐私政策内容正在加载...');
};

// 组件销毁时清除定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<style scoped>
/* 全局样式重置和基础设置 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 注册页面容器 */
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
}

/* 背景装饰形状 */
.background-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.4;
  animation: float 15s ease-in-out infinite;
}

.shape-1 {
  width: 300px;
  height: 300px;
  background: #3498db;
  top: -50px;
  left: -50px;
  animation-delay: 0s;
}

.shape-2 {
  width: 400px;
  height: 400px;
  background: #9b59b6;
  bottom: -100px;
  right: -100px;
  animation-delay: -5s;
}

.shape-3 {
  width: 250px;
  height: 250px;
  background: #1abc9c;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(30px, 30px) scale(1.05);
  }
}

/* 注册卡片 */
.register-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  padding: 40px;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

/* 卡片内部容器 */
.register-card-inner {
  position: relative;
  z-index: 1;
}

/* 注册头部 */
.register-header {
  text-align: center;
  margin-bottom: 32px;
}

/* Logo容器 */
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

/* Logo图标 */
.logo-icon {
  font-size: 32px;
  margin-right: 12px;
}

/* Logo文本 */
.logo-text {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #3498db, #9b59b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 注册标题 */
.register-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

/* 注册副标题 */
.register-subtitle {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
}

/* 表单样式 */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 全局错误消息 */
.error-message {
  background-color: #fef5f5;
  border: 1px solid #ffd8d8;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  color: #e74c3c;
  font-size: 14px;
}

/* 错误图标 */
.error-icon {
  margin-right: 8px;
  font-size: 16px;
}

/* 表单组 */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 表单标签 */
.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
}

/* 输入容器 */
.input-wrapper {
  position: relative;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  background-color: #ffffff;
}

/* 输入容器聚焦状态 */
.input-wrapper-focused {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

/* 输入容器错误状态 */
.input-wrapper-error {
  border-color: #e74c3c;
}

/* 表单输入框 */
.form-input {
  width: 100%;
  padding: 14px 16px;
  padding-right: 48px;
  font-size: 16px;
  border: none;
  outline: none;
  background: transparent;
  color: #2c3e50;
}

/* 输入框占位符样式 */
.form-input::placeholder {
  color: #94a3b8;
}

/* 输入图标 */
.input-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #94a3b8;
}

/* 验证提示 */
.validation-hint {
  font-size: 12px;
  padding-left: 4px;
}

/* 错误提示 */
.error-hint {
  color: #e74c3c;
}

/* 成功提示 */
.success-hint {
  color: #27ae60;
  display: flex;
  align-items: center;
}

/* 成功图标 */
.success-icon {
  margin-right: 4px;
}

/* 验证码输入容器 */
.code-input-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* 验证码输入框 */
.code-input {
  flex: 1;
  padding-right: 48px !important;
}

/* 发送验证码按钮 */
.send-code-button {
  padding: 14px 20px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 12px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: 120px;
}

/* 发送验证码按钮悬停状态 */
.send-code-button:hover:not(:disabled) {
  background-color: #2980b9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

/* 发送验证码按钮禁用状态 */
.send-code-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 密码强度指示器 */
.password-strength {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

/* 强度条容器 */
.strength-bars {
  display: flex;
  gap: 4px;
  flex: 1;
}

/* 强度条 */
.strength-bar {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background-color: #ecf0f1;
  transition: all 0.2s ease;
}

/* 弱密码 */
.strength-weak {
  background-color: #e74c3c;
}

/* 中等密码 */
.strength-medium {
  background-color: #f39c12;
}

/* 强密码 */
.strength-strong {
  background-color: #27ae60;
}

/* 强度文本 */
.strength-text {
  font-size: 12px;
  color: #7f8c8d;
  min-width: 40px;
}

/* 密码切换按钮 */
.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  font-size: 16px;
}

/* 密码切换按钮悬停状态 */
.password-toggle:hover {
  background-color: #f1f5f9;
}

/* 用户协议部分 */
.agreement-section {
  margin-bottom: 8px;
}

/* 协议复选框 */
.agreement-checkbox {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  font-size: 14px;
  color: #7f8c8d;
}

/* 协议复选框输入 */
.terms-checkbox {
  margin-top: 2px;
  margin-right: 8px;
  cursor: pointer;
}

/* 协议文本 */
.agreement-text {
  flex: 1;
  line-height: 1.5;
}

/* 协议链接 */
.agreement-text a {
  color: #3498db;
  text-decoration: none;
}

/* 协议链接悬停状态 */
.agreement-text a:hover {
  text-decoration: underline;
}

/* 注册按钮 */
.register-button {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

/* 注册按钮悬停状态 */
.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(52, 152, 219, 0.4);
  background: linear-gradient(135deg, #2980b9, #1f6aa5);
}

/* 注册按钮禁用状态 */
.register-button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 加载动画 */
.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 登录入口 */
.login-section {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #7f8c8d;
}

/* 登录链接 */
.login-link {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
  transition: color 0.2s ease;
}

/* 登录链接悬停状态 */
.login-link:hover {
  color: #2980b9;
  text-decoration: underline;
}

/* 复选框样式 */
.checkmark {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  margin-right: 8px;
  margin-top: 2px;
  transition: all 0.2s ease;
  position: relative;
}

/* 复选框选中状态 */
.terms-checkbox:checked + .checkmark {
  background-color: #3498db;
  border-color: #3498db;
}

/* 复选框选中标记 */
.terms-checkbox:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .register-page {
    padding: 16px;
  }
  
  .register-card {
    padding: 32px 24px;
  }
  
  .form-input {
    font-size: 14px;
    padding: 12px 16px;
    padding-right: 44px;
  }
  
  .send-code-button {
    padding: 12px 16px;
    font-size: 13px;
    min-width: 100px;
  }
  
  .register-button {
    padding: 14px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .register-card {
    padding: 24px 20px;
    border-radius: 16px;
  }
  
  .logo-text {
    font-size: 20px;
  }
  
  .register-title {
    font-size: 18px;
  }
  
  .code-input-container {
    flex-direction: column;
  }
  
  .send-code-button {
    width: 100%;
  }
}
</style>