var userStore = require('../../utils/userStore.js');
var storage = require('../../utils/storage.js');

Page({
  data: {
    favorites: [],
    isEmpty: true
  },

  onShow: function() {
    this.loadFavorites();
  },

  loadFavorites: function() {
    var list = userStore.getFavorites();
    var formatted = list.map(function(item) {
      return Object.assign({}, item, {
        formatTime: storage.formatTime(item.addTime)
      });
    });
    this.setData({
      favorites: formatted,
      isEmpty: formatted.length === 0
    });
  },

  onItemTap: function(e) {
    var traceId = e.currentTarget.dataset.traceid;
    if (!traceId) return;
    wx.navigateTo({
      url: '/pages/detail/detail?traceId=' + traceId
    });
  },

  onRemoveFavorite: function(e) {
    var traceId = e.currentTarget.dataset.traceid;
    var that = this;
    wx.showModal({
      title: '取消收藏',
      content: '确定取消收藏该产品吗？',
      confirmColor: '#ff4d4f',
      success: function(res) {
        if (res.confirm) {
          userStore.removeFavorite(traceId);
          that.loadFavorites();
          wx.showToast({ title: '已取消收藏', icon: 'success', duration: 1500 });
        }
      }
    });
  },

  onClearAll: function() {
    if (this.data.isEmpty) return;
    var that = this;
    wx.showModal({
      title: '清空收藏',
      content: '确定清空所有收藏产品吗？此操作不可恢复。',
      confirmColor: '#ff4d4f',
      success: function(res) {
        if (res.confirm) {
          userStore.clearFavorites();
          that.loadFavorites();
          wx.showToast({ title: '已清空', icon: 'success', duration: 1500 });
        }
      }
    });
  },

  onGoScan: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});
