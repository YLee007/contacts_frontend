/**
 * 用户和认证类型定义
 * 严格的 TypeScript 类型定义，确保类型安全
 */

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string; // 密码在发送前可能已经被处理，或者在简化模式下不需要
}

export interface RegisterCredentials {
  email: string;
  password?: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  sessionToken: string; // 简化模式下的会话标识符，实际应用中会是 JWT
}
