/**
 * ContactForm 组件
 * 联系人表单组件，支持添加和编辑
 *
 * 功能特性：
 * - 步骤向导（多步骤表单）
 * - 实时验证
 * - 自动保存草稿
 * - 表单重置
 * - 响应式布局
 */

import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Steps,
  Space,
  message,
  Select, // 确保导入 Select
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  BankOutlined,
  FileTextOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import type { Contact, ContactCreate, ContactUpdate } from '../types/contact';
import { validatePhone, validateEmail } from '@/utils/validation';
import { contactApi } from '../services/contactApi'; // 导入 contactApi
import './ContactForm.css';

const { TextArea } = Input;

interface ContactFormProps {
  /*编辑模式的联系人数据 */
  contact?: Contact;
  /* 是否显示步骤向导 */
  showSteps?: boolean;
  /* 提交回调 */
  onSubmit: (data: ContactCreate | ContactUpdate) => Promise<void>;
  /* 取消回调 */
  onCancel?: () => void;
  /* 是否加载中 */
  loading?: boolean;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  contact,
  showSteps = true,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  // 移除旧的 tags 状态和 inputTag 状态
  // const [tags, setTags] = useState<string[]>(contact?.tags || []);
  // const [inputTag, setInputTag] = useState('');

  const isEditMode = !!contact;

  /**
   * 表单步骤定义
   */
  const steps = [
    {
      title: '基本信息',
      icon: <UserOutlined />,
      description: '姓名和联系方式',
    },
    {
      title: '详细信息',
      icon: <FileTextOutlined />,
      description: '机构/学校和地址', // 修改 description
    },
    {
      title: '备注标签',
      icon: <FileTextOutlined />,
      description: '备注和分类',
    },
  ];

  /**
   * 初始化表单数据
   */
  useEffect(() => {
    if (contact) {
      form.setFieldsValue({
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        company: contact.company,
        address: contact.address,
        notes: contact.notes,
        tags: contact.tags || [], // 初始化 tags
      });
      // 移除 setTags(contact.tags || []);
    } else {
      form.resetFields();
      setCurrentStep(0);
    }
  }, [contact, form]); // 依赖中移除 setTags

  /**
   * 验证当前步骤
   */
  const validateCurrentStep = async (): Promise<boolean> => {
    try {
      if (currentStep === 0) {
        await form.validateFields(['name', 'phone', 'email']);
      } else if (currentStep === 1) {
        await form.validateFields(['company', 'address']);
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  /**
   * 下一步
   */
  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  /**
   * 上一步
   */
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  /**
   * 提交表单
   */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values before sending:", values);
      const formData: ContactCreate | ContactUpdate = {
        name: values.name,
        email: values.email || '',
        phone: values.phone,
        address: values.address || '',
        company: values.company || '',
        notes: values.notes || '',
        tags: values.tags || [], // 包含 tags 字段
      };

      await onSubmit(formData);
      form.resetFields();
      setCurrentStep(0);
    } catch (error) {
      console.error('表单验证失败:', error);
      message.error('请检查表单填写是否正确'); // 添加 Ant Design 的 message 提示
    }
  };

  /**
   * 取消操作
   */
  const handleCancel = () => {
    form.resetFields();
    setCurrentStep(0);
    onCancel?.();
  };

  /**
   * 渲染第一步：基本信息
   */
  const renderStepOne = () => (
    <div className="form-step">
      <Form.Item
        name="name"
        label="姓名"
        rules={[
          { required: true, message: '请输入姓名' },
          { min: 2, max: 50, message: '姓名长度应为 2-50 个字符' },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="请输入姓名"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="phone"
        label="手机号"
        rules={[
          { required: true, message: '请输入手机号' },
          {
            validator: async (_, value) => {
              if (!value) { return Promise.resolve(); }
              if (!validatePhone(value)) { return Promise.reject(new Error('请输入有效的手机号')); }

              // 如果是编辑模式，且手机号未改变，则跳过唯一性验证
              if (isEditMode && contact?.phone === value) { return Promise.resolve(); }

              // 异步验证手机号唯一性，并添加防抖
              await new Promise(resolve => setTimeout(resolve, 500)); // 实际的防抖延迟

              try {
                const response = await contactApi.getContacts({ search: value });
                if (response.code === 200 && response.data.contacts.length > 0) {
                  return Promise.reject(new Error('该手机号已被注册'));
                }
              } catch (error) {
                console.error('手机号唯一性验证失败:', error);
                return Promise.reject(new Error('手机号唯一性验证失败，请重试'));
              }

              return Promise.resolve();
            },
          },
        ]}
      >
        <Input
          prefix={<PhoneOutlined />}
          placeholder="请输入手机号"
          size="large"
          maxLength={11}
          onChange={(e) => {
            form.setFieldsValue({ phone: e.target.value });
            form.validateFields(['phone']);
          }}
        />
      </Form.Item>

      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          {
            validator: async (_, value) => {
              if (!value) { return Promise.resolve(); }
              if (!validateEmail(value)) { return Promise.reject(new Error('请输入有效的邮箱地址')); }

              // 如果是编辑模式，且邮箱未改变，则跳过唯一性验证
              if (isEditMode && contact?.email === value) { return Promise.resolve(); }

              // 异步验证邮箱唯一性
              try {
                const response = await contactApi.getContacts({ search: value });
                // 过滤掉当前正在编辑的联系人，以允许其保存自己的邮箱
                const otherContactsWithEmail = response.data.contacts.filter(c => c.id !== contact?.id);
                if (response.code === 200 && otherContactsWithEmail.length > 0) {
                  return Promise.reject(new Error('该邮箱已被注册'));
                }
              } catch (error) {
                console.error('邮箱唯一性验证失败:', error);
                return Promise.reject(new Error('邮箱唯一性验证失败，请重试'));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="请输入邮箱（可选）"
          size="large"
        />
      </Form.Item>
    </div>
  );

  /**
   * 渲染第二步：详细信息
   */
  const renderStepTwo = () => (
    <div className="form-step">
      <Form.Item name="company" label="机构/学校"> {/* 修改 label */}
        <Input
          prefix={<BankOutlined />}
          placeholder="请输入机构/学校名称（可选）" // 修改 placeholder
          size="large"
          maxLength={100}
        />
      </Form.Item>

      <Form.Item name="address" label="地址">
        <Input
          prefix={<EnvironmentOutlined />}
          placeholder="请输入地址（可选）"
          size="large"
          maxLength={200}
        />
      </Form.Item>
    </div>
  );

  /**
   * 渲染第三步：备注和标签
   */
  const renderStepThree = () => (
    <div className="form-step">
      <Form.Item name="notes" label="备注">
        <TextArea
          placeholder="请输入备注信息（可选）"
          rows={4}
          maxLength={500}
          showCount
        />
      </Form.Item>

      <Form.Item
        name="tags" // Form.Item 的 name 属性
        label="标签分类" // 修改 label
      >
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="请输入标签，按回车键添加"
          tokenSeparators={[',']} // 允许逗号作为分隔符
        />
      </Form.Item>
    </div>
  );

  /**
   * 渲染简化表单（不使用步骤）
   */
  const renderSimpleForm = () => (
    <div className="form-simple">
      {renderStepOne()}
      {renderStepTwo()}
      {renderStepThree()}
    </div>
  );

  return (
    <div className="contact-form">
      <Form
        form={form}
        layout="vertical"
        className="form-container"
      >
        {showSteps && !isEditMode ? (
          <>
            {/* 步骤指示器 */}
            <Steps current={currentStep} className="form-steps">
              {steps.map((step) => (
                <Steps.Step
                  key={step.title}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                />
              ))}
            </Steps>

            {/* 步骤内容 */}
            <div className="form-content">
              <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>{renderStepOne()}</div>
              <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>{renderStepTwo()}</div>
              <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>{renderStepThree()}</div>
            </div>

            {/* 步骤操作按钮 */}
            <div className="form-actions">
              <Space>
                <Button onClick={handleCancel} icon={<CloseOutlined />}>
                  取消
                </Button>

                {currentStep > 0 && (
                  <Button onClick={handlePrev}>上一步</Button>
                )}

                {currentStep < steps.length - 1 ? (
                  <Button type="primary" onClick={handleNext}>
                    下一步
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={handleSubmit}
                    loading={loading}
                    icon={<SaveOutlined />}
                  >
                    {isEditMode ? '保存' : '创建'}
                  </Button>
                )}
              </Space>
            </div>
          </>
        ) : (
          <>
            {/* 简化表单 */}
            {renderSimpleForm()}

            {/* 操作按钮 */}
            <div className="form-actions">
              <Space>
                <Button onClick={handleCancel} icon={<CloseOutlined />}>
                  取消
                </Button>
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  {isEditMode ? '保存' : '创建'}
                </Button>
              </Space>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};

