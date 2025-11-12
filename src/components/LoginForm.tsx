import React, { useState } from 'react';
import { Form, Input, Button, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';
import { LoginCredentials, RegisterCredentials } from '../types/user';
import './LoginForm.css'; // 创建一个对应的 CSS 文件

const { Title, Link } = Typography;

interface LoginFormProps {
  onSuccess: () => void; // 登录/注册成功后的回调
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const { login, register, loading, clearError } = useAuthStore();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      let success = false;

      if (isRegisterMode) {
        const credentials: RegisterCredentials = {
          email: values.email,
          password: values.password,
          name: values.name,
        };
        success = await register(credentials);
      } else {
        const credentials: LoginCredentials = {
          email: values.email,
          password: values.password,
        };
        success = await login(credentials);
      }

      if (success) {
        onSuccess(); // 调用成功回调，例如关闭模态框或重定向
        form.resetFields();
      }
    } catch (validationError) {
      console.error('表单验证失败:', validationError);
      // Ant Design 会自动显示验证错误
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    form.resetFields();
    clearError(); // 切换模式时清除之前的错误
  };

  return (
    <div className="login-form-container">
      <Title level={2} className="login-title">
        {isRegisterMode ? '注册' : '登录'}
      </Title>
      <Form
        form={form}
        name="auth"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        className="login-form"
      >
        {isRegisterMode && (
          <Form.Item
            name="name"
            rules={[{ required: true, message: '请输入您的姓名!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="姓名" />
          </Form.Item>
        )}
        <Form.Item
          name="email"
          rules={[{ required: true, message: '请输入您的邮箱!' }, { type: 'email', message: '请输入有效的邮箱地址!' }]}
        >
          <Input prefix={<MailOutlined />} placeholder="邮箱" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入您的密码!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="密码" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
            {isRegisterMode ? '注册' : '登录'}
          </Button>
        </Form.Item>
        <Space>
          {isRegisterMode ? '已有账号?' : '还没有账号?'}
          <Link onClick={toggleMode}>
            {isRegisterMode ? '去登录' : '去注册'}
          </Link>
        </Space>
      </Form>
    </div>
  );
};
