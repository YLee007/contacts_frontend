import React from 'react';
import ReactDOM from 'react-dom/client';

// 调试：
// import App from './App-Debug';    // 步骤 0：基础调试
// import App from './App-Step1';    // 步骤 1：测试 Layout
// import App from './App-Step2';    // 步骤 2：测试 Layout + SearchBar
// import App from './App-NoCSS';    // 步骤 3：测试 NO-CSS
// import App from './App-NoCSS';    // 步骤 ：测试 NO-CSS
import App from './App';             // 完整版本

import './index.css';

// 添加全局错误捕获
window.addEventListener('error', (e) => {
  console.error('❌ 全局错误:', e.error);
});

console.log('main.tsx 开始执行');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log(' React 根节点已挂载');
