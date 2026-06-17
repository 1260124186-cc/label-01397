var userStore = require('../../utils/userStore.js');
var storage = require('../../utils/storage.js');
var subscription = require('../../utils/subscription.js');

var TYPE_ICONS = {
  system: '📢',
  trace: '🔍',
  recall: '⚠️',
  activity: '🎉',
  privacy: '🛡️',
  newBatch: '📦',
  reportUpdate: '🔬',
  promotion: '🎊'
};

var TYPE_COLORS = {
  system: '#1890FF',
  trace: '#2E8B57',
  recall: '#FF4D4F',
  activity: '#DAA520',
  privacy: '#722ED1',
  newBatch: '#2E8B57',
  reportUpdate: '#1890FF',
  promotion: '#DAA520'
};

Page({
  data: {
    notifications: [],
    isEmpty: true,
    unreadCount: 0,
    subEnabled: false
  },

  onShow: function() {
    this.loadNotifications();
    this.checkSubscriptionStatus();
  },

  checkSubscriptionStatus: function() {
    var sub = subscription.getSubscriptions();
    this.setData({ subEnabled: sub.enabled });
  },

  goToSubscription: function() {
    wx.navigateTo({ url: '/pages/subscription/subscription' });
  },

  loadNotifications: function() {
    var list = userStore.getNotifications();
    if (list.length === 0) {
      list = userStore.initMockNotifications();
    }
    var formatted = list.map(function(item) {
      return Object.assign({}, item, {
        formatTime: storage.formatTime(item.createTime),
        icon: TYPE_ICONS[item.type] || '📢',
        typeColor: TYPE_COLORS[item.type] || '#1890FF'
      });
    });
    var unreadCount = userStore.getUnreadNotificationCount();
    this.setData({
      notifications: formatted,
      isEmpty: formatted.length === 0,
      unreadCount: unreadCount
    });
  },

  onNotificationTap: function(e) {
    var notifId = e.currentTarget.dataset.id;
    var isRead = e.currentTarget.dataset.isread;
    var extra = e.currentTarget.dataset.extra;

    if (!isRead) {
      userStore.markNotificationRead(notifId);
      this.loadNotifications();
    }

    if (extra) {
      if (extra.traceId) {
        wx.navigateTo({ url: '/pages/detail/detail?traceId=' + extra.traceId });
      } else if (extra.url) {
        wx.navigateTo({ url: extra.url });
      }
    }
  },

  onMarkAllRead: function() {
    if (this.data.unreadCount === 0) return;
    userStore.markAllNotificationsRead();
    this.loadNotifications();
    wx.showToast({ title: '已全部标记已读', icon: 'success', duration: 1500 });
  },

  onClearAll: function() {
    if (this.data.isEmpty) return;
    var that = this;
    wx.showModal({
      title: '清空通知',
      content: '确定清空所有通知吗？',
      confirmColor: '#ff4d4f',
      success: function(res) {
        if (res.confirm) {
          userStore.clearNotifications();
          that.loadNotifications();
          wx.showToast({ title: '已清空', icon: 'success', duration: 1500 });
        }
      }
    });
  }
});
