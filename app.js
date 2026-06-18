/**
 * 桂花茶溯源小程序 - 全局入口文件
 * 功能：初始化全局数据、配置全局方法、i18n 与无障碍状态
 * 作者：开发团队
 * 版本：1.0.0
 */

const i18n = require('./utils/i18n/index.js');
const auth = require('./utils/auth.js');
const userStore = require('./utils/userStore.js');
const greenPoints = require('./utils/greenPoints.js');
const shareUtil = require('./utils/share.js');
const dealerSession = require('./utils/dealerSession.js');
const dealerAuth = require('./utils/dealerAuth.js');
const dealerAudit = require('./utils/dealerAudit.js');

App({
  onLaunch: function(options) {
    console.log('桂花茶溯源小程序启动');
    console.log('[App] 启动参数:', options);

    i18n.applySettingsToApp(this);
    console.log('无障碍设置:', {
      lang: this.globalData.currentLang,
      fontSize: this.globalData.currentFontSize,
      colorWeak: this.globalData.currentColorWeak
    });

    this.checkPrivacyCompliance();
    this.initUserData();
    this.initDealerSession();

    if (options && options.query && options.query.invite) {
      this.globalData.pendingInviter = options.query.invite;
      console.log('[Invite] 检测到邀请人:', options.query.invite);
    }

    const systemInfo = wx.getSystemInfoSync();
    console.log('系统信息:', systemInfo);

    if (this.compareVersion(systemInfo.SDKVersion, '2.29.0') < 0) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请升级微信以获得更好的使用体验',
        showCancel: false
      });
    }
  },

  processInviteReward: function(traceId) {
    try {
      if (typeof wx === 'undefined') return null;

      var inviter = this.globalData.pendingInviter;
      if (!inviter) return null;

      var firstScanKey = 'first_scan_completed';
      var hasScanned = wx.getStorageSync(firstScanKey);
      if (hasScanned) {
        console.log('[Invite] 用户非首次扫码，跳过邀请奖励');
        this.globalData.pendingInviter = null;
        return null;
      }

      var inviteeOpenId = null;
      try {
        inviteeOpenId = auth.getUserInfo() ? auth.getUserInfo().openid : ('guest_' + Date.now());
      } catch (e) {
        inviteeOpenId = 'guest_' + Date.now();
      }
      console.log('[Invite] 处理邀请奖励，邀请人:', inviter, '被邀请人:', inviteeOpenId, '溯源码:', traceId);

      var result = shareUtil.handleInviteeScan(inviter, traceId);
      if (result.success) {
        wx.setStorageSync(firstScanKey, true);
        this.globalData.pendingInviter = null;

        try {
          if (result.rewards.invitee && result.rewards.invitee.value > 0) {
            greenPoints.earnPoints('invited', '好友邀请奖励');
            console.log('[Invite] 被邀请人获得积分:', result.rewards.invitee.value);
          }
        } catch (e) {
          console.warn('[Invite] 被邀请人积分发放失败:', e);
        }

        setTimeout(function() {
          try {
            wx.showToast({
              title: '邀请成功！双方获得' + result.rewards.inviter.value + '积分',
              icon: 'success',
              duration: 3000
            });
          } catch (e) {
            console.log('[Invite] 邀请成功提示:', result.rewards.inviter.value);
          }
        }, 1500);
      }

      return result;
    } catch (e) {
      console.error('[Invite] 处理邀请奖励失败:', e);
      return null;
    }
  },

  checkPrivacyCompliance: function() {
    var agreed = auth.isPrivacyAgreed();
    this.globalData.privacyAgreed = agreed;
    if (!agreed) {
      console.info('[App] 首次启动，需要展示隐私协议');
    }
  },

  initUserData: function() {
    if (auth.isLoggedIn()) {
      var userInfo = auth.getUserInfo();
      this.globalData.userInfo = userInfo;
      console.info('[App] 用户已登录:', userInfo.openid ? userInfo.openid.substr(-8) : '');
    }

    var privacySettings = userStore.getPrivacySettings();
    this.globalData.privacySettings = privacySettings;

    if (privacySettings.allowCollection) {
      console.info('[App] 用户已授权数据收集');
    } else {
      console.info('[App] 用户未授权数据收集，仅使用本地必要缓存');
    }
  },

  /**
   * 全局翻译函数（可通过 getApp().t() 调用）
   */
  t: function(key) {
    const args = Array.prototype.slice.call(arguments, 1);
    return i18n.t.apply(null, [key].concat(args));
  },

  /**
   * 切换语言并返回新的无障碍数据
   */
  switchLanguage: function(lang) {
    const ok = i18n.setLanguage(lang);
    if (ok) {
      i18n.applySettingsToApp(this);
      return i18n.getA11yData();
    }
    return null;
  },

  /**
   * 切换字号并返回新的无障碍数据
   */
  switchFontSize: function(size) {
    const ok = i18n.setFontSize(size);
    if (ok) {
      i18n.applySettingsToApp(this);
      return i18n.getA11yData();
    }
    return null;
  },

  /**
   * 切换色弱模式并返回新的无障碍数据
   */
  switchColorWeak: function(enabled) {
    i18n.setColorWeak(enabled);
    i18n.applySettingsToApp(this);
    return i18n.getA11yData();
  },

  /**
   * 获取当前无障碍配置
   */
  getA11yData: function() {
    return i18n.getA11yData();
  },

  /**
   * 版本号比较函数
   * @param {string} v1 - 版本号1
   * @param {string} v2 - 版本号2
   * @returns {number} - 1: v1>v2, -1: v1<v2, 0: v1=v2
   */
  compareVersion: function(v1, v2) {
    v1 = v1.split('.');
    v2 = v2.split('.');
    const len = Math.max(v1.length, v2.length);

    while (v1.length < len) {
      v1.push('0');
    }
    while (v2.length < len) {
      v2.push('0');
    }

    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i], 10);
      const num2 = parseInt(v2[i], 10);

      if (num1 > num2) {
        return 1;
      } else if (num1 < num2) {
        return -1;
      }
    }
    return 0;
  },

  initDealerSession: function() {
    var that = this;
    dealerSession.initSession(
      function() {
        that.globalData.dealerLoggedIn = false;
        that.globalData.dealerUser = null;
      },
      function(remainingSec) {
        console.info('[DealerSession] 会话即将超时，剩余', remainingSec, '秒');
      }
    );
    this.globalData.dealerLoggedIn = dealerAuth.isDealerLoggedIn();
    this.globalData.dealerUser = dealerAuth.getDealerUser();
  },

  touchDealerSession: function() {
    if (dealerAuth.isDealerLoggedIn()) {
      dealerSession.updateActivity();
    }
  },

  dealerLoginSuccess: function(userInfo) {
    this.globalData.dealerLoggedIn = true;
    this.globalData.dealerUser = userInfo;
    dealerSession.resetSession();
    dealerAudit.addAuditLog(dealerAudit.ACTION_LOGIN, {});
  },

  dealerLogoutSuccess: function() {
    dealerAudit.addAuditLog(dealerAudit.ACTION_LOGOUT, { reason: 'manual' });
    dealerAuth.dealerLogout();
    this.globalData.dealerLoggedIn = false;
    this.globalData.dealerUser = null;
    dealerSession.clearTimers();
  },

  /**
   * 全局数据
   * 存储应用级别的共享数据
   */
  globalData: {
    appName: '一茶一品・桂花茶溯源',
    themeColors: {
      primary: '#2E8B57',
      secondary: '#DAA520',
      background: '#F5F5F0',
      text: '#333333',
      lightText: '#666666'
    },
    apiBaseUrl: 'https://api.example.com/trace',
    userInfo: null,
    privacyAgreed: false,
    privacySettings: null,
    currentLang: i18n.LANG_ZH,
    currentFontSize: i18n.FONT_NORMAL,
    currentColorWeak: false,
    fontMultiplier: 1.0,
    a11yClasses: 'font-normal',
    dealerLoggedIn: false,
    dealerUser: null
  }
});
