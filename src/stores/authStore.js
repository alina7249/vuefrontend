import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null
  }),

  actions: {
    // 初始化认证状态
    initializeAuth() {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          this.user = JSON.parse(storedUser);
          this.isAuthenticated = true;
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('user');
        }
      }
    },

    // 登录
    login(credentials) {
      // 这里应该是实际的登录API调用
      // 模拟登录成功
      const mockUser = {
        id: credentials.userId || '1',
        username: credentials.username || 'testuser',
        email: credentials.email || 'test@example.com',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20user%20avatar&sign=bcb6273a0e310c266e722c0131d6e146'
      };
      
      this.user = mockUser;
      this.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return Promise.resolve(mockUser);
    },

    // 注册
    register(userData) {
      // 这里应该是实际的注册API调用
      // 模拟注册成功
      const newUser = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20user%20avatar&sign=bcb6273a0e310c266e722c0131d6e146'
      };
      
      this.user = newUser;
      this.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return Promise.resolve(newUser);
    },

    // 登出
    logout() {
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem('user');
    },

    // 更新用户信息
    updateUser(userData) {
      if (this.user) {
        this.user = { ...this.user, ...userData };
        localStorage.setItem('user', JSON.stringify(this.user));
        return Promise.resolve(this.user);
      }
      return Promise.reject(new Error('No user logged in'));
    }
  },

  getters: {
    // 获取用户ID
    getUserId() {
      return this.user?.id || null;
    },
    
    // 获取用户名
    getUsername() {
      return this.user?.username || '';
    },
    
    // 获取用户头像
    getUserAvatar() {
      return this.user?.avatar || '';
    }
  }
});