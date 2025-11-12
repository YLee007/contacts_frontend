/**
 * 调试版 App 组件
 * 逐步启用组件来定位问题
 */

import React from 'react';
import { ConfigProvider, message, Button, Card } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// 步骤 1：测试基础导入
console.log('App-Debug 开始加载');

// 步骤 2：逐个导入组件（注释掉有问题的）
try {
  // 先不导入任何自定义组件，只用 Ant Design
  console.log('基础导入成功');
} catch (error) {
  console.error('导入失败:', error);
}

const AppDebug: React.FC = () => {
  console.log(' AppDebug 组件渲染');

  return (
    <ConfigProvider locale={zhCN}>
      <div style={{ padding: '40px' }}>
        <Card title="调试模式" bordered={false}>
          <h2>🔍 正在调试...</h2>
          <p>如果您看到这个页面，说明基础渲染正常。</p>
          <p>现在我们将逐步启用各个组件。</p>
          
          <div style={{ marginTop: '20px' }}>
            <h3>检查清单：</h3>
            <ul>
              <li>React 正常</li>
              <li>Ant Design 正常</li>
              <li> ConfigProvider 正常</li>
              <li>⏳ 自定义组件待测试</li>
            </ul>
          </div>

          <Button 
            type="primary" 
            onClick={() => {
              console.log(' 按钮点击正常');
              message.success('交互功能正常！');
            }}
          >
            测试交互
          </Button>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default AppDebug;

