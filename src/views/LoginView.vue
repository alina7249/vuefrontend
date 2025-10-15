<template>
  <div class="login-page">
    <!-- 背景装饰元素 -->
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
    
    <!-- 登录卡片 -->
    <div class="login-card">
      <div class="login-card-inner">
        <!-- 登录头部 -->
        <div class="login-header">
          <div class="logo-container">
            <div class="logo-icon">📸</div>
            <h1 class="logo-text">PhotoShare</h1>
          </div>
          <h2 class="login-title">欢迎回来</h2>
          <p class="login-subtitle">请登录您的账号，继续您的摄影创作之旅</p>
        </div>
        
        <!-- 登录表单 -->
        <form class="login-form" @submit.prevent="handleLogin">
          <!-- 全局错误提示 -->
          <div v-if="errorMessage" class="error-message">
            <i class="error-icon">⚠️</i>
            {{ errorMessage }}
          </div>
          
          <!-- 用户名输入框 -->
          <div class="form-group">
            <label for="username" class="form-label">用户名</label>
            <div class="input-wrapper" :class="{ 'input-wrapper-focused': usernameFocus, 'input-wrapper-error': usernameError }">
              <input
                type="text"
                id="username"
                v-model="username"
                class="form-input"
                placeholder="请输入用户名"
                @focus="handleUsernameFocus"
                @blur="handleUsernameBlur"
                @input="validateUsername"
              />
              <div class="input-icon">
                👤
              </div>
            </div>
            <div v-if="usernameError" class="validation-hint error-hint">
              {{ usernameErrorMessage }}
            </div>
            <div v-else-if="username && !usernameError && usernameFocus" class="validation-hint success-hint">
              <i class="success-icon">✓</i> 格式正确
            </div>
          </div>
          
          <!-- 密码输入框 -->
          <div class="form-group">
            <label for="password" class="form-label">密码</label>
            <div class="input-wrapper" :class="{ 'input-wrapper-focused': passwordFocus, 'input-wrapper-error': passwordError }">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                class="form-input"
                placeholder="请输入密码"
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
          
          <!-- 记住我和忘记密码 -->
          <div class="form-options">
            <label class="remember-me">
              <input
                type="checkbox"
                v-model="rememberMe"
                class="remember-checkbox"
              />
              <span class="checkmark"></span>
              <span class="remember-text">记住我</span>
            </label>
            <a href="#" class="forgot-password" @click.prevent="handleForgotPassword">
              忘记密码？
            </a>
          </div>
          
          <!-- 登录按钮 -->
          <button
            type="submit"
            class="login-button"
            :disabled="!isFormValid || isLoading"
          >
            <span v-if="isLoading" class="loading-spinner"></span>
            <span v-else>登录</span>
          </button>
        </form>
        
        <!-- 注册入口 -->
        <div class="register-section">
          <span class="register-text">还没有账号？</span>
          <a href="#" class="register-link" @click.prevent="handleRegister">
            立即注册
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

// 表单数据
const username = ref('admin');
const password = ref('123456');
const rememberMe = ref(false);
const showPassword = ref(false);

// 状态变量
const isLoading = ref(false);
const errorMessage = ref('');
const usernameFocus = ref(false);
const passwordFocus = ref(false);
const usernameError = ref(false);
const passwordError = ref(false);
const usernameErrorMessage = ref('');
const passwordStrength = ref(0);

// 移除邮箱判断，不再需要

// 表单验证状态
const isFormValid = computed(() => {
  return username.value.trim() && 
         password.value && 
         !usernameError.value && 
         !passwordError.value;
});

// 处理用户名输入框焦点
const handleUsernameFocus = () => {
  usernameFocus.value = true;
  validateUsername();
};

const handleUsernameBlur = () => {
  usernameFocus.value = false;
  if (username.value.trim()) {
    validateUsername();
  }
};

// 验证用户名格式
const validateUsername = () => {
  // 用户名验证规则：3-20位字母、数字、下划线
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  
  if (!username.value.trim()) {
    usernameError.value = false;
    usernameErrorMessage.value = '';
    return;
  }
  
  if (!usernameRegex.test(username.value)) {
    usernameError.value = true;
    usernameErrorMessage.value = '用户名格式不正确（3-20位字母、数字、下划线）';
  } else {
    usernameError.value = false;
    usernameErrorMessage.value = '';
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
  passwordError.value = password.value.length > 0 && password.value.length < 8;
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
  if (password.value.length < 8) return '密码太短';
  if (passwordStrength.value === 1) return '弱';
  if (passwordStrength.value === 2) return '中等';
  return '强';
};

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// 处理忘记密码
const handleForgotPassword = () => {
  // 仅作界面展示，实际应用中应跳转到忘记密码页面
  alert('忘记密码功能正在开发中...');
};

// 处理注册
const handleRegister = () => {
  // 跳转到注册页面
  router.push('/register');
};

// 处理登录
const handleLogin = async () => {
  // 清除之前的错误信息
  errorMessage.value = '';
  
  // 表单验证
  if (!username.value.trim()) {
    usernameError.value = true;
    usernameErrorMessage.value = '请输入用户名';
    return;
  }
  
  if (!password.value) {
    passwordError.value = true;
    return;
  }
  
  // 设置加载状态
  isLoading.value = true;
  
  try {
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 调用登录方法
    const loginSuccess = userStore.login(username.value, password.value);
    
    if (loginSuccess) {
      // 确保localStorage正确设置
      localStorage.setItem('isLoggedIn', 'true');
      
      // 登录成功，跳转到首页
      router.push('/');
    } else {
      // 登录失败，显示错误信息
      errorMessage.value = '账号或密码错误，请重试';
    }
  } catch (error) {
    // 处理异常情况
    errorMessage.value = '登录失败，请稍后重试';
    console.error('登录错误:', error);
  } finally {
    // 重置加载状态
    isLoading.value = false;
  }
};

// 监听密码变化，实时更新强度
watch(password, () => {
  validatePassword();
});
</script>

<style scoped>
/* 全局样式重置和基础设置 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 登录页面容器 */
.login-page {
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

/* 登录卡片 */
.login-card {
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3498db, #9b59b6, #1abc9c);
  animation: gradientShift 5s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.login-card-inner {
  position: relative;
  z-index: 1;
}

/* 登录头部 */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.logo-icon {
  font-size: 32px;
  margin-right: 10px;
  animation: bounce 2s ease infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.logo-text {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(90deg, #3498db, #9b59b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 14px;
  color: #7f8c8d;
}

/* 登录表单 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 错误提示 */
.error-message {
  background: linear-gradient(135deg, #ffebee, #ffcdd2);
  color: #c62828;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: slideIn 0.3s ease;
}

.error-icon {
  font-size: 16px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 表单组 */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  color: #2c3e50;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
}

/* 输入框容器 */
.input-wrapper {
  position: relative;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: #fff;
  overflow: hidden;
}

.input-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #3498db, #9b59b6);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.input-wrapper-focused {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.input-wrapper-focused::after {
  transform: scaleX(1);
}

.input-wrapper-error {
  border-color: #e74c3c;
}

.input-wrapper-error::after {
  background: #e74c3c;
  transform: scaleX(1);
}

/* 表单输入框 */
.form-input {
  width: 100%;
  padding: 14px 16px 14px 44px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  color: #2c3e50;
  background: transparent;
  outline: none;
  transition: color 0.2s ease;
}

.form-input::placeholder {
  color: #bdc3c7;
}

/* 输入框图标 */
.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: #7f8c8d;
  transition: color 0.3s ease;
}

.input-wrapper-focused .input-icon {
  color: #3498db;
}

/* 密码切换按钮 */
.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.3s ease;
  color: #7f8c8d;
}

.password-toggle:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #3498db;
}

/* 验证提示 */
.validation-hint {
  font-size: 12px;
  padding: 4px 0;
}

.error-hint {
  color: #e74c3c;
}

.success-hint {
  color: #27ae60;
  display: flex;
  align-items: center;
  gap: 4px;
}

.success-icon {
  font-size: 12px;
}

/* 密码强度指示器 */
.password-strength {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
}

.strength-bars {
  display: flex;
  gap: 6px;
  height: 4px;
}

.strength-bar {
  flex: 1;
  background: #ecf0f1;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: left;
  transform: scaleX(0);
}

.strength-bar.strength-weak {
  background: #e74c3c;
  transform: scaleX(1);
  animation: grow 0.5s ease;
}

.strength-bar.strength-medium {
  background: #f39c12;
  transform: scaleX(1);
  animation: grow 0.5s ease 0.2s;
}

.strength-bar.strength-strong {
  background: #27ae60;
  transform: scaleX(1);
  animation: grow 0.5s ease 0.4s;
}

@keyframes grow {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.strength-text {
  font-size: 12px;
  color: #7f8c8d;
  transition: color 0.3s ease;
}

.strength-bar.strength-weak ~ .strength-text {
  color: #e74c3c;
}

.strength-bar.strength-medium ~ .strength-text {
  color: #f39c12;
}

.strength-bar.strength-strong ~ .strength-text {
  color: #27ae60;
}

/* 表单选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

/* 记住我复选框 */
.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
}

.remember-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  height: 18px;
  width: 18px;
  background-color: #f5f6fa;
  border: 2px solid #dcdde1;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.remember-me:hover .checkmark {
  background-color: #e1e3e8;
}

.remember-checkbox:checked ~ .checkmark {
  background-color: #3498db;
  border-color: #3498db;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 4px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.remember-checkbox:checked ~ .checkmark:after {
  display: block;
}

.remember-text {
  color: #7f8c8d;
  font-size: 14px;
  transition: color 0.2s ease;
}

.remember-me:hover .remember-text {
  color: #3498db;
}

/* 忘记密码链接 */
.forgot-password {
  color: #3498db;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.forgot-password::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #3498db;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.forgot-password:hover {
  color: #2980b9;
}

.forgot-password:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* 登录按钮 */
.login-button {
  background: linear-gradient(135deg, #3498db, #9b59b6);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(52, 152, 219, 0.3);
}

.login-button:hover:not(:disabled)::before {
  left: 100%;
}

.login-button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 加载动画 */
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 注册入口 */
.register-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #ecf0f1;
}

.register-text {
  color: #7f8c8d;
  font-size: 14px;
}

.register-link {
  color: #3498db;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.register-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #3498db;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.register-link:hover {
  color: #2980b9;
}

.register-link:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-page {
    padding: 16px;
  }
  
  .login-card {
    padding: 24px;
    border-radius: 16px;
  }
  
  .logo-icon {
    font-size: 24px;
  }
  
  .logo-text {
    font-size: 24px;
  }
  
  .login-title {
    font-size: 20px;
  }
  
  .form-input {
    font-size: 14px;
    padding: 12px 14px 12px 40px;
  }
  
  .login-button {
    height: 44px;
    font-size: 14px;
  }
  
  .shape-1, .shape-2, .shape-3 {
    transform: scale(0.7);
  }
}
</style>