# 联系人管理前端应用 (Contacts Frontend Application)

这是一个使用 React、Ant Design 和 Zustand 构建的单页应用 (SPA)，用于管理联系人信息。它通过 RESTful API 与后端服务进行交互。

## 技术栈

-   **框架:** React 18
-   **UI 库:** Ant Design
-   **状态管理:** Zustand
-   **构建工具:** Vite
-   **语言:** TypeScript

## 安装与运行

### 1. 克隆仓库

```bash
git clone https://github.com/YLee007/832302124_contacts_frontend.git
cd contacts-frontend
```

### 2. 安装依赖

确保你已经安装了 pnpm。

```bash
pnpm install
```

### 3. 启动开发服务器

```bash
pnpm dev
```

应用程序将在 `http://localhost:3001` 启动。

### 4. 构建生产版本 (可选)

```bash
pnpm build
```

这将在 `dist/` 目录下生成用于生产环境的静态文件。

## 配置

默认情况下，前端应用会尝试连接到运行在 `http://localhost:3000` 的后端 API。你可以在 `frontend/src/services/` 中的 `contactApi.ts` 和 `authApi.ts` 文件中找到并修改 API 的基本 URL。

## 注意

确保后端服务已启动并运行，否则前端将无法获取或提交数据。