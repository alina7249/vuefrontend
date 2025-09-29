git config --global user.name '贾思阳' <template>
  <div class="login-container">
    <!-- 主登录卡片 -->
    <div class="login-card">
      <!-- 品牌信息 -->
      <div class="brand-section">
        <h1>TechLearn Hub</h1>
        <p>请登录您的账户</p>
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
</script>

<style scoped>
/* 正规矩形界面配色方案 */
:root {
  --primary-color: #007bff;
  --primary-dark: #0056b3;
  --bg-color: #f8f9fa;
  --card-bg: #ffffff;
  --text-primary: #333333;
  --text-secondary: #6c757d;
  --border-color: #dee2e6;
  --error-color: #dc3545;
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 基础布局 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--bg-color);
  padding: 20px;
}

/* 登录卡片 - 矩形设计 */
.login-card {
  width: 400px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
  padding: 30px;
  box-sizing: border-box;
}

/* 品牌信息区域 */
.brand-section {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.brand-section h1 {
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.brand-section p {
  color: var(--text-secondary);
  font-size: 14px;
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
  margin-bottom: 6px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: var(--primary-color);
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
  gap: 6px;
  cursor: pointer;
}

.remember-me input[type="checkbox"] {
  width: 14px;
  height: 14px;
  cursor: pointer;
}

.remember-me span {
  color: var(--text-secondary);
  font-size: 13px;
}

.forgot-password {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 13px;
}

.forgot-password:hover {
  text-decoration: underline;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  height: 40px;
  background: var(--primary-color);
  color: white;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.login-btn:hover {
  background: var(--primary-dark);
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
  font-size: 12px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.register-option {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.register-option span {
  color: var(--text-secondary);
  font-size: 13px;
}

.register-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  margin-left: 4px;
}

.register-link:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
    width: 100%;
    padding: 24px;
  }
}
</style>