/**
 * 经销商权限管理模块
 * 功能：经销商登录、角色权限控制、授权码验证、权限校验
 */

const mockData = require('./mockData.js');

const DEALER_USER_KEY = 'dealer_user';
const DEALER_TOKEN_KEY = 'dealer_token';
const DEALER_AUTH_CODE_KEY = 'dealer_auth_codes';
const DEALER_APPROVAL_PENDING_KEY = 'dealer_approval_pending';

const ROLE_WAREHOUSE = 'warehouse';
const ROLE_SALES = 'sales';
const ROLE_ADMIN = 'admin';

const ROLE_LABELS = {
  [ROLE_WAREHOUSE]: '仓管',
  [ROLE_SALES]: '销售',
  [ROLE_ADMIN]: '区域经理'
};

const PERMISSIONS = {
  stockIn: [ROLE_WAREHOUSE, ROLE_ADMIN],
  stockOut: [ROLE_SALES, ROLE_ADMIN],
  stockOutLarge: [ROLE_ADMIN],
  viewInventory: [ROLE_WAREHOUSE, ROLE_SALES, ROLE_ADMIN],
  viewRecords: [ROLE_WAREHOUSE, ROLE_SALES, ROLE_ADMIN],
  viewAlerts: [ROLE_SALES, ROLE_ADMIN],
  resolveAlerts: [ROLE_ADMIN],
  viewAudit: [ROLE_ADMIN],
  exportAudit: [ROLE_ADMIN],
  approveStockOut: [ROLE_ADMIN],
  switchDealer: [ROLE_ADMIN],
  manageUsers: [ROLE_ADMIN],
  viewTraining: [ROLE_WAREHOUSE, ROLE_SALES, ROLE_ADMIN],
  takeQuiz: [ROLE_WAREHOUSE, ROLE_SALES, ROLE_ADMIN]
};

const LARGE_STOCKOUT_THRESHOLD = 10;

function getDealerUser() {
  try {
    return wx.getStorageSync(DEALER_USER_KEY) || null;
  } catch (e) {
    console.error('[DealerAuth] 获取经销商用户失败:', e);
    return null;
  }
}

function setDealerUser(user) {
  try {
    wx.setStorageSync(DEALER_USER_KEY, user);
    return true;
  } catch (e) {
    console.error('[DealerAuth] 保存经销商用户失败:', e);
    return false;
  }
}

function clearDealerUser() {
  try {
    wx.removeStorageSync(DEALER_USER_KEY);
    wx.removeStorageSync(DEALER_TOKEN_KEY);
    return true;
  } catch (e) {
    console.error('[DealerAuth] 清除经销商用户失败:', e);
    return false;
  }
}

function isDealerLoggedIn() {
  try {
    const user = wx.getStorageSync(DEALER_USER_KEY);
    return !!(user && user.id && user.role);
  } catch (e) {
    return false;
  }
}

function getCurrentRole() {
  const user = getDealerUser();
  return user ? user.role : null;
}

function getCurrentRoleLabel() {
  const role = getCurrentRole();
  return role ? ROLE_LABELS[role] : '';
}

function hasPermission(permissionKey) {
  const role = getCurrentRole();
  if (!role) return false;
  const allowedRoles = PERMISSIONS[permissionKey];
  if (!allowedRoles) return false;
  return allowedRoles.indexOf(role) !== -1;
}

function requirePermission(permissionKey, denyCallback) {
  if (!hasPermission(permissionKey)) {
    if (typeof denyCallback === 'function') {
      denyCallback();
    } else {
      wx.showToast({
        title: '无操作权限',
        icon: 'none',
        duration: 2000
      });
    }
    return false;
  }
  return true;
}

function dealerLogin(account, password) {
  return new Promise(function(resolve, reject) {
    if (!account || !password) {
      reject({ code: -1, msg: '请输入账号和密码' });
      return;
    }

    setTimeout(function() {
      const user = mockData.verifyDealerAccount(account, password);
      if (!user) {
        reject({ code: -2, msg: '账号或密码错误' });
        return;
      }

      const token = 'dealer_token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 10);
      const userInfo = {
        id: user.id,
        account: user.account,
        name: user.name,
        role: user.role,
        roleLabel: ROLE_LABELS[user.role],
        dealerId: user.dealerId,
        dealerName: user.dealerName,
        avatar: user.avatar || '',
        phone: user.phone || '',
        loginTime: Date.now(),
        lastActiveTime: Date.now()
      };

      setDealerUser(userInfo);
      try {
        wx.setStorageSync(DEALER_TOKEN_KEY, token);
      } catch (e) {}

      resolve({ code: 0, data: userInfo, token: token });
    }, 600);
  });
}

function dealerLogout() {
  clearDealerUser();
}

function verifyAuthCode(code) {
  return new Promise(function(resolve, reject) {
    if (!code) {
      reject({ code: -1, msg: '请输入授权码' });
      return;
    }

    setTimeout(function() {
      const result = mockData.verifyDealerAuthCode(code);
      if (!result || !result.valid) {
        reject({ code: -2, msg: '授权码无效或已过期' });
        return;
      }

      try {
        const usedCodes = wx.getStorageSync(DEALER_AUTH_CODE_KEY) || [];
        usedCodes.push({
          code: code,
          dealerId: result.dealerId,
          dealerName: result.dealerName,
          usedTime: Date.now(),
          account: result.account
        });
        wx.setStorageSync(DEALER_AUTH_CODE_KEY, usedCodes);
      } catch (e) {}

      resolve({ code: 0, data: result });
    }, 400);
  });
}

function hasActivatedDealer() {
  try {
    const codes = wx.getStorageSync(DEALER_AUTH_CODE_KEY) || [];
    return codes.length > 0;
  } catch (e) {
    return false;
  }
}

function getActivatedDealers() {
  try {
    return wx.getStorageSync(DEALER_AUTH_CODE_KEY) || [];
  } catch (e) {
    return [];
  }
}

function needsApprovalForStockOut(quantity) {
  return quantity >= LARGE_STOCKOUT_THRESHOLD;
}

function getLargeStockOutThreshold() {
  return LARGE_STOCKOUT_THRESHOLD;
}

function submitStockOutApproval(data) {
  try {
    const pending = wx.getStorageSync(DEALER_APPROVAL_PENDING_KEY) || [];
    const approval = {
      id: 'approval_' + Date.now(),
      type: 'stockOut',
      data: data,
      status: 'pending',
      submitTime: Date.now(),
      submitTimeStr: formatDateTime(Date.now()),
      submitUserId: getDealerUser() ? getDealerUser().id : '',
      submitUserName: getDealerUser() ? getDealerUser().name : ''
    };
    pending.unshift(approval);
    wx.setStorageSync(DEALER_APPROVAL_PENDING_KEY, pending);
    return { success: true, approval: approval };
  } catch (e) {
    console.error('[DealerAuth] 提交审批失败:', e);
    return { success: false, error: '提交审批失败' };
  }
}

function getPendingApprovals() {
  try {
    const all = wx.getStorageSync(DEALER_APPROVAL_PENDING_KEY) || [];
    return all.filter(function(a) { return a.status === 'pending'; });
  } catch (e) {
    return [];
  }
}

function approveStockOut(approvalId, remark) {
  try {
    const pending = wx.getStorageSync(DEALER_APPROVAL_PENDING_KEY) || [];
    const idx = pending.findIndex(function(a) { return a.id === approvalId; });
    if (idx === -1) return { success: false, error: '审批不存在' };

    pending[idx].status = 'approved';
    pending[idx].approveTime = Date.now();
    pending[idx].approveTimeStr = formatDateTime(Date.now());
    pending[idx].approveUserId = getDealerUser() ? getDealerUser().id : '';
    pending[idx].approveUserName = getDealerUser() ? getDealerUser().name : '';
    pending[idx].remark = remark || '';
    wx.setStorageSync(DEALER_APPROVAL_PENDING_KEY, pending);
    return { success: true, approval: pending[idx] };
  } catch (e) {
    return { success: false, error: '审批操作失败' };
  }
}

function rejectStockOut(approvalId, remark) {
  try {
    const pending = wx.getStorageSync(DEALER_APPROVAL_PENDING_KEY) || [];
    const idx = pending.findIndex(function(a) { return a.id === approvalId; });
    if (idx === -1) return { success: false, error: '审批不存在' };

    pending[idx].status = 'rejected';
    pending[idx].rejectTime = Date.now();
    pending[idx].rejectTimeStr = formatDateTime(Date.now());
    pending[idx].rejectUserId = getDealerUser() ? getDealerUser().id : '';
    pending[idx].rejectUserName = getDealerUser() ? getDealerUser().name : '';
    pending[idx].remark = remark || '';
    wx.setStorageSync(DEALER_APPROVAL_PENDING_KEY, pending);
    return { success: true, approval: pending[idx] };
  } catch (e) {
    return { success: false, error: '审批操作失败' };
  }
}

function updateLastActiveTime() {
  const user = getDealerUser();
  if (user) {
    user.lastActiveTime = Date.now();
    setDealerUser(user);
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

module.exports = {
  ROLE_WAREHOUSE: ROLE_WAREHOUSE,
  ROLE_SALES: ROLE_SALES,
  ROLE_ADMIN: ROLE_ADMIN,
  ROLE_LABELS: ROLE_LABELS,
  PERMISSIONS: PERMISSIONS,
  LARGE_STOCKOUT_THRESHOLD: LARGE_STOCKOUT_THRESHOLD,

  getDealerUser: getDealerUser,
  setDealerUser: setDealerUser,
  clearDealerUser: clearDealerUser,
  isDealerLoggedIn: isDealerLoggedIn,
  getCurrentRole: getCurrentRole,
  getCurrentRoleLabel: getCurrentRoleLabel,
  hasPermission: hasPermission,
  requirePermission: requirePermission,
  dealerLogin: dealerLogin,
  dealerLogout: dealerLogout,
  verifyAuthCode: verifyAuthCode,
  hasActivatedDealer: hasActivatedDealer,
  getActivatedDealers: getActivatedDealers,
  needsApprovalForStockOut: needsApprovalForStockOut,
  getLargeStockOutThreshold: getLargeStockOutThreshold,
  submitStockOutApproval: submitStockOutApproval,
  getPendingApprovals: getPendingApprovals,
  approveStockOut: approveStockOut,
  rejectStockOut: rejectStockOut,
  updateLastActiveTime: updateLastActiveTime,

  DEALER_USER_KEY: DEALER_USER_KEY,
  DEALER_TOKEN_KEY: DEALER_TOKEN_KEY,
  DEALER_AUTH_CODE_KEY: DEALER_AUTH_CODE_KEY
};
