<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>欢迎回来</h2>
        <p>登录您的账号，开始摄影创作之旅</p>
      </div>
      
      <form class="login-form" @submit.prevent="handleLogin">
        <!-- 错误提示 -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <!-- 用户名输入框 -->
        <div class="form-group">
          <label for="username" class="form-label">用户名</label>
          <input
            type="text"
            id="username"
            v-model="username"
            class="form-input"
            :class="{ 'input-focused': usernameFocus }"
            placeholder="请输入用户名"
            @focus="usernameFocus = true"
            @blur="usernameFocus = false"
          />
        </div>
        
        <!-- 密码输入框 -->
        <div class="form-group">
          <label for="password" class="form-label">密码</label>
          <div class="password-input-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              class="form-input password-input"
              :class="{ 'input-focused': passwordFocus }"
              placeholder="请输入密码"
              @focus="passwordFocus = true"
              @blur="passwordFocus = false"
            />
            <button
              type="button"
              class="password-toggle"
              @click="togglePasswordVisibility"
              aria-label="切换密码可见性"
            >
              {{ showPassword ? '隐藏' : '显示' }}
            </button>
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
          :disabled="isLoading"
        >
          <span v-if="isLoading">登录中...</span>
          <span v-else>登录</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
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

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// 处理忘记密码
const handleForgotPassword = () => {
  // 仅作界面展示，实际应用中应跳转到忘记密码页面
  alert('忘记密码功能正在开发中...');
};

// 处理登录
const handleLogin = async () => {
  // 清除之前的错误信息
  errorMessage.value = '';
  
  // 简单的表单验证
  if (!username.value.trim()) {
    errorMessage.value = '请输入用户名';
    return;
  }
  
  if (!password.value) {
    errorMessage.value = '请输入密码';
    return;
  }
  
  // 设置加载状态
  isLoading.value = true;
  
  try {
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 调用登录方法
    const loginSuccess = userStore.login(username.value, password.value);
    
    if (loginSuccess) {
      // 登录成功，跳转到首页
      router.push('/');
    } else {
      // 登录失败，显示错误信息
      errorMessage.value = '用户名或密码错误';
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
</script>

<style>
/* 登录容器样式 */
.login-container {
  min-height: 100vh;
  background-color: #F8F9FA;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

/* 登录卡片样式 */
.login-card {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 400px;
  padding: 32px;
}

/* 登录头部样式 */
.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h2 {
  color: #212529;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.login-header p {
  color: #6C757D;
  font-size: 14px;
}

/* 登录表单样式 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 错误提示样式 */
.error-message {
  background-color: #F8D7DA;
  color: #DC3545;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

/* 表单组样式 */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 表单标签样式 */
.form-label {
  color: #495057;
  font-size: 14px;
  font-weight: 500;
}

/* 表单输入框样式 */
.form-input {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  color: #212529;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #0D6EFD;
}

/* 输入框焦点样式 */
.input-focused {
  border-color: #0D6EFD;
}

/* 密码输入框包装器 */
.password-input-wrapper {
  position: relative;
}

.password-input {
  padding-right: 60px;
}

/* 密码可见性切换按钮 */
.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6C757D;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.password-toggle:hover {
  color: #0D6EFD;
  background-color: #F8F9FA;
}

/* 表单选项样式 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

/* 记住我样式 */
.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.remember-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #0D6EFD;
}

.remember-text {
  color: #6C757D;
  font-size: 14px;
}

/* 忘记密码链接样式 */
.forgot-password {
  color: #0D6EFD;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: #0B5ED7;
  text-decoration: underline;
}

/* 登录按钮样式 */
.login-button {
  background-color: #0D6EFD;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 12px;
}

.login-button:hover:not(:disabled) {
  background-color: #0B5ED7;
}

.login-button:disabled {
  background-color: #ADB5BD;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
    padding: 24px;
  }
  
  .login-header h2 {
    font-size: 20px;
  }
  
  .form-input {
    font-size: 14px;
  }
  
  .login-button {
    font-size: 14px;
  }
}
</style>