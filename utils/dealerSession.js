/**
 * 经销商会话管理模块
 * 功能：15分钟无操作自动退出、活动时间跟踪、超时检查
 */

const dealerAuth = require('./dealerAuth.js');
const dealerAudit = require('./dealerAudit.js');

const SESSION_TIMEOUT_MS = 15 * 60 * 1000;
const CHECK_INTERVAL_MS = 60 * 1000;
const WARN_BEFORE_TIMEOUT_MS = 60 * 1000;

let sessionTimer = null;
let warnTimer = null;
let onTimeoutCallback = null;
let onWarnCallback = null;
let isInitialized = false;

function getSessionTimeout() {
  return SESSION_TIMEOUT_MS;
}

function getLastActiveTime() {
  const user = dealerAuth.getDealerUser();
  return user ? (user.lastActiveTime || user.loginTime || 0) : 0;
}

function updateActivity() {
  dealerAuth.updateLastActiveTime();
  scheduleTimers();
}

function getRemainingTime() {
  const lastActive = getLastActiveTime();
  if (!lastActive) return 0;
  const elapsed = Date.now() - lastActive;
  const remaining = SESSION_TIMEOUT_MS - elapsed;
  return remaining > 0 ? remaining : 0;
}

function isSessionExpired() {
  if (!dealerAuth.isDealerLoggedIn()) return false;
  return getRemainingTime() <= 0;
}

function clearTimers() {
  if (sessionTimer) {
    clearTimeout(sessionTimer);
    sessionTimer = null;
  }
  if (warnTimer) {
    clearTimeout(warnTimer);
    warnTimer = null;
  }
}

function scheduleTimers() {
  if (!dealerAuth.isDealerLoggedIn()) {
    clearTimers();
    return;
  }

  clearTimers();

  const remaining = getRemainingTime();
  if (remaining <= 0) {
    handleTimeout();
    return;
  }

  const warnDelay = remaining > WARN_BEFORE_TIMEOUT_MS
    ? remaining - WARN_BEFORE_TIMEOUT_MS
    : Math.max(0, remaining - 10000);

  warnTimer = setTimeout(function() {
    if (typeof onWarnCallback === 'function') {
      const remainingSec = Math.ceil(getRemainingTime() / 1000);
      onWarnCallback(remainingSec);
    }
  }, warnDelay);

  sessionTimer = setTimeout(function() {
    handleTimeout();
  }, remaining);
}

function handleTimeout() {
  clearTimers();

  if (!dealerAuth.isDealerLoggedIn()) return;

  dealerAudit.addAuditLog(dealerAudit.ACTION_LOGOUT, {
    reason: 'session_timeout',
    remark: '15分钟无操作自动退出'
  });

  dealerAuth.dealerLogout();

  if (typeof onTimeoutCallback === 'function') {
    onTimeoutCallback();
  } else {
    try {
      wx.showModal({
        title: '会话已超时',
        content: '由于长时间无操作，您已自动退出经销商模式。',
        showCancel: false,
        confirmText: '确定',
        success: function() {
          const pages = getCurrentPages();
          const currentPage = pages[pages.length - 1];
          if (currentPage && currentPage.route && currentPage.route.indexOf('pages/dealer/') === 0) {
            wx.switchTab({
              url: '/pages/index/index'
            });
          }
        }
      });
    } catch (e) {}
  }
}

function initSession(onTimeout, onWarn) {
  if (isInitialized) {
    scheduleTimers();
    return;
  }

  onTimeoutCallback = onTimeout || null;
  onWarnCallback = onWarn || null;
  isInitialized = true;
  scheduleTimers();
}

function destroySession() {
  clearTimers();
  isInitialized = false;
  onTimeoutCallback = null;
  onWarnCallback = null;
}

function resetSession() {
  updateActivity();
}

function extendSession(minutes) {
  const extendMs = (minutes || 5) * 60 * 1000;
  const user = dealerAuth.getDealerUser();
  if (user) {
    user.lastActiveTime = Date.now() + extendMs - SESSION_TIMEOUT_MS;
    dealerAuth.setDealerUser(user);
    scheduleTimers();
    return true;
  }
  return false;
}

module.exports = {
  SESSION_TIMEOUT_MS: SESSION_TIMEOUT_MS,
  WARN_BEFORE_TIMEOUT_MS: WARN_BEFORE_TIMEOUT_MS,

  initSession: initSession,
  destroySession: destroySession,
  updateActivity: updateActivity,
  resetSession: resetSession,
  extendSession: extendSession,
  getLastActiveTime: getLastActiveTime,
  getRemainingTime: getRemainingTime,
  isSessionExpired: isSessionExpired,
  getSessionTimeout: getSessionTimeout,
  clearTimers: clearTimers
};
