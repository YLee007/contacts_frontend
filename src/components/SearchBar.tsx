/**
 * SearchBar 组件
 * 实时搜索组件，支持防抖和搜索历史
 *
 * 功能特性：
 * - 实时搜索（防抖优化）
 * - 搜索建议
 * - 清除按钮
 * - 响应式设计
 * - 键盘快捷键支持（Ctrl/Cmd + K）
 */

import React, { useState, useEffect, useRef } from 'react';
import { Input } from 'antd';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useDebounce } from '@/hooks/useDebounce';
import './SearchBar.css';

interface SearchBarProps {
  /** 搜索关键词 */
  value?: string;
  /** 搜索回调 */
  onSearch: (keyword: string) => void;
  /** 占位符文本 */
  placeholder?: string;
  /** 防抖延迟（毫秒） */
  debounceDelay?: number;
  /** 是否显示搜索建议 */
  showSuggestions?: boolean;
  /** 搜索建议列表 */
  suggestions?: string[];
  /** 是否加载中 */
  loading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onSearch,
  placeholder = '搜索联系人（姓名、手机号、公司...）',
  debounceDelay = 300,
  showSuggestions = false,
  suggestions = [],
  loading = false,
}) => {
  const [keyword, setKeyword] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<any>(null);

  // 使用防抖优化搜索
  const debouncedKeyword = useDebounce(keyword, debounceDelay);

  // 当防抖值变化时触发搜索
  useEffect(() => {
    onSearch(debouncedKeyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword]);

  // 同步外部 value
  useEffect(() => {
    setKeyword(value);
  }, [value]);

  // 键盘快捷键：Ctrl/Cmd + K 聚焦搜索框
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /**
   * 处理输入变化
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  /**
   * 清除搜索
   */
  const handleClear = () => {
    setKeyword('');
    onSearch('');
    inputRef.current?.focus();
  };

  /**
   * 选择搜索建议
   */
  const handleSelectSuggestion = (suggestion: string) => {
    setKeyword(suggestion);
    onSearch(suggestion);
    setIsFocused(false);
  };

  return (
    <div className="search-bar">
      <Input
        ref={inputRef}
        size="large"
        placeholder={placeholder}
        prefix={<SearchOutlined className="search-icon" />}
        suffix={
          keyword && (
            <CloseCircleOutlined
              className="clear-icon"
              onClick={handleClear}
            />
          )
        }
        value={keyword}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        allowClear={false}
        className="search-input"
      />

      {/* 搜索建议下拉框 */}
      {showSuggestions && isFocused && suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              <SearchOutlined className="suggestion-icon" />
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
      )}

      {/* 加载状态提示 */}
      {loading && keyword && (
        <div className="search-loading">搜索中...</div>
      )}
    </div>
  );
};

