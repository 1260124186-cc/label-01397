/**
 * 经销商操作审计日志模块
 * 功能：记录谁、何时、扫了什么码、IP/设备等信息，支持查询和导出
 */

const dealerAuth = require('./dealerAuth.js');

const AUDIT_LOG_KEY = 'dealer_audit_logs';
const MAX_AUDIT_LOGS = 1000;

const ACTION_LOGIN = 'login';
const ACTION_LOGOUT = 'logout';
const ACTION_STOCK_IN = 'stockIn';
const ACTION_STOCK_OUT = 'stockOut';
const ACTION_STOCK_OUT_APPROVAL_SUBMIT = 'stockOutApprovalSubmit';
const ACTION_STOCK_OUT_APPROVAL_APPROVE = 'stockOutApprovalApprove';
const ACTION_STOCK_OUT_APPROVAL_REJECT = 'stockOutApprovalReject';
const ACTION_SCAN_CODE = 'scanCode';
const ACTION_RESOLVE_ALERT = 'resolveAlert';
const ACTION_SWITCH_DEALER = 'switchDealer';
const ACTION_VIEW_AUDIT = 'viewAudit';
const ACTION_EXPORT_AUDIT = 'exportAudit';

const ACTION_LABELS = {
  [ACTION_LOGIN]: '登录',
  [ACTION_LOGOUT]: '退出登录',
  [ACTION_STOCK_IN]: '扫码入库',
  [ACTION_STOCK_OUT]: '扫码出库',
  [ACTION_STOCK_OUT_APPROVAL_SUBMIT]: '提交出库审批',
  [ACTION_STOCK_OUT_APPROVAL_APPROVE]: '批准出库',
  [ACTION_STOCK_OUT_APPROVAL_REJECT]: '驳回出库',
  [ACTION_SCAN_CODE]: '扫码查询',
  [ACTION_RESOLVE_ALERT]: '处理窜货告警',
  [ACTION_SWITCH_DEALER]: '切换经销商',
  [ACTION_VIEW_AUDIT]: '查看审计日志',
  [ACTION_EXPORT_AUDIT]: '导出审计日志'
};

function getSystemInfo() {
  try {
    const info = wx.getSystemInfoSync();
    return {
      platform: info.platform || '',
      system: info.system || '',
      model: info.model || '',
      appVersion: info.version || '',
      SDKVersion: info.SDKVersion || '',
      screenWidth: info.screenWidth || 0,
      screenHeight: info.screenHeight || 0
    };
  } catch (e) {
    return {};
  }
}

function getNetworkInfo() {
  return new Promise(function(resolve) {
    try {
      wx.getNetworkType({
        success: function(res) {
          resolve({ networkType: res.networkType || 'unknown' });
        },
        fail: function() {
          resolve({ networkType: 'unknown' });
        }
      });
    } catch (e) {
      resolve({ networkType: 'unknown' });
    }
  });
}

function getLocationInfo() {
  return new Promise(function(resolve) {
    try {
      wx.getFuzzyLocation({
        success: function(res) {
          resolve({
            latitude: res.latitude || 0,
            longitude: res.longitude || 0
          });
        },
        fail: function() {
          resolve({ latitude: 0, longitude: 0 });
        }
      });
    } catch (e) {
      resolve({ latitude: 0, longitude: 0 });
    }
  });
}

function getAuditLogs() {
  try {
    const logs = wx.getStorageSync(AUDIT_LOG_KEY);
    return Array.isArray(logs) ? logs : [];
  } catch (e) {
    console.error('[DealerAudit] 获取审计日志失败:', e);
    return [];
  }
}

function saveAuditLogs(logs) {
  try {
    const trimmed = logs.slice(0, MAX_AUDIT_LOGS);
    wx.setStorageSync(AUDIT_LOG_KEY, trimmed);
    return true;
  } catch (e) {
    console.error('[DealerAudit] 保存审计日志失败:', e);
    return false;
  }
}

function addAuditLog(action, details) {
  const user = dealerAuth.getDealerUser();
  const systemInfo = getSystemInfo();
  const logs = getAuditLogs();

  const log = {
    id: 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    action: action,
    actionLabel: ACTION_LABELS[action] || action,
    userId: user ? user.id : '',
    userName: user ? user.name : '',
    userAccount: user ? user.account : '',
    userRole: user ? user.role : '',
    userRoleLabel: user ? user.roleLabel : '',
    dealerId: user ? user.dealerId : '',
    dealerName: user ? user.dealerName : '',
    details: details || {},
    device: {
      platform: systemInfo.platform,
      system: systemInfo.system,
      model: systemInfo.model,
      appVersion: systemInfo.appVersion,
      SDKVersion: systemInfo.SDKVersion
    },
    network: {},
    location: {},
    ip: '',
    timestamp: Date.now(),
    timestampStr: formatDateTime(Date.now())
  };

  logs.unshift(log);
  saveAuditLogs(logs);

  getNetworkInfo().then(function(netInfo) {
    const allLogs = getAuditLogs();
    const idx = allLogs.findIndex(function(l) { return l.id === log.id; });
    if (idx !== -1) {
      allLogs[idx].network = netInfo;
      saveAuditLogs(allLogs);
    }
  });

  getLocationInfo().then(function(locInfo) {
    const allLogs = getAuditLogs();
    const idx = allLogs.findIndex(function(l) { return l.id === log.id; });
    if (idx !== -1) {
      allLogs[idx].location = locInfo;
      saveAuditLogs(allLogs);
    }
  });

  return log;
}

function queryAuditLogs(filter) {
  const logs = getAuditLogs();
  if (!filter) return logs;

  return logs.filter(function(log) {
    if (filter.action && log.action !== filter.action) return false;
    if (filter.userId && log.userId !== filter.userId) return false;
    if (filter.dealerId && log.dealerId !== filter.dealerId) return false;
    if (filter.startTime && log.timestamp < filter.startTime) return false;
    if (filter.endTime && log.timestamp > filter.endTime) return false;
    if (filter.keyword) {
      const kw = String(filter.keyword).toLowerCase();
      const searchStr = [
        log.actionLabel,
        log.userName,
        log.userAccount,
        log.dealerName,
        JSON.stringify(log.details || {})
      ].join(' ').toLowerCase();
      if (searchStr.indexOf(kw) === -1) return false;
    }
    return true;
  });
}

function getAuditStats() {
  const logs = getAuditLogs();
  const stats = {
    total: logs.length,
    byAction: {},
    todayCount: 0,
    last7DaysCount: 0
  };

  const now = Date.now();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;
    if (log.timestamp >= todayStart.getTime()) {
      stats.todayCount++;
    }
    if (log.timestamp >= sevenDaysAgo) {
      stats.last7DaysCount++;
    }
  }

  return stats;
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

function exportToCSV(logs) {
  if (!logs || logs.length === 0) {
    return '';
  }

  const headers = [
    '日志ID', '操作时间', '操作类型', '操作人ID', '操作人',
    '账号', '角色', '所属经销商', '扫码/操作内容',
    '设备平台', '系统', '设备型号', '网络类型',
    'IP地址', '纬度', '经度'
  ];

  const rows = logs.map(function(log) {
    const details = log.details || {};
    const detailStr = [
      details.code ? '码:' + details.code : '',
      details.productName ? '产品:' + details.productName : '',
      details.quantity ? '数量:' + details.quantity : '',
      details.traceId ? '溯源ID:' + details.traceId : '',
      details.remark || ''
    ].filter(Boolean).join(' | ');

    return [
      log.id,
      log.timestampStr,
      log.actionLabel,
      log.userId,
      log.userName,
      log.userAccount,
      log.userRoleLabel,
      log.dealerName,
      detailStr,
      log.device ? log.device.platform : '',
      log.device ? log.device.system : '',
      log.device ? log.device.model : '',
      log.network ? log.network.networkType : '',
      log.ip || '',
      log.location ? log.location.latitude : '',
      log.location ? log.location.longitude : ''
    ].map(function(cell) {
      const str = String(cell || '');
      if (str.indexOf(',') !== -1 || str.indexOf('"') !== -1 || str.indexOf('\n') !== -1) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    }).join(',');
  });

  return '\uFEFF' + headers.join(',') + '\n' + rows.join('\n');
}

function exportAuditLogs(filter) {
  const logs = queryAuditLogs(filter);
  const csv = exportToCSV(logs);
  return {
    success: true,
    count: logs.length,
    csv: csv,
    filename: 'dealer_audit_' + Date.now() + '.csv'
  };
}

function saveExportFile(csv, filename) {
  return new Promise(function(resolve, reject) {
    try {
      const fs = wx.getFileSystemManager();
      const filePath = `${wx.env.USER_DATA_PATH}/${filename}`;
      fs.writeFile({
        filePath: filePath,
        data: csv,
        encoding: 'utf8',
        success: function() {
          resolve({ success: true, filePath: filePath });
        },
        fail: function(err) {
          reject({ success: false, error: err });
        }
      });
    } catch (e) {
      reject({ success: false, error: e });
    }
  });
}

function clearAuditLogs() {
  try {
    wx.removeStorageSync(AUDIT_LOG_KEY);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  ACTION_LOGIN: ACTION_LOGIN,
  ACTION_LOGOUT: ACTION_LOGOUT,
  ACTION_STOCK_IN: ACTION_STOCK_IN,
  ACTION_STOCK_OUT: ACTION_STOCK_OUT,
  ACTION_STOCK_OUT_APPROVAL_SUBMIT: ACTION_STOCK_OUT_APPROVAL_SUBMIT,
  ACTION_STOCK_OUT_APPROVAL_APPROVE: ACTION_STOCK_OUT_APPROVAL_APPROVE,
  ACTION_STOCK_OUT_APPROVAL_REJECT: ACTION_STOCK_OUT_APPROVAL_REJECT,
  ACTION_SCAN_CODE: ACTION_SCAN_CODE,
  ACTION_RESOLVE_ALERT: ACTION_RESOLVE_ALERT,
  ACTION_SWITCH_DEALER: ACTION_SWITCH_DEALER,
  ACTION_VIEW_AUDIT: ACTION_VIEW_AUDIT,
  ACTION_EXPORT_AUDIT: ACTION_EXPORT_AUDIT,
  ACTION_LABELS: ACTION_LABELS,

  addAuditLog: addAuditLog,
  getAuditLogs: getAuditLogs,
  queryAuditLogs: queryAuditLogs,
  getAuditStats: getAuditStats,
  exportAuditLogs: exportAuditLogs,
  saveExportFile: saveExportFile,
  clearAuditLogs: clearAuditLogs,

  AUDIT_LOG_KEY: AUDIT_LOG_KEY,
  MAX_AUDIT_LOGS: MAX_AUDIT_LOGS
};
