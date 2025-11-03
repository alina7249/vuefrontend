import { reactive, readonly, computed } from 'vue';

// 创建响应式状态
const state = reactive({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
});

// 初始化时从localStorage恢复用户状态
const initializeAuth = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      state.user = parsedUser;
      state.isAuthenticated = true;
    } catch (err) {
      state.error = 'Failed to parse user data';
      console.error('Error parsing user data:', err);
      localStorage.removeItem('user');
    }
  }
  state.loading = false;
};

// 登录函数
const login = async (email, password) => {
  state.loading = true;
  state.error = null;
  try {
    // 这里模拟API调用
    // 实际项目中，这里应该是对后端API的请求
    if (email && password) {
      // 模拟用户数据
      const mockUser = {
        id: '1',
        email,
        username: email.split('@')[0],
        avatar: `https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20${email.split('@')[0]}&sign=random-sign`,
        role: 'user',
        createdAt: new Date().toISOString(),
        membershipLevel: 'standard',
      };
      
      // 保存到localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      state.user = mockUser;
      state.isAuthenticated = true;
    } else {
      throw new Error('Email and password are required');
    }
  } catch (err) {
    state.error = err.message || 'Login failed';
    throw err;
  } finally {
    state.loading = false;
  }
};

// 登出函数
const logout = () => {
  localStorage.removeItem('user');
  state.user = null;
  state.isAuthenticated = false;
};

// 注册函数
const register = async (userData) => {
  state.loading = true;
  state.error = null;
  try {
    // 模拟API调用
    // 实际项目中，这里应该是对后端API的请求
    const { email, username } = userData;
    
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      avatar: `https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20${username || email.split('@')[0]}&sign=random-sign`,
      role: 'user',
      createdAt: new Date().toISOString(),
      membershipLevel: 'standard',
    };
    
    // 保存到localStorage
    localStorage.setItem('user', JSON.stringify(newUser));
    state.user = newUser;
    state.isAuthenticated = true;
    
    return newUser;
  } catch (err) {
    state.error = err.message || 'Registration failed';
    throw err;
  } finally {
    state.loading = false;
  }
};

// 更新用户信息
const updateUser = (updates) => {
  if (state.user) {
    const updatedUser = { ...state.user, ...updates };
    state.user = updatedUser;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }
  return null;
};

// 默认导出的认证功能
export const useAuth = () => ({
  state: readonly(state),
  login,
  logout,
  register,
  updateUser,
  isAuthenticated: computed(() => state.isAuthenticated),
  user: computed(() => state.user)
});

// 初始化认证状态
export const initAuth = initializeAuth;