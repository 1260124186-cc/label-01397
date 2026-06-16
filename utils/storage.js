/**
 * 扫码历史存储工具
 * 功能：使用 wx.setStorage 存储最近10条扫码记录
 * 存储结构：{ id, productName, timestamp, traceId }
 */

const STORAGE_KEY = 'scan_history';
const MAX_HISTORY_COUNT = 10;

/**
 * 获取所有扫码历史
 * @returns {array} - 扫码历史数组，按时间倒序排列
 */
function getScanHistory() {
  try {
    const history = wx.getStorageSync(STORAGE_KEY);
    return Array.isArray(history) ? history : [];
  } catch (e) {
    console.error('获取扫码历史失败:', e);
    return [];
  }
}

/**
 * 添加扫码记录
 * @param {object} record - 扫码记录
 * @param {string} record.traceId - 溯源ID
 * @param {string} record.productName - 产品名称
 * @returns {array} - 更新后的历史记录
 */
function addScanRecord(record) {
  if (!record || !record.traceId) {
    return getScanHistory();
  }
  
  try {
    const history = getScanHistory();
    
    // 检查是否已存在相同ID的记录，存在则删除旧的
    const existingIndex = history.findIndex(item => item.traceId === record.traceId);
    if (existingIndex !== -1) {
      history.splice(existingIndex, 1);
    }
    
    // 创建新记录
    const newRecord = {
      id: Date.now().toString(),
      traceId: record.traceId,
      productName: record.productName || '未知产品',
      timestamp: Date.now()
    };
    
    // 添加到最前面
    history.unshift(newRecord);
    
    // 限制最大数量
    if (history.length > MAX_HISTORY_COUNT) {
      history.splice(MAX_HISTORY_COUNT);
    }
    
    // 保存到本地存储
    wx.setStorageSync(STORAGE_KEY, history);
    
    return history;
  } catch (e) {
    console.error('添加扫码记录失败:', e);
    return getScanHistory();
  }
}

/**
 * 删除单条扫码记录
 * @param {string} id - 记录ID
 * @returns {array} - 更新后的历史记录
 */
function removeScanRecord(id) {
  try {
    const history = getScanHistory();
    const filteredHistory = history.filter(item => item.id !== id);
    wx.setStorageSync(STORAGE_KEY, filteredHistory);
    return filteredHistory;
  } catch (e) {
    console.error('删除扫码记录失败:', e);
    return getScanHistory();
  }
}

/**
 * 清空所有扫码历史
 * @returns {array} - 空数组
 */
function clearScanHistory() {
  try {
    wx.setStorageSync(STORAGE_KEY, []);
    return [];
  } catch (e) {
    console.error('清空扫码历史失败:', e);
    return [];
  }
}

/**
 * 格式化时间戳为显示字符串
 * @param {number} timestamp - 时间戳
 * @returns {string} - 格式化后的时间字符串
 */
function formatTime(timestamp) {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) {
    return '刚刚';
  } else if (diffMins < 60) {
    return `${diffMins}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${month}月${day}日 ${hour}:${minute}`;
  }
}

module.exports = {
  getScanHistory,
  addScanRecord,
  removeScanRecord,
  clearScanHistory,
  formatTime,
  MAX_HISTORY_COUNT,
  STORAGE_KEY
};
