var shop = require('../../../utils/shop.js');
var mockData = require('../../../utils/mockData.js');

Page({
  data: {
    orderNo: '',
    traceCode: '',
    traceResult: null,
    loading: false,
    verifying: false,
    verified: false,
    order: null,
    product: null,
    batchInfo: null,
    itemSpecText: ''
  },

  onLoad: function(options) {
    if (options.orderNo) {
      this.setData({ orderNo: options.orderNo });
      this.verifyTrace();
    }
  },

  onOrderNoInput: function(e) {
    this.setData({ orderNo: e.detail.value });
  },

  onTraceCodeInput: function(e) {
    this.setData({ traceCode: e.detail.value });
  },

  onScanCode: function() {
    var that = this;
    
    wx.scanCode({
      success: function(res) {
        var code = res.result;
        that.setData({ traceCode: code });
        wx.showToast({ title: '扫码成功', icon: 'success' });
      },
      fail: function() {
        wx.showToast({ title: '扫码失败', icon: 'none' });
      }
    });
  },

  onVerify: function() {
    if (!this.data.orderNo) {
      wx.showToast({ title: '请输入订单号', icon: 'none' });
      return;
    }
    
    if (!this.data.traceCode) {
      wx.showToast({ title: '请输入溯源码', icon: 'none' });
      return;
    }

    this.verifyTrace();
  },

  verifyTrace: function() {
    var that = this;
    
    this.setData({ verifying: true, loading: true });

    setTimeout(function() {
      var result = shop.verifyOrderTrace(that.data.orderNo, that.data.traceCode);
      
      if (result.valid) {
        var order = mockData.getOrderByNo(that.data.orderNo);
        var firstItem = order && order.items.length > 0 ? order.items[0] : null;
        var product = firstItem ? mockData.getShopProduct(firstItem.traceId) : null;

        var itemSpecText = '';
        if (firstItem && firstItem.specValues && Array.isArray(firstItem.specValues)) {
          itemSpecText = firstItem.specValues.join(' / ');
        }

        var batchInfo = that.generateBatchInfo(firstItem ? firstItem.traceId : '');

        that.setData({
          verified: true,
          traceResult: result,
          order: order,
          product: product,
          batchInfo: batchInfo,
          itemSpecText: itemSpecText,
          loading: false,
          verifying: false
        });
      } else {
        wx.showToast({
          title: result.msg || '验证失败',
          icon: 'none',
          duration: 2000
        });
        that.setData({
          verified: false,
          traceResult: result,
          loading: false,
          verifying: false
        });
      }
    }, 1500);
  },

  generateBatchInfo: function(traceId) {
    var batchNo = 'B' + Date.now().toString().slice(-8);
    var today = new Date();
    var produceDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    var expireDate = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000);
    
    var formatDate = function(d) {
      return d.getFullYear() + '-' + 
        String(d.getMonth() + 1).padStart(2, '0') + '-' + 
        String(d.getDate()).padStart(2, '0');
    };

    return {
      batchNo: batchNo,
      produceDate: formatDate(produceDate),
      expireDate: formatDate(expireDate),
      origin: '湖北省A市桂花镇桂花村',
      supplier: '一茶一品桂花种植专业合作社',
      qualityGrade: '特级',
      netWeight: '100g/罐',
      storageMethod: '阴凉干燥处密封保存',
      productionStandard: 'GB/T 18650-2008',
      inspector: '李质量',
      qrCodeUrl: ''
    };
  },

  goToProduct: function() {
    if (this.data.order && this.data.order.items.length > 0) {
      var traceId = this.data.order.items[0].traceId;
      wx.navigateTo({
        url: '/pages/shop/detail?traceId=' + traceId
      });
    }
  },

  goToTrace: function() {
    if (this.data.order && this.data.order.items.length > 0) {
      var traceId = this.data.order.items[0].traceId;
      wx.navigateTo({
        url: '/pages/detail/detail?traceId=' + traceId
      });
    }
  },

  onBuyAgain: function() {
    if (this.data.order && this.data.order.items.length > 0) {
      var traceId = this.data.order.items[0].traceId;
      wx.navigateTo({
        url: '/pages/shop/detail?traceId=' + traceId + '&buyNow=1'
      });
    }
  },

  onShareAppMessage: function() {
    return {
      title: '订单溯源验证 - 一茶一品',
      path: '/pages/shop/orderTrace'
    };
  }
});
