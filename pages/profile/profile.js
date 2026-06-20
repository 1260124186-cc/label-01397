var auth = require('../../utils/auth.js');
var userStore = require('../../utils/userStore.js');
var storage = require('../../utils/storage.js');
var greenPoints = require('../../utils/greenPoints.js');
var certWallet = require('../../utils/certificateWallet.js');
var dealerAuth = require('../../utils/dealerAuth.js');
var i18n = require('../../utils/i18n/index.js');
var theme = require('../../utils/theme.js');

Page({
  data: {
    isLoggedIn: false,
    userInfo: null,
    showPrivacyPopup: false,
    openidShort: '',

    favoriteCount: 0,
    noteCount: 0,
    scanCount: 0,
    certCount: 0,
    unreadCount: 0,
    greenPoints: 0,
    memberLevel: {},
    hasActivatedDealer: false,
    dealerLoggedIn: false,
    dealerUser: null,

    pageClass: '',
    currentLang: 'zh-CN',
    currentFontSize: 'normal',
    currentColorWeak: false,
    currentThemeMode: 'system',
    availableLanguages: [],
    availableThemes: [],
    showSettingsPanel: false,

    menuSections: [
      {
        title: '会员中心',
        items: [
          { key: 'member', icon: '💎', name: '积分商城', desc: '积分兑换好礼', url: '/pages/member/index', badge: '' },
          { key: 'pointsDetail', icon: '📊', name: '积分明细', desc: '查看积分流水', url: '/pages/member/pointsDetail', badge: '' },
          { key: 'level', icon: '🏅', name: '会员等级', desc: '普通/银卡/金卡', url: '/pages/member/level', badge: '' }
        ]
      },
      {
        title: '溯源服务',
        items: [
          { key: 'certWallet', icon: '📜', name: '证书钱包', desc: '有机认证·检测报告·区块链存证', url: '/pages/certificateWallet/certificateWallet', badge: '' },
          { key: 'history', icon: '📋', name: '查询历史', desc: '扫码与手动查询记录', url: '/pages/history/history', badge: '' },
          { key: 'favorites', icon: '⭐', name: '收藏产品', desc: '我收藏的茶叶产品', url: '/pages/favorites/favorites', badge: '' },
          { key: 'notes', icon: '📝', name: '品鉴笔记', desc: '我的茶叶品鉴记录', url: '/pages/tastingNotes/tastingNotes', badge: '' }
        ]
      },
      {
        title: '消息与设置',
        items: [
          { key: 'notifications', icon: '🔔', name: '消息通知', desc: '系统通知与溯源提醒', url: '/pages/notifications/notifications', badge: '' },
          { key: 'subscription', icon: '📩', name: '消息订阅', desc: '订阅品种、地区与批次动态', url: '/pages/subscription/subscription', badge: '' },
          { key: 'privacy', icon: '🛡️', name: '隐私设置', desc: '数据收集与权限管理', url: '/pages/privacy/privacy' }
        ]
      }
    ]
  },

  onLoad: function() {
    if (!auth.isPrivacyAgreed()) {
      this.setData({ showPrivacyPopup: true });
    }
  },

  refreshSettings: function() {
    var app = getApp();
    var a11yClasses = app.globalData.a11yClasses || '';
    var themeClass = app.globalData.themeClass || '';
    var pageClass = a11yClasses + ' ' + themeClass;

    this.setData({
      pageClass: pageClass.trim(),
      currentLang: i18n.getLanguage(),
      currentFontSize: i18n.getFontSize(),
      currentColorWeak: i18n.getColorWeak(),
      currentThemeMode: theme.getThemeMode(),
      availableLanguages: i18n.getAvailableLanguages(),
      availableThemes: theme.getAvailableThemes()
    });
  },

  refreshUserData: function() {
    var loggedIn = auth.isLoggedIn();
    var userInfo = auth.getUserInfo();
    var favorites = userStore.getFavorites();
    var notes = userStore.getTastingNotes();
    var scanHistory = storage.getScanHistory();
    var unreadCount = userStore.getUnreadNotificationCount();
    var points = greenPoints.getPoints();
    var level = greenPoints.getUserLevel(points);
    var certCount = certWallet.getCertificateCount();

    var menuSections = this.data.menuSections;
    for (var s = 0; s < menuSections.length; s++) {
      for (var i = 0; i < menuSections[s].items.length; i++) {
        if (menuSections[s].items[i].key === 'notifications') {
          menuSections[s].items[i].badge = unreadCount > 0 ? String(unreadCount) : '';
        }
        if (menuSections[s].items[i].key === 'favorites') {
          menuSections[s].items[i].badge = favorites.length > 0 ? String(favorites.length) : '';
        }
        if (menuSections[s].items[i].key === 'certWallet') {
          menuSections[s].items[i].badge = certCount > 0 ? String(certCount) : '';
        }
      }
    }

    this.refreshSettings();

    var openidShort = '';
    if (userInfo && userInfo.openid) {
      openidShort = userInfo.openid.slice(-8);
    }

    this.setData({
      isLoggedIn: loggedIn,
      userInfo: userInfo,
      openidShort: openidShort,
      favoriteCount: favorites.length,
      noteCount: notes.length,
      scanCount: scanHistory.length,
      certCount: certCount,
      unreadCount: unreadCount,
      greenPoints: points,
      memberLevel: level,
      menuSections: menuSections,
      hasActivatedDealer: dealerAuth.hasActivatedDealer(),
      dealerLoggedIn: dealerAuth.isDealerLoggedIn(),
      dealerUser: dealerAuth.getDealerUser()
    });
  },

  onShow: function() {
    this.refreshUserData();
  },

  onPrivacyAgree: function() {
    this.setData({ showPrivacyPopup: false });
    console.info('[Profile] 用户已同意隐私协议');
  },

  onPrivacyDeny: function() {
    this.setData({ showPrivacyPopup: false });
    wx.showModal({
      title: '提示',
      content: '拒绝隐私协议将无法使用小程序功能，确定要退出吗？',
      confirmText: '重新阅读',
      cancelText: '退出',
      confirmColor: '#2E8B57',
      success: function(res) {
        if (res.confirm) {
          this.setData({ showPrivacyPopup: true });
        } else {
          wx.exitMiniProgram();
        }
      }.bind(this)
    });
  },

  handleLogin: function() {
    if (!auth.isPrivacyAgreed()) {
      this.setData({ showPrivacyPopup: true });
      return;
    }

    wx.showLoading({ title: '登录中...', mask: true });

    auth.wxLogin()
      .then(function(res) {
        wx.hideLoading();
        console.info('[Profile] 登录成功');
        this.refreshUserData();
        wx.showToast({ title: '登录成功', icon: 'success', duration: 1500 });
      }.bind(this))
      .catch(function(err) {
        wx.hideLoading();
        console.error('[Profile] 登录失败:', err);
        wx.showToast({ title: err.msg || '登录失败', icon: 'none', duration: 2000 });
      }.bind(this));
  },

  handleGetProfile: function() {
    auth.getUserProfile()
      .then(function(userInfo) {
        this.refreshUserData();
        wx.showToast({ title: '资料已更新', icon: 'success', duration: 1500 });
      }.bind(this))
      .catch(function(err) {
        console.error('[Profile] 获取资料失败:', err);
      }.bind(this));
  },

  handleLogout: function() {
    wx.showModal({
      title: '退出登录',
      content: '退出后将清除登录信息，查询历史和收藏仍保留在本地',
      confirmColor: '#ff4d4f',
      success: function(res) {
        if (res.confirm) {
          auth.logout();
          this.refreshUserData();
          wx.showToast({ title: '已退出登录', icon: 'success', duration: 1500 });
        }
      }.bind(this)
    });
  },

  goToDealer: function() {
    if (dealerAuth.isDealerLoggedIn()) {
      wx.navigateTo({ url: '/pages/dealer/index' });
    } else {
      wx.navigateTo({ url: '/pages/dealer/login' });
    }
  },

  dealerLogout: function() {
    var that = this;
    wx.showModal({
      title: '退出经销商模式',
      content: '确定要退出经销商工作台吗？',
      confirmColor: '#ff4d4f',
      success: function(res) {
        if (res.confirm) {
          getApp().dealerLogoutSuccess();
          that.refreshUserData();
          wx.showToast({ title: '已退出', icon: 'success' });
        }
      }
    });
  },

  toggleSettingsPanel: function() {
    this.setData({ showSettingsPanel: !this.data.showSettingsPanel });
  },

  onLanguageTap: function(e) {
    var lang = e.currentTarget.dataset.lang;
    if (!lang) return;
    var app = getApp();
    var result = app.switchLanguage(lang);
    if (result) {
      this.refreshSettings();
      wx.showToast({ title: this.t('settings.changed'), icon: 'success', duration: 1500 });
    }
  },

  onFontSizeTap: function(e) {
    var size = e.currentTarget.dataset.size;
    if (!size) return;
    var app = getApp();
    var result = app.switchFontSize(size);
    if (result) {
      this.refreshSettings();
      wx.showToast({ title: this.t('settings.changed'), icon: 'success', duration: 1500 });
    }
  },

  onColorWeakTap: function() {
    var newValue = !this.data.currentColorWeak;
    var app = getApp();
    var result = app.switchColorWeak(newValue);
    if (result) {
      this.refreshSettings();
      wx.showToast({ title: this.t('settings.changed'), icon: 'success', duration: 1500 });
    }
  },

  onThemeTap: function(e) {
    var mode = e.currentTarget.dataset.mode;
    if (!mode) return;
    var app = getApp();
    var result = app.switchTheme(mode);
    if (result) {
      this.refreshSettings();
      wx.showToast({ title: this.t('settings.themeChanged'), icon: 'success', duration: 1500 });
    }
  },

  onThemeChange: function(resolvedTheme, tokens, themeClass) {
    console.log('[Profile] 主题变化:', resolvedTheme);
    this.refreshSettings();
  },

  t: function(key) {
    return i18n.t.apply(i18n, arguments);
  },

  onMenuItemTap: function(e) {
    var item = e.currentTarget.dataset.item;
    if (!item || !item.url) return;

    if (item.key === 'history') {
      wx.switchTab({ url: '/pages/index/index' });
      return;
    }

    wx.navigateTo({
      url: item.url,
      fail: function(err) {
        console.error('[Profile] 跳转失败:', err);
        wx.showToast({ title: '页面跳转失败', icon: 'none', duration: 2000 });
      }
    });
  },

  onShareAppMessage: function() {
    return {
      title: '一茶一品・桂花茶溯源',
      path: '/pages/index/index'
    };
  }
});
