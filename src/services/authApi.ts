import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/user';
import { ApiResponse } from '../types'; // 从 index.ts 或其他公共类型文件导入 ApiResponse

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// 请求拦截器：如果存在 sessionToken，则添加到 Authorization 头
axiosInstance.interceptors.request.use(
  (config) => {
    const sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken) {
      config.headers.Authorization = `Bearer ${sessionToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：统一错误处理 (可选，联系人API已做类似处理)
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    if (response.data.code !== 200 && response.data.code !== 201) {
      console.error('API Error:', response.data.message);
    }
    return response;
  },
  (error) => {
    // 可以在这里做一些全局的错误处理，例如重定向到登录页
    console.error('Auth API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (credentials: RegisterCredentials): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.post('/auth/register', credentials);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },
};
