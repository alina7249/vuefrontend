import { ref, reactive, provide, inject, type InjectionKey } from 'vue';
import toast from '@/composables/useToast';

// 用户类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  joinDate: string;
  followers: number;
  following: number;
  posts: number;
}

// 认证上下文类型
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, phone: string, password: string) => Promise<boolean>;
}

// 创建注入键
const AuthInjectionKey: InjectionKey<AuthContextType> = Symbol('auth');

// 认证提供者组合式函数
export const useAuthProvider = () => {
  const isAuthenticated = ref<boolean>(localStorage.getItem('isAuthenticated') === 'true');
  
  const savedUser = localStorage.getItem('user');
  const user = ref<User | null>(savedUser ? JSON.parse(savedUser) : null);

  // 登录方法
  const login = async (username: string, password: string): Promise<boolean> => {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟成功登录 - 检查是否为默认admin用户
        if (username === 'admin' && password === '123456') {
          // 创建管理员用户数据
          const adminUser: User = {
            id: 'admin-1',
            username: 'admin',
            email: 'admin@example.com',
            avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=admin%20avatar%20professional&sign=b128ffccccb2deff34af58059c3f52df',
            bio: '影研社管理员',
            joinDate: '2022-01-01',
            followers: 999,
            following: 100,
            posts: 50
          };
          
          user.value = adminUser;
          isAuthenticated.value = true;
          
          // 保存到localStorage
          localStorage.setItem('user', JSON.stringify(adminUser));
          localStorage.setItem('isAuthenticated', 'true');
          
          resolve(true);
        } else if (username && password) {
          // 创建普通用户数据
          const mockUser: User = {
            id: `user-${Date.now()}`,
            username: username,
            email: `${username}@example.com`,
            avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male&sign=92090021266b3aaadfd4d99b36d00763',
            bio: '热爱风光和人像摄影，正在不断学习和进步中',
            joinDate: '2023-01-15',
            followers: 123,
            following: 45,
            posts: 28
          };
          
          user.value = mockUser;
          isAuthenticated.value = true;
          
          // 保存到localStorage
          localStorage.setItem('user', JSON.stringify(mockUser));
          localStorage.setItem('isAuthenticated', 'true');
          
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  };

  // 登出方法
  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    
    // 从localStorage移除
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    
    toast.success('已成功退出登录');
  };

  // 注册方法
  const register = async (username: string, phone: string, password: string): Promise<boolean> => {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟成功注册
        if (username && phone && password) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  };

  // 创建认证上下文
  const authContext: AuthContextType = reactive({
    get isAuthenticated() { return isAuthenticated.value; },
    get user() { return user.value; },
    login,
    logout,
    register
  });

  return {
    authContext,
    provideAuth: () => provide(AuthInjectionKey, authContext)
  };
};

// 导出 useAuth 函数
export const useAuth = () => {
  const auth = inject(AuthInjectionKey);
  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return auth;
};