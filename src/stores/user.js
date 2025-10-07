import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    username: '',
    userInfo: null,
    token: '',
  }),

  getters: {
    isAuthenticated: (state) => state.isLoggedIn,
  },

  actions: {
    // 登录方法
    login(username, password) {
      // 在实际应用中，这里应该调用API进行身份验证
      // 这里使用模拟数据进行演示
      if (username === 'admin' && password === '123456') {
        this.isLoggedIn = true;
        this.username = username;
        this.token = 'mock-jwt-token';
        this.userInfo = {
          id: 1,
          username: 'admin',
          avatar: '',
          role: 'admin',
          bio: '摄影爱好者',
          joinDate: '2023-01-01',
        };

        // 保存登录状态到本地存储
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('token', this.token);
        
        return true;
      } else {
        return false;
      }
    },

    // 登出方法
    logout() {
      this.isLoggedIn = false;
      this.username = '';
      this.token = '';
      this.userInfo = null;

      // 清除本地存储中的登录状态
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      localStorage.removeItem('token');
    },

    // 检查登录状态
    checkLoginStatus() {
      const storedLoggedIn = localStorage.getItem('isLoggedIn');
      const storedUsername = localStorage.getItem('username');
      const storedToken = localStorage.getItem('token');

      if (storedLoggedIn === 'true' && storedUsername && storedToken) {
        this.isLoggedIn = true;
        this.username = storedUsername;
        this.token = storedToken;
        // 在实际应用中，这里应该重新获取用户信息
        this.userInfo = {
          id: 1,
          username: storedUsername,
          avatar: '',
          role: 'admin',
          bio: '摄影爱好者',
          joinDate: '2023-01-01',
        };
      }
    },

    // 更新用户信息
    updateUserInfo(info) {
      if (this.isLoggedIn) {
        this.userInfo = { ...this.userInfo, ...info };
      }
    },
  },
});