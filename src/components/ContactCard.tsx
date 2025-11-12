/**
 * ContactCard 组件
 * 联系人卡片组件，展示联系人基本信息
 *
 * 功能特性：
 * - 响应式设计（移动端优先）
 * - 悬停动画效果
 * - 收藏功能
 * - 快捷操作（编辑、删除、拨打电话）
 * - 头像展示
 * - 标签显示
 */

import React, { useState } from 'react';
import { Card, Avatar, Tag, Space, Tooltip, Popconfirm } from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
  StarFilled,
  BankOutlined,
} from '@ant-design/icons';
import type { Contact } from '@/types';
import { getHighlightedParts } from '@/utils/highlight';
import './ContactCard.css';

interface ContactCardProps {
  /** 联系人数据 */
  contact: Contact;
  /** 搜索关键词（用于高亮） */
  searchKeyword?: string;
  /** 点击卡片回调 */
  onClick?: (contact: Contact) => void;
  /** 编辑回调 */
  onEdit?: (contact: Contact) => void;
  /** 删除回调 */
  onDelete?: (id: string) => void;
  /** 收藏/取消收藏回调 */
  onToggleFavorite?: (id: string) => void;
  /** 是否显示操作按钮 */
  showActions?: boolean;
  /** 是否紧凑模式 */
  compact?: boolean;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  searchKeyword = '',
  onClick,
  onEdit,
  onDelete,
  onToggleFavorite,
  showActions = true,
  compact = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  /**
   * 渲染高亮文本
   */
  const renderHighlightedText = (text: string) => {
    if (!searchKeyword) return text;

    const parts = getHighlightedParts(text, searchKeyword);
    return (
      <>
        {parts.map((part, index) => (
          <span
            key={index}
            className={part.highlight ? 'highlight-text' : ''}
          >
            {part.text}
          </span>
        ))}
      </>
    );
  };

  /**
   * 处理卡片点击
   */
  const handleCardClick = () => {
    onClick?.(contact);
  };

  /**
   * 处理编辑
   */
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(contact);
  };

  /**
   * 处理删除
   */
  const handleDelete = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onDelete?.(contact.id);
  };

  /**
   * 处理收藏切换
   */
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(contact.id);
  };

  /**
   * 拨打电话
   */
  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${contact.phone}`;
  };

  /**
   * 发送邮件
   */
  const handleEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (contact.email) {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  return (
    <Card
      className={`contact-card ${compact ? 'compact' : ''} ${
        isHovered ? 'hovered' : ''
      }`}
      hoverable
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-content">
        {/* 头像和基本信息 */}
        <div className="card-header">
          <Avatar
            size={compact ? 48 : 64}
            src={contact.avatar}
            icon={<UserOutlined />}
            className="contact-avatar"
          />

          <div className="contact-info">
            <div className="contact-name-row">
              <h3 className="contact-name">
                {renderHighlightedText(contact.name)}
              </h3>
              <Space className="contact-card-inline-actions">
                {onToggleFavorite && (
                  <Tooltip title={contact.isFavorite ? '取消收藏' : '收藏'}>
                    {contact.isFavorite ? (
                      <StarFilled
                        className="favorite-icon active"
                        onClick={handleToggleFavorite}
                      />
                    ) : (
                      <StarOutlined
                        className="favorite-icon"
                        onClick={handleToggleFavorite}
                      />
                    )}
                  </Tooltip>
                )}
                {showActions && (
                  <>
                    <Tooltip title="编辑">
                      <EditOutlined
                        className="action-icon edit"
                        onClick={handleEdit}
                      />
                    </Tooltip>

                    <Popconfirm
                      title="确定删除此联系人吗？"
                      onConfirm={handleDelete}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Tooltip title="删除">
                        <DeleteOutlined
                          className="action-icon delete"
                          onClick={(e: React.MouseEvent) => e.stopPropagation()} // Stop propagation here
                        />
                      </Tooltip>
                    </Popconfirm>
                  </>
                )}
              </Space>
            </div>

            {/* 联系方式 */}
            <Space direction="vertical" size={4} className="contact-details">
              <div className="detail-item">
                <PhoneOutlined className="detail-icon" />
                <span className="detail-text">
                  {renderHighlightedText(contact.phone)}
                </span>
                <Tooltip title="拨打电话">
                  <PhoneOutlined
                    className="action-icon-inline"
                    onClick={handleCall}
                  />
                </Tooltip>
              </div>

              <div className="detail-item">
                <MailOutlined className="detail-icon" />
                <span className="detail-text">
                  {contact.email ? renderHighlightedText(contact.email) : ''} {/* 即使没有邮箱也渲染 span，文本为空 */}
                </span>
                {contact.email && (
                  <Tooltip title="发送邮件">
                    <MailOutlined
                      className="action-icon-inline"
                      onClick={handleEmail}
                    />
                  </Tooltip>
                )}
              </div>

              <div className="detail-item"> 
                <BankOutlined className="detail-icon" />
                <span className="detail-text">
                  {contact.company ? renderHighlightedText(contact.company) : ''} 
                </span>
              </div>

              {!compact && ( // 地址在非紧凑模式下始终渲染
                <div className="detail-item">
                  <EnvironmentOutlined className="detail-icon" />
                  <span className="detail-text">
                    {contact.address ? renderHighlightedText(contact.address) : ''} {/* 即使没有地址也渲染 span，文本为空 */}
                  </span>
                </div>
              )}
            </Space>

            {/* 标签 */}
            {contact.tags && contact.tags.length > 0 && !compact && (
              <div className="card-tags">
                {contact.tags.map((tag, index) => (
                  <Tag key={index} color="blue">
                    {tag}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        
      </div>
    </Card>
  );
};

