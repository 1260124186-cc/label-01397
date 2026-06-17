var mockData = require('../../utils/mockData.js');

Page({
  data: {
    traceId: '',
    batchNo: '',
    productName: '',
    timelineData: null,
    timelineMode: 'vertical',
    showAbnormalOnly: false,
    loading: true,
    availableProducts: [],
    showProductSelector: false,
    selectedProductIndex: 0,
    stats: {
      totalNodes: 0,
      abnormalNodes: 0,
      onChainNodes: 0,
      completionRate: 0
    }
  },

  onLoad: function(options) {
    var traceId = options.traceId || 'G001';
    this.loadAvailableProducts();
    this.loadTimelineData(traceId);
  },

  loadAvailableProducts: function() {
    var allTimeline = mockData.getAllSupplyChainTimeline();
    var products = [];
    for (var key in allTimeline) {
      if (allTimeline.hasOwnProperty(key)) {
        products.push({
          traceId: allTimeline[key].traceId,
          productName: allTimeline[key].productName,
          batchNo: allTimeline[key].batchNo
        });
      }
    }
    this.setData({ availableProducts: products });
  },

  loadTimelineData: function(traceId) {
    var that = this;
    this.setData({ loading: true });
    
    setTimeout(function() {
      var timelineData = mockData.getSupplyChainTimeline(traceId);
      
      if (!timelineData) {
        wx.showToast({
          title: '暂无供应链数据',
          icon: 'none',
          duration: 2000
        });
        that.setData({ loading: false });
        return;
      }
      
      var stats = that.calculateStats(timelineData.timeline);
      var selectedIndex = 0;
      for (var i = 0; i < that.data.availableProducts.length; i++) {
        if (that.data.availableProducts[i].traceId === traceId) {
          selectedIndex = i;
          break;
        }
      }
      
      that.setData({
        traceId: timelineData.traceId,
        batchNo: timelineData.batchNo,
        productName: timelineData.productName,
        timelineData: timelineData,
        stats: stats,
        selectedProductIndex: selectedIndex,
        loading: false
      });
    }, 600);
  },

  calculateStats: function(timeline) {
    if (!timeline || timeline.length === 0) {
      return {
        totalNodes: 0,
        abnormalNodes: 0,
        onChainNodes: 0,
        completionRate: 0
      };
    }
    
    var totalNodes = timeline.length;
    var abnormalNodes = 0;
    var onChainNodes = 0;
    var completedNodes = 0;
    
    for (var i = 0; i < timeline.length; i++) {
      var node = timeline[i];
      if (node.isAbnormal) abnormalNodes++;
      if (node.onChain) onChainNodes++;
      if (node.type === 'signoff' || i < timeline.length - 1) {
        completedNodes++;
      }
    }
    
    var completionRate = Math.round((completedNodes / totalNodes) * 100);
    
    return {
      totalNodes: totalNodes,
      abnormalNodes: abnormalNodes,
      onChainNodes: onChainNodes,
      completionRate: completionRate
    };
  },

  switchMode: function(e) {
    var mode = e.currentTarget.dataset.mode;
    this.setData({ timelineMode: mode });
  },

  toggleAbnormalFilter: function() {
    this.setData({ showAbnormalOnly: !this.data.showAbnormalOnly });
  },

  openProductSelector: function() {
    this.setData({ showProductSelector: true });
  },

  closeProductSelector: function() {
    this.setData({ showProductSelector: false });
  },

  selectProduct: function(e) {
    var index = e.currentTarget.dataset.index;
    var product = this.data.availableProducts[index];
    if (product) {
      this.setData({
        showProductSelector: false,
        selectedProductIndex: index
      });
      this.loadTimelineData(product.traceId);
    }
  },

  preventBubble: function() {},

  onShareAppMessage: function() {
    return {
      title: this.data.productName + ' - 全链路供应链溯源',
      path: '/pages/supplyChainTimeline/supplyChainTimeline?traceId=' + this.data.traceId
    };
  },

  onShareTimeline: function() {
    return {
      title: this.data.productName + ' - 全链路供应链时间轴'
    };
  }
});
