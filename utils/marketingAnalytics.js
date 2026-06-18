/**
 * 营销归因与渠道效果分析模块
 * 功能：
 * 1. 启动参数解析：scene → { campaignId, channel, dealerId }
 * 2. 埋点事件管理：scan_success、detail_view_duration、cert_save、share_click、shop_add_cart
 * 3. 本地队列批量上报
 * 4. 关键漏斗分析：扫码 → 验真 → 详情 → 分享/购买
 * 5. 经销商授权区域交叉分析：某 campaign 在何地域转化最高
 * 6. 隐私合规：支持开启/关闭数据收集
 */

const userStore = require('./userStore.js');
const mockData = require('./mockData.js');

const ANALYTICS_QUEUE_KEY = 'analytics_event_queue';
const ANALYTICS_SESSION_KEY = 'analytics_session';
const ANALYTICS_ATTR_KEY = 'marketing_attribution';
const MAX_QUEUE_SIZE = 100;
const BATCH_REPORT_SIZE = 20;
const BATCH_REPORT_INTERVAL = 30000;

const EVENT_TYPES = {
  SCAN_SUCCESS: 'scan_success',
  DETAIL_VIEW_DURATION: 'detail_view_duration',
  CERT_SAVE: 'cert_save',
  SHARE_CLICK: 'share_click',
  SHOP_ADD_CART: 'shop_add_cart',
  PAGE_VIEW: 'page_view'
};

const FUNNEL_STEPS = [
  { key: 'scan', name: '扫码', event: EVENT_TYPES.SCAN_SUCCESS },
  { key: 'verify', name: '验真', event: EVENT_TYPES.SCAN_SUCCESS, condition: 'verifySuccess' },
  { key: 'detail', name: '查看详情', event: EVENT_TYPES.PAGE_VIEW, condition: 'detailPage' },
  { key: 'share', name: '分享', event: EVENT_TYPES.SHARE_CLICK },
  { key: 'cart', name: '加购', event: EVENT_TYPES.SHOP_ADD_CART }
];

const CHANNEL_TYPES = {
  QR_CODE: 'qr_code',
  WECHAT_MOMENTS: 'wechat_moments',
  WECHAT_GROUP: 'wechat_group',
  DOUBYIN: 'douyin',
  WEIBO: 'weibo',
  SHARE: 'share',
  SEARCH: 'search',
  AD: 'ad',
  OFFICIAL: 'official',
  UNKNOWN: 'unknown'
};

const CHANNEL_LIST = [
  { channel: CHANNEL_TYPES.QR_CODE, name: '扫码直达', icon: '📱' },
  { channel: CHANNEL_TYPES.WECHAT_MOMENTS, name: '微信朋友圈', icon: '🌐' },
  { channel: CHANNEL_TYPES.WECHAT_GROUP, name: '微信群', icon: '👥' },
  { channel: CHANNEL_TYPES.DOUBYIN, name: '抖音', icon: '🎵' },
  { channel: CHANNEL_TYPES.WEIBO, name: '微博', icon: '📢' },
  { channel: CHANNEL_TYPES.SHARE, name: '社交分享', icon: '🔗' },
  { channel: CHANNEL_TYPES.SEARCH, name: '搜索', icon: '🔍' },
  { channel: CHANNEL_TYPES.AD, name: '广告投放', icon: '📊' },
  { channel: CHANNEL_TYPES.OFFICIAL, name: '官方渠道', icon: '🏛️' },
  { channel: CHANNEL_TYPES.UNKNOWN, name: '未知渠道', icon: '❓' }
];

let _session = null;
let _attribution = null;
let _reportTimer = null;
let _pageEnterTime = {};

function _isCollectionEnabled() {
  try {
    const settings = userStore.getPrivacySettings();
    return settings && settings.allowAnalyticsCollection !== false;
  } catch (e) {
    return false;
  }
}

function _getQueue() {
  try {
    const queue = wx.getStorageSync(ANALYTICS_QUEUE_KEY);
    return Array.isArray(queue) ? queue : [];
  } catch (e) {
    console.error('[Analytics] 获取事件队列失败:', e);
    return [];
  }
}

function _saveQueue(queue) {
  try {
    if (queue.length > MAX_QUEUE_SIZE) {
      queue = queue.slice(-MAX_QUEUE_SIZE);
    }
    wx.setStorageSync(ANALYTICS_QUEUE_KEY, queue);
    return true;
  } catch (e) {
    console.error('[Analytics] 保存事件队列失败:', e);
    return false;
  }
}

function _getSession() {
  if (_session) return _session;
  try {
    const session = wx.getStorageSync(ANALYTICS_SESSION_KEY);
    if (session && session.sessionId) {
      const now = Date.now();
      if (now - session.lastActiveTime < 30 * 60 * 1000) {
        _session = session;
        return _session;
      }
    }
  } catch (e) {}
  _session = _createNewSession();
  return _session;
}

function _createNewSession() {
  const session = {
    sessionId: 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8),
    startTime: Date.now(),
    lastActiveTime: Date.now(),
    visitCount: 1
  };
  try {
    wx.setStorageSync(ANALYTICS_SESSION_KEY, session);
  } catch (e) {}
  return session;
}

function _touchSession() {
  const session = _getSession();
  session.lastActiveTime = Date.now();
  try {
    wx.setStorageSync(ANALYTICS_SESSION_KEY, session);
  } catch (e) {}
}

function _getAttribution() {
  if (_attribution) return _attribution;
  try {
    const attr = wx.getStorageSync(ANALYTICS_ATTR_KEY);
    if (attr && attr.campaignId) {
      _attribution = attr;
      return _attribution;
    }
  } catch (e) {}
  return null;
}

function _saveAttribution(attr) {
  _attribution = attr;
  try {
    wx.setStorageSync(ANALYTICS_ATTR_KEY, attr);
  } catch (e) {
    console.error('[Analytics] 保存归因数据失败:', e);
  }
}

function parseScene(sceneStr) {
  const result = {
    campaignId: '',
    channel: CHANNEL_TYPES.UNKNOWN,
    dealerId: '',
    rawScene: sceneStr || ''
  };

  if (!sceneStr) return result;

  try {
    if (typeof sceneStr === 'object') {
      if (sceneStr.campaignId) result.campaignId = String(sceneStr.campaignId);
      if (sceneStr.channel) result.channel = String(sceneStr.channel);
      if (sceneStr.dealerId) result.dealerId = String(sceneStr.dealerId);
      return result;
    }

    const scene = String(sceneStr);

    if (scene.startsWith('{')) {
      try {
        const json = JSON.parse(scene);
        if (json.campaignId) result.campaignId = String(json.campaignId);
        if (json.channel) result.channel = String(json.channel);
        if (json.dealerId) result.dealerId = String(json.dealerId);
        return result;
      } catch (e) {}
    }

    if (scene.includes('?') || scene.includes('&')) {
      const params = {};
      const queryStr = scene.includes('?') ? scene.split('?')[1] : scene;
      queryStr.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        if (key && value !== undefined) {
          params[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      });
      if (params.campaignId) result.campaignId = params.campaignId;
      if (params.channel) result.channel = params.channel;
      if (params.dealerId) result.dealerId = params.dealerId;
      return result;
    }

    const parts = scene.split('_');
    if (parts.length >= 2) {
      const knownChannels = CHANNEL_LIST.map(c => c.channel);
      let channelIdx = -1;
      let dealerIdx = -1;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (knownChannels.includes(part) && channelIdx === -1) {
          channelIdx = i;
        }
        if (/^D\d+$/i.test(part) && dealerIdx === -1) {
          dealerIdx = i;
        }
      }

      if (channelIdx >= 0) {
        result.channel = parts[channelIdx];
      }

      if (dealerIdx >= 0) {
        result.dealerId = parts[dealerIdx];
      }

      const campaignParts = [];
      for (let i = 0; i < parts.length; i++) {
        if (i !== channelIdx && i !== dealerIdx) {
          campaignParts.push(parts[i]);
        }
      }
      if (campaignParts.length > 0) {
        result.campaignId = campaignParts.join('_');
      }
    }

    if (scene.startsWith('qr_')) {
      result.channel = CHANNEL_TYPES.QR_CODE;
    } else if (scene.startsWith('share_')) {
      result.channel = CHANNEL_TYPES.SHARE;
    } else if (scene.startsWith('ad_')) {
      result.channel = CHANNEL_TYPES.AD;
    }
  } catch (e) {
    console.error('[Analytics] 解析 scene 失败:', e);
  }

  return result;
}

function initAttribution(launchOptions) {
  if (!_isCollectionEnabled()) return null;

  const attr = _getAttribution();
  let newAttr = null;

  if (launchOptions && launchOptions.query) {
    const query = launchOptions.query;
    if (query.campaignId || query.channel || query.dealerId) {
      newAttr = {
        campaignId: query.campaignId || '',
        channel: query.channel || CHANNEL_TYPES.UNKNOWN,
        dealerId: query.dealerId || '',
        source: 'query',
        firstTouchTime: Date.now(),
        lastTouchTime: Date.now()
      };
    }
  }

  if (!newAttr && launchOptions && launchOptions.scene) {
    const parsed = parseScene(launchOptions.scene);
    if (parsed.campaignId || parsed.dealerId || parsed.channel !== CHANNEL_TYPES.UNKNOWN) {
      newAttr = {
        campaignId: parsed.campaignId,
        channel: parsed.channel,
        dealerId: parsed.dealerId,
        source: 'scene',
        firstTouchTime: Date.now(),
        lastTouchTime: Date.now()
      };
    }
  }

  if (!newAttr && launchOptions && launchOptions.shareTicket) {
    newAttr = {
      campaignId: attr ? attr.campaignId : '',
      channel: CHANNEL_TYPES.SHARE,
      dealerId: attr ? attr.dealerId : '',
      source: 'share',
      firstTouchTime: Date.now(),
      lastTouchTime: Date.now()
    };
  }

  if (newAttr) {
    if (!attr) {
      _saveAttribution(newAttr);
    } else {
      const updated = Object.assign({}, attr, {
        lastTouchTime: Date.now()
      });
      if (newAttr.campaignId && newAttr.campaignId !== attr.campaignId) {
        updated.campaignId = newAttr.campaignId;
      }
      if (newAttr.channel && newAttr.channel !== attr.channel) {
        updated.channel = newAttr.channel;
      }
      if (newAttr.dealerId && newAttr.dealerId !== attr.dealerId) {
        updated.dealerId = newAttr.dealerId;
      }
      _saveAttribution(updated);
    }
  }

  _touchSession();
  return _getAttribution();
}

function trackEvent(eventName, eventData) {
  if (!_isCollectionEnabled()) return false;

  try {
    const session = _getSession();
    const attr = _getAttribution();

    const event = {
      eventId: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      eventName: eventName,
      eventTime: Date.now(),
      sessionId: session.sessionId,
      campaignId: attr ? attr.campaignId : '',
      channel: attr ? attr.channel : '',
      dealerId: attr ? attr.dealerId : '',
      data: eventData || {},
      timestamp: Date.now()
    };

    const queue = _getQueue();
    queue.push(event);
    _saveQueue(queue);
    _touchSession();

    if (queue.length >= BATCH_REPORT_SIZE) {
      _batchReport();
    }

    console.log('[Analytics] 埋点事件:', eventName, eventData);
    return true;
  } catch (e) {
    console.error('[Analytics] 埋点失败:', e);
    return false;
  }
}

function _batchReport() {
  const queue = _getQueue();
  if (queue.length === 0) return;

  const batch = queue.slice(0, BATCH_REPORT_SIZE);
  const remaining = queue.slice(BATCH_REPORT_SIZE);

  console.log('[Analytics] 批量上报事件:', batch.length, '条');

  // TODO: 实际项目中通过 wx.request 上报到服务端
  // 这里仅做本地日志记录

  _saveQueue(remaining);
}

function startBatchReportTimer() {
  if (_reportTimer) return;
  _reportTimer = setInterval(() => {
    _batchReport();
  }, BATCH_REPORT_INTERVAL);
}

function stopBatchReportTimer() {
  if (_reportTimer) {
    clearInterval(_reportTimer);
    _reportTimer = null;
  }
}

function flushAndReport() {
  _batchReport();
}

function trackPageEnter(pageName, pageData) {
  if (!_isCollectionEnabled()) return;
  _pageEnterTime[pageName] = Date.now();
  trackEvent(EVENT_TYPES.PAGE_VIEW, Object.assign({
    pageName: pageName,
    action: 'enter'
  }, pageData || {}));
}

function trackPageLeave(pageName, extraData) {
  if (!_isCollectionEnabled()) return;

  const enterTime = _pageEnterTime[pageName];
  const duration = enterTime ? Date.now() - enterTime : 0;

  if (pageName === 'detail') {
    trackEvent(EVENT_TYPES.DETAIL_VIEW_DURATION, Object.assign({
      duration: duration,
      durationSeconds: Math.round(duration / 1000)
    }, extraData || {}));
  }

  trackEvent(EVENT_TYPES.PAGE_VIEW, Object.assign({
    pageName: pageName,
    action: 'leave',
    duration: duration
  }, extraData || {}));

  delete _pageEnterTime[pageName];
}

function trackScanSuccess(scanData) {
  return trackEvent(EVENT_TYPES.SCAN_SUCCESS, Object.assign({
    verifySuccess: true
  }, scanData || {}));
}

function trackCertSave(certData) {
  return trackEvent(EVENT_TYPES.CERT_SAVE, certData || {});
}

function trackShareClick(shareData) {
  return trackEvent(EVENT_TYPES.SHARE_CLICK, shareData || {});
}

function trackShopAddCart(cartData) {
  return trackEvent(EVENT_TYPES.SHOP_ADD_CART, cartData || {});
}

function getFunnelAnalysis(campaignId, dealerId) {
  const queue = _getQueue();
  const filtered = queue.filter(evt => {
    let match = true;
    if (campaignId && evt.campaignId !== campaignId) match = false;
    if (dealerId && evt.dealerId !== dealerId) match = false;
    return match;
  });

  const stepCounts = {};
  FUNNEL_STEPS.forEach(step => {
    stepCounts[step.key] = 0;
  });

  const scanEvents = filtered.filter(e => e.eventName === EVENT_TYPES.SCAN_SUCCESS);
  stepCounts.scan = scanEvents.length;

  const verifyEvents = scanEvents.filter(e => e.data && e.data.verifySuccess);
  stepCounts.verify = verifyEvents.length;

  const detailEvents = filtered.filter(e =>
    e.eventName === EVENT_TYPES.PAGE_VIEW &&
    e.data && e.data.pageName === 'detail' && e.data.action === 'enter'
  );
  stepCounts.detail = detailEvents.length;

  const shareEvents = filtered.filter(e => e.eventName === EVENT_TYPES.SHARE_CLICK);
  stepCounts.share = shareEvents.length;

  const cartEvents = filtered.filter(e => e.eventName === EVENT_TYPES.SHOP_ADD_CART);
  stepCounts.cart = cartEvents.length;

  let prevCount = stepCounts.scan || 1;
  const funnelData = FUNNEL_STEPS.map((step, index) => {
    const count = stepCounts[step.key] || 0;
    const conversionRate = prevCount > 0 ? (count / prevCount * 100).toFixed(2) : '0.00';
    const overallRate = stepCounts.scan > 0 ? (count / stepCounts.scan * 100).toFixed(2) : '0.00';
    prevCount = count || prevCount;
    return {
      key: step.key,
      name: step.name,
      count: count,
      conversionRate: conversionRate + '%',
      overallRate: overallRate + '%',
      index: index
    };
  });

  return {
    funnelSteps: funnelData,
    totalScans: stepCounts.scan,
    totalCart: stepCounts.cart,
    overallConversion: stepCounts.scan > 0
      ? (stepCounts.cart / stepCounts.scan * 100).toFixed(2) + '%'
      : '0.00%'
  };
}

function getChannelAnalysis(campaignId) {
  const queue = _getQueue();
  const filtered = campaignId
    ? queue.filter(e => e.campaignId === campaignId)
    : queue;

  const channelStats = {};

  filtered.forEach(event => {
    const channel = event.channel || CHANNEL_TYPES.UNKNOWN;
    if (!channelStats[channel]) {
      channelStats[channel] = {
        channel: channel,
        channelName: _getChannelName(channel),
        eventCount: 0,
        scanCount: 0,
        detailViewCount: 0,
        shareCount: 0,
        cartCount: 0,
        conversionRate: '0%'
      };
    }
    channelStats[channel].eventCount++;

    switch (event.eventName) {
      case EVENT_TYPES.SCAN_SUCCESS:
        channelStats[channel].scanCount++;
        break;
      case EVENT_TYPES.PAGE_VIEW:
        if (event.data && event.data.pageName === 'detail' && event.data.action === 'enter') {
          channelStats[channel].detailViewCount++;
        }
        break;
      case EVENT_TYPES.SHARE_CLICK:
        channelStats[channel].shareCount++;
        break;
      case EVENT_TYPES.SHOP_ADD_CART:
        channelStats[channel].cartCount++;
        break;
    }
  });

  const result = Object.values(channelStats).map(stat => {
    const scan = stat.scanCount || 1;
    stat.conversionRate = ((stat.cartCount / scan) * 100).toFixed(2) + '%';
    return stat;
  }).sort((a, b) => b.cartCount - a.cartCount);

  return result;
}

function _getChannelName(channel) {
  const found = CHANNEL_LIST.find(c => c.channel === channel);
  return found ? found.name : channel;
}

function getRegionAnalysis(campaignId) {
  const queue = _getQueue();
  const filtered = campaignId
    ? queue.filter(e => e.campaignId === campaignId)
    : queue;

  const regionStats = {};

  filtered.forEach(event => {
    const region = (event.data && event.data.region) || '未知';
    const dealerId = event.dealerId || '';

    if (!regionStats[region]) {
      regionStats[region] = {
        region: region,
        dealerId: dealerId,
        dealerName: dealerId ? mockData.getDealerNameById(dealerId) : '',
        scanCount: 0,
        verifyCount: 0,
        detailCount: 0,
        cartCount: 0,
        shareCount: 0,
        conversionRate: '0%'
      };
    }

    switch (event.eventName) {
      case EVENT_TYPES.SCAN_SUCCESS:
        regionStats[region].scanCount++;
        if (event.data && event.data.verifySuccess) {
          regionStats[region].verifyCount++;
        }
        break;
      case EVENT_TYPES.PAGE_VIEW:
        if (event.data && event.data.pageName === 'detail' && event.data.action === 'enter') {
          regionStats[region].detailCount++;
        }
        break;
      case EVENT_TYPES.SHOP_ADD_CART:
        regionStats[region].cartCount++;
        break;
      case EVENT_TYPES.SHARE_CLICK:
        regionStats[region].shareCount++;
        break;
    }
  });

  const result = Object.values(regionStats).map(stat => {
    const scan = stat.scanCount || 1;
    stat.conversionRate = ((stat.cartCount / scan) * 100).toFixed(2) + '%';
    return stat;
  }).sort((a, b) => b.cartCount - a.cartCount);

  const topRegion = result.length > 0 ? result[0] : null;

  return {
    regions: result,
    topRegion: topRegion,
    totalRegions: result.length
  };
}

function getDealerAnalysis() {
  const queue = _getQueue();
  const dealerStats = {};

  queue.forEach(event => {
    const dealerId = event.dealerId;
    if (!dealerId) return;

    if (!dealerStats[dealerId]) {
      dealerStats[dealerId] = {
        dealerId: dealerId,
        dealerName: mockData.getDealerNameById(dealerId) || dealerId,
        scanCount: 0,
        verifyCount: 0,
        detailCount: 0,
        cartCount: 0,
        conversionRate: '0%'
      };
    }

    switch (event.eventName) {
      case EVENT_TYPES.SCAN_SUCCESS:
        dealerStats[dealerId].scanCount++;
        if (event.data && event.data.verifySuccess) {
          dealerStats[dealerId].verifyCount++;
        }
        break;
      case EVENT_TYPES.PAGE_VIEW:
        if (event.data && event.data.pageName === 'detail' && event.data.action === 'enter') {
          dealerStats[dealerId].detailCount++;
        }
        break;
      case EVENT_TYPES.SHOP_ADD_CART:
        dealerStats[dealerId].cartCount++;
        break;
    }
  });

  return Object.values(dealerStats).map(stat => {
    const scan = stat.scanCount || 1;
    stat.conversionRate = ((stat.cartCount / scan) * 100).toFixed(2) + '%';
    return stat;
  }).sort((a, b) => b.scanCount - a.scanCount);
}

function getCampaignList() {
  const queue = _getQueue();
  const campaigns = {};

  queue.forEach(event => {
    if (!event.campaignId) return;
    if (!campaigns[event.campaignId]) {
      campaigns[event.campaignId] = {
        campaignId: event.campaignId,
        campaignName: mockData.getCampaignNameById(event.campaignId) || event.campaignId,
        eventCount: 0,
        scanCount: 0,
        cartCount: 0
      };
    }
    campaigns[event.campaignId].eventCount++;
    if (event.eventName === EVENT_TYPES.SCAN_SUCCESS) {
      campaigns[event.campaignId].scanCount++;
    }
    if (event.eventName === EVENT_TYPES.SHOP_ADD_CART) {
      campaigns[event.campaignId].cartCount++;
    }
  });

  return Object.values(campaigns).sort((a, b) => b.eventCount - a.eventCount);
}

function getAllEvents(limit) {
  const queue = _getQueue();
  if (limit) return queue.slice(-limit).reverse();
  return queue.slice().reverse();
}

function clearAllEvents() {
  try {
    wx.setStorageSync(ANALYTICS_QUEUE_KEY, []);
    return true;
  } catch (e) {
    return false;
  }
}

function getCurrentAttribution() {
  return _getAttribution();
}

function getCurrentSession() {
  return _getSession();
}

module.exports = {
  EVENT_TYPES: EVENT_TYPES,
  FUNNEL_STEPS: FUNNEL_STEPS,
  CHANNEL_TYPES: CHANNEL_TYPES,
  CHANNEL_LIST: CHANNEL_LIST,

  parseScene: parseScene,
  initAttribution: initAttribution,
  getCurrentAttribution: getCurrentAttribution,
  getCurrentSession: getCurrentSession,

  trackEvent: trackEvent,
  trackScanSuccess: trackScanSuccess,
  trackCertSave: trackCertSave,
  trackShareClick: trackShareClick,
  trackShopAddCart: trackShopAddCart,
  trackPageEnter: trackPageEnter,
  trackPageLeave: trackPageLeave,

  startBatchReportTimer: startBatchReportTimer,
  stopBatchReportTimer: stopBatchReportTimer,
  flushAndReport: flushAndReport,

  getFunnelAnalysis: getFunnelAnalysis,
  getChannelAnalysis: getChannelAnalysis,
  getRegionAnalysis: getRegionAnalysis,
  getDealerAnalysis: getDealerAnalysis,
  getCampaignList: getCampaignList,

  getAllEvents: getAllEvents,
  clearAllEvents: clearAllEvents,

  ANALYTICS_QUEUE_KEY: ANALYTICS_QUEUE_KEY,
  ANALYTICS_SESSION_KEY: ANALYTICS_SESSION_KEY,
  ANALYTICS_ATTR_KEY: ANALYTICS_ATTR_KEY
};
