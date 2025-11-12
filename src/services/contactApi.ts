import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { Contact, ContactCreate, ContactUpdate, ApiResponse, ContactListResponse, ContactQueryParams } from '../types/contact';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证 token
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {

    if (response.data.code !== 200) {
      console.error('API Error:', response.data.message);
    }
    return response;
  },
  (error: AxiosError) => {
    // 统一错误处理
    if (error.response) {
      // 服务器返回了错误响应
      console.error('Request Error:', error.response.status, error.response.data);
      // 可以根据不同的状态码进行不同的处理
      switch (error.response.status) {
        case 400:
          alert('Bad Request: ' + (error.response.data.message || ''));
          break;
        case 401:
          alert('Unauthorized: 请重新登录。');
          // router.push('/login');
          break;
        case 403:
          alert('Forbidden: 您没有权限访问。');
          break;
        case 404:
          alert('Not Found: 请求的资源不存在。');
          break;
        case 500:
          alert('Server Error: 服务器内部错误。');
          break;
        default:
          alert('An unexpected error occurred: ' + (error.response.data.message || error.message));
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('No Response:', error.request);
      alert('Network Error: 请检查您的网络连接。');
    } else {
      // 其他错误
      console.error('Error:', error.message);
      alert('An unknown error occurred: ' + error.message);
    }
    return Promise.reject(error);
  }
);

export const contactApi = {
  getContacts: async (params?: ContactQueryParams): Promise<ApiResponse<ContactListResponse>> => {
    const response = await axiosInstance.get('/contacts', { params });
    return response.data;
  },

  getContactById: async (id: string): Promise<ApiResponse<Contact>> => {
    const response = await axiosInstance.get(`/contacts/${id}`);
    return response.data;
  },

  createContact: async (contact: ContactCreate): Promise<ApiResponse<Contact>> => {
    const response = await axiosInstance.post('/contacts', contact);
    return response.data;
  },

  updateContact: async (id: string, contact: ContactUpdate): Promise<ApiResponse<Contact>> => {
    const response = await axiosInstance.put(`/contacts/${id}`, contact);
    return response.data;
  },

  deleteContact: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete(`/contacts/${id}`);
    return response.data;
  },

  toggleFavoriteStatus: async (id: string): Promise<ApiResponse<Contact>> => {
    const response = await axiosInstance.patch(`/contacts/${id}/favorite`);
    return response.data;
  },
};
