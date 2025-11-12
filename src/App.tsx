/**
 * 主应用组件
 * 演示如何使用通讯录核心组件
 */

import React, { useState, useCallback, useEffect } from 'react';
import { ConfigProvider, Modal, message } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import {
  Layout,
  SearchBar,
  ContactList,
  ContactForm,
  LoginForm, // 导入 LoginForm
} from './components';
import { useContactStore } from './store/contactStore';
import { useAuthStore } from './store/authStore'; // 导入 useAuthStore
import type { Contact, ContactCreate, ContactUpdate } from './types/contact';
import './App.css';

const App: React.FC = () => {
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();

  // 使用状态管理
  const {
    contacts,
    searchTerm,
    loading,
    pagination,
    sortBy,
    sortOrder,
    setSearchTerm,
    createContact,
    updateContact,
    deleteContact,
    fetchContacts,
    setSortBy,
    setSortOrder,
    setPaginationPage,
    error, // 引入 error 状态
    selectedTags, // 导入 selectedTags
    toggleFavorite,
    filterByFavorite, // Import filterByFavorite
    setFilterByFavorite, // Import setFilterByFavorite
  } = useContactStore();

  const { isLoggedIn, user, loadSession, logout } = useAuthStore(); // 引入认证状态和 logout action

  const currentPage = pagination.page;
  const total = pagination.total;

  // 组件挂载时加载会话
  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    // 只有在登录状态下才获取联系人
    if (isLoggedIn) {
      fetchContacts({
        search: searchTerm,
        page: currentPage,
        limit: pagination.limit,
        sortBy: sortBy,
        order: sortOrder,
        isFavorite: filterByFavorite, // Add isFavorite to fetchContacts params
      });
    }
  }, [searchTerm, currentPage, sortBy, sortOrder, pagination.limit, fetchContacts, isLoggedIn, selectedTags, filterByFavorite]); // Add filterByFavorite to dependencies

  /**
   * 处理搜索
   */
  const handleSearch = useCallback((keyword: string) => {
    setSearchTerm(keyword);
    setPaginationPage(1); // 重置到第一页
    // TODO: 调用 API 搜索联系人
    console.log('搜索关键词:', keyword);
  }, [setSearchTerm, setPaginationPage]);

  /**
   * 处理新增联系人
   */
  const handleAddContact = () => {
    setEditingContact(undefined);
    setIsFormModalVisible(true);
  };

  /**
   * 处理编辑联系人
   */
  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsFormModalVisible(true);
  };

  /**
   * 处理删除联系人
   */
  const handleDeleteContact = async (id: string) => {
    await deleteContact(id);
    message.success('联系人已删除');
    fetchContacts(); // 手动刷新列表
  };

  /**
   * 处理表单提交
   */
  const handleFormSubmit = async (data: ContactCreate | ContactUpdate) => {
    // 重置之前的错误信息
    // useContactStore.setState({ error: null }); // 这步由 create/updateContact 内部处理，无需在这里再次重置
    try {
      if (editingContact) {
        // 更新联系人
        await updateContact(editingContact.id, data as ContactUpdate);
      } else {
        // 创建新联系人
        await createContact(data as ContactCreate);
      }

      if (!error) { // 检查 store 中的 error 状态
        message.success(editingContact ? '联系人更新成功' : '联系人创建成功');
        fetchContacts(); // 手动刷新列表
        setIsFormModalVisible(false);
      } else {
        message.error(error); // 显示 store 中的具体错误信息
      }

    } catch (err) {
      // 理论上，所有错误都应该在 store 的 createContact/updateContact 内部被捕获并设置 error 状态
      // 如果代码执行到这里，说明发生了未预期的错误
      message.error(error || '操作失败，请重试');
    }
  };

  /**
   * 处理菜单点击
   */
  const handleMenuClick = (key: string) => {
    console.log('菜单点击:', key);
    if (key === 'favorites') {
      setFilterByFavorite(true);
    } else {
      setFilterByFavorite(false);
    }
    // TODO: 实现菜单导航
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {!isLoggedIn ? (
        <div className="login-page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <LoginForm onSuccess={() => { /* 登录成功后无需额外操作，因为 isLoggedIn 会自动更新 */ }} />
        </div>
      ) : (
        <Layout
          selectedKey="contacts"
          breadcrumbs={[{ title: '首页' }, { title: '全部联系人' }]}
          user={{
            name: user?.name || user?.email || '用户',
            email: user?.email || '',
          }}
          onAddContact={handleAddContact}
          onMenuClick={handleMenuClick}
          onLogout={logout} // 绑定 logout action
        >
          <div className="app-container" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {/* 搜索栏 */}
            <div className="search-section">
              <SearchBar
                value={searchTerm}
                onSearch={handleSearch}
                loading={loading}
              />
            </div>

            {/* 联系人列表 */}
            <ContactList
              contacts={contacts}
              searchKeyword={searchTerm}
              loading={loading}
              currentPage={currentPage}
              total={total}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onContactClick={(contact) => console.log('点击联系人:', contact)}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
              onToggleFavorite={toggleFavorite}
              onSortChange={(newSortBy, newOrder) => {
                setSortBy(newSortBy as 'name' | 'createdAt' | 'updatedAt');
                setSortOrder(newOrder as 'asc' | 'desc');
              }}
              onPageChange={(page) => {
                setPaginationPage(page);
              }}
            />
          </div>

          {/* 表单弹窗 */}
          <Modal
            title={editingContact ? '编辑联系人' : '新增联系人'}
            open={isFormModalVisible}
            onCancel={() => setIsFormModalVisible(false)}
            footer={null}
            width={800}
            destroyOnHidden
          >
            <ContactForm
              contact={editingContact}
              showSteps={!editingContact}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormModalVisible(false)}
            />
          </Modal>
        </Layout>
      )}
      </div>
    </ConfigProvider>
  );
};

export default App;
