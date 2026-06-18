/**
 * 用户数据存储模块
 * 功能：收藏产品、品鉴笔记、消息通知、隐私设置
 * 所有数据仅存本地，仅收集必要信息，不主动上传
 */

var FAVORITES_KEY = 'user_favorites';
var NOTES_KEY = 'user_tasting_notes';
var NOTIFICATIONS_KEY = 'user_notifications';
var PRIVACY_SETTINGS_KEY = 'user_privacy_settings';
var KNOWLEDGE_FAVORITES_KEY = 'user_knowledge_favorites';
var brewRecord = require('./brewRecord.js');
var reviewTrust = require('./reviewTrust.js');
var MAX_FAVORITES = 100;
var MAX_NOTES = 200;
var MAX_NOTIFICATIONS = 50;
var MAX_KNOWLEDGE_FAVORITES = 200;

function getFavorites() {
  try {
    return wx.getStorageSync(FAVORITES_KEY) || [];
  } catch (e) {
    console.error('[UserStore] 获取收藏列表失败:', e);
    return [];
  }
}

function addFavorite(product) {
  if (!product || !product.traceId) return getFavorites();
  try {
    var list = getFavorites();
    var idx = -1;
    for (var i = 0; i < list.length; i++) {
      if (list[i].traceId === product.traceId) { idx = i; break; }
    }
    if (idx !== -1) return list;
    list.unshift({
      traceId: product.traceId,
      productName: product.productName || '',
      productImage: product.productImage || '',
      batchNo: product.batchNo || '',
      addTime: Date.now()
    });
    if (list.length > MAX_FAVORITES) list.splice(MAX_FAVORITES);
    wx.setStorageSync(FAVORITES_KEY, list);
    console.info('[UserStore] 已收藏:', product.traceId);
    return list;
  } catch (e) {
    console.error('[UserStore] 添加收藏失败:', e);
    return getFavorites();
  }
}

function removeFavorite(traceId) {
  try {
    var list = getFavorites();
    var filtered = list.filter(function(item) { return item.traceId !== traceId; });
    wx.setStorageSync(FAVORITES_KEY, filtered);
    console.info('[UserStore] 已取消收藏:', traceId);
    return filtered;
  } catch (e) {
    console.error('[UserStore] 取消收藏失败:', e);
    return getFavorites();
  }
}

function isFavorite(traceId) {
  var list = getFavorites();
  for (var i = 0; i < list.length; i++) {
    if (list[i].traceId === traceId) return true;
  }
  return false;
}

function clearFavorites() {
  try {
    wx.setStorageSync(FAVORITES_KEY, []);
    return [];
  } catch (e) {
    console.error('[UserStore] 清空收藏失败:', e);
    return getFavorites();
  }
}

function getTastingNotes() {
  try {
    return wx.getStorageSync(NOTES_KEY) || [];
  } catch (e) {
    console.error('[UserStore] 获取品鉴笔记失败:', e);
    return [];
  }
}

function addTastingNote(note) {
  if (!note) return getTastingNotes();
  try {
    var list = getTastingNotes();
    var newNote = {
      id: 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      traceId: note.traceId || '',
      productName: note.productName || '',
      content: note.content || '',
      rating: note.rating || 0,
      tags: note.tags || [],
      images: note.images || [],
      createTime: Date.now(),
      updateTime: Date.now()
    };
    list.unshift(newNote);
    if (list.length > MAX_NOTES) list.splice(MAX_NOTES);
    wx.setStorageSync(NOTES_KEY, list);
    console.info('[UserStore] 新增品鉴笔记:', newNote.id);
    return list;
  } catch (e) {
    console.error('[UserStore] 新增品鉴笔记失败:', e);
    return getTastingNotes();
  }
}

function updateTastingNote(noteId, updates) {
  try {
    var list = getTastingNotes();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === noteId) {
        Object.assign(list[i], updates, { updateTime: Date.now() });
        break;
      }
    }
    wx.setStorageSync(NOTES_KEY, list);
    console.info('[UserStore] 更新品鉴笔记:', noteId);
    return list;
  } catch (e) {
    console.error('[UserStore] 更新品鉴笔记失败:', e);
    return getTastingNotes();
  }
}

function deleteTastingNote(noteId) {
  try {
    var list = getTastingNotes();
    var filtered = list.filter(function(item) { return item.id !== noteId; });
    wx.setStorageSync(NOTES_KEY, filtered);
    console.info('[UserStore] 删除品鉴笔记:', noteId);
    return filtered;
  } catch (e) {
    console.error('[UserStore] 删除品鉴笔记失败:', e);
    return getTastingNotes();
  }
}

function getNotifications() {
  try {
    return wx.getStorageSync(NOTIFICATIONS_KEY) || [];
  } catch (e) {
    console.error('[UserStore] 获取通知列表失败:', e);
    return [];
  }
}

function addNotification(notification) {
  if (!notification) return getNotifications();
  try {
    var list = getNotifications();
    list.unshift({
      id: 'notif_' + Date.now(),
      type: notification.type || 'system',
      title: notification.title || '',
      content: notification.content || '',
      isRead: false,
      createTime: Date.now(),
      extra: notification.extra || null
    });
    if (list.length > MAX_NOTIFICATIONS) list.splice(MAX_NOTIFICATIONS);
    wx.setStorageSync(NOTIFICATIONS_KEY, list);
    return list;
  } catch (e) {
    console.error('[UserStore] 添加通知失败:', e);
    return getNotifications();
  }
}

function markNotificationRead(notifId) {
  try {
    var list = getNotifications();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === notifId) {
        list[i].isRead = true;
        break;
      }
    }
    wx.setStorageSync(NOTIFICATIONS_KEY, list);
    return list;
  } catch (e) {
    console.error('[UserStore] 标记通知已读失败:', e);
    return getNotifications();
  }
}

function markAllNotificationsRead() {
  try {
    var list = getNotifications();
    for (var i = 0; i < list.length; i++) {
      list[i].isRead = true;
    }
    wx.setStorageSync(NOTIFICATIONS_KEY, list);
    return list;
  } catch (e) {
    console.error('[UserStore] 标记全部已读失败:', e);
    return getNotifications();
  }
}

function getUnreadNotificationCount() {
  var list = getNotifications();
  var count = 0;
  for (var i = 0; i < list.length; i++) {
    if (!list[i].isRead) count++;
  }
  return count;
}

function clearNotifications() {
  try {
    wx.setStorageSync(NOTIFICATIONS_KEY, []);
    return [];
  } catch (e) {
    console.error('[UserStore] 清空通知失败:', e);
    return getNotifications();
  }
}

function initMockNotifications() {
  var existing = getNotifications();
  if (existing.length > 0) return existing;
  var mockList = [
    { type: 'system', title: '欢迎使用桂花茶溯源', content: '感谢您使用一茶一品·桂花茶溯源小程序，我们致力于为您提供透明、可信赖的茶叶溯源服务。', isRead: false },
    { type: 'newBatch', title: '新批次上市通知', content: '金桂系列新批次GH202503已上线，来自武夷山百年茶树园，欢迎查看溯源信息。', isRead: false, extra: { traceId: 'G001' } },
    { type: 'trace', title: '新品溯源已上线', content: '金桂花茶礼盒装（六窨一提）溯源信息已更新，欢迎扫码查看完整溯源链路。', isRead: false },
    { type: 'reportUpdate', title: '检测报告更新', content: '批次GH202503的最新检测报告已更新，所有指标合格，安全放心。', isRead: false, extra: { traceId: 'G001' } },
    { type: 'recall', title: '批次安全提醒', content: '批次GH202504部分产品农残指标异常，如已购买请查看详情并联系客服。', isRead: false },
    { type: 'promotion', title: '金秋促销活动', content: '桂花茶金秋特惠，金桂系列满200减30，活动截止11月30日。', isRead: true },
    { type: 'activity', title: '采摘季活动开始', content: '2025金秋桂花采摘体验活动报名开启，名额有限，先到先得！', isRead: true },
    { type: 'system', title: '隐私政策更新', content: '我们更新了隐私政策，仅收集必要信息以保障您的权益，请查阅最新条款。', isRead: false }
  ];
  var list = [];
  for (var i = 0; i < mockList.length; i++) {
    list.push({
      id: 'notif_init_' + i,
      type: mockList[i].type,
      title: mockList[i].title,
      content: mockList[i].content,
      isRead: mockList[i].isRead,
      createTime: Date.now() - (i * 86400000),
      extra: null
    });
  }
  try {
    wx.setStorageSync(NOTIFICATIONS_KEY, list);
    console.info('[UserStore] 初始化示例通知');
  } catch (e) {
    console.error('[UserStore] 初始化通知失败:', e);
  }
  return list;
}

var DEFAULT_PRIVACY_SETTINGS = {
  allowCollection: false,
  allowLocation: false,
  allowNotification: true,
  allowPhotoSave: true,
  allowAnalyticsCollection: true,
  dataRetentionDays: 90,
  lastUpdated: Date.now()
};

function getPrivacySettings() {
  try {
    var stored = wx.getStorageSync(PRIVACY_SETTINGS_KEY);
    if (!stored) return Object.assign({}, DEFAULT_PRIVACY_SETTINGS);
    return Object.assign({}, DEFAULT_PRIVACY_SETTINGS, stored);
  } catch (e) {
    console.error('[UserStore] 获取隐私设置失败:', e);
    return Object.assign({}, DEFAULT_PRIVACY_SETTINGS);
  }
}

function updatePrivacySettings(updates) {
  try {
    var current = getPrivacySettings();
    var updated = Object.assign({}, current, updates, { lastUpdated: Date.now() });
    wx.setStorageSync(PRIVACY_SETTINGS_KEY, updated);
    console.info('[UserStore] 隐私设置已更新');
    return updated;
  } catch (e) {
    console.error('[UserStore] 更新隐私设置失败:', e);
    return getPrivacySettings();
  }
}

function resetPrivacySettings() {
  try {
    wx.setStorageSync(PRIVACY_SETTINGS_KEY, Object.assign({}, DEFAULT_PRIVACY_SETTINGS));
    return Object.assign({}, DEFAULT_PRIVACY_SETTINGS);
  } catch (e) {
    console.error('[UserStore] 重置隐私设置失败:', e);
    return getPrivacySettings();
  }
}

function getKnowledgeFavorites() {
  try {
    return wx.getStorageSync(KNOWLEDGE_FAVORITES_KEY) || [];
  } catch (e) {
    console.error('[UserStore] 获取知识库收藏列表失败:', e);
    return [];
  }
}

function addKnowledgeFavorite(article) {
  if (!article || !article.id) return getKnowledgeFavorites();
  try {
    var list = getKnowledgeFavorites();
    var idx = -1;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === article.id) { idx = i; break; }
    }
    if (idx !== -1) return list;
    list.unshift({
      id: article.id,
      title: article.title || '',
      subtitle: article.subtitle || '',
      coverImage: article.coverImage || '',
      categoryKey: article.categoryKey || '',
      author: article.author || '',
      publishTime: article.publishTime || '',
      addTime: Date.now()
    });
    if (list.length > MAX_KNOWLEDGE_FAVORITES) list.splice(MAX_KNOWLEDGE_FAVORITES);
    wx.setStorageSync(KNOWLEDGE_FAVORITES_KEY, list);
    console.info('[UserStore] 已收藏知识库文章:', article.id);
    return list;
  } catch (e) {
    console.error('[UserStore] 添加知识库收藏失败:', e);
    return getKnowledgeFavorites();
  }
}

function removeKnowledgeFavorite(articleId) {
  try {
    var list = getKnowledgeFavorites();
    var filtered = list.filter(function(item) { return item.id !== articleId; });
    wx.setStorageSync(KNOWLEDGE_FAVORITES_KEY, filtered);
    console.info('[UserStore] 已取消知识库收藏:', articleId);
    return filtered;
  } catch (e) {
    console.error('[UserStore] 取消知识库收藏失败:', e);
    return getKnowledgeFavorites();
  }
}

function isKnowledgeFavorite(articleId) {
  var list = getKnowledgeFavorites();
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === articleId) return true;
  }
  return false;
}

function clearKnowledgeFavorites() {
  try {
    wx.setStorageSync(KNOWLEDGE_FAVORITES_KEY, []);
    return [];
  } catch (e) {
    console.error('[UserStore] 清空知识库收藏失败:', e);
    return getKnowledgeFavorites();
  }
}

function getBrewRecords() { return brewRecord.getBrewRecords(); }
function addBrewRecord(record) { return brewRecord.addBrewRecord(record); }
function deleteBrewRecord(recordId) { return brewRecord.deleteBrewRecord(recordId); }
function getBrewRecordsByTraceId(traceId) { return brewRecord.getRecordsByTraceId(traceId); }
function getWaterQualitySettings() { return brewRecord.getWaterQualitySettings(); }
function setWaterQualitySettings(settings) { return brewRecord.setWaterQualitySettings(settings); }
function adjustBrewParamsByWaterQuality(hardness, teaAmount, duration) { return brewRecord.adjustBrewParamsByWaterQuality(hardness, teaAmount, duration); }
function getBrewFlavorCurve(traceId) { return brewRecord.getFlavorCurve(traceId); }
function generateTastingNoteDraft(record, productName) { return brewRecord.generateTastingNoteDraft(record, productName); }

function addScanVerifyRecord(traceId) { return reviewTrust.addScanVerifyRecord(traceId); }
function isScanVerified(traceId) { return reviewTrust.isScanVerified(traceId); }
function hasSubmittedReview(traceId) { return reviewTrust.hasSubmittedReview(traceId); }
function addReviewSubmitRecord(traceId, reviewId) { return reviewTrust.addReviewSubmitRecord(traceId, reviewId); }
function determineTrustLevel(traceId, userId, hasOrderInfo) { return reviewTrust.determineTrustLevel(traceId, userId, hasOrderInfo); }
function getTrustLevels() { return reviewTrust.TRUST_LEVELS; }
function getAntiSpamConfig() { return reviewTrust.ANTI_SPAM_CONFIG; }

module.exports = {
  getFavorites: getFavorites,
  addFavorite: addFavorite,
  removeFavorite: removeFavorite,
  isFavorite: isFavorite,
  clearFavorites: clearFavorites,
  getTastingNotes: getTastingNotes,
  addTastingNote: addTastingNote,
  updateTastingNote: updateTastingNote,
  deleteTastingNote: deleteTastingNote,
  getNotifications: getNotifications,
  addNotification: addNotification,
  markNotificationRead: markNotificationRead,
  markAllNotificationsRead: markAllNotificationsRead,
  getUnreadNotificationCount: getUnreadNotificationCount,
  clearNotifications: clearNotifications,
  initMockNotifications: initMockNotifications,
  getPrivacySettings: getPrivacySettings,
  updatePrivacySettings: updatePrivacySettings,
  resetPrivacySettings: resetPrivacySettings,
  getKnowledgeFavorites: getKnowledgeFavorites,
  addKnowledgeFavorite: addKnowledgeFavorite,
  removeKnowledgeFavorite: removeKnowledgeFavorite,
  isKnowledgeFavorite: isKnowledgeFavorite,
  clearKnowledgeFavorites: clearKnowledgeFavorites,
  getBrewRecords: getBrewRecords,
  addBrewRecord: addBrewRecord,
  deleteBrewRecord: deleteBrewRecord,
  getBrewRecordsByTraceId: getBrewRecordsByTraceId,
  getWaterQualitySettings: getWaterQualitySettings,
  setWaterQualitySettings: setWaterQualitySettings,
  adjustBrewParamsByWaterQuality: adjustBrewParamsByWaterQuality,
  getBrewFlavorCurve: getBrewFlavorCurve,
  generateTastingNoteDraft: generateTastingNoteDraft,
  addScanVerifyRecord: addScanVerifyRecord,
  isScanVerified: isScanVerified,
  hasSubmittedReview: hasSubmittedReview,
  addReviewSubmitRecord: addReviewSubmitRecord,
  determineTrustLevel: determineTrustLevel,
  getTrustLevels: getTrustLevels,
  getAntiSpamConfig: getAntiSpamConfig,
  DEFAULT_PRIVACY_SETTINGS: DEFAULT_PRIVACY_SETTINGS,
  FAVORITES_KEY: FAVORITES_KEY,
  NOTES_KEY: NOTES_KEY,
  NOTIFICATIONS_KEY: NOTIFICATIONS_KEY,
  PRIVACY_SETTINGS_KEY: PRIVACY_SETTINGS_KEY,
  KNOWLEDGE_FAVORITES_KEY: KNOWLEDGE_FAVORITES_KEY
};
