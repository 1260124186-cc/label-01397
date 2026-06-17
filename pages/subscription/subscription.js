var subscription = require('../../utils/subscription.js');
var userStore = require('../../utils/userStore.js');

Page({
  data: {
    enabled: true,
    messageTypes: [],
    varieties: [],
    regions: [],
    batchSubscriptions: [],
    batchCount: 0,
    hasBatchSubscriptions: false
  },

  onLoad: function() {
    this.loadSubscriptionData();
  },

  onShow: function() {
    this.loadSubscriptionData();
  },

  loadSubscriptionData: function() {
    var sub = subscription.getSubscriptions();
    var batchSubs = subscription.getBatchSubscriptions();

    var messageTypes = [];
    var typeKeys = Object.keys(subscription.MESSAGE_TYPES);
    for (var i = 0; i < typeKeys.length; i++) {
      var mt = subscription.MESSAGE_TYPES[typeKeys[i]];
      messageTypes.push({
        key: mt.key,
        label: mt.label,
        icon: mt.icon,
        color: mt.color,
        checked: sub.messageTypes[mt.key]
      });
    }

    var varieties = [];
    for (var j = 0; j < subscription.VARIETIES.length; j++) {
      var v = subscription.VARIETIES[j];
      varieties.push({
        key: v.key,
        name: v.name,
        icon: v.icon,
        color: v.color,
        checked: sub.varieties[v.key]
      });
    }

    var regions = [];
    for (var k = 0; k < subscription.REGIONS.length; k++) {
      var r = subscription.REGIONS[k];
      regions.push({
        key: r.key,
        name: r.name,
        icon: r.icon,
        checked: sub.regions[r.key]
      });
    }

    this.setData({
      enabled: sub.enabled,
      messageTypes: messageTypes,
      varieties: varieties,
      regions: regions,
      batchSubscriptions: batchSubs,
      batchCount: batchSubs.length,
      hasBatchSubscriptions: batchSubs.length > 0
    });
  },

  onToggleEnabled: function() {
    var result = subscription.toggleSubscriptionEnabled();
    this.setData({ enabled: result.enabled });
    var msg = result.enabled ? '已开启消息订阅' : '已关闭消息订阅';
    wx.showToast({ title: msg, icon: 'none', duration: 1500 });
  },

  onToggleMessageType: function(e) {
    var key = e.currentTarget.dataset.key;
    var result = subscription.toggleMessageType(key);
    var messageTypes = this.data.messageTypes;
    for (var i = 0; i < messageTypes.length; i++) {
      if (messageTypes[i].key === key) {
        messageTypes[i].checked = result.messageTypes[key];
        break;
      }
    }
    this.setData({ messageTypes: messageTypes });
  },

  onToggleVariety: function(e) {
    var key = e.currentTarget.dataset.key;
    var result = subscription.toggleVariety(key);
    var varieties = this.data.varieties;
    for (var i = 0; i < varieties.length; i++) {
      if (varieties[i].key === key) {
        varieties[i].checked = result.varieties[key];
        break;
      }
    }
    this.setData({ varieties: varieties });
  },

  onToggleRegion: function(e) {
    var key = e.currentTarget.dataset.key;
    var result = subscription.toggleRegion(key);
    var regions = this.data.regions;
    for (var i = 0; i < regions.length; i++) {
      if (regions[i].key === key) {
        regions[i].checked = result.regions[key];
        break;
      }
    }
    this.setData({ regions: regions });
  },

  onViewBatchDetail: function(e) {
    var traceId = e.currentTarget.dataset.traceid;
    if (traceId) {
      wx.navigateTo({ url: '/pages/detail/detail?traceId=' + traceId });
    }
  },

  onUnsubscribeBatch: function(e) {
    var batchNo = e.currentTarget.dataset.batchno;
    var that = this;
    wx.showModal({
      title: '取消订阅',
      content: '确定取消订阅批次 ' + batchNo + ' 的动态吗？',
      confirmColor: '#ff4d4f',
      success: function(res) {
        if (res.confirm) {
          subscription.unsubscribeBatch(batchNo);
          that.loadSubscriptionData();
          wx.showToast({ title: '已取消订阅', icon: 'success', duration: 1500 });
        }
      }
    });
  },

  onClearAllBatchSubscriptions: function() {
    var that = this;
    wx.showModal({
      title: '清空批次订阅',
      content: '确定清空所有批次订阅吗？',
      confirmColor: '#ff4d4f',
      success: function(res) {
        if (res.confirm) {
          subscription.clearBatchSubscriptions();
          that.loadSubscriptionData();
          wx.showToast({ title: '已清空', icon: 'success', duration: 1500 });
        }
      }
    });
  },

  onTestNotification: function() {
    var mockNotifs = subscription.generateMockSubscriptionNotifications();
    if (mockNotifs.length === 0) {
      wx.showToast({ title: '当前无匹配的订阅通知', icon: 'none', duration: 2000 });
      return;
    }

    for (var i = 0; i < mockNotifs.length; i++) {
      userStore.addNotification(mockNotifs[i]);
    }

    wx.showToast({ title: '已推送' + mockNotifs.length + '条订阅通知', icon: 'success', duration: 1500 });

    setTimeout(function() {
      wx.navigateTo({ url: '/pages/notifications/notifications' });
    }, 1500);
  }
});
