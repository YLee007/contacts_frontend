/**
 * 文本高亮工具函数
 * 用于搜索结果高亮显示
 */

/**
 * 高亮匹配的文本
 * @param text 原始文本
 * @param keyword 搜索关键词
 * @returns 包含高亮标记的 HTML 字符串
 */
export const highlightText = (text: string, keyword: string): string => {
  if (!keyword || !text) return text;

  const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

/**
 * 转义正则表达式特殊字符
 */
const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * 获取高亮的 React 元素片段
 * @param text 原始文本
 * @param keyword 搜索关键词
 * @returns React 元素数组
 */
export const getHighlightedParts = (
  text: string,
  keyword: string
): Array<{ text: string; highlight: boolean }> => {
  if (!keyword || !text) {
    return [{ text, highlight: false }];
  }

  const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
  const parts: Array<{ text: string; highlight: boolean }> = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // 添加未匹配的部分
    if (match.index > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, match.index),
        highlight: false,
      });
    }

    // 添加匹配的部分
    parts.push({
      text: match[0],
      highlight: true,
    });

    lastIndex = regex.lastIndex;
  }

  // 添加剩余的文本
  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      highlight: false,
    });
  }

  return parts;
};

