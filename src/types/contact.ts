/**
 * 联系人类型定义
 * 严格的 TypeScript 类型定义，确保类型安全
 */

/**
 * 联系人接口
 */
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  company?: string; // 添加公司字段
  tags?: string[]; // 添加 tags 属性
  isFavorite: boolean; // Add isFavorite field
  avatar?: string; // Add avatar field
  notes?: string; // Add notes field
}

export interface ContactCreate {
  name: string;
  email: string;
  phone: string;
  address?: string;
  company?: string; // 添加公司字段
  tags?: string[]; // 添加 tags 属性
  isFavorite?: boolean; // Add isFavorite field
  notes?: string; // Add notes field
}

export interface ContactUpdate {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string; // 添加公司字段
  tags?: string[]; // 添加 tags 属性
  isFavorite?: boolean; // Add isFavorite field
  notes?: string; // Add notes field
}

/**
 * 联系人列表查询参数
 */
export interface ContactQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  order?: 'asc' | 'desc';
  tags?: string | string[]; // Allow string or string array for tags
  isFavorite?: boolean;
}

/**
 * 分页信息
 */
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 联系人列表响应
 */
export interface ContactListResponse {
  contacts: Contact[];
  pagination: Pagination;
}

/**
 * API 响应基础接口
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 排序选项
 */
export type SortOption = {
  label: string;
  value: 'name' | 'createdAt' | 'updatedAt';
  order: 'asc' | 'desc';
};

/**
 * 表单步骤
 */
export interface FormStep {
  title: string;
  description: string;
  fields: string[];
}

