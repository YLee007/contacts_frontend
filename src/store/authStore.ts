import { create } from 'zustand';
import { User, LoginCredentials, RegisterCredentials } from '../types/user';
import { authApi } from '../services/authApi';
import { message } from 'antd'; // 引入 Ant Design 的 message 组件

interface AuthState {
  user: User | null;
  sessionToken: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  // 从本地存储加载会话
  loadSession: () => void;
  // 清除错误状态
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  sessionToken: null,
  isLoggedIn: false,
  loading: false,
  error: null,

  loadSession: () => {
    const storedToken = localStorage.getItem('sessionToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser && storedUser !== "undefined") { // 添加检查 storedUser !== "undefined"
      try {
        const user: User = JSON.parse(storedUser);
        set({ sessionToken: storedToken, user, isLoggedIn: true });
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('user');
      }
    }
  },

  login: async (credentials: LoginCredentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      if (response.code === 200 && response.data) {
        localStorage.setItem('sessionToken', response.data.sessionToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        set({ user: response.data.user, sessionToken: response.data.sessionToken, isLoggedIn: true, loading: false });
        message.success('登录成功！');
        return true;
      } else {
        const errorMessage = response.message || '登录失败';
        set({ error: errorMessage, loading: false });
        message.error(errorMessage);
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || '登录失败，请重试。';
      set({ error: errorMessage, loading: false });
      message.error(errorMessage);
      return false;
    }
  },

  register: async (credentials: RegisterCredentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.register(credentials);
      if (response.code === 201 && response.data) {
        set({ loading: false });
        message.success('注册成功，请登录！');
        return true;
      } else {
        const errorMessage = response.message || '注册失败';
        set({ error: errorMessage, loading: false });
        message.error(errorMessage);
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || '注册失败，请重试。';
      set({ error: errorMessage, loading: false });
      message.error(errorMessage);
      return false;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      console.log("AuthStore: Attempting to logout...");
      await authApi.logout();
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('user');
      set({ user: null, sessionToken: null, isLoggedIn: false, loading: false });
      message.success('已退出登录。');
      console.log("AuthStore: Logout successful. isLoggedIn:", get().isLoggedIn);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || '退出登录失败，请重试。';
      set({ error: errorMessage, loading: false });
      message.error(errorMessage);
      console.error("AuthStore: Logout failed.", err);
    }
  },

  clearError: () => set({ error: null }),
}));
