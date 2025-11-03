export const useAuthStore = () => {
  // 用户认证相关状态和方法
  return {
    isAuthenticated: false,
    user: null,
    login: () => {},
    logout: () => {},
    register: () => {}
  };
};
