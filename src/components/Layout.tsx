/**
 * Layout 组件
 * 应用主布局组件，包含导航栏和侧边栏
 *
 * 功能特性：
 * - 响应式布局
 * - 可折叠侧边栏
 * - 面包屑导航
 * - 用户信息展示
 * - 主题切换
 * - 移动端适配
 */

import React, { useState } from 'react';
import {
  Layout as AntLayout,
  Menu,
  Breadcrumb,
  Avatar,
  Dropdown,
  Space,
  Button,
  Badge,
  Drawer,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  HomeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import './Layout.css';

const { Header, Sider, Content } = AntLayout;

interface LayoutProps {
  /** 子组件 */
  children: React.ReactNode;
  /** 当前选中的菜单项 */
  selectedKey?: string;
  /** 面包屑路径 */
  breadcrumbs?: Array<{ title: string; path?: string }>;
  /** 用户信息 */
  user?: {
    name: string;
    avatar?: string;
    email?: string;
  };
  /** 新增联系人回调 */
  onAddContact?: () => void;
  /** 菜单点击回调 */
  onMenuClick?: (key: string) => void;
  /** 退出登录回调 */
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  selectedKey = 'contacts',
  breadcrumbs = [],
  user = { name: '访客', email: 'guest@example.com' },
  onAddContact,
  onMenuClick,
  onLogout,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  /**
   * 监听窗口大小变化
   */
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileMenuVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * 侧边栏菜单项
   */
  const menuItems: MenuProps['items'] = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: 'contacts',
      icon: <TeamOutlined />,
      label: '全部联系人',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
  ];

  /**
   * 用户下拉菜单
   */
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  /**
   * 处理菜单点击
   */
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    onMenuClick?.(key);
    if (isMobile) {
      setMobileMenuVisible(false);
    }
  };

  /**
   * 处理用户菜单点击
   */
  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      onLogout?.(); // 调用从 App.tsx 传递过来的 onLogout prop
    } else {
      onMenuClick?.(key);
    }
  };

  /**
   * 切换侧边栏折叠状态
   */
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  /**
   * 切换移动端菜单
   */
  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  /**
   * 渲染侧边栏
   */
  const renderSider = () => (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="layout-sider"
      width={240}
    >
      {/* Logo */}
      <div className="sider-logo">
        <TeamOutlined className="logo-icon" />
        {!collapsed && <span className="logo-text">通讯录</span>}
      </div>

      {/* 菜单 */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );

  /**
   * 渲染移动端抽屉菜单
   */
  const renderMobileDrawer = () => (
    <Drawer
      title="菜单"
      placement="left"
      onClose={() => setMobileMenuVisible(false)}
      open={mobileMenuVisible}
      className="mobile-drawer"
    >
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Drawer>
  );

  return (
    <AntLayout className="app-layout">
      {/* 桌面端侧边栏 */}
      {!isMobile && renderSider()}

      {/* 移动端抽屉菜单 */}
      {isMobile && renderMobileDrawer()}

      <AntLayout>
        {/* 头部导航栏 */}
        <Header className="layout-header">
          <div className="header-left">
            {/* 折叠按钮 */}
            <Button
              type="text"
              icon={
                isMobile ? (
                  <MenuUnfoldOutlined />
                ) : collapsed ? (
                  <MenuUnfoldOutlined />
                ) : (
                  <MenuFoldOutlined />
                )
              }
              onClick={isMobile ? toggleMobileMenu : toggleCollapsed}
              className="trigger-btn"
            />

            {/* 面包屑 */}
            {breadcrumbs.length > 0 && !isMobile && (
              <Breadcrumb
                className="breadcrumb"
                items={breadcrumbs.map((item) => ({ title: item.title, href: item.path }))}
              />
            )}
          </div>

          <div className="header-right">
            <Space size="middle">
              {/* 添加联系人按钮 */}
              {onAddContact && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={onAddContact}
                  className="add-btn"
                >
                  {!isMobile && '新增联系人'}
                </Button>
              )}

              {/* 通知 */}
              <Badge count={0} showZero={false}>
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  className="icon-btn"
                />
              </Badge>

              {/* 用户信息 */}
              <Dropdown
                menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
                placement="bottomRight"
              >
                <div className="user-info">
                  <Avatar
                    src={user.avatar}
                    icon={<UserOutlined />}
                    size="small"
                  />
                  {!isMobile && (
                    <span className="user-name">{user.name}</span>
                  )}
                </div>
              </Dropdown>
            </Space>
          </div>
        </Header>

        {/* 内容区域 */}
        <Content className="layout-content">
          <div className="content-wrapper">{children}</div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

