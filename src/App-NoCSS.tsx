/**
 * 无 CSS 版本 - 测试是否是 CSS 导入问题
 */

import React, { useState } from 'react';
import { ConfigProvider, Button, Card, Space, Input, List } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

console.log(' App-NoCSS 开始加载');

const AppNoCSS: React.FC = () => {
  const [keyword, setKeyword] = useState('');

  console.log(' AppNoCSS 组件渲染');

  return (
    <ConfigProvider locale={zhCN}>
      <div style={{ 
        padding: '20px', 
        minHeight: '100vh', 
        background: '#f0f2f5' 
      }}>
        {/* 顶部栏 */}
        <div style={{ 
          background: '#fff', 
          padding: '16px', 
          marginBottom: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0 }}>通讯录管理系统</h2>
            <Button type="primary" icon={<PlusOutlined />}>
              新增联系人
            </Button>
          </Space>
        </div>

        {/* 搜索栏 */}
        <div style={{ 
          background: '#fff', 
          padding: '16px', 
          marginBottom: '20px',
          borderRadius: '8px'
        }}>
          <Input
            size="large"
            placeholder="搜索联系人..."
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        {/* 联系人列表 */}
        <div style={{ 
          background: '#fff', 
          padding: '16px',
          borderRadius: '8px'
        }}>
          <h3>联系人列表</h3>
          <List
            dataSource={[
              { id: '1', name: '张三', phone: '13800138000' },
              { id: '2', name: '李四', phone: '13900139000' },
              { id: '3', name: '王五', phone: '13700137000' },
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.name}
                  description={item.phone}
                />
                <Space>
                  <Button size="small">编辑</Button>
                  <Button size="small" danger>删除</Button>
                </Space>
              </List.Item>
            )}
          />
        </div>

        {/* 调试信息 */}
        <Card 
          style={{ marginTop: '20px' }}
          title="🔍 调试信息"
        >
          <p> 如果您看到这个页面，说明：</p>
          <ul>
            <li> React 正常</li>
            <li> Ant Design 正常</li>
            <li> 组件渲染正常</li>
            <li> 不依赖自定义 CSS</li>
          </ul>
          <p>
            <strong>下一步：</strong>逐步启用自定义组件
          </p>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default AppNoCSS;

