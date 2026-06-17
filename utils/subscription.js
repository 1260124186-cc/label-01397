var SUBSCRIPTION_KEY = 'user_subscriptions';
var BATCH_SUBSCRIPTION_KEY = 'user_batch_subscriptions';

var MESSAGE_TYPES = {
  newBatch: { key: 'newBatch', label: '新批次上市', icon: '📦', color: '#2E8B57' },
  reportUpdate: { key: 'reportUpdate', label: '检测报告更新', icon: '🔬', color: '#1890FF' },
  promotion: { key: 'promotion', label: '促销活动', icon: '🎉', color: '#DAA520' }
};

var VARIETIES = [
  { key: 'jin-gui', name: '金桂', icon: '🌼', color: '#DAA520' },
  { key: 'yin-gui', name: '银桂', icon: '🌸', color: '#C0C0C0' }
];

var REGIONS = [
  { key: 'wuyi', name: '福建武夷山', icon: '⛰️' },
  { key: 'xianning', name: '湖北咸宁', icon: '🌼' },
  { key: 'hangzhou', name: '浙江杭州', icon: '🏯' },
  { key: 'chengdu', name: '四川成都', icon: '🐼' }
];

var DEFAULT_SUBSCRIPTION = {
  messageTypes: {
    newBatch: true,
    reportUpdate: true,
    promotion: false
  },
  varieties: {
    'jin-gui': true,
    'yin-gui': false
  },
  regions: {
    'wuyi': true,
    'xianning': true,
    'hangzhou': false,
    'chengdu': false
  },
  enabled: true,
  lastUpdated: Date.now()
};

function getSubscriptions() {
  try {
    var stored = wx.getStorageSync(SUBSCRIPTION_KEY);
    if (!stored) return Object.assign({}, DEFAULT_SUBSCRIPTION);
    return Object.assign({}, DEFAULT_SUBSCRIPTION, stored);
  } catch (e) {
    console.error('[Subscription] 获取订阅偏好失败:', e);
    return Object.assign({}, DEFAULT_SUBSCRIPTION);
  }
}

function updateSubscriptions(updates) {
  try {
    var current = getSubscriptions();
    var updated = Object.assign({}, current, updates, { lastUpdated: Date.now() });
    wx.setStorageSync(SUBSCRIPTION_KEY, updated);
    console.info('[Subscription] 订阅偏好已更新');
    return updated;
  } catch (e) {
    console.error('[Subscription] 更新订阅偏好失败:', e);
    return getSubscriptions();
  }
}

function toggleMessageType(typeKey) {
  var current = getSubscriptions();
  var types = Object.assign({}, current.messageTypes);
  types[typeKey] = !types[typeKey];
  return updateSubscriptions({ messageTypes: types });
}

function toggleVariety(varietyKey) {
  var current = getSubscriptions();
  var varieties = Object.assign({}, current.varieties);
  varieties[varietyKey] = !varieties[varietyKey];
  return updateSubscriptions({ varieties: varieties });
}

function toggleRegion(regionKey) {
  var current = getSubscriptions();
  var regions = Object.assign({}, current.regions);
  regions[regionKey] = !regions[regionKey];
  return updateSubscriptions({ regions: regions });
}

function toggleSubscriptionEnabled() {
  var current = getSubscriptions();
  return updateSubscriptions({ enabled: !current.enabled });
}

function isMessageTypeSubscribed(typeKey) {
  var sub = getSubscriptions();
  return sub.enabled && sub.messageTypes[typeKey];
}

function isVarietySubscribed(varietyKey) {
  var sub = getSubscriptions();
  return sub.enabled && sub.varieties[varietyKey];
}

function isRegionSubscribed(regionKey) {
  var sub = getSubscriptions();
  return sub.enabled && sub.regions[regionKey];
}

function getBatchSubscriptions() {
  try {
    return wx.getStorageSync(BATCH_SUBSCRIPTION_KEY) || [];
  } catch (e) {
    console.error('[Subscription] 获取批次订阅失败:', e);
    return [];
  }
}

function subscribeBatch(batchNo, traceId, productName) {
  if (!batchNo) return getBatchSubscriptions();
  try {
    var list = getBatchSubscriptions();
    var idx = -1;
    for (var i = 0; i < list.length; i++) {
      if (list[i].batchNo === batchNo) { idx = i; break; }
    }
    if (idx !== -1) return list;
    list.unshift({
      batchNo: batchNo,
      traceId: traceId || '',
      productName: productName || '',
      subscribeTime: Date.now()
    });
    if (list.length > 50) list.splice(50);
    wx.setStorageSync(BATCH_SUBSCRIPTION_KEY, list);
    console.info('[Subscription] 已订阅批次:', batchNo);
    return list;
  } catch (e) {
    console.error('[Subscription] 订阅批次失败:', e);
    return getBatchSubscriptions();
  }
}

function unsubscribeBatch(batchNo) {
  try {
    var list = getBatchSubscriptions();
    var filtered = list.filter(function(item) { return item.batchNo !== batchNo; });
    wx.setStorageSync(BATCH_SUBSCRIPTION_KEY, filtered);
    console.info('[Subscription] 已取消订阅批次:', batchNo);
    return filtered;
  } catch (e) {
    console.error('[Subscription] 取消订阅批次失败:', e);
    return getBatchSubscriptions();
  }
}

function isBatchSubscribed(batchNo) {
  var list = getBatchSubscriptions();
  for (var i = 0; i < list.length; i++) {
    if (list[i].batchNo === batchNo) return true;
  }
  return false;
}

function clearBatchSubscriptions() {
  try {
    wx.setStorageSync(BATCH_SUBSCRIPTION_KEY, []);
    return [];
  } catch (e) {
    console.error('[Subscription] 清空批次订阅失败:', e);
    return getBatchSubscriptions();
  }
}

function shouldNotify(notification) {
  var sub = getSubscriptions();
  if (!sub.enabled) return false;
  if (!notification) return false;

  var typeKey = notification.type;
  if (sub.messageTypes[typeKey] === false) return false;

  if (notification.varietyKey && sub.varieties[notification.varietyKey] === false) return false;

  if (notification.regionKey && sub.regions[notification.regionKey] === false) return false;

  return true;
}

function generateMockSubscriptionNotifications() {
  var sub = getSubscriptions();
  if (!sub.enabled) return [];

  var notifications = [];

  if (sub.messageTypes.newBatch) {
    if (sub.varieties['jin-gui']) {
      notifications.push({
        type: 'newBatch',
        title: '新批次上市通知',
        content: '金桂系列新批次GH202505已上线，来自武夷山百年茶树园，欢迎查看溯源信息。',
        extra: { traceId: 'G001', varietyKey: 'jin-gui', regionKey: 'wuyi' }
      });
    }
    if (sub.varieties['yin-gui']) {
      notifications.push({
        type: 'newBatch',
        title: '新批次上市通知',
        content: '银桂系列新批次GH202506已上线，清雅淡香，欢迎品鉴。',
        extra: { traceId: 'G002', varietyKey: 'yin-gui', regionKey: 'xianning' }
      });
    }
  }

  if (sub.messageTypes.reportUpdate) {
    notifications.push({
      type: 'reportUpdate',
      title: '检测报告更新',
      content: '批次GH202503的最新检测报告已更新，所有指标合格，安全放心。',
      extra: { traceId: 'G001', varietyKey: 'jin-gui', regionKey: 'wuyi' }
    });
  }

  if (sub.messageTypes.promotion) {
    notifications.push({
      type: 'promotion',
      title: '金秋促销活动',
      content: '桂花茶金秋特惠，金桂系列满200减30，活动截止11月30日。',
      extra: { url: '/pages/shop/list', varietyKey: 'jin-gui' }
    });
  }

  return notifications;
}

module.exports = {
  MESSAGE_TYPES: MESSAGE_TYPES,
  VARIETIES: VARIETIES,
  REGIONS: REGIONS,
  DEFAULT_SUBSCRIPTION: DEFAULT_SUBSCRIPTION,
  getSubscriptions: getSubscriptions,
  updateSubscriptions: updateSubscriptions,
  toggleMessageType: toggleMessageType,
  toggleVariety: toggleVariety,
  toggleRegion: toggleRegion,
  toggleSubscriptionEnabled: toggleSubscriptionEnabled,
  isMessageTypeSubscribed: isMessageTypeSubscribed,
  isVarietySubscribed: isVarietySubscribed,
  isRegionSubscribed: isRegionSubscribed,
  getBatchSubscriptions: getBatchSubscriptions,
  subscribeBatch: subscribeBatch,
  unsubscribeBatch: unsubscribeBatch,
  isBatchSubscribed: isBatchSubscribed,
  clearBatchSubscriptions: clearBatchSubscriptions,
  shouldNotify: shouldNotify,
  generateMockSubscriptionNotifications: generateMockSubscriptionNotifications,
  SUBSCRIPTION_KEY: SUBSCRIPTION_KEY,
  BATCH_SUBSCRIPTION_KEY: BATCH_SUBSCRIPTION_KEY
};
