var auth = require('../../utils/auth.js');
var userStore = require('../../utils/userStore.js');
var storage = require('../../utils/storage.js');

Page({
  data: {
    isLoggedIn: false,
    userInfo: null,
    showPrivacyPopup: false,

    favoriteCount: 0,
    noteCount: 0,
    scanCount: 0,
    unreadCount: 0,

    menuSections: [
      {
        title: '溯源服务',
        items: [
          { key: 'history', icon: '📋', name: '查询历史', desc: '扫码与手动查询记录', url: '/pages/history/history', badge: '' },
          { key: 'favorites', icon: '⭐', name: '收藏产品', desc: '我收藏的茶叶产品', url: '/pages/favorites/favorites', badge: '' },
          { key: 'notes', icon: '📝', name: '品鉴笔记', desc: '我的茶叶品鉴记录', url: '/pages/tastingNotes/tastingNotes', badge: '' }
        ]
      },
      {
        title: '消息与设置',
        items: [
          { key: 'notifications', icon: '🔔', name: '消息通知', desc: '系统通知与溯源提醒', url: '/pages/notifications/notifications', badge: '' },
          { key: 'privacy', icon: '🛡️', name: '隐私设置', desc: '数据收集与权限管理', url: '/pages/privacy/privacy', badge: '' }
        ]
      }
    ]
  },

  onLoad: function() {
    if (!auth.isPrivacyAgreed()) {
      this.setData({ showPrivacyPopup: true });
    }
  },

  onShow: function() {
    this.refreshUserData();
  },

  refreshUserData: function() {
    var loggedIn = auth.isLoggedIn();
    var userInfo = auth.getUserInfo();
    var favorites = userStore.getFavorites();
    var notes = userStore.getTastingNotes();
    var scanHistory = storage.getScanHistory();
    var unreadCount = userStore.getUnreadNotificationCount();

    var menuSections = this.data.menuSections;
    for (var s = 0; s < menuSections.length; s++) {
      for (var i = 0; i < menuSections[s].items.length; i++) {
        if (menuSections[s].items[i].key === 'notifications') {
          menuSections[s].items[i].badge = unreadCount > 0 ? String(unreadCount) : '';
        }
        if (menuSections[s].items[i].key === 'favorites') {
          menuSections[s].items[i].badge = favorites.length > 0 ? String(favorites.length) : '';
        }
      }
    }

    this.setData({
      isLoggedIn: loggedIn,
      userInfo: userInfo,
      favoriteCount: favorites.length,
      noteCount: notes.length,
      scanCount: scanHistory.length,
      unreadCount: unreadCount,
      menuSections: menuSections
    });
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
