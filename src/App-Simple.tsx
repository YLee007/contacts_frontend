/**
 * 简化版 App 组件
 * 用于测试基本功能是否正常
 */

import React from 'react';
import { ConfigProvider, Button, Card } from 'antd';
import zhCN from 'antd/locale/zh_CN';

const AppSimple: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <Card title="通讯录管理系统" bordered={false}>
          <h2> 前端应用运行正常！</h2>
          <p>React + TypeScript + Ant Design 已成功配置。</p>
          <Button type="primary" onClick={() => alert('测试成功！')}>
            点击测试
          </Button>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default AppSimple;

