/**
 * 桂花茶溯源小程序 - 扫码结果确认页
 * 功能：扫码后展示产品缩略信息，用户确认后进入详情页
 * 页面路径：pages/scanResult/scanResult
 */

const mockData = require('../../utils/mockData.js');

Page({
  data: {
    traceId: '',
    productInfo: null,
    loading: true,
    scanType: ''
  },

  onLoad: function(options) {
    console.log('扫码结果页加载，参数：', options);
    
    const traceId = options.traceId;
    const scanType = options.scanType || 'qrCode';
    
    if (traceId) {
      this.setData({ 
        traceId: traceId,
        scanType: scanType
      });
      this.loadProductInfo(traceId);
    } else {
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  loadProductInfo: function(traceId) {
    const that = this;
    
    wx.showLoading({
      title: '加载产品信息...',
      mask: true
    });
    
    setTimeout(() => {
      wx.hideLoading();
      
      const data = mockData.getTraceData(traceId);
      
      if (data) {
        that.setData({
          productInfo: data.basicInfo,
          loading: false
        });
      } else {
        wx.showToast({
          title: '未找到产品信息',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    }, 500);
  },

  confirmToDetail: function() {
    const traceId = this.data.traceId;
    
    wx.navigateTo({
      url: `/pages/detail/detail?traceId=${traceId}`,
      success: function() {
        console.log('跳转详情页成功');
      },
      fail: function(err) {
        console.error('跳转失败：', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  cancelAndBack: function() {
    wx.navigateBack();
  },

  rescan: function() {
    wx.navigateBack({
      delta: 1
    });
  }
});
