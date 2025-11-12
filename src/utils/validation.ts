/**
 * 表单验证工具函数
 */

/**
 * 验证手机号（中国大陆）
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 验证邮箱
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * 验证姓名（2-50字符，不包含特殊字符）
 */
export const validateName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 50;
};

/**
 * 获取验证错误消息
 */
export const getValidationMessage = (
  field: string,
  value: string
): string | null => {
  switch (field) {
    case 'name':
      if (!value) return '请输入姓名';
      if (!validateName(value)) return '姓名长度应为 2-50 个字符';
      return null;

    case 'phone':
      if (!value) return '请输入手机号';
      if (!validatePhone(value)) return '请输入有效的手机号';
      return null;

    case 'email':
      if (value && !validateEmail(value)) return '请输入有效的邮箱地址';
      return null;

    default:
      return null;
  }
};

