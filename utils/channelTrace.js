/**
 * 经销商与渠道溯源模块
 * 功能：
 * 1. 溯源码分级管理：生产码、箱码、门店码
 * 2. 经销商扫码入库/出库登记
 * 3. 消费者扫码查看经手渠道
 * 4. 窜货预警：非授权区域首次扫码告警
 */

const mockData = require('./mockData.js');

const CODE_TYPE_PRODUCTION = 'production';
const CODE_TYPE_BOX = 'box';
const CODE_TYPE_STORE = 'store';

const CODE_TYPE_MAP = {
  [CODE_TYPE_PRODUCTION]: { label: '生产码', icon: '🏭', color: '#1890FF' },
  [CODE_TYPE_BOX]: { label: '箱码', icon: '📦', color: '#DAA520' },
  [CODE_TYPE_STORE]: { label: '门店码', icon: '🏪', color: '#2E8B57' }
};

const INOUT_KEY = 'channel_inout_records';
const INVENTORY_KEY = 'channel_inventory';
const DIVERGENCE_ALERT_KEY = 'channel_divergence_alerts';
const CURRENT_DEALER_KEY = 'current_dealer';

function getCurrentDealer() {
  try {
    const dealer = wx.getStorageSync(CURRENT_DEALER_KEY);
    if (dealer && dealer.id) return dealer;
    return mockData.getDefaultDealer();
  } catch (e) {
    console.error('[渠道溯源] 获取当前经销商失败:', e);
    return mockData.getDefaultDealer();
  }
}

function setCurrentDealer(dealer) {
  try {
    wx.setStorageSync(CURRENT_DEALER_KEY, dealer);
    return true;
  } catch (e) {
    console.error('[渠道溯源] 保存当前经销商失败:', e);
    return false;
  }
}

function detectCodeType(code) {
  if (!code) return 'unknown';
  if (code.startsWith('P-')) return CODE_TYPE_PRODUCTION;
  if (code.startsWith('B-')) return CODE_TYPE_BOX;
  if (code.startsWith('S-')) return CODE_TYPE_STORE;
  if (/^G\d+$/.test(code)) return CODE_TYPE_PRODUCTION;
  return 'unknown';
}

function getCodeTypeInfo(type) {
  return CODE_TYPE_MAP[type] || null;
}

function getInOutRecords() {
  try {
    const records = wx.getStorageSync(INOUT_KEY);
    return Array.isArray(records) ? records : [];
  } catch (e) {
    console.error('[渠道溯源] 获取出入库记录失败:', e);
    return [];
  }
}

function saveInOutRecords(records) {
  try {
    wx.setStorageSync(INOUT_KEY, records);
    return true;
  } catch (e) {
    console.error('[渠道溯源] 保存出入库记录失败:', e);
    return false;
  }
}

function getInventory() {
  try {
    const inventory = wx.getStorageSync(INVENTORY_KEY);
    return inventory && typeof inventory === 'object' ? inventory : {};
  } catch (e) {
    console.error('[渠道溯源] 获取库存失败:', e);
    return {};
  }
}

function saveInventory(inventory) {
  try {
    wx.setStorageSync(INVENTORY_KEY, inventory);
    return true;
  } catch (e) {
    console.error('[渠道溯源] 保存库存失败:', e);
    return false;
  }
}

function getDivergenceAlerts() {
  try {
    const alerts = wx.getStorageSync(DIVERGENCE_ALERT_KEY);
    return Array.isArray(alerts) ? alerts : [];
  } catch (e) {
    console.error('[渠道溯源] 获取窜货告警失败:', e);
    return [];
  }
}

function saveDivergenceAlerts(alerts) {
  try {
    wx.setStorageSync(DIVERGENCE_ALERT_KEY, alerts);
    return true;
  } catch (e) {
    console.error('[渠道溯源] 保存窜货告警失败:', e);
    return false;
  }
}

function formatDateTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function parseTraceCode(input) {
  if (!input) return { success: false, error: '溯源码不能为空' };

  let code = input.trim();

  if (code.includes('?')) {
    try {
      const urlParams = new URLSearchParams(code.split('?')[1]);
      if (urlParams.get('traceId')) code = urlParams.get('traceId');
      else if (urlParams.get('id')) code = urlParams.get('id');
      else if (urlParams.get('code')) code = urlParams.get('code');
    } catch (e) {}
  }

  if (code.startsWith('{')) {
    try {
      const json = JSON.parse(code);
      if (json.traceId) code = json.traceId;
      else if (json.id) code = json.id;
      else if (json.code) code = json.code;
    } catch (e) {}
  }

  const codeType = detectCodeType(code);
  if (codeType === 'unknown' || !codeType) {
    return { success: false, error: '无效的溯源码格式' };
  }

  const traceInfo = mockData.getTraceInfoByCode(code, codeType);
  if (!traceInfo) {
    return { success: false, error: '未找到该溯源码对应产品' };
  }

  return {
    success: true,
    code: code,
    codeType: codeType,
    codeTypeInfo: CODE_TYPE_MAP[codeType],
    traceInfo: traceInfo
  };
}

function stockIn(dealer, code, codeType, traceInfo, quantity) {
  if (!dealer || !dealer.id) {
    return { success: false, error: '经销商信息无效' };
  }
  if (!code) {
    return { success: false, error: '溯源码不能为空' };
  }

  const records = getInOutRecords();
  const inventory = getInventory();

  const qty = quantity || traceInfo.quantity || 1;

  const record = {
    id: `in_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    type: 'in',
    dealerId: dealer.id,
    dealerName: dealer.name,
    dealerLevel: dealer.level,
    code: code,
    codeType: codeType,
    codeTypeLabel: CODE_TYPE_MAP[codeType] ? CODE_TYPE_MAP[codeType].label : '',
    traceId: traceInfo.traceId,
    productName: traceInfo.productName,
    batchNo: traceInfo.batchNo,
    quantity: qty,
    fromDealerId: traceInfo.fromDealerId || 'factory',
    fromDealerName: traceInfo.fromDealerName || '生产厂家',
    timestamp: Date.now(),
    timestampStr: formatDateTime(Date.now()),
    remark: ''
  };

  records.unshift(record);

  const invKey = `${dealer.id}_${traceInfo.traceId}`;
  if (!inventory[invKey]) {
    inventory[invKey] = {
      dealerId: dealer.id,
      traceId: traceInfo.traceId,
      productName: traceInfo.productName,
      batchNo: traceInfo.batchNo,
      quantity: 0,
      lastUpdate: Date.now()
    };
  }
  inventory[invKey].quantity += qty;
  inventory[invKey].lastUpdate = Date.now();

  saveInOutRecords(records);
  saveInventory(inventory);

  mockData.updateCodeFlow(code, codeType, {
    dealerId: dealer.id,
    dealerName: dealer.name,
    dealerLevel: dealer.level,
    action: 'stockIn',
    timestamp: Date.now()
  });

  return {
    success: true,
    message: `入库成功，${traceInfo.productName} x ${qty}`,
    record: record,
    inventory: inventory[invKey]
  };
}

function stockOut(dealer, code, codeType, traceInfo, quantity, toDealer) {
  if (!dealer || !dealer.id) {
    return { success: false, error: '经销商信息无效' };
  }
  if (!code) {
    return { success: false, error: '溯源码不能为空' };
  }

  const records = getInOutRecords();
  const inventory = getInventory();

  const qty = quantity || traceInfo.quantity || 1;
  const invKey = `${dealer.id}_${traceInfo.traceId}`;

  if (!inventory[invKey] || inventory[invKey].quantity < qty) {
    return {
      success: false,
      error: `库存不足，当前库存：${inventory[invKey] ? inventory[invKey].quantity : 0}`
    };
  }

  const record = {
    id: `out_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    type: 'out',
    dealerId: dealer.id,
    dealerName: dealer.name,
    dealerLevel: dealer.level,
    code: code,
    codeType: codeType,
    codeTypeLabel: CODE_TYPE_MAP[codeType] ? CODE_TYPE_MAP[codeType].label : '',
    traceId: traceInfo.traceId,
    productName: traceInfo.productName,
    batchNo: traceInfo.batchNo,
    quantity: qty,
    toDealerId: toDealer ? toDealer.id : 'store',
    toDealerName: toDealer ? toDealer.name : '零售门店/消费者',
    timestamp: Date.now(),
    timestampStr: formatDateTime(Date.now()),
    remark: ''
  };

  records.unshift(record);

  inventory[invKey].quantity -= qty;
  inventory[invKey].lastUpdate = Date.now();

  saveInOutRecords(records);
  saveInventory(inventory);

  mockData.updateCodeFlow(code, codeType, {
    dealerId: toDealer ? toDealer.id : 'store',
    dealerName: toDealer ? toDealer.name : '零售门店',
    dealerLevel: toDealer ? toDealer.level : 'store',
    action: 'stockOut',
    timestamp: Date.now()
  });

  return {
    success: true,
    message: `出库成功，${traceInfo.productName} x ${qty}`,
    record: record,
    inventory: inventory[invKey]
  };
}

function getDealerInventory(dealerId) {
  const inventory = getInventory();
  const result = [];
  for (const key in inventory) {
    if (inventory[key].dealerId === dealerId && inventory[key].quantity > 0) {
      result.push(inventory[key]);
    }
  }
  return result.sort((a, b) => b.lastUpdate - a.lastUpdate);
}

function getDealerInOutRecords(dealerId, limit) {
  const all = getInOutRecords();
  const filtered = dealerId ? all.filter(r => r.dealerId === dealerId) : all;
  return limit ? filtered.slice(0, limit) : filtered;
}

function getChannelFlow(traceId) {
  return mockData.getChannelFlow(traceId);
}

function getDisplayChannelFlow(traceId) {
  const flow = getChannelFlow(traceId);
  if (!flow) return [];

  const display = [];

  if (flow.factory) {
    display.push({
      step: 1,
      role: '生产厂家',
      name: flow.factory.name,
      location: flow.factory.location,
      icon: '🏭',
      color: '#1890FF',
      time: flow.factory.time
    });
  }

  if (flow.provinceDealer) {
    display.push({
      step: 2,
      role: '省级代理',
      name: flow.provinceDealer.name,
      location: flow.provinceDealer.location,
      icon: '🏢',
      color: '#722ED1',
      time: flow.provinceDealer.time
    });
  }

  if (flow.cityDealer) {
    display.push({
      step: 3,
      role: '市级代理',
      name: flow.cityDealer.name,
      location: flow.cityDealer.location,
      icon: '🏬',
      color: '#DAA520',
      time: flow.cityDealer.time
    });
  }

  if (flow.store) {
    display.push({
      step: 4,
      role: '授权门店',
      name: flow.store.name,
      location: flow.store.location,
      icon: '🏪',
      color: '#2E8B57',
      time: flow.store.time
    });
  }

  return display;
}

function checkDivergence(traceId, scanLocation, scanCity) {
  const flow = getChannelFlow(traceId);
  if (!flow) return { isDivergence: false };

  let authorizedRegions = [];
  if (flow.store && flow.store.authorizedRegions) {
    authorizedRegions = flow.store.authorizedRegions;
  } else if (flow.cityDealer && flow.cityDealer.authorizedRegions) {
    authorizedRegions = flow.cityDealer.authorizedRegions;
  } else if (flow.provinceDealer && flow.provinceDealer.authorizedRegions) {
    authorizedRegions = flow.provinceDealer.authorizedRegions;
  }

  if (authorizedRegions.length === 0) {
    return { isDivergence: false };
  }

  let inAuthorizedRegion = false;
  const scanProvince = scanCity ? scanCity.substring(0, 2) : '';
  const scanFull = scanCity || '';

  for (const region of authorizedRegions) {
    if (scanProvince && region.startsWith(scanProvince)) {
      inAuthorizedRegion = true;
      break;
    }
    if (scanFull && region.startsWith(scanFull)) {
      inAuthorizedRegion = true;
      break;
    }
  }

  if (inAuthorizedRegion) {
    return { isDivergence: false };
  }

  const alert = {
    id: `alert_${Date.now()}`,
    traceId: traceId,
    scanLocation: scanLocation,
    scanCity: scanCity,
    authorizedRegions: authorizedRegions,
    flow: flow,
    timestamp: Date.now(),
    timestampStr: formatDateTime(Date.now()),
    status: 'pending',
    level: 'warning'
  };

  const alerts = getDivergenceAlerts();
  const existIndex = alerts.findIndex(a => a.traceId === traceId);
  if (existIndex === -1) {
    alerts.unshift(alert);
    saveDivergenceAlerts(alerts);
  }

  return {
    isDivergence: true,
    alert: alert,
    authorizedRegions: authorizedRegions,
    scanCity: scanCity
  };
}

function getDivergenceAlertList(dealerId) {
  const all = getDivergenceAlerts();
  if (!dealerId) return all;
  return all.filter(a => {
    if (a.flow && a.flow.provinceDealer && a.flow.provinceDealer.id === dealerId) return true;
    if (a.flow && a.flow.cityDealer && a.flow.cityDealer.id === dealerId) return true;
    if (a.flow && a.flow.store && a.flow.store.id === dealerId) return true;
    return false;
  });
}

function resolveDivergenceAlert(alertId, remark) {
  const alerts = getDivergenceAlerts();
  const idx = alerts.findIndex(a => a.id === alertId);
  if (idx === -1) return { success: false, error: '告警不存在' };

  alerts[idx].status = 'resolved';
  alerts[idx].resolveTime = Date.now();
  alerts[idx].resolveTimeStr = formatDateTime(Date.now());
  alerts[idx].resolveRemark = remark || '';
  saveDivergenceAlerts(alerts);

  return { success: true, alert: alerts[idx] };
}

module.exports = {
  CODE_TYPE_PRODUCTION,
  CODE_TYPE_BOX,
  CODE_TYPE_STORE,
  CODE_TYPE_MAP,

  getCurrentDealer,
  setCurrentDealer,

  detectCodeType,
  getCodeTypeInfo,
  parseTraceCode,

  stockIn,
  stockOut,
  getDealerInventory,
  getDealerInOutRecords,

  getChannelFlow,
  getDisplayChannelFlow,

  checkDivergence,
  getDivergenceAlertList,
  resolveDivergenceAlert,

  formatDateTime
};
