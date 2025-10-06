<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>摄影社区</h1>
        <p>捕捉精彩瞬间，分享艺术之美</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">用户名</label>
          <input
            id="username"
            type="text"
            v-model="username"
            class="form-input"
            placeholder="请输入用户名"
          />
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">密码</label>
          <div class="password-input-container">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              class="form-input password-input"
              placeholder="请输入密码"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="password-toggle"
              aria-label="显示/隐藏密码"
            >
              {{ showPassword ? '👁️‍🗨️' : '👁️' }}
            </button>
          </div>
        </div>
        
        <div class="form-options">
          <label class="remember-me">
            <input
              type="checkbox"
              v-model="rememberMe"
              class="form-checkbox"
            />
            <span class="remember-me-text">记住我</span>
          </label>
          
          <button type="button" class="forgot-password">忘记密码？</button>
        </div>
        
        <button type="submit" class="btn btn-primary w-100 login-button">
          {{ isLoggingIn ? '登录中...' : '登录' }}
        </button>
        
        <div v-if="loginError" class="error-message">
          {{ loginError }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'

const router = useRouter()
const userStore = useUserStore()

// 表单数据
const username = ref('admin')
const password = ref('123456')
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoggingIn = ref(false)

// 登录错误信息
const loginError = ref('')

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 处理登录
const handleLogin = async () => {
  if (!username.value || !password.value) {
    loginError.value = '请输入用户名和密码'
    return
  }
  
  isLoggingIn.value = true
  loginError.value = ''
  
  try {
    // 模拟登录请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const success = userStore.login(username.value, password.value, rememberMe.value)
    
    if (success) {
      // 登录成功，跳转到主页
      router.push('/')
    } else {
      // 登录失败，显示错误信息
      loginError.value = userStore.loginError
    }
  } catch (error) {
    loginError.value = '登录失败，请稍后重试'
    console.error('登录错误:', error)
  } finally {
    isLoggingIn.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--background-color);
  padding: var(--spacing-md);
}

.login-card {
  background-color: white;
  border: 1px solid var(--light-gray);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-medium);
  padding: var(--spacing-xl);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.login-header h1 {
  font-size: 2rem;
  color: var(--dark-color);
  margin-bottom: var(--spacing-xs);
}

.login-header p {
  color: var(--medium-gray);
  font-size: 0.875rem;
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dark-gray);
}

.form-input {
  display: block;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--light-gray);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--dark-color);
  background-color: white;
  transition: all var(--transition-normal);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.2);
}

.password-input-container {
  position: relative;
}

.password-input {
  padding-right: 40px;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.remember-me {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.remember-me-text {
  margin-left: var(--spacing-xs);
  font-size: 0.875rem;
  color: var(--medium-gray);
}

.forgot-password {
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
  text-decoration: none;
}

.forgot-password:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

.login-button {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: 0.875rem;
  font-weight: 500;
  width: 100%;
}

.error-message {
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.2);
  border-radius: var(--radius-md);
  color: var(--danger-color);
  font-size: 0.875rem;
  text-align: center;
}

/* 移动端适配 */
@media (max-width: 575.98px) {
  .login-card {
    max-width: 100%;
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-light);
  }
}
</style>
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
import { ref, onMounted } from 'vue'
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

// 组件挂载时的其他初始化代码
onMounted(() => {
  // 确保文字清晰度
  document.querySelectorAll('.login-card *').forEach(el => {
    if (el instanceof HTMLElement) {
      el.style.filter = 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))';
    }
  });
});
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
  background-color: #f5f5f5;
  padding: 20px;
  overflow: hidden;
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
  transition: var(--transition);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: fadeInUp 0.8s ease-out;
}

.login-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  transform: translateY(-5px);
}