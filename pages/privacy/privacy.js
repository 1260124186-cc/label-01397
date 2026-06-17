var userStore = require('../../utils/userStore.js');
var auth = require('../../utils/auth.js');
var storage = require('../../utils/storage.js');

Page({
  data: {
    settings: {},
    storageInfo: null,
    showClearConfirm: false
  },

  onShow: function() {
    this.loadSettings();
    this.loadStorageInfo();
  },

  loadSettings: function() {
    var settings = userStore.getPrivacySettings();
    this.setData({ settings: settings });
  },

  loadStorageInfo: function() {
    try {
      var res = wx.getStorageInfoSync();
      this.setData({
        storageInfo: {
          keys: res.keys.length,
          currentSize: res.currentSize,
          limitSize: res.limitSize
        }
      });
    } catch (e) {
      console.error('[Privacy] 获取存储信息失败:', e);
    }
  },

  onToggleCollection: function() {
    var current = this.data.settings.allowCollection;
    var next = !current;
    if (next) {
      wx.showModal({
        title: '开启数据收集',
        content: '开启后将收集必要的扫码记录以提供查询历史服务。我们不会上传您的数据至服务器，所有信息仅存储在本地。',
        confirmColor: '#2E8B57',
        success: function(res) {
          if (res.confirm) {
            userStore.updatePrivacySettings({ allowCollection: next });
            this.loadSettings();
          }
        }.bind(this)
      });
    } else {
      userStore.updatePrivacySettings({ allowCollection: next });
      this.loadSettings();
    }
  },

  onToggleLocation: function() {
    var current = this.data.settings.allowLocation;
    var next = !current;
    if (next) {
      wx.authorize({
        scope: 'scope.userLocation',
        success: function() {
          userStore.updatePrivacySettings({ allowLocation: next });
          this.loadSettings();
        }.bind(this),
        fail: function() {
          wx.showModal({
            title: '位置权限',
            content: '请在系统设置中开启位置权限，用于产地地图导航功能',
            confirmText: '去设置',
            confirmColor: '#2E8B57',
            success: function(res) {
              if (res.confirm) {
                wx.openSetting();
              }
            }
          });
        }
      });
    } else {
      userStore.updatePrivacySettings({ allowLocation: next });
      this.loadSettings();
    }
  },

  onToggleNotification: function() {
    var current = this.data.settings.allowNotification;
    var next = !current;
    userStore.updatePrivacySettings({ allowNotification: next });
    this.loadSettings();
  },

  onTogglePhotoSave: function() {
    var current = this.data.settings.allowPhotoSave;
    var next = !current;
    userStore.updatePrivacySettings({ allowPhotoSave: next });
    this.loadSettings();
  },

  onRetentionChange: function(e) {
    var days = parseInt(e.currentTarget.dataset.days);
    userStore.updatePrivacySettings({ dataRetentionDays: days });
    this.loadSettings();
  },

  onClearScanHistory: function() {
    wx.showModal({
      title: '清除查询历史',
      content: '确定清除所有扫码查询历史吗？此操作不可恢复。',
      confirmColor: '#ff4d4f',
      success: function(res) {
        if (res.confirm) {
          storage.clearScanHistory();
          wx.showToast({ title: '已清除', icon: 'success', duration: 1500 });
        }
      }
    });
  },

  onClearFavorites: function() {
    wx.showModal({
      title: '清除收藏',
      content: '确定清除所有收藏产品吗？此操作不可恢复。',
      confirmColor: '#ff4d4f',
      success: function(res) {
        if (res.confirm) {
          userStore.clearFavorites();
          wx.showToast({ title: '已清除', icon: 'success', duration: 1500 });
        }
      }
    });
  },

  onClearNotes: function() {
    var that = this;
    wx.showModal({
      title: '清除品鉴笔记',
      content: '确定清除所有品鉴笔记吗？此操作不可恢复。',
      confirmColor: '#ff4d4f',
      success: function(res) {
        if (res.confirm) {
          try {
            wx.setStorageSync('user_tasting_notes', []);
            wx.showToast({ title: '已清除', icon: 'success', duration: 1500 });
            that.loadStorageInfo();
          } catch (e) {
            console.error('[Privacy] 清除笔记失败:', e);
          }
        }
      }
    });
  },

  onClearAllData: function() {
    wx.showModal({
      title: '清除所有数据',
      content: '此操作将清除查询历史、收藏、品鉴笔记、通知和隐私设置，不可恢复。确定继续吗？',
      confirmColor: '#ff4d4f',
      success: function(res) {
        if (res.confirm) {
          storage.clearScanHistory();
          userStore.clearFavorites();
          try { wx.setStorageSync('user_tasting_notes', []); } catch(e) {}
          userStore.clearNotifications();
          userStore.resetPrivacySettings();
          this.loadSettings();
          this.loadStorageInfo();
          wx.showToast({ title: '已清除所有数据', icon: 'success', duration: 1500 });
        }
      }.bind(this)
    });
  },

  onViewPrivacyPolicy: function() {
    wx.navigateTo({
      url: '/pages/webview/webview?url=' + encodeURIComponent('https://example.com/privacy') + '&title=隐私保护政策'
    });
  },

  onResetSettings: function() {
    wx.showModal({
      title: '重置设置',
      content: '确定重置隐私设置为默认值吗？',
      confirmColor: '#2E8B57',
      success: function(res) {
        if (res.confirm) {
          userStore.resetPrivacySettings();
          this.loadSettings();
          wx.showToast({ title: '已重置', icon: 'success', duration: 1500 });
        }
      }.bind(this)
    });
  }
});
