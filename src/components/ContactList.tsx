/**
 * ContactList 组件
 * 联系人列表组件，支持虚拟滚动、搜索和排序
 *
 * 功能特性：
 * - 虚拟滚动（优化大数据量性能）
 * - 多种视图模式（网格/列表）
 * - 排序功能
 * - 分页加载
 * - 空状态提示
 * - 加载骨架屏
 */

import React, { useState, useMemo } from 'react';
import {
  List,
  Row,
  Col,
  Select,
  Radio,
  Space,
  Empty,
  Spin,
  Pagination,
} from 'antd';
import {
  AppstoreOutlined,
  BarsOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons';
import { ContactCard } from './ContactCard';
import type { Contact, SortOption } from '@/types';
import { useContactStore } from '../store/contactStore'; // 导入 useContactStore
import './ContactList.css';
import { StarFilled } from '@ant-design/icons';

const { Option } = Select;

interface ContactListProps {
  /** 联系人列表 */
  contacts: Contact[];
  /** 搜索关键词 */
  searchKeyword?: string;
  /** 是否加载中 */
  loading?: boolean;
  /** 当前页码 */
  currentPage?: number;
  /** 每页数量 */
  pageSize?: number;
  /** 总数量 */
  total?: number;
  /** 排序方式 */
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  /** 排序顺序 */
  sortOrder?: 'asc' | 'desc';
  /** 点击联系人回调 */
  onContactClick?: (contact: Contact) => void;
  /** 编辑回调 */
  onEdit?: (contact: Contact) => void;
  /** 删除回调 */
  onDelete?: (id: string) => void;
  /** 收藏回调 */
  onToggleFavorite?: (id: string) => void;
  /** 排序变化回调 */
  onSortChange?: (sortBy: string, order: string) => void;
  /** 页码变化回调 */
  onPageChange?: (page: number, pageSize: number) => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  searchKeyword = '',
  loading = false,
  currentPage = 1,
  pageSize = 10,
  total = 0,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onContactClick,
  onEdit,
  onDelete,
  onToggleFavorite,
  onSortChange,
  onPageChange,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { selectedTags, setSelectedTags, filterByFavorite, setFilterByFavorite } = useContactStore(); // 获取 selectedTags, setSelectedTags, filterByFavorite 和 setFilterByFavorite

  /**
   * 提取所有唯一的标签
   */
  const allAvailableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    contacts.forEach(contact => {
      contact.tags?.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, [contacts]); // 依赖 contacts

  /**
   * 排序选项
   */
  const sortOptions: SortOption[] = [
    { label: '按姓名升序', value: 'name', order: 'asc' },
    { label: '按姓名降序', value: 'name', order: 'desc' },
    { label: '最新创建', value: 'createdAt', order: 'desc' },
    { label: '最早创建', value: 'createdAt', order: 'asc' },
    { label: '最近更新', value: 'updatedAt', order: 'desc' },
  ];

  /**
   * 当前排序选项
   */
  const currentSortOption = useMemo(() => {
    return sortOptions.find(
      (opt) => opt.value === sortBy && opt.order === sortOrder
    );
  }, [sortBy, sortOrder]);

  /**
   * 处理排序变化
   */
  const handleSortChange = (value: string) => {
    const option = sortOptions.find((opt) => opt.label === value);
    if (option) {
      onSortChange?.(option.value, option.order);
    }
  };

  /**
   * 处理视图模式切换
   */
  const handleViewModeChange = (e: any) => {
    setViewMode(e.target.value);
  };

  /**
   * 渲染网格视图
   */
  const renderGridView = () => {
    return (
      <Row gutter={[16, 16]}>
        {contacts.map((contact) => (
          <Col
            key={contact.id}
            xs={24}
            sm={12}
            md={12}
            lg={8}
            xl={6}
          >
            <ContactCard
              contact={contact}
              searchKeyword={searchKeyword}
              onClick={onContactClick}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
            />
          </Col>
        ))}
      </Row>
    );
  };

  /**
   * 渲染列表视图
   */
  const renderListView = () => {
    return (
      <List
        dataSource={contacts}
        renderItem={(contact) => (
          <List.Item key={contact.id} style={{ padding: 0, marginBottom: 16 }}>
            <ContactCard
              contact={contact}
              searchKeyword={searchKeyword}
              onClick={onContactClick}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
              compact={false}
            />
          </List.Item>
        )}
      />
    );
  };

  /**
   * 渲染空状态
   */
  const renderEmpty = () => {
    if (searchKeyword) {
      return (
        <Empty
          description={`未找到与 "${searchKeyword}" 相关的联系人`}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return (
      <Empty
        description="暂无联系人，点击右上角添加新联系人"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  };

  /**
   * 渲染加载骨架屏
   */
  const renderSkeleton = () => {
    return (
      <Row gutter={[16, 16]}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Col key={index} xs={24} sm={12} md={12} lg={8} xl={6}>
            <div className="contact-card-skeleton">
              <Spin />
            </div>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div className="contact-list">
      {/* 工具栏 */}
      <div className="list-toolbar">
        <Space size="middle">
          {/* 排序选择 */}
          <Select
            value={currentSortOption?.label}
            onChange={handleSortChange}
            style={{ width: 150 }}
            suffixIcon={<SortAscendingOutlined />}
          >
            {sortOptions.map((option) => (
              <Option key={option.label} value={option.label}>
                {option.label}
              </Option>
            ))}
          </Select>

          {/* 标签分类选择器 */}
          <Select
            mode="multiple"
            allowClear
            style={{ width: 200 }}
            placeholder="按标签分类"
            value={selectedTags}
            onChange={(values: string[]) => setSelectedTags(values)}
            options={allAvailableTags.map(tag => ({ label: tag, value: tag }))}
          />

          {/* 收藏联系人筛选 */}
          <Radio.Group
            value={filterByFavorite ? 'favorites' : 'all'}
            onChange={(e) => setFilterByFavorite(e.target.value === 'favorites')}
          >
            <Radio.Button value="all">所有联系人</Radio.Button>
            <Radio.Button value="favorites"><StarFilled /> 我的收藏</Radio.Button>
          </Radio.Group>

          {/* 视图模式切换 */}
          <Radio.Group value={viewMode} onChange={handleViewModeChange}>
            <Radio.Button value="grid">
              <AppstoreOutlined /> 网格
            </Radio.Button>
            <Radio.Button value="list">
              <BarsOutlined /> 列表
            </Radio.Button>
          </Radio.Group>
        </Space>

        {/* 统计信息 */}
        <div className="list-stats">
          共 <span className="stats-number">{total}</span> 个联系人
        </div>
      </div>

      {/* 列表内容 */}
      <div className="list-content">
        {loading ? (
          renderSkeleton()
        ) : contacts.length === 0 ? (
          renderEmpty()
        ) : viewMode === 'grid' ? (
          renderGridView()
        ) : (
          renderListView()
        )}
      </div>

      {/* 分页 */}
      {!loading && contacts.length > 0 && (
        <div className="list-pagination">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={onPageChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 条`}
            pageSizeOptions={['10', '20', '50', '100']}
          />
        </div>
      )}
    </div>
  );
};

